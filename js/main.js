/* =========================================================================
   main.js — Uygulama denetleyicisi (controller)
   -------------------------------------------------------------------------
   Modülleri birbirine bağlar:
     KNOWLEDGE → buildGraph → PhysicsEngine (konum)
                            → GraphRenderer (çizim) + Effects (parçacık)
                            → InfoPanel (sağ panel)
                            → GraphSearch (arama/filtre)
   Ayrıca giriş (fare/dokunma/tekerlek/klavye), kamera odağı,
   requestAnimationFrame döngüsü ve Service Worker kaydını yönetir.
   ========================================================================= */

class App {
  #canvas;
  #graph;
  #physics;
  #camera;
  #effects;
  #renderer;
  #panel;
  #search;
  #legendButtons = new Map(); // kategori düğümü → buton

  #hovered = null;
  #selected = null;
  #preview = null; // paneldeki chip üzerine gelinen düğüm
  #fit = 0.5;      // tüm grafı sığdıran ölçek
  #time = 0;
  #last = 0;
  #pointer = null; // aktif sürükleme/pan durumu

  constructor() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.#canvas = document.getElementById("graph");
    this.#graph = buildGraph(KNOWLEDGE);
    this.#physics = new PhysicsEngine(this.#graph, { reducedMotion });
    this.#camera = new Camera();
    this.#effects = new Effects(this.#graph, { reducedMotion });
    this.#renderer = new GraphRenderer(this.#canvas, this.#graph, this.#camera, this.#effects);
    this.#panel = new InfoPanel(document.getElementById("panel"), {
      onNavigate: (node) => this.select(node),
      onPreview: (node) => { this.#preview = node; },
      onClose: () => this.select(null),
      onQuizSolved: (node, firstTime) => this.#celebrate(node, firstTime),
    });
    this.#search = new GraphSearch(this.#graph);
  }

  start() {
    this.#buildLegend();
    this.#buildA11yNav();
    this.#bindInput();
    this.#bindSearch();
    window.addEventListener("resize", () => this.#resize());
    this.#resize();

    // Açılış: kamera uzaktan yakınlaşır, düğümler merkezden dışarı açılır
    const cam = this.#camera;
    cam.vcx = cam.tvcx; cam.vcy = cam.tvcy;
    cam.scale = this.#fit * 0.55;
    cam.setTarget(0, 0, this.#fit);

    requestAnimationFrame((t) => this.#frame(t));
  }

  /* ---------------- Ana döngü (~60 fps) ---------------- */
  #frame(now) {
    // dt'yi sınırla: sekme arka plandan dönünce fizik "patlamasın"
    const dt = this.#last ? Math.min(0.05, (now - this.#last) / 1000) : 1 / 60;
    this.#last = now;
    this.#time += dt;

    this.#physics.step(dt, this.#time);
    this.#updateVisualState(dt);
    this.#effects.update(dt);
    this.#camera.update(dt);
    this.#renderer.draw(this.#time);

    requestAnimationFrame((t) => this.#frame(t));
  }

  // Hover/seçim/arama durumlarını yumuşak geçişlerle düğümlere yansıtır
  #updateVisualState(dt) {
    const search = this.#search.active ? this.#search : null;
    const focusNode = this.#preview || this.#hovered || this.#selected;
    let focus = null;
    if (search) {
      // Arama aktifken: eşleşenler + kökten onlara giden yol görünür, gerisi soluk
      focus = search.focus;
    } else if (focusNode) {
      focus = new Set(focusNode.path);
      focusNode.children.forEach((c) => focus.add(c));
    }
    const dimmed = search ? 0.1 : 0.2;
    const k = 1 - Math.exp(-10 * dt);

    for (const n of this.#graph.nodes) {
      const alphaT = !focus || focus.has(n) ? 1 : dimmed;
      const hoverT = n === this.#hovered || n === this.#preview ? 1 : 0;
      const selT = n === this.#selected ? 1 : 0;
      const matchT = search && search.matches.has(n) ? 1 : 0;
      n.alpha += (alphaT - n.alpha) * k;
      n.hover += (hoverT - n.hover) * k;
      n.selected += (selT - n.selected) * k;
      n.match += (matchT - n.match) * k;

      // Ölçek yayı: hedefe "boing" diye oturur (tıklamada scaleV'ye darbe verilir)
      const scaleT = 1 + 0.35 * hoverT + 0.18 * selT;
      n.scaleV += (260 * (scaleT - n.scale) - 18 * n.scaleV) * dt;
      n.scale += n.scaleV * dt;
    }
    for (const link of this.#graph.links) {
      const hotT = focus && focus.has(link.a) && focus.has(link.b) ? 1 : 0;
      link.hot += (hotT - link.hot) * k;
    }
  }

  /* ---------------- Seçim ---------------- */
  select(node) {
    if (!node) {
      this.#selected = null;
      this.#panel.hide();
      document.body.classList.remove("panel-open");
      this.#updateViewport();
      this.#camera.setTarget(0, 0, this.#fit);
      this.#syncLegend();
      return;
    }
    this.#selected = node;
    node.scaleV += 7;                       // pop!
    this.#effects.burst(node);              // halka + kıvılcım
    this.#effects.signal(node.path);        // kökten düğüme akan sinyal
    this.#panel.show(node);
    document.body.classList.add("panel-open");
    this.#updateViewport();
    this.#focusCamera(node);
    this.#syncLegend();
  }

  // Görev doğru çözülünce graf üzerinde ödül: ilk çözümde daha büyük patlama
  #celebrate(node, firstTime) {
    node.scaleV += firstTime ? 11 : 6;
    this.#effects.burst(node);
    if (firstTime) this.#effects.burst(node);
    this.#effects.signal(node.path);
  }

  #focusCamera(node) {
    const f = this.#fit;
    if (node.kind === "root") this.#camera.setTarget(0, 0, f);
    else if (node.kind === "category") this.#camera.setTarget(node.ax * 0.55, node.ay * 0.55, f * 1.2);
    else this.#camera.setTarget(node.ax * 0.62, node.ay * 0.62, f * 1.45);
  }

  /* ---------------- Görünüm alanı ----------------
     Panel açıkken grafın merkezi, panelin kapatmadığı alanın ortasına kayar. */
  #updateViewport() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const mobile = w <= 760;
    const open = this.#panel.isOpen;
    let vw = w, vh = h, cx = w / 2, cy = h / 2;
    if (open && !mobile) {
      vw = w - (this.#panel.width + 32);
      cx = vw / 2;
    }
    if (open && mobile) {
      vh = h - (this.#panel.height + 8);
      cy = vh / 2;
    }
    this.#camera.tvcx = cx;
    this.#camera.tvcy = cy;
    this.#fit = Math.min(vw, vh) / (2 * LAYOUT.WORLD_R);
  }

  #resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.#renderer.resize(window.innerWidth, window.innerHeight, dpr);
    this.#updateViewport();
    if (this.#selected) this.#focusCamera(this.#selected);
    else this.#camera.setTarget(0, 0, this.#fit);
  }

  /* ---------------- Giriş: fare / dokunma / tekerlek / klavye ---------------- */
  #bindInput() {
    const canvas = this.#canvas;
    const cam = this.#camera;

    canvas.addEventListener("pointerdown", (e) => {
      canvas.setPointerCapture(e.pointerId);
      this.#pointer = {
        id: e.pointerId,
        startX: e.clientX, startY: e.clientY,
        lastX: e.clientX, lastY: e.clientY, lastT: performance.now(),
        node: this.#renderer.hitTest(e.clientX, e.clientY),
        moved: false,
      };
    });

    canvas.addEventListener("pointermove", (e) => {
      const p = this.#pointer;
      if (!p || p.id !== e.pointerId) {
        this.#hovered = this.#renderer.hitTest(e.clientX, e.clientY);
        canvas.style.cursor = this.#hovered ? "pointer" : "grab";
        return;
      }
      if (!p.moved && Math.hypot(e.clientX - p.startX, e.clientY - p.startY) > 4) p.moved = true;
      if (!p.moved) return;

      const now = performance.now();
      const dtMove = Math.max(8, now - p.lastT) / 1000;
      if (p.node) {
        // Düğümü sürükle: bağlı düğümler yay kuvvetiyle peşinden gelir
        const w = cam.toWorld(e.clientX, e.clientY);
        const n = p.node;
        n.dragged = true;
        n.vx = Math.max(-2500, Math.min(2500, (w.x - n.x) / dtMove));
        n.vy = Math.max(-2500, Math.min(2500, (w.y - n.y) / dtMove));
        n.x = w.x;
        n.y = w.y;
        this.#hovered = n;
        canvas.style.cursor = "grabbing";
      } else {
        cam.panBy(-(e.clientX - p.lastX) / cam.scale, -(e.clientY - p.lastY) / cam.scale);
        canvas.style.cursor = "grabbing";
      }
      p.lastX = e.clientX; p.lastY = e.clientY; p.lastT = now;
    });

    const end = (e) => {
      const p = this.#pointer;
      if (!p || p.id !== e.pointerId) return;
      if (p.node) p.node.dragged = false; // bırakınca hızıyla fırlar, yay geri çeker
      if (!p.moved && e.type === "pointerup") this.select(p.node);
      this.#pointer = null;
      canvas.style.cursor = this.#hovered ? "pointer" : "grab";
    };
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    canvas.addEventListener("pointerleave", () => { if (!this.#pointer) this.#hovered = null; });

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      cam.zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0015), this.#fit * 0.5, this.#fit * 4);
    }, { passive: false });

    document.querySelectorAll("[data-zoom]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.zoom;
        if (action === "reset") return this.select(null);
        const factor = action === "in" ? 1.25 : 0.8;
        cam.zoomAt(cam.vcx, cam.vcy, factor, this.#fit * 0.5, this.#fit * 4);
      });
    });

    document.addEventListener("keydown", (e) => {
      const typing = e.target.closest("input, textarea");
      // "/" veya Ctrl+K → arama kutusuna odaklan
      if (!typing && (e.key === "/" || (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey)))) {
        e.preventDefault();
        document.getElementById("search-input").focus();
        return;
      }
      if (e.key === "Escape" && this.#selected) this.select(null);
      if (!this.#panel.isOpen || typing) return;
      if (e.key === "ArrowRight") this.#panel.step(1);
      if (e.key === "ArrowLeft") this.#panel.step(-1);
    });
  }

  /* ---------------- Arama ---------------- */
  #bindSearch() {
    const input = document.getElementById("search-input");
    const count = document.getElementById("search-count");
    const box = input.closest(".search");

    input.addEventListener("input", () => {
      const n = this.#search.setQuery(input.value);
      const active = this.#search.active;
      box.classList.toggle("has-query", active);
      box.classList.toggle("no-results", active && n === 0);
      count.textContent = !active ? "" : n ? `${n} sonuç` : "Eşleşme yok";
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const best = this.#search.best;
        if (best) this.select(best);
      } else if (e.key === "Escape") {
        e.stopPropagation(); // paneli kapatma; sadece aramayı temizle
        if (input.value) {
          input.value = "";
          input.dispatchEvent(new Event("input"));
        } else {
          input.blur();
        }
      }
    });
  }

  /* ---------------- Lejant ve erişilebilirlik listesi ---------------- */
  #buildLegend() {
    const legend = document.getElementById("legend");
    for (const cat of this.#graph.root.children) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "legend-btn";
      btn.textContent = cat.title;
      btn.style.setProperty("--c", cat.color);
      btn.addEventListener("click", () => this.select(cat));
      btn.addEventListener("mouseenter", () => { this.#preview = cat; });
      btn.addEventListener("mouseleave", () => { this.#preview = null; });
      legend.append(btn);
      this.#legendButtons.set(cat, btn);
    }
  }

  #syncLegend() {
    const activeCat = this.#selected?.path[1] ?? null;
    for (const [cat, btn] of this.#legendButtons) btn.classList.toggle("is-active", cat === activeCat);
  }

  #buildA11yNav() {
    const nav = document.getElementById("a11y-nav");
    const button = (node, text = node.title) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = text;
      b.addEventListener("click", () => this.select(node));
      return b;
    };
    nav.append(button(this.#graph.root));
    for (const cat of this.#graph.root.children) {
      const h = document.createElement("h2");
      h.textContent = cat.title;
      nav.append(h, button(cat, `${cat.title} (genel bakış)`), ...cat.children.map((c) => button(c)));
    }
  }
}

const neuralApp = new App();
neuralApp.start();

/* ---------------- PWA: Service Worker kaydı ----------------
   Service Worker yalnızca http(s) üzerinde çalışır (GitHub Pages, localhost).
   index.html'i dosyaya çift tıklayarak (file://) açınca kayıt atlanır;
   uygulama yine çalışır, sadece çevrimdışı önbellek devreye girmez. */
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("Service Worker kaydedilemedi:", err);
    });
  });
}
