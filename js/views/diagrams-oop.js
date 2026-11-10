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
})(window.OOPLab = window.OOPLab || {});
