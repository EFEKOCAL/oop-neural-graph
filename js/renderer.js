/* =========================================================================
   renderer.js — Kamera, efektler ve Canvas çizimi
   -------------------------------------------------------------------------
   Camera   : dünya koordinatı ↔ ekran koordinatı, yumuşak takip, zoom
   Effects  : önkoşul bağları boyunca akan sinyaller, halkalar, kıvılcımlar.
              Öğrenilmiş düğümlerden çıkan bağlarda sinyal daha sık, hızlı
              ve parlak akar (mikro ödül).
   Renderer : her karede arka plan → kategori şeritleri → bağlar → sinyaller
              → düğümler → etiketler → efektler sırasıyla çizer.
   Parlama (glow) için pahalı shadowBlur yerine "lighter" (additive) karışım
   + geniş/şeffaf ve ince/parlak iki geçiş kullanılır → 60 fps.
   ========================================================================= */

const LEARNED_RGB = [74, 222, 128];  // öğrenilen düğüm rengi
const TARGET_RGB = [251, 191, 36];   // Müfredat Modu hedef halkası

class Camera {
  constructor() {
    this.x = 0; this.y = 0; this.scale = 0.3;     // anlık
    this.tx = 0; this.ty = 0; this.ts = 0.3;      // hedef
    this.vcx = 0; this.vcy = 0;                   // görünür alanın ekran merkezi
    this.tvcx = 0; this.tvcy = 0;
  }

  update(dt) {
    const k = 1 - Math.exp(-5.5 * dt); // kare hızından bağımsız yumuşak takip
    this.x += (this.tx - this.x) * k;
    this.y += (this.ty - this.y) * k;
    this.scale += (this.ts - this.scale) * k;
    this.vcx += (this.tvcx - this.vcx) * k;
    this.vcy += (this.tvcy - this.vcy) * k;
  }

  setTarget(x, y, scale) {
    this.tx = x; this.ty = y;
    if (scale) this.ts = scale;
  }

  // Kullanıcı pan/zoom yaptığında anlık ve hedef değer birlikte kayar (kavga etmesinler)
  panBy(dx, dy) {
    this.x += dx; this.y += dy;
    this.tx += dx; this.ty += dy;
  }

  toWorld(sx, sy) {
    return { x: (sx - this.vcx) / this.scale + this.x, y: (sy - this.vcy) / this.scale + this.y };
  }

  // İmlecin altındaki dünya noktası sabit kalacak şekilde yakınlaştır
  zoomAt(sx, sy, factor, min, max) {
    const before = this.toWorld(sx, sy);
    this.scale = Math.min(max, Math.max(min, this.scale * factor));
    this.ts = this.scale;
    const after = this.toWorld(sx, sy);
    this.panBy(before.x - after.x, before.y - after.y);
  }
}

class Effects {
  constructor(graph, curriculum, { reducedMotion = false } = {}) {
    this.graph = graph;
    this.curriculum = curriculum;
    this.reduced = reducedMotion;
    this.pulses = [];   // bağlar boyunca akan sinyaller
    this.ripples = [];  // genişleyen halkalar
    this.sparks = [];   // kıvılcımlar
    this.ambientTimer = 0.6;
  }

  update(dt) {
    // Ortam sinyalleri: öğrenilmiş düğümlerden çıkan bağlar daha sık seçilir
    if (!this.reduced) {
      this.ambientTimer -= dt;
      if (this.ambientTimer <= 0) {
        const links = this.graph.links;
        const learnedLinks = links.filter((l) => this.curriculum.isLearned(l.a));
        const pool = learnedLinks.length && Math.random() < 0.6 ? learnedLinks : links;
        const link = pool[(Math.random() * pool.length) | 0];
        const fromLearned = this.curriculum.isLearned(link.a);
        this.pulses.push({
          link, t: 0, chain: null,
          speed: fromLearned ? 1.1 + Math.random() * 0.6 : 0.4 + Math.random() * 0.4,
          size: fromLearned ? 1.6 : 1,
        });
        this.ambientTimer = learnedLinks.length ? 0.05 + Math.random() * 0.08 : 0.08 + Math.random() * 0.12;
      }
    }

    const next = [];
    for (const p of this.pulses) {
      p.t += p.speed * dt;
      if (p.t < 1) { next.push(p); continue; }
      if (p.chain) {
        // Zincir sinyal: bir sonraki bağa atla; son düğüme ulaşınca halka bırak
        if (p.chain.length) next.push({ ...p, link: p.chain[0], chain: p.chain.slice(1), t: 0 });
        else this.ripple(p.link.b, 0.7);
      }
    }
    this.pulses = next;

    this.ripples = this.ripples.filter((r) => (r.age += dt) < r.delay + r.dur);

    const drag = Math.exp(-2.8 * dt);
    this.sparks = this.sparks.filter((s) => {
      s.life -= dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      s.vx *= drag; s.vy *= drag;
      return s.life > 0;
    });
  }

