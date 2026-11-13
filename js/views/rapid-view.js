/*
 * rapid-view.js — "Hızlandırılmış öğrenme" modülü.
 *
 * Rotalar:
 *   #/hizli          genel sayfa: puan tablosu ve üç aşamanın ünite listesi
 *   #/hizli/<id>     tek ünite: konu (yorumlu kod), birleşik örnek ya da pratik soru
 *
 * İçerik js/data/rapid-content.js'te. "Bitti" işaretleri ve pratik taslakları
 * localStorage'da tutulur; erişilemezse sayfa yine çalışır.
 */
(function (OOPLab) {
  'use strict';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const trim = (code) => String(code).replace(/^\n+|\s+$/g, '');

  const Store = {
    key: 'OOPLab.rapid.v1',
    data: { done: {}, drafts: {}, quiz: {} },
    load() {
      try {
        const raw = JSON.parse(localStorage.getItem(this.key));
        if (raw) Object.assign(this.data, raw);
      } catch (e) { /* gizli pencere vb. */ }
    },
    save() {
      try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) { /* yok say */ }
    }
  };
  Store.load();

  const STAGES = [
    { id: 'konu', n: '1', title: 'Konular', sub: 'Yorum satırı bol kısa kodlar. Tanım, kural, sınav tuzağı ve sık hata kodun içinde.' },
    { id: 'birlesik', n: '2', title: 'Birleşik örnekler', sub: 'Konuların tek programda birlikte kullanımı.' },
    { id: 'pratik', n: '3', title: 'Kod yazma pratiği', sub: 'Geçmiş vize formatında sorular ve derlenip çalıştırılmış çözümler.' }
  ];

  let root = null;

  const units = () => OOPLab.rapid.units;
  const isDone = (u) => !!Store.data.done[u.id];
  const unitHref = (u) => `#/hizli/${u.id}`;
  const nextUndone = () => units().find((u) => !isDone(u)) || null;

  const code = (src) => `<pre class="l-code jcode">${OOPLab.java.highlight(trim(src))}</pre>`;
  // Kenar notlu kod: geniş ekranda notlar sağ sütunda gövdenin hizasında (layoutNotes konumlar),
  // dar ekranda gövdenin hemen üstünde kodun içinde durur.
  const noteInner = (n) => `<b>${n.title}</b><span>${n.text}</span>`;
  function annotated(src, key) {
    const notes = OOPLab.rapidNotes && OOPLab.rapidNotes.map[key];
    if (!notes) return code(src);
    const res = OOPLab.rapidNotes.resolve(src, notes).map((n, k) => n && Object.assign(n, { k })).filter(Boolean);
    const attrs = (n) => `data-s="${n.s}" data-e="${n.e}"`;
    const lines = OOPLab.java.highlight(trim(src)).split('\n').map((ln, i) =>
      res.filter((n) => n.s === i).map((n) => `<span class="rp-note rp-note-in k-${n.kind}" ${attrs(n)}>${noteInner(n)}</span>`).join('')
      + `<span class="jl" data-l="${i}">${ln || ' '}</span>`).join('');
    return `<div class="rp-ann">
      <pre class="l-code jcode rp-ann-code">${lines}</pre>
      <div class="rp-ann-side">${res.map((n) => `<div class="rp-note k-${n.kind}" ${attrs(n)}>${noteInner(n)}</div>`).join('')}</div>
    </div>`;
  }

  const SIDE_MIN = 900;   // kod + not sütunu için gereken en az genişlik
  function layoutNotes() {
    if (!root) return;
    root.querySelectorAll('.rp-ann').forEach((w) => {
      const side = w.clientWidth >= SIDE_MIN;
      w.classList.toggle('side', side);
      if (!side || !w.offsetParent) return;
      const pre = w.querySelector('pre');
      const col = w.querySelector('.rp-ann-side');
      const base = col.getBoundingClientRect().top;
      let bottom = 0;
      col.querySelectorAll('.rp-note').forEach((n) => {
        const ln = pre.querySelector(`.jl[data-l="${n.dataset.s}"]`);
        const top = Math.max(ln.getBoundingClientRect().top - base, bottom);
        n.style.top = `${top}px`;
        bottom = top + n.offsetHeight + 8;
      });
      col.style.minHeight = `${bottom}px`;
    });
  }

  // Nota gelince kodda gövdenin satırları vurgulanır
  function markLines(note, on) {
    const pre = note.closest('.rp-ann').querySelector('pre');
    const cs = getComputedStyle(note);
    pre.style.setProperty('--nc', cs.getPropertyValue('--nc'));
    pre.style.setProperty('--nc-soft', cs.getPropertyValue('--nc-soft'));
    for (let i = Number(note.dataset.s); i <= Number(note.dataset.e); i++) {
      const ln = pre.querySelector(`.jl[data-l="${i}"]`);
      if (ln) ln.classList.toggle('hl', on);
    }
    note.classList.toggle('hl', on);
  }
  function onHover(e) {
    const n = e.target.closest('.rp-note');
    if (!n) return;
    const to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.rp-note');
    if (to === n) return;
    markLines(n, e.type === 'mouseover');
  }

  const numbered = (src) => `<pre class="rp-lines">${OOPLab.java.lines(src)}</pre>`;
  const output = (text, label) => `<details class="rp-out"><summary>${label || 'Çıktı (önce kendin tahmin et)'}</summary><pre>${esc(text)}</pre></details>`;
  const pointsBadge = (u) => (u.points ? `<span class="rp-pts">≈ ${u.points} / 300 puan</span>` : '');

  /* ------------------------------------------------------------ genel sayfa */

  function pageIndex() {
    const P = OOPLab.rapid.points;
    const all = units();
    const done = all.filter(isDone).length;
    const nx = nextUndone();
    return `
      <section class="card rp-head">
        <span class="tag">BLM2005 · Ara sınav · Hızlandırılmış öğrenme</span>
        <h2>Hızlandırılmış öğrenme</h2>
        <p>Konular geçmiş üç vizede (2022-23, 2024-25, 2025-26) getirdikleri toplam puana göre sıralı. Her konu kısa, çalışan Java kodlarıyla anlatılıyor; teori, kurallar ve sınav tuzakları kodun içindeki yorum satırlarında. Ardından konuların birlikte kullanıldığı örnekler, en sonda vize formatında kod yazma soruları geliyor.</p>
        <div class="rp-progress"><div class="l-bar"><i style="width:${Math.round((done / all.length) * 100)}%"></i></div><span>${done} / ${all.length} ünite</span></div>
        <div class="btn-row">
          ${nx ? `<a class="btn btn-primary" href="${unitHref(nx)}">▶ ${done ? 'Devam et' : 'Başla'}: ${nx.no} ${esc(nx.title)}</a>` : '<span class="pill ok">Tüm üniteler bitti</span>'}
          <a class="btn" href="#/hizli/soru">Soru-cevap</a>
          <a class="btn" href="#/hizli/ozet">Son gün tekrar sayfası</a>
          <a class="btn" href="#/learn">Normal akışa dön</a>
        </div>
      </section>

      <h3 class="l-section">Puan dağılımı</h3>
      <div class="card"><div class="table-wrap"><table class="rp-table">
        <thead><tr>${P.head.map((h, i) => `<th${i ? ' class="num"' : ''}>${h}</th>`).join('')}</tr></thead>
        <tbody>${P.rows.map((r) => `<tr>${r.map((c, i) => `<td${i ? ' class="num"' : ''}>${i === r.length - 1 ? `<b>${c}</b>` : c}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>
      <p class="hint">${P.note}</p></div>

      ${STAGES.map((st) => `
        <h3 class="l-section">${st.n} · ${st.title}</h3>
        <p class="rp-stage-sub">${st.sub}</p>
        <ol class="rp-list">${all.filter((u) => u.stage === st.id).map((u) => `
          <li><a class="card rp-row${isDone(u) ? ' done' : ''}" href="${unitHref(u)}">
            <span class="rp-no">${isDone(u) ? '✓' : u.no}</span>
            <span class="rp-row-text"><b>${esc(u.title)}</b><small>${rowMeta(u)}</small></span>
            ${u.points ? `<span class="rp-pts">≈ ${u.points}p</span>` : ''}
          </a></li>`).join('')}</ol>`).join('')}

      <h3 class="l-section">4 · Kendini yokla</h3>
      <p class="rp-stage-sub">Okuduğunu hatırlamaya çalışmak, tekrar okumaktan daha kalıcı.</p>
      <ol class="rp-list">
        <li><a class="card rp-row" href="#/hizli/soru">
          <span class="rp-no">?</span>
          <span class="rp-row-text"><b>Soru-cevap</b><small>${quiz().length} soru, tek tek. Seçince hemen doğru/yanlış ve nedeni; yanlışlar sonda tekrar gelir.</small></span>
        </a></li>
        <li><a class="card rp-row" href="#/hizli/p1">
          <span class="rp-no">✎</span>
          <span class="rp-row-text"><b>Kod yazma provası</b><small>P1–P3: kodu yaz, "Kontrol et" istenen maddeleri işaretleyip tahmini puan versin. Sayaçla çöz.</small></span>
        </a></li>
      </ol>`;
  }

  function rowMeta(u) {
    if (u.snippets && u.stage === 'konu') return `${u.snippets.length} kod parçası`;
    if (u.covers) return u.covers.slice(0, 5).join(' · ') + (u.covers.length > 5 ? ' …' : '');
    return u.format || '';
  }

  /* ------------------------------------------------------------ soru-cevap (#/hizli/soru) */

  // Tek tek soru: seçince hemen doğru/yanlış ve nedeni. Yanlışlar kuyruğun sonuna bir kez daha eklenir.
  const quiz = () => OOPLab.rapid.quiz || [];
  const quizById = (id) => quiz().find((q) => q.id === id);
  const topicTitle = (t) => (units().find((u) => u.id === t) || { title: t }).title;
  let Q = null;

  function quizStart(onlyWrong) {
    const res = Store.data.quiz || {};
    let list = onlyWrong ? quiz().filter((q) => res[q.id] === 'bad') : quiz();
    if (!list.length) list = quiz();
    Q = { queue: list.map((q) => q.id), total: list.length, i: 0, picked: null, first: {}, again: new Set() };
  }

  // Çıktı sorularında seçenekler konsol çıktısıdır (düz metin, eş aralıklı); diğerlerinde HTML
  const optHtml = (q, o) => (q.main ? `<pre class="rp-opt-pre">${esc(o)}</pre>` : `<span>${o}</span>`);

  function pageQuiz() {
    if (!Q) quizStart(false);
    if (Q.i >= Q.queue.length) return quizEnd();
    const q = quizById(Q.queue[Q.i]);
    const done = Q.picked !== null;
    const firstOk = Object.values(Q.first).filter((v) => v === 'ok').length;
    return `
      <nav class="l-crumbs"><a href="#/hizli">Hızlandırılmış öğrenme</a> › Soru-cevap</nav>
      <div class="rp-quiz">
        <div class="rp-quiz-top">
          <span>Soru ${Math.min(Q.i + 1, Q.queue.length)} / ${Q.queue.length}${Q.i >= Q.total ? ' · <b class="rp-again">yanlış yaptığın soru, tekrar</b>' : ''}</span>
          <span>İlk denemede doğru: <b>${firstOk}</b> / ${Q.total}</span>
        </div>
        <div class="l-bar"><i style="width:${Math.round((Q.i / Q.queue.length) * 100)}%"></i></div>
        <section class="card rp-qcard">
          <span class="tag">${esc(topicTitle(q.topic))}</span>
          <p class="rp-qq">${q.q}</p>
          ${q.code ? code(q.code) : ''}
          <div class="rp-opts">${q.options.map((o, j) => {
            const cls = !done ? '' : j === q.answer ? ' right' : j === Q.picked ? ' wrong' : ' dim';
            return `<button class="rp-opt${cls}" type="button" data-act="pick" data-j="${j}"${done ? ' disabled' : ''}><span class="rp-opt-l">${'ABCD'[j]}</span>${optHtml(q, o)}</button>`;
          }).join('')}</div>
          ${done ? `<div class="rp-why ${Q.picked === q.answer ? 'ok' : 'bad'}">
              <b>${Q.picked === q.answer ? 'Doğru.' : `Yanlış. Doğru cevap: ${'ABCD'[q.answer]}.`}</b>
              <p>${q.why}</p>
            </div>
            <div class="btn-row"><button class="btn btn-primary" type="button" data-act="qnext" autofocus>Sonraki ▶</button><span class="hint">Klavye: Enter</span></div>`
            : '<p class="hint">Klavye: A, B, C, D ya da 1–4</p>'}
        </section>
      </div>`;
  }

  function quizEnd() {
    const ids = Object.keys(Q.first);
    const ok = ids.filter((id) => Q.first[id] === 'ok').length;
    const byTopic = {};
    ids.filter((id) => Q.first[id] === 'bad').forEach((id) => {
      const t = quizById(id).topic;
      byTopic[t] = (byTopic[t] || 0) + 1;
    });
    const weak = Object.entries(byTopic).sort((a, b) => b[1] - a[1]);
    return `
      <nav class="l-crumbs"><a href="#/hizli">Hızlandırılmış öğrenme</a> › Soru-cevap</nav>
      <section class="card rp-qcard rp-qend">
        <span class="tag">Soru-cevap bitti</span>
        <h2>İlk denemede ${ok} / ${Q.total} doğru</h2>
        ${weak.length ? `<p>Yanlış yaptığın konular (önce bunlara dön):</p>
          <ul class="l-list">${weak.map(([t, n]) => `<li><a href="#/hizli/${t}">${esc(topicTitle(t))}</a>: ${n} yanlış</li>`).join('')}</ul>`
          : '<p>Hepsini ilk denemede bildin.</p>'}
        <div class="btn-row">
          ${weak.length ? '<button class="btn btn-primary" type="button" data-act="qwrong">Yalnızca yanlışları tekrar sor</button>' : ''}
          <button class="btn" type="button" data-act="qrestart">Baştan başla</button>
          <a class="btn" href="#/hizli/p1">Kod yazma provasına geç</a>
        </div>
      </section>`;
  }

  function quizPick(j) {
    if (!Q || Q.picked !== null || Q.i >= Q.queue.length) return;
    const q = quizById(Q.queue[Q.i]);
    Q.picked = j;
    const res = j === q.answer ? 'ok' : 'bad';
    if (!(q.id in Q.first)) Q.first[q.id] = res;
    Store.data.quiz = Store.data.quiz || {};
    Store.data.quiz[q.id] = res;
    Store.save();
    if (res === 'bad' && !Q.again.has(q.id)) {
      Q.again.add(q.id);
      Q.queue.push(q.id);
    }
    draw();
  }

  function quizNext() {
    Q.i++;
    Q.picked = null;
    draw();
    if (root) root.scrollTop = 0;
    const v = document.getElementById('view');
    if (v) v.scrollTop = 0;
  }

  function onQuizKey(e) {
    if (params[0] !== 'soru' || !Q || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();
    const idx = 'abcd'.indexOf(k) >= 0 ? 'abcd'.indexOf(k) : '1234'.indexOf(k);
    if (Q.picked === null && idx >= 0 && Q.i < Q.queue.length && idx < quizById(Q.queue[Q.i]).options.length) {
      e.preventDefault();
      quizPick(idx);
    } else if (Q.picked !== null && e.key === 'Enter') {
      e.preventDefault();
      quizNext();
    }
  }

  /* ------------------------------------------------------------ kod yazma provası: otomatik kontrol */

  const stripComments = (s) => String(s).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  const normLines = (s) => String(s).replace(/\r/g, '').split('\n').map((l) => l.trim()).filter((l, i, a) => l || (i > 0 && i < a.length - 1));

  function checkDraft(u) {
    const p = u.practice;
    const draft = Store.data.drafts[u.id] || '';
    if (!draft.trim()) return '<p class="rp-score-empty">Önce cevabını kutuya yaz.</p>';
    if (p.checks) {
      const c = stripComments(draft);
      const rows = p.checks.map(([label, pts, re, not]) => ({ label, pts, ok: re.test(c) && !(not && not.test(c)) }));
      const got = rows.filter((r) => r.ok).reduce((s, r) => s + r.pts, 0);
      const total = rows.reduce((s, r) => s + r.pts, 0);
      return `<div class="rp-score-head"><b>Tahmini puan: ${got} / ${total}</b><div class="l-bar"><i style="width:${Math.round((got / total) * 100)}%"></i></div></div>
        <ul class="rp-score-list">${rows.map((r) => `<li class="${r.ok ? 'ok' : 'bad'}"><span>${r.ok ? '✓' : '✗'}</span><span>${r.label}</span><small>${r.ok ? r.pts : 0}/${r.pts}p</small></li>`).join('')}</ul>
        <p class="hint">Bu bir derleyici değil: kodda istenen kalıpların olup olmadığına bakar. Yazım hatası yapsan da kalıp tutarsa puan verir; farklı ama doğru bir yol seçtiysen ✗ görebilirsin. Emin olmak için çözümle karşılaştır.</p>`;
    }
    if (p.givenKind === 'program') {
      const want = normLines(p.answer.output);
      const have = normLines(draft);
      const ok = want.filter((l, i) => have[i] === l).length;
      return `<div class="rp-score-head"><b>${ok} / ${want.length} satır doğru${have.length !== want.length ? ` · sen ${have.length} satır yazdın, doğrusu ${want.length}` : ''}</b><div class="l-bar"><i style="width:${Math.round((ok / want.length) * 100)}%"></i></div></div>
        <ul class="rp-score-list">${want.map((l, i) => `<li class="${have[i] === l ? 'ok' : 'bad'}"><span>${have[i] === l ? '✓' : '✗'}</span><span>${i + 1}. satır: <code>${esc(have[i] || '(boş)')}</code></span></li>`).join('')}</ul>
        <p class="hint">Satırların başındaki ve sonundaki boşluklar önemsenmez. Hangi satırın doğrusu ne, görmek için çözümü aç.</p>`;
    }
    if (p.givenKind === 'buggy') {
      const nums = new Set([...draft.matchAll(/(?:^|[^\d.])(\d{1,2})(?!\d|\.\d)/gm)].map((m) => Number(m[1])).filter((n) => n >= 1 && n <= trim(p.given).split('\n').length));
      const found = p.bugs.filter((b) => nums.has(b));
      const extra = [...nums].filter((n) => !p.bugs.includes(n)).sort((a, b) => a - b);
      return `<div class="rp-score-head"><b>${found.length} / ${p.bugs.length} hatalı satırı buldun</b><div class="l-bar"><i style="width:${Math.round((found.length / p.bugs.length) * 100)}%"></i></div></div>
        <p>${found.length ? `Doğru bulunan satırlar: <b>${found.join(', ')}</b>.` : ''} ${extra.length ? `Hatası olmayan satır numaraları da yazdın: ${extra.join(', ')}.` : ''}</p>
        <p class="hint">Yalnızca yazdığın satır numaralarına bakar. Nedenleri çözümdeki açıklamayla karşılaştır.</p>`;
    }
    return '';
  }

  let timer = null;
  function stopTimer() { if (timer) { clearInterval(timer.id); timer = null; } }
  function startTimer(btn, minutes) {
    stopTimer();
    const end = Date.now() + minutes * 60000;
    const tick = () => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      const b = root && root.querySelector('[data-act="timer"]');
      if (b) {
        b.textContent = left ? `⏱ ${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}` : 'Süre doldu';
        b.classList.toggle('rp-timer-late', left < 300);
      }
      if (!left) stopTimer();
    };
    timer = { id: setInterval(tick, 1000), end };
    tick();
  }

  /* ------------------------------------------------------------ son gün tekrar sayfası */

  function pageSummary() {
    const S = OOPLab.rapid.summary;
    const blanks = (units().find((u) => u.blanks) || { blanks: [] }).blanks;
    return `
      <nav class="l-crumbs no-print"><a href="#/hizli">Hızlandırılmış öğrenme</a> › Son gün tekrarı</nav>
      <section class="card rp-head">
        <span class="tag">BLM2005 · Ara sınav · 80 dakika</span>
        <h2>Son gün tekrar sayfası</h2>
        <p>Sınav sabahı 15 dakikada göz gezdirmek için. Yazdırınca beyaz zemin üzerine siyah çıkar.</p>
        <div class="btn-row no-print"><button class="btn btn-primary" type="button" data-act="print">Yazdır / PDF kaydet</button><a class="btn" href="#/hizli">Listeye dön</a></div>
      </section>

      <h3 class="l-section">Süre planı</h3>
      <div class="card"><div class="table-wrap"><table class="rp-table">
        <thead><tr><th>Soru türü</th><th class="num">Puan</th><th class="num">Süre</th><th>Nasıl</th></tr></thead>
        <tbody>${S.plan.map((r) => `<tr><td><b>${r[0]}</b></td><td class="num">${r[1]}</td><td class="num">${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody>
      </table></div></div>

      <h3 class="l-section">40 puanlık soru kontrol listesi</h3>
      <div class="card"><ol class="l-list rp-check">${S.checklist.map((x) => `<li>${x}</li>`).join('')}</ol></div>

      <h3 class="l-section">Tasarım sorusu şablonu</h3>
      ${annotated(S.template.code, 'ozet:template')}
      <div class="rp-outbox"><span>Şablonun çıktısı</span><pre>${esc(S.template.output)}</pre></div>

      <h3 class="l-section">Kurallar</h3>
      <div class="rp-rules">${S.rules.map(([t, items]) => `
        <section class="card"><b>${t}</b><ul class="l-list">${items.map((x) => `<li>${x}</li>`).join('')}</ul></section>`).join('')}</div>

      <h3 class="l-section">Çıktı sorusu yöntemi</h3>
      <div class="card"><ol class="l-list">${S.trace.map((x) => `<li>${x}</li>`).join('')}</ol></div>

      <h3 class="l-section">Kavram boşlukları: cevaplar</h3>
      <div class="card"><div class="table-wrap"><table class="rp-table rp-blank-table"><tbody>
        ${blanks.map(([q, a]) => `<tr><td>${q}</td><td><b>${a}</b></td></tr>`).join('')}
      </tbody></table></div></div>`;
  }

  /* ------------------------------------------------------------ ünite sayfası */

  function pageUnit(u) {
    const all = units();
    const i = all.indexOf(u);
    const prev = all[i - 1];
    const next = all[i + 1];
    const stage = STAGES.find((s) => s.id === u.stage);

    let body = '';
    if (u.exam) {
      body += `<div class="card rp-exam"><b>Geçmiş vizelerde böyle çıktı</b><ul class="l-list">${u.exam.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
    }
    if (u.covers) {
      body += `<div class="rp-covers">${u.covers.map((c) => `<span>${esc(c)}</span>`).join('')}</div>`;
    }
    if (u.intro) body += `<p class="rp-intro">${u.intro}</p>`;
    (u.snippets || []).forEach((s, i) => {
      body += `<section class="rp-snip">
        <h3 class="rp-h">${esc(s.title)}</h3>
        ${annotated(s.code, `${u.id}:${i}`)}
        ${output(s.output)}
      </section>`;
    });
    if (u.practice) body += practiceHtml(u);
    if (u.blanks) body += blanksHtml(u);

    return `
      <nav class="l-crumbs"><a href="#/hizli">Hızlandırılmış öğrenme</a> › ${stage.title}</nav>
      <section class="card rp-head">
        <span class="tag">${stage.n} · ${stage.title} · ${u.no}${u.format ? ' · ' + esc(u.format) : ''}</span>
        <h2>${esc(u.title)}</h2>
        ${pointsBadge(u)}
      </section>
      ${body}
      <div class="rp-foot">
        <button class="btn ${isDone(u) ? '' : 'btn-primary'}" type="button" data-act="done" data-id="${u.id}">${isDone(u) ? '✓ Bitti (geri al)' : 'Bitti olarak işaretle'}</button>
        <div class="btn-row">
          ${prev ? `<a class="btn btn-sm" href="${unitHref(prev)}">◀ ${prev.no}</a>` : ''}
          <a class="btn btn-sm" href="#/hizli">Liste</a>
          ${next ? `<a class="btn btn-sm" href="${unitHref(next)}">${next.no}: ${esc(next.title)} ▶</a>` : ''}
        </div>
      </div>`;
  }

  function practiceHtml(u) {
    const p = u.practice;
    // İskelet sorusunda kutu iskeletle dolu başlar: bloklar doğrudan doldurulur
    const draft = u.id in Store.data.drafts ? Store.data.drafts[u.id] : (p.givenKind === 'skeleton' ? trim(p.given) : '');
    const canCheck = p.checks || p.givenKind === 'program' || p.givenKind === 'buggy';
    const minutes = p.minutes || 10;
    let given = '';
    if (p.givenKind === 'skeleton') given = `<h3 class="rp-h">Kod iskeleti</h3>${code(p.given)}`;
    else if (p.givenKind === 'program') given = code(p.given);
    else if (p.givenKind === 'buggy') given = numbered(p.given);

    const a = p.answer;
    return `
      <section class="card rp-q">
        <p class="rp-q-text">${p.q}</p>
        ${p.req ? `<b>İstenenler</b><ul class="l-list">${p.req.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}
      </section>
      ${given}
      <label class="rp-draft-label" for="rp-draft">Cevabın (taslak, bu tarayıcıda saklanır)</label>
      <textarea class="rp-draft" id="rp-draft" data-id="${u.id}" spellcheck="false" placeholder="${p.givenKind === 'program' || p.givenKind === 'buggy' ? 'Çıktıyı ya da hataları buraya yaz…' : 'Kodu buraya yaz…'}">${esc(draft)}</textarea>
      <div class="btn-row">
        ${canCheck ? `<button class="btn btn-primary" type="button" data-act="check" data-id="${u.id}">Kontrol et${p.checks ? ' (puanla)' : ''}</button>` : ''}
        <button class="btn" type="button" data-act="solve">Çözümü göster</button>
        <button class="btn rp-timer" type="button" data-act="timer" data-min="${minutes}">⏱ ${minutes} dk sayaç</button>
      </div>
      <div class="card rp-score" hidden></div>
      <div class="rp-sol" hidden>
        ${a.html ? `<div class="rp-explain">${a.html}</div>` : ''}
        ${a.code ? `<h3 class="rp-h">Çözüm${a.main ? ` · ${esc(a.main)}.java` : ''}</h3>${annotated(a.code, `${u.id}:answer`)}` : ''}
        ${a.output ? `<div class="rp-outbox"><span>${a.code ? 'Çözümün çıktısı' : 'Doğru çıktı'}</span><pre>${esc(a.output)}</pre></div>` : ''}
        ${p.rubric ? `<div class="card rp-rubric"><b>Tahmini puanlama</b><ul class="l-list">${p.rubric.map((x) => `<li>${x}</li>`).join('')}</ul></div>` : ''}
      </div>`;
  }

  function blanksHtml(u) {
    return `
      <p class="rp-intro">Her cümlede boşluğu kafanda doldur, sonra cevabı aç. Cümlelerin çoğu 2022, 2024 ve 2025 vizelerinin 1. sorusundan.</p>
      <ol class="rp-blanks">${u.blanks.map(([q, a]) => `
        <li><p>${q}</p><details><summary>Cevap</summary><span>${a}</span></details></li>`).join('')}</ol>`;
  }

  /* ------------------------------------------------------------ olaylar */

  function onClick(e) {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    if (btn.dataset.act === 'done') {
      const id = btn.dataset.id;
      if (Store.data.done[id]) delete Store.data.done[id];
      else Store.data.done[id] = new Date().toISOString().slice(0, 10);
      Store.save();
      if (Store.data.done[id]) {
        const all = units();
        const nx = all[all.findIndex((u) => u.id === id) + 1];
        if (nx) { location.hash = unitHref(nx); return; }
      }
      draw();
    } else if (btn.dataset.act === 'pick') {
      quizPick(Number(btn.dataset.j));
    } else if (btn.dataset.act === 'qnext') {
      quizNext();
    } else if (btn.dataset.act === 'qrestart' || btn.dataset.act === 'qwrong') {
      quizStart(btn.dataset.act === 'qwrong');
      draw();
    } else if (btn.dataset.act === 'check') {
      const u = units().find((x) => x.id === btn.dataset.id);
      const box = root.querySelector('.rp-score');
      box.innerHTML = checkDraft(u);
      box.hidden = false;
      box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else if (btn.dataset.act === 'timer') {
      if (timer) { stopTimer(); btn.textContent = `⏱ ${btn.dataset.min} dk sayaç`; btn.classList.remove('rp-timer-late'); }
      else startTimer(btn, Number(btn.dataset.min));
    } else if (btn.dataset.act === 'print') {
      window.print();
    } else if (btn.dataset.act === 'solve') {
      const sol = root.querySelector('.rp-sol');
      sol.hidden = !sol.hidden;
      btn.textContent = sol.hidden ? 'Çözümü göster' : 'Çözümü gizle';
      layoutNotes();
    }
  }

  function onInput(e) {
    if (!e.target.matches('.rp-draft')) return;
    Store.data.drafts[e.target.dataset.id] = e.target.value;
    Store.save();
  }

  // Taslak kutusunda Tab tuşu odak değiştirmek yerine girinti eklesin
  function onKeydown(e) {
    if (e.key !== 'Tab' || !e.target.matches('.rp-draft')) return;
    e.preventDefault();
    const t = e.target;
    const s = t.selectionStart;
    t.value = t.value.slice(0, s) + '    ' + t.value.slice(t.selectionEnd);
    t.selectionStart = t.selectionEnd = s + 4;
    onInput(e);
  }

  /* ------------------------------------------------------------ yönlendirme */

  let params = [];

  function draw() {
    const u = units().find((x) => x.id === params[0]);
    const ozet = params[0] === 'ozet';
    if (params[0] === 'soru') {
      document.body.classList.remove('rp-summary');
      root.innerHTML = `<div class="learn rapid">${pageQuiz()}</div>`;
      OOPLab.app.setHeader({ num: 'H', title: 'Soru-cevap', sub: 'Tek tek soru, anında cevap' });
      const nx = root.querySelector('[data-act="qnext"]');
      if (nx) nx.focus({ preventScroll: true });
      return;
    }
    document.body.classList.toggle('rp-summary', ozet);
    root.innerHTML = `<div class="learn rapid${u || ozet ? ' rapid-unit' : ''}">${ozet ? pageSummary() : u ? pageUnit(u) : pageIndex()}</div>`;
    if (ozet) {
      OOPLab.app.setHeader({ num: 'H', title: 'Son gün tekrarı', sub: 'Hızlandırılmış öğrenme' });
      layoutNotes();
      requestAnimationFrame(layoutNotes);
      return;
    }
    layoutNotes();
    requestAnimationFrame(layoutNotes);   // yazı tipleri ve kaydırma çubuğu oturduktan sonra yeniden
    OOPLab.app.setHeader(u
      ? { num: 'H', title: `${u.no} · ${u.title}`, sub: 'Hızlandırılmış öğrenme' }
      : { num: 'H', title: 'Hızlandırılmış öğrenme', sub: 'Puan sırasına göre: kod → birleşik örnek → pratik' });
  }

  function navigate(p) {
    params = p || [];
    stopTimer();
    draw();
  }

  function mount(container, p) {
    root = container;
    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('keydown', onKeydown);
    root.addEventListener('mouseover', onHover);
    root.addEventListener('mouseout', onHover);
    window.addEventListener('resize', layoutNotes);
    document.addEventListener('keydown', onQuizKey);
    navigate(p);
  }

  function unmount() {
    window.removeEventListener('resize', layoutNotes);
    document.removeEventListener('keydown', onQuizKey);
    stopTimer();
    document.body.classList.remove('rp-summary');
    if (root) {
      root.removeEventListener('mouseover', onHover);
      root.removeEventListener('mouseout', onHover);
      root.removeEventListener('click', onClick);
      root.removeEventListener('input', onInput);
      root.removeEventListener('keydown', onKeydown);
    }
    root = null;
  }

  OOPLab.modules = OOPLab.modules || {};
  OOPLab.modules.hizli = {
    num: 'H',
    title: 'Hızlandırılmış öğrenme',
    subtitle: 'Puan sırasına göre: kod → birleşik örnek → pratik',
    mount,
    unmount,
    navigate
  };
})(window.OOPLab = window.OOPLab || {});
