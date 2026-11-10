/*
 * diagrams-oop.js — OOP derslerine özel etkileşimli şekiller.
 *   arraylist-anim → dizi tabanlı listenin içi: kapasite, size, araya ekleme / silmede kaydırma,
 *                    kapasite dolunca iki katı yeni dizi + kopyalama (Slide01 s.76–80)
 */
(function (OOPLab) {
  'use strict';

  const reg = OOPLab.diagrams.register;

  reg('arraylist-anim', {
    kind: 'custom',
    render() {
      return `<figure class="dg al-anim" data-dg="arraylist-anim">
        <div class="al-meta"><span>size = <b data-v="size">0</b></span><span>capacity = <b data-v="cap">4</b></span><span class="al-code" data-v="code"></span></div>
        <div class="al-cells"></div>
        <div class="dg-ctrl al-ctrl">
          <label>değer <input class="al-in" data-in="val" value="5" size="4"></label>
          <label>indeks <input class="al-in" data-in="idx" value="0" size="3"></label>
          <button class="btn btn-sm btn-primary" type="button" data-act="add">add(değer)</button>
          <button class="btn btn-sm" type="button" data-act="insert">add(indeks, değer)</button>
          <button class="btn btn-sm" type="button" data-act="remove">remove(indeks)</button>
          <button class="btn btn-sm btn-ghost" type="button" data-act="clear">clear()</button>
        </div>
        <figcaption class="dg-caption"></figcaption>
      </figure>`;
    },
    init(el) {
      let data = [];
      let cap = 4;
      const cells = el.querySelector('.al-cells');
      const cap1 = el.querySelector('.dg-caption');
      const v = (k) => el.querySelector(`[data-v="${k}"]`);
      const inp = (k) => el.querySelector(`[data-in="${k}"]`).value.trim();

      const draw = (hl, msg, tone) => {
        hl = hl || {};
        cells.innerHTML = Array.from({ length: cap }, (_, i) => {
          const has = i < data.length;
          return `<div class="al-cell${has ? ' full' : ''}${hl[i] ? ' ' + hl[i] : ''}"><small>${i}</small><span>${has ? data[i] : ''}</span></div>`;
        }).join('');
        v('size').textContent = data.length;
        v('cap').textContent = cap;
        cap1.className = `dg-caption${tone ? ' ' + tone : ''}`;
        cap1.innerHTML = msg || 'ArrayList içeride bir <b>dizi</b> tutar. <b>size</b> listedeki eleman sayısı, <b>capacity</b> içteki dizinin uzunluğudur. Bir işlem seç.';
      };
      const grow = () => {
        if (data.length < cap) return '';
        const old = cap;
        cap *= 2;
        return `Dizi doluydu (${old}/${old}) → <b>${cap} kapasiteli yeni dizi</b> oluşturuldu, ${old} eleman yeni diziye <b>kopyalandı</b>, yeni dizi geçerli dizi oldu. `;
      };

      el.querySelector('.al-ctrl').addEventListener('click', (ev) => {
        const b = ev.target.closest('[data-act]');
        if (!b) return;
        const a = b.dataset.act;
        const val = inp('val') || '?';
        const idx = parseInt(inp('idx'), 10);
        if (a === 'clear') { data = []; v('code').textContent = 'list.clear();'; draw(null, '<code>clear()</code> tüm elemanları siler: size = 0. Kapasite (içteki dizi) aynı kalır.'); return; }
        if (a === 'add') {
          const g = grow();
          data.push(val);
          v('code').textContent = `list.add(${val});`;
          draw({ [data.length - 1]: 'new' }, `${g}<code>add(e)</code> elemanı <b>sona</b> ekler (indeks ${data.length - 1}); kaydırma gerekmez.`);
          return;
        }
        if (Number.isNaN(idx) || idx < 0 || (a === 'insert' ? idx > data.length : idx >= data.length)) {
          v('code').textContent = a === 'insert' ? `list.add(${inp('idx')}, ${val});` : `list.remove(${inp('idx')});`;
          draw(null, `<b>IndexOutOfBoundsException</b>: geçerli indeks ${a === 'insert' ? `0..${data.length}` : data.length ? `0..${data.length - 1}` : 'yok (liste boş)'}.`, 'warn');
          return;
        }
        if (a === 'insert') {
          const g = grow();
          const moved = data.length - idx;
          data.splice(idx, 0, val);
          v('code').textContent = `list.add(${idx}, ${val});`;
          const hl = { [idx]: 'new' };
          for (let i = idx + 1; i < data.length; i++) hl[i] = 'shift';
          draw(hl, `${g}<b>Araya ekleme:</b> önce indeks ${idx}'den sonraki ${moved} eleman <b>bir sağa kaydırıldı</b>, sonra yeni eleman ${idx}'e yazıldı; size 1 arttı.`);
        } else {
          const gone = data[idx];
          data.splice(idx, 1);
          v('code').textContent = `list.remove(${idx});  // ${gone} döner`;
          const hl = {};
          for (let i = idx; i < data.length; i++) hl[i] = 'shift';
          draw(hl, `<b>Silme:</b> ${gone} kaldırıldı; ondan sonraki ${data.length - idx} eleman <b>bir sola kaydırıldı</b>, size 1 azaldı. (Kapasite küçülmez; <code>trimToSize()</code> ile küçültülebilir.)`);
        }
      });
      draw();
    }
  });
  // Vize sayacı: 80 dk, bitiş zamanı tarayıcıda saklanır (sayfa değişse de sayım sürer).
  // Her sınav formatı için ayrı önerilen süre dağılımı (plan)
  const TKEY = 'ooplab.timer.v1';
  const PLANS = {
    'exam-timer': [['Boşluk doldurma', 10], ['Doğru / Yanlış', 6], ['Kod çıktısı', 14], ['Hata bulma', 12], ['İskelet / tasarım (40p)', 38]],
    'exam-timer-2025': [['S1 Boşluk', 10], ['S2 Çıktı', 12], ['S3 Hata bul', 12], ['S4 Çıktı + açıklama', 10], ['S5 İskelet (40p)', 36]],
    'exam-timer-2024': [['S1 Boşluk', 8], ['S2 D/Y', 5], ['S3 Çıktı', 4], ['S4 Hata', 9], ['S5 Komut tablosu', 9], ['S6 Tasarım (40p)', 38], ['S7 Çıktı', 7]],
    'exam-timer-2022': [['S1 Boşluk', 3], ['S2 D/Y', 6], ['S3 Çıktı', 8], ['S4 Hata', 5], ['S5 Tasarım (45p)', 36], ['S6 ArrayList + istisna (25p)', 22]],
    'exam-timer-karma': [['S1 Boşluk', 6], ['S2 D/Y', 6], ['S3 Çıktı', 10], ['S4 Hata', 12], ['S5 İskelet (40p)', 38], ['S6 Çıktı', 8]]
  };
  Object.keys(PLANS).forEach((key) => reg(key, timerDiagram(PLANS[key])));

  function timerDiagram(PLAN) {
    return {
      kind: 'custom',
      render() {
        return `<figure class="dg" data-dg="exam-timer">
          <div class="tm"><span class="tm-clock">80:00</span>
            <div class="btn-row"><button class="btn btn-primary btn-sm" type="button" data-t="start">▶ Başlat</button><button class="btn btn-sm" type="button" data-t="pause">⏸ Duraklat</button><button class="btn btn-sm btn-ghost" type="button" data-t="reset">↺ Sıfırla</button></div>
            <div class="tm-plan">${PLAN.map(([t, m]) => `<span style="--w:${m}">${t}<br><b>${m} dk</b></span>`).join('')}</div>
          </div>
          <figcaption class="dg-caption">Gerçek vize 80 dakika. Yukarıdaki dağılım önerilen süre; büyük soruya en az 35 dakika ayır. Sayaç sayfa değiştirsen de çalışmaya devam eder.</figcaption>
        </figure>`;
      },
      init(el) {
        const read = () => { try { return JSON.parse(localStorage.getItem(TKEY)) || {}; } catch (e) { return {}; } };
        const write = (st) => { try { localStorage.setItem(TKEY, JSON.stringify(st)); } catch (e) { /* kayıt olmasa da çalışır */ } };
        const clock = el.querySelector('.tm-clock');
        const box = el.querySelector('.tm');
        const left = (st) => (st.end ? st.end - Date.now() : st.left != null ? st.left : 80 * 60000);
        let iv = null;
        const tick = () => {
          if (!el.isConnected) { clearInterval(iv); return; }
          const st = read();
          const ms = left(st);
          const abs = Math.abs(ms);
          clock.textContent = `${ms < 0 ? '+' : ''}${String(Math.floor(abs / 60000)).padStart(2, '0')}:${String(Math.floor(abs / 1000) % 60).padStart(2, '0')}`;
          box.classList.toggle('run', !!st.end && ms >= 0);
          box.classList.toggle('late', ms < 0);
          let used = 80 - ms / 60000;
          el.querySelectorAll('.tm-plan span').forEach((sp, i) => {
            const m = PLAN[i][1];
            sp.classList.toggle('now', !!st.end && used >= 0 && used < m);
            used -= m;
          });
        };
        el.addEventListener('click', (e) => {
          const b = e.target.closest('[data-t]');
          if (!b) return;
          const st = read();
          if (b.dataset.t === 'start' && !st.end) write({ end: Date.now() + left(st) });
          if (b.dataset.t === 'pause' && st.end) write({ left: st.end - Date.now() });
          if (b.dataset.t === 'reset') write({});
          tick();
        });
        iv = setInterval(tick, 500);
        tick();
      }
    };
  }
})(window.OOPLab = window.OOPLab || {});
