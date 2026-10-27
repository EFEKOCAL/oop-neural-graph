/* =========================================================================
   subtopics.js — Uydu alt konular (ders slaytlarındaki ayrıntılar)
   -------------------------------------------------------------------------
   Sınavda boşluk doldurma, kod tamamlama, kod okuma ve "arka sayfadaki
   problemi yaz" sorularına konu olan küçük ayrıntılar ayrı DAG düğümü
   yerine ana kavramın etrafında dönen uydular olarak gösterilir.
   Kaynak: Prof. Dr. Kazım Yıldız'ın BP-II slaytları (Liang, Introduction
   to Java Programming): Sınıf/Nesne + ArrayList, Kalıtım/Çok Biçimlilik,
   İstisnalar/Metin G/Ç, Soyut Sınıf/Arayüz, Olay Güdümlü (Swing + JavaFX),
   Swing Bileşenleri, JavaFX Temelleri, Animasyonlar, Çok Boyutlu Diziler.

   Yapı:  SUBTOPICS[anaKavramId] = [{ id, title, label?, def, code?, quiz?, traps? }]
     - id'ler tüm grafta benzersiz olmalı (physics.js yinelenenleri atlar)
     - quiz ve traps biçimi data.js ile aynıdır; görevler QUIZZES'a da
       kaydedilir, böylece "x / y görev çözüldü" sayacına katılır
     - Kodlarda "//!" satırı parlatır; Java'daki "\n" kaçışı "\\n" yazılır
   Bu dosya data.js'ten SONRA yüklenmelidir.
   ========================================================================= */

