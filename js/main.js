/* =========================================================================
   main.js — Uygulama denetleyicisi (controller)
   -------------------------------------------------------------------------
   Modülleri birbirine bağlar:
     KNOWLEDGE → buildGraph (DAG) → PhysicsEngine (konum)
                                  → GraphRenderer (çizim) + Effects (parçacık)
                                  → Curriculum (ilerleme, müfredat sırası)
                                  → InfoPanel (sağ panel)
                                  → GraphSearch (arama/filtre)
   Ayrıca giriş (fare/dokunma/tekerlek/klavye), kamera odağı, iki keşif modu
   (Serbest Dolaşım / Müfredat), requestAnimationFrame döngüsü ve Service
   Worker kaydını yönetir.

   Odak önceliği (hangi düğümler parlak kalır, gerisi soluklaşır):
     arama > panel/lejant önizlemesi > Müfredat Modu hedefleri > hover/seçim

   Uydu alt konular: seçili / üzerine gelinen / önizlenen kavramın ve
   aramada alt konusu eşleşen kavramların uyduları halka olarak açılır.
   ========================================================================= */

const MODE_STORAGE_KEY = "oop-neural:mode";

class App {
  #canvas;
  #graph;
  #physics;
  #camera;
  #effects;
  #renderer;
  #panel;
  #search;
  #curriculum;
  #legendButtons = new Map(); // kategori → buton
  #modeButtons = [];

  #hovered = null;
  #hoverHost = null;  // imleç yörüngesinde gezinirken açık kalan ana kavram
  #selected = null;   // kavram düğümü veya kategori grubu
  #preview = null;    // panel chip'i / lejant üzerine gelinen öğe
  #mode = "free";     // "free" | "syllabus"
  #syllabus = { targets: new Set(), focus: new Set() };
  #fit = 0.5;         // tüm grafı sığdıran ölçek
  #center = { x: 0, y: 0 };
  #time = 0;
  #last = 0;
  #pointer = null;    // aktif sürükleme/pan durumu
  #toastTimer = 0;

