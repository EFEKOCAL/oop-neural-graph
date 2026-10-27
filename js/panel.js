/* =========================================================================
   panel.js — Sağdaki bilgi paneli
   -------------------------------------------------------------------------
   Seçilen düğümün tanımını, editör alanını ve ilgili kavramları gösterir.
   Editörde üç sekme vardır:
     - Java       (node.code)  → VS Code temalı, satır satır beliren kod
     - Vanilla JS (node.js)    → aynı görünüm
     - Görev      (node.quiz)  → mini sınav; tek ya da çok aşamalı
                                ("① Derleme → ② Çıktı/Teşhis" tarayıcısı)
   Kod satırları kademeli (stagger) belirir; ardından veride "//!" ile
   işaretlenen satırlar .flash ile parlatılır. Seçilen sekme kavramlar
   arasında korunur; o kavramda yoksa ilk uygun sekmeye düşülür.
   Kavramın 'traps' verisi varsa tanımın altında 🚨 Tuzaklar kutusu çıkar.
   Alt çubukta "Bunu Öğrendim" düğmesi ilerlemeyi işaretler; ilgili kavramlar
   bölümü DAG'e göre "önkoşullar" ve "bunu öğrenince açılanlar" olarak ayrılır.
   Gezinti (←/→) main.js'e devredilir: Serbest modda kategori içi,
   Müfredat modunda sıradaki hedefe gider.
   ========================================================================= */

const EDITOR_TABS = {
  java: { field: "code", ext: "java", fallbackFile: "Ornek.java" },
  js:   { field: "js",   ext: "js",   fallbackFile: "ornek.js" },
  quiz: { field: "quiz" },
};
const TAB_STORAGE_KEY = "oop-neural:editor-tab";
const SOLVED_STORAGE_KEY = "oop-neural:solved";

// localStorage gizli modda/kapalıyken hata fırlatabilir → sessizce varsayılana düş
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* yoksay */ }
}

class InfoPanel {
  #el;
  #els;
  #current = null;
  #plainCode = "";
  #tab = "java";        // kullanıcının tercih ettiği sekme
  #shownTab = "java";   // o an gösterilen sekme (tercih yoksa düşülen)
  #solved;              // çözülen görevlerin id'leri
  #quiz = null;         // aktif görev durumu: { node, stages, index }
  #timers = [];
  #onNavigate;
  #onPreview;
  #onClose;
  #onQuizSolved;
  #onToggleLearned;
  #onStep;
  #isLearned;
  #mode = "free";

  constructor(el, { onNavigate, onPreview, onClose, onQuizSolved, onToggleLearned, onStep, isLearned }) {
    this.#el = el;
    this.#onNavigate = onNavigate;
    this.#onPreview = onPreview;
    this.#onClose = onClose;
    this.#onQuizSolved = onQuizSolved;
    this.#onToggleLearned = onToggleLearned;
    this.#onStep = onStep;
    this.#isLearned = isLearned;
    const $ = (id) => document.getElementById(id);
    this.#els = {
      body: $("panel-body"), crumbs: $("panel-crumbs"), chip: $("panel-chip"),
      title: $("panel-title"), def: $("panel-def"), editor: $("panel-editor"),
      file: $("panel-file"), copy: $("panel-copy"), code: $("panel-code"),
      codeView: $("panel-code").parentElement,
      status: $("panel-status"), related: $("panel-related"), relatedTitle: $("panel-related-title"),
      prev: $("panel-prev"), next: $("panel-next"), close: $("panel-close"),
      tabs: [...document.querySelectorAll("#panel-tabs [data-tab]")],
      quiz: $("panel-quiz"), quizProgress: $("quiz-progress"), quizQuestion: $("quiz-question"),
      quizCodeView: $("quiz-code").parentElement, quizCode: $("quiz-code"),
      quizOptions: $("quiz-options"), quizFeedback: $("quiz-feedback"),
    };
    this.#createDynamicParts();

    this.#els.close.addEventListener("click", () => this.#onClose());
    this.#els.prev.addEventListener("click", () => this.step(-1));
    this.#els.next.addEventListener("click", () => this.step(1));
    this.#els.copy.addEventListener("click", () => this.#copy());

    // Sekmeler: tıklama + sekme listesi içinde ←/→ ile geçiş
    for (const tab of this.#els.tabs) {
      tab.addEventListener("click", () => this.setTab(tab.dataset.tab));
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.stopPropagation(); // main.js'teki kavramlar arası ←/→ gezinmesini tetikleme
        const tabs = this.#els.tabs.filter((t) => !t.disabled);
        const next = tabs[(tabs.indexOf(tab) + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
        next.focus();
        this.setTab(next.dataset.tab);
      });
    }

