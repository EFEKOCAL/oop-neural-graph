# OOP Interactive Lab

BLM2005 **Nesne Yönelimli Programlama** dersinin teorisini kart kart ilerleyen ders notları ve **interaktif Java laboratuvarlarıyla** öğreten tek sayfalık web uygulaması. Saf HTML, CSS ve JavaScript ile yazıldı; hiçbir dış kütüphane veya kurulum gerektirmez.

**Canlı site:** https://efekocal.github.io/oop-neural-graph/

## Önce teori: Ders Notları

Site, ortasında büyük bir **Başla** düğmesi ve tepesinde konu konu dolan bir ilerleme çubuğu olan sade bir ekranla açılır. Dersler tek ekranlık kartlar halinde dikey olarak ilerler: kaydır, ok tuşlarını veya **Devam** düğmesini kullan.

Hocanın PDF'leri (Liang, *Introduction to Java Programming*) slayt sırasıyla kısa derslere bölünmüştür:

| Bölüm | Kaynak | Dersler |
|---|---|---|
| 0 · Java Temelleri | Lab Hafta 1–3 | Program iskeleti, ilkel tipler, Scanner, karar/döngü, metotlar ve overloading, diziler |
| 1 · Sınıflar ve Nesneler | Slide01_BPII.pdf | Nesne/sınıf, UML, yapıcılar, referanslar, null, GC, Date/Random, static, görünürlük, kapsülleme, pass-by-value, immutable, kapsam, this, nesne dizileri, ArrayList, wrapper |
| 2 · Kalıtım ve Çok Biçimlilik | Slide02_BPII.pdf | extends, super, yapıcı zinciri, Apple/Fruit hatası, override, override vs overload, Object/toString, polimorfizm, eşleştirme vs bağlama, casting, equals, protected, final |
| 3 · İstisnalar ve Metin I/O | Slide03_BPII.pdf | Motivasyon, avantajlar, hiyerarşi, checked/unchecked, throw/throws/catch, çoklu catch, yayılım, finally, rethrow, özel istisna, File, PrintWriter, try-with-resources, Scanner, ReplaceText, web'den okuma |
| 4 · Soyut Sınıf ve Arayüz | Liang Bölüm 13 | Vize konusu (geçmiş vizelerin hepsinde çıktı) |
| 5 · Vize Provası | — | Karma kod izleme ve 16 soruluk deneme |

Her ders aynı döngüyü izler:

1. **Okumadan önce düşün:** Ders, sonundaki ilk soruyla açılır.
2. **Oku:** Tanımlar, tablolar, slayt numaraları. "Neden böyle?", "Sınav tuzağı" ve slayt hatası kutuları.
3. **Kodda gör:** 59 kod şekli. Programı **İleri** ile satır satır yürüt; vurgulanan satırı, değişken tablosunu ve konsolu izle.
4. **Kendini yokla:** Çoktan seçmeli ve boşluk doldurma soruları otomatik puanlanır.
5. **Laboratuvarda dene:** İlgili dersin sonunda laboratuvar düğmesi var.

Her bölümün sonunda bir **bölüm tekrarı** gelir. **Sınav Soruları** sayfasında açık uçlu sorular, model cevaplar ve anahtar noktalar vardır; sorular aralıklı tekrarla çalışılır. Soruların kaynağı etiketlidir: **Slayttan** (soru hocanın slaytında var) ya da **Sınav tipi** (slayt içeriğinden yazıldı). Hocanın gerçek soruları `js/data/exam-questions.js` dosyasına eklenebilir (şablon dosyanın başında).

## Laboratuvarlar

| # | Modül | İçerik |
|---|---|---|
| L1 | **Stack & Heap** | Referans değişkenleri, atama ve aliasing, çöp toplama, pass-by-value, static alanın tek kopyası, nesne dizisi ve NullPointerException. Stack çerçeveleri, heap nesneleri ve referans okları canlı çizilir. |
| L2 | **Kalıtım Laboratuvarı** | **Yapıcı zinciri:** kod sınıf modelinden üretilir, `this(...)` / `super(...)` / gizli `super()` adım adım yorumlanır, Apple/Fruit gibi derleme hataları bulunur. **Dinamik bağlama:** bildirilen tip, gerçek tip ve çağrı seçilir; önce derleyicinin eşleştirmesi, sonra JVM'in arama yolu gösterilir; downcast ve ClassCastException. |
| L3 | **İstisna Akışı** | main → method1 → method2 → method3 zinciri; her metoda catch, finally, throws eklenir. Checked istisnalarda "yakala ya da bildir" ve "hiç fırlatılmayan istisna yakalanamaz" derleme kontrolleri, ardından yayılım adım adım. |

Her modülün sağ alt köşesinde teori ve sınav sorularını içeren **Bilgi & Sınav paneli** bulunur; sorular "▶ Laboratuvarda dene" ile ilgili ayarla açılır. Ders Notları modülünün panelinde aranabilir **kavram sözlüğü** vardır.

## Kullanım

- **Online:** Yukarıdaki canlı site bağlantısını aç.
- **Yerelde:** Depoyu indir ve `index.html` dosyasına çift tıkla. Sunucu gerekmez.

| Tuş | İşlev |
|---|---|
| `I` | Bilgi & Sınav panelini aç/kapat |
| `Esc` | Paneli kapat |
| `↓` `↑` `Boşluk` | Ders akışında sonraki / önceki kart |

## Doğruluk

Ders kodlarının tamamı JDK 21 ile derlenip çalıştırıldı; şekillerdeki konsol çıktıları gerçek çıktıyla aynıdır (hash ve tarih gibi her çalıştırmada değişen değerler hariç). Kalıtım ve istisna laboratuvarlarının ürettiği kodlar da tüm hazır senaryolarda derlenip simülasyonun çıktısıyla karşılaştırıldı.

## Dosya yapısı

```
index.html                  uygulama kabuğu (menü, üst bar, bilgi paneli)
style.css                   koyu tema "control center" arayüzü + OOP eklemeleri
sw.js                       eski sürümün service worker'ını temizler
js/
  app.js                    yönlendirme, bilgi & sınav paneli
  views/diagrams.js         şekil motoru (explorer, stepper, tabs, custom)
  views/java.js             Java renklendirme ve "kodu adım adım izle" şekli
  views/learn-view.js       Ders Notları: başlangıç, kart akışı, bölüm tekrarı, sınav soruları
  labs/memory-view.js       L1 Stack & Heap
  labs/dispatch-view.js     L2 yapıcı zinciri ve dinamik bağlama (simulateChain / simulateBind)
  labs/exception-view.js    L3 istisna akışı (simulate)
  data/lessons-ch0..5.js    ders notları (bölüm başına bir dosya) ve kod şekilleri
  data/chapter-outlines.js  bölüm giriş sayfaları
  data/exam-questions.js    sınav soruları, model cevaplar, anahtar noktalar
  data/info-content.js      laboratuvarların Bilgi & Sınav paneli
  data/glossary.js          kavram sözlüğü
```