const SUBTOPICS = {
  /* ===================== CORE OOP · Sınıflar ve Nesneler ===================== */
  classes: [
    {
      id: "class-file-rules",
      title: "Kaynak Dosya Kuralları: public Sınıf ve main Sınıfı",
      label: "Dosya kuralları",
      def: "Bir kaynak dosyada birden çok sınıf bulunabilir ama en fazla BİR tanesi public olabilir ve dosyanın adı o public sınıfın adıyla aynı olmalıdır (TestTV.java). Derleyici dosyadaki HER sınıf için ayrı bir .class (bytecode) dosyası üretir: TV.class ve TestTV.class. main metodunu içeren sınıfa ana sınıf (main class) denir; program onunla başlatılır. Ders örneği TV sınıfı; channel, volumeLevel ve on veri alanlarıyla turnOn, turnOff, setChannel, setVolume, channelUp, channelDown, volumeUp, volumeDown metotlarını içerir.",
      code: `public class TV {
    int channel = 1;        // varsayılan kanal 1
    int volumeLevel = 1;    // varsayılan ses 1
    boolean on = false;     // TV kapalı

    public TV() { }
    public void turnOn()  { on = true; }
    public void turnOff() { on = false; }
    public void setChannel(int newChannel) {
        if (on && newChannel >= 1 && newChannel <= 120) channel = newChannel;
    }
    public void setVolume(int newVolumeLevel) {
        if (on && newVolumeLevel >= 1 && newVolumeLevel <= 7) volumeLevel = newVolumeLevel;
    }
    public void channelUp()   { if (on && channel < 120) channel++; }
    public void channelDown() { if (on && channel > 1) channel--; }
    public void volumeUp()    { if (on && volumeLevel < 7) volumeLevel++; }
    public void volumeDown()  { if (on && volumeLevel > 1) volumeLevel--; }
}

public class TestTV {                        // main sınıfı → TestTV.java //!
    public static void main(String[] args) {
        TV tv1 = new TV();
        tv1.turnOn();
        tv1.setChannel(30);
        tv1.setVolume(3);
        TV tv2 = new TV();
        tv2.turnOn();
        tv2.channelUp();
        tv2.channelUp();
        tv2.volumeUp();
        System.out.println("tv1's channel is " + tv1.channel
            + " and volume level is " + tv1.volumeLevel);   // 30 ve 3
        System.out.println("tv2's channel is " + tv2.channel
            + " and volume level is " + tv2.volumeLevel);   // 3 ve 2
    }
}`,
      traps: [
        { title: "İki public sınıf", text: "Aynı dosyada iki public sınıf derleme hatasıdır. Dosya adı public sınıfın adından farklıysa da hata alınır: class TestTV is public, should be declared in a file named TestTV.java." },
      ],
    },
    {
      id: "date-random",
      title: "Java Kütüphanesinden Sınıflar: Date, Random, Point2D",
      label: "Date / Random",
      def: "java.util.Date: new Date() o anki tarih/saati temsil eder; getTime() 1 Ocak 1970 00:00 GMT'den bu yana geçen milisaniyeyi, toString() okunabilir tarihi döndürür, setTime(ms) değiştirir. java.util.Random: new Random() geçerli zamanı tohum (seed) olarak kullanır, new Random(seed) belirtilen tohumu kullanır. AYNI tohumla oluşturulan iki Random nesnesi AYNI sayı dizisini üretir. Metotlar: nextInt() rastgele int, nextInt(n) 0 ile n arasında (n HARİÇ), nextLong(), nextDouble() [0.0, 1.0), nextFloat(), nextBoolean(). javafx.geometry.Point2D: bir noktayı temsil eder; getX(), getY(), distance(x, y), distance(Point2D).",
      code: `java.util.Date date = new java.util.Date();
System.out.println("1970'ten beri geçen ms: " + date.getTime());
System.out.println(date.toString());       // ör. Mon Oct 27 10:15:00 TRT 2026

Random random1 = new Random(3);            // tohum = 3 //!
System.out.print("random1'den: ");
for (int i = 0; i < 10; i++)
    System.out.print(random1.nextInt(1000) + " ");

Random random2 = new Random(3);            // AYNI tohum
System.out.print("\\nrandom2'den: ");
for (int i = 0; i < 10; i++)
    System.out.print(random2.nextInt(1000) + " ");
// İki satır da birebir aynı sayıları yazar: 734 660 210 581 128 202 549 564 459 961 //!

Point2D p1 = new Point2D(0, 0), p2 = new Point2D(3, 4);
System.out.println(p1.distance(p2));       // 5.0`,
      quiz: {
        question: "new Random(3) ile oluşturulan iki nesneden aynı sırayla nextInt(1000) çağrılırsa ne olur?",
        options: [
          "Her çalıştırmada farklı sayılar üretirler",
          "İkisi aynı sayı dizisini üretir",
          "İkinci nesne derleme hatası verir",
          "İkincisi birincinin tersini üretir",
        ],
        answer: 1,
        explain: "Random sözde rastgeledir (pseudo-random). Aynı tohumla başlatılan üreteçler aynı diziyi üretir; bu, test yazarken tekrarlanabilirlik sağlar.",
      },
    },
  ],

  objects: [
    {
      id: "dot-operator",
      title: "Nesneye Erişim: Nokta Operatörü ve Anonim Nesne",
      label: "Nokta (.) / Anonim nesne",
      def: "Nesneye referans değişkeni üzerinden nokta operatörüyle (.) erişilir: nesneRef.veriAlani ile veri alanına, nesneRef.metot(argümanlar) ile metoda. radius bir ÖRNEK (instance) değişkeni, getArea() bir örnek metodudur; çağrıldığı nesneye çağıran nesne (calling object) denir. Nesne bir referans değişkenine atanmadan da oluşturulup kullanılabilir: new Circle().getArea(). Böyle, yalnızca bir kez kullanılan nesneye anonim nesne (anonymous object) denir. Sınıf bir referans türüdür: Circle myCircle; ifadesindeki myCircle bir nesne DEĞİL, nesneye referans tutan değişkendir.",
      code: `Circle myCircle = new Circle(5.0);           // bildirim + oluşturma + atama
System.out.println(myCircle.radius);         // veri alanına erişim //!
System.out.println(myCircle.getArea());      // örnek metodunu çağırma

new Circle();                                // anonim nesne
System.out.println("Alan: " + new Circle(5).getArea()); //!

// Bildirim ve oluşturma ayrı ayrı da yazılabilir:
Circle c;               // yalnızca referans değişkeni (henüz nesne yok)
c = new Circle();       // nesne oluşturulup referansı atanır`,
    },
    {
      id: "object-arrays",
      title: "Nesne Dizileri",
      label: "Nesne dizisi",
      def: "Nesne dizisi aslında bir REFERANS DEĞİŞKENLERİ dizisidir. Circle[] circleArray = new Circle[10]; ifadesi 10 Circle nesnesi değil, değeri null olan 10 referans oluşturur. Her eleman ayrıca new ile oluşturulmalıdır. circleArray[1].getArea() çağrısı iki düzeyde referans içerir: circleArray dizinin tamamını, circleArray[1] ise bir Circle nesnesini gösterir. Ders örneği TotalArea, rastgele yarıçaplı 5 daireden oluşan bir dizi oluşturur, tablo hâlinde yazdırır ve alanların toplamını hesaplar.",
      code: `public class TotalArea {
    public static void main(String[] args) {
        CircleWithPrivateDataFields[] circleArray = createCircleArray();
        printCircleArray(circleArray);
    }

    public static CircleWithPrivateDataFields[] createCircleArray() {
        CircleWithPrivateDataFields[] circleArray = new CircleWithPrivateDataFields[5]; //!
        for (int i = 0; i < circleArray.length; i++)
            circleArray[i] = new CircleWithPrivateDataFields(Math.random() * 100); //!
        return circleArray;
    }

    public static void printCircleArray(CircleWithPrivateDataFields[] circleArray) {
        System.out.printf("%-30s%-15s\\n", "Radius", "Area");
        for (int i = 0; i < circleArray.length; i++)
            System.out.printf("%-30f%-15f\\n", circleArray[i].getRadius(), circleArray[i].getArea());
        System.out.println("-----------------------------------------");
        System.out.printf("%-30s%-15f\\n", "The total area of circles is", sum(circleArray));
    }

    public static double sum(CircleWithPrivateDataFields[] circleArray) {
        double sum = 0;
        for (int i = 0; i < circleArray.length; i++)
            sum += circleArray[i].getArea();
        return sum;
    }
}`,
      quiz: {
        question: "Bu kod çalıştığında ne olur?",
        code: `Circle[] circles = new Circle[3];
System.out.println(circles[0].getArea());`,
        options: ["0.0 yazar", "3.14... yazar", "NullPointerException fırlar", "Derleme hatası"],
        answer: 2,
        explain: "new Circle[3] yalnızca 3 referans oluşturur ve hepsi null'dır. Elemanlar new Circle() ile oluşturulmadan metot çağrısı NullPointerException üretir.",
      },
    },
  ],

  "primitive-vs-object": [
    {
      id: "pass-objects",
      title: "Nesneleri Metoda Geçirme (Pass-by-Value)",
      label: "Nesneyi metoda geçirme",
      def: "Java'da argümanlar her zaman DEĞER ile geçirilir (pass-by-value). İlkel türde değerin kopyası geçer; metot içindeki değişiklik çağıranı etkilemez. Referans türünde ise geçen değer REFERANSIN kopyasıdır (pass-by-sharing): metot ve çağıran AYNI nesneyi gösterir, bu yüzden nesnenin içeriği değiştirilirse değişiklik dışarıdan görülür. Ders örneği TestPassObject: printAreas(myCircle, n) çağrısından sonra myCircle'ın yarıçapı değişmiştir ama n değişmemiştir.",
      code: `public class TestPassObject {
    public static void main(String[] args) {
        CircleWithPrivateDataFields myCircle = new CircleWithPrivateDataFields(1);
        int n = 5;
        printAreas(myCircle, n); //!
        System.out.println("\\nRadius is " + myCircle.getRadius());  // 6.0
        System.out.println("n is " + n);                            // 5 //!
    }

    public static void printAreas(CircleWithPrivateDataFields c, int times) {
        System.out.println("Radius \\t\\tArea");
        while (times >= 1) {
            System.out.println(c.getRadius() + "\\t\\t" + c.getArea());
            c.setRadius(c.getRadius() + 1);   // AYNI nesne değişir
            times--;                          // yalnızca kopya azalır
        }
    }
}`,
      quiz: {
        question: "TestPassObject çalıştırıldığında son iki satırda ne yazar?",
        code: `CircleWithPrivateDataFields myCircle = new CircleWithPrivateDataFields(1);
int n = 5;
printAreas(myCircle, n);   // her turda c.setRadius(+1), times--
System.out.println("Radius is " + myCircle.getRadius());
System.out.println("n is " + n);`,
        options: ["Radius is 1.0 / n is 5", "Radius is 6.0 / n is 0", "Radius is 6.0 / n is 5", "Radius is 5.0 / n is 5"],
        answer: 2,
        explain: "Döngü 5 kez döner ve aynı Circle nesnesinin yarıçapını 1'den 6'ya çıkarır. n ise değerle kopyalandığı için 5 kalır; azaltılan, metottaki times kopyasıdır.",
      },
    },
  ],

  constructors: [
    {
      id: "constructor-rules",
      title: "Yapıcı Kuralları ve Varsayılan Yapıcı",
      label: "Yapıcı kuralları",
      def: "Yapıcı (constructor) üç özelliğiyle sıradan metottan ayrılır: (1) adı sınıfın adıyla AYNI olmalıdır, (2) dönüş tipi YOKTUR, void bile yazılmaz, (3) new operatörüyle nesne oluşturulurken çağrılır; görevi nesneyi başlatmaktır (initialize). Yapıcılar aşırı yüklenebilir (overload). Sınıfta HİÇ yapıcı yazılmamışsa derleyici gövdesi boş, parametresiz bir varsayılan yapıcı (default constructor) ekler. Parametresiz yapıcıya no-arg constructor denir.",
      code: `public class Circle {
    double radius;

    Circle() { radius = 1; }                // no-arg yapıcı
    Circle(double newRadius) {              // aşırı yüklenmiş yapıcı
        radius = newRadius;
    }

    public void Circle() { }                // DİKKAT: bu bir yapıcı DEĞİL, //!
                                            // Circle adlı sıradan bir void metottur!
}

class Kare { double kenar; }               // hiç yapıcı yok →
Kare k = new Kare();                        // derleyici Kare() { } ekler //!`,
      quiz: {
        question: "Hangisi Circle sınıfı için geçerli bir YAPICI bildirimidir?",
        options: ["void Circle() { }", "public Circle Circle() { }", "public Circle(double r) { radius = r; }", "static Circle() { }"],
        answer: 2,
        explain: "Yapıcının dönüş tipi yoktur (void dahil) ve static olamaz. void Circle() derlenir ama yapıcı değil, sıradan bir metottur.",
      },
    },
  ],

  "reference-fields": [
    {
      id: "default-values",
      title: "Veri Alanlarının Varsayılan Değerleri",
      label: "Varsayılan değerler",
      def: "Bir veri alanına (field) değer atanmazsa varsayılan değer alır: referans türü → null, sayısal tür → 0 (double için 0.0), boolean → false, char → '\\u0000'. Bu kural YEREL değişkenler için geçerli DEĞİLDİR: Java metot içindeki yerel değişkene varsayılan değer atamaz; değer verilmeden kullanılırsa \"variable x might not have been initialized\" derleme hatası oluşur.",
      code: `class Student {
    String name;          // null
    int age;              // 0
    boolean isScienceMajor; // false
    char gender;          // '\\u0000'
}
public class Test {
    public static void main(String[] args) {
        Student student = new Student();
        System.out.println("name? " + student.name);            // null //!
        System.out.println("age? " + student.age);              // 0
        System.out.println("isScienceMajor? " + student.isScienceMajor); // false
        System.out.println("gender? " + student.gender);        // (boş karakter)

        int x;            // yerel değişken: varsayılan değer YOK
        String y;
        System.out.println("x is " + x);   // derleme hatası! //!
        System.out.println("y is " + y);   // derleme hatası!
    }
}`,
      quiz: {
        question: "Yukarıdaki main metodunun son iki satırı için hangisi doğrudur?",
        code: `int x;
String y;
System.out.println("x is " + x);
System.out.println("y is " + y);`,
        options: ["x is 0 / y is null yazar", "x is 0 / y is boş yazar", "Derleme hatası: değişkenler başlatılmamış", "NullPointerException fırlar"],
        answer: 2,
        explain: "Varsayılan değerler yalnızca veri alanları (sınıf/örnek değişkenleri) içindir. Yerel değişkenler kullanılmadan önce mutlaka değer almalıdır.",
      },
    },
  ],

  this: [
    {
      id: "this-constructor",
      title: "this(...) ile Aynı Sınıfın Yapıcısını Çağırma",
      label: "this(...) zinciri",
      def: "Bir yapıcı, aynı sınıftaki başka bir yapıcıyı this(argümanlar) ile çağırabilir. Böylece başlatma kodu tek yerde toplanır. Kural: this(...) çağrısı yapıcının İLK ifadesi olmalıdır; bu nedenle aynı yapıcıda hem this(...) hem super(...) bulunamaz. Ayrıca this, static bir değişkene erişirken değil, gizlenmiş (hidden) örnek değişkenine erişirken kullanılır; gizlenmiş static değişkene SınıfAdı.değişken ile erişilir.",
      code: `public class Circle {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;        // this: gizlenen alana erişim
    }

    public Circle() {
        this(1.0);                   // diğer yapıcıyı çağır — İLK satır olmalı //!
    }
}

class F {
    private int i = 5;
    private static double k = 0;

    void setI(int i) { this.i = i; }           // örnek alanı
    static void setK(double k) { F.k = k; }    // static alan: SınıfAdı.k //!
}`,
      traps: [
        { title: "this(...) ilk satırda değilse", text: "Yapıcıda this(...) çağrısından önce başka bir ifade yazmak derleme hatasıdır: call to this must be first statement in constructor." },
      ],
    },
    {
      id: "variable-scope",
      title: "Değişkenlerin Kapsamı",
      label: "Kapsam (scope)",
      def: "Örnek ve static değişkenlerin kapsamı TÜM sınıftır; sınıf içinde herhangi bir yerde bildirilebilirler (bildirim sırası önemli değildir, tek istisna: bir alan başka bir alana bağlı başlatılıyorsa önce o tanımlanmalıdır). Yerel değişkenin kapsamı bildirildiği yerden içinde bulunduğu bloğun sonuna kadardır ve kullanılmadan önce başlatılmalıdır. Bir yerel değişken bir sınıf değişkeniyle aynı ada sahipse metotta YEREL değişken önceliklidir; sınıf değişkeni gizlenir (hidden).",
      code: `public class F {
    private int x = 0;     // örnek değişkeni
    private int y = 0;

    public F() { }

    public void p() {
        int x = 1;                         // yerel x, alan x'i gizler //!
        System.out.println("x = " + x);    // x = 1
        System.out.println("y = " + y);    // y = 0
    }
}`,
      quiz: {
        question: "new F().p(); çağrısı konsola ne yazar?",
        code: `public class F {
    private int x = 0;
    private int y = 0;
    public void p() {
        int x = 1;
        System.out.println("x = " + x);
        System.out.println("y = " + y);
    }
}`,
        options: ["x = 0 / y = 0", "x = 1 / y = 0", "x = 1 / y = 1", "Derleme hatası: x iki kez bildirilmiş"],
        answer: 1,
        explain: "Metottaki yerel x, aynı adlı veri alanını gizler; bu yüzden x = 1 yazılır. y için yerel bir değişken olmadığından alanın değeri (0) okunur.",
      },
    },
  ],

  encapsulation: [
    {
      id: "accessor-mutator",
      title: "Getter/Setter Adlandırma (Accessor & Mutator)",
      label: "get / is / set",
      def: "private bir alanı okumak için get metodu (accessor/getter), değiştirmek için set metodu (mutator/setter) yazılır. Adlandırma kuralı: public returnType getPropertyName(), boolean alanlar için public boolean isPropertyName(), değiştirmek için public void setPropertyName(dataType propertyValue). Ders örneği CircleWithPrivateDataFields: radius ve numberOfObjects private yapılır; getRadius, setRadius ve getNumberOfObjects sağlanır. Alanların private olmasının iki nedeni: (1) veri bozulmaya karşı korunur, (2) sınıfın bakımı kolaylaşır.",
      code: `public class CircleWithPrivateDataFields {
    private double radius = 1;                  //!
    private static int numberOfObjects = 0;

    public CircleWithPrivateDataFields() { numberOfObjects++; }
    public CircleWithPrivateDataFields(double newRadius) {
        radius = newRadius;
        numberOfObjects++;
    }

    public double getRadius() { return radius; }                 // getter
    public void setRadius(double newRadius) {                    // setter //!
        radius = (newRadius >= 0) ? newRadius : 0;               // geçersiz veriye karşı koruma
    }
    public static int getNumberOfObjects() { return numberOfObjects; }
    public double getArea() { return radius * radius * Math.PI; }
}
// boolean alan için getter adı "is" ile başlar:
// private boolean filled;   public boolean isFilled() { return filled; }`,
    },
    {
      id: "immutable",
      title: "Değişmez (Immutable) Nesneler ve Sınıflar",
      label: "Immutable",
      def: "Oluşturulduktan sonra içeriği değiştirilemeyen nesneye değişmez nesne, sınıfına değişmez sınıf denir (String bunun en bilinen örneğidir). Bir sınıfın değişmez olması için: (1) tüm veri alanları private olmalı, (2) hiçbir mutator (set) metodu olmamalı, (3) değiştirilebilir bir alana REFERANS döndüren accessor metodu olmamalıdır. Yalnızca alanları private yapıp setter yazmamak yetmez: ders örneğinde Student değişmez görünür ama getBirthDate() BirthDate nesnesinin referansını döndürdüğü için öğrencinin doğum tarihi dışarıdan değiştirilebilir.",
      code: `public class Student {
    private int id;
    private BirthDate birthDate;               // değiştirilebilir (mutable) alan

    public Student(int ssn, int year, int month, int day) {
        id = ssn;
        birthDate = new BirthDate(year, month, day);
    }
    public int getId() { return id; }
    public BirthDate getBirthDate() {
        return birthDate;                      // referans dışarı sızıyor! //!
    }
}

public class BirthDate {
    private int year, month, day;
    public BirthDate(int newYear, int newMonth, int newDay) {
        year = newYear; month = newMonth; day = newDay;
    }
    public void setYear(int newYear) { year = newYear; }
}

public class Test {
    public static void main(String[] args) {
        Student student = new Student(111223333, 1970, 5, 3);
        BirthDate date = student.getBirthDate();
        date.setYear(2010);   // student'ın doğum yılı artık 2010! //!
    }
}`,
      quiz: {
        question: "Student sınıfının tüm alanları private ve setter'ı yok. Yine de neden değişmez (immutable) DEĞİLDİR?",
        options: [
          "id alanı final değil",
          "getBirthDate() değiştirilebilir BirthDate nesnesinin referansını döndürüyor",
          "Yapıcısı public",
          "Sınıf final olarak bildirilmemiş",
        ],
        answer: 1,
        explain: "Üçüncü kural ihlal ediliyor: değiştirilebilir bir alana referans döndüren accessor var. Çağıran, dönen referansla date.setYear(2010) yaparak nesnenin içini değiştirebilir. Çözüm: kopyasını döndürmek.",
      },
    },
  ],

  uml: [
    {
      id: "uml-object",
      title: "UML Nesne Diyagramı ve Notasyon Ayrıntıları",
      label: "Nesne diyagramı",
      def: "UML nesne diyagramında nesne, nesneAdı: SınıfAdı biçiminde altı çizili başlık ve alan = değer satırlarıyla gösterilir (ör. circle1: Circle / radius = 1.0). Sınıf diyagramında alan gösterimi alanAdı: alanTürü, yapıcı gösterimi SınıfAdı(parametreAdı: parametreTürü), metot gösterimi metotAdı(parametreAdı: parametreTürü): dönüşTürü biçimindedir. Görünürlük: + public, - private, # protected; static üyelerin ALTI ÇİZİLİR.",
      code: `// Sınıf diyagramı                    Nesne diyagramları
// ┌───────────────────────────┐      ┌──────────────────┐
// │ Circle                    │      │ circle1: Circle  │  ← altı çizili //!
// ├───────────────────────────┤      ├──────────────────┤
// │ -radius: double           │      │ radius = 1.0     │
// │ -numberOfObjects: int     │ ← static: altı çizili
// ├───────────────────────────┤      ┌──────────────────┐
// │ +Circle()                 │      │ circle2: Circle  │
// │ +Circle(newRadius: double)│      ├──────────────────┤
// │ +getArea(): double        │      │ radius = 25.0    │
// │ +getNumberOfObjects(): int│ ← static: altı çizili
// └───────────────────────────┘`,
    },
  ],

  static: [
    {
      id: "static-constants",
      title: "Sabitler: final static",
      label: "final static sabit",
      def: "Bir sınıftaki sabit, sınıfın tüm nesneleri tarafından paylaşıldığı için static, değişmeyeceği için final bildirilir: final static double PI = 3.14159265358979323846;. Sabit adları büyük harfle ve kelimeler alt çizgiyle yazılır (MAX_VALUE). Erişim SınıfAdı.SABIT biçimindedir: Math.PI, Integer.MAX_VALUE. final bir değişkene ikinci kez değer atamak derleme hatasıdır.",
      code: `public class Math {                       // java.lang.Math'in özeti
    public static final double PI = 3.14159265358979323846; //!
    public static final double E  = 2.7182818284590452354;
    private Math() { }                    // nesne oluşturulamaz
}

double area = radius * radius * Math.PI;  // SınıfAdı.SABİT
// Math.PI = 3;                           // derleme hatası: final //!`,
    },
    {
      id: "static-instance-access",
      title: "Static ve Örnek Üyeler Arası Erişim Kuralları",
      label: "static ↔ örnek erişimi",
      def: "Örnek metodu: örnek değişkenlerine, örnek metotlarına, static değişkenlere ve static metotlara DOĞRUDAN erişebilir. Static metot: yalnızca static değişkenlere ve static metotlara doğrudan erişebilir; örnek üyelere doğrudan erişemez çünkü hangi nesnenin üyesi olduğu belli değildir. Static metot örnek üyesine ancak bir nesne oluşturup nesne.uye biçiminde erişebilir.",
      code: `public class A {
    int i = 5;                 // örnek değişkeni
    static int k = 2;          // static değişken

    public static void main(String[] args) {
        int j = i;             // ✗ HATA: static bağlamdan örnek değişkeni //!
        m1();                  // ✗ HATA: static bağlamdan örnek metodu
        A a = new A();
        int j2 = a.i;          // ✓ nesne üzerinden
        a.m1();                // ✓
        m2();                  // ✓ static → static
    }
    public void m1() {
        i = i + k + m2(i, k);  // ✓ örnek metodu her şeye erişir //!
    }
    public static int m2(int i, int j) { return (int) Math.pow(i, j); }
    public static void m2() { }
}`,
      quiz: {
        code: `public class Foo {
    int i;
    static String s;

    void imethod() { }
    static void smethod() { }

    public static void main(String[] args) {
        Foo f = new Foo();
        System.out.println(f.i);
        System.out.println(s);
        f.imethod();
        smethod();
        System.out.println(i);
    }
}`,
        stages: [
          compileStage(false, "main static bir metottur; i ise örnek değişkenidir. Static bağlamdan örnek değişkenine nesne olmadan erişilemez.", 14),
          {
            step: "Teşhis",
            question: "② Teşhis: 14. satır nasıl düzeltilir?",
            options: ["System.out.println(Foo.i);", "System.out.println(f.i);", "System.out.println(this.i);", "i'yi private yapmak"],
            answer: 1,
            explain: "Örnek değişkenine nesne referansıyla erişilir. Foo.i yalnızca static alanlar için geçerlidir; static metotta this de kullanılamaz.",
          },
        ],
      },
    },
  ],

  visibility: [
    {
      id: "package-keyword",
      title: "Paketler (package) ve import",
      label: "package / import",
      def: "Paketler sınıfları düzenlemek ve ad çakışmalarını önlemek için kullanılır. Bir sınıfı pakete koymak için dosyanın İLK ifadesi (yorumlar ve boşluklar hariç) package paketAdi; olmalıdır. package ifadesi yazılmayan sınıflar varsayılan pakete (default package) yerleştirilir. Başka paketteki public bir sınıfı kullanmak için import paketAdi.SinifAdi; ya da import paketAdi.*; yazılır. java.lang paketi (String, Math, Object) otomatik içe aktarılır.",
      code: `package com.bp2.shapes;          // dosyanın ilk ifadesi //!

import java.util.Scanner;         // tek sınıf
import java.util.*;               // paketteki tüm sınıflar (alt paketler hariç)

public class Circle { }           // tam adı: com.bp2.shapes.Circle
// java.lang.* (String, Math, System...) import gerektirmez`,
    },
    {
      id: "private-in-class",
      title: "Sınıf İçinde private Üyeye Nesne Üzerinden Erişim",
      label: "Sınıf içinde private",
      def: "private, nesne düzeyinde değil SINIF düzeyinde bir kısıtlamadır. Bir sınıfın kendi metotları içinde, o sınıftan oluşturulan herhangi bir nesnenin private üyesine erişilebilir. Aynı erişim başka bir sınıfın içinden yapılırsa derleme hatası oluşur.",
      code: `public class C {
    private boolean x;
    public static void main(String[] args) {
        C c = new C();
        System.out.println(c.x);       // ✓ C'nin içindeyiz //!
        System.out.println(c.convert());
    }
    private int convert() { return x ? 1 : -1; }
}

public class Test {
    public static void main(String[] args) {
        C c = new C();
        System.out.println(c.x);       // ✗ derleme hatası: x has private access in C //!
        System.out.println(c.convert()); // ✗
    }
}`,
    },
    {
      id: "private-constructor",
      title: "private Yapıcı: Nesne Oluşturmayı Engellemek",
      label: "private yapıcı",
      def: "Yapıcı private yapılırsa sınıfın dışından new ile nesne oluşturulamaz. java.lang.Math bunun örneğidir: private Math() { } — tüm veri alanları ve metotları static olduğu için nesne oluşturmaya gerek yoktur. Aynı teknik Singleton deseninde tek örneği garanti etmek için de kullanılır.",
      code: `public final class Math {
    private Math() { }              // dışarıdan new Math() yapılamaz //!
    public static double sqrt(double a) { /* ... */ return 0; }
}
// Math m = new Math();             // derleme hatası: Math() has private access //!
double r = Math.sqrt(16);           // static üyeler sınıf adıyla kullanılır`,
    },
  ],

  "arrays-2d": [
    {
      id: "ragged-arrays",
      title: "Düzensiz (Ragged) Diziler",
      label: "Ragged dizi",
      def: "2B dizinin her satırı ayrı bir dizi olduğundan satırların uzunlukları farklı olabilir; buna düzensiz (ragged) dizi denir. Başlatıcıyla: int[][] triangleArray = {{1, 2, 3, 4, 5}, {2, 3, 4, 5}, {3, 4, 5}, {4, 5}, {5}}; Böylece triangleArray[0].length 5, triangleArray[4].length 1 olur. Satır uzunlukları önceden bilinmiyorsa önce yalnızca ilk boyut verilir: new int[5][]; sonra her satır ayrı oluşturulur. Satır oluşturulmadan triangleArray[0][3] = 50; yazmak NullPointerException verir.",
      code: `int[][] triangleArray = {
    {1, 2, 3, 4, 5},
    {2, 3, 4, 5},
    {3, 4, 5},
    {4, 5},
    {5}
};
System.out.println(triangleArray[0].length);   // 5
System.out.println(triangleArray[4].length);   // 1 //!

int[][] tri = new int[5][];         // satırlar henüz null //!
tri[0] = new int[5];
tri[1] = new int[4];
tri[2] = new int[3];
tri[3] = new int[2];
tri[4] = new int[1];
tri[0][3] = 50;
tri[4][0] = 45;`,
      quiz: {
        question: "int[][] m = {{1, 2}, {3, 4, 5}, {6}}; için m.length + m[1].length kaçtır?",
        options: ["5", "6", "3", "Derleme hatası: satır uzunlukları eşit olmalı"],
        answer: 1,
        explain: "m.length satır sayısıdır (3). m[1] = {3, 4, 5} olduğundan m[1].length 3'tür. Toplam 6. Satır uzunluklarının farklı olması serbesttir (ragged dizi).",
      },
    },
    {
      id: "array2d-processing",
      title: "2B Dizi İşleme Kalıpları",
      label: "İşleme kalıpları",
      def: "Sınavda en çok istenen döngü kalıpları: (1) girdiyle doldurma, (2) rastgele değerlerle doldurma, (3) yazdırma, (4) tüm elemanları toplama, (5) SÜTUN bazında toplama (dış döngü sütun üzerinde döner), (6) toplamı en büyük SATIRI bulma, (7) rastgele karıştırma (her eleman rastgele seçilen bir elemanla yer değiştirir). Satır döngüsü matrix.length, sütun döngüsü matrix[row].length ile sınırlanır.",
      code: `// (1) Girdiyle doldurma
Scanner input = new Scanner(System.in);
System.out.println("Enter " + matrix.length + " rows and " + matrix[0].length + " columns: ");
for (int row = 0; row < matrix.length; row++)
    for (int column = 0; column < matrix[row].length; column++)
        matrix[row][column] = input.nextInt();

// (2) Rastgele değerler (0–99)
for (int row = 0; row < matrix.length; row++)
    for (int column = 0; column < matrix[row].length; column++)
        matrix[row][column] = (int) (Math.random() * 100);

// (4) Tüm elemanların toplamı
int total = 0;
for (int row = 0; row < matrix.length; row++)
    for (int column = 0; column < matrix[row].length; column++)
        total += matrix[row][column];

// (5) Sütun toplamları: dış döngü SÜTUN //!
for (int column = 0; column < matrix[0].length; column++) {
    int sum = 0;
    for (int row = 0; row < matrix.length; row++)
        sum += matrix[row][column];
    System.out.println("Sum for column " + column + " is " + sum);
}

// (6) Toplamı en büyük satır
int maxRow = 0, indexOfMaxRow = 0;
for (int column = 0; column < matrix[0].length; column++)
    maxRow += matrix[0][column];
for (int row = 1; row < matrix.length; row++) {
    int totalOfThisRow = 0;
    for (int column = 0; column < matrix[row].length; column++)
        totalOfThisRow += matrix[row][column];
    if (totalOfThisRow > maxRow) {
        maxRow = totalOfThisRow;
        indexOfMaxRow = row;
    }
}
System.out.println("Row " + indexOfMaxRow + " has the maximum sum of " + maxRow);

// (7) Rastgele karıştırma //!
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        int i1 = (int) (Math.random() * matrix.length);
        int j1 = (int) (Math.random() * matrix[i].length);
        int temp = matrix[i][j];
        matrix[i][j] = matrix[i1][j1];
        matrix[i1][j1] = temp;
    }
}`,
    },
    {
      id: "array2d-methods",
      title: "2B Diziyi Metoda Geçirme ve Döndürme",
      label: "Metoda geçirme",
      def: "2B dizi de bir referanstır; metoda geçirildiğinde dizinin referansı kopyalanır. Metot 2B dizi de döndürebilir: dönüş türü int[][] yazılır. Ders örneği PassTwoDimensionalArray: getArray() kullanıcıdan 3×4 bir matris okuyup döndürür, sum(int[][] m) tüm elemanları toplar.",
      code: `import java.util.Scanner;

public class PassTwoDimensionalArray {
    public static void main(String[] args) {
        int[][] m = getArray();                      // 2B dizi döndüren metot //!
        System.out.println("\\nSum of all elements is " + sum(m));
    }

    public static int[][] getArray() {
        Scanner input = new Scanner(System.in);
        int[][] m = new int[3][4];
        System.out.println("Enter " + m.length + " rows and " + m[0].length + " columns: ");
        for (int i = 0; i < m.length; i++)
            for (int j = 0; j < m[i].length; j++)
                m[i][j] = input.nextInt();
        return m;
    }

    public static int sum(int[][] m) {               // 2B dizi parametresi //!
        int total = 0;
        for (int row = 0; row < m.length; row++)
            for (int column = 0; column < m[row].length; column++)
                total += m[row][column];
        return total;
    }
}`,
    },
    {
      id: "grade-exam",
      title: "Problem: Çoktan Seçmeli Sınavı Notlama (GradeExam)",
      label: "GradeExam",
      def: "8 öğrencinin 10 soruluk çoktan seçmeli sınav cevapları char[][] answers dizisinde (satır = öğrenci, sütun = soru), doğru cevap anahtarı char[] keys dizisindedir. Program her öğrencinin cevaplarını anahtarla karşılaştırıp doğru sayısını yazdırır. Çözüm: dış döngü öğrenciler (satırlar), iç döngü sorular (sütunlar); answers[i][j] == keys[j] ise sayaç artar.",
      code: `public class GradeExam {
    public static void main(String[] args) {
        char[][] answers = {                         // öğrenci × soru
            {'A', 'B', 'A', 'C', 'C', 'D', 'E', 'E', 'A', 'D'},
            {'D', 'B', 'A', 'B', 'C', 'A', 'E', 'E', 'A', 'D'},
            {'E', 'D', 'D', 'A', 'C', 'B', 'E', 'E', 'A', 'D'},
            {'C', 'B', 'A', 'E', 'D', 'C', 'E', 'E', 'A', 'D'},
            {'A', 'B', 'D', 'C', 'C', 'D', 'E', 'E', 'A', 'D'},
            {'B', 'B', 'E', 'C', 'C', 'D', 'E', 'E', 'A', 'D'},
            {'B', 'B', 'A', 'C', 'C', 'D', 'E', 'E', 'A', 'D'},
            {'E', 'B', 'E', 'C', 'C', 'D', 'E', 'E', 'A', 'D'}};

        char[] keys = {'D', 'B', 'D', 'C', 'C', 'D', 'A', 'E', 'A', 'D'}; //!

        for (int i = 0; i < answers.length; i++) {
            int correctCount = 0;
            for (int j = 0; j < answers[i].length; j++) {
                if (answers[i][j] == keys[j])        // j. sorunun anahtarı //!
                    correctCount++;
            }
            System.out.println("Student " + i + "'s correct count is " + correctCount);
        }
    }
}
// Student 0's correct count is 7
// Student 1's correct count is 6 ...`,
    },
    {
      id: "nearest-points",
      title: "Problem: En Yakın İki Noktayı Bulma (FindNearestPoints)",
      label: "En yakın nokta",
      def: "Noktalar double[][] points = new double[n][2] dizisinde tutulur: points[i][0] x, points[i][1] y koordinatıdır. Kaba kuvvet (brute force) çözüm: her nokta çifti (i < j) için uzaklık hesaplanır ve en küçüğü saklanır. Uzaklık formülü: √((x2 − x1)² + (y2 − y1)²). İç döngü j = i + 1'den başlar; böylece her çift bir kez karşılaştırılır.",
      code: `import java.util.Scanner;

public class FindNearestPoints {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.print("Enter the number of points: ");
        int numberOfPoints = input.nextInt();

        double[][] points = new double[numberOfPoints][2];   // [i][0]=x, [i][1]=y //!
        System.out.print("Enter " + numberOfPoints + " points: ");
        for (int i = 0; i < points.length; i++) {
            points[i][0] = input.nextDouble();
            points[i][1] = input.nextDouble();
        }

        int p1 = 0, p2 = 1;                                  // ilk çift aday
        double shortestDistance = distance(points[p1][0], points[p1][1],
                                           points[p2][0], points[p2][1]);
        for (int i = 0; i < points.length; i++) {
            for (int j = i + 1; j < points.length; j++) {    // her çift bir kez //!
                double distance = distance(points[i][0], points[i][1],
                                           points[j][0], points[j][1]);
                if (shortestDistance > distance) {
                    p1 = i;
                    p2 = j;
                    shortestDistance = distance;
                }
            }
        }
        System.out.println("The closest two points are " +
            "(" + points[p1][0] + ", " + points[p1][1] + ") and (" +
            points[p2][0] + ", " + points[p2][1] + ")");
    }

    public static double distance(double x1, double y1, double x2, double y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
}`,
    },
    {
      id: "sudoku",
      title: "Problem: Sudoku Çözümünü Kontrol Etme (CheckSudokuSolution)",
      label: "Sudoku",
      def: "9×9 ızgara int[][] grid dizisinde tutulur. Çözüm geçerliyse her SATIR, her SÜTUN ve her 3×3 KUTU 1–9 arası rakamları birer kez içerir. isValid(i, j, grid) metodu grid[i][j]'yi aynı satır, aynı sütun ve aynı kutudaki diğer hücrelerle karşılaştırır. (i, j) hücresinin bulunduğu kutunun sol üst köşesi (i / 3 * 3, j / 3 * 3) formülüyle bulunur (tam sayı bölmesi).",
      code: `public static boolean isValid(int[][] grid) {
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++)
            if (grid[i][j] < 1 || grid[i][j] > 9 || !isValid(i, j, grid))
                return false;
    return true;                                   // tüm hücreler geçerli
}

public static boolean isValid(int i, int j, int[][] grid) {
    // i. satırda grid[i][j] tekrar ediyor mu?
    for (int column = 0; column < 9; column++)
        if (column != j && grid[i][column] == grid[i][j])
            return false;

    // j. sütunda grid[i][j] tekrar ediyor mu?
    for (int row = 0; row < 9; row++)
        if (row != i && grid[row][j] == grid[i][j])
            return false;

    // 3×3 kutuda grid[i][j] tekrar ediyor mu?
    for (int row = (i / 3) * 3; row < (i / 3) * 3 + 3; row++) //!
        for (int col = (j / 3) * 3; col < (j / 3) * 3 + 3; col++)
            if (row != i && col != j && grid[row][col] == grid[i][j])
                return false;

    return true;
}

public static int[][] readASolution() {            // kullanıcıdan 81 sayı
    Scanner input = new Scanner(System.in);
    System.out.println("Enter a Sudoku puzzle solution:");
    int[][] grid = new int[9][9];
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++)
            grid[i][j] = input.nextInt();
    return grid;
}`,
      quiz: {
        question: "grid[7][4] hücresinin bulunduğu 3×3 kutunun sol üst köşesi hangisidir?",
        options: ["(6, 3)", "(7, 4)", "(6, 4)", "(3, 6)"],
        answer: 0,
        explain: "Satır: 7 / 3 * 3 = 2 * 3 = 6. Sütun: 4 / 3 * 3 = 1 * 3 = 3. Tam sayı bölmesi küsuratı attığı için kutunun başlangıcı (6, 3) olur.",
      },
    },
    {
      id: "arrays-3d",
      title: "Çok Boyutlu (3B) Diziler: TotalScore",
      label: "3B dizi",
      def: "n boyutlu dizi, elemanları (n−1) boyutlu dizi olan dizidir. double[][][] scores = new double[6][5][2]; → 6 öğrenci × 5 sınav × 2 bölüm (çoktan seçmeli ve klasik). scores[i][j][k]: i. öğrencinin j. sınavının k. bölümü. scores.length 6, scores[0].length 5, scores[0][0].length 2'dir. Ders örneği TotalScore her öğrencinin tüm puanlarının toplamını hesaplar.",
      code: `public class TotalScore {
    public static void main(String[] args) {
        double[][][] scores = {                     // [öğrenci][sınav][bölüm] //!
            {{7.5, 20.5}, {9.0, 22.5}, {15, 33.5}, {13, 21.5}, {15, 2.5}},
            {{4.5, 21.5}, {9.0, 22.5}, {15, 34.5}, {12, 20.5}, {14, 9.5}},
            {{6.5, 30.5}, {9.4, 10.5}, {11, 33.5}, {11, 23.5}, {10, 2.5}},
            {{6.5, 23.5}, {9.4, 32.5}, {13, 34.5}, {11, 20.5}, {16, 7.5}},
            {{8.5, 26.5}, {9.4, 52.5}, {13, 36.5}, {13, 24.5}, {16, 2.5}},
            {{9.5, 20.5}, {9.4, 42.5}, {13, 31.5}, {12, 20.5}, {16, 6.5}}};

        for (int i = 0; i < scores.length; i++) {
            double totalScore = 0;
            for (int j = 0; j < scores[i].length; j++)
                for (int k = 0; k < scores[i][j].length; k++)
                    totalScore += scores[i][j][k];          // üç iç içe döngü //!
            System.out.println("Student " + i + "'s score is " + totalScore);
        }
    }
}`,
      quiz: {
        question: "double[][][] scores = new double[6][5][2]; için scores[0].length ve scores[0][0].length nedir?",
        options: ["6 ve 5", "5 ve 2", "2 ve 5", "60 ve 2"],
        answer: 1,
        explain: "scores[0] ilk öğrencinin 5 sınavlık dizisidir (5). scores[0][0] o sınavın 2 bölümlük dizisidir (2).",
      },
    },
    {
      id: "weather-birthday",
      title: "Problemler: Günlük Hava Durumu ve Doğum Günü Tahmini",
      label: "Weather / Birthday",
      def: "Weather: 10 günün her saati için sıcaklık ve nem double[][][] data = new double[10][24][2] dizisinde tutulur; data[gün][saat][0] sıcaklık, [1] nemdir. Dosyadan (Weather.txt) okunan her satır gün, saat, sıcaklık, nem içerir; program günlük ortalama sıcaklık ve nemi hesaplar. GuessBirthdayUsingArray: int[][][] dates = new int[5][4][4] beş adet 4×4 sayı tablosunu tutar; kullanıcı her tabloda gününü görüp görmediğini söyler, cevap evetse o tablonun ilk sayısı (dates[i][0][0]) toplama eklenir ve toplam doğum günü olur.",
      code: `// Weather: [gün][saat][sıcaklık/nem]
final int NUMBER_OF_DAYS = 10, NUMBER_OF_HOURS = 24;
double[][][] data = new double[NUMBER_OF_DAYS][NUMBER_OF_HOURS][2]; //!
Scanner input = new Scanner(new File("Weather.txt"));
for (int k = 0; k < NUMBER_OF_DAYS * NUMBER_OF_HOURS; k++) {
    int day = input.nextInt();
    int hour = input.nextInt();
    double temperature = input.nextDouble();
    double humidity = input.nextDouble();
    data[day - 1][hour - 1][0] = temperature;    // dosyada 1'den başlar
    data[day - 1][hour - 1][1] = humidity;
}
for (int i = 0; i < NUMBER_OF_DAYS; i++) {
    double dailyTemperatureTotal = 0, dailyHumidityTotal = 0;
    for (int j = 0; j < NUMBER_OF_HOURS; j++) {
        dailyTemperatureTotal += data[i][j][0];
        dailyHumidityTotal += data[i][j][1];
    }
    System.out.println("Day " + i + "'s average temperature is "
        + dailyTemperatureTotal / NUMBER_OF_HOURS);
    System.out.println("Day " + i + "'s average humidity is "
        + dailyHumidityTotal / NUMBER_OF_HOURS);
}

// GuessBirthdayUsingArray
int[][][] dates = {
    {{ 1,  3,  5,  7}, { 9, 11, 13, 15}, {17, 19, 21, 23}, {25, 27, 29, 31}},
    {{ 2,  3,  6,  7}, {10, 11, 14, 15}, {18, 19, 22, 23}, {26, 27, 30, 31}},
    {{ 4,  5,  6,  7}, {12, 13, 14, 15}, {20, 21, 22, 23}, {28, 29, 30, 31}},
    {{ 8,  9, 10, 11}, {12, 13, 14, 15}, {24, 25, 26, 27}, {28, 29, 30, 31}},
    {{16, 17, 18, 19}, {20, 21, 22, 23}, {24, 25, 26, 27}, {28, 29, 30, 31}}};
int day = 0;
for (int i = 0; i < 5; i++) {
    System.out.println("Is your birthday in Set" + (i + 1) + "?");
    for (int j = 0; j < 4; j++) {
        for (int k = 0; k < 4; k++)
            System.out.printf("%4d", dates[i][j][k]);
        System.out.println();
    }
    System.out.print("\\nEnter 0 for No and 1 for Yes: ");
    int answer = input.nextInt();
    if (answer == 1) day += dates[i][0][0];       // 1, 2, 4, 8, 16 //!
}
System.out.println("Your birthday is " + day);`,
    },
  ],

  arraylist: [
    {
      id: "array-vs-arraylist",
      title: "Dizi ve ArrayList Karşılaştırması",
      label: "Dizi vs ArrayList",
      def: "Aynı işlemin dizi ve ArrayList karşılıkları sınavda boşluk doldurma olarak sık sorulur. Dizi: boyutu sabit, ilkel türleri de saklar, uzunluk .length alanıdır. ArrayList: boyutu dinamik, yalnızca nesne saklar, eleman sayısı size() metodudur; araya ekleme ve silme kendiliğinden kaydırma yapar.",
      code: `// İşlem                Dizi                          ArrayList
// Oluşturma            String[] a = new String[10];  ArrayList<String> list = new ArrayList<>(); //!
// Elemana erişim       a[index]                      list.get(index)
// Eleman güncelleme    a[index] = "London";          list.set(index, "London");
// Boyut                a.length                      list.size() //!
// Eleman ekleme        —                             list.add("London");
// Araya ekleme         —                             list.add(index, "London");
// Eleman silme         —                             list.remove(index);
// Nesneyi silme        —                             list.remove(Object);
// Hepsini silme        —                             list.clear();`,
    },
    {
      id: "arraylist-utils",
      title: "Listeler için Yararlı Metotlar (Arrays, Collections)",
      label: "Collections / asList",
      def: "Diziden liste: new ArrayList<>(Arrays.asList(dizi)). Listeden dizi: list.toArray(dizi). java.util.Collections sınıfının static metotları: Collections.sort(list) sıralar, Collections.max(list) ve Collections.min(list) en büyük/küçük elemanı, Collections.shuffle(list) rastgele karıştırır. Ders örneği DistinctNumbers: girilen sayılardan yalnızca TEKRARSIZ olanları listede tutar (contains ile kontrol).",
      code: `String[] array = {"red", "green", "blue"};
ArrayList<String> list = new ArrayList<>(Arrays.asList(array)); // dizi → liste //!

String[] array1 = new String[list.size()];
list.toArray(array1);                                            // liste → dizi

Integer[] numbers = {3, 5, 95, 4, 15, 34, 3, 6, 5};
ArrayList<Integer> nums = new ArrayList<>(Arrays.asList(numbers));
java.util.Collections.sort(nums);                                // sırala //!
System.out.println(java.util.Collections.max(nums));             // 95
System.out.println(java.util.Collections.min(nums));             // 3
java.util.Collections.shuffle(nums);                             // karıştır

// DistinctNumbers: 0 girilene kadar oku, tekrarsızları sakla
ArrayList<Integer> distinct = new ArrayList<>();
Scanner input = new Scanner(System.in);
int value;
do {
    value = input.nextInt();
    if (!distinct.contains(value) && value != 0)                 //!
        distinct.add(value);
} while (value != 0);
for (int i = 0; i < distinct.size(); i++)
    System.out.print(distinct.get(i) + " ");`,
    },
    {
      id: "my-stack",
      title: "Örnek: ArrayList ile Yığın Sınıfı (MyStack)",
      label: "MyStack",
      def: "Yığın (stack) son giren ilk çıkar (LIFO) mantığıyla çalışır. MyStack, elemanları private bir ArrayList<Object> alanında tutar (kompozisyon / has-a). Metotlar: isEmpty(), getSize(), peek() en üsttekini silmeden döndürür, pop() en üsttekini siler ve döndürür, push(o) en üste ekler, search(o) elemanın konumunu döndürür. Liste sonu yığının tepesidir.",
      code: `import java.util.ArrayList;

public class MyStack {
    private ArrayList<Object> list = new ArrayList<>();   // has-a ilişkisi //!

    public boolean isEmpty() { return list.isEmpty(); }
    public int getSize() { return list.size(); }

    public Object peek() {
        return list.get(getSize() - 1);                   // tepe = son eleman
    }
    public Object pop() {
        Object o = list.get(getSize() - 1);
        list.remove(getSize() - 1);                       //!
        return o;
    }
    public void push(Object o) { list.add(o); }
    public int search(Object o) { return list.lastIndexOf(o); }

    @Override
    public String toString() { return "stack: " + list.toString(); }
}`,
    },
  ],

  /* ===================== ADVANCED OOP · Kalıtım ve Çok Biçimlilik ===================== */
  inheritance: [
    {
      id: "inheritance-notes",
      title: "Kalıtım Hakkında Önemli Notlar",
      label: "Kalıtım notları",
      def: "(1) Alt sınıf, süper sınıfının bir alt kümesi DEĞİLDİR; genellikle süper sınıftan DAHA FAZLA bilgi ve metot içerir. (2) Süper sınıfın private veri alanlarına alt sınıftan doğrudan erişilemez; ancak public getter/setter ile erişilir. (3) Her \"is-a\" ilişkisi kalıtımla modellenmemelidir: kare bir dikdörtgendir ama Square'in Rectangle'ı genişletmesi uygun değildir, çünkü width ve height Square için anlamlı değildir. Kalıtım yalnızca alt sınıf süper sınıfın davranışını gerçekten genişlettiğinde kullanılmalıdır. (4) Java'da bir sınıf yalnızca TEK bir sınıfı genişletebilir (single inheritance); çoklu kalıtım ihtiyacı arayüzlerle karşılanır. Kalıtım extends anahtar kelimesiyle bildirilir.",
      code: `public class Circle extends GeometricObject { //!
    private double radius;

    public Circle(double radius, String color, boolean filled) {
        this.radius = radius;
        // this.color = color;    ✗ color, GeometricObject'te private! //!
        setColor(color);          // ✓ public setter üzerinden
        setFilled(filled);
    }
}
// class C extends A, B { }      ✗ Java'da çoklu sınıf kalıtımı yok
// class C extends A implements I1, I2 { }   ✓ arayüzlerle`,
    },
    {
      id: "final-keyword",
      title: "final: Kalıtımı ve Ezmeyi Engellemek",
      label: "final",
      def: "final sınıf GENİŞLETİLEMEZ (alt sınıfı olamaz): Math, String, StringBuilder ve sarmalayıcı sınıflar final'dır. final metot alt sınıflarda EZİLEMEZ (override edilemez). final değişken bir sabittir; bir kez değer alır. Belirleyiciler sınıflara ve üyelere uygulanır; final ise aynı zamanda yerel değişkenlere de uygulanabilen TEK belirleyicidir. Yerel final değişken metotta sabit gibi davranır.",
      code: `public final class C {           // genişletilemez //!
    // ...
}
// class D extends C { }           ✗ cannot inherit from final C

public class Test {
    public final void m() {        // ezilemez //!
        final int SIZE = 3;        // yerel sabit (tek izinli belirleyici)
        // SIZE = 4;               ✗ final değişkene atama yapılamaz
    }
}
// class Test2 extends Test { public void m() { } }  ✗ m() is final`,
      quiz: {
        question: "Hangisi derleme hatası VERMEZ?",
        options: [
          "class MyString extends String { }",
          "final int x = 5; x++;",
          "public final void m() { } metodunu alt sınıfta ezmek",
          "Bir metodun içinde final double RATE = 0.18; bildirmek",
        ],
        answer: 3,
        explain: "String final bir sınıftır, final değişken değiştirilemez, final metot ezilemez. Yerel değişkene final yazmak ise geçerlidir ve bir sabit tanımlar.",
      },
    },
  ],

  "super-sub": [
    {
      id: "protected",
      title: "protected Veri ve Metotlar",
      label: "protected",
      def: "protected üyeye aynı paketteki tüm sınıflardan VE başka paketteki ALT SINIFLARDAN erişilebilir. Görünürlük sırası (artan): private → varsayılan (belirleyicisiz) → protected → public. Alt sınıf, süper sınıfın protected metodunu ezip public yapabilir (erişimi genişletebilir) ama süper sınıftaki public bir metodu ezip protected/private yapamaz (erişimi daraltamaz). UML'de protected # ile gösterilir.",
      code: `package p1;
public class C1 {
    public int x;
    protected int y;                    //!
    int z;
    private int u;
    protected void m() { }
}

package p1;
public class C2 {                       // aynı paket, alt sınıf DEĞİL
    C1 o = new C1();                    // o.x ✓  o.y ✓  o.z ✓  o.u ✗  o.m() ✓
}

package p1;
public class C3 extends C1 {            // aynı paket, alt sınıf
    // x ✓  y ✓  z ✓  u ✗  m() ✓
}

package p2;
public class C4 extends C1 {            // FARKLI paket, alt sınıf //!
    // x ✓  y ✓  z ✗  u ✗  m() ✓
}

package p2;
public class C5 {                       // farklı paket, alt sınıf değil
    C1 o = new C1();                    // o.x ✓  o.y ✗  o.z ✗  o.u ✗  o.m() ✗
}`,
    },
    {
      id: "access-summary",
      title: "Erişim Belirleyicileri Özet Tablosu",
      label: "Erişim tablosu",
      def: "Sınavın en klasik boşluk doldurma tablosu. Sütunlar: aynı sınıf, aynı paket, alt sınıf (farklı paket), farklı paket. public dördünden de erişilir; protected farklı paketteki alt sınıf olmayan sınıflara kapalıdır; varsayılan (belirleyicisiz) yalnızca aynı paket; private yalnızca aynı sınıf.",
      code: `// Belirleyici   Aynı sınıf   Aynı paket   Alt sınıf (diğer paket)   Diğer paket
// public            ✓            ✓                 ✓                       ✓
// protected         ✓            ✓                 ✓                       ✗ //!
// (varsayılan)      ✓            ✓                 ✗                       ✗
// private           ✓            ✗                 ✗                       ✗ //!
//
// UML:  + public   # protected   ~ paket   - private
// Override ederken erişim GENİŞLETİLEBİLİR, daraltılamaz:
//   protected void m()  →  alt sınıfta public void m()   ✓
//   public void m()     →  alt sınıfta protected void m() ✗`,
      quiz: {
        question: "Farklı bir paketteki, alt sınıf OLMAYAN bir sınıftan hangi üyeye erişilebilir?",
        options: ["protected int y", "int z (varsayılan)", "public int x", "private int u"],
        answer: 2,
        explain: "Farklı paket + alt sınıf değil → yalnızca public. protected erişim farklı pakette yalnızca alt sınıflara açıktır.",
      },
    },
  ],

  super: [
    {
      id: "constructor-chaining",
      title: "Yapıcı Zincirleme (Faculty → Employee → Person)",
      label: "Yapıcı zinciri",
      def: "Bir nesne oluşturulurken yapıcı, kendi gövdesini çalıştırmadan önce süper sınıfının yapıcısını çağırır (açıkça super(...) yazılmadıysa derleyici super() ekler). Bu çağrı kalıtım zincirindeki EN ÜST sınıfa kadar sürer. Bu yüzden gövdeler yukarıdan aşağıya (Object → ... → oluşturulan sınıf) sırayla çalışır. Buna yapıcı zincirlemesi (constructor chaining) denir. this(...) çağrısı da önce aynı sınıftaki diğer yapıcıya gider, zincir oradan devam eder.",
      code: `public class Faculty extends Employee {
    public static void main(String[] args) {
        new Faculty();
    }
    public Faculty() {
        // derleyici: super();
        System.out.println("(4) Performs Faculty's tasks");
    }
}
class Employee extends Person {
    public Employee() {
        this("(2) Invoke Employee's overloaded constructor"); //!
        System.out.println("(3) Performs Employee's tasks ");
    }
    public Employee(String s) {
        // derleyici: super();
        System.out.println(s);
    }
}
class Person {
    public Person() {
        System.out.println("(1) Performs Person's tasks"); //!
    }
}
// Çıktı:
// (1) Performs Person's tasks
// (2) Invoke Employee's overloaded constructor
// (3) Performs Employee's tasks
// (4) Performs Faculty's tasks`,
      quiz: {
        question: "new Faculty(); çalıştırılınca İLK yazdırılan satır hangisidir?",
        code: `public class Faculty extends Employee {
    public Faculty() { System.out.println("(4) Faculty"); }
}
class Employee extends Person {
    public Employee() { this("(2) Employee(String)"); System.out.println("(3) Employee()"); }
    public Employee(String s) { System.out.println(s); }
}
class Person {
    public Person() { System.out.println("(1) Person"); }
}`,
        options: ["(4) Faculty", "(3) Employee()", "(2) Employee(String)", "(1) Person"],
        answer: 3,
        explain: "Faculty() → gizli super() → Employee() → this(...) → Employee(String) → gizli super() → Person(). İlk biten gövde Person'ınkidir; sıra 1, 2, 3, 4 olur.",
      },
    },
    {
      id: "no-arg-trap",
      title: "Örtük super() Hatası: Apple / Fruit",
      label: "Apple/Fruit hatası",
      def: "Sınıfta hiç yapıcı yoksa derleyici parametresiz varsayılan yapıcı ekler ve bu yapıcı super() çağırır. Süper sınıfta yalnızca parametreli yapıcı varsa süper sınıfın parametresiz yapıcısı YOKTUR ve alt sınıf derlenemez. Bu yüzden ders, mümkünse her sınıfa bir no-arg yapıcı eklenmesini önerir: genişletilebilecek sınıflarda bu hata önlenir.",
      code: `public class Apple extends Fruit {
    // derleyici ekler:  public Apple() { super(); } //!
}

class Fruit {
    public Fruit(String name) {             // yalnızca parametreli yapıcı
        System.out.println("Fruit's constructor is invoked");
    }
    // Fruit() YOK → Apple'daki super() bulunamaz → derleme hatası //!
}`,
      quiz: {
        code: `public class Apple extends Fruit {
}

class Fruit {
    public Fruit(String name) {
        System.out.println("Fruit's constructor is invoked");
    }
}`,
        stages: [
          compileStage(false, "Apple'a eklenen varsayılan yapıcı super() çağırır; Fruit'te parametresiz yapıcı olmadığı için hata Apple sınıfında oluşur.", 1),
          {
            step: "Teşhis",
            question: "② Teşhis: En temiz düzeltme hangisi?",
            options: [
              "Fruit sınıfına public Fruit() { } eklemek",
              "Apple'ı abstract yapmak",
              "Fruit'in yapıcısını private yapmak",
              "Apple'a main metodu eklemek",
            ],
            answer: 0,
            explain: "Süper sınıfa parametresiz yapıcı eklemek (ya da Apple'a super(\"Apple\") çağıran bir yapıcı yazmak) hatayı giderir.",
          },
        ],
      },
    },
    {
      id: "super-method",
      title: "super ile Süper Sınıf Metodunu Çağırma",
      label: "super.metot()",
      def: "super.metot(argümanlar) süper sınıftaki metodu çağırır; özellikle alt sınıfta ezilmiş bir metodun üst sürümüne ulaşmak için kullanılır. super yalnızca BİR üst seviyeye çıkar: super.super.metot() yazılamaz. Ezilmemiş miras metotlar super olmadan da çağrılabilir; super yazmak burada isteğe bağlıdır.",
      code: `public class Circle extends GeometricObject {
    private double radius;

    public void printCircle() {
        System.out.println("The circle is created " +
            super.getDateCreated() +             // getDateCreated() da yeterli //!
            " and the radius is " + radius);
    }

    @Override
    public String toString() {
        return super.toString() + "\\nradius is " + radius; // ezilen üst sürüm //!
    }
}
// super.super.toString();   ✗ geçersiz sözdizimi`,
    },
  ],

  overriding: [
    {
      id: "override-vs-overload",
      title: "Ezme (Overriding) ve Aşırı Yükleme (Overloading) Farkı",
      label: "Override vs Overload",
      def: "Overriding: alt sınıfta AYNI imza ve aynı dönüş türüyle yeni uygulama; sınıflar kalıtımla ilişkilidir ve seçim çalışma zamanında yapılır. Overloading: aynı ad, FARKLI parametre listesi; aynı sınıfta ya da kalıtımla ilişkili sınıflarda olabilir ve seçim derleme zamanında yapılır. Ders örneğinde B'de p(double), A'da p(double) varsa ezme; A'da p(int) varsa aşırı yükleme olur ve çıktılar değişir.",
      code: `// SOL: Overriding                              // SAĞ: Overloading
public class Test {                               public class Test {
    public static void main(String[] args) {          public static void main(String[] args) {
        A a = new A();                                    A a = new A();
        a.p(10);                                          a.p(10);
        a.p(10.0);                                        a.p(10.0);
    }                                                 }
}                                                 }
class B {                                         class B {
    public void p(double i) {                         public void p(double i) {
        System.out.println(i * 2);                        System.out.println(i * 2);
    }                                                 }
}                                                 }
class A extends B {                               class A extends B {
    public void p(double i) {  // EZER //!            public void p(int i) {   // AŞIRI YÜKLER //!
        System.out.println(i);                            System.out.println(i);
    }                                                 }
}                                                 }
// Çıktı: 10.0  10.0                              // Çıktı: 10  20.0`,
      quiz: {
        question: "Sağdaki (overloading) programın çıktısı nedir?",
        code: `class B {
    public void p(double i) { System.out.println(i * 2); }
}
class A extends B {
    public void p(int i) { System.out.println(i); }
}
A a = new A();
a.p(10);
a.p(10.0);`,
        options: ["10 / 10.0", "10.0 / 10.0", "10 / 20.0", "20.0 / 20.0"],
        answer: 2,
        explain: "A'da p(int) ve miras alınan p(double) birlikte bulunur. a.p(10) → p(int) → 10. a.p(10.0) → p(double) (B'deki) → 20.0.",
      },
    },
    {
      id: "override-rules",
      title: "Ezme Kuralları: private, static ve @Override",
      label: "Override kuralları",
      def: "(1) Bir örnek metodu ancak ERİŞİLEBİLİRSE ezilebilir; private metot sınıf dışında erişilemediği için ezilemez; alt sınıfta aynı imzalı metot yazılırsa ikisi tamamen ilişkisizdir. (2) Static metot miras alınabilir ama EZİLEMEZ; alt sınıfta aynı imzayla yazılırsa üstteki GİZLENİR (hidden) ve SüperSınıfAdı.staticMetot() ile çağrılabilir. (3) @Override açıklaması (annotation) metodun ezme amaçlı olduğunu belirtir; imza uyuşmazsa derleyici hata verir. (4) Dönüş tipi aynı (ya da alt tür) olmalı, erişim daraltılamaz.",
      code: `class A {
    private void secret() { }        // ezilemez
    public static void info() { System.out.println("A"); }
    public String toString() { return "A"; }
}
class B extends A {
    private void secret() { }        // A.secret ile ilişkisiz yeni metot
    public static void info() { System.out.println("B"); } // GİZLER, ezmez //!

    @Override
    public String toStrin() { return "B"; }  // ✗ derleme hatası: method does not //!
                                             //   override a method from a supertype
}
A a = new B();
a.info();        // "A" yazar: static çağrı bildirilen türe göre seçilir`,
    },
  ],

  polymorphism: [
    {
      id: "polymorphism-demo",
      title: "PolymorphismDemo: m(Object x) ile Generic Programlama",
      label: "m(Object x)",
      def: "Parametre türü süper sınıf olan bir metot, o sınıfın HER alt sınıfının nesnesini kabul eder. Ders örneğinde m(Object x) metoduna GraduateStudent, Student, Person ve Object nesneleri geçirilir; x.toString() çağrısı her seferinde nesnenin GERÇEK türündeki toString'i çalıştırır (dinamik bağlama). Parametreyi genel bir türde tutup her türe uygun çalışan koda generic programlama denir.",
      code: `public class PolymorphismDemo {
    public static void main(String[] args) {
        m(new GraduateStudent());
        m(new Student());
        m(new Person());
        m(new Object());
    }
    public static void m(Object x) {          // her nesneyi kabul eder //!
        System.out.println(x.toString());
    }
}
class GraduateStudent extends Student { }
class Student extends Person {
    @Override
    public String toString() { return "Student"; }
}
class Person extends Object {
    @Override
    public String toString() { return "Person"; }
}
// Çıktı:
// Student                ← GraduateStudent kendi toString'ine sahip değil //!
// Student
// Person
// java.lang.Object@130c19b`,
      quiz: {
        question: "m(new GraduateStudent()) çağrısı ne yazar?",
        code: `class GraduateStudent extends Student { }
class Student extends Person {
    public String toString() { return "Student"; }
}
class Person extends Object {
    public String toString() { return "Person"; }
}
public static void m(Object x) { System.out.println(x.toString()); }`,
        options: ["GraduateStudent", "Student", "Person", "java.lang.Object@..."],
        answer: 1,
        explain: "JVM toString'i en özel sınıftan başlayıp yukarı doğru arar: GraduateStudent'ta yok → Student'ta var. Bulunan ilk uygulama çalışır.",
      },
    },
  ],

  "dynamic-binding": [
    {
      id: "method-matching-binding",
      title: "Metot Eşleme (derleme) ve Metot Bağlama (çalışma)",
      label: "Eşleme vs bağlama",
      def: "Metot EŞLEME (matching) derleme zamanında yapılır: derleyici, referans değişkeninin BİLDİRİLEN türüne bakarak parametre türü, sayısı ve sırası uyan imzayı bulur. Metot BAĞLAMA (binding) çalışma zamanında yapılır: JVM, nesnenin GERÇEK türünden başlayarak C1, C2, ..., Cn (Cn = Object) zincirinde ilk bulduğu uygulamayı çalıştırır. Bildirilen tür (declared type) değişkenin türüdür; gerçek tür (actual type) değişkenin gösterdiği nesnenin sınıfıdır. Object o = new GeometricObject(); ifadesinde o.toString() için hangi toString'in çalışacağına gerçek tür karar verir.",
      code: `// C1 (en özel) → C2 → ... → Cn = Object (en genel)
Object o = new GeometricObject();     // bildirilen: Object, gerçek: GeometricObject //!
System.out.println(o.toString());     // GeometricObject.toString çalışır

// Eşleme: derleyici bildirilen türe bakar
// o.getArea();                        ✗ Object'te getArea yok → derleme hatası //!
System.out.println(((GeometricObject) o).getDateCreated());   // ✓ cast ile`,
    },
  ],

  casting: [
    {
      id: "implicit-explicit-cast",
      title: "Örtük ve Açık Nesne Dönüşümü",
      label: "Örtük / açık cast",
      def: "Alt sınıf nesnesini süper sınıf değişkenine atamak (upcasting) HER ZAMAN mümkündür ve örtüktür (implicit casting): m(new Student()) çağrısı new Student()'ı Object parametresine atar; Object o = new Student(); da aynıdır. Ters yön (downcasting) açık cast ister, çünkü derleyici o'nun gerçekten Student olduğunu bilemez: Student b = o; derleme hatası verir, Student b = (Student) o; derlenir. Elma her zaman meyvedir, ama her meyve elma değildir.",
      code: `Object o = new Student();      // örtük upcasting ✓
Student b = o;                 // ✗ derleme hatası: incompatible types //!
Student b2 = (Student) o;      // ✓ açık downcasting //!

Fruit f = new Apple();         // ✓ elma bir meyvedir
Apple a = (Apple) f;           // ✓ f gerçekten Apple
Orange x = (Orange) f;         // derlenir ama ClassCastException!`,
    },
    {
      id: "casting-demo",
      title: "CastingDemo: displayObject ve Cast Önceliği",
      label: "CastingDemo",
      def: "Ders örneği CastingDemo, bir Circle ve bir Rectangle nesnesini Object türünde saklayıp displayObject(Object) metoduna geçirir. Metot instanceof ile gerçek türü kontrol eder, sonra cast ederek alt sınıfa özgü metotları (getArea, getDiameter) çağırır. Nokta (üye erişim) operatörünün önceliği cast operatöründen YÜKSEKTİR; bu yüzden ((Circle) object).getArea() biçiminde parantez gerekir. (Circle) object.getArea() yazılırsa önce object.getArea() denenir ve derleme hatası oluşur.",
      code: `public class CastingDemo {
    public static void main(String[] args) {
        Object object1 = new Circle(1);
        Object object2 = new Rectangle(1, 1);
        displayObject(object1);
        displayObject(object2);
    }

    public static void displayObject(Object object) {
        if (object instanceof Circle) {
            System.out.println("The circle area is " +
                ((Circle) object).getArea());          // çift parantez şart //!
            System.out.println("The circle diameter is " +
                ((Circle) object).getDiameter());
        } else if (object instanceof Rectangle) {
            System.out.println("The rectangle area is " +
                ((Rectangle) object).getArea());
        }
    }
}
// (Circle) object.getArea()   ✗ önce object.getArea() → Object'te yok //!`,
    },
    {
      id: "fruit-hierarchy",
      title: "Meyve Hiyerarşisi: instanceof ve Cast Soruları",
      label: "Fruit / Apple / Orange",
      def: "Klasik sınav sorusu hiyerarşisi: Apple ve Orange, Fruit'i genişletir; GoldenDelicious ve McIntosh ise Apple'ı genişletir. Fruit fruit = new GoldenDelicious(); Orange orange = new Orange(); verildiğinde: fruit instanceof Fruit → true, fruit instanceof Orange → false, fruit instanceof Apple → true, fruit instanceof GoldenDelicious → true, fruit instanceof McIntosh → false, orange instanceof Orange → true, orange instanceof Fruit → true. İlişkisiz sınıflar arasında instanceof veya cast (orange instanceof Apple, Apple p = (Apple) orange) DERLEME hatasıdır. Apple'da tanımlı makeAppleCider() metodunu fruit doğrudan çağıramaz (bildirilen tür Fruit), ((Apple) fruit).makeAppleCider() çağırabilir; orange hiç çağıramaz.",
      code: `//           Fruit
//          /     \\
//      Apple     Orange
//      /    \\
// GoldenDelicious  McIntosh

Fruit fruit = new GoldenDelicious();
Orange orange = new Orange();

fruit instanceof Apple              // true //!
fruit instanceof McIntosh           // false
orange instanceof Fruit             // true
// orange instanceof Apple          ✗ derleme hatası: ilişkisiz türler //!

Orange p1 = new Apple();            // ✗ derleme hatası
McIntosh p2 = new Apple();          // ✗ (Apple, McIntosh değildir)
Apple p3 = new McIntosh();          // ✓ upcasting
((Apple) fruit).makeAppleCider();   // ✓ cast ile`,
      quiz: {
        question: "Fruit fruit = new GoldenDelicious(); için hangisi FALSE döndürür?",
        options: ["fruit instanceof Fruit", "fruit instanceof Apple", "fruit instanceof GoldenDelicious", "fruit instanceof McIntosh"],
        answer: 3,
        explain: "Gerçek tür GoldenDelicious'tır; GoldenDelicious bir Apple ve bir Fruit'tir. McIntosh ise kardeş sınıftır, aralarında is-a ilişkisi yoktur.",
      },
    },
  ],

  "object-class": [
    {
      id: "equals-vs-identity",
      title: "== ve equals: String ve Date Örnekleri",
      label: "== vs equals",
      def: "== referanslarda KİMLİK (aynı nesne mi?), equals ise İÇERİK eşitliği içindir; ancak equals'ın içerik karşılaştırması yapması sınıfın onu ezmesine bağlıdır. String, Date ve sarmalayıcı sınıflar (Integer, Double) equals'ı ezer. Kendi sınıfınızda ezmezseniz equals, Object'teki varsayılan sürüm olan == gibi davranır.",
      code: `String s1 = new String("Welcome");
String s2 = new String("Welcome");
System.out.println(s1 == s2);          // false: iki ayrı nesne //!
System.out.println(s1.equals(s2));     // true : String equals'ı ezmiş

class Point { int x, y; Point(int x, int y) { this.x = x; this.y = y; } }
Point p = new Point(1, 2), q = new Point(1, 2);
System.out.println(p.equals(q));       // false: equals ezilmemiş → == //!`,
    },
  ],

  /* ===================== ADVANCED OOP · Soyut Sınıflar ve Arayüzler ===================== */
  abstract: [
    {
      id: "abstract-geometric",
      title: "Soyut GeometricObject ve Soyut Metotların Önemi",
      label: "Soyut GeometricObject",
      def: "Ders örneğinde GeometricObject soyut (abstract) yapılır ve getArea() ile getPerimeter() soyut metot olarak bildirilir; çünkü genel bir geometrik nesnenin alanı hesaplanamaz, ama her alt sınıfın (Circle, Rectangle) alanı vardır. Soyut sınıfın yapıcıları protected yazılır; yalnızca alt sınıflar kullanır. Soyut metotlar sayesinde TestGeometricObject'teki equalArea(GeometricObject, GeometricObject) metodu, parametrelerin gerçek türünü bilmeden getArea() çağırabilir. GeometricObject'te getArea olmasaydı bu çağrı derlenmezdi.",
      code: `public abstract class GeometricObject { //!
    private String color = "white";
    private boolean filled;
    private java.util.Date dateCreated;

    protected GeometricObject() { dateCreated = new java.util.Date(); }   // protected yapıcı
    protected GeometricObject(String color, boolean filled) {
        dateCreated = new java.util.Date();
        this.color = color;
        this.filled = filled;
    }
    // ... getter/setter'lar, toString ...
    public abstract double getArea();        // gövdesiz //!
    public abstract double getPerimeter();
}

public class TestGeometricObject {
    public static void main(String[] args) {
        GeometricObject geoObject1 = new Circle(5);
        GeometricObject geoObject2 = new Rectangle(5, 3);
        System.out.println("The two objects have the same area? " +
            equalArea(geoObject1, geoObject2));
        displayGeometricObject(geoObject1);
        displayGeometricObject(geoObject2);
    }
    public static boolean equalArea(GeometricObject object1, GeometricObject object2) {
        return object1.getArea() == object2.getArea();   // dinamik bağlama //!
    }
    public static void displayGeometricObject(GeometricObject object) {
        System.out.println();
        System.out.println("The area is " + object.getArea());
        System.out.println("The perimeter is " + object.getPerimeter());
    }
}`,
    },
    {
      id: "abstract-rules",
      title: "Soyut Sınıf Kuralları (Sınav Notları)",
      label: "Soyut kurallar",
      def: "(1) Soyut metot, soyut OLMAYAN bir sınıfta bulunamaz. Soyut sınıfın alt sınıfı tüm soyut metotları uygulamazsa o alt sınıf da abstract bildirilmelidir. Soyut metotlar static olamaz. (2) Soyut sınıftan new ile nesne oluşturulamaz, ama yapıcıları olabilir; bu yapıcılar alt sınıfların yapıcılarından çağrılır (Circle → GeometricObject). (3) Hiç soyut metodu olmayan bir sınıf da abstract bildirilebilir; amaç yalnızca nesne oluşturmayı engellemektir. (4) Süper sınıf somut olsa bile alt sınıf soyut olabilir (Object somuttur ama GeometricObject soyuttur). (5) Alt sınıf, süper sınıftaki somut bir metodu ezip abstract yapabilir (nadiren). (6) Soyut sınıf TÜR olarak kullanılabilir: GeometricObject[] objects = new GeometricObject[10]; geçerlidir, sonra objects[0] = new Circle(); atanır.",
      code: `abstract class A {
    abstract void m();               // ✓
    // abstract static void s();     ✗ soyut metot static olamaz
}
// class B { abstract void m(); }   ✗ soyut metot somut sınıfta olamaz //!

abstract class C extends A { }      // ✓ m() uygulanmadı → C de abstract olmalı

abstract class NoAbstractMethods {   // ✓ soyut metodu yok ama abstract
    void hello() { }
}

GeometricObject[] objects = new GeometricObject[10];  // ✓ dizi oluşturmak serbest //!
objects[0] = new Circle();
// GeometricObject g = new GeometricObject();         ✗ nesne oluşturulamaz`,
      quiz: {
        question: "Hangisi DERLENİR?",
        options: [
          "GeometricObject g = new GeometricObject();",
          "GeometricObject[] list = new GeometricObject[5];",
          "class X { abstract void m(); }",
          "abstract static void m(); (soyut sınıf içinde)",
        ],
        answer: 1,
        explain: "Soyut sınıftan nesne oluşturulamaz ama soyut türde bir DİZİ oluşturulabilir; dizi yalnızca null referanslar içerir. Somut sınıfta soyut metot ve static soyut metot geçersizdir.",
      },
    },
    {
      id: "number-class",
      title: "Soyut Number Sınıfı (LargestNumbers)",
      label: "Number",
      def: "java.lang.Number; Integer, Double, Long, Float, Short, Byte, BigInteger ve BigDecimal sınıflarının soyut süper sınıfıdır. Soyut metotları: intValue(), longValue(), floatValue(), doubleValue(); somut metotları: byteValue(), shortValue(). Ders örneği LargestNumbers, farklı türden sayıları ArrayList<Number> içinde tutar ve doubleValue() ile karşılaştırarak en büyüğünü bulur. Bu, ortak bir soyut süper sınıfın sağladığı çok biçimliliğin örneğidir.",
      code: `import java.util.ArrayList;
import java.math.*;

public class LargestNumbers {
    public static void main(String[] args) {
        ArrayList<Number> list = new ArrayList<>();      // farklı sayı türleri //!
        list.add(45);                                    // Integer (kutulama)
        list.add(3445.53);                               // Double
        list.add(new BigInteger("3432323234344343101"));
        list.add(new BigDecimal("2.0909090989091343433344343"));
        System.out.println("The largest number is " + getLargestNumber(list));
    }

    public static Number getLargestNumber(ArrayList<Number> list) {
        if (list == null || list.size() == 0) return null;
        Number number = list.get(0);
        for (int i = 1; i < list.size(); i++)
            if (number.doubleValue() < list.get(i).doubleValue()) //!
                number = list.get(i);
        return number;
    }
}
// The largest number is 3432323234344343101`,
    },
    {
      id: "calendar",
      title: "Calendar ve GregorianCalendar",
      label: "Calendar",
      def: "java.util.Calendar, tarih bilgilerini (yıl, ay, gün, saat...) ayrıntılı olarak çıkarmak için kullanılan SOYUT bir sınıftır; somut alt sınıfı GregorianCalendar'dır. new GregorianCalendar() o anki tarihi, new GregorianCalendar(year, month, date) belirli bir tarihi oluşturur. DİKKAT: month 0 tabanlıdır, 0 = Ocak (January), 11 = Aralık. get(int field) ile alanlar okunur. Sabitler: YEAR, MONTH, DATE, HOUR (12 saat), HOUR_OF_DAY (24 saat), MINUTE, SECOND, DAY_OF_WEEK (1 = Pazar), DAY_OF_MONTH, DAY_OF_YEAR, WEEK_OF_MONTH, WEEK_OF_YEAR, AM_PM. Diğer metotlar: set(field, value), add(field, amount), getActualMaximum(field), getTime(), setTime(Date).",
      code: `import java.util.*;

public class TestCalendar {
    public static void main(String[] args) {
        Calendar calendar = new GregorianCalendar();     // soyut tür, somut nesne //!
        System.out.println("Current time is " + new Date());
        System.out.println("YEAR: " + calendar.get(Calendar.YEAR));
        System.out.println("MONTH: " + calendar.get(Calendar.MONTH));        // 0 tabanlı!
        System.out.println("DATE: " + calendar.get(Calendar.DATE));
        System.out.println("HOUR: " + calendar.get(Calendar.HOUR));
        System.out.println("HOUR_OF_DAY: " + calendar.get(Calendar.HOUR_OF_DAY));
        System.out.println("MINUTE: " + calendar.get(Calendar.MINUTE));
        System.out.println("SECOND: " + calendar.get(Calendar.SECOND));
        System.out.println("DAY_OF_WEEK: " + calendar.get(Calendar.DAY_OF_WEEK));
        System.out.println("DAY_OF_MONTH: " + calendar.get(Calendar.DAY_OF_MONTH));
        System.out.println("DAY_OF_YEAR: " + calendar.get(Calendar.DAY_OF_YEAR));
        System.out.println("WEEK_OF_MONTH: " + calendar.get(Calendar.WEEK_OF_MONTH));
        System.out.println("WEEK_OF_YEAR: " + calendar.get(Calendar.WEEK_OF_YEAR));
        System.out.println("AM_PM: " + calendar.get(Calendar.AM_PM));

        // 11 Eylül 2001 hangi gün?  (8 = Eylül, çünkü Ocak = 0) //!
        Calendar calendar1 = new GregorianCalendar(2001, 8, 11);
        String[] dayNameOfWeek = {"Sunday", "Monday", "Tuesday", "Wednesday",
                                  "Thursday", "Friday", "Saturday"};
        System.out.println("September 11, 2001 is a " +
            dayNameOfWeek[calendar1.get(Calendar.DAY_OF_WEEK) - 1]);   // Tuesday
    }
}`,
      quiz: {
        question: "new GregorianCalendar(2026, 1, 15) hangi tarihi temsil eder?",
        options: ["15 Ocak 2026", "15 Şubat 2026", "1 Ocak 2026", "Derleme hatası"],
        answer: 1,
        explain: "Calendar'da ay alanı 0 tabanlıdır: 0 = Ocak, 1 = Şubat. Gün (DATE) ise 1'den başlar.",
      },
    },
  ],

  interfaces: [
    {
      id: "edible",
      title: "Edible Arayüzü Örneği (TestEdible)",
      label: "Edible",
      def: "Arayüz, ilişkisiz sınıflar için ortak davranış tanımlar. Edible (yenebilir) arayüzü howToEat() metodunu bildirir. Chicken hem Animal'ı genişletir hem Edible'ı uygular; Tiger yalnızca Animal'dır (yenmez). Fruit soyut sınıfı Edible'ı uygular ama howToEat'i uygulamadığı için soyut kalır; Apple ve Orange uygular. TestEdible, Object dizisindeki her nesnenin Edible ve/veya Animal olup olmadığını instanceof ile kontrol eder.",
      code: `public interface Edible {
    /** Nesnenin nasıl yeneceğini açıklar */
    public abstract String howToEat();             //!
}

abstract class Animal {
    public abstract String sound();
}
class Chicken extends Animal implements Edible {  // hem is-a Animal hem Edible //!
    @Override public String howToEat() { return "Chicken: Fry it"; }
    @Override public String sound() { return "Chicken: cock-a-doodle-doo"; }
}
class Tiger extends Animal {
    @Override public String sound() { return "Tiger: RROOAARR"; }
}
abstract class Fruit implements Edible {          // howToEat uygulanmadı → abstract
}
class Apple extends Fruit {
    @Override public String howToEat() { return "Apple: Make apple cider"; }
}
class Orange extends Fruit {
    @Override public String howToEat() { return "Orange: Make orange juice"; }
}

public class TestEdible {
    public static void main(String[] args) {
        Object[] objects = {new Tiger(), new Chicken(), new Apple()};
        for (int i = 0; i < objects.length; i++) {
            if (objects[i] instanceof Edible)
                System.out.println(((Edible) objects[i]).howToEat());
            if (objects[i] instanceof Animal)
                System.out.println(((Animal) objects[i]).sound());
        }
    }
}
// Tiger: RROOAARR
// Chicken: Fry it
// Chicken: cock-a-doodle-doo
// Apple: Make apple cider`,
      quiz: {
        question: "TestEdible çıktısının İKİNCİ satırı nedir?",
        code: `Object[] objects = {new Tiger(), new Chicken(), new Apple()};
for (int i = 0; i < objects.length; i++) {
    if (objects[i] instanceof Edible)
        System.out.println(((Edible) objects[i]).howToEat());
    if (objects[i] instanceof Animal)
        System.out.println(((Animal) objects[i]).sound());
}`,
        options: ["Tiger: RROOAARR", "Chicken: Fry it", "Chicken: cock-a-doodle-doo", "Apple: Make apple cider"],
        answer: 1,
        explain: "Tiger Edible değildir, yalnızca sound() yazılır (1. satır). Chicken için önce Edible kontrolü yapıldığı için howToEat() → \"Chicken: Fry it\" ikinci satırdır.",
      },
    },
    {
      id: "interface-modifiers",
      title: "Arayüzde Örtük Belirleyiciler (public static final / public abstract)",
      label: "Örtük belirleyiciler",
      def: "Arayüzdeki TÜM veri alanları public static final (sabit), TÜM metotlar public abstract'tır (Java 8 öncesi kural). Bu belirleyiciler yazılmayabilir; derleyici ekler. Bu yüzden arayüz sabitine ArayüzAdı.SABIT ile erişilir (T1.K) ve değeri değiştirilemez. Arayüz metodunu uygulayan sınıf metodu public yazmak ZORUNDADIR; aksi hâlde erişim daraltılmış olur. Arayüz new ile örneklenemez ama değişken türü olarak kullanılabilir. Java 8 ile arayüzlere default (gövdeli) ve static metotlar da eklenebilir.",
      code: `public interface T1 {
    public static final int K = 1;     // ≡  int K = 1; //!
    public abstract void p();          // ≡  void p();
}
// T1.K → 1
// T1.K = 2;            ✗ final alan değiştirilemez

class Impl implements T1 {
    void p() { }        // ✗ HATA: erişim daraltılıyor, public olmalı //!
}

public interface Edible {
    String howToEat();                   // örtük olarak public abstract
    default String origin() { return "?"; } // Java 8+: default metot
}`,
      quiz: {
        question: "interface Shape { double PI_APPROX = 3.14; } için hangisi DOĞRUDUR?",
        options: [
          "PI_APPROX her Shape nesnesine ayrı kopyalanır",
          "PI_APPROX örtük olarak public static final'dır",
          "PI_APPROX private'tır",
          "Arayüzde alan bildirmek derleme hatasıdır",
        ],
        answer: 1,
        explain: "Arayüzdeki alanlar her zaman public static final'dır; yani sınıfa ait, değiştirilemez sabitlerdir ve Shape.PI_APPROX ile erişilir.",
      },
    },
    {
      id: "comparable-rectangle",
      title: "Comparable ile Sıralama: ComparableRectangle ve Arrays.sort",
      label: "ComparableRectangle",
      def: "Comparable<E> arayüzü java.lang paketindedir: public interface Comparable<E> { public int compareTo(E o); }. java.util.Arrays.sort(Object[]) dizinin elemanlarını compareTo ile karşılaştırarak sıralar; bu yüzden elemanlar Comparable olmalıdır (String, Integer, BigInteger, Date zaten Comparable'dır). Ders örneği ComparableRectangle, Rectangle'ı genişletip Comparable<ComparableRectangle>'ı uygular ve dikdörtgenleri ALANLARINA göre karşılaştırır. Comparable olmayan nesnelerle Arrays.sort ClassCastException fırlatır.",
      code: `public class ComparableRectangle extends Rectangle
        implements Comparable<ComparableRectangle> { //!
    public ComparableRectangle(double width, double height) {
        super(width, height);
    }
    @Override
    public int compareTo(ComparableRectangle o) {    // alana göre karşılaştır //!
        if (getArea() > o.getArea()) return 1;
        else if (getArea() < o.getArea()) return -1;
        else return 0;
    }
    @Override
    public String toString() {
        return super.toString() + " Area: " + getArea();
    }
}

public class SortRectangles {
    public static void main(String[] args) {
        ComparableRectangle[] rectangles = {
            new ComparableRectangle(3.4, 5.4),
            new ComparableRectangle(13.24, 55.4),
            new ComparableRectangle(7.4, 35.4),
            new ComparableRectangle(1.4, 25.4)};
        java.util.Arrays.sort(rectangles);           // compareTo kullanılır //!
        for (Rectangle rectangle : rectangles) {
            System.out.print(rectangle + " ");
            System.out.println();
        }
    }
}

// SortComparableObjects: hazır Comparable sınıflar
String[] cities = {"Savannah", "Boston", "Atlanta", "Tampa"};
java.util.Arrays.sort(cities);                       // Atlanta Boston Savannah Tampa
BigInteger[] hugeNumbers = {new BigInteger("2323231092923992"),
    new BigInteger("432232323239292"), new BigInteger("54623239292")};
java.util.Arrays.sort(hugeNumbers);`,
    },
    {
      id: "cloneable",
      title: "Cloneable: Sığ (Shallow) ve Derin (Deep) Kopya",
      label: "Shallow / Deep copy",
      def: "Cloneable bir İŞARETÇİ (marker) arayüzdür: içi boştur — public interface Cloneable { }. Yalnızca sınıfın kopyalanabilir olduğunu belirtir. Object'teki clone() metodu protected'dır ve Cloneable uygulamayan bir sınıfta çağrılırsa CloneNotSupportedException (checked) fırlatır. Object.clone() SIĞ kopya yapar: ilkel alanlar kopyalanır, referans alanlarında ise yalnızca REFERANS kopyalanır; yani kopya ile orijinal aynı iç nesneyi (ör. Date whenBuilt) paylaşır. DERİN kopya için referans alanları da ayrıca klonlanır. Ders örneği House sınıfı Cloneable ve Comparable<House> uygular.",
      code: `public class House implements Cloneable, Comparable<House> { //!
    private int id;
    private double area;
    private java.util.Date whenBuilt;

    public House(int id, double area) {
        this.id = id;
        this.area = area;
        whenBuilt = new java.util.Date();
    }
    // ... getter'lar ...

    @Override
    public Object clone() throws CloneNotSupportedException {
        // Sığ kopya: return super.clone();
        House houseClone = (House) super.clone();                       // sığ kopya
        houseClone.whenBuilt = (java.util.Date) (whenBuilt.clone());    // derin kopya //!
        return houseClone;
    }

    @Override
    public int compareTo(House o) {
        if (area > o.area) return 1;
        else if (area < o.area) return -1;
        else return 0;
    }
}

House house1 = new House(1, 1750.50);
House house2 = (House) house1.clone();
// house1 == house2                              → false (farklı nesneler)
// Sığ kopyada: house1.whenBuilt == house2.whenBuilt → true  (aynı Date) //!
// Derin kopyada:                                    → false (ayrı Date)

// Calendar ile:
Calendar calendar = new GregorianCalendar(2013, 2, 1);
Calendar calendar1 = calendar;
Calendar calendar2 = (Calendar) calendar.clone();
System.out.println(calendar == calendar1);        // true
System.out.println(calendar == calendar2);        // false
System.out.println(calendar.equals(calendar2));   // true

int[] list1 = {1, 2};
int[] list2 = list1.clone();                      // diziler de klonlanabilir`,
      quiz: {
        question: "House sınıfı yalnızca return super.clone(); ile klonlanırsa house1.getWhenBuilt() == house2.getWhenBuilt() sonucu nedir?",
        options: ["false, Date de kopyalanır", "true, Date referansı paylaşılır", "Derleme hatası", "CloneNotSupportedException"],
        answer: 1,
        explain: "Object.clone() sığ kopya yapar: whenBuilt alanındaki referans kopyalanır, Date nesnesi kopyalanmaz. Derin kopya için whenBuilt.clone() ayrıca çağrılmalıdır.",
      },
    },
    {
      id: "interface-vs-abstract",
      title: "Arayüz ve Soyut Sınıf Karşılaştırması",
      label: "Arayüz vs soyut sınıf",
      def: "Bir sınıf yalnızca BİR sınıfı genişletebilir ama BİRDEN ÇOK arayüzü uygulayabilir. Bir arayüz birden çok arayüzü extends ile genişletebilir (alt arayüz, subinterface). Tüm sınıfların ortak kökü Object'tir; arayüzlerin ise tek bir kökü yoktur. Bir arayüz türündeki değişken, o arayüzü uygulayan her sınıfın nesnesini gösterebilir. Güçlü is-a ilişkisi (ebeveyn–çocuk; Staff Member is a Person) sınıflarla, zayıf is-a ilişkisi yani is-kind-of (\"tüm string'ler karşılaştırılabilir\") arayüzlerle modellenir. Arayüz adları sıfat (Comparable, Cloneable) ya da isim (ActionListener) olabilir.",
      code: `//              Değişkenler            Yapıcılar                          Metotlar
// Soyut sınıf  Kısıt yok              Alt sınıf yapıcıları zincirle      Kısıt yok
//                                     çağırır; new ile örneklenemez
// Arayüz       Hepsi public static    Yapıcı YOK; new ile               public abstract örnek //!
//              final olmalı           örneklenemez                       metotları (Java 8+:
//                                                                         default, static)

public interface NewInterface extends Interface1, Interface2 { }    // ✓ çoklu extends //!
public class NewClass extends BaseClass
        implements Interface1, Interface2, Interface3 { }           // ✓ 1 sınıf + çok arayüz`,
      quiz: {
        question: "Hangisi arayüz için DOĞRU, soyut sınıf için YANLIŞTIR?",
        options: [
          "new ile örneklenemez",
          "Yapıcısı olamaz",
          "Soyut metot içerebilir",
          "Değişken türü olarak kullanılabilir",
        ],
        answer: 1,
        explain: "İkisi de new ile örneklenemez, soyut metot içerebilir ve tür olarak kullanılabilir. Fakat soyut sınıfın yapıcısı olabilir (alt sınıflar çağırır), arayüzün ise yapıcısı yoktur.",
      },
    },
    {
      id: "rational",
      title: "Örnek: Rational Sınıfı",
      label: "Rational",
      def: "Rational, kesirli sayıları (pay/payda) temsil eder; Number'ı genişletir ve Comparable<Rational>'ı uygular. Kesir, payı ve paydayı ebob (gcd) ile bölünerek en sade hâlde saklanır; payda pozitif tutulur. Toplama: a/b + c/d = (ad + bc) / bd; çıkarma: (ad − bc) / bd; çarpma: ac / bd; bölme: ad / bc. Payda 1 ise toString yalnızca payı döndürür. Sınırlılık: pay ve payda long olduğundan büyük sayılarda taşma (overflow) olabilir; çözüm BigInteger kullanmaktır.",
      code: `public class Rational extends Number implements Comparable<Rational> { //!
    private long numerator = 0;
    private long denominator = 1;

    public Rational() { this(0, 1); }
    public Rational(long numerator, long denominator) {
        long gcd = gcd(numerator, denominator);
        this.numerator = ((denominator > 0) ? 1 : -1) * numerator / gcd;
        this.denominator = Math.abs(denominator) / gcd;
    }
    private static long gcd(long n, long d) {
        long n1 = Math.abs(n), n2 = Math.abs(d);
        int gcd = 1;
        for (int k = 1; k <= n1 && k <= n2; k++)
            if (n1 % k == 0 && n2 % k == 0) gcd = k;
        return gcd;
    }
    public long getNumerator() { return numerator; }
    public long getDenominator() { return denominator; }

    public Rational add(Rational secondRational) {      // (ad + bc) / bd //!
        long n = numerator * secondRational.getDenominator()
               + denominator * secondRational.getNumerator();
        long d = denominator * secondRational.getDenominator();
        return new Rational(n, d);
    }
    public Rational subtract(Rational r) {
        return new Rational(numerator * r.getDenominator() - denominator * r.getNumerator(),
                            denominator * r.getDenominator());
    }
    public Rational multiply(Rational r) {
        return new Rational(numerator * r.getNumerator(), denominator * r.getDenominator());
    }
    public Rational divide(Rational r) {
        return new Rational(numerator * r.getDenominator(), denominator * r.getNumerator());
    }

    @Override
    public String toString() {
        if (denominator == 1) return numerator + "";
        else return numerator + "/" + denominator;
    }
    @Override
    public boolean equals(Object other) {
        return (this.subtract((Rational) other)).getNumerator() == 0;
    }
    @Override public int intValue() { return (int) doubleValue(); }
    @Override public float floatValue() { return (float) doubleValue(); }
    @Override public double doubleValue() { return numerator * 1.0 / denominator; }
    @Override public long longValue() { return (long) doubleValue(); }
    @Override
    public int compareTo(Rational o) {
        if (this.subtract(o).getNumerator() > 0) return 1;
        else if (this.subtract(o).getNumerator() < 0) return -1;
        else return 0;
    }
}

Rational r1 = new Rational(4, 2);       // 2
Rational r2 = new Rational(2, 3);
System.out.println(r1 + " + " + r2 + " = " + r1.add(r2));   // 2 + 2/3 = 8/3`,
    },
    {
      id: "class-design",
      title: "Sınıf Tasarım İlkeleri",
      label: "Tasarım ilkeleri",
      def: "Uyum (cohesion): bir sınıf tek bir varlığı tanımlamalı, tüm işlemleri o amaca hizmet etmeli; farklı sorumluluklar (öğrenci ve ders kaydı) ayrı sınıflara ayrılmalı. Tutarlılık (consistency): Java adlandırma kurallarına uyulmalı; veri alanları yapıcıdan önce, yapıcılar metotlardan önce yazılmalı; genelde bir no-arg yapıcı sağlanmalı. Kapsülleme (encapsulation): alanlar private olmalı, getter/setter yalnızca gerektiğinde verilmeli. Açıklık (clarity): sınıfın sözleşmesi kolay anlaşılmalı, metotlar sıra kısıtı olmadan bağımsız çağrılabilmeli, başka alanlardan türetilebilen veri alan olarak tutulmamalı (birthDate varken age tutulmamalı). Bütünlük (completeness): geniş kullanım için yeterince metot sağlanmalı (String'in 40'tan fazla metodu var). Örnek ve static: belirli bir nesneye bağlı değişken/metot örnek üyesi olmalı, nesneler arasında paylaşılan static olmalı; static değişkene sınıf adıyla erişilmeli ve static alan yapıcıda başlatılmamalı. Kalıtım ve kompozisyon: is-a için kalıtım, has-a için kompozisyon. Arayüz ve soyut sınıf: güçlü is-a için sınıf, zayıf is-a için arayüz.",
      code: `// ✗ Açıklık ihlali: türetilebilen veri alan olarak tutulmuş
public class Person {
    private java.util.Date birthDate;
    private int age;                 // birthDate'ten hesaplanabilir → gereksiz //!
}

// ✓ Static alan yapıcıda değil, bildirimde veya static setter'da başlatılır
public class Circle {
    private static int numberOfObjects = 0;    //!
    public Circle() { numberOfObjects++; }
}

// ✓ Kompozisyon (has-a) vs kalıtım (is-a)
class Student { private Name name; private Address address; }   // has-a
class Faculty extends Person { }                                 // is-a`,
    },
  ],

  /* ===================== İSTİSNA YÖNETİMİ ve METİN G/Ç ===================== */
  throwable: [
    {
      id: "exception-hierarchy",
      title: "İstisna Sınıf Hiyerarşisi ve Throwable Metotları",
      label: "Hiyerarşi + metotlar",
      def: "İstisnalar nesnedir ve sınıfları Throwable'dan türer. Üç ana grup vardır: (1) Sistem hataları (Error): JVM tarafından fırlatılır, Error ve alt sınıflarıyla temsil edilir; LinkageError (bir sınıfın bağımlı olduğu sınıf uyumsuz biçimde değişmiş) ve VirtualMachineError (JVM bozuk ya da kaynak tükenmiş) gibi. Nadiren olur, olunca programı düzgün sonlandırmaktan başka yapılacak pek bir şey yoktur. (2) Exception: programın yakalayıp ele alabileceği hatalar; ClassNotFoundException, IOException (FileNotFoundException, MalformedURLException) gibi. (3) RuntimeException: programlama hataları; ArithmeticException, NullPointerException, IndexOutOfBoundsException, IllegalArgumentException, ClassCastException. Throwable metotları: getMessage() mesajı, toString() \"tam sınıf adı: mesaj\", printStackTrace() nesnenin ve çağrı yığınının izini, getStackTrace() yığın izi elemanlarını (StackTraceElement[]) döndürür.",
      code: `// Object
//  └── Throwable
//       ├── Exception
//       │    ├── ClassNotFoundException
//       │    ├── IOException → FileNotFoundException, MalformedURLException
//       │    ├── CloneNotSupportedException
//       │    └── RuntimeException                       (unchecked) //!
//       │         ├── ArithmeticException
//       │         ├── NullPointerException
//       │         ├── IndexOutOfBoundsException
//       │         ├── IllegalArgumentException → NumberFormatException
//       │         ├── ClassCastException
//       │         └── NoSuchElementException → InputMismatchException
//       └── Error                                       (unchecked)
//            ├── LinkageError
//            └── VirtualMachineError → OutOfMemoryError, StackOverflowError

try {
    System.out.println(sum(new int[] {1, 2, 3, 4, 5}));
} catch (Exception ex) {
    ex.printStackTrace();                                   // yığın izi //!
    System.out.println("\\n" + ex.getMessage());              // yalnızca mesaj
    System.out.println("\\n" + ex.toString());                // sınıf adı + mesaj
    System.out.println("\\nTrace Info Obtained from getStackTrace");
    StackTraceElement[] traceElements = ex.getStackTrace();
    for (int i = 0; i < traceElements.length; i++) {
        System.out.print("method " + traceElements[i].getMethodName());
        System.out.print("(" + traceElements[i].getClassName() + ":");
        System.out.println(traceElements[i].getLineNumber() + ")");
    }
}`,
      quiz: {
        question: "ex = new ArithmeticException(\"/ by zero\") için ex.toString() ne döndürür?",
        options: ["/ by zero", "ArithmeticException", "java.lang.ArithmeticException: / by zero", "Yığın izini döndürür"],
        answer: 2,
        explain: "getMessage() yalnızca mesajı, toString() ise tam sınıf adı + \": \" + mesajı döndürür. Yığın izini printStackTrace() yazdırır.",
      },
    },
  ],

  exception: [
    {
      id: "checked-unchecked",
      title: "Checked ve Unchecked İstisnalar",
      label: "Checked / Unchecked",
      def: "RuntimeException, Error ve bunların alt sınıfları UNCHECKED (denetlenmeyen) istisnalardır. Diğer tüm istisnalar CHECKED'dır: derleyici, programcının bunları ya yakalamasını (try-catch) ya da metot imzasında bildirmesini (throws) ZORUNLU tutar. Unchecked istisnalar çoğunlukla düzeltilmesi gereken mantık hatalarını yansıtır (null referansa erişmek, dizi sınırını aşmak). Her metot çağrısında yakalanmaları kodu karmaşıklaştıracağı için Java bunları zorunlu tutmaz.",
      code: `// CHECKED: derleyici denetler → yakala ya da bildir
public static void read() throws IOException {      // bildirildi //!
    Scanner in = new Scanner(new File("data.txt")); // FileNotFoundException
}

// UNCHECKED: derleyici zorlamaz (programlama hataları)
int[] list = new int[5];
list[5] = 1;                       // ArrayIndexOutOfBoundsException //!
String s = null;
s.length();                        // NullPointerException
Object o = "abc";
Integer i = (Integer) o;           // ClassCastException
Integer.parseInt("12a");           // NumberFormatException`,
      quiz: {
        question: "Hangisi CHECKED bir istisnadır?",
        options: ["NullPointerException", "ArithmeticException", "FileNotFoundException", "ClassCastException"],
        answer: 2,
        explain: "FileNotFoundException → IOException → Exception yolundan gelir ve RuntimeException değildir; bu yüzden checked'dır. Diğerleri RuntimeException alt sınıflarıdır.",
      },
    },
    {
      id: "runtime-exceptions",
      title: "Sık Görülen RuntimeException'lar",
      label: "Runtime istisnaları",
      def: "ArithmeticException: TAM SAYIYI sıfıra bölmek (5 / 0). Kayan noktalı bölme istisna fırlatmaz: 5.0 / 0 → Infinity, 0.0 / 0 → NaN. NullPointerException: null referans üzerinden üyeye erişmek. IndexOutOfBoundsException: geçersiz indis; alt sınıfları ArrayIndexOutOfBoundsException ve StringIndexOutOfBoundsException. IllegalArgumentException: metoda geçersiz argüman; alt sınıfı NumberFormatException (Integer.parseInt(\"abc\")). ClassCastException: nesneyi uyumsuz türe cast etmek. InputMismatchException: Scanner'ın beklediği türde olmayan girdi (nextInt'e \"abc\").",
      code: `System.out.println(1 / 0);          // ArithmeticException: / by zero //!
System.out.println(1.0 / 0);        // Infinity (istisna YOK) //!
System.out.println(0.0 / 0);        // NaN

String s = "Java";
s.charAt(10);                       // StringIndexOutOfBoundsException
int[] a = new int[3];
a[3] = 0;                           // ArrayIndexOutOfBoundsException
Integer.parseInt("3.5");            // NumberFormatException
Object o = new Object();
String t = (String) o;              // ClassCastException`,
      quiz: {
        question: "System.out.println(1.0 / 0); ifadesi ne yapar?",
        options: ["ArithmeticException fırlatır", "Infinity yazar", "0 yazar", "Derleme hatası verir"],
        answer: 1,
        explain: "Sıfıra bölme istisnası yalnızca tam sayı bölmesinde fırlar. double bölmede IEEE 754 kuralı geçerlidir: sonuç Infinity'dir.",
      },
    },
    {
      id: "input-mismatch",
      title: "InputMismatchException Örneği (Girdiyi Tekrar İsteme)",
      label: "InputMismatch",
      def: "Scanner.nextInt() tam sayı beklerken başka bir girdi okursa InputMismatchException fırlatır. Ders örneği InputMismatchExceptionDemo, istisnayı yakalayıp kullanıcıdan tekrar girdi ister. Döngü bir boolean bayrakla (continueInput) kontrol edilir. catch bloğunda input.nextLine() çağrılarak hatalı satır atılır; atılmazsa aynı hatalı token tekrar okunur ve sonsuz döngü oluşur.",
      code: `import java.util.*;

public class InputMismatchExceptionDemo {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        boolean continueInput = true;

        do {
            try {
                System.out.print("Enter an integer: ");
                int number = input.nextInt();             // "3.5" girilirse istisna //!
                System.out.println("The number entered is " + number);
                continueInput = false;                    // başarılı → döngüden çık
            } catch (InputMismatchException ex) {
                System.out.println("Try again. (Incorrect input: an integer is required)");
                input.nextLine();                         // hatalı girdiyi at //!
            }
        } while (continueInput);
    }
}`,
    },
  ],

  "try-catch-finally": [
    {
      id: "exception-advantages",
      title: "İstisnaların Avantajı: Quotient → QuotientWithException",
      label: "Neden istisna?",
      def: "Ders, aynı bölme programını dört sürümde geliştirir. Quotient: ikinci sayı 0 ise program ArithmeticException ile çöker. QuotientWithIf: if ile kontrol eder. QuotientWithMethod: bölmeyi bir metoda taşır; hatada metodun içinde System.exit(1) çağrılır, yani programı metodun kendisi sonlandırır; bu kötü bir tasarımdır, çünkü karar çağırana ait olmalıdır. QuotientWithException: metot hatayı throw ile çağırana BİLDİRİR, çağıran try-catch ile ne yapacağına karar verir. İstisnanın avantajı: hatanın TESPİTİ (çağrılan metot) ile hatanın İŞLENMESİ (çağıran) birbirinden ayrılır.",
      code: `// QuotientWithMethod: metot programı kendisi sonlandırıyor (kötü)
public static int quotient(int number1, int number2) {
    if (number2 == 0) {
        System.out.println("Divisor cannot be zero");
        System.exit(1);                                  // karar çağırana bırakılmadı //!
    }
    return number1 / number2;
}

// QuotientWithException: hata bildiriliyor, karar çağıranda
public static int quotient2(int number1, int number2) {
    if (number2 == 0)
        throw new ArithmeticException("Divisor cannot be zero"); //!
    return number1 / number2;
}
try {
    int result = quotient2(number1, number2);
    System.out.println(number1 + " / " + number2 + " is " + result);
} catch (ArithmeticException ex) {
    System.out.println("Exception: an integer cannot be divided by zero ");
}
System.out.println("Execution continues ...");`,
    },
    {
      id: "catch-or-declare",
      title: "Yakala ya da Bildir (Catch or Declare) ve catch Sırası",
      label: "Catch or declare",
      def: "Java, CHECKED istisnalar için kuralı zorunlu tutar: checked istisna fırlatabilen bir metodu çağıran metot, ya çağrıyı try-catch ile sarmalı ya da istisnayı kendi imzasında throws ile bildirmelidir. Birden çok istisna throws listesinde virgülle ayrılır: throws IOException, ClassNotFoundException. catch blokları sırayla denenir; süper sınıf catch'i alt sınıf catch'inden ÖNCE gelirse alt sınıf bloğuna asla ulaşılamaz ve derleme hatası oluşur. JDK 7 multi-catch: catch (Exception1 | Exception2 | Exception3 ex) aynı işlemi birden çok türe uygular.",
      code: `// p2 checked IOException fırlatıyor:
void p2() throws IOException { /* ... */ }

// Seçenek 1: yakala
void p1() {
    try {
        p2();
    } catch (IOException ex) { //!
        // ...
    }
}
// Seçenek 2: bildir
void p1b() throws IOException {   //!
    p2();
}

// ✗ Yanlış sıra: RuntimeException, Exception'dan sonra yakalanamaz
try { } catch (Exception ex) { } catch (RuntimeException ex) { }   // derleme hatası
// ✓ Doğru sıra: özelden genele
try { } catch (RuntimeException ex) { } catch (Exception ex) { }

// JDK 7 multi-catch
try { /* ... */ } catch (ArithmeticException | NullPointerException ex) { //!
    System.out.println(ex.getMessage());
}`,
      quiz: {
        code: `import java.io.*;
public class Test {
    public static void main(String[] args) {
        PrintWriter out = new PrintWriter("a.txt");
        out.println("Merhaba");
        out.close();
    }
}`,
        stages: [
          compileStage(false, "new PrintWriter(\"a.txt\") checked FileNotFoundException fırlatabilir; main ne yakalıyor ne de bildiriyor.", 4),
          {
            step: "Teşhis",
            question: "② Teşhis: Hangisi hatayı gidermez?",
            options: [
              "main imzasına throws FileNotFoundException eklemek",
              "Satırı try-catch (FileNotFoundException ex) içine almak",
              "main imzasına throws Exception eklemek",
              "out.close() satırını silmek",
            ],
            answer: 3,
            explain: "Kural \"yakala ya da bildir\"dir. close() satırını silmek istisnanın kaynağını değiştirmez; üstelik veri dosyaya yazılmayabilir.",
          },
        ],
      },
    },
    {
      id: "finally-flow",
      title: "finally ve Akış Senaryoları (İzleme)",
      label: "finally akışı",
      def: "try { statement1; statement2; statement3; } catch (Exception1 ex1) { handling ex; } finally { finalStatements; } nextStatement; için üç senaryo vardır. (1) İstisna YOK: try'ın tamamı → finally → nextStatement. (2) statement2, Exception1 fırlatır: statement3 ATLANIR → catch → finally → nextStatement. (3) statement2 yakalanmayan bir istisna (Exception2) fırlatır: statement3 atlanır → finally ÇALIŞIR → istisna çağırana aktarılır, nextStatement ÇALIŞMAZ. finally, try veya catch içinde return olsa bile çalışır. finally'siz try-catch ve catch'siz try-finally de yazılabilir.",
      code: `try {
    statement1;
    statement2;          // istisna burada fırlarsa...
    statement3;          // ...bu satır atlanır //!
} catch (Exception1 ex) {
    handling ex;
} finally {
    finalStatements;     // HER durumda çalışır //!
}
nextStatement;           // yalnızca istisna yakalandıysa ya da hiç yoksa

// return olsa bile finally çalışır:
static int f() {
    try { return 1; }
    finally { System.out.println("finally"); }   // önce "finally" yazılır, sonra 1 döner
}`,
      quiz: {
        question: "statement2, hiçbir catch bloğunun yakalamadığı bir istisna fırlatırsa hangileri çalışır?",
        code: `try {
    statement1;
    statement2;
    statement3;
} catch (Exception1 ex1) {
    handling ex1;
} finally {
    finalStatements;
}
nextStatement;`,
        options: [
          "statement3, finalStatements, nextStatement",
          "finalStatements, sonra istisna çağırana aktarılır",
          "Yalnızca nextStatement",
          "handling ex1, finalStatements, nextStatement",
        ],
        answer: 1,
        explain: "Yakalanmayan istisnada statement3 atlanır, finally yine çalışır ve istisna çağıran metoda aktarılır; nextStatement çalışmaz.",
      },
    },
    {
      id: "rethrow",
      title: "İstisnayı Yeniden Fırlatma (Rethrow)",
      label: "Rethrow",
      def: "Bir catch bloğu istisnayı yakalayıp kendi işini yaptıktan (ör. log yazmak, kaynak temizlemek) sonra aynı istisnayı throw ex; ile yeniden fırlatabilir. Böylece istisnayı asıl işlemesi gereken çağırana da iletmiş olur. İstisnayı başka bir türle sarıp fırlatmak ise zincirleme istisnadır (chained exception).",
      code: `try {
    statements;
} catch (TheException ex) {
    perform operations before exits;   // ör. log yaz, kaynağı serbest bırak
    throw ex;                          // aynı istisnayı çağırana ilet //!
}`,
    },
    {
      id: "when-exceptions",
      title: "İstisna Ne Zaman Kullanılmalı?",
      label: "Ne zaman kullanmalı?",
      def: "İstisna işleme maliyetlidir: yeni bir istisna nesnesi oluşturulur, çağrı yığını geri sarılır ve istisna, işleyicisi bulunana kadar çağıran metotlara aktarılır. Bu yüzden istisnalar yalnızca İSTİSNAİ durumlar için kullanılmalıdır; basit, beklenen durumlar if ile kontrol edilmelidir. Bir hatanın çağıran tarafından işlenmesi gerekiyorsa istisna fırlatılmalıdır; metodun kendi içinde işlenebiliyorsa istisnaya gerek yoktur. Ayrıca try-catch yalnızca checked istisnaları veya gerçekten beklenmedik durumları sarmalıdır.",
      code: `// ✗ Kötü: basit bir kontrol için istisna
try {
    System.out.println(refVar.toString());
} catch (NullPointerException ex) { //!
    System.out.println("refVar is null");
}

// ✓ İyi: if ile kontrol
if (refVar != null)
    System.out.println(refVar.toString()); //!
else
    System.out.println("refVar is null");`,
    },
  ],

  throw: [
    {
      id: "circle-with-exception",
      title: "CircleWithException ve TestCircleWithException",
      label: "CircleWithException",
      def: "Ders örneğinde CircleWithException sınıfının setRadius metodu negatif yarıçapta IllegalArgumentException fırlatır; yapıcılar setRadius'u çağırdığı için geçersiz yarıçapla nesne de oluşturulamaz. IllegalArgumentException unchecked olduğu için metot imzasında throws yazmak isteğe bağlıdır. Test programında üçüncü nesne oluşturulmaz, çünkü ikinci satırda fırlayan istisna try bloğunun geri kalanını atlar. numberOfObjects artırma işlemi setRadius'tan SONRA yapıldığından yalnızca başarılı nesneler sayılır.",
      code: `public class CircleWithException {
    private double radius;
    private static int numberOfObjects = 0;

    public CircleWithException() { this(1.0); }
    public CircleWithException(double newRadius) {
        setRadius(newRadius);               // istisna burada fırlarsa sayaç artmaz //!
        numberOfObjects++;
    }
    public double getRadius() { return radius; }
    public void setRadius(double newRadius) throws IllegalArgumentException {
        if (newRadius >= 0)
            radius = newRadius;
        else
            throw new IllegalArgumentException("Radius cannot be negative"); //!
    }
    public static int getNumberOfObjects() { return numberOfObjects; }
}

public class TestCircleWithException {
    public static void main(String[] args) {
        try {
            CircleWithException c1 = new CircleWithException(5);
            CircleWithException c2 = new CircleWithException(-5);   // istisna
            CircleWithException c3 = new CircleWithException(0);    // çalışmaz
        } catch (IllegalArgumentException ex) {
            System.out.println(ex);
        }
        System.out.println("Number of objects created: " +
            CircleWithException.getNumberOfObjects());
    }
}
// java.lang.IllegalArgumentException: Radius cannot be negative
// Number of objects created: 1`,
      quiz: {
        question: "TestCircleWithException'ın son satırı ne yazar?",
        code: `try {
    CircleWithException c1 = new CircleWithException(5);
    CircleWithException c2 = new CircleWithException(-5);
    CircleWithException c3 = new CircleWithException(0);
} catch (IllegalArgumentException ex) {
    System.out.println(ex);
}
System.out.println("Number of objects created: " +
    CircleWithException.getNumberOfObjects());`,
        options: ["Number of objects created: 0", "Number of objects created: 1", "Number of objects created: 2", "Number of objects created: 3"],
        answer: 1,
        explain: "c1 başarılı (sayaç 1). c2'de setRadius istisna fırlatır; numberOfObjects++ satırına ulaşılmaz. c3 satırı try'ın kalanı atlandığı için hiç çalışmaz.",
      },
    },
  ],

  chained: [
    {
      id: "chained-demo",
      title: "ChainedExceptionDemo",
      label: "ChainedExceptionDemo",
      def: "Ders örneğinde main, method1'i; method1 de method2'yi çağırır. method2 bir istisna fırlatır; method1 bunu yakalar ve yeni bir istisnayı ORİJİNALİ neden (cause) olarak vererek fırlatır: new Exception(\"New info from method1\", ex). main'deki printStackTrace() önce yeni istisnayı, ardından \"Caused by:\" satırıyla orijinal istisnayı yazdırır.",
      code: `public class ChainedExceptionDemo {
    public static void main(String[] args) {
        try {
            method1();
        } catch (Exception ex) {
            ex.printStackTrace();           // iki istisnayı da gösterir
        }
    }
    public static void method1() throws Exception {
        try {
            method2();
        } catch (Exception ex) {
            throw new Exception("New info from method1", ex);   // ex = cause //!
        }
    }
    public static void method2() throws Exception {
        throw new Exception("New info from method2");
    }
}
// java.lang.Exception: New info from method1
//     at ChainedExceptionDemo.method1(...)
//     at ChainedExceptionDemo.main(...)
// Caused by: java.lang.Exception: New info from method2 //!
//     at ChainedExceptionDemo.method2(...)`,
    },
  ],

  "custom-exceptions": [
    {
      id: "invalid-radius",
      title: "InvalidRadiusException'ı Kullanmak (TestCircleWithCustomException)",
      label: "InvalidRadius kullanımı",
      def: "Önceden tanımlı istisnalar (IllegalArgumentException) sorunu yeterince anlatmıyorsa Exception'ı (checked) ya da RuntimeException'ı (unchecked) genişleten özel bir istisna sınıfı yazılır. Ders örneğinde InvalidRadiusException, Exception'ı genişlettiği için CHECKED'dır: onu fırlatan setRadius ve setRadius'u çağıran yapıcılar throws InvalidRadiusException bildirmek zorundadır; nesneyi oluşturan kod da try-catch kullanmalıdır. Özel istisnaya ek bilgi (ör. hatalı yarıçap) alan olarak eklenebilir.",
      code: `public class InvalidRadiusException extends Exception {
    private double radius;
    public InvalidRadiusException(double radius) {
        super("Invalid radius " + radius);
        this.radius = radius;
    }
    public double getRadius() { return radius; }
}

public class CircleWithRadiusException {
    private double radius;
    public CircleWithRadiusException(double newRadius)
            throws InvalidRadiusException {                 // checked → zincir boyunca bildir //!
        setRadius(newRadius);
    }
    public void setRadius(double newRadius) throws InvalidRadiusException {
        if (newRadius >= 0) radius = newRadius;
        else throw new InvalidRadiusException(newRadius);   //!
    }
}

public class TestCircleWithCustomException {
    public static void main(String[] args) {
        try {
            new CircleWithRadiusException(5);
            new CircleWithRadiusException(-5);
            new CircleWithRadiusException(0);
        } catch (InvalidRadiusException ex) {
            System.out.println(ex);              // InvalidRadiusException: Invalid radius -5.0
        }
    }
}`,
    },
  ],

  file: [
    {
      id: "file-paths",
      title: "Mutlak/Göreli Yol, Ayraç ve File Metotları",
      label: "Yol + File metotları",
      def: "Mutlak dosya adı (absolute) sürücü ve tam dizin yolunu içerir: c:\\book\\Welcome.java. Göreli dosya adı (relative) geçerli çalışma dizinine göredir: Welcome.java. Java string'inde ters eğik çizgi kaçış karakteri olduğu için \"c:\\\\book\\\\Welcome.java\" yazılmalıdır; platformdan bağımsızlık için eğik çizgi (/) tercih edilir: new File(\"image/us.gif\"). File nesnesi oluşturmak diskte dosya OLUŞTURMAZ; yalnızca yolu sarar. Metotlar: exists(), canRead(), canWrite(), isDirectory(), isFile(), isAbsolute(), isHidden(), getAbsolutePath(), getCanonicalPath(), getName(), getPath(), getParent(), lastModified(), length(), listFiles(), delete(), renameTo(File), mkdir(), mkdirs().",
      code: `java.io.File file = new java.io.File("image/us.gif");    // "/" taşınabilir //!
System.out.println("Does it exist? " + file.exists());
System.out.println("The file has " + file.length() + " bytes");
System.out.println("Can it be read? " + file.canRead());
System.out.println("Can it be written? " + file.canWrite());
System.out.println("Is it a directory? " + file.isDirectory());
System.out.println("Is it a file? " + file.isFile());
System.out.println("Is it absolute? " + file.isAbsolute());
System.out.println("Is it hidden? " + file.isHidden());
System.out.println("Absolute path is " + file.getAbsolutePath());
System.out.println("Last modified on " + new java.util.Date(file.lastModified()));

File windows = new File("c:\\\\book\\\\Welcome.java");    // string'de \\\\ //!`,
    },
  ],

  "text-io": [
    {
      id: "read-url",
      title: "Web'den Veri Okuma (URL)",
      label: "URL'den okuma",
      def: "Yerel dosya gibi web'deki bir dosya da okunabilir: URL url = new URL(\"http://www.google.com/index.html\"); ile adres oluşturulur, url.openStream() bir giriş akışı (InputStream) döndürür ve Scanner bu akışa bağlanır: new Scanner(url.openStream()). URL yapıcısı biçimi geçersiz adreste MalformedURLException (checked) fırlatır. Adresin başında http:// olmazsa adres geçersiz sayılır. Ders örneği ReadFileFromURL, sayfadaki karakter sayısını sayar.",
      code: `import java.util.Scanner;

public class ReadFileFromURL {
    public static void main(String[] args) {
        System.out.print("Enter a URL: ");
        String URLString = new Scanner(System.in).next();

        try {
            java.net.URL url = new java.net.URL(URLString); //!
            int count = 0;
            Scanner input = new Scanner(url.openStream());   // web akışı //!
            while (input.hasNext()) {
                String line = input.nextLine();
                count += line.length();
            }
            System.out.println("The file size is " + count + " characters");
        } catch (java.net.MalformedURLException ex) {
            System.out.println("Invalid URL");
        } catch (java.io.IOException ex) {
            System.out.println("I/O Errors: no such file");
        }
    }
}`,
    },
    {
      id: "web-crawler",
      title: "Örnek: Web Tarayıcısı (WebCrawler)",
      label: "WebCrawler",
      def: "Web tarayıcısı bir başlangıç URL'sinden başlayıp bağlantıları izleyerek sayfaları gezer. Algoritma: bekleyen URL'ler listesine (listOfPendingURLs) başlangıç adresi eklenir. Liste boşalana ya da 100 sayfa gezilene kadar: listenin başındaki URL çıkarılır; daha önce gezilmediyse gezilenler listesine (listOfTraversedURLs) eklenir, yazdırılır ve sayfadaki her alt URL, gezilmemişse bekleyenler listesine eklenir. getSubURLs, satırlarda \"http:\" ifadesini arar ve sonraki tırnak işaretine (\") kadar olan kısmı URL olarak alır.",
      code: `import java.util.Scanner;
import java.util.ArrayList;

public class WebCrawler {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.print("Enter a URL: ");
        String url = input.nextLine();
        crawler(url);
    }

    public static void crawler(String startingURL) {
        ArrayList<String> listOfPendingURLs = new ArrayList<>();
        ArrayList<String> listOfTraversedURLs = new ArrayList<>();

        listOfPendingURLs.add(startingURL);
        while (!listOfPendingURLs.isEmpty() &&
                listOfTraversedURLs.size() <= 100) {           //!
            String urlString = listOfPendingURLs.remove(0);
            if (!listOfTraversedURLs.contains(urlString)) {
                listOfTraversedURLs.add(urlString);
                System.out.println("Crawl " + urlString);

                for (String s : getSubURLs(urlString))
                    if (!listOfTraversedURLs.contains(s))
                        listOfPendingURLs.add(s);
            }
        }
    }

    public static ArrayList<String> getSubURLs(String urlString) {
        ArrayList<String> list = new ArrayList<>();
        try {
            java.net.URL url = new java.net.URL(urlString);
            Scanner input = new Scanner(url.openStream());
            int current = 0;
            while (input.hasNext()) {
                String line = input.nextLine();
                current = line.indexOf("http:", current);        //!
                while (current > 0) {
                    int endIndex = line.indexOf("\\"", current);   // sonraki tırnak
                    if (endIndex > 0) {
                        list.add(line.substring(current, endIndex));
                        current = line.indexOf("http:", endIndex);
                    } else
                        current = -1;
                }
            }
        } catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
        }
        return list;
    }
}`,
    },
  ],

  scanner: [
    {
      id: "scanner-tokens",
      title: "Scanner Nasıl Çalışır? Token Okuma ve nextLine Tuzağı",
      label: "Token okuma",
      def: "Scanner girdiyi ayraçlarla (varsayılan: boşluk karakterleri) ayrılmış TOKEN'lara böler. next(), nextInt(), nextDouble() gibi token okuyan metotlar önce baştaki ayraçları atlar, sonra bir sonraki ayraca kadar okur; ayracın kendisini TÜKETMEZ. nextLine() ise satır sonu ayracına kadar her şeyi okur ve satır sonunu tüketir. Bu yüzden nextInt()'ten hemen sonra çağrılan nextLine(), satırın geri kalanını (çoğu zaman boş string) döndürür. Ayrıca new Scanner(\"scores.txt\") DOSYAYI değil \"scores.txt\" metnini tarar; dosya için new Scanner(new File(\"scores.txt\")) yazılmalıdır. Scanner metotları: hasNext(), next(), nextLine(), nextByte(), nextShort(), nextInt(), nextLong(), nextFloat(), nextDouble(), useDelimiter(pattern), close().",
      code: `// scores.txt:  John T Smith 90
//              Eric K Jones 85
import java.util.Scanner;

public class ReadData {
    public static void main(String[] args) throws Exception {
        java.io.File file = new java.io.File("scores.txt");
        Scanner input = new Scanner(file);               // DOSYA tarayıcısı //!
        while (input.hasNext()) {
            String firstName = input.next();
            String mi = input.next();
            String lastName = input.next();
            int score = input.nextInt();
            System.out.println(firstName + " " + mi + " " + lastName + " " + score);
        }
        input.close();
    }
}

// Tuzak: girdi "34 567⏎"
Scanner in = new Scanner(System.in);
int intValue = in.nextInt();        // 34
String line = in.nextLine();        // " 567"  (satırın kalanı) //!

Scanner s = new Scanner("scores.txt");   // dikkat: METNİ tarar, dosyayı değil`,
      quiz: {
        question: "Kullanıcı 34 567 yazıp Enter'a basarsa line değişkeninin değeri ne olur?",
        code: `Scanner input = new Scanner(System.in);
int intValue = input.nextInt();
String line = input.nextLine();`,
        options: ["\"567\"", "\" 567\"", "\"\" (boş)", "\"34 567\""],
        answer: 1,
        explain: "nextInt() yalnızca 34 token'ını okur, ardındaki boşluğu tüketmez. nextLine() satırın kalanını, yani baştaki boşlukla birlikte \" 567\" döndürür.",
      },
    },
    {
      id: "replace-text",
      title: "Problem: ReplaceText (Dosyada Metin Değiştirme)",
      label: "ReplaceText",
      def: "Komut satırı kullanımı: java ReplaceText sourceFile targetFile oldString newString. Program kaynak dosyadaki her satırda oldString'i newString ile değiştirip sonucu hedef dosyaya yazar. Adımlar: argüman sayısı 4 değilse kullanım mesajı ver; kaynak dosya yoksa ya da hedef dosya zaten varsa çık; Scanner ile oku, PrintWriter ile yaz, ikisini try-with-resources ile otomatik kapat; her satır için line.replaceAll(args[2], args[3]).",
      code: `import java.io.*;
import java.util.*;

public class ReplaceText {
    public static void main(String[] args) throws Exception {
        if (args.length != 4) {                                   // argüman kontrolü //!
            System.out.println("Usage: java ReplaceText sourceFile targetFile oldStr newStr");
            System.exit(1);
        }
        File sourceFile = new File(args[0]);
        if (!sourceFile.exists()) {
            System.out.println("Source file " + args[0] + " does not exist");
            System.exit(2);
        }
        File targetFile = new File(args[1]);
        if (targetFile.exists()) {
            System.out.println("Target file " + args[1] + " already exists");
            System.exit(3);
        }

        try (
            Scanner input = new Scanner(sourceFile);              // iki kaynak birden //!
            PrintWriter output = new PrintWriter(targetFile);
        ) {
            while (input.hasNext()) {
                String s1 = input.nextLine();
                String s2 = s1.replaceAll(args[2], args[3]);      //!
                output.println(s2);
            }
        }
    }
}`,
    },
  ],

  /* ===================== OLAY GÜDÜMLÜ PROGRAMLAMA (Swing + JavaFX) ===================== */
  "events-basics": [
    {
      id: "event-classes",
      title: "Olay Sınıfları Hiyerarşisi (Swing/AWT ve JavaFX)",
      label: "Olay sınıfları",
      def: "Olay (event), bir şeyin olduğunu bildiren sinyal NESNESİDİR; olay sınıflarının kökü java.util.EventObject'tir ve getSource() metodu olayı üreten kaynak nesneyi döndürür. Swing/AWT hiyerarşisi: EventObject → AWTEvent → ActionEvent, AdjustmentEvent, ComponentEvent, ItemEvent, TextEvent; ComponentEvent → ContainerEvent, FocusEvent, InputEvent, PaintEvent, WindowEvent; InputEvent → MouseEvent, KeyEvent. Swing'e özgü olaylar javax.swing.event paketindedir: ListSelectionEvent, ChangeEvent. JavaFX hiyerarşisi: EventObject → Event → ActionEvent, InputEvent (MouseEvent, KeyEvent), WindowEvent. Olayı üreten nesneye kaynak nesne (source object/component) denir.",
      code: `// Swing / AWT (java.awt.event, javax.swing.event)
// EventObject
//  └── AWTEvent
//       ├── ActionEvent         ├── ItemEvent
//       ├── AdjustmentEvent     ├── TextEvent
//       └── ComponentEvent
//            ├── ContainerEvent    ├── FocusEvent
//            ├── PaintEvent        ├── WindowEvent
//            └── InputEvent → MouseEvent, KeyEvent //!
// (javax.swing.event) ListSelectionEvent, ChangeEvent

// JavaFX (javafx.event, javafx.scene.input, javafx.stage)
// EventObject
//  └── Event
//       ├── ActionEvent
//       ├── InputEvent → MouseEvent, KeyEvent //!
//       └── WindowEvent

Object source = e.getSource();   // her olayda: olayı üreten bileşen`,
    },
    {
      id: "user-actions",
      title: "Kullanıcı Eylemi → Kaynak → Olay Tablosu",
      label: "Eylem tablosu",
      def: "Hangi kullanıcı eyleminin hangi bileşende hangi olayı ürettiği sınavda boşluk doldurma olarak sorulur. JavaFX'te kayıt metotları setOnXxx biçimindedir: Button, TextField (Enter), RadioButton, CheckBox, ComboBox → ActionEvent → setOnAction; düğümler üzerinde fare olayları → MouseEvent → setOnMousePressed, setOnMouseReleased, setOnMouseClicked, setOnMouseEntered, setOnMouseExited, setOnMouseMoved, setOnMouseDragged; klavye → KeyEvent → setOnKeyPressed, setOnKeyReleased, setOnKeyTyped.",
      code: `// Kullanıcı eylemi                 Kaynak (Swing)   Üretilen olay
// Düğmeye tıklama                  JButton          ActionEvent //!
// Metin alanında Enter             JTextField       ActionEvent
// Yeni öğe seçme                   JComboBox        ItemEvent, ActionEvent
// Öğe(ler) seçme                   JList            ListSelectionEvent
// Onay kutusuna tıklama            JCheckBox        ItemEvent, ActionEvent
// Radyo düğmesine tıklama          JRadioButton     ItemEvent, ActionEvent
// Menü öğesi seçme                 JMenuItem        ActionEvent
// Kaydırma çubuğunu kaydırma       JScrollBar       AdjustmentEvent
// Kaydırıcıyı (slider) kaydırma    JSlider          ChangeEvent
// Pencere açıldı/kapandı/simge...  Window           WindowEvent
// Fare basıldı/bırakıldı/tıklandı  Component        MouseEvent
//   girdi/çıktı/hareket/sürükleme
// Tuşa basıldı/bırakıldı           Component        KeyEvent
// Bileşen eklendi/çıkarıldı        Container        ContainerEvent
// Bileşen taşındı/boyutlandı/      Component        ComponentEvent
//   gizlendi/gösterildi
// Odak kazanıldı/kaybedildi        Component        FocusEvent

// JavaFX: Button / TextField / RadioButton / CheckBox / ComboBox
//         → ActionEvent → setOnAction(handler) //!`,
      quiz: {
        question: "Swing'de bir JSlider kaydırıldığında hangi olay üretilir?",
        options: ["ActionEvent", "AdjustmentEvent", "ChangeEvent", "ItemEvent"],
        answer: 2,
        explain: "JSlider → ChangeEvent (ChangeListener.stateChanged). AdjustmentEvent JScrollBar'a aittir; ikisi sık karıştırılır.",
      },
    },
  ],

  listeners: [
    {
      id: "delegation-model",
      title: "Yetkilendirme (Delegation) Modeli: Kaynak, Dinleyici, Kayıt",
      label: "Delegation modeli",
      def: "Java olay işleme modeli yetkilendirmeye dayanır: kaynak nesne olayı tetikler, olayla ilgilenen nesne (dinleyici / işleyici) onu işler. İki koşul vardır: (1) dinleyici, ilgili dinleyici arayüzünün bir ÖRNEĞİ olmalıdır (Swing: ActionListener; JavaFX: EventHandler<ActionEvent>), (2) dinleyici kaynak nesneye KAYDEDİLMELİDİR. Swing'de kayıt source.addXListener(listener) (ör. addActionListener), JavaFX'te source.setOnXEventType(handler) (ör. setOnAction) ile yapılır. Olay gerçekleşince kaynak, kayıtlı dinleyicinin işleyici metodunu (actionPerformed / handle) çağırır ve olay nesnesini argüman olarak verir. Bir kaynağa birden çok dinleyici, bir dinleyiciye birden çok kaynak kaydedilebilir.",
      code: `// Swing
public class HandleEvent extends JFrame {
    public HandleEvent() {
        JButton jbtOK = new JButton("OK");
        JButton jbtCancel = new JButton("Cancel");
        JPanel panel = new JPanel();
        panel.add(jbtOK);
        panel.add(jbtCancel);
        add(panel);
        OKListenerClass listener1 = new OKListenerClass();       // (1) dinleyici nesnesi
        CancelListenerClass listener2 = new CancelListenerClass();
        jbtOK.addActionListener(listener1);                       // (2) kaynağa kayıt //!
        jbtCancel.addActionListener(listener2);
    }
    public static void main(String[] args) {
        JFrame frame = new HandleEvent();
        frame.setTitle("Handle Event");
        frame.setSize(200, 150);
        frame.setLocation(200, 100);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }
}
class OKListenerClass implements ActionListener {                 // dinleyici arayüzü //!
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.println("OK button clicked");
    }
}
class CancelListenerClass implements ActionListener {
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.println("Cancel button clicked");
    }
}

// JavaFX karşılığı:
// class OKHandlerClass implements EventHandler<ActionEvent> { public void handle(ActionEvent e) {...} }
// btOK.setOnAction(new OKHandlerClass());`,
    },
    {
      id: "listener-interfaces",
      title: "Olay → Dinleyici Arayüzü → İşleyici Metot Tablosu",
      label: "Dinleyici tablosu",
      def: "Her olay sınıfının bir dinleyici arayüzü ve bu arayüzde uygulanması gereken işleyici metotları vardır. Arayüz adı genellikle olay adındaki Event yerine Listener koyularak bulunur (ActionEvent → ActionListener). İstisnalar: MouseEvent'in İKİ arayüzü vardır (MouseListener ve MouseMotionListener). Kayıt metodu addXxxListener biçimindedir.",
      code: `// Olay sınıfı          Dinleyici arayüzü       İşleyici metot(lar)
// ActionEvent          ActionListener          actionPerformed(ActionEvent) //!
// ItemEvent            ItemListener            itemStateChanged(ItemEvent)
// MouseEvent           MouseListener           mousePressed, mouseReleased,
//                                              mouseEntered, mouseExited,
//                                              mouseClicked (5 metot) //!
//                      MouseMotionListener     mouseDragged, mouseMoved
// KeyEvent             KeyListener             keyPressed, keyReleased, keyTyped
// WindowEvent          WindowListener          windowClosing, windowOpened,
//                                              windowIconified, windowDeiconified,
//                                              windowClosed, windowActivated,
//                                              windowDeactivated (7 metot)
// ContainerEvent       ContainerListener       componentAdded, componentRemoved
// ComponentEvent       ComponentListener       componentMoved, componentHidden,
//                                              componentResized, componentShown
// FocusEvent           FocusListener           focusGained, focusLost
// TextEvent            TextListener            textValueChanged
// AdjustmentEvent      AdjustmentListener      adjustmentValueChanged
// ChangeEvent          ChangeListener          stateChanged
// ListSelectionEvent   ListSelectionListener   valueChanged

// JavaFX: tek arayüz → EventHandler<T extends Event> { void handle(T e); }`,
      quiz: {
        question: "Fare SÜRÜKLENDİĞİNDE çağrılan mouseDragged metodu hangi arayüzdedir?",
        options: ["MouseListener", "MouseMotionListener", "ActionListener", "MouseAdapter"],
        answer: 1,
        explain: "MouseListener basma, bırakma, tıklama, girme, çıkma (5 metot); MouseMotionListener ise mouseDragged ve mouseMoved (2 metot) içerir.",
      },
    },
    {
      id: "action-event-methods",
      title: "ActionEvent Metotları: getSource, getActionCommand, getWhen",
      label: "getActionCommand",
      def: "java.util.EventObject.getSource(): olayı üreten nesneyi Object olarak döndürür. java.awt.event.ActionEvent ek metotları: getActionCommand() olayla ilişkili komut dizesini döndürür; düğmede varsayılan olarak DÜĞME ETİKETİ, metin alanında ise alandaki METİNDİR. getModifiers() olay anında basılı olan değiştirici tuşları (Shift, Ctrl...), getWhen() olayın zaman damgasını (ms) döndürür.",
      code: `class ButtonListener implements ActionListener {
    @Override
    public void actionPerformed(ActionEvent e) {
        Object src = e.getSource();               // tıklanan JButton nesnesi
        String cmd = e.getActionCommand();        // "OK" (düğmenin etiketi) //!
        long when = e.getWhen();                  // zaman damgası
        if (cmd.equals("OK")) System.out.println("OK basıldı");
    }
}`,
    },
    {
      id: "detect-source",
      title: "Tek Dinleyici, Birden Çok Kaynak (DetectSourceDemo, FrameAsListenerDemo)",
      label: "DetectSource",
      def: "Dinleyici sınıfı yazmanın alternatif yolları: (1) Birden çok düğme TEK bir dinleyici nesnesine kaydedilir; dinleyici e.getSource() ile hangi düğmenin tıklandığını bulur (DetectSourceDemo: New, Open, Save, Print düğmeleri). (2) Çerçeve sınıfının kendisi ActionListener'ı uygular ve düğmelere this kaydedilir (FrameAsListenerDemo). Bu yöntemler sınıf sayısını azaltır ama tek metotta uzun if-else zincirine yol açar; ders, iç sınıf ya da anonim sınıfla ayrı dinleyici yazmayı daha okunaklı bulur.",
      code: `public class DetectSourceDemo extends JFrame {
    private JButton jbtNew = new JButton("New");
    private JButton jbtOpen = new JButton("Open");
    private JButton jbtSave = new JButton("Save");
    private JButton jbtPrint = new JButton("Print");

    public DetectSourceDemo() {
        JPanel panel = new JPanel();
        panel.add(jbtNew); panel.add(jbtOpen); panel.add(jbtSave); panel.add(jbtPrint);
        add(panel);
        ButtonListener listener = new ButtonListener();   // TEK dinleyici
        jbtNew.addActionListener(listener);
        jbtOpen.addActionListener(listener);
        jbtSave.addActionListener(listener);
        jbtPrint.addActionListener(listener);
    }

    private class ButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            if (e.getSource() == jbtNew)                   // kaynağı tespit et //!
                System.out.println("Process New");
            else if (e.getSource() == jbtOpen)
                System.out.println("Process Open");
            else if (e.getSource() == jbtSave)
                System.out.println("Process Save");
            else if (e.getSource() == jbtPrint)
                System.out.println("Process Print");
        }
    }
}

// FrameAsListenerDemo: çerçevenin kendisi dinleyici
public class FrameAsListenerDemo extends JFrame implements ActionListener { //!
    private JButton jbtNew = new JButton("New");
    public FrameAsListenerDemo() {
        add(jbtNew);
        jbtNew.addActionListener(this);                    // this = dinleyici
    }
    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == jbtNew) System.out.println("Process New");
    }
}`,
    },
    {
      id: "listener-adapters",
      title: "Dinleyici Arayüzü Adaptörleri (WindowAdapter vb.)",
      label: "Adapter sınıfları",
      def: "Birden çok metodu olan dinleyici arayüzlerinde (WindowListener 7 metot) yalnızca birine ihtiyaç olsa bile hepsini uygulamak gerekir. Adaptör sınıfları arayüzün TÜM metotlarını boş gövdeyle uygular; programcı adaptörü genişletip yalnızca ihtiyaç duyduğu metodu ezer. Adaptörler: WindowAdapter (WindowListener), MouseAdapter (MouseListener), MouseMotionAdapter (MouseMotionListener), KeyAdapter (KeyListener), ContainerAdapter, ComponentAdapter, FocusAdapter. ActionListener'ın adaptörü YOKTUR, çünkü tek metodu vardır.",
      code: `// 7 metodu tek tek yazmak yerine:
addWindowListener(new WindowAdapter() {               // anonim adaptör alt sınıfı //!
    @Override
    public void windowClosing(WindowEvent e) {        // yalnızca gereken metot
        System.out.println("Window closing");
    }
});

addMouseListener(new MouseAdapter() {
    @Override
    public void mouseClicked(MouseEvent e) {
        System.out.println("Clicked at " + e.getX() + ", " + e.getY());
    }
});
// new ActionAdapter()  ✗ böyle bir sınıf yok //!`,
      quiz: {
        question: "Hangi dinleyici arayüzünün adaptör sınıfı YOKTUR?",
        options: ["WindowListener", "MouseListener", "KeyListener", "ActionListener"],
        answer: 3,
        explain: "Adaptörler çok metotlu arayüzlerdeki gereksiz yazımı önlemek içindir. ActionListener'ın tek metodu (actionPerformed) olduğundan adaptöre gerek yoktur.",
      },
    },
    {
      id: "window-events",
      title: "Pencere Olayları (TestWindowEvent)",
      label: "WindowEvent",
      def: "Window sınıfının her alt sınıfı (JFrame dahil) WindowEvent üretebilir. WindowListener'ın 7 metodu: windowOpened (pencere ilk kez görünür), windowClosing (kullanıcı kapatmaya çalışıyor), windowClosed (pencere kapatıldı), windowIconified (simge durumuna küçültüldü), windowDeiconified (geri açıldı), windowActivated (etkin pencere oldu), windowDeactivated (etkinliğini yitirdi). Ders örneği TestWindowEvent hepsini uygulayıp konsola yazar.",
      code: `public class TestWindowEvent extends JFrame {
    public TestWindowEvent() {
        addWindowListener(new WindowListener() {          //!
            public void windowDeiconified(WindowEvent event) { System.out.println("Window deiconified"); }
            public void windowIconified(WindowEvent event) { System.out.println("Window iconified"); }
            public void windowActivated(WindowEvent event) { System.out.println("Window activated"); }
            public void windowDeactivated(WindowEvent event) { System.out.println("Window deactivated"); }
            public void windowOpened(WindowEvent event) { System.out.println("Window opened"); }
            public void windowClosing(WindowEvent event) { System.out.println("Window closing"); } //!
            public void windowClosed(WindowEvent event) { System.out.println("Window closed"); }
        });
    }
}`,
    },
    {
      id: "observable-listener",
      title: "Gözlemlenebilir Nesne Dinleyicisi: InvalidationListener",
      label: "InvalidationListener",
      def: "Gözlemlenebilir (Observable) bir nesnenin, ör. bir binding property'nin, değeri değişince işlem yapmak için ona addListener(InvalidationListener) ile dinleyici eklenir. InvalidationListener'ın tek metodu invalidated(Observable o)'dur; değer geçersiz hâle gelince (değişince) çağrılır. Tek metotlu olduğu için lambda ile yazılabilir: ov -> ... Ders örnekleri: ObservablePropertyDemo bir DoubleProperty'nin değişimini yazdırır; DisplayResizableClock, pencere boyutu değişince saati yeniden boyutlandırır.",
      code: `import javafx.beans.InvalidationListener;
import javafx.beans.Observable;
import javafx.beans.property.DoubleProperty;
import javafx.beans.property.SimpleDoubleProperty;

public class ObservablePropertyDemo {
    public static void main(String[] args) {
        DoubleProperty balance = new SimpleDoubleProperty();
        balance.addListener(new InvalidationListener() {            //!
            public void invalidated(Observable ov) {
                System.out.println("The new value is " + balance.doubleValue());
            }
        });
        balance.set(4.5);           // → The new value is 4.5
    }
}

// DisplayResizableClock: lambda ile, pencere boyutuna uyum
pane.widthProperty().addListener(ov ->
    clock.setW(pane.getWidth()));                                   //!
pane.heightProperty().addListener(ov ->
    clock.setH(pane.getHeight()));`,
    },
    {
      id: "loan-calculator",
      title: "Problem: Kredi Hesaplayıcı (LoanCalculator)",
      label: "LoanCalculator",
      def: "Kullanıcı yıllık faiz oranını, yıl sayısını ve kredi tutarını metin alanlarına girer; Calculate düğmesine basınca aylık ödeme ve toplam ödeme hesaplanıp gösterilir. Arayüz GridPane ile kurulur (etiketler 0. sütun, metin alanları 1. sütun). Hesaplama Loan sınıfında yapılır. Formül: monthlyInterestRate = annualInterestRate / 1200; monthlyPayment = loanAmount × monthlyInterestRate / (1 − 1 / (1 + monthlyInterestRate)^(numberOfYears × 12)); totalPayment = monthlyPayment × numberOfYears × 12.",
      code: `public class LoanCalculator extends Application {
    private TextField tfAnnualInterestRate = new TextField();
    private TextField tfNumberOfYears = new TextField();
    private TextField tfLoanAmount = new TextField();
    private TextField tfMonthlyPayment = new TextField();
    private TextField tfTotalPayment = new TextField();
    private Button btCalculate = new Button("Calculate");

    @Override
    public void start(Stage primaryStage) {
        GridPane gridPane = new GridPane();                 // (sütun, satır) //!
        gridPane.setHgap(5);
        gridPane.setVgap(5);
        gridPane.add(new Label("Annual Interest Rate:"), 0, 0);
        gridPane.add(tfAnnualInterestRate, 1, 0);
        gridPane.add(new Label("Number of Years:"), 0, 1);
        gridPane.add(tfNumberOfYears, 1, 1);
        gridPane.add(new Label("Loan Amount:"), 0, 2);
        gridPane.add(tfLoanAmount, 1, 2);
        gridPane.add(new Label("Monthly Payment:"), 0, 3);
        gridPane.add(tfMonthlyPayment, 1, 3);
        gridPane.add(new Label("Total Payment:"), 0, 4);
        gridPane.add(tfTotalPayment, 1, 4);
        gridPane.add(btCalculate, 1, 5);

        gridPane.setAlignment(Pos.CENTER);
        tfAnnualInterestRate.setAlignment(Pos.BOTTOM_RIGHT);
        tfNumberOfYears.setAlignment(Pos.BOTTOM_RIGHT);
        tfLoanAmount.setAlignment(Pos.BOTTOM_RIGHT);
        tfMonthlyPayment.setAlignment(Pos.BOTTOM_RIGHT);
        tfTotalPayment.setAlignment(Pos.BOTTOM_RIGHT);
        tfMonthlyPayment.setEditable(false);
        tfTotalPayment.setEditable(false);
        GridPane.setHalignment(btCalculate, HPos.RIGHT);

        btCalculate.setOnAction(e -> calculateLoanPayment()); //!

        Scene scene = new Scene(gridPane, 400, 250);
        primaryStage.setTitle("LoanCalculator");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private void calculateLoanPayment() {
        double interest = Double.parseDouble(tfAnnualInterestRate.getText());
        int year = Integer.parseInt(tfNumberOfYears.getText());
        double loanAmount = Double.parseDouble(tfLoanAmount.getText());
        Loan loan = new Loan(interest, year, loanAmount);
        tfMonthlyPayment.setText(String.format("$%.2f", loan.getMonthlyPayment()));
        tfTotalPayment.setText(String.format("$%.2f", loan.getTotalPayment()));
    }
}

// Loan sınıfındaki formül:
public double getMonthlyPayment() {
    double monthlyInterestRate = annualInterestRate / 1200;                //!
    return loanAmount * monthlyInterestRate / (1 -
        (1 / Math.pow(1 + monthlyInterestRate, numberOfYears * 12)));
}
public double getTotalPayment() {
    return getMonthlyPayment() * numberOfYears * 12;
}`,
    },
  ],

  "inner-classes": [
    {
      id: "inner-class-rules",
      title: "İç Sınıf Kuralları (ShowInnerClass)",
      label: "İç sınıf kuralları",
      def: "İç sınıf (inner / nested class) başka bir sınıfın kapsamında tanımlanan sınıftır; genellikle yardımcı sınıfları ve dinleyicileri tanımlamak için kullanılır. Kurallar: (1) İç sınıf, dış sınıfın içinde tanımlı veri ve metotlara (private olanlar dahil) DOĞRUDAN erişebilir; böylece dış sınıfın referansını ona geçirmek gerekmez. (2) İç sınıf OuterClassName$InnerClassName.class adlı ayrı bir dosyaya derlenir: ShowInnerClass$InnerClass.class. (3) İç sınıf public, protected veya private bildirilebilir (dış sınıf yalnızca public ya da varsayılan olabilir). (4) İç sınıf static bildirilebilir; static iç sınıfa dış sınıf adıyla erişilir ve static iç sınıf dış sınıfın STATIC OLMAYAN üyelerine erişemez. (5) Nesne oluşturma: static olmayan → OuterClass.InnerClass innerObject = outerObject.new InnerClass(); static → OuterClass.InnerClass innerObject = new OuterClass.InnerClass();",
      code: `public class ShowInnerClass {
    private int data;

    public void m() {
        InnerClass instance = new InnerClass();      // dış sınıf içinde oluşturma
    }

    class InnerClass {                               // → ShowInnerClass$InnerClass.class //!
        public void mi() {
            data++;                                  // dış sınıfın private alanına erişim
            m();                                     // dış sınıfın metodu
        }
    }

    static class StaticInner {
        void f() {
            // data++;    ✗ static iç sınıf, static olmayan üyeye erişemez //!
        }
    }
}

ShowInnerClass outer = new ShowInnerClass();
ShowInnerClass.InnerClass inner = outer.new InnerClass();             // static değil //!
ShowInnerClass.StaticInner s = new ShowInnerClass.StaticInner();       // static`,
      quiz: {
        question: "Test sınıfının içinde tanımlanan A iç sınıfı derlenince hangi dosya oluşur?",
        options: ["A.class", "Test.A.class", "Test$A.class", "Test_A.class"],
        answer: 2,
        explain: "İç sınıflar DışSınıf$İçSınıf.class adıyla derlenir. Anonim iç sınıflar ise numaralandırılır: Test$1.class, Test$2.class.",
      },
    },
    {
      id: "control-circle",
      title: "ControlCircle: EnlargeHandler İç Sınıfı",
      label: "ControlCircle",
      def: "JavaFX ders örneği ControlCircle, bir dairenin Enlarge (büyüt) ve Shrink (küçült) düğmeleriyle boyutlandırılmasıdır. CirclePane sınıfı daireyi içerir ve enlarge()/shrink() metotlarını sağlar. EnlargeHandler, EventHandler<ActionEvent>'i uygulayan bir İÇ sınıftır; iç sınıf olduğu için dış sınıftaki circlePane alanına doğrudan erişebilir. Bağımsız (dış) bir sınıf olsaydı circlePane referansının ona yapıcı aracılığıyla geçirilmesi gerekirdi.",
      code: `public class ControlCircle extends Application {
    private CirclePane circlePane = new CirclePane();

    @Override
    public void start(Stage primaryStage) {
        HBox hBox = new HBox();
        hBox.setSpacing(10);
        hBox.setAlignment(Pos.CENTER);
        Button btEnlarge = new Button("Enlarge");
        Button btShrink = new Button("Shrink");
        hBox.getChildren().add(btEnlarge);
        hBox.getChildren().add(btShrink);

        btEnlarge.setOnAction(new EnlargeHandler());   // iç sınıf işleyici //!

        BorderPane borderPane = new BorderPane();
        borderPane.setCenter(circlePane);
        borderPane.setBottom(hBox);
        BorderPane.setAlignment(hBox, Pos.CENTER);

        Scene scene = new Scene(borderPane, 200, 150);
        primaryStage.setTitle("ControlCircle");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    class EnlargeHandler implements EventHandler<ActionEvent> { //!
        @Override
        public void handle(ActionEvent e) {
            circlePane.enlarge();                      // dış sınıfın alanı
        }
    }
}

class CirclePane extends StackPane {
    private Circle circle = new Circle(50);
    public CirclePane() {
        getChildren().add(circle);
        circle.setStroke(Color.BLACK);
        circle.setFill(Color.WHITE);
    }
    public void enlarge() { circle.setRadius(circle.getRadius() + 2); }
    public void shrink() {
        circle.setRadius(circle.getRadius() > 2 ? circle.getRadius() - 2 : circle.getRadius());
    }
}`,
    },
  ],

  "anonymous-classes": [
    {
      id: "anonymous-rules",
      title: "Anonim İç Sınıf Kuralları (AnonymousHandlerDemo)",
      label: "Anonim kuralları",
      def: "Anonim iç sınıf, tanımlama ve örnek oluşturmayı tek adımda yapan, adı olmayan iç sınıftır: new SuperClassName/InterfaceName() { metotları uygula veya ez }. Kurallar: (1) extends veya implements ifadesi YAZILAMAZ. (2) Süper sınıfın veya arayüzün TÜM soyut metotlarını uygulamalıdır. (3) Örneğini oluştururken her zaman süper sınıfının PARAMETRESİZ yapıcısını kullanır; arayüz uyguluyorsa yapıcı Object()'tir. (4) OuterClassName$n.class biçiminde numaralı dosyalara derlenir: iki anonim sınıflı Test için Test$1.class ve Test$2.class. Ders örneği AnonymousHandlerDemo; New, Open, Save, Print düğmelerinin her birine anonim işleyici kaydeder.",
      code: `public class AnonymousHandlerDemo extends Application {
    @Override
    public void start(Stage primaryStage) {
        HBox hBox = new HBox();
        hBox.setSpacing(10);
        hBox.setAlignment(Pos.CENTER);
        Button btNew = new Button("New");
        Button btOpen = new Button("Open");
        Button btSave = new Button("Save");
        Button btPrint = new Button("Print");
        hBox.getChildren().addAll(btNew, btOpen, btSave, btPrint);

        btNew.setOnAction(new EventHandler<ActionEvent>() {     // → AnonymousHandlerDemo$1 //!
            @Override
            public void handle(ActionEvent e) {
                System.out.println("Process New");
            }
        });
        btOpen.setOnAction(new EventHandler<ActionEvent>() {    // → $2
            @Override
            public void handle(ActionEvent e) {
                System.out.println("Process Open");
            }
        });
        btSave.setOnAction(new EventHandler<ActionEvent>() {    // → $3
            @Override
            public void handle(ActionEvent e) {
                System.out.println("Process Save");
            }
        });
        btPrint.setOnAction(new EventHandler<ActionEvent>() {   // → $4
            @Override
            public void handle(ActionEvent e) {
                System.out.println("Process Print");
            }
        });

        Scene scene = new Scene(hBox, 300, 50);
        primaryStage.setTitle("AnonymousHandlerDemo");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}
// new EventHandler<ActionEvent>() implements ... { }   ✗ implements yazılamaz //!`,
    },
  ],

  lambda: [
    {
      id: "lambda-syntax",
      title: "Lambda Sözdizimi Biçimleri (LambdaHandlerDemo)",
      label: "Lambda biçimleri",
      def: "Lambda ifadesi, kısa yazımla tanımlanmış bir anonim sınıf gibi düşünülebilir. Temel sözdizimi: (type1 param1, type2 param2, ...) -> expression ya da (type1 param1, ...) -> { statements; }. Parametre türleri açıkça yazılabilir veya derleyici çıkarabilir; TEK parametre varsa ve türü yazılmıyorsa parantez de atlanabilir: e -> { ... }. Gövde tek ifadeyse süslü parantez ve return gerekmez. Derleyici lambdayı, tek soyut metotlu (SAM / functional) bir arayüzün nesnesi olarak ele alır; bu yüzden lambda yalnızca SAM arayüz beklenen yerde kullanılabilir.",
      code: `// Dördü de aynı işleyiciyi tanımlar:
btEnlarge.setOnAction((ActionEvent e) -> { circlePane.enlarge(); });  // tür açık
btEnlarge.setOnAction((e) -> { circlePane.enlarge(); });              // tür çıkarıldı
btEnlarge.setOnAction(e -> { circlePane.enlarge(); });                // tek parametre: () yok //!
btEnlarge.setOnAction(e -> circlePane.enlarge());                     // tek ifade: {} yok

// LambdaHandlerDemo
btNew.setOnAction((ActionEvent e) -> {
    System.out.println("Process New");
});
btOpen.setOnAction((e) -> {
    System.out.println("Process Open");
});
btSave.setOnAction(e -> {
    System.out.println("Process Save");
});
btPrint.setOnAction(e -> System.out.println("Process Print")); //!

// Parametresiz ve çok parametreli:
Runnable r = () -> System.out.println("run");
Comparator<String> c = (s1, s2) -> s1.length() - s2.length();`,
      quiz: {
        question: "Hangisi GEÇERSİZ bir lambda ifadesidir?",
        options: [
          "e -> System.out.println(e)",
          "(ActionEvent e) -> { System.out.println(e); }",
          "ActionEvent e -> System.out.println(e)",
          "(e) -> { System.out.println(e); }",
        ],
        answer: 2,
        explain: "Parametre türü açıkça yazılıyorsa parantez zorunludur: (ActionEvent e) -> .... Parantez yalnızca türü yazılmayan TEK parametrede atlanabilir.",
      },
    },
  ],

  "mouse-key-events": [
    {
      id: "mouse-event-methods",
      title: "MouseEvent Metotları ve Fare İşleyicileri (MouseEventDemo)",
      label: "MouseEvent",
      def: "JavaFX MouseEvent metotları: getButton() hangi düğmeye basıldığını (MouseButton.PRIMARY, SECONDARY, MIDDLE, NONE), getClickCount() tıklama sayısını, getX()/getY() kaynak düğüme göre konumu, getSceneX()/getSceneY() sahneye göre, getScreenX()/getScreenY() ekrana göre konumu, isAltDown(), isControlDown(), isMetaDown(), isShiftDown() değiştirici tuşları döndürür. Kayıt: setOnMousePressed, setOnMouseReleased, setOnMouseClicked, setOnMouseEntered, setOnMouseExited, setOnMouseMoved, setOnMouseDragged. Swing'de MouseEvent: getButton(), getClickCount(), getPoint(), getX(), getY(); InputEvent'ten miras: getWhen(), isAltDown(), isControlDown(), isMetaDown(), isShiftDown(). Ders örneği MouseEventDemo (Swing'de MoveMessageDemo) bir metni fareyle sürükler.",
      code: `public class MouseEventDemo extends Application {
    @Override
    public void start(Stage primaryStage) {
        Pane pane = new Pane();
        Text text = new Text(20, 20, "Programming is fun");
        pane.getChildren().addAll(text);
        text.setOnMouseDragged(e -> {          // sürüklerken metni imlece taşı //!
            text.setX(e.getX());
            text.setY(e.getY());
        });
        Scene scene = new Scene(pane, 300, 100);
        primaryStage.setTitle("MouseEventDemo");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}

circlePane.setOnMouseClicked(e -> {
    if (e.getButton() == MouseButton.PRIMARY) circlePane.enlarge();     // sol tık //!
    else if (e.getButton() == MouseButton.SECONDARY) circlePane.shrink(); // sağ tık
    if (e.getClickCount() == 2) System.out.println("Çift tıklama");
});

// Swing (MoveMessageDemo): MouseMotionListener
addMouseMotionListener(new MouseMotionAdapter() {
    @Override
    public void mouseDragged(MouseEvent e) {
        x = e.getX();
        y = e.getY();
        repaint();
    }
});`,
    },
    {
      id: "key-event-methods",
      title: "KeyEvent Metotları ve Tuş Kodları (KeyEventDemo)",
      label: "KeyCode / VK_",
      def: "JavaFX KeyEvent metotları: getCharacter() tuşun karakteri, getCode() tuş kodu (KeyCode), getText() tuşu tanımlayan metin, isAltDown(), isControlDown(), isMetaDown(), isShiftDown(). Kayıt: setOnKeyPressed, setOnKeyReleased, setOnKeyTyped. key-typed olayı yalnızca Unicode karakter üreten tuşlarda oluşur ve getCode() orada KeyCode.UNDEFINED döndürür; ok tuşları gibi karakter üretmeyen tuşlar için pressed/released kullanılır. KeyCode sabitleri: HOME, END, PAGE_UP, PAGE_DOWN, UP, DOWN, LEFT, RIGHT, ESCAPE, TAB, CONTROL, SHIFT, BACK_SPACE, CAPS, NUM_LOCK, ENTER, UNDEFINED, F1–F12, DIGIT0–DIGIT9, A–Z. Swing'de KeyListener: keyPressed, keyReleased, keyTyped; KeyEvent.getKeyChar(), getKeyCode(); sabitler VK_ önekiyle: VK_HOME, VK_END, VK_PGUP, VK_PGDN, VK_UP, VK_DOWN, VK_LEFT, VK_RIGHT, VK_ESCAPE, VK_TAB, VK_CONTROL, VK_SHIFT, VK_BACK_SPACE, VK_CAPS_LOCK, VK_NUM_LOCK, VK_ENTER, VK_UNDEFINED, VK_F1–VK_F12, VK_0–VK_9, VK_A–VK_Z. Klavye olayı alabilmek için düğümün ODAKTA olması gerekir: requestFocus().",
      code: `public class KeyEventDemo extends Application {
    @Override
    public void start(Stage primaryStage) {
        Pane pane = new Pane();
        Text text = new Text(20, 20, "A");
        pane.getChildren().add(text);
        text.setOnKeyPressed(e -> {
            switch (e.getCode()) {                    // ok tuşları: taşı //!
                case DOWN:  text.setY(text.getY() + 10); break;
                case UP:    text.setY(text.getY() - 10); break;
                case LEFT:  text.setX(text.getX() - 10); break;
                case RIGHT: text.setX(text.getX() + 10); break;
                default:
                    if (Character.isLetterOrDigit(e.getText().charAt(0)))
                        text.setText(e.getText());    // harf/rakam: metni değiştir
            }
        });
        Scene scene = new Scene(pane);
        primaryStage.setTitle("KeyEventDemo");
        primaryStage.setScene(scene);
        primaryStage.show();
        text.requestFocus();                          // odak olmadan olay gelmez! //!
    }
}

// Swing karşılığı:
// public void keyPressed(KeyEvent e) {
//     switch (e.getKeyCode()) {
//         case KeyEvent.VK_DOWN: y += 10; break;
//         case KeyEvent.VK_UP:   y -= 10; break;
//         default: keyChar = e.getKeyChar();
//     }
//     repaint();
// }`,
      quiz: {
        question: "KeyEventDemo'da text.requestFocus(); satırı silinirse ne olur?",
        options: [
          "Derleme hatası oluşur",
          "Program çalışır ama metin tuşlara tepki vermez",
          "Yalnızca ok tuşları çalışmaz",
          "KeyCode.UNDEFINED istisnası fırlar",
        ],
        answer: 1,
        explain: "Klavye olayları yalnızca odaktaki (focused) düğüme gönderilir. Text düğümü odak almazsa setOnKeyPressed işleyicisi hiç çağrılmaz.",
      },
    },
  ],

  timer: [
    {
      id: "swing-animation",
      title: "Swing Timer ile Animasyon (AnimationDemo, ClockAnimation)",
      label: "AnimationDemo",
      def: "javax.swing.Timer, belirlenen gecikmeyle (ms) düzenli olarak ActionEvent üreten bir kaynak nesnedir. Yapıcı: Timer(int delay, ActionListener listener). Metotlar: addActionListener(listener), start(), stop(), setDelay(int delay). Animasyonun her adımında durum güncellenir ve repaint() ile panel yeniden çizilir. Ders örneği AnimationDemo, mesajı soldan sağa kaydırır; mesaj sağ kenarı geçince başa döner. ClockAnimation ise Timer(1000, ...) ile saati her saniye günceller.",
      code: `public class AnimationDemo extends JFrame {
    public AnimationDemo() {
        add(new MovingMessagePanel("message moving?"));
    }

    static class MovingMessagePanel extends JPanel {
        private String message = "Welcome to Java";
        private int xCoordinate = 0;
        private int yCoordinate = 20;

        public MovingMessagePanel(String message) {
            this.message = message;
            Timer timer = new Timer(1000, new TimerListener());  // 1 sn aralık //!
            timer.start();
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            if (xCoordinate > getWidth()) xCoordinate = -20;     // başa dön
            xCoordinate += 5;
            g.drawString(message, xCoordinate, yCoordinate);
        }

        class TimerListener implements ActionListener {
            @Override
            public void actionPerformed(ActionEvent e) {
                repaint();                                     // her tikte yeniden çiz //!
            }
        }
    }
}

// ClockAnimation (Swing):
Timer timer = new Timer(1000, e -> {
    clock.setCurrentTime();
    clock.repaint();
});
timer.start();`,
    },
  ],

  /* ===================== GUI · Swing ===================== */
  swing: [
    {
      id: "swing-frame",
      title: "JFrame Temelleri ve Layout Manager'lar",
      label: "JFrame + Layout",
      def: "JFrame üst düzey penceredir. Temel ayarlar: setTitle(\"...\"), setSize(genişlik, yükseklik), setLocationRelativeTo(null) pencereyi ekranın ortasına alır, setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE) kapatınca programı sonlandırır, setVisible(true) pencereyi gösterir (çağrılmazsa pencere görünmez). pack() boyutu bileşenlere göre ayarlar. Bileşenler add() ile eklenir ve yerleşimi layout manager belirler: FlowLayout (soldan sağa akış; JPanel'in varsayılanı), GridLayout(satır, sütun, hgap, vgap) (eşit hücreli ızgara), BorderLayout (EAST, SOUTH, WEST, NORTH, CENTER; JFrame içerik panelinin varsayılanı). JPanel bileşenleri gruplayan alt kaptır.",
      code: `public class MyFrame extends JFrame {
    public MyFrame() {
        setLayout(new BorderLayout(5, 10));                 // JFrame varsayılanı
        JPanel p1 = new JPanel(new GridLayout(4, 3));       // 4 satır × 3 sütun
        for (int i = 1; i <= 9; i++) p1.add(new JButton("" + i));
        p1.add(new JButton("0"));
        p1.add(new JButton("Start"));
        p1.add(new JButton("Stop"));

        JPanel p2 = new JPanel(new BorderLayout());
        p2.add(new JTextField("Time to be displayed here"), BorderLayout.NORTH);
        p2.add(p1, BorderLayout.CENTER);

        add(p2, BorderLayout.EAST);                         //!
        add(new JButton("Food to be placed here"), BorderLayout.CENTER);
    }
    public static void main(String[] args) {
        MyFrame frame = new MyFrame();
        frame.setTitle("The Front View of a Microwave Oven");
        frame.setSize(400, 250);
        frame.setLocationRelativeTo(null);                  // ekranın ortası
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); //!
        frame.setVisible(true);                             // yazılmazsa pencere görünmez
    }
}`,
    },
  ],

  "swing-components": [
    {
      id: "abstract-button",
      title: "AbstractButton ve JButton",
      label: "JButton",
      def: "Düğme, tıklanınca ActionEvent üreten bileşendir. JButton, AbstractButton'ı genişletir. Yapıcılar: JButton() (metinsiz, ikonsuz), JButton(Icon icon), JButton(String text), JButton(String text, Icon icon). AbstractButton özellikleri: text (etiket), icon, pressedIcon (basılıyken gösterilen ikon), rolloverIcon (fare üstündeyken gösterilen ikon), mnemonic (Alt + tuş kısayolu; setMnemonic('L')), horizontalAlignment, verticalAlignment, horizontalTextPosition, verticalTextPosition, iconTextGap (metin ile ikon arası boşluk), selected (seçili durumu).",
      code: `ImageIcon usIcon = new ImageIcon("image/usIcon.gif");
ImageIcon caIcon = new ImageIcon("image/caIcon.gif");
ImageIcon ukIcon = new ImageIcon("image/ukIcon.gif");

JButton jbt = new JButton("Click it", usIcon);          // metin + ikon //!
jbt.setPressedIcon(caIcon);                             // basılıyken
jbt.setRolloverIcon(ukIcon);                            // fare üstündeyken
jbt.setMnemonic('C');                                   // Alt + C kısayolu
jbt.setToolTipText("Bayrak düğmesi");
jbt.addActionListener(e -> System.out.println(e.getActionCommand())); // "Click it" //!`,
    },
    {
      id: "button-alignment",
      title: "Hizalama ve Metin Konumu (Alignment / TextPosition)",
      label: "Hizalama",
      def: "horizontalAlignment: etiketin VE ikonun düğme üzerindeki yatay hizası; SwingConstants.LEFT, CENTER (varsayılan), RIGHT. verticalAlignment: dikey hizası; TOP, CENTER (varsayılan), BOTTOM. horizontalTextPosition: METNİN İKONA göre yatay konumu; LEFT, CENTER, RIGHT (varsayılan RIGHT, yani metin ikonun sağındadır). verticalTextPosition: metnin ikona göre dikey konumu; TOP, CENTER (varsayılan), BOTTOM. Alignment tüm içeriği düğme içinde hizalar, TextPosition ise metin ile ikonun birbirine göre yerini belirler.",
      code: `JButton jbt = new JButton("Text", icon);
// Düğme içinde içeriğin yeri
jbt.setHorizontalAlignment(SwingConstants.RIGHT);      // LEFT · CENTER(vars.) · RIGHT
jbt.setVerticalAlignment(SwingConstants.TOP);          // TOP · CENTER(vars.) · BOTTOM

// Metnin ikona göre yeri
jbt.setHorizontalTextPosition(SwingConstants.LEFT);    // LEFT · CENTER · RIGHT(vars.) //!
jbt.setVerticalTextPosition(SwingConstants.BOTTOM);    // TOP · CENTER(vars.) · BOTTOM
jbt.setIconTextGap(10);`,
      quiz: {
        question: "JButton'da horizontalTextPosition özelliğinin VARSAYILAN değeri nedir?",
        options: ["SwingConstants.LEFT", "SwingConstants.CENTER", "SwingConstants.RIGHT", "SwingConstants.LEADING"],
        answer: 2,
        explain: "Varsayılan olarak metin ikonun SAĞINDA durur (RIGHT). horizontalAlignment ve verticalAlignment'ın varsayılanı ise CENTER'dır.",
      },
    },
    {
      id: "button-demo",
      title: "ButtonDemo: Mesajı Sola/Sağa Kaydırma",
      label: "ButtonDemo",
      def: "Ders örneği ButtonDemo, bir MessagePanel üzerindeki mesajı \"<=\" ve \"=>\" düğmeleriyle sola ve sağa kaydırır. Düğmeler bir JPanel'e konup çerçevenin SOUTH bölgesine, mesaj paneli CENTER'a yerleştirilir. Mnemonic ile Alt+L ve Alt+R kısayolları verilir. İşleyiciler messagePanel.moveLeft() ve moveRight() çağırır. Sonraki örnekler (CheckBoxDemo, RadioButtonDemo, TextFieldDemo) ButtonDemo'yu genişleterek kalıtımla kod yeniden kullanır.",
      code: `public class ButtonDemo extends JFrame {
    protected MessagePanel messagePanel = new MessagePanel("Welcome to Java");
    private JButton jbtLeft = new JButton("<=");
    private JButton jbtRight = new JButton("=>");

    public ButtonDemo() {
        messagePanel.setBackground(Color.white);
        JPanel jpButtons = new JPanel();
        jpButtons.add(jbtLeft);
        jpButtons.add(jbtRight);
        jbtLeft.setMnemonic('L');                          // Alt + L
        jbtRight.setMnemonic('R');
        jbtLeft.setToolTipText("Move message to left");
        jbtRight.setToolTipText("Move message to right");

        setLayout(new BorderLayout());
        add(messagePanel, BorderLayout.CENTER);
        add(jpButtons, BorderLayout.SOUTH);                //!

        jbtLeft.addActionListener(e -> messagePanel.moveLeft());   //!
        jbtRight.addActionListener(e -> messagePanel.moveRight());
    }
}`,
    },
    {
      id: "jcheckbox",
      title: "JCheckBox ve CheckBoxDemo",
      label: "JCheckBox",
      def: "JCheckBox, kullanıcının bir seçimi açıp kapatmasını sağlar; JToggleButton → AbstractButton'dan türer. Yapıcılar: JCheckBox(), JCheckBox(String text), JCheckBox(String text, boolean selected), JCheckBox(Icon icon), JCheckBox(String text, Icon icon), JCheckBox(String text, Icon icon, boolean selected). isSelected() seçili olup olmadığını döndürür, setSelected(boolean) değiştirir. Tıklanınca ItemEvent ve ActionEvent üretir. Ders örneği CheckBoxDemo, ButtonDemo'yu genişletir; Centered, Bold, Italic onay kutularıyla mesajın hizasını ve yazı tipini değiştirir.",
      code: `public class CheckBoxDemo extends ButtonDemo {                 // kalıtımla yeniden kullanım
    private JCheckBox jchkCentered = new JCheckBox("Centered");
    private JCheckBox jchkBold = new JCheckBox("Bold");
    private JCheckBox jchkItalic = new JCheckBox("Italic");

    public CheckBoxDemo() {
        jchkCentered.setMnemonic('C');
        jchkBold.setMnemonic('B');
        jchkItalic.setMnemonic('I');
        JPanel jpCheckBoxes = new JPanel(new GridLayout(3, 1));
        jpCheckBoxes.add(jchkCentered);
        jpCheckBoxes.add(jchkBold);
        jpCheckBoxes.add(jchkItalic);
        add(jpCheckBoxes, BorderLayout.EAST);

        jchkCentered.addActionListener(e ->
            messagePanel.setCentered(jchkCentered.isSelected()));    //!
        jchkBold.addActionListener(e -> setNewFont());
        jchkItalic.addActionListener(e -> setNewFont());
    }

    private void setNewFont() {
        int fontStyle = Font.PLAIN;
        fontStyle += (jchkBold.isSelected() ? Font.BOLD : Font.PLAIN);       //!
        fontStyle += (jchkItalic.isSelected() ? Font.ITALIC : Font.PLAIN);
        Font font = messagePanel.getFont();
        messagePanel.setFont(new Font(font.getName(), fontStyle, font.getSize()));
    }
}`,
    },
    {
      id: "jradiobutton",
      title: "JRadioButton ve ButtonGroup (RadioButtonDemo)",
      label: "JRadioButton",
      def: "Radyo düğmeleri, bir grup seçenekten YALNIZCA BİRİNİN seçilmesini sağlar. JRadioButton, JToggleButton'dan türer; yapıcıları JCheckBox'ınkilerle aynıdır. Düğmelerin birbirini dışlaması için hepsi aynı ButtonGroup'a eklenmelidir: ButtonGroup group = new ButtonGroup(); group.add(jrb1); group.add(jrb2);. ButtonGroup bir bileşen DEĞİLDİR, panele eklenmez; düğmeler yine ayrı ayrı panele eklenir. Ders örneği RadioButtonDemo, CheckBoxDemo'yu genişletir ve Red/Green/Blue seçenekleriyle mesajın rengini değiştirir.",
      code: `public class RadioButtonDemo extends CheckBoxDemo {
    private JRadioButton jrbRed, jrbGreen, jrbBlue;

    public RadioButtonDemo() {
        JPanel jpRadioButtons = new JPanel(new GridLayout(3, 1));
        jpRadioButtons.add(jrbRed = new JRadioButton("Red"));
        jpRadioButtons.add(jrbGreen = new JRadioButton("Green"));
        jpRadioButtons.add(jrbBlue = new JRadioButton("Blue"));
        add(jpRadioButtons, BorderLayout.WEST);

        ButtonGroup group = new ButtonGroup();     // tek seçim için şart //!
        group.add(jrbRed);
        group.add(jrbGreen);
        group.add(jrbBlue);

        jrbRed.setMnemonic('E');
        jrbGreen.setMnemonic('G');
        jrbBlue.setMnemonic('U');

        jrbRed.addActionListener(e -> messagePanel.setForeground(Color.red));  //!
        jrbGreen.addActionListener(e -> messagePanel.setForeground(Color.green));
        jrbBlue.addActionListener(e -> messagePanel.setForeground(Color.blue));
        jrbBlue.setSelected(true);
        messagePanel.setForeground(Color.blue);
    }
}`,
      quiz: {
        question: "Üç JRadioButton panele eklendi ama ButtonGroup'a eklenmedi. Ne olur?",
        options: [
          "Derleme hatası oluşur",
          "Düğmeler görünmez",
          "Birden çok düğme aynı anda seçilebilir",
          "Yalnızca ilk düğme seçilebilir",
        ],
        answer: 2,
        explain: "Birbirini dışlama davranışını ButtonGroup sağlar. Gruplanmayan radyo düğmeleri onay kutuları gibi bağımsız davranır.",
      },
    },
    {
      id: "jlabel",
      title: "JLabel",
      label: "JLabel",
      def: "JLabel metin, ikon veya ikisini birden gösteren, kullanıcı etkileşimi OLMAYAN bir bileşendir. Yapıcılar: JLabel(), JLabel(Icon icon), JLabel(Icon icon, int hAlignment), JLabel(String text), JLabel(String text, Icon icon, int hAlignment), JLabel(String text, int hAlignment). Özellikleri JButton'ınkilerle aynıdır: text, icon, horizontalAlignment, verticalAlignment, horizontalTextPosition, verticalTextPosition, iconTextGap.",
      code: `JLabel jlbl = new JLabel("Grapes", new ImageIcon("image/grapes.gif"),
                         SwingConstants.CENTER);            //!
jlbl.setHorizontalTextPosition(SwingConstants.CENTER);      // metin ikonun ortasında
jlbl.setVerticalTextPosition(SwingConstants.BOTTOM);        // ...ve altında //!
jlbl.setIconTextGap(5);`,
    },
    {
      id: "jtextfield",
      title: "JTextField ve TextFieldDemo",
      label: "JTextField",
      def: "JTextField tek satırlık metin girişi içindir; JTextComponent'ten türer. Yapıcılar: JTextField() boş, JTextField(int columns) belirtilen sütun genişliğinde, JTextField(String text) başlangıç metniyle, JTextField(String text, int columns). Özellikler: text, horizontalAlignment, editable (false ise kullanıcı değiştiremez), columns. Metotlar: getText(), setText(String), setEditable(boolean), setColumns(int) (sonrasında revalidate() gerekir). Metin alanında Enter'a basılınca ActionEvent üretilir. Şifre girişi için alt sınıfı JPasswordField kullanılır. Ders örneği TextFieldDemo, girilen metni Enter ile mesaj paneline yazar.",
      code: `public class TextFieldDemo extends RadioButtonDemo {
    private JTextField jtfMessage = new JTextField(10);    // 10 sütun genişlik

    public TextFieldDemo() {
        JPanel jpTextField = new JPanel();
        jpTextField.setLayout(new BorderLayout(5, 0));
        jpTextField.add(new JLabel("Enter a new message"), BorderLayout.WEST);
        jpTextField.add(jtfMessage, BorderLayout.CENTER);
        add(jpTextField, BorderLayout.NORTH);
        jtfMessage.setHorizontalAlignment(JTextField.RIGHT);

        jtfMessage.addActionListener(e -> {                // Enter → ActionEvent //!
            messagePanel.setMessage(jtfMessage.getText());
            jtfMessage.requestFocusInWindow();
        });
    }
}

JPasswordField jpf = new JPasswordField(8);               // girilen karakterler gizlenir
char[] password = jpf.getPassword();`,
    },
    {
      id: "jtextarea",
      title: "JTextArea ve JScrollPane (TextAreaDemo)",
      label: "JTextArea",
      def: "JTextArea çok satırlı metin girişi içindir. Yapıcılar: JTextArea(), JTextArea(int rows, int columns), JTextArea(String s, int rows, int columns). Özellikler: lineWrap (satır kaydırma), wrapStyleWord (kelime sınırında kaydırma), rows, lineCount, tabSize. Metotlar: append(String s) sona ekler, insert(String s, int pos) belirtilen konuma ekler, replaceRange(String s, int start, int end) aralığı değiştirir, getLineCount(). JTextArea kendiliğinden kaydırma çubuğu göstermez; JScrollPane içine konmalıdır: new JScrollPane(jta). Ders örneği TextAreaDemo, DescriptionPanel'de bir resim, başlık ve düzenlenemez açıklama metni gösterir.",
      code: `public class DescriptionPanel extends JPanel {
    private JLabel jlblImageTitle = new JLabel();
    private JTextArea jtaDescription = new JTextArea();

    public DescriptionPanel() {
        jlblImageTitle.setHorizontalAlignment(JLabel.CENTER);
        jlblImageTitle.setHorizontalTextPosition(JLabel.CENTER);
        jlblImageTitle.setVerticalTextPosition(JLabel.BOTTOM);
        jlblImageTitle.setFont(new Font("SansSerif", Font.BOLD, 16));
        jtaDescription.setFont(new Font("Serif", Font.PLAIN, 14));

        jtaDescription.setLineWrap(true);              // satırı kaydır //!
        jtaDescription.setWrapStyleWord(true);         // kelimeyi bölme
        jtaDescription.setEditable(false);

        JScrollPane scrollPane = new JScrollPane(jtaDescription);  // kaydırma çubuğu //!
        setLayout(new BorderLayout(5, 5));
        add(scrollPane, BorderLayout.CENTER);
        add(jlblImageTitle, BorderLayout.WEST);
    }
    public void setTitle(String title) { jlblImageTitle.setText(title); }
    public void setImageIcon(ImageIcon icon) { jlblImageTitle.setIcon(icon); }
    public void setDescription(String text) { jtaDescription.setText(text); }
}

JTextArea jta = new JTextArea("Hello", 5, 20);
jta.append(" world");                  // sona ekle
jta.insert("Say: ", 0);                // başa ekle
jta.replaceRange("Hi", 5, 10);         // 5–10 aralığını değiştir`,
    },
    {
      id: "jcombobox",
      title: "JComboBox ve itemStateChanged (ComboBoxDemo)",
      label: "JComboBox",
      def: "JComboBox (açılır liste / choice list) kullanıcının listeden TEK bir öğe seçmesini sağlar. Yapıcılar: JComboBox(), JComboBox(Object[] items). Metotlar: addItem(Object), getItemAt(int index), getItemCount(), getSelectedIndex(), setSelectedIndex(int), getSelectedItem(), setSelectedItem(Object), removeItem(Object), removeItemAt(int), removeAllItems(). Seçim değişince hem ActionEvent hem ItemEvent üretilir. DİKKAT: Seçim değiştiğinde ItemEvent İKİ kez gelir (önceki öğe DESELECTED, yeni öğe SELECTED); yalnızca yeni seçimi işlemek için e.getStateChange() == ItemEvent.SELECTED kontrolü yapılır. Ders örneği ComboBoxDemo, seçilen ülkenin bayrağını ve açıklamasını gösterir.",
      code: `public class ComboBoxDemo extends JFrame {
    private String[] flagTitles = {"Canada", "China", "Denmark",
        "France", "Germany", "India", "Norway", "United Kingdom", "United States of America"};
    private ImageIcon[] flagImage = { /* ... 9 bayrak ikonu ... */ };
    private String[] flagDescription = new String[9];
    private DescriptionPanel descriptionPanel = new DescriptionPanel();
    private JComboBox<String> jcbo = new JComboBox<>(flagTitles);   //!

    public ComboBoxDemo() {
        setDisplay(0);
        add(jcbo, BorderLayout.NORTH);
        add(descriptionPanel, BorderLayout.CENTER);

        jcbo.addItemListener(new ItemListener() {
            @Override
            public void itemStateChanged(ItemEvent e) {
                if (e.getStateChange() == ItemEvent.SELECTED)        // iki olaydan biri //!
                    setDisplay(jcbo.getSelectedIndex());
            }
        });
    }

    public void setDisplay(int index) {
        descriptionPanel.setTitle(flagTitles[index]);
        descriptionPanel.setImageIcon(flagImage[index]);
        descriptionPanel.setDescription(flagDescription[index]);
    }
}`,
    },
    {
      id: "jlist",
      title: "JList ve ListSelectionListener (ListDemo)",
      label: "JList",
      def: "JList, JComboBox'a benzer ama birden çok öğenin AYNI ANDA seçilmesine izin verebilir ve öğeleri açılır menü yerine liste kutusunda gösterir. Yapıcılar: JList(), JList(Object[] items). Özellikler: selectionMode (ListSelectionModel.SINGLE_SELECTION tek öğe; SINGLE_INTERVAL_SELECTION ardışık tek aralık; MULTIPLE_INTERVAL_SELECTION birden çok aralık, varsayılan), visibleRowCount (görünen satır sayısı), selectionBackground, selectionForeground. Metotlar: getSelectedIndex(), getSelectedIndices(), getSelectedValue(), getSelectedValuesList(), setSelectedIndex(), setSelectedIndices(). Seçim değişince ListSelectionEvent üretilir; işleyici ListSelectionListener.valueChanged(ListSelectionEvent). Kaydırma için JScrollPane içine konur. Ders örneği ListDemo, seçilen ülkelerin bayraklarını gösterir.",
      code: `public class ListDemo extends JFrame {
    final int NUMBER_OF_FLAGS = 9;
    private String[] flagTitles = {"Canada", "China", "Denmark", "France", "Germany",
        "India", "Norway", "United Kingdom", "United States of America"};
    private JList<String> jlst = new JList<>(flagTitles);
    private ImageIcon[] imageIcons = { /* 9 bayrak */ };
    private JLabel[] jlblImageViewer = new JLabel[NUMBER_OF_FLAGS];

    public ListDemo() {
        JPanel p = new JPanel(new GridLayout(3, 3, 5, 5));
        for (int i = 0; i < NUMBER_OF_FLAGS; i++)
            p.add(jlblImageViewer[i] = new JLabel());
        add(new JScrollPane(jlst), BorderLayout.WEST);          //!
        add(p, BorderLayout.CENTER);

        jlst.setSelectionMode(ListSelectionModel.MULTIPLE_INTERVAL_SELECTION);
        jlst.addListSelectionListener(new ListSelectionListener() {
            @Override
            public void valueChanged(ListSelectionEvent e) {     //!
                int[] indices = jlst.getSelectedIndices();
                int i;
                for (i = 0; i < indices.length; i++)
                    jlblImageViewer[i].setIcon(imageIcons[indices[i]]);
                for (; i < NUMBER_OF_FLAGS; i++)                 // kalanları temizle
                    jlblImageViewer[i].setIcon(null);
            }
        });
    }
}`,
      quiz: {
        question: "JList'te yalnızca ARDIŞIK öğelerden oluşan tek bir aralığın seçilmesine izin veren mod hangisidir?",
        options: ["SINGLE_SELECTION", "SINGLE_INTERVAL_SELECTION", "MULTIPLE_INTERVAL_SELECTION", "CONTIGUOUS_SELECTION"],
        answer: 1,
        explain: "SINGLE_SELECTION tek öğe, SINGLE_INTERVAL_SELECTION tek ardışık aralık, MULTIPLE_INTERVAL_SELECTION (varsayılan) birden çok aralık seçtirir.",
      },
    },
    {
      id: "jscrollbar",
      title: "JScrollBar ve AdjustmentListener (ScrollBarDemo)",
      label: "JScrollBar",
      def: "JScrollBar, kullanıcının bir değer aralığından değer seçmesini sağlar. Yapıcılar: JScrollBar() (dikey), JScrollBar(int orientation) (JScrollBar.HORIZONTAL / VERTICAL), JScrollBar(int orientation, int value, int extent, int min, int max). Özellikler: orientation, maximum (varsayılan 100), minimum (0), value, visibleAmount (kaydırıcı genişliği, varsayılan 10), unitIncrement (oka tıklayınca değişim, 1), blockIncrement (boşluğa tıklayınca değişim, 10). Kullanıcının ulaşabileceği gerçek en büyük değer maximum − visibleAmount'tur. Değer değişince AdjustmentEvent üretilir; işleyici AdjustmentListener.adjustmentValueChanged(AdjustmentEvent). Ders örneği ScrollBarDemo, yatay ve dikey çubuklarla mesajın konumunu değiştirir.",
      code: `public class ScrollBarDemo extends JFrame {
    private JScrollBar jscbHort = new JScrollBar(JScrollBar.HORIZONTAL); //!
    private JScrollBar jscbVert = new JScrollBar(JScrollBar.VERTICAL);
    private MessagePanel messagePanel = new MessagePanel("Welcome to Java");

    public ScrollBarDemo() {
        setLayout(new BorderLayout());
        add(messagePanel, BorderLayout.CENTER);
        add(jscbVert, BorderLayout.EAST);
        add(jscbHort, BorderLayout.SOUTH);

        jscbHort.addAdjustmentListener(new AdjustmentListener() {
            @Override
            public void adjustmentValueChanged(AdjustmentEvent e) {      //!
                double value = jscbHort.getValue();
                double maximumValue = jscbHort.getMaximum();
                double newX = (value * messagePanel.getWidth() / maximumValue);
                messagePanel.setXCoordinate((int) newX);
            }
        });
        jscbVert.addAdjustmentListener(e -> {
            double value = jscbVert.getValue();
            double maximumValue = jscbVert.getMaximum();
            double newY = (value * messagePanel.getHeight() / maximumValue);
            messagePanel.setYCoordinate((int) newY);
        });
    }
}`,
    },
    {
      id: "jslider",
      title: "JSlider ve ChangeListener (SliderDemo)",
      label: "JSlider",
      def: "JSlider, JScrollBar'a benzer ama daha fazla özelliği ve görünüm seçeneği vardır. Yapıcılar: JSlider() (yatay, min 0, max 100, değer 50), JSlider(int min, int max), JSlider(int min, int max, int value), JSlider(int orientation), JSlider(int orientation, int min, int max, int value). Özellikler: maximum, minimum, value, orientation, paintLabels (değer etiketleri), paintTicks (çentikler), paintTrack (iz), majorTickSpacing (büyük çentik aralığı), minorTickSpacing, inverted (değerleri ters çevir). Değer değişince ChangeEvent üretilir; işleyici ChangeListener.stateChanged(ChangeEvent). Dikey kaydırıcının değeri AŞAĞIDAN yukarı artar; ders örneği SliderDemo bu yüzden dikey kaydırıcıyı setInverted(true) ile ters çevirir.",
      code: `public class SliderDemo extends JFrame {
    private JSlider jsldHort = new JSlider(JSlider.HORIZONTAL);
    private JSlider jsldVert = new JSlider(JSlider.VERTICAL);
    private MessagePanel messagePanel = new MessagePanel("Welcome to Java");

    public SliderDemo() {
        add(messagePanel, BorderLayout.CENTER);
        add(jsldVert, BorderLayout.EAST);
        add(jsldHort, BorderLayout.SOUTH);

        jsldHort.setMaximum(50);
        jsldHort.setPaintLabels(true);
        jsldHort.setPaintTicks(true);
        jsldHort.setMajorTickSpacing(10);
        jsldHort.setMinorTickSpacing(1);
        jsldHort.setPaintTrack(false);
        jsldVert.setInverted(true);                 // değer yukarıdan aşağı artsın //!
        jsldVert.setMaximum(10);
        jsldVert.setPaintLabels(true);
        jsldVert.setPaintTicks(true);
        jsldVert.setMajorTickSpacing(10);
        jsldVert.setMinorTickSpacing(1);

        jsldHort.addChangeListener(new ChangeListener() {
            @Override
            public void stateChanged(ChangeEvent e) {                    //!
                double value = jsldHort.getValue();
                double maximumValue = jsldHort.getMaximum();
                double newX = (value * messagePanel.getWidth() / maximumValue);
                messagePanel.setXCoordinate((int) newX);
            }
        });
        jsldVert.addChangeListener(e -> {
            double value = jsldVert.getValue();
            double maximumValue = jsldVert.getMaximum();
            double newY = (value * messagePanel.getHeight() / maximumValue);
            messagePanel.setYCoordinate((int) newY);
        });
    }
}`,
    },
    {
      id: "multiple-windows",
      title: "Birden Çok Pencere Oluşturma (MultipleWindowsDemo)",
      label: "Çoklu pencere",
      def: "Bir uygulama birden çok pencere açabilir: ek pencere için yeni bir JFrame oluşturulur, içine bileşen eklenir ve gerektiğinde setVisible(true) ile gösterilir. Ders örneği MultipleWindowsDemo: ana pencerede bir JTextArea ve \"Show Histogram\" düğmesi vardır; düğmeye basılınca metindeki harflerin sayısı hesaplanır ve ikinci penceredeki Histogram paneline aktarılır. Alt pencerede setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE) KULLANILMAMALIDIR, çünkü alt pencere kapatılınca tüm uygulama sonlanır; varsayılan HIDE_ON_CLOSE pencereyi yalnızca gizler.",
      code: `public class MultipleWindowsDemo extends JFrame {
    private JTextArea jta;
    private JButton jbtShowHistogram = new JButton("Show Histogram");
    private Histogram histogram = new Histogram();
    private JFrame histogramFrame = new JFrame();          // ikinci pencere //!

    public MultipleWindowsDemo() {
        JScrollPane scrollPane = new JScrollPane(jta = new JTextArea());
        scrollPane.setPreferredSize(new Dimension(300, 200));
        jta.setWrapStyleWord(true);
        jta.setLineWrap(true);
        add(scrollPane, BorderLayout.CENTER);
        add(jbtShowHistogram, BorderLayout.SOUTH);

        jbtShowHistogram.addActionListener(e -> {
            int[] count = countLetters();
            histogram.showHistogram(count);
            histogramFrame.setVisible(true);                // göster //!
        });

        histogramFrame.add(histogram);
        histogramFrame.pack();
        histogramFrame.setTitle("Histogram");
        // EXIT_ON_CLOSE yazılmaz: alt pencere kapanınca uygulama kapanmasın
    }

    private int[] countLetters() {
        int[] count = new int[26];
        String text = jta.getText();
        for (int i = 0; i < text.length(); i++) {
            char character = text.charAt(i);
            if ((character >= 'A') && (character <= 'Z')) count[character - 'A']++;
            else if ((character >= 'a') && (character <= 'z')) count[character - 'a']++;
        }
        return count;
    }
}`,
    },
  ],

  /* ===================== GUI · JavaFX Temelleri ===================== */
  javafx: [
    {
      id: "fx-structure",
      title: "JavaFX Program Yapısı ve AWT → Swing → JavaFX",
      label: "Application yapısı",
      def: "AWT (Abstract Windows Toolkit) basit GUI'ler için tasarlanmıştı ama platforma özgü hatalara açıktı (ağır / heavyweight bileşenler). Swing, bileşenleri doğrudan tuval üzerine çizerek bu sorunları giderdi (hafif / lightweight). JavaFX ise daha yeni bir platformdur: CSS ile stil, 3B grafik, dokunmatik destek, zengin animasyonlar ve web tarayıcısında çalışma (RIA). Temel yapı: sınıf javafx.application.Application'ı genişletir ve start(Stage primaryStage) metodunu ezer. Hiyerarşi: Stage (pencere) → Scene (içerik) → Parent (Pane, Control, Group) → Node'lar (Shape, ImageView, UI kontrolleri). Stage nesnesi (primary stage) JVM tarafından otomatik oluşturulur. main metodu Application.launch(args) çağırır; JavaFX'i destekleyen ortamlarda main yazılmasa da çalışır. Ek pencereler new Stage() ile açılır.",
      code: `import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.stage.Stage;

public class MyJavaFX extends Application {               //!
    @Override
    public void start(Stage primaryStage) {               // JVM çağırır //!
        Button btOK = new Button("OK");
        Scene scene = new Scene(btOK, 200, 250);           // kök düğüm + boyut
        primaryStage.setTitle("MyJavaFX");
        primaryStage.setScene(scene);                      // sahneyi sahneye koy
        primaryStage.show();                               // pencereyi göster
    }
    public static void main(String[] args) {
        Application.launch(args);                          // IDE destekliyorsa gerekmez
    }
}

// MultipleStageDemo: ikinci pencere
Stage stage = new Stage();
stage.setTitle("Second Stage");
stage.setScene(new Scene(new Button("New Stage"), 100, 100));
stage.setResizable(false);                                 // boyutlandırılamaz
stage.show();`,
    },
    {
      id: "fx-binding",
      title: "Property Binding (Özellik Bağlama)",
      label: "Binding",
      def: "Bağlama (binding), hedef nesnenin değerini kaynak nesnenin değerine bağlar; kaynak değişince hedef OTOMATİK güncellenir: target.bind(source). Hedef bir binding property, kaynak bir binding property veya ifade (ObservableValue) olmalıdır. JavaFX'te her binding property için üç metot kuralı vardır: değer okuyucu getX(), değer atayıcı setX(value) ve özellik okuyucu xProperty() (ör. circle.centerXProperty()). DoubleProperty, IntegerProperty, LongProperty, FloatProperty, BooleanProperty, StringProperty soyut sınıflardır; somut sürümleri SimpleDoubleProperty, SimpleIntegerProperty vb.'dir. Tek yönlü bağlama: d1.bind(d2) (yalnızca d2 → d1). Çift yönlü bağlama: d1.bindBidirectional(d2) (ikisi de birbirini günceller). Sayısal özellikler add, subtract, multiply, divide metotlarıyla ifade oluşturur.",
      code: `// ShowCircleCentered: pencere boyutu değişse de daire ortada kalır
Pane pane = new Pane();
Circle circle = new Circle();
circle.centerXProperty().bind(pane.widthProperty().divide(2));   //!
circle.centerYProperty().bind(pane.heightProperty().divide(2));
circle.setRadius(50);
pane.getChildren().add(circle);

// BindingDemo
DoubleProperty d1 = new SimpleDoubleProperty(1);
DoubleProperty d2 = new SimpleDoubleProperty(2);
d1.bind(d2);                                     // d1 artık d2'yi izler //!
System.out.println("d1 is " + d1.getValue() + " and d2 is " + d2.getValue());
// d1 is 2.0 and d2 is 2.0
d2.setValue(70.2);
System.out.println("d1 is " + d1.getValue() + " and d2 is " + d2.getValue());
// d1 is 70.2 and d2 is 70.2

// Çift yönlü
DoubleProperty a = new SimpleDoubleProperty(1), b = new SimpleDoubleProperty(2);
a.bindBidirectional(b);
a.setValue(5);             // b de 5.0 olur`,
      quiz: {
        question: "d1.bind(d2); sonrası d2.setValue(70.2); çağrılırsa d1'in değeri ne olur?",
        options: ["1.0 (değişmez)", "2.0", "70.2", "Derleme hatası: bind yalnızca Pane'de"],
        answer: 2,
        explain: "Tek yönlü bağlamada hedef (d1) kaynağı (d2) izler; d2 değişince d1 otomatik güncellenir. Tersi geçerli değildir: bağlı d1'e set yapmak RuntimeException fırlatır.",
      },
    },
    {
      id: "fx-style-rotate",
      title: "Ortak Düğüm Özellikleri: style ve rotate (NodeStyleRotateDemo)",
      label: "style / rotate",
      def: "Tüm Node'larda ortak iki özellik: style ve rotate. style, JavaFX CSS ile görünüm verir; özellik adları -fx- önekiyle yazılır ve birden çok özellik noktalı virgülle ayrılır: node.setStyle(\"-fx-border-color: red; -fx-background-color: lightgray;\"). rotate, düğümü MERKEZİ etrafında derece cinsinden döndürür; pozitif değer SAAT YÖNÜNDE döndürür: button.setRotate(80).",
      code: `public class NodeStyleRotateDemo extends Application {
    @Override
    public void start(Stage primaryStage) {
        StackPane pane = new StackPane();
        Button btOK = new Button("OK");
        btOK.setStyle("-fx-border-color: blue;");                 // JavaFX CSS //!
        pane.getChildren().add(btOK);

        pane.setRotate(45);                                       // saat yönünde 45° //!
        pane.setStyle("-fx-border-color: red; -fx-background-color: lightgray;");

        Scene scene = new Scene(pane, 200, 250);
        primaryStage.setTitle("NodeStyleRotateDemo");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}`,
    },
    {
      id: "fx-color",
      title: "Color Sınıfı",
      label: "Color",
      def: "javafx.scene.paint.Color, Paint'in alt sınıfıdır ve renkleri RGBA ile tanımlar. Yapıcı: new Color(r, g, b, opacity); r, g, b ve opacity 0.0–1.0 aralığındadır (opacity 0.0 tamamen saydam, 1.0 tamamen opak). Static yardımcılar: Color.color(r, g, b) ve Color.color(r, g, b, opacity) (0.0–1.0), Color.rgb(r, g, b) ve Color.rgb(r, g, b, opacity) (r, g, b: 0–255 tam sayı). getRed(), getGreen(), getBlue(), getOpacity() bileşenleri; brighter() ve darker() daha açık/koyu YENİ bir Color döndürür (Color değişmezdir / immutable). Hazır sabitler: Color.RED, BLACK, BLUE, WHITE, GREEN, YELLOW, BEIGE...",
      code: `Color c1 = new Color(0.25, 0.14, 0.333, 0.51);   // 0.0–1.0 //!
Color c2 = Color.color(0.5, 0.5, 0.5);            // gri, opak
Color c3 = Color.rgb(255, 0, 0);                  // 0–255 → kırmızı //!
Color c4 = Color.rgb(0, 0, 255, 0.5);             // yarı saydam mavi
Color c5 = Color.RED.darker();                    // yeni nesne
circle.setFill(c1);
circle.setStroke(Color.BLACK);`,
    },
    {
      id: "fx-font",
      title: "Font Sınıfı (FontDemo)",
      label: "Font",
      def: "javafx.scene.text.Font yazı tipini ad, kalınlık (weight), duruş (posture) ve boyutla tanımlar. Yapıcılar: new Font(double size), new Font(String name, double size). Static fabrika metotları: Font.font(name, size), Font.font(name, weight, size), Font.font(name, weight, posture, size). Kalınlık sabitleri FontWeight: THIN, EXTRA_LIGHT, LIGHT, NORMAL, MEDIUM, SEMI_BOLD, BOLD, EXTRA_BOLD, BLACK. Duruş sabitleri FontPosture: ITALIC, REGULAR. Font.getFamilies() sistemdeki font ailelerini, Font.getFontNames() font adlarını listeler.",
      code: `public class FontDemo extends Application {
    @Override
    public void start(Stage primaryStage) {
        Pane pane = new StackPane();
        Circle circle = new Circle();
        circle.setRadius(50);
        circle.setStroke(Color.BLACK);
        circle.setFill(new Color(0.5, 0.5, 0.5, 0.1));
        pane.getChildren().add(circle);

        Label label = new Label("JavaFX");
        label.setFont(Font.font("Times New Roman",
            FontWeight.BOLD, FontPosture.ITALIC, 20));          // ad, kalınlık, duruş, boyut //!
        pane.getChildren().add(label);

        Scene scene = new Scene(pane);
        primaryStage.setTitle("FontDemo");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}`,
    },
    {
      id: "fx-image",
      title: "Image ve ImageView (ShowImage)",
      label: "Image / ImageView",
      def: "javafx.scene.image.Image bir görüntüyü dosyadan veya URL'den YÜKLER: new Image(\"image/us.gif\") ya da new Image(\"http://...\"). javafx.scene.image.ImageView bir Image'ı GÖSTEREN düğümdür: new ImageView(image) veya new ImageView(\"image/us.gif\"). ImageView özellikleri: fitHeight, fitWidth (sığdırma boyutu), x, y, image, preserveRatio; Node olduğu için setRotate da kullanılabilir. Bir Image nesnesi birden çok ImageView tarafından paylaşılabilir, ama bir ImageView (her düğüm gibi) aynı anda yalnızca BİR yerde gösterilebilir.",
      code: `public class ShowImage extends Application {
    @Override
    public void start(Stage primaryStage) {
        Pane pane = new HBox(10);
        pane.setPadding(new Insets(5, 5, 5, 5));
        Image image = new Image("image/us.gif");              // yükle //!
        pane.getChildren().add(new ImageView(image));         // göster

        ImageView imageView2 = new ImageView(image);          // aynı Image paylaşılır //!
        imageView2.setFitHeight(100);
        imageView2.setFitWidth(100);
        pane.getChildren().add(imageView2);

        ImageView imageView3 = new ImageView(image);
        imageView3.setRotate(90);
        pane.getChildren().add(imageView3);

        Scene scene = new Scene(pane);
        primaryStage.setTitle("ShowImage");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}`,
    },
    {
      id: "clockpane-math",
      title: "ClockPane: İbre Koordinatları ve Saat Yüzü",
      label: "Saat ibreleri",
      def: "Analog saatte bir ibrenin uç noktası: endX = centerX + handLength × sin(θ), endY = centerY − handLength × cos(θ). Ekranda y aşağı doğru arttığı için cos teriminin önünde EKSİ vardır. Açılar: saniye θ = second × (2π / 60), dakika θ = minute × (2π / 60), saat θ = (hour + minute / 60.0) × (2π / 12). İbre uzunlukları: saniye 0.8 × r, dakika 0.65 × r, saat 0.5 × r. Saat yüzündeki 12, 9, 3, 6 rakamları Text düğümleriyle merkeze göre konumlanır. Ders örneği ClockPane, Pane'i genişletir; hour, minute, second özellikleri ve paintClock() metodu vardır; boyut değişince yeniden çizer.",
      code: `protected void paintClock() {
    double clockRadius = Math.min(w, h) * 0.8 * 0.5;
    double centerX = w / 2;
    double centerY = h / 2;

    Circle circle = new Circle(centerX, centerY, clockRadius);
    circle.setFill(Color.WHITE);
    circle.setStroke(Color.BLACK);
    Text t1 = new Text(centerX - 5, centerY - clockRadius + 12, "12");
    Text t2 = new Text(centerX - clockRadius + 3, centerY + 5, "9");
    Text t3 = new Text(centerX + clockRadius - 10, centerY + 3, "3");
    Text t4 = new Text(centerX - 3, centerY + clockRadius - 3, "6");

    // Saniye ibresi
    double sLength = clockRadius * 0.8;
    double secondX = centerX + sLength * Math.sin(second * (2 * Math.PI / 60)); //!
    double secondY = centerY - sLength * Math.cos(second * (2 * Math.PI / 60));
    Line sLine = new Line(centerX, centerY, secondX, secondY);
    sLine.setStroke(Color.RED);

    // Dakika ibresi
    double mLength = clockRadius * 0.65;
    double xMinute = centerX + mLength * Math.sin(minute * (2 * Math.PI / 60));
    double minuteY = centerY - mLength * Math.cos(minute * (2 * Math.PI / 60));
    Line mLine = new Line(centerX, centerY, xMinute, minuteY);
    mLine.setStroke(Color.BLUE);

    // Saat ibresi
    double hLength = clockRadius * 0.5;
    double hourX = centerX + hLength * Math.sin((hour % 12 + minute / 60.0) * (2 * Math.PI / 12)); //!
    double hourY = centerY - hLength * Math.cos((hour % 12 + minute / 60.0) * (2 * Math.PI / 12));
    Line hLine = new Line(centerX, centerY, hourX, hourY);
    hLine.setStroke(Color.GREEN);

    getChildren().clear();
    getChildren().addAll(circle, t1, t2, t3, t4, sLine, mLine, hLine);
}`,
    },
  ],

  "fx-layouts": [
    {
      id: "stackpane-pane",
      title: "Pane ve StackPane (ButtonInPane, ShowCircle)",
      label: "Pane / StackPane",
      def: "Pane, düğümleri koordinatlarıyla yerleştiren temel kaptır; şekiller (Circle, Line) için uygundur. pane.getChildren() bir ObservableList<Node> döndürür; add/addAll ile düğüm eklenir, remove ile çıkarılır. StackPane düğümleri üst üste, MERKEZE yerleştirir. Ders örneği ButtonInPane bir düğmeyi StackPane'in ortasına koyar; ShowCircle ise Pane'de merkezi (100, 100), yarıçapı 50 olan bir daire çizer. Daire penceresi büyütülünce ShowCircle'daki daire ortada KALMAZ; ortada kalması için binding gerekir (ShowCircleCentered).",
      code: `// ButtonInPane
StackPane pane = new StackPane();
pane.getChildren().add(new Button("OK"));           // ortada //!
Scene scene = new Scene(pane, 200, 50);

// ShowCircle
Circle circle = new Circle();
circle.setCenterX(100);                             // sol üstten 100 sağa
circle.setCenterY(100);                             // ...100 aşağı //!
circle.setRadius(50);
circle.setStroke(Color.BLACK);
circle.setFill(Color.WHITE);
Pane pane2 = new Pane();
pane2.getChildren().add(circle);
Scene scene2 = new Scene(pane2, 200, 200);`,
    },
    {
      id: "flowpane",
      title: "FlowPane Ayrıntıları (ShowFlowPane)",
      label: "FlowPane",
      def: "FlowPane düğümleri eklenme sırasına göre yatay (Orientation.HORIZONTAL, varsayılan) satırlar ya da dikey (Orientation.VERTICAL) sütunlar hâlinde dizer; satır dolunca alta geçer. Yapıcılar: FlowPane(), FlowPane(double hgap, double vgap), FlowPane(Orientation orientation), FlowPane(Orientation orientation, double hgap, double vgap). Özellikler: alignment (varsayılan Pos.LEFT), orientation, hgap, vgap. setPadding(new Insets(üst, sağ, alt, sol)) iç kenar boşluğu verir. TextField'ın tercih edilen genişliği setPrefColumnCount(n) ile ayarlanır. Pencere daraltılınca FlowPane düğümleri otomatik yeniden dizer.",
      code: `public class ShowFlowPane extends Application {
    @Override
    public void start(Stage primaryStage) {
        FlowPane pane = new FlowPane();
        pane.setPadding(new Insets(11, 12, 13, 14));          // üst, sağ, alt, sol //!
        pane.setHgap(5);
        pane.setVgap(5);

        pane.getChildren().addAll(new Label("First Name:"),
            new TextField(), new Label("MI:"));
        TextField tfMi = new TextField();
        tfMi.setPrefColumnCount(1);                           // 1 karakterlik genişlik
        pane.getChildren().addAll(tfMi, new Label("Last Name:"),
            new TextField());

        Scene scene = new Scene(pane, 200, 250);
        primaryStage.setTitle("ShowFlowPane");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}`,
    },
    {
      id: "gridpane",
      title: "GridPane Ayrıntıları (ShowGridPane)",
      label: "GridPane",
      def: "GridPane düğümleri iki boyutlu bir ızgaraya yerleştirir. add(Node child, int columnIndex, int rowIndex) — ÖNCE sütun, SONRA satır; add(child, col, row, colspan, rowspan) birden çok hücreye yayar. addRow(rowIndex, children...) ve addColumn(columnIndex, children...) bir satırı/sütunu doldurur. Özellikler: alignment, hgap, vgap, gridLinesVisible (hata ayıklama için ızgara çizgileri). Static yardımcılar: GridPane.setHalignment(node, HPos.RIGHT), GridPane.setValignment(node, VPos.BOTTOM), getColumnIndex(node), getRowIndex(node).",
      code: `public class ShowGridPane extends Application {
    @Override
    public void start(Stage primaryStage) {
        GridPane pane = new GridPane();
        pane.setAlignment(Pos.CENTER);
        pane.setPadding(new Insets(11.5, 12.5, 13.5, 14.5));
        pane.setHgap(5.5);
        pane.setVgap(5.5);

        pane.add(new Label("First Name:"), 0, 0);      // sütun 0, satır 0 //!
        pane.add(new TextField(), 1, 0);
        pane.add(new Label("MI:"), 0, 1);
        pane.add(new TextField(), 1, 1);
        pane.add(new Label("Last Name:"), 0, 2);
        pane.add(new TextField(), 1, 2);
        Button btAdd = new Button("Add Name");
        pane.add(btAdd, 1, 3);
        GridPane.setHalignment(btAdd, HPos.RIGHT);     // hücre içinde sağa yasla //!

        Scene scene = new Scene(pane);
        primaryStage.setTitle("ShowGridPane");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}`,
    },
    {
      id: "borderpane",
      title: "BorderPane ve CustomPane (ShowBorderPane)",
      label: "BorderPane",
      def: "BorderPane düğümleri beş bölgeye yerleştirir: top, bottom, left, right, center. Metotlar: setTop(node), setBottom(node), setLeft(node), setRight(node), setCenter(node); bir bölgeyi boşaltmak için null verilir: setTop(null). Static BorderPane.setAlignment(node, Pos.CENTER) bölge içindeki hizayı ayarlar. Ders örneği ShowBorderPane, her bölgeye bir CustomPane koyar; CustomPane, StackPane'i genişleten ve ortasında bir Label bulunan, kenarlıklı bir paneldir.",
      code: `public class ShowBorderPane extends Application {
    @Override
    public void start(Stage primaryStage) {
        BorderPane pane = new BorderPane();
        pane.setTop(new CustomPane("Top"));          //!
        pane.setRight(new CustomPane("Right"));
        pane.setBottom(new CustomPane("Bottom"));
        pane.setLeft(new CustomPane("Left"));
        pane.setCenter(new CustomPane("Center"));

        Scene scene = new Scene(pane);
        primaryStage.setTitle("ShowBorderPane");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}

class CustomPane extends StackPane {                   // etiketli, kenarlıklı panel //!
    public CustomPane(String title) {
        getChildren().add(new Label(title));
        setStyle("-fx-border-color: red");
        setPadding(new Insets(11.5, 12.5, 13.5, 14.5));
    }
}`,
    },
    {
      id: "hbox-vbox",
      title: "HBox ve VBox (ShowHBoxVBox)",
      label: "HBox / VBox",
      def: "HBox çocuklarını TEK bir yatay satırda, VBox TEK bir dikey sütunda dizer. FlowPane'den farkı: FlowPane birden çok satıra taşabilir, HBox/VBox hep tek satır/sütundur. Yapıcılar: HBox(), HBox(double spacing), HBox(spacing, children...). Özellikler: alignment, fillHeight (HBox) / fillWidth (VBox), spacing. Static VBox.setMargin(node, new Insets(...)) ve HBox.setMargin(...) düğüm çevresine dış boşluk verir. Ders örneği ShowHBoxVBox, üstte düğmeler ve bir bayrak içeren HBox, solda ders kodlarını listeleyen VBox bulunan bir BorderPane kurar.",
      code: `public class ShowHBoxVBox extends Application {
    @Override
    public void start(Stage primaryStage) {
        BorderPane pane = new BorderPane();
        pane.setTop(getHBox());
        pane.setLeft(getVBox());
        Scene scene = new Scene(pane);
        primaryStage.setTitle("ShowHBoxVBox");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private HBox getHBox() {
        HBox hBox = new HBox(15);                                // spacing 15 //!
        hBox.setPadding(new Insets(15, 15, 15, 15));
        hBox.setStyle("-fx-background-color: gold");
        hBox.getChildren().add(new Button("Computer Science"));
        hBox.getChildren().add(new Button("Chemistry"));
        ImageView imageView = new ImageView(new Image("image/us.gif"));
        hBox.getChildren().add(imageView);
        return hBox;
    }

    private VBox getVBox() {
        VBox vBox = new VBox(15);
        vBox.setPadding(new Insets(15, 5, 5, 5));
        vBox.getChildren().add(new Label("Courses"));
        Label[] courses = {new Label("CSCI 1301"), new Label("CSCI 1302"),
            new Label("CSCI 2410"), new Label("CSCI 3720")};
        for (Label course : courses) {
            VBox.setMargin(course, new Insets(0, 0, 0, 15));     // soldan girinti //!
            vBox.getChildren().add(course);
        }
        return vBox;
    }
}`,
    },
  ],

  "fx-shapes": [
    {
      id: "fx-text",
      title: "Text Şekli (ShowText)",
      label: "Text",
      def: "Text, (x, y) başlangıç noktasında bir metin gösterir; y, metnin TABAN çizgisidir (baseline). Yapıcılar: Text(), Text(String text), Text(double x, double y, String text). Özellikler: text, x, y, wrappingWidth (satır kaydırma genişliği), underline (altı çizili), strikethrough (üstü çizili), font. Metin içindeki \\n yeni satır oluşturur. Text de bir Shape olduğu için setFill ile rengi değiştirilir.",
      code: `public class ShowText extends Application {
    @Override
    public void start(Stage primaryStage) {
        Pane pane = new Pane();
        pane.setPadding(new Insets(5, 5, 5, 5));
        Text text1 = new Text(20, 20, "Programming is fun");          //!
        text1.setFont(Font.font("Courier", FontWeight.BOLD, FontPosture.ITALIC, 15));
        pane.getChildren().add(text1);

        Text text2 = new Text(60, 60, "Programming is fun\\nDisplay text");
        pane.getChildren().add(text2);

        Text text3 = new Text(10, 100, "Programming is fun\\nDisplay text");
        text3.setFill(Color.RED);
        text3.setUnderline(true);                                      //!
        text3.setStrikethrough(true);
        pane.getChildren().add(text3);

        Scene scene = new Scene(pane);
        primaryStage.setTitle("ShowText");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}`,
    },
    {
      id: "fx-line-rect",
      title: "Line ve Rectangle (ShowLine, ShowRectangle)",
      label: "Line / Rectangle",
      def: "Line(startX, startY, endX, endY) iki noktayı birleştirir; özellikleri startX, startY, endX, endY'dir; strokeWidth kalınlığı, stroke rengi belirler. ShowLine'da çizgilerin uçları pencerenin genişliğine/yüksekliğine BAĞLANIR (binding), böylece pencere büyüyünce çizgiler de uzar. Rectangle(x, y, width, height); (x, y) SOL ÜST köşedir. arcWidth ve arcHeight köşe yuvarlaklığının yatay/dikey çapıdır. ShowRectangle, döngüyle döndürülmüş dikdörtgenler de çizer.",
      code: `// ShowLine: LinePane
class LinePane extends Pane {
    public LinePane() {
        Line line1 = new Line(10, 10, 10, 10);
        line1.endXProperty().bind(widthProperty().subtract(10));    // pencereyle uzar //!
        line1.endYProperty().bind(heightProperty().subtract(10));
        line1.setStrokeWidth(5);
        line1.setStroke(Color.GREEN);
        getChildren().add(line1);

        Line line2 = new Line(10, 10, 10, 10);
        line2.startXProperty().bind(widthProperty().subtract(10));
        line2.endYProperty().bind(heightProperty().subtract(10));
        line2.setStrokeWidth(5);
        line2.setStroke(Color.GREEN);
        getChildren().add(line2);
    }
}

// ShowRectangle
Rectangle r1 = new Rectangle(25, 10, 60, 30);
r1.setStroke(Color.BLACK);
r1.setFill(Color.WHITE);
Rectangle r2 = new Rectangle(25, 50, 60, 30);
Rectangle r3 = new Rectangle(25, 90, 60, 30);
r3.setArcWidth(15);                                                 // yuvarlak köşe //!
r3.setArcHeight(25);
Group group = new Group();
group.getChildren().addAll(new Text(10, 27, "r1"), r1,
    new Text(10, 67, "r2"), r2, new Text(10, 107, "r3"), r3);
for (int i = 0; i < 4; i++) {
    Rectangle r = new Rectangle(100, 50, 100, 30);
    r.setRotate(i * 360 / 8);                                       // 0°, 45°, 90°, 135°
    r.setStroke(Color.color(Math.random(), Math.random(), Math.random()));
    r.setFill(Color.WHITE);
    group.getChildren().add(r);
}`,
    },
    {
      id: "fx-ellipse",
      title: "Circle ve Ellipse (ShowEllipse)",
      label: "Circle / Ellipse",
      def: "Circle yapıcıları: Circle(), Circle(double radius), Circle(double x, double y, double radius), Circle(x, y, radius, Paint fill); özellikler centerX, centerY, radius. Ellipse(centerX, centerY, radiusX, radiusY): radiusX yatay, radiusY dikey yarıçaptır; radiusX = radiusY ise daire olur. Ders örneği ShowEllipse, aynı merkezli 16 elipsi i × 180 / 16 derece döndürerek bir çiçek deseni çizer.",
      code: `public class ShowEllipse extends Application {
    @Override
    public void start(Stage primaryStage) {
        Pane pane = new Pane();
        for (int i = 0; i < 16; i++) {
            Ellipse e1 = new Ellipse(150, 100, 100, 50);     // merkez, radiusX, radiusY //!
            e1.setStroke(Color.color(Math.random(), Math.random(), Math.random()));
            e1.setFill(Color.WHITE);
            e1.setRotate(i * 180 / 16);                        // her biri 11.25° döner //!
            pane.getChildren().add(e1);
        }
        Scene scene = new Scene(pane, 300, 200);
        primaryStage.setTitle("ShowEllipse");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}`,
    },
    {
      id: "fx-arc",
      title: "Arc (Yay) Şekli ve ArcType (ShowArc)",
      label: "Arc",
      def: "Arc, bir elipsin parçasıdır: Arc(centerX, centerY, radiusX, radiusY, startAngle, length). Açılar DERECE cinsindendir; 0° doğu (pozitif x ekseni) yönüdür ve POZİTİF açılar SAAT YÖNÜNÜN TERSİNE ölçülür. Negatif startAngle veya length saat yönünde ölçülür. length, yayın süpürdüğü açıdır. type özelliği yayın nasıl kapatılacağını belirler: ArcType.OPEN (yalnızca eğri, uçlar birleştirilmez), ArcType.CHORD (iki uç düz bir kirişle birleştirilir), ArcType.ROUND (iki uç MERKEZE birleştirilir, pasta dilimi).",
      code: `public class ShowArc extends Application {
    @Override
    public void start(Stage primaryStage) {
        Arc arc1 = new Arc(150, 100, 80, 80, 30, 35);    // 30°'den başla, 35° süpür //!
        arc1.setFill(Color.RED);
        arc1.setType(ArcType.ROUND);                     // pasta dilimi

        Arc arc2 = new Arc(150, 100, 80, 80, 30 + 90, 35);
        arc2.setFill(Color.WHITE);
        arc2.setType(ArcType.OPEN);                      // yalnızca eğri //!
        arc2.setStroke(Color.BLACK);

        Arc arc3 = new Arc(150, 100, 80, 80, 30 + 180, 35);
        arc3.setFill(Color.WHITE);
        arc3.setType(ArcType.CHORD);                     // uçlar kirişle birleşir
        arc3.setStroke(Color.BLACK);

        Arc arc4 = new Arc(150, 100, 80, 80, 30 + 270, 35);
        arc4.setFill(Color.GREEN);
        arc4.setType(ArcType.CHORD);
        arc4.setStroke(Color.BLACK);

        Group group = new Group();
        group.getChildren().addAll(new Text(210, 40, "arc1: round"), arc1,
            new Text(20, 40, "arc2: open"), arc2, new Text(20, 170, "arc3: chord"), arc3,
            new Text(210, 170, "arc4: chord"), arc4);
        Scene scene = new Scene(new BorderPane(group), 300, 200);
        primaryStage.setTitle("ShowArc");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}`,
      quiz: {
        question: "Yayın iki ucunu MERKEZE birleştirerek pasta dilimi çizen ArcType hangisidir?",
        options: ["ArcType.OPEN", "ArcType.CHORD", "ArcType.ROUND", "ArcType.PIE"],
        answer: 2,
        explain: "OPEN uçları birleştirmez, CHORD uçları düz bir kirişle birleştirir, ROUND uçları merkeze bağlar. ArcType.PIE diye bir sabit yoktur.",
      },
    },
    {
      id: "fx-polygon",
      title: "Polygon ve Polyline (ShowPolygon)",
      label: "Polygon / Polyline",
      def: "Polygon, noktaları sırayla birleştiren KAPALI bir çokgen çizer (son nokta ilk noktaya otomatik bağlanır). Polyline aynı şekilde çizer ama KAPATMAZ. Yapıcılar: Polygon(), Polygon(double... points); noktalar getPoints() ile alınan ObservableList<Double>'a x1, y1, x2, y2, ... sırasıyla eklenir. Ders örneği ShowPolygon, merkezi (centerX, centerY) olan düzgün altıgen çizer: k. köşe = (centerX + radius × cos(2kπ/6), centerY − radius × sin(2kπ/6)).",
      code: `public class ShowPolygon extends Application {
    @Override
    public void start(Stage primaryStage) {
        Pane pane = new Pane();
        Polygon polygon = new Polygon();
        pane.getChildren().add(polygon);
        polygon.setFill(Color.WHITE);
        polygon.setStroke(Color.BLACK);
        ObservableList<Double> list = polygon.getPoints();            //!

        final double WIDTH = 200, HEIGHT = 200;
        double centerX = WIDTH / 2, centerY = HEIGHT / 2;
        double radius = Math.min(WIDTH, HEIGHT) * 0.4;
        for (int i = 0; i < 6; i++) {                                 // altıgenin 6 köşesi
            list.add(centerX + radius * Math.cos(2 * i * Math.PI / 6)); //!
            list.add(centerY - radius * Math.sin(2 * i * Math.PI / 6));
        }

        Scene scene = new Scene(pane, WIDTH, HEIGHT);
        primaryStage.setTitle("ShowPolygon");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}
// new Polyline(...) ile aynı noktalar → son kenar ÇİZİLMEZ (açık şekil)`,
    },
  ],

  /* ===================== GUI · JavaFX Animasyonları ===================== */
  "fx-animations": [
    {
      id: "animation-class",
      title: "Animation Soyut Sınıfı ve Duration",
      label: "Animation",
      def: "javafx.animation.Animation tüm animasyonların SOYUT kök sınıfıdır. Özellikleri: autoReverse (BooleanProperty; sonraki döngüde yönü tersine çevirir mi), cycleCount (IntegerProperty; tekrar sayısı, sonsuz için Timeline.INDEFINITE), rate (DoubleProperty; hız, negatif değer ters oynatır), status (ReadOnlyObjectProperty<Animation.Status>; PAUSED, RUNNING, STOPPED). Metotları: pause(), play(), stop(). Alt sınıfları: PathTransition, FadeTransition, Timeline (ve TranslateTransition, ScaleTransition, RotateTransition...). Duration sınıfı süreyi temsil eder: Duration.millis(500), Duration.seconds(3), Duration.minutes(1); Duration.INDEFINITE sonsuz süredir.",
      code: `// Animation (abstract)
//  ├── Transition → PathTransition, FadeTransition, ...
//  └── Timeline                                          //!
Animation animation = new Timeline(new KeyFrame(Duration.millis(500), e -> { }));
animation.setCycleCount(Timeline.INDEFINITE);             // sonsuz tekrar //!
animation.setAutoReverse(true);
animation.setRate(animation.getRate() * 2);               // 2 kat hızlı
animation.play();
if (animation.getStatus() == Animation.Status.RUNNING)
    animation.pause();
animation.stop();                                         // başa sarar`,
    },
    {
      id: "path-transition",
      title: "PathTransition (PathTransitionDemo, FlagRisingAnimation)",
      label: "PathTransition",
      def: "PathTransition bir düğümü belirli bir sürede bir YOL (path, herhangi bir Shape) boyunca hareket ettirir. Özellikler: duration (süre), node (hareket eden düğüm), orientation (OrientationType.NONE: düğümün yönü sabit kalır; ORTHOGONAL_TO_TANGENT: düğüm yolun teğetine dik kalacak şekilde döner), path (Shape). Yapıcılar: PathTransition(), PathTransition(Duration duration, Shape path), PathTransition(Duration duration, Shape path, Node node). Ders örneği PathTransitionDemo bir dikdörtgeni daire boyunca döndürür; fareye basılınca durur, bırakınca devam eder. FlagRisingAnimation bir bayrak resmini Line boyunca yukarı çeker.",
      code: `public class PathTransitionDemo extends Application {
    @Override
    public void start(Stage primaryStage) {
        Pane pane = new Pane();
        Rectangle rectangle = new Rectangle(0, 0, 25, 50);
        rectangle.setFill(Color.ORANGE);
        Circle circle = new Circle(125, 100, 50);
        circle.setFill(Color.WHITE);
        circle.setStroke(Color.BLACK);
        pane.getChildren().add(circle);
        pane.getChildren().add(rectangle);

        PathTransition pt = new PathTransition();
        pt.setDuration(Duration.millis(4000));
        pt.setPath(circle);                                   // yol = daire //!
        pt.setNode(rectangle);                                // hareket eden düğüm
        pt.setOrientation(PathTransition.OrientationType.ORTHOGONAL_TO_TANGENT); //!
        pt.setCycleCount(Timeline.INDEFINITE);
        pt.setAutoReverse(true);
        pt.play();

        circle.setOnMousePressed(e -> pt.pause());
        circle.setOnMouseReleased(e -> pt.play());

        Scene scene = new Scene(pane, 250, 200);
        primaryStage.setTitle("PathTransitionDemo");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}

// FlagRisingAnimation
ImageView imageView = new ImageView("image/us.gif");
PathTransition pt = new PathTransition(Duration.millis(10000),
    new Line(100, 200, 100, 0), imageView);                   // 10 sn'de yukarı
pt.setCycleCount(5);
pt.play();`,
    },
    {
      id: "fade-transition",
      title: "FadeTransition Ayrıntıları (FadeTransitionDemo)",
      label: "FadeTransition",
      def: "FadeTransition bir düğümün OPAKLIĞINI (opacity) belirli bir sürede değiştirir. Özellikler: duration, node, fromValue (başlangıç opaklığı), toValue (bitiş opaklığı), byValue (artış miktarı). Yapıcılar: FadeTransition(), FadeTransition(Duration duration), FadeTransition(Duration duration, Node node). Opaklık 0.0 (tamamen saydam) ile 1.0 (tamamen opak) arasındadır. Ders örneği FadeTransitionDemo, pencereye bağlı (binding) bir elipsin opaklığını 3 saniyede 1.0'dan 0.1'e indirip geri çıkarır; fareye basılınca durur.",
      code: `public class FadeTransitionDemo extends Application {
    @Override
    public void start(Stage primaryStage) {
        Pane pane = new Pane();
        Ellipse ellipse = new Ellipse(10, 10, 100, 50);
        ellipse.setFill(Color.RED);
        ellipse.setStroke(Color.BLACK);
        ellipse.centerXProperty().bind(pane.widthProperty().divide(2));
        ellipse.centerYProperty().bind(pane.heightProperty().divide(2));
        ellipse.radiusXProperty().bind(pane.widthProperty().multiply(0.4));
        ellipse.radiusYProperty().bind(pane.heightProperty().multiply(0.4));
        pane.getChildren().add(ellipse);

        FadeTransition ft = new FadeTransition(Duration.millis(3000), ellipse); //!
        ft.setFromValue(1.0);                       // opak
        ft.setToValue(0.1);                         // neredeyse saydam //!
        ft.setCycleCount(Timeline.INDEFINITE);
        ft.setAutoReverse(true);
        ft.play();

        ellipse.setOnMousePressed(e -> ft.pause());
        ellipse.setOnMouseReleased(e -> ft.play());

        Scene scene = new Scene(pane, 200, 150);
        primaryStage.setTitle("FadeTransitionDemo");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}`,
    },
    {
      id: "timeline-demo",
      title: "Timeline ve KeyFrame (TimelineDemo: Yanıp Sönen Metin)",
      label: "Timeline",
      def: "Timeline, bir veya daha fazla KeyFrame'i (anahtar kare) sırayla çalıştırarak programlanabilir animasyon yapar: new Timeline(KeyFrame... keyframes). KeyFrame(Duration time, EventHandler<ActionEvent> onFinished): belirtilen süre dolunca işleyici çalışır. cycleCount INDEFINITE yapılırsa işleyici süresiz olarak her aralıkta tekrar çalışır. Ders örneği TimelineDemo, \"Programming is fun\" metnini her 500 ms'de bir gösterip gizleyerek yanıp söndürür; metne tıklanınca animasyon getStatus() ile kontrol edilip duraklatılır ya da devam ettirilir.",
      code: `public class TimelineDemo extends Application {
    @Override
    public void start(Stage primaryStage) {
        StackPane pane = new StackPane();
        Text text = new Text(20, 50, "Programming is fun");
        text.setFill(Color.RED);
        pane.getChildren().add(text);

        EventHandler<ActionEvent> eventHandler = e -> {
            if (text.getText().length() != 0) text.setText("");         // gizle
            else text.setText("Programming is fun");                   // göster
        };

        Timeline animation = new Timeline(
            new KeyFrame(Duration.millis(500), eventHandler));          // 500 ms'de bir //!
        animation.setCycleCount(Timeline.INDEFINITE);
        animation.play();

        text.setOnMouseClicked(e -> {
            if (animation.getStatus() == Animation.Status.PAUSED)       //!
                animation.play();
            else
                animation.pause();
        });

        Scene scene = new Scene(pane, 250, 250);
        primaryStage.setTitle("TimelineDemo");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}`,
    },
    {
      id: "bounce-ball",
      title: "Örnek: Zıplayan Top (BallPane + BounceBallControl)",
      label: "BounceBall",
      def: "Top, Timeline ile her 50 ms'de moveBall() çağrılarak hareket ettirilir. Konum (x, y) ve yön adımı (dx, dy) tutulur. Top bir kenara çarpınca o eksendeki yön tersine çevrilir: x < radius veya x > getWidth() − radius ise dx *= −1; y için de aynısı dy ile. Hız rate özelliğiyle değiştirilir: increaseSpeed() rate'i 0.1 artırır, decreaseSpeed() 0.1 azaltır (0'ın altına inmez). BounceBallControl: fareye basınca pause(), bırakınca play(); YUKARI ok hızı artırır, AŞAĞI ok azaltır; klavye olayları için ballPane.requestFocus() çağrılır.",
      code: `public class BallPane extends Pane {
    public final double radius = 20;
    private double x = radius, y = radius;
    private double dx = 1, dy = 1;                       // her adımda yer değişimi
    private Circle circle = new Circle(x, y, radius);
    private Timeline animation;

    public BallPane() {
        circle.setFill(Color.GREEN);
        getChildren().add(circle);
        animation = new Timeline(
            new KeyFrame(Duration.millis(50), e -> moveBall())); //!
        animation.setCycleCount(Timeline.INDEFINITE);
        animation.play();
    }
    public void play() { animation.play(); }
    public void pause() { animation.pause(); }
    public void increaseSpeed() { animation.setRate(animation.getRate() + 0.1); }
    public void decreaseSpeed() {
        animation.setRate(animation.getRate() > 0 ? animation.getRate() - 0.1 : 0);
    }
    public DoubleProperty rateProperty() { return animation.rateProperty(); }

    protected void moveBall() {
        if (x < radius || x > getWidth() - radius) dx *= -1;     // yatay kenar → yön değiştir //!
        if (y < radius || y > getHeight() - radius) dy *= -1;    // dikey kenar
        x += dx;
        y += dy;
        circle.setCenterX(x);
        circle.setCenterY(y);
    }
}

public class BounceBallControl extends Application {
    @Override
    public void start(Stage primaryStage) {
        BallPane ballPane = new BallPane();
        ballPane.setOnMousePressed(e -> ballPane.pause());
        ballPane.setOnMouseReleased(e -> ballPane.play());
        ballPane.setOnKeyPressed(e -> {
            if (e.getCode() == KeyCode.UP) ballPane.increaseSpeed();    //!
            else if (e.getCode() == KeyCode.DOWN) ballPane.decreaseSpeed();
        });
        Scene scene = new Scene(ballPane, 250, 150);
        primaryStage.setTitle("BounceBallControl");
        primaryStage.setScene(scene);
        primaryStage.show();
        ballPane.requestFocus();                                     // klavye için odak
    }
}`,
      quiz: {
        question: "BallPane.moveBall() içinde top SAĞ kenara çarptığında ne olur?",
        code: `if (x < radius || x > getWidth() - radius) dx *= -1;
if (y < radius || y > getHeight() - radius) dy *= -1;
x += dx;
y += dy;`,
        options: [
          "dy işaret değiştirir, top yukarı döner",
          "dx işaret değiştirir, top sola döner",
          "Animasyon durur",
          "x sıfırlanır, top sol kenara ışınlanır",
        ],
        answer: 1,
        explain: "Sağ kenarda x > getWidth() − radius olur; dx −1 ile çarpılıp negatife döner ve x her adımda azalır, yani top sola gider. dy etkilenmez.",
      },
    },
  ],
};

// Alt konuları ana kavramlara bağla; görevleri sayaç için QUIZZES'a da ekle
for (const cat of KNOWLEDGE.categories) {
  for (const concept of cat.concepts) {
    concept.subtopics = SUBTOPICS[concept.id] ?? [];
    for (const sub of concept.subtopics) {
      if (sub.quiz) QUIZZES[sub.id] = sub.quiz;
    }
  }
}
