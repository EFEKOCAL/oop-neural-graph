/* =========================================================================
   physics.js — DAG graf modeli + yay (spring) fizik motoru
   -------------------------------------------------------------------------
   TOPOLOJİ: Graf artık merkezi bir düğüme bağlı yıldız değil, Yönlü
   Döngüsüz Graf'tır (DAG). Her bağ "önkoşul → kavram" yönündedir ve
   data.js'teki dependsOn ilişkilerinden üretilir.

   YERLEŞİM (layered layout):
     - Sütun (x) = derinlik: kavramın en uzun önkoşul zincirinin uzunluğu.
       Böylece bütün oklar soldan sağa akar; geri dönen bağ olmaz.
     - Şerit (y) = kategori: her kategori kendi yatay şeridinde durur.
     - Aynı şerit + aynı sütundaki düğümler, önkoşullarının ortalama y'sine
       (barycenter) göre sıralanır → bağ kesişmeleri azalır.

   FİZİK: Her düğüm yerleşim noktasına bir yayla bağlıdır ve bu nokta yavaşça
   salınır (ipe bağlı balon). Bağlar dinlenme uzunluğunu korumaya çalışan
   yaylardır; yakın düğümler birbirini iter. Anchor yayı bağ yayından
   güçlü tutulur, böylece çok bağlı DAG'de yaylar birbirine dolanmaz ve
   sürüklenen düğüm bırakılınca herkes kendi yerine döner.
   Entegrasyon: yarı-örtük Euler, sabit 120 Hz alt adımlar.

   UYDU ALT KONULAR: Ders slaytlarındaki küçük ayrıntılar (ör. "this(...)
   zincirleme", "JRadioButton + ButtonGroup") ayrı DAG düğümü yerine ana
   kavramın etrafında dönen uydulardır (kind: "sub"). Yerleşimi ve
   topolojik sırayı etkilemezler; anchor'ları ev sahibinin (host) anlık
   konumuna göre hesaplanır. Kapalıyken küçük "aylar" gibi yavaşça döner,
   ev sahibi seçilince/üzerine gelinince (host.expand → 1) halka olarak açılır.
   ========================================================================= */

const TAU = Math.PI * 2;

const PHYS = {
  K_ANCHOR: 12,       // balonun ipi: yerleşim noktasına çekim
  K_LINK: 5,          // bağ yayı (anchor'dan zayıf → dolanma olmaz)
  PARENT_SHARE: 0.35, // bağ kuvvetinin önkoşul düğüme yansıyan oranı
  DAMPING: 4.4,       // sönümleme (1/sn)
  REPULSE: 30,        // itme sertliği
  GAP: 20,            // düğümler arası minimum boşluk (dünya birimi)
  SUBSTEP: 1 / 120,
  K_ORBIT: 34,        // uydunun yörünge noktasına çekimi
  SPIN: 0.22,         // kapalı uyduların dönüş hızı (rad/sn)
};

const LAYOUT = {
  COL_GAP: 150,     // derinlik sütunları arası mesafe
  SLOT_GAP: 56,     // aynı hücrede alt alta düğümler arası mesafe
  LANE_PAD: 34,     // şerit iç boşluğu (üst/alt)
  LANE_GAP: 46,     // şeritler arası boşluk
  BAND_PAD_X: 60,   // şerit bandının düğümlerden yatay taşması
  LABEL_SPACE: 250, // şerit adları için soldaki alan
};

// Şeritlerin yukarıdan aşağı sırası: bağlar mümkün olduğunca komşu şeritler
// arasında kalsın diye seçildi (ör. GUI & I/O, İstisna ile Event arasında)
const LANE_ORDER = ["patterns", "core", "advanced", "exceptions", "gui-io", "events"];

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(rgb, a) {
  return `rgba(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0},${a})`;
}

