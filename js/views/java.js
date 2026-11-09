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
          ${steps.length ? `<div class="dg-ctrl"><button class="btn btn-sm" type="button" data-act="prev">◀ Geri</button><span class="dg-count"></span><button class="btn btn-sm btn-primary" type="button" data-act="next">İleri ▶</button><button class="btn btn-sm btn-ghost" type="button" data-act="play">⏵ Otomatik</button><button class="btn btn-sm btn-ghost" type="button" data-act="reset" title="Başa al">↺</button></div>
          <figcaption class="dg-caption"></figcaption>
          <div class="jt-vars"></div>` : ''}
          ${hasOut ? '<div class="jt-console"><span class="jt-console-h">Konsol çıktısı</span><pre></pre></div>' : ''}
        </figure>`;
      },
      init(el) {
        const pre = el.querySelector('.jt-code');
        const show = (fi, hl) => {
          el.querySelectorAll('.jt-tab').forEach((t) => t.classList.toggle('active', Number(t.dataset.file) === fi));
          pre.innerHTML = lines(files[fi].code, hl);
          const first = pre.querySelector('.jl.on');
          if (first) pre.scrollTop = Math.max(0, first.offsetTop - pre.clientHeight / 3);
        };
        el.querySelector('.jt-tabs').addEventListener('click', (ev) => {
          const t = ev.target.closest('[data-file]');
          if (t) show(Number(t.dataset.file), Number(t.dataset.file) === 0 ? def.hl : files[t.dataset.file].hl);
        });
        const cons = el.querySelector('.jt-console pre');
        if (!steps.length) {
          show(0, def.hl);
          if (cons) cons.innerHTML = fmtOut(def.output);
          return;
        }

        let i = -1;
        let timer = 0;
        const cap = el.querySelector('.dg-caption');
        const vars = el.querySelector('.jt-vars');
        const count = el.querySelector('.dg-count');
        const playBtn = el.querySelector('[data-act="play"]');
        const fileOf = (s) => (s.file == null ? 0 : typeof s.file === 'number' ? s.file : Math.max(0, files.findIndex((f) => f.name === s.file)));

        const apply = () => {
          count.textContent = `${i + 1} / ${steps.length}`;
          el.querySelector('[data-act="prev"]').disabled = i < 0;
          el.querySelector('[data-act="next"]').disabled = i >= steps.length - 1;
          if (i < 0) {
            show(0, def.hl);
            cap.innerHTML = def.intro || '<b>İleri</b> ile programı satır satır yürüt: vurgulanan satırı, değişkenleri ve konsolu izle.';
            vars.innerHTML = '';
            if (cons) cons.innerHTML = '';
            return;
          }
          const s = steps[i];
          show(fileOf(s), s.lines);
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
                apply();
              }, 2400);
              i++;
            }
          }
          apply();
        });
        apply();
      }
    });
  }

  OOPLab.java = { highlight, lines, trace, esc };
})(window.OOPLab = window.OOPLab || {});
