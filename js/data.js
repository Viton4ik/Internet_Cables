// ============================================================
//  WIRES BENEATH THE WAVES — film data
//  Timeline (seconds), cable routes (approximate lat/lon waypoints),
//  ownership info, camera keyframes, voice-over script.
//  Routes are simplified for visualisation; facts approximate
//  (sources: TeleGeography Submarine Cable Map, operator press releases).
// ============================================================

export const DURATION = 360;

export const COLORS = {
  tech: '#4fe3ff',     // Big Tech owned / led
  telco: '#ffc94d',    // telecom consortia
  china: '#ff3b5c',    // Chinese-owned / built
  hist: '#ffe2b0',     // historical telegraph / telephone
  russia: '#b98cff',   // Russian state
  regional: '#7dffa8', // regional / national operators
  bg: '#5d86ad'        // other systems (background web)
};

export const LEGEND = [
  ['tech', 'Big Tech'], ['telco', 'Telecom consortia'], ['china', 'Chinese-owned / built'],
  ['regional', 'Regional operators'], ['russia', 'Russian state'], ['hist', 'Historic']
];

// ---------- reusable sea waypoints ----------
const PS = [31.4, 32.3]; // Port Said
const EU_PS = [[48.3,-6.5],[44,-10.2],[38.5,-10.3],[36.2,-7.5],[35.95,-5.6],[36.4,-2],[37.5,3],[37.9,9.5],[37.4,11.6],[35.5,17],[34.3,24],[32.6,28],PS];
const MRS_PS = [[43.3,5.37],[41.5,6.5],[38.3,9.8],[37.4,11.6],[35.5,17],[34.3,24],[32.6,28],PS];
const PS_BAB = [PS,[30.0,32.55],[29,33.0],[27.5,34.0],[24,36.2],[20,38.6],[16,41.2],[12.6,43.3]];
const BAB_MUM = [[12.6,43.3],[12.2,46],[13,50],[14.5,54],[17,58.5],[19.5,64],[19.0,72.8]];
const MUM_SG = [[19.0,72.8],[14,72.5],[8.5,75.8],[6.3,78.2],[5.2,80.5],[5.8,86],[6.1,94.6],[5.8,97.5],[5.2,99.5],[3.5,100.4],[2.2,101.7],[1.25,103.9]];
const SG_HK = [[1.25,103.9],[2.5,105.5],[6,107],[10,109.5],[14,110.3],[18,112.5],[22.2,114.2]];
const HK_JP = [[22.2,114.2],[22.5,117.5],[24.5,119.8],[27,121.6],[31,122.9],[32.3,126],[32,129.3],[31.3,131.5],[33,136.2],[34.3,136.8]];
const SG_PER = [[1.25,103.9],[-1,106.5],[-5.2,106.6],[-6.3,105.6],[-9,104],[-22,110.5],[-31.95,115.7]];
const AF_W = [[38.5,-10.3],[33,-14],[30,-19],[22,-19],[14.7,-17.9],[9,-15.5],[4.5,-8],[4.2,-2],[4.5,4],[1,6.5],[-6,11.5],[-8.8,13.0],[-15,11.3],[-23,13.9],[-29.5,15.5],[-35,18],[-35.3,21]];
const AF_E = [[-35.3,21],[-34.5,26],[-31.5,30.7],[-26,33.4],[-24.5,36],[-20,36.2],[-15,41.5],[-10.5,41],[-6.5,40.2],[-4.05,40],[2,46],[8,50.5],[11.5,52],[12.2,48],[12.6,43.3]];
const R = a => a.slice().reverse();
const T = (a, n = 1) => a.slice(n);

