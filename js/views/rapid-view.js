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
    data: { done: {}, drafts: {} },
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
          </a></li>`).join('')}</ol>`).join('')}`;
  }

  function rowMeta(u) {
    if (u.snippets && u.stage === 'konu') return `${u.snippets.length} kod parçası`;
    if (u.covers) return u.covers.slice(0, 5).join(' · ') + (u.covers.length > 5 ? ' …' : '');
    return u.format || '';
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
    const draft = Store.data.drafts[u.id] || '';
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
      <div class="btn-row"><button class="btn btn-primary" type="button" data-act="solve">Çözümü göster</button></div>
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
    navigate(p);
  }

  function unmount() {
    window.removeEventListener('resize', layoutNotes);
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
