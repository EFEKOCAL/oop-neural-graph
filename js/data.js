/* =========================================================================
   data.js — Bilgi hiyerarşisi
   -------------------------------------------------------------------------
   Yapı:  root → categories[] → concepts[]
   Her kavram: { id, title, label?, def, code, js }
     - label : graf üzerinde gösterilen kısa ad (yoksa title kullanılır)
     - code  : Java örneği. Satır sonundaki "//!" işareti, panel açıldığında
               o satırın PARLATILACAĞINI belirtir; ekranda gösterilmez.
     - js    : Vanilla JS (ES6 class) karşılığı — dosyanın sonundaki
               JS_EXAMPLES tablosundan id ile eşlenerek eklenir.
     - quiz  : (isteğe bağlı) mini sınav — QUIZZES tablosundan eklenir.
               Tek aşamalı: { question, code?, lang?, options[], answer, explain }
               Çok aşamalı: { code, lang?, stages: [ {step, question, options,
                              answer, explain, errorLine?, output?}, ... ] }
     - traps : (isteğe bağlı) sınav tuzakları — TRAPS tablosundan eklenir.
               [{ title, text }] veya düz metin dizisi
   ========================================================================= */

const KNOWLEDGE = {
  root: {
    id: "oop",
    title: "Object Oriented Programming",
    label: "OOP",
    def: "Nesne Yönelimli Programlama, yazılımı veri ve davranışı bir arada taşıyan, birbiriyle mesajlaşan nesneler olarak modelleyen paradigmadır. Dört temel ilkesi kapsülleme, kalıtım, çok biçimlilik ve soyutlamadır.",
  },

  categories: [
    /* ===================== 1. CORE OOP ===================== */
    {
      id: "core",
      title: "Core OOP",
      color: "#4fc3f7",
      def: "Sınıf ve nesne kavramlarının temeli: veriyi ve davranışı tek bir birimde toplamak, nesnelerin bellekteki yaşam döngüsünü anlamak.",
      concepts: [
        {
          id: "objects",
          title: "Nesneler",
          def: "Nesne; durumu (veri alanları) ve davranışı (metotlar) bir arada tutan, gerçek dünyadaki bir varlığın programdaki temsilidir. Her nesnenin benzersiz bir kimliği (identity) vardır.",
          code: `Circle c1 = new Circle(5.0); //!
Circle c2 = new Circle(2.5);

System.out.println(c1.getArea()); // davranış
c2.radius = 10;                   // durum değişti
System.out.println(c1 == c2);     // false: farklı kimlik`,
        },
        {
          id: "classes",
          title: "Sınıflar",
          def: "Sınıf, aynı türdeki nesnelerin veri alanlarını ve metotlarını tanımlayan şablondur (blueprint). Nesne ise sınıfın bir örneğidir (instance).",
          code: `public class Circle { //!
    double radius = 1.0;              // veri alanı

    Circle() { }                      // yapıcı
    Circle(double r) { radius = r; }

    double getArea() {                // metot
        return Math.PI * radius * radius;
    }
}`,
        },
        {
          id: "uml",
          title: "UML Sınıf Diyagramı",
          label: "UML Diyagramı",
          def: "UML sınıf diyagramı bir sınıfı üç bölmeyle gösterir: ad, veri alanları ve metotlar. Görünürlük işaretleri: - private, + public, # protected. Static üyelerin altı çizilir.",
          code: `// ┌──────────────────────────────┐
// │            Circle            │ //!
// ├──────────────────────────────┤
// │ -radius: double              │
// ├──────────────────────────────┤
// │ +Circle()                    │
// │ +Circle(radius: double)      │
// │ +getArea(): double           │
// │ +setRadius(r: double): void  │
// └──────────────────────────────┘`,
        },
        {
          id: "constructors",
          title: "Yapıcılar",
          label: "Yapıcılar (Constructors)",
          def: "Yapıcı, nesne new ile oluşturulurken çağrılan, sınıfla aynı ada sahip ve dönüş tipi olmayan özel metottur. Hiç yazılmazsa derleyici parametresiz bir varsayılan yapıcı ekler.",
          code: `public class Student {
    private String name;
    private int age;

    public Student() { this("İsimsiz", 18); } // zincirleme
    public Student(String name, int age) {    //!
        this.name = name;
        this.age = age;
    }
}`,
        },
        {
          id: "primitive-vs-object",
          title: "İlkel vs Nesne Türleri",
          label: "İlkel vs Nesne",
          def: "İlkel türler (int, double, boolean...) değeri doğrudan saklar. Nesne türündeki değişkenler ise nesnenin bellekteki adresini, yani referansını saklar. Atama işlemi ilkelde değeri, nesnede referansı kopyalar.",
          code: `int a = 5;
int b = a;      // değer kopyalandı
b = 10;         // a hâlâ 5

Circle c1 = new Circle(5);
Circle c2 = c1; // referans kopyalandı //!
c2.radius = 10; // c1.radius da artık 10!`,
        },
        {
          id: "garbage-collection",
          title: "Çöp Toplama",
          label: "Çöp Toplama (GC)",
          def: "Hiçbir referansın göstermediği nesneler, JVM'in çöp toplayıcısı (Garbage Collector) tarafından otomatik olarak bellekten silinir. C++'taki gibi elle delete yazmak gerekmez.",
          code: `Circle c1 = new Circle(1);
Circle c2 = new Circle(2);

c1 = c2;   // Circle(1) artık erişilemez //!
           // → GC uygun bir anda belleği geri alır
c2 = null;
c1 = null; // Circle(2) de çöp oldu`,
        },
        {
          id: "encapsulation",
          title: "Kapsülleme (Getter/Setter)",
          label: "Kapsülleme",
          def: "Veri alanlarını private yapıp dışarıdan doğrudan erişimi engellemek, erişimi getter/setter metotlarıyla kontrol etmektir. Böylece geçersiz veri girişi engellenir ve sınıfın iç yapısı serbestçe değiştirilebilir.",
          code: `public class Account {
    private double balance; //!

    public double getBalance() { return balance; }

    public void setBalance(double value) {
        if (value < 0) throw new IllegalArgumentException("Negatif bakiye!");
        balance = value;
    }
}`,
        },
        {
          id: "this",
          title: "this Anahtar Kelimesi",
          label: "this",
          def: "this, metodu çağıran nesnenin kendisine olan referanstır. Parametre tarafından gizlenen (shadowed) veri alanlarına erişmek ve aynı sınıftaki başka bir yapıcıyı this(...) ile çağırmak için kullanılır.",
          code: `public class Circle {
    private double radius;

    public Circle(double radius) {
        this.radius = radius; // alan = parametre //!
    }
    public Circle() {
        this(1.0);            // diğer yapıcıyı çağır
    }
}`,
        },
        {
          id: "reference-fields",
          title: "Referans Veri Alanları",
          label: "Referans Alanlar",
          def: "Bir sınıfın veri alanı başka bir sınıf türünde olabilir. Bu alan nesnenin kendisini değil, ona olan referansı tutar ve varsayılan değeri null'dır.",
          code: `public class Student {
    private String name;      // referans alan (varsayılan null)
    private Address address;  // başka sınıfa referans //!
    private int age;          // ilkel alan (varsayılan 0)
    private boolean enrolled; // varsayılan false
}`,
        },
        {
          id: "null",
          title: "null Değeri",
          label: "null",
          def: "null, bir referans değişkeninin hiçbir nesneyi göstermediğini belirten özel değerdir. null bir referans üzerinden üye çağırmak NullPointerException fırlatır.",
          code: `String name = null;

if (name != null) {            // güvenli kontrol
    System.out.println(name.length());
}
name.length(); // NullPointerException! //!`,
        },
      ],
    },

    /* ===================== 2. ADVANCED OOP ===================== */
    {
      id: "advanced",
      title: "Advanced OOP",
      color: "#a78bfa",
      def: "Kalıtım, çok biçimlilik ve soyutlama ile esnek ve genişletilebilir sınıf hiyerarşileri kurmak.",
      concepts: [
        {
          id: "inheritance",
          title: "Kalıtım",
          label: "Kalıtım (Inheritance)",
          def: "Mevcut bir sınıftan (süper sınıf) yeni bir sınıf türeterek alanları ve metotları yeniden kullanmaktır. \"is-a\" ilişkisini modeller. Java sınıflarda tekli kalıtımı destekler.",
          code: `public class GeometricObject {
    private String color = "white";
    public String getColor() { return color; }
}

public class Circle extends GeometricObject { //!
    private double radius;
    // getColor() miras alındı
}`,
        },
        {
          id: "super-sub",
          title: "Süper/Alt Sınıflar",
          label: "Süper / Alt Sınıf",
          def: "Süper sınıf genel, alt sınıf özel türdür. Alt sınıf süper sınıfın public/protected üyelerini miras alır ve yeni üyeler ekleyebilir. private üyeleri ise doğrudan göremez.",
          code: `// Süper sınıf (genel)
class Animal {
    protected String name;
    void eat() { System.out.println(name + " yiyor"); }
}
// Alt sınıf (özel)
class Dog extends Animal { //!
    void bark() { System.out.println("Hav!"); } // yeni davranış
}`,
        },
        {
          id: "super",
          title: "super",
          def: "super anahtar kelimesi süper sınıfa başvurur. super(...) süper sınıfın yapıcısını çağırır ve yapıcının ilk satırı olmalıdır. super.method() ise ezilmiş metodun üst sınıftaki sürümünü çağırır.",
          code: `public class Circle extends GeometricObject {
    private double radius;

    public Circle(double radius, String color) {
        super(color);          // ilk satırda olmalı //!
        this.radius = radius;
    }
    @Override
    public String toString() {
        return super.toString() + " r=" + radius;
    }
}`,
        },
        {
          id: "overriding",
          title: "Metot Ezme (Overriding)",
          label: "Overriding",
          def: "Alt sınıfın, süper sınıftan miras aldığı bir örnek metodunu aynı imza ve dönüş tipiyle yeniden tanımlamasıdır. @Override açıklaması, derleyicinin imzayı denetlemesini sağlar.",
          code: `class Animal {
    public String sound() { return "..."; }
}
class Cat extends Animal {
    @Override //!
    public String sound() { return "Miyav"; } // aynı imza
}`,
        },
        {
          id: "overloading",
          title: "Aşırı Yükleme (Overloading)",
          label: "Overloading",
          def: "Aynı sınıfta aynı ada fakat farklı parametre listesine sahip birden çok metot tanımlamaktır. Hangi metodun çağrılacağına derleme zamanında karar verilir.",
          code: `public class MathUtil {
    static int max(int a, int b) { return a > b ? a : b; }
    static double max(double a, double b) { return a > b ? a : b; } //!
    static int max(int a, int b, int c) { return max(max(a, b), c); }
}
MathUtil.max(3, 7);      // int sürümü
MathUtil.max(2.5, 1.0);  // double sürümü`,
        },
        {
          id: "polymorphism",
          title: "Çok Biçimlilik (Polymorphism)",
          label: "Polymorphism",
          def: "Süper sınıf türündeki bir değişkenin herhangi bir alt sınıf nesnesini gösterebilmesidir. Aynı metot çağrısı, nesnenin gerçek türüne göre farklı davranış sergiler.",
          code: `GeometricObject[] shapes = {
    new Circle(2), new Rectangle(3, 4)
};
for (GeometricObject s : shapes) {
    System.out.println(s.getArea()); // her biri kendi getArea'sı //!
}`,
        },
        {
          id: "dynamic-binding",
          title: "Dinamik Bağlama",
          label: "Dynamic Binding",
          def: "Hangi metot uygulamasının çalışacağına çalışma zamanında, değişkenin bildirilen türüne (declared type) değil nesnenin gerçek türüne (actual type) bakılarak karar verilmesidir. JVM en özel sınıftan başlayıp yukarı doğru arar.",
          code: `Object o = new Circle(1);   // bildirilen: Object, gerçek: Circle
System.out.println(o.toString()); //!
// JVM arama sırası: Circle → GeometricObject → Object
// İlk bulunan toString() çalışır`,
        },
        {
          id: "casting",
          title: "Casting",
          label: "Casting",
          def: "Nesne türü dönüşümüdür. Alt sınıftan süper sınıfa dönüşüm (upcasting) örtüktür. Süper sınıftan alt sınıfa dönüşüm (downcasting) açık cast gerektirir; tür uygun değilse ClassCastException fırlar.",
          code: `Object o = new Circle(2);   // upcasting (örtük)
Circle c = (Circle) o;      // downcasting (açık) //!
System.out.println(c.getRadius());

Object s = "metin";
Circle x = (Circle) s;      // ClassCastException!`,
        },
        {
          id: "instanceof",
          title: "instanceof",
          def: "Bir nesnenin belirli bir sınıfın (veya alt sınıfının) örneği olup olmadığını test eder. Güvenli downcasting'den önce kullanılır. Java 16+ pattern matching ile değişkeni de aynı anda bağlar.",
          code: `Object o = new Circle(3);

if (o instanceof Circle) {           // klasik kullanım
    Circle c = (Circle) o;
    System.out.println(c.getArea());
}
if (o instanceof Circle c2) {        // Java 16+ //!
    System.out.println(c2.getRadius());
}`,
        },
        {
          id: "abstract",
          title: "Soyut Sınıflar",
          label: "Abstract Class",
          def: "Soyut sınıf, new ile örneği oluşturulamayan ve gövdesiz (abstract) metotlar içerebilen sınıftır. Alt sınıflar soyut metotları uygulamak zorundadır. Soyut sınıfların yapıcısı olabilir.",
          code: `public abstract class Shape { //!
    public abstract double getArea(); // gövdesiz

    public void describe() {          // somut metot
        System.out.println("Alan: " + getArea());
    }
}
// Shape s = new Shape();  → derleme hatası!
class Square extends Shape {
    double side = 2;
    public double getArea() { return side * side; }
}`,
        },
        {
          id: "interfaces",
          title: "Arayüzler (Comparable, Cloneable)",
          label: "Interfaces",
          def: "Arayüz, sınıfların uygulaması gereken bir davranış sözleşmesidir; bir sınıf birden çok arayüzü implement edebilir. Comparable<T> doğal sıralamayı (compareTo) tanımlar; Cloneable ise clone() ile kopyalanabilirliği işaretleyen bir marker interface'tir.",
          code: `public class Circle implements Comparable<Circle>, Cloneable { //!
    double radius;

    @Override
    public int compareTo(Circle o) {
        return Double.compare(radius, o.radius);
    }
    @Override
    public Circle clone() throws CloneNotSupportedException {
        return (Circle) super.clone();
    }
}`,
        },
      ],
    },

    /* ===================== 3. İSTİSNA YÖNETİMİ ===================== */
    {
      id: "exceptions",
      title: "İstisna Yönetimi",
      color: "#fb7185",
      def: "Çalışma zamanında oluşan hataları kontrollü biçimde yakalamak, iletmek ve anlamlı hâle getirmek.",
      concepts: [
        {
          id: "throwable",
          title: "Throwable",
          def: "Java'daki tüm hata ve istisnaların kök sınıfıdır. İki ana alt sınıfı vardır: Error ve Exception. getMessage() ve printStackTrace() gibi ortak metotları sağlar.",
          code: `// Throwable //!
//  ├── Error             (sistem hataları, yakalanmaz)
//  └── Exception
//       ├── IOException       (checked)
//       └── RuntimeException  (unchecked)
try { riskyCall(); }
catch (Throwable t) { t.printStackTrace(); }`,
        },
        {
          id: "error",
          title: "Error",
          def: "JVM'in iç hatalarını veya kaynak tükenmesini temsil eder (OutOfMemoryError, StackOverflowError). Program genellikle bunlardan kurtulamaz; yakalanmaları önerilmez.",
          code: `static int recurse(int n) {
    return recurse(n + 1); // durma koşulu yok
}
recurse(0); // java.lang.StackOverflowError //!

int[] huge = new int[Integer.MAX_VALUE]; // OutOfMemoryError`,
        },
        {
          id: "exception",
          title: "Exception",
          def: "Programın yakalayıp kurtulabileceği durumları temsil eder. Checked istisnalar (IOException gibi) derleyici tarafından denetlenir. RuntimeException ve alt sınıfları ise unchecked'dir.",
          code: `// Checked: ele alınmazsa derleme hatası
FileReader fr = new FileReader("data.txt"); // IOException

// Unchecked: RuntimeException alt sınıfları
int[] a = new int[3];
a[5] = 1;            // ArrayIndexOutOfBoundsException //!
int x = 10 / 0;      // ArithmeticException`,
        },
        {
          id: "try-catch-finally",
          title: "try-catch-finally",
          def: "try riskli kodu çalıştırır, catch belirli istisna türlerini yakalar, finally ise istisna olsun olmasın her durumda çalışır ve kaynakları kapatmak için kullanılır.",
          code: `Scanner in = null;
try {
    in = new Scanner(new File("data.txt"));
    System.out.println(in.nextLine());
} catch (FileNotFoundException e) {
    System.out.println("Dosya yok: " + e.getMessage());
} finally { //!
    if (in != null) in.close(); // her durumda çalışır
}`,
        },
        {
          id: "throws",
          title: "throws",
          def: "Metot imzasında, metodun fırlatabileceği checked istisnaları bildirir ve bu istisnaları ele alma sorumluluğunu çağıran koda devreder.",
          code: `public static String readFirstLine(String path)
        throws FileNotFoundException { //!
    Scanner in = new Scanner(new File(path));
    return in.nextLine();
}
// Çağıran ya try-catch kullanmalı ya da throws ile devretmeli`,
        },
        {
          id: "throw",
          title: "throw",
          def: "Bir istisna nesnesini açıkça fırlatır. Genellikle geçersiz bir argüman veya durum tespit edildiğinde kullanılır.",
          code: `public void setRadius(double r) {
    if (r < 0) {
        throw new IllegalArgumentException("Yarıçap negatif olamaz"); //!
    }
    radius = r;
}`,
        },
        {
          id: "chained",
          title: "Zincirleme İstisna",
          label: "Chained Exception",
          def: "Bir istisnayı yakalayıp asıl nedeni (cause) koruyarak daha anlamlı yeni bir istisna fırlatmaktır. Orijinal hataya getCause() ile ulaşılır.",
          code: `try {
    loadConfig();
} catch (IOException e) {
    throw new RuntimeException("Ayarlar yüklenemedi", e); //!
}
// Yakalayan taraf:
// ex.getCause() → orijinal IOException`,
        },
        {
          id: "custom-exceptions",
          title: "Özel İstisnalar",
          label: "Custom Exception",
          def: "Exception (checked) veya RuntimeException (unchecked) sınıfından türetilerek, alana özgü ve anlamlı hata türleri oluşturulur.",
          code: `public class InvalidRadiusException extends Exception { //!
    private final double radius;

    public InvalidRadiusException(double radius) {
        super("Geçersiz yarıçap: " + radius);
        this.radius = radius;
    }
    public double getRadius() { return radius; }
}`,
        },
      ],
    },

    /* ===================== 4. EVENT-DRIVEN ===================== */
    {
      id: "events",
      title: "Event-Driven",
      color: "#34d399",
      def: "Programın akışını kullanıcı eylemlerine ve sistem olaylarına göre yönlendirmek.",
      concepts: [
        {
          id: "events-basics",
          title: "Olaylar",
          label: "Olaylar (Events)",
          def: "Olay güdümlü programlamada kodun akışını kullanıcı eylemleri (tıklama, tuşa basma) veya sistem olayları belirler. Olayı üreten bileşene kaynak (source), olayı temsil eden nesneye olay nesnesi (ActionEvent, MouseEvent) denir.",
          code: `// Kaynak: button → Olay: ActionEvent → İşleyici: lambda
Button btn = new Button("Tamam");
btn.setOnAction(e -> { //!
    Object source = e.getSource(); // olayı üreten nesne
    System.out.println("Tıklandı: " + source);
});`,
        },
        {
          id: "listeners",
          title: "Dinleyiciler",
          label: "Dinleyiciler (Listeners)",
          def: "Dinleyici (listener/handler), bir olay arayüzünü (EventHandler<T>, ActionListener) uygulayan ve kaynağa kaydedilen nesnedir. Olay gerçekleşince kaynak, dinleyicinin metodunu çağırır.",
          code: `class OKHandler implements EventHandler<ActionEvent> { //!
    @Override
    public void handle(ActionEvent e) {
        System.out.println("OK basıldı");
    }
}
Button btOK = new Button("OK");
btOK.setOnAction(new OKHandler()); // kaynağa kaydet`,
        },
        {
          id: "inner-classes",
          title: "İç Sınıflar",
          label: "Inner Class",
          def: "Başka bir sınıfın içinde tanımlanan sınıftır. Dış sınıfın private üyelerine bile erişebilir; dinleyicileri kaynağın yakınında tanımlamak için idealdir.",
          code: `public class Counter {
    private int count = 0;

    class IncrementHandler implements EventHandler<ActionEvent> { //!
        public void handle(ActionEvent e) {
            count++;   // dış sınıfın private alanına erişim
        }
    }
}`,
        },
        {
          id: "anonymous-classes",
          title: "Anonim Sınıflar",
          label: "Anonymous Class",
          def: "Adı olmayan ve tanımlandığı yerde tek seferlik örneği oluşturulan iç sınıftır. Bir arayüzü uygular veya bir sınıfı genişletir.",
          code: `btn.setOnAction(new EventHandler<ActionEvent>() { //!
    @Override
    public void handle(ActionEvent e) {
        System.out.println("Anonim sınıf çalıştı");
    }
});`,
        },
        {
          id: "lambda",
          title: "Lambda İfadeleri",
          label: "Lambda",
          def: "Tek soyut metotlu bir arayüzün (functional interface) uygulamasını kısaca yazmanın yoludur: (parametreler) -> gövde. Anonim sınıfların sadeleştirilmiş hâlidir.",
          code: `// Anonim sınıf yerine:
btn.setOnAction(e -> System.out.println("Lambda!")); //!

Comparator<String> byLength = (a, b) -> a.length() - b.length();
Runnable task = () -> System.out.println("Çalışıyor");`,
        },
        {
          id: "mouse-key-events",
          title: "Fare/Klavye Olayları",
          label: "Mouse / Key Events",
          def: "MouseEvent fare konumunu ve düğmesini (getX(), getButton()), KeyEvent ise basılan tuşu (getCode(), getText()) taşır. Bu olaylar setOnMouseDragged, setOnKeyPressed gibi metotlarla dinlenir.",
          code: `circle.setOnMouseDragged(e -> { //!
    circle.setCenterX(e.getX());
    circle.setCenterY(e.getY());
});
text.setOnKeyPressed(e -> {
    switch (e.getCode()) {
        case UP:   text.setY(text.getY() - 10); break;
        case DOWN: text.setY(text.getY() + 10); break;
    }
});
text.requestFocus(); // klavye odağı`,
        },
        {
          id: "timer",
          title: "Timer Sınıfı",
          label: "Timer",
          def: "Swing'deki javax.swing.Timer, belirli aralıklarla ActionEvent üretir. Animasyonlar ve periyodik görevler için kullanılır; start() ve stop() ile kontrol edilir.",
          code: `int[] seconds = {0};
Timer timer = new Timer(1000, e -> { //!
    seconds[0]++;
    label.setText("Süre: " + seconds[0] + " sn");
});
timer.start();   // her 1000 ms'de bir tetiklenir
// timer.stop();`,
        },
      ],
    },

    /* ===================== 5. GUI & I/O ===================== */
    {
      id: "gui-io",
      title: "GUI & I/O",
      color: "#fbbf24",
      def: "Dosyalarla veri alışverişi yapmak ve Swing / JavaFX ile grafik kullanıcı arayüzleri kurmak.",
      concepts: [
        {
          id: "file",
          title: "File",
          def: "java.io.File bir dosya veya dizinin yolunu ve özelliklerini (var mı, boyutu, dizin mi) temsil eder. Dosya içeriğini okumaz veya yazmaz.",
          code: `File file = new File("data/scores.txt"); //!

System.out.println("Var mı? " + file.exists());
System.out.println("Boyut: " + file.length() + " bayt");
System.out.println("Dizin mi? " + file.isDirectory());
System.out.println("Tam yol: " + file.getAbsolutePath());`,
        },
        {
          id: "scanner",
          title: "Scanner",
          def: "Klavyeden (System.in) veya dosyadan metin okumak için kullanılır; nextInt(), nextLine(), hasNext() gibi metotlarla girdiyi ayrıştırır. Dosyaya yazmak için PrintWriter kullanılır.",
          code: `try (Scanner in = new Scanner(new File("scores.txt")); //!
     PrintWriter out = new PrintWriter("report.txt")) {
    while (in.hasNext()) {
        String name = in.next();
        int score = in.nextInt();
        out.println(name + ": " + score);
    }
}`,
        },
        {
          id: "swing",
          title: "Swing (JButton, JCheckBox vb.)",
          label: "Swing",
          def: "Swing, Java'nın klasik GUI kütüphanesidir. JFrame pencereyi, JButton düğmeyi, JCheckBox onay kutusunu, JLabel etiketi sağlar. Bileşenler bir layout manager ile yerleştirilir.",
          code: `JFrame frame = new JFrame("Swing Demo");
JButton button = new JButton("Gönder");
JCheckBox bold = new JCheckBox("Kalın");

frame.setLayout(new FlowLayout());
frame.add(bold);
frame.add(button);
button.addActionListener(e -> System.out.println("Kalın: " + bold.isSelected())); //!
frame.setSize(300, 120);
frame.setVisible(true);`,
        },
        {
          id: "javafx",
          title: "JavaFX Temelleri (Stage, Scene)",
          label: "JavaFX Stage/Scene",
          def: "Bir JavaFX uygulaması Application sınıfını genişletir ve start(Stage) metodunu ezer. Stage pencereyi, Scene içeriği, düğüm ağacı (Pane, Button...) ise sahne grafiğini (scene graph) temsil eder.",
          code: `public class HelloFX extends Application {
    @Override
    public void start(Stage stage) { //!
        Button btn = new Button("Merhaba JavaFX");
        StackPane root = new StackPane(btn);
        Scene scene = new Scene(root, 320, 200);
        stage.setTitle("İlk Uygulama");
        stage.setScene(scene);
        stage.show();
    }
}`,
        },
        {
          id: "fx-animations",
          title: "Animasyonlar (Timeline, FadeTransition)",
          label: "JavaFX Animasyon",
          def: "JavaFX'te animasyonlar Animation soyut sınıfının alt sınıflarıdır. Timeline KeyFrame'lerle zamana dayalı değişim, FadeTransition opaklık geçişi, PathTransition ise bir yol boyunca hareket sağlar.",
          code: `FadeTransition fade = new FadeTransition(Duration.millis(1500), circle); //!
fade.setFromValue(1.0);
fade.setToValue(0.1);
fade.setCycleCount(Timeline.INDEFINITE);
fade.setAutoReverse(true);
fade.play();

Timeline blink = new Timeline(new KeyFrame(Duration.millis(500), e -> toggle()));`,
        },
      ],
    },

    /* ===================== 6. TASARIM DESENLERİ ===================== */
    {
      id: "patterns",
      title: "Tasarım Desenleri",
      color: "#e879f9",
      def: "Sık karşılaşılan tasarım problemlerine kanıtlanmış, yeniden kullanılabilir çözüm kalıpları (GoF). Sınavlarda genellikle \"Bu kod hangi deseni uygular?\" veya \"Bu problem için hangi desen?\" biçiminde sorulur.",
      concepts: [
        {
          id: "singleton",
          title: "Singleton",
          def: "Bir sınıfın uygulama boyunca yalnızca TEK bir örneğinin olmasını garanti eder ve bu örneğe global bir erişim noktası sağlar. Yapıcı private yapılır; örnek static bir metotla verilir.",
          code: `public final class Config {
    private static Config instance;          // tek örnek

    private Config() { }                     // dışarıdan new engellenir //!

    public static synchronized Config getInstance() {
        if (instance == null) {
            instance = new Config();         // lazy initialization
        }
        return instance;
    }
}
Config a = Config.getInstance();
Config b = Config.getInstance();
System.out.println(a == b);  // true`,
        },
        {
          id: "factory",
          title: "Factory",
          label: "Factory Method",
          def: "Nesne oluşturma işini, hangi somut sınıfın üretileceğine karar veren bir fabrika metoduna devreder. Çağıran kod new SomutSınıf() yerine ortak arayüzle çalışır; yeni tür eklemek istemci kodunu değiştirmez.",
          code: `interface Shape { double area(); }
class Circle implements Shape { public double area() { return Math.PI; } }
class Square implements Shape { public double area() { return 1; } }

class ShapeFactory {
    static Shape create(String type) { //!
        switch (type) {
            case "circle": return new Circle();
            case "square": return new Square();
            default: throw new IllegalArgumentException("Bilinmeyen: " + type);
        }
    }
}
Shape s = ShapeFactory.create("circle"); // somut sınıf gizli`,
        },
        {
          id: "adapter",
          title: "Adapter",
          def: "Uyumsuz arayüze sahip mevcut bir sınıfı, istemcinin beklediği arayüze dönüştüren sarmalayıcıdır (wrapper). Eski veya üçüncü parti kodu değiştirmeden yeni sistemde kullanmayı sağlar.",
          code: `// İstemcinin beklediği arayüz
interface Temperature { double celsius(); }

// Değiştiremediğimiz eski sınıf (Fahrenheit verir)
class LegacySensor { double readF() { return 98.6; } }

class SensorAdapter implements Temperature { //!
    private final LegacySensor sensor;
    SensorAdapter(LegacySensor sensor) { this.sensor = sensor; }

    public double celsius() {
        return (sensor.readF() - 32) * 5 / 9; // dönüştür
    }
}
Temperature t = new SensorAdapter(new LegacySensor());`,
        },
      ],
    },
  ],
};