// ---------- cables ----------
// t = draw start, d = draw duration, f = focus window [a,b] (shows cable file card),
// end = fade-out time, cut = time the cable is severed, off = small visual offset (deg)
export const CABLES = [
  // ===== HISTORIC =====
  { id:'tg1858', name:'Transatlantic Telegraph', year:'1858', len:'3,200 km', route:'Ireland → Newfoundland',
    owners:'Atlantic Telegraph Company (UK/US)', ctrl:'Private British–American venture. Died after 3 weeks.',
    g:'hist', t:19, d:7, end:36.5, f:[18,30], lab:['Valentia, Ireland','Heart\'s Content, Newfoundland'],
    segs:[[[51.93,-10.3],[51.5,-30],[47.9,-53.4]]] },
  { id:'tg1866', name:'Great Eastern Cable', year:'1866', len:'3,000 km', route:'Ireland → Newfoundland',
    owners:'Anglo-American Telegraph Company', ctrl:'British private capital, laid by SS Great Eastern',
    g:'hist', t:37.5, d:4, end:91, f:[37,43], lab:['Valentia','Newfoundland'],
    segs:[[[51.93,-10.3],[50.5,-32],[47.85,-53.35]]] },
  { id:'allred', name:'All Red Line', year:'1902', len:'≈ 100,000 km network', route:'Britain → India → Australia → Canada',
    owners:'Eastern Telegraph Co. · Pacific Cable Board', ctrl:'British Empire — every landing on British soil',
    g:'hist', t:43, d:5, end:91, f:[43,48],
    segs:[
      [[50.04,-5.65],[48.3,-6.5],[44,-10.2],[38.5,-10.3],[36.2,-7.5],[35.95,-5.6],[36.4,-2],[37.5,3],[37.9,9.5],[35.9,14.5],[34.3,24],[32.6,28],...T(PS_BAB,0),[12.7,45],...T(BAB_MUM,2),...T(MUM_SG),[-1,106.5],[-5.2,106.6],[-6,108],[-5.8,112],[-8.7,115.7],[-11,122],[-12.4,130.8]],
      [[-27.9,153.4],[-29.05,167.95],[-18.1,178.4],[3.85,-159.4],[48.8,-125.1]],
      [[-29.05,167.95],[-36.8,174.4]],
      [[50.04,-5.65],[47,-30],[45.3,-61]]
    ] },
  { id:'tat1', name:'TAT-1', year:'1956', len:'3,600 km', route:'Scotland → Newfoundland',
    owners:'AT&T · British GPO · Canadian Overseas Telecom', ctrl:'National telephone monopolies',
    g:'hist', t:48.5, d:4, end:91, f:[48,55], lab:['Oban, Scotland','Clarenville, Canada'],
    segs:[[[56.4,-5.5],[56.0,-7.4],[55.5,-12],[48.2,-53.97]]] },

  // ===== FIBRE ERA =====
  { id:'tat8', name:'TAT-8', year:'1988', len:'6,700 km', route:'USA → UK & France',
    owners:'AT&T · British Telecom · France Télécom', ctrl:'Telecom consortium. Retired in 2002.',
    g:'telco', t:56, d:5, f:[55,71], lab:['Tuckerton, NJ','Widemouth, UK'],
    segs:[[[39.63,-74.2],[41,-50],[48.5,-15],[50.8,-4.6]],[[48.5,-15],[47.8,-4.37]]] },
  { id:'flag', name:'FLAG Europe–Asia', year:'1997', len:'28,000 km', route:'UK → Egypt → India → China → Japan',
    owners:'FLAG Telecom → today Global Cloud Xchange', ctrl:'Indian conglomerate Reliance (since 2004)',
    g:'telco', t:71.5, d:6, f:[71,80], off:0.5, lab:['Porthcurno, UK','Ninomiya, Japan'],
    segs:[[[50.04,-5.65],...EU_PS,...T(PS_BAB),...T(BAB_MUM),...T(MUM_SG),...T(SG_HK),...T(HK_JP),[33.8,139],[35.3,139.3]]] },
  { id:'smw3', name:'SEA-ME-WE 3', year:'1999', len:'39,000 km', route:'Germany → Egypt → Singapore → Japan / Australia',
    owners:'92 operators from 33 countries', ctrl:'Consortium incl. China Telecom, Orange, Singtel, Deutsche Telekom, Telstra',
    g:'telco', t:80.5, d:6, f:[80,91], off:-0.5, lab:['Norden, Germany','Okinawa, Japan'],
    segs:[[[53.6,7.0],[53.7,4],[51.2,1.8],[50.2,-1.5],[49.6,-5],...EU_PS,...T(PS_BAB),...T(BAB_MUM),...T(MUM_SG),...T(SG_HK),...T(HK_JP)],[...SG_PER]] },
  { id:'tat14', name:'TAT-14', year:'2001', len:'15,000 km', route:'USA → UK, FR, NL, DE, DK',
    owners:'~50 carriers (AT&T, BT, Deutsche Telekom…)', ctrl:'Telecom consortium. Retired 2020.',
    g:'telco', t:88, d:3, off:0.6,
    segs:[[[40.3,-74],[47,-40],[50.5,-8],[50.83,-4.55]],[[50.5,-8],[49.6,-4],[50.6,0.5],[51.2,1.9],[52.6,3.9],[53.9,6.5],[55.6,8.1]]] },

  // ===== ATLANTIC =====
  { id:'marea', name:'MAREA', year:'2017', len:'6,600 km', route:'Virginia Beach, USA → Bilbao, Spain',
    owners:'Microsoft · Meta · Telxius (Telefónica)', ctrl:'Big Tech + Spanish telecom · 200 Tbps',
    g:'tech', t:142, d:4, f:[142,150], lab:['Virginia Beach','Bilbao'],
    segs:[[[36.85,-75.98],[38,-55],[43,-20],[43.4,-2.95]]] },
  { id:'dunant', name:'Dunant', year:'2021', len:'6,400 km', route:'Virginia Beach → Saint-Hilaire-de-Riez, France',
    owners:'Google (100%)', ctrl:'A private Google cable · 250 Tbps',
    g:'tech', t:150, d:3.5, f:[150,154], lab:['Virginia Beach','St-Hilaire, France'],
    segs:[[[36.85,-75.98],[40,-50],[46,-12],[46.72,-1.95]]] },
  { id:'gh', name:'Grace Hopper', year:'2022', len:'6,250 km', route:'New York → Bude, UK & Bilbao, Spain',
    owners:'Google (100%)', ctrl:'Private Google cable · 352 Tbps',
    g:'tech', t:154, d:3.5, f:[154,158], lab:['New York','Bude, UK'],
    segs:[[[40.75,-72.85],[44,-45],[48,-15],[50.83,-4.55]],[[48,-15],[43.38,-2.98]]] },
  { id:'amitie', name:'Amitié', year:'2023', len:'6,800 km', route:'Massachusetts → Bude, UK & Le Porge, France',
    owners:'Meta · Microsoft · Aqua Comms · Vodafone', ctrl:'Big Tech-led consortium · 400 Tbps',
    g:'tech', t:158, d:3, f:[158,162], lab:['Lynn, MA','Le Porge, France'],
    segs:[[[42.46,-70.95],[46,-40],[48.5,-12],[44.87,-1.2]],[[48.5,-12],[50.83,-4.55]]] },
  { id:'havfrue', name:'Havfrue / AEC-2', year:'2020', len:'7,200 km', route:'New Jersey → Ireland, Denmark, Norway',
    owners:'Google · Meta · Aqua Comms (Ireland) · Bulk (Norway)', ctrl:'Big Tech + Nordic & Irish operators',
    g:'tech', t:162, d:3, f:[162,166], lab:['Wall, New Jersey','Blaabjerg, Denmark'],
    segs:[[[40.15,-74.03],[48,-40],[54.5,-13],[58,-10],[60.3,-3],[57.5,4],[55.6,8.1]],[[54.5,-13],[54.2,-9.4]],[[57.5,4],[58.1,8.0]]] },

  // ===== PACIFIC =====
  { id:'unity', name:'Unity', year:'2010', len:'9,620 km', route:'Chikura, Japan → Los Angeles',
    owners:'Google · KDDI · Singtel · Bharti Airtel · Global Transit', ctrl:'Google\'s first cable investment',
    g:'telco', t:175, d:3, f:[175,180], lab:['Chikura, Japan','Los Angeles'],
    segs:[[[34.95,139.95],[34,145],[33.86,-118.4]]] },
  { id:'faster', name:'FASTER', year:'2016', len:'11,600 km', route:'Japan → Oregon, USA (+ Taiwan)',
    owners:'Google · China Mobile · China Telecom · KDDI · Singtel', ctrl:'US–China partnership — unthinkable today',
    g:'telco', t:180, d:3, f:[180,186], off:0.6, lab:['Shima, Japan','Bandon, Oregon'],
    segs:[[[34.3,136.8],[33.5,141],[43.1,-124.4]],[[33.5,141],[34.95,139.95]]] },
  { id:'jupiter', name:'JUPITER', year:'2020', len:'14,000 km', route:'Japan & Philippines → Los Angeles',
    owners:'Meta · Amazon · SoftBank · NTT · PLDT · PCCW', ctrl:'Big Tech + Asian carriers',
    g:'tech', t:186, d:3, f:[186,190], off:-0.6, lab:['Shima, Japan','Hermosa Beach, CA'],
    segs:[[[34.3,136.8],[32.5,142],[33.86,-118.4]],[[15.76,121.56],[22,132],[32.5,142]]] },
  { id:'sx', name:'Southern Cross', year:'2000', len:'30,500 km', route:'Sydney & Auckland → Fiji → Hawaii → USA',
    owners:'Spark NZ · Telstra · Singtel-Optus · Verizon', ctrl:'Telecom consortium — Australia\'s lifeline',
    g:'telco', t:190, d:3, f:[190,194], lab:['Sydney','Oregon'],
    segs:[[[-33.9,151.25],[-31,165],[-18.1,178.4],[21.3,-158.1],[45.2,-123.97]],[[-36.8,174.4],[-29,179],[-18.1,178.4]],[[21.3,-158.1],[35.4,-120.9]]] },
  { id:'hawaiki', name:'Hawaiki', year:'2018', len:'15,000 km', route:'Sydney → New Zealand → Hawaii → Oregon',
    owners:'Hawaiki Cable (NZ, BW Digital)', ctrl:'Regional private operator',
    g:'regional', t:191, d:3, off:1.2,
    segs:[[[-33.9,151.25],[-34,163],[-35.5,175.2],[-28,-175],[21.3,-158.1],[45.6,-123.95]]] },
  { id:'curie', name:'Curie', year:'2020', len:'10,500 km', route:'Los Angeles → Valparaíso, Chile (+ Panama)',
    owners:'Google (100%)', ctrl:'First private intercontinental cable to land in Chile',
    g:'tech', t:194, d:3, f:[194,199], lab:['Los Angeles','Valparaíso'],
    segs:[[[33.86,-118.4],[15,-105],[-10,-86],[-33.0,-71.6]],[[0,-90],[8.9,-79.6]]] },
  { id:'topaz', name:'Topaz', year:'2023', len:'10,000 km', route:'Vancouver Island → Japan',
    owners:'Google (100%)', ctrl:'First cable linking Canada and Asia',
    g:'tech', t:199, d:2.5,
    segs:[[[48.9,-125.6],[38,150],[34.95,139.95]]] },
  { id:'echo', name:'Echo', year:'2024', len:'17,184 km', route:'California → Guam → Indonesia → Singapore',
    owners:'Google · Meta · XL Axiata', ctrl:'Big Tech — avoids the South China Sea',
    g:'tech', t:200, d:3, f:[199,205], lab:['Eureka, CA','Singapore'],
    segs:[[[40.8,-124.2],[13.4,144.7],[5,130],[1.5,125.6],[1.6,121],[-1,118.5],[-5,112],[-3,107.5],[1.25,103.9]]] },
  { id:'bifrost', name:'Bifrost', year:'2024', len:'19,888 km', route:'Singapore → Indonesia → Philippines → USA',
    owners:'Meta · Keppel · Telin', ctrl:'Big Tech + Singapore & Indonesian partners',
    g:'tech', t:202, d:3, off:0.7,
    segs:[[[1.25,103.9],[-3,107.5],[-5,112],[-1,118.5],[1.6,121],[5,124],[6.8,127],[13.4,144.7],[35.1,-120.6]]] },

  // ===== GLOBAL SOUTH =====
  { id:'sacs', name:'SACS', year:'2018', len:'6,165 km', route:'Luanda, Angola → Fortaleza, Brazil',
    owners:'Angola Cables', ctrl:'African-owned — first cable across the South Atlantic',
    g:'regional', t:212, d:3, f:[212,216], lab:['Luanda','Fortaleza'],
    segs:[[[-8.8,13.2],[-6,-10],[-3.72,-38.5]]] },
  { id:'ella', name:'EllaLink', year:'2021', len:'6,200 km', route:'Sines, Portugal → Fortaleza, Brazil',
    owners:'EllaLink Group (Marguerite infra fund)', ctrl:'European investors — direct EU–Brazil link',
    g:'regional', t:216, d:3, f:[216,221], lab:['Sines, Portugal','Fortaleza'],
    segs:[[[37.95,-8.87],[33,-17.5],[17,-25.8],[10,-30],[-3.72,-38.5]]] },
  { id:'equiano', name:'Equiano', year:'2023', len:'15,000 km', route:'Portugal → Togo → Nigeria → Namibia → South Africa',
    owners:'Google (100%)', ctrl:'Private Google cable · 144 Tbps',
    g:'tech', t:221, d:3.5, f:[221,225], off:-1, lab:['Lisbon','Melkbosstrand, SA'],
    segs:[[[38.44,-9.1],[30,-19],[20,-21],[8,-17],[3,-2],[3.5,2.5],[-10,6],[-24,11],[-33.7,18.43]],[[3.5,2.5],[6.13,1.22]],[[3.5,2.5],[6.43,3.4]],[[-24,11],[-22.7,14.5]],[[-10,6],[-15.9,-5.7]]] },
  { id:'firmina', name:'Firmina', year:'2024', len:'14,517 km', route:'South Carolina → Brazil → Uruguay → Argentina',
    owners:'Google (100%)', ctrl:'Longest cable able to run on a single power source',
    g:'tech', t:225, d:3, f:[225,228], lab:['Myrtle Beach, SC','Las Toninas, Argentina'],
    segs:[[[33.7,-78.9],[25,-70],[10,-46],[-6,-32.5],[-15,-36.5],[-23.5,-41.5],[-30,-46],[-34.95,-54.95],[-36.5,-56.7]],[[-23.5,-41.5],[-24,-46.4]]] },
  { id:'2africa', name:'2Africa', year:'2024', len:'45,000 km', route:'Circles Africa · 33 countries · 46 landings',
    owners:'Meta · China Mobile · MTN · Orange · stc · Telecom Egypt · Vodafone · WIOCC', ctrl:'Meta-led consortium · built by France\'s ASN',
    g:'tech', t:228, d:7, f:[228,237], off:1.1, lab:['Bude, UK','Marseille'],
    segs:[[[50.83,-4.55],[48.3,-7.5],...AF_W,...T(AF_E),...T(R(PS_BAB)),...T(R(MRS_PS))],[[37.5,3],[41.38,2.18]],[[38.3,9.8],[44.4,8.9]]] },

  // ===== EURASIA =====
  { id:'aae1', name:'AAE-1', year:'2017', len:'25,000 km', route:'Hong Kong → India → Middle East → Marseille',
    owners:'China Unicom · Etisalat · Ooredoo · Telecom Egypt · PCCW · Reliance Jio · Viettel …', ctrl:'19-member Asia–Middle East consortium',
    g:'telco', t:252, d:4, f:[252,256], off:0.9, cut:310, lab:['Hong Kong','Marseille'],
    segs:[[...R(SG_HK),...T(R(MUM_SG)),...T(R(BAB_MUM)),...T(R(PS_BAB)),...T(R(MRS_PS))],[[19.5,64],[24.8,66.97]]] },
  { id:'smw6', name:'SEA-ME-WE 6', year:'2025', len:'19,200 km', route:'Singapore → India → Egypt → Marseille',
    owners:'Singtel · Microsoft · Orange · Telecom Egypt · Bharti Airtel · Mobily …', ctrl:'Built by US SubCom after Chinese HMN Tech was pushed out',
    g:'telco', t:256, d:4, f:[256,260], off:-0.9, lab:['Singapore','Marseille'],
    segs:[[...R(MUM_SG),...T(R(BAB_MUM)),...T(R(PS_BAB)),...T(R(MRS_PS))]] },
  { id:'peace', name:'PEACE', year:'2022', len:'15,000 km', route:'Pakistan → Egypt → France (+ Kenya)',
    owners:'PEACE Cable International (Hengtong Group, China)', ctrl:'Chinese-owned, built by HMN Tech — "Digital Silk Road"',
    g:'china', t:260, d:4, f:[260,268], off:0.45, lab:['Karachi','Marseille'],
    segs:[[[24.8,66.97],[19.5,64],[17,58.5],[14.5,54],[13,50],[12.2,46],...T(R(PS_BAB),0).slice(0),...T(R(MRS_PS))],[[12.2,48],[11.5,52],[8,50.5],[2,46],[-4.05,39.67]]] },

  // ===== GEOPOLITICS =====
  { id:'plcn', name:'Pacific Light Cable Network', year:'2022', len:'12,800 km', route:'Los Angeles → Taiwan & Philippines',
    owners:'Google · Meta (originally with a Chinese partner)', ctrl:'US blocked its Hong Kong landing in 2020',
    g:'tech', t:291, d:2.5, f:[291,299], lab:['Los Angeles','Taiwan'],
    segs:[[[33.86,-118.4],[22,135],[24.9,121.95]],[[22,135],[15.76,121.56]]] },
  { id:'plcnhk', name:'PLCN — Hong Kong leg', year:'—', len:'—', route:'Blocked', owners:'—', ctrl:'—',
    g:'china', t:292.5, d:1.5, cut:294,
    segs:[[[22,135],[20.6,122.5],[21.2,117],[22.2,114.2]]] },

  // ===== FRAGILE =====
  { id:'tcn', name:'Tonga Cable', year:'2013', len:'827 km', route:'Fiji → Tonga',
    owners:'Tonga Cable Ltd (state-owned)', ctrl:'A whole nation on a single cable',
    g:'regional', t:300, d:2, cut:307,
    segs:[[[-18.1,178.4],[-20,-177.5],[-21.14,-175.2]]] },
  { id:'clion', name:'C-Lion1', year:'2016', len:'1,173 km', route:'Helsinki, Finland → Rostock, Germany',
    owners:'Cinia (Finnish state)', ctrl:'Severed Nov 2024 — suspected anchor-dragging',
    g:'regional', t:314, d:2, f:[316,324], cut:318, lab:['Helsinki','Rostock'],
    segs:[[[60.15,24.9],[59.7,23],[58.5,20.5],[57,19.6],[55.3,15],[54.6,12.5],[54.2,12.1]]] },
  { id:'polar', name:'Polar Express', year:'planned', len:'12,650 km', route:'Murmansk → Arctic Ocean → Vladivostok',
    owners:'Morsviazsputnik (Russian state)', ctrl:'Russian Ministry of Transport — fully domestic route',
    g:'russia', t:324, d:5, f:[324,330], lab:['Murmansk','Vladivostok'],
    segs:[[[69.0,33.1],[70.8,37],[75,47],[77.5,60],[77.7,70],[77,85],[77.9,104.5],[76.5,118],[75,127],[73.3,140],[71.5,160],[70.5,175],[67,-170],[64,-172.5],[61,179],[55,165],[52,158.8],[50,157],[46,151],[45.8,142.1],[44,137],[42.8,133],[43.1,131.9]]] },

  // ===== BACKGROUND WEB (drawn at 268s) =====
  ...[
    { name:'AAG', owners:'Telecom consortium', segs:[[[2.4,103.9],[10,109.5],[22.2,114.2]],[[22.2,114.2],[21.2,120.9],[13.4,144.7],[21.3,-158.1],[35.2,-120.7]]] },
    { name:'SJC', owners:'Google, KDDI, China Telecom…', segs:[[[1.25,103.9],[6,107.3],[14,110.6],[18,112.8],[22.2,114.2],[22.5,117.5],[21.2,120.9],[25,126],[34.3,136.8]]] },
    { name:'TPE', owners:'China Telecom, Verizon, KT…', segs:[[[31,122.8],[29,127],[33,141],[45.6,-123.95]],[[36.1,120.4],[34.5,123],[33.5,127],[34.6,128.7]]] },
    { name:'NCP', owners:'Microsoft, China Mobile, KT…', segs:[[[31,122.8],[28.5,125],[30,141],[45.2,-123.97]]] },
    { name:'WACS', owners:'MTN, Telkom, Vodacom…', off:-0.8, segs:[[[51.2,-3.6],[50.8,-6],[48.3,-7.5],...AF_W]] },
    { name:'SAT-3', owners:'African telecoms', off:0.8, segs:[[[38.44,-9.1],...T(AF_W)]] },
    { name:'SEACOM', owners:'SEACOM (African investors)', off:0.6, cut:310, segs:[[[-28.95,31.75],...T(AF_E,3),...T(PS_BAB.slice().reverse()).slice(0,-1),[29.1,32.65]],[[12.2,46],...T(BAB_MUM,2)]] },
    { name:'EASSy', owners:'African operators', off:-0.6, segs:[[[-28.95,31.75],...T(AF_E,3).slice(0,-2),[11.6,43.2],[16,41.2],[19.6,37.2]]] },
    { name:'EIG', owners:'Consortium incl. AT&T, BT, Verizon', off:0.3, cut:310, segs:[[[50.04,-5.65],...EU_PS,...T(PS_BAB),...T(BAB_MUM)]] },
    { name:'IMEWE', owners:'Telecom consortium', off:-0.3, segs:[[...MRS_PS,...T(PS_BAB),...T(BAB_MUM)]] },
    { name:'SEA-ME-WE 5', owners:'Telecom consortium', off:0.2, segs:[[...MRS_PS,...T(PS_BAB),...T(BAB_MUM),...T(MUM_SG)]] },
    { name:'SAIL', owners:'China Unicom & Camtel · built by Huawei Marine', g:'china', segs:[[[2.95,9.9],[1.5,7],[-6,-20],[-3.72,-38.5]]] },
    { name:'Monet', owners:'Google, Antel, Angola Cables, Algar', off:-0.8, segs:[[[26.35,-80.07],[25,-74],[10,-45],[-6,-33],[-15,-37],[-23.5,-42],[-24,-46.4]]] },
    { name:'Seabras-1', owners:'Seaborn Networks', off:0.9, segs:[[[40.15,-74.03],[30,-60],[10,-40],[-6,-33],[-15,-37],[-23.5,-42],[-23.98,-46.3]]] },
    { name:'Indigo', owners:'Google, Telstra, Singtel…', off:0.5, segs:[[...SG_PER,[-35.5,115],[-36,130],[-39.6,141],[-39.6,146],[-38,149.5],[-33.9,151.25]]] },
    { name:'ASC', owners:'Vocus', off:-0.5, segs:[[...SG_PER]] },
    { name:'Hibernia Express', owners:'GTT / Aqua Comms', segs:[[[44.65,-63.5],[50,-30],[51.4,-10],[51.2,-3.2]]] },
    { name:'Apollo', owners:'Vodafone', segs:[[[40.75,-72.85],[45,-40],[50,-8],[50.4,-4.7]],[[50,-8],[48.8,-3.5]]] },
    { name:'Tannat', owners:'Google, Antel', segs:[[[-24,-46.4],[-30,-47.5],[-34.95,-54.95]]] },
    { name:'APG', owners:'Telecom consortium', off:-0.5, segs:[[[1.25,103.9],[6,107],[10,109.5],[14,110.3],[18,112.5],[22.2,114.2],[24.5,119.8],[27,121.6],[31,122.9],[32.5,126.5],[34.6,128.7]]] },
    { name:'Asia America Gateway 2', owners:'various', off:1, segs:[[[1.25,103.9],[6,108],[14,111],[18,113],[21.2,120.9],[21.3,-158.1],[34.0,-118.5]]] },
    { name:'SAm-1', owners:'Telxius', segs:[[[26.35,-80.07],[18.4,-66.1],[12,-60],[-6,-33],[-15,-37],[-23.5,-42],[-36,-55],[-33,-71.6]].slice(0,7),[[8.9,-79.6],[-12,-77.2],[-33,-71.6]]] },
  ].map((c, i) => ({ id:'bg'+i, year:'', len:'', route:'', ctrl:'', g:c.g || 'bg', t:268 + i * 0.22, d:2.4, ...c }))
];

