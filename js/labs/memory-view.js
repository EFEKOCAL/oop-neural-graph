/*
 * memory-view.js — L1 "Stack & Heap" laboratuvarı.
 * Senaryolar elle yazılmış adımlardan oluşur; her adım belleğin tam fotoğrafıdır:
 *   { line, note, stack: [[çerçeve, [[ad, değer], ...]], ...], heap: [nesne, ...], statics: [[ad, değer]], out, status }
 * Değer '@C1' ise heap'teki C1 nesnesine referanstır (ok çizilir); 'null' ve '—' (değer yok) özel gösterilir.
 * Heap nesnesi: { id, cls, fields: [[ad, değer]] } veya dizi için { id, cls, slots: [değer, ...] }; gc:true → çöp.
 */
(function (OOPLab) {
  'use strict';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const C = (id, r, gc) => ({ id, cls: 'Circle', fields: [['radius', r]], gc });

  const SCENARIOS = {
    referans: {
      title: 'Referans değişkenleri',
      src: 'Slide01 s.21–27',
      lead: 'Slayttaki animasyonun aynısı: değişkenin bildirilmesi, nesnenin heap\'te oluşması ve referansın atanması üç ayrı adımdır.',
      code: `Circle myCircle = new Circle(5.0);
Circle yourCircle = new Circle();
yourCircle.radius = 100;
System.out.println(myCircle.radius);`,
      steps: [
        { line: 1, note: '<b>myCircle bildirildi.</b> Stack\'te bir kutu var ama henüz hiçbir nesneyi göstermiyor.', stack: [['main', [['myCircle', '—']]]], heap: [] },
        { line: 1, note: '<b>new Circle(5.0)</b>: heap\'te nesne oluştu, yapıcı radius\'u 5.0 yaptı. Referans henüz atanmadı.', stack: [['main', [['myCircle', '—']]]], heap: [C('C1', '5.0')] },
        { line: 1, note: '<b>=</b> nesnenin referansını (adresini) myCircle\'a yazdı. Ok, değişkenin nesneyi gösterdiğini anlatır.', stack: [['main', [['myCircle', '@C1']]]], heap: [C('C1', '5.0')] },
        { line: 2, note: 'yourCircle bildirildi ve no-arg yapıcıyla ikinci, <b>bağımsız</b> bir nesne oluşturuldu (radius alan başlangıcından 1.0).', stack: [['main', [['myCircle', '@C1'], ['yourCircle', '@C2']]]], heap: [C('C1', '5.0'), C('C2', '1.0')] },
        { line: 3, note: 'Nokta operatörü: <b>yourCircle\'ın gösterdiği</b> nesnenin radius alanı değişti. myCircle etkilenmez.', stack: [['main', [['myCircle', '@C1'], ['yourCircle', '@C2']]]], heap: [C('C1', '5.0'), C('C2', '100.0')] },
        { line: 4, note: 'myCircle\'ın gösterdiği nesnenin alanı okunur.', stack: [['main', [['myCircle', '@C1'], ['yourCircle', '@C2']]]], heap: [C('C1', '5.0'), C('C2', '100.0')], out: '5.0', status: 'done' }
      ]
    },
    atama: {
      title: 'Atama, aliasing ve çöp toplama',
      src: 'Slide01 s.32–35',
      lead: 'İlkel tipte = değeri kopyalar; nesne tipinde referansı kopyalar. Referansı kalmayan nesne çöptür.',
      code: `int i = 1, j = 2;
i = j;
Circle c1 = new Circle(5);
Circle c2 = new Circle(9);
c1 = c2;
c1.radius = 7;
System.out.println(c2.radius);
c1 = null;
c2 = null;`,
      steps: [
        { line: 1, note: 'İlkel değişkenler: değer <b>kutunun içinde</b>.', stack: [['main', [['i', '1'], ['j', '2']]]], heap: [] },
        { line: 2, note: 'j\'nin <b>değeri</b> i\'ye kopyalandı. Artık birbirlerinden bağımsızlar.', stack: [['main', [['i', '2'], ['j', '2']]]], heap: [] },
        { line: 4, note: 'İki ayrı nesne, iki referans.', stack: [['main', [['i', '2'], ['j', '2'], ['c1', '@A'], ['c2', '@B']]]], heap: [C('A', '5.0'), C('B', '9.0')] },
        { line: 5, note: '<b>c1 = c2</b>: c2\'nin <b>referansı</b> kopyalandı. İkisi de B\'yi gösteriyor (aliasing). A\'ya giden hiçbir ok kalmadı → <b>çöp</b>.', stack: [['main', [['i', '2'], ['j', '2'], ['c1', '@B'], ['c2', '@B']]]], heap: [C('A', '5.0', true), C('B', '9.0')] },
        { line: 6, note: 'c1 üzerinden değiştirdik, ama nesne ortak: c2 de 7 görür.', stack: [['main', [['i', '2'], ['j', '2'], ['c1', '@B'], ['c2', '@B']]]], heap: [C('A', '5.0', true), C('B', '7.0')] },
        { line: 7, note: '', stack: [['main', [['i', '2'], ['j', '2'], ['c1', '@B'], ['c2', '@B']]]], heap: [C('A', '5.0', true), C('B', '7.0')], out: '7.0' },
        { line: 8, note: 'c1 artık hiçbir şeyi göstermiyor. B\'yi hâlâ c2 gösterdiği için B çöp değil.', stack: [['main', [['i', '2'], ['j', '2'], ['c1', 'null'], ['c2', '@B']]]], heap: [C('A', '5.0', true), C('B', '7.0')] },
        { line: 9, note: 'Son referans da gitti: B de çöp. JVM\'in çöp toplayıcısı (GC) bu nesnelerin belleğini <b>otomatik</b> geri alır; Java\'da delete yoktur.', stack: [['main', [['i', '2'], ['j', '2'], ['c1', 'null'], ['c2', 'null']]]], heap: [C('A', '5.0', true), C('B', '7.0', true)], status: 'done' }
      ]
    },
    pass: {
      title: 'Metoda nesne geçirmek (pass-by-value)',
      src: 'Slide01 s.55–56',
      lead: 'Java her zaman değer ile geçirir. Nesnede "değer" referanstır: metot nesnenin içini değiştirebilir ama çağıranın değişkenini başka nesneye çeviremez.',
      code: `public static void main(String[] args) {
    int x = 5;
    Circle k = new Circle(5);
    degistir(x, k);
    System.out.println(x + " " + k.radius);
}

static void degistir(int n, Circle c) {
    n = 100;
    c.radius = 100;
    c = new Circle(1);
    c.radius = 50;
}`,
      steps: [
        { line: 2, note: 'main\'in stack çerçevesi açıldı.', stack: [['main', [['x', '5']]]], heap: [] },
        { line: 3, note: 'k bir referans.', stack: [['main', [['x', '5'], ['k', '@C1']]]], heap: [C('C1', '5.0')] },
        { line: 8, note: '<b>Çağrı</b>: degistir için <b>yeni bir çerçeve</b> açıldı. x\'in <b>değeri</b> n\'ye, k\'nin <b>referansı</b> c\'ye kopyalandı. c ve k aynı nesneyi gösteriyor.', stack: [['main', [['x', '5'], ['k', '@C1']]], ['degistir', [['n', '5'], ['c', '@C1']]]], heap: [C('C1', '5.0')] },
        { line: 9, note: 'n değişti; main.x\'in bundan haberi yok (ayrı kutu).', stack: [['main', [['x', '5'], ['k', '@C1']]], ['degistir', [['n', '100'], ['c', '@C1']]]], heap: [C('C1', '5.0')] },
        { line: 10, note: 'c üzerinden <b>ortak</b> nesnenin içi değişti → main.k de bunu görür.', stack: [['main', [['x', '5'], ['k', '@C1']]], ['degistir', [['n', '100'], ['c', '@C1']]]], heap: [C('C1', '100.0')] },
        { line: 11, note: 'c\'ye yeni nesne atandı: yalnızca <b>kopya</b> referans yön değiştirdi. main.k hâlâ C1\'i gösteriyor.', stack: [['main', [['x', '5'], ['k', '@C1']]], ['degistir', [['n', '100'], ['c', '@C2']]]], heap: [C('C1', '100.0'), C('C2', '1.0')] },
        { line: 12, note: 'Bu değişiklik main\'in hiç görmediği C2\'ye.', stack: [['main', [['x', '5'], ['k', '@C1']]], ['degistir', [['n', '100'], ['c', '@C2']]]], heap: [C('C1', '100.0'), C('C2', '50.0')] },
        { line: 4, note: 'Metot bitti: çerçevesi <b>yok edildi</b> (n ve c gitti). C2\'yi gösteren kimse kalmadı → çöp.', stack: [['main', [['x', '5'], ['k', '@C1']]]], heap: [C('C1', '100.0'), C('C2', '50.0', true)] },
        { line: 5, note: 'x değişmedi, k\'nin nesnesinin içi değişti.', stack: [['main', [['x', '5'], ['k', '@C1']]]], heap: [C('C1', '100.0'), C('C2', '50.0', true)], out: '5 100.0', status: 'done' }
      ]
    },
    static: {
      title: 'static: sınıfa ait tek kopya',
      src: 'Slide01 s.41–44',
      lead: 'Instance alanlar her nesnede ayrıdır (heap); static alan sınıfa aittir ve bellekte tek kopyadır.',
      code: `class Circle2 {
    double radius;
    static int count = 0;
    Circle2(double r) { radius = r; count++; }
}

// main:
Circle2 a = new Circle2(1);
Circle2 b = new Circle2(5);
a.count = 10;
System.out.println(b.count + " " + Circle2.count);`,
      steps: [
        { line: 3, note: 'Sınıf yüklenince static alan <b>sınıfın alanında</b> oluşur; hiç nesne yokken bile vardır.', stack: [['main', []]], heap: [], statics: [['Circle2.count', '0']] },
        { line: 8, note: 'a oluştu; yapıcı <b>ortak</b> sayacı artırdı. radius a\'nın kendi kopyası.', stack: [['main', [['a', '@A']]]], heap: [{ id: 'A', cls: 'Circle2', fields: [['radius', '1.0']] }], statics: [['Circle2.count', '1']] },
        { line: 9, note: 'b oluştu; <b>aynı</b> sayaç 2 oldu. Her nesnenin radius\'u ayrı, count tek.', stack: [['main', [['a', '@A'], ['b', '@B']]]], heap: [{ id: 'A', cls: 'Circle2', fields: [['radius', '1.0']] }, { id: 'B', cls: 'Circle2', fields: [['radius', '5.0']] }], statics: [['Circle2.count', '2']] },
        { line: 10, note: 'Nesne üzerinden yazılsa da değişen <b>tek ortak kopya</b>dır (doğru üslup: <code>Circle2.count</code>).', stack: [['main', [['a', '@A'], ['b', '@B']]]], heap: [{ id: 'A', cls: 'Circle2', fields: [['radius', '1.0']] }, { id: 'B', cls: 'Circle2', fields: [['radius', '5.0']] }], statics: [['Circle2.count', '10']] },
        { line: 11, note: 'b üzerinden de, sınıf adıyla da aynı değer.', stack: [['main', [['a', '@A'], ['b', '@B']]]], heap: [{ id: 'A', cls: 'Circle2', fields: [['radius', '1.0']] }, { id: 'B', cls: 'Circle2', fields: [['radius', '5.0']] }], statics: [['Circle2.count', '10']], out: '10 10', status: 'done' }
      ]
    },
    dizi: {
      title: 'Nesne dizisi ve null',
      src: 'Slide01 s.29, 70–72',
      lead: 'new Circle[3] nesne değil, null dolu üç referans kutusu oluşturur. null üzerinden alan okumak NullPointerException\'dır.',
      code: `Circle[] arr = new Circle[3];
arr[0] = new Circle(1);
arr[2] = arr[0];
System.out.println(arr[2].radius);
System.out.println(arr[1].radius);`,
      steps: [
        { line: 1, note: 'Heap\'te 3 kutulu bir <b>dizi nesnesi</b> var; kutuların hepsi <b>null</b>. Hiç Circle oluşmadı, hiçbir yapıcı çağrılmadı.', stack: [['main', [['arr', '@D']]]], heap: [{ id: 'D', cls: 'Circle[]', slots: ['null', 'null', 'null'] }] },
        { line: 2, note: 'İlk kutuya bir Circle referansı kondu: iki aşamalı referans (arr → dizi → nesne).', stack: [['main', [['arr', '@D']]]], heap: [{ id: 'D', cls: 'Circle[]', slots: ['@C1', 'null', 'null'] }, C('C1', '1.0')] },
        { line: 3, note: 'Referans kopyalandı: iki kutu <b>aynı</b> nesneyi gösteriyor.', stack: [['main', [['arr', '@D']]]], heap: [{ id: 'D', cls: 'Circle[]', slots: ['@C1', 'null', '@C1'] }, C('C1', '1.0')] },
        { line: 4, note: '', stack: [['main', [['arr', '@D']]]], heap: [{ id: 'D', cls: 'Circle[]', slots: ['@C1', 'null', '@C1'] }, C('C1', '1.0')], out: '1.0' },
        { line: 5, note: '<b>arr[1] null</b>: gösterdiği bir nesne yok, radius okunamaz → <b>NullPointerException</b>. Program burada çöker.', stack: [['main', [['arr', '@D']]]], heap: [{ id: 'D', cls: 'Circle[]', slots: ['@C1', 'null', '@C1'] }, C('C1', '1.0')], out: '!!Exception in thread "main" java.lang.NullPointerException', status: 'alert', bad: 'D:1' }
      ]
    }
  };

  /* ------------------------------------------------------------ durum */

  const S = { id: 'referans', i: -1, timer: 0, speed: 1800 };
  let root = null;
  let onResize = null;

  const sc = () => SCENARIOS[S.id];

  /* ------------------------------------------------------------ çizim */

  function valHTML(v, refKey) {
    if (v === '—') return '<span class="mm-v none">değer yok</span>';
    if (v === 'null') return '<span class="mm-v null">null</span>';
    if (v[0] === '@') return `<span class="mm-v ref" data-ref="${v.slice(1)}" data-from="${refKey}">●</span>`;
    return `<span class="mm-v prim">${esc(v)}</span>`;
  }

  function memoryHTML(st) {
    const frames = (st.stack || []).slice().reverse();
    const stack = frames.map(([name, vars], fi) => `<div class="mm-frame${fi === 0 ? ' top' : ''}"><div class="mm-frame-h">${esc(name)}()</div>
      ${vars.length ? vars.map(([n, v]) => `<div class="mm-var"><span class="mm-n">${esc(n)}</span>${valHTML(v, `${name}.${n}`)}</div>`).join('') : '<div class="mm-empty">yerel değişken yok</div>'}</div>`).join('');
    const heap = (st.heap || []).map((o) => `<div class="mm-obj${o.gc ? ' gc' : ''}" data-obj="${o.id}">
      <div class="mm-obj-h"><b>${esc(o.cls)}</b><small>#${esc(o.id)}</small>${o.gc ? '<span class="mm-gc">çöp</span>' : ''}</div>
      ${o.slots ? `<div class="mm-slots">${o.slots.map((v, i) => `<div class="mm-slot${st.bad === `${o.id}:${i}` ? ' bad' : ''}"><small>[${i}]</small>${valHTML(v, `${o.id}[${i}]`)}</div>`).join('')}</div>`
        : o.fields.map(([n, v]) => `<div class="mm-var"><span class="mm-n">${esc(n)}</span>${valHTML(v, `${o.id}.${n}`)}</div>`).join('')}
    </div>`).join('');
    const statics = st.statics && st.statics.length
      ? `<div class="mm-statics"><span class="mm-col-h">Sınıf alanı · static</span>${st.statics.map(([n, v]) => `<div class="mm-var"><span class="mm-n">${esc(n)}</span>${valHTML(v)}</div>`).join('')}</div>` : '';
    return `<div class="mm-cols">
        <div class="mm-col"><span class="mm-col-h">Stack <small>(metot çerçeveleri, en üstte çalışan)</small></span>${stack || '<div class="mm-empty">boş</div>'}</div>
        <div class="mm-col"><span class="mm-col-h">Heap <small>(new ile oluşan nesneler)</small></span>${heap || '<div class="mm-empty">henüz nesne yok</div>'}</div>
      </div>${statics}<svg class="mm-arrows" aria-hidden="true"><defs><marker id="mm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs></svg>`;
  }

  // Referans noktalarından heap nesnelerine oklar
  function drawArrows() {
    const box = root && root.querySelector('#mm-mem');
    if (!box) return;
    const svg = box.querySelector('.mm-arrows');
    const base = box.getBoundingClientRect();
    svg.setAttribute('width', base.width);
    svg.setAttribute('height', base.height);
    svg.querySelectorAll('path.mm-line').forEach((p) => p.remove());
    box.querySelectorAll('[data-ref]').forEach((dot) => {
      const obj = box.querySelector(`[data-obj="${dot.dataset.ref}"]`);
      if (!obj) return;
      const a = dot.getBoundingClientRect();
      const o = obj.getBoundingClientRect();
      const x1 = a.left + a.width / 2 - base.left;
      const y1 = a.top + a.height / 2 - base.top;
      const toLeft = o.left - base.left > x1;
      const x2 = (toLeft ? o.left : o.right) - base.left + (toLeft ? -2 : 2);
      const y2 = o.top + Math.min(18, o.height / 2) - base.top;
      const dx = Math.max(30, Math.abs(x2 - x1) / 2) * (toLeft ? 1 : -1);
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('class', `mm-line${obj.classList.contains('gc') ? ' gc' : ''}`);
      p.setAttribute('d', `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`);
      p.setAttribute('marker-end', 'url(#mm-arr)');
      svg.appendChild(p);
    });
  }

  function render() {
    const s = sc();
    const st = S.i >= 0 ? s.steps[S.i] : { stack: [], heap: [] };
    root.querySelector('#mm-code').innerHTML = OOPLab.java.lines(s.code, S.i >= 0 ? [st.line] : []);
    root.querySelector('#mm-mem').innerHTML = memoryHTML(st);
    root.querySelector('#mm-note').innerHTML = S.i < 0 ? `<b>${s.title}</b> · ${s.src}. ${s.lead} <b>İleri</b> ile başla.` : st.note || '&nbsp;';
    root.querySelector('#mm-count').textContent = `${S.i + 1} / ${s.steps.length}`;
    root.querySelector('#mm-prev').disabled = S.i < 0;
    root.querySelector('#mm-next').disabled = S.i >= s.steps.length - 1;
    const outs = s.steps.slice(0, S.i + 1).filter((x) => x.out != null).map((x) => x.out);
    root.querySelector('#mm-out').innerHTML = outs.map((o) => (o.startsWith('!!') ? `<span class="err">${esc(o.slice(2))}</span>` : esc(o))).join('\n') || '<span class="muted">(henüz çıktı yok)</span>';
    root.querySelector('#mm-log').innerHTML = s.steps.slice(0, S.i + 1).map((x, k) => `<li class="${k === S.i ? 'cur' : ''}"><span class="mm-ln">satır ${x.line}</span>${x.note || '<i>çıktı</i>'}</li>`).reverse().join('');
    const status = S.i < 0 ? 'ready' : st.status || (S.timer ? 'running' : 'paused');
    OOPLab.app.setStatus(status);
    const line = root.querySelector('#mm-code .jl.on');
    if (line) line.scrollIntoView({ block: 'nearest' });
    requestAnimationFrame(drawArrows);
  }

  function stop() {
    clearInterval(S.timer);
    S.timer = 0;
    const b = root && root.querySelector('#mm-play');
    if (b) b.textContent = '⏵ Otomatik';
  }

  function go(i) {
    S.i = Math.max(-1, Math.min(i, sc().steps.length - 1));
    render();
  }

  function select(id) {
    if (!SCENARIOS[id]) return;
    stop();
    S.id = id;
    S.i = -1;
    root.querySelectorAll('[data-sc]').forEach((b) => b.classList.toggle('active', b.dataset.sc === id));
    render();
  }

  /* ------------------------------------------------------------ şablon */

  function template() {
    return `
      <p class="module-lead">Bir senaryo seç ve kodu adım adım yürüt. Stack'teki değişkenleri, heap'teki nesneleri ve aralarındaki <b>referans oklarını</b> izle. Sınavdaki "bu kod ne yazdırır?" sorularının çoğu bu resmi kafanda çizebilmene dayanır.</p>
      <div class="lab-tabs mm-tabs">${Object.entries(SCENARIOS).map(([id, s], k) => `<button class="lab-tab${id === S.id ? ' active' : ''}" type="button" data-sc="${id}"><span class="lab-num">${k + 1}</span>${s.title}<small>${s.src}</small></button>`).join('')}</div>
      <div class="mm-grid">
        <article class="card">
          <header class="card-head"><h2>Kod</h2><span class="tag">Java</span></header>
          <pre class="jt-code mm-code" id="mm-code"></pre>
          <div class="dg-ctrl">
            <button class="btn btn-sm" id="mm-prev" type="button">◀ Geri</button>
            <span class="dg-count" id="mm-count"></span>
            <button class="btn btn-sm btn-primary" id="mm-next" type="button">İleri ▶</button>
            <button class="btn btn-sm btn-ghost" id="mm-play" type="button">⏵ Otomatik</button>
            <button class="btn btn-sm btn-ghost" id="mm-reset" type="button" title="Başa al">↺</button>
          </div>
          <div class="dg-caption" id="mm-note"></div>
          <div class="jt-console"><span class="jt-console-h">Konsol çıktısı</span><pre id="mm-out"></pre></div>
        </article>
        <article class="card">
          <header class="card-head"><h2>Bellek</h2><span class="tag">JVM · stack &amp; heap</span></header>
          <div class="mm-mem" id="mm-mem"></div>
          <div class="mm-legend"><span><i class="mm-v prim">5</i> ilkel değer</span><span><i class="mm-v ref">●</i> referans (ok)</span><span><i class="mm-v null">null</i> nesne yok</span><span><i class="mm-gcbox"></i> çöp: GC toplayabilir</span></div>
        </article>
        <article class="card span-2">
          <header class="card-head"><h2>Olay günlüğü</h2><span class="tag">en yeni üstte</span></header>
          <ol class="mm-log" id="mm-log"></ol>
        </article>
      </div>`;
  }

  function onClick(e) {
    const t = e.target;
    const scb = t.closest('[data-sc]');
    if (scb) { select(scb.dataset.sc); return; }
    if (t.closest('#mm-next')) { stop(); go(S.i + 1); }
    else if (t.closest('#mm-prev')) { stop(); go(S.i - 1); }
    else if (t.closest('#mm-reset')) { stop(); go(-1); }
    else if (t.closest('#mm-play')) {
      if (S.timer) { stop(); render(); return; }
      if (S.i >= sc().steps.length - 1) S.i = -1;
      t.closest('#mm-play').textContent = '⏸ Durdur';
      S.timer = setInterval(() => {
        if (!root || S.i >= sc().steps.length - 1) { stop(); if (root) render(); return; }
        go(S.i + 1);
      }, S.speed);
      go(S.i + 1);
    }
  }

  function mount(container, params) {
    root = container;
    root.innerHTML = template();
    root.addEventListener('click', onClick);
    onResize = () => requestAnimationFrame(drawArrows);
    window.addEventListener('resize', onResize);
    // #/memory/<senaryo>/<adım>: belirli bir adıma doğrudan bağlantı
    if (params && params[0] && SCENARIOS[params[0]]) S.id = params[0];
    select(S.id);
    if (params && params[1]) go(parseInt(params[1], 10) - 1);
  }

  function unmount() {
    stop();
    if (root) root.removeEventListener('click', onClick);
    window.removeEventListener('resize', onResize);
    root = null;
  }

  function loadPreset(p) {
    if (root && p.scenario) select(p.scenario);
  }

  OOPLab.modules = OOPLab.modules || {};
  OOPLab.modules.memory = { num: 'L1', title: 'Stack & Heap', subtitle: 'Referanslar, null, aliasing, çöp toplama', mount, unmount, loadPreset };
})(window.OOPLab = window.OOPLab || {});