  constructor() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.#canvas = document.getElementById("graph");
    this.#graph = buildGraph(KNOWLEDGE);
    this.#curriculum = new Curriculum(this.#graph);
    this.#physics = new PhysicsEngine(this.#graph, { reducedMotion });
    this.#camera = new Camera();
    this.#effects = new Effects(this.#graph, this.#curriculum, { reducedMotion });
    this.#renderer = new GraphRenderer(this.#canvas, this.#graph, this.#camera, this.#effects);
    this.#panel = new InfoPanel(document.getElementById("panel"), {
      onNavigate: (node) => this.select(node),
      onPreview: (node) => { this.#preview = node; },
      onClose: () => this.select(null),
      onQuizSolved: (node, firstTime) => this.#celebrate(node, firstTime),
      onToggleLearned: (node) => this.#toggleLearned(node),
      onPracticePassed: (node) => this.#completePractice(node),
      onStep: (node, dir) => this.#step(node, dir),
      isLearned: (node) => this.#curriculum.isLearned(node),
    });
    this.#search = new GraphSearch(this.#graph);
    this.#curriculum.onChange(() => {
      this.#updateSyllabus();
      this.#updateProgress();
    });
  }

  start() {
    this.#buildLegend();
    this.#buildA11yNav();
    this.#bindInput();
    this.#bindSearch();
    this.#bindModeToggle();
    window.addEventListener("resize", () => this.#resize());
    this.#resize();
    this.#updateProgress();

    // Açılış: kamera uzaktan yakınlaşır, düğümler merkezden yerlerine açılır
    const cam = this.#camera;
    cam.vcx = cam.tvcx; cam.vcy = cam.tvcy;
    cam.scale = this.#fit * 0.55;
    cam.setTarget(this.#center.x, this.#center.y, this.#fit);

    // Kayıtlı mod geri yüklenir (panel açılmadan, sadece görsel rehberlik)
    this.#setMode(readStorage(MODE_STORAGE_KEY, "free") === "syllabus" ? "syllabus" : "free", { fly: false });

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

  // Bir kavramın "ilgi alanı": kendisi + tüm önkoşul zinciri + doğrudan açtıkları
  #focusFor(item) {
    if (item.kind === "category") return new Set(item.children.flatMap((n) => [n, ...n.subs]));
    if (item.host) return new Set([item, item.host, ...item.host.subs, ...item.host.ancestors]);
    return new Set([item, ...item.ancestors, ...item.dependents, ...item.subs]);
  }

  // Uyduları açık olacak ana kavramlar
  #expandedHosts(search) {
    const hosts = new Set();
    const add = (n) => {
      if (!n || n.kind === "category") return;
      const host = n.host ?? n;
      if (host.subs.length) hosts.add(host);
    };
    add(this.#selected);
    add(this.#hovered);
    add(this.#hoverHost);
    add(this.#preview);
    if (search) search.matches.forEach((n) => { if (n.host) hosts.add(n.host); });
    return hosts;
  }

  // Hover/seçim/arama/müfredat durumlarını yumuşak geçişlerle düğümlere yansıtır
  #updateVisualState(dt) {
    const search = this.#search.active ? this.#search : null;
    const syllabus = this.#mode === "syllabus" ? this.#syllabus : null;
    let focus = null;
    let dimmed = 0.2;

    if (search) {
      focus = search.focus;
      dimmed = 0.1;
    } else if (this.#preview) {
      focus = this.#focusFor(this.#preview);
    } else if (syllabus) {
      // Müfredat: yalnızca sıradaki hedefler ve onlara giden yollar parlak
      focus = new Set(syllabus.focus);
      if (this.#selected?.kind === "leaf") focus.add(this.#selected);
      if (this.#hovered) focus.add(this.#hovered);
      dimmed = 0.12;
    } else {
      const item = this.#hovered || this.#selected;
      if (item) focus = this.#focusFor(item);
    }

    const k = 1 - Math.exp(-10 * dt);
    const expanded = this.#expandedHosts(search);
    for (const n of this.#graph.concepts) {
      if (n.subs.length) n.expand += ((expanded.has(n) ? 1 : 0) - n.expand) * k * 0.8;
    }
    for (const n of this.#graph.nodes) {
      let alphaT = !focus || focus.has(n) ? 1 : dimmed;
      if (n.host) {
        // Kapalı uydu: ana kavramın yanında küçük, soluk bir "ay"
        alphaT *= 0.5 + 0.5 * n.host.expand;
        n.radius = 2 + 3.6 * n.host.expand;
      }
      const hoverT = n === this.#hovered || n === this.#preview ? 1 : 0;
      const selT = n === this.#selected ? 1 : 0;
      const matchT = search && search.matches.has(n) ? 1 : 0;
      const targetT = syllabus && !search && syllabus.targets.has(n) ? 1 : 0;
      const learnedT = this.#curriculum.isLearned(n) ? 1 : 0;
      n.alpha += (alphaT - n.alpha) * k;
      n.hover += (hoverT - n.hover) * k;
      n.selected += (selT - n.selected) * k;
      n.match += (matchT - n.match) * k;
      n.target += (targetT - n.target) * k;
      n.learned += (learnedT - n.learned) * k * 0.6; // renk geçişi biraz daha yavaş
      n.drawRgb = mixRgb(n.rgb, LEARNED_RGB, n.learned * 0.85);

      // Ölçek yayı: hedefe "boing" diye oturur (tıklamada scaleV'ye darbe verilir)
      const scaleT = 1 + 0.35 * hoverT + 0.18 * selT + 0.12 * targetT;
      n.scaleV += (260 * (scaleT - n.scale) - 18 * n.scaleV) * dt;
      n.scale += n.scaleV * dt;
    }
    for (const link of this.#graph.links) {
      const hotT = focus && focus.has(link.a) && focus.has(link.b) ? 1 : 0;
      link.hot += (hotT - link.hot) * k;
    }
  }

  /* ---------------- Seçim ---------------- */
  select(item) {
    if (!item) {
      this.#selected = null;
      this.#panel.hide();
      document.body.classList.remove("panel-open");
      this.#updateViewport();
      this.#camera.setTarget(this.#center.x, this.#center.y, this.#fit);
      this.#syncLegend();
      return;
    }
    this.#selected = item;
    if (item.kind !== "category") {
      item.scaleV += 7;                  // pop!
      this.#effects.burst(item);         // halka + kıvılcım
      this.#effects.signal(item.host ?? item); // önkoşul zinciri boyunca akan sinyal
    }
    this.#panel.show(item);
    document.body.classList.add("panel-open");
    this.#updateViewport();
    this.#focusCamera(item);
    this.#syncLegend();
  }

  #focusCamera(item) {
    const max = this.#fit * 5;
    if (item.kind === "category") {
      this.#camera.setTarget(this.#center.x, item.lane.cy, Math.min(max, this.#fit * 1.15));
    } else if (item.host) {
      // Alt konu: halkanın tamamı görünsün diye ana kavrama odaklan
      this.#camera.setTarget(item.host.ax, item.host.ay, Math.min(max, Math.max(this.#fit * 2.2, 1.05)));
    } else {
      this.#camera.setTarget(item.ax, item.ay, Math.min(max, Math.max(this.#fit * 1.8, 0.85)));
    }
  }

  // Panel ←/→: Serbest modda kategori içi, Müfredat modunda sıradaki hedef
  #step(node, dir) {
    if (this.#mode === "syllabus") {
      if (dir > 0) {
        const target = this.#curriculum.frontier.find((n) => n !== node) ?? this.#curriculum.next;
        if (target) this.select(target);
        else this.#toast("🎉 Müfredattaki tüm kavramları öğrendin!");
      } else if (node.kind !== "category") {
        const prev = node.host ?? this.#curriculum.previousInOrder(node);
        if (prev) this.select(prev);
      }
      return;
    }
    if (node.kind === "category") return;
    const sibs = node.siblings; // alt konuda: aynı ana kavramın diğer uyduları
    const i = sibs.indexOf(node);
    this.select(sibs[(i + dir + sibs.length) % sibs.length]);
  }

  /* ---------------- İlerleme ve mikro ödüller ---------------- */
  #toggleLearned(node) {
    const wasLearned = this.#curriculum.isLearned(node);
    const unlocked = this.#curriculum.toggle(node);
    this.#panel.syncLearned();
    if (wasLearned) return;

    node.scaleV += 10;
    this.#effects.burst(node, LEARNED_RGB);
    this.#effects.unlock(node); // açtığı kavramlara sinyal yağmuru

    const { done, total } = this.#curriculum.progress;
    if (done === total) {
      this.#toast("🏆 Tebrikler! Ağın tamamını öğrendin.");
    } else if (unlocked.length) {
      const names = unlocked.slice(0, 3).map((n) => n.title).join(", ");
      const more = unlocked.length > 3 ? ` +${unlocked.length - 3}` : "";
      this.#toast(`🔓 Yeni açılan: ${names}${more}`);
    } else {
      this.#toast(`✓ ${node.title} öğrenildi · ${done}/${total}`);
    }
  }

  // Pratik geçilince kavram öğrenilmiş sayılır (kilit açma animasyonları dahil)
  #completePractice(node) {
    if (!this.#curriculum.isLearned(node)) {
      this.#toggleLearned(node);
      return;
    }
    node.scaleV += 6;
    this.#effects.burst(node, LEARNED_RGB);
    this.#toast(`✓ ${node.title} pratiği tamamlandı`);
  }

  // Görev doğru çözülünce graf üzerinde ödül: ilk çözümde daha büyük patlama
  #celebrate(node, firstTime) {
    node.scaleV += firstTime ? 11 : 6;
    this.#effects.burst(node);
    if (firstTime) this.#effects.burst(node);
    this.#effects.signal(node);
  }

  #updateProgress() {
    const { done, total, ratio } = this.#curriculum.progress;
    const pct = Math.round(ratio * 100);
    document.getElementById("progress-text").textContent = `${done} / ${total} öğrenildi · %${pct}`;
    document.getElementById("progress-fill").style.width = `${ratio * 100}%`;
    document.getElementById("progress-line-fill").style.width = `${ratio * 100}%`;
    const bar = document.getElementById("progress");
    bar.setAttribute("aria-valuenow", String(done));
    bar.setAttribute("aria-valuemax", String(total));
    bar.classList.toggle("is-complete", done === total);
  }

  /* ---------------- Rehberli Keşif: Müfredat Modu ---------------- */
  // Sıradaki hedefler = topolojik sıradaki "hazır" kavramlar; yollar = onların önkoşulları
  #updateSyllabus() {
    const targets = new Set(this.#curriculum.frontier);
    const focus = new Set(targets);
    for (const t of targets) t.ancestors.forEach((a) => focus.add(a));
    this.#syllabus = { targets, focus };
  }

  #setMode(mode, { fly = true } = {}) {
    this.#mode = mode;
    writeStorage(MODE_STORAGE_KEY, mode);
    for (const btn of this.#modeButtons) btn.setAttribute("aria-pressed", String(btn.dataset.mode === mode));
    document.getElementById("mode-toggle").dataset.active = mode;
    document.body.classList.toggle("syllabus-mode", mode === "syllabus");
    this.#panel.setMode(mode);
    this.#updateSyllabus();
    if (mode !== "syllabus") return;

    const next = this.#curriculum.next;
    if (!next) {
      if (fly) this.#toast("🎉 Müfredattaki tüm kavramları öğrendin!");
      return;
    }
    if (fly) this.select(next);   // kamerayı sıradaki hedefe götür ve paneli aç
    else this.#focusCamera(next); // açılışta yalnızca kamerayı yönlendir
  }

  #bindModeToggle() {
    this.#modeButtons = [...document.querySelectorAll("#mode-toggle [data-mode]")];
    for (const btn of this.#modeButtons) {
      btn.addEventListener("click", () => {
        if (btn.dataset.mode !== this.#mode) this.#setMode(btn.dataset.mode);
      });
    }
  }

  #toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.remove("is-visible");
    void el.offsetWidth;
    el.classList.add("is-visible");
    clearTimeout(this.#toastTimer);
    this.#toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3200);
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
    const b = this.#graph.bounds;
    this.#center = { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 };
    this.#fit = Math.min(vw / (b.maxX - b.minX), vh / (b.maxY - b.minY)) * 0.95;
  }

  #resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.#renderer.resize(window.innerWidth, window.innerHeight, dpr);
    this.#updateViewport();
    if (this.#selected) this.#focusCamera(this.#selected);
    else this.#camera.setTarget(this.#center.x, this.#center.y, this.#fit);
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
        this.#trackHoverHost(e.clientX, e.clientY);
        canvas.style.cursor = this.#hovered ? "pointer" : "grab";
        return;
      }
      if (!p.moved && Math.hypot(e.clientX - p.startX, e.clientY - p.startY) > 4) p.moved = true;
      if (!p.moved) return;

      const now = performance.now();
      const dtMove = Math.max(8, now - p.lastT) / 1000;
      if (p.node) {
        // Düğümü sürükle: önkoşul bağlarıyla bağlı düğümler yay kuvvetiyle peşinden gelir
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
    canvas.addEventListener("pointerleave", () => {
      if (!this.#pointer) { this.#hovered = null; this.#hoverHost = null; }
    });

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      cam.zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0015), this.#fit * 0.6, this.#fit * 5);
    }, { passive: false });

    document.querySelectorAll("[data-zoom]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.zoom;
        if (action === "reset") return this.select(null);
        const factor = action === "in" ? 1.25 : 0.8;
        cam.zoomAt(cam.vcx, cam.vcy, factor, this.#fit * 0.6, this.#fit * 5);
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

  // İmleç ana kavramdan uydularına giderken halka kapanmasın:
  // imleç yörünge alanında kaldıkça ana kavram açık tutulur
  #trackHoverHost(sx, sy) {
    const n = this.#hovered;
    const host = n ? (n.host ?? (n.subs.length ? n : null)) : this.#hoverHost;
    if (!host) { this.#hoverHost = null; return; }
    const w = this.#camera.toWorld(sx, sy);
    const reach = host.orbitR * 1.35 + 24 / this.#camera.scale;
    this.#hoverHost = Math.hypot(w.x - host.x, w.y - host.y) <= reach ? host : null;
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
    for (const cat of this.#graph.categories) {
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
    const sel = this.#selected;
    const activeCat = !sel ? null : sel.kind === "category" ? sel : sel.parent;
    for (const [cat, btn] of this.#legendButtons) btn.classList.toggle("is-active", cat === activeCat);
  }

  #buildA11yNav() {
    const nav = document.getElementById("a11y-nav");
    const button = (item, text = item.title) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = text;
      b.addEventListener("click", () => this.select(item));
      return b;
    };
    for (const cat of this.#graph.categories) {
      const h = document.createElement("h2");
      h.textContent = cat.title;
      nav.append(h, button(cat, `${cat.title} (genel bakış)`),
        ...cat.children.flatMap((c) => [button(c), ...c.subs.map((s) => button(s, `↳ ${s.title}`))]));
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