// ---------- camera keyframes ----------
export const CAM = [
  { t:0, lat:15, lon:-20, d:7.5 },
  { t:9, lat:30, lon:-35, d:3.4 },
  { t:18, lat:45, lon:-32, d:2.25 },
  { t:30, lat:47, lon:-28, d:2.1 },
  { t:37, lat:44, lon:-34, d:2.3 },
  { t:43, lat:10, lon:60, d:3.6 },
  { t:47, lat:-5, lon:130, d:3.6 },
  { t:49, lat:50, lon:-30, d:2.4 },
  { t:55, lat:45, lon:-38, d:2.4 },
  { t:66, lat:42, lon:-30, d:2.6 },
  { t:71, lat:32, lon:35, d:2.9 },
  { t:78, lat:22, lon:100, d:2.9 },
  { t:80, lat:20, lon:60, d:3.3 },
  { t:88, lat:28, lon:10, d:3.4 },
  { t:93, lat:20, lon:-10, d:4.8 },
  { t:134, lat:20, lon:-40, d:4.8 },
  { t:139, lat:42, lon:-40, d:2.15 },
  { t:150, lat:44, lon:-35, d:2.2 },
  { t:162, lat:50, lon:-25, d:2.3 },
  { t:167, lat:35, lon:-165, d:3.2 },
  { t:175, lat:38, lon:-170, d:2.9 },
  { t:186, lat:20, lon:175, d:3.0 },
  { t:190, lat:-5, lon:-170, d:3.3 },
  { t:194, lat:0, lon:-95, d:3.0 },
  { t:199, lat:20, lon:150, d:3.1 },
  { t:206, lat:10, lon:-20, d:3.3 },
  { t:212, lat:-5, lon:-15, d:2.6 },
  { t:221, lat:0, lon:-10, d:2.8 },
  { t:225, lat:-10, lon:-50, d:2.9 },
  { t:229, lat:0, lon:15, d:2.9 },
  { t:236, lat:5, lon:30, d:3.0 },
  { t:240, lat:22, lon:45, d:2.3 },
  { t:244, lat:22, lon:45, d:2.0 },
  { t:249, lat:10, lon:90, d:2.4 },
  { t:252, lat:20, lon:80, d:3.0 },
  { t:260, lat:25, lon:45, d:2.7 },
  { t:269, lat:25, lon:20, d:3.9 },
  { t:283, lat:30, lon:-90, d:3.9 },
  { t:291, lat:20, lon:150, d:3.0 },
  { t:299, lat:5, lon:120, d:3.6 },
  { t:306, lat:-18, lon:-175, d:2.3 },
  { t:310, lat:15, lon:42, d:2.0 },
  { t:316, lat:57, lon:20, d:1.8 },
  { t:323, lat:70, lon:95, d:2.7 },
  { t:331, lat:20, lon:30, d:4.0 },
  { t:345, lat:15, lon:150, d:3.6 },
  { t:360, lat:15, lon:280, d:4.8 }
];

