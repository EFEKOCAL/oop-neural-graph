/*
 * app.js — Uygulama kabuğu: hash tabanlı yönlendirme, kenar menü, durum göstergesi
 * ve "Bilgi & Sınav Paneli".
 */
(function (OOPLab) {
  'use strict';

  const DEFAULT_ROUTE = 'learn';
  const STATUS = {
    ready: { text: 'SIM READY', cls: 'ok' },
    running: { text: 'RUNNING', cls: 'busy' },
    done: { text: 'COMPLETED', cls: 'done' },
    paused: { text: 'PAUSED', cls: 'paused' },
    alert: { text: 'EXCEPTION', cls: 'alert' },
    compile: { text: 'COMPILE ERROR', cls: 'alert' },
    fault: { text: 'PROGRAM CRASHED', cls: 'alert' },
    
    standby: { text: 'STANDBY', cls: '' }
  };

  const els = {};
  let current = null;

  /* ------------------------------------------------------------ yönlendirme */

  // "#/learn/ch2/baglayici" → { id: 'learn', params: ['ch2', 'baglayici'] }
  function parseRoute() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    return OOPLab.modules[parts[0]]
      ? { id: parts[0], params: parts.slice(1) }
      : { id: DEFAULT_ROUTE, params: [] };
  }

  // Menüde, adresin en uzun önekiyle eşleşen öğe etkin olur (#/learn/ch2/... → "Bölüm 2")
  function updateNav() {
    const hash = location.hash || '#/' + DEFAULT_ROUTE;
    let best = null;
    document.querySelectorAll('.nav-item').forEach((a) => {
      const href = a.getAttribute('href');
      if ((hash === href || hash.startsWith(href + '/')) && (!best || href.length > best.getAttribute('href').length)) best = a;
    });
    document.querySelectorAll('.nav-item').forEach((a) => {
      a.classList.toggle('active', a === best);
      if (a === best) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function setHeader(h) {
    els.num.textContent = h.num;
    els.title.textContent = h.title;
    els.sub.textContent = h.sub || '';
    document.title = `${h.title} · OOP Interactive Lab`;
  }

  function route() {
    const { id, params } = parseRoute();
    updateNav();
    toggleSidebar(false);
    if (id === current) {
      const mod = OOPLab.modules[id];
      if (mod.navigate) {
        els.view.scrollTop = 0;
        mod.navigate(params);
      }
      return;
    }
    if (current) OOPLab.modules[current].unmount();
    current = id;

    const mod = OOPLab.modules[id];
    setHeader({ num: mod.num, title: mod.title, sub: mod.subtitle });
    setStatus('standby');

    Info.render(id, mod);
    els.view.scrollTop = 0;
    mod.mount(els.view, params);
  }

  function setStatus(key) {
    const s = STATUS[key] || STATUS.standby;
    els.status.className = `status ${s.cls}`;
    els.statusText.textContent = s.text;
  }

  function toggleSidebar(open) {
    els.sidebar.classList.toggle('open', open);
    els.scrim.classList.toggle('show', open);
    els.menuBtn.setAttribute('aria-expanded', String(open));
  }

  /* ------------------------------------------------------------ bilgi & sınav paneli */

  const Info = {
    data: null,

    render(id, mod) {
      const data = this.data = OOPLab.info[id] || { theory: [], exam: [] };
      els.infoModule.textContent = `${mod.num} · ${mod.title}`;
      els.examCount.textContent = data.exam.length;

      els.theory.innerHTML = data.theory.map((sec, i) => `
        <details class="theory" data-section="${sec.id}" data-kind="${sec.kind || ''}"${i === 0 ? ' open' : ''}>
          <summary>${sec.title}</summary>
          <div class="theory-body">${sec.html}</div>
        </details>`).join('');

      els.exam.innerHTML = data.exam.length
        ? data.exam.map((q, i) => `
          <article class="q-card">
            <div class="q-meta"><span class="q-num">S${i + 1}</span><span class="q-topic">${q.topic}</span></div>
            <div class="q-text">${q.q}</div>
            <div class="q-actions">
              <button class="btn btn-sm" type="button" data-action="answer" aria-expanded="false">Cevabı Göster</button>
              ${q.preset ? `<button class="btn btn-sm btn-ghost" type="button" data-action="try" data-index="${i}">▶ Simülatörde Dene</button>` : ''}
            </div>
            <div class="q-answer" hidden>${q.a}</div>
          </article>`).join('')
        : `<p class="empty">${data.examEmpty || 'Bu modül için sınav sorusu yok.'}</p>`;
    },

    // Seçili algoritmanın/konunun teori bölümünü açıp vurgular; diğer odak bölümlerini kapatır
    focus(sectionId) {
      els.theory.querySelectorAll('details.theory').forEach((d) => {
        const match = d.dataset.section === sectionId;
        d.classList.toggle('focus', match);
        if (match) d.open = true;
        else if (d.dataset.kind === 'algo') d.open = false;
      });
    },

    setTab(tab) {
      els.tabs.forEach((t) => {
        const active = t.dataset.tab === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });
      els.theory.hidden = tab !== 'theory';
      els.exam.hidden = tab !== 'exam';
    },

    toggle(open) {
      const isOpen = open === undefined ? !els.panel.classList.contains('open') : open;
      els.panel.classList.toggle('open', isOpen);
      els.panel.setAttribute('aria-hidden', String(!isOpen));
      els.fab.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) els.panel.querySelector('.info-close').focus({ preventScroll: true });
    }
  };

  function onExamClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'answer') {
      const answer = btn.closest('.q-card').querySelector('.q-answer');
      answer.hidden = !answer.hidden;
      btn.textContent = answer.hidden ? 'Cevabı Göster' : 'Cevabı Gizle';
      btn.setAttribute('aria-expanded', String(!answer.hidden));
    } else if (btn.dataset.action === 'try') {
      loadPreset(Info.data.exam[Number(btn.dataset.index)].preset);
    }
  }

  // preset.module hangi laboratuvarın açılacağını söyler
  function loadPreset(preset) {
    const target = preset.module || 'memory';
    if (current !== target) {
      location.hash = '#/' + target;
      route();
    }
    Info.toggle(false);
    OOPLab.modules[target].loadPreset(preset);
  }

  /* ------------------------------------------------------------ başlatma */

  function init() {
    const byId = (id) => document.getElementById(id);
    Object.assign(els, {
      view: byId('view'),
      sidebar: byId('sidebar'),
      scrim: byId('scrim'),
      menuBtn: byId('menu-btn'),
      num: byId('page-num'),
      title: byId('page-title'),
      sub: byId('page-sub'),
      status: byId('status'),
      statusText: byId('status-text'),
      fab: byId('info-fab'),
      panel: byId('info-panel'),
      infoModule: byId('info-module'),
      examCount: byId('exam-count'),
      theory: byId('info-theory'),
      exam: byId('info-exam'),
      tabs: document.querySelectorAll('.info-tab')
    });

    els.menuBtn.addEventListener('click', () => toggleSidebar(!els.sidebar.classList.contains('open')));
    els.scrim.addEventListener('click', () => toggleSidebar(false));
    els.fab.addEventListener('click', () => Info.toggle());
    els.panel.querySelector('.info-close').addEventListener('click', () => Info.toggle(false));
    els.tabs.forEach((t) => t.addEventListener('click', () => Info.setTab(t.dataset.tab)));
    els.exam.addEventListener('click', onExamClick);
    // Kavram sözlüğü araması (Ders Notları modülünün Teori sekmesi)
    els.theory.addEventListener('input', (e) => {
      if (!e.target.matches('.gl-search')) return;
      const q = e.target.value.toLocaleLowerCase('tr').trim();
      e.target.parentElement.querySelectorAll('.gl-list dt').forEach((dt) => {
        const show = !q || (dt.textContent + ' ' + dt.nextElementSibling.textContent).toLocaleLowerCase('tr').includes(q);
        dt.hidden = !show;
        dt.nextElementSibling.hidden = !show;
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        Info.toggle(false);
        toggleSidebar(false);
      }
      const typing = /^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName);
      if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 'i') Info.toggle();
    });

    window.addEventListener('hashchange', route);
    Info.setTab('theory');
    route();
  }

  OOPLab.app = { setStatus, setHeader, toggleSidebar, focusInfo: (id) => Info.focus(id), loadPreset };

  init();
})(window.OOPLab = window.OOPLab || {});
