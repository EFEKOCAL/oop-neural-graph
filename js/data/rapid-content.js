/*
 * rapid-content.js — "Hızlandırılmış öğrenme" modunun içeriği (#/hizli).
 *
 * Sıra = geçmiş üç vizede (2022-23, 2024-25, 2025-26) konunun getirdiği toplam puan.
 * Üç aşama: 'konu' (yorumlu kod parçaları) → 'birlesik' (konuların bir arada kullanımı) → 'pratik'.
 *
 * Kod alanları String.raw ile yazıldı: Java'daki ters bölüler olduğu gibi kalır.
 * Her kod parçası `node tools/verify-rapid.js` ile javac --release 17 altında derlenip çalıştırılır;
 * çıktı `output` alanıyla birebir karşılaştırılır.
 *
 * snippet:  { title, main, code, output, args? }
 * practice: { q, req?, given, givenKind: 'skeleton'|'program'|'buggy', givenMain?, bugs?,
 *             answer: { main?, code?, output?, html }, rubric? }
 */
(function (OOPLab) {
  'use strict';

  const J = String.raw;

  OOPLab.rapid = {
    // Yaklaşık puan dağılımı: büyük tasarım sorularının puanı kapsadığı konulara bölündü.
    points: {
      head: ['Konu', '2025-26', '2024-25', '2022-23', 'Toplam (300)'],
      rows: [
        ['Soyut sınıf, arayüz, Comparable, Cloneable', 43, 31, 28, 102],
        ['Kalıtım, override/overload, çok biçimlilik', 22, 28, 29, 79],
        ['Sınıf, kapsülleme, static, ArrayList', 27, 13, 25, 65],
        ['İstisnalar (ve metin I/O)', 8, 16, 18, 42],
        ['Java temelleri: args, diziler, aktarım', 0, 12, 0, 12]
      ],
      note: 'Rakamlar yaklaşıktır. 40-45 puanlık tasarım soruları birden fazla konuyu ölçtüğü için puanları konulara bölündü; boşluk ve D/Y maddeleri tek tek konusuna yazıldı.'
    },

    units: [
      /* ================================================================ KONU 1 */
      {
        id: 'k1',
        stage: 'konu',
        no: '1',
        title: 'Soyut sınıf, arayüz, Comparable, Cloneable',
        points: 102,
        exam: [
          '2025-26 S5 (40p): <code>Device</code> soyut sınıfı + <code>Controllable</code> arayüzü iskeleti',
          '2025-26 S3 (15p): arayüzdeki <code>counter</code> sabitini artırmak (derleme hatası)',
          '2024-25 S6 (40p): AkıllıCihaz yapısı, telefonla kontrol arayüzü, fiyata göre Comparable',
          '2022-23 S5 (45p): soyut Vasıta, Otonom arayüzü, hıza göre Comparable',
          'Boşluk/D-Y: extends/implements, marker arayüz, compareTo, clone, soyut metot kuralları, arayüzde yapıcı olmaz'
        ],
        snippets: [
          {
            title: '1a · Soyut sınıf (abstract class)',
            main: 'SoyutSinif',
            code: J`// KONU 1a: SOYUT SINIF (abstract class)
// Tanım: "abstract" ile işaretlenen, NESNESİ OLUŞTURULAMAYAN sınıf. Ortak alanları ve metotları
//        toplar, alt sınıfları belirli metotları yazmaya ZORLAR.
// Sınav dili: "Genel bir Vasıta sınıfının nesnesi oluşturulamamalı" cümlesi = abstract class.

abstract class Sekil {                       // new Sekil(...) → DERLEME HATASI
    private String ad;                       // soyut sınıfta normal alan OLABİLİR (arayüzde olamaz)
    protected static int sayac = 0;          // static alan da olabilir

    public Sekil(String ad) {                // soyut sınıfın YAPICISI OLUR (nesnesi olmasa bile);
        this.ad = ad;                        // alt sınıf super(ad) ile bunu çağırır
        sayac++;
    }

    public String getAd() { return ad; }     // somut (gövdeli) metot: alt sınıflar aynen miras alır

    public abstract double alan();           // SOYUT METOT: gövde YOK, noktalı virgülle biter
    // public abstract double alan() { }     // HATA: soyut metodun gövdesi olamaz (boş {} bile)

    // D/Y sorularında çıkan kurallar:
    // - Soyut metot SADECE soyut sınıfta (veya arayüzde) olabilir. Somut sınıfta abstract metot → hata.
    // - Soyut sınıfın HİÇ soyut metodu olmayabilir (yine de new yapılamaz).
    //   "Soyut sınıfta soyut metot tanımlamak mecburidir" → YANLIŞ.
    // - abstract ile private / static / final birlikte kullanılamaz: üçü de override'ı engeller,
    //   oysa abstract metot override edilmek ZORUNDA.
    // - Somut bir metot, alt sınıfta abstract yapılarak "soyuta çevrilebilir" (alt sınıf da abstract
    //   olur). 2022 D/Y 10. madde bunu sordu: DOĞRU.

    public void bilgi() {                    // somut metot soyut metodu ÇAĞIRABİLİR:
        System.out.println(ad + " alani = " + alan());   // çalışınca alt sınıfın alan()'ı çalışır
    }
}

class Daire extends Sekil {
    private double r;
    public Daire(double r) {
        super("Daire");                      // ilk satır: üst sınıfın yapıcısı
        this.r = r;
    }
    @Override
    public double alan() { return 3 * r * r; }   // soyut metodu UYGULADI → Daire somut sınıf
}

class Kare extends Sekil {
    private double a;
    public Kare(double a) { super("Kare"); this.a = a; }
    @Override
    public double alan() { return a * a; }
}

// alan()'ı uygulamayan alt sınıf SOYUT kalmak ZORUNDA:
abstract class Cokgen extends Sekil {        // "abstract" silinirse: "Cokgen is not abstract and does
    public Cokgen(String ad) { super(ad); }  //  not override abstract method alan()" derleme hatası
}

public class SoyutSinif {
    public static void main(String[] args) {
        // Sekil s = new Sekil("x");         // HATA: Sekil is abstract; cannot be instantiated
        Sekil s1 = new Daire(2);             // ama Sekil REFERANS TİPİ olarak kullanılabilir
        Sekil s2 = new Kare(3);
        Sekil[] dizi = { s1, s2 };           // soyut tipte dizi de olur (elemanlar somut nesneler)
        for (Sekil s : dizi) {
            s.bilgi();                       // çok biçimlilik: her nesne kendi alan()'ını çalıştırır
        }
        System.out.println("Olusan sekil: " + Sekil.sayac);
    }
}`,
            output: 'Daire alani = 12.0\nKare alani = 9.0\nOlusan sekil: 2'
          },
          {
            title: '1b · Arayüz (interface)',
            main: 'Arayuz',
            code: J`// KONU 1b: ARAYÜZ (interface)
// Tanım: Bir sınıfın NE YAPABİLECEĞİNİ söyleyen sözleşme.
//   Soyut sınıf → "bir türüdür" (is-a): Drone bir Vasita'dır.
//   Arayüz      → "yapabilir" (can-do): Drone otonom hareket EDEBİLİR, süpürge de.
// Ne zaman hangisi? Ortak ALAN/YAPICI gerekiyorsa veya nesnesi olmamalıysa → soyut sınıf.
//   Yetenek SADECE BAZI sınıflarda varsa ya da farklı sınıf ağaçlarına yayılıyorsa → arayüz.

interface Ucabilir {
    int MAKS_IRTIFA = 1000;      // arayüzdeki HER alan otomatik public static final → SABİT.
                                 // MAKS_IRTIFA++ veya = 5 → DERLEME HATASI (2025 vize S3: ++counter)
    void uc();                   // gövdesiz metot otomatik public abstract
                                 // (2024 D/Y "arayüzde tüm metotlar varsayılan public abstract":
                                 //  klasik kural bu; Java 8'den beri default/static metotlar istisna)
    default void in() {          // Java 8+: default metot gövdelidir, uygulayan sınıf isterse override eder
        System.out.println("Inis yapiliyor");
    }
    static int irtifaSiniri() {  // static metot: Ucabilir.irtifaSiniri() ile çağrılır
        return MAKS_IRTIFA;
    }
    // Ucabilir() { }            // HATA: arayüzün YAPICISI OLMAZ (2024 D/Y 8: YANLIŞ)
}

interface Yuzebilir {
    void yuz();
}

abstract class Hayvan {
    protected String ad;
    public Hayvan(String ad) { this.ad = ad; }
    public abstract void sesCikar();
}

// SIRA KURALI: önce extends (TEK sınıf), sonra implements (virgülle BİRDEN ÇOK arayüz)
//   class Ordek implements Ucabilir extends Hayvan → HATA (sıra ters)
//   class X extends A, B                          → HATA: sınıflarda çoklu kalıtım YOK,
//                                                   çoklu kalıtımın yerini arayüzler tutar
class Ordek extends Hayvan implements Ucabilir, Yuzebilir {
    public Ordek(String ad) { super(ad); }

    @Override
    public void sesCikar() { System.out.println(ad + ": vak"); }

    @Override
    public void uc() { System.out.println(ad + " ucuyor"); }
    // void uc() { }   // HATA: arayüz metodu public; override ederken erişim DARALTILAMAZ
    //                 // ("attempting to assign weaker access privileges; was public")

    @Override
    public void yuz() { System.out.println(ad + " yuzuyor"); }
}

// Arayüz başka arayüzleri EXTENDS eder (implements değil), hem de birden çoğunu:
interface AmfibikArac extends Ucabilir, Yuzebilir { }

// Çakışma kuralı (2025 boşluk): iki arayüzde AYNI imza ama FARKLI dönüş tipi varsa
//   interface A { int f(); }   interface B { String f(); }   class C implements A, B { ... }
//   → DERLEME HATASI (tek metot iki dönüş tipini karşılayamaz).
// Aynı imza + aynı dönüş tipi ise sorun yok: tek bir f() ikisini de karşılar.

public class Arayuz {
    public static void main(String[] args) {
        Ordek o = new Ordek("Donald");
        Ucabilir u = o;            // arayüz REFERANS tipi olabilir (new Ucabilir() → HATA)
        u.uc();
        // u.yuz();                // HATA: derleyici referans tipine (Ucabilir) bakar, orada yuz() yok
        u.in();                    // default metot miras gelir
        System.out.println(o instanceof Yuzebilir);    // instanceof arayüzle de çalışır
        System.out.println(Ucabilir.irtifaSiniri());
        Hayvan h = o;
        h.sesCikar();
    }
}`,
            output: 'Donald ucuyor\nInis yapiliyor\ntrue\n1000\nDonald: vak'
          },
          {
            title: '1c · Comparable ve compareTo',
            main: 'Karsilastir',
            code: J`import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

// KONU 1c: Comparable — nesneleri karşılaştırılabilir / sıralanabilir yapmak
// Üç tasarım sorusunun üçünde de var: "fiyat bilgisi karşılaştırılabilir olmalı", "hızlarına göre".
// java.lang.Comparable<T> arayüzü TEK metot ister:   int compareTo(T diger)
//   this < diger → NEGATİF,   eşit → 0,   this > diger → POZİTİF   (sadece işaret önemli)

class Urun implements Comparable<Urun> {          // <Urun>: neyle karşılaştırılacağı
    private String ad;
    private double fiyat;

    public Urun(String ad, double fiyat) { this.ad = ad; this.fiyat = fiyat; }
    public double getFiyat() { return fiyat; }
    public String getAd() { return ad; }

    @Override
    public int compareTo(Urun diger) {            // public ZORUNLU (arayüz metodu)
        // double alanda (int)(fiyat - diger.fiyat) YAZMA: 0.5 farkı 0'a yuvarlanır → "eşit" sanılır
        if (this.fiyat < diger.fiyat) return -1;
        if (this.fiyat > diger.fiyat) return 1;
        return 0;
        // kısa yol: return Double.compare(this.fiyat, diger.fiyat);
        // int alan:  return Integer.compare(this.hiz, diger.hiz);   veya   return hiz - diger.hiz;
    }

    @Override
    public String toString() { return ad + "(" + fiyat + ")"; }   // println(nesne) bunu çağırır
}

// Kitaptaki (Liang) eski yazım: generic olmadan. Parametre Object → cast gerekir.
class EskiUrun implements Comparable {
    int fiyat;
    EskiUrun(int f) { fiyat = f; }
    public int compareTo(Object o) {
        EskiUrun d = (EskiUrun) o;                // downcast; yanlış tip gelirse ClassCastException
        return fiyat - d.fiyat;
    }
}

public class Karsilastir {
    public static void main(String[] args) {
        Urun a = new Urun("Kalem", 12.5);
        Urun b = new Urun("Defter", 30);
        System.out.println(a.compareTo(b));       // negatif → a daha ucuz

        ArrayList<Urun> liste = new ArrayList<>();
        liste.add(b);
        liste.add(a);
        liste.add(new Urun("Silgi", 5));
        Collections.sort(liste);                  // compareTo'ya göre küçükten büyüğe
        System.out.println(liste);                // ArrayList.toString → [e1, e2, ...]

        Urun[] dizi = { b, a };
        Arrays.sort(dizi);                        // dizi için Arrays.sort
        System.out.println(dizi[0].getAd());

        // En pahalıyı bulmak (sınavda sık): compareTo ile tek geçiş
        Urun enPahali = liste.get(0);
        for (Urun u : liste) {
            if (u.compareTo(enPahali) > 0) enPahali = u;
        }
        System.out.println("En pahali: " + enPahali);
        // Comparable uygulamayan sınıfla Collections.sort(liste) → derleme hatası;
        // Arrays.sort(dizi) → çalışma anında ClassCastException.
        System.out.println(new EskiUrun(3).compareTo(new EskiUrun(7)));
    }
}`,
            output: '-1\n[Silgi(5.0), Kalem(12.5), Defter(30.0)]\nKalem\nEn pahali: Defter(30.0)\n-4'
          },
          {
            title: '1d · Cloneable ve clone() (sığ / derin kopya)',
            main: 'Klonlama',
            code: J`import java.util.ArrayList;

// KONU 1d: Cloneable ve clone()
// Cloneable = İŞARETLEYİCİ (marker) arayüz: İÇİNDE HİÇ METOT YOK. Görevi JVM'e "bu sınıfın
//   nesneleri kopyalanabilir" demek (2025 boşluk: "marker", "belirtmek/işaretlemek").
// clone() metodu Cloneable'da DEĞİL, Object sınıfındadır ve protected'dır:
//   protected Object clone() throws CloneNotSupportedException
// Cloneable uygulamadan super.clone() çağırırsan → ÇALIŞMA ANINDA CloneNotSupportedException.
// Sığ kopya (shallow): alanlar birebir kopyalanır; referans alanlar AYNI nesneyi gösterir.
// Derin kopya (deep): değiştirilebilir referans alanlar (dizi, liste) da ayrıca kopyalanır.

class Ogrenci implements Cloneable {
    private String ad;                         // String değişmez (immutable): paylaşılması sorun değil
    private int[] notlar;                      // dizi DEĞİŞTİRİLEBİLİR: sığ kopyada PAYLAŞILIR
    private ArrayList<String> dersler = new ArrayList<>();

    public Ogrenci(String ad, int[] notlar) { this.ad = ad; this.notlar = notlar; }

    public void setNot(int i, int deger) { notlar[i] = deger; }
    public void dersEkle(String d) { dersler.add(d); }

    @Override
    public Ogrenci clone() {                   // protected → public yapılabilir (genişletmek serbest)
                                               // dönüş tipi Object yerine Ogrenci olabilir (kovaryant)
        try {
            Ogrenci kopya = (Ogrenci) super.clone();   // sığ kopya
            kopya.notlar = notlar.clone();             // derin: diziyi ayrıca kopyala
            kopya.dersler = new ArrayList<>(dersler);  // derin: listeyi yeni liste olarak kopyala
            return kopya;
        } catch (CloneNotSupportedException e) {       // checked istisna: yakala veya throws yaz
            return null;                               // Cloneable uygulandığı için buraya gelinmez
        }
    }

    @Override
    public String toString() { return ad + " " + notlar[0] + " " + dersler; }
}

public class Klonlama {
    public static void main(String[] args) {
        Ogrenci o1 = new Ogrenci("Ali", new int[] {50, 60});
        o1.dersEkle("NYP");
        Ogrenci o2 = o1.clone();
        o2.setNot(0, 100);                     // derin kopya olduğu için o1 etkilenmez
        o2.dersEkle("Veri Yapilari");
        System.out.println(o1);
        System.out.println(o2);
        System.out.println(o1 == o2);          // false: farklı nesneler (== adres karşılaştırır)
        // clone() içinde SADECE super.clone() olsaydı (sığ kopya):
        //   o2.setNot(0, 100) o1'in notunu da 100 yapardı → "çıktı ne?" sorusunun klasik tuzağı.
    }
}`,
            output: 'Ali 50 [NYP]\nAli 100 [NYP, Veri Yapilari]\nfalse'
          }
        ]
      },

      /* ================================================================ KONU 2 */
      {
        id: 'k2',
        stage: 'konu',
        no: '2',
        title: 'Kalıtım, override/overload, çok biçimlilik',
        points: 79,
        exam: [
          '2025-26 S2 (15p): resize() override + overload izi; A/B/C yapıcı zinciri',
          '2024-25 S3 (5p) SimpleCalc, S7 (7p) Cihaz/Tablet overload-override çıktısı',
          '2022-23 S3 (10p) this() zinciri ve Parent/Child yapıcıları, S4 (5p) super() eksik',
          'Boşluk/D-Y: dinamik bağlama, final metot/sınıf, instanceof, casting, toString, super'
        ],
        snippets: [
          {
            title: '2a · Kalıtım ve yapıcı zinciri (super / this)',
            main: 'YapiciZinciri',
            code: J`// KONU 2a: KALITIM ve YAPICI ZİNCİRİ
// extends: alt sınıf üst sınıfın public/protected üyelerini MİRAS ALIR. private alanlar nesnede
//   VARDIR ama alt sınıf onlara doğrudan erişemez (getter veya super(...) ile kurar).
// Yapıcılar MİRAS ALINMAZ. Ama alt sınıf yapıcısı HER ZAMAN önce üst sınıf yapıcısını çalıştırır.
// Kural 1: Yapıcının ilk satırı super(...) ya da this(...) değilse derleyici GİZLİCE super(); ekler.
// Kural 2: super(...) ve this(...) SADECE ilk satırda olabilir → ikisi aynı yapıcıda OLAMAZ.
// Kural 3: Hiç yapıcı yazmazsan derleyici PARAMETRESİZ, boş varsayılan yapıcı ekler.
//          Tek bir yapıcı yazarsan (ör. parametreli) varsayılan yapıcı EKLENMEZ.
//          (2024 D/Y 1: "varsayılan bir PARAMETRELİ yapıcı ekler" → YANLIŞ)
// Kural 4: Yapıcının dönüş tipi YOKTUR (void bile yazılmaz). 2022 D/Y 4 → YANLIŞ.
// Çıktı sorularında yöntem: çağrıyı en üste kadar takip et, yazdırmalar GERİ DÖNERKEN olur.

class A {
    public A() {
        this(5);                                   // aynı sınıftaki A(int)'i çağırır
        System.out.println("A()");
    }
    public A(int x) {                              // ilk satırda bir şey yok → gizli super() → Object()
        System.out.println("A(int) " + x);
    }
}

class B extends A {
    public B() {
        // ilk satır yazılmadı → derleyici super(); ekledi → A() → A(int)
        System.out.println("B()");
    }
    public B(int y) {
        super(y * 2);                              // A() atlanır, doğrudan A(int)
        System.out.println("B(int) " + y);
    }
}

class C extends B {
    public C() {
        this(1);                                   // önce C(int)
        System.out.println("C()");
    }
    public C(int z) {
        super(z + 10);                             // B(int 11) → A(int 22)
        System.out.println("C(int) " + z);
    }
}

// 2022 vize S4: üst sınıfta PARAMETRESİZ yapıcı yoksa
class Ust { public Ust(int x) { } }                // parametreli yapıcı var → Ust() artık YOK
// class Alt extends Ust { public Alt() { } }     // HATA: gizli super() çağrısı Ust()'yi bulamaz
// Çözüm 1: Alt'ın ilk satırına super(0); yaz.   Çözüm 2: Ust'e public Ust() { } ekle.
class Alt extends Ust {
    public Alt() { super(0); System.out.println("Alt()"); }
}

public class YapiciZinciri {
    public static void main(String[] args) {
        new B();                                   // A(int) 5, A(), B()
        System.out.println("---");
        new C();                                   // en üstteki önce biter
        System.out.println("---");
        new Alt();
    }
}`,
            output: 'A(int) 5\nA()\nB()\n---\nA(int) 22\nB(int) 11\nC(int) 1\nC()\n---\nAlt()'
          },
          {
            title: '2b · Override ve overload',
            main: 'OverrideOverload',
            code: J`// KONU 2b: OVERRIDE (geçersiz kılma) ve OVERLOAD (aşırı yükleme)
//
//                 OVERRIDE                                 OVERLOAD
// Nerede?         Alt sınıf, üstteki metodu yeniden yazar  Aynı isim, aynı sınıfta ya da miras alınanla
// İmza            AYNI (isim + parametre listesi)          FARKLI parametre listesi (sayı/tip/sıra)
// Dönüş tipi      Aynı veya alt tipi (kovaryant)           Önemsiz; SADECE dönüş tipi farklıysa → HATA
// Erişim          Daraltılamaz (public → protected HATA)   Serbest
// Ne zaman seçilir ÇALIŞMA zamanı: nesnenin GERÇEK tipi    DERLEME zamanı: argümanların tipi
// Override EDİLEMEYENLER:
//   final metot   → derleme hatası (2022 D/Y 6: "final metot override edilebilir" → YANLIŞ)
//   private metot → alt sınıfta görünmez; aynı isimli metot yeni bir metottur
//   static metot  → "gizleme" (hiding) olur, çok biçimli değildir
// Override için üst metodun erişimi private OLMAMALI (2024 boşluk: public/protected).

class Hesap {
    int deger = 1;
    public void artir(int k) {                 // (1)
        deger *= k;
    }
    public final void sifirla() { deger = 0; } // alt sınıfta yeniden yazılırsa DERLEME HATASI
    public String tur() { return "Hesap"; }
}

class Vadeli extends Hesap {
    public void artir() {                      // (2) OVERLOAD: parametre listesi farklı, YENİ metot
        deger += 3;
    }
    @Override                                  // imza tutmazsa derleyici hata verir: hep yaz
    public void artir(int k) {                 // (3) OVERRIDE: (1) ile aynı imza
        artir();                               // parametresiz olan → (2)
        super.artir(k);                        // super. → üst sınıftaki (1), override'ı atlar
        deger += 2;
    }
    @Override
    public String tur() { return "Vadeli"; }
    // public int tur() { ... }               // HATA: aynı imza, uyumsuz dönüş tipi
    // protected String tur() { ... }         // HATA: erişim daraltıldı
}

public class OverrideOverload {
    static void yaz(int x)    { System.out.println("int " + x); }
    static void yaz(double x) { System.out.println("double " + x); }
    static void yaz(String x) { System.out.println("String " + x); }

    public static void main(String[] args) {
        Vadeli v = new Vadeli();
        v.artir(2);                            // (3): 1+3=4 → 4*2=8 → 8+2=10  (2025 vize S2 kalıbı)
        System.out.println(v.deger);

        Hesap h = new Vadeli();                // referans Hesap, nesne Vadeli
        h.artir(3);                            // override → gerçek tip → (3): 4 → 12 → 14
        System.out.println(h.deger + " " + h.tur());
        // h.artir();                          // HATA: Hesap'ta artir() yok. Derleyici REFERANS tipine bakar.

        yaz(5);                                // overload derlemede seçilir: int
        yaz(5L);                               // long için birebir yok → genişletme → double
        yaz("5");
    }
}`,
            output: '10\n14 Vadeli\nint 5\ndouble 5.0\nString 5'
          },
          {
            title: '2c · Çok biçimlilik, dinamik bağlama, instanceof, casting',
            main: 'Polimorfizm',
            code: J`// KONU 2c: ÇOK BİÇİMLİLİK (polymorphism), DİNAMİK BAĞLAMA, instanceof, TİP DÖNÜŞÜMÜ (casting)
// Çok biçimlilik: üst tip referansı alt tip nesnesini gösterebilir:  Calisan c = new Muhendis(..);
// Dinamik bağlama (dynamic binding): hangi override'ın çalışacağı ÇALIŞMA ZAMANINDA, nesnenin
//   GERÇEK tipine göre seçilir. JVM gerçek sınıftan başlayıp yukarı arar (Muhendis → Calisan → Object).
//   2024 boşluk: "çalışma zamanında hangi metodun çağrılacağını belirleyen mekanizma" = dinamik bağlama.
// Derleyicinin sorusu: "Bu metot REFERANS tipinde var mı?"   JVM'in sorusu: "Gerçek nesnenin hangisi?"

class Calisan {
    protected String ad;
    public Calisan(String ad) { this.ad = ad; }
    public double maas() { return 1000; }
    @Override
    public String toString() { return ad + " " + maas(); }    // maas() burada da DİNAMİK bağlanır
}

class Muhendis extends Calisan {
    public Muhendis(String ad) { super(ad); }
    @Override
    public double maas() { return 3000; }
    public void projeYap() { System.out.println(ad + " proje yapiyor"); }   // sadece Muhendis'te
}

class Stajyer extends Calisan {
    public Stajyer(String ad) { super(ad); }
    @Override
    public double maas() { return super.maas() / 2; }   // üst sürümü kullanıp değiştirmek
}

public class Polimorfizm {
    public static void main(String[] args) {
        Calisan[] ekip = { new Calisan("Ayse"), new Muhendis("Can"), new Stajyer("Ece") };
        double toplam = 0;
        for (Calisan c : ekip) {                // aynı satır, üç farklı davranış = çok biçimlilik
            System.out.println(c);              // println → toString() → maas() (gerçek tipin)
            toplam += c.maas();
        }
        System.out.println("Toplam: " + toplam);

        // UPCASTING (alt → üst): otomatik ve güvenli. Muhendis bir Calisan'dır.
        Calisan c = new Muhendis("Deniz");
        // c.projeYap();                        // DERLEME HATASI: Calisan tipinde projeYap yok
        // DOWNCASTING (üst → alt): AÇIKÇA yazılır. Önce instanceof ile kontrol et:
        if (c instanceof Muhendis) {            // instanceof çalışma zamanında nesnenin tipini sorar
            Muhendis m = (Muhendis) c;          //   ve boolean döndürür (2025 boşluk)
            m.projeYap();
        }
        Calisan s = new Stajyer("Efe");
        System.out.println(s instanceof Calisan);    // true: alt sınıf nesnesi üst sınıfın da örneğidir
        System.out.println(s instanceof Muhendis);   // false
        try {
            Muhendis yanlis = (Muhendis) s;     // DERLENİR (Calisan bir Muhendis olabilirdi)
        } catch (ClassCastException e) {        // ama nesne Stajyer → ÇALIŞMADA ClassCastException
            System.out.println("ClassCastException");
        }
        // Stajyer x = (Stajyer) new Muhendis("x");   // kardeş sınıflar arası cast → DERLEME HATASI
        // null instanceof Calisan                    // her zaman false
    }
}`,
            output: 'Ayse 1000.0\nCan 3000.0\nEce 500.0\nToplam: 4500.0\nDeniz proje yapiyor\ntrue\nfalse\nClassCastException'
          },
          {
            title: '2d · Object sınıfı: toString, equals, == ve final',
            main: 'ObjectMetotlari',
            code: J`// KONU 2d: Object sınıfı, toString / equals, final
// Her sınıf (extends yazmasan da) Object'ten türer. Object'in sınavlık metotları:
//   toString(): nesnenin String gösterimi. Override edilmezse "SinifAdi@hashkod" (Nokta@1b6d3586).
//              (2024 boşluk: "Object sınıfında tanımlı, string gösterimini döndüren metot")
//   equals(Object o): override edilmezse == ile aynıdır → ADRES karşılaştırır.
//   clone() (protected), hashCode(), getClass()
// == : primitive'de DEĞERİ, referansta ADRESİ karşılaştırır. İçerik için equals.
// final: final değişken = sabit, final metot = override edilemez, final sınıf = extends edilemez.

final class Nokta {                        // final sınıf (String ve Integer da final)
    private final int x, y;                // final alan: yapıcıda bir kez atanır, sonra değişmez
    public Nokta(int x, int y) { this.x = x; this.y = y; }

    @Override
    public String toString() { return "(" + x + "," + y + ")"; }

    @Override
    public boolean equals(Object o) {      // parametre Object OLMALI. equals(Nokta o) yazarsan
                                           // override değil OVERLOAD olur (sık hata)
        if (this == o) return true;
        if (!(o instanceof Nokta)) return false;   // null ve başka tipler → false
        Nokta n = (Nokta) o;                       // downcast
        return x == n.x && y == n.y;
    }
}
// class Nokta3D extends Nokta { }        // HATA: cannot inherit from final Nokta

public class ObjectMetotlari {
    public static void main(String[] args) {
        Nokta a = new Nokta(1, 2);
        Nokta b = new Nokta(1, 2);
        System.out.println(a);                 // println otomatik a.toString() çağırır
        System.out.println(a == b);            // false: iki ayrı nesne
        System.out.println(a.equals(b));       // true: içerik aynı
        Object o = a;
        System.out.println(o.toString());      // dinamik bağlama: Nokta'nın toString'i
        String s1 = "NYP", s2 = new String("NYP");
        System.out.println(s1 == s2);          // false (farklı nesneler)
        System.out.println(s1.equals(s2));     // true → String'leri equals ile karşılaştır
        final int SINIR = 10;                  // final yerel değişken; SINIR = 11 → HATA
        System.out.println(SINIR);
    }
}`,
            output: '(1,2)\nfalse\ntrue\n(1,2)\nfalse\ntrue\n10'
          }
        ]
      },

      /* ================================================================ KONU 3 */
      {
        id: 'k3',
        stage: 'konu',
        no: '3',
        title: 'Sınıf, kapsülleme, static, ArrayList',
        points: 65,
        exam: [
          '2025-26 S4 (15p): static <code>count</code> değişkeninin iki nesnede de 2 çıkması',
          'Tüm tasarım soruları: private alan + yapıcıda atama + yalnızca getter; yönetici sınıf + ArrayList',
          '2024-25 S6: <code>cihazEkle</code> → "telefonla kontrol edilebiliyorsa eklensin" (instanceof kuralı)',
          '2022-23 S5 şoför kontrolü (null / aynı nesne), S6 Ogrenci kapsülleme, boşluk: <code>new</code>, yapıcı, <code>private</code>'
        ],
        snippets: [
          {
            title: '3a · Sınıf, nesne, kapsülleme, erişim belirleyiciler, this',
            main: 'Kapsulleme',
            code: J`// KONU 3a: SINIF, NESNE, KAPSÜLLEME (encapsulation), ERİŞİM BELİRLEYİCİLER, this
// Sınıf = şablon (alanlar + metotlar + yapıcılar). Nesne = new ile heap'te oluşturulan örnek (instance).
//   "Nesne ve sınıf aynı kavramdır" (2022 D/Y 2) → YANLIŞ.
// new: nesneyi oluşturur ve YAPICIYI çağırır (2022 boşluk: "new", "yapıcı/constructor").
// Kapsülleme: alanlar private, erişim kontrollü public getter/setter ile. Sınavdaki kalıp cümle:
//   "encapsulation ilkesine uygun tanımlanmalı, constructor içinde atanmalı ve YALNIZCA getter ile
//    erişilmeli" → private alan + yapıcıda atama + getter VAR, setter YOK (salt okunur alan).
//
// Erişim:                 aynı sınıf   aynı paket   alt sınıf (başka paket)   her yer
//   private                    +            -               -                    -
//   (yazılmamış: default)      +            +               -                    -
//   protected                  +            +               +                    -
//   public                     +            +               +                    +

class Termostat {
    private String ad;                         // private: sınıf dışından t.ad yazılamaz
    private double sicaklik;                   // salt okunur alan: sadece getter
    private int hedef;                         // okunur-yazılır: getter + DOĞRULAMALI setter

    public Termostat(String ad, double sicaklik) {   // yapıcı: sınıfla AYNI isim, dönüş tipi YOK
        this.ad = ad;                          // this.ad = alan, ad = parametre (gölgeleme/shadowing)
        this.sicaklik = sicaklik;              // "this" yazılmasa: sicaklik = sicaklik → alan değişmez
        this.hedef = 21;
    }
    public Termostat(String ad) {              // yapıcı OVERLOAD
        this(ad, 20.0);                        // this(...): aynı sınıftaki diğer yapıcı, ilk satırda
    }
    // void Termostat() { }                   // dönüş tipi yazılırsa YAPICI DEĞİL, sıradan metot olur

    public String getAd() { return ad; }
    public double getSicaklik() { return sicaklik; }
    public int getHedef() { return hedef; }

    public void setHedef(int hedef) {          // setter'ın işi: geçersiz durumu engellemek
        if (hedef < 10 || hedef > 30) {
            System.out.println("Gecersiz hedef: " + hedef);
            return;
        }
        this.hedef = hedef;
    }
}

public class Kapsulleme {
    public static void main(String[] args) {
        Termostat t1 = new Termostat("Salon", 22.5);
        Termostat t2 = new Termostat("Mutfak");
        // t1.sicaklik = 99;                   // HATA: sicaklik has private access in Termostat
        t1.setHedef(45);
        t1.setHedef(24);
        System.out.println(t1.getAd() + " " + t1.getSicaklik() + " hedef " + t1.getHedef());
        System.out.println(t2.getAd() + " " + t2.getSicaklik() + " hedef " + t2.getHedef());

        Termostat t3 = t1;                     // REFERANS kopyalanır, nesne değil: t3 ve t1 aynı nesne
        t3.setHedef(18);
        System.out.println(t1.getHedef());     // 18
        Termostat bos = null;                  // null: hiçbir nesneyi göstermiyor
        // bos.getAd();                        // derlenir ama ÇALIŞMADA NullPointerException
        System.out.println(bos == null);
    }
}`,
            output: 'Gecersiz hedef: 45\nSalon 22.5 hedef 24\nMutfak 20.0 hedef 21\n18\ntrue'
          },
          {
            title: '3b · static (sınıf üyesi) ve örnek üyesi',
            main: 'StaticOrnek',
            code: J`// KONU 3b: static (sınıf üyesi) ve örnek (instance) üyesi
// Örnek alanı: her nesnenin KENDİ kopyası vardır.
// static alan: SINIFA aittir, TÜM nesneler TEK kopyayı paylaşır (2025 vize S4: Count = 2, Count = 2).
// static metot: nesne olmadan Sinif.metot() ile çağrılır; içinde this YOK, örnek alanlarına
//   doğrudan erişemez (hangi nesnenin alanı? belli değil). main de static olduğu için main'den
//   doğrudan çağırdığın yardımcı metotlar da static olmalı.
// static final = sınıf sabiti (Math.PI gibi). İsimlendirme: BUYUK_HARF.

class Sayac {
    static int toplam = 0;                     // paylaşılan
    int kendi = 0;                             // her nesneye ayrı
    static final int LIMIT = 3;
    private int no;

    public Sayac() {
        toplam++;                              // hepsi aynı değişkeni artırır
        kendi++;                               // her nesnede 0 → 1
        no = toplam;                           // nesneye sıra numarası (sınavda sık: otomatik ID)
    }
    public static int getToplam() {
        // return kendi;                       // HATA: non-static variable cannot be referenced
        //                                     //       from a static context
        return toplam;
    }
    public void yaz() {                        // örnek metodu hem static hem örnek alanına erişir
        System.out.println("no=" + no + " kendi=" + kendi + " toplam=" + toplam);
    }
}

public class StaticOrnek {
    static int kare(int x) { return x * x; }

    public static void main(String[] args) {
        Sayac a = new Sayac();
        Sayac b = new Sayac();
        a.yaz();                               // toplam ikisinde de 2: yazdırma iki nesne oluştuktan sonra
        b.yaz();
        System.out.println(Sayac.getToplam()); // static'e sınıf adıyla eriş (a.toplam da derlenir)
        System.out.println(kare(Sayac.LIMIT));
    }
}`,
            output: 'no=1 kendi=1 toplam=2\nno=2 kendi=1 toplam=2\n2\n9'
          },
          {
            title: '3c · ArrayList ve yönetici sınıf',
            main: 'ListeYonetici',
            code: J`import java.util.ArrayList;

// KONU 3c: ArrayList ve "yönetici" sınıf (DeviceManager, KisiselTelefon, Yarisma...)
// ArrayList<T>: boyutu kendiliğinden büyüyen liste. T bir SINIF tipi olmalı:
//   ArrayList<int> → HATA,  ArrayList<Integer> → doğru (Integer = int'in sarmalayıcı/wrapper sınıfı;
//   int ↔ Integer dönüşümü otomatik: autoboxing / unboxing).
// Metotlar: add(x), add(i, x), get(i), set(i, x), remove(i) / remove(nesne), size(), contains(x),
//   isEmpty(), indexOf(x), clear().
// Uzunluk: dizi → length (alan) | String → length() (metot) | ArrayList → size()

interface TelefonlaKontrol { void uzaktanAc(); }

abstract class Cihaz {
    private String ad;
    public Cihaz(String ad) { this.ad = ad; }
    public String getAd() { return ad; }
    public abstract String durum();
}
class Lamba extends Cihaz {
    public Lamba(String ad) { super(ad); }
    public String durum() { return getAd() + ": isik"; }   // private ad'a getter ile erişim
}
class Klima extends Cihaz implements TelefonlaKontrol {
    public Klima(String ad) { super(ad); }
    public String durum() { return getAd() + ": sogutma"; }
    public void uzaktanAc() { System.out.println(getAd() + " telefondan acildi"); }
}

class Telefon {
    private ArrayList<Cihaz> cihazlar = new ArrayList<>();   // liste tipi ÜST sınıf → çok biçimlilik:
                                                             // hem Lamba hem Klima eklenebilir
    public void cihazEkle(Cihaz c) {
        if (c instanceof TelefonlaKontrol) {   // iş kuralı: "kontrol edilebiliyorsa eklensin" (2024 S6)
            cihazlar.add(c);
            System.out.println(c.getAd() + " eklendi");
        } else {
            System.out.println(c.getAd() + " eklenemez");
        }
    }
    public void listele() {
        for (Cihaz c : cihazlar) {             // for-each
            System.out.println(c.durum());
        }
        for (int i = 0; i < cihazlar.size(); i++) {               // indeksli: size() ve get(i)
            ((TelefonlaKontrol) cihazlar.get(i)).uzaktanAc();     // listedekilerin hepsi kontrol edilebilir
        }
    }
    public int adet() { return cihazlar.size(); }
}

public class ListeYonetici {
    public static void main(String[] args) {
        Telefon t = new Telefon();
        t.cihazEkle(new Lamba("Lamba1"));
        t.cihazEkle(new Klima("Klima1"));
        t.listele();
        System.out.println("Adet: " + t.adet());

        ArrayList<Integer> puanlar = new ArrayList<>();
        puanlar.add(7);                        // autoboxing: int → Integer
        puanlar.add(3);
        int ilk = puanlar.get(0);              // unboxing: Integer → int
        puanlar.remove(Integer.valueOf(3));    // remove(3) yazılsaydı İNDEKS 3'ü silmeye çalışırdı
        System.out.println(ilk + " " + puanlar + " " + puanlar.contains(7));
    }
}`,
            output: 'Lamba1 eklenemez\nKlima1 eklendi\nKlima1: sogutma\nKlima1 telefondan acildi\nAdet: 1\n7 [7] true'
          }
        ]
      },

      /* ================================================================ KONU 4 */
      {
        id: 'k4',
        stage: 'konu',
        no: '4',
        title: 'İstisnalar (ve metin I/O)',
        points: 42,
        exam: [
          '2024-25 S5 (12p): <code>java Exceptional 4 2 / 3 null / 1 0 / 2</code> komutlarının çıktısı',
          '2022-23 S6 (25p): kendi istisna sınıfın; TypeError / ValueError mesajları',
          '2025-26: iç içe try-catch-finally çıktısı (ABCD / E / G)',
          'Boşluk/D-Y: catch, throw, throws, iki kontrolsüz istisna adı, NullPointerException, RuntimeException derlemede denetlenmez'
        ],
        snippets: [
          {
            title: '4a · try - catch - finally akışı',
            main: 'TryAkisi',
            code: J`// KONU 4a: try - catch - finally AKIŞI (çıktı sorularının en sevileni)
// try: hata çıkabilecek kod. İstisna olunca try'ın KALANI ATLANIR, uyan İLK catch'e gidilir.
// catch: yukarıdan aşağı İLK UYAN çalışır (alt tip de uyar). En fazla BİR catch çalışır.
//   Sıra kuralı: alt sınıfın catch'i üstte olmalı. Önce catch(Exception), sonra
//   catch(ArithmeticException) yazılırsa → DERLEME HATASI (exception has already been caught).
// finally: istisna olsa da olmasa da, yakalansa da yakalanmasa da, try'da return olsa bile ÇALIŞIR.
// Yakalanmayan istisna: önce finally çalışır, sonra istisna çağıran metoda YAYILIR (propagation);
//   main'den de çıkarsa program sonlanır ve konsola istisnanın adı yazılır.

public class TryAkisi {
    static String bol(String x, String y) {           // 2024 vize S5 kalıbı
        String sonuc = "";
        try {
            int a = Integer.parseInt(x);              // "abc" veya "null" → NumberFormatException
            int b = Integer.parseInt(y);
            sonuc = "" + (a / b);                     // b = 0 → ArithmeticException
        } catch (NumberFormatException e) {
            sonuc = "bad input";
        } catch (ArithmeticException e) {
            sonuc = "sifira bolme";
        } finally {
            System.out.print("answer: ");            // her durumda çalışır
        }
        return sonuc;
    }

    static int f() {
        try {
            return 1;                                 // return'den ÖNCE finally çalışır
        } finally {
            System.out.println("finally f");
        }
    }

    public static void main(String[] args) {
        System.out.println(bol("8", "2"));            // bol önce çalışır, "answer: " sonra sonuç
        System.out.println(bol("3", "null"));         // "null" bir METİN → parseInt hatası, NPE değil
        System.out.println(bol("1", "0"));
        System.out.println(f());

        String[] c = {"A", "B", "C"};                 // 2025 vizesindeki iç içe try kalıbı
        try {
            for (int i = 0; i < 4; i++) System.out.print(c[i]);  // i=3 → ArrayIndexOutOfBounds
            System.out.print("X");                    // ATLANIR
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("D");
        } finally {
            System.out.println("E");
        }
        System.out.println("son");                    // istisna yakalandı → program devam eder
    }
}`,
            output: 'answer: 4\nanswer: bad input\nanswer: sifira bolme\nfinally f\n1\nABCD\nE\nson'
          },
          {
            title: '4b · Hiyerarşi, checked / unchecked, throw / throws',
            main: 'IstisnaTurleri',
            code: J`import java.io.FileNotFoundException;

// KONU 4b: İstisna hiyerarşisi, checked / unchecked, throw / throws
//
//                   Throwable
//                  /         \
//              Error        Exception
//   (JVM sorunları:         /        \
//    OutOfMemoryError) IOException   RuntimeException ← ve alt sınıfları = KONTROLSÜZ (unchecked)
//                      (CHECKED)       ArithmeticException, NullPointerException,
//                                      ArrayIndexOutOfBoundsException, NumberFormatException,
//                                      ClassCastException, IllegalArgumentException, InputMismatchException
// CHECKED (kontrollü): RuntimeException DIŞINDAKİ Exception'lar (IOException, FileNotFoundException,
//   CloneNotSupportedException, kendi "extends Exception" sınıfın). Derleyici zorlar:
//   ya try-catch ile YAKALA ya da metot başlığında throws ile BİLDİR. Yoksa DERLEME HATASI.
// UNCHECKED: derleyici zorlamaz; çoğunlukla mantık hatası, çalışma zamanında çıkar
//   (2024 D/Y 4: "RuntimeException'dan türeyenler derleme zamanında kontrol edilmez" → DOĞRU).
//
// throw  → istisna nesnesini OLUŞTURUP FIRLATIR (gövdede):            throw new X("mesaj");
// throws → metodun fırlatabileceği istisnaları BİLDİRİR (başlıkta):   void oku() throws IOException

public class IstisnaTurleri {
    static void dosyaAc(String ad) throws FileNotFoundException {   // checked → throws şart
        if (!ad.endsWith(".txt"))
            throw new FileNotFoundException(ad + " bulunamadi");
        System.out.println(ad + " acildi");
    }

    static int yasKontrol(int yas) {                  // unchecked → throws yazmak gerekmez
        if (yas < 0) throw new IllegalArgumentException("Yas negatif olamaz");
        return yas;
    }

    public static void main(String[] args) {
        try {
            dosyaAc("not.txt");
            dosyaAc("resim.png");                     // istisna → try'ın kalanı atlanır
            System.out.println("buraya gelmez");
        } catch (FileNotFoundException e) {
            System.out.println("Hata: " + e.getMessage());   // getMessage: yapıcıya verilen mesaj
        }
        // dosyaAc("x.txt");                          // try'sız → DERLEME HATASI: unreported exception

        try {
            yasKontrol(-5);
        } catch (IllegalArgumentException | NullPointerException e) {  // çoklu yakalama (Java 7+)
            System.out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
        }

        try {
            Object o = "metin";
            Integer i = (Integer) o;                  // ClassCastException (unchecked)
        } catch (RuntimeException e) {                // üst tip alt tiplerini de yakalar
            System.out.println("Runtime yakalandi: " + (e instanceof ClassCastException));
        }
    }
}`,
            output: 'not.txt acildi\nHata: resim.png bulunamadi\nIllegalArgumentException: Yas negatif olamaz\nRuntime yakalandi: true'
          },
          {
            title: '4c · Kendi istisna sınıfın',
            main: 'OzelIstisna',
            code: J`import java.util.ArrayList;

// KONU 4c: KENDİ İSTİSNA SINIFIN (2022 vize S6: 25 puan)
// Kalıp: class XException extends Exception        → CHECKED (throws zorunlu)
//        class XException extends RuntimeException → UNCHECKED
// Yapıcıda super(mesaj) → getMessage() bu mesajı döndürür.

class GecersizPuanException extends Exception {
    private int puan;                                  // istisna da bir sınıftır: alanı/metodu olabilir
    public GecersizPuanException(String mesaj, int puan) {
        super(mesaj);                                  // Exception(String) yapıcısı
        this.puan = puan;
    }
    public int getPuan() { return puan; }
}

class TipHatasi extends Exception {
    public TipHatasi(String mesaj) { super(mesaj); }
}

class Yarisma {
    private ArrayList<Integer> puanlar = new ArrayList<>();

    // Object parametre: her türlü değeri alıp tipini instanceof ile denetlemek için
    public void puanEkle(Object deger) throws TipHatasi, GecersizPuanException {
        if (!(deger instanceof Integer))
            throw new TipHatasi("TypeError: " + deger + " puan olarak eklenemez.");
        int p = (Integer) deger;                       // Object → Integer → int
        if (p < 0 || p > 10)
            throw new GecersizPuanException("ValueError: " + p + " puan olarak eklenemez.", p);
        puanlar.add(p);
    }
    public ArrayList<Integer> getPuanlar() { return puanlar; }
}

public class OzelIstisna {
    public static void main(String[] args) {
        Yarisma y = new Yarisma();
        Object[] denemeler = { 7, 6.25, 14, 10 };      // 6.25 → Double, 14 → aralık dışı
        for (Object d : denemeler) {
            try {
                y.puanEkle(d);
                System.out.println(d + " eklendi");    // istisna olursa bu satır atlanır
            } catch (TipHatasi e) {
                System.out.println(e.getMessage());
            } catch (GecersizPuanException e) {
                System.out.println(e.getMessage() + " (puan=" + e.getPuan() + ")");
            }
        }
        System.out.println(y.getPuanlar());
    }
}`,
            output: '7 eklendi\nTypeError: 6.25 puan olarak eklenemez.\nValueError: 14 puan olarak eklenemez. (puan=14)\n10 eklendi\n[7, 10]'
          },
          {
            title: '4d · Metin dosyası yazma / okuma',
            main: 'MetinIO',
            code: J`import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.Scanner;

// KONU 4d: METİN DOSYASI YAZMA / OKUMA (Bölüm 3'ün ikinci yarısı; vizelerde ağırlığı düşük)
// File: dosyanın YOLUNU temsil eder, içeriği okumaz/yazmaz (exists(), length(), delete(), getName()).
// PrintWriter: yazma. new PrintWriter(dosya) → FileNotFoundException (checked) fırlatabilir.
//   Dosya varsa İÇERİĞİ SİLİNİR, yoksa oluşturulur. close() çağrılmazsa veri diske yazılmayabilir.
// Scanner(File): okuma. hasNext() / next() / nextInt() / hasNextLine() / nextLine().
// try-with-resources: try (kaynak) { ... } → blok bitince close() otomatik çağrılır.

public class MetinIO {
    public static void main(String[] args) throws FileNotFoundException {  // checked'i main bildirdi
        File dosya = new File("notlar.txt");
        try (PrintWriter yaz = new PrintWriter(dosya)) {
            yaz.println("Ali 80");
            yaz.println("Ayse 95");
        }                                              // burada otomatik close()
        System.out.println(dosya.exists() + " " + dosya.getName());

        int toplam = 0;
        try (Scanner oku = new Scanner(dosya)) {
            while (oku.hasNext()) {
                String ad = oku.next();                // boşluğa kadar bir kelime
                int not = oku.nextInt();
                System.out.println(ad + " -> " + not);
                toplam += not;
            }
        }
        System.out.println("Toplam: " + toplam);
        dosya.delete();
        // new Scanner(new File("yok.txt"))  → FileNotFoundException
        // nextInt() sayı olmayan kelimeye denk gelirse → InputMismatchException (unchecked)
    }
}`,
            output: 'true notlar.txt\nAli -> 80\nAyse -> 95\nToplam: 175'
          }
        ]
      },

      /* ================================================================ KONU 5 */
      {
        id: 'k5',
        stage: 'konu',
        no: '5',
        title: 'Java temelleri: args, diziler, değerle aktarım',
        points: 12,
        exam: [
          '2024-25 S4 (12p): Echo programı; print gövdesindeki derleme hataları, <code>ArrayIndexOutOfBoundsException: 0</code> nedeni ve düzeltmesi',
          'Çıktı sorularında yan tuzaklar: String birleştirme sırası, tam sayı bölmesi, değerle aktarım'
        ],
        snippets: [
          {
            title: '5 · main, komut satırı argümanları, diziler, değerle aktarım',
            main: 'Temeller',
            code: J`// KONU 5: main, komut satırı argümanları, diziler, değerle aktarım
// public static void main(String[] args): args = komut satırında yazılan kelimeler (String dizisi).
//   java Echo merhaba dunya → args[0]="merhaba", args[1]="dunya", args.length = 2
//   Argüman verilmezse args BOŞ dizidir (null değil): args.length = 0 ve args[0] →
//   ArrayIndexOutOfBoundsException: 0  (2024 vize S4-b'deki hata tam olarak bu)
// Dizi indeksi 0 .. length-1. Dizi: length (parantezsiz), String: length() (metot).
// Java'da parametre aktarımı HER ZAMAN DEĞERLE (pass by value):
//   primitive → değerin kopyası gider; metot içindeki değişiklik dışarıyı etkilemez.
//   referans  → ADRESİN kopyası gider; nesnenin İÇİ değiştirilebilir, ama parametreyi başka
//               nesneye bağlamak dışarıdaki değişkeni etkilemez.

public class Temeller {
    static void degistir(int x, int[] dizi) {
        x = 99;                                     // yerel kopya
        dizi[0] = 99;                               // aynı dizi nesnesi → dışarıda da değişir
        dizi = new int[] {-1};                      // yerel referans yeni diziye; dışarı etkilenmez
    }

    static void yazdir(String[] a) {                // Echo'nun düzeltilmiş print metodu
        for (int i = 0; i < a.length; i++) {        // i <= a.length yazılsaydı son turda AIOOBE
            System.out.print(a[i] + " ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        if (args.length == 0) {                     // argüman yoksa varsayılan kullan (AIOOBE önlenir)
            args = new String[] {"12", "30"};
        }
        yazdir(args);
        int toplam = Integer.parseInt(args[0]) + Integer.parseInt(args[1]);  // String → int
        System.out.println("Toplam: " + toplam);
        System.out.println("1" + 2 + 3);            // soldan sağa: "12" + 3 → "123"
        System.out.println(1 + 2 + "3");            // 3 + "3" → "33"
        System.out.println(7 / 2 + " " + 7 % 2 + " " + 7 / 2.0);   // tam bölme 3, kalan 1, 3.5

        int sayi = 5;
        int[] d = {1, 2};
        degistir(sayi, d);
        System.out.println(sayi + " " + d[0]);      // 5 99
    }
}`,
            output: '12 30\nToplam: 42\n123\n33\n3 1 3.5\n5 99'
          }
        ]
      },

      /* ================================================================ BİRLEŞİK 1 */
      {
        id: 'b1',
        stage: 'birlesik',
        no: 'B1',
        title: 'Akıllı ev: soyut sınıf + arayüz + Comparable + ArrayList',
        covers: ['Soyut sınıf', 'Arayüz', 'Comparable', 'Kapsülleme', 'static', 'ArrayList', 'instanceof + cast', 'Çok biçimlilik', 'toString'],
        intro: '2025-26 vize S5 (40p) iskeletinin tam çözümü, üstüne Comparable ve arayüzü uygulamayan bir sınıf eklendi. Her bloğun hangi isteği karşıladığı yorumda yazıyor.',
        snippets: [
          {
            title: 'SmartHomeTest.java',
            main: 'SmartHomeTest',
            code: J`import java.util.ArrayList;
import java.util.Collections;

// [İstek] Device soyut sınıfında getStatus() soyut olarak tanımlanmalı
abstract class Device implements Comparable<Device> {   // Comparable kökte → TÜM alt sınıflar
    private String name;                                //   karşılaştırılabilir olur
    private double price;
    private static int adet = 0;                        // static: oluşturulan cihaz sayısı (paylaşılan)

    public Device(String name, double price) {
        this.name = name;
        this.price = price;
        adet++;
    }
    public String getName() { return name; }
    public double getPrice() { return price; }
    public static int getAdet() { return adet; }

    public abstract String getStatus();                 // gövde yok → alt sınıflar yazmak zorunda

    @Override
    public int compareTo(Device d) {                    // fiyata göre
        return Double.compare(price, d.price);
    }
    @Override
    public String toString() {                          // getStatus() dinamik bağlanır
        return getName() + " [" + getPrice() + " TL] " + getStatus();
    }
}

// [İstek] Controllable arayüzü, display() metodu
interface Controllable {
    void display();                                     // otomatik public abstract
}

// [İstek] Light: Device'tan türemeli, Controllable'ı uygulamalı;
//         brightness kapsüllenmiş, constructor'da atanmalı, YALNIZCA getter ile erişilmeli
class Light extends Device implements Controllable {    // sıra: önce extends, sonra implements
    private int brightness;                             // private + sadece getter = salt okunur
    public Light(String name, double price, int brightness) {
        super(name, price);                             // üst sınıfın private alanlarını o atar
        this.brightness = brightness;
    }
    public int getBrightness() { return brightness; }
    @Override
    public String getStatus() { return "parlaklik %" + brightness; }
    @Override
    public void display() { System.out.println("Light: " + getName() + ", " + getStatus()); }
}

class Thermostat extends Device implements Controllable {
    private double temperature;
    public Thermostat(String name, double price, double temperature) {
        super(name, price);
        this.temperature = temperature;
    }
    public double getTemperature() { return temperature; }
    @Override
    public String getStatus() { return "sicaklik " + temperature + " C"; }
    @Override
    public void display() { System.out.println("Thermostat: " + getName() + ", " + getStatus()); }
}

// Controllable OLMAYAN cihaz: arayüzün "yalnızca bazıları" anlamını göstermek için
class Sensor extends Device {
    public Sensor(String name, double price) { super(name, price); }
    @Override
    public String getStatus() { return "olcum yapiyor"; }
}

// [İstek] DeviceManager: ArrayList<Device>, ekleme ve listeleme;
//         polimorfizm sayesinde hem Light hem Thermostat saklanabilmeli
class DeviceManager {
    private ArrayList<Device> devices = new ArrayList<>();
    public void addDevice(Device d) { devices.add(d); }
    public void listDevices() {
        for (Device d : devices) {
            if (d instanceof Controllable) {            // arayüzü uyguluyorsa display() çağrılabilir
                ((Controllable) d).display();           // Device referansında display() yok → cast
            } else {
                System.out.println("Diger: " + d);      // toString → getStatus (dinamik bağlama)
            }
        }
    }
    public Device enUcuz() { return Collections.min(devices); }   // compareTo kullanır
    public void sirala() { Collections.sort(devices); }
    public ArrayList<Device> getDevices() { return devices; }
}

// [İstek] Test sınıfı: her cihazın detay bilgisi yazdırılmalı
public class SmartHomeTest {
    public static void main(String[] args) {
        DeviceManager m = new DeviceManager();
        m.addDevice(new Light("Salon lambasi", 450, 80));        // Device parametresine Light (upcast)
        m.addDevice(new Thermostat("Kombi", 2500, 21.5));
        m.addDevice(new Sensor("Duman", 300));
        m.listDevices();
        System.out.println("En ucuz: " + m.enUcuz().getName());
        m.sirala();
        System.out.println("Sirali: " + m.getDevices());
        System.out.println("Toplam cihaz: " + Device.getAdet());
    }
}`,
            output: 'Light: Salon lambasi, parlaklik %80\nThermostat: Kombi, sicaklik 21.5 C\nDiger: Duman [300.0 TL] olcum yapiyor\nEn ucuz: Duman\nSirali: [Duman [300.0 TL] olcum yapiyor, Salon lambasi [450.0 TL] parlaklik %80, Kombi [2500.0 TL] sicaklik 21.5 C]\nToplam cihaz: 3'
          }
        ]
      },

      /* ================================================================ BİRLEŞİK 2 */
      {
        id: 'b2',
        stage: 'birlesik',
        no: 'B2',
        title: 'Bordro: kalıtım zinciri + override/overload + dinamik bağlama',
        covers: ['Kalıtım zinciri', 'super / this', 'Yapıcı sırası', 'Override', 'Overload', 'Dinamik bağlama', 'instanceof + cast', 'static sayaç', 'final alan', 'toString / equals'],
        intro: 'Çıktı sorularındaki tuzakların hepsi tek programda. Çıktıyı açmadan önce kâğıda kendin yaz; en zor iki satır yapıcının içinden çağrılan <code>tanit()</code> ve <code>equals</code> satırındaki <code>new</code>.',
        snippets: [
          {
            title: 'BordroTest.java',
            main: 'BordroTest',
            code: J`class Personel {
    private static int sayac = 0;                // tüm personel için TEK sayaç
    protected final int id;                      // final alan: yapıcıda bir kez atanır
    protected String ad;

    public Personel(String ad) {
        this.ad = ad;
        id = ++sayac;                            // önce artır, sonra ata → 1, 2, 3...
        System.out.println("Personel(" + ad + ")");
        tanit();                                 // TUZAK: yapıcıda override edilebilir metot çağrısı
    }                                            // → alt sınıfın tanit()'i çalışır (dinamik bağlama)
    public void tanit() { System.out.println("  personel " + ad); }
    public double maas() { return 10000; }
    public double maas(int ay) { return maas() * ay; }   // overload; içindeki maas() DİNAMİK bağlanır
    public static int getSayac() { return sayac; }
    @Override
    public String toString() { return id + ":" + ad; }
    @Override
    public boolean equals(Object o) {            // parametre Object → gerçek override
        return (o instanceof Personel) && ((Personel) o).ad.equals(ad);
    }
}

class Muhendis extends Personel {
    protected int seviye = 1;                    // alan başlatıcı: super(...) BİTTİKTEN SONRA çalışır.
                                                 // Personel yapıcısı tanit()'i çağırdığında seviye
                                                 // henüz 0'dır (int varsayılanı)
    public Muhendis(String ad) {
        super(ad);                               // önce Personel kısmı kurulur
        System.out.println("Muhendis(" + ad + ")");
    }
    public Muhendis(String ad, int seviye) {
        this(ad);                                // aynı sınıftaki yapıcı → o da super(ad) çağırır
        this.seviye = seviye;
    }
    @Override
    public void tanit() { System.out.println("  muhendis " + ad + " seviye " + seviye); }
    @Override
    public double maas() { return super.maas() + 5000 * seviye; }
}

class Yonetici extends Muhendis {
    public Yonetici(String ad) {
        super(ad, 3);
        System.out.println("Yonetici(" + ad + ")");
    }
    @Override
    public double maas() { return super.maas() * 2; }   // Muhendis.maas() → Personel.maas()
    public void toplanti() { System.out.println("  " + ad + " toplanti yapiyor"); }
    // tanit() override edilmedi → Muhendis'inki kullanılır
}

public class BordroTest {
    public static void main(String[] args) {
        Personel[] liste = new Personel[3];      // dizi oluşturmak nesne oluşturmaz: 3 tane null
        liste[0] = new Personel("Ali");
        liste[1] = new Muhendis("Ece", 2);
        liste[2] = new Yonetici("Can");
        System.out.println("---");
        for (Personel p : liste) {               // Personel referansı, üç farklı gerçek tip
            System.out.println(p + " maas=" + p.maas() + " 2ay=" + p.maas(2));
            if (p instanceof Yonetici) ((Yonetici) p).toplanti();   // alt sınıfa özgü metot → cast
        }
        System.out.println("Sayac: " + Personel.getSayac());
        // argüman önce değerlendirilir: new Personel("Ali") yapıcısı ÖNCE yazar, sayaç 4 olur
        System.out.println(liste[0].equals(new Personel("Ali")));
        System.out.println("Sayac: " + Personel.getSayac());
    }
}`,
            output: 'Personel(Ali)\n  personel Ali\nPersonel(Ece)\n  muhendis Ece seviye 0\nMuhendis(Ece)\nPersonel(Can)\n  muhendis Can seviye 0\nMuhendis(Can)\nYonetici(Can)\n---\n1:Ali maas=10000.0 2ay=20000.0\n2:Ece maas=20000.0 2ay=40000.0\n3:Can maas=50000.0 2ay=100000.0\n  Can toplanti yapiyor\nSayac: 3\nPersonel(Ali)\n  personel Ali\ntrue\nSayac: 4'
          }
        ]
      },

      /* ================================================================ BİRLEŞİK 3 */
      {
        id: 'b3',
        stage: 'birlesik',
        no: 'B3',
        title: 'Banka: kapsülleme + özel istisna + throw/throws + finally',
        covers: ['Kapsülleme', 'final alan', 'Özel checked istisna', 'throw / throws', 'Unchecked istisnalar', 'catch sırası', 'finally', 'ArrayList', 'parseInt', 'Komut satırı argümanı'],
        intro: 'Senaryo: hesaplardan para çekme. Hatalı tutar, yetersiz bakiye, sayı olmayan girdi ve olmayan hesap numarası ayrı ayrı yakalanıyor. <code>catch</code> sırasına dikkat: <code>NumberFormatException</code>, <code>IllegalArgumentException</code>\'ın alt sınıfıdır.',
        snippets: [
          {
            title: 'BankaTest.java',
            main: 'BankaTest',
            code: J`import java.util.ArrayList;

class YetersizBakiyeException extends Exception {        // extends Exception → CHECKED
    public YetersizBakiyeException(double eksik) {
        super("Yetersiz bakiye, eksik: " + eksik);         // getMessage() bunu döndürür
    }
}

class Hesap {
    private final String no;                              // değişmez kimlik
    private double bakiye;                                // dışarıdan doğrudan değiştirilemez

    public Hesap(String no, double bakiye) {
        if (bakiye < 0) throw new IllegalArgumentException("Negatif bakiye");   // unchecked: throws gerekmez
        this.no = no;
        this.bakiye = bakiye;
    }
    public String getNo() { return no; }
    public double getBakiye() { return bakiye; }

    public void cek(double tutar) throws YetersizBakiyeException {   // checked → throws ZORUNLU
        if (tutar <= 0) throw new IllegalArgumentException("Gecersiz tutar: " + tutar);
        if (tutar > bakiye) throw new YetersizBakiyeException(tutar - bakiye);
        bakiye -= tutar;                                  // istisna fırlarsa bu satır ÇALIŞMAZ
    }
}

class Banka {
    private ArrayList<Hesap> hesaplar = new ArrayList<>();
    public void ekle(Hesap h) { hesaplar.add(h); }
    public Hesap bul(int sira) { return hesaplar.get(sira); }   // geçersiz sıra → IndexOutOfBoundsException
}

public class BankaTest {
    static void islem(Banka b, String siraMetni, String tutarMetni) {
        try {
            int sira = Integer.parseInt(siraMetni);           // NumberFormatException olabilir
            double tutar = Double.parseDouble(tutarMetni);
            Hesap h = b.bul(sira);
            h.cek(tutar);                                     // checked: try içinde olmak zorunda
            System.out.println(h.getNo() + " yeni bakiye: " + h.getBakiye());
        } catch (YetersizBakiyeException e) {
            System.out.println("Reddedildi: " + e.getMessage());
        } catch (NumberFormatException | IndexOutOfBoundsException e) {   // alt sınıflar önce
            System.out.println("Girdi hatasi: " + e.getClass().getSimpleName());
        } catch (IllegalArgumentException e) {                // NumberFormatException'ın üst sınıfı:
            System.out.println("Kural hatasi: " + e.getMessage());   // yukarıda olsaydı alttaki
        } finally {                                           // catch için DERLEME HATASI çıkardı
            System.out.println("  islem kaydedildi");
        }
    }

    public static void main(String[] args) {
        Banka b = new Banka();
        b.ekle(new Hesap("TR01", 500));
        b.ekle(new Hesap("TR02", 100));
        try {
            b.ekle(new Hesap("TR03", -5));                    // yapıcı istisna atarsa nesne oluşmaz
        } catch (IllegalArgumentException e) {
            System.out.println("Hesap acilamadi: " + e.getMessage());
        }
        if (args.length >= 2) islem(b, args[0], args[1]);     // java BankaTest 0 200 gibi
        islem(b, "0", "200");
        islem(b, "1", "250");
        islem(b, "abc", "10");
        islem(b, "5", "10");
        islem(b, "0", "-3");
    }
}`,
            output: 'Hesap acilamadi: Negatif bakiye\nTR01 yeni bakiye: 300.0\n  islem kaydedildi\nReddedildi: Yetersiz bakiye, eksik: 150.0\n  islem kaydedildi\nGirdi hatasi: NumberFormatException\n  islem kaydedildi\nGirdi hatasi: IndexOutOfBoundsException\n  islem kaydedildi\nKural hatasi: Gecersiz tutar: -3.0\n  islem kaydedildi'
          }
        ]
      },

      /* ================================================================ BİRLEŞİK 4 */
      {
        id: 'b4',
        stage: 'birlesik',
        no: 'B4',
        title: 'Vasıta / Otonom / Şoför: tasarım kararları + Cloneable',
        covers: ['Soyut sınıf', 'Arayüz (farklı sınıf ağaçları)', 'Comparable', 'Cloneable', 'protected yapıcı', 'has-a ilişkisi', 'null ve == kontrolü', 'Arayüz tipinde dizi'],
        intro: '2022-23 vize S5\'in (45p) çözümü. Sınavda yapı kararını (sınıf mı, soyut sınıf mı, arayüz mü) sen veriyorsun; kararların gerekçesi en üstteki yorumda.',
        snippets: [
          {
            title: 'VasitaTest.java',
            main: 'VasitaTest',
            code: J`import java.util.ArrayList;
import java.util.Collections;

// İstek → yapı kararı:
//  "Genel Vasita nesnesi oluşturulamamalı"               → abstract class Vasita
//  "Hizlan() ve Fren() davranışları"                      → Vasita'da abstract metotlar
//  "Drone otonom; ElektrikliSupurge de otonom, ama vasıta DEĞİL"
//                                                         → Otonom bir INTERFACE: ortak yetenek
//                                                           sınıf ağacının dışına taşıyor
//  "Araba ve Drone hızlarına göre karşılaştırılabilir"   → Vasita implements Comparable<Vasita>
//  "Şoför önceden atanmış mı? Aynı şoför tekrar mı?"     → Araba'da Sofor alanı + null / == kontrolü

abstract class Vasita implements Comparable<Vasita>, Cloneable {
    private int hiz;                                       // kapsüllenmiş
    private final int maksHiz;
    private final int adim;

    protected Vasita(int maksHiz, int adim) {              // protected: yalnızca alt sınıflar çağırır
        this.maksHiz = maksHiz;
        this.adim = adim;
    }
    public int getHiz() { return hiz; }

    protected void hiziDegistir(int yon) {                 // sınır kuralı TEK yerde (kod tekrarı yok)
        hiz += yon * adim;
        if (hiz > maksHiz) hiz = maksHiz;                  // maksimum
        if (hiz < 0) hiz = 0;                              // minimum
    }
    public abstract void hizlan();
    public abstract void fren();

    @Override
    public int compareTo(Vasita v) { return Integer.compare(hiz, v.hiz); }

    @Override
    public Vasita clone() {
        try {
            return (Vasita) super.clone();                 // int alanlar → sığ kopya yeterli.
        } catch (CloneNotSupportedException e) {           // Araba'daki sofor referansı ise
            throw new AssertionError();                    // PAYLAŞILIR (sığ kopya)
        }
    }
}

interface Otonom {
    void otonomHareket();
}

class Sofor {
    private String ad;
    public Sofor(String ad) { this.ad = ad; }
    public String getAd() { return ad; }
}

class Araba extends Vasita {
    private Sofor sofor;                                   // has-a (sahip olma / birleşim) ilişkisi
    public Araba() { super(180, 20); }
    @Override
    public void hizlan() { System.out.println("Araba Hizlaniyor"); hiziDegistir(+1); }
    @Override
    public void fren() { System.out.println("Araba Yavasliyor"); hiziDegistir(-1); }

    public void soforAta(Sofor s) {
        if (sofor != null) {                               // önceden atanmış mı?
            System.out.println("Zaten sofor var: " + sofor.getAd());
            return;
        }
        sofor = s;
        System.out.println(s.getAd() + " atandi");
    }
    public void soforDegistir(Sofor yeni) {
        if (sofor == yeni) {                               // aynı nesne mi? (== referans karşılaştırır)
            System.out.println("Ayni sofor tekrar atanamaz");
            return;
        }
        sofor = yeni;
        System.out.println("Yeni sofor: " + yeni.getAd());
    }
}

class Drone extends Vasita implements Otonom {
    public Drone() { super(90, 5); }
    @Override
    public void hizlan() { System.out.println("Drone Hizlaniyor"); hiziDegistir(+1); }
    @Override
    public void fren() { System.out.println("Drone Yavasliyor"); hiziDegistir(-1); }
    @Override
    public void otonomHareket() { System.out.println("Drone otonom ucabiliyor"); }
}

class ElektrikliSupurge implements Otonom {               // Vasita DEĞİL, yalnızca Otonom
    @Override
    public void otonomHareket() { System.out.println("Kendi supurebiliyor"); }
}

public class VasitaTest {
    public static void main(String[] args) {
        ArrayList<Vasita> vasitalar = new ArrayList<>();
        Araba a = new Araba();
        Drone d = new Drone();
        vasitalar.add(a);
        vasitalar.add(d);

        a.hizlan();
        a.hizlan();                                        // 40
        d.hizlan();                                        // 5
        d.fren();
        d.fren();                                          // 0'ın altına inmez
        System.out.println("Araba " + a.getHiz() + ", Drone " + d.getHiz());

        Vasita v = a;                                      // çok biçimlilik
        v.fren();                                          // Araba'nın fren()'i → 20
        System.out.println("Karsilastirma: " + a.compareTo(d));   // 20 > 0 → pozitif

        Otonom[] otonomlar = { d, new ElektrikliSupurge() };     // farklı ağaçlardan sınıflar, tek arayüz
        for (Otonom o : otonomlar) o.otonomHareket();

        Sofor s1 = new Sofor("Mert");
        a.soforAta(s1);
        a.soforAta(new Sofor("Zeynep"));
        a.soforDegistir(s1);
        a.soforDegistir(new Sofor("Zeynep"));

        Vasita kopya = a.clone();                          // gerçek tipi Araba
        kopya.hizlan();                                    // kopya hızlanır, a etkilenmez
        System.out.println("a=" + a.getHiz() + " kopya=" + kopya.getHiz());
        Collections.sort(vasitalar);                       // compareTo → hıza göre
        System.out.println("En yavas: " + vasitalar.get(0).getClass().getSimpleName());
    }
}`,
            output: 'Araba Hizlaniyor\nAraba Hizlaniyor\nDrone Hizlaniyor\nDrone Yavasliyor\nDrone Yavasliyor\nAraba 40, Drone 0\nAraba Yavasliyor\nKarsilastirma: 1\nDrone otonom ucabiliyor\nKendi supurebiliyor\nMert atandi\nZaten sofor var: Mert\nAyni sofor tekrar atanamaz\nYeni sofor: Zeynep\nAraba Hizlaniyor\na=20 kopya=40\nEn yavas: Drone'
          }
        ]
      },

      /* ================================================================ PRATİK 1 */
      {
        id: 'p1',
        stage: 'pratik',
        no: 'P1',
        title: 'İskelet tamamlama (40p): Kütüphane',
        format: '2025-26 S5 formatı',
        practice: {
          q: 'Aşağıdaki kod iskeletinde bazı kısımlar eksik bırakılmıştır. [B1]–[B16] bloklarını doldurarak belirtilen özellikleri sağlayan, çalışır bir program haline getiriniz.',
          req: [
            '<code>Materyal</code> soyut sınıfında <code>ad</code> ve <code>yil</code> alanları kapsüllenmeli, yapıcıda atanmalı. <code>bilgi()</code> metodu soyut olmalı.',
            'Tüm materyaller yayın yılına göre (eskiden yeniye) karşılaştırılabilir olmalı.',
            '<code>Odunclenebilir</code> arayüzü <code>oduncVer()</code>, <code>iadeEt(int gecikmeGun)</code> (ceza döndürür) ve <code>oduncteMi()</code> metotlarını içermeli.',
            '<code>Kitap</code> Materyal\'den türemeli ve Odunclenebilir\'i uygulamalı. <code>sayfaSayisi</code> salt okunur olmalı. Ödünçteki kitap tekrar ödünç verilemez. Gecikme cezası günlük 2 TL.',
            '<code>Dergi</code> Materyal\'den türemeli, ödünç verilemez (yalnızca salonda okunur).',
            '<code>Kutuphane</code> sınıfı <code>ArrayList</code> ile materyalleri tutmalı; ekleme, sıradaki materyali ödünç verme (ödünç verilemiyorsa mesaj) ve yıla göre sıralı listeleme yapmalı.',
            'Test sınıfında çok biçimlilik kullanılmalı.'
          ],
          givenKind: 'skeleton',
          given: J`import java.util.ArrayList;
import java.util.Collections;

// 1. Soyut sınıf Materyal
abstract class Materyal implements /* [B1] */ {
    private String ad;
    private int yil;
    public Materyal(String ad, int yil) {
        // [B2]
    }
    public String getAd() { return ad; }
    public int getYil() { return yil; }
    // [B3]  soyut bilgi()
    // [B4]  compareTo
}

// 2. Arayüz Odunclenebilir
interface Odunclenebilir {
    // [B5]
}

// 3. Kitap
class Kitap /* [B6] */ {
    // [B7]  alanlar
    // [B8]  yapıcı
    // [B9]  getter + arayüz ve soyut metotlar
}

// 4. Dergi
class Dergi extends Materyal {
    // [B10]
}

// 5. Kutuphane
class Kutuphane {
    // [B11]  liste
    // [B12]  ekle
    // [B13]  oduncVer(int sira)
    // [B14]  listele (yıla göre sıralı)
}

// 6. Test sınıfı
public class KutuphaneTest {
    public static void main(String[] args) {
        // [B15]  nesneleri oluştur ve ekle
        // [B16]  ödünç ver, iade et, listele
    }
}`,
          answer: {
            main: 'KutuphaneTest',
            code: J`import java.util.ArrayList;
import java.util.Collections;

abstract class Materyal implements Comparable<Materyal> {          // [B1]
    private String ad;
    private int yil;
    public Materyal(String ad, int yil) {
        this.ad = ad;                                                // [B2]
        this.yil = yil;
    }
    public String getAd() { return ad; }
    public int getYil() { return yil; }

    public abstract String bilgi();                                  // [B3]

    @Override
    public int compareTo(Materyal m) {                               // [B4] eskiden yeniye
        return Integer.compare(yil, m.yil);
    }
}

interface Odunclenebilir {
    void oduncVer();                                                 // [B5] hepsi otomatik
    double iadeEt(int gecikmeGun);                                   //      public abstract
    boolean oduncteMi();
}

class Kitap extends Materyal implements Odunclenebilir {             // [B6]
    private int sayfaSayisi;                                         // [B7] salt okunur (setter yok)
    private boolean oduncte;                                         //      durum alanı
    private static final double GUNLUK_CEZA = 2.0;

    public Kitap(String ad, int yil, int sayfaSayisi) {              // [B8]
        super(ad, yil);
        this.sayfaSayisi = sayfaSayisi;
    }
    public int getSayfaSayisi() { return sayfaSayisi; }              // [B9]

    @Override
    public String bilgi() {
        return "Kitap: " + getAd() + " (" + getYil() + "), " + sayfaSayisi + " sayfa";
    }
    @Override
    public void oduncVer() {
        if (oduncte) {                                               // iş kuralı
            System.out.println(getAd() + " zaten oduncte");
            return;
        }
        oduncte = true;
        System.out.println(getAd() + " odunc verildi");
    }
    @Override
    public double iadeEt(int gecikmeGun) {
        if (!oduncte) {
            System.out.println(getAd() + " oduncte degil");
            return 0;
        }
        oduncte = false;
        double ceza = gecikmeGun > 0 ? gecikmeGun * GUNLUK_CEZA : 0;
        System.out.println(getAd() + " iade edildi, ceza: " + ceza);
        return ceza;
    }
    @Override
    public boolean oduncteMi() { return oduncte; }
}

class Dergi extends Materyal {
    private int sayi;                                                // [B10]
    public Dergi(String ad, int yil, int sayi) {
        super(ad, yil);
        this.sayi = sayi;
    }
    public int getSayi() { return sayi; }
    @Override
    public String bilgi() { return "Dergi: " + getAd() + " (" + getYil() + "), sayi " + sayi; }
}

class Kutuphane {
    private ArrayList<Materyal> materyaller = new ArrayList<>();     // [B11]

    public void ekle(Materyal m) { materyaller.add(m); }             // [B12]

    public void oduncVer(int sira) {                                 // [B13]
        Materyal m = materyaller.get(sira);
        if (m instanceof Odunclenebilir) {
            ((Odunclenebilir) m).oduncVer();
        } else {
            System.out.println(m.getAd() + " sadece salonda okunur");
        }
    }
    public Materyal get(int sira) { return materyaller.get(sira); }

    public void listele() {                                          // [B14]
        Collections.sort(materyaller);
        for (Materyal m : materyaller) System.out.println(m.bilgi());   // dinamik bağlama
    }
}

public class KutuphaneTest {
    public static void main(String[] args) {
        Kutuphane k = new Kutuphane();                               // [B15]
        k.ekle(new Kitap("Suc ve Ceza", 1866, 687));                 // Materyal parametresine Kitap
        k.ekle(new Dergi("Bilim Teknik", 2024, 680));
        k.ekle(new Kitap("Tutunamayanlar", 1972, 724));

        k.oduncVer(0);                                               // [B16]
        k.oduncVer(0);
        k.oduncVer(1);
        Odunclenebilir o = (Odunclenebilir) k.get(0);                // arayüz tipinde referans
        o.iadeEt(3);
        k.listele();
    }
}`,
            output: 'Suc ve Ceza odunc verildi\nSuc ve Ceza zaten oduncte\nBilim Teknik sadece salonda okunur\nSuc ve Ceza iade edildi, ceza: 6.0\nKitap: Suc ve Ceza (1866), 687 sayfa\nKitap: Tutunamayanlar (1972), 724 sayfa\nDergi: Bilim Teknik (2024), sayi 680'
          },
          rubric: [
            'Soyut sınıf + soyut metot + yapıcıda atama (B1–B3): 8p',
            'compareTo doğru imza ve yön (B4): 5p',
            'Arayüz metotları, extends + implements sırası (B5–B6): 6p',
            'Kapsülleme, super(...), salt okunur alan, ödünç durumu kuralı (B7–B10): 9p',
            'ArrayList, instanceof ile iş kuralı, sıralı listeleme (B11–B14): 7p',
            'Test sınıfında çok biçimlilik (B15–B16): 5p'
          ]
        }
      },

      /* ================================================================ PRATİK 2 */
      {
        id: 'p2',
        stage: 'pratik',
        no: 'P2',
        title: 'Sıfırdan tasarım (40p): Restoran siparişi',
        format: '2024-25 S6 / 2022-23 S5 formatı',
        practice: {
          q: 'Nesne yönelimli kavramları kullanarak bir restoranın sipariş sistemini tasarlayınız. Yapıların sınıf / soyut sınıf / arayüz hangisi olacağına siz karar vereceksiniz. Constructor, overloading, overriding, encapsulation, inheritance, polymorphism ve ArrayList kavramlarına dikkat ediniz.',
          req: [
            '<code>Urun</code> isimli bir yapı olmalı ve nesnesi oluşturulamamalı. Tüm ürünlerin <code>urunId</code> (otomatik artan), <code>ad</code> ve <code>fiyat</code> bilgisi olmalı; fiyat negatif olamaz.',
            'Urun\'den <code>Yemek</code> ve <code>Icecek</code> türetilmeli. Her ürünün <code>kdvliFiyat()</code> metodu olmalı: yemekte %10, içecekte %20 KDV.',
            'İçeceklerden <code>KutuIcecek</code> türetilmeli. Yemekler ve kutu içecekler paket servise uygundur, açık içecekler (çay vb.) değildir. Paket servise uygun ürünlerin <code>paketlemeUcreti()</code> metodu olmalı: yemek 5 TL, kutu içecek 1 TL.',
            'Ürünler fiyatlarına göre karşılaştırılabilir olmalı.',
            '<code>Siparis</code> sınıfı ürünleri <code>ArrayList</code> ile tutmalı. Paket siparişe yalnızca paket servise uygun ürün eklenebilmeli. <code>urunEkle(Urun)</code> metodunun <code>urunEkle(Urun, int adet)</code> şeklinde aşırı yüklenmiş hali olmalı.',
            '<code>toplamTutar()</code>: KDV\'li fiyatlar toplamı, paket siparişte paketleme ücretleri de eklenir. <code>enPahali()</code>: en pahalı ürün.',
            'Main sınıfında çok biçimliliği kullanarak test ediniz.'
          ],
          givenKind: 'none',
          answer: {
            html: 'Karar: <b>Urun</b> soyut sınıf (nesnesi yok, ortak alan ve yapıcı var; arayüz alan tutamaz). <b>PaketServis</b> arayüz (yetenek yalnızca bazı ürünlerde ve iki farklı dalda: Yemek ve KutuIcecek). <b>Comparable</b> kökte. KDV oranı alt sınıftan gelir, hesap üst sınıfta tek yerde.',
            main: 'RestoranTest',
            code: J`import java.util.ArrayList;
import java.util.Collections;

abstract class Urun implements Comparable<Urun> {
    private static int sonId = 0;               // otomatik ID için paylaşılan sayaç
    private final int urunId;
    private String ad;
    private double fiyat;

    public Urun(String ad, double fiyat) {
        if (fiyat < 0) throw new IllegalArgumentException("Fiyat negatif olamaz");
        this.urunId = ++sonId;
        this.ad = ad;
        this.fiyat = fiyat;
    }
    public Urun(String ad) { this(ad, 0); }     // yapıcı overload

    public int getUrunId() { return urunId; }
    public String getAd() { return ad; }
    public double getFiyat() { return fiyat; }

    protected abstract int kdvYuzde();          // her alt sınıf kendi oranını verir
    public double kdvliFiyat() {                // ortak hesap tek yerde; kdvYuzde() dinamik bağlanır
        return fiyat + fiyat * kdvYuzde() / 100.0;
    }

    @Override
    public int compareTo(Urun u) { return Double.compare(fiyat, u.fiyat); }
    @Override
    public String toString() { return urunId + "-" + ad + " " + kdvliFiyat(); }
}

interface PaketServis {
    double paketlemeUcreti();
}

class Yemek extends Urun implements PaketServis {
    public Yemek(String ad, double fiyat) { super(ad, fiyat); }
    @Override protected int kdvYuzde() { return 10; }
    @Override public double paketlemeUcreti() { return 5; }
}

class Icecek extends Urun {                     // açık içecek: paket servis YOK
    public Icecek(String ad, double fiyat) { super(ad, fiyat); }
    @Override protected int kdvYuzde() { return 20; }
}

class KutuIcecek extends Icecek implements PaketServis {   // kdvYuzde() Icecek'ten miras
    public KutuIcecek(String ad, double fiyat) { super(ad, fiyat); }
    @Override public double paketlemeUcreti() { return 1; }
}

class Siparis {
    private ArrayList<Urun> urunler = new ArrayList<>();
    private boolean paket;

    public Siparis(boolean paket) { this.paket = paket; }

    public boolean urunEkle(Urun u) {
        if (paket && !(u instanceof PaketServis)) {
            System.out.println(u.getAd() + " paket servise uygun degil");
            return false;
        }
        urunler.add(u);
        return true;
    }
    public void urunEkle(Urun u, int adet) {    // OVERLOAD: aynı isim, farklı parametre listesi
        for (int i = 0; i < adet; i++) urunEkle(u);
    }
    public double toplamTutar() {
        double toplam = 0;
        for (Urun u : urunler) {
            toplam += u.kdvliFiyat();
            if (paket) toplam += ((PaketServis) u).paketlemeUcreti();   // paket siparişte hepsi PaketServis
        }
        return toplam;
    }
    public Urun enPahali() { return Collections.max(urunler); }
    public int adet() { return urunler.size(); }
}

public class RestoranTest {
    public static void main(String[] args) {
        Urun[] menu = {                          // çok biçimli dizi
            new Yemek("Kofte", 200),
            new Icecek("Cay", 20),
            new KutuIcecek("Ayran", 30)
        };
        for (Urun u : menu) System.out.println(u);

        Siparis salon = new Siparis(false);
        salon.urunEkle(menu[0]);
        salon.urunEkle(menu[1], 2);
        System.out.println("Salon: " + salon.adet() + " urun, " + salon.toplamTutar());

        Siparis paket = new Siparis(true);
        paket.urunEkle(menu[0]);
        paket.urunEkle(menu[1]);                 // reddedilir
        paket.urunEkle(menu[2]);
        System.out.println("Paket: " + paket.adet() + " urun, " + paket.toplamTutar());
        System.out.println("En pahali: " + paket.enPahali().getAd());

        try {
            new Yemek("Hatali", -1);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
            output: '1-Kofte 220.0\n2-Cay 24.0\n3-Ayran 36.0\nSalon: 3 urun, 268.0\nCay paket servise uygun degil\nPaket: 2 urun, 262.0\nEn pahali: Kofte\nFiyat negatif olamaz'
          },
          rubric: [
            'Doğru yapı kararları (soyut sınıf / arayüz) ve gerekçesi: 8p',
            'Kapsülleme, yapıcılar, yapıcı overload, fiyat kontrolü, otomatik ID: 8p',
            'Kalıtım ve override (kdv, paketleme): 8p',
            'Comparable ve enPahali: 5p',
            'Siparis: ArrayList, instanceof kuralı, urunEkle overload, toplamTutar: 7p',
            'Main\'de çok biçimlilik: 4p'
          ]
        }
      },

      /* ================================================================ PRATİK 3 */
      {
        id: 'p3',
        stage: 'pratik',
        no: 'P3',
        title: 'Özel istisna (25p): Not sistemi',
        format: '2022-23 S6 formatı',
        practice: {
          q: '<code>Ogrenci</code> sınıfı oluşturunuz; öğrencinin notlarını tutan bir <code>ArrayList&lt;Integer&gt;</code> olsun. <code>notEkle</code> metoduyla listeye not eklenebilsin. Eklenmek istenen değer Integer değilse <code>NotTipiException</code>, 0–100 aralığında değilse <code>NotAralikException</code> fırlatılsın. Kendi istisna sınıflarınızı tanımlayıp hataları yakalayarak aşağıdaki mesajları veriniz.',
          req: [
            'TipHatasi: 72.5 not olarak eklenemez.',
            'AralikHatasi: 105 not olarak eklenemez.',
            'Ogrenci sınıfının alanları uygun erişim belirleyicilerle tanımlanmalı, uygun yapıcılar eklenmeli (encapsulation).',
            '<code>ortalama()</code> metodu eklenen notların ortalamasını döndürmeli.'
          ],
          givenKind: 'none',
          answer: {
            html: 'İki özel <b>checked</b> istisna (<code>extends Exception</code>) → <code>notEkle</code> başlığında <code>throws</code> zorunlu. Parametre <code>Object</code>: tip kontrolü <code>instanceof Integer</code> ile. Ortalamada <code>(double)</code> dönüşümü olmazsa tam sayı bölmesi yapılır.',
            main: 'NotSistemi',
            code: J`import java.util.ArrayList;

class NotTipiException extends Exception {
    public NotTipiException(Object deger) {
        super("TipHatasi: " + deger + " not olarak eklenemez.");
    }
}

class NotAralikException extends Exception {
    public NotAralikException(int deger) {
        super("AralikHatasi: " + deger + " not olarak eklenemez.");
    }
}

class Ogrenci {
    private String numara;
    private String ad;
    private ArrayList<Integer> notlar = new ArrayList<>();

    public Ogrenci(String numara, String ad) {
        this.numara = numara;
        this.ad = ad;
    }
    public Ogrenci(String numara) { this(numara, "Isimsiz"); }     // yapıcı overload

    public String getNumara() { return numara; }
    public String getAd() { return ad; }

    public void notEkle(Object deger) throws NotTipiException, NotAralikException {
        if (!(deger instanceof Integer)) throw new NotTipiException(deger);
        int n = (Integer) deger;
        if (n < 0 || n > 100) throw new NotAralikException(n);
        notlar.add(n);
    }
    public double ortalama() {
        if (notlar.isEmpty()) return 0;
        int toplam = 0;
        for (int n : notlar) toplam += n;                         // Integer → int otomatik
        return (double) toplam / notlar.size();                   // cast yoksa tam sayı bölmesi
    }
    public int notSayisi() { return notlar.size(); }
}

public class NotSistemi {
    public static void main(String[] args) {
        Ogrenci o = new Ogrenci("2301", "Efe");
        Object[] girdiler = { 85, 72.5, "90", 105, 60 };          // "90" bir String → tip hatası
        for (Object g : girdiler) {
            try {
                o.notEkle(g);
                System.out.println(g + " eklendi");
            } catch (NotTipiException | NotAralikException e) {
                System.out.println(e.getMessage());
            }
        }
        System.out.println(o.getAd() + " ortalama: " + o.ortalama() + " (" + o.notSayisi() + " not)");
    }
}`,
            output: '85 eklendi\nTipHatasi: 72.5 not olarak eklenemez.\nTipHatasi: 90 not olarak eklenemez.\nAralikHatasi: 105 not olarak eklenemez.\n60 eklendi\nEfe ortalama: 72.5 (2 not)'
          },
          rubric: [
            'İki istisna sınıfı, super(mesaj): 6p',
            'throw ve throws doğru yerde: 6p',
            'instanceof ile tip, aralık kontrolü: 5p',
            'Kapsülleme ve yapıcılar: 4p',
            'try-catch ile mesajların yazdırılması: 4p'
          ]
        }
      },

      /* ================================================================ PRATİK 4 */
      {
        id: 'p4',
        stage: 'pratik',
        no: 'P4',
        title: 'Çıktı yaz (15p): yapıcı zinciri + override + static',
        format: '2025-26 S2/S4 formatı',
        practice: {
          q: 'Aşağıdaki programın çıktısını yazınız. Önce kâğıda yaz, sonra çözümü aç.',
          givenKind: 'program',
          givenMain: 'CiktiPratik',
          given: J`class X {
    static int s = 0;
    int a = 1;
    X() { this(2); s++; System.out.println("X() a=" + a); }
    X(int k) { a += k; System.out.println("X(int) a=" + a); }
    void f() { System.out.println("X.f " + a); }
    void f(int k) { a *= k; f(); }
}

class Y extends X {
    Y() { super(); a += 10; System.out.println("Y() a=" + a); }
    Y(int k) { this(); a -= k; s++; }
    @Override
    void f() { System.out.println("Y.f " + a); }
}

public class CiktiPratik {
    public static void main(String[] args) {
        X p = new Y(4);
        p.f(2);
        X q = new X();
        q.f();
        System.out.println("s=" + X.s);
    }
}`,
          answer: {
            html: '<ol><li><code>new Y(4)</code> → <code>this()</code> → <code>Y()</code> → <code>super()</code> → <code>X()</code> → <code>this(2)</code> → <code>X(int)</code>. Alan başlatıcı <code>a = 1</code> X(int) gövdesinden önce çalışır: a = 3, "X(int) a=3".</li><li>X()\'e dönülür: s = 1, "X() a=3". Y()\'ye dönülür: a = 13, "Y() a=13". Y(int)\'e dönülür: a = 9, s = 2 (yazdırma yok).</li><li><code>p.f(2)</code>: f(int) yalnızca X\'te → a = 18, içindeki <code>f()</code> dinamik bağlanır, nesne Y → "Y.f 18".</li><li><code>new X()</code>: "X(int) a=3", s = 3, "X() a=3". <code>q.f()</code> → nesne X → "X.f 3".</li><li>s static: tüm nesneler paylaşır → "s=3".</li></ol>',
            output: 'X(int) a=3\nX() a=3\nY() a=13\nY.f 18\nX(int) a=3\nX() a=3\nX.f 3\ns=3'
          }
        }
      },

      /* ================================================================ PRATİK 5 */
      {
        id: 'p5',
        stage: 'pratik',
        no: 'P5',
        title: 'Hata bul ve düzelt (15p): Ödeme',
        format: '2025-26 S3 / 2024-25 S4 formatı',
        practice: {
          q: 'Kodda yer alan hata veya hataları satır numarasıyla birlikte tespit edip nedenini açıklayınız. Hataları düzelterek kodun çalışır hâlini ve çıktısını yazınız. (Bu kodda 6 derleme hatası var.)',
          givenKind: 'buggy',
          givenMain: 'HataBul',
          bugs: [11, 12, 13, 14, 15, 21],
          given: J`interface Odeme {
    double KOMISYON = 0.02;
    double ode(double tutar);
}
abstract class Hesap {
    private double bakiye;
    public Hesap(double bakiye) { this.bakiye = bakiye; }
    public double getBakiye() { return bakiye; }
    public abstract String tur();
}
class Kart extends Hesap implements Odeme {
    public Kart() { }
    double ode(double tutar) {
        KOMISYON = 0.01;
        bakiye -= tutar;
        return tutar * (1 + KOMISYON);
    }
}
public class HataBul {
    public static void main(String[] args) {
        Hesap h = new Hesap(100);
        Kart k = new Kart();
        System.out.println(k.ode(50));
    }
}`,
          answer: {
            html: '<ul><li><b>11</b>: Kart soyut değil ama Hesap\'ın soyut <code>tur()</code> metodunu uygulamıyor.</li><li><b>12</b>: Yapıcının ilk satırına gizli <code>super()</code> eklenir; Hesap\'ta parametresiz yapıcı yok.</li><li><b>13</b>: Arayüz metodu <code>public</code>; erişim belirleyicisiz (default) yazmak erişimi daraltır.</li><li><b>14</b>: Arayüzdeki alan <code>public static final</code>, yani sabit; değer atanamaz.</li><li><b>15</b>: <code>bakiye</code> Hesap\'ta <code>private</code>; alt sınıf doğrudan erişemez.</li><li><b>21</b>: Hesap soyut; <code>new Hesap(...)</code> yapılamaz.</li></ul>Düzeltilmiş hâli: Hesap\'a <code>protected</code> bir azaltma metodu eklendi, Kart\'a <code>super(bakiye)</code> çağıran yapıcı ve <code>tur()</code> yazıldı, soyut sınıfın nesnesi yerine somut bir alt sınıf kullanıldı.',
            main: 'HataBul',
            code: J`interface Odeme {
    double KOMISYON = 0.02;                            // sabit: değiştirilmez, sadece okunur
    double ode(double tutar);
}
abstract class Hesap {
    private double bakiye;
    public Hesap(double bakiye) { this.bakiye = bakiye; }
    public double getBakiye() { return bakiye; }
    protected void azalt(double t) { bakiye -= t; }   // alt sınıfa kontrollü erişim (15. satır)
    public abstract String tur();
}
class Kart extends Hesap implements Odeme {
    public Kart(double bakiye) { super(bakiye); }     // 12. satır: üst yapıcı açıkça çağrıldı
    @Override
    public double ode(double tutar) {                 // 13. satır: public
        double toplam = tutar * (1 + KOMISYON);       // 14. satır: atama kaldırıldı
        azalt(toplam);
        return toplam;
    }
    @Override
    public String tur() { return "Kart"; }            // 11. satır: soyut metot uygulandı
}
class Vadesiz extends Hesap {
    public Vadesiz(double bakiye) { super(bakiye); }
    @Override
    public String tur() { return "Vadesiz"; }
}
public class HataBul {
    public static void main(String[] args) {
        Hesap h = new Vadesiz(100);                   // 21. satır: somut alt sınıf
        Kart k = new Kart(200);
        System.out.println(k.ode(50));
        System.out.println(k.tur() + " " + k.getBakiye() + " / " + h.tur() + " " + h.getBakiye());
    }
}`,
            output: '51.0\nKart 149.0 / Vadesiz 100.0'
          }
        }
      },

      /* ================================================================ PRATİK 6 */
      {
        id: 'p6',
        stage: 'pratik',
        no: 'P6',
        title: 'İstisna çıktısı (12p): return ve finally',
        format: '2024-25 S5 formatı',
        practice: {
          q: 'Aşağıdaki programın çıktısını yazınız.',
          givenKind: 'program',
          givenMain: 'IstisnaCikti',
          given: J`public class IstisnaCikti {
    static int sayac = 0;

    static int islem(String s) {
        try {
            sayac++;
            int n = Integer.parseInt(s);
            int[] d = new int[2];
            d[n] = 10 / n;
            return d[n];
        } catch (ArithmeticException e) {
            System.out.println("A");
            return -1;
        } catch (RuntimeException e) {
            System.out.println("R " + e.getClass().getSimpleName());
            return -2;
        } finally {
            System.out.println("F" + sayac);
        }
    }

    public static void main(String[] args) {
        String[] girdiler = { "1", "0", "x", "5" };
        for (String g : girdiler) {
            System.out.println(islem(g));
        }
    }
}`,
          answer: {
            html: '<ul><li><b>"1"</b>: d[1] = 10, <code>return 10</code>; dönmeden önce finally "F1"; sonra main 10 yazar.</li><li><b>"0"</b>: 10/0 → ArithmeticException → "A", finally "F2", main −1 yazar.</li><li><b>"x"</b>: parseInt → NumberFormatException; ArithmeticException değil, RuntimeException\'ın alt sınıfı → "R NumberFormatException", "F3", −2.</li><li><b>"5"</b>: 10/5 = 2 hatasız, ama <code>d[5]</code> → ArrayIndexOutOfBoundsException → "R ...", "F4", −2.</li></ul>Kural: finally, return değeri hesaplandıktan sonra ama metottan çıkmadan önce çalışır; bu yüzden "F" satırı sayıdan önce yazılır.',
            output: 'F1\n10\nA\nF2\n-1\nR NumberFormatException\nF3\n-2\nR ArrayIndexOutOfBoundsException\nF4\n-2'
          }
        }
      },

      /* ================================================================ PRATİK 7 */
      {
        id: 'p7',
        stage: 'pratik',
        no: 'P7',
        title: 'Kavram boşlukları (15p): hızlı tarama',
        format: 'Her vizenin 1. sorusu',
        blanks: [
          ['Bir metot <b>final</b> ile tanımlanmışsa alt sınıfta ____ edilemez.', 'override (geçersiz kılma)'],
          ['<code>instanceof</code> operatörü ____ zamanında nesnenin bir sınıfın örneği olup olmadığını test eder ve ____ tipinde sonuç döndürür.', 'çalışma (runtime) · boolean'],
          ['Bir sınıf hem sınıftan miras alıp hem arayüz uyguluyorsa kalıtım ____, arayüz uygulaması ____ ile yapılır.', 'extends · implements'],
          ['İki arayüzde aynı imzalı ama farklı dönüş tipli metot varsa bu durum ____ hatasına neden olur.', 'derleme (compile-time)'],
          ['Cloneable ____ arayüzdür; metot içermez, sınıfın klonlanabilir olduğunu ____ için kullanılır.', 'işaretleyici (marker) · belirtmek / işaretlemek'],
          ['Soyut sınıftaki soyut metotlar alt sınıfta ____ edilmedikçe alt sınıf da ____ tanımlanmalıdır.', 'override (uygulanmadıkça) · abstract (soyut)'],
          ['Comparable uygulayan sınıf ____ metodunu override etmelidir.', 'compareTo'],
          ['Cloneable uygulayan sınıfta nesnenin kopyalanması için ____ metodu override edilmelidir.', 'clone'],
          ['____ kavramı bir nesnenin başka bir sınıfın örneğine dönüştürülmesidir.', 'casting (tip dönüşümü)'],
          ['İstisnayı yakalamak için ____ bloğu, istisnayı oluşturup fırlatmak için ____ ifadesi kullanılır.', 'catch · throw'],
          ['Metot başlığında istisnaları bildirmek için ____ kullanılır.', 'throws'],
          ['Çalışma zamanında hangi metodun çağrılacağını belirleyen mekanizma ____.', 'dinamik bağlama (dynamic binding)'],
          ['____ ve ____ kontrolsüz (unchecked) istisnalardandır.', 'ör. NullPointerException, ArithmeticException (ArrayIndexOutOfBounds, NumberFormat, ClassCast da olur)'],
          ['Object sınıfında tanımlı, nesnenin string gösterimini döndüren metot ____.', 'toString'],
          ['Alt sınıfta üst sınıfın yapıcısını çağırmak için ____ kullanılır ve yapıcının ____ satırında olmalıdır.', 'super · ilk'],
          ['Override edilebilmesi için üst sınıftaki metodun erişimi ____ olmamalıdır.', 'private (public / protected olmalı)'],
          ['Sınıfın yalnızca soyut metotlar içermesini sağlayan, çoklu kalıtımı destekleyen yapı ____.', 'arayüz (interface)'],
          ['Nesne oluşturmak için ____ anahtar kelimesiyle ____ metot çağrılır.', 'new · yapıcı (constructor)'],
          ['Veri alanlarını kapsüllemek için ____ anahtar kelimesi kullanılır.', 'private'],
          ['Arayüzde tanımlanan değişkenler otomatik olarak ____ ____ ____ olur.', 'public static final']
        ]
      }
    ]
  };
})(window.OOPLab = window.OOPLab || {});