// ---------- chapters ----------
export const CHAPTERS = [
  { t:0, n:'00', name:'COLD OPEN', title:'WIRES BENEATH THE *WAVES*', kicker:'The hidden backbone of the internet', delay:1.5, hold:9 },
  { t:18, n:'01', name:'THE COPPER AGE', title:'THE *COPPER* AGE', kicker:'1858 – 1956 · Telegraph & telephone' },
  { t:55, n:'02', name:'SPEED OF LIGHT', title:'THE SPEED OF *LIGHT*', kicker:'1988 – 2001 · The fibre-optic revolution' },
  { t:91, n:'03', name:'ENGINEERING', title:'HOW TO LAY A *CABLE*', kicker:'Survey · Load · Lay · Bury', hold:4.5 },
  { t:134, n:'04', name:'THE ATLANTIC', title:'THE *ATLANTIC* RACE', kicker:'Big Tech takes over the busiest corridor' },
  { t:166, n:'05', name:'THE PACIFIC', title:'ACROSS THE *PACIFIC*', kicker:'Silicon Valley ↔ Asia' },
  { t:205, n:'06', name:'GLOBAL SOUTH', title:'THE GLOBAL *SOUTH*', kicker:'Africa & South America plug in' },
  { t:237, n:'07', name:'CHOKEPOINTS', title:'THE NARROW *GATES*', kicker:'Suez · Red Sea · Malacca' },
  { t:268, n:'08', name:'POWER', title:'WHO *CONTROLS* IT?', kicker:'Owners, builders and geopolitics', hold:4 },
  { t:299, n:'09', name:'FRAGILE', title:'ONE ANCHOR *AWAY*', kicker:'Faults, cuts and sabotage' },
  { t:330, n:'10', name:'EPILOGUE', title:'', kicker:'' },
  { t:337, n:'10', name:'EPILOGUE', title:'NOT A CLOUD. A *CABLE*.', kicker:'99% of intercontinental data travels under the sea', hold:8.5 },
  { t:346, n:'10', name:'EPILOGUE', title:'*SUBSCRIBE*', kicker:'Wires Beneath the Waves · a motion film', hold:14 }
];

