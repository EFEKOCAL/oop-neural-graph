/*
 * exception-view.js — L3 "İstisna Akışı" laboratuvarı.
 * Çağrı zinciri: main → method1 → method2 → method3. method3 seçilen istisnayı fırlatır (ya da fırlatmaz).
 * Her metodun try-catch tipi, finally bloğu ve throws bildirimi ayarlanır. simulate() önce derleyicinin
 * checked istisna kontrollerini yapar, sonra yürütmeyi adım adım üretir (DOM'dan bağımsız).
 */
(function (OOPLab) {
  'use strict';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Tip → üst tip; checked: RuntimeException / Error soyundan gelmeyenler
  const PARENT = {
    Throwable: null, Exception: 'Throwable', RuntimeException: 'Exception',
    ArithmeticException: 'RuntimeException', NullPointerException: 'RuntimeException',
    IllegalArgumentException: 'RuntimeException', NumberFormatException: 'IllegalArgumentException',
    IOException: 'Exception', FileNotFoundException: 'IOException', InvalidRadiusException: 'Exception'
  };
  const PKG = { IOException: 'java.io.', FileNotFoundException: 'java.io.', InvalidRadiusException: '' };
  const isA = (t, sup) => { for (let x = t; x; x = PARENT[x]) if (x === sup) return true; return false; };
  const checked = (t) => isA(t, 'Exception') && !isA(t, 'RuntimeException');
  const fq = (t) => (t in PKG ? PKG[t] : 'java.lang.') + t;
  const MSG = {
    ArithmeticException: '/ by zero', NullPointerException: null, IllegalArgumentException: 'method3\'te hata',
    NumberFormatException: 'For input string: "12a"', IOException: 'File does not exist', FileNotFoundException: 'veri.txt',
    InvalidRadiusException: 'Invalid radius -5.0'
  };
  const THROWABLE = Object.keys(MSG);
  const CATCHABLE = ['ArithmeticException', 'NullPointerException', 'IllegalArgumentException', 'RuntimeException', 'IOException', 'InvalidRadiusException', 'Exception'];
  const NAMES = ['main', 'method1', 'method2'];

  const PRESETS = {
    basit: { title: 'Basit: throw → catch', thrown: 'ArithmeticException', m: { main: { c: 'ArithmeticException' }, method1: {}, method2: {} } },
    yayilim: { title: 'Slayttaki yayılım (s.19)', thrown: 'IllegalArgumentException', m: { main: { c: 'Exception' }, method1: { c: 'ArithmeticException' }, method2: { c: 'NullPointerException' } } },
    finally: { title: 'finally her yolda', thrown: 'NullPointerException', m: { main: { c: 'NullPointerException', f: true }, method1: { f: true }, method2: { c: 'ArithmeticException', f: true } } },
    yakalanmaz: { title: 'Yakalayan yok', thrown: 'NumberFormatException', m: { main: { c: 'ArithmeticException' }, method1: { f: true }, method2: {} } },
    checked: { title: 'Checked: bildirim eksik', thrown: 'IOException', t3: true, m: { main: { c: 'IOException' }, method1: { t: true }, method2: {} } },
    ozel: { title: 'Özel checked istisna', thrown: 'InvalidRadiusException', t3: true, m: { main: { c: 'InvalidRadiusException' }, method1: { t: true }, method2: { t: true, f: true } } },
    yok: { title: 'İstisna yok', thrown: 'none', m: { main: { c: 'Exception', f: true }, method1: { f: true }, method2: {} } }
  };

  /* ------------------------------------------------------------ kod üretimi */

  function buildCode(cfg) {
    const L = [];
    const at = {};
    const push = (s) => { L.push(s); return L.length; };
    const thr = cfg.thrown;
    const thrDecl = (name) => (name === 'method3' ? cfg.t3 : cfg.m[name].t) && thr !== 'none';
    const usesIO = [thr].concat(NAMES.map((n) => cfg.m[n].c)).some((t) => t && PKG[t] === 'java.io.');
    if (usesIO) { push('import java.io.*;'); push(''); }
    push('public class Akis {');
    NAMES.concat('method3').forEach((name, k) => {
      const m = name === 'method3' ? {} : cfg.m[name];
      const r = at[name] = {};
      const sig = name === 'main' ? 'public static void main(String[] args)' : `static void ${name}()`;
      r.head = push(`    ${sig}${thrDecl(name) ? ` throws ${thr}` : ''} {`);
      if (name === 'method3') {
        r.say = push('        System.out.println("method3: başladı");');
        r.thr = thr === 'none' ? push('        // istisna fırlatılmıyor') : push(`        throw new ${thr}(${MSG[thr] ? JSON.stringify(MSG[thr]) : ''});`);
        r.end = push('    }');
        return;
      }
      const callee = k === 2 ? 'method3' : NAMES[k + 1];
      const ind = m.c || m.f ? '            ' : '        ';
      if (m.c || m.f) r.try = push('        try {');
      r.call = push(`${ind}${callee}();`);
      r.cont = push(`${ind}System.out.println("${name}: ${callee} döndü");`);
      if (m.c) {
        r.catch = push(`        } catch (${m.c} ex) {`);
        r.cbody = push(`            System.out.println("${name} yakaladı: " + ex);`);
      }
      if (m.f) {
        r.fin = push('        } finally {');
        r.fbody = push(`            System.out.println("${name}: finally");`);
      }
      if (m.c || m.f) push('        }');
      r.after = push(`        System.out.println("${name}: son satır");`);
      r.end = push('    }');
      push('');
    });
    push('}');
    if (thr === 'InvalidRadiusException') {
      push('');
      push('class InvalidRadiusException extends Exception {   // checked');
      push('    InvalidRadiusException(String msg) { super(msg); }');
      push('}');
    }
    return { code: L.join('\n'), at };
  }

  /* ------------------------------------------------------------ simülasyon */

  function compileErrors(cfg, at) {
    const errs = [];
    const thr = cfg.thrown;
    const chain = ['method3', 'method2', 'method1', 'main'];
    // Her metodun dışarıya bildirdiği checked tip
    const declares = (name) => thr !== 'none' && checked(thr) && (name === 'method3' ? cfg.t3 : cfg.m[name].t);
    // 1) Yakala ya da bildir
    if (thr !== 'none' && checked(thr)) {
      if (!cfg.t3) errs.push({ line: at.method3.thr, msg: `<b>method3</b>: <code>unreported exception ${thr}; must be caught or declared to be thrown</code>. ${thr} <b>checked</b>'tır; method3 başlığına <code>throws ${thr}</code> eklenmeli.` });
      // Derleyici her çağrıyı ayrı ayrı kontrol eder: throws bildiren bir metodu çağıran,
      // istisna daha aşağıda yakalanmış olsa bile ya yakalamalı ya da bildirmelidir.
      for (let k = 1; k < chain.length; k++) {
        const name = chain[k];
        const callee = chain[k - 1];
        if (!declares(callee)) continue;
        const m = cfg.m[name];
        const caught = m.c && isA(thr, m.c);
        if (!caught && !m.t) errs.push({ line: at[name].call, msg: `<b>${name}</b>: <code>${callee}()</code> başlığında <code>throws ${thr}</code> var; ${name} onu ne yakalıyor ne de <code>throws</code> ile bildiriyor → <code>unreported exception ${thr}</code>.` });
      }
    }
    // 2) Hiç fırlatılamayan checked istisnayı yakalamak da derleme hatası
    NAMES.forEach((name, k) => {
      const m = cfg.m[name];
      if (!m.c || !checked(m.c) || m.c === 'Exception') return;
      const callee = k === 2 ? 'method3' : NAMES[k + 1];
      const calleeDeclares = declares(callee);
      if (!calleeDeclares || !(isA(thr, m.c) || isA(m.c, thr))) errs.push({ line: at[name].catch, msg: `<b>${name}</b>: <code>exception ${m.c} is never thrown in body of corresponding try statement</code>. try içindeki çağrı ${m.c} fırlatabileceğini <b>bildirmiyor</b>; checked bir istisna ancak fırlatılabiliyorsa yakalanabilir.` });
    });
    return errs;
  }

  function simulate(cfg) {
    const { code, at } = buildCode(cfg);
    const thr = cfg.thrown;
    const steps = [];
    const out = [];
    const stack = [];
    const errs = compileErrors(cfg, at);
    const snap = (line, note, extra) => steps.push(Object.assign({ lines: [line], note, stack: stack.slice(), out: out.slice() }, extra || {}));

    if (errs.length) {
      errs.forEach((e) => steps.push({ lines: [e.line], note: `<b>Derleme hatası.</b> ${e.msg}`, stack: [], out: [], status: 'compile', err: true }));
      steps.push({ lines: errs.map((e) => e.line), note: `Program <b>derlenmedi</b>, bu yüzden hiç çalışmadı. ${checked(thr) ? 'Checked istisnalarda derleyici zinciri kontrol eder: fırlatan metot bildirmeli, her çağıran ya yakalamalı ya da bildirmeli.' : ''}`, stack: [], out: [], status: 'compile', err: true });
      return { code, steps, compile: true };
    }

    const exText = () => (MSG[thr] ? `${fq(thr)}: ${MSG[thr]}` : fq(thr));
    let pending = null; // fırlatılmış, henüz yakalanmamış istisna

    // method3
    function run(name) {
      stack.push(name);
      const r = at[name];
      if (name === 'method3') {
        snap(r.head, `<b>method3</b> çağrıldı; yığına eklendi.`);
        out.push('method3: başladı');
        snap(r.say, '');
        if (thr === 'none') { snap(r.thr, 'İstisna yok, method3 normal biter.'); stack.pop(); return; }
        pending = thr;
        snap(r.thr, `<b>throw</b>: bir <b>${thr}</b> nesnesi oluşturulup fırlatıldı (${checked(thr) ? 'checked' : 'unchecked'}). method3'te try yok → method3 <b>hemen sonlanır</b>, istisna çağırana gider.`, { exc: thr });
        stack.pop();
        return;
      }
      const m = cfg.m[name];
      const idx = NAMES.indexOf(name);
      const callee = idx === 2 ? 'method3' : NAMES[idx + 1];
      snap(r.head, `<b>${name}</b> ${name === 'main' ? 'başladı' : 'çağrıldı'}; yığına eklendi.${m.c || m.f ? ' try bloğuna giriliyor.' : ''}`);
      snap(r.call, `${callee}() çağrılıyor…`);
      run(callee);
      if (pending) {
        snap(r.call, `İstisna <b>${pending}</b>, ${name}'e ulaştı. Bu satırdan sonraki try kodları (<code>"${name}: ${callee} döndü"</code>) <b>atlanır</b>.`, { exc: pending });
        if (m.c && isA(pending, m.c)) {
          snap(r.catch, `<code>catch (${m.c} ex)</code>: ${pending} ${pending === m.c ? 'tam olarak bu tip' : `bir ${m.c} (alt sınıfı)`} → <b>yakalandı ✓</b>.`, { exc: pending, caught: true });
          out.push(`${name} yakaladı: ${exText()}`);
          snap(r.cbody, '<code>"" + ex</code> → <code>ex.toString()</code> = tam sınıf adı + ": " + mesaj.', { caught: true });
          pending = null;
        } else if (m.c) {
          snap(r.catch, `<code>catch (${m.c} ex)</code>: ${pending} bir ${m.c} <b>değil</b> → bu catch uymaz.`, { exc: pending });
        } else {
          snap(r.call, `${name}'de bu çağrıyı saran ${m.f ? 'catch' : 'try-catch'} yok.`, { exc: pending });
        }
        if (m.f) {
          out.push(`${name}: finally`);
          snap(r.fbody, `<b>finally</b> her durumda çalışır${pending ? ' (istisna yayılmaya devam etmeden ÖNCE)' : ''}.`, { exc: pending });
        }
        if (pending) {
          snap(r.end, `${name} istisnayı yakalayamadı → <b>${name} sonlanır</b>, "son satır" çalışmaz; istisna ${name === 'main' ? 'JVM\'e' : 'çağırana'} gider.`, { exc: pending });
          stack.pop();
          return;
        }
        out.push(`${name}: son satır`);
        snap(r.after, `try-catch${m.f ? '-finally' : ''}'ten sonra <b>normal akış</b> devam eder.`);
      } else {
        out.push(`${name}: ${callee} döndü`);
        snap(r.cont, `${callee} normal döndü, try'ın kalanı çalışır.`);
        if (m.f) {
          out.push(`${name}: finally`);
          snap(r.fbody, 'İstisna olmasa da <b>finally</b> çalışır.');
        }
        out.push(`${name}: son satır`);
        snap(r.after, '');
      }
      snap(r.end, `${name} bitti, yığından çıktı.`);
      stack.pop();
    }

    run('main');
    if (pending) {
      out.push(`!!Exception in thread "main" ${exText()}`);
      out.push('!!\tat Akis.method3(Akis.java)');
      snap(at.main.end, `<b>Hiçbir catch yakalamadı.</b> İstisna main'den de çıktı → JVM yığın izini yazdırıp programı <b>sonlandırdı</b>.`, { status: 'alert', exc: pending });
    } else {
      snap(at.main.end, 'Program normal şekilde bitti.', { status: 'done' });
    }
    return { code, steps, compile: false };
  }

  /* ------------------------------------------------------------ arayüz */

  const S = { cfg: null, sim: null, i: -1, timer: 0, preset: 'yayilim' };
  let root = null;

  const clone = (p) => ({ thrown: p.thrown, t3: !!p.t3, m: Object.fromEntries(NAMES.map((n) => [n, Object.assign({ c: '', f: false, t: false }, p.m[n])])) });

  function rerun() {
    stop();
    S.sim = simulate(S.cfg);
    S.i = -1;
    draw();
  }

  function stop() {
    clearInterval(S.timer);
    S.timer = 0;
    const b = root && root.querySelector('#ex-play');
    if (b) b.textContent = '⏵ Otomatik';
  }

  function configHTML() {
    const thrOpts = ['none'].concat(THROWABLE).map((t) => `<option value="${t}"${t === S.cfg.thrown ? ' selected' : ''}>${t === 'none' ? '— istisna fırlatma —' : `${t}${checked(t) ? '  (checked)' : '  (unchecked)'}`}</option>`).join('');
    const row = (name) => {
      const m = S.cfg.m[name];
      return `<tr><td><code>${name}()</code></td>
        <td><select data-m="${name}" data-k="c"><option value="">— try-catch yok —</option>${CATCHABLE.map((c) => `<option value="${c}"${c === m.c ? ' selected' : ''}>catch (${c})</option>`).join('')}</select></td>
        <td class="num"><input type="checkbox" data-m="${name}" data-k="f"${m.f ? ' checked' : ''} aria-label="${name} finally"></td>
        <td class="num"><input type="checkbox" data-m="${name}" data-k="t"${m.t ? ' checked' : ''} aria-label="${name} throws"></td></tr>`;
    };
    return `<div class="field"><label for="ex-preset">Hazır senaryo</label><select id="ex-preset">${Object.entries(PRESETS).map(([id, p]) => `<option value="${id}"${id === S.preset ? ' selected' : ''}>${p.title}</option>`).join('')}<option value="custom"${S.preset === 'custom' ? ' selected' : ''}>(özel ayar)</option></select></div>
      <div class="field"><label for="ex-thrown">method3 ne fırlatsın?</label><select id="ex-thrown">${thrOpts}</select></div>
      <div class="table-wrap ex-table"><table><thead><tr><th>Metot</th><th>try-catch</th><th class="num">finally</th><th class="num">throws</th></tr></thead><tbody>
        ${NAMES.slice().reverse().map(row).join('')}
        <tr><td><code>method3()</code></td><td class="muted">fırlatan metot (try yok)</td><td></td><td class="num"><input type="checkbox" id="ex-t3"${S.cfg.t3 ? ' checked' : ''} aria-label="method3 throws"></td></tr>
      </tbody></table></div>
      <p class="hint"><b>throws</b> kutusu metodun başlığına <code>throws ${esc(S.cfg.thrown === 'none' ? 'X' : S.cfg.thrown)}</code> ekler. Unchecked istisnalarda bildirim zorunlu değildir; checked istisnalarda derleyici zinciri kontrol eder.</p>`;
  }

  function stackHTML(st) {
    const frames = st ? st.stack : [];
    const exc = st && st.exc;
    return `${exc && !st.caught ? `<div class="ex-bubble">⚡ ${esc(exc)} yayılıyor</div>` : st && st.caught ? '<div class="ex-bubble ok">✓ yakalandı</div>' : ''}
      <ol class="ds-stack ex-stack">${frames.length ? frames.slice().reverse().map((f, k) => `<li class="${k === 0 ? 'top' : ''}">${esc(f)}()</li>`).join('') : '<li class="muted">boş</li>'}</ol>`;
  }

  function hierHTML() {
    const t = S.cfg.thrown;
    if (t === 'none') return '<p class="muted">İstisna seçilmedi.</p>';
    const chain = [];
    for (let x = t; x; x = PARENT[x]) chain.unshift(x);
    return `<div class="ex-hier">${chain.map((x, d) => `<span style="--d:${d}" class="${x === t ? 'me' : ''}">${x}${x === 'RuntimeException' ? ' <small>unchecked kolu</small>' : ''}</span>`).join('')}</div>
      <p class="hint">${t} <b>${checked(t) ? 'checked' : 'unchecked'}</b>: ${checked(t) ? 'RuntimeException soyundan değil, derleyici "yakala ya da bildir" ister.' : 'RuntimeException soyundan, yakalamak/bildirmek zorunlu değil.'} Bir <code>catch (T)</code> bu zincirdeki <b>her tipi</b> yakalayabilir.</p>`;
  }

  function draw() {
    if (!root) return;
    const sim = S.sim;
    const st = S.i >= 0 ? sim.steps[S.i] : null;
    root.querySelector('#ex-config').innerHTML = configHTML();
    root.querySelector('#ex-hier').innerHTML = hierHTML();
    root.querySelector('#ex-stack').innerHTML = stackHTML(st);
    root.querySelector('#ex-code').innerHTML = OOPLab.java.lines(sim.code, st ? st.lines : []);
    root.querySelector('#ex-count').textContent = `${S.i + 1} / ${sim.steps.length}`;
    root.querySelector('#ex-prev').disabled = S.i < 0;
    root.querySelector('#ex-next').disabled = S.i >= sim.steps.length - 1;
    root.querySelector('#ex-note').innerHTML = st ? st.note : (sim.compile
      ? 'Bu ayarla program <b>derlenmiyor</b>. <b>İleri</b> ile derleyicinin hangi satıra neden itiraz ettiğini gör, sonra ayarı düzelt.'
      : '<b>İleri</b> ile yürüt: çağrılar yığına eklenir, istisna fırlatılınca yığın boyunca <b>geriye doğru</b> uygun catch aranır.');
    const outs = st ? st.out : [];
    root.querySelector('#ex-out').innerHTML = outs.length ? outs.map((o) => (o.startsWith('!!') ? `<span class="err">${esc(o.slice(2))}</span>` : esc(o))).join('\n') : '<span class="muted">(henüz çıktı yok)</span>';
    const line = root.querySelector('#ex-code .jl.on');
    if (line) line.scrollIntoView({ block: 'nearest' });
    OOPLab.app.setStatus(!st ? (sim.compile ? 'compile' : 'ready') : st.status || (S.timer ? 'running' : 'paused'));
  }

  function template() {
    return `
      <p class="module-lead">Bir istisnanın çağrı yığınında nasıl yayıldığını kendin kur: her metoda catch, finally ve throws ekle, method3'ün ne fırlatacağını seç. Kod otomatik üretilir; <b>checked</b> istisnalarda önce derleyicinin itirazlarını, sonra yürütmeyi adım adım izle.</p>
      <div class="ex-grid">
        <div class="stack">
          <article class="card"><header class="card-head"><h2>Konfigürasyon</h2><span class="tag">try · catch · finally · throws</span></header><div id="ex-config"></div></article>
          <article class="card"><header class="card-head"><h2>Çağrı yığını</h2><span class="tag">call stack</span></header><div id="ex-stack"></div></article>
          <article class="card"><header class="card-head"><h2>Fırlatılan tipin soyu</h2><span class="tag">Throwable hiyerarşisi</span></header><div id="ex-hier"></div></article>
        </div>
        <article class="card">
          <header class="card-head"><h2>Kod</h2><span class="tag">otomatik üretildi · Akis.java</span></header>
          <pre class="jt-code ex-code" id="ex-code"></pre>
          <div class="dg-ctrl">
            <button class="btn btn-sm" id="ex-prev" type="button">◀ Geri</button>
            <span class="dg-count" id="ex-count"></span>
            <button class="btn btn-sm btn-primary" id="ex-next" type="button">İleri ▶</button>
            <button class="btn btn-sm btn-ghost" id="ex-play" type="button">⏵ Otomatik</button>
            <button class="btn btn-sm btn-ghost" id="ex-end" type="button">⏭ Sonuca atla</button>
            <button class="btn btn-sm btn-ghost" id="ex-reset" type="button" title="Başa al">↺</button>
          </div>
          <div class="dg-caption" id="ex-note"></div>
          <div class="jt-console"><span class="jt-console-h">Konsol çıktısı</span><pre id="ex-out"></pre></div>
        </article>
      </div>`;
  }

  function go(i) {
    S.i = Math.max(-1, Math.min(i, S.sim.steps.length - 1));
    draw();
  }

  function onClick(e) {
    const t = e.target;
    if (t.closest('#ex-next')) { stop(); go(S.i + 1); }
    else if (t.closest('#ex-prev')) { stop(); go(S.i - 1); }
    else if (t.closest('#ex-reset')) { stop(); go(-1); }
    else if (t.closest('#ex-end')) { stop(); go(S.sim.steps.length - 1); }
    else if (t.closest('#ex-play')) {
      if (S.timer) { stop(); draw(); return; }
      if (S.i >= S.sim.steps.length - 1) S.i = -1;
      t.closest('#ex-play').textContent = '⏸ Durdur';
      S.timer = setInterval(() => {
        if (!root || S.i >= S.sim.steps.length - 1) { stop(); draw(); return; }
        go(S.i + 1);
      }, 1500);
      go(S.i + 1);
    }
  }

  function onChange(e) {
    const t = e.target;
    if (t.id === 'ex-preset') {
      if (PRESETS[t.value]) { S.preset = t.value; S.cfg = clone(PRESETS[t.value]); rerun(); }
      return;
    }
    S.preset = 'custom';
    if (t.id === 'ex-thrown') S.cfg.thrown = t.value;
    else if (t.id === 'ex-t3') S.cfg.t3 = t.checked;
    else if (t.dataset.m) S.cfg.m[t.dataset.m][t.dataset.k] = t.type === 'checkbox' ? t.checked : t.value;
    rerun();
  }

  function mount(container) {
    root = container;
    if (!S.cfg) S.cfg = clone(PRESETS[S.preset]);
    root.innerHTML = template();
    root.addEventListener('click', onClick);
    root.addEventListener('change', onChange);
    rerun();
  }

  function unmount() {
    stop();
    if (root) {
      root.removeEventListener('click', onClick);
      root.removeEventListener('change', onChange);
    }
    root = null;
  }

  function loadPreset(p) {
    if (p.preset && PRESETS[p.preset]) { S.preset = p.preset; S.cfg = clone(PRESETS[p.preset]); }
    if (root) rerun();
  }

  OOPLab.exceptions = { simulate, isA, checked, PRESETS, clone };
  OOPLab.modules = OOPLab.modules || {};
  OOPLab.modules.exceptions = { num: 'L3', title: 'İstisna Akışı', subtitle: 'try · catch · finally · yayılım', mount, unmount, loadPreset };
})(window.OOPLab = window.OOPLab || {});
