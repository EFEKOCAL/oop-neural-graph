/* =========================================================================
   renderer.js — Kamera, efektler ve Canvas çizimi
   -------------------------------------------------------------------------
   Camera   : dünya koordinatı ↔ ekran koordinatı, yumuşak takip, zoom
   Effects  : nöral sinyal parçacıkları, dalga halkaları, kıvılcımlar
   Renderer : her karede arka plan → bağlar → sinyaller → düğümler →
              etiketler → efektler sırasıyla çizer.
   Parlama (glow) için pahalı shadowBlur yerine "lighter" (additive)
   karışım + geniş/şeffaf ve ince/parlak iki geçiş kullanılır → 60 fps.
   ========================================================================= */

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
  constructor(graph, { reducedMotion = false } = {}) {
    this.graph = graph;
    this.reduced = reducedMotion;
    this.pulses = [];   // bağlar boyunca akan sinyaller
    this.ripples = [];  // genişleyen halkalar
    this.sparks = [];   // tıklama kıvılcımları
    this.ambientTimer = 0.6;
  }

  update(dt) {
    // Ortam sinyalleri: rastgele bir bağda kökten dışarı doğru akan nöral "ateşleme"
    if (!this.reduced) {
      this.ambientTimer -= dt;
      if (this.ambientTimer <= 0) {
        this.ambientTimer = 0.07 + Math.random() * 0.13;
        const links = this.graph.links;
        const link = links[(Math.random() * links.length) | 0];
        this.pulses.push({ link, t: 0, speed: 0.45 + Math.random() * 0.5, size: 1, chain: null });
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

  ripple(node, dur = 0.9, delay = 0) {
    this.ripples.push({ node, dur, delay, age: 0 });
  }

  // Tıklama ödülü: çift halka + kıvılcım patlaması
  burst(node) {
    this.ripple(node, 0.9);
    this.ripple(node, 0.9, 0.14);
    const count = this.reduced ? 6 : 22;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * TAU;
      const speed = 70 + Math.random() * 190;
      const life = 0.5 + Math.random() * 0.6;
      this.sparks.push({
        x: node.x, y: node.y,
        vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
        life, maxLife: life, size: 1 + Math.random() * 1.8, rgb: node.rgb,
      });
    }
  }

  // Kökten seçilen düğüme kadar bağ bağ ilerleyen parlak sinyal
  signal(path) {
    const links = path.slice(1).map((n) => this.graph.parentLink.get(n.id));
    if (!links.length) return;
    this.pulses.push({ link: links[0], chain: links.slice(1), t: 0, speed: 2.6, size: 2.3 });
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
    // Çizim sırası: önce yapraklar, en son kök (kök en üstte görünsün)
    this.drawOrder = [...graph.nodes].sort((a, b) => b.depth - a.depth);
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
    const screenPx = basePx * Math.min(1.15, Math.max(0.62, s / 0.75));
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

    this.#drawLinks(time, px);
    this.#drawPulses(time, px);
    for (const n of this.drawOrder) this.#drawNode(n, time, px);
    for (const n of this.drawOrder) this.#drawLabel(n, px);
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

  #drawLinks(time, px) {
    const ctx = this.ctx;
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    for (const link of this.graph.links) {
      const { a, b } = link;
      const alpha = Math.min(a.alpha, b.alpha);
      const hot = link.hot;
      const c = linkControlPoint(link, time);
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, rgba(a.rgb, 1));
      grad.addColorStop(1, rgba(b.rgb, 1));
      ctx.strokeStyle = grad;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(c.x, c.y, b.x, b.y);
      // 1. geçiş: geniş ve şeffaf → glow
      ctx.globalAlpha = alpha * (0.07 + 0.2 * hot);
      ctx.lineWidth = (7 + 7 * hot) * px;
      ctx.stroke();
      // 2. geçiş: ince ve parlak → çekirdek çizgi
      ctx.globalAlpha = alpha * (0.32 + 0.55 * hot);
      ctx.lineWidth = (1 + 1.3 * hot) * px;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  #drawPulses(time, px) {
    const ctx = this.ctx;
    ctx.globalCompositeOperation = "lighter";
    for (const p of this.effects.pulses) {
      const { a, b } = p.link;
      const c = linkControlPoint(p.link, time);
      const alpha = Math.min(a.alpha, b.alpha) * (p.chain ? 1 : Math.sin(Math.PI * p.t));
      // Kuyruk (trail): biraz geride iki soluk nokta
      for (let k = 2; k >= 0; k--) {
        const t = Math.max(0, p.t - k * 0.045);
        const pt = quadPoint(a, c, b, t);
        const fade = 1 - k * 0.35;
        ctx.fillStyle = rgba(b.rgb, 0.16 * alpha * fade);
        ctx.beginPath(); ctx.arc(pt.x, pt.y, p.size * 5 * px, 0, TAU); ctx.fill();
        ctx.fillStyle = rgba([255, 255, 255], 0.9 * alpha * fade);
        ctx.beginPath(); ctx.arc(pt.x, pt.y, p.size * 1.3 * px * fade, 0, TAU); ctx.fill();
      }
    }
  }

  #drawNode(n, time, px) {
    const ctx = this.ctx;
    const r = n.radius * n.scale;

    // Hale (halo): additive radial gradient
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = Math.min(1, n.alpha * (0.3 + 0.45 * n.hover + 0.35 * n.selected + 0.6 * n.match));
    const haloR = r * (n.kind === "leaf" ? 3.6 : 2.6);
    const halo = ctx.createRadialGradient(n.x, n.y, r * 0.3, n.x, n.y, haloR);
    halo.addColorStop(0, rgba(n.rgb, 0.85));
    halo.addColorStop(1, rgba(n.rgb, 0));
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(n.x, n.y, haloR, 0, TAU); ctx.fill();

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = n.alpha;

    if (n.kind === "root") {
      this.#drawRoot(n, r, time, px);
    } else {
      // Çekirdek: ortası beyaza yakın, kenarı kategori rengi → "ışık yayan küre"
      const core = ctx.createRadialGradient(n.x - r * 0.3, n.y - r * 0.3, r * 0.1, n.x, n.y, r);
      core.addColorStop(0, "#ffffff");
      core.addColorStop(0.35, rgba(n.rgb, 1));
      core.addColorStop(1, rgba(n.rgb.map((v) => v * 0.45), 1));
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, TAU); ctx.fill();
    }

    // Seçili düğüm: dönen kesikli halka
    if (n.selected > 0.01) {
      ctx.globalAlpha = n.alpha * n.selected;
      ctx.strokeStyle = rgba(n.rgb, 0.95);
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
      ctx.strokeStyle = rgba(n.rgb, 1);
      ctx.lineWidth = 2 * px;
      ctx.beginPath(); ctx.arc(n.x, n.y, r + (5 + 6 * pulse) * px, 0, TAU); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  #drawRoot(n, r, time, px) {
    const ctx = this.ctx;
    // İç disk
    const disk = ctx.createRadialGradient(n.x, n.y - r * 0.4, r * 0.1, n.x, n.y, r);
    disk.addColorStop(0, "#1c2a4a");
    disk.addColorStop(1, "#0a1020");
    ctx.fillStyle = disk;
    ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, TAU); ctx.fill();

    // Dönen gökkuşağı halkası: 5 kategorinin renkleri
    let ring = "#4fc3f7";
    if (ctx.createConicGradient) {
      ring = ctx.createConicGradient(time * 0.5, n.x, n.y);
      const colors = n.children.map((c) => c.color);
      colors.forEach((col, i) => ring.addColorStop(i / colors.length, col));
      ring.addColorStop(1, colors[0]);
    }
    ctx.strokeStyle = ring;
    ctx.lineWidth = Math.max(2.5 * px, r * 0.07);
    ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, TAU); ctx.stroke();

    // Kök yazısı düğümle birlikte ölçeklenir
    ctx.fillStyle = "#f1f5f9";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${r * 0.27}px Inter, system-ui, sans-serif`;
    ctx.fillText("Object Oriented", n.x, n.y - r * 0.16);
    ctx.fillText("Programming", n.x, n.y + r * 0.18);
  }

  #drawLabel(n, px) {
    if (n.kind === "root") return;
    const ctx = this.ctx;
    const r = n.radius * n.scale;
    const focused = n.hover > 0.5 || n.selected > 0.5 || n.match > 0.5;
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = Math.max(0.12, n.alpha);
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(6, 9, 18, 0.85)";
    ctx.lineWidth = 3.5 * px;
    ctx.textBaseline = "middle";

    if (n.kind === "category") {
      ctx.font = `700 ${this.#font(14)}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      const y = n.y + r + 15 * px;
      ctx.strokeText(n.label, n.x, y);
      ctx.fillStyle = rgba(n.rgb, 1);
      ctx.fillText(n.label, n.x, y);
      return;
    }

    // Yaprak etiketleri radyal yazılır: kökten dışarı doğru, sol yarıda ters çevrilir
    const text = focused ? n.title : n.label;
    const flip = Math.cos(n.angle) < 0;
    ctx.save();
    ctx.translate(n.x, n.y);
    ctx.rotate(flip ? n.angle + Math.PI : n.angle);
    ctx.textAlign = flip ? "right" : "left";
    ctx.font = `${focused ? 600 : 500} ${this.#font(12.5)}px Inter, system-ui, sans-serif`;
    const offset = (r + 7 * px) * (flip ? -1 : 1);
    ctx.strokeText(text, offset, 0);
    ctx.fillStyle = focused ? "#ffffff" : "rgba(203, 213, 225, 0.88)";
    ctx.fillText(text, offset, 0);
    ctx.restore();
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
      ctx.strokeStyle = rgba(n.rgb, 1);
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

  // Ekran noktasının altındaki düğüm (küçük yapraklar için cömert tıklama alanı)
  hitTest(sx, sy) {
    const p = this.camera.toWorld(sx, sy);
    const px = 1 / this.camera.scale;
    for (let i = this.drawOrder.length - 1; i >= 0; i--) {
      const n = this.drawOrder[i];
      const hitR = Math.max(n.radius * n.scale, 9 * px) + 5 * px;
      const dx = p.x - n.x;
      const dy = p.y - n.y;
      if (dx * dx + dy * dy <= hitR * hitR) return n;
    }
    return null;
  }
}