  ripple(node, dur = 0.9, delay = 0, rgb = null) {
    this.ripples.push({ node, dur, delay, age: 0, rgb });
  }

  // Tıklama ödülü: çift halka + kıvılcım patlaması
  burst(node, rgb = node.drawRgb) {
    this.ripple(node, 0.9, 0, rgb);
    this.ripple(node, 0.9, 0.14, rgb);
    const count = this.reduced ? 6 : 22;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * TAU;
      const speed = 70 + Math.random() * 190;
      const life = 0.5 + Math.random() * 0.6;
      this.sparks.push({
        x: node.x, y: node.y,
        vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
        life, maxLife: life, size: 1 + Math.random() * 1.8, rgb,
      });
    }
  }

  // En uzun önkoşul zinciri boyunca, kaynaktan seçilen düğüme akan sinyal
  signal(node) {
    const chain = [];
    for (let cur = node; cur.deps.length;) {
      const dep = cur.deps.reduce((best, d) => (d.depth > best.depth ? d : best));
      chain.unshift(this.graph.linkByKey.get(`${dep.id}>${cur.id}`));
      cur = dep;
    }
    if (chain.length) this.pulses.push({ link: chain[0], chain: chain.slice(1), t: 0, speed: 3.2, size: 2.2 });
  }

  // "Öğrendim" ödülü: düğümün açtığı tüm kavramlara aynı anda sinyal
  unlock(node) {
    for (const d of node.dependents) {
      const link = this.graph.linkByKey.get(`${node.id}>${d.id}`);
      this.pulses.push({ link, chain: [], t: 0, speed: 1.6, size: 2.6 });
    }
  }
}

