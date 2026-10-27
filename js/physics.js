/* =========================================================================
   physics.js — Graf modeli + yay (spring) fizik motoru
   -------------------------------------------------------------------------
   Her düğüm "ipe bağlı balon" gibi davranır:
     1) Anchor spring : düğüm, yerleşim (layout) noktasına bir yayla bağlıdır.
     2) Float         : bu hedef nokta, yavaş sinüs dalgalarıyla salınır →
                        düğüm kendi etrafında yumuşakça süzülür.
     3) Link spring   : ebeveyn–çocuk arasındaki bağ, dinlenme uzunluğunu
                        korumaya çalışan bir yaydır (sürükleyince çeker).
     4) Repulsion     : çok yaklaşan düğümler birbirini iter.
     5) Damping       : hız her adımda sönümlenir; sistem titreyip durulur.
   Entegrasyon: yarı-örtük (semi-implicit) Euler, sabit 120 Hz alt adımlarla
   → kare hızı dalgalansa bile kararlı.
   ========================================================================= */

const TAU = Math.PI * 2;

const PHYS = {
  K_ANCHOR: 14,     // balonun ipi: büyük = yerine daha sıkı bağlı
  K_LINK: 9,        // bağ yayı sertliği
  PARENT_SHARE: 0.35, // bağ kuvvetinin ebeveyne yansıyan oranı (çocuk ebeveyni hafifçe çeker)
  DAMPING: 4.2,     // sönümleme (1/sn) — düşük değer daha "zıplak"
  REPULSE: 30,      // itme sertliği
  GAP: 22,          // düğümler arası minimum boşluk (dünya birimi)
  SUBSTEP: 1 / 120,
};

// Yerleşim yarıçapları (dünya birimi)
const LAYOUT = { CATEGORY_R: 215, LEAF_R: 440, LEAF_STAGGER: 34, WORLD_R: 700 };

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(rgb, a) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
}

class GraphNode {
  constructor({ id, kind, title, label, def, code, js, quiz, traps, color, radius, depth, parent }) {
    Object.assign(this, { id, kind, title, label: label || title, def, code, js, quiz, traps, color, radius, depth, parent });
    this.rgb = hexToRgb(color);
    this.children = [];

    // Fizik durumu
    this.x = 0; this.y = 0;     // anlık konum
    this.vx = 0; this.vy = 0;   // hız
    this.fx = 0; this.fy = 0;   // bu adımda biriken kuvvet
    this.ax = 0; this.ay = 0;   // anchor (yerleşim) noktası
    this.angle = 0;             // kökten bakış açısı (etiket yönü için)
    this.anchorK = PHYS.K_ANCHOR * (kind === "root" ? 3 : 1);
    this.floatAmp = { root: 3, category: 7, leaf: 10 }[kind];
    this.phase = [Math.random() * TAU, Math.random() * TAU];
    this.freq = [0.35 + Math.random() * 0.35, 0.3 + Math.random() * 0.35];
    this.dragged = false;

    // Görsel durum (main.js yumuşak geçişlerle günceller)
    this.scale = 1; this.scaleV = 0;
    this.alpha = 1;
    this.hover = 0;
    this.selected = 0;
    this.match = 0; // arama eşleşmesi (0–1, yumuşak geçiş)
  }

  // Kökten bu düğüme kadar olan yol: [root, category, leaf]
  get path() {
    const path = [];
    for (let n = this; n; n = n.parent) path.unshift(n);
    return path;
  }

  get siblings() {
    return this.parent ? this.parent.children : [this];
  }
}

/**
 * KNOWLEDGE verisinden düğüm/bağ grafiği kurar ve radyal yerleşimi hesaplar.
 * Yaprak sayısına orantılı açısal dilimler: kalabalık kategori daha geniş yer kaplar.
 */
function buildGraph(data) {
  const nodes = [];
  const links = [];
  const byId = new Map();
  const parentLink = new Map(); // çocuk id → ebeveyne giden bağ

  const add = (node) => {
    nodes.push(node);
    byId.set(node.id, node);
    if (node.parent) {
      node.parent.children.push(node);
      const link = { a: node.parent, b: node, rest: 0, phase: Math.random() * TAU, bias: (Math.random() - 0.5) * 0.12, hot: 0 };
      links.push(link);
      parentLink.set(node.id, link);
    }
    return node;
  };

  const root = add(new GraphNode({
    ...data.root, kind: "root", color: "#e2e8f0", radius: 48, depth: 0, parent: null,
  }));

  const totalLeaves = data.categories.reduce((sum, c) => sum + c.concepts.length, 0);
  const step = TAU / totalLeaves;
  let cursor = -Math.PI / 2 - (data.categories[0].concepts.length * step) / 2;

  for (const cat of data.categories) {
    const sector = cat.concepts.length * step;
    const catAngle = cursor + sector / 2;
    const catNode = add(new GraphNode({
      id: cat.id, kind: "category", title: cat.title, label: cat.label, def: cat.def,
      color: cat.color, radius: 20, depth: 1, parent: root,
    }));
    catNode.angle = catAngle;
    catNode.ax = Math.cos(catAngle) * LAYOUT.CATEGORY_R;
    catNode.ay = Math.sin(catAngle) * LAYOUT.CATEGORY_R;

    cat.concepts.forEach((concept, j) => {
      const angle = cursor + (j + 0.5) * step;
      const r = LAYOUT.LEAF_R + (j % 2 ? LAYOUT.LEAF_STAGGER : -LAYOUT.LEAF_STAGGER / 3);
      const leaf = add(new GraphNode({
        ...concept, kind: "leaf", color: cat.color, radius: 7, depth: 2, parent: catNode,
      }));
      leaf.angle = angle;
      leaf.ax = Math.cos(angle) * r;
      leaf.ay = Math.sin(angle) * r;
    });
    cursor += sector;
  }

  // Bağ dinlenme uzunlukları = anchor noktaları arası mesafe
  for (const link of links) {
    link.rest = Math.hypot(link.b.ax - link.a.ax, link.b.ay - link.a.ay);
  }

  // Başlangıç: herkes merkezde → yaylar düğümleri dışarı "patlatır" (açılış animasyonu)
  for (const n of nodes) {
    n.x = n.ax * 0.04 + (Math.random() - 0.5) * 20;
    n.y = n.ay * 0.04 + (Math.random() - 0.5) * 20;
  }

  return { nodes, links, byId, parentLink, root };
}

/* Bağlar hafifçe kıvrılan, nefes alan eğrilerdir (quadratic Bézier).
   Kontrol noktası, renderer ve sinyal parçacıkları için ortak hesaplanır. */
function linkControlPoint(link, t) {
  const { a, b } = link;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const bend = 0.09 * Math.sin(t * 0.6 + link.phase) + link.bias;
  return { x: mx - (b.y - a.y) * bend, y: my + (b.x - a.x) * bend };
}

function quadPoint(a, c, b, t) {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
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
    const { nodes, links } = this.graph;

    // 1–2) Anchor yayı + süzülme (float): hedef nokta yavaşça salınır
    for (const n of nodes) {
      const amp = n.floatAmp * this.ampScale;
      const tx = n.ax + amp * Math.sin(t * n.freq[0] + n.phase[0]);
      const ty = n.ay + amp * Math.cos(t * n.freq[1] + n.phase[1]);
      n.fx = n.anchorK * (tx - n.x);
      n.fy = n.anchorK * (ty - n.y);
    }

    // 3) Bağ yayları (Hooke yasası: F = k · uzama)
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

    // 4) Yakın düğümler arası itme
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
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
