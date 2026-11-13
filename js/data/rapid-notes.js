/*
 * rapid-notes.js — Hızlandırılmış öğrenme kodlarının kenar notları.
 *
 * Her not bir kod gövdesinin (sınıf, metot, blok) hizasında, sağdaki boşlukta büyük yazıyla durur.
 * Anahtar: '<ünite id>:<kod sırası>' ya da '<ünite id>:answer' (pratik çözümü).
 * Not: [çapa, başlık, açıklama]. Çapa, gövdenin ilk satırında geçen metindir; arama bir önceki
 * notun satırından sonra başlar. Gövdenin sonu süslü parantez dengesiyle bulunur.
 * Çapaların hepsinin bulunduğunu tools/verify-rapid.js denetler.
 */
(function (OOPLab) {
  'use strict';

  const strip = (l) => l.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""').replace(/\/\/.*$/, '');
  const kindOf = (l) => (/\babstract\s+class\b/.test(l) ? 'abs'
    : /\binterface\b/.test(l) ? 'ifc'
      : /\bclass\b/.test(l) ? 'cls'
        : /\bmain\s*\(/.test(l) ? 'main' : 'mth');

  // → [{ s, e, kind, title, text }] (s/e: 0 tabanlı satır); bulunamayan çapa → null
  function resolve(src, notes) {
    const lines = String(src).replace(/^\n+|\s+$/g, '').split('\n');
    let from = 0;
    return notes.map(([anchor, title, text]) => {
      let s = -1;
      for (let i = from; i < lines.length; i++) if (lines[i].includes(anchor)) { s = i; break; }
      if (s < 0) return null;
      let depth = 0;
      let opened = false;
      let e = s;
      for (let i = s; i < lines.length; i++) {
        for (const ch of strip(lines[i])) {
          if (ch === '{') { depth++; opened = true; } else if (ch === '}') depth--;
        }
        e = i;
        if (!opened || depth <= 0) break;
      }
      from = s + 1;
      return { s, e, kind: kindOf(lines[s]), title, text };
    });
  }

  const map = {
    /* ---------------- Konu 1 */
    'k1:0': [
      ['abstract class Sekil', `Soyut sınıf`, `<code>new Sekil()</code> yapılamaz. Alanı, yapıcısı ve gövdeli metodu olabilir; alt sınıfları <code>alan()</code> yazmaya zorlar.`],
      ['public Sekil(String ad)', `Soyut sınıfın yapıcısı`, `Nesnesi yok ama yapıcısı var. Alt sınıf <code>super(ad)</code> ile çağırır.`],
      ['public abstract double alan();', `Soyut metot`, `Gövde yok, <code>;</code> ile biter. Her somut alt sınıf yazmak zorunda.`],
      ['public void bilgi()', `Somut metot soyutu çağırır`, `Çalışınca nesnenin gerçek sınıfındaki <code>alan()</code> çalışır.`],
      ['class Daire extends Sekil', `Somut alt sınıf`, `<code>super("Daire")</code> ile üst yapıcı; <code>alan()</code>'ı yazdığı için nesnesi oluşturulabilir.`],
      ['class Kare extends Sekil', `İkinci alt sınıf`, `Aynı kalıp: <code>super(...)</code> + <code>alan()</code> override.`],
      ['abstract class Cokgen', `Uygulamayan alt sınıf`, `<code>alan()</code> yazılmadıysa bu sınıf da <code>abstract</code> olmak zorunda.`],
      ['public static void main', `Soyut tip, somut nesne`, `<code>Sekil</code> referansı Daire ve Kare tutar; döngüde her nesne kendi <code>alan()</code>'ını çalıştırır.`]
    ],
    'k1:1': [
      ['interface Ucabilir', `Arayüz`, `"Yapabilir" sözleşmesi. Alanlar sabit, metotlar public abstract, yapıcı yok.`],
      ['int MAKS_IRTIFA', `Arayüz alanı = sabit`, `Otomatik <code>public static final</code>. <code>++</code> ya da atama derleme hatası.`],
      ['default void in()', `default metot`, `Java 8+: gövdeli. Uygulayan sınıf isterse override eder.`],
      ['interface Yuzebilir', `İkinci arayüz`, `Bir sınıf birden çok arayüz uygulayabilir.`],
      ['abstract class Hayvan', `Soyut üst sınıf`, `Ortak alan ve yapıcı burada; arayüz bunları tutamaz.`],
      ['class Ordek extends', `extends + implements`, `Önce tek <code>extends</code>, sonra virgüllü <code>implements</code>. Arayüz metotları <code>public</code> yazılır.`],
      ['interface AmfibikArac', `Arayüz kalıtımı`, `Arayüz arayüzü <code>extends</code> eder, birden çoğunu da.`],
      ['public static void main', `Arayüz tipinde referans`, `<code>Ucabilir u</code> yalnızca <code>uc()</code> ve <code>in()</code> görür; <code>u.yuz()</code> derleme hatası.`]
    ],
    'k1:2': [
      ['class Urun implements Comparable<Urun>', `Comparable uygulayan sınıf`, `Ürünler fiyata göre karşılaştırılabilir ve sıralanabilir olur.`],
      ['public int compareTo(Urun diger)', `compareTo`, `Küçükse negatif, eşitse 0, büyükse pozitif. <code>public</code> olmak zorunda.`],
      ['public String toString()', `toString`, `<code>println(nesne)</code> ve liste yazdırma bunu kullanır.`],
      ['class EskiUrun implements Comparable', `Eski (generic'siz) yazım`, `Parametre <code>Object</code>; içeride cast gerekir.`],
      ['public static void main', `Kullanım`, `<code>Collections.sort</code> listeyi, <code>Arrays.sort</code> diziyi sıralar; en pahalıyı compareTo ile bul.`]
    ],
    'k1:3': [
      ['class Ogrenci implements Cloneable', `Cloneable`, `Metotsuz işaretleyici arayüz. Yoksa <code>super.clone()</code> çalışmada hata atar.`],
      ['private int[] notlar', `Değiştirilebilir alanlar`, `Dizi ve liste sığ kopyada iki nesne arasında paylaşılır.`],
      ['public Ogrenci clone()', `clone() override`, `<code>super.clone()</code> sığ kopya. Diziyi ve listeyi ayrıca kopyalamak derin kopya yapar.`],
      ['public static void main', `Sonuç`, `Kopyayı değiştirmek aslını etkilemez; <code>o1 == o2</code> false.`]
    ],

    /* ---------------- Konu 2 */
    'k2:0': [
      ['class A {', `this(...) zinciri`, `<code>A()</code> önce <code>A(int)</code>'i çalıştırır, sonra kendi satırını yazar.`],
      ['class B extends A', `Gizli super()`, `<code>B()</code>'de super yazılmadı: derleyici <code>super()</code> ekler, <code>A()</code> çalışır.`],
      ['class C extends B', `this + super zinciri`, `C() → C(int) → B(int) → A(int). Yazdırmalar geri dönerken olur.`],
      ['class Ust', `Parametresiz yapıcı yok`, `Parametreli yapıcı yazılınca varsayılan yapıcı eklenmez.`],
      ['class Alt extends Ust', `Çözüm: açık super(0)`, `Gizli <code>super()</code> Ust()'yi bulamazdı; açıkça <code>super(0)</code> çağrılır.`],
      ['public static void main', `Çıktı sırası`, `En üstteki yapıcı önce biter: A, B, C sırasıyla yazılır.`]
    ],
    'k2:1': [
      ['class Hesap {', `Üst sınıf`, `<code>artir(int)</code> override edilecek; <code>sifirla()</code> final olduğu için edilemez.`],
      ['class Vadeli extends Hesap', `Alt sınıf`, `Bir overload, iki override içeriyor.`],
      ['public void artir() {', `Overload`, `Aynı isim, farklı parametre listesi: yeni bir metot.`],
      ['public void artir(int k) {', `Override`, `Aynı imza. İçinde <code>artir()</code> overload'ı, <code>super.artir(k)</code> üstteki sürümü çağırır.`],
      ['static void yaz(int x)', `Overload seçimi`, `Derlemede argüman tipine göre seçilir: int, long → double, String.`],
      ['public static void main', `İz`, `<code>v.artir(2)</code> → 10. <code>Hesap h = new Vadeli()</code>: override gerçek tipe göre → 14.`]
    ],
    'k2:2': [
      ['class Calisan {', `Üst sınıf`, `<code>toString</code> içindeki <code>maas()</code> de dinamik bağlanır.`],
      ['class Muhendis extends Calisan', `Override + yeni metot`, `<code>maas()</code> override; <code>projeYap()</code> yalnızca Muhendis'te.`],
      ['class Stajyer extends Calisan', `super.metot()`, `Üstün <code>maas()</code>'ını kullanıp yarıya indirir.`],
      ['Calisan[] ekip', `Çok biçimlilik`, `Aynı döngü, üç farklı <code>maas()</code>: gerçek tipe göre.`],
      ['if (c instanceof Muhendis)', `Downcast`, `Önce <code>instanceof</code> ile sor, sonra <code>(Muhendis)</code> ile çevir.`],
      ['Muhendis yanlis', `ClassCastException`, `Derlenir ama nesne Stajyer olduğu için çalışmada hata verir.`]
    ],
    'k2:3': [
      ['final class Nokta', `final sınıf`, `<code>extends</code> edilemez. final alanlar yapıcıda bir kez atanır.`],
      ['public boolean equals(Object o)', `equals override`, `Parametre <code>Object</code> olmalı: instanceof + cast + alanları karşılaştır.`],
      ['public static void main', `== ve equals`, `<code>==</code> adres, <code>equals</code> içerik karşılaştırır. String'leri equals ile karşılaştır.`]
    ],

    /* ---------------- Konu 3 */
    'k3:0': [
      ['class Termostat', `Kapsüllenmiş sınıf`, `Alanlar private; erişim getter ve setter ile.`],
      ['public Termostat(String ad, double sicaklik)', `Yapıcı ve this`, `<code>this.ad</code> alan, <code>ad</code> parametre. Yapıcının dönüş tipi yok.`],
      ['public Termostat(String ad)', `Yapıcı overload`, `<code>this(ad, 20.0)</code> diğer yapıcıyı çağırır.`],
      ['public void setHedef', `Doğrulamalı setter`, `Geçersiz değeri reddeder. Salt okunur alana setter yazılmaz.`],
      ['Termostat t3 = t1', `Referans kopyası`, `t3 ve t1 aynı nesne; birinden yapılan değişiklik ikisinde de görünür.`]
    ],
    'k3:1': [
      ['class Sayac', `static ve örnek alanı`, `<code>toplam</code> tüm nesnelerde tek; <code>kendi</code> her nesnede ayrı.`],
      ['public Sayac()', `Otomatik numara`, `<code>toplam++</code> ile her nesneye sıra numarası verilir.`],
      ['public static int getToplam()', `static metot`, `İçinde <code>this</code> yok; örnek alanına erişemez.`],
      ['public static void main', `Sonuç`, `İki nesneden sonra ikisi de <code>toplam=2</code> görür.`]
    ],
    'k3:2': [
      ['interface TelefonlaKontrol', `Yetenek arayüzü`, `Yalnızca bazı cihazlar uygular.`],
      ['abstract class Cihaz', `Soyut kök`, `Ortak <code>ad</code> ve soyut <code>durum()</code>.`],
      ['class Telefon {', `Yönetici sınıf`, `<code>ArrayList&lt;Cihaz&gt;</code> her alt tipi tutar.`],
      ['public void cihazEkle', `İş kuralı`, `<code>instanceof</code> ile yalnızca kontrol edilebilenleri ekler.`],
      ['public void listele', `Listeyi gezmek`, `for-each ya da <code>size()</code> + <code>get(i)</code>.`],
      ['ArrayList<Integer> puanlar', `Integer listesi`, `int otomatik kutulanır. <code>remove(Integer.valueOf(3))</code> değeri siler, <code>remove(3)</code> indeksi.`]
    ],

    /* ---------------- Konu 4 */
    'k4:0': [
      ['static String bol', `Çoklu catch + finally`, `Sayı değilse "bad input", sıfırsa "sifira bolme"; finally her durumda.`],
      ['static int f()', `return ve finally`, `finally, <code>return</code>'den önce çalışır.`],
      ['for (int i = 0; i < 4; i++)', `İstisna try'ı keser`, `<code>c[3]</code>'te hata: X atlanır, D ve E yazılır, program devam eder.`]
    ],
    'k4:1': [
      ['static void dosyaAc', `Checked + throws`, `FileNotFoundException checked: başlıkta <code>throws</code> zorunlu.`],
      ['static int yasKontrol', `Unchecked + throw`, `IllegalArgumentException için <code>throws</code> gerekmez.`],
      ['public static void main', `Yakalama`, `Checked çağrı try içinde; <code>|</code> ile çoklu catch; RuntimeException alt tiplerini yakalar.`]
    ],
    'k4:2': [
      ['class GecersizPuanException', `Özel checked istisna`, `<code>extends Exception</code>; <code>super(mesaj)</code> ile getMessage dolar.`],
      ['class TipHatasi', `İkinci istisna`, `Yalnızca mesaj taşıyan en kısa kalıp.`],
      ['public void puanEkle', `throw + throws`, `Tip yanlışsa TipHatasi, aralık dışıysa GecersizPuanException fırlatır.`],
      ['for (Object d : denemeler)', `Yakala ve devam et`, `Her deneme kendi try'ında: hata olsa da döngü sürer.`]
    ],
    'k4:3': [
      ['try (PrintWriter yaz', `Dosyaya yazma`, `try-with-resources, blok bitince <code>close()</code>'u kendisi çağırır.`],
      ['try (Scanner oku', `Dosyadan okuma`, `<code>hasNext()</code> ile döngü; <code>next()</code> kelime, <code>nextInt()</code> sayı.`]
    ],

    /* ---------------- Konu 5 */
    'k5:0': [
      ['static void degistir', `Değerle aktarım`, `x kopya, dışarıda değişmez. Dizinin içi değişir; yeni dizi ataması dışarıyı etkilemez.`],
      ['static void yazdir', `Dizi sınırı`, `<code>i &lt; a.length</code>. <code>&lt;=</code> olsaydı ArrayIndexOutOfBounds.`],
      ['if (args.length == 0)', `Boş args`, `Argüman yoksa <code>args[0]</code> hata verir; önce uzunluğu kontrol et.`],
      ['System.out.println("1" + 2 + 3)', `Birleştirme sırası`, `Soldan sağa: String'e değince sonrası metin olur.`]
    ],

    /* ---------------- Birleşik örnekler */
    'b1:0': [
      ['abstract class Device', `Soyut kök + Comparable`, `Nesnesi yok; <code>getStatus()</code> soyut; fiyata göre karşılaştırılır.`],
      ['interface Controllable', `Arayüz`, `<code>display()</code> yalnızca kontrol edilebilir cihazlarda.`],
      ['class Light extends Device implements Controllable', `Light`, `<code>super</code> ile ad ve fiyat; brightness salt okunur.`],
      ['class Thermostat extends', `Thermostat`, `Aynı kalıp, temperature alanıyla.`],
      ['class Sensor extends Device', `Arayüzsüz cihaz`, `Controllable değil: listede farklı yazdırılır.`],
      ['class DeviceManager', `Yönetici`, `ArrayList&lt;Device&gt;, instanceof ile display, Collections ile min ve sort.`],
      ['public class SmartHomeTest', `Test`, `Üç farklı cihaz tek listede: çok biçimlilik.`]
    ],
    'b2:0': [
      ['class Personel {', `Kök sınıf`, `static sayaçla id verir; yapıcı <code>tanit()</code>'i çağırır (tuzak).`],
      ['public double maas(int ay)', `Overload`, `İçindeki <code>maas()</code> dinamik bağlanır: alt sınıfınki çalışır.`],
      ['class Muhendis extends Personel', `Alan başlatma sırası`, `<code>seviye = 1</code>, super() bittikten sonra atanır; o ana kadar 0.`],
      ['class Yonetici extends Muhendis', `Üç katlı zincir`, `super(ad, 3) → this(ad) → super(ad). <code>maas()</code> iki katı.`],
      ['for (Personel p : liste)', `Döngüde dinamik bağlama`, `Her p gerçek tipinin <code>maas()</code>'ını kullanır; toplantı için cast.`],
      ['liste[0].equals(new Personel("Ali"))', `Argüman önce çalışır`, `<code>new Personel</code> yazdırır ve sayacı 4 yapar, sonra equals true.`]
    ],
    'b3:0': [
      ['class YetersizBakiyeException', `Özel checked istisna`, `Eksik tutarı mesajında taşır.`],
      ['class Hesap {', `Kapsüllenmiş hesap`, `Negatif bakiye ve geçersiz tutar unchecked; yetersiz bakiye checked.`],
      ['class Banka', `Hesap listesi`, `Yanlış sırayla <code>get</code> → IndexOutOfBoundsException.`],
      ['static void islem', `catch sırası`, `Özel → NumberFormat | IndexOutOfBounds → IllegalArgument. finally her zaman.`],
      ['public static void main', `Senaryo`, `Beş işlem, her biri farklı bir yoldan geçer.`]
    ],
    'b4:0': [
      ['abstract class Vasita', `Soyut kök`, `Hız sınırı tek yerde; Comparable + Cloneable.`],
      ['protected void hiziDegistir', `Sınır kuralı`, `Hızı 0 ile maksHiz arasında tutar.`],
      ['public Vasita clone()', `clone`, `Sığ kopya; int alanlar için yeterli.`],
      ['interface Otonom', `Ağaç dışı yetenek`, `Drone ve süpürge ortak; süpürge vasıta değil.`],
      ['class Araba extends Vasita', `Şoför kontrolü`, `Boşsa (null) ata; aynı nesneyse (==) reddet.`],
      ['class Drone extends Vasita implements Otonom', `Drone`, `Hem Vasita hem Otonom.`],
      ['class ElektrikliSupurge', `Yalnızca Otonom`, `Vasita'dan türemiyor.`],
      ['public static void main', `Test`, `Çok biçimlilik, Otonom dizisi, şoför kuralları, klon, sıralama.`]
    ],

    /* ---------------- Son gün sayfasındaki şablon */
    'ozet:template': [
      ['abstract class Kok', `Kök: soyut + Comparable`, `private alanlar, yapıcıda atama, yalnızca getter, soyut metot, compareTo.`],
      ['interface Yetenek', `Yetenek arayüzü`, `"Bazıları yapabilir" isteği.`],
      ['class AltA extends Kok implements Yetenek', `Yetenekli alt sınıf`, `İlk satır <code>super(...)</code>; soyut metot ve arayüz metodu public + @Override.`],
      ['class AltB extends Kok', `Yeteneksiz alt sınıf`, `Yalnızca soyut metodu yazar.`],
      ['class Yonetici', `Yönetici`, `ArrayList&lt;Kok&gt;, overload'lu ekle, instanceof kuralı, döngüde dinamik bağlama.`],
      ['public class Test', `main`, `Üst tip üzerinden ekleme ve listeleme = çok biçimlilik.`]
    ],

    /* ---------------- Pratik çözümleri */
    'p1:answer': [
      ['abstract class Materyal', `[B1]–[B4]`, `Comparable&lt;Materyal&gt;, yapıcıda atama, soyut <code>bilgi()</code>, yıla göre compareTo.`],
      ['interface Odunclenebilir', `[B5]`, `Üç metot, hepsi otomatik public abstract.`],
      ['class Kitap extends', `[B6]–[B9]`, `extends + implements; ödünç durumu kontrolü; gün başına 2 TL ceza.`],
      ['class Dergi extends', `[B10]`, `Yalnızca <code>bilgi()</code>; arayüz yok.`],
      ['class Kutuphane', `[B11]–[B14]`, `Liste, ekle, instanceof ile ödünç, sırala ve yazdır.`],
      ['public class KutuphaneTest', `[B15]–[B16]`, `Ekle, ödünç ver, iade et, listele.`]
    ],
    'p2:answer': [
      ['abstract class Urun', `Soyut ürün`, `Otomatik ID, fiyat kontrolü, soyut <code>kdvYuzde()</code>, ortak <code>kdvliFiyat()</code>.`],
      ['interface PaketServis', `Paket yeteneği`, `Yalnızca Yemek ve KutuIcecek uygular.`],
      ['class Yemek extends', `Yemek`, `%10 KDV, 5 TL paketleme.`],
      ['class Icecek extends Urun', `Açık içecek`, `%20 KDV, paket servis yok.`],
      ['class KutuIcecek extends Icecek', `Kutu içecek`, `KDV'yi Icecek'ten alır, paketlenebilir.`],
      ['class Siparis', `Sipariş`, `Paket kuralı instanceof ile; <code>urunEkle</code> overload; toplam ve en pahalı.`],
      ['public class RestoranTest', `Test`, `Çok biçimli menü dizisi, iki sipariş, hatalı fiyat.`]
    ],
    'p3:answer': [
      ['class NotTipiException', `İstisna 1`, `Tip hatası mesajını kurar.`],
      ['class NotAralikException', `İstisna 2`, `Aralık hatası mesajını kurar.`],
      ['class Ogrenci', `Kapsüllenmiş öğrenci`, `private alanlar, iki yapıcı.`],
      ['public void notEkle', `throw + throws`, `Önce tip, sonra aralık kontrolü.`],
      ['public double ortalama', `double bölme`, `<code>(double)</code> olmasa tam sayı bölmesi yapılırdı.`],
      ['public class NotSistemi', `Test`, `Her girdi kendi try'ında; hata mesajı yazdırılır.`]
    ],
    'p5:answer': [
      ['interface Odeme', `Sabit yalnızca okunur`, `KOMISYON değiştirilmez, sadece kullanılır.`],
      ['abstract class Hesap', `Kontrollü erişim`, `bakiye private kalır; alt sınıf protected <code>azalt()</code> kullanır.`],
      ['class Kart extends', `Düzeltilen sınıf`, `<code>super(bakiye)</code>, public <code>ode()</code> ve <code>tur()</code> eklendi.`],
      ['class Vadesiz', `Somut alt sınıf`, `Soyut Hesap yerine nesnesi oluşturulan sınıf.`]
    ]
  };

  OOPLab.rapidNotes = { map, resolve };
})(window.OOPLab = window.OOPLab || {});