class GraphRenderer {
  constructor(canvas, graph, camera, effects) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.graph = graph;
    this.camera = camera;
    this.effects = effects;
    this.w = 0; this.h = 0; this.dpr = 1;
    this.stars = Array.from({ length: 150 }, () => ({
      x: Math.random(), y: Math.random(), z: 0.2 + Math.random() * 0.8, tw: Math.random() * TAU,
    }));
  }

  resize(w, h, dpr) {
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
  }

  // Zoom seviyesine göre okunabilir kalan ekran-sabit font boyutu (dünya birimine çevrilmiş)
  #font(basePx) {
    const s = this.camera.scale;
    const screenPx = basePx * Math.min(1.15, Math.max(0.72, s / 0.75));
    return screenPx / s;
  }

  draw(time) {
    const { ctx, dpr, camera: cam } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, this.w, this.h);
    this.#drawStars(time);

    // Dünya koordinatlarına geç: (dünya - kamera) * ölçek + ekran merkezi
    ctx.setTransform(
      dpr * cam.scale, 0, 0, dpr * cam.scale,
      dpr * (cam.vcx - cam.x * cam.scale),
      dpr * (cam.vcy - cam.y * cam.scale)
    );
    const px = 1 / cam.scale; // 1 ekran pikselinin dünya karşılığı

    this.#drawLanes(px);
    this.#drawLinks(time, px);
    this.#drawPulses(time, px);
    for (const n of this.graph.nodes) this.#drawNode(n, time, px);
    for (const n of this.graph.nodes) this.#drawLabel(n, px);
    this.#drawRipples(px);
    this.#drawSparks(px);
  }

  #drawStars(time) {
    const { ctx, w, h, camera: cam } = this;
    ctx.fillStyle = "#c7d2fe";
    for (const s of this.stars) {
      // Paralaks: uzak yıldızlar kamerayla daha az hareket eder
      const sx = (((s.x * w - cam.x * cam.scale * 0.06 * s.z) % w) + w) % w;
      const sy = (((s.y * h - cam.y * cam.scale * 0.06 * s.z) % h) + h) % h;
      ctx.globalAlpha = s.z * (0.25 + 0.2 * Math.sin(time * 1.3 + s.tw));
      const size = s.z * 1.6;
      ctx.fillRect(sx, sy, size, size);
    }
    ctx.globalAlpha = 1;
  }

  // Kategori şeritleri: hafif renkli bant + solda kategori adı
  #drawLanes(px) {
    const ctx = this.ctx;
    ctx.globalCompositeOperation = "source-over";
    for (const g of this.graph.categories) {
      const { x0, x1, y0, y1, cy } = g.lane;
      // Şeridin görünürlüğü, içindeki düğümlerin ortalama görünürlüğünü izler
      const alpha = g.children.reduce((s, n) => s + n.alpha, 0) / g.children.length;
      ctx.globalAlpha = 0.35 + 0.65 * alpha;
      ctx.fillStyle = rgba(g.rgb, 0.035);
      ctx.strokeStyle = rgba(g.rgb, 0.12);
      ctx.lineWidth = 1 * px;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 18);
      else ctx.rect(x0, y0, x1 - x0, y1 - y0);
      ctx.fill();
      ctx.stroke();

      ctx.font = `700 ${this.#font(12.5)}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = rgba(g.rgb, 0.9);
      ctx.fillText(g.title, x0 - 14 * px, cy);
    }
    ctx.globalAlpha = 1;
  }

  #drawLinks(time, px) {
    const ctx = this.ctx;
    ctx.lineCap = "round";
    for (const link of this.graph.links) {
      const { a, b } = link;
      const alpha = Math.min(a.alpha, b.alpha);
      const hot = link.hot;
      const learned = a.learned; // öğrenilmiş önkoşuldan çıkan bağ daha canlı
      const { c1, c2 } = linkCurve(link, time);
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, rgba(a.drawRgb, 1));
      grad.addColorStop(1, rgba(b.drawRgb, 1));

      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, b.x, b.y);
      // 1. geçiş: geniş ve şeffaf → glow
      ctx.globalAlpha = alpha * (0.06 + 0.2 * hot + 0.08 * learned);
      ctx.lineWidth = (6 + 6 * hot + 3 * learned) * px;
      ctx.stroke();
      // 2. geçiş: ince ve parlak → çekirdek çizgi
      ctx.globalAlpha = alpha * (0.26 + 0.55 * hot + 0.2 * learned);
      ctx.lineWidth = (1 + 1.2 * hot) * px;
      ctx.stroke();

      // Yön oku: hedef düğümün hemen önünde küçük üçgen
      const t = 1 - Math.min(0.35, (b.radius * b.scale + 6 * px) / (link.rest || 1));
      const p = cubicPoint(a, c1, c2, b, t);
      const tan = cubicTangent(a, c1, c2, b, t);
      const ang = Math.atan2(tan.y, tan.x);
      const s = (4 + 1.5 * hot) * px;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = alpha * (0.45 + 0.5 * hot);
      ctx.fillStyle = rgba(b.drawRgb, 1);
      ctx.beginPath();
      ctx.moveTo(p.x + Math.cos(ang) * s, p.y + Math.sin(ang) * s);
      ctx.lineTo(p.x + Math.cos(ang + 2.5) * s, p.y + Math.sin(ang + 2.5) * s);
      ctx.lineTo(p.x + Math.cos(ang - 2.5) * s, p.y + Math.sin(ang - 2.5) * s);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  #drawPulses(time, px) {
    const ctx = this.ctx;
    ctx.globalCompositeOperation = "lighter";
    for (const p of this.effects.pulses) {
      const { a, b } = p.link;
      const { c1, c2 } = linkCurve(p.link, time);
      const alpha = Math.min(a.alpha, b.alpha) * (p.chain ? 1 : Math.sin(Math.PI * p.t));
      // Kuyruk (trail): biraz geride iki soluk nokta
      for (let k = 2; k >= 0; k--) {
        const t = Math.max(0, p.t - k * 0.045);
        const pt = cubicPoint(a, c1, c2, b, t);
        const fade = 1 - k * 0.35;
        ctx.fillStyle = rgba(b.drawRgb, 0.16 * alpha * fade);
        ctx.beginPath(); ctx.arc(pt.x, pt.y, p.size * 5 * px, 0, TAU); ctx.fill();
        ctx.fillStyle = rgba([255, 255, 255], 0.9 * alpha * fade);
        ctx.beginPath(); ctx.arc(pt.x, pt.y, p.size * 1.3 * px * fade, 0, TAU); ctx.fill();
      }
    }
  }

  #drawNode(n, time, px) {
    const ctx = this.ctx;
    const r = n.radius * n.scale;
    const rgb = n.drawRgb;

    // Hale (halo): additive radial gradient
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = Math.min(1, n.alpha * (0.28 + 0.45 * n.hover + 0.35 * n.selected + 0.6 * n.match + 0.5 * n.target + 0.25 * n.learned));
    const haloR = r * 3.4;
    const halo = ctx.createRadialGradient(n.x, n.y, r * 0.3, n.x, n.y, haloR);
    halo.addColorStop(0, rgba(rgb, 0.85));
    halo.addColorStop(1, rgba(rgb, 0));
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(n.x, n.y, haloR, 0, TAU); ctx.fill();

    // Çekirdek: ortası beyaza yakın, kenarı düğüm rengi → "ışık yayan küre"
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = n.alpha;
    const core = ctx.createRadialGradient(n.x - r * 0.3, n.y - r * 0.3, r * 0.1, n.x, n.y, r);
    core.addColorStop(0, "#ffffff");
    core.addColorStop(0.35, rgba(rgb, 1));
    core.addColorStop(1, rgba(rgb.map((v) => v * 0.45), 1));
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, TAU); ctx.fill();

    // Öğrenildi: düğümün içinde ✓
    if (n.learned > 0.05) {
      ctx.globalAlpha = n.alpha * n.learned;
      ctx.strokeStyle = "#04140a";
      ctx.lineWidth = Math.max(1.6 * px, r * 0.22);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(n.x - r * 0.42, n.y + r * 0.02);
      ctx.lineTo(n.x - r * 0.1, n.y + r * 0.34);
      ctx.lineTo(n.x + r * 0.44, n.y - r * 0.3);
      ctx.stroke();
    }

    // Seçili düğüm: dönen kesikli halka
    if (n.selected > 0.01) {
      ctx.globalAlpha = n.alpha * n.selected;
      ctx.strokeStyle = rgba(rgb, 0.95);
      ctx.lineWidth = 1.6 * px;
      ctx.setLineDash([5 * px, 5 * px]);
      ctx.lineDashOffset = -time * 24 * px;
      ctx.beginPath(); ctx.arc(n.x, n.y, r + 8 * px, 0, TAU); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Arama eşleşmesi: nabız gibi atan dolu halka
    if (n.match > 0.01) {
      const pulse = 0.5 + 0.5 * Math.sin(time * 4 + n.phase[0]);
      ctx.globalAlpha = n.alpha * n.match * (0.45 + 0.45 * pulse);
      ctx.strokeStyle = rgba(rgb, 1);
      ctx.lineWidth = 2 * px;
      ctx.beginPath(); ctx.arc(n.x, n.y, r + (5 + 6 * pulse) * px, 0, TAU); ctx.stroke();
    }

    // Müfredat hedefi: altın renkli nabız + dışa yayılan dalga
    if (n.target > 0.01) {
      const pulse = 0.5 + 0.5 * Math.sin(time * 3);
      ctx.globalAlpha = n.target * (0.6 + 0.4 * pulse);
      ctx.strokeStyle = rgba(TARGET_RGB, 1);
      ctx.lineWidth = 2.2 * px;
      ctx.beginPath(); ctx.arc(n.x, n.y, r + (6 + 3 * pulse) * px, 0, TAU); ctx.stroke();
      const wave = (time * 0.7 + n.phase[0] / TAU) % 1;
      ctx.globalAlpha = n.target * (1 - wave) * 0.6;
      ctx.lineWidth = 1.4 * px;
      ctx.beginPath(); ctx.arc(n.x, n.y, r + (8 + wave * 28) * px, 0, TAU); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  #drawLabel(n, px) {
    const ctx = this.ctx;
    const r = n.radius * n.scale;
    const focused = n.hover > 0.5 || n.selected > 0.5 || n.match > 0.5 || n.target > 0.5;
    const text = focused ? n.title : n.label;
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = Math.max(0.1, n.alpha);
    ctx.font = `${focused ? 600 : 500} ${this.#font(12)}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(6, 9, 18, 0.88)";
    ctx.lineWidth = 3.5 * px;
    const y = n.y + r + 6 * px;
    ctx.strokeText(text, n.x, y);
    ctx.fillStyle = focused ? "#ffffff" : n.learned > 0.5 ? "rgba(187, 247, 208, 0.92)" : "rgba(203, 213, 225, 0.88)";
    ctx.fillText(text, n.x, y);
  }

  #drawRipples(px) {
    const ctx = this.ctx;
    ctx.globalCompositeOperation = "lighter";
    for (const rp of this.effects.ripples) {
      const p = (rp.age - rp.delay) / rp.dur;
      if (p < 0) continue;
      const n = rp.node;
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      ctx.globalAlpha = Math.pow(1 - p, 2) * 0.9;
      ctx.strokeStyle = rgba(rp.rgb || n.drawRgb, 1);
      ctx.lineWidth = 2 * px;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius * n.scale + eased * 64 * px, 0, TAU);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  #drawSparks(px) {
    const ctx = this.ctx;
    ctx.globalCompositeOperation = "lighter";
    for (const s of this.effects.sparks) {
      const life = s.life / s.maxLife;
      ctx.fillStyle = rgba(s.rgb, life);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.size * px * (0.5 + life), 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  // Ekran noktasının altındaki düğüm (küçük düğümler için cömert tıklama alanı)
  hitTest(sx, sy) {
    const p = this.camera.toWorld(sx, sy);
    const px = 1 / this.camera.scale;
    let best = null;
    let bestD = Infinity;
    for (const n of this.graph.nodes) {
      const hitR = Math.max(n.radius * n.scale, 10 * px) + 5 * px;
      const d = Math.hypot(p.x - n.x, p.y - n.y);
      if (d <= hitR && d < bestD) { best = n; bestD = d; }
    }
    return best;
  }
}
