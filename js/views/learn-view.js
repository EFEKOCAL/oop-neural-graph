/*
 * learn-view.js — "Ders Notları" modülü: teori önce, laboratuvar sonra.
 *
 * Rotalar:
 *   #/learn                 başlangıç ekranı (ilerleme çubuğu ve büyük başla düğmesi)
 *   #/learn/plan            genel bakış (çalışma yöntemi, bölümler, dönem planı)
 *   #/learn/ch2             bölüm özeti
 *   #/learn/ch2/baglayici[/3|/son]   ders: dikey kart akışı (kart numarası isteğe bağlı)
 *   #/learn/sorular[/h5]    hocanın soruları (aralıklı tekrar)
 *
 * İlerleme tarayıcının localStorage'ında tutulur; erişilemezse sayfa yine çalışır.
 */
(function (OOPLab) {
  'use strict';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => new Date().toISOString().slice(0, 10);

  /* ------------------------------------------------------------ ilerleme kaydı */

  const Store = {
    key: 'OOPLab.learn.v1',
    data: { read: {}, seen: {}, q: {}, checks: {}, drafts: {} },
    load() {
      try {
        const raw = JSON.parse(localStorage.getItem(this.key));
        if (raw) Object.assign(this.data, raw);
      } catch (e) { /* gizli pencere vb.: ilerleme kaydedilmez */ }
    },
    save() {
      try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) { /* yok say */ }
    },
    // Okunan dersler, kart konumları, soru kutuları, alıştırmalar, taslaklar ve sınav sayacı silinir
    reset() {
      this.data = { read: {}, seen: {}, q: {}, checks: {}, drafts: {} };
      try {
        localStorage.removeItem(this.key);
        localStorage.removeItem('ooplab.timer.v1');
      } catch (e) { /* yok say */ }
    }
  };
  Store.load();

  // Kutu: 0 yeni, 1 tekrar et, 2 gelişiyor, 3 öğrenildi
  const BOX = [
    { id: 0, label: 'Yeni', cls: 'b0' },
    { id: 1, label: 'Tekrar et', cls: 'b1' },
    { id: 2, label: 'Gelişiyor', cls: 'b2' },
    { id: 3, label: 'Öğrenildi', cls: 'b3' }
  ];
  const qState = (id) => Store.data.q[id] || { box: 0 };

  /* ------------------------------------------------------------ veri yardımcıları */

  const chapters = () => OOPLab.lessons.chapters;
  const findChapter = (id) => chapters().find((c) => c.id === id);
  const lessonKey = (ch, l) => `${ch.id}/${l.id}`;
  const isRead = (ch, l) => !!Store.data.read[lessonKey(ch, l)];
  const allLessons = () => chapters().flatMap((ch) => ch.lessons.map((l, i) => ({ ch, l, i })));
  const questions = () => OOPLab.teacherQuestions || [];
  const questionsFor = (key) => questions().filter((q) => q.lesson === key || q.lesson.startsWith(key + '/'));

  function chapterProgress(ch) {
    const read = ch.lessons.filter((l) => isRead(ch, l)).length;
    return { read, total: ch.lessons.length, pct: Math.round((read / ch.lessons.length) * 100) };
  }

  function nextLesson() {
    return allLessons().find(({ ch, l }) => !isRead(ch, l)) || null;
  }

  const lessonHref = (ch, l) => `#/learn/${ch.id}/${l.id}`;
  const lessonSource = (l) => l.src || `slayt ${l.slides}`;

  /* ------------------------------------------------------------ bölüm sonu tekrarı */

  // Her bölümün sonunda bir tekrar "dersi" vardır: önce o bölümün soruları, sonra önceki bölümlerden
  // karışık sorular. İlerleme çubuğuna ve genel yüzdeye girmez.
  const reviewCache = new Map();
  function reviewOf(ch) {
    if (!reviewCache.has(ch)) reviewCache.set(ch, { id: 'tekrar', review: true, ch, title: `Bölüm ${ch.num} tekrarı`, en: `Chapter ${ch.num} review`, checks: [] });
    return reviewCache.get(ch);
  }

  // Her bölüm, hocanın PDF'indeki konu listesini gösteren bir giriş sayfasıyla başlar
  const introCache = new Map();
  function introOf(ch) {
    if (!introCache.has(ch)) introCache.set(ch, { id: 'konular', intro: true, ch, title: `Bölüm ${ch.num}: ${ch.title}`, en: ch.en, checks: [] });
    return introCache.get(ch);
  }
  const hasIntro = (ch) => !!(OOPLab.chapterOutlines && OOPLab.chapterOutlines[ch.id]);

  // Bir sonraki / önceki sayfa: bölüm girişi → dersler → bölüm tekrarı → sonraki bölümün girişi
  function nextOf(ch, l) {
    const ci = chapters().indexOf(ch);
    if (l.review) {
      const nc = chapters()[ci + 1];
      return nc ? { ch: nc, l: hasIntro(nc) ? introOf(nc) : nc.lessons[0] } : null;
    }
    if (l.intro) return { ch, l: ch.lessons[0] };
    const i = ch.lessons.indexOf(l);
    return i < ch.lessons.length - 1 ? { ch, l: ch.lessons[i + 1] } : { ch, l: reviewOf(ch) };
  }
  function prevOf(ch, l) {
    if (l.review) return { ch, l: ch.lessons[ch.lessons.length - 1] };
    const i = ch.lessons.indexOf(l);
    if (i > 0) return { ch, l: ch.lessons[i - 1] };
    if (i === 0 && hasIntro(ch)) return { ch, l: introOf(ch) };
    const pc = chapters()[chapters().indexOf(ch) - 1];
    return pc ? { ch: pc, l: reviewOf(pc) } : null;
  }

  // teacher: sınav tipi soru (bu site için yazıldı) · slide: sorunun kendisi hocanın slaytında var
  const SOURCE = { teacher: 'Sınav tipi', slide: 'Slayttan', web: 'İnternetten', lesson: 'Ders sorusu' };
  const qKind = (q) => (q.src === 'slide' ? 'slide' : 'teacher');

  function reviewPool(ch) {
    const pool = [];
    questions().filter((q) => q.lesson.split('/')[0] === ch.id)
      .forEach((q) => pool.push({ id: `tq:${q.id}`, kind: qKind(q), ch, q: q.q, a: q.a, tq: q.id, check: { q: q.q, a: q.a, code: q.code } }));
    (OOPLab.webQuestions || []).filter((w) => w.ch === ch.id)
      .forEach((w) => pool.push({ id: `web:${w.id}`, kind: 'web', ch, q: w.q, a: w.a, from: w.from, url: w.url }));
    ch.lessons.forEach((l) => (l.checks || [])
      .forEach((c, n) => pool.push({ id: `${lessonKey(ch, l)}#${n}`, kind: 'lesson', ch, l, q: c.q, a: c.a, check: c })));
    return pool;
  }

  /* ------------------------------------------------------------ soru gövdeleri */

  // Üç soru türü: reveal (cevabı göster + Bildim/Bilemedim), mc (çoktan seçmeli), fill (kodda boşluk doldur).
  // mc ve fill otomatik puanlanır; sonuç Store.data.checks[id] = 'ok' | 'bad' olarak kaydedilir.
  const javaLines = (code) => `<pre class="l-code jcode">${OOPLab.java.highlight(String(code).replace(/^\n+|\s+$/g, ''))}</pre>`;
  const normAns = (s) => String(s).replace(/\s+/g, '').replace(/;$/, '');

  // Kavram boşluklarında Türkçe–İngilizce karşılıklar: gruptaki bir terim kabul ediliyorsa hepsi kabul edilir
  const SYN = [
    ['değişmez', 'değiştirilemez', 'immutable'],
    ['dinamik bağlama', 'dynamic binding', 'geç bağlama', 'late binding', 'dinamik bağlanma'],
    ['marker', 'işaretleyici', 'marker interface', 'işaretleyici arayüz', 'işaretçi', 'etiket'],
    ['wrapper', 'sarmalayıcı', 'wrapper class', 'sarmalayıcı sınıf', 'zarf'],
    ['kapsülleme', 'encapsulation', 'sarmalama'],
    ['kalıtım', 'inheritance', 'miras', 'kalıtım (inheritance)'],
    ['polimorfizm', 'polymorphism', 'çok biçimlilik', 'çokbiçimlilik'],
    ['override', 'overriding', 'geçersiz kılma', 'ezme', 'üzerine yazma'],
    ['overload', 'overloading', 'aşırı yükleme'],
    ['soyut', 'abstract'],
    ['arayüz', 'interface', 'arayüzler', 'interfaces'],
    ['casting', 'cast', 'tip dönüşümü', 'tür dönüşümü', 'dönüştürme', 'type casting'],
    ['yapıcı', 'constructor', 'kurucu', 'yapıcı metot'],
    ['derleme', 'compile', 'compile-time', 'derleme zamanı', 'derleme zamanı (compile-time)'],
    ['çalışma', 'runtime', 'çalışma zamanı', 'run-time'],
    ['kontrollü', 'checked', 'denetlenen'],
    ['kontrolsüz', 'unchecked', 'denetlenmeyen'],
    ['çöp toplama', 'garbage collection', 'çöp toplayıcı', 'garbage collector', 'gc'],
    ['örnek', 'örneği', 'instance'],
    ['boolean', 'mantıksal', 'true/false'],
    ['geçersiz kılınamaz', 'override edilemez', 'ezilemez'],
    ['public', 'genel'],
    ['private', 'özel'],
    ['protected', 'korumalı']
  ].map((g) => g.map((t) => normAns(t).toLocaleLowerCase('tr')));
  const synExpand = (acc) => {
    const out = new Set(acc.map((a) => normAns(a).toLocaleLowerCase('tr')));
    SYN.forEach((g) => { if (g.some((t) => out.has(t))) g.forEach((t) => out.add(t)); });
    return out;
  };
  // İskelet bloklarında esnek karşılaştırma: boşluk, @Override ve sondaki ; önemsiz
  const normCode = (s) => String(s).replace(/@Override/g, '').replace(/[“”]/g, '"').replace(/\s+/g, '').replace(/;+$/, '');

  // Renklendirici sayıları ayrı işaretlediği için ⟦n⟧ boşlukları önce ayrılır, kod parçaları ayrı renklendirilir
  const hlBlanks = (src) => String(src).replace(/^\n+|\s+$/g, '').split(/⟦(\d+)⟧/)
    .map((p, i) => (i % 2 === 0 ? OOPLab.java.highlight(p) : `⟦${p}⟧`)).join('');

  function checkInner(c, id, st) {
    const q = c.q;
    if (c.type === 'mc') {
      return `<div class="fx-check${st ? ' ' + st : ''}" data-check="${id}">
        <p class="fx-check-q">${q}</p>${c.code ? javaLines(c.code) : ''}
        <div class="mc-opts">${c.options.map((o, j) => `<button class="mc-opt" type="button" data-act="opt" data-j="${j}"><span class="mc-l">${'ABCDEF'[j]}</span><span>${o}</span></button>`).join('')}</div>
        <div class="l-check-a" hidden><p class="mc-verdict"></p><p>${c.a || ''}</p><div class="btn-row"><button class="btn btn-sm btn-ghost" type="button" data-act="retry">↺ Tekrar dene</button></div></div>
      </div>`;
    }
    if (c.type === 'fill') {
      const blank = (_, d) => {
        const w = c.prose ? 12 : Math.max(5, ...c.answers[Number(d)].map((x) => x.length)) + 1;
        return `<input class="fill-in" data-b="${d}" size="${w}" spellcheck="false" autocomplete="off" aria-label="Boşluk ${Number(d) + 1}">`;
      };
      // prose: kavram cümlesi (hocanın klasik boşluk doldurması); değilse kod
      const body = c.prose
        ? `<p class="fill-prose">${String(c.text).replace(/⟦(\d+)⟧/g, blank)}</p>`
        : `<pre class="l-code jcode">${hlBlanks(c.code).replace(/⟦(\d+)⟧/g, blank)}</pre>`;
      return `<div class="fx-check${st ? ' ' + st : ''}" data-check="${id}">
        <p class="fx-check-q"><span class="fill-tag">${c.prose ? 'Kavram boşluğu' : 'Boşluk doldur'}</span> ${q}</p>
        ${body}
        <div class="btn-row"><button class="btn btn-primary btn-sm" type="button" data-act="fill">Kontrol et</button><button class="btn btn-sm btn-ghost" type="button" data-act="fillshow">Cevabı göster</button></div>
        <div class="l-check-a" hidden><p class="mc-verdict"></p><p>${c.a || ''}</p></div>
      </div>`;
    }
    if (c.type === 'bug') {
      // Hata avcısı: satırlara tıklayarak hatalı satırları seç, sonra kontrol et
      const lines = String(c.code).replace(/^\n+|\s+$/g, '').split('\n');
      return `<div class="fx-check bug${st ? ' ' + st : ''}" data-check="${id}">
        <p class="fx-check-q"><span class="fill-tag bug-tag">Hatayı bul</span> ${q}</p>
        <p class="bug-hint">Hatalı olduğunu düşündüğün satırlara tıkla (birden çok olabilir), sonra <b>Kontrol et</b>.</p>
        <div class="bug-code">${lines.map((ln, i) => `<button type="button" class="bug-ln" data-act="bugline" data-n="${i + 1}"><span class="bug-no">${i + 1}</span><code>${OOPLab.java.highlight(ln) || ' '}</code></button>`).join('')}</div>
        <div class="btn-row"><button class="btn btn-primary btn-sm" type="button" data-act="bugcheck">Kontrol et</button><button class="btn btn-sm btn-ghost" type="button" data-act="bugshow">Hataları göster</button></div>
        <div class="l-check-a" hidden>
          <p class="mc-verdict"></p>
          <ul class="bug-list">${c.explain.map((e) => `<li><b>Satır ${e.line}</b> <span class="bug-kind ${e.kind === 'Derleme' ? 'ce' : e.kind === 'Not' ? 'nt' : 're'}">${e.kind === 'Not' ? 'not' : `${e.kind} hatası`}</span> ${e.text}</li>`).join('')}</ul>
          ${c.fixed ? `<p class="wr-given">Düzeltilmiş kod:</p>${javaLines(c.fixed)}` : ''}
          ${c.output ? `<p class="wr-given">Düzeltilmiş kodun çıktısı:</p><pre class="l-code wr-out">${esc(c.output)}</pre>` : ''}
          ${c.a ? `<p>${c.a}</p>` : ''}
        </div>
      </div>`;
    }
    if (c.type === 'skeleton') {
      // Hocanın [B1]…[Bn] iskeleti: her blok ayrı yazılır, model cevapla karşılaştırılır
      const code = hlBlanks(c.code).replace(/⟦(\d+)⟧/g, (_, d) => {
        const b = c.blanks[Number(d)];
        const rows = Math.max(1, b.model.split('\n').length);
        return `<span class="sk-blk" data-b="${d}"><span class="sk-lbl">[B${Number(d) + 1}]</span><textarea class="sk-in" rows="${rows}" spellcheck="false" autocomplete="off" aria-label="Blok B${Number(d) + 1}" placeholder="${esc(b.hint || '')}">${esc(Store.data.drafts[`${id}@${d}`] || '')}</textarea><span class="sk-model" hidden></span></span>`;
      });
      return `<div class="fx-check sk${st ? ' ' + st : ''}" data-check="${id}">
        <p class="fx-check-q"><span class="fill-tag sk-tag">İskeleti tamamla</span> ${q}</p>
        ${c.req ? `<div class="sk-req"><b>İstenilenler:</b><ul>${c.req.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : ''}
        <pre class="l-code jcode sk-code">${code}</pre>
        <div class="btn-row"><button class="btn btn-primary btn-sm" type="button" data-act="skcheck">Kontrol et</button><button class="btn btn-sm btn-ghost" type="button" data-act="skshow">Model cevapları göster</button></div>
        <div class="l-check-a" hidden>
          <p class="mc-verdict"></p>
          ${c.output ? `<p class="wr-given">Tamamlanmış programın çıktısı:</p><pre class="l-code wr-out">${esc(c.output)}</pre>` : ''}
          ${c.a ? `<p>${c.a}</p>` : ''}
        </div>
      </div>`;
    }
    if (c.type === 'write') {
      // Arka sayfa problemi: önce kendin yaz, sonra model çözüm + puanlama listesiyle karşılaştır
      return `<div class="fx-check wr${st ? ' ' + st : ''}" data-check="${id}">
        <p class="fx-check-q"><span class="fill-tag wr-tag">Kodu yaz</span> ${q}</p>
        ${c.given ? `<p class="wr-given">Verilen:</p>${javaLines(c.given)}` : ''}
        <textarea class="wr-draft" rows="${c.solution ? 9 : 5}" spellcheck="false" placeholder="${c.solution ? 'Kodunu kâğıda yazar gibi buraya yaz… (kaydedilir)' : 'Çıktıyı satır satır buraya yaz… (kaydedilir)'}">${esc(Store.data.drafts[id] || '')}</textarea>
        <button class="btn btn-primary btn-sm" type="button" data-act="reveal">${c.solution ? 'Model çözümü göster' : 'Doğru çıktıyı göster'}</button>
        <div class="l-check-a" hidden>
          ${c.rubric ? `<div class="wr-rubric"><b>Hoca neye bakar? Kendi kodunda işaretle:</b><ul>${c.rubric.map((r) => `<li><label><input type="checkbox"> ${r}</label></li>`).join('')}</ul></div>` : ''}
          ${c.solution ? javaLines(c.solution) : ''}
          ${c.output ? `<p class="wr-given">${c.solution ? 'Çıktı' : 'Doğru çıktı'}:</p><pre class="l-code wr-out">${esc(c.output)}</pre>` : ''}
          ${c.a ? `<p>${c.a}</p>` : ''}
          <div class="btn-row"><button class="btn btn-sm l-ok" type="button" data-act="ok">✓ Doğru yazdım</button><button class="btn btn-sm l-bad" type="button" data-act="bad">✗ Eksik / yanlış</button></div>
        </div>
      </div>`;
    }
    return `<div class="fx-check${st ? ' ' + st : ''}" data-check="${id}">
      <p class="fx-check-q">${q}</p>${c.code ? javaLines(c.code) : ''}
      <button class="btn" type="button" data-act="reveal">Cevabı göster</button>
      <div class="l-check-a" hidden><div class="rq-answer">${c.a}</div><div class="btn-row"><button class="btn btn-sm l-ok" type="button" data-act="ok">✓ Bildim</button><button class="btn btn-sm l-bad" type="button" data-act="bad">✗ Bilemedim</button></div></div>
    </div>`;
  }

  function findCheck(id) {
    const [key, n] = id.split('#');
    const [chId, lId] = key.split('/');
    const ch = findChapter(chId);
    const l = ch && ch.lessons.find((x) => x.id === lId);
    return l && l.checks ? l.checks[Number(n)] : null;
  }

  // Aynı gün aynı sırayı veren basit tohumlu karıştırma (kart adresleri gün içinde değişmesin)
  function seeded(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return () => {
      h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }
  const shuffle = (xs, rnd) => {
    const a = xs.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  // Önce bilemediklerin, sonra hiç cevaplamadıkların, en son bildiklerin seçilir
  const rank = (x) => ({ bad: 0, ok: 2 })[Store.data.checks[x.id]] ?? 1;
  const pick = (xs, n, rnd) => shuffle(xs, rnd).sort((a, b) => rank(a) - rank(b)).slice(0, n);

  function buildReview(rv) {
    const ch = rv.ch;
    const rnd = seeded(`${ch.id}|${today()}`);
    const pool = reviewPool(ch);
    const own = shuffle([
      ...pick(pool.filter((x) => x.kind === 'teacher'), 8, rnd),
      ...pool.filter((x) => x.kind === 'web'),
      ...pick(pool.filter((x) => x.kind === 'lesson'), 6, rnd)
    ], rnd);
    const before = chapters().slice(0, chapters().indexOf(ch));
    const prev = shuffle(pick(before.flatMap((c) => pick(reviewPool(c), 4, rnd)), 12, rnd), rnd);
    const cards = [{ kind: 'open', own: own.length, prev: prev.length, before }];
    own.forEach((item) => cards.push({ kind: 'rq', item }));
    if (prev.length) cards.push({ kind: 'rqsep', before, n: prev.length });
    prev.forEach((item) => cards.push({ kind: 'rq', item }));
    cards.push({ kind: 'end' });
    cards.filter((c) => c.kind === 'rq').forEach((c, i, all) => { c.n = i + 1; c.total = all.length; });
    return cards;
  }

  function sourceBadge(item) {
    if (item.kind === 'web') return `<a class="src-badge src-web" href="${item.url}" target="_blank" rel="noopener" title="Soru kaynağı">${SOURCE.web} · ${esc(item.from)} ↗</a>`;
    return `<span class="src-badge src-${item.kind}">${SOURCE[item.kind]}</span>`;
  }

  /* ------------------------------------------------------------ blok çizimi */

  const NOTE = {
    exam: 'Sınav notu',
    extra: 'Ek bilgi (slaytta yok)',
    warn: 'Dikkat: slaytta hata / belirsizlik',
    why: 'Neden böyle? (mantığı)',
    key: 'Aklında kalsın',
    trap: '⚠ Sınav tuzağı'
  };

  function renderBlock(bl) {
    switch (bl.t) {
      case 'p': return `<p>${bl.html}</p>`;
      case 'h': return `<h3 class="l-h">${bl.text}</h3>`;
      case 'def': return `<div class="l-def"><div class="l-def-term">${bl.term}${bl.en ? ` <span>${bl.en}</span>` : ''}</div><div class="l-def-body">${bl.html}</div></div>`;
      case 'list': {
        const tag = bl.ordered ? 'ol' : 'ul';
        return `<${tag} class="l-list"${bl.start > 1 ? ` start="${bl.start}"` : ''}>${bl.items.map((x) => `<li>${x}</li>`).join('')}</${tag}>`;
      }
      case 'compare': return `<div class="l-compare">${bl.cols.map((c) => `<div class="l-cmp"><b>${c.title}</b><ul>${c.items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`;
      case 'table': return `<div class="table-wrap l-table"><table><thead><tr>${bl.head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${bl.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      case 'code': return bl.lang === 'java' ? javaLines(bl.text) : `<pre class="l-code">${esc(bl.text)}</pre>`;
      case 'note': return `<div class="l-note ${bl.kind}"><span class="l-note-label">${NOTE[bl.kind] || 'Not'}</span><div>${bl.html}</div></div>`;
      case 'dg': return OOPLab.diagrams.render(bl.id);
      case 'solve': return `<div class="l-solve"><span class="tag">${bl.title}</span><p class="l-solve-q">${bl.q}</p><button class="btn btn-primary btn-sm" type="button" data-act="solve">Çözümü göster</button><div class="l-solve-a" hidden>${bl.dg ? OOPLab.diagrams.render(bl.dg) : ''}<p>${bl.a}</p></div></div>`;
      default: return '';
    }
  }

  const progressBar = (pct, cls) => `<div class="l-bar ${cls || ''}"><i style="width:${pct}%"></i></div>`;

  /* ------------------------------------------------------------ genel bakış */

  function pageOverview() {
    const qs = questions();
    const learned = qs.filter((q) => qState(q.id).box === 3).length;
    const total = allLessons().length;
    const readAll = allLessons().filter(({ ch, l }) => isRead(ch, l)).length;

    const method = [
      ['1', 'Oku', 'Tek ekranlık kartlar, slayt numaraları', 'Konuyu PDF sırasıyla, küçük parçalar halinde öğren. Her ders "okumadan önce düşün" sorusuyla açılır: bilmesen bile tahmin etmek, sonraki okumayı daha akılda kalıcı yapar (pretesting).'],
      ['2', 'Gör', 'Etkileşimli şekiller', 'Her kavramın yanında tıklanabilir veya adım adım ilerleyen bir şekil var. Sözel ve görsel bilginin birlikte kodlanması (dual coding) hatırlamayı güçlendirir.'],
      ['3', 'Hatırla', 'Kendini yokla', 'Ders sonundaki soruları cevaba bakmadan zihninde cevapla, sonra kontrol et. Bilgiyi geri çağırmak, tekrar okumaktan çok daha kalıcı öğrenme sağlar (testing effect).'],
      ['4', 'Dene', 'Laboratuvara geç', 'Teoriyi öğrendikten sonra ilgili laboratuvarda kavramı canlı çalıştır: stack ve heap, referanslar, yapıcı zinciri, dinamik bağlama, istisnanın yayılımı…'],
      ['5', 'Tekrar et', 'Sınav soruları', 'Önce kendi cevabını yaz, sonra model cevaptaki anahtar noktalarla karşılaştır. Bilemediğin sorular daha sık gelir; "Öğrenildi" sayılması için farklı günlerde iki kez bilmen gerekir (aralıklı tekrar, spacing effect).']
    ];

    const plan = [
      ['1', 'Dersin Tanıtımı', null, null],
      ['2', 'Java Programlamaya Giriş', 'ch0', null],
      ['3', 'Nesneye Dayalı Programlamaya Giriş', 'ch1', null],
      ['4', 'Sınıf ve Nesne Kavramları', 'ch1', 'memory'],
      ['5–6', 'Kalıtım ve Çok Biçimlilik', 'ch2', 'dispatch'],
      ['7', 'İstisna Yönetimi ve Metin I/O', 'ch3', 'exceptions'],
      ['8', 'Ara Sınav', 'ch5', null],
      ['9', 'Soyut Sınıflar ve Arayüzler (vizede soruluyor)', 'ch4', null],
      ['10', 'Olaya Dayalı Programlama', null, null],
      ['11', 'Kullanıcı Arayüzleri Oluşturma', null, null],
      ['12', 'Özyineli (Recursive) Fonksiyonlar', null, null],
      ['13', 'Generic Sınıflar', null, null],
      ['14', 'Tasarım Şablonlarına Giriş', null, null],
      ['15', 'Konu Tekrarı', null, null]
    ];

    return `
      <section class="card l-chhead">
        <span class="tag">BLM2005 · Nesne Yönelimli Programlama · Liang, Introduction to Java Programming</span>
        <h2>Genel bakış</h2>
        <div class="qx-stats l-ov-stats">
          <div class="mini-stat"><span>Okunan ders</span><b>${readAll} / ${total}</b></div>
          <div class="mini-stat"><span>Öğrenilen soru</span><b>${learned} / ${qs.length}</b></div>
        </div>
        <div class="btn-row"><a class="btn btn-primary" href="#/learn">▶ Derse dön</a><a class="btn" href="#/learn/sorular">Sınav soruları</a><button class="btn btn-danger" type="button" data-act="reset">↺ İlerlemeyi sıfırla</button></div>
      </section>

      <h3 class="l-section">Nasıl çalışmalı? 5 adımlı döngü</h3>
      <div class="l-method">${method.map(([n, t, s, d]) => `<div class="l-step"><span class="l-step-n">${n}</span><b>${t}</b><small>${s}</small><p>${d}</p></div>`).join('')}</div>

      <h3 class="l-section">Bölümler</h3>
      <div class="l-chapters">${chapters().map((ch) => {
        const p = chapterProgress(ch);
        const qn = questionsFor(ch.id).length;
        return `<a class="card l-chcard" href="#/learn/${ch.id}">
          <span class="l-chnum">Bölüm ${ch.num}</span>
          <b>${ch.title}</b><small>${ch.en} · ${ch.source}</small>
          ${progressBar(p.pct)}
          <span class="l-chmeta">${p.read}/${p.total} ders${qn ? ` · ${qn} sınav sorusu` : ''}</span>
        </a>`;
      }).join('')}</div>

      <h3 class="l-section">Değerlendirme ve devam</h3>
      <div class="card"><div class="table-wrap"><table class="l-plan"><tbody>
        <tr><td>Ara sınav (vize)</td><td class="num">%25</td></tr>
        <tr><td>Lab quizleri (3 adet)</td><td class="num">%15</td></tr>
        <tr><td>Lab projesi</td><td class="num">%10</td></tr>
        <tr><td>Final</td><td class="num">%50</td></tr>
        <tr><td>Devam zorunluluğu</td><td>Ders %70, laboratuvar %80 (Slide01 s.4)</td></tr>
      </tbody></table></div></div>

      <h3 class="l-section">Dönem planı</h3>
      <div class="card"><div class="table-wrap"><table class="l-plan"><thead><tr><th>Hafta</th><th>Konu</th><th>Bu sitede</th></tr></thead><tbody>
        ${plan.map(([w, t, ch, lab]) => `<tr><td class="num">${w}</td><td>${t}</td><td>${ch ? `<a class="pill ok" href="#/learn/${ch}">Ders notu ✓</a>` : ''}${lab ? `<a class="pill lab" href="#/${lab}">Laboratuvar</a>` : ''}${!ch && !lab ? '<span class="muted">PDF gelince eklenecek</span>' : ''}</td></tr>`).join('')}
      </tbody></table></div>
      <p class="hint">Ders planı Slide01 s.2'den. Bölüm 4 (soyut sınıflar ve arayüzler) planda 9. haftada görünse de 2022, 2024 ve 2025 vizelerinin üçünde de soruldu; vize konusu olarak çalış. 10–15. haftaların PDF'leri gelince eklenecek.</p></div>`;
  }

  function pageChapter(ch) {
    const p = chapterProgress(ch);
    const firstUnread = ch.lessons.find((l) => !isRead(ch, l)) || ch.lessons[0];
    const qn = questionsFor(ch.id);
    return `
      <nav class="l-crumbs"><a href="#/learn/plan">Genel bakış</a> › Bölüm ${ch.num}</nav>
      <section class="card l-chhead">
        <span class="tag">Bölüm ${ch.num} · ${ch.source}</span>
        <h2>${ch.title} <span class="muted">${ch.en}</span></h2>
        ${progressBar(p.pct)}
        <p class="muted">${p.read}/${p.total} ders tamamlandı · yaklaşık ${ch.lessons.reduce((s, l) => s + l.minutes, 0)} dakika</p>
        <h4>Bu bölümün sonunda şunları yapabilmelisin</h4>
        <ul class="l-list">${ch.objectives.map((o) => `<li>${o}</li>`).join('')}</ul>
        <div class="btn-row"><a class="btn btn-primary" href="${lessonHref(ch, firstUnread)}">▶ ${p.read ? 'Devam et' : 'Başla'}: ${firstUnread.title}</a>
        ${hasIntro(ch) ? `<a class="btn" href="#/learn/${ch.id}/konular">Konular ve kavramlar</a>` : ''}
        <a class="btn" href="#/learn/${ch.id}/tekrar">Bölüm ${ch.num} tekrarı</a>
        ${qn.length ? `<a class="btn" href="#/learn/sorular">Bu bölümden ${qn.length} sınav sorusu</a>` : ''}</div>
      </section>
      <ol class="l-lessonlist">${ch.lessons.map((l, i) => `
        <li><a class="card l-lessonrow${isRead(ch, l) ? ' read' : ''}" href="${lessonHref(ch, l)}">
          <span class="l-ln">${isRead(ch, l) ? '✓' : i + 1}</span>
          <span><b>${l.title}</b><small>${l.en} · ${lessonSource(l)} · ~${l.minutes} dk${questionsFor(lessonKey(ch, l)).length ? ` · ${questionsFor(lessonKey(ch, l)).length} sınav sorusu` : ''}${l.lab ? ' · laboratuvar' : ''}</small></span>
        </a></li>`).join('')}</ol>`;
  }

  /* ------------------------------------------------------------ kartlara bölme */

  // Bir kartın görsel yükü bu sınırı geçmez: birlikte akılda tutulacak bilgiler aynı ekranda kalır,
  // ama ekran kitap sayfası gibi cümleyle dolmaz. Şekil, tablo ve kod da yük sayılır.
  const CARD_BUDGET = 1150;
  const textLen = (html) => (html || '').replace(/<[^>]+>/g, '').length;
  const cardCache = new Map();

  function weight(bl) {
    switch (bl.t) {
      case 'p': return textLen(bl.html) * 1.15;
      case 'def': return textLen(bl.html) + 90;
      case 'note': return textLen(bl.html) + 40;
      case 'list': return bl.items.reduce((s, x) => s + textLen(x) + 25, 0);
      case 'compare': return bl.cols.reduce((s, c) => s + c.items.reduce((a, x) => a + textLen(x) + 20, 60), 0);
      case 'table': return (bl.rows.length + 1) * 55 + bl.rows.flat().reduce((s, x) => s + textLen(x), 0) * 0.6;
      case 'code': return bl.text.split('\n').length * 38;
      case 'dg': return 650;
      default: return 400;
    }
  }
  const WIDE = new Set(['dg', 'table', 'compare', 'code', 'solve']);

  // Ders bloklarını ekranlara böler. Başlık (h) bir konu birimidir ve yeni ekran açar; birim sığıyorsa
  // tamamı aynı ekranda kalır. Sığmazsa yalnızca blok sınırlarından bölünür: liste, tablo ve
  // karşılaştırma hiçbir zaman parçalanmaz; şekli veya listeyi tanıtan paragraf onunla birlikte kalır;
  // not, açıkladığı bloğun yanında durur. { t: 'br' } yazar tarafından konan zorunlu ekran sonudur.
  // Sınav sorularının değindiği kartları işaretler: sorunun "focus" ifadesi kartın
  // başlığında ya da metninde geçiyorsa o karta uyarı kutusu çıkar. Hiçbir kart
  // eşleşmezse soru dersin ilk içerik kartında gösterilir.
  function markTeacherCards(l, cards) {
    const ch = chapters().find((c) => c.lessons.includes(l));
    if (!ch) return;
    const qs = questionsFor(lessonKey(ch, l));
    if (!qs.length) return;
    const content = cards.filter((c) => c.blocks);
    const text = (c) => `${c.h || ''} ${JSON.stringify(c.blocks)}`.replace(/<[^>]+>/g, ' ');
    qs.forEach((q) => {
      const rx = q.focus ? new RegExp(q.focus, 'i') : null;
      let hits = q.focusH ? content.filter((c) => c.h && c.h.startsWith(q.focusH))
        : rx ? content.filter((c) => rx.test(text(c))) : [];
      if (!hits.length && content.length) hits = [content[0]];
      hits.forEach((c) => (c.tq = c.tq || []).push(q));
    });
  }

  function teacherFlag(list) {
    const shown = list.slice(0, 2);
    const more = list.length - shown.length;
    return `<aside class="tq-flag" role="note">
      <span class="tq-flag-label">★ Sınav sorularında geçiyor</span>
      <ul>${shown.map((q) => `<li><a href="#/learn/sorular/${q.id}">${esc(q.q.replace(/<[^>]+>/g, ''))}</a></li>`).join('')}</ul>
      ${more > 0 ? `<small>ve ${more} soru daha. Bu kartı dikkatle oku.</small>` : '<small>Bu kartı dikkatle oku.</small>'}
    </aside>`;
  }

  function buildCards(l) {
    if (cardCache.has(l)) return cardCache.get(l);
    if (l.review) {
      cardCache.set(l, buildReview(l));
      return cardCache.get(l);
    }
    if (l.intro) {
      cardCache.set(l, [{ kind: 'chintro' }]);
      return cardCache.get(l);
    }
    const cards = [{ kind: 'open' }];
    let sec = null;
    let unit = [];

    const kindOf = (blocks) => {
      if (blocks.some((b) => WIDE.has(b.t))) return 'wide';
      if (blocks[0].t === 'def' && blocks.every((b, i) => i === 0 || b.t === 'note')) return 'def';
      if (blocks.every((b) => b.t === 'note')) return 'note';
      return 'read';
    };
    const emit = (blocks, h) => { if (blocks.length) cards.push({ kind: kindOf(blocks), h, blocks }); };

    const closeUnit = () => {
      if (!unit.length) return;
      // Birbirinden ayrılmaması gereken blokları gruplara topla
      const groups = [];
      unit.forEach((bl, i) => {
        const prev = groups[groups.length - 1];
        const leadIn = prev && prev.length === 1 && (prev[0].t === 'p' || prev[0].keep) && unit[i - 1] === prev[0] && bl.t !== 'p' && bl.t !== 'def';
        if (prev && (bl.t === 'note' || leadIn)) prev.push(bl);
        else groups.push([bl]);
      });
      let cur = [];
      let size = 0;
      groups.forEach((g) => {
        const w = g.reduce((s, b) => s + weight(b), 0);
        if (cur.length && size + w > CARD_BUDGET) {
          emit(cur, sec);
          cur = [];
          size = 0;
        }
        cur = cur.concat(g);
        size += w;
      });
      emit(cur, sec);
      unit = [];
    };

    l.blocks.forEach((bl) => {
      if (bl.t === 'h') {
        closeUnit();
        sec = bl.text;
      } else if (bl.t === 'br') {
        closeUnit();
      } else if (bl.t === 'solve') {
        closeUnit();
        cards.push({ kind: 'wide', h: null, blocks: [bl] });
      } else {
        unit.push(bl);
      }
    });
    closeUnit();

    markTeacherCards(l, cards);
    (l.checks || []).forEach((c, i) => cards.push({ kind: 'check', check: c, n: i }));
    cards.push({ kind: 'end' });
    cardCache.set(l, cards);
    return cards;
  }

  const lastCard = (l) => buildCards(l).length - 1;
  const seenCard = (ch, l) => Math.min(Store.data.seen[lessonKey(ch, l)] || 0, lastCard(l));
  const lessonFill = (ch, l) => (isRead(ch, l) ? 100 : Math.round((seenCard(ch, l) / lastCard(l)) * 100));

  function overallPct() {
    const all = allLessons();
    return Math.round(all.reduce((s, { ch, l }) => s + lessonFill(ch, l), 0) / all.length);
  }

  /* ------------------------------------------------------------ ilerleme çubuğu */

  function renderTop(active, caption) {
    return `<header class="fx-top">
      <button class="icon-btn fx-menu" type="button" data-act="menu" aria-label="Menüyü aç">☰</button>
      <div class="fx-progress">
        <div class="fx-bar">${chapters().map((ch) => `<div class="fx-ch" style="flex-grow:${ch.lessons.length}">
          <div class="fx-segs">${ch.lessons.map((l) => `<a class="fx-seg${isRead(ch, l) ? ' read' : ''}${active === l ? ' active' : ''}" href="${lessonHref(ch, l)}" title="Bölüm ${ch.num} · ${esc(l.title)}" aria-label="Bölüm ${ch.num}: ${esc(l.title)}"><span><i style="width:${lessonFill(ch, l)}%"></i></span></a>`).join('')}</div>
          ${caption ? '' : `<div class="fx-chname"><span>${ch.title}</span><small>${chapterProgress(ch).read}/${ch.lessons.length}</small></div>`}
        </div>`).join('')}</div>
        ${caption || ''}
      </div>
      <span class="fx-pct" id="fx-pct">%${overallPct()}</span>
    </header>`;
  }

  /* ------------------------------------------------------------ başlangıç ekranı */

  function pageHome() {
    const nl = nextLesson();
    const started = allLessons().some(({ ch, l }) => isRead(ch, l) || seenCard(ch, l) > 0);
    // Bölümün ilk dersine henüz başlanmadıysa önce bölümün konular sayfası açılır
    const toIntro = nl && nl.l === nl.ch.lessons[0] && !seenCard(nl.ch, nl.l) && hasIntro(nl.ch) && !isRead(nl.ch, introOf(nl.ch));
    const action = nl
      ? `<a class="fx-start-btn" href="${toIntro ? lessonHref(nl.ch, introOf(nl.ch)) : lessonHref(nl.ch, nl.l)}">▶ ${started ? 'Devam et' : 'Başla'}</a>
         <p class="fx-start-next">Sıradaki: <b>${nl.l.title}</b></p>`
      : `<a class="fx-start-btn" href="#/learn/sorular">▶ Tekrar et</a>
         <p class="fx-start-next">Tüm dersleri bitirdin. Şimdi sınav sorularıyla tekrar et.</p>`;
    return `<div class="fx fx-home">
      ${renderTop(null)}
      <section class="fx-start">
        <span class="tag">BLM2005</span>
        <h2>Nesne Yönelimli Programlama</h2>
        ${action}
        <a class="fx-map-btn" href="#/map">◎ Nöral genel bakış</a>
        ${started || Object.keys(Store.data.q).length ? '<button class="fx-reset-btn" type="button" data-act="reset">↺ İlerlemeyi sıfırla</button>' : ''}
      </section>
    </div>`;
  }

  /* ------------------------------------------------------------ kart akışı */

  function renderCard(card, i, ctx) {
    const { ch, l, key, idx, cards, next } = ctx;
    let inner;
    if (card.kind === 'chintro') {
      const o = OOPLab.chapterOutlines[ch.id];
      const num = (id) => ch.lessons.findIndex((x) => x.id === id) + 1;
      const range = (ids) => {
        const ns = ids.map(num).filter((n) => n > 0);
        if (!ns.length) return '';
        const lo = Math.min(...ns);
        const hi = Math.max(...ns);
        return lo === hi ? `Ders ${lo}` : `Ders ${lo}–${hi}`;
      };
      inner = `<span class="tag">Bölüm ${ch.num} · ${ch.lessons.length} ders · ${ch.source}</span>
        <h2 class="fx-title">${ch.title}</h2>
        <p class="fx-sub">${ch.en}</p>
        <div class="ci-grid">
          <section><h4 class="ci-h">Bu bölümde işlenecek konular <small>(slayt ${o.slide})</small></h4>
            <ol class="ci-topics">${o.topics.map(([t, ids]) => {
              const first = ids.length && ch.lessons.find((x) => x.id === ids[0]);
              return `<li>${first ? `<a href="${lessonHref(ch, first)}">${t}</a>` : `<span>${t}</span>`}${ids.length ? `<small>${range(ids)}</small>` : ''}</li>`;
            }).join('')}</ol>
          </section>
          <section><h4 class="ci-h">Öğrenilecek kavramlar</h4>
            <div class="ci-chips">${o.concepts.map((c) => `<span>${c}</span>`).join('')}</div>
          </section>
        </div>
        <div class="btn-row ci-go"><a class="btn btn-primary fx-next" href="${lessonHref(ch, ch.lessons[0])}">Başla: ${ch.lessons[0].title} ▶</a></div>`;
    } else if (l.review && card.kind === 'open') {
      const nums = card.before.map((c) => c.num);
      const range = nums.length > 1 ? `Bölüm ${nums[0]}–${nums[nums.length - 1]}` : `Bölüm ${nums[0]}`;
      inner = `<span class="tag">Bölüm ${ch.num} · Tekrar</span>
        <h2 class="fx-title">${l.title}</h2>
        <p class="fx-sub">${card.own} soru bu bölümden${card.prev ? ` · ardından ${card.prev} soru ${range}'den karışık` : ''}</p>
        <div class="fx-pre"><span class="l-note-label">Nasıl çalışır?</span>
          <p class="rv-legend">${sourceBadge({ kind: 'teacher' })} ${sourceBadge({ kind: 'web', url: '#', from: 'kaynak' }).replace(/<a [^>]*>/, '<span class="src-badge src-web">').replace('</a>', '</span>')} ${sourceBadge({ kind: 'lesson' })}</p>
          <small>Her sorunun üstünde nereden geldiği yazar. Önce cevabı kendin düşün, sonra aç ve "Bildim / Bilemedim" de. Bilemediklerin sonraki tekrarlarda önce gelir.</small></div>`;
    } else if (card.kind === 'rqsep') {
      inner = `<span class="tag">Karışık tekrar</span>
        <h2 class="fx-title">Önceki bölümler</h2>
        <p class="fx-sub">Şimdi ${card.before.map((c) => `Bölüm ${c.num}`).join(', ')} içinden karışık ${card.n} soru geliyor.</p>`;
    } else if (card.kind === 'rq') {
      const it = card.item;
      const st = Store.data.checks[it.id];
      inner = `<div class="rq-head"><span class="tag">Bölüm ${it.ch.num} · Soru ${card.n} / ${card.total}</span>${sourceBadge(it)}</div>
        ${it.l ? `<p class="rq-lesson">${esc(it.l.title)}</p>` : ''}
        ${checkInner(it.check || { q: it.q, a: it.a }, it.id, st)}`;
    } else if (l.review && card.kind === 'end') {
      const items = cards.filter((c) => c.kind === 'rq').map((c) => c.item.id);
      const ok = items.filter((id) => Store.data.checks[id] === 'ok').length;
      const bad = items.filter((id) => Store.data.checks[id] === 'bad').length;
      inner = `<div class="fx-end">
        <span class="fx-end-mark" aria-hidden="true">✓</span>
        <h2 class="fx-title">${l.title} tamam</h2>
        <p class="fx-sub" id="rv-score">${ok} bildim · ${bad} bilemedim · ${items.length - ok - bad} işaretlenmedi</p>
        ${next
          ? `<a class="btn btn-primary fx-next" href="${lessonHref(next.ch, next.l)}">Bölüm ${next.ch.num}: ${next.l.title} ▶</a>`
          : '<a class="btn btn-primary fx-next" href="#/learn/sorular">Sınav soruları ▶</a>'}
        <div class="btn-row"><a class="btn btn-sm" href="#/learn/${ch.id}">Bölüm ${ch.num} dersleri</a></div>
      </div>`;
    } else if (card.kind === 'open') {
      const pre = l.checks && l.checks[0];
      inner = `<span class="tag">Bölüm ${ch.num} · Ders ${idx + 1} / ${ch.lessons.length}</span>
        <h2 class="fx-title">${l.title}</h2>
        <p class="fx-sub">${l.en} · ${lessonSource(l)} · ~${l.minutes} dk</p>
        ${questionsFor(key).length ? `<p class="tq-lesson">★ Bu derste <b>${questionsFor(key).length} sınav sorusu</b> var. İlgili kartlarda sarı uyarı kutusu çıkar.</p>` : ''}
        ${pre ? `<div class="fx-pre"><span class="l-note-label">Okumadan önce düşün</span><p>${pre.q}</p>${pre.prose ? `<p>${String(pre.text).replace(/⟦\d+⟧/g, '____')}</p>` : ''}${pre.code && (pre.type === 'mc' || pre.type === 'fill') ? javaLines(pre.type === 'fill' ? pre.code.replace(/⟦\d+⟧/g, '____') : pre.code) : ''}<small>Bilmiyorsan da tahmin et. Ders sonunda kontrol edeceksin.</small></div>` : ''}`;
    } else if (card.kind === 'check') {
      const c = card.check;
      const id = `${key}#${card.n}`;
      const st = Store.data.checks[id];
      inner = `<div class="rq-head"><span class="tag">Kendini yokla · ${card.n + 1} / ${l.checks.length}</span>${sourceBadge({ kind: 'lesson' })}</div>
        ${checkInner(c, id, st)}`;
    } else if (card.kind === 'end') {
      const rel = questionsFor(key);
      inner = `<div class="fx-end">
        <span class="fx-end-mark" aria-hidden="true">✓</span>
        <h2 class="fx-title">Ders tamam</h2>
        <p class="fx-sub">${l.title}</p>
        ${next
          ? `<a class="btn btn-primary fx-next" href="${lessonHref(next.ch, next.l)}">Sıradaki: ${next.l.title} ▶</a>`
          : '<a class="btn btn-primary fx-next" href="#/learn/sorular">Sınav soruları ▶</a>'}
        <div class="btn-row">
          ${l.lab ? `<button class="btn btn-sm" type="button" data-act="lab">Laboratuvarda dene</button>` : ''}
          ${rel.length ? `<a class="btn btn-sm" href="#/learn/sorular/${rel[0].id}">Bu dersten ${rel.length} sınav sorusu</a>` : ''}
          <button class="btn btn-sm btn-ghost" type="button" data-act="restart">Dersi baştan al</button>
        </div>
      </div>`;
    } else {
      inner = `${card.tq ? teacherFlag(card.tq) : ''}${card.h ? `<h3 class="fx-h">${card.h}</h3>` : ''}<div class="l-body fx-body">${card.blocks.map(renderBlock).join('')}</div>`;
    }
    return `<section class="fx-card fx-${card.kind}" data-i="${i}" aria-label="Kart ${i + 1} / ${cards.length}"><div class="fx-inner">${inner}</div></section>`;
  }

  function pageFeed(ch, l) {
    const ctx = { ch, l, key: lessonKey(ch, l), idx: ch.lessons.indexOf(l), cards: buildCards(l), next: nextOf(ch, l) };
    const caption = `<div class="fx-caption"><span>${ch.title} › <b>${l.title}</b></span><span class="fx-count" id="fx-count"></span></div>`;
    return `<div class="fx">
      ${renderTop(l, caption)}
      <div class="fx-scroll" id="fx-scroll">${ctx.cards.map((c, i) => renderCard(c, i, ctx)).join('')}</div>
      <div class="fx-nav" id="fx-nav">
        <button class="btn fx-up" type="button" data-act="card-prev" aria-label="Önceki kart">↑</button>
        <button class="btn btn-primary fx-down" type="button" data-act="card-next">Devam ↓</button>
      </div>
    </div>`;
  }

  // Akışın durumu: { ch, l, idx, wheelAt, wheelGo } (akış ekranı dışında null)
  let F = null;

  const feedScroller = () => root.querySelector('#fx-scroll');
  const feedCard = (i) => feedScroller().children[i];

  function refreshFeedUi() {
    root.querySelector('#fx-count').textContent = `${F.idx + 1} / ${lastCard(F.l) + 1}`;
    root.querySelector('#fx-nav').classList.toggle('end', F.idx === lastCard(F.l));
    const seg = root.querySelector('.fx-seg.active');
    if (seg) {
      seg.querySelector('i').style.width = `${lessonFill(F.ch, F.l)}%`;
      seg.classList.toggle('read', isRead(F.ch, F.l));
    }
    root.querySelector('#fx-pct').textContent = `%${overallPct()}`;
  }

  // İlerleme yalnızca kullanıcı kaydırdığında işlenir; adresle bir karta atlamak dersi bitirmez
  function onFeedScroll() {
    const sc = feedScroller();
    const i = Math.round(sc.scrollTop / sc.clientHeight);
    if (i === F.idx || i < 0 || i > lastCard(F.l)) return;
    F.idx = i;
    const key = lessonKey(F.ch, F.l);
    Store.data.seen[key] = Math.max(Store.data.seen[key] || 0, i);
    if (i === lastCard(F.l) && !Store.data.read[key]) Store.data.read[key] = today();
    Store.save();
    try { history.replaceState(null, '', `${lessonHref(F.ch, F.l)}/${i + 1}`); } catch (e) { /* adres güncellenmese de akış çalışır */ }
    refreshFeedUi();
  }

  function showCard(i) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    feedScroller().scrollTo({ top: feedCard(i).offsetTop, behavior: reduce ? 'auto' : 'smooth' });
  }

  // Kart ekrana sığmıyorsa önce kartın içi kayar, sonra sıradaki karta geçilir
  function scrollInsideCard(dir) {
    const card = feedCard(F.idx);
    const canScroll = dir > 0 ? card.scrollTop + card.clientHeight < card.scrollHeight - 4 : card.scrollTop > 4;
    if (canScroll) card.scrollBy({ top: dir * card.clientHeight * 0.8, behavior: 'smooth' });
    return canScroll;
  }

  function step(dir) {
    if (scrollInsideCard(dir)) return;
    const i = F.idx + dir;
    if (i >= 0 && i <= lastCard(F.l)) { showCard(i); return; }
    const to = dir > 0 ? nextOf(F.ch, F.l) : prevOf(F.ch, F.l);
    if (to) location.hash = dir > 0 ? lessonHref(to.ch, to.l) : `${lessonHref(to.ch, to.l)}/son`;
    else if (dir > 0) location.hash = '#/learn/sorular';
  }

  // Tekerlek hareketi tek jest başına bir kart ilerletir; ders sınırını yalnızca düğme ve klavye geçer
  function onFeedWheel(e) {
    if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    const dir = Math.sign(e.deltaY);
    const sc = feedScroller();
    for (let el = e.target; el && el !== sc; el = el.parentElement) {
      if (el.scrollHeight <= el.clientHeight + 1 || !/auto|scroll/.test(getComputedStyle(el).overflowY)) continue;
      if (dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return;
    }
    e.preventDefault();
    const now = Date.now();
    const newGesture = now - F.wheelAt > 140;
    F.wheelAt = now;
    if (Math.abs(e.deltaY) < 4 || (!newGesture && now - F.wheelGo < 900)) return;
    const i = F.idx + dir;
    if (i >= 0 && i <= lastCard(F.l)) {
      F.wheelGo = now;
      showCard(i);
    }
  }

  function onKey(e) {
    if (!F || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
    const onControl = /^(BUTTON|A|SUMMARY)$/.test(e.target.tagName);
    let dir = 0;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') dir = 1;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') dir = -1;
    else if (e.key === ' ' && !onControl) dir = e.shiftKey ? -1 : 1;
    if (!dir) return;
    e.preventDefault();
    step(dir);
  }

  function startFeed(ch, l, cardParam) {
    const last = lastCard(l);
    let i = isRead(ch, l) ? 0 : seenCard(ch, l);
    if (cardParam === 'son') i = last;
    else if (cardParam) i = Math.min(Math.max((parseInt(cardParam, 10) || 1) - 1, 0), last);
    F = { ch, l, idx: i, wheelAt: 0, wheelGo: 0 };
    if (l.intro && !isRead(ch, l)) {
      Store.data.read[lessonKey(ch, l)] = today();
      Store.save();
    }
    const sc = feedScroller();
    sc.scrollTop = feedCard(i).offsetTop;
    sc.addEventListener('scroll', () => requestAnimationFrame(() => { if (F && feedScroller() === sc) onFeedScroll(); }), { passive: true });
    sc.addEventListener('wheel', onFeedWheel, { passive: false });
    refreshFeedUi();
  }

  /* ------------------------------------------------------------ hoca soruları */

  const Q = { mode: 'list', filter: 'all', current: null, lastShown: null };

  function qCard(q, n) {
    const st = qState(q.id);
    const [chId, lId] = q.lesson.split('/');
    const ch = findChapter(chId);
    const l = ch && ch.lessons.find((x) => x.id === lId);
    return `<article class="card qx" id="q-${q.id}" data-q="${q.id}">
      <header class="qx-head">
        <span class="q-num">S${n}</span>
        ${sourceBadge({ kind: qKind(q) })}
        <span class="q-topic">${esc(q.set)}</span>
        ${l ? `<a class="qx-lesson" href="${lessonHref(ch, l)}">Bölüm ${ch.num} · ${l.title}</a>` : ''}
        <span class="pill ${BOX[st.box].cls}">${BOX[st.box].label}</span>
      </header>
      <p class="qx-q">${q.q}</p>${q.code ? javaLines(q.code) : ''}
      <label class="qx-draft-l" for="d-${q.id}">Önce kendi cevabını yaz (isteğe bağlı, bu tarayıcıda saklanır)</label>
      <textarea class="qx-draft" id="d-${q.id}" rows="3" placeholder="Cevabını buraya yaz…">${esc(Store.data.drafts[q.id] || '')}</textarea>
      <div class="btn-row"><button class="btn btn-primary btn-sm" type="button" data-act="reveal">Model cevabı göster</button>${q.lab ? `<button class="btn btn-sm btn-ghost" type="button" data-act="lab">▶ ${esc(q.lab.label)}</button>` : ''}</div>
      <div class="qx-answer" hidden>
        <div class="qx-model">${q.a}</div>
        <div class="qx-keys"><b>Cevabında bu anahtar noktalar var mıydı?</b> <small>(işaretle, puanın hesaplansın)</small>
          ${q.keys.map((k, i) => `<label class="qx-key"><input type="checkbox" data-key="${i}"><span>${k}</span></label>`).join('')}
          <div class="qx-score"></div>
        </div>
        <div class="qx-rate"><span>Kendini değerlendir:</span>
          <button class="btn btn-sm l-bad" type="button" data-rate="bad">✗ Bilemedim</button>
          <button class="btn btn-sm" type="button" data-rate="partial">~ Kısmen</button>
          <button class="btn btn-sm l-ok" type="button" data-rate="good">✓ Bildim</button>
        </div>
        <div class="qx-msg"></div>
      </div>
    </article>`;
  }

  function qStats() {
    const counts = [0, 0, 0, 0];
    questions().forEach((q) => counts[qState(q.id).box]++);
    return counts;
  }

  function pickNext() {
    const qs = questions().filter((q) => q.id !== Q.lastShown);
    if (!qs.length) return questions()[0];
    const t = today();
    // Öncelik: tekrar et (1) > yeni (0) > gelişiyor (2, bugün çalışılmamışsa) > öğrenildi (3)
    const prio = (q) => {
      const s = qState(q.id);
      if (s.box === 1) return 0;
      if (s.box === 0) return 1;
      if (s.box === 2) return s.day === t ? 4 : 2;
      return 5;
    };
    const best = Math.min(...qs.map(prio));
    const pool = qs.filter((q) => prio(q) === best);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function pageQuestions(focusId) {
    const qs = questions();
    const c = qStats();
    const total = qs.length;
    const filters = [['all', 'Tümü'], ['1', 'Tekrar et'], ['0', 'Yeni'], ['2', 'Gelişiyor'], ['3', 'Öğrenildi']];
    let body;
    if (Q.mode === 'card') {
      if (!Q.current || !qs.find((q) => q.id === Q.current)) Q.current = pickNext().id;
      const q = qs.find((x) => x.id === Q.current);
      body = `<p class="hint">Karışık tekrar: sıradaki soru, en az bildiklerinden seçilir. "Bildim" dediğin bir soru <b>aynı gün</b> tekrar "Öğrenildi" olmaz; ertesi gün yeniden sorulur.</p>
        ${qCard(q, qs.indexOf(q) + 1)}
        <div class="btn-row"><button class="btn btn-primary" type="button" data-act="nextq">Sonraki soru ▶</button></div>`;
    } else {
      const list = qs.filter((q) => Q.filter === 'all' || String(qState(q.id).box) === String(Q.filter));
      body = `<div class="qx-filters">${filters.map(([k, t]) => `<button type="button" class="dg-tab${String(Q.filter) === k ? ' active' : ''}" data-filter="${k}">${t}${k === 'all' ? ` (${total})` : ` (${c[k]})`}</button>`).join('')}</div>
        ${list.length ? list.map((q) => qCard(q, qs.indexOf(q) + 1)).join('') : '<p class="empty">Bu filtrede soru yok.</p>'}`;
    }
    return `
      <nav class="l-crumbs"><a href="#/learn">Ders Notları</a> › Sınav soruları</nav>
      <section class="card l-chhead">
        <span class="tag">Sınavda çıkabilir · ${total} soru</span>
        <h2>Sınav soruları</h2>
        <p>Önce <b>kendi cevabını yaz</b>, sonra model cevabı aç ve <b>anahtar noktaları</b> işaretleyerek karşılaştır. <span class="src-badge src-slide">Slayttan</span> sorunun kendisi hocanın slaytında var; <span class="src-badge src-teacher">Sınav tipi</span> slayt içeriğinden sınav formatında yazıldı. Hocanın paylaştığı sorular geldikçe buraya eklenecek.</p>
        <div class="qx-stats">${BOX.map((bx) => `<div class="mini-stat ${bx.cls}"><span>${bx.label}</span><b>${c[bx.id]}</b></div>`).join('')}</div>
        <div class="l-bar l-bar-stack">${BOX.slice(1).reverse().map((bx) => `<i class="${bx.cls}" style="width:${total ? (c[bx.id] / total) * 100 : 0}%"></i>`).join('')}</div>
        <div class="lab-tabs qx-modes">
          <button class="lab-tab${Q.mode === 'list' ? ' active' : ''}" type="button" data-mode="list"><span class="lab-num">≡</span>Liste</button>
          <button class="lab-tab${Q.mode === 'card' ? ' active' : ''}" type="button" data-mode="card"><span class="lab-num">⟳</span>Kart modu <small>karışık aralıklı tekrar</small></button>
        </div>
      </section>
      <div class="qx-body">${body}</div>`;
  }

  function rate(id, kind) {
    const s = Object.assign({ box: 0 }, qState(id));
    const t = today();
    let msg;
    if (kind === 'bad') { s.box = 1; msg = 'Tekrar listesine eklendi. İlgili dersi tekrar oku, sonra yeniden dene.'; }
    if (kind === 'partial') { s.box = 1; msg = 'Eksik noktaları işaretlenmemiş anahtar maddelerden tamamla; bu soru yakında tekrar gelecek.'; }
    if (kind === 'good') {
      if (s.box <= 1) { s.box = 2; msg = 'Güzel! "Gelişiyor"a geçti. Başka bir gün tekrar bilirsen "Öğrenildi" olur.'; }
      else if (s.box === 2 && s.goodDay && s.goodDay !== t) { s.box = 3; msg = 'Farklı bir günde tekrar bildin: "Öğrenildi" ✓'; }
      else if (s.box === 2) { msg = 'Bugün zaten bildin. Aralıklı tekrar için yarın tekrar sorulacak.'; }
      else { msg = 'Hâlâ biliyorsun ✓'; }
      s.goodDay = t;
    }
    s.day = t;
    s.n = (s.n || 0) + 1;
    Store.data.q[id] = s;
    Store.save();
    return msg;
  }

  /* ------------------------------------------------------------ olaylar */

  let root = null;
  let params = [];

  function onClick(e) {
    const t = e.target;
    const act = t.closest('[data-act]');

    const modeBtn = t.closest('[data-mode]');
    if (modeBtn && params[0] === 'sorular') { Q.mode = modeBtn.dataset.mode; draw(); return; }
    const filt = t.closest('[data-filter]');
    if (filt) { Q.filter = filt.dataset.filter; draw(); return; }

    const qx = t.closest('[data-q]');
    const rateBtn = t.closest('[data-rate]');
    if (rateBtn && qx) {
      const msg = rate(qx.dataset.q, rateBtn.dataset.rate);
      qx.querySelector('.qx-msg').textContent = msg;
      const st = qState(qx.dataset.q);
      const pill = qx.querySelector('.qx-head .pill');
      pill.className = `pill ${BOX[st.box].cls}`;
      pill.textContent = BOX[st.box].label;
      qx.querySelectorAll('[data-rate]').forEach((x) => x.classList.toggle('chosen', x === rateBtn));
      return;
    }
    if (!act) return;
    const a = act.dataset.act;

    if (a === 'menu') { OOPLab.app.toggleSidebar(true); return; }
    if (a === 'reset') {
      if (!confirm('Tüm ilerleme silinsin mi?\n\nOkunan dersler, sınav sorusu kutuları, alıştırma cevapları, kod taslakları ve sınav sayacı sıfırlanır. Bu geri alınamaz.')) return;
      Store.reset();
      draw();
      return;
    }
    if (a === 'solve') {
      act.closest('.l-solve').querySelector('.l-solve-a').hidden = false;
      act.hidden = true;
      return;
    }
    if (a === 'card-next' && F) { step(1); return; }
    if (a === 'card-prev' && F) { step(-1); return; }

    if (a === 'reveal' && qx) {
      const ans = qx.querySelector('.qx-answer');
      ans.hidden = !ans.hidden;
      act.textContent = ans.hidden ? 'Model cevabı göster' : 'Model cevabı gizle';
      return;
    }
    if (a === 'lab' && qx) {
      const q = questions().find((x) => x.id === qx.dataset.q);
      OOPLab.app.loadPreset(q.lab.preset);
      return;
    }
    if (a === 'nextq') {
      Q.lastShown = Q.current;
      Q.current = pickNext().id;
      draw();
      return;
    }

    const chk = t.closest('[data-check]');
    if (chk) {
      const id = chk.dataset.check;
      const ans = chk.querySelector('.l-check-a');
      const verdict = chk.querySelector('.mc-verdict');
      if (a === 'reveal') {
        ans.hidden = false;
        act.hidden = true;
      } else if (a === 'ok' || a === 'bad') {
        markCheck(chk, id, a);
      } else if (a === 'opt') {
        // Çoktan seçmeli: seçilen şık hemen puanlanır, doğru şık her durumda gösterilir
        const c = findCheck(id);
        const j = Number(act.dataset.j);
        const ok = c && j === c.answer;
        chk.querySelectorAll('.mc-opt').forEach((o) => {
          o.disabled = true;
          o.classList.toggle('right', c && Number(o.dataset.j) === c.answer);
        });
        if (!ok) act.classList.add('wrong');
        verdict.innerHTML = ok ? '<b class="v-ok">✓ Doğru!</b>' : `<b class="v-bad">✗ Yanlış.</b> Doğru cevap: <b>${'ABCDEF'[c.answer]}</b>`;
        ans.hidden = false;
        markCheck(chk, id, ok ? 'ok' : 'bad');
      } else if (a === 'retry') {
        chk.querySelectorAll('.mc-opt').forEach((o) => { o.disabled = false; o.classList.remove('right', 'wrong'); });
        ans.hidden = true;
      } else if (a === 'bugline') {
        if (!chk.classList.contains('bug-done')) act.classList.toggle('pick');
      } else if (a === 'bugcheck' || a === 'bugshow') {
        const c = findCheck(id);
        const bugs = new Set(c.bugs);
        let all = true;
        chk.querySelectorAll('.bug-ln').forEach((ln) => {
          const n = Number(ln.dataset.n);
          const picked = a === 'bugcheck' && ln.classList.contains('pick');
          ln.classList.remove('hit', 'wrong', 'missed');
          if (bugs.has(n)) ln.classList.add(picked ? 'hit' : 'missed');
          else if (picked) ln.classList.add('wrong');
          if (bugs.has(n) !== picked) all = false;
        });
        chk.classList.add('bug-done');
        const found = chk.querySelectorAll('.bug-ln.hit').length;
        verdict.innerHTML = a === 'bugshow' ? '<b class="v-bad">Hatalı satırlar işaretlendi.</b>'
          : all ? '<b class="v-ok">✓ Tüm hataları buldun!</b>'
          : `<b class="v-bad">✗ ${found} / ${bugs.size} hata bulundu${chk.querySelectorAll('.bug-ln.wrong').length ? ', hatasız satır da seçtin (kırmızı)' : ''}.</b> Turuncu satırlar kaçırdıkların.`;
        ans.hidden = false;
        markCheck(chk, id, a === 'bugcheck' && all ? 'ok' : 'bad');
      } else if (a === 'skcheck' || a === 'skshow') {
        const c = findCheck(id);
        chk.querySelectorAll('.sk-blk').forEach((blk) => {
          const b = c.blanks[Number(blk.dataset.b)];
          const inp = blk.querySelector('.sk-in');
          const ok = a === 'skcheck' && [b.model, ...(b.answers || [])].some((x) => normCode(x) === normCode(inp.value));
          blk.classList.toggle('ok', ok);
          blk.classList.toggle('ko', !ok);
          const m = blk.querySelector('.sk-model');
          m.hidden = ok;
          if (!ok) m.innerHTML = `<span class="sk-mlbl">Model cevap:</span>${javaLines(b.model)}${b.note ? `<small>${b.note}</small>` : ''}${a === 'skcheck' && inp.value.trim() ? '<button class="btn btn-sm btn-ghost" type="button" data-act="sksame">✓ Benimki de aynı anlamda</button>' : ''}`;
        });
        const total = c.blanks.length;
        const okN = chk.querySelectorAll('.sk-blk.ok').length;
        verdict.innerHTML = a === 'skshow' ? '<b class="v-bad">Model cevaplar blokların altında.</b>'
          : okN === total ? '<b class="v-ok">✓ Tüm bloklar doğru!</b>'
          : `<b class="v-bad">${okN} / ${total} blok birebir eşleşti.</b> Eşleşmeyenlerin altındaki model cevapla karşılaştır; farklı yazıp aynı işi yapıyorsa "aynı anlamda" de.`;
        ans.hidden = false;
        markCheck(chk, id, okN === total && a === 'skcheck' ? 'ok' : 'bad');
      } else if (a === 'sksame') {
        const blk = act.closest('.sk-blk');
        blk.classList.remove('ko');
        blk.classList.add('ok');
        blk.querySelector('.sk-model').hidden = true;
        const okN = chk.querySelectorAll('.sk-blk.ok').length;
        const total = chk.querySelectorAll('.sk-blk').length;
        verdict.innerHTML = okN === total ? '<b class="v-ok">✓ Tüm bloklar tamam!</b>' : `<b class="v-bad">${okN} / ${total} blok tamam.</b>`;
        if (okN === total) markCheck(chk, id, 'ok');
      } else if (a === 'fill' || a === 'fillshow') {
        const c = findCheck(id);
        let all = true;
        chk.querySelectorAll('.fill-in').forEach((inp) => {
          const acc = c.answers[Number(inp.dataset.b)];
          if (a === 'fillshow') inp.value = acc[0];
          const ok = c.prose
            ? synExpand(acc).has(normAns(inp.value).toLocaleLowerCase('tr'))
            : acc.some((x) => normAns(x) === normAns(inp.value));
          inp.classList.toggle('ok', ok);
          inp.classList.toggle('ko', !ok);
          all = all && ok;
        });
        verdict.innerHTML = a === 'fillshow' ? '<b class="v-bad">Cevaplar yerleştirildi.</b>' : all ? '<b class="v-ok">✓ Doğru!</b>' : '<b class="v-bad">✗ Kırmızı boşlukları tekrar dene.</b>';
        ans.hidden = false;
        // Cevabı görerek doldurmak "bildim" sayılmaz
        markCheck(chk, id, a === 'fill' && all ? 'ok' : 'bad');
      }
      return;
    }

    const [chId, lId] = params;
    const ch = findChapter(chId);
    const l = ch && ch.lessons.find((x) => x.id === lId);
    if (a === 'lab' && l) OOPLab.app.loadPreset(l.lab.preset);
    if (a === 'restart' && l) {
      const key = lessonKey(ch, l);
      delete Store.data.read[key];
      delete Store.data.seen[key];
      Store.save();
      F.idx = 0;
      feedScroller().scrollTop = 0;
      try { history.replaceState(null, '', lessonHref(ch, l)); } catch (e) { /* yok say */ }
      refreshFeedUi();
    }
  }

  function markCheck(chk, id, result) {
    Store.data.checks[id] = result;
    // Sınav sorusu tekrarda cevaplanırsa "Sınav soruları" sayfasındaki kutusu da güncellenir
    if (id.startsWith('tq:')) rate(id.slice(3), result === 'ok' ? 'good' : 'bad');
    Store.save();
    chk.classList.remove('ok', 'bad');
    chk.classList.add(result);
    const score = root.querySelector('#rv-score');
    if (score && F) {
      const ids = buildCards(F.l).filter((c) => c.kind === 'rq').map((c) => c.item.id);
      const ok = ids.filter((x) => Store.data.checks[x] === 'ok').length;
      const bad = ids.filter((x) => Store.data.checks[x] === 'bad').length;
      score.textContent = `${ok} bildim · ${bad} bilemedim · ${ids.length - ok - bad} işaretlenmedi`;
    }
  }

  // Kod kutularında Tab girinti ekler (odak kaybolmaz)
  function onCodeTab(e) {
    const ta = e.target;
    if (e.key !== 'Tab' || e.shiftKey || !ta.matches || !ta.matches('.wr-draft, .sk-in')) return;
    e.preventDefault();
    const s = ta.selectionStart;
    ta.setRangeText('    ', s, ta.selectionEnd, 'end');
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function onInput(e) {
    const wr = e.target.closest('.wr-draft');
    if (wr) {
      Store.data.drafts[wr.closest('[data-check]').dataset.check] = wr.value;
      Store.save();
      return;
    }
    const sk = e.target.closest('.sk-in');
    if (sk) {
      Store.data.drafts[`${sk.closest('[data-check]').dataset.check}@${sk.closest('.sk-blk').dataset.b}`] = sk.value;
      // blok yazdıkça büyüsün
      sk.rows = Math.max(sk.rows, sk.value.split('\n').length);
      Store.save();
      return;
    }
    const ta = e.target.closest('.qx-draft');
    if (ta) {
      Store.data.drafts[ta.closest('[data-q]').dataset.q] = ta.value;
      Store.save();
      return;
    }
    const cb = e.target.closest('[data-key]');
    if (cb) {
      const qx = cb.closest('[data-q]');
      const boxes = [...qx.querySelectorAll('[data-key]')];
      const got = boxes.filter((x) => x.checked).length;
      const ratio = got / boxes.length;
      const sug = ratio >= 0.8 ? 'good' : ratio >= 0.4 ? 'partial' : 'bad';
      qx.querySelector('.qx-score').innerHTML = `<b>${got} / ${boxes.length}</b> anahtar nokta → önerilen değerlendirme: <b>${{ good: '✓ Bildim', partial: '~ Kısmen', bad: '✗ Bilemedim' }[sug]}</b>`;
      qx.querySelectorAll('[data-rate]').forEach((x) => x.classList.toggle('suggest', x.dataset.rate === sug));
    }
  }

  /* ------------------------------------------------------------ yönlendirme */

  function draw() {
    const [a, b2, b3] = params;
    let html;
    let focus = false;
    let header = { num: 'T', title: 'Ders Notları', sub: 'Önce teori, sonra laboratuvar' };
    const ch = findChapter(a);
    const l = ch && b2 && (b2 === 'tekrar' ? reviewOf(ch) : b2 === 'konular' && hasIntro(ch) ? introOf(ch) : ch.lessons.find((x) => x.id === b2));
    F = null;
    if (a === 'plan') {
      html = pageOverview();
      header = { num: 'T', title: 'Genel Bakış', sub: 'Çalışma yöntemi, bölümler, dönem planı' };
    } else if (a === 'sorular') {
      html = pageQuestions(b2);
      header = { num: 'S', title: 'Sınav Soruları', sub: 'Aralıklı tekrar ile sınava hazırlık' };
    } else if (l) {
      html = pageFeed(ch, l);
      focus = true;
      header = { num: `B${ch.num}`, title: l.title, sub: `Bölüm ${ch.num}: ${ch.title}` };
    } else if (ch) {
      html = pageChapter(ch);
      header = { num: `B${ch.num}`, title: `Bölüm ${ch.num}: ${ch.title}`, sub: ch.en };
    } else {
      html = pageHome();
      focus = true;
    }
    document.body.classList.toggle('focus-mode', focus);
    root.innerHTML = `<div class="learn${focus ? ' learn-focus' : ''}">${html}</div>`;
    OOPLab.diagrams.init(root);
    OOPLab.app.setHeader(header);
    if (l) startFeed(ch, l, b3);

    if (a === 'sorular' && b2 && Q.mode === 'list') {
      const el = root.querySelector(`#q-${CSS.escape(b2)}`);
      if (el) {
        el.classList.add('flash-card');
        requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
      }
    }
  }

  function navigate(p) {
    params = p || [];
    if (params[0] === 'sorular' && params[1]) Q.mode = 'list';
    draw();
  }

  function mount(container, p) {
    root = container;
    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('change', onInput);
    root.addEventListener('keydown', onCodeTab);
    document.addEventListener('keydown', onKey);
    navigate(p);
  }

  function unmount() {
    if (root) {
      root.removeEventListener('click', onClick);
      root.removeEventListener('input', onInput);
      root.removeEventListener('change', onInput);
      root.removeEventListener('keydown', onCodeTab);
    }
    document.removeEventListener('keydown', onKey);
    document.body.classList.remove('focus-mode');
    F = null;
    root = null;
  }

  OOPLab.modules = OOPLab.modules || {};
  OOPLab.modules.learn = {
    num: 'T',
    title: 'Ders Notları',
    subtitle: 'Önce teori, sonra laboratuvar',
    mount,
    unmount,
    navigate
  };
})(window.OOPLab = window.OOPLab || {});
