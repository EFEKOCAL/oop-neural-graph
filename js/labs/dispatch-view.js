/*
 * dispatch-view.js — L2 "Kalıtım" laboratuvarı.
 *   Sekme 1 · Yapıcı Zinciri: sınıf modelinden Java kodunu üretir, new ifadesini yorumlar;
 *     this(...) / super(...) / gizli super() çağrılarını ve çıktı sırasını adım adım gösterir.
 *   Sekme 2 · Dinamik Bağlama: bildirilen tip + gerçek tip + işlem (metot çağrısı ya da cast);
 *     önce derleyicinin kontrolü (eşleştirme), sonra JVM'in arama yolu (bağlama).
 * Hesaplama (simulateChain, simulateBind) DOM'dan bağımsızdır.
 */
(function (OOPLab) {
  'use strict';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* =============================================================== 1 · Yapıcı zinciri */

  // Yapıcı: { params: [[tip, ad]], first: { kind: 'this'|'super', args: [literal] } | null, body: [ifade parçaları] }
  // body öğesi: println argümanı; parametre adları yerine konur. Literal: 4 → int, 2.5 → double, "x" → String
  const CHAINS = {
    faculty: {
      title: 'Faculty → Employee → Person',
      src: 'Slide02 s.8–17',
      classes: [
        { name: 'Person', ctors: [{ params: [], body: ['"(1) Person\'s no-arg constructor is invoked"'] }] },
        { name: 'Employee', parent: 'Person', ctors: [
          { params: [], first: { kind: 'this', args: ['"(2) Invoke Employee\'s overloaded constructor"'] }, body: ['"(3) Employee\'s no-arg constructor is invoked"'] },
          { params: [['String', 's']], body: ['s'] }] },
        { name: 'Faculty', parent: 'Employee', ctors: [{ params: [], body: ['"(4) Faculty\'s no-arg constructor is invoked"'] }] }
      ],
      exprs: ['new Faculty()', 'new Employee()', 'new Employee("merhaba")', 'new Person()']
    },
    arac: {
      title: 'Arac → Bisiklet / Araba',
      src: 'Bölüm 2 · super() dersi',
      classes: [
        { name: 'Arac', ctors: [{ params: [], body: ['"Arac() çalıştı"'] }, { params: [['int', 'teker']], body: ['"Arac(int) çalıştı: " + teker'] }] },
        { name: 'Bisiklet', parent: 'Arac', ctors: [{ params: [], body: ['"Bisiklet() çalıştı"'] }] },
        { name: 'Araba', parent: 'Arac', ctors: [{ params: [], first: { kind: 'super', args: ['4'] }, body: ['"Araba() çalıştı"'] }] }
      ],
      exprs: ['new Bisiklet()', 'new Araba()', 'new Arac(2)']
    },
    apple: {
      title: 'Apple → Fruit (hatalı)',
      src: 'Slide02 s.18',
      classes: [
        { name: 'Fruit', ctors: [{ params: [['String', 'name']], body: ['"Fruit\'s constructor is invoked"'] }] },
        { name: 'Apple', parent: 'Fruit', ctors: [] }
      ],
      exprs: ['new Apple()', 'new Fruit("elma")']
    },
    abc: {
      title: 'A → B (this + super)',
      src: 'Vize provası · soru 1',
      classes: [
        { name: 'A', ctors: [{ params: [], first: { kind: 'this', args: ['1'] }, body: ['"a"'] }, { params: [['int', 'x']], body: ['"b" + x'] }] },
        { name: 'B', parent: 'A', ctors: [{ params: [], body: ['"c"'] }, { params: [['int', 'x']], first: { kind: 'super', args: ['x'] }, body: ['"d"'] }] }
      ],
      exprs: ['new B()', 'new B(5)', 'new A()']
    }
  };

  const litType = (a) => (/^".*"$/.test(a) ? 'String' : /^-?\d+$/.test(a) ? 'int' : /^-?\d+\.\d+$/.test(a) ? 'double' : null);
  const accepts = (param, arg) => param === arg || (param === 'double' && arg === 'int');

  // Model → Java kaynak kodu; her yapıcının başlık / ilk satır / gövde satır numaraları kaydedilir
  function buildCode(model, expr) {
    const lines = [];
    const at = {};
    const push = (s) => { lines.push(s); return lines.length; };
    push('public class Main {');
    push('    public static void main(String[] args) {');
    at.main = push(`        ${expr};`);
    push('    }');
    push('}');
    model.classes.forEach((c) => {
      push('');
      at[c.name] = { decl: push(`class ${c.name}${c.parent ? ` extends ${c.parent}` : ''} {`), ctors: [] };
      if (!c.ctors.length) {
        const l = push(`    // derleyicinin eklediği varsayılan yapıcı: public ${c.name}() { super(); }`);
        at[c.name].implicit = l;
      }
      c.ctors.forEach((k) => {
        const rec = { head: push(`    public ${c.name}(${k.params.map(([t, n]) => `${t} ${n}`).join(', ')}) {`), body: [] };
        if (k.first) rec.first = push(`        ${k.first.kind}(${k.first.args.join(', ')});`);
        k.body.forEach((b) => rec.body.push(push(`        System.out.println(${b});`)));
        push('    }');
        at[c.name].ctors.push(rec);
      });
      push('}');
    });
    return { code: lines.join('\n'), at };
  }

  // Basit ifade değerlendirici: "metin" + param, sayı literali ya da parametre adı
  function evalExpr(src, env) {
    return src.split(/\s*\+\s*/).map((part) => {
      if (/^".*"$/.test(part)) return part.slice(1, -1);
      if (part in env) return env[part].v;
      return part;
    }).join('');
  }
  function typeOf(arg, env) {
    if (arg in env) return env[arg].t;
    return litType(arg);
  }

  function simulateChain(model, expr) {
    const { code, at } = buildCode(model, expr);
    const cls = (n) => model.classes.find((c) => c.name === n);
    const steps = [];
    const stack = [];
    const out = [];
    const m = expr.match(/^new\s+(\w+)\((.*)\)$/);
    const args0 = m[2].trim() ? m[2].split(/\s*,\s*/) : [];
    let error = null;

    const snap = (lines, note, extra) => steps.push(Object.assign({ lines, note, stack: stack.slice(), out: out.slice(), active: stack.length ? stack[stack.length - 1].cls : null }, extra || {}));

    function invoke(cName, args, env, why, callLine) {
      if (error) return;
      const c = cls(cName);
      if (!c) { // Object: zincirin tepesi
        stack.push({ cls: 'Object', sig: 'Object()' });
        snap([callLine], `<b>Object()</b> çağrıldı: zincirin tepesi. Java'daki her sınıf sonunda Object'ten türer.`);
        stack.pop();
        return;
      }
      const types = args.map((a) => typeOf(a, env));
      const vals = args.map((a) => (a in env ? env[a].v : /^".*"$/.test(a) ? a.slice(1, -1) : a));
      let ctor;
      let rec;
      if (!c.ctors.length) {
        if (types.length) {
          error = `<b>Derleme hatası:</b> ${cName} sınıfında <code>${cName}(${types.join(', ')})</code> yapıcısı yok. Sınıfa hiç yapıcı yazılmadığı için yalnızca varsayılan <code>${cName}()</code> var.`;
          snap([callLine], error, { status: 'compile' });
          return;
        }
        stack.push({ cls: cName, sig: `${cName}() · varsayılan` });
        snap([at[cName].implicit], `${why}: <b>${cName}</b> sınıfına hiç yapıcı yazılmamış → derleyici <b>varsayılan yapıcı</b> <code>${cName}() { super(); }</code> ekledi.`);
        invoke(c.parent, [], {}, `${cName}() içindeki gizli super()`, at[cName].implicit);
        if (error) return;
        stack.pop();
        return;
      }
      const idx = c.ctors.findIndex((k) => k.params.length === types.length && k.params.every(([t], i) => accepts(t, types[i])));
      if (idx < 0) {
        const have = c.ctors.map((k) => `${cName}(${k.params.map((p) => p[0]).join(', ')})`).join(', ');
        error = `<b>Derleme hatası:</b> <code>${cName}(${types.join(', ')})</code> ile eşleşen yapıcı yok. Var olanlar: <code>${have}</code>.${types.length === 0 && why.includes('super') ? ' Gizli <code>super()</code> parametresiz bir üst yapıcı ister; yapıcı yazılınca varsayılan yapıcı verilmez.' : ''}`;
        snap([callLine], error, { status: 'compile' });
        return;
      }
      ctor = c.ctors[idx];
      rec = at[cName].ctors[idx];
      const localEnv = {};
      ctor.params.forEach(([t, n], i) => { localEnv[n] = { t, v: vals[i] }; });
      stack.push({ cls: cName, sig: `${cName}(${ctor.params.map((p) => p[0]).join(', ')})` });
      snap([rec.head], `${why}: <b>${cName}(${ctor.params.map((p) => p[0]).join(', ')})</b> seçildi${types.length ? ` (argüman tipleri: ${types.join(', ')})` : ''}. Gövdeye girmeden önce <b>ilk satıra</b> bakılır.`);
      if (ctor.first && ctor.first.kind === 'this') {
        snap([rec.first], `İlk satır <code>this(...)</code> → aynı sınıfın başka bir yapıcısına devredilir. Burada gizli super() <b>eklenmez</b>.`);
        invoke(cName, ctor.first.args, localEnv, 'this(...) çağrısı', rec.first);
      } else if (ctor.first && ctor.first.kind === 'super') {
        snap([rec.first], `İlk satır açık <code>super(...)</code> → üst sınıf <b>${c.parent}</b>'ın uygun yapıcısı.`);
        invoke(c.parent, ctor.first.args, localEnv, 'super(...) çağrısı', rec.first);
      } else {
        snap([rec.head], `İlk satırda this/super yok → derleyici <code>super();</code> ekler → <b>${c.parent || 'Object'}()</b>.`);
        invoke(c.parent, [], {}, 'gizli super()', rec.head);
      }
      if (error) return;
      ctor.body.forEach((b, k) => {
        out.push(evalExpr(b, localEnv));
        snap([rec.body[k]], `Üst yapıcılar bitti, <b>${cName}</b>'ın gövdesi çalışıyor.`, { printed: true });
      });
      stack.pop();
      snap([rec.head], `<b>${cName}</b> yapıcısı bitti, çağırana dönülüyor.`);
    }

    // Java dosyanın tamamını derler: seçilen ifade kullanmasa bile hatalı bir sınıf programı derletmez
    for (const c of model.classes) {
      if (!c.parent) continue;
      const p = cls(c.parent);
      const needs = c.ctors.length
        ? c.ctors.map((k, i) => ({ k, i })).filter(({ k }) => !k.first || k.first.kind === 'super')
        : [{ k: null }];
      for (const { k, i } of needs) {
        const env = {};
        if (k) k.params.forEach(([t, nm]) => { env[nm] = { t }; });
        const types = k && k.first ? k.first.args.map((a) => typeOf(a, env)) : [];
        const okCtor = p.ctors.length
          ? p.ctors.some((pk) => pk.params.length === types.length && pk.params.every(([t], j) => accepts(t, types[j])))
          : types.length === 0;
        // İfade bu sınıfı (ya da alt sınıfını) oluşturuyorsa hatayı zinciri yürütürken adım adım göster
        let usesIt = false;
        for (let x = cls(m[1]); x; x = x.parent && cls(x.parent)) if (x.name === c.name) usesIt = true;
        if (!okCtor && !usesIt) {
          const line = k ? at[c.name].ctors[i].head : at[c.name].implicit;
          const have = p.ctors.map((pk) => `${p.name}(${pk.params.map((x) => x[0]).join(', ')})`).join(', ');
          error = `<b>Derleme hatası (${c.name} sınıfında):</b> ${k ? `${c.name} yapıcısı` : `${c.name}'ın varsayılan yapıcısı`} ${k && k.first ? `<code>super(${types.join(', ')})</code>` : 'gizli <code>super()</code>'} çağırıyor ama ${p.name}'de böyle bir yapıcı yok (var olan: <code>${have}</code>). Java dosyanın tamamını derlediği için <code>${esc(expr)}</code> ${c.name} sınıfını kullanmasa bile program derlenmez.`;
          snap([line], error, { status: 'compile' });
          return { code, steps, error };
        }
      }
    }

    snap([at.main], `<code>${esc(expr)}</code> değerlendiriliyor.`);
    invoke(m[1], args0, {}, 'new', at.main);
    if (!error) {
      stack.length = 0;
      snap([at.main], `Nesne tamamen oluştu. Çıktı sırası <b>en üst sınıftan en alta</b>: çağrılar alttan üste gider, gövdeler üstten alta çalışır.`, { status: 'done' });
    }
    return { code, steps, error };
  }

  /* =============================================================== 2 · Dinamik bağlama */

  const H = ['Object', 'Person', 'Student', 'GraduateStudent'];
  const parentOf = (c) => H[H.indexOf(c) - 1] || null;
  const isSub = (a, b) => H.indexOf(a) >= H.indexOf(b); // a, b'nin alt tipi mi (zincir doğrusal)

  // Hangi sınıf hangi metodu tanımlıyor? toString'i Object her zaman tanımlar; diğerleri kullanıcı açar/kapatır.
  const DEFAULT_DEFS = {
    toString: { Object: true, Person: true, Student: true, GraduateStudent: false },
    getName: { Person: true },
    study: { Student: true }
  };
  const RET = {
    toString: (c) => (c === 'Object' ? '__OBJ__' : `"${c}"`),
    getName: () => '"Ayşe"',
    study: (c) => `"${c} ders çalışıyor"`
  };

  function simulateBind(declared, actual, op, defs) {
    const steps = [];
    const varName = declared === 'Object' ? 'o' : declared[0].toLowerCase();
    const isCast = op.startsWith('cast:');
    const target = isCast ? op.slice(5) : null;
    const code = isCast
      ? `${declared} ${varName} = new ${actual}();\n${target} t = (${target}) ${varName};\nSystem.out.println(t instanceof ${target});`
      : `${declared} ${varName} = new ${actual}();\nSystem.out.println(${varName}.${op}());`;

    steps.push({ lines: [1], phase: 'compile', note: `<b>1. Derleme · atama:</b> <code>${declared} ${varName} = new ${actual}()</code>. Her ${actual} bir ${declared} mı?`, hl: { [declared]: 'declared', [actual]: 'actual' } });
    if (!isSub(actual, declared)) {
      steps.push({ lines: [1], phase: 'compile', status: 'compile', note: `<b>Derleme hatası:</b> incompatible types. ${actual}, ${declared}'ın alt sınıfı değil: bir üst tip nesnesini alt tip değişkenine örtük atayamazsın (açık cast gerekir).`, hl: { [declared]: 'declared', [actual]: 'bad' } });
      return { code, steps };
    }
    steps.push({ lines: [1], phase: 'compile', note: `✓ ${actual} → ${declared} <b>örtük upcast</b>, her zaman güvenli. Bundan sonra derleyici ${varName}'yi yalnızca <b>${declared}</b> olarak bilir; JVM ise gerçek nesnenin <b>${actual}</b> olduğunu bilir.`, hl: { [declared]: 'declared', [actual]: 'actual' } });

    if (isCast) {
      const related = isSub(target, declared) || isSub(declared, target);
      steps.push({ lines: [2], phase: 'compile', note: `<b>2. Derleme · cast:</b> <code>(${target}) ${varName}</code>. ${target} ile ${declared} aynı kalıtım hattında mı?`, hl: { [declared]: 'declared', [target]: 'target' } });
      if (!related) {
        steps.push({ lines: [2], phase: 'compile', status: 'compile', note: '<b>Derleme hatası:</b> inconvertible types.', hl: { [target]: 'bad' } });
        return { code, steps };
      }
      steps.push({ lines: [2], phase: 'compile', note: isSub(declared, target) ? `✓ ${target}, ${declared}'ın üst tipi: bu bir <b>upcast</b>, cast yazmak gereksiz ama serbest.` : `✓ ${target}, ${declared}'ın alt tipi: <b>downcast</b>. Derleyici "olabilir" der ve izin verir; asıl kontrol çalışma anında.`, hl: { [declared]: 'declared', [target]: 'target' } });
      const ok = isSub(actual, target);
      steps.push({ lines: [2], phase: 'run', note: `<b>3. Çalışma zamanı:</b> JVM gerçek nesneye bakar: ${actual} bir ${target} mı? ${ok ? `<b>Evet</b> → cast başarılı.` : `<b>Hayır</b> → <b>ClassCastException</b>.`}`, hl: { [actual]: ok ? 'found' : 'bad', [target]: 'target' }, status: ok ? null : 'alert', out: ok ? null : `!!Exception in thread "main" java.lang.ClassCastException: class ${actual} cannot be cast to class ${target}` });
      if (ok) steps.push({ lines: [3], phase: 'run', note: '<code>instanceof</code> da gerçek tipe bakar.', out: 'true', status: 'done', hl: { [actual]: 'found' } });
      return { code, steps };
    }

    // Derleme: bildirilen tipte (veya atalarında) metot var mı?
    const chainUp = (from) => { const xs = []; for (let c = from; c; c = parentOf(c)) xs.push(c); return xs; };
    const compileChain = chainUp(declared);
    const found = compileChain.find((c) => defs[op] && defs[op][c]);
    steps.push({ lines: [2], phase: 'compile', note: `<b>2. Derleme · eşleştirme:</b> derleyici <code>${op}()</code>'yi <b>bildirilen tipte</b> (${declared}) ve atalarında arar: ${compileChain.join(' → ')}.`, hl: Object.fromEntries(compileChain.map((c) => [c, 'scan'])) });
    if (!found) {
      steps.push({ lines: [2], phase: 'compile', status: 'compile', note: `<b>Derleme hatası:</b> cannot find symbol <code>${op}()</code>. Gerçek nesne (${actual}) bu metoda sahip olsa bile derleyici yalnızca ${declared}'ı görür. Çözüm: <code>((${H.find((c) => defs[op] && defs[op][c] && isSub(c, declared)) || actual}) ${varName}).${op}()</code>.`, hl: { [declared]: 'bad' } });
      return { code, steps };
    }
    steps.push({ lines: [2], phase: 'compile', note: `✓ <code>${op}()</code> ${found}'ta bulundu → program <b>derlenir</b>. Ama hangi gövdenin çalışacağı henüz belli değil.`, hl: { [found]: 'found', [declared]: 'declared' } });

    // Çalışma: gerçek tipten yukarı doğru ilk tanım
    const runChain = chainUp(actual);
    let impl = null;
    for (const c of runChain) {
      const has = defs[op] && defs[op][c];
      steps.push({ lines: [2], phase: 'run', note: `<b>3. Çalışma · dinamik bağlama:</b> JVM <b>${c}</b> sınıfına bakıyor: <code>${op}()</code> ${has ? '<b>burada tanımlı ✓</b> → arama durur.' : 'burada yok, bir üst sınıfa çık.'}`, hl: { [c]: has ? 'found' : 'scan', [actual]: c === actual && has ? 'found' : 'actual' } });
      if (has) { impl = c; break; }
    }
    const val = RET[op](impl);
    // Object.toString = getClass().getName() + "@" + hash; Object'in kendisi java.lang paketindedir
    const shown = val === '__OBJ__' ? `${actual === 'Object' ? 'java.lang.Object' : actual}@1b6d3586` : val.slice(1, -1);
    steps.push({ lines: [2], phase: 'run', status: 'done', out: shown, note: `<b>${impl}.${op}()</b> çalıştı. Kural: <b>ne çağrılabileceğini bildirilen tip</b> (${declared}), <b>hangi gövdenin çalışacağını gerçek tip</b> (${actual}) belirler.${val === '__OBJ__' ? ' (Object\'in toString\'i: sınıf adı@hash.)' : ''}`, hl: { [impl]: 'found', [declared]: 'declared' } });
    return { code, steps };
  }

  /* =============================================================== arayüz */

  const S = { tab: 'chain', chain: 'faculty', expr: 'new Faculty()', declared: 'Person', actual: 'GraduateStudent', op: 'toString', defs: JSON.parse(JSON.stringify(DEFAULT_DEFS)), sim: null, i: -1, timer: 0 };
  let root = null;

  function rerun() {
    stop();
    S.sim = S.tab === 'chain' ? simulateChain(CHAINS[S.chain], S.expr) : simulateBind(S.declared, S.actual, S.op, S.defs);
    S.i = -1;
    draw();
  }

  function stop() {
    clearInterval(S.timer);
    S.timer = 0;
    const b = root && root.querySelector('#ds-play');
    if (b) b.textContent = '⏵ Otomatik';
  }

  function hierarchyChain(st) {
    const model = CHAINS[S.chain];
    const order = [];
    // kökten başlayarak ağaç: Object → kökler → çocuklar
    const kids = (p) => model.classes.filter((c) => (c.parent || null) === p);
    const walk = (p, d) => kids(p).forEach((c) => { order.push({ c, d }); walk(c.name, d + 1); });
    walk(null, 1);
    const activeSet = new Set((st ? st.stack : []).map((f) => f.cls));
    const top = st && st.active;
    const node = (name, d, sub) => `<div class="ds-node${activeSet.has(name) ? ' on' : ''}${top === name ? ' top' : ''}" style="--d:${d}"><b>${name}</b>${sub ? `<small>${sub}</small>` : ''}</div>`;
    return `<div class="ds-tree">${node('Object', 0, 'java.lang')}${order.map(({ c, d }) => node(c.name, d, c.ctors.length ? `${c.ctors.length} yapıcı` : 'yapıcı yok')).join('')}</div>`;
  }

  function hierarchyBind(st) {
    const hl = (st && st.hl) || {};
    return `<div class="ds-tree ds-bind">${H.map((c, d) => {
      const marks = [];
      if (c === S.declared) marks.push('<span class="ds-mark decl">bildirilen tip</span>');
      if (c === S.actual) marks.push('<span class="ds-mark act">gerçek tip</span>');
      const meths = Object.keys(S.defs).filter((mth) => S.defs[mth][c]);
      return `<div class="ds-node ds-${hl[c] || ''}" style="--d:${d}">
        <b>${c}</b>${marks.join('')}
        <div class="ds-meths">${['toString', 'getName', 'study'].map((mth) => {
          const fixed = (mth === 'toString' && c === 'Object') || mth !== 'toString';
          const on = !!(S.defs[mth] && S.defs[mth][c]);
          if (mth !== 'toString' && !on) return '';
          return fixed
            ? `<span class="ds-meth on">${mth}()</span>`
            : `<label class="ds-meth${on ? ' on' : ''}" title="Bu sınıf toString'i override etsin mi?"><input type="checkbox" data-def="${c}" ${on ? 'checked' : ''}>${mth}()</label>`;
        }).join('')}${!meths.length ? '<span class="ds-meth none">metot yok</span>' : ''}</div>
      </div>`;
    }).join('')}</div>`;
  }

  function draw() {
    if (!root) return;
    const sim = S.sim;
    const st = S.i >= 0 ? sim.steps[S.i] : null;
    root.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('active', b.dataset.tab === S.tab));
    root.querySelector('#ds-config').innerHTML = S.tab === 'chain' ? configChain() : configBind();
    root.querySelector('#ds-tree').innerHTML = S.tab === 'chain' ? hierarchyChain(st) : hierarchyBind(st);
    root.querySelector('#ds-tree-h').textContent = S.tab === 'chain' ? 'Sınıf hiyerarşisi · çalışan yapıcılar' : 'Hiyerarşi · metot arama yolu';
    root.querySelector('#ds-code').innerHTML = OOPLab.java.lines(sim.code, st ? st.lines : []);
    root.querySelector('#ds-count').textContent = `${S.i + 1} / ${sim.steps.length}`;
    root.querySelector('#ds-prev').disabled = S.i < 0;
    root.querySelector('#ds-next').disabled = S.i >= sim.steps.length - 1;
    root.querySelector('#ds-note').innerHTML = st ? st.note : (S.tab === 'chain'
      ? `Bir <code>new</code> ifadesi seç ve <b>İleri</b> ile yürüt. Her adımda hangi yapıcının seçildiğini ve neden seçildiğini görürsün.`
      : `Bildirilen tipi, gerçek tipi ve çağrıyı seç. Önce <b>derleyicinin</b> kontrolünü, sonra <b>JVM'in</b> metot aramasını izle.`);
    const outs = S.tab === 'chain'
      ? (st ? st.out : [])
      : sim.steps.slice(0, S.i + 1).filter((x) => x.out).map((x) => x.out);
    root.querySelector('#ds-out').innerHTML = outs.length ? outs.map((o) => (o.startsWith('!!') ? `<span class="err">${esc(o.slice(2))}</span>` : esc(o))).join('\n') : '<span class="muted">(henüz çıktı yok)</span>';
    root.querySelector('#ds-stack').innerHTML = S.tab === 'chain'
      ? (st && st.stack.length ? st.stack.slice().reverse().map((f, k) => `<li class="${k === 0 ? 'top' : ''}">${esc(f.sig)}</li>`).join('') : '<li class="muted">boş</li>')
      : (st ? `<li class="${st.phase === 'compile' ? 'top' : ''}">Derleyici · bildirilen tip</li><li class="${st.phase === 'run' ? 'top' : ''}">JVM · gerçek tip</li>` : '<li class="muted">başlamadı</li>');
    root.querySelector('#ds-stack-h').textContent = S.tab === 'chain' ? 'Çağrı yığını' : 'Aşama';
    const line = root.querySelector('#ds-code .jl.on');
    if (line) line.scrollIntoView({ block: 'nearest' });
    OOPLab.app.setStatus(!st ? 'ready' : st.status || (S.timer ? 'running' : 'paused'));
  }

  function configChain() {
    const model = CHAINS[S.chain];
    return `<div class="field"><label for="ds-chain">Sınıf hiyerarşisi</label>
        <select id="ds-chain">${Object.entries(CHAINS).map(([id, c]) => `<option value="${id}"${id === S.chain ? ' selected' : ''}>${c.title} · ${c.src}</option>`).join('')}</select></div>
      <div class="field"><label>Oluşturulacak nesne</label>
        <div class="ds-exprs">${model.exprs.map((x) => `<button type="button" class="dg-tab${x === S.expr ? ' active' : ''}" data-expr="${esc(x)}"><code>${esc(x)}</code></button>`).join('')}</div></div>
      <p class="hint">Kod, seçilen modelden otomatik üretilir. Sınavdaki yöntem: <code>new</code> hangi yapıcıyla eşleşiyor → ilk satırı this mi, super mi, hiçbiri mi (gizli super()) → zinciri tepeye kadar çık → çıktıları tepeden aşağı yaz.</p>`;
  }

  function configBind() {
    const opts = (sel) => H.map((c) => `<option${c === sel ? ' selected' : ''}>${c}</option>`).join('');
    const ops = [['toString', 'x.toString()'], ['getName', 'x.getName()  · Person\'da'], ['study', 'x.study()  · sadece Student\'ta'], ...H.slice(1).map((c) => [`cast:${c}`, `(${c}) x  · cast`])];
    return `<div class="ds-bindcfg">
        <div class="field"><label for="ds-decl">Bildirilen tip (değişken)</label><select id="ds-decl">${opts(S.declared)}</select></div>
        <div class="field"><label for="ds-act">Gerçek tip (new ile)</label><select id="ds-act">${opts(S.actual)}</select></div>
        <div class="field span-all"><label for="ds-op">İşlem</label><select id="ds-op">${ops.map(([v, t]) => `<option value="${v}"${v === S.op ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></div>
      </div>
      <p class="hint">Hiyerarşide <b>toString()</b> kutucuklarını açıp kapatarak hangi sınıfın override ettiğini değiştir; JVM'in arama yolunun nasıl değiştiğini izle. Slayttaki PolymorphismDemo: Person ve Student override eder, GraduateStudent etmez.</p>`;
  }

  function template() {
    return `
      <p class="module-lead">Kalıtımın iki büyük sınav sorusu: <b>"hangi yapıcı hangi sırayla çalışır?"</b> ve <b>"hangi metot çalışır, derlenir mi?"</b>. Burada ikisini de kendin kurup adım adım çalıştırırsın.</p>
      <div class="lab-tabs">
        <button class="lab-tab" type="button" data-tab="chain"><span class="lab-num">A</span>Yapıcı Zinciri<small>this · super · gizli super()</small></button>
        <button class="lab-tab" type="button" data-tab="bind"><span class="lab-num">B</span>Dinamik Bağlama<small>bildirilen tip · gerçek tip · cast</small></button>
      </div>
      <div class="ds-grid">
        <div class="stack">
          <article class="card"><header class="card-head"><h2>Konfigürasyon</h2><span class="tag">Kalıtım</span></header><div id="ds-config"></div></article>
          <article class="card"><header class="card-head"><h2 id="ds-tree-h"></h2><span class="tag">extends</span></header><div id="ds-tree"></div>
            <h4 class="ds-sub" id="ds-stack-h"></h4><ol class="ds-stack" id="ds-stack"></ol></article>
        </div>
        <article class="card">
          <header class="card-head"><h2>Kod</h2><span class="tag">otomatik üretildi</span></header>
          <pre class="jt-code ds-code" id="ds-code"></pre>
          <div class="dg-ctrl">
            <button class="btn btn-sm" id="ds-prev" type="button">◀ Geri</button>
            <span class="dg-count" id="ds-count"></span>
            <button class="btn btn-sm btn-primary" id="ds-next" type="button">İleri ▶</button>
            <button class="btn btn-sm btn-ghost" id="ds-play" type="button">⏵ Otomatik</button>
            <button class="btn btn-sm btn-ghost" id="ds-end" type="button">⏭ Sonuca atla</button>
            <button class="btn btn-sm btn-ghost" id="ds-reset" type="button" title="Başa al">↺</button>
          </div>
          <div class="dg-caption" id="ds-note"></div>
          <div class="jt-console"><span class="jt-console-h">Konsol çıktısı</span><pre id="ds-out"></pre></div>
        </article>
      </div>`;
  }

  function go(i) {
    S.i = Math.max(-1, Math.min(i, S.sim.steps.length - 1));
    draw();
  }

  function onClick(e) {
    const t = e.target;
    const tab = t.closest('[data-tab]');
    if (tab) { S.tab = tab.dataset.tab; rerun(); return; }
    const ex = t.closest('[data-expr]');
    if (ex) { S.expr = ex.dataset.expr; rerun(); return; }
    if (t.closest('#ds-next')) { stop(); go(S.i + 1); }
    else if (t.closest('#ds-prev')) { stop(); go(S.i - 1); }
    else if (t.closest('#ds-reset')) { stop(); go(-1); }
    else if (t.closest('#ds-end')) { stop(); go(S.sim.steps.length - 1); }
    else if (t.closest('#ds-play')) {
      if (S.timer) { stop(); draw(); return; }
      if (S.i >= S.sim.steps.length - 1) S.i = -1;
      t.closest('#ds-play').textContent = '⏸ Durdur';
      S.timer = setInterval(() => {
        if (!root || S.i >= S.sim.steps.length - 1) { stop(); draw(); return; }
        go(S.i + 1);
      }, 1700);
      go(S.i + 1);
    }
  }

  function onChange(e) {
    const t = e.target;
    if (t.id === 'ds-chain') { S.chain = t.value; S.expr = CHAINS[S.chain].exprs[0]; rerun(); }
    else if (t.id === 'ds-decl') { S.declared = t.value; rerun(); }
    else if (t.id === 'ds-act') { S.actual = t.value; rerun(); }
    else if (t.id === 'ds-op') { S.op = t.value; rerun(); }
    else if (t.dataset.def) { S.defs.toString[t.dataset.def] = t.checked; rerun(); }
  }

  function mount(container) {
    root = container;
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
    if (p.tab) S.tab = p.tab;
    if (p.preset && CHAINS[p.preset]) { S.chain = p.preset; S.expr = p.expr || CHAINS[p.preset].exprs[0]; }
    if (p.declared) S.declared = p.declared;
    if (p.actual) S.actual = p.actual;
    if (p.method) S.op = p.method;
    if (root) rerun();
  }

  OOPLab.dispatch = { simulateChain, simulateBind, CHAINS, DEFAULT_DEFS };
  OOPLab.modules = OOPLab.modules || {};
  OOPLab.modules.dispatch = { num: 'L2', title: 'Kalıtım Laboratuvarı', subtitle: 'Yapıcı zinciri ve dinamik bağlama', mount, unmount, loadPreset };
})(window.OOPLab = window.OOPLab || {});
