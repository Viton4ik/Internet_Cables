// Generative soundtrack (Web Audio) — pad, pulse, arps, impacts, whooshes.
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
// Am – F – C – G  /  Dm – Am – E
const CHORDS = [[45,52,57,60,64],[41,48,57,60,65],[48,55,60,64,67],[43,50,59,62,67],[38,50,57,62,65],[45,52,57,60,64],[40,52,56,59,64]];

export class Score {
  constructor() { this.ready = false; this.intensity = 0.2; this.step = 0; this.chord = 0; }
  init() {
    if (this.ready) return;
    const ctx = this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = ctx.createGain(); this.master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4;
    this.master.connect(comp).connect(ctx.destination);
    this.bus = ctx.createGain(); this.bus.gain.value = 0.55; this.bus.connect(this.master);
    // reverb
    const len = ctx.sampleRate * 3.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    this.verb = ctx.createConvolver(); this.verb.buffer = ir;
    this.verbIn = ctx.createGain(); this.verbIn.gain.value = 0.5;
    this.verbIn.connect(this.verb).connect(this.bus);
    // noise buffer
    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = this.noise.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    // pad
    this.padF = ctx.createBiquadFilter(); this.padF.type = 'lowpass'; this.padF.frequency.value = 600; this.padF.Q.value = 2;
    const lfo = ctx.createOscillator(), lfoG = ctx.createGain(); lfo.frequency.value = 0.06; lfoG.gain.value = 380;
    lfo.connect(lfoG).connect(this.padF.frequency); lfo.start();
    this.padG = ctx.createGain(); this.padG.gain.value = 0.05;
    this.padF.connect(this.padG); this.padG.connect(this.bus); this.padG.connect(this.verbIn);
    this.voices = [];
    CHORDS[0].forEach((m, i) => {
      [-7, 7].forEach(det => {
        const o = ctx.createOscillator(); o.type = i === 0 ? 'triangle' : 'sawtooth';
        o.frequency.value = mtof(m); o.detune.value = det; o.connect(this.padF); o.start();
        this.voices.push({ o, i });
      });
    });
    // sub drone
    this.sub = ctx.createOscillator(); this.sub.type = 'sine'; this.sub.frequency.value = mtof(33);
    const sg = ctx.createGain(); sg.gain.value = 0.12; this.sub.connect(sg).connect(this.bus); this.sub.start();
    this.next = ctx.currentTime + 0.1;
    this.timer = setInterval(() => this.schedule(), 50);
    this.ready = true;
  }
  setChord(i) {
    const t = this.ctx.currentTime, ch = CHORDS[i % CHORDS.length];
    this.voices.forEach(v => v.o.frequency.setTargetAtTime(mtof(ch[v.i]), t, 0.6));
    this.sub.frequency.setTargetAtTime(mtof(ch[0] - 12), t, 0.6);
  }
  schedule() {
    if (!this.ready || this.ctx.state !== 'running') return;
    const spb = 60 / 104 / 4; // 16th notes @104bpm
    while (this.next < this.ctx.currentTime + 0.2) {
      const s = this.step, t = this.next, I = this.intensity;
      if (s % 64 === 0) { this.chord = (this.chord + 1) % CHORDS.length; this.setChord(this.chord); }
      if (I > 0.45 && s % 4 === 0) this.kick(t, s % 16 === 0 ? 1 : 0.6);
      if (I > 0.3 && s % 2 === 1) this.hat(t, I * 0.05);
      if (I > 0.65 && s % 8 === 4) this.snare(t);
      if (I > 0.55) { const ch = CHORDS[this.chord]; const pat = [0, 2, 3, 4, 2, 3, 1, 4]; this.pluck(t, mtof(ch[pat[s % 8]] + 12), 0.035 * I); }
      else if (s % 4 === 0) { const ch = CHORDS[this.chord]; this.pluck(t, mtof(ch[[2, 4, 3, 1][(s / 4) % 4]] + 24), 0.02); }
      this.step++; this.next += spb;
    }
  }
  kick(t, v) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.18);
    g.gain.setValueAtTime(0.5 * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o.connect(g).connect(this.bus); o.start(t); o.stop(t + 0.4);
  }
  hat(t, v) {
    const c = this.ctx, n = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    n.buffer = this.noise; f.type = 'highpass'; f.frequency.value = 7500;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    n.connect(f).connect(g).connect(this.bus); n.start(t, Math.random()); n.stop(t + 0.06);
  }
  snare(t) {
    const c = this.ctx, n = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    n.buffer = this.noise; f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.7;
    g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    n.connect(f).connect(g); g.connect(this.bus); g.connect(this.verbIn); n.start(t, Math.random()); n.stop(t + 0.25);
  }
  pluck(t, f, v) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter();
    o.type = 'square'; o.frequency.value = f; lp.type = 'lowpass'; lp.frequency.setValueAtTime(3000, t); lp.frequency.exponentialRampToValueAtTime(400, t + 0.2);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    o.connect(lp).connect(g); g.connect(this.bus); g.connect(this.verbIn); o.start(t); o.stop(t + 0.3);
  }
  impact(big = 1) {
    if (!this.ready) return; const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(28, t + 1.4);
    g.gain.setValueAtTime(0.7 * big, t); g.gain.exponentialRampToValueAtTime(0.001, t + 2);
    o.connect(g); g.connect(this.bus); g.connect(this.verbIn); o.start(t); o.stop(t + 2.1);
    const n = c.createBufferSource(), f = c.createBiquadFilter(), ng = c.createGain();
    n.buffer = this.noise; f.type = 'lowpass'; f.frequency.setValueAtTime(5000, t); f.frequency.exponentialRampToValueAtTime(120, t + 1.2);
    ng.gain.setValueAtTime(0.35 * big, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    n.connect(f).connect(ng); ng.connect(this.bus); ng.connect(this.verbIn); n.start(t); n.stop(t + 1.6);
  }
  whoosh() {
    if (!this.ready) return; const c = this.ctx, t = c.currentTime;
    const n = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    n.buffer = this.noise; f.type = 'bandpass'; f.Q.value = 3;
    f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(4000, t + 0.8);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + 1);
    n.connect(f).connect(g); g.connect(this.bus); g.connect(this.verbIn); n.start(t); n.stop(t + 1.1);
  }
  zap() {
    if (!this.ready) return; const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(1600, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.5);
    g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    o.connect(g); g.connect(this.bus); g.connect(this.verbIn); o.start(t); o.stop(t + 0.7);
  }
  setIntensity(v) { this.intensity = v; if (this.ready) this.padF.frequency.setTargetAtTime(400 + v * 900, this.ctx.currentTime, 1); }
  duck(on) { if (this.ready) this.bus.gain.setTargetAtTime(on ? 0.3 : 0.55, this.ctx.currentTime, 0.3); }
  pause() { if (this.ready) this.ctx.suspend(); }
  resume() { if (this.ready) { this.ctx.resume(); this.next = this.ctx.currentTime + 0.05; } }
}
