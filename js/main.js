import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { DURATION, COLORS, LEGEND, CABLES, CAM, CHAPTERS, YEARS, OVERLAYS, EVENTS, VO } from './data.js';
import { Score } from './audio.js';

const $ = id => document.getElementById(id);
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const easeS = x => -(Math.cos(Math.PI * x) - 1) / 2;
const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// ---------------------------------------------------------------- renderer
const canvas = $('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.01, 200);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.05, 0.55, 0.3);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------------------------------------------------------------- helpers
function ll2v(lat, lon, r = 1) {
  const phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}
function glowTex(inner = 'rgba(255,255,255,1)') {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, inner); gr.addColorStop(.25, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); return t;
}
function ringTex() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); g.strokeStyle = '#fff'; g.lineWidth = 6;
  g.beginPath(); g.arc(64, 64, 56, 0, Math.PI * 2); g.stroke();
  return new THREE.CanvasTexture(c);
}
const GLOW = glowTex(), RING = ringTex();

// ---------------------------------------------------------------- stars
{
  const n = 4000, p = new Float32Array(n * 3), col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(60 + Math.random() * 40);
    p.set([v.x, v.y, v.z], i * 3);
    const w = .5 + Math.random() * .5; col.set([w * .8, w * .9, w], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: .18, map: GLOW, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
}

// ---------------------------------------------------------------- globe
const loader = new THREE.TextureLoader();
const tDay = loader.load('textures/earth_day.jpg'), tNight = loader.load('textures/earth_lights.png'), tSpec = loader.load('textures/earth_specular.jpg');
tDay.colorSpace = THREE.SRGBColorSpace; tNight.colorSpace = THREE.SRGBColorSpace;
[tDay, tNight, tSpec].forEach(t => t.anisotropy = 8);
const sunDir = new THREE.Vector3(1, .4, 1).normalize();
const globeMat = new THREE.ShaderMaterial({
  uniforms: { day: { value: tDay }, night: { value: tNight }, spec: { value: tSpec }, sun: { value: sunDir }, dim: { value: 1 }, time: { value: 0 } },
  vertexShader: `
    varying vec2 vUv; varying vec3 vN; varying vec3 vP;
    void main(){ vUv=uv; vN=normalize(mat3(modelMatrix)*normal); vec4 wp=modelMatrix*vec4(position,1.); vP=wp.xyz; gl_Position=projectionMatrix*viewMatrix*wp; }`,
  fragmentShader: `
    uniform sampler2D day, night, spec; uniform vec3 sun; uniform float dim, time;
    varying vec2 vUv; varying vec3 vN; varying vec3 vP;
    void main(){
      vec3 N=normalize(vN); vec3 V=normalize(cameraPosition-vP);
      float L=dot(N,sun);
      vec3 d=texture2D(day,vUv).rgb; float s=texture2D(spec,vUv).r; vec3 nl=texture2D(night,vUv).rgb;
      float lum=dot(d,vec3(.3,.59,.11));
      vec3 land=mix(vec3(lum)*vec3(.55,.68,.8),d,.35)*.55;
      vec3 ocean=vec3(.008,.035,.075)+vec3(0.,.05,.09)*pow(1.-s*.0,1.);
      vec3 dayC=mix(land,ocean,s*.92);
      float df=smoothstep(-.2,.35,L);
      vec3 nightC=nl*vec3(1.,.72,.38)*1.6 + ocean*.35;
      vec3 c=mix(nightC,dayC,df);
      vec3 R=reflect(-sun,N); c+=vec3(.35,.55,.7)*pow(max(dot(R,V),0.),40.)*s*df*.6;
      // graticule
      vec2 g=abs(fract(vUv*vec2(36.,18.))-.5); float line=smoothstep(.49,.5,max(g.x,g.y));
      c+=vec3(.1,.4,.6)*line*.12;
      float fr=pow(1.-max(dot(N,V),0.),3.); c+=vec3(.2,.7,1.)*fr*.55;
      gl_FragColor=vec4(c*dim,1.);
    }`
});
const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), globeMat);
scene.add(globe);
const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.09, 96, 64), new THREE.ShaderMaterial({
  side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { k: { value: 1 } },
  vertexShader: `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform float k; varying vec3 vN; void main(){ float i=pow(.72-dot(vN,vec3(0.,0.,1.)),4.); gl_FragColor=vec4(vec3(.25,.75,1.)*i*1.4*k,1.); }`
}));
scene.add(atmo);

