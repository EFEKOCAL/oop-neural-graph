/*
 * info-content.js — "Bilgi & Sınav Paneli" içeriği (modül başına teori + sınav soruları).
 * preset: soruyu laboratuvarda açmak için { module: 'memory'|'dispatch'|'exceptions', ... }
 */
(function (OOPLab) {
  'use strict';

  const glossary = () => (OOPLab.glossary || []).slice().sort((a, b) => a[0].localeCompare(b[0], 'tr'));

  OOPLab.info = {
    memory: {
      theory: [
        {
          id: 'stack-heap',
          title: 'Stack ve heap',
          html: `
            <p>JVM belleği farklı amaçlı bölgelere ayırır. Sınav soruları için iki tanesini bilmek yeter:</p>
            <ul>
              <li><b>Stack (yığın):</b> Her metot çağrısında bir <b>çerçeve (frame)</b> açılır; parametreler ve <b>yerel değişkenler</b> burada durur. Metot bitince çerçeve yok edilir.</li>
              <li><b>Heap:</b> <code>new</code> ile oluşturulan <b>nesneler</b> (ve diziler) burada yaşar. Nesneler metot bitince yok olmaz; referansı kalmayınca çöp toplayıcı (GC) temizler.</li>
            </ul>
            <p>Static alanlar sınıfa aittir ve sınıf yüklendiğinde ayrı bir alanda (method area) <b>tek kopya</b> olarak oluşur.</p>
            <p class="note"><b>Laboratuvar modeli:</b> Nesne kimlikleri (#C1, #A) gösterim içindir; gerçek adresler ve hash değerleri farklıdır.</p>`
        },
        {
          id: 'refs',
          title: 'Referans, null, aliasing',
          kind: 'algo',
          html: `
            <ul>
              <li>Sınıf tipindeki değişken nesnenin kendisini değil <b>referansını</b> tutar.</li>
              <li><code>c1 = c2</code> referansı kopyalar: iki değişken <b>aynı nesneyi</b> gösterir (aliasing). Biri üzerinden yapılan değişikliği diğeri de görür.</li>
              <li><code>null</code>: hiçbir nesneyi göstermeyen referans. Referans alanların ve referans dizi elemanlarının varsayılan değeri. null üzerinden alan/metot kullanmak → <b>NullPointerException</b>.</li>
              <li><code>new Circle[3]</code>: üç <b>null</b> kutu; hiç Circle oluşmaz, yapıcı çağrılmaz.</li>
            </ul>
            <div class="formula">int i = j;        → değer kopyalanır
Circle a = b;     → referans kopyalanır (aynı nesne)
metot(x, c)       → x'in değeri, c'nin referansı kopyalanır</div>`
        },
        {
          id: 'gc',
          title: 'Çöp toplama (garbage collection)',
          html: `<p>Hiçbir referansın göstermediği nesne <b>çöptür</b>; program ona bir daha ulaşamaz. JVM bu nesnelerin belleğini <b>otomatik</b> geri alır. Java'da <code>delete</code>/<code>free</code> yoktur. Bir nesneyle işin bittiğini biliyorsan referansına <code>null</code> atayarak onu toplanabilir hale getirebilirsin (Slide01 s.35).</p>`
        }
      ],
      exam: [
        { topic: 'Referanslar', q: '<code>Circle a = new Circle(1); Circle b = a; b.radius = 4;</code> sonrası <code>a.radius</code> kaçtır? Kaç Circle nesnesi vardır?', a: '<b>4.0</b>. Tek bir Circle nesnesi vardır; a ve b aynı nesneyi gösterir (aliasing).', preset: { module: 'memory', scenario: 'atama' } },
        { topic: 'pass-by-value', q: 'Metot içinde <code>c = new Circle(1)</code> yazmak çağıranın değişkenini değiştirir mi? <code>c.radius = 100</code> yazmak?', a: 'Yeni nesne atamak <b>değiştirmez</b> (sadece kopya referans yön değiştirir). <code>c.radius = 100</code> ise ortak nesnenin içini değiştirir, çağıran görür.', preset: { module: 'memory', scenario: 'pass' } },
        { topic: 'static', q: 'İki Circle2 nesnesi oluşturulduktan sonra <code>a.count = 10</code> yapılırsa <code>b.count</code> kaçtır?', a: '<b>10</b>. static alanın tek kopyası vardır; hangi nesne üzerinden yazılırsa yazılsın ortak değer değişir.', preset: { module: 'memory', scenario: 'static' } },
        { topic: 'null', q: '<code>Circle[] arr = new Circle[3];</code> sonrası <code>arr[1].getArea()</code> ne olur?', a: '<b>NullPointerException</b>. Dizi kutuları null; hiç Circle nesnesi oluşturulmadı.', preset: { module: 'memory', scenario: 'dizi' } }
      ]
    },

    dispatch: {
      theory: [
        {
          id: 'chain',
          title: 'Yapıcı zinciri kuralları',
          kind: 'algo',
          html: `
            <ol>
              <li>Yapıcılar <b>miras alınmaz</b>; alt sınıf yapıcısı üst yapıcıyı <code>super(...)</code> ile çağırır.</li>
              <li>Yapıcının ilk satırı <code>this(...)</code> veya <code>super(...)</code> değilse derleyici <b>gizlice</b> <code>super();</code> ekler.</li>
              <li><code>this(...)</code> / <code>super(...)</code> <b>ilk satırda</b> olmalıdır; ikisi birlikte olamaz.</li>
              <li>Sınıfa hiç yapıcı yazılmazsa varsayılan yapıcı <code>Sinif() { super(); }</code> eklenir. Bir yapıcı yazılırsa eklenmez → alt sınıfın gizli super()'i derleme hatası verebilir (Apple/Fruit).</li>
            </ol>
            <div class="formula">Çağrı sırası : alttan üste  (Faculty → Employee → Person → Object)
Çıktı sırası : üstten alta  (Person → Employee → Faculty)</div>`
        },
        {
          id: 'binding',
          title: 'Eşleştirme ve dinamik bağlama',
          kind: 'algo',
          html: `
            <table><thead><tr><th></th><th>Kim?</th><th>Neye bakar?</th></tr></thead><tbody>
              <tr><td>Eşleştirme</td><td>Derleyici, derleme zamanı</td><td>Değişkenin <b>bildirilen</b> tipi ve argüman tipleri</td></tr>
              <tr><td>Bağlama</td><td>JVM, çalışma zamanı</td><td>Nesnenin <b>gerçek</b> tipi</td></tr>
            </tbody></table>
            <p>JVM metodu gerçek sınıfta arar, yoksa üst sınıfa çıkar; <b>ilk bulduğu</b> çalışır. Static metotlar ve alanlar dinamik bağlanmaz: bildirilen tipe göre seçilir.</p>`
        },
        {
          id: 'casting',
          title: 'Casting kuralları',
          html: `
            <ul>
              <li>Alt → üst (<b>upcast</b>): örtük, her zaman güvenli. <code>Object o = new Student();</code></li>
              <li>Üst → alt (<b>downcast</b>): açık cast gerekir. <code>Student s = (Student) o;</code> Gerçek nesne uymuyorsa <b>ClassCastException</b>.</li>
              <li>Kalıtım hattında olmayan tipler arasında cast ve <code>instanceof</code> <b>derleme hatasıdır</b>.</li>
            </ul>`
        }
      ],
      exam: [
        { topic: 'Yapıcı zinciri', q: '<code>new Faculty()</code> ne yazdırır? (Slide02 s.8)', a: '(1) Person … (2) Invoke Employee\'s overloaded constructor (3) Employee … (4) Faculty …', preset: { module: 'dispatch', tab: 'chain', preset: 'faculty' } },
        { topic: 'Derleme hatası', q: 'Fruit\'in yalnızca <code>Fruit(String)</code> yapıcısı varsa <code>class Apple extends Fruit { }</code> neden derlenmez?', a: 'Apple\'ın varsayılan yapıcısı gizlice <code>super()</code> çağırır; Fruit() yok.', preset: { module: 'dispatch', tab: 'chain', preset: 'apple' } },
        { topic: 'Dinamik bağlama', q: '<code>Object o = new GraduateStudent(); o.toString()</code> hangi toString\'i çalıştırır? (GraduateStudent override etmiyor, Student ediyor.)', a: '<b>Student.toString()</b>: JVM GraduateStudent\'ta bulamaz, üst sınıf Student\'ta bulur.', preset: { module: 'dispatch', tab: 'bind', declared: 'Object', actual: 'GraduateStudent', method: 'toString' } },
        { topic: 'Eşleştirme', q: '<code>Person p = new Student(); p.study();</code> derlenir mi? (study yalnızca Student\'ta)', a: '<b>Hayır.</b> Derleyici bildirilen tip Person\'a bakar; Person\'da study yok. <code>((Student) p).study()</code> yazılmalı.', preset: { module: 'dispatch', tab: 'bind', declared: 'Person', actual: 'Student', method: 'study' } },
        { topic: 'Casting', q: '<code>Person p = new Student(); GraduateStudent g = (GraduateStudent) p;</code> ne olur?', a: 'Derlenir (downcast olabilir) ama çalışma zamanında <b>ClassCastException</b>: gerçek nesne bir GraduateStudent değil.', preset: { module: 'dispatch', tab: 'bind', declared: 'Person', actual: 'Student', method: 'cast:GraduateStudent' } }
      ]
    },

    exceptions: {
      theory: [
        {
          id: 'hier',
          title: 'Hiyerarşi ve checked / unchecked',
          kind: 'algo',
          html: `
            <div class="formula">Throwable
 ├─ Error                       (unchecked)
 └─ Exception                   (checked)
     ├─ IOException             (checked)
     └─ RuntimeException        (unchecked)
         ├─ ArithmeticException, NullPointerException
         └─ IllegalArgumentException ─ NumberFormatException</div>
            <p><b>Checked</b> istisna fırlatan/ileten her metot ya <b>yakalamalı</b> ya da <code>throws</code> ile <b>bildirmeli</b>; aksi halde program derlenmez. Hiç fırlatılamayan bir checked istisnayı yakalamaya çalışmak da derleme hatasıdır.</p>`
        },
        {
          id: 'flow',
          title: 'Yayılım ve finally',
          kind: 'algo',
          html: `
            <ol>
              <li><code>throw</code> anında metodun kalanı atlanır.</li>
              <li>Saran try'ın catch'leri <b>yukarıdan aşağı</b> denenir; tipi uyan ilk catch çalışır (catch T, T'nin alt tiplerini de yakalar).</li>
              <li>Uyan yoksa varsa <b>finally</b> çalışır, metot sonlanır ve istisna çağırana gider.</li>
              <li>Yakalandığında: catch → finally → try-catch'ten sonraki satırdan normal akış.</li>
              <li>main'den de çıkarsa program sonlanır, yığın izi yazılır.</li>
            </ol>
            <p class="note"><b>Laboratuvar modeli:</b> Her metotta en fazla bir catch vardır; yığın izi kısaltılmıştır.</p>`
        }
      ],
      exam: [
        { topic: 'Yayılım', q: 'main(catch Exception) → method1(catch Arithmetic) → method2(catch NPE) → method3 IllegalArgumentException fırlatıyor. Hangi metot yakalar, hangi satırlar atlanır?', a: '<b>main</b> yakalar (IllegalArgumentException bir Exception). method2 ve method1\'in kalan satırları atlanır; main\'de catch\'ten sonraki satır çalışır.', preset: { module: 'exceptions', preset: 'yayilim' } },
        { topic: 'finally', q: 'Hiçbir catch\'in yakalamadığı bir istisnada finally blokları çalışır mı?', a: '<b>Evet.</b> Her metodun finally\'si, istisna o metottan çıkmadan önce çalışır.', preset: { module: 'exceptions', preset: 'finally' } },
        { topic: 'Checked', q: 'method3 <code>throws IOException</code> bildiriyor, method2 ne yakalıyor ne bildiriyor. Ne olur?', a: '<b>Derleme hatası</b> (unreported exception IOException). method2 ya yakalamalı ya da throws eklemeli.', preset: { module: 'exceptions', preset: 'checked' } },
        { topic: 'Yakalanmayan', q: 'NumberFormatException\'ı kimse yakalamazsa ne olur?', a: 'main de sonlanır, JVM <code>Exception in thread "main" java.lang.NumberFormatException…</code> yazdırır.', preset: { module: 'exceptions', preset: 'yakalanmaz' } }
      ]
    },

    learn: {
      theory: [
        {
          id: 'how',
          title: 'Bu site nasıl kullanılır?',
          html: `
            <ol>
              <li><b>Ders Notları:</b> Bölümleri hocanın PDF sırasıyla takip et. Her kart tek ekranlık; ↓ / Boşluk ile ilerle.</li>
              <li><b>Kodda gör:</b> Derslerdeki kod şekillerinde <b>İleri</b> ile programı satır satır yürüt; değişkenleri ve konsolu izle.</li>
              <li><b>Kendini yokla:</b> Çoktan seçmeli ve boşluk doldurma soruları otomatik puanlanır.</li>
              <li><b>Laboratuvar:</b> Stack &amp; Heap, kalıtım ve istisna akışını kendin kurup çalıştır.</li>
              <li><b>Sınav Soruları:</b> Açık uçlu soruları önce kendin cevapla, sonra model cevapla karşılaştır.</li>
            </ol>`
        },
        {
          id: 'ders',
          title: 'Ders bilgileri (Slide01 s.1–5)',
          html: `
            <p><b>BLM2005 Nesne Yönelimli Programlama</b> · Prof. Dr. Kazım Yıldız · Derslik T4-Z05 · Ders saati 2+2 · Kredi 6, ECTS 6.</p>
            <p><b>Haftalık plan:</b> 1 Dersin tanıtımı · 2 Java programlamaya giriş · 3 Nesneye dayalı programlamaya giriş · 4 Sınıf ve nesne kavramları · 5–6 Kalıtım ve çok biçimlilik · 7 İstisna yönetimi ve metin I/O · <b>8 Ara sınav</b> · 9 Soyut sınıflar ve arayüzler · 10 Olaya dayalı programlama · 11 Kullanıcı arayüzleri oluşturma · 12 Özyineli (recursive) fonksiyonlar · 13 Generic sınıflar · 14 Tasarım şablonlarına giriş · 15 Konu tekrarı.</p>
            <p><b>Kaynaklar:</b> ders sunumları; Y. Daniel Liang, <i>Introduction to Java Programming, Comprehensive</i>, 8/E, Prentice Hall, 2011; Herbert Schildt, <i>Herkes için Java</i>, Alfa, 2007; Ali Yazıcı, Erdoğan Doğdu ve ark., <i>Java Bilgisayar Programlamaya Giriş</i>, Palme, 2008.</p>
            <p><b>Değerlendirme</b> (slayt metnindeki tablo): Ara sınav 1 × %25 · Lab quizler 3 × %15 · Lab proje 1 × %10 · Final 1 × %50.</p>
            <p><b>Devam zorunluluğu:</b> derse %70, laba %80.</p>`
        },
        {
          id: 'glossary',
          title: 'Kavram sözlüğü',
          html: `<input class="gl-search" type="search" placeholder="Ara: override, checked, wrapper…" aria-label="Sözlükte ara">
            <dl class="gl-list">${glossary().map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>`
        },
        {
          id: 'exam',
          title: 'Sınav stratejisi',
          html: `
            <ul>
              <li>"Ne yazdırır?" sorularında kâğıda <b>stack ve heap</b> çiz; her <code>new</code> için yapıcı zincirini, her çağrı için <b>bildirilen / gerçek tip</b> ayrımını yaz.</li>
              <li>Tanımları <b>Türkçe + İngilizce</b> terimiyle öğren (geçersiz kılma / override).</li>
              <li>"Fark nedir?" sorularında iki kavramı <b>aynı ölçütlerle</b> karşılaştır: ne zaman, nerede, ne yapar, örnek.</li>
              <li>Ders kartlarındaki <b>"Sınav tuzağı"</b> ve <b>"Dikkat: slaytta hata"</b> kutularını sınavdan önce tekrar oku.</li>
            </ul>`
        }
      ],
      exam: [],
      examEmpty: 'Açık uçlu sorular için soldaki menüden <b>Sınav Soruları</b> sayfasını aç. Orada model cevaplar, anahtar noktalar ve aralıklı tekrar var.'
    }
  };
})(window.OOPLab = window.OOPLab || {});
