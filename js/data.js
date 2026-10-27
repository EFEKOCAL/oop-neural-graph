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
     - dependsOn : önkoşul kavram id'leri — DEPENDENCIES tablosundan eklenir.
               Graf bu ilişkilerle Yönlü Döngüsüz Graf (DAG) olarak kurulur.
     - practice : (isteğe bağlı) "Akıllı Ev" kodlama görevi — PRACTICES
               tablosundan eklenir: { instruction, skeleton, validationKeys,
               successMessage }
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
          label: "Yapıcılar",
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
        {
          id: "visibility",
          title: "Görünürlük Belirleyiciler (public, private, varsayılan)",
          label: "Görünürlük",
          def: "Görünürlük (erişim) belirleyicileri bir sınıfa, alana veya metoda nereden erişilebileceğini belirler. public: her yerden erişilir. private: yalnızca tanımlandığı sınıfın içinden erişilir. Hiçbir belirleyici yazılmazsa varsayılan (package-private) erişim geçerlidir: aynı paketteki her sınıf erişebilir. protected (Kalıtım bölümü) aynı paket + alt sınıflardan erişim verir. private ve protected yalnızca sınıf ÜYELERİNE uygulanabilir; üst düzey (top-level) bir sınıf yalnızca public ya da varsayılan olabilir. Paketler sınıfları düzenlemek için kullanılır: dosyanın ilk satırına package paketAdi; yazılır.",
          code: `package p1;
public class C1 {
    public int x;            // her yerden
    int y;                   // varsayılan: yalnızca p1 paketi
    private int z;           // yalnızca C1'in içi //!

    public void m1() { }
    void m2() { }
    private void m3() { }
}

package p1;
public class C2 {            // AYNI paket
    void aMethod() {
        C1 o = new C1();
        o.x = 1;             // ✓ public
        o.y = 2;             // ✓ varsayılan, aynı paket
        // o.z = 3;          // ✗ derleme hatası: z has private access //!
        o.m1(); o.m2();      // ✓     o.m3(); ✗
    }
}

package p2;
public class C3 {            // FARKLI paket
    void aMethod() {
        C1 o = new C1();
        o.x = 1;             // ✓ yalnızca public üyeler
        // o.y = 2;          // ✗ varsayılan erişim paket dışına kapalı //!
    }
}`,
        },
        {
          id: "static",
          title: "Static Değişken, Sabit ve Metotlar",
          label: "static",
          def: "Örnek (instance) değişkeni her nesneye özeldir; her nesne kendi kopyasını taşır. static ile bildirilen sınıf değişkeni ise sınıfa aittir ve sınıfın TÜM nesneleri aynı tek kopyayı paylaşır; değeri bir nesneden değiştirilirse herkes için değişir. Static metot nesne oluşturmadan SınıfAdı.metot() biçiminde çağrılır (Math.pow, Integer.parseInt). Sabitler tüm nesnelerce paylaşıldığı için final static bildirilir: final static double PI = 3.14159265358979323846;. UML sınıf diyagramında static üyelerin altı çizilir. Ders örneği CircleWithStaticMembers, oluşturulan Circle nesnelerinin sayısını static numberOfObjects alanında tutar.",
          code: `public class Circle {
    double radius;                      // örnek değişkeni: her nesnenin kendi kopyası
    static int numberOfObjects = 0;     // sınıf değişkeni: TEK kopya, herkes paylaşır //!

    Circle() {
        radius = 1;
        numberOfObjects++;
    }
    Circle(double newRadius) {
        radius = newRadius;
        numberOfObjects++;
    }
    static int getNumberOfObjects() {   // static metot: nesnesiz çağrılır //!
        return numberOfObjects;
    }
    double getArea() {                  // örnek metodu
        return radius * radius * Math.PI;
    }
}

// TestCircleWithStaticMembers
System.out.println(Circle.numberOfObjects);              // 0
Circle c1 = new Circle();
Circle c2 = new Circle(5);
c1.radius = 9;                                           // yalnızca c1 değişir
System.out.println(c1.radius + " " + c2.radius);         // 9.0 5.0
System.out.println(Circle.getNumberOfObjects());         // 2 //!`,
        },
        {
          id: "arrays-2d",
          title: "Çok Boyutlu Diziler",
          label: "2B Diziler",
          def: "İki boyutlu dizi, elemanları da birer dizi olan dizidir; tablo ve matris verisini saklar. Bildirim: int[][] matrix; oluşturma: matrix = new int[5][5]; erişim: matrix[satır][sütun] (indisler 0'dan başlar). Dizi başlatıcı (initializer) ile tek adımda bildirilip oluşturulabilir: int[][] array = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}, {10, 11, 12}};. array.length SATIR sayısını, array[i].length i. satırın SÜTUN sayısını verir. Satır uzunlukları farklı olan diziye düzensiz (ragged) dizi denir. Üç ve daha fazla boyut da kullanılabilir: double[][][] scores = new double[6][5][2];",
          code: `int[][] matrix = new int[5][5];       // 5 satır × 5 sütun, elemanlar 0 //!
matrix[2][1] = 7;                     // 3. satır, 2. sütun

int[][] array = {                     // dizi başlatıcı
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9},
    {10, 11, 12}
};
// Yukarıdaki satır şununla eşdeğerdir:
// int[][] array = new int[4][3];
// array[0][0] = 1; array[0][1] = 2; ... array[3][2] = 12;

System.out.println(array.length);      // 4  → satır sayısı //!
System.out.println(array[0].length);   // 3  → 0. satırın uzunluğu
// array[4][0] → ArrayIndexOutOfBoundsException

for (int row = 0; row < array.length; row++) {        // iç içe döngü
    for (int column = 0; column < array[row].length; column++)
        System.out.print(array[row][column] + " ");
    System.out.println();
}`,
        },
        {
          id: "arraylist",
          title: "ArrayList Sınıfı",
          label: "ArrayList",
          def: "java.util.ArrayList<E> nesneleri saklayan, boyutu eleman ekledikçe otomatik büyüyen bir listedir. Dizinin boyutu oluşturulduktan sonra değişmez; ArrayList ise sınırsız sayıda nesne tutabilir. E genel (generic) türdür ve ilkel tür OLAMAZ: ArrayList<int> yerine ArrayList<Integer> yazılır, değerler otomatik kutulanır (autoboxing). Başlıca metotlar: add(o), add(index, o), get(index), set(index, o), remove(index), remove(o), size(), contains(o), indexOf(o), lastIndexOf(o), isEmpty(), clear(), toString(). JDK 7'den beri sağdaki tür çıkarılabilir: new ArrayList<>().",
          code: `import java.util.ArrayList;

ArrayList<String> cityList = new ArrayList<>(); //!
cityList.add("London");
cityList.add("Denver");
cityList.add("Paris");
cityList.add("Miami");
cityList.add("Seoul");
cityList.add("Tokyo");

System.out.println("Boyut: " + cityList.size());      // 6
System.out.println(cityList.contains("Miami"));       // true
System.out.println(cityList.indexOf("Denver"));       // 1
System.out.println(cityList.isEmpty());               // false

cityList.add(2, "Xian");    // 2. indise ekle, sonrakiler sağa kayar //!
cityList.remove("Miami");   // nesneyi sil
cityList.remove(1);         // 1. indisteki elemanı sil (Denver)
System.out.println(cityList);   // [London, Xian, Paris, Seoul, Tokyo]

for (String city : cityList)    // for-each ile gezinme
    System.out.print(city + " ");`,
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
          label: "Kalıtım",
          def: "Mevcut bir sınıftan (süper sınıf) yeni bir sınıf türeterek alanları ve metotları yeniden kullanmaktır. \"is-a\" ilişkisini modeller. Java sınıflarda tekli kalıtımı destekler. Ders örneğinde GeometricObject ortak alanları (color, filled) tutar; Circle ve Rectangle onu genişletip yalnızca kendilerine özgü alanları (radius / width, height) ekler.",
          code: `public class GeometricObject {
    private String color = "white";
    private boolean filled;

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public boolean isFilled() { return filled; }
    public void setFilled(boolean filled) { this.filled = filled; }
}

public class Circle extends GeometricObject { //!
    private double radius;
    public Circle(double radius) { this.radius = radius; }
    public double getArea() { return radius * radius * Math.PI; }
}

public class Rectangle extends GeometricObject { //!
    private double width, height;
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    public double getArea() { return width * height; }
}

Circle circle = new Circle(1);
circle.setColor("red");          // GeometricObject'ten miras
System.out.println(circle.getColor() + " " + circle.getArea());`,
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
          id: "object-class",
          title: "Object Sınıfı: toString() ve equals()",
          label: "Object Sınıfı",
          def: "Java'daki her sınıf, extends yazılmasa bile java.lang.Object'ten türer: public class Circle { } ile public class Circle extends Object { } aynıdır. Object'in toString() metodu varsayılan olarak SınıfAdı@hashKodu (ör. Loan@15037e5) biçiminde bir metin döndürür; anlamlı bir açıklama için override edilmelidir. System.out.println(nesne) otomatik olarak nesne.toString() çağırır. Object'teki equals varsayılan olarak referansları karşılaştırır: public boolean equals(Object obj) { return (this == obj); }. İçerik eşitliği için alt sınıfta override edilir ve parametre türü Object olmak ZORUNDADIR. == operatörü ilkel türlerde değerleri, referans türlerinde ise iki değişkenin aynı nesneyi gösterip göstermediğini karşılaştırır.",
          code: `public class Circle extends GeometricObject {  // GeometricObject → Object
    private double radius;
    public Circle(double radius) { this.radius = radius; }

    @Override
    public String toString() {                  // "Circle@1b6d3586" yerine //!
        return super.toString() + "\\nradius is " + radius;
    }

    @Override
    public boolean equals(Object o) {           // parametre Object olmalı! //!
        if (o instanceof Circle)
            return radius == ((Circle) o).radius;
        return false;
    }
}

Circle c1 = new Circle(5);
Circle c2 = new Circle(5);
System.out.println(c1 == c2);         // false: iki farklı nesne
System.out.println(c1.equals(c2));    // true : içerik aynı
System.out.println(c1);               // println → c1.toString() //!
String s1 = new String("Java"), s2 = new String("Java");
System.out.println(s1 == s2);         // false
System.out.println(s1.equals(s2));    // true (String equals'ı override eder)`,
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
          def: "Arayüz, sınıfların uygulaması gereken bir davranış sözleşmesidir; bir sınıf birden çok arayüzü implement edebilir. Comparable<T> doğal sıralamayı tek metotla tanımlar: compareTo(o) nesne küçükse negatif, eşitse 0, büyükse pozitif döndürür. String, Integer ve BigInteger gibi Java sınıfları Comparable'ı zaten uygular. Cloneable ise clone() ile kopyalanabilirliği işaretleyen bir marker interface'tir.",
          code: `// java.lang.Comparable<T> { int compareTo(T o); }
import java.math.BigInteger;

System.out.println("ABC".compareTo("ABE"));       // -2  ('C' - 'E') //!
System.out.println(new BigInteger("3432")
        .compareTo(new BigInteger("2343")));      // 1   (büyük)
System.out.println(new BigInteger("7").compareTo(BigInteger.valueOf(7))); // 0

String s = "Ahmet";
System.out.println(s instanceof Comparable);      // true: String is-a Comparable

// Kendi sınıfımızda uygulamak:
public class Circle implements Comparable<Circle>, Cloneable { //!
    double radius;

    @Override
    public int compareTo(Circle o) {
        return Double.compare(radius, o.radius);
    }
}`,
        },
        {
          id: "recursion",
          title: "Özyineli (Recursive) Metotlar",
          label: "Özyineleme",
          def: "Özyineli metot, problemi kendisinin daha küçük bir örneğine indirgeyerek kendini çağıran metottur. Her özyineli metotta özyinelemeyi bitiren bir temel durum (base case) ve her çağrıda temel duruma yaklaşan bir özyineli çağrı bulunur. Temel durum unutulursa çağrı yığını dolar ve StackOverflowError oluşur. Derste faktöriyel, Fibonacci ve JavaFX ile çizilen Sierpinski üçgeni fraktalı işlenir.",
          code: `public class ComputeFactorial {
    public static long factorial(int n) {
        if (n == 0)                         // temel durum (base case) //!
            return 1;
        else
            return n * factorial(n - 1);    // özyineli çağrı //!
    }

    public static long fib(long index) {
        if (index == 0) return 0;           // iki temel durum
        else if (index == 1) return 1;
        else return fib(index - 1) + fib(index - 2);
    }

    public static void main(String[] args) {
        System.out.println(factorial(4));   // 4 * 3 * 2 * 1 * 1 = 24
        System.out.println(fib(10));        // 55
    }
}`,
        },
        {
          id: "generics",
          title: "Generic Sınıflar ve Metotlar",
          label: "Generics",
          def: "Generic tipler, sınıf ve metotları tür parametresiyle (<E>, <T>) tanımlayarak aynı kodun farklı türlerle tür güvenli biçimde kullanılmasını sağlar. Tür hataları çalışma zamanı yerine derleme zamanında yakalanır ve cast gereksizleşir. <E extends Comparable<E>> gibi sınırlı (bounded) tipler, tür parametresinin belirli bir arayüzü uygulamasını şart koşar. Generic bilgisi derlemeden sonra silinir (type erasure).",
          code: `public class GenericStack<E> { //!
    private ArrayList<E> list = new ArrayList<>();

    public void push(E o) { list.add(o); }
    public E pop() { return list.remove(list.size() - 1); }
    public boolean isEmpty() { return list.isEmpty(); }
}

// Sınırlı (bounded) generic metot: yalnızca Comparable türlerle çalışır
public static <E extends Comparable<E>> E max(E a, E b) { //!
    return a.compareTo(b) >= 0 ? a : b;
}

GenericStack<String> stack = new GenericStack<>();
stack.push("Londra");
String city = stack.pop();          // cast gerekmez
// stack.push(42);                  // derleme hatası: tür güvenliği
System.out.println(max(3, 7));      // 7 (autoboxing → Integer)`,
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
          def: "try riskli kodu çalıştırır, catch belirli istisna türlerini yakalar, finally ise istisna olsun olmasın her durumda çalışır ve kaynakları kapatmak için kullanılır. Ders örneği QuotientWithException'da bölen 0 girilince metot ArithmeticException fırlatır; catch bloğu hatayı yakalar ve program çökmeden devam eder.",
          code: `public class QuotientWithException {
    public static int quotient(int number1, int number2) {
        if (number2 == 0)
            throw new ArithmeticException("Bölen sıfır olamaz");
        return number1 / number2;
    }

    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.print("İki tam sayı girin: ");
        int number1 = input.nextInt();
        int number2 = input.nextInt();

        try { //!
            int result = quotient(number1, number2);
            System.out.println(number1 + " / " + number2 + " = " + result);
        } catch (ArithmeticException ex) { //!
            System.out.println("Hata: " + ex.getMessage());
        } finally {
            input.close();          // hata olsa da olmasa da çalışır
        }
        System.out.println("Program çalışmaya devam ediyor...");
    }
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
          label: "Olaylar",
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
          label: "Dinleyiciler",
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
          def: "Yalnızca TEK soyut metodu olan arayüzlere SAM (Single Abstract Method) ya da functional interface denir; EventHandler, Runnable ve Comparator böyledir. Lambda ifadesi, böyle bir arayüzün uygulamasını kısaca yazmanın yoludur: (parametreler) -> gövde. Derleyici, tek metot olduğu için lambdanın hangi metodu uyguladığını kendisi çıkarır. Anonim iç sınıfların sadeleştirilmiş hâlidir.",
          code: `// SAM: tek soyut metotlu arayüz (JavaFX'teki tanımın özeti)
@FunctionalInterface
interface EventHandler<T extends Event> {
    void handle(T e);                       // tek soyut metot
}

// 1) Anonim iç sınıf ile
btEnlarge.setOnAction(new EventHandler<ActionEvent>() {
    @Override
    public void handle(ActionEvent e) { circlePane.enlarge(); }
});

// 2) Aynı işleyici lambda ile
btEnlarge.setOnAction(e -> circlePane.enlarge()); //!

Comparator<String> byLength = (a, b) -> a.length() - b.length();
Runnable task = () -> System.out.println("Çalışıyor");`,
        },
        {
          id: "mouse-key-events",
          title: "Fare/Klavye Olayları",
          label: "Mouse / Key Events",
          def: "MouseEvent fare konumunu ve düğmesini (getX(), getButton()), KeyEvent ise basılan tuşu (getCode(), getText()) taşır. Bu olaylar setOnMouseClicked, setOnKeyPressed gibi metotlarla dinlenir. Ders örneği ControlCircleWithMouseAndKey'de çember sol tıkla büyür, sağ tıkla küçülür; ↑/↓ tuşları da aynı işi yapar. Klavye olaylarını alabilmesi için düğümün requestFocus() ile odağı alması gerekir.",
          code: `public class ControlCircleWithMouseAndKey extends Application {
    private CirclePane circlePane = new CirclePane();

    @Override
    public void start(Stage primaryStage) {
        Button btEnlarge = new Button("Büyüt");
        Button btShrink = new Button("Küçült");
        HBox hBox = new HBox(10, btEnlarge, btShrink);
        btEnlarge.setOnAction(e -> circlePane.enlarge());
        btShrink.setOnAction(e -> circlePane.shrink());

        circlePane.setOnMouseClicked(e -> { //!
            if (e.getButton() == MouseButton.PRIMARY) circlePane.enlarge();
            else if (e.getButton() == MouseButton.SECONDARY) circlePane.shrink();
        });
        circlePane.setOnKeyPressed(e -> { //!
            if (e.getCode() == KeyCode.UP) circlePane.enlarge();
            else if (e.getCode() == KeyCode.DOWN) circlePane.shrink();
        });

        BorderPane borderPane = new BorderPane(circlePane);
        borderPane.setBottom(hBox);
        primaryStage.setScene(new Scene(borderPane, 200, 150));
        primaryStage.setTitle("ControlCircleWithMouseAndKey");
        primaryStage.show();
        circlePane.requestFocus();   // klavye olayları için odak
    }
}`,
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
          id: "text-io",
          title: "Dosyaya Yazma: PrintWriter ve try-with-resources",
          label: "PrintWriter",
          def: "java.io.PrintWriter bir metin dosyası oluşturur ve içine yazar; print, println ve printf metotları System.out'takilerle aynı biçimde çalışır. Dosya yoksa oluşturulur, VARSA mevcut içerik silinip üzerine yazılır. new PrintWriter(file) checked bir istisna olan FileNotFoundException (IOException'ın alt sınıfı) fırlatabileceği için ya throws ile bildirilmeli ya da try-catch ile yakalanmalıdır. İş bitince close() çağrılmalıdır; çağrılmazsa veri dosyaya düzgün yazılmayabilir. JDK 7 ile gelen try-with-resources sözdizimi (try (bildirim) { ... }) kaynağı blok bitince otomatik kapatır; kaynak AutoCloseable arayüzünü uygulamalıdır.",
          code: `import java.io.*;

public class WriteData {
    public static void main(String[] args) throws IOException { //!
        File file = new File("scores.txt");
        if (file.exists()) {
            System.out.println("Dosya zaten var");
            System.exit(1);
        }
        PrintWriter output = new PrintWriter(file);   // dosyayı oluştur //!
        output.print("John T Smith ");
        output.println(90);
        output.print("Eric K Jones ");
        output.println(85);
        output.close();                               // kapatılmazsa veri kaybolabilir
    }
}

// WriteDataWithAutoClose: try-with-resources (JDK 7+)
try (PrintWriter output = new PrintWriter(file)) {    // close() otomatik //!
    output.print("John T Smith ");
    output.println(90);
}`,
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
          id: "swing-components",
          title: "Swing GUI Bileşenleri",
          label: "Swing Bileşenleri",
          def: "Swing bileşenlerinin çoğu JComponent'ten türer. Düğmeler AbstractButton'ın alt sınıflarıdır: JButton, JMenuItem ve JToggleButton; JCheckBox ile JRadioButton da JToggleButton'dan türer. Metin bileşenleri JTextComponent'ten türer: JTextField (tek satır, alt sınıfı JPasswordField) ve JTextArea (çok satır). Seçim bileşenleri: JComboBox (açılır liste), JList (liste kutusu), JScrollBar (kaydırma çubuğu), JSlider (kaydırıcı). JLabel metin ve/veya ikon gösterir. Her bileşen kendi olayını üretir: JButton ve JTextField (Enter) → ActionEvent; JCheckBox, JRadioButton, JComboBox → ItemEvent ve ActionEvent; JList → ListSelectionEvent; JScrollBar → AdjustmentEvent; JSlider → ChangeEvent.",
          code: `// JComponent
//  ├── AbstractButton
//  │    ├── JButton
//  │    ├── JMenuItem → JMenu, JCheckBoxMenuItem, JRadioButtonMenuItem
//  │    └── JToggleButton → JCheckBox, JRadioButton //!
//  ├── JLabel
//  ├── JTextComponent → JTextField (→ JPasswordField), JTextArea //!
//  ├── JComboBox, JList, JScrollBar, JSlider
//  └── JPanel
JFrame frame = new JFrame("Kayıt Formu");
JPanel p = new JPanel(new GridLayout(3, 2, 5, 5));
p.add(new JLabel("Ad"));
p.add(new JTextField(8));
p.add(new JCheckBox("Kalın"));
p.add(new JRadioButton("Kırmızı"));
p.add(new JComboBox<>(new String[] {"Kanada", "Çin"}));
p.add(new JButton("Kaydet"));
frame.add(p);
frame.pack();
frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
frame.setVisible(true);`,
        },
        {
          id: "javafx",
          title: "JavaFX Temelleri (Stage, Scene)",
          label: "JavaFX Stage/Scene",
          def: "Bir JavaFX uygulaması Application sınıfını genişletir ve start(Stage) metodunu ezer. Stage pencereyi, Scene içeriği, düğüm ağacı ise sahne grafiğini (scene graph) temsil eder. Pane serbest konumlandırmalı temel kaptır; şekiller (Circle, Line) koordinatla yerleşir. VBox çocuklarını dikey, HBox yatay dizer. Ders örneği ClockPane, Pane'i genişleterek analog bir saat çizer.",
          code: `public class ClockPane extends Pane { //!
    private int hour, minute, second;

    public ClockPane() {
        setCurrentTime();
        widthProperty().addListener(ov -> paintClock());   // boyut değişince yeniden çiz
        heightProperty().addListener(ov -> paintClock());
    }

    public void setCurrentTime() {
        LocalTime now = LocalTime.now();
        hour = now.getHour(); minute = now.getMinute(); second = now.getSecond();
        paintClock();
    }

    protected void paintClock() {
        double r = Math.min(getWidth(), getHeight()) * 0.4;
        double cx = getWidth() / 2, cy = getHeight() / 2;
        Circle face = new Circle(cx, cy, r, Color.WHITE);
        face.setStroke(Color.BLACK);

        double sLen = r * 0.8, sAngle = second * (2 * Math.PI / 60);
        Line sLine = new Line(cx, cy, cx + sLen * Math.sin(sAngle), cy - sLen * Math.cos(sAngle));
        sLine.setStroke(Color.RED);
        // dakika (mLine) ve saat (hLine) ibreleri aynı formülle hesaplanır
        getChildren().setAll(face, sLine); //!
    }
}

public class DisplayClock extends Application {
    @Override
    public void start(Stage stage) {
        VBox root = new VBox(10, new ClockPane(), new Label("Analog Saat")); //!
        stage.setScene(new Scene(root, 250, 280));
        stage.setTitle("DisplayClock");
        stage.show();
    }
}`,
        },
        {
          id: "fx-layouts",
          title: "JavaFX Layout Panelleri",
          label: "Layout Panes",
          def: "Panel (Pane) sınıfları içerdikleri düğümleri otomatik yerleştirir; düğümler pane.getChildren().add(...) / addAll(...) ile eklenir. Pane: serbest (koordinatlı) yerleşim, şekiller için. StackPane: düğümleri üst üste, merkeze yerleştirir. FlowPane: düğümleri satır satır (yatay) veya sütun sütun (dikey) akıtır; setHgap/setVgap aradaki boşluğu, setPadding(new Insets(üst, sağ, alt, sol)) iç kenar boşluğunu ayarlar. GridPane: ızgara; add(düğüm, SÜTUN, SATIR). BorderPane: setTop, setBottom, setLeft, setRight, setCenter ile beş bölge. HBox: tek yatay satır. VBox: tek dikey sütun. Hepsi Pane'in alt sınıfıdır.",
          code: `// ShowFlowPane
FlowPane pane = new FlowPane();
pane.setPadding(new Insets(11, 12, 13, 14));    // üst, sağ, alt, sol
pane.setHgap(5);
pane.setVgap(5);
pane.getChildren().addAll(new Label("First Name:"), new TextField(),
        new Label("MI:"), new TextField()); //!

// ShowGridPane: add(düğüm, SÜTUN, SATIR)
GridPane grid = new GridPane();
grid.setAlignment(Pos.CENTER);
grid.setHgap(5.5);
grid.setVgap(5.5);
grid.add(new Label("First Name:"), 0, 0); //!
grid.add(new TextField(), 1, 0);
Button btAdd = new Button("Add Name");
grid.add(btAdd, 1, 3);
GridPane.setHalignment(btAdd, HPos.RIGHT);       // static yardımcı metot

// ShowBorderPane: beş bölge
BorderPane border = new BorderPane();
border.setTop(new CustomPane("Top"));
border.setLeft(new CustomPane("Left"));
border.setCenter(new CustomPane("Center")); //!
border.setBottom(new HBox(15, new Button("OK"), new Button("Cancel")));`,
        },
        {
          id: "fx-shapes",
          title: "JavaFX Şekilleri (Shape)",
          label: "Shapes",
          def: "Shape soyut sınıfının alt sınıfları: Text, Line, Rectangle, Circle, Ellipse, Arc, Polygon ve Polyline. Ortak özellikler: fill (iç dolgu rengi), stroke (çizgi rengi), strokeWidth. Java koordinat sisteminde orijin (0, 0) panelin SOL ÜST köşesidir; x sağa, y AŞAĞI doğru artar. Text(x, y, metin); Line(startX, startY, endX, endY); Rectangle(x, y, width, height), arcWidth/arcHeight ile köşeler yuvarlanır; Circle(centerX, centerY, radius); Ellipse(centerX, centerY, radiusX, radiusY); Arc(centerX, centerY, radiusX, radiusY, startAngle, length), type: ArcType.OPEN, CHORD veya ROUND; Polygon kapalı, Polyline açık çokgen çizer ve noktalar getPoints().addAll(x1, y1, x2, y2, ...) ile eklenir.",
          code: `Pane pane = new Pane();
Text text = new Text(20, 20, "Programming is fun");
text.setFont(Font.font("Courier", FontWeight.BOLD, FontPosture.ITALIC, 15));

Line line = new Line(10, 10, 10, 10);
line.endXProperty().bind(pane.widthProperty().subtract(10)); // pencereyle uzar
line.setStrokeWidth(5);
line.setStroke(Color.GREEN);

Rectangle r = new Rectangle(25, 10, 60, 30);   // x, y, genişlik, yükseklik
r.setArcWidth(15);                             // yuvarlatılmış köşeler //!
r.setArcHeight(25);
r.setFill(Color.WHITE);
r.setStroke(Color.BLACK);

Ellipse e = new Ellipse(150, 100, 100, 50);    // merkez + radiusX, radiusY
Arc arc = new Arc(150, 100, 80, 80, 30, 35);   // 30°'den başla, 35° süpür //!
arc.setType(ArcType.ROUND);                    // OPEN · CHORD · ROUND

Polygon triangle = new Polygon();
triangle.getPoints().addAll(200.0, 100.0, 150.0, 186.6, 250.0, 186.6); // Double!
pane.getChildren().addAll(text, line, r, e, arc, triangle);`,
        },
        {
          id: "fx-animations",
          title: "Animasyonlar (Timeline, FadeTransition)",
          label: "JavaFX Animasyon",
          def: "JavaFX'te animasyonlar Animation soyut sınıfının alt sınıflarıdır. Timeline KeyFrame'lerle zamana dayalı değişim, FadeTransition opaklık geçişi, PathTransition ise bir yol boyunca hareket sağlar.",
          code: `// ClockAnimation: Timeline her saniye ClockPane'i günceller
ClockPane clock = new ClockPane();
EventHandler<ActionEvent> tick = e -> clock.setCurrentTime();
Timeline animation = new Timeline(new KeyFrame(Duration.millis(1000), tick)); //!
animation.setCycleCount(Timeline.INDEFINITE);
animation.play();

// FadeTransition: elipsin opaklığı 1.0 ↔ 0.1 arasında gidip gelir
FadeTransition ft = new FadeTransition(Duration.millis(3000), ellipse); //!
ft.setFromValue(1.0);
ft.setToValue(0.1);
ft.setCycleCount(Timeline.INDEFINITE);
ft.setAutoReverse(true);
ft.play();
ellipse.setOnMousePressed(e -> ft.pause());    // basılıyken dur
ellipse.setOnMouseReleased(e -> ft.play());    // bırakınca devam`,
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

  visibility: `// JS'te paket erişimi yok: üye ya public ya da #private
class C1 {
  x = 1;          // public: her yerden
  #z = 3;         // private: yalnızca sınıf içinden //!
  m1() { return this.#z; }
}
const o = new C1();
console.log(o.x);     // 1
// o.#z;              // SyntaxError: sınıf dışından erişilemez
// Modül (dosya) düzeyinde gizlilik: export edilmeyen her şey "paket içi" gibidir`,
  static: `class Circle {
  static numberOfObjects = 0;      // sınıfa ait, tek kopya //!
  constructor(radius = 1) {
    this.radius = radius;          // her nesneye ait
    Circle.numberOfObjects++;
  }
  static getNumberOfObjects() {    // nesnesiz çağrılır
    return Circle.numberOfObjects;
  }
}
new Circle(); new Circle(5);
console.log(Circle.getNumberOfObjects()); // 2 //!`,
  "arrays-2d": `// JS'te 2B dizi = dizilerin dizisi
const matrix = Array.from({ length: 5 }, () => new Array(5).fill(0)); //!
matrix[2][1] = 7;
const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];
console.log(array.length, array[0].length); // 4 3
for (const row of array) console.log(row.join(" "));
// Dikkat: new Array(5).fill([]) tüm satırlara AYNI diziyi koyar!`,
  arraylist: `// JS dizileri zaten dinamik: ArrayList ≈ Array
const cityList = [];
cityList.push("London", "Denver", "Paris", "Miami", "Seoul", "Tokyo");
console.log(cityList.length, cityList.includes("Miami"), cityList.indexOf("Denver"));
cityList.splice(2, 0, "Xian");                        // add(2, "Xian") //!
cityList.splice(cityList.indexOf("Miami"), 1);        // remove("Miami")
cityList.splice(1, 1);                                // remove(1)
console.log(cityList); // ["London", "Xian", "Paris", "Seoul", "Tokyo"]`,
  /* ---------- Advanced OOP ---------- */
  inheritance: `class GeometricObject {
  #color = "white";
  #filled = false;
  get color() { return this.#color; }
  set color(value) { this.#color = value; }
  get filled() { return this.#filled; }
}

class Circle extends GeometricObject { //!
  constructor(radius) { super(); this.radius = radius; }
  getArea() { return this.radius ** 2 * Math.PI; }
}

class Rectangle extends GeometricObject { //!
  constructor(width, height) { super(); this.width = width; this.height = height; }
  getArea() { return this.width * this.height; }
}

const circle = new Circle(1);
circle.color = "red";            // GeometricObject'ten miras
console.log(circle.color, circle.getArea());`,

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

  interfaces: `// JS'te Comparable yok ama sözleşme aynı: <0 küçük, 0 eşit, >0 büyük
console.log("ABC".localeCompare("ABE"));     // negatif //!
const compareBig = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
console.log(compareBig(3432n, 2343n));        // 1 (BigInt ≈ BigInteger)

// interface yok: sözleşme = aynı adlı metotlara sahip olmak
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

  recursion: `function factorial(n) {
  if (n === 0) return 1;            // temel durum (base case) //!
  return n * factorial(n - 1);      // özyineli çağrı
}

const fib = (index) => (index < 2 ? index : fib(index - 1) + fib(index - 2));

console.log(factorial(4), fib(10)); // 24 55
// Temel durum yoksa: RangeError: Maximum call stack size exceeded`,

  generics: `// JS dinamik tiplidir: generic yok, tür güvenliği derleme zamanında denetlenmez
class GenericStack { //!
  #list = [];
  push(o) { this.#list.push(o); }
  pop() { return this.#list.pop(); }
  get isEmpty() { return this.#list.length === 0; }
}

const max = (a, b) => ((a.compareTo ? a.compareTo(b) : a - b) >= 0 ? a : b);

const stack = new GenericStack();
stack.push("Londra");
stack.push(42);      // JS izin verir; TypeScript'te GenericStack<string> bunu engellerdi
console.log(max(3, 7)); // 7`,

  "object-class": `class Circle {
  constructor(radius) { this.radius = radius; }
  toString() { return "Circle radius = " + this.radius; } // String(c) bunu çağırır //!
  equals(o) { return o instanceof Circle && this.radius === o.radius; }
}
const c1 = new Circle(5), c2 = new Circle(5);
console.log(c1 === c2);       // false: farklı nesneler
console.log(c1.equals(c2));   // true //!
console.log(String(c1));      // "Circle radius = 5"`,
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

  "try-catch-finally": `// QuotientWithException karşılığı
function quotient(number1, number2) {
  // Dikkat: JS'te 5 / 0 = Infinity, hata FIRLAMAZ → elle kontrol şart
  if (number2 === 0) throw new RangeError("Bölen sıfır olamaz");
  return Math.trunc(number1 / number2);
}

try { //!
  console.log("5 / 0 = " + quotient(5, 0));
} catch (ex) { //!
  console.log("Hata: " + ex.message);
} finally {
  console.log("finally her durumda çalışır");
}
console.log("Program çalışmaya devam ediyor...");`,

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

  lambda: `// JS'te SAM arayüzü gerekmez: fonksiyonlar zaten birinci sınıf değerdir
btEnlarge.addEventListener("click", function () { circlePane.enlarge(); }); // anonim
btEnlarge.addEventListener("click", () => circlePane.enlarge()); //!

const byLength = (a, b) => a.length - b.length;
const task = () => console.log("Çalışıyor");
["elma", "kivi"].sort(byLength);
// Fark: arrow function'ın kendi this'i yoktur, dıştaki this'i kullanır`,

  "mouse-key-events": `// ControlCircleWithMouseAndKey karşılığı (SVG <circle>)
let radius = 50;
const resize = (delta) => circle.setAttribute("r", radius = Math.max(5, radius + delta));

circle.addEventListener("click", () => resize(+5)); //!
circle.addEventListener("contextmenu", (e) => {   // sağ tık
  e.preventDefault();
  resize(-5);
});
document.addEventListener("keydown", (e) => { //!
  if (e.key === "ArrowUp") resize(+5);
  else if (e.key === "ArrowDown") resize(-5);
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

  javafx: `// ClockPane karşılığı: <canvas> üzerine analog saat
// Stage ≈ tarayıcı penceresi, Scene ≈ DOM ağacı, VBox ≈ flex-direction: column
class ClockPane {
  constructor(size = 200) {
    this.canvas = Object.assign(document.createElement("canvas"), { width: size, height: size });
    this.setCurrentTime();
  }
  setCurrentTime() {
    const now = new Date();
    [this.hour, this.minute, this.second] = [now.getHours(), now.getMinutes(), now.getSeconds()];
    this.paintClock();
  }
  paintClock() { //!
    const ctx = this.canvas.getContext("2d");
    const c = this.canvas.width / 2, r = c * 0.8;
    ctx.clearRect(0, 0, c * 2, c * 2);
    ctx.beginPath(); ctx.arc(c, c, r, 0, Math.PI * 2); ctx.stroke();
    const sAngle = this.second * (2 * Math.PI / 60);
    ctx.save(); ctx.strokeStyle = "red";
    ctx.beginPath(); ctx.moveTo(c, c);
    ctx.lineTo(c + r * 0.8 * Math.sin(sAngle), c - r * 0.8 * Math.cos(sAngle));
    ctx.stroke(); ctx.restore();
  }
}

const vbox = document.createElement("div");
vbox.style.cssText = "display: flex; flex-direction: column; gap: 10px";
const clock = new ClockPane();
vbox.append(clock.canvas, "Analog Saat"); //!
document.body.append(vbox);   // stage.setScene + show`,

  "fx-animations": `// ClockAnimation: Timeline yerine her 1000 ms'de bir setInterval
const clock = new ClockPane();
const animation = setInterval(() => clock.setCurrentTime(), 1000); //!

// FadeTransition karşılığı: Web Animations API
const ft = ellipse.animate( //!
  [{ opacity: 1 }, { opacity: 0.1 }],
  { duration: 3000, iterations: Infinity, direction: "alternate" }
);
ellipse.addEventListener("pointerdown", () => ft.pause());
ellipse.addEventListener("pointerup", () => ft.play());`,

  "text-io": `// Tarayıcıda PrintWriter yok: metni Blob yapıp indirt
const lines = [];
lines.push("John T Smith 90");                  // output.println(...)
lines.push("Eric K Jones 85");
const blob = new Blob([lines.join("\\n")], { type: "text/plain" }); //!
const a = Object.assign(document.createElement("a"), {
  href: URL.createObjectURL(blob), download: "scores.txt",
});
a.click();
URL.revokeObjectURL(a.href);                    // kaynağı bırak (≈ close)`,
  "swing-components": `// Swing bileşenlerinin HTML karşılıkları
// JLabel → <label>, JTextField → <input>, JTextArea → <textarea>
// JCheckBox → checkbox, JRadioButton + ButtonGroup → aynı name'li radio'lar //!
// JComboBox → <select>, JList → <select multiple>, JSlider → <input type="range">
const form = document.createElement("form");
form.innerHTML =
  '<label>Ad <input name="ad" size="8"></label>' +
  '<label><input type="checkbox" name="kalin"> Kalın</label>' +
  '<label><input type="radio" name="renk" value="red"> Kırmızı</label>' +
  '<select name="ulke"><option>Kanada</option><option>Çin</option></select>' +
  '<button>Kaydet</button>';
document.body.append(form);`,
  "fx-layouts": `// JavaFX panelleri ≈ CSS yerleşimleri
// HBox → display:flex,  VBox → flex-direction:column
// FlowPane → flex-wrap:wrap,  GridPane → display:grid //!
// BorderPane → grid-template-areas,  StackPane → aynı grid hücresinde üst üste
const grid = document.createElement("div");
grid.style.cssText = "display:grid; grid-template-columns:auto auto; gap:5.5px; justify-content:center";
grid.append(Object.assign(document.createElement("label"), { textContent: "First Name:" }),
            document.createElement("input"));
document.body.append(grid);`,
  "fx-shapes": `// JavaFX Shape'leri ≈ SVG öğeleri (orijin yine sol üst, y aşağı)
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", 300); svg.setAttribute("height", 200);
svg.innerHTML =
  '<text x="20" y="20" font-family="Courier" font-weight="bold">Programming is fun</text>' +
  '<rect x="25" y="10" width="60" height="30" rx="7.5" ry="12.5" fill="white" stroke="black"/>' + //!
  '<ellipse cx="150" cy="100" rx="100" ry="50" fill="none" stroke="gray"/>' +
  '<polygon points="200,100 150,186.6 250,186.6" fill="orange"/>';
document.body.append(svg);`,
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

  static: {
    question: "Bu kod çalıştığında konsola ne yazar?",
    code: `class Counter {
    static int count = 0;
    int id;
    Counter() { count++; id = count; }
}
Counter a = new Counter();
Counter b = new Counter();
Counter c = new Counter();
System.out.println(a.id + " " + c.id + " " + a.count);`,
    options: ["1 3 1", "1 3 3", "1 1 3", "3 3 3"],
    answer: 1,
    explain: "id örnek değişkenidir; her nesne oluşturulduğu andaki sayıyı saklar (a=1, c=3). count ise static; tek kopyadır ve son değeri 3'tür, a.count da aynı kopyayı okur.",
  },
  "arrays-2d": {
    question: "int[][] x = new int[3][4]; için hangisi DOĞRUDUR?",
    options: [
      "x.length 4, x[0].length 3",
      "x.length 3, x[0].length 4",
      "x.length 12",
      "x[3][4] son elemandır",
    ],
    answer: 1,
    explain: "İlk boyut satır sayısıdır: x.length = 3. Her satır 4 elemanlı bir dizidir: x[0].length = 4. Son eleman x[2][3]'tür; x[3][4] ArrayIndexOutOfBoundsException fırlatır.",
  },
  arraylist: {
    question: "Bu kod çalıştığında konsola ne yazar?",
    code: `ArrayList<Integer> list = new ArrayList<>();
list.add(10);
list.add(20);
list.add(30);
list.remove(1);
System.out.println(list);`,
    options: ["[10, 20, 30]", "[20, 30]", "[10, 30]", "Derleme hatası"],
    answer: 2,
    explain: "remove(1) ifadesinde 1 bir int'tir; bu yüzden remove(int index) seçilir ve 1. İNDİSTEKİ eleman (20) silinir. 1 DEĞERİNİ silmek için list.remove(Integer.valueOf(1)) yazılmalıdır.",
  },
  visibility: {
    question: "C1 sınıfı p1 paketinde, C3 sınıfı p2 paketindedir. C3 içinde hangisi DERLENİR?",
    code: `package p1;
public class C1 {
    public int x;
    int y;
    private int z;
}`,
    options: ["o.y = 2;", "o.z = 3;", "o.x = 1;", "Hiçbiri"],
    answer: 2,
    explain: "Farklı paketten yalnızca public üyelere erişilebilir. y varsayılan (paket) erişimlidir, z ise private'tır.",
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

  "object-class": {
    question: "Circle sınıfında equals şöyle tanımlanmışsa çıktı ne olur?",
    code: `class Circle {
    double radius;
    Circle(double r) { radius = r; }
    public boolean equals(Circle c) {      // dikkat: parametre Circle
        return radius == c.radius;
    }
}
Object o1 = new Circle(1);
Object o2 = new Circle(1);
System.out.println(o1.equals(o2));`,
    options: ["true", "false", "Derleme hatası", "ClassCastException"],
    answer: 1,
    explain: "equals(Circle) Object'teki equals(Object)'i ezmez, aşırı yükler (overload). Değişkenlerin bildirilen türü Object olduğu için derleyici equals(Object)'i seçer; o da == ile referansları karşılaştırır → false. Doğrusu: public boolean equals(Object o).",
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

  "fx-layouts": {
    question: "GridPane'de \"Add Name\" düğmesini 2. SÜTUN, 4. SATIRA koymak için hangisi yazılır?",
    options: [
      "grid.add(btAdd, 3, 1);",
      "grid.add(btAdd, 1, 3);",
      "grid.add(btAdd, 2, 4);",
      "grid.setCell(btAdd, 1, 3);",
    ],
    answer: 1,
    explain: "GridPane.add(düğüm, sütunIndeksi, satırIndeksi). İndisler 0'dan başlar: 2. sütun → 1, 4. satır → 3.",
  },
  "text-io": {
    question: "scores.txt dosyası 100 satır içeriyorsa bu kod çalıştıktan sonra dosyada ne kalır?",
    code: `try (PrintWriter out = new PrintWriter("scores.txt")) {
    out.println("Yeni kayıt");
}`,
    options: [
      "101 satır: yeni satır sona eklenir",
      "Yalnızca \"Yeni kayıt\" satırı",
      "Dosya değişmez, istisna fırlar",
      "Boş dosya: close() çağrılmadı",
    ],
    answer: 1,
    explain: "PrintWriter mevcut dosyanın içeriğini siler ve baştan yazar. try-with-resources close()'u otomatik çağırdığı için yazılan satır dosyaya aktarılır.",
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
  recursion: [
    { title: "Temel duruma yaklaşmayan çağrı", text: "Temel durum yazılmış olsa bile çağrı ona yaklaşmıyorsa (ör. factorial(n + 1) veya factorial(-1)) her çağrı yığına yeni çerçeve ekler ve StackOverflowError fırlar." },
    { title: "Naif Fibonacci üsteldir", text: "fib(n - 1) + fib(n - 2) aynı alt problemleri tekrar tekrar hesaplar; fib(40) yüz milyonlarca çağrı yapar. Döngü veya önbellek (memoization) ile doğrusal zamana iner." },
  ],
  generics: [
    { title: "İlkel tür kullanılamaz", text: "GenericStack<int> derleme hatasıdır; sarmalayıcı tür kullanılır: GenericStack<Integer>. Type erasure yüzünden new E() ve new E[10] de yazılamaz." },
    { title: "Generic'ler kovaryant değildir", text: "Integer, Number'ın alt türüdür ama ArrayList<Integer>, ArrayList<Number>'ın alt türü DEĞİLDİR. Esneklik için joker tip kullanılır: ArrayList<? extends Number>." },
  ],
  static: [
    { title: "Static bağlamdan örnek üyeye erişim", text: "Static bir metot (ör. main) örnek değişkenine veya örnek metoduna doğrudan erişemez: \"non-static variable cannot be referenced from a static context\". Önce nesne oluşturup nesne.uye ile erişilir. Örnek metotları ise hem static hem örnek üyelere erişebilir." },
    { title: "Hangisi static olmalı?", text: "Nesnenin durumuna bağlı değişken/metot örnek üyesidir (getArea, radius). Hiçbir nesneye bağlı olmayan değer/işlem static olmalıdır (numberOfObjects, Math.random). Static değişkene nesne üzerinden erişmek (c1.numberOfObjects) çalışır ama okunabilirlik için Circle.numberOfObjects yazılır." },
  ],
  visibility: [
    { title: "Sınıfın kendisi private olamaz", text: "private ve protected yalnızca üyelere uygulanır; üst düzey bir sınıf yalnızca public ya da varsayılan erişimli olabilir. Bir dosyada en fazla bir public sınıf bulunur ve dosya adı o sınıfın adıyla aynı olmalıdır." },
    { title: "Yerel değişkene belirleyici yazılmaz", text: "public int x; gibi bir bildirim metot içinde (yerel değişken) derleme hatasıdır. Görünürlük belirleyicileri yalnızca sınıf ve üyeleri içindir." },
  ],
  "arrays-2d": [
    { title: "İlk boyut zorunlu", text: "new int[5][] geçerlidir (satırlar sonra oluşturulur, düzensiz dizi). new int[][5] ise derleme hatasıdır: ilk boyut her zaman belirtilmelidir." },
    { title: "matrix[2, 1] Java değildir", text: "Java'da indisler ayrı köşeli parantezlerle yazılır: matrix[2][1]. Virgüllü yazım C# sözdizimidir." },
  ],
  arraylist: [
    { title: "İlkel tür kullanılamaz", text: "ArrayList<int> derleme hatasıdır; sarmalayıcı sınıf kullanılır: ArrayList<Integer>. list.add(5) çalışır çünkü 5 otomatik olarak Integer'a kutulanır." },
    { title: "size() ≠ length", text: "Dizide uzunluk alanıdır: array.length. String'de metottur: s.length(). ArrayList'te ise list.size() kullanılır." },
  ],
  "object-class": [
    { title: "equals(Circle) ≠ equals(Object)", text: "Parametre türü Object değilse metot override edilmez, aşırı yüklenir. Değişken Object türündeyken çağrı Object.equals'a gider ve referans karşılaştırılır. @Override yazmak bu hatayı derleme zamanında yakalar." },
    { title: "Varsayılan toString", text: "toString override edilmezse System.out.println(nesne) \"SınıfAdı@hexHash\" (ör. Circle@15db9742) yazar." },
  ],
  "text-io": [
    { title: "PrintWriter dosyayı siler", text: "Var olan bir dosyayla new PrintWriter(file) çağrılınca eski içerik silinir. Bu yüzden ders örneği WriteData önce file.exists() ile kontrol eder." },
    { title: "Checked istisna", text: "new PrintWriter(file) FileNotFoundException fırlatabilir; main'e throws IOException (veya Exception) yazılmazsa ya da try-catch kullanılmazsa derleme hatası alınır." },
  ],
  "fx-layouts": [
    { title: "Bir düğüm tek bir panelde", text: "Aynı düğüm (ör. bir Button) iki farklı panele eklenemez; ikinci kez eklenince önceki panelden çıkar ya da 'duplicate children' hatası oluşur. Her panel için ayrı nesne oluşturulmalı." },
    { title: "GridPane: önce sütun", text: "add(düğüm, sütun, satır) parametre sırası dizilerdeki [satır][sütun] alışkanlığının tersidir." },
  ],
  "fx-shapes": [
    { title: "y ekseni aşağı doğru", text: "Java/JavaFX koordinatlarında (0, 0) sol üst köşedir; y büyüdükçe nokta AŞAĞI iner. Matematikteki kartezyen sistemin tersidir." },
    { title: "Polygon noktaları Double", text: "getPoints() bir ObservableList<Double> döndürür; addAll(200, 100) int değerlerle derleme hatası verir, 200.0, 100.0 yazılmalıdır." },
  ],
};

/* =========================================================================
   ÖNKOŞULLAR (DAG — Yönlü Döngüsüz Graf)
   -------------------------------------------------------------------------
   kavram → onu öğrenmeden önce bilinmesi gerekenler. Graftaki bağlar
   artık merkezden değil, bu ilişkilerden çizilir (önkoşul → kavram).
   Önkoşulu olmayan kavram bir "başlangıç" (kaynak) düğümüdür.
   Döngü oluşturmamaya dikkat et; physics.js döngüyü tespit edip uyarır.

   Bölüm sırası dersin resmî akışını izler (Müfredat Modu bu sırayı açar):
     Sınıf/Nesne → Kalıtım → İstisnalar → Soyut Sınıflar/Arayüzler →
     Olaya Dayalı Programlama → GUI (JavaFX) → Özyineleme → Generics →
     Tasarım Desenleri
   Bölümler arası geçişler "⇢" yorumuyla işaretlidir.
   ========================================================================= */
const DEPENDENCIES = {
  /* ---------- Core OOP ---------- */
  classes: [],
  objects: ["classes"],
  uml: ["classes"],
  constructors: ["objects"],
  "primitive-vs-object": ["objects"],
  "reference-fields": ["primitive-vs-object"],
  null: ["reference-fields"],
  "garbage-collection": ["null"],
  this: ["constructors"],
  encapsulation: ["this", "visibility"],
  visibility: ["objects"],
  static: ["constructors"],
  "arrays-2d": [],                                 // ayrı başlangıç: BP-I'den gelen dizi bilgisi
  arraylist: ["arrays-2d", "primitive-vs-object"], // Integer kutulama + dinamik dizi

  /* ---------- Advanced OOP ---------- */
  inheritance: ["classes", "encapsulation"],
  "super-sub": ["inheritance"],
  super: ["super-sub", "constructors"],
  overriding: ["super-sub"],
  overloading: ["constructors"],
  polymorphism: ["overriding"],
  "dynamic-binding": ["polymorphism"],
  casting: ["polymorphism", "primitive-vs-object"],
  instanceof: ["casting"],
  "object-class": ["overriding"],
  abstract: ["polymorphism", "custom-exceptions"], // ⇢ İstisnalar → Soyut Sınıflar
  interfaces: ["abstract"],
  recursion: ["fx-animations", "error"],           // ⇢ GUI → Özyineleme (StackOverflowError bağı)
  generics: ["recursion", "interfaces"],           // ⇢ Özyineleme → Generics (Comparable<E> sınırı)

  /* ---------- İstisna Yönetimi ---------- */
  throwable: ["inheritance"],                      // ⇢ Kalıtım → İstisnalar (hiyerarşi)
  error: ["throwable"],
  exception: ["throwable"],
  "try-catch-finally": ["exception"],
  throw: ["try-catch-finally"],
  throws: ["throw"],
  chained: ["throw"],
  "custom-exceptions": ["throws", "super"],

  /* ---------- Event-Driven ---------- */
  "events-basics": ["interfaces"],                 // ⇢ Arayüzler → Olaylar (EventHandler bir arayüz)
  listeners: ["events-basics"],
  "inner-classes": ["listeners"],
  "anonymous-classes": ["inner-classes"],
  lambda: ["anonymous-classes"],
  "mouse-key-events": ["lambda"],
  timer: ["lambda"],

  /* ---------- GUI & I/O ---------- */
  file: ["exception"],
  "text-io": ["file", "try-catch-finally"],
  scanner: ["text-io"],
  swing: ["mouse-key-events"],                     // ⇢ Olaylar → GUI
  "swing-components": ["swing"],
  javafx: ["mouse-key-events"],
  "fx-layouts": ["javafx"],
  "fx-shapes": ["javafx"],
  "fx-animations": ["fx-shapes", "timer"],

  /* ---------- Tasarım Desenleri ---------- */
  singleton: ["generics"],                         // ⇢ Generics → Tasarım Desenleri
  factory: ["generics"],
  adapter: ["generics"],
};

/* =========================================================================
   PRATİK — "Akıllı Ev" kodlama laboratuvarı
   -------------------------------------------------------------------------
   Yalnızca uygulamalı çekirdek OOP kavramlarında bulunur (teorik konularda,
   ör. UML ve Çöp Toplama'da yok). Bölümler bu tablodaki SIRAYLA tek bir
   hikâye oluşturur: Device → Light → Thermostat → akıllı ev uygulaması.
     instruction    : görev tanımı
     skeleton       : editöre yüklenen, kısmen boş taslak kod
     validationKeys : hepsi sağlanmalı. Yorumlar silinip boşluklar
                      normalize edildikten sonra denetlenir:
                        "metin" → boşluk farkı gözetmeden metinde geçmeli
                        /regex/ → normalize edilmiş kodda eşleşmeli
                      (taslak kodun kendisi hiçbir zaman geçmemeli)
     successMessage : başarı mesajı
   ========================================================================= */
const PRACTICES = {
  classes: {
    instruction: "Akıllı Ev projemiz başlıyor! 🏠 Evdeki her cihazın şablonu olacak Device adında bir sınıf oluştur ve içine cihazın adını tutacak String türünde name alanını ekle.",
    skeleton: `// Akıllı Ev · Her cihazın şablonu (blueprint)
public class ______ {
    // TODO: cihazın adını tutacak String alanı

}`,
    validationKeys: [/\bclass Device ?\{/, /\bString name ?(=[^;]*)?;/],
    successMessage: "Harika! Device artık evdeki tüm cihazların şablonu. Henüz tek bir cihaz yok; yalnızca planı çizdin.",
  },
  objects: {
    instruction: "Şablon hazır, şimdi gerçek bir cihaz üretme zamanı. main içinde new ile lamp adında bir Device nesnesi oluştur ve name alanına \"Salon Lambası\" ata.",
    skeleton: `class Device {
    String name;
}

public class SmartHome {
    public static void main(String[] args) {
        // TODO: lamp adında bir Device nesnesi oluştur

        // TODO: lamp'in adını ata

        System.out.println(lamp.name);
    }
}`,
    validationKeys: [/\bDevice lamp ?= ?new Device ?\( ?\) ?;/, /\blamp\.name ?= ?"[^"]+" ?;/],
    successMessage: "İlk cihaz hayatta! 💡 lamp, Device sınıfının bir örneği (instance). Aynı şablondan istediğin kadar nesne üretebilirsin.",
  },
  constructors: {
    instruction: "Her cihaza tek tek ad atamak zahmetli. Device sınıfına String parametre alan bir yapıcı (constructor) ekle ve parametreyi name alanına ata. Sonra lamp nesnesini bu yapıcıya bir ad vererek oluştur.",
    skeleton: `class Device {
    String name;

    // TODO: Device(String n) yapıcısı

}

public class SmartHome {
    public static void main(String[] args) {
        Device lamp = new Device(/* TODO: ad */);
        System.out.println(lamp.name);
    }
}`,
    validationKeys: [/\bDevice ?\( ?String (\w+) ?\) ?\{[^}]*\bname ?= ?\1 ?;/, /\bnew Device ?\( ?"[^"]+" ?\)/],
    successMessage: "Yapıcı devrede! 🔧 Artık her cihaz doğduğu anda adını alıyor; yarım kalmış nesne yok.",
  },
  overloading: {
    instruction: "Cihazı iki şekilde açabilmek istiyoruz: turnOn() hemen açsın, turnOn(int minutes) ise açıp kaç dakika sonra kapanacağını autoOffMinutes alanına yazsın. Aynı adlı, farklı parametreli iki metot yaz (overloading).",
    skeleton: `class Device {
    String name;
    boolean on;
    int autoOffMinutes;

    Device(String n) { name = n; }

    // TODO: turnOn() → cihazı açar

    // TODO: turnOn(int minutes) → açar ve zamanlayıcıyı kurar

}`,
    validationKeys: [/\bvoid turnOn ?\( ?\) ?\{/, /\bvoid turnOn ?\( ?int (\w+) ?\) ?\{[^}]*\bautoOffMinutes ?= ?\1/, /\bon ?= ?true ?;/],
    successMessage: "Derleyici hangi turnOn'un çağrılacağını argümanlara bakarak seçiyor. lamp.turnOn() ve lamp.turnOn(30) artık ikisi de geçerli! ⏲️",
  },
  this: {
    instruction: "Yapıcının parametresi de alan da name olsun. Bu durumda parametre alanı gölgeler (shadowing) ve name = name; kendine atama olur. this anahtar kelimesiyle alanı parametreden ayırarak ata.",
    skeleton: `class Device {
    String name;

    Device(String name) {
        // TODO: alanı parametreden ayırarak ata

    }
}`,
    validationKeys: ["this.name = name;"],
    successMessage: "this.name nesnenin alanı, name ise parametre. Gölgeleme sorunu çözüldü! 🪞",
  },
  encapsulation: {
    instruction: "Şu an herkes lamp.name = \"\" yazıp cihazı bozabiliyor. name alanını private yap, açık/kapalı durumunu tutan private boolean on alanı ekle ve dışarıya yalnızca getName() ile isOn() getter'larını aç.",
    skeleton: `public class Device {
    String name;          // TODO: dışarıya kapat
    // TODO: açık/kapalı durumu için alan

    public Device(String name) {
        this.name = name;
    }

    // TODO: getName() ve isOn()

}`,
    validationKeys: [
      /\bprivate String name ?;/,
      /\bprivate boolean on ?;/,
      /\bpublic String getName ?\( ?\) ?\{ ?return (this\.)?name ?;/,
      /\bpublic boolean isOn ?\( ?\) ?\{ ?return (this\.)?on ?;/,
    ],
    successMessage: "Cihazın iç durumu artık korunuyor 🔒. Dış dünya yalnızca senin açtığın kapılardan (getter) bakabiliyor.",
  },
  "reference-fields": {
    instruction: "Her cihaz bir odada durur. Room sınıfı hazır. Device'a Room türünde private bir room alanı ekle, yapıcıya ikinci parametre olarak Room room ekle ve this ile ata. Device artık bir Room nesnesine referans tutacak (has-a).",
    skeleton: `class Room {
    private String title;
    public Room(String title) { this.title = title; }
    public String getTitle() { return title; }
}

public class Device {
    private String name;
    private boolean on;
    // TODO: Room referans alanı

    public Device(String name /* TODO: ikinci parametre */) {
        this.name = name;
        // TODO: room alanını ata
    }
}`,
    validationKeys: [/\bprivate Room room ?;/, /\bDevice ?\( ?String name ?, ?Room room ?\)/, "this.room = room;"],
    successMessage: "Device → Room bağlantısı kuruldu 🛋️. Alan nesnenin kendisini değil, bellekteki adresini (referans) tutuyor; aynı odayı birçok cihaz paylaşabilir.",
  },
  inheritance: {
    instruction: "Evdeki ilk özel cihaz: akıllı lamba. Light sınıfını Device'tan türet (extends) ve parlaklığı tutan private int brightness alanını ekle. Light; name, on ve getter'ları yeniden yazmadan miras alır.",
    skeleton: `public class Device {
    private String name;
    private boolean on;

    public Device(String name) { this.name = name; }
    public String getName() { return name; }
    public boolean isOn() { return on; }
}

// TODO: Light bir Device'tır (is-a)
public class Light {
    // TODO: parlaklık alanı (0-100)

    public Light(String name) {
        super(name);
    }
}`,
    validationKeys: [/\bclass Light extends Device\b/, /\bprivate int brightness ?(=[^;]*)?;/],
    successMessage: "Light, Device'ın tüm yeteneklerini miras aldı ve üstüne parlaklık ekledi 💡. Kod tekrarı sıfır!",
  },
  super: {
    instruction: "Sıra termostatta! Thermostat, Device'tan türüyor. Yapıcısında önce super(name) ile üst sınıfın yapıcısını çağır (ilk satır olmalı!), ardından hedef sıcaklığı targetTemp alanına ata.",
    skeleton: `public class Thermostat extends Device {
    private double targetTemp;

    public Thermostat(String name, double targetTemp) {
        // TODO: önce üst sınıfın yapıcısı

        // TODO: sonra kendi alanın

    }
}`,
    validationKeys: [/\bThermostat ?\([^)]*\) ?\{ ?super ?\( ?name ?\) ?;/, "this.targetTemp = targetTemp;"],
    successMessage: "Önce Device kısmı kuruldu, sonra Thermostat'ın kendi alanı 🌡️. super(...) her zaman ilk satırda!",
  },
  overriding: {
    instruction: "Device'taki status() metodu \"Salon Lambası: açık\" gibi genel bir metin döndürüyor. Light içinde bu metodu @Override ile ez; super.status() sonucuna parlaklığı ekleyerek döndür (ör. \"Salon Lambası: açık · %80\").",
    skeleton: `public class Device {
    // ... önceki alanlar ve getter'lar
    public String status() {
        return getName() + ": " + (isOn() ? "açık" : "kapalı");
    }
}

public class Light extends Device {
    private int brightness = 80;

    public Light(String name) { super(name); }

    // TODO: status() metodunu ez ve parlaklığı ekle

}`,
    validationKeys: [/@Override public String status ?\( ?\)/, /\breturn super\.status ?\( ?\)[^;]*\bbrightness\b/],
    successMessage: "Light kendi status() sürümünü konuştu 🗣️. super.status() ile üst sınıfın işini tekrar yazmadan genişlettin.",
  },
  polymorphism: {
    instruction: "Akıllı ev uygulaması tüm cihazları tek listede yönetmeli. Device türünde bir dizi oluştur, içine bir Light ve bir Thermostat koy; for-each döngüsüyle her birinin status() metodunu çağırıp yazdır.",
    skeleton: `public class SmartHome {
    public static void main(String[] args) {
        // TODO: Device[] devices = { ... };

        // TODO: her cihazın durumunu yazdır

    }
}`,
    validationKeys: [/\bDevice ?\[ ?\] ?\w+ ?=/, /\bnew Light ?\(/, /\bnew Thermostat ?\(/, /\bfor ?\( ?Device \w+ ?: ?\w+ ?\)/, /\.status ?\( ?\)/],
    successMessage: "Tek döngü, farklı davranışlar 🎭. Hangi status()'un çalışacağına değişkenin türü değil, nesnenin gerçek türü karar verdi (dinamik bağlama).",
  },
  abstract: {
    instruction: "\"Cihaz\" soyut bir kavram; kimse çıplak bir Device satın almaz. Device'ı abstract yap ve gövdesiz abstract double powerUsage() metodunu ekle. Sonra Light içinde bu metodu uygula (ör. brightness * 0.1 döndürsün).",
    skeleton: `public class Device {
    private String name;
    public Device(String name) { this.name = name; }

    // TODO: watt cinsinden tüketim (gövdesiz)

}

public class Light extends Device {
    private int brightness = 80;
    public Light(String name) { super(name); }

    // TODO: powerUsage() uygulaması

}`,
    validationKeys: [/\babstract class Device\b/, /\babstract double powerUsage ?\( ?\) ?;/, /\bdouble powerUsage ?\( ?\) ?\{[^}]*\breturn\b/],
    successMessage: "Artık new Device() yazılamaz; her somut cihaz kendi enerji hesabını yapmak ZORUNDA ⚡.",
  },
  interfaces: {
    instruction: "Bazı cihazlar açılıp kapanabilir, bazıları (ör. duman sensörü) hep açıktır. turnOn() ve turnOff() metotlarını içeren Switchable arayüzünü tanımla; Light hem Device'tan türesin hem de Switchable'ı uygulasın (implements).",
    skeleton: `// TODO: Switchable arayüzü


public class Light extends Device /* TODO: arayüzü uygula */ {
    private boolean on;

    public Light(String name) { super(name); }

    // TODO: turnOn() ve turnOff()

    @Override
    public double powerUsage() { return on ? 8.5 : 0; }
}`,
    validationKeys: [
      /\binterface Switchable ?\{(?=[^}]*\bvoid turnOn ?\( ?\) ?;)(?=[^}]*\bvoid turnOff ?\( ?\) ?;)/,
      /\bclass Light extends Device implements (\w+ ?, ?)*Switchable\b/,
      /\bpublic void turnOn ?\( ?\) ?\{/,
      /\bpublic void turnOff ?\( ?\) ?\{/,
    ],
    successMessage: "🏆 Akıllı Ev tamamlandı! Light artık hem bir Device (kalıtım) hem de Switchable (arayüz sözleşmesi). Gerçek projelerdeki mimarinin aynısını kurdun.",
  },
};

// JS örneklerini, görevleri, tuzakları ve önkoşulları kavramlara bağla
// (eksik olan kalırsa panel o sekmeyi/kutuyu göstermez)
for (const cat of KNOWLEDGE.categories) {
  for (const concept of cat.concepts) {
    concept.js = JS_EXAMPLES[concept.id] ?? null;
    concept.quiz = QUIZZES[concept.id] ?? null;
    concept.traps = TRAPS[concept.id] ?? null;
    concept.dependsOn = DEPENDENCIES[concept.id] ?? [];
    concept.practice = PRACTICES[concept.id] ?? null;
  }
}