/* =========================================================================
   VANILLA JS (ES6 Class) KARŞILIKLARI
   -------------------------------------------------------------------------
   Anahtar = kavram id'si. Java'da olup JS'te bulunmayan özelliklerde
   (overloading, casting, checked exception, Swing...) en yakın JS deyimi
   gösterilir ve farkı yorum satırında açıklanır.
   Not: Bu kodlar data.js'te template literal içinde durduğu için JS
   kodundaki "\n" kaçışları kaynakta "\\n" olarak yazılmıştır.
   ========================================================================= */
const JS_EXAMPLES = {
  /* ---------- Core OOP ---------- */
  objects: `const c1 = new Circle(5); //!
const c2 = new Circle(2.5);

console.log(c1.getArea()); // davranış
c2.radius = 10;            // durum değişti
console.log(c1 === c2);    // false: farklı kimlik`,

  classes: `class Circle { //!
  radius = 1;                   // public class field

  constructor(radius = 1) {     // tek yapıcı + varsayılan parametre
    this.radius = radius;
  }

  getArea() {                   // metot
    return Math.PI * this.radius ** 2;
  }
}`,

  uml: `// ┌──────────────────────────────┐
// │            Circle            │ //!
// ├──────────────────────────────┤
// │ -#radius: number             │
// ├──────────────────────────────┤
// │ +constructor(radius: number) │
// │ +getArea(): number           │
// │ +set radius(r: number)       │
// └──────────────────────────────┘
// JS'te tip bildirimi yok; diyagramdaki tipler belgeleme amaçlıdır.`,

  constructors: `class Student {
  constructor(name = "İsimsiz", age = 18) { //!
    // JS'te tek constructor olur; aşırı yükleme yerine varsayılan parametre
    this.name = name;
    this.age = age;
  }
}
new Student();          // İsimsiz, 18
new Student("Ada", 21);`,

  "primitive-vs-object": `let a = 5;
let b = a;          // değer kopyalandı
b = 10;             // a hâlâ 5

const c1 = new Circle(5);
const c2 = c1;      // referans kopyalandı //!
c2.radius = 10;     // c1.radius da artık 10!`,

  "garbage-collection": `let c1 = new Circle(1);
let c2 = new Circle(2);

c1 = c2;   // Circle(1) artık erişilemez //!
           // → JS motoru (V8 vb.) GC ile belleği geri alır
c2 = null;
c1 = null; // Circle(2) de çöp oldu
// WeakMap / WeakRef, nesneyi GC'den alıkoymayan referanslar sağlar`,

  encapsulation: `class Account {
  #balance = 0; //!

  get balance() { return this.#balance; }

  set balance(value) {
    if (value < 0) throw new RangeError("Negatif bakiye!");
    this.#balance = value;
  }
}
// acc.#balance → SyntaxError: sınıf dışından erişilemez`,

  this: `class Circle {
  #radius;
  constructor(radius = 1) {
    this.#radius = radius; // this = oluşturulan nesne //!
  }
  getArea() { return Math.PI * this.#radius ** 2; }
}
// Dikkat: JS'te this, metodun ÇAĞRILMA biçimine bağlıdır
const circle = new Circle(2);
const area = circle.getArea;
area();                                     // TypeError: this undefined
const bound = circle.getArea.bind(circle);  // this sabitlendi`,

  "reference-fields": `class Student {
  name = null;      // referans alan
  address = null;   // başka sınıfa referans //!
  age = 0;          // ilkel alan
  enrolled = false;
}
// JS'te otomatik varsayılan yok: atanmayan alan undefined olur`,

  null: `let name = null;

if (name !== null) {          // güvenli kontrol
  console.log(name.length);
}
console.log(name?.length);    // optional chaining → undefined
name.length;                  // TypeError: Cannot read properties of null //!`,

  /* ---------- Advanced OOP ---------- */
  inheritance: `class GeometricObject {
  #color = "white";
  get color() { return this.#color; }
}

class Circle extends GeometricObject { //!
  radius = 1;
  // color getter'ı miras alındı
}`,

  "super-sub": `// Süper sınıf (genel)
class Animal {
  constructor(name) { this.name = name; }
  eat() { console.log(this.name + " yiyor"); }
}
// Alt sınıf (özel)
class Dog extends Animal { //!
  bark() { console.log("Hav!"); } // yeni davranış
}`,

  super: `class Circle extends GeometricObject {
  #radius;

  constructor(radius, color) {
    super(color);          // this'ten önce çağrılmalı //!
    this.#radius = radius;
  }
  toString() {
    return super.toString() + " r=" + this.#radius;
  }
}`,

  overriding: `class Animal {
  sound() { return "..."; }
}
class Cat extends Animal {
  sound() { return "Miyav"; } // aynı ad → override //!
}
// JS'te @Override yok (TypeScript'te 'override' anahtar kelimesi var)`,

  overloading: `// JS aşırı yüklemeyi DESTEKLEMEZ: aynı adlı ikinci metot ilkini ezer.
class MathUtil {
  static max(...nums) { //!
    // Tek metot, değişken sayıda argüman (rest parametresi)
    return nums.reduce((a, b) => (a > b ? a : b));
  }
}
MathUtil.max(3, 7);        // 7
MathUtil.max(2.5, 1.0, 9); // 9`,

  polymorphism: `const shapes = [new Circle(2), new Rectangle(3, 4)];

for (const s of shapes) {
  console.log(s.getArea()); // her biri kendi getArea'sı //!
}`,

  "dynamic-binding": `const o = new Circle(1);
console.log(o.toString()); //!
// Motor prototip zincirinde arar:
// Circle.prototype → GeometricObject.prototype → Object.prototype
console.log(Object.getPrototypeOf(o) === Circle.prototype); // true`,

  casting: `// JS dinamik tiplidir: nesneler için cast YOKTUR.
const o = new Circle(2);
console.log(o.radius);   // doğrudan erişim (duck typing) //!

// Yalnızca ilkel tür dönüşümleri vardır:
Number("42");    // 42
String(3.14);    // "3.14"
Boolean("");     // false`,

  instanceof: `const o = new Circle(3);

if (o instanceof Circle) { //!
  console.log(o.getArea()); // cast gerekmez
}
console.log(o instanceof GeometricObject); // true (prototip zinciri)
console.log(typeof o);                     // "object"`,

  abstract: `class Shape {
  constructor() {
    if (new.target === Shape) { //!
      throw new TypeError("Soyut sınıftan nesne üretilemez");
    }
  }
  getArea() { throw new Error("Alt sınıf getArea() metodunu uygulamalı"); }
  describe() { console.log("Alan: " + this.getArea()); }
}
class Square extends Shape {
  side = 2;
  getArea() { return this.side ** 2; }
}`,

  interfaces: `// JS'te interface yok: sözleşme = aynı adlı metotlara sahip olmak
class Circle {
  constructor(radius) { this.radius = radius; }

  compareTo(other) { //!
    return this.radius - other.radius;   // Comparable karşılığı
  }
  clone() {
    return new Circle(this.radius);      // Cloneable karşılığı
  }
}
circles.sort((a, b) => a.compareTo(b));`,

  /* ---------- İstisna Yönetimi ---------- */
  throwable: `// Error //!
//  ├── TypeError       (yanlış tür)
//  ├── RangeError      (aralık dışı değer)
//  ├── ReferenceError  (tanımsız değişken)
//  └── SyntaxError
// JS'te Throwable/Exception ayrımı yok; her değer fırlatılabilir
try { riskyCall(); }
catch (e) { console.error(e.stack); }`,

  error: `function recurse(n) {
  return recurse(n + 1); // durma koşulu yok
}
recurse(0); // RangeError: Maximum call stack size exceeded //!

new Array(-1); // RangeError: Invalid array length`,

  exception: `// JS'te checked istisna yok: hiçbir hata derleyici tarafından zorlanmaz
const arr = [1, 2, 3];
arr[5];               // undefined, hata DEĞİL! //!
10 / 0;               // Infinity, hata değil
JSON.parse("{bozuk"); // SyntaxError (çalışma zamanında)
null.length;          // TypeError`,

  "try-catch-finally": `let conn = null;
try {
  conn = openConnection("db://local");
  console.log(conn.query("SELECT 1"));
} catch (e) {
  console.log("Hata: " + e.message);
} finally { //!
  conn?.close(); // her durumda çalışır
}`,

  throws: `/**
 * İlk satırı okur.
 * @throws {Error} Dosya bulunamazsa
 */
async function readFirstLine(path) { //!
  // JS'te 'throws' yok; JSDoc ile yalnızca belgelenir
  const res = await fetch(path);
  if (!res.ok) throw new Error("Dosya yok: " + path);
  return (await res.text()).split("\\n")[0];
}`,

  throw: `class Circle {
  #radius = 1;
  set radius(r) {
    if (r < 0) {
      throw new RangeError("Yarıçap negatif olamaz"); //!
    }
    this.#radius = r;
  }
}`,

  chained: `try {
  loadConfig();
} catch (e) {
  throw new Error("Ayarlar yüklenemedi", { cause: e }); //!
}
// Yakalayan taraf:
// err.cause → orijinal hata (ES2022)`,

  "custom-exceptions": `class InvalidRadiusError extends Error { //!
  constructor(radius) {
    super("Geçersiz yarıçap: " + radius);
    this.name = "InvalidRadiusError";
    this.radius = radius;
  }
}
try { throw new InvalidRadiusError(-2); }
catch (e) { if (e instanceof InvalidRadiusError) console.log(e.radius); }`,

  /* ---------- Event-Driven ---------- */
  "events-basics": `// Kaynak: button → Olay: Event → İşleyici: arrow function
const btn = document.querySelector("#ok");
btn.addEventListener("click", (e) => { //!
  const source = e.target;   // olayı üreten eleman
  console.log("Tıklandı: " + source.id);
});`,

  listeners: `class OKHandler {
  handleEvent(e) {             // DOM EventListener arayüzü //!
    console.log("OK basıldı", e.type);
  }
}
const btOK = document.querySelector("#ok");
btOK.addEventListener("click", new OKHandler()); // nesne de dinleyici olabilir`,

  "inner-classes": `class Counter {
  #count = 0;

  // JS'te iç sınıf yok; sınıf ifadesi dış kapsamı (closure) yakalar
  createHandler() {
    const outer = this;
    return class IncrementHandler { //!
      handleEvent() { outer.#count++; } // dış sınıfın private alanı
    };
  }
}`,

  "anonymous-classes": `btn.addEventListener("click", new (class { //!
  handleEvent(e) {
    console.log("Anonim sınıf çalıştı");
  }
})());
// Pratikte JS'te bunun yerine doğrudan fonksiyon verilir:
btn.addEventListener("click", function () { console.log("Anonim fonksiyon"); });`,

  lambda: `// Arrow function: JS'in lambda karşılığı
btn.addEventListener("click", () => console.log("Lambda!")); //!

const byLength = (a, b) => a.length - b.length;
const task = () => console.log("Çalışıyor");
["elma", "kivi"].sort(byLength);
// Fark: arrow function'ın kendi this'i yoktur, dıştaki this'i kullanır`,

  "mouse-key-events": `circle.addEventListener("pointermove", (e) => { //!
  if (e.buttons !== 1) return;          // sol tuş basılı mı?
  circle.style.left = e.clientX + "px";
  circle.style.top = e.clientY + "px";
});
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":   text.y -= 10; break;
    case "ArrowDown": text.y += 10; break;
  }
});`,

  timer: `let seconds = 0;
const id = setInterval(() => { //!
  seconds++;
  label.textContent = "Süre: " + seconds + " sn";
}, 1000);   // her 1000 ms'de bir

// clearInterval(id);  → durdur
// setTimeout(fn, ms)  → tek seferlik`,

  /* ---------- GUI & I/O ---------- */
  file: `// Tarayıcıda File API: kullanıcının seçtiği dosya
const input = document.querySelector("input[type=file]");
input.addEventListener("change", () => {
  const file = input.files[0]; //!
  console.log("Ad: " + file.name);
  console.log("Boyut: " + file.size + " bayt");
  console.log("Tür: " + file.type);
});`,

  scanner: `// Tarayıcıda Scanner yok: dosyayı metin olarak okuyup ayrıştır
const text = await file.text(); //!
const report = text
  .split("\\n")
  .filter((line) => line.trim())
  .map((line) => {
    const [name, score] = line.split(" ");
    return name + ": " + Number(score);
  });
console.log(report.join("\\n"));`,

  swing: `// Swing yerine DOM: JFrame ≈ sayfa, JButton ≈ <button>, JCheckBox ≈ checkbox
const button = document.createElement("button");
button.textContent = "Gönder";
const bold = Object.assign(document.createElement("input"), { type: "checkbox" });

document.body.append(bold, button);
button.addEventListener("click", () => console.log("Kalın: " + bold.checked)); //!`,

  javafx: `// Stage ≈ tarayıcı penceresi, Scene ≈ DOM ağacı (scene graph)
class HelloApp {
  start(root) { //!
    const btn = document.createElement("button");
    btn.textContent = "Merhaba JS";
    const pane = document.createElement("div");   // StackPane karşılığı
    pane.append(btn);
    document.title = "İlk Uygulama";               // stage.setTitle
    root.replaceChildren(pane);                    // setScene + show
  }
}
new HelloApp().start(document.body);`,

  "fx-animations": `// Web Animations API: FadeTransition karşılığı
const fade = circle.animate( //!
  [{ opacity: 1 }, { opacity: 0.1 }],
  { duration: 1500, iterations: Infinity, direction: "alternate" }
);

// Timeline/KeyFrame karşılığı: requestAnimationFrame döngüsü
function tick(time) { toggle(time); requestAnimationFrame(tick); }
requestAnimationFrame(tick);`,

  /* ---------- Tasarım Desenleri ---------- */
  singleton: `class Config {
  static #instance = null;

  constructor() {
    if (Config.#instance) return Config.#instance; // varolanı döndür //!
    Config.#instance = this;
  }
  static getInstance() {
    return Config.#instance ?? new Config();
  }
}
console.log(new Config() === Config.getInstance()); // true
// Pratikte: ES modülleri zaten tek örneklidir → export const config = {...}`,

  factory: `class Circle { area() { return Math.PI; } }
class Square { area() { return 1; } }

class ShapeFactory {
  static #registry = { circle: Circle, square: Square };

  static create(type) { //!
    const Ctor = ShapeFactory.#registry[type];
    if (!Ctor) throw new Error("Bilinmeyen: " + type);
    return new Ctor();
  }
}
const s = ShapeFactory.create("circle"); // somut sınıf gizli`,

  adapter: `// Eski API: callback tabanlı, Fahrenheit
class LegacySensor {
  readF(callback) { callback(98.6); }
}

// Yeni kodun beklediği: Promise + Celsius
class SensorAdapter { //!
  #sensor;
  constructor(sensor) { this.#sensor = sensor; }

  celsius() {
    return new Promise((resolve) =>
      this.#sensor.readF((f) => resolve(((f - 32) * 5) / 9)));
  }
}
const c = await new SensorAdapter(new LegacySensor()).celsius();`,
};