// ---------- rolling year counter ----------
export const YEARS = [
  { t:0, y:null }, { t:3, y:2026, dur:0.1 }, { t:15.5, y:1858, dur:2.5 },
  { t:37, y:1866 }, { t:43, y:1902 }, { t:48, y:1956 }, { t:55, y:1988, dur:1.6 },
  { t:71, y:1997 }, { t:80, y:1999 }, { t:88, y:2001 }, { t:91, y:null },
  { t:142, y:2017 }, { t:150, y:2021 }, { t:154, y:2022 }, { t:158, y:2023 }, { t:162, y:null },
  { t:175, y:2010 }, { t:180, y:2016 }, { t:186, y:2020 }, { t:190, y:null },
  { t:212, y:2018 }, { t:216, y:2021 }, { t:221, y:2023 }, { t:228, y:2024 }, { t:237, y:null },
  { t:307, y:2022 }, { t:310, y:2024 }, { t:324, y:null }
];

// ---------- overlays ----------
export const OVERLAYS = [
  { id:'ovLay', a:92, b:134 },
  { id:'ovCtrl', a:271, b:291 },
  { id:'ovStats', a:330, b:337 }
];

// ---------- markers / events ----------
export const EVENTS = [
  { t:243, end:252, ll:[30.2,32.4], label:'SUEZ · ≈17% OF GLOBAL TRAFFIC', c:'#ffc94d' },
  { t:245, end:252, ll:[12.6,43.3], label:'BAB-EL-MANDEB', c:'#ffc94d' },
  { t:247, end:252, ll:[2.5,101.3], label:'STRAIT OF MALACCA', c:'#ffc94d' },
  { t:291, end:299, ll:[22.2,114.2], label:'HONG KONG LANDING · BLOCKED 2020', c:'#ff3b5c' },
  { t:307, end:316, ll:[-20.5,-175.4], label:'TONGA · JAN 2022 · VOLCANIC ERUPTION', c:'#ff3b5c' },
  { t:310, end:316, ll:[13.6,42.9], label:'RED SEA · FEB 2024 · 3 CABLES CUT', c:'#ff3b5c' },
  { t:316, end:318.3, ll:[59.6,24], label:'GULF OF FINLAND · OCT 2023', c:'#ff3b5c' },
  { t:318, end:324, ll:[55.6,16], label:'BALTIC · NOV 2024 · C-LION1 CUT', c:'#ff3b5c' },
  { t:324, end:330, ll:[66,-169.5], label:'BERING STRAIT', c:'#b98cff' }
];

