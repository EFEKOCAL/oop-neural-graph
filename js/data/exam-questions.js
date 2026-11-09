/*
 * exam-questions.js — Sınav soruları (aralıklı tekrar sayfası ve bölüm tekrarları).
 *
 * src: 'slide' → sorunun kendisi hocanın slaytında var (ör. "Programdaki hataları bulunuz")
 *      'exam'  → slayt içeriğinden sınav formatında yazılmış soru
 * Hocanın paylaştığı gerçek soruları eklemek için listenin sonuna yeni bir nesne ekleyin:
 *   { id: 'h1', set: 'Hoca · Liste 1', src: 'slide', lesson: 'ch2/yapici-zinciri', focus: 'super|zincir',
 *     q: 'Soru', code: 'isteğe bağlı Java kodu', a: '<p>Model cevap</p>', keys: ['anahtar nokta', ...],
 *     lab: { label: '...', preset: { module: 'dispatch', tab: 'chain', preset: 'faculty' } } }
 * id'ler ilerleme kaydına bağlıdır, sonradan değiştirmeyin.
 */
(function (OOPLab) {
  'use strict';

  const J = String.raw;
  const DIS = (p, label) => ({ label, preset: Object.assign({ module: 'dispatch' }, p) });
  const EXC = (p, label) => ({ label, preset: Object.assign({ module: 'exceptions' }, p) });
  const MEM = (scenario, label) => ({ label, preset: { module: 'memory', scenario } });

  OOPLab.teacherQuestions = [
    /* ---------------- Slaytta geçen sorular ---------------- */
    {
      id: 's1', set: 'Slide02 s.18', src: 'slide', lesson: 'ch2/noarg-hata', focus: 'Apple|Fruit',
      q: 'Programdaki hataları bulunuz.',
      code: J`public class Apple extends Fruit {
}

class Fruit {
    public Fruit(String name) {
        System.out.println("Fruit's constructor is invoked");
    }
}`,
      a: `<p><b>Apple derlenmez.</b> Apple'a hiç yapıcı yazılmadığı için derleyici varsayılan yapıcıyı ekler: <code>public Apple() { super(); }</code>. Bu <code>super()</code>, Fruit'in <b>parametresiz</b> yapıcısını çağırmaya çalışır.</p>
<p>Fruit'e ise bir yapıcı (<code>Fruit(String)</code>) yazıldığı için derleyici Fruit'e varsayılan yapıcı <b>eklemez</b>. <code>Fruit()</code> olmadığından hata: <i>constructor Fruit in class Fruit cannot be applied to given types</i>.</p>
<p><b>Çözüm:</b> Fruit'e <code>public Fruit() { }</code> ekle <b>veya</b> Apple'a <code>public Apple() { super("Apple"); }</code> yaz.</p>`,
      keys: ['Apple\'a varsayılan yapıcı eklenir', 'Varsayılan yapıcı gizlice super() çağırır', 'Fruit\'te no-arg yapıcı yok (yapıcı yazılınca varsayılan verilmez)', 'Sonuç: derleme hatası', 'Çözüm: Fruit() ekle veya super("...") çağır'],
      lab: DIS({ tab: 'chain', preset: 'apple' }, 'Hatayı kalıtım laboratuvarında gör')
    },
    {
      id: 's2', set: 'Slide02 s.8–17', src: 'slide', lesson: 'ch2/yapici-zinciri', focus: 'zincir|chaining',
      q: '<code>new Faculty()</code> çalışınca ekrana ne yazdırılır? Yapıcıların çağrılma sırasını açıklayınız.',
      code: J`public class Faculty extends Employee {
    public Faculty() { System.out.println("(4) Faculty"); }
}
class Employee extends Person {
    public Employee() { this("(2) Employee(String)"); System.out.println("(3) Employee()"); }
    public Employee(String s) { System.out.println(s); }
}
class Person {
    public Person() { System.out.println("(1) Person()"); }
}`,
      a: `<p>Çıktı: <code>(1) Person()</code>, <code>(2) Employee(String)</code>, <code>(3) Employee()</code>, <code>(4) Faculty</code>.</p>
<p><b>Çağrı sırası</b> alttan üste: Faculty() → (gizli super()) Employee() → (this(...)) Employee(String) → (gizli super()) Person() → Object(). <b>Gövdeler</b> ise üstten alta çalışır: önce Person, sonra Employee(String), sonra Employee()'nin kalanı, en son Faculty.</p>
<p>Employee()'nin ilk satırı <code>this(...)</code> olduğu için <b>orada</b> gizli super() eklenmez; super çağrısı Employee(String)'de yapılır.</p>`,
      keys: ['Doğru çıktı sırası 1-2-3-4', 'Gizli super() kuralı', 'this(...) aynı sınıfın diğer yapıcısına devreder', 'this(...) olan yapıcıda gizli super() eklenmez', 'Çağrı alttan üste, gövdeler üstten alta'],
      lab: DIS({ tab: 'chain', preset: 'faculty' }, 'Zinciri laboratuvarda adım adım çalıştır')
    },
    {
      id: 's3', set: 'Slide02 s.24', src: 'slide', lesson: 'ch2/override-overload', focus: 'Overriding|Overloading|override|overload',
      q: 'Aşağıdaki iki programın çıktılarını bulunuz ve farkı açıklayınız. (Tek fark A\'daki metodun parametre tipi.)',
      code: J`class B { public void p(double i) { System.out.println(i * 2); } }
class A extends B {
    public void p(double i) { System.out.println(i); }   // (1) program
 // public void p(int i)    { System.out.println(i); }   // (2) program
}
// main:
A a = new A();
a.p(10);
a.p(10.0);`,
      a: `<p><b>(1) double:</b> A.p(double) B'dekini <b>override</b> eder; A'da tek p vardır. Çıktı: <code>10.0</code>, <code>10.0</code>.</p>
<p><b>(2) int:</b> A.p(int) B'dekini <b>overload</b> eder; A'da iki p vardır. <code>a.p(10)</code> → birebir eşleşen p(int): <code>10</code>. <code>a.p(10.0)</code> → B'nin p(double)'ı: <code>20.0</code>.</p>
<p>Override: aynı imza, alt sınıfta yeni gövde, seçim <b>çalışma zamanında</b>. Overload: aynı ad, farklı parametre, seçim <b>derleme zamanında</b>.</p>`,
      keys: ['(1) çıktısı 10.0 / 10.0', '(2) çıktısı 10 / 20.0', 'Aynı imza = override', 'Farklı parametre = overload', 'Override çalışma, overload derleme zamanında seçilir']
    },
    {
      id: 's4', set: 'Slide01 s.46', src: 'slide', lesson: 'ch1/static-erisim', focus: 'static',
      q: 'Aşağıdaki sınıfta hangi satırlar hatalıdır? Neden? Nasıl düzeltilir?',
      code: J`public class A {
    int i = 5;
    static int k = 2;
    public static void main(String[] args) {
        int j = i;     // ?
        m1();          // ?
    }
    public void m1() { i = i + k + m2(i, k); }
    public static int m2(int i, int j) { return (int) Math.pow(i, j); }
}`,
      a: `<p><code>int j = i;</code> ve <code>m1();</code> <b>hatalı</b>. main <b>static</b>'tir; instance değişkenine (i) ve instance metoduna (m1) doğrudan erişemez, çünkü static bağlamda "hangi nesnenin i'si?" sorusunun cevabı yoktur (this yok).</p>
<p><b>Düzeltme:</b> önce nesne oluştur: <code>A a = new A(); int j = a.i; a.m1();</code></p>
<p>m1 ise instance metot olduğu için hem i'ye, hem static k'ye, hem static m2'ye erişebilir.</p>`,
      keys: ['int j = i hatalı', 'm1() hatalı', 'Sebep: static metot instance üyeye erişemez / this yok', 'Düzeltme: nesne oluşturup onun üzerinden erişmek', 'Instance metot her şeye erişebilir']
    },
    {
      id: 's5', set: 'Slide01 s.57–59', src: 'slide', lesson: 'ch1/immutable', focus: 'immutable|değişmez',
      q: 'Student sınıfının tüm alanları private ve hiç setter metodu yok. Student değişmez (immutable) bir sınıf mıdır? Açıklayınız. Bir sınıfın değişmez olması için hangi şartlar gerekir?',
      code: J`public class Student {
    private int id;
    private BirthDate birthDate;   // BirthDate'in setYear metodu var
    public BirthDate getBirthDate() { return birthDate; }
}`,
      a: `<p><b>Hayır.</b> <code>getBirthDate()</code>, değiştirilebilir bir BirthDate nesnesinin <b>referansını</b> dışarı verir. Dışarıdaki kod <code>student.getBirthDate().setYear(2010)</code> diyerek öğrencinin doğum yılını değiştirebilir.</p>
<p><b>Üç şart:</b> (1) tüm veri alanları private, (2) mutator (setter) yok, (3) değiştirilebilir bir alan nesnesine referans döndüren erişimci yok (gerekirse kopya döndürülür).</p>`,
      keys: ['Cevap: hayır, değişmez değil', 'Getter iç nesnenin referansını sızdırıyor', 'Dışarıdan setYear ile değiştirilebilir', 'Şart 1: alanlar private', 'Şart 2: setter yok', 'Şart 3: değiştirilebilir nesne referansı döndürülmemeli']
    },
    {
      id: 's6', set: 'Slide01 s.31', src: 'slide', lesson: 'ch1/varsayilan-deger', focus: 'yerel|initialized',
      q: 'Aşağıdaki program neden derlenmez? Aynı değişkenler sınıfın veri alanı olsaydı ne olurdu?',
      code: J`public class Test {
    public static void main(String[] args) {
        int x;
        String y;
        System.out.println("x is " + x);
        System.out.println("y is " + y);
    }
}`,
      a: `<p>x ve y <b>yerel değişkendir</b>; Java yerel değişkenlere varsayılan değer <b>atamaz</b>. Başlatılmadan okundukları için derleme hatası: <i>variable x might not have been initialized</i>.</p>
<p>Veri alanı olsalardı varsayılan değer alırlardı: int → <code>0</code>, String (referans) → <code>null</code>. Program "x is 0" ve "y is null" yazdırırdı.</p>`,
      keys: ['x ve y yerel değişken', 'Yerel değişkene varsayılan değer verilmez', 'Derleme hatası (not initialized)', 'Alan olsaydı int → 0', 'Alan olsaydı String → null']
    },
    {
      id: 's7', set: 'Slide01 s.50', src: 'slide', lesson: 'ch1/gorunurluk', focus: 'private',
      q: 'Foo sınıfında <code>private boolean x</code> ve <code>private int convert(boolean b)</code> var. <code>foo.x</code> ifadesi (a) Foo\'nun kendi main\'inde, (b) başka bir Test sınıfında yazılırsa ne olur?',
      a: `<p>(a) <b>Geçerli.</b> private erişim <b>sınıf</b> düzeyindedir: Foo sınıfının içinde, hangi Foo nesnesi üzerinden olursa olsun private üyelere erişilebilir.</p>
<p>(b) <b>Derleme hatası.</b> x ve convert Foo'da private olduğu için Test sınıfından görünmez.</p>`,
      keys: ['(a) geçerli', '(b) derleme hatası', 'private sınıf düzeyinde çalışır (nesne değil)']
    },
    {
      id: 's8', set: 'Slide02 s.39', src: 'slide', lesson: 'ch2/casting', focus: 'instanceof|cast',
      q: '<code>Fruit fruit = new GoldenDelicious(); Orange orange = new Orange();</code> verildiğinde (Fruit ← Apple ← GoldenDelicious/McIntosh, Fruit ← Orange) şunları cevaplayınız: <code>fruit instanceof Apple</code>, <code>fruit instanceof McIntosh</code>, <code>orange instanceof Apple</code>, <code>(Apple) fruit</code>, <code>(McIntosh) fruit</code>.',
      a: `<ul><li><code>fruit instanceof Apple</code> → <b>true</b> (gerçek nesne GoldenDelicious, o da bir Apple)</li>
<li><code>fruit instanceof McIntosh</code> → <b>false</b> (kardeş sınıf)</li>
<li><code>orange instanceof Apple</code> → <b>derleme hatası</b> (Orange ile Apple arasında kalıtım ilişkisi yok)</li>
<li><code>(Apple) fruit</code> → <b>başarılı</b> downcast</li>
<li><code>(McIntosh) fruit</code> → derlenir ama çalışma zamanında <b>ClassCastException</b></li></ul>`,
      keys: ['instanceof Apple → true', 'instanceof McIntosh → false', 'orange instanceof Apple → derleme hatası', '(Apple) fruit başarılı', '(McIntosh) fruit → ClassCastException (çalışma zamanı)'],
      lab: DIS({ tab: 'bind', declared: 'Person', actual: 'Student', method: 'cast:GraduateStudent' }, 'Downcast kontrolünü laboratuvarda dene')
    },
    {
      id: 's9', set: 'Slide03 s.20–21', src: 'slide', lesson: 'ch3/catch-or-declare', focus: 'yakala|bildir|declare',
      q: '<code>p2()</code> metodu <code>throws IOException</code> bildiriyor. <code>p1()</code> metodu p2\'yi çağırıyorsa p1 nasıl yazılmalıdır? İki yolu da yazınız.',
      a: `<p>IOException <b>checked</b>'tır; derleyici p1'den ya yakalamasını ya da bildirmesini ister:</p>
<div class="formula">// (a) yakala                         // (b) bildir
void p1() {                           void p1() throws IOException {
    try { p2(); }                         p2();
    catch (IOException ex) { ... }    }
}</div>
<p>İkisi de yapılmazsa: <i>unreported exception IOException; must be caught or declared to be thrown</i>. (b)'de sorumluluk p1'i çağırana geçer.</p>`,
      keys: ['IOException checked olduğu için zorunluluk var', '(a) try-catch ile yakalamak', '(b) throws IOException ile bildirmek', 'İkisi de yoksa derleme hatası', 'Bildirince sorumluluk çağırana geçer'],
      lab: EXC({ preset: 'checked' }, 'Bildirim eksikliğini laboratuvarda gör')
    },
    {
      id: 's10', set: 'Slide03 s.38–39', src: 'slide', lesson: 'ch3/ne-zaman', focus: 'Beklenmedik|refVar|ne zaman',
      q: 'Aşağıdaki kod neden kötü bir istisna kullanımıdır? Nasıl yazılmalıdır?',
      code: J`try {
    System.out.println(refVar.toString());
}
catch (NullPointerException ex) {
    System.out.println("refVar is null");
}`,
      a: `<p>İstisnalar <b>beklenmedik</b> hata durumları içindir; null kontrolü ise basit ve <b>beklenen</b> bir durumdur. İstisna yönetimi ayrıca pahalıdır: istisna nesnesi oluşturulur, çağrı yığını geri sarılır.</p>
<div class="formula">if (refVar != null)
    System.out.println(refVar.toString());
else
    System.out.println("refVar is null");</div>`,
      keys: ['İstisnalar beklenmedik durumlar için', 'null kontrolü beklenen/basit bir durum', 'İstisna yönetimi maliyetli (nesne, yığın)', 'if (refVar != null) ile yazılmalı']
    },
    {
      id: 's11', set: 'Slide03 s.51', src: 'slide', lesson: 'ch3/replace-text', focus: 'ReplaceText|değiştir',
      q: 'Bir metin dosyasındaki bir String\'i başka bir String ile değiştirip sonucu yeni dosyaya yazan ReplaceText programını yazınız. (<code>java ReplaceText sourceFile targetFile oldString newString</code>)',
      a: `<div class="formula">if (args.length != 4) { System.out.println("Usage: ..."); System.exit(1); }
File sourceFile = new File(args[0]);
if (!sourceFile.exists()) { ...; System.exit(2); }
File targetFile = new File(args[1]);
if (targetFile.exists()) { ...; System.exit(3); }
try (Scanner input = new Scanner(sourceFile);
     PrintWriter output = new PrintWriter(targetFile)) {
    while (input.hasNext()) {
        String s1 = input.nextLine();
        output.println(s1.replaceAll(args[2], args[3]));
    }
}</div>
<p>main <code>throws Exception</code> bildirir (Scanner(File) ve PrintWriter checked istisna fırlatabilir). Satır yapısı korunsun diye <code>nextLine()</code> kullanılır.</p>`,
      keys: ['Argüman sayısı kontrolü', 'Kaynak dosya var mı kontrolü', 'Hedef dosya zaten var mı kontrolü (üzerine yazmamak)', 'Scanner(File) ile okuma, PrintWriter ile yazma', 'try-with-resources veya close()', 'nextLine + replaceAll + println', 'checked istisna için throws']
    },

    /* ---------------- Sınav tipi sorular ---------------- */
    {
      id: 'e1', set: 'Sınıf ve Nesne', src: 'exam', lesson: 'ch1/kapsulleme', focus: 'kapsülleme|encapsulation|private',
      q: 'Kapsülleme (encapsulation) nedir? Veri alanları neden private yapılır? Getter ve setter metotlarının adlandırma kurallarını yazınız.',
      a: `<p><b>Kapsülleme:</b> nesnenin verisini <code>private</code> yapıp dışarıya yalnızca kontrollü metotlar (getter/setter) açmaktır.</p>
<p><b>Neden private:</b> (1) veriyi korumak: setter doğrulama yapabilir (negatif yarıçap reddedilir); (2) sınıfın bakımını kolaylaştırmak: iç gösterim değişse bile dışarıdaki kod etkilenmez.</p>
<div class="formula">public tip getOzellik()            // getter
public boolean isOzellik()         // boolean getter
public void setOzellik(tip deger)  // setter</div>`,
      keys: ['Tanım: veriyi gizleyip metotlarla erişim', 'Sebep 1: veriyi korumak / doğrulama', 'Sebep 2: bakım kolaylığı', 'getX() kuralı', 'boolean için isX()', 'setX(değer), dönüş void']
    },
    {
      id: 'e2', set: 'Sınıf ve Nesne', src: 'exam', lesson: 'ch1/static', focus: 'static|instance',
      q: 'Örnek (instance) değişkeni ile statik (static) değişken arasındaki farkı bellek açısından açıklayınız. Hangi durumda bir alan static yapılmalıdır? Örnek veriniz.',
      a: `<p><b>Instance değişkeni</b> nesneye aittir: her nesnenin kendi kopyası vardır (heap'te nesnenin içinde). <b>Static değişken</b> sınıfa aittir: bellekte <b>tek kopya</b> vardır, tüm nesneler paylaşır; hiç nesne yokken bile vardır ve <code>Sinif.ad</code> ile erişilir.</p>
<p>Değer tüm nesneler için ortaksa veya nesneden bağımsızsa static olmalı. Örnek: oluşturulan Circle sayısı (<code>static int numberOfObjects</code>), sabitler (<code>final static double PI</code>).</p>`,
      keys: ['Instance: her nesnede ayrı kopya', 'Static: sınıfa ait tek kopya, herkes paylaşır', 'Static\'e sınıf adıyla erişilir', 'Ortak/nesneden bağımsız değerler static', 'Örnek: nesne sayacı veya sabit'],
      lab: MEM('static', 'Tek kopyayı bellek laboratuvarında gör')
    },
    {
      id: 'e3', set: 'Sınıf ve Nesne', src: 'exam', lesson: 'ch1/yapici', focus: 'yapıcı|constructor',
      q: 'Yapıcı (constructor) nedir? Normal metotlardan farkları nelerdir? Varsayılan yapıcı ne zaman otomatik eklenir?',
      a: `<p>Yapıcı, <code>new</code> ile nesne oluşturulurken çalışan ve nesneyi <b>başlatan</b> özel metottur.</p>
<ul><li>Adı sınıf adıyla <b>aynı</b> olmalıdır.</li><li><b>Dönüş tipi yoktur</b> (void bile yazılmaz; yazılırsa sıradan metot olur).</li><li>Yalnızca <code>new</code> ile (veya başka yapıcıdan this/super ile) çağrılır.</li><li>Aşırı yüklenebilir.</li></ul>
<p><b>Varsayılan yapıcı</b> (boş gövdeli, parametresiz) yalnızca sınıfa <b>hiç</b> yapıcı yazılmamışsa derleyici tarafından eklenir.</p>`,
      keys: ['Nesneyi başlatan, new ile çağrılan metot', 'Adı sınıfla aynı', 'Dönüş tipi yok', 'Aşırı yüklenebilir', 'Varsayılan yapıcı sadece hiç yapıcı yoksa eklenir']
    },
    {
      id: 'e4', set: 'Sınıf ve Nesne', src: 'exam', lesson: 'ch1/this', focus: 'this',
      q: '<code>this</code> anahtar kelimesinin iki kullanımını örnekle açıklayınız. <code>radius = radius;</code> satırında ne olur?',
      a: `<p><b>1) Gizlenmiş alana erişim:</b> parametre alanla aynı adı taşıyorsa <code>this.radius = radius;</code> alanı kasteder.</p>
<p><b>2) Aynı sınıfın başka yapıcısını çağırmak:</b> <code>public Circle() { this(1.0); }</code>. <code>this(...)</code> yapıcının <b>ilk satırı</b> olmalıdır.</p>
<p><code>radius = radius;</code> parametreyi kendine atar; <b>alan değişmez</b>. Derleme hatası vermez, sessizce yanlış çalışır.</p>`,
      keys: ['this = üzerinde çalışılan nesne', 'Kullanım 1: this.alan (gizleme/shadowing)', 'Kullanım 2: this(...) ile diğer yapıcı', 'this(...) ilk satırda olmalı', 'radius = radius alanı değiştirmez']
    },
    {
      id: 'e5', set: 'Sınıf ve Nesne', src: 'exam', lesson: 'ch1/pass-by-value', focus: 'pass|geçir',
      q: 'Java\'da metotlara argümanlar nasıl geçirilir? İlkel tip ve nesne referansı için farkı bir örnekle açıklayınız.',
      a: `<p>Java'da <b>her zaman pass-by-value</b> vardır. İlkel tipte <b>değerin kopyası</b> geçer: metot içinde değiştirmek çağıranı etkilemez. Nesnede <b>referansın kopyası</b> geçer: iki referans aynı nesneyi gösterir.</p>
<ul><li>Metot nesnenin <b>içini</b> değiştirirse (<code>c.radius = 100</code>) çağıran da görür.</li><li>Metot parametreye <b>yeni nesne atarsa</b> (<code>c = new Circle()</code>) çağıranın değişkeni etkilenmez.</li></ul>`,
      keys: ['Java her zaman pass-by-value', 'İlkel: değer kopyalanır, dışarı etkilenmez', 'Nesne: referans kopyalanır', 'İçini değiştirmek dışarıya yansır', 'Yeni nesne atamak dışarıya yansımaz'],
      lab: MEM('pass', 'Bellek laboratuvarında izle')
    },
    {
      id: 'e6', set: 'Kalıtım', src: 'exam', lesson: 'ch2/polimorfizm', focus: 'polimorfizm|dinamik bağlama|dynamic',
      q: 'Polimorfizm ve dinamik bağlama nedir? <code>Person p = new Student(); p.toString();</code> çağrısında hangi toString çalışır, neden?',
      a: `<p><b>Polimorfizm:</b> üst tip bir değişken alt tip bir nesneyi gösterebilir; alt tipin nesnesi üst tipin beklendiği her yerde kullanılabilir.</p>
<p><b>Dinamik bağlama:</b> çalıştırılacak instance metot uygulaması <b>çalışma zamanında</b>, nesnenin <b>gerçek tipine</b> göre seçilir. JVM gerçek sınıftan başlayıp üst sınıflara doğru arar; ilk bulduğunu çalıştırır.</p>
<p>Burada gerçek tip Student: Student toString'i override ettiyse <b>Student'ınki</b>, etmediyse Person'ınki (o da yoksa Object'inki) çalışır. Derleyici ise yalnızca Person'da toString olup olmadığına bakar.</p>`,
      keys: ['Polimorfizm tanımı: üst tip değişken, alt tip nesne', 'Dinamik bağlama: çalışma zamanı, gerçek tip', 'Arama gerçek sınıftan yukarı, ilk bulunan', 'Derleyici bildirilen tipe bakar', 'Sonuç: Student.toString (override ettiyse)'],
      lab: DIS({ tab: 'bind', declared: 'Person', actual: 'Student', method: 'toString' }, 'Laboratuvarda arama yolunu izle')
    },
    {
      id: 'e7', set: 'Kalıtım', src: 'exam', lesson: 'ch2/equals', focus: 'equals|==',
      q: '<code>==</code> operatörü ile <code>equals()</code> metodu arasındaki fark nedir? Kendi sınıfımızda equals nasıl override edilir?',
      a: `<p><code>==</code>: ilkel tiplerde değeri, referans tiplerde <b>aynı nesneyi gösterip göstermediklerini</b> karşılaştırır. <code>equals</code>: <b>içerik</b> eşitliği içindir; ama Object'teki varsayılan hali <code>return this == obj;</code> olduğundan override edilmezse == gibi davranır.</p>
<div class="formula">@Override
public boolean equals(Object o) {
    if (o instanceof Circle)
        return radius == ((Circle) o).radius;
    return false;
}</div>
<p>Parametre <b>Object</b> olmalı; <code>equals(Circle c)</code> yazmak overload olur, override değil.</p>`,
      keys: ['== referans (aynı nesne) karşılaştırır', 'equals içerik karşılaştırması için', 'Varsayılan equals == gibi', 'İmza: public boolean equals(Object o)', 'instanceof + cast ile alan karşılaştırma']
    },
    {
      id: 'e8', set: 'Kalıtım', src: 'exam', lesson: 'ch2/protected', focus: 'protected',
      q: 'public, protected, default ve private değiştiricilerinin erişim alanlarını tablo halinde yazınız.',
      a: `<table><thead><tr><th></th><th>Aynı sınıf</th><th>Aynı paket</th><th>Alt sınıf (farklı paket)</th><th>Farklı paket</th></tr></thead><tbody>
<tr><td>public</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><td>protected</td><td>✓</td><td>✓</td><td>✓</td><td>–</td></tr>
<tr><td>default</td><td>✓</td><td>✓</td><td>–</td><td>–</td></tr>
<tr><td>private</td><td>✓</td><td>–</td><td>–</td><td>–</td></tr></tbody></table>
<p>Görünürlük artış sırası: private → default → protected → public.</p>`,
      keys: ['public her yerden', 'protected: aynı paket + alt sınıflar', 'default: sadece aynı paket', 'private: sadece aynı sınıf', 'Sıralama private < default < protected < public']
    },
    {
      id: 'e9', set: 'Kalıtım', src: 'exam', lesson: 'ch2/final', focus: 'final',
      q: '<code>final</code> değiştiricisi sınıf, metot ve değişkende ne anlama gelir?',
      a: `<ul><li><b>final sınıf:</b> genişletilemez (extends edilemez). Ör. String, Math.</li><li><b>final metot:</b> alt sınıflarda override edilemez.</li><li><b>final değişken:</b> sabittir, bir kez atanır. Referans ise başka nesneyi gösteremez ama nesnenin içi değişebilir.</li></ul>`,
      keys: ['final sınıf genişletilemez', 'final metot override edilemez', 'final değişken sabit / bir kez atanır', 'final referansın gösterdiği nesnenin içi değişebilir']
    },
    {
      id: 'e10', set: 'İstisnalar', src: 'exam', lesson: 'ch3/checked-unchecked', focus: 'checked|unchecked|kontrollü',
      q: 'Kontrollü (checked) ve kontrolsüz (unchecked) istisnaları açıklayınız; her birinden iki örnek veriniz.',
      a: `<p><b>Unchecked:</b> RuntimeException, Error ve alt sınıfları. Derleyici yakalamayı/bildirmeyi <b>zorunlu tutmaz</b> (yakalamak yine de serbesttir). Genelde düzeltilmesi gereken programlama hatalarıdır: NullPointerException, ArithmeticException, ArrayIndexOutOfBoundsException, ClassCastException.</p>
<p><b>Checked:</b> geri kalan tüm istisnalar. Derleyici "yakala ya da <code>throws</code> ile bildir" ister; aksi halde derlenmez. Genelde dış koşullardır: IOException, FileNotFoundException, ClassNotFoundException.</p>
<p>Not: Slayt 12'deki "yakalamanıza izin vermez" ifadesi çeviri hatasıdır; doğrusu "zorunlu tutmaz".</p>`,
      keys: ['Unchecked = RuntimeException + Error soyu', 'Unchecked: zorunluluk yok', 'Checked: yakala ya da bildir zorunlu', 'Unchecked örnekleri (NPE, Arithmetic...)', 'Checked örnekleri (IOException...)'],
      lab: EXC({ preset: 'checked' }, 'Laboratuvarda checked/unchecked farkını dene')
    },
    {
      id: 'e11', set: 'İstisnalar', src: 'exam', lesson: 'ch3/declare-throw-catch', focus: 'throws|throw',
      q: '<code>throw</code> ile <code>throws</code> arasındaki farkı örnekle açıklayınız.',
      a: `<p><code>throw</code> metot <b>gövdesinde</b> bir istisna <b>nesnesini fırlatır</b>: <code>throw new IllegalArgumentException("Radius cannot be negative");</code></p>
<p><code>throws</code> metot <b>başlığında</b> metodun fırlatabileceği istisna <b>tiplerini bildirir</b>: <code>public void setRadius(double r) throws IllegalArgumentException</code>. Birden fazla tip virgülle ayrılır.</p>
<p>Biri eylem, diğeri bildirimdir; checked istisna fırlatan metot throws ile bildirmek zorundadır.</p>`,
      keys: ['throw gövdede, nesne fırlatır', 'throw new X(...) sözdizimi', 'throws başlıkta, tip bildirir', 'Birden çok tip virgülle', 'Checked istisnada throws zorunlu']
    },
    {
      id: 'e12', set: 'İstisnalar', src: 'exam', lesson: 'ch3/finally', focus: 'finally',
      q: 'finally bloğu ne zaman çalışır? try içinde return varsa çalışır mı? Ne için kullanılır?',
      a: `<p>finally, try bloğu <b>istisnasız bitse de</b>, <b>istisna yakalansa da</b>, <b>istisna yakalanmayıp yukarı yayılsa da</b> çalışır. try veya catch içinde <code>return</code> olsa bile metottan çıkmadan <b>önce</b> çalışır (yalnızca <code>System.exit()</code> atlatır).</p>
<p>Kullanım: dosya kapatmak, kaynak serbest bırakmak gibi "ne olursa olsun" yapılması gereken işler.</p>`,
      keys: ['İstisna yokken çalışır', 'İstisna yakalanınca çalışır', 'Yakalanmayan istisnada da (yayılmadan önce) çalışır', 'return olsa bile çalışır', 'Amaç: kaynak temizliği'],
      lab: EXC({ preset: 'finally' }, 'finally\'yi laboratuvarda izle')
    },
    {
      id: 'e13', set: 'İstisnalar', src: 'exam', lesson: 'ch3/yayilim', focus: 'yayıl|call stack|yığın',
      q: 'main → method1 → method2 → method3 çağrı zincirinde method3 bir istisna fırlatırsa uygun işleyici nasıl bulunur? Yakalanmazsa ne olur?',
      a: `<p>JVM çağrı yığınında <b>geriye doğru</b> arar: önce method3'te istisnayı saran try'ın catch'lerine bakar; uyan yoksa method3 sonlanır ve istisna method2'ye geçer. Aynı arama method2, method1 ve main'de tekrarlanır. Uyan ilk catch çalışır, ardından o metot try-catch'ten sonraki satırdan normal akışla devam eder. Aradaki metotların kalan satırları <b>çalışmaz</b> (varsa finally çalışır).</p>
<p>main'de de yakalanmazsa program sonlanır ve yığın izi (stack trace) yazdırılır.</p>`,
      keys: ['Arama çağrı yığınında geriye doğru', 'Uyan catch yoksa metot sonlanır, istisna çağırana geçer', 'Catch, tipi ve alt tiplerini yakalar', 'Yakalandıktan sonra normal akış', 'Yakalanmazsa program sonlanır, stack trace'],
      lab: EXC({ preset: 'yayilim' }, 'Slayttaki yayılımı laboratuvarda çalıştır')
    },
    {
      id: 'e14', set: 'Sınıf ve Nesne', src: 'exam', lesson: 'ch1/wrapper', focus: 'wrapper|Integer|autoboxing',
      q: 'Wrapper sınıflar nedir, neden gereklidir? Autoboxing ve unboxing\'i açıklayınız. <code>ArrayList&lt;int&gt;</code> neden yazılamaz?',
      a: `<p>Wrapper sınıflar ilkel tipleri <b>nesne</b> olarak sarar: int → Integer, double → Double, char → Character, boolean → Boolean…</p>
<p>Generic yapılar (ArrayList gibi) ve Object parametresi alan metotlar yalnızca <b>nesne</b> kabul eder; <code>ArrayList&lt;int&gt;</code> bu yüzden derleme hatasıdır, <code>ArrayList&lt;Integer&gt;</code> yazılır.</p>
<p><b>Autoboxing:</b> ilkel → wrapper otomatik (<code>Integer x = 5;</code>). <b>Unboxing:</b> wrapper → ilkel otomatik (<code>int y = x;</code>). Tuzaklar: Integer'ları == ile karşılaştırmak; null Integer'ı unbox etmek (NPE); <code>list.remove(1)</code> indeks siler.</p>`,
      keys: ['Wrapper = ilkel tipi nesne olarak saran sınıf', 'Örnek eşleşmeler (int→Integer...)', 'Generic yapılar sadece nesne tutar', 'Autoboxing tanımı', 'Unboxing tanımı', 'En az bir tuzak (==, null, remove)']
    },
    {
      id: 'e15', set: 'Sınıf ve Nesne', src: 'exam', lesson: 'ch1/arraylist', focus: 'ArrayList|dizi',
      q: 'Dizi (array) ile ArrayList arasındaki farkları yazınız. Hangi durumda hangisi tercih edilir?',
      a: `<p><b>Dizi:</b> oluşturulduktan sonra boyutu <b>sabittir</b>; ekleme/silme/arama desteği zayıftır; ilkel tip tutabilir; <code>a[i]</code>, <code>a.length</code>.</p>
<p><b>ArrayList:</b> <b>dinamik büyür</b> (dolunca iki katı büyüklükte yeni dizi açıp kopyalar); <code>add</code>, <code>add(i, e)</code>, <code>remove</code>, <code>contains</code>, <code>indexOf</code> gibi metotları vardır; yalnızca nesne tutar; <code>get(i)</code>, <code>size()</code>.</p>
<p>Eleman sayısı belli ve değişmiyorsa dizi; değişkense veya liste metotlarına ihtiyaç varsa ArrayList.</p>`,
      keys: ['Dizi boyutu sabit', 'ArrayList dinamik büyür', 'ArrayList ekleme/silme/arama metotları', 'ArrayList sadece nesne tutar', 'length vs size()', 'Tercih kuralı']
    },
    {
      id: 'e16', set: 'Soyut Sınıf ve Arayüz', src: 'exam', lesson: 'ch4/soyut-vs-arayuz', focus: 'arayüz|interface|soyut',
      q: 'Soyut sınıf ile arayüz (interface) arasındaki farkları yazınız. Bir sınıf kaç sınıfı extend, kaç arayüzü implement edebilir?',
      a: `<table><thead><tr><th></th><th>Soyut sınıf</th><th>Arayüz</th></tr></thead><tbody>
<tr><td>Alanlar</td><td>her türlü</td><td>sadece public static final sabitler</td></tr>
<tr><td>Yapıcı</td><td>var</td><td>yok</td></tr>
<tr><td>Metotlar</td><td>soyut + somut</td><td>soyut (Java 8+: default/static)</td></tr>
<tr><td>İlişki</td><td>güçlü is-a</td><td>yetenek (Comparable, Edible)</td></tr></tbody></table>
<p>İkisinden de <code>new</code> ile nesne oluşturulamaz. Bir sınıf <b>bir</b> sınıfı extend edebilir ama <b>birden çok</b> arayüzü implement edebilir.</p>`,
      keys: ['Soyut sınıfta her türlü alan, arayüzde sadece sabit', 'Soyut sınıfın yapıcısı var, arayüzün yok', 'Arayüz metotları public abstract', 'İkisinden de new ile nesne olmaz', 'Tek extends, çoklu implements']
    }
  ];
})(window.OOPLab = window.OOPLab || {});