// ---------------------------------------------------------------- cables
const cableGroup = new THREE.Group(); scene.add(cableGroup);
const RADIAL = 6;
function densify(pts, off = 0) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = ll2v(pts[i][0] + off * .35, pts[i][1] + off * .2), b = ll2v(pts[i + 1][0] + off * .35, pts[i + 1][1] + off * .2);
    const ang = a.angleTo(b), n = Math.max(1, Math.ceil(ang / (Math.PI / 180) * 1.2));
    for (let k = 0; k < n; k++) {
      const u = k / n, s = Math.sin(ang);
      const v = s < 1e-6 ? a.clone() : a.clone().multiplyScalar(Math.sin((1 - u) * ang) / s).add(b.clone().multiplyScalar(Math.sin(u * ang) / s));
      out.push(v.normalize().multiplyScalar(1.004));
    }
  }
  const l = pts[pts.length - 1]; out.push(ll2v(l[0] + off * .35, l[1] + off * .2, 1.004));
  return out;
}
const cables = CABLES.map(c => {
  const color = new THREE.Color(COLORS[c.g]);
  const isBg = c.id.startsWith('bg');
  const segs = c.segs.map(pts => {
    const dense = densify(pts, c.off || 0);
    const curve = new THREE.CatmullRomCurve3(dense, false, 'centripetal');
    const tub = Math.min(2400, dense.length * 3);
    const geo = new THREE.TubeGeometry(curve, tub, isBg ? .0018 : .0026, RADIAL, false);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat); mesh.visible = false; cableGroup.add(mesh);
    // pulses
    const NP = isBg ? 2 : 4, pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NP * 3), 3));
    const pts3 = new THREE.Points(pg, new THREE.PointsMaterial({ color: color.clone().lerp(new THREE.Color('#fff'), .6), size: isBg ? .022 : .04, map: GLOW, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    pts3.visible = false; cableGroup.add(pts3);
    return { curve, geo, mat, mesh, tub, pts3, NP, len: curve.getLength() };
  });
  const head = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: color.clone().lerp(new THREE.Color('#fff'), .5), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  head.scale.setScalar(.09); head.visible = false; scene.add(head);
  // landing dots
  const ends = [];
  c.segs.forEach(pts => [pts[0], pts[pts.length - 1]].forEach(p => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.position.copy(ll2v(p[0], p[1], 1.006)); s.scale.setScalar(isBg ? .025 : .045); s.visible = false; scene.add(s); ends.push(s);
  }));
  const s0 = c.segs[0];
  return { ...c, color, isBg, segMeshes: segs, head, ends, labPts: [ll2v(...s0[0], 1.006), ll2v(...s0[s0.length - 1], 1.006)] };
});

