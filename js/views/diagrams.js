/*
 * diagrams.js — Ders notlarındaki şekiller (slaytlardaki şekillerin etkileşimli karşılıkları).
 *
 * Şekil türleri:
 *   explorer → öğelere tıklanınca açıklama gösterir (info[k] metin ya da {text, hl:[ek vurgu]})
 *   stepper  → adım adım ilerler; her adım data-k anahtarlarını vurgular, data-v metinlerini değiştirir
 *   tabs     → sekmeli karşılaştırma
 *   custom   → kendi render/init fonksiyonu olan özel etkileşim
 */
(function (OOPLab) {
  'use strict';

  const b = (k, title, sub, cls) => `<div class="dg-b${cls ? ' ' + cls : ''}" data-k="${k}"><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</div>`;
  const ar = (d) => `<div class="dg-ar dg-ar-${d || 'right'}">${{ down: '↓', up: '↑', left: '←', both: '⇅' }[d] || '→'}</div>`;
  const row = (...xs) => `<div class="dg-row">${xs.join('')}</div>`;
  const col = (...xs) => `<div class="dg-col">${xs.join('')}</div>`;
  const band = (label, cls, inner) => `<div class="dg-band ${cls}"><span class="dg-band-label">${label}</span>${inner}</div>`;

  const D = {};


  /* OOP şekilleri ayrı dosyalarda OOPLab.diagrams.register ile eklenir */

  /* =============================================================== render / init */

  function render(id) {
    const d = D[id];
    if (!d) return `<p class="empty">Şekil bulunamadı: ${id}</p>`;
    if (d.kind === 'custom') return d.render();
    const stage = d.kind === 'tabs'
      ? `<div class="dg-tabs">${d.panes.map((p, i) => `<button type="button" class="dg-tab${i === 0 ? ' active' : ''}" data-tab="${i}">${p.label}</button>`).join('')}</div><div class="dg-stage">${d.panes[0].html}</div>`
      : `<div class="dg-stage${d.stageCls ? ' ' + d.stageCls : ''}">${d.html}</div>`;
    const ctrl = d.kind === 'stepper'
      ? `<div class="dg-ctrl"><button class="btn btn-sm" type="button" data-act="prev">◀ Geri</button><span class="dg-count"></span><button class="btn btn-sm btn-primary" type="button" data-act="next">İleri ▶</button><button class="btn btn-sm btn-ghost" type="button" data-act="play">⏵ Otomatik</button><button class="btn btn-sm btn-ghost" type="button" data-act="reset" title="Başa al">↺</button></div>`
      : '';
    const cap = d.kind === 'tabs' ? d.panes[0].text : d.kind === 'stepper' ? d.intro : d.hint;
    return `<figure class="dg dg-k-${d.kind}" data-dg="${id}">${stage}${ctrl}<figcaption class="dg-caption">${cap}</figcaption></figure>`;
  }

  function initExplorer(el, d) {
    const cap = el.querySelector('.dg-caption');
    el.querySelector('.dg-stage').addEventListener('click', (ev) => {
      const t = ev.target.closest('[data-k]');
      if (!t || !(t.dataset.k in d.info)) return;
      const info = d.info[t.dataset.k];
      const hl = [t.dataset.k].concat(typeof info === 'object' ? info.hl || [] : []);
      el.querySelectorAll('[data-k]').forEach((n) => n.classList.toggle('on', hl.includes(n.dataset.k)));
      cap.innerHTML = typeof info === 'object' ? info.text : info;
    });
  }

  function initStepper(el, d) {
    let i = -1;
    let timer = 0;
    const cap = el.querySelector('.dg-caption');
    const count = el.querySelector('.dg-count');
    const playBtn = el.querySelector('[data-act="play"]');
    const apply = () => {
      const on = i >= 0 ? d.steps[i].on : [];
      const done = new Set();
      const vals = Object.assign({}, d.initSet || {});
      let hide = d.initHide || [];
      for (let j = 0; j <= i; j++) {
        if (j < i) d.steps[j].on.forEach((k) => done.add(k));
        Object.assign(vals, d.steps[j].set || {});
        if (d.steps[j].hide) hide = d.steps[j].hide;
      }
      el.querySelectorAll('[data-k]').forEach((n) => {
        const k = n.dataset.k;
        n.classList.toggle('on', on.includes(k));
        n.classList.toggle('done', !on.includes(k) && done.has(k));
        n.classList.toggle('dg-hidden', hide.includes(k));
      });
      Object.entries(vals).forEach(([k, v]) => el.querySelectorAll(`[data-v="${k}"]`).forEach((n) => { n.textContent = v; }));
      cap.innerHTML = i < 0 ? d.intro : d.steps[i].text;
      count.textContent = `${i + 1} / ${d.steps.length}`;
      el.querySelector('[data-act="prev"]').disabled = i < 0;
      el.querySelector('[data-act="next"]').disabled = i >= d.steps.length - 1;
    };
    const stop = () => { clearInterval(timer); timer = 0; playBtn.textContent = '⏵ Otomatik'; };
    el.querySelector('.dg-ctrl').addEventListener('click', (ev) => {
      const a = ev.target.closest('[data-act]');
      if (!a) return;
      if (a.dataset.act === 'next' && i < d.steps.length - 1) { i++; stop(); }
      if (a.dataset.act === 'prev' && i >= 0) { i--; stop(); }
      if (a.dataset.act === 'reset') { i = -1; stop(); }
      if (a.dataset.act === 'play') {
        if (timer) { stop(); } else {
          if (i >= d.steps.length - 1) i = -1;
          playBtn.textContent = '⏸ Durdur';
          timer = setInterval(() => {
            if (!el.isConnected || i >= d.steps.length - 1) { stop(); return; }
            i++;
            apply();
          }, 2200);
          i++;
        }
      }
      apply();
    });
    apply();
  }

  function initTabs(el, d) {
    const stage = el.querySelector('.dg-stage');
    const cap = el.querySelector('.dg-caption');
    el.querySelector('.dg-tabs').addEventListener('click', (ev) => {
      const t = ev.target.closest('[data-tab]');
      if (!t) return;
      const p = d.panes[Number(t.dataset.tab)];
      el.querySelectorAll('.dg-tab').forEach((x) => x.classList.toggle('active', x === t));
      stage.innerHTML = p.html;
      cap.innerHTML = p.text;
    });
  }

  function init(root) {
    root.querySelectorAll('[data-dg]').forEach((el) => {
      if (el.dataset.ready) return;
      el.dataset.ready = '1';
      const d = D[el.dataset.dg];
      if (!d) return;
      if (d.kind === 'explorer') initExplorer(el, d);
      else if (d.kind === 'stepper') initStepper(el, d);
      else if (d.kind === 'tabs') initTabs(el, d);
      else d.init(el);
    });
  }

  OOPLab.diagrams = { render, init, register: (id, def) => { D[id] = def; }, has: (id) => id in D, ids: () => Object.keys(D), h: { b, ar, row, col, band } };
})(window.OOPLab = window.OOPLab || {});
