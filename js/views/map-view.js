/*
 * map-view.js — "Nöral Bakış": tüm dersin yukarıdan aşağı dallanan ağaç haritası.
 * Tepede merkez (OOP) → ana düğümler (bölümler) → küçük düğümler (dersler); ayrıca laboratuvar dalı.
 * Ders akışını bozmaz: yalnızca menüdeki / başlangıç ekranındaki düğmeyle açılır (#/map).
 * İlerleme, Ders Notları'nın localStorage kaydından okunur (salt okunur).
 */
(function (OOPLab) {
  'use strict';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const COLORS = ['#22c3a6', '#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399', '#94a3b8'];

  const COL_W = 228;
  const ROOT_Y = 58;
  const CH_Y = 226;
  const L0_Y = 312;
  const ROW = 31;

  function progress() {
    let d = {};
    try { d = JSON.parse(localStorage.getItem('ooplab.learn.v1')) || {}; } catch (e) { /* kayıt yok */ }
    return { read: d.read || {}, seen: d.seen || {} };
  }

  function model() {
    const chapters = OOPLab.lessons.chapters;
    const cols = chapters.map((ch, i) => ({
      id: ch.id,
      title: `Bölüm ${ch.num}`,
      sub: ch.title,
      href: `#/learn/${ch.id}`,
      color: COLORS[i % COLORS.length],
      tag: ch.tag,
      kids: ch.lessons.map((l) => ({ id: `${ch.id}/${l.id}`, label: l.title, info: `${l.en} · ${l.src || ''} · ~${l.minutes} dk`, href: `#/learn/${ch.id}/${l.id}`, key: `${ch.id}/${l.id}` }))
    }));
    cols.push({
      id: 'lab',
      title: 'Pratik',
      sub: 'Laboratuvar & sınav',
      href: '#/memory',
      color: COLORS[6],
      kids: [
        { id: 'memory', label: 'L1 · Stack & Heap', info: 'Referanslar, null, aliasing, çöp toplama', href: '#/memory' },
        { id: 'dispatch', label: 'L2 · Kalıtım Laboratuvarı', info: 'Yapıcı zinciri ve dinamik bağlama', href: '#/dispatch' },
        { id: 'exceptions', label: 'L3 · İstisna Akışı', info: 'try · catch · finally · yayılım', href: '#/exceptions' },
        { id: 'sorular', label: 'Sınav Soruları', info: 'Aralıklı tekrar', href: '#/learn/sorular' }
      ]
    });
    return cols;
  }

  const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

  function svg() {
    const cols = model();
    const p = progress();
    const W = 40 + cols.length * COL_W;
    const maxKids = Math.max(...cols.map((c) => c.kids.length));
    const H = L0_Y + maxKids * ROW + 30;
    const rx = W / 2;
    const allLessons = cols.slice(0, -1).flatMap((c) => c.kids);
    const readN = allLessons.filter((k) => p.read[k.key]).length;
    const pct = Math.round((readN / allLessons.length) * 100);

    let links = '';
    let pulses = '';
    let nodes = '';

    cols.forEach((c, i) => {
      const cx = 20 + i * COL_W + COL_W / 2;
      const trunkX = cx - 74;
      const kidsRead = c.kids.filter((k) => k.key && p.read[k.key]).length;
      const frac = c.id === 'lab' ? 0 : kidsRead / c.kids.length;

      // merkez → ana düğüm
      const d = `M ${rx} ${ROOT_Y + 30} C ${rx} ${ROOT_Y + 100}, ${cx} ${CH_Y - 110}, ${cx} ${CH_Y - 30}`;
      links += `<path class="nm-link" data-c="${c.id}" d="${d}" style="--c:${c.color}"/>`;
      pulses += `<path class="nm-pulse" data-c="${c.id}" d="${d}" style="--c:${c.color};animation-delay:${(i * 0.45).toFixed(2)}s"/>`;

      // ana düğüm → gövde → küçük düğümler
      const lastY = L0_Y + (c.kids.length - 1) * ROW;
      links += `<path class="nm-trunk" data-c="${c.id}" d="M ${cx} ${CH_Y + 30} C ${cx} ${CH_Y + 54}, ${trunkX} ${CH_Y + 44}, ${trunkX} ${L0_Y - 22} L ${trunkX} ${lastY - 12}" style="--c:${c.color}"/>`;
      c.kids.forEach((k, j) => {
        const y = L0_Y + j * ROW;
        const kx = trunkX + 24;
        const read = k.key && p.read[k.key];
        const seen = k.key && !read && p.seen[k.key] > 0;
        links += `<path class="nm-twig" data-c="${c.id}" d="M ${trunkX} ${y - 14} Q ${trunkX} ${y}, ${kx - 7} ${y}" style="--c:${c.color}"/>`;
        nodes += `<a class="nm-kid${read ? ' read' : seen ? ' seen' : ''}" data-c="${c.id}" href="${k.href}" data-tip="${esc(k.label)}" data-info="${esc(k.info)}" style="--c:${c.color}">
          <circle cx="${kx}" cy="${y}" r="6.5"/>
          <text x="${kx + 13}" y="${y + 4}">${esc(trunc(k.label, 25))}</text>
        </a>`;
      });

      // ana düğüm + ilerleme halkası
      const R = 30;
      const circ = 2 * Math.PI * (R + 5);
      nodes += `<a class="nm-ch" data-c="${c.id}" href="${c.href}" data-tip="${esc(c.title + ': ' + c.sub)}" data-info="${c.id === 'lab' ? 'Laboratuvarlar ve sınav soruları' : `${kidsRead}/${c.kids.length} ders okundu${c.tag ? ' · ' + esc(c.tag) : ''}`}" style="--c:${c.color}">
        <circle class="nm-ch-glow" cx="${cx}" cy="${CH_Y}" r="${R + 12}"/>
        <circle class="nm-ch-ring" cx="${cx}" cy="${CH_Y}" r="${R + 5}" style="stroke-dasharray:${(circ * frac).toFixed(1)} ${circ.toFixed(1)}" transform="rotate(-90 ${cx} ${CH_Y})"/>
        <circle class="nm-ch-core" cx="${cx}" cy="${CH_Y}" r="${R}"/>
        <text class="nm-ch-t" x="${cx}" y="${CH_Y + 4}">${esc(c.id === 'lab' ? 'L' : c.title.replace('Bölüm ', 'B'))}</text>
        <text class="nm-ch-sub" x="${cx}" y="${CH_Y + R + 24}">${esc(trunc(c.sub, 27))}</text>
      </a>`;
    });

    // merkez düğüm
    nodes += `<a class="nm-root" href="#/learn" data-tip="BLM2005 · Nesne Yönelimli Programlama" data-info="Genel ilerleme %${pct} · ${readN}/${allLessons.length} ders">
      <circle class="nm-root-glow" cx="${rx}" cy="${ROOT_Y}" r="44"/>
      <circle class="nm-root-core" cx="${rx}" cy="${ROOT_Y}" r="30"/>
      <text class="nm-root-t" x="${rx}" y="${ROOT_Y + 5}">OOP</text>
      <text class="nm-root-sub" x="${rx + 46}" y="${ROOT_Y + 5}">%${pct}</text>
    </a>`;

    return { W, H, html: `<svg class="nm-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Dersin nöral haritası">${links}${pulses}${nodes}</svg>` };
  }

  /* ------------------------------------------------------------ modül */

  let root = null;
  let zoom = 1;
  let base = null;

  function applyZoom() {
    const s = root.querySelector('.nm-svg');
    s.setAttribute('width', Math.round(base.W * zoom));
    s.setAttribute('height', Math.round(base.H * zoom));
    root.querySelector('#nm-zoom').textContent = `%${Math.round(zoom * 100)}`;
  }

  // floor: açılışta yazılar okunur kalsın diye en az %90; "Sığdır" düğmesi tamamını gösterir
  function fit(floor) {
    const box = root.querySelector('.nm-stage');
    zoom = Math.max(floor || 0.45, Math.min(1.25, (box.clientWidth - 8) / base.W));
    applyZoom();
    box.scrollLeft = (box.scrollWidth - box.clientWidth) / 2; // merkez düğüm ortada görünsün
  }

  function setFocus(c) {
    root.querySelector('.nm-svg').classList.toggle('focus', !!c);
    root.querySelectorAll('[data-c]').forEach((el) => el.classList.toggle('hot', el.dataset.c === c));
  }

  function onOver(e) {
    const a = e.target.closest('[data-tip]');
    const cap = root.querySelector('#nm-cap');
    if (!a) return;
    cap.innerHTML = `<b>${a.dataset.tip}</b>${a.dataset.info ? ` <span>${a.dataset.info}</span>` : ''}`;
    setFocus(a.dataset.c || null);
  }

  function onLeave(e) {
    if (!e.relatedTarget || !root.querySelector('.nm-svg').contains(e.relatedTarget)) setFocus(null);
  }

  function onClick(e) {
    const b = e.target.closest('[data-zoom]');
    if (!b) return;
    const z = b.dataset.zoom;
    if (z === 'fit') fit(0.45);
    else { zoom = Math.max(0.4, Math.min(2, zoom + (z === 'in' ? 0.15 : -0.15))); applyZoom(); }
  }

  function mount(container) {
    root = container;
    base = svg();
    root.innerHTML = `
      <section class="card nm-head">
        <div>
          <span class="tag">Genel bakış · ${OOPLab.lessons.chapters.reduce((s, c) => s + c.lessons.length, 0)} ders</span>
          <h2>Nöral harita</h2>
          <p class="hint">Merkezden aşağı: ana düğümler bölümler, küçük düğümler dersler. Bir düğümün üzerine gel, dalı parlasın; tıkla, derse git. Asıl çalışma <a href="#/learn">Ders Notları</a>'nda.</p>
        </div>
        <div class="nm-legend">
          <span><i class="nm-dot read"></i>okundu</span><span><i class="nm-dot seen"></i>başlandı</span><span><i class="nm-dot"></i>sırada</span>
        </div>
        <div class="btn-row nm-tools">
          <button class="btn btn-sm" type="button" data-zoom="out" aria-label="Küçült">−</button>
          <span class="nm-zoom" id="nm-zoom"></span>
          <button class="btn btn-sm" type="button" data-zoom="in" aria-label="Büyüt">+</button>
          <button class="btn btn-sm btn-ghost" type="button" data-zoom="fit">Sığdır</button>
          <a class="btn btn-sm btn-primary" href="#/learn">▶ Derse dön</a>
        </div>
      </section>
      <div class="nm-cap" id="nm-cap"><b>Bir düğümün üzerine gel.</b></div>
      <div class="nm-stage">${base.html}</div>`;
    root.addEventListener('mouseover', onOver);
    root.addEventListener('focusin', onOver);
    root.addEventListener('mouseout', onLeave);
    root.addEventListener('click', onClick);
    OOPLab.app.setStatus('standby');
    requestAnimationFrame(() => fit(0.9));
  }

  function unmount() {
    if (root) {
      root.removeEventListener('mouseover', onOver);
      root.removeEventListener('focusin', onOver);
      root.removeEventListener('mouseout', onLeave);
      root.removeEventListener('click', onClick);
    }
    root = null;
  }

  OOPLab.modules = OOPLab.modules || {};
  OOPLab.modules.map = { num: '◎', title: 'Nöral Bakış', subtitle: 'Dersin tamamı tek haritada', mount, unmount };
  OOPLab.info = OOPLab.info || {};
  OOPLab.info.map = { theory: [], exam: [], examEmpty: 'Sorular için <b>Sınav Soruları</b> sayfasını aç.' };
})(window.OOPLab = window.OOPLab || {});