/* =========================================================================
   MİNİ SINAVLAR (Görev sekmesi)
   -------------------------------------------------------------------------
   Anahtar = kavram id'si. answer, options dizisindeki doğru şıkkın
   indeksidir (0'dan başlar). Yeni görev eklemek için bu tabloya bir kayıt
   eklemen yeterli; panel ve ilerleme sayacı otomatik güncellenir.
   Çok aşamalı "Derleme Tarayıcısı" görevleri: önce ① kod derlenir mi?
   (derlenmiyorsa errorLine hatalı satırı kırmızıyla işaretler), sonra
   ② çıktı veya teşhis sorusu. output verilirse terminal kutusunda gösterilir.
   ========================================================================= */

// "① Derleme taraması" aşamasını üreten yardımcı (tekrarı azaltır)
function compileStage(compiles, explain, errorLine = null) {
  return {
    kind: "compile",
    step: "Derleme",
    question: "① Derleme taraması: Bu kod derlenir mi?",
    options: ["Evet, derlenir", "Hayır, derleme hatası verir"],
    answer: compiles ? 0 : 1,
    explain,
    errorLine,
  };
}

const QUIZZES = {
  /* ---------- Core OOP ---------- */
  "primitive-vs-object": {
    question: "Bu kod çalıştığında konsola ne yazar?",
    code: `Circle c1 = new Circle(5);   // radius: double
Circle c2 = c1;
c2.radius = 10;
System.out.println(c1.radius);`,
    options: ["5.0", "10.0", "null", "Derleme hatası"],
    answer: 1,
    explain: "c2 = c1 nesneyi değil referansı kopyalar; iki değişken aynı nesneyi gösterir.",
  },
  constructors: {
    question: "Student sınıfında yalnızca aşağıdaki yapıcı varsa new Student() ne olur?",
    code: `public class Student {
    public Student(String name) { /* ... */ }
}
Student s = new Student();`,
    options: [
      "Derleyici varsayılan yapıcıyı ekler, sorunsuz çalışır",
      "Derleme hatası: uygun yapıcı yok",
      "name alanı null olarak oluşturulur",
      "Çalışma zamanında NullPointerException",
    ],
    answer: 1,
    explain: "Varsayılan (parametresiz) yapıcı yalnızca sınıfta HİÇ yapıcı yazılmadığında eklenir.",
  },
  encapsulation: {
    question: "balance alanı private iken başka bir sınıftan acc.balance = -50; yazılırsa ne olur?",
    options: [
      "Bakiye -50 olur",
      "Derleme hatası: balance has private access",
      "Setter çağrılır ve IllegalArgumentException fırlar",
      "Değer sessizce yok sayılır",
    ],
    answer: 1,
    explain: "private alanlara sınıf dışından erişim derleme zamanında engellenir; tek kapı public setter'dır.",
  },
  null: {
    question: "Bu kod çalıştığında ne olur?",
    code: `String s = null;
System.out.println(s.length());`,
    options: ["0 yazar", "null yazar", "NullPointerException fırlar", "Derleme hatası"],
    answer: 2,
    explain: "null bir referans üzerinden metot çağırmak çalışma zamanında NullPointerException üretir.",
  },

  /* ---------- Advanced OOP ---------- */
  "dynamic-binding": {
    question: "Bu kod çalıştığında konsola ne yazar?",
    code: `class A { String who() { return "A"; } }
class B extends A { String who() { return "B"; } }

A obj = new B();
System.out.println(obj.who());`,
    options: ["A", "B", "AB", "Derleme hatası"],
    answer: 1,
    explain: "Bildirilen tür A olsa da gerçek tür B'dir; dinamik bağlama ile B.who() çalışır.",
  },
  overloading: {
    code: `static void f(long x)    { System.out.println("long"); }
static void f(Integer x) { System.out.println("Integer"); }
static void f(int... x)  { System.out.println("varargs"); }

f(5);`,
    stages: [
      compileStage(true, "Üç metot farklı parametre türlerine sahip; geçerli bir aşırı yükleme."),
      {
        step: "Çıktı",
        question: "② Çalıştırma: Konsola ne yazar?",
        options: ["long", "Integer", "varargs", "Belirsiz çağrı (ambiguous) hatası"],
        answer: 0,
        explain: "Seçim sırası: widening (int → long) → boxing (int → Integer) → varargs. İlk aşamada f(long) bulunduğu için o seçilir.",
        output: "long",
      },
    ],
  },
  overriding: {
    code: `class Base {
    Base() { show(); }
    void show() { System.out.println("Base"); }
}
class Derived extends Base {
    private int x = 5;
    @Override
    void show() { System.out.println("x = " + x); }
}
new Derived();`,
    stages: [
      compileStage(true, "Yapıcıdan override edilebilir metot çağırmak derlenir; tehlike çalışma zamanındadır."),
      {
        step: "Çıktı",
        question: "② Çalıştırma: Konsola ne yazar?",
        options: ["Base", "x = 5", "x = 0", "NullPointerException fırlar"],
        answer: 2,
        explain: "Sıra: Base() çalışır → dinamik bağlama ile Derived.show() çağrılır → ama x = 5 ataması henüz yapılmadı, x varsayılan 0'dır.",
        output: "x = 0",
      },
    ],
  },
  super: {
    code: `class Animal {
    Animal(String name) { }
}
class Dog extends Animal {
    Dog() {
        System.out.println("Hav");
    }
}`,
    stages: [
      compileStage(false, "Derleyici Dog() yapıcısının başına gizlice super() ekler; Animal'da parametresiz yapıcı olmadığı için hata oluşur.", 5),
      {
        step: "Teşhis",
        question: "② Teşhis: Hatayı düzelten değişiklik hangisi?",
        options: [
          "Dog() içine ilk satır olarak super(\"Karabaş\"); eklemek",
          "println satırını silmek",
          "Dog sınıfını abstract yapmak",
          "Animal yapıcısını private yapmak",
        ],
        answer: 0,
        explain: "Uygun süper sınıf yapıcısını açıkça çağırmak (veya Animal'a parametresiz yapıcı eklemek) hatayı giderir.",
      },
    ],
  },
  casting: {
    question: "Bu kod için hangisi doğrudur?",
    code: `Object o = "metin";
Circle c = (Circle) o;`,
    options: [
      "Derleme hatası verir",
      "Çalışma zamanında ClassCastException fırlar",
      "c null olur",
      "Sorunsuz çalışır",
    ],
    answer: 1,
    explain: "Object → Circle cast'i derlenir; fakat gerçek nesne String olduğu için çalışma zamanında ClassCastException oluşur.",
  },
  abstract: {
    question: "abstract class Shape tanımlıyken new Shape() yazılırsa ne olur?",
    options: [
      "Boş bir Shape nesnesi oluşur",
      "Derleme hatası: Shape is abstract; cannot be instantiated",
      "Çalışma zamanında InstantiationException",
      "Soyut metotlar null döndürür",
    ],
    answer: 1,
    explain: "Soyut sınıfların doğrudan örneği oluşturulamaz; bunu derleyici engeller.",
  },

  /* ---------- İstisna Yönetimi ---------- */
  "try-catch-finally": {
    code: `static int f() {
    try {
        System.out.print("T ");
        return 1;
    } finally {
        System.out.print("F ");
        return 2;
    }
}
System.out.println(f());`,
    stages: [
      compileStage(true, "finally içinde return derlenir; derleyici yalnızca uyarı verir (finally block does not complete normally)."),
      {
        step: "Çıktı",
        question: "② Çalıştırma: Konsola ne yazar?",
        options: ["T 1", "T F 1", "T F 2", "T 2"],
        answer: 2,
        explain: "try'daki return 1 hesaplanır ama finally her durumda çalışır; finally'deki return 2 bekleyen dönüş değerini ezer.",
        output: "T F 2",
      },
    ],
  },
  exception: {
    question: "Aşağıdakilerden hangisi checked (denetlenen) bir istisnadır?",
    options: ["NullPointerException", "IOException", "ArithmeticException", "ArrayIndexOutOfBoundsException"],
    answer: 1,
    explain: "IOException, RuntimeException'dan türemez; ele alınmazsa (try-catch veya throws) derleme hatası olur.",
  },
  chained: {
    question: "Zincirleme istisnada orijinal hataya hangi metotla ulaşılır?",
    options: ["getMessage()", "getCause()", "getOrigin()", "printStackTrace()"],
    answer: 1,
    explain: "new RuntimeException(\"...\", e) ile saklanan neden, getCause() ile geri alınır.",
  },

  /* ---------- Event-Driven ---------- */
  lambda: {
    question: "Lambda ifadesi hangi tür arayüzün yerine kullanılabilir?",
    options: [
      "Herhangi bir arayüz",
      "Tek soyut metotlu (functional) arayüz",
      "Yalnızca Runnable",
      "Soyut sınıflar",
    ],
    answer: 1,
    explain: "Lambda, tek bir soyut metodu olan functional interface'in uygulamasıdır (ör. EventHandler, Comparator).",
  },
  timer: {
    question: "Bu JavaScript kodu konsola hangi sırayla yazar?",
    lang: "js",
    code: `console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");`,
    options: ["1 2 3", "1 3 2", "2 1 3", "3 2 1"],
    answer: 1,
    explain: "setTimeout(…, 0) bile geri çağırmayı olay kuyruğuna atar; senkron kod (1, 3) bitince 2 çalışır.",
  },

  /* ---------- GUI & I/O ---------- */
  file: {
    question: "new File(\"yok.txt\") satırı çalışınca ne olur?",
    options: [
      "Diskte boş bir yok.txt oluşturulur",
      "Yalnızca yolu temsil eden bir nesne oluşur, disk değişmez",
      "FileNotFoundException fırlar",
      "Derleme hatası",
    ],
    answer: 1,
    explain: "File sınıfı yalnızca bir yolu temsil eder; dosya oluşturmaz, okumaz veya yazmaz.",
  },
  javafx: {
    question: "JavaFX'te uygulama penceresini temsil eden sınıf hangisidir?",
    options: ["Scene", "Stage", "Pane", "Window"],
    answer: 1,
    explain: "Stage pencereyi, Scene ise o pencerede gösterilen içeriği temsil eder.",
  },

  /* ---------- Tasarım Desenleri ---------- */
  singleton: {
    code: `class Config {
    private static Config instance;
    private Config() { }
    static Config get() {
        if (instance == null) instance = new Config();
        return instance;
    }
}
// Main sınıfında:
Config a = Config.get();
Config b = Config.get();
Config c = new Config();
System.out.println(a == b);`,
    stages: [
      compileStage(false, "Config() private olduğu için Main sınıfındaki new Config() derlenmez: 'Config() has private access in Config'.", 12),
      {
        step: "Çıktı",
        question: "② Hatalı satır silinirse konsola ne yazar?",
        options: ["true", "false", "null", "NullPointerException"],
        answer: 0,
        explain: "get() ilk çağrıda örneği oluşturur, sonrakilerde aynı referansı döndürür; a ile b aynı nesnedir.",
        output: "true",
      },
    ],
  },
  factory: {
    question: "Shape s = ShapeFactory.create(\"circle\"); satırını yazan istemci kod hangi türlere bağımlıdır?",
    options: [
      "Somut Circle sınıfına",
      "Yalnızca Shape arayüzüne ve fabrikaya",
      "Circle ve Square sınıflarının ikisine",
      "Hiçbir türe",
    ],
    answer: 1,
    explain: "Factory, somut sınıf seçimini istemciden gizler; istemci yalnızca ortak arayüzü (Shape) ve fabrikayı bilir.",
  },
  adapter: {
    question: "Elinde yalnızca readF() (Fahrenheit) sunan eski bir sınıf var; yeni kod Temperature.celsius() bekliyor. Eski kaynağı değiştirmeden hangi desen kullanılır?",
    options: ["Singleton", "Factory", "Adapter", "Observer"],
    answer: 2,
    explain: "Adapter, mevcut sınıfı sarmalayıp istemcinin beklediği arayüze dönüştürür.",
  },
};