// ---------------------------------------------------------------- event markers
const markers = EVENTS.map(e => {
  const pos = ll2v(e.ll[0], e.ll[1], 1.008);
  const ring = new THREE.Sprite(new THREE.SpriteMaterial({ map: RING, color: new THREE.Color(e.c), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  ring.position.copy(pos); ring.visible = false; scene.add(ring);
  const dot = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: new THREE.Color(e.c), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  dot.position.copy(pos); dot.scale.setScalar(.06); dot.visible = false; scene.add(dot);
  return { ...e, pos, ring, dot };
});

// ---------------------------------------------------------------- HTML labels
const labelsEl = $('labels');
const labelPool = [];
function getLabel(i) {
  if (!labelPool[i]) { const d = document.createElement('div'); d.className = 'lab'; labelsEl.appendChild(d); labelPool[i] = d; }
  return labelPool[i];
}
const tmpV = new THREE.Vector3();
function placeLabel(i, pos, text, color, alpha = 1) {
  const el = getLabel(i);
  tmpV.copy(pos).project(camera);
  const facing = pos.clone().normalize().dot(camera.position.clone().sub(pos)) > 0;
  if (!facing || tmpV.z > 1) { el.style.opacity = 0; return; }
  el.style.left = (tmpV.x * .5 + .5) * innerWidth + 'px';
  el.style.top = (-tmpV.y * .5 + .5) * innerHeight + 'px';
  el.textContent = text; el.style.setProperty('--c', color); el.style.opacity = alpha;
}

// ---------------------------------------------------------------- legend
const legend = document.createElement('div');
legend.style.cssText = 'position:absolute;left:44px;top:80px;font:600 10px JetBrains Mono,monospace;letter-spacing:.12em;opacity:0;transition:opacity .8s;line-height:2';
legend.innerHTML = LEGEND.map(([k, n]) => `<div><span style="display:inline-block;width:18px;height:3px;background:${COLORS[k]};box-shadow:0 0 8px ${COLORS[k]};vertical-align:middle;margin-right:8px"></span>${n.toUpperCase()}</div>`).join('');
$('hud').appendChild(legend);

// ---------------------------------------------------------------- timeline state
let T = 0, playing = false, lastT = -1, voOn = true;
const score = new Score();
const titleEl = $('title'), kickerEl = $('kicker'), chapEl = $('chapter'), yearEl = $('year'), card = $('card'), subs = $('subs');
let curTitleKey = '', curCardId = '', curVO = -1;
let viewShift = 0;

function renderTitle(str) {
  titleEl.innerHTML = str.split(' ').map(w => {
    const em = w.startsWith('*');
    const clean = w.replace(/\*/g, '');
    return `<span class="w"><span>${em ? `<em>${clean}</em>` : clean}</span></span>`;
  }).join('');
  titleEl.querySelectorAll('.w>span').forEach((s, i) => s.style.transitionDelay = (i * .08) + 's');
}

// ---------------------------------------------------------------- voice
let voice = null;
function pickVoice() {
  const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
  const pref = ['Google UK English Male', 'Daniel', 'Microsoft Ryan', 'Microsoft Guy', 'Microsoft Christopher', 'Arthur', 'Google US English', 'Alex', 'Microsoft David'];
  for (const p of pref) { const v = vs.find(x => x.name.includes(p)); if (v) return v; }
  return vs[0] || null;
}
if ('speechSynthesis' in window) { voice = pickVoice(); speechSynthesis.onvoiceschanged = () => voice = pickVoice(); }
function speak(text) {
  if (!voOn || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice; u.lang = 'en-GB'; u.rate = 1.04; u.pitch = .88; u.volume = 1;
  u.onstart = () => score.duck(true); u.onend = () => score.duck(false);
  speechSynthesis.speak(u);
}

// ---------------------------------------------------------------- sound cues
const SFX = [
  ...CHAPTERS.map(c => ({ t: c.t, f: 'whoosh' })),
  { t: 1.5, f: 'impact' }, { t: 18.3, f: 'impact' }, { t: 55.2, f: 'impact' }, { t: 134.3, f: 'impact' },
  { t: 268.3, f: 'impact' }, { t: 294, f: 'zap' }, { t: 307, f: 'zap' }, { t: 310, f: 'zap' }, { t: 318, f: 'zap' },
  { t: 337, f: 'impact' }, { t: 346, f: 'impact' }
];
const INTENS = [[0, .2], [18, .35], [55, .6], [91, .35], [134, .72], [166, .7], [205, .75], [237, .6], [268, .85], [299, .5], [330, .9], [346, .3]];

// ---------------------------------------------------------------- camera
function camAt(t) {
  let i = 0; while (i < CAM.length - 2 && CAM[i + 1].t <= t) i++;
  const a = CAM[i], b = CAM[i + 1], u = easeS(clamp((t - a.t) / (b.t - a.t)));
  let dl = b.lon - a.lon; dl = ((dl + 540) % 360) - 180;
  return { lat: a.lat + (b.lat - a.lat) * u, lon: a.lon + dl * u, d: a.d + (b.d - a.d) * u };
}

// ---------------------------------------------------------------- update
function update(t, dt) {
  // camera
  const c = camAt(t);
  const lon = c.lon + Math.sin(t * .13) * 1.2, lat = c.lat + Math.sin(t * .09) * .8;
  camera.position.copy(ll2v(lat, lon, c.d));
  camera.lookAt(0, 0, 0);
  // sun follows camera, offset → terminator visible on the right
  const cd = camera.position.clone().normalize();
  const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), cd).normalize();
  sunDir.copy(cd).multiplyScalar(.75).add(right.multiplyScalar(-.65)).add(new THREE.Vector3(0, .3, 0)).normalize();

  // focus
  const focus = cables.find(k => k.f && t >= k.f[0] && t < k.f[1]);
  let labN = 0;

  // cold-open teaser: the whole modern network blooms in, then vanishes before 1858
  const teaser = t < 17 ? clamp((t - 2) / 4) * clamp((16.5 - t) / 2) : 0;
  cables.forEach(k => {
    const real = t >= k.t;
    const showTeaser = !real && teaser > 0 && k.g !== 'hist';
    let p = showTeaser ? ease(clamp((t - 2) / 6)) : ease(clamp((t - k.t) / k.d));
    const alive = (real && (!k.end || t < k.end)) || showTeaser;
    const fadeOut = k.end ? clamp((k.end - t) / 1.2) : 1;
    let op = alive ? (showTeaser ? teaser * .8 : fadeOut) : 0;
    if (focus && focus !== k) op *= k.isBg ? .35 : .4;
    if (!focus && k.isBg) op *= .55;
    let col = k.color;
    if (k.cut && t >= k.cut) {
      const ft = t - k.cut;
      col = ft < .5 ? (Math.floor(ft * 16) % 2 ? new THREE.Color('#fff') : new THREE.Color('#ff3b5c')) : new THREE.Color('#ff3b5c');
      op *= ft < .5 ? 1 : .28;
    }
    k.segMeshes.forEach(s => {
      s.mesh.visible = op > .01;
      s.mat.opacity = op; s.mat.color.copy(col);
      s.geo.setDrawRange(0, Math.floor(p * s.tub) * RADIAL * 6);
      // pulses
      const pulsing = op > .2 && p > .05 && !(k.cut && t >= k.cut);
      s.pts3.visible = pulsing;
      if (pulsing) {
        const arr = s.pts3.geometry.attributes.position.array, sp = .5 / Math.max(.6, s.len);
        for (let j = 0; j < s.NP; j++) {
          const u = ((t * sp + j / s.NP) % 1) * p;
          const v = s.curve.getPointAt(clamp(u, 0, 1)); arr[j * 3] = v.x; arr[j * 3 + 1] = v.y; arr[j * 3 + 2] = v.z;
        }
        s.pts3.geometry.attributes.position.needsUpdate = true;
        s.pts3.material.opacity = op;
      }
    });
    // head spark (draw on)
    const drawing = t >= k.t && p < 1 && alive;
    k.head.visible = drawing;
    if (drawing) { k.head.position.copy(k.segMeshes[0].curve.getPointAt(p)); k.head.scale.setScalar(.07 + Math.sin(t * 30) * .01); }
    k.ends.forEach((e, i) => { e.visible = op > .01 && (i % 2 === 0 || p > .98); e.material.opacity = op; });
    // labels
    if (k.lab && alive && (focus === k || (t >= k.t && t < k.t + k.d + 1.5 && !focus))) {
      const la = clamp((t - k.t) / .6);
      placeLabel(labN++, k.labPts[0], k.lab[0].toUpperCase(), COLORS[k.g], la);
      if (p > .97) placeLabel(labN++, k.labPts[1], k.lab[1].toUpperCase(), COLORS[k.g], clamp((p - .97) * 30));
    }
  });

  // markers
  markers.forEach(m => {
    const on = t >= m.t && t < m.end;
    m.ring.visible = m.dot.visible = on;
    if (on) {
      const ph = ((t - m.t) * .8) % 1;
      m.ring.scale.setScalar(.04 + ph * .22); m.ring.material.opacity = 1 - ph;
      m.dot.material.opacity = .8 + Math.sin(t * 8) * .2;
      placeLabel(labN++, m.pos, m.label, m.c, clamp((t - m.t) * 2) * clamp((m.end - t) * 2));
    }
  });
  for (let i = labN; i < labelPool.length; i++) labelPool[i].style.opacity = 0;

  // overlays
  let dim = 1;
  OVERLAYS.forEach(o => {
    const on = t >= o.a && t < o.b; $(o.id).classList.toggle('on', on);
    if (on && o.id !== 'ovCtrl') dim = .45;
  });
  globeMat.uniforms.dim.value += (dim - globeMat.uniforms.dim.value) * .06;

  // card
  if (focus && focus.f && focus.year) {
    if (curCardId !== focus.id) {
      curCardId = focus.id; card.classList.add('hide');
      setTimeout(() => {
        $('cName').textContent = focus.name; $('cYear').textContent = focus.year; $('cLen').textContent = focus.len;
        $('cRoute').textContent = focus.route; $('cOwn').textContent = focus.owners; $('cCtrl').textContent = focus.ctrl;
        card.style.borderColor = COLORS[focus.g] + '88'; $('cProg').style.background = COLORS[focus.g];
        card.querySelector('.card-tag').style.color = COLORS[focus.g];
        card.classList.remove('hide');
      }, 250);
    }
    $('cProg').style.width = clamp((t - focus.f[0]) / (focus.f[1] - focus.f[0])) * 100 + '%';
  } else if (curCardId) { curCardId = ''; card.classList.add('hide'); }

  // view shift (globe slides left when card / right-side overlay is on)
  const wantShift = innerWidth > 760 && (focus || (t >= 271 && t < 291)) ? 1 : 0;
  viewShift += (wantShift - viewShift) * .05;
  camera.setViewOffset(innerWidth, innerHeight, viewShift * innerWidth * .13, 0, innerWidth, innerHeight);

  // chapter + title
  let ch = CHAPTERS[0]; for (const x of CHAPTERS) if (t >= x.t) ch = x;
  chapEl.style.opacity = t >= 18 && t < 352 ? 1 : 0;
  $('chapNum').textContent = ch.n; $('chapName').textContent = ch.name;
  const delay = ch.delay ?? .4, hold = ch.hold ?? 3.6;
  const showT = ch.title && t >= ch.t + delay && t < ch.t + delay + hold;
  const key = ch.t + '|' + showT;
  if (key !== curTitleKey) {
    curTitleKey = key;
    if (showT) { renderTitle(ch.title); kickerEl.textContent = ch.kicker; titleEl.classList.remove('in', 'out'); void titleEl.offsetWidth; titleEl.classList.add('in'); kickerEl.classList.add('in'); }
    else { titleEl.classList.add('out'); kickerEl.classList.remove('in'); }
  }

  // year roller
  let yi = 0; for (let i = 0; i < YEARS.length; i++) if (t >= YEARS[i].t) yi = i;
  const Y = YEARS[yi];
  if (Y.y == null) yearEl.style.opacity = 0;
  else {
    const prev = YEARS[yi - 1] && YEARS[yi - 1].y != null ? YEARS[yi - 1].y : Y.y;
    const u = ease(clamp((t - Y.t) / (Y.dur ?? 1)));
    yearEl.textContent = Math.round(prev + (Y.y - prev) * u); yearEl.style.opacity = 1;
  }

  legend.style.opacity = t >= 136 && t < 330 && !(t >= 271 && t < 291) ? 1 : 0;

  // stats count-up
  if (t >= 330 && t < 337) document.querySelectorAll('.stat b').forEach((b, i) => {
    const n = +b.dataset.n, u = ease(clamp((t - 330.3 - i * .3) / 2.4));
    b.textContent = Math.round(n * u).toLocaleString('en-US') + (i === 0 || i === 1 ? '+' : '');
  });

  // subtitles
  let vi = -1; for (let i = 0; i < VO.length; i++) if (t >= VO[i].t) vi = i;
  if (vi !== curVO) {
    const natural = vi >= 0 && t - VO[vi].t < .6;
    curVO = vi; subs.textContent = vi >= 0 ? VO[vi].text : '';
    if (natural && playing) speak(VO[vi].text);
  }

  // music
  if (playing && lastT >= 0 && t - lastT < .5) SFX.forEach(s => { if (lastT < s.t && t >= s.t) score[s.f](); });
  let I = .2; for (const [a, v] of INTENS) if (t >= a) I = v;
  if (score.ready && Math.abs(score.intensity - I) > .01) score.setIntensity(I);
  lastT = t;

  // fade to black at end
  atmo.material.uniforms.k.value = 1;
  globeMat.uniforms.time.value = t;

  // controls
  $('barFill').style.width = (t / DURATION * 100) + '%';
  $('time').textContent = `${fmt(t)} / ${fmt(DURATION)}`;
}

// ---------------------------------------------------------------- loop
let prevNow = performance.now();
let capturer = null;
let isCapturing = false;

function loop(now) {
  let dt;
  if (isCapturing && capturer) {
    dt = 1 / 25; // Изменено на 25 FPS для оптимизации
    capturer.capture(renderer.domElement);
  } else {
    dt = Math.min(.1, (now - prevNow) / 1000);
    prevNow = now;
  }

  if (playing) { T += dt; if (T >= DURATION) { T = DURATION; setPlaying(false); } }
  update(T, dt);
  composer.render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ---------------------------------------------------------------- controls
function setPlaying(p) {
  playing = p; $('bPlay').textContent = p ? '❚❚' : '▶';
  if (p) { score.resume(); if ('speechSynthesis' in window) speechSynthesis.resume(); }
  else { score.pause(); if ('speechSynthesis' in window) speechSynthesis.cancel(); }
}

$('bCapStart').onclick = () => {
  try {
    if (!capturer) {
      console.log('Initializing CCapture for PNG sequence (25 FPS)...');
      capturer = new CCapture({
        format: 'png',
        framerate: 25, // Изменено на 25 FPS
        quality: 100,
        verbose: true,
        display: true
      });
    }
    isCapturing = true;
    capturer.start();
    setPlaying(true);
    console.log('Capture started! Recording frames as PNG at 25 FPS...');
  } catch (e) {
    console.error('CCapture Error:', e);
    alert('Ошибка при запуске записи. Проверьте консоль (F12)');
  }
};
$('bCapStop').onclick = () => {
  if (!capturer) return;
  try {
    isCapturing = false;
    capturer.stop();
    capturer.save();
    console.log('Capture stopped. Your browser will download a ZIP archive with PNG frames.');
  } catch (e) {
    console.error('CCapture Stop Error:', e);
  }
};

function seek(t) {
  T = clamp(t, 0, DURATION - .01); lastT = -1;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  curVO = -2; // force subtitle refresh, but speak only if near line start
  let vi = -1; for (let i = 0; i < VO.length; i++) if (T >= VO[i].t) vi = i;
  if (vi >= 0 && T - VO[vi].t < 2 && playing) { curVO = vi; subs.textContent = VO[vi].text; speak(VO[vi].text); }
}
$('bStart').onclick = () => {
  score.init(); $('start').classList.add('gone'); T = 0; setPlaying(true);
  if (document.documentElement.requestFullscreen && innerWidth > 900) document.documentElement.requestFullscreen().catch(() => {});
};
$('bPlay').onclick = () => setPlaying(!playing);
$('bar').onclick = e => { const r = e.currentTarget.getBoundingClientRect(); seek((e.clientX - r.left) / r.width * DURATION); };
$('bVoice').onclick = e => { voOn = !voOn; e.currentTarget.classList.toggle('on', voOn); if (!voOn) speechSynthesis.cancel(); };
$('bCC').onclick = e => { subs.classList.toggle('off'); e.currentTarget.classList.toggle('on', !subs.classList.contains('off')); };
$('bFS').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
$('bScript').onclick = () => $('scriptPanel').classList.toggle('hide');
$('closeScript').onclick = () => $('scriptPanel').classList.add('hide');
addEventListener('keydown', e => {
  if (e.code === 'Space') { e.preventDefault(); if (!score.ready) $('bStart').click(); else setPlaying(!playing); }
  if (e.code === 'ArrowRight') seek(T + 10);
  if (e.code === 'ArrowLeft') seek(T - 10);
});
// chapter ticks
CHAPTERS.filter((c, i, a) => a.findIndex(x => x.n === c.n) === i).forEach(c => {
  const i = document.createElement('i'); i.style.left = (c.t / DURATION * 100) + '%'; i.title = c.name; $('ticks').appendChild(i);
});
// script panel
{
  const items = [...CHAPTERS.filter((c, i, a) => a.findIndex(x => x.n === c.n) === i).map(c => ({ t: c.t, ch: `${c.n} · ${c.name}` })), ...VO.map(v => ({ t: v.t, text: v.text }))]
    .sort((a, b) => a.t - b.t || (a.ch ? -1 : 1));
  $('scriptBody').innerHTML = items.map(x => x.ch
    ? `<div class="sl ch" data-t="${x.t}">${x.ch}</div>`
    : `<div class="sl" data-t="${x.t}"><b>${fmt(x.t)}</b><span>${x.text}</span></div>`).join('');
  $('scriptBody').onclick = e => { const el = e.target.closest('.sl'); if (el) { if (!score.ready) $('bStart').click(); seek(+el.dataset.t); } };
}
// idle UI
let idleT; addEventListener('mousemove', () => { document.body.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => document.body.classList.add('idle'), 2500); });
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight);
});
// deep-link: ?t=120
const qp = new URLSearchParams(location.search);
const startAt = qp.has('t') ? +qp.get('t') : window.PREVIEW_T;
if (startAt != null) { T = startAt; if (qp.has('preview') || window.PREVIEW_T != null) $('start').classList.add('gone'); }