    const savedTab = readStorage(TAB_STORAGE_KEY, "java");
    if (savedTab in EDITOR_TABS) this.#tab = savedTab;
    this.#solved = new Set(readStorage(SOLVED_STORAGE_KEY, []));
  }

  get isOpen() { return this.#el.classList.contains("is-open"); }
  get current() { return this.#current; }
  get width() { return this.#el.offsetWidth; }
  get height() { return this.#el.offsetHeight; }

  show(node) {
    const els = this.#els;
    const wasOpen = this.isOpen;
    this.#current = node;
    this.#el.style.setProperty("--c", node.color);

    this.#renderCrumbs(node);
    els.chip.textContent = node.kind === "category"
      ? `Kategori · ${node.children.length} kavram`
      : `${node.parent.title} · Seviye ${node.depth + 1}`;
    this.syncLearned();
    els.title.textContent = node.title;
    els.def.textContent = node.def;
    this.#renderTraps(node);
    this.#renderEditor(node);
    this.#renderRelated(node);

    const isConcept = node.kind === "leaf";
    els.prev.disabled = !isConcept;
    els.next.disabled = !isConcept && this.#mode !== "syllabus";

    // İçerik değişim animasyonu (panel zaten açıksa)
    if (wasOpen) this.#replay(els.body, "is-swapping");
    els.body.scrollTop = 0;
    this.#el.inert = false;
    this.#el.classList.add("is-open");
  }

  hide() {
    this.#clearTimers();
    this.#current = null;
    this.#el.classList.remove("is-open");
    this.#el.inert = true;
    this.#onPreview(null);
  }

  // Önceki/sonraki: hedefi main.js seçer (moda göre kategori içi veya müfredat)
  step(dir) {
    if (this.#current) this.#onStep(this.#current, dir);
  }

  // Serbest Dolaşım / Müfredat Modu: gezinti düğmelerinin anlamı değişir
  setMode(mode) {
    this.#mode = mode;
    const syllabus = mode === "syllabus";
    this.#els.prev.textContent = syllabus ? "← Müfredatta önceki" : "← Önceki";
    this.#els.next.textContent = syllabus ? "Sıradaki hedef →" : "Sonraki →";
    if (this.#current) this.syncLearned();
  }

  // "Bunu Öğrendim" düğmesini ve ilişkili kavram işaretlerini güncel duruma getir
  syncLearned() {
    const node = this.#current;
    const btn = this.#els.learn;
    if (!node || node.kind !== "leaf") {
      btn.hidden = true;
      return;
    }
    const learned = this.#isLearned(node);
    btn.hidden = false;
    btn.classList.toggle("is-learned", learned);
    btn.setAttribute("aria-pressed", String(learned));
    btn.textContent = learned ? "✓ Öğrenildi" : "Bunu Öğrendim";
    btn.title = learned ? "İşareti kaldırmak için tıkla" : "Bu kavramı öğrendiğini işaretle";
    // Müfredat modunda öğrenince "Sıradaki hedef" düğmesi dikkat çeksin
    this.#els.next.classList.toggle("is-suggested", learned && this.#mode === "syllabus");
    this.#renderRelated(node);
  }

  // Sekme değiştir ve açık kavramı o sekmede yeniden çiz
  setTab(tab) {
    if (!(tab in EDITOR_TABS)) return;
    this.#tab = tab;
    writeStorage(TAB_STORAGE_KEY, tab);
    if (this.#current && tab !== this.#shownTab) {
      this.#renderEditor(this.#current);
      this.#replay(tab === "quiz" ? this.#els.quiz : this.#els.codeView, "is-switching");
    }
  }

  /* ---------------- Editör (sekmeler) ---------------- */
  #renderEditor(node) {
    const els = this.#els;
    this.#clearTimers();
    const available = Object.keys(EDITOR_TABS).filter((key) => node[EDITOR_TABS[key].field]);
    if (!available.length) {             // kök ve kategori düğümlerinde editör yok
      els.editor.hidden = true;
      this.#plainCode = "";
      return;
    }
    els.editor.hidden = false;
    for (const tab of els.tabs) tab.disabled = !available.includes(tab.dataset.tab);

    this.#shownTab = available.includes(this.#tab) ? this.#tab : available[0];
    for (const tab of els.tabs) {
      const active = tab.dataset.tab === this.#shownTab;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    }

    const isQuiz = this.#shownTab === "quiz";
    els.codeView.hidden = isQuiz;
    els.quiz.hidden = !isQuiz;
    els.copy.hidden = isQuiz;
    if (isQuiz) this.#renderQuiz(node);
    else this.#renderCode(node[EDITOR_TABS[this.#shownTab].field], EDITOR_TABS[this.#shownTab]);
  }

  // Kodu satır satır vurgulayıp gösterir; belirme bitince odak satırlarını parlatır
  #renderCode(source, cfg) {
    const els = this.#els;
    els.copy.textContent = "Kopyala";
    els.copy.classList.remove("is-done");

    const { plain, lines, focus } = CodeHighlighter.prepare(source);
    this.#plainCode = plain;
    const cls = plain.match(/\bclass\s+(\w+)/);
    const fileBase = cls && (cfg.ext === "js" ? cls[1][0].toLowerCase() + cls[1].slice(1) : cls[1]);
    els.file.textContent = fileBase ? `${fileBase}.${cfg.ext}` : cfg.fallbackFile;
    els.code.innerHTML = this.#linesHtml(lines);
    els.status.textContent = `Ln 1, ${lines.length} satır`;

    const revealMs = lines.length * 22 + 420;
    this.#timers.push(setTimeout(() => {
      for (const line of els.code.children) line.classList.add("is-shown");
      focus.forEach((n, i) => this.flashLine(n, i === 0));
    }, revealMs));
  }

  #linesHtml(lines) {
    return lines.map((html, i) => `<span class="line" style="--i:${i}">${html || " "}</span>`).join("");
  }

  // Önceki projedeki flashLine mantığı: animasyonu sıfırlayıp yeniden tetikler
  flashLine(lineNumber, scroll = true) {
    const el = this.#els.code.children[lineNumber - 1];
    if (!el) return;
    this.#replay(el, "flash");
    el.addEventListener("animationend", () => el.classList.remove("flash"), { once: true });
    if (scroll) {
      const pre = this.#els.codeView;
      const top = el.offsetTop - pre.clientHeight / 2 + el.offsetHeight / 2;
      pre.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      this.#els.status.textContent = `Ln ${lineNumber}`;
    }
  }

  /* ---------------- Tuzaklar ve İpuçları ---------------- */
  // HTML'e dokunmadan gerekli bileşenleri üretir ve yerlerine yerleştirir
  #createDynamicParts() {
    const els = this.#els;

    // 🚨 Tuzaklar kutusu: tanımın hemen altında, açılır/kapanır <details>
    const traps = document.createElement("details");
    traps.className = "traps";
    traps.open = true;
    traps.hidden = true;
    traps.innerHTML = `
      <summary>
        <span class="traps-icon" aria-hidden="true">🚨</span>
        <span>Tuzaklar ve İpuçları</span>
        <span class="traps-count"></span>
      </summary>
      <ul class="traps-list"></ul>`;
    els.def.after(traps);
    els.traps = traps;

    // Görev: aşama göstergesi (stepper), sonraki aşama düğmesi, terminal çıktısı
    els.quizStepper = Object.assign(document.createElement("ol"), { className: "quiz-stepper" });
    els.quizNext = Object.assign(document.createElement("button"), {
      type: "button", className: "quiz-next", textContent: "Sonraki aşama →", hidden: true,
    });
    els.quizConsole = Object.assign(document.createElement("pre"), { className: "quiz-console", hidden: true });
    els.quizProgress.parentElement.after(els.quizStepper);
    els.quizFeedback.after(els.quizNext, els.quizConsole);
    els.quizNext.addEventListener("click", () => this.#goToStage(this.#quiz.index + 1));

    // "Bunu Öğrendim": alt çubukta önceki/sonraki arasında
    els.learn = Object.assign(document.createElement("button"), {
      type: "button", className: "learn-btn", hidden: true,
    });
    els.prev.after(els.learn);
    els.learn.addEventListener("click", () => {
      if (!this.#current) return;
      this.#onToggleLearned(this.#current);
      this.#replay(els.learn, "is-popping");
    });
  }

  #renderTraps(node) {
    const box = this.#els.traps;
    const traps = node.traps ? [].concat(node.traps) : [];
    box.hidden = traps.length === 0;
    if (!traps.length) return;
    box.open = true;
    box.querySelector(".traps-count").textContent = traps.length;
    box.querySelector(".traps-list").replaceChildren(...traps.map((trap, i) => {
      const item = typeof trap === "string" ? { text: trap } : trap;
      const li = document.createElement("li");
      li.style.setProperty("--i", i);
      if (item.title) {
        const strong = document.createElement("strong");
        strong.textContent = item.title;
        li.append(strong);
      }
      const text = document.createElement("span");
      text.textContent = item.text;
      li.append(text);
      return li;
    }));
  }

  /* ---------------- Görev (mini sınav / derleme tarayıcısı) ---------------- */
  #renderQuiz(node) {
    const els = this.#els;
    const quiz = node.quiz;
    const stages = quiz.stages ?? [quiz]; // tek aşamalı görev = 1 elemanlı aşama listesi
    this.#quiz = { node, stages, index: 0 };
    this.#plainCode = "";
    els.file.textContent = `Görev · ${node.label}`;
    this.#updateProgress();

    // Aşama göstergesi yalnızca çok aşamalı görevlerde
    els.quizStepper.hidden = stages.length < 2;
    els.quizStepper.replaceChildren(...stages.map((stage, i) => {
      const li = document.createElement("li");
      li.textContent = stage.step ?? `Aşama ${i + 1}`;
      return li;
    }));

    const view = els.quizCodeView;
    view.classList.remove("is-scanning", "is-compiled", "is-error");
    if (quiz.code) {
      view.hidden = false;
      els.quizCode.innerHTML = this.#linesHtml(CodeHighlighter.prepare(quiz.code).lines);
    } else {
      view.hidden = true;
    }
    els.quizConsole.hidden = true;
    this.#goToStage(0);
  }

  #goToStage(index) {
    const els = this.#els;
    const q = this.#quiz;
    q.index = index;
    const stage = q.stages[index];

    [...els.quizStepper.children].forEach((li, i) => {
      li.classList.toggle("is-active", i === index);
      li.classList.toggle("is-done", i < index);
    });
    els.quizQuestion.textContent = stage.question;
    els.status.textContent = q.stages.length > 1 ? `Aşama ${index + 1}/${q.stages.length}` : `${stage.options.length} şık`;
    // Derleme aşamasında kodun üzerinden "tarama" ışığı geçer
    els.quizCodeView.classList.toggle("is-scanning", stage.kind === "compile");
    els.quizNext.hidden = true;

    els.quizOptions.classList.remove("is-solved");
    els.quizOptions.replaceChildren(...stage.options.map((text, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.style.setProperty("--i", i);
      const key = document.createElement("span");
      key.className = "opt-key";
      key.textContent = String.fromCharCode(65 + i); // A, B, C, D
      const label = document.createElement("span");
      label.textContent = text;
      btn.append(key, label);
      btn.addEventListener("click", () => this.#answer(i, btn));
      return btn;
    }));

    const done = index === 0 && this.#solved.has(q.node.id);
    els.quizFeedback.className = "quiz-feedback" + (done ? " is-info" : "");
    els.quizFeedback.textContent = done ? "✓ Bu görevi daha önce çözdün. Tekrar denemekten çekinme!" : "";
    if (index > 0) this.#replay(els.quizQuestion, "is-switching");
  }

  #answer(index, btn) {
    const els = this.#els;
    const q = this.#quiz;
    const stage = q.stages[q.index];
    if (els.quizOptions.classList.contains("is-solved")) return;

    if (index === stage.answer) {
      btn.classList.add("is-correct");
      els.quizOptions.classList.add("is-solved");
      els.quizFeedback.className = "quiz-feedback is-correct";
      els.quizFeedback.textContent = `✓ Doğru! ${stage.explain}`;
      els.quizStepper.children[q.index]?.classList.add("is-done");

      // Derleme aşaması sonucu kodun üzerinde görselleşir
      if (stage.kind === "compile") {
        const view = els.quizCodeView;
        view.classList.remove("is-scanning");
        view.classList.add(stage.errorLine ? "is-error" : "is-compiled");
        els.quizCode.children[stage.errorLine - 1]?.classList.add("is-error-line");
      }

      if (q.index < q.stages.length - 1) {
        els.quizNext.hidden = false;
        els.quizNext.focus({ preventScroll: true });
        return;
      }

      // Son aşama: varsa program çıktısını terminalde göster, görevi tamamla
      if (stage.output) {
        const cmd = q.node.quiz.lang === "js" ? "node main.js" : "java Main";
        els.quizConsole.textContent = `$ ${cmd}\n${stage.output}`;
        els.quizConsole.hidden = false;
        this.#replay(els.quizConsole, "is-printing");
      }
      const node = q.node;
      const firstTime = !this.#solved.has(node.id);
      this.#solved.add(node.id);
      writeStorage(SOLVED_STORAGE_KEY, [...this.#solved]);
      this.#updateProgress();
      this.#onQuizSolved(node, firstTime);
    } else {
      // Yanlış şık kalıcı olarak işaretlenir; kullanıcı diğerlerini denemeye devam eder
      btn.disabled = true;
      els.quizFeedback.className = "quiz-feedback";
      this.#replay(btn, "is-wrong");
      this.#replay(els.quizFeedback, "is-wrong");
      els.quizFeedback.textContent = "✗ Yanlış. Bir şık daha dene!";
    }
  }

  #updateProgress() {
    const total = Object.keys(QUIZZES).length;
    const solved = [...this.#solved].filter((id) => id in QUIZZES).length;
    this.#els.quizProgress.textContent = `${solved} / ${total} görev çözüldü`;
    this.#els.quizProgress.style.setProperty("--p", `${(solved / total) * 100}%`);
  }

  /* ---------------- Gezinti yolu ve ilgili kavramlar ---------------- */
  #renderCrumbs(node) {
    const crumbs = this.#els.crumbs;
    crumbs.replaceChildren();
    node.path.forEach((n, i, path) => {
      if (i > 0) {
        const sep = document.createElement("span");
        sep.className = "sep";
        sep.textContent = "›";
        crumbs.append(sep);
      }
      if (i < path.length - 1) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = n.label;
        btn.addEventListener("click", () => this.#onNavigate(n));
        crumbs.append(btn);
      } else {
        const cur = document.createElement("span");
        cur.className = "current";
        cur.textContent = n.label;
        crumbs.append(cur);
      }
    });
  }

  // DAG'e göre öğrenme yolu: önkoşullar ← [kavram] → bunu öğrenince açılanlar
  #renderRelated(node) {
    const els = this.#els;
    if (node.kind === "category") {
      els.relatedTitle.textContent = `Bu kategorideki kavramlar (${node.children.length})`;
      els.related.replaceChildren(this.#chipGroup(null, node.children));
      return;
    }
    els.relatedTitle.textContent = "Öğrenme yolu";
    const groups = [];
    groups.push(node.deps.length
      ? this.#chipGroup("Önkoşullar", node.deps)
      : this.#chipGroup("Önkoşullar", [], "Başlangıç kavramı: önkoşulu yok 🌱"));
    if (node.dependents.length) groups.push(this.#chipGroup("Bunu öğrenince açılanlar", node.dependents));
    els.related.replaceChildren(...groups);
  }

  #chipGroup(label, nodes, emptyText = "") {
    const group = document.createElement("div");
    group.className = "rel-group";
    if (label) {
      const title = document.createElement("span");
      title.className = "rel-label";
      title.textContent = label;
      group.append(title);
    }
    const chips = document.createElement("div");
    chips.className = "chips";
    if (!nodes.length && emptyText) {
      const empty = document.createElement("span");
      empty.className = "rel-empty";
      empty.textContent = emptyText;
      chips.append(empty);
    }
    chips.append(...nodes.map((n) => this.#chip(n)));
    group.append(chips);
    return group;
  }

  #chip(n) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip-btn";
    const learned = this.#isLearned(n);
    btn.textContent = (learned ? "✓ " : "") + n.title;
    btn.classList.toggle("is-learned", learned);
    if (n.quiz) btn.classList.add("has-quiz");
    if (n.traps) btn.classList.add("has-traps");
    if (this.#solved.has(n.id)) btn.classList.add("is-solved");
    btn.style.setProperty("--c", n.color);
    btn.addEventListener("click", () => this.#onNavigate(n));
    // Chip'in üzerine gelince graf üzerinde o düğüm önizlenir
    btn.addEventListener("mouseenter", () => this.#onPreview(n));
    btn.addEventListener("mouseleave", () => this.#onPreview(null));
    btn.addEventListener("focus", () => this.#onPreview(n));
    btn.addEventListener("blur", () => this.#onPreview(null));
    return btn;
  }

  /* ---------------- Yardımcılar ---------------- */
  async #copy() {
    const btn = this.#els.copy;
    try {
      await navigator.clipboard.writeText(this.#plainCode);
      btn.textContent = "Kopyalandı ✓";
      btn.classList.add("is-done");
    } catch {
      btn.textContent = "Kopyalanamadı";
    }
    this.#timers.push(setTimeout(() => {
      btn.textContent = "Kopyala";
      btn.classList.remove("is-done");
    }, 1600));
  }

  // Bir CSS animasyon sınıfını kaldırıp reflow ile yeniden tetikler
  #replay(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  #clearTimers() {
    this.#timers.forEach(clearTimeout);
    this.#timers = [];
  }
}