function mixRgb(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/* Kategori artık graf düğümü değil; kavramları gruplayan sanal bir nesnedir.
   Panel (gezinti yolu, genel bakış) ve lejant tarafından kullanılır. */
class CategoryGroup {
  constructor({ id, title, label, def, color }) {
    Object.assign(this, { id, title, label: label || title, def, color });
    this.kind = "category";
    this.rgb = hexToRgb(color);
    this.children = [];
    this.parent = null;
    this.lane = null; // { y0, y1, cy } — yerleşimde doldurulur
  }
  get path() { return [this]; }
  get siblings() { return [this]; }
}

class GraphNode {
  constructor({ id, title, label, def, code, js, quiz, traps, practice, dependsOn, color, category, order, host = null }) {
    Object.assign(this, { id, title, label: label || title, def, code, js, quiz, traps, practice, color, order });
    this.kind = host ? "sub" : "leaf";
    this.parent = category;          // panel uyumluluğu: gezinti yolu ve kardeşler
    this.host = host;                // uydu ise bağlı olduğu ana kavram
    this.children = [];
    this.subs = [];                  // ana kavramın uydu alt konuları
    this.slot = 0;                   // uydunun yörüngedeki sırası
    this.expand = 0;                 // uyduların açılma oranı (0 kapalı – 1 açık)
    this.spin = Math.random() * TAU;
    this.orbitR = 0;
    this.dependsOnIds = dependsOn || [];
    this.rgb = hexToRgb(color);
    this.drawRgb = [...this.rgb];    // çizim rengi (öğrenilince yeşile karışır)

    // DAG ilişkileri (buildGraph doldurur)
    this.deps = [];                  // önkoşul düğümleri
    this.dependents = [];            // bu kavramı önkoşul olarak kullananlar
    this.ancestors = new Set();      // tüm önkoşul zinciri
    this.depth = 0;
    this.radius = 9;

    // Fizik durumu
    this.x = 0; this.y = 0;
    this.vx = 0; this.vy = 0;
    this.fx = 0; this.fy = 0;
    this.ax = 0; this.ay = 0;
    this.anchorK = PHYS.K_ANCHOR;
    this.floatAmp = 6;
    this.phase = [Math.random() * TAU, Math.random() * TAU];
    this.freq = [0.35 + Math.random() * 0.35, 0.3 + Math.random() * 0.35];
    this.dragged = false;

    // Görsel durum (main.js yumuşak geçişlerle günceller, 0–1)
    this.scale = 1; this.scaleV = 0;
    this.alpha = 1;
    this.hover = 0;
    this.selected = 0;
    this.match = 0;    // arama eşleşmesi
    this.learned = 0;  // "Bunu öğrendim"
    this.target = 0;   // Müfredat Modu'nda sıradaki hedef
  }

  get path() { return this.host ? [this.parent, this.host, this] : [this.parent, this].filter(Boolean); }
  get siblings() { return this.host ? this.host.subs : this.parent ? this.parent.children : [this]; }
}

/**
 * KNOWLEDGE verisinden DAG kurar: düğümler, önkoşul bağları, topolojik
 * sıra, derinlikler, ata kümeleri ve şeritli yerleşim.
 */
function buildGraph(data) {
  const nodes = [];
  const byId = new Map();
  const categories = [];
  let order = 0;

  for (const cat of data.categories) {
    const group = new CategoryGroup(cat);
    categories.push(group);
    for (const concept of cat.concepts) {
      const node = new GraphNode({ ...concept, color: cat.color, category: group, order: order++ });
      node.subtopicData = concept.subtopics;
      nodes.push(node);
      byId.set(node.id, node);
      group.children.push(node);
    }
  }

  // 1) Bağlar: önkoşul (a) → kavram (b)
  const links = [];
  const linkByKey = new Map();
  for (const node of nodes) {
    for (const depId of node.dependsOnIds) {
      const dep = byId.get(depId);
      if (!dep) { console.warn(`[DAG] "${node.id}" bilinmeyen önkoşul: "${depId}"`); continue; }
      const link = { a: dep, b: node, rest: 0, phase: Math.random() * TAU, hot: 0 };
      links.push(link);
      linkByKey.set(`${dep.id}>${node.id}`, link);
      node.deps.push(dep);
      dep.dependents.push(node);
    }
  }

  // 2) Topolojik sıralama (Kahn algoritması) + derinlik (en uzun yol)
  //    Eşitlikte veri sırası korunur → müfredat sırası öngörülebilir olur.
  const indegree = new Map(nodes.map((n) => [n, n.deps.length]));
  const ready = nodes.filter((n) => n.deps.length === 0);
  const topo = [];
  while (ready.length) {
    ready.sort((a, b) => a.order - b.order);
    const n = ready.shift();
    topo.push(n);
    for (const d of n.dependents) {
      d.depth = Math.max(d.depth, n.depth + 1);
      indegree.set(d, indegree.get(d) - 1);
      if (indegree.get(d) === 0) ready.push(d);
    }
  }
  if (topo.length < nodes.length) {
    const stuck = nodes.filter((n) => !topo.includes(n)).map((n) => n.id);
    console.error("[DAG] Döngü tespit edildi, şu düğümler sıralanamadı:", stuck);
    topo.push(...nodes.filter((n) => !topo.includes(n)));
  }

  // 3) Ata kümeleri: topolojik sırada önkoşulların atalarını birleştir
  for (const n of topo) {
    for (const d of n.deps) {
      n.ancestors.add(d);
      d.ancestors.forEach((x) => n.ancestors.add(x));
    }
    // Çok kavramın önkoşulu olan "temel" düğümler biraz daha büyük
    n.radius = 8 + Math.min(5, n.dependents.length * 1.3);
  }
  // Kardeşler panelde derinlik sırasıyla gezilsin
  for (const group of categories) group.children.sort((a, b) => a.depth - b.depth || a.order - b.order);

  // 4) Şeritli yerleşim (yalnızca ana kavramlar; uydular yerleşimi etkilemez)
  const lanes = layoutLanes(categories, nodes);
  const concepts = [...nodes];

  // Bağ dinlenme uzunlukları = anchor noktaları arası mesafe
  for (const link of links) {
    link.rest = Math.hypot(link.b.ax - link.a.ax, link.b.ay - link.a.ay);
  }

  // 5) Uydular: ana kavramın etrafındaki küçük alt konular
  for (const host of concepts) {
    for (const sub of host.subtopicData ?? []) {
      if (byId.has(sub.id)) { console.warn(`[DAG] Yinelenen id: "${sub.id}"`); continue; }
      const node = new GraphNode({ ...sub, color: host.color, category: host.parent, order: order++, host });
      node.slot = host.subs.length;
      node.depth = host.depth;
      node.ancestors = new Set([...host.ancestors, host]);
      node.radius = 2;
      node.floatAmp = 0;
      node.anchorK = PHYS.K_ORBIT;
      host.subs.push(node);
      nodes.push(node);
      byId.set(node.id, node);
    }
    // Açık halka yarıçapı alt konu sayısıyla büyür
    host.orbitR = 48 + Math.min(host.subs.length, 12) * 4;
  }

  // Başlangıç: herkes merkeze yakın → yaylar ağı "açar" (açılış animasyonu)
  for (const n of nodes) {
    n.x = n.ax * 0.05 + (Math.random() - 0.5) * 30;
    n.y = n.ay * 0.05 + (Math.random() - 0.5) * 30;
  }

  return { nodes, concepts, links, linkByKey, byId, categories, topo, lanes, bounds: lanes.bounds };
}

function layoutLanes(categories, nodes) {
  const maxDepth = Math.max(0, ...nodes.map((n) => n.depth));
  const xOf = (depth) => depth * LAYOUT.COL_GAP - (maxDepth * LAYOUT.COL_GAP) / 2;
  const laneRank = (g) => {
    const i = LANE_ORDER.indexOf(g.id);
    return i === -1 ? LANE_ORDER.length + categories.indexOf(g) : i;
  };
  const ordered = [...categories].sort((a, b) => laneRank(a) - laneRank(b));

  // Şerit yükseklikleri: bir hücredeki (aynı derinlik) en fazla düğüm sayısına göre
  let y = 0;
  for (const g of ordered) {
    const perDepth = new Map();
    g.children.forEach((n) => perDepth.set(n.depth, (perDepth.get(n.depth) || 0) + 1));
    const maxStack = Math.max(1, ...perDepth.values());
    const height = (maxStack - 1) * LAYOUT.SLOT_GAP + 2 * LAYOUT.LANE_PAD;
    g.lane = { y0: y, y1: y + height, cy: y + height / 2 };
    y += height + LAYOUT.LANE_GAP;
  }
  const totalH = y - LAYOUT.LANE_GAP;
  for (const g of ordered) {  // dikeyde ortala
    g.lane.y0 -= totalH / 2; g.lane.y1 -= totalH / 2; g.lane.cy -= totalH / 2;
  }

  // Derinlik sırasıyla yerleştir; aynı hücrede barycenter'a göre sırala
  for (let depth = 0; depth <= maxDepth; depth++) {
    for (const g of ordered) {
      const cell = g.children.filter((n) => n.depth === depth);
      if (!cell.length) continue;
      const bary = (n) => (n.deps.length ? n.deps.reduce((s, d) => s + d.ay, 0) / n.deps.length : g.lane.cy);
      cell.sort((a, b) => bary(a) - bary(b) || a.order - b.order);
      cell.forEach((n, i) => {
        n.ax = xOf(depth);
        n.ay = g.lane.cy + (i - (cell.length - 1) / 2) * LAYOUT.SLOT_GAP;
      });
    }
  }

  const x0 = xOf(0) - LAYOUT.BAND_PAD_X;
  const x1 = xOf(maxDepth) + LAYOUT.BAND_PAD_X;
  for (const g of ordered) { g.lane.x0 = x0; g.lane.x1 = x1; }

  return {
    ordered,
    bounds: {
      minX: x0 - LAYOUT.LABEL_SPACE,
      maxX: x1 + 30,
      minY: -totalH / 2 - 20,
      maxY: totalH / 2 + 20,
    },
  };
}

/* DAG bağları soldan sağa akan yumuşak "S" eğrileridir (kübik Bézier).
   Kontrol noktaları renderer ve sinyal parçacıkları için ortak hesaplanır. */
function linkCurve(link, t) {
  const { a, b } = link;
  const dx = Math.max(40, (b.x - a.x) * 0.5);
  const wobble = Math.sin(t * 0.6 + link.phase) * 5; // hafif "nefes alma"
  return {
    c1: { x: a.x + dx, y: a.y + wobble },
    c2: { x: b.x - dx, y: b.y - wobble },
  };
}

function cubicPoint(a, c1, c2, b, t) {
  const u = 1 - t;
  const uu = u * u, tt = t * t;
  return {
    x: uu * u * a.x + 3 * uu * t * c1.x + 3 * u * tt * c2.x + tt * t * b.x,
    y: uu * u * a.y + 3 * uu * t * c1.y + 3 * u * tt * c2.y + tt * t * b.y,
  };
}

// Eğrinin t noktasındaki teğeti (ok başlarının yönü için)
function cubicTangent(a, c1, c2, b, t) {
  const u = 1 - t;
  return {
    x: 3 * u * u * (c1.x - a.x) + 6 * u * t * (c2.x - c1.x) + 3 * t * t * (b.x - c2.x),
    y: 3 * u * u * (c1.y - a.y) + 6 * u * t * (c2.y - c1.y) + 3 * t * t * (b.y - c2.y),
  };
}

class PhysicsEngine {
  constructor(graph, { reducedMotion = false } = {}) {
    this.graph = graph;
    this.ampScale = reducedMotion ? 0.25 : 1;
  }

  step(dt, time) {
    const steps = Math.max(1, Math.ceil(dt / PHYS.SUBSTEP));
    const h = dt / steps;
    for (let s = 0; s < steps; s++) this.#integrate(h, time - dt + (s + 1) * h);
  }

  #integrate(h, t) {
    const { nodes, concepts, links } = this.graph;

    // 1–2) Anchor yayı + süzülme: hedef nokta yavaşça salınır.
    //      Uydunun hedefi ise ev sahibinin anlık konumu etrafındaki yörünge noktasıdır
    //      (ana kavramlar dizide önce geldiği için host bu adımda zaten güncel).
    for (const n of nodes) {
      let tx, ty;
      const host = n.host;
      if (host) {
        const count = host.subs.length;
        const outer = count > 9 && n.slot % 2 ? 1.3 : 1; // kalabalık halkada iki sıra
        const r = host.radius * host.scale + 6 + host.expand * (host.orbitR * outer - 6);
        const ang = host.spin + (n.slot / count) * TAU;
        tx = host.x + Math.cos(ang) * r;
        ty = host.y + Math.sin(ang) * r;
      } else {
        if (n.subs.length) n.spin += PHYS.SPIN * this.ampScale * (1 - n.expand) * h;
        const amp = n.floatAmp * this.ampScale;
        tx = n.ax + amp * Math.sin(t * n.freq[0] + n.phase[0]);
        ty = n.ay + amp * Math.cos(t * n.freq[1] + n.phase[1]);
      }
      n.fx = n.anchorK * (tx - n.x);
      n.fy = n.anchorK * (ty - n.y);
    }

    // 3) Önkoşul bağı yayları (Hooke yasası)
    for (const link of links) {
      const { a, b } = link;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 0.001;
      const f = (PHYS.K_LINK * (d - link.rest)) / d;
      a.fx += f * dx * PHYS.PARENT_SHARE;
      a.fy += f * dy * PHYS.PARENT_SHARE;
      b.fx -= f * dx;
      b.fy -= f * dy;
    }

    // 4) Yakın ana kavramlar arası itme (uydular yörüngede kalır, itişmez)
    for (let i = 0; i < concepts.length; i++) {
      const a = concepts[i];
      for (let j = i + 1; j < concepts.length; j++) {
        const b = concepts[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minD = a.radius + b.radius + PHYS.GAP;
        const d2 = dx * dx + dy * dy;
        if (d2 >= minD * minD) continue;
        const d = Math.sqrt(d2) || 0.001;
        const push = (PHYS.REPULSE * (minD - d)) / d;
        a.fx -= push * dx; a.fy -= push * dy;
        b.fx += push * dx; b.fy += push * dy;
      }
    }

    // 5) Entegrasyon + sönümleme (sürüklenen düğümü fare yönetir)
    const damp = Math.exp(-PHYS.DAMPING * h);
    for (const n of nodes) {
      if (n.dragged) continue;
      n.vx = (n.vx + n.fx * h) * damp;
      n.vy = (n.vy + n.fy * h) * damp;
      n.x += n.vx * h;
      n.y += n.vy * h;
    }
  }
}
