/*
 * java.js — Java sözdizimi renklendirme ve "kodu adım adım izle" şekli.
 *
 *   OOPLab.java.highlight(src)         → renklendirilmiş HTML
 *   OOPLab.java.lines(src, hl)         → satır satır <span class="jl"> (satır numarası CSS ile)
 *   OOPLab.java.trace(id, def)         → şekil kaydı. def = {
 *       files: [{ name, code }],        // sekmeler
 *       hl: [satır],                    // ilk açılışta vurgu (ilk dosya)
 *       output: 'metin',                // adım yoksa konsol çıktısı
 *       steps: [{ file?, lines:[..], note, vars:{ad: değer}, out, nl:false? }]
 *     }
 * Konsolda "!!" ile başlayan satırlar hata (exception) olarak kırmızı gösterilir.
 */
(function (OOPLab) {
  'use strict';

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const KW = new Set(('abstract assert boolean break byte case catch char class const continue default do double else enum ' +
    'extends final finally float for goto if implements import instanceof int interface long native new package private ' +
    'protected public return short static strictfp super switch synchronized this throw throws transient try void volatile ' +
    'while true false null var').split(' '));
  const TOK = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(@[A-Za-z]\w*)|\b(\d+(?:\.\d+)?[fFdDlL]?)\b|\b([A-Za-z_$][\w$]*)\b/g;

  const wrap = (cls, text) => text.split('\n').map((p) => (p ? `<span class="jt-${cls}">${esc(p)}</span>` : '')).join('\n');

  function highlight(src) {
    let out = '';
    let last = 0;
    let m;
    TOK.lastIndex = 0;
    while ((m = TOK.exec(src))) {
      out += esc(src.slice(last, m.index));
      const [t, com, str, ann, num, id] = m;
      if (com) out += wrap('c', com);
      else if (str) out += wrap('s', str);
      else if (ann) out += wrap('a', ann);
      else if (num) out += wrap('n', num);
      else if (KW.has(id)) out += wrap('k', id);
      else if (/^[A-Z]/.test(id)) out += wrap('t', id);
      else if (/^\s*\(/.test(src.slice(m.index + t.length))) out += wrap('f', id);
      else out += esc(id);
      last = m.index + t.length;
    }
    return out + esc(src.slice(last));
  }

  const trim = (code) => String(code).replace(/^\n+|\s+$/g, '');

  function lines(code, hl) {
    const on = new Set(hl || []);
    return highlight(trim(code)).split('\n')
      .map((ln, i) => `<span class="jl${on.has(i + 1) ? ' on' : ''}">${ln || ' '}</span>`).join('');
  }

  function fmtOut(text) {
    if (text == null) return '';
    return String(text).split('\n').map((ln) => (ln.startsWith('!!') ? `<span class="err">${esc(ln.slice(2))}</span>` : esc(ln))).join('\n');
  }

  /* ------------------------------------------------------------ iz sürme şekli */

  function trace(id, def) {
    const files = def.files;
    const steps = def.steps || [];
    const hasOut = def.output != null || steps.some((s) => s.out != null);

    OOPLab.diagrams.register(id, {
      kind: 'custom',
      render() {
        return `<figure class="dg jt" data-dg="${id}">
          <div class="jt-tabs">${files.map((f, i) => `<button type="button" class="jt-tab${i === 0 ? ' active' : ''}" data-file="${i}">${esc(f.name)}</button>`).join('')}</div>
          <pre class="jt-code"></pre>
          ${steps.length ? `<div class="jt-dock"><div class="dg-ctrl"><button class="btn btn-sm" type="button" data-act="prev">◀ Geri</button><span class="dg-count"></span><button class="btn btn-sm btn-primary" type="button" data-act="next">İleri ▶</button><button class="btn btn-sm btn-ghost" type="button" data-act="play">⏵ Otomatik</button><button class="btn btn-sm btn-ghost" type="button" data-act="reset" title="Başa al">↺</button></div>
          <figcaption class="dg-caption"></figcaption></div>
          <div class="jt-vars"></div>` : ''}
          ${hasOut ? '<div class="jt-console"><span class="jt-console-h">Konsol çıktısı</span><pre></pre></div>' : ''}
        </figure>`;
      },
      init(el) {
        const pre = el.querySelector('.jt-code');
        // follow: kullanıcı adım/sekme değiştirdiyse vurgulanan satırı görünür tut. Ders kartında (.fx-card)
        // kodun iç kaydırması yoktur (tamamı görünür); satır ekran dışındaysa kartın kendisi kaydırılır.
        const show = (fi, hl, follow) => {
          el.querySelectorAll('.jt-tab').forEach((t) => t.classList.toggle('active', Number(t.dataset.file) === fi));
          pre.innerHTML = lines(files[fi].code, hl);
          const first = pre.querySelector('.jl.on');
          if (!first) return;
          if (pre.scrollHeight > pre.clientHeight + 1) {
            // offsetTop pre'ye değil konumlu ataya göredir; kaymayı ekran konumlarından hesapla
            pre.scrollTop = Math.max(0, pre.scrollTop + first.getBoundingClientRect().top - pre.getBoundingClientRect().top - pre.clientHeight / 3);
            return;
          }
          const card = follow && el.closest('.fx-card');
          if (!card) return;
          const cr = card.getBoundingClientRect();
          const lr = first.getBoundingClientRect();
          const dock = el.querySelector('.jt-dock');
          const bottom = cr.bottom - 84 - (dock ? dock.offsetHeight : 0);  // alt gezinme düğmeleri + yapışık kontrol paneli
          if (lr.top < cr.top + 16 || lr.bottom > bottom) card.scrollTop += lr.top - cr.top - (bottom - cr.top) / 3;
        };
        el.querySelector('.jt-tabs').addEventListener('click', (ev) => {
          const t = ev.target.closest('[data-file]');
          if (t) show(Number(t.dataset.file), Number(t.dataset.file) === 0 ? def.hl : files[t.dataset.file].hl, true);
        });
        const cons = el.querySelector('.jt-console pre');

        // Ders kartında (.fx-card) kod kutusu ekranın kalan yüksekliği kadar büyür: kod sığıyorsa tamamı
        // görünür; sığmıyorsa yalnızca kod alanı kendi içinde kayar, konsol çıktısı tam ve ekranda kalır.
        // En uzun dosya + son adım (en dolu konsol/değişkenler) hâli ölçülür ki adım ilerledikçe kart
        // taşmasın; bu yükseklik kart sabitlenirken (learn-view pinCard) de ayrılır.
        const longest = files.reduce((b, f, k) => (trim(f.code).split('\n').length > trim(files[b].code).split('\n').length ? k : b), 0);
        // states: şeklin her adımını sırayla kuran fonksiyonlar; her birinde kod dışındaki kısımların
        // (açıklama, değişkenler, konsol) yüksekliği ölçülür, en yükseği esas alınır.
        const measure = (states) => {
          const card = el.closest('.fx-card');
          if (!card || !card.clientHeight) return;
          const inner = card.firstElementChild;
          const h = (x) => x.getBoundingClientRect().height;
          pre.style.maxHeight = 'none';
          if (cons) cons.style.maxHeight = 'none';
          // her adım için: kod dışı yükseklik (c) ve bunun içindeki konsol yüksekliği (k)
          const S = states.map((set) => {
            set();
            return { c: h(inner) - h(pre), k: cons ? h(cons) : 0 };
          });
          const chrome = Math.max(...S.map((s) => s.c));
          show(longest, []);
          const code = h(pre);
          const cs = getComputedStyle(card);
          const avail = card.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
          const MIN = 160;
          let over = chrome + code - avail;
          let preH = code;
          if (over > 0) {
            preH = Math.max(MIN, code - over);
            pre.style.maxHeight = `${preH}px`;
            over -= code - preH;
          }
          // Kod en küçük hâline indiği hâlde sığmıyorsa (çok uzun konsol, küçük ekran) konsol da kısalır:
          // sınır, taşan her adımda konsolun alabileceği en büyük yükseklikten seçilir.
          let cap = Infinity;
          if (over > 0 && cons) {
            const limit = avail - preH;
            S.forEach((s) => { if (s.c > limit) cap = Math.min(cap, limit - (s.c - s.k)); });
            cap = Math.max(120, cap);
            cons.style.maxHeight = `${cap}px`;
          }
          const worst = Math.max(...S.map((s) => s.c - s.k + Math.min(s.k, cap)));
          card._jtWorst = Math.max(card._jtWorst || 0, worst + preH);
        };

        if (!steps.length) {
          if (cons) cons.innerHTML = fmtOut(def.output);
          el._jtFit = () => { measure([() => {}]); show(0, def.hl); };
          show(0, def.hl);
          return;
        }

        let i = -1;
        let timer = 0;
        const cap = el.querySelector('.dg-caption');
        const vars = el.querySelector('.jt-vars');
        const count = el.querySelector('.dg-count');
        const playBtn = el.querySelector('[data-act="play"]');
        const fileOf = (s) => (s.file == null ? 0 : typeof s.file === 'number' ? s.file : Math.max(0, files.findIndex((f) => f.name === s.file)));

        const apply = (follow) => {
          count.textContent = `${i + 1} / ${steps.length}`;
          el.querySelector('[data-act="prev"]').disabled = i < 0;
          el.querySelector('[data-act="next"]').disabled = i >= steps.length - 1;
          if (i < 0) {
            show(0, def.hl, follow);
            cap.innerHTML = def.intro || '<b>İleri</b> ile programı satır satır yürüt: vurgulanan satırı, değişkenleri ve konsolu izle.';
            vars.innerHTML = '';
            if (cons) cons.innerHTML = '';
            return;
          }
          const s = steps[i];
          show(fileOf(s), s.lines, follow);
          cap.innerHTML = s.note || '';
          const prev = i > 0 ? steps[i - 1].vars || {} : {};
          const v = s.vars || {};
          vars.innerHTML = Object.keys(v).map((k) => `<span class="jt-k">${esc(k)}</span><span class="jt-v${prev[k] !== v[k] ? ' changed' : ''}">${esc(v[k])}</span>`).join('');
          if (cons) {
            cons.innerHTML = fmtOut(steps.slice(0, i + 1).filter((x) => x.out != null)
              .map((x) => x.out + (x.nl === false ? '' : '\n')).join('').replace(/\n$/, ''));
            cons.scrollTop = cons.scrollHeight;
          }
        };
        const stop = () => { clearInterval(timer); timer = 0; playBtn.textContent = '⏵ Otomatik'; };
        el.querySelector('.dg-ctrl').addEventListener('click', (ev) => {
          const a = ev.target.closest('[data-act]');
          if (!a) return;
          const act = a.dataset.act;
          if (act === 'next' && i < steps.length - 1) { i++; stop(); }
          if (act === 'prev' && i >= 0) { i--; stop(); }
          if (act === 'reset') { i = -1; stop(); }
          if (act === 'play') {
            if (timer) stop();
            else {
              if (i >= steps.length - 1) i = -1;
              playBtn.textContent = '⏸ Durdur';
              timer = setInterval(() => {
                if (!el.isConnected || i >= steps.length - 1) { stop(); return; }
                i++;
                apply(true);
              }, 2400);
              i++;
            }
          }
          apply(true);
        });
        el._jtFit = () => {
          const saved = i;
          measure([-1, ...steps.keys()].map((k) => () => { i = k; apply(); }));
          i = saved;
          apply();
        };
        apply();
      }
    });
  }

  /** Kapsamdaki ders kartı kod şekillerini ekran yüksekliğine göre boyutlandırır. */
  function fitIn(scope) {
    if (!scope) return;
    scope.querySelectorAll('.fx-card').forEach((c) => { c._jtWorst = 0; });
    scope.querySelectorAll('.fx-card .dg.jt').forEach((e) => { if (e._jtFit) e._jtFit(); });
  }

  OOPLab.java = { highlight, lines, trace, esc, fitIn };
})(window.OOPLab = window.OOPLab || {});
