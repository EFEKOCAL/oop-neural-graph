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
    (u.snippets || []).forEach((s) => {
      body += `<section class="rp-snip">
        <h3 class="rp-h">${esc(s.title)}</h3>
        ${code(s.code)}
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
        ${a.code ? `<h3 class="rp-h">Çözüm${a.main ? ` · ${esc(a.main)}.java` : ''}</h3>${code(a.code)}` : ''}
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
    } else if (btn.dataset.act === 'solve') {
      const sol = root.querySelector('.rp-sol');
      sol.hidden = !sol.hidden;
      btn.textContent = sol.hidden ? 'Çözümü göster' : 'Çözümü gizle';
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
    root.innerHTML = `<div class="learn rapid">${u ? pageUnit(u) : pageIndex()}</div>`;
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
    navigate(p);
  }

  function unmount() {
    if (root) {
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