// ---------- voice-over ----------
export const VO = [
  { t:0, text:'Right now, as you watch this, almost every byte that crosses an ocean travels through a glass thread, lying in total darkness on the sea floor.' },
  { t:11, text:'Not satellites. Not the cloud. Cables. Nearly one and a half million kilometres of them.' },
  { t:18, text:'It started in 1858. A copper telegraph cable linked Ireland and Newfoundland. Queen Victoria sent a ninety-eight word message. It took sixteen hours to arrive.' },
  { t:30, text:'Three weeks later, the cable burned out. Engineers had pushed two thousand volts through it.' },
  { t:37, text:'In 1866, the giant steamship Great Eastern finally laid a cable that worked. By 1902, the British Empire\'s All Red Line wrapped the entire planet.' },
  { t:48, text:'In 1956, TAT-1 carried the first transatlantic phone calls. Thirty-six at a time.' },
  { t:55, text:'Then came 1988. TAT-8, the first transatlantic fibre-optic cable, built by AT&T, British Telecom and France Télécom.' },
  { t:64, text:'Laser pulses through glass. Forty thousand calls at once. The internet suddenly had a highway.' },
  { t:71, text:'In 1997, FLAG stretched twenty-eight thousand kilometres from Britain to Japan, through the Suez Canal and the Strait of Malacca.' },
  { t:80, text:'In 1999, SEA-ME-WE 3 became the longest cable on Earth: thirty-nine thousand kilometres, shared by ninety-two operators from thirty-three countries.' },
  { t:91, text:'So how do you put a cable across an ocean? First, survey ships map the seabed metre by metre, steering around volcanoes, trenches and shipwrecks.' },
  { t:102, text:'Then a cable ship loads thousands of kilometres of cable into giant tanks, and sails at walking pace, paying it out, day and night, for weeks.' },
  { t:114, text:'Near the shore, a plough buries it in the seabed. In the deep ocean, it simply sinks, up to eight kilometres down.' },
  { t:123, text:'Every fifty to one hundred kilometres, a repeater boosts the light. At the core: a few hair-thin glass fibres, wrapped in steel, copper and plastic.' },
  { t:134, text:'Today, the North Atlantic is the busiest data corridor on Earth. And the new owners are not phone companies.' },
  { t:142, text:'MAREA, 2017. Microsoft and Meta, with Telxius. Virginia to Bilbao, two hundred terabits per second.' },
  { t:150, text:'Dunant, 2021: owned entirely by Google. Grace Hopper, 2022: Google again, to Britain and Spain.' },
  { t:158, text:'Amitié. Havfrue. Dozens of cables, all landing on a handful of beaches.' },
  { t:166, text:'The Pacific is wider, deeper and angrier. Here, cables link Silicon Valley with the factories and data centres of Asia.' },
  { t:175, text:'Unity in 2010. Then FASTER in 2016: Google sharing a cable with China Mobile and China Telecom. A partnership that would soon be impossible.' },
  { t:186, text:'JUPITER: Meta, Amazon, SoftBank and NTT. Southern Cross and Hawaiki tie Australia and New Zealand to America.' },
  { t:194, text:'Google\'s Curie runs to Chile. Topaz, Echo and Bifrost open new routes to Canada, Indonesia and Singapore, deliberately avoiding the South China Sea.' },
  { t:205, text:'For decades, Africa and South America were the internet\'s back roads. That has changed fast.' },
  { t:212, text:'SACS, 2018: the first cable across the South Atlantic, built by Angola Cables. EllaLink connects Brazil directly to Europe.' },
  { t:221, text:'Google\'s Equiano runs down Africa\'s west coast. Firmina links the United States with Argentina.' },
  { t:228, text:'And 2Africa, led by Meta: forty-five thousand kilometres, circling the entire continent. The longest cable system ever built.' },
  { t:237, text:'Between Europe and Asia, geography forces every cable through a few narrow gates.' },
  { t:243, text:'The Suez Canal. The Red Sea. The Strait of Malacca. Up to seventeen percent of global internet traffic crosses Egypt alone.' },
  { t:252, text:'AAE-1 runs from Hong Kong to Marseille. SEA-ME-WE 6, the newest of its family, links Singapore and France.' },
  { t:260, text:'And PEACE: a Chinese-built, Chinese-owned cable from Pakistan to France. The Digital Silk Road, under the sea.' },
  { t:268, text:'So who owns the internet\'s backbone? Increasingly, four companies: Google, Meta, Microsoft and Amazon.' },
  { t:275, text:'They now use around seventy percent of all international bandwidth. Google alone has stakes in more than thirty cables.' },
  { t:283, text:'Only four firms can build them: America\'s SubCom, France\'s ASN, Japan\'s NEC, and China\'s HMN Tech.' },
  { t:291, text:'Washington has blocked Chinese landings on American soil. Cables are now a front line of geopolitics.' },
  { t:299, text:'And they are fragile. Around two hundred faults happen every year, mostly from ship anchors and fishing gear.' },
  { t:307, text:'In 2022, a volcano cut Tonga off from the world. In 2024, a sinking ship dragged its anchor across three Red Sea cables.' },
  { t:316, text:'In the Baltic, cables to Finland, Estonia and Germany were severed in 2023 and 2024. Suspected sabotage.' },
  { t:324, text:'And Russia plans Polar Express, through the Arctic: a route no one else controls.' },
  { t:330, text:'Six hundred cable systems. Ninety-nine percent of intercontinental data.' },
  { t:337, text:'The internet is not a cloud. It is a cable at the bottom of the sea. And whoever controls the cables, controls the conversation.' },
  { t:347, text:'If this blew your mind, subscribe. And next time a video loads instantly, remember how far it travelled.' }
];
