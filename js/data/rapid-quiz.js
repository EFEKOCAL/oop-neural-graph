/*
 * rapid-quiz.js — Hızlandırılmış öğrenme: soru-cevap (#/hizli/soru).
 *
 * Tek tek gelen çoktan seçmeli sorular. Konu sırası sınav puanına göre (k1 → k5).
 * Kodlu sorular tools/verify-rapid.js ile doğrulanır:
 *   main verilmişse      → program çalıştırılır, çıktısı options[answer] ile birebir aynı olmalı
 *   errLine verilmişse   → kod DERLENMEMELİ ve javac hatası yalnızca o satırda olmalı
 */
(function (OOPLab) {
  'use strict';

  const J = String.raw;
  OOPLab.rapid = OOPLab.rapid || {};

  OOPLab.rapid.quiz = [
    /* ---------------- Konu 1: soyut sınıf, arayüz, Comparable, Cloneable */
    {
      id: 'q1', topic: 'k1', q: 'Aşağıdakilerden hangisi bir arayüzde (interface) tanımlanamaz?',
      options: ['Sabit: <code>int MAX = 5;</code>', '<code>default</code> metot', 'Yapıcı (constructor)', '<code>static</code> metot'],
      answer: 2,
      why: 'Arayüzün nesnesi oluşturulmadığı için yapıcısı da olmaz. Alanlar otomatik sabittir (public static final); Java 8\'den beri default ve static metot da yazılabilir.'
    },
    {
      id: 'q2', topic: 'k1', q: 'Bu kod hangi satırda derleme hatası verir?',
      code: J`interface Sayac { int LIMIT = 3; void say(); }
abstract class Temel implements Sayac { }
class Somut extends Temel {
    public void say() { System.out.println(LIMIT); }
}
public class Main {
    public static void main(String[] args) {
        Temel t = new Somut();
        Sayac s = new Temel();
        t.say();
    }
}`,
      errLine: 9,
      options: ['2. satır: Temel, <code>say()</code> metodunu uygulamıyor', '8. satır: soyut tip referansı somut nesne tutamaz', '9. satır: soyut sınıfın nesnesi oluşturulamaz', '4. satır: LIMIT\'e arayüz adı olmadan erişilemez'],
      answer: 2,
      why: 'Temel soyut olduğu için <code>say()</code>\'ı uygulamak zorunda değil (2. satır doğru). Soyut tip referans olarak kullanılabilir (8. satır doğru). Ama <code>new Temel()</code> yapılamaz.'
    },
    {
      id: 'q3', topic: 'k1', q: 'Çıktı nedir?',
      code: J`import java.util.*;
class Kutu implements Comparable<Kutu> {
    int h;
    Kutu(int h) { this.h = h; }
    public int compareTo(Kutu k) { return k.h - h; }
    public String toString() { return "" + h; }
}
public class Main {
    public static void main(String[] args) {
        ArrayList<Kutu> l = new ArrayList<>();
        l.add(new Kutu(2)); l.add(new Kutu(9)); l.add(new Kutu(5));
        Collections.sort(l);
        System.out.println(l);
    }
}`,
      main: 'Main',
      options: ['[2, 5, 9]', '[9, 5, 2]', '[2, 9, 5]', 'Derleme hatası'],
      answer: 1,
      why: '<code>k.h - h</code> ters çıkarma: büyük olan "küçük" sayılır, sıralama büyükten küçüğe olur. Normal sıra için <code>h - k.h</code>.'
    },
    {
      id: 'q4', topic: 'k1', q: 'Cloneable arayüzünü uygulamayan bir sınıfta <code>super.clone()</code> çağrılırsa ne olur?',
      options: ['Derleme hatası', 'Çalışma anında CloneNotSupportedException', '<code>null</code> döner', 'Sığ kopya döner'],
      answer: 1,
      why: 'Cloneable metotsuz bir işaretleyici (marker) arayüzdür. Derleyici kontrol etmez; <code>Object.clone()</code> çalışırken bakar ve yoksa CloneNotSupportedException fırlatır.'
    },
    {
      id: 'q5', topic: 'k1', q: 'Çıktı nedir?',
      code: J`class Sepet implements Cloneable {
    int[] adet = {1, 2};
    public Sepet clone() throws CloneNotSupportedException {
        return (Sepet) super.clone();
    }
}
public class Main {
    public static void main(String[] args) throws Exception {
        Sepet a = new Sepet();
        Sepet b = a.clone();
        b.adet[0] = 7;
        System.out.println(a.adet[0] + " " + (a == b) + " " + (a.adet == b.adet));
    }
}`,
      main: 'Main',
      options: ['1 false false', '7 false true', '7 true true', '1 false true'],
      answer: 1,
      why: '<code>super.clone()</code> sığ kopya: a ve b farklı nesne (false) ama <code>adet</code> dizisini paylaşıyorlar (true). b üzerinden değişen dizi a\'da da 7 görünür.'
    },
    {
      id: 'q6', topic: 'k1', q: 'Soyut sınıf için hangisi DOĞRUDUR?',
      options: ['En az bir soyut metodu olmak zorundadır', 'Yapıcısı olabilir', '<code>final</code> olarak tanımlanabilir', 'Soyut metodu <code>private</code> olabilir'],
      answer: 1,
      why: 'Soyut sınıfın yapıcısı olur; alt sınıf <code>super(...)</code> ile çağırır. Soyut metot şart değildir. final ve private, override\'ı engellediği için abstract ile birlikte kullanılamaz.'
    },
    {
      id: 'q7', topic: 'k1', q: 'Bir sınıf hem bir sınıftan türeyip hem iki arayüz uygulayacaksa doğru yazım hangisi?',
      options: ['<code>class C implements I1, I2 extends A</code>', '<code>class C extends A implements I1, I2</code>', '<code>class C extends A, I1, I2</code>', '<code>class C extends A implements I1 implements I2</code>'],
      answer: 1,
      why: 'Önce tek <code>extends</code>, sonra virgülle ayrılmış tek bir <code>implements</code> listesi.'
    },

    /* ---------------- Konu 2: kalıtım, override/overload, çok biçimlilik */
    {
      id: 'q8', topic: 'k2', q: 'Çıktı nedir?',
      code: J`class P {
    P() { System.out.println("P"); yaz(); }
    void yaz() { System.out.println("P.yaz"); }
}
class Q extends P {
    int x = 5;
    Q() { System.out.println("Q " + x); }
    void yaz() { System.out.println("Q.yaz " + x); }
}
public class Main {
    public static void main(String[] args) {
        P p = new Q();
        p.yaz();
    }
}`,
      main: 'Main',
      options: ['P\nP.yaz\nQ 5\nQ.yaz 5', 'P\nQ.yaz 0\nQ 5\nQ.yaz 5', 'P\nQ.yaz 5\nQ 5\nQ.yaz 5', 'Q 5\nP\nQ.yaz 5'],
      answer: 1,
      why: 'Önce P\'nin yapıcısı çalışır. İçindeki <code>yaz()</code> dinamik bağlanır: nesne Q olduğu için Q\'nunki çalışır. Ama <code>x = 5</code> ataması super() bittikten sonra yapılır, o an x hâlâ 0.'
    },
    {
      id: 'q9', topic: 'k2', q: 'Çıktı nedir?',
      code: J`class A {
    void f(int x) { System.out.println("A.int"); }
    void f(double x) { System.out.println("A.double"); }
}
class B extends A {
    void f(int x) { System.out.println("B.int"); }
    void f(String s) { System.out.println("B.String"); }
}
public class Main {
    public static void main(String[] args) {
        A a = new B();
        a.f(3);
        a.f(3.0);
        B b = new B();
        b.f("x");
    }
}`,
      main: 'Main',
      options: ['A.int\nA.double\nB.String', 'B.int\nA.double\nB.String', 'B.int\nB.int\nB.String', 'Derleme hatası'],
      answer: 1,
      why: 'İmza derlemede seçilir: f(int), f(double). Hangi sınıfın sürümü çalışmada seçilir: f(int)\'i B override etti → B.int; f(double)\'ı etmedi → A.double.'
    },
    {
      id: 'q10', topic: 'k2', q: 'Çıktı nedir?',
      code: J`class X {
    X() { System.out.print("x"); }
    X(int a) { this(); System.out.print("X" + a); }
}
class Y extends X {
    Y() { super(1); System.out.print("y"); }
    Y(int b) { System.out.print("Y" + b); }
}
public class Main {
    public static void main(String[] args) {
        new Y();
        System.out.println();
        new Y(2);
        System.out.println();
    }
}`,
      main: 'Main',
      options: ['xX1y\nxY2', 'X1xy\nY2', 'xX1y\nY2', 'X1y\nxY2'],
      answer: 0,
      why: '<code>new Y()</code> → super(1) → X(1) → this() → "x", sonra "X1", sonra "y". <code>new Y(2)</code>: super yazılmamış, gizli super() → "x", sonra "Y2".'
    },
    {
      id: 'q11', topic: 'k2', q: 'Bu kod neden derlenmez?',
      code: J`class Ust { Ust(int a) { } }
class Alt extends Ust { Alt() { } }
public class Main { public static void main(String[] args) { new Alt(); } }`,
      errLine: 2,
      options: ['Alt\'ın yapıcısı public değil', 'Alt()\'a gizlice eklenen <code>super()</code>, Ust()\'yi bulamıyor', 'Ust\'ün yapıcısı private', 'Alt sınıfta yapıcı tanımlanamaz'],
      answer: 1,
      why: 'Ust\'e parametreli yapıcı yazıldığı için varsayılan Ust() yok. Çözüm: Alt()\'ın ilk satırına <code>super(0);</code> ya da Ust\'e parametresiz yapıcı.'
    },
    {
      id: 'q12', topic: 'k2', q: '<code>Calisan c = new Muhendis(); c.projeYap();</code> — <code>projeYap()</code> yalnızca Muhendis\'te tanımlı. Sonuç?',
      options: ['Muhendis\'in projeYap()\'ı çalışır', 'Derleme hatası: derleyici referans tipine (Calisan) bakar', 'Çalışma anında ClassCastException', 'NullPointerException'],
      answer: 1,
      why: 'Derleyici yalnızca referans tipindeki metotlara izin verir. Çağırmak için <code>((Muhendis) c).projeYap()</code>.'
    },
    {
      id: 'q13', topic: 'k2', q: 'Çıktı nedir?',
      code: J`class Hayvan { }
class Kedi extends Hayvan { }
class Kopek extends Hayvan { }
public class Main {
    public static void main(String[] args) {
        Hayvan h = new Kedi();
        System.out.print(h instanceof Hayvan);
        System.out.print(" " + (h instanceof Kopek));
        try {
            Kopek k = (Kopek) h;
            System.out.println(" cast ok");
        } catch (ClassCastException e) {
            System.out.println(" CCE");
        }
    }
}`,
      main: 'Main',
      options: ['true false cast ok', 'true false CCE', 'false false CCE', 'Derleme hatası'],
      answer: 1,
      why: 'Kedi bir Hayvan\'dır (true), Kopek değildir (false). <code>(Kopek) h</code> derlenir çünkü Hayvan bir Kopek olabilirdi; ama nesne Kedi olduğu için çalışmada ClassCastException.'
    },
    {
      id: 'q14', topic: 'k2', q: 'Çıktı nedir?',
      code: J`public class Main {
    public static void main(String[] args) {
        String a = "nyp";
        String b = new String("nyp");
        Integer x = 1000, y = 1000;
        System.out.println((a == b) + " " + a.equals(b) + " " + x.equals(y));
    }
}`,
      main: 'Main',
      options: ['true true true', 'false true true', 'false false true', 'false true false'],
      answer: 1,
      why: '<code>==</code> referansları (adresleri) karşılaştırır: <code>new String</code> ayrı nesne. <code>equals</code> içeriği karşılaştırır.'
    },
    {
      id: 'q15', topic: 'k2', q: '<code>final</code> ile işaretlenmiş bir metot için hangisi doğru?',
      options: ['Alt sınıfta override edilemez', 'Alt sınıfta overload edilemez', 'Hiç çağrılamaz', 'static olmak zorundadır'],
      answer: 0,
      why: 'final metot geçersiz kılınamaz (override). Aynı isimle farklı parametreli metot (overload) yazmak serbest. final sınıf ise extends edilemez.'
    },

    /* ---------------- Konu 3: sınıf, kapsülleme, static, ArrayList */
    {
      id: 'q16', topic: 'k3', q: 'Çıktı nedir?',
      code: J`class Oyuncu {
    static int sayi = 0;
    int puan = 0;
    Oyuncu() { sayi++; puan++; }
}
public class Main {
    public static void main(String[] args) {
        Oyuncu a = new Oyuncu();
        Oyuncu b = new Oyuncu();
        Oyuncu c = b;
        c.puan += 5;
        System.out.println(a.sayi + " " + b.sayi + " " + a.puan + " " + b.puan);
    }
}`,
      main: 'Main',
      options: ['1 2 1 6', '2 2 1 6', '2 2 1 1', '3 3 1 6'],
      answer: 1,
      why: '<code>sayi</code> static: iki nesne oluştu, herkes 2 görür. <code>c = b</code> yeni nesne oluşturmaz, aynı nesneyi gösterir: b\'nin puanı 1 + 5 = 6.'
    },
    {
      id: 'q17', topic: 'k3', q: 'Static bir metodun içinden örnek alanına (ör. <code>this.puan</code>) erişmeye çalışmak ne olur?',
      options: ['Çalışır, ilk nesnenin alanını verir', 'Derleme hatası', 'Çalışma anında NullPointerException', 'Alan otomatik static olur'],
      answer: 1,
      why: 'static metot bir nesneye bağlı değildir, içinde <code>this</code> yoktur: "non-static variable cannot be referenced from a static context".'
    },
    {
      id: 'q18', topic: 'k3', q: 'Sınavdaki "yapıcıda atanmalı ve yalnızca getter ile erişilmeli" isteğini karşılayan tanım hangisi?',
      options: ['public alan + getter', 'private alan + getter + setter', 'private alan + yapıcıda atama + yalnızca getter', 'protected alan + setter'],
      answer: 2,
      why: 'Kapsülleme için alan private. "Yalnızca getter" setter olmaması demek: alan salt okunur olur.'
    },
    {
      id: 'q19', topic: 'k3', q: 'Çıktı nedir?',
      code: J`import java.util.ArrayList;
public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> l = new ArrayList<>();
        l.add(4); l.add(7); l.add(1);
        l.remove(1);
        l.add(0, 9);
        System.out.println(l + " " + l.size());
    }
}`,
      main: 'Main',
      options: ['[9, 4, 7] 3', '[9, 4, 1] 3', '[4, 7, 9] 3', '[9, 7, 4] 3'],
      answer: 1,
      why: '<code>remove(1)</code> int argümanla İNDEKS 1\'i siler (7). Değer silmek için <code>remove(Integer.valueOf(1))</code>. <code>add(0, 9)</code> başa ekler.'
    },

    /* ---------------- Konu 4: istisnalar */
    {
      id: 'q20', topic: 'k4', q: 'Çıktı nedir?',
      code: J`public class Main {
    static int f() {
        try {
            System.out.print("t ");
            return 1;
        } catch (Exception e) {
            System.out.print("c ");
            return 2;
        } finally {
            System.out.print("f ");
        }
    }
    public static void main(String[] args) {
        System.out.println(f());
    }
}`,
      main: 'Main',
      options: ['t 1', 't f 1', 't 1 f', 't c f 2'],
      answer: 1,
      why: 'İstisna yok, catch çalışmaz. finally, return değeri döndürülmeden önce çalışır; main değeri sonra yazar.'
    },
    {
      id: 'q21', topic: 'k4', q: 'Çıktı nedir?',
      code: J`public class Main {
    static void a() {
        try {
            int[] d = new int[2];
            d[2] = 1;
            System.out.print("A");
        } finally {
            System.out.print("F");
        }
    }
    public static void main(String[] args) {
        try {
            a();
            System.out.print("M");
        } catch (ArithmeticException e) {
            System.out.print("X");
        } catch (RuntimeException e) {
            System.out.print("R");
        }
        System.out.println("S");
    }
}`,
      main: 'Main',
      options: ['AFMS', 'FRS', 'FXS', 'RFS'],
      answer: 1,
      why: '<code>d[2]</code> → ArrayIndexOutOfBounds. a()\'da catch yok: önce finally "F", sonra istisna main\'e yayılır. "M" atlanır; Arithmetic uymaz, RuntimeException uyar "R"; sonra "S".'
    },
    {
      id: 'q22', topic: 'k4', q: 'Hangisi kontrollü (checked) istisnadır?',
      options: ['NullPointerException', 'ArithmeticException', 'IOException', 'NumberFormatException'],
      answer: 2,
      why: 'RuntimeException altındakiler kontrolsüzdür (diğer üçü). IOException checked: yakalamak ya da <code>throws</code> ile bildirmek zorunlu.'
    },
    {
      id: 'q23', topic: 'k4', q: 'Metot başlığında istisnayı BİLDİREN ve gövdede istisnayı FIRLATAN anahtar kelimeler sırasıyla:',
      options: ['throw / throws', 'throws / throw', 'catch / throw', 'throws / catch'],
      answer: 1,
      why: '<code>void oku() throws IOException</code> bildirir; <code>throw new IOException("...")</code> fırlatır.'
    },
    {
      id: 'q24', topic: 'k4', q: 'Bu kodun sonucu nedir?',
      code: J`public class Main {
    public static void main(String[] args) {
        try {
            int x = 5 / 0;
        } catch (Exception e) {
            System.out.println("E");
        } catch (ArithmeticException e) {
            System.out.println("A");
        }
    }
}`,
      errLine: 7,
      options: ['E', 'A', 'E ve A', 'Derleme hatası: ArithmeticException zaten yakalandı'],
      answer: 3,
      why: 'Exception, ArithmeticException\'ı da kapsar; alttaki catch\'e hiç ulaşılamaz. Alt sınıfın catch\'i üstte olmalı.'
    },
    {
      id: 'q25', topic: 'k4', q: 'Çıktı nedir?',
      code: J`public class Main {
    public static void main(String[] args) {
        String s = "null";
        try {
            int n = Integer.parseInt(s);
            System.out.println(n);
        } catch (NullPointerException e) {
            System.out.println("NPE");
        } catch (NumberFormatException e) {
            System.out.println("NFE");
        }
    }
}`,
      main: 'Main',
      options: ['NPE', 'NFE', '0', 'null'],
      answer: 1,
      why: '"null" tırnak içinde: 4 harfli bir metin, null referans değil. Sayıya çevrilemez → NumberFormatException (2024 vize S5 tuzağı).'
    },

    /* ---------------- Konu 5: temeller */
    {
      id: 'q26', topic: 'k5', q: 'Program argümansız çalıştırılırsa çıktı nedir?',
      code: J`public class Main {
    static void m(int a, int[] b) { a++; b[0]++; }
    public static void main(String[] args) {
        int x = 1;
        int[] y = {1};
        m(x, y);
        System.out.println(x + " " + y[0] + " " + args.length + " " + ("" + 1 + 2) + " " + (1 + 2));
    }
}`,
      main: 'Main',
      options: ['2 2 0 12 3', '1 2 0 12 3', '1 1 0 3 3', '1 2 1 12 3'],
      answer: 1,
      why: 'int kopyası gider, x değişmez. Dizinin adresi kopyalanır, içi değişir. Argüman yoksa args boş dizidir (uzunluk 0). <code>"" + 1 + 2</code> → "12".'
    }
  ];
})(window.OOPLab = window.OOPLab || {});