/* =========================================================================
   TUZAKLAR VE İPUÇLARI (Edge Cases)
   -------------------------------------------------------------------------
   Sınavlarda en çok puan kaybettiren ince noktalar. Panelde tanımın
   altında 🚨 kutusunda gösterilir. Anahtar = kavram id'si.
   ========================================================================= */
const TRAPS = {
  constructors: [
    { title: "Başlatma Sırası (Initialization Order)", text: "Bir constructor içinde çağrılan override edilmiş alt sınıf metodu, henüz atanmamış alt sınıf alanlarını 0 veya null olarak okuyabilir. Sıra: süper sınıf yapıcısı → alt sınıf alan başlatıcıları → alt sınıf yapıcı gövdesi." },
    { title: "Varsayılan yapıcı kaybolur", text: "Sınıfa parametreli bir yapıcı yazdığın anda derleyici parametresiz varsayılan yapıcıyı eklemez; new Student() derleme hatası verir." },
  ],
  overriding: [
    { title: "Yapıcıdan override edilebilir metot çağırma", text: "Alt sınıfın sürümü, alt sınıf alanları atanmadan ÖNCE çalışır (bkz. Görev sekmesi). Yapıcılardan yalnızca private/final metotlar çağrılmalı." },
    { title: "static metotlar override edilmez", text: "Alt sınıftaki aynı imzalı static metot üsttekini GİZLER (hiding); çağrı, nesnenin değil değişkenin bildirilen türüne göre seçilir." },
    { title: "Erişim daraltılamaz", text: "public bir metodu alt sınıfta protected veya private yapmak derleme hatasıdır; erişim yalnızca genişletilebilir." },
  ],
  overloading: [
    { title: "Overload Seçimi", text: "Java'da aşırı yüklenmiş metot seçilirken önce sabit parametre (birebir veya widening), sonra boxing/unboxing, en son varargs aranır. f(5) için f(long) varsa f(Integer)'a tercih edilir." },
    { title: "Dönüş tipi yetmez", text: "Yalnızca dönüş tipi farklı olan iki metot aşırı yükleme sayılmaz; derleme hatası verir." },
  ],
  "try-catch-finally": [
    { title: "Exception Finally (Çıkış Sırası)", text: "return ifadesi değeri hesaplasa bile, finally bloğu her zaman çalışır ve dışarı taşınacak exception'ı veya state'i değiştirebilir. finally içindeki return, try'daki return'ü ve fırlatılan istisnayı yutar." },
    { title: "catch sırası", text: "Alt sınıf istisnası süper sınıfından ÖNCE yakalanmalı; catch (Exception e) sonrasına catch (IOException e) yazmak 'already been caught' derleme hatasıdır." },
  ],
  "dynamic-binding": [
    { title: "Alanlar dinamik bağlanmaz", text: "Örnek metotlar gerçek türe göre seçilir; alanlar (fields) ve static metotlar ise bildirilen türe göre. A a = new B(); a.x → A'daki x okunur." },
  ],
  "primitive-vs-object": [
    { title: "== ile equals()", text: "Nesnelerde == referansları karşılaştırır, içerik için equals() kullanılır. Integer a = 127, b = 127 → a == b true; 128'de false olur (Integer önbelleği -128..127)." },
  ],
  super: [
    { title: "Gizli super() çağrısı", text: "Yapıcıda super(...) veya this(...) yazılmazsa derleyici ilk satıra super() ekler; süper sınıfta parametresiz yapıcı yoksa derleme hatası oluşur." },
  ],
  casting: [
    { title: "Derlenir ama patlar", text: "Downcasting derleyiciden geçse bile gerçek tür uyumsuzsa çalışma zamanında ClassCastException fırlar; önce instanceof ile kontrol et." },
  ],
  singleton: [
    { title: "Thread güvenliği", text: "Senkronizasyonsuz lazy initialization, çok iş parçacıklı ortamda iki ayrı örnek üretebilir. Çözüm: synchronized, double-checked locking (volatile ile) veya enum Singleton." },
    { title: "Kırılma yolları", text: "Reflection (setAccessible) ve serileştirme (readResolve yoksa) private yapıcıyı aşıp yeni örnek üretebilir. En sağlam Java çözümü: enum Config { INSTANCE; }" },
  ],
  factory: [
    { title: "Factory Method ≠ Abstract Factory", text: "Factory Method tek bir ürünün üretim kararını bir metoda/alt sınıfa bırakır; Abstract Factory birbiriyle ilişkili ürün AİLELERİ üretir." },
  ],
  adapter: [
    { title: "Adapter ≠ Decorator", text: "Adapter arayüzü DEĞİŞTİRİR (uyumsuzu uyumlu yapar); Decorator aynı arayüzü korur ve davranış EKLER. Sınavlarda en sık karıştırılan ikili." },
  ],
};

// JS örneklerini, görevleri ve tuzakları kavramlara bağla
// (eksik olan kalırsa panel o sekmeyi/kutuyu göstermez)
for (const cat of KNOWLEDGE.categories) {
  for (const concept of cat.concepts) {
    concept.js = JS_EXAMPLES[concept.id] ?? null;
    concept.quiz = QUIZZES[concept.id] ?? null;
    concept.traps = TRAPS[concept.id] ?? null;
  }
}
