/*
 * lessons-ch1.js — Bölüm 1: Sınıflar ve Nesneler (Slide01_BPII.pdf).
 * Blok türleri: p, h, list, table, code (lang:'java' renklendirir), note (exam/why/key/trap/warn/extra), dg (şekil), br.
 * checks: { type:'mc', q, code?, options, answer, a } · { type:'fill', q, code (⟦0⟧ boşluk), answers:[[...]], a }
 * Kod iz sürme şekilleri (tr-*) en altta OOPLab.java.trace ile kaydedilir.
 */
(function (OOPLab) {
  'use strict';

  OOPLab.lessons = OOPLab.lessons || { chapters: [] };

  OOPLab.lessons.chapters.push({
    "id": "ch1",
    "num": 1,
    "title": "Sınıflar ve Nesneler",
    "en": "Objects and Classes",
    "source": "Slide01_BPII.pdf",
    "objectives": [
      "Sınıf ile nesne arasındaki farkı ve UML sınıf diyagramını okumak",
      "Yapıcıların kurallarını ve varsayılan yapıcının ne zaman verildiğini açıklamak",
      "Referans değişkenleri, null, aliasing ve çöp toplamayı bellek üzerinde göstermek",
      "static ve instance üyeleri ayırt etmek, static metodun neye erişebileceğini bilmek",
      "Görünürlük değiştiricileri, kapsülleme, this ve pass-by-value kavramlarını uygulamak",
      "Nesne dizileri, ArrayList ve wrapper sınıflarla çalışmak"
    ],
    "lessons": [
      {
        "id": "nesne-nedir",
        "title": "Nesne nedir? Kimlik, durum, davranış",
        "en": "What Is an Object?",
        "src": "Slide01 · s.7–9",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "<b>Nesne yönelimli programlama (NYP)</b>, programı birbirleriyle konuşan <b>nesneler</b> olarak kurmaktır. Nesne, gerçek dünyada ayırt edilebilen bir varlığı temsil eder: bir öğrenci, bir daire, bir düğme, hatta bir borç."
          },
          {
            "t": "p",
            "html": "Her nesnenin üç özelliği vardır:"
          },
          {
            "t": "list",
            "items": [
              "<b>Kimlik (identity)</b>: Onu diğerlerinden ayıran benzersizlik (bellekteki yeri).",
              "<b>Durum (state)</b>: Veri alanlarının (<i>data field / property</i>) o anki değerleri. Ör. <code>radius = 10</code>.",
              "<b>Davranış (behavior)</b>: Nesnenin yapabildikleri, yani <b>metotlar</b>. Ör. <code>getArea()</code>."
            ]
          },
          {
            "t": "p",
            "html": "<b>Sınıf (class)</b> ise aynı türden nesnelerin <b>şablonudur (blueprint)</b>. Sınıf bir kez yazılır; ondan istediğin kadar nesne (<b>örnek / instance</b>) üretirsin. Slayttaki örnekte tek bir <code>Circle</code> şablonundan yarıçapı 10, 25 ve 125 olan üç ayrı nesne üretiliyor."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Kurabiye kalıbı (sınıf) ile kurabiyeler (nesneler) gibi düşün: kalıp tektir, kurabiyeler çoktur ve her birinin kendi \"durumu\" (üstündeki süs) olabilir. Bir kurabiyeyi yemek diğerlerini etkilemez; aynı şekilde bir nesnenin <code>radius</code>'unu değiştirmek diğer nesneleri etkilemez."
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Sınıf = <b>tip</b> ve şablon. Nesne = o tipin bellekte yaşayan <b>somut örneği</b>. \"Instance\" ve \"object\" aynı şeydir."
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-nesne-nedir"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Bir nesnenin <b>durumu</b> neyle temsil edilir?",
            "options": [
              "Metotlarıyla",
              "Veri alanlarının (field) o anki değerleriyle",
              "Sınıf adıyla",
              "Yapıcısıyla"
            ],
            "answer": 1,
            "a": "Durum = veri alanlarının değerleri. Davranış = metotlar."
          },
          {
            "type": "mc",
            "q": "Aynı sınıftan üretilen iki nesne için hangisi <b>doğrudur</b>?",
            "options": [
              "Aynı veri alanı değerlerini paylaşırlar",
              "Her birinin kendi (instance) veri alanları vardır",
              "İkinci nesne birincinin kopyasıdır",
              "Sadece biri metot çağırabilir"
            ],
            "answer": 1,
            "a": "Instance alanlar nesneye özeldir (static olanlar hariç, onu ileride göreceğiz)."
          }
        ]
      },
      {
        "id": "sinif-anatomi",
        "title": "Sınıfın anatomisi ve UML sınıf diyagramı",
        "en": "Class Anatomy and UML",
        "src": "Slide01 · s.9–11",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "Bir Java sınıfı üç tür üyeden oluşur:"
          },
          {
            "t": "list",
            "items": [
              "<b>Veri alanları (data fields)</b>: Nesnenin durumunu tutan değişkenler.",
              "<b>Yapıcılar (constructors)</b>: Nesne <code>new</code> ile oluşturulurken çalışan, başlangıç değerlerini atayan özel metotlar.",
              "<b>Metotlar (methods)</b>: Nesnenin davranışları."
            ],
            "ordered": true
          },
          {
            "t": "h",
            "text": "UML sınıf diyagramı"
          },
          {
            "t": "p",
            "html": "Sınavlarda sık çıkar: kutu üç bölmelidir — <b>sınıf adı / veri alanları / yapıcılar ve metotlar</b>."
          },
          {
            "t": "code",
            "text": "┌───────────────────────────┐\n│ Circle                    │  ← sınıf adı\n├───────────────────────────┤\n│ -radius: double           │  ← alanlar   (ad: tip)\n│ -numberOfObjects: int     │    (altı çizili = static)\n├───────────────────────────┤\n│ +Circle()                 │  ← yapıcılar\n│ +Circle(newRadius: double)│\n│ +getArea(): double        │  ← metotlar  (ad(param): dönüş)\n└───────────────────────────┘"
          },
          {
            "t": "table",
            "head": [
              "Sembol",
              "Anlamı"
            ],
            "rows": [
              [
                "<code>+</code>",
                "public"
              ],
              [
                "<code>-</code>",
                "private"
              ],
              [
                "<code>#</code>",
                "protected"
              ],
              [
                "<u>altı çizili</u>",
                "static"
              ]
            ]
          },
          {
            "t": "p",
            "html": "Nesneler UML'de <code><u>circle1: Circle</u></code> şeklinde (nesneAdı: SınıfAdı, altı çizili) gösterilir."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>UML'de tip, Java'nın tersine <b>sonra</b> yazılır: <code>radius: double</code>, metot dönüşü de sonda: <code>getArea(): double</code>.</li><li>Yapıcıların UML'de dönüş tipi <b>yoktur</b>: <code>+Circle(newRadius: double)</code>.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-sinif-anatomi"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "UML'de <code>-count: int</code> ifadesinin <b>altı çiziliyse</b> bu alan nasıl tanımlanmıştır?",
            "options": [
              "public int count",
              "private static int count",
              "protected int count",
              "private final int count"
            ],
            "answer": 1,
            "a": "<code>-</code> private, altı çizili static demektir."
          },
          {
            "type": "mc",
            "q": "UML'de <code>+getRadius(): double</code> Java'da nasıl yazılır?",
            "options": [
              "double getRadius: public()",
              "public double getRadius()",
              "public getRadius(): double",
              "private double getRadius()"
            ],
            "answer": 1,
            "a": "+ → public, dönüş tipi Java'da metot adından önce yazılır."
          }
        ]
      },
      {
        "id": "yapici",
        "title": "Yapıcılar (constructors) ve varsayılan yapıcı",
        "en": "Constructors",
        "src": "Slide01 · s.14–17",
        "minutes": 8,
        "blocks": [
          {
            "t": "p",
            "html": "Yapıcı, nesne oluşturulurken <b>bir kez</b> çalışan ve nesneyi <b>başlatan</b> özel bir metottur. Kuralları:"
          },
          {
            "t": "list",
            "items": [
              "Adı <b>sınıf adıyla aynı</b> olmalıdır.",
              "<b>Dönüş tipi yoktur</b> — <code>void</code> bile yazılmaz.",
              "<code>new</code> operatörüyle çağrılır; istediğin an normal metot gibi çağıramazsın.",
              "Aşırı yüklenebilir (overload): farklı parametreli birden çok yapıcı olabilir."
            ]
          },
          {
            "t": "p",
            "html": "Parametresiz yapıcıya <b>no-arg constructor</b> denir (slayttaki \"bağımsız değişken yapıcı\" çevirisi budur)."
          },
          {
            "t": "h",
            "text": "Varsayılan yapıcı (default constructor)"
          },
          {
            "t": "p",
            "html": "Sınıfa <b>hiç</b> yapıcı yazmazsan derleyici gizlice boş gövdeli, parametresiz bir yapıcı ekler. Ama <b>tek bir</b> yapıcı bile yazarsan bu hediye geri alınır!"
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Derleyici neden yapıcı yazınca varsayılanı geri çekiyor? Çünkü <code>Ogrenci(String ad)</code> yazdığında \"bu sınıf isimsiz oluşturulmamalı\" demiş olursun. Derleyici araya gizlice <code>Ogrenci()</code> ekleseydi bu niyetini bozardı. Yapıcı, nesne kullanıcısını <b>gerekli değerleri vermeye zorlamanın</b> yoludur."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Yapıcının önüne <code>void</code> yazarsan artık yapıcı değil, <b>adı sınıfla aynı olan sıradan bir metot</b> olur; <code>new</code> onu çağırmaz.</li><li>Sadece <code>Circle(double r)</code> tanımlıysa <code>new Circle()</code> <b>derleme hatası</b> verir — varsayılan yapıcı artık yok.</li><li>Lab slaytındaki \"yapıcı public'tir / void'tir\" ifadeleri tam doğru değil: yapıcı <code>private</code> da olabilir (ör. Singleton) ve dönüş tipi hiç yoktur (void de değildir). Lab slaytındaki <code>internal</code> ise C#'a ait; Java'da yok.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-yapici"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Aşağıdaki kod derlenir mi?",
            "options": [
              "Evet, x = 0 olur",
              "Hayır, A() yapıcısı tanımlı değil",
              "Evet, x = null olur",
              "Çalışma zamanında hata verir"
            ],
            "answer": 1,
            "a": "Sınıfta bir yapıcı yazıldığı için derleyici varsayılan no-arg yapıcıyı eklemez → derleme hatası.",
            "code": "class A {\n    int x;\n    A(int x) { this.x = x; }\n}\n// başka bir yerde:\nA a = new A();"
          },
          {
            "type": "mc",
            "q": "Hangisi yapıcılar için <b>yanlıştır</b>?",
            "options": [
              "Sınıfla aynı ada sahiptir",
              "Dönüş tipi yoktur",
              "Aşırı yüklenebilir",
              "Dönüş tipi void olarak yazılmalıdır"
            ],
            "answer": 3,
            "a": "void yazılırsa yapıcı olmaktan çıkar ve sıradan metot olur."
          },
          {
            "type": "fill",
            "q": "Yarıçapı parametre olarak alan yapıcıyı tamamla:",
            "code": "class Circle {\n    double radius;\n    ⟦0⟧(double newRadius) {\n        radius = ⟦1⟧;\n    }\n}",
            "answers": [
              [
                "Circle"
              ],
              [
                "newRadius"
              ]
            ],
            "a": "Yapıcının adı sınıf adıdır ve dönüş tipi yazılmaz."
          }
        ]
      },
      {
        "id": "referans-iz",
        "title": "Referans değişkenleri: kodu adım adım izle",
        "en": "Reference Variables (Trace Code)",
        "src": "Slide01 · s.18–27",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "Sınıf tipinde bir değişken <b>nesnenin kendisini değil, nesnenin adresini (referansını)</b> tutar."
          },
          {
            "t": "code",
            "lang": "java",
            "text": "Circle myCircle;                    // 1) referans değişkeni bildirildi (henüz nesne yok)\nmyCircle = new Circle(5.0);         // 2) nesne yaratıldı, 3) referansı atandı\nCircle myCircle = new Circle(5.0);  // hepsi tek adımda"
          },
          {
            "t": "p",
            "html": "<code>new Circle(5.0)</code> üç şey yapar: heap'te yer ayırır, alanları varsayılan değerlerle doldurur, yapıcıyı çalıştırır ve <b>referansı döndürür</b>. <code>=</code> bu referansı değişkene yazar."
          },
          {
            "t": "h",
            "text": "Nesneye erişim: nokta (.) operatörü"
          },
          {
            "t": "list",
            "items": [
              "Veri: <code>objectRefVar.data</code> → <code>myCircle.radius</code>",
              "Metot: <code>objectRefVar.methodName(args)</code> → <code>myCircle.getArea()</code>"
            ]
          },
          {
            "t": "p",
            "html": "Sağdaki kod slayttaki animasyonun aynısı. ▶ ile adım adım ilerle ve değişkenlerin hangi anda değer aldığını izle."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Neden nesne doğrudan değişkende değil? Nesneler büyük ve değişken boyutlu olabilir; onları <b>heap</b> denen ortak alanda tutup değişkende sadece küçük, sabit boyutlu bir adres saklamak hem hızlı hem esnektir. Bunun sonucu: iki değişken <b>aynı</b> nesneyi gösterebilir (bir sonraki derste)."
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-referans-iz"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "<code>Circle c;</code> satırından hemen sonra ne olmuştur?",
            "options": [
              "Radius'u 1.0 olan bir Circle nesnesi oluştu",
              "Sadece Circle tipinde bir referans değişkeni bildirildi; nesne yok",
              "Varsayılan yapıcı çağrıldı",
              "c = new Circle() ile aynıdır"
            ],
            "answer": 1,
            "a": "Nesne yalnızca <code>new</code> ile oluşur. Bildirim sadece referans değişkeni yaratır."
          },
          {
            "type": "fill",
            "q": "Bir Circle oluşturup alanını yazdır:",
            "code": "Circle c = ⟦0⟧ Circle(3.0);\nSystem.out.println(c.⟦1⟧());",
            "answers": [
              [
                "new"
              ],
              [
                "getArea"
              ]
            ],
            "a": "Nesne <code>new</code> ile yaratılır, metoda nokta operatörüyle erişilir."
          }
        ],
        "lab": {
          "label": "Stack & Heap laboratuvarında myCircle / yourCircle örneğini izle",
          "preset": {
            "module": "memory",
            "scenario": "referans"
          }
        }
      },
      {
        "id": "varsayilan-deger",
        "title": "Varsayılan değerler ve null",
        "en": "Default Values and null",
        "src": "Slide01 · s.28–31",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "Bir sınıfın <b>veri alanlarına</b> değer vermezsen Java otomatik varsayılan değer atar:"
          },
          {
            "t": "table",
            "head": [
              "Alan tipi",
              "Varsayılan"
            ],
            "rows": [
              [
                "Sayısal (int, double, …)",
                "<code>0</code> / <code>0.0</code>"
              ],
              [
                "boolean",
                "<code>false</code>"
              ],
              [
                "char",
                "<code>'\\u0000'</code> (boş karakter)"
              ],
              [
                "Referans (String, Circle, dizi…)",
                "<code>null</code>"
              ]
            ]
          },
          {
            "t": "p",
            "html": "<b>null</b>, \"bu referans hiçbir nesneyi göstermiyor\" anlamına gelen özel bir değerdir. null bir referans üzerinden alan/metot kullanmaya çalışmak <code>NullPointerException</code> fırlatır."
          },
          {
            "t": "h",
            "text": "Ama yerel değişkenler farklı!"
          },
          {
            "t": "p",
            "html": "Bir <b>metodun içindeki yerel değişkenlere</b> Java varsayılan değer <b>atamaz</b>. İlk değer vermeden okumaya çalışırsan <b>derleme hatası</b> alırsın: <i>variable might not have been initialized</i>."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Neden fark var? Alanlar nesneyle birlikte heap'te oluşur ve Java orayı güvenli olsun diye sıfırlar. Yerel değişkenler ise kısa ömürlüdür; derleyici \"değer atamayı unuttun\" hatasını erkenden yakalamanı ister. Unutulmuş bir başlatma çoğu zaman bir hatadır."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Alan: varsayılan değer var. Yerel değişken: <b>yok</b> → kullanmadan önce atamazsan derleme hatası.</li><li><code>String name;</code> alanının değeri <code>\"\"</code> değil <code>null</code>'dır. <code>name.length()</code> → NullPointerException.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-varsayilan-deger"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Hangisi <b>derleme hatası</b> verir?",
            "options": [
              "Sadece (1)",
              "Sadece (2)",
              "İkisi de",
              "Hiçbiri"
            ],
            "answer": 1,
            "a": "a bir alan → varsayılan 0. b yerel → başlatılmadan okunamaz.",
            "code": "public class T {\n    int a;\n    void m() {\n        int b;\n        System.out.println(a);   // (1)\n        System.out.println(b);   // (2)\n    }\n}"
          },
          {
            "type": "mc",
            "q": "<code>boolean</code> tipindeki bir veri alanının varsayılan değeri nedir?",
            "options": [
              "true",
              "false",
              "null",
              "0"
            ],
            "answer": 1,
            "a": "Alanlarda boolean varsayılanı false'tur."
          }
        ],
        "lab": {
          "label": "null referansı ve NullPointerException'ı bellekte gör",
          "preset": {
            "module": "memory",
            "scenario": "dizi"
          }
        }
      },
      {
        "id": "ilkel-referans",
        "title": "İlkel vs referans tipler, kopyalama ve çöp toplama",
        "en": "Primitive vs Reference Types, Garbage Collection",
        "src": "Slide01 · s.32–35",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "İki tür değişken bellekte farklı davranır:"
          },
          {
            "t": "list",
            "items": [
              "<b>İlkel tip</b> (<code>int i = 1</code>): kutunun içinde <b>değerin kendisi</b> vardır.",
              "<b>Nesne tipi</b> (<code>Circle c</code>): kutunun içinde nesneye giden bir <b>referans (ok)</b> vardır."
            ]
          },
          {
            "t": "h",
            "text": "Atama (=) ne kopyalar?"
          },
          {
            "t": "p",
            "html": "<code>i = j</code> → j'nin <b>değeri</b> i'ye kopyalanır; sonra biri değişse diğeri etkilenmez.<br> <code>c1 = c2</code> → c2'nin <b>referansı</b> kopyalanır; artık <b>ikisi aynı nesneyi</b> gösterir."
          },
          {
            "t": "h",
            "text": "Çöp toplama (Garbage Collection)"
          },
          {
            "t": "p",
            "html": "<code>c1 = c2</code> sonrası, c1'in eskiden gösterdiği nesneyi artık hiçbir değişken göstermez. Bu nesneye <b>çöp (garbage)</b> denir ve JVM onun belleğini <b>otomatik</b> olarak geri alır. İhtiyacın kalmayan bir nesnenin referansına bilerek <code>null</code> atayarak onu toplanabilir hale getirebilirsin."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Java'da <code>delete</code>/<code>free</code> yoktur. Bellek yönetimini JVM üstlenir: bir nesneye erişim yolu kalmadıysa programın onu bir daha kullanması imkânsızdır, dolayısıyla silmek güvenlidir."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>c1 = c2;</code> sonra <code>c1.radius = 7</code> yaparsan <b>c2.radius da 7</b> olur (aynı nesne).</li><li><code>c1 == c2</code> nesnelerin içeriğini değil, <b>aynı nesneyi gösterip göstermediklerini</b> karşılaştırır.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-ilkel-referans"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Çıktı nedir?",
            "options": [
              "1.0",
              "4.0",
              "0.0",
              "Derleme hatası"
            ],
            "answer": 1,
            "a": "b = a referansı kopyalar; ikisi aynı nesneyi gösterir.",
            "code": "Circle a = new Circle(1);\nCircle b = a;\nb.radius = 4;\nSystem.out.println(a.radius);"
          },
          {
            "type": "mc",
            "q": "Bir nesne ne zaman çöp toplayıcı için uygun hale gelir?",
            "options": [
              "Metodu bittiğinde",
              "Hiçbir referans değişkeni onu göstermediğinde",
              "radius'u 0 olduğunda",
              "Programcı delete çağırdığında"
            ],
            "answer": 1,
            "a": "Erişilemeyen nesne = çöp. Java'da delete yoktur."
          }
        ],
        "lab": {
          "label": "c1 = c2 atamasını ve çöp toplamayı bellekte gör",
          "preset": {
            "module": "memory",
            "scenario": "atama"
          }
        }
      },
      {
        "id": "date-random",
        "title": "Hazır sınıfları kullanmak: Date ve Random",
        "en": "The Date and Random Classes",
        "src": "Slide01 · s.36–39",
        "minutes": 4,
        "blocks": [
          {
            "t": "p",
            "html": "Java kütüphanesi kullanıma hazır sınıflarla doludur. Kullanım kalıbı hep aynıdır: <b>nesne oluştur → metotlarını çağır</b>."
          },
          {
            "t": "h",
            "text": "java.util.Date"
          },
          {
            "t": "list",
            "items": [
              "<code>new Date()</code> → şu anki tarih/saat.",
              "<code>new Date(long elapsedTime)</code> → 1 Ocak 1970 GMT'den itibaren verilen milisaniye.",
              "<code>toString()</code>, <code>getTime()</code>, <code>setTime(long)</code>."
            ]
          },
          {
            "t": "h",
            "text": "java.util.Random"
          },
          {
            "t": "list",
            "items": [
              "<code>new Random()</code> → tohum (seed) olarak şu anki zaman.",
              "<code>new Random(seed)</code> → belirli bir tohum.",
              "<code>nextInt()</code>, <code>nextInt(n)</code> → <b>[0, n)</b> aralığı (n hariç), <code>nextDouble()</code> → [0.0, 1.0), <code>nextBoolean()</code>."
            ]
          },
          {
            "t": "p",
            "html": "<b>Aynı tohumla oluşturulan iki Random aynı sayı dizisini üretir.</b> Rastgelelik aslında deterministik bir formüldür."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Aynı tohum = aynı dizi özelliği test yazarken çok işe yarar: \"rastgele\" bir hatayı tekrar üretebilmek için tohumu sabitlersin. UML'deki <code>+</code> işaretleri bu metotların public olduğunu gösterir."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>nextInt(10)</code> 0–9 arası üretir, <b>10 asla gelmez</b>. 1–6 zar için: <code>nextInt(6) + 1</code>.</li><li><code>Math.random()</code> double döndürür ve [0.0, 1.0) aralığındadır.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kod örneği"
          },
          {
            "t": "dg",
            "id": "tr-date-random"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "<code>new Random().nextInt(5)</code> hangi değeri <b>asla</b> üretmez?",
            "options": [
              "0",
              "2",
              "4",
              "5"
            ],
            "answer": 3,
            "a": "Üst sınır hariçtir: 0,1,2,3,4."
          },
          {
            "type": "mc",
            "q": "<code>new Random(42)</code> ile oluşturulmuş iki nesne için doğru olan?",
            "options": [
              "Farklı diziler üretirler",
              "Aynı diziyi üretirler",
              "Derleme hatası",
              "İkincisi exception fırlatır"
            ],
            "answer": 1,
            "a": "Aynı tohum → aynı sayı dizisi."
          }
        ]
      },
      {
        "id": "static",
        "title": "static: sınıfa ait değişkenler, sabitler ve metotlar",
        "en": "Static Variables, Constants and Methods",
        "src": "Slide01 · s.40–44",
        "minutes": 8,
        "blocks": [
          {
            "t": "p",
            "html": "<b>Örnek (instance) değişkeni</b> belirli bir nesneye aittir: her nesnenin kendi kopyası vardır.<br> <b>Statik (static) değişken</b> ise <b>sınıfa</b> aittir: bellekte <b>tek bir kopya</b> vardır ve sınıfın <b>tüm nesneleri onu paylaşır</b>."
          },
          {
            "t": "list",
            "items": [
              "<b>Statik metot</b>: belirli bir nesneye bağlı değildir; <code>SinifAdi.metot()</code> ile çağrılır (ör. <code>Math.sqrt()</code>).",
              "<b>Statik sabit</b>: tüm nesnelerin paylaştığı <code>final</code> değişken: <code>final static double PI = 3.14159...;</code>"
            ]
          },
          {
            "t": "p",
            "html": "Slayttaki örnek: kaç tane Circle oluşturulduğunu saymak için <code>static int numberOfObjects</code>. Her yapıcı bu ortak sayacı bir artırır. UML'de static üyeler <u>altı çizili</u> gösterilir."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "\"Kaç daire oluşturuldu?\" bilgisi <b>tek bir dairenin</b> özelliği değil, <b>sınıfın</b> özelliğidir. Bunu instance alan yapsaydık her nesnede ayrı bir sayaç olurdu ve hepsi 1 gösterirdi. Ortak bilgi → static. Nesneye özel bilgi (radius) → instance."
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Kural: değeri <b>nesneden nesneye değişiyorsa</b> instance; <b>tüm nesneler için aynıysa</b> veya nesneden bağımsızsa static."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Static alana nesne üzerinden de erişilebilir (<code>c1.numberOfObjects</code>) ama aynı ortak değeri görürsün; doğru üslup <code>Circle.numberOfObjects</code>.</li><li>Bir nesne üzerinden static alanı değiştirmek <b>tüm nesneler</b> için değiştirir.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-static"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Bir Banka sınıfında hangisi <b>static</b> olmalıdır?",
            "options": [
              "hesapNo",
              "bakiye",
              "faizOrani (tüm hesaplar için aynı)",
              "musteriAdi"
            ],
            "answer": 2,
            "a": "Tüm nesneler için ortak olan değer static olmaya adaydır; diğerleri hesaba özeldir."
          },
          {
            "type": "fill",
            "q": "Tüm nesnelerin paylaştığı bir sabit tanımla:",
            "code": "public class Daire {\n    ⟦0⟧ ⟦1⟧ double PI = 3.14159;\n}",
            "answers": [
              [
                "final",
                "static"
              ],
              [
                "static",
                "final"
              ]
            ],
            "a": "Sabit = <code>final</code>, paylaşılan = <code>static</code>. Sıra fark etmez: <code>final static</code> veya <code>static final</code>."
          },
          {
            "type": "mc",
            "q": "3 nesne oluşturulduktan sonra <code>c1.numberOfObjects = 10;</code> çalışırsa <code>c3.numberOfObjects</code> kaçtır?",
            "options": [
              "3",
              "10",
              "1",
              "Derleme hatası"
            ],
            "answer": 1,
            "a": "Static alanın tek kopyası var; kim değiştirirse herkes yeni değeri görür."
          }
        ],
        "lab": {
          "label": "static sayacın tek kopyasını bellekte gör",
          "preset": {
            "module": "memory",
            "scenario": "static"
          }
        }
      },
      {
        "id": "static-erisim",
        "title": "Static metot neye erişebilir? (instance vs static kuralı)",
        "en": "Instance vs Static Access Rules",
        "src": "Slide01 · s.45–46",
        "minutes": 5,
        "blocks": [
          {
            "t": "p",
            "html": "Sınavın en sevilen sorularından biri. Kuralı ezberlemek yerine mantığını anla:"
          },
          {
            "t": "table",
            "head": [
              "",
              "instance metot çağırma",
              "instance alan kullanma",
              "static metot çağırma",
              "static alan kullanma"
            ],
            "rows": [
              [
                "<b>Instance metottan</b>",
                "✓",
                "✓",
                "✓",
                "✓"
              ],
              [
                "<b>Static metottan</b>",
                "✗",
                "✗",
                "✓",
                "✓"
              ]
            ]
          },
          {
            "t": "p",
            "html": "Static bir metot (ör. <code>main</code>) instance üyelere doğrudan erişemez; önce bir nesne oluşturup onun üzerinden erişmelidir: <code>A a = new A(); int j = a.i; a.m1();</code>"
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Static metot <b>nesne olmadan</b> çalışır. <code>i</code> instance alanını kullanmak isterse \"hangi nesnenin i'si?\" sorusunun cevabı yoktur (static bağlamda <code>this</code> yoktur). Instance metot ise zaten bir nesne üzerinden çağrıldığı için hem kendi nesnesine hem de herkesin ortak static üyelerine ulaşabilir."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>main</code> static'tir: aynı sınıftaki instance metodu <code>m1()</code> diye doğrudan çağırmak derleme hatasıdır.</li><li>Static metot içinde <code>this</code> veya <code>super</code> kullanılamaz.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-static-erisim"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Aşağıdakilerden hangisi <b>derleme hatası</b> verir?",
            "options": [
              "(1)",
              "(2)",
              "(3)",
              "(4)"
            ],
            "answer": 1,
            "a": "Static metot s() instance alan x'e erişemez.",
            "code": "public class B {\n    int x = 1;\n    static int y = 2;\n    static void s() {\n        System.out.println(y);      // (1)\n        System.out.println(x);      // (2)\n    }\n    void t() {\n        System.out.println(x + y);  // (3)\n        s();                        // (4)\n    }\n}"
          }
        ]
      },
      {
        "id": "gorunurluk",
        "title": "Görünürlük değiştiricileri: public, default, private",
        "en": "Visibility Modifiers",
        "src": "Slide01 · s.47–50",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "Görünürlük (erişim) değiştiricileri, bir sınıfa veya üyelerine <b>kimin erişebileceğini</b> belirler:"
          },
          {
            "t": "list",
            "items": [
              "<b>public</b>: Her paketteki her sınıf erişebilir.",
              "<b>(default)</b> — hiçbir şey yazmazsan: Sadece <b>aynı paketteki</b> sınıflar erişebilir (package-private).",
              "<b>private</b>: Sadece <b>tanımlandığı sınıfın içinden</b> erişilebilir.",
              "(<b>protected</b> kalıtım bölümünde gelecek.)"
            ]
          },
          {
            "t": "p",
            "html": "Sağdaki üç dosyayı sekmelerden incele: <code>C2</code> aynı pakette (p1), <code>C3</code> farklı pakette (p2)."
          },
          {
            "t": "h",
            "text": "Önemli not (slayt 50)"
          },
          {
            "t": "p",
            "html": "private \"nesneye\" değil <b>sınıfa</b> göre çalışır: <code>Foo</code> sınıfının <b>kendi içinde</b> (ör. kendi main'inde) <code>foo.x</code> yazmak geçerlidir. Başka bir sınıftan (<code>Test</code>) yazarsan hata."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Erişim kısıtı, sınıfın iç detaylarını değiştirdiğinde dışarıdaki kodun kırılmamasını sağlar. Dışarıya ne kadar az şey açarsan o kadar özgürce değişiklik yapabilirsin. Bu yüzden kural: <b>alanlar private, dışarıya sunulacak metotlar public</b>."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Üst seviye (top-level) bir sınıf sadece <code>public</code> veya default olabilir; <code>private class</code> derleme hatasıdır.</li><li>Default (değiştiricisiz) üyeler farklı paketten <b>görünmez</b>; aynı paketten görünür.</li><li>Private üyeye aynı sınıfın içinden, o sınıfın başka bir nesnesi üzerinden bile erişilebilir.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-gorunurluk"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Değiştiricisiz (default) bir metoda kimler erişebilir?",
            "options": [
              "Herkes",
              "Sadece aynı sınıf",
              "Aynı paketteki sınıflar",
              "Sadece alt sınıflar"
            ],
            "answer": 2,
            "a": "Default = package-private."
          },
          {
            "type": "mc",
            "q": "Hangisi geçerli bir üst seviye sınıf bildirimidir?",
            "options": [
              "private class A {}",
              "protected class A {}",
              "class A {}",
              "static class A {}"
            ],
            "answer": 2,
            "a": "Üst seviye sınıflar yalnızca public veya default olabilir."
          }
        ]
      },
      {
        "id": "kapsulleme",
        "title": "Kapsülleme: private alanlar, getter ve setter",
        "en": "Data Field Encapsulation",
        "src": "Slide01 · s.51–54 · Lab Hafta 3",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "<b>Kapsülleme (encapsulation)</b>: Verileri <code>private</code> yapıp dışarıya yalnızca kontrollü <b>kapılar</b> (metotlar) açmaktır."
          },
          {
            "t": "p",
            "html": "Slayttaki iki sebep: <b>(1) veriyi korumak</b>, <b>(2) sınıfın bakımını kolaylaştırmak</b>."
          },
          {
            "t": "h",
            "text": "Getter (accessor) ve setter (mutator) adlandırma kuralları"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public tip getOzellikAdi()                    // okuma\npublic boolean isOzellikAdi()                 // boolean ise \"is\" ile\npublic void setOzellikAdi(tip yeniDeger)      // yazma"
          },
          {
            "t": "p",
            "html": "Setter'ın gücü <b>doğrulama</b> yapabilmesidir: negatif yarıçap gelirse reddeder. Böylece nesne asla geçersiz duruma düşmez."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "radius public olsaydı, programın herhangi bir köşesinde biri <code>c.radius = -5;</code> yazabilir ve hatanın nerede doğduğunu bulamazdın. private + setter ile <b>tek bir kapı</b> olur; kuralı da o kapıya koyarsın. Ayrıca ileride radius yerine çapı saklamaya karar verirsen sadece getter/setter'ın içini değiştirirsin; sınıfı kullanan kod hiç etkilenmez."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>boolean alanın getter'ı kurala göre <code>isFilled()</code>'dir, <code>getFilled()</code> değil.</li><li>Setter dönüş tipi <code>void</code>'dir ve parametre alır; getter parametre almaz ve değer döndürür.</li><li>UML'de <code>-radius</code> ve <code>+getRadius()</code>: alan private, erişim metodu public.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-kapsulleme"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "q": "<code>private boolean aktif;</code> alanı için kurala uygun getter ve setter yaz:",
            "code": "public boolean ⟦0⟧() {\n    return aktif;\n}\npublic ⟦1⟧ setAktif(boolean aktif) {\n    this.aktif = aktif;\n}",
            "answers": [
              [
                "isAktif"
              ],
              [
                "void"
              ]
            ],
            "a": "boolean getter <code>isXxx</code>, setter dönüş tipi <code>void</code>."
          },
          {
            "type": "mc",
            "q": "Veri alanlarını private yapmanın slayttaki iki sebebi nedir?",
            "options": [
              "Hız ve bellek",
              "Veriyi korumak ve sınıfın bakımını kolaylaştırmak",
              "Kalıtımı engellemek ve static yapmak",
              "Derleme süresini kısaltmak"
            ],
            "answer": 1,
            "a": "Slide01 s.51."
          }
        ]
      },
      {
        "id": "pass-by-value",
        "title": "Nesneleri metotlara geçirmek (pass-by-value)",
        "en": "Passing Objects to Methods",
        "src": "Slide01 · s.55–56",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "Java'da <b>her zaman değer ile geçirme (pass-by-value)</b> vardır. Fark, \"değer\"in ne olduğundadır:"
          },
          {
            "t": "list",
            "items": [
              "<b>İlkel tip</b>: değerin kendisi kopyalanır. Metot içinde parametreyi değiştirmek dışarıyı <b>etkilemez</b>.",
              "<b>Referans tip</b>: <b>referansın kopyası</b> geçirilir. İki referans <b>aynı nesneyi</b> gösterir: metot nesnenin içini değiştirirse dışarı <b>görür</b>; ama parametreye <b>yeni bir nesne atarsa</b> dışarıdaki değişken etkilenmez."
            ]
          },
          {
            "t": "p",
            "html": "Slayttaki şekil: <code>n</code>'nin değeri <code>times</code>'a, <code>myCircle</code>'ın referansı <code>c</code>'ye kopyalanır. Stack'te iki ayrı kutu, heap'te tek bir Circle."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Bunu \"uzaktan kumandanın kopyası\" gibi düşün: metoda televizyonun değil kumandanın kopyasını verirsin. Kopya kumandayla kanalı değiştirirsen (nesnenin içini değiştirmek) evdeki herkes görür. Ama kopya kumandayı başka bir TV'ye yönlendirirsen (yeni nesne atamak) senin elindeki kumanda hâlâ eski TV'yi gösterir."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Metot içinde <code>c = new Circle(...)</code> demek çağıranın değişkenini <b>değiştirmez</b>.</li><li>Metot içinde <code>c.setRadius(...)</code> demek çağıranın gördüğü nesneyi <b>değiştirir</b>.</li><li>Java'da \"pass-by-reference\" yoktur; sınavda \"nesneler referansla geçirilir\" ifadesi teknik olarak yanlıştır.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-pass-by-value"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Çıktı nedir?",
            "options": [
              "2.0",
              "9.0",
              "0.0",
              "null"
            ],
            "answer": 0,
            "a": "Parametreye yeni nesne atamak çağıranın referansını değiştirmez.",
            "code": "static void f(Circle c) {\n    c = new Circle(9);\n}\n// main:\nCircle a = new Circle(2);\nf(a);\nSystem.out.println(a.radius);"
          },
          {
            "type": "mc",
            "q": "Çıktı nedir?",
            "options": [
              "1",
              "42",
              "0",
              "Derleme hatası"
            ],
            "answer": 1,
            "a": "Dizi de nesnedir; referansın kopyası aynı diziyi gösterir ve içi değişir.",
            "code": "static void g(int[] arr) {\n    arr[0] = 42;\n}\n// main:\nint[] d = {1, 2, 3};\ng(d);\nSystem.out.println(d[0]);"
          }
        ],
        "lab": {
          "label": "Metoda geçirilen referansın kopyasını bellekte izle",
          "preset": {
            "module": "memory",
            "scenario": "pass"
          }
        }
      },
      {
        "id": "immutable",
        "title": "Değişmez (immutable) nesneler ve sınıflar",
        "en": "Immutable Objects and Classes",
        "src": "Slide01 · s.57–59",
        "minutes": 5,
        "blocks": [
          {
            "t": "p",
            "html": "Oluşturulduktan sonra içeriği <b>değiştirilemeyen</b> nesneye <b>immutable nesne</b>, sınıfına <b>immutable sınıf</b> denir. <code>String</code> bunun en ünlü örneğidir."
          },
          {
            "t": "p",
            "html": "Circle3'teki <code>setRadius</code>'u silersen sınıf değişmez olur: radius private ve onu değiştirecek kapı kalmadı."
          },
          {
            "t": "h",
            "text": "Ama dikkat: \"her alan private + setter yok\" yetmez!"
          },
          {
            "t": "p",
            "html": "Slayttaki <code>Student</code> sınıfında tüm alanlar private, setter yok… ama <code>getBirthDate()</code>, değiştirilebilir bir <code>BirthDate</code> nesnesinin <b>referansını</b> dışarı veriyor. Dışarıdaki kod bu referansla <code>setYear</code> çağırıp öğrencinin doğum yılını değiştirebilir!"
          },
          {
            "t": "h",
            "text": "Immutable sınıf için üç şart"
          },
          {
            "t": "list",
            "items": [
              "Tüm veri alanları <b>private</b>.",
              "<b>Mutator</b> (setter) metodu yok.",
              "Değiştirilebilir bir alan nesnesinin <b>referansını döndüren</b> erişimci (getter) yok."
            ],
            "ordered": true
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Kapsülleme duvarı, referans dışarı sızınca delinir: kale kapısını kilitleyip anahtarın kopyasını dağıtmak gibi. Çözüm olarak getter, iç nesnenin bir <b>kopyasını</b> döndürebilir (<code>return new BirthDate(year, month, day);</code>)."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>\"Bütün alanları private ve setter'ı olmayan sınıf kesinlikle immutable'dır\" → <b>YANLIŞ</b> (referans sızıntısı).</li><li>String immutable'dır: <code>s.toUpperCase()</code> s'yi değiştirmez, yeni bir String döndürür.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-immutable"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Bir sınıfın immutable olması için hangisi <b>gerekli değildir</b>?",
            "options": [
              "Tüm alanlar private olmalı",
              "Setter olmamalı",
              "Değiştirilebilir alan nesnesine referans döndüren getter olmamalı",
              "Sınıf static olmalı"
            ],
            "answer": 3,
            "a": "Static olmak şart değil; ilk üçü slayttaki şartlardır."
          }
        ]
      },
      {
        "id": "kapsam",
        "title": "Değişkenlerin kapsamı (scope)",
        "en": "Scope of Variables",
        "src": "Slide01 · s.60–61",
        "minutes": 3,
        "blocks": [
          {
            "t": "list",
            "items": [
              "<b>Instance ve static alanların</b> kapsamı <b>tüm sınıftır</b>. Sınıf içinde herhangi bir yerde bildirilebilirler; metot onları kendisinden <i>sonra</i> tanımlanmış olsa da kullanabilir.",
              "<b>Yerel değişkenin</b> kapsamı bildirildiği yerden başlar ve onu içeren <b>bloğun</b> <code>}</code> sonuna kadar sürer. Kullanılmadan önce açıkça başlatılmalıdır."
            ]
          },
          {
            "t": "p",
            "html": "İstisna: bir alanın <b>ilk değeri başka bir alana bağlıysa</b>, bağlı olduğu alan önce bildirilmelidir: <code>private int i; private int j = i + 1;</code> (i önce gelmeli)."
          },
          {
            "t": "p",
            "html": "Yerel değişken bir alanla <b>aynı ada</b> sahipse, metot içinde yerel olan alanı <b>gizler (shadowing)</b>. Alana ulaşmak için <code>this</code> gerekir — bir sonraki dersin konusu."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>for döngüsünde tanımlanan <code>i</code>, döngü bittikten sonra kullanılamaz.</li><li>Aynı metotta, iç içe bloklarda aynı isimde iki yerel değişken tanımlanamaz.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kod örneği"
          },
          {
            "t": "dg",
            "id": "tr-kapsam"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Hangisi derleme hatası verir?",
            "options": [
              "Sadece (1)",
              "Sadece (2)",
              "İkisi de",
              "Hiçbiri"
            ],
            "answer": 0,
            "a": "Alanın başlangıç değeri, kendisinden sonra bildirilen alana bağlı olamaz (1). Metot içinden ise alanlar sırasından bağımsız kullanılabilir (2).",
            "code": "class F {\n    private int j = i + 1;   // (1)\n    private int i;\n    int m() { return k; }    // (2)\n    private int k = 5;\n}"
          }
        ]
      },
      {
        "id": "this",
        "title": "this anahtar kelimesi",
        "en": "The this Keyword",
        "src": "Slide01 · s.62–66",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "<code>this</code>, <b>o an üzerinde çalışılan nesnenin kendisine</b> verilen addır. İki yaygın kullanımı var:"
          },
          {
            "t": "h",
            "text": "1) Gizlenmiş alana erişmek"
          },
          {
            "t": "p",
            "html": "Parametre adı alan adıyla aynıysa (çok yaygın bir üslup), metot içinde <code>radius</code> parametreyi gösterir. Alanı kastetmek için <code>this.radius</code> yazılır. Static alan için sınıf adı kullanılır: <code>Foo.k = k;</code>"
          },
          {
            "t": "h",
            "text": "2) Aynı sınıftaki başka bir yapıcıyı çağırmak: <code>this(...)</code>"
          },
          {
            "t": "p",
            "html": "<code>public Circle() { this(1.0); }</code> → kod tekrarı yerine diğer yapıcıya devret. <b><code>this(...)</code> yapıcının ilk satırı olmalıdır.</b>"
          },
          {
            "t": "p",
            "html": "Normalde <code>radius</code> yazdığında Java aslında <code>this.radius</code> anlar; this genellikle gizli olarak oradadır."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "<code>f1.setI(10)</code> çağrıldığında this = f1, <code>f2.setI(45)</code> çağrıldığında this = f2'dir. Aynı metot kodu, hangi nesne için çalıştığını <code>this</code> sayesinde bilir. Static metotlar bir nesne için çalışmadığından onlarda <code>this</code> yoktur."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>radius = radius;</code> parametreyi kendine atar, alan <b>değişmez</b> (hata vermez, sessizce yanlış çalışır!).</li><li><code>this(...)</code> çağrısı yapıcının <b>ilk</b> ifadesi değilse derleme hatası.</li><li>Static metotta <code>this</code> kullanılamaz.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-this"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "q": "Parametre adı alanla aynı. Alanı doğru ayarla ve no-arg yapıcıyı diğerine bağla:",
            "code": "public class Kutu {\n    private int en;\n    public Kutu(int en) {\n        ⟦0⟧.en = en;\n    }\n    public Kutu() {\n        ⟦1⟧(10);\n    }\n}",
            "answers": [
              [
                "this"
              ],
              [
                "this"
              ]
            ],
            "a": "Alan için <code>this.en</code>; başka yapıcıyı çağırmak için <code>this(...)</code>."
          },
          {
            "type": "mc",
            "q": "Aşağıdaki yapıcı neden derlenmez?",
            "options": [
              "this static'tir",
              "this(...) yapıcının ilk ifadesi olmalıdır",
              "println yapıcıda kullanılamaz",
              "Derlenir, sorun yok"
            ],
            "answer": 1,
            "a": "this(...) ve super(...) çağrıları yapıcının ilk satırında olmalıdır.",
            "code": "public Circle() {\n    System.out.println(\"Oluşuyor\");\n    this(1.0);\n}"
          }
        ]
      },
      {
        "id": "nesne-dizileri",
        "title": "Nesne dizileri",
        "en": "Arrays of Objects",
        "src": "Slide01 · s.68–73",
        "minutes": 4,
        "blocks": [
          {
            "t": "p",
            "html": "Diziler nesne referansı da tutabilir: <code>Circle[] circleArray = new Circle[10];</code>"
          },
          {
            "t": "p",
            "html": "Bu satır <b>10 Circle nesnesi oluşturmaz!</b> Sadece 10 tane <b>referans kutusu</b> oluşturur ve hepsi <code>null</code>'dır. Nesneleri tek tek yaratman gerekir:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "for (int i = 0; i < circleArray.length; i++)\n    circleArray[i] = new Circle();"
          },
          {
            "t": "p",
            "html": "Bir nesne dizisi aslında bir <b>referans değişkenleri dizisidir</b>. <code>circleArray[1].getArea()</code> iki seviyeli referans içerir: <code>circleArray</code> → diziyi, <code>circleArray[1]</code> → bir Circle nesnesini gösterir."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Java, hangi yapıcıyla ve hangi değerlerle nesne oluşturmak istediğini bilemez; bu yüzden sadece boş (null) yer ayırır. \"Raf aldım ama kitap koymadım\" gibi."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>new Circle[3]</code> sonrası <code>arr[0].getArea()</code> → <b>NullPointerException</b> (nesne yok, sadece null).</li><li><code>new Circle[3]</code> yapıcıyı <b>hiç</b> çağırmaz; <code>new Circle()</code> ise çağırır.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-nesne-dizileri"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "<code>Araba[] a = new Araba[5];</code> satırı çalışınca kaç Araba yapıcısı çağrılır?",
            "options": [
              "0",
              "1",
              "5",
              "6"
            ],
            "answer": 0,
            "a": "Sadece 5 elemanlı, null dolu bir referans dizisi oluşur."
          }
        ],
        "lab": {
          "label": "Nesne dizisinin null kutularını ve doluşunu izle",
          "preset": {
            "module": "memory",
            "scenario": "dizi"
          }
        }
      },
      {
        "id": "arraylist",
        "title": "ArrayList: büyüyüp küçülebilen liste",
        "en": "The ArrayList Class",
        "src": "Slide01 · s.74–89 · Slide02 s.43–48",
        "minutes": 9,
        "blocks": [
          {
            "t": "p",
            "html": "Dizilerin iki kısıtı vardır: <b>boyut sabittir</b> ve <b>ekleme/silme/arama</b> desteği zayıftır. <code>java.util.ArrayList</code> bu sorunları çözer. İçeride bir dizi tutar; dolunca <b>iki katı büyüklükte</b> yeni bir dizi açıp elemanları oraya kopyalar."
          },
          {
            "t": "p",
            "html": "Araya ekleme (<code>add(i, e)</code>) sonraki elemanları <b>sağa</b>, silme (<code>remove(i)</code>) ise <b>sola</b> kaydırır."
          },
          {
            "t": "table",
            "head": [
              "İşlem",
              "Dizi",
              "ArrayList"
            ],
            "rows": [
              [
                "Oluşturma",
                "<code>String[] a = new String[10]</code>",
                "<code>ArrayList&lt;String&gt; list = new ArrayList&lt;&gt;()</code>"
              ],
              [
                "Okuma",
                "<code>a[i]</code>",
                "<code>list.get(i)</code>"
              ],
              [
                "Güncelleme",
                "<code>a[i] = \"x\"</code>",
                "<code>list.set(i, \"x\")</code>"
              ],
              [
                "Boyut",
                "<code>a.length</code>",
                "<code>list.size()</code>"
              ],
              [
                "Sona ekleme",
                "—",
                "<code>list.add(\"x\")</code>"
              ],
              [
                "Araya ekleme",
                "—",
                "<code>list.add(i, \"x\")</code>"
              ],
              [
                "Silme",
                "—",
                "<code>list.remove(i)</code> / <code>list.remove(obj)</code>"
              ],
              [
                "Arama",
                "—",
                "<code>contains</code>, <code>indexOf</code>, <code>lastIndexOf</code>"
              ],
              [
                "Boş mu / temizle",
                "—",
                "<code>isEmpty()</code> / <code>clear()</code>"
              ]
            ]
          },
          {
            "t": "p",
            "html": "<code>&lt;String&gt;</code> kısmı listenin <b>hangi tipte nesne</b> tutacağını söyler (generic). Diziden liste: <code>new ArrayList&lt;&gt;(Arrays.asList(array))</code>."
          },
          {
            "t": "p",
            "html": "<b>Ne zaman hangisi?</b> Eleman sayısı belli ve değişmiyorsa dizi; değişkense veya liste metotlarına ihtiyaç varsa ArrayList."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>ArrayList yalnızca <b>nesne</b> tutar: <code>ArrayList&lt;int&gt;</code> derleme hatasıdır → <code>ArrayList&lt;Integer&gt;</code> (bir sonraki ders).</li><li><code>remove(1)</code> <b>1. indeksteki</b> elemanı siler; <code>remove(\"Miami\")</code> o nesneyi siler. Integer listesinde bu ikisi karışır!</li><li><code>get</code>/<code>set</code>/<code>remove(int)</code> geçersiz indekste <code>IndexOutOfBoundsException</code> fırlatır.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-arraylist"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Çıktı nedir?",
            "options": [
              "[A, X, C]",
              "[A, B, C]",
              "[X, B, C]",
              "[A, X, B]"
            ],
            "answer": 0,
            "a": "add(1,\"X\") → [A, X, B, C]. remove(2) 2. indeksteki B'yi siler → [A, X, C].",
            "code": "ArrayList<String> l = new ArrayList<>();\nl.add(\"A\"); l.add(\"B\"); l.add(\"C\");\nl.add(1, \"X\");\nl.remove(2);\nSystem.out.println(l);"
          },
          {
            "type": "fill",
            "q": "Bir String listesi oluştur, \"Ankara\" ekle ve eleman sayısını yazdır:",
            "code": "ArrayList<⟦0⟧> l = new ArrayList<>();\nl.⟦1⟧(\"Ankara\");\nSystem.out.println(l.⟦2⟧());",
            "answers": [
              [
                "String"
              ],
              [
                "add"
              ],
              [
                "size"
              ]
            ],
            "a": "Boyut ArrayList'te <code>size()</code> ile alınır."
          }
        ]
      },
      {
        "id": "wrapper",
        "title": "Wrapper sınıflar ve autoboxing",
        "en": "Wrapper Classes and Autoboxing",
        "src": "Ek konu · ArrayList<Integer> için gerekli",
        "minutes": 10,
        "blocks": [
          {
            "t": "p",
            "html": "Generic yapılar (ArrayList gibi) yalnızca <b>nesne</b> tutar. İlkel değerleri nesne gibi kullanabilmek için Java her ilkel tipe bir <b>sarmalayıcı (wrapper) sınıf</b> verir (<code>java.lang</code> paketinde):"
          },
          {
            "t": "table",
            "head": [
              "İlkel",
              "Wrapper",
              "İlkel",
              "Wrapper"
            ],
            "rows": [
              [
                "int",
                "<code>Integer</code>",
                "char",
                "<code>Character</code>"
              ],
              [
                "double",
                "<code>Double</code>",
                "boolean",
                "<code>Boolean</code>"
              ],
              [
                "long",
                "<code>Long</code>",
                "byte / short / float",
                "<code>Byte</code> / <code>Short</code> / <code>Float</code>"
              ]
            ]
          },
          {
            "t": "h",
            "text": "Boxing / Unboxing"
          },
          {
            "t": "list",
            "items": [
              "<b>Autoboxing</b>: ilkel → wrapper otomatik: <code>Integer x = 5;</code> (aslında <code>Integer.valueOf(5)</code>)",
              "<b>Unboxing</b>: wrapper → ilkel otomatik: <code>int y = x;</code> (aslında <code>x.intValue()</code>)"
            ]
          },
          {
            "t": "h",
            "text": "Sık kullanılan statik metotlar ve sabitler"
          },
          {
            "t": "p",
            "html": "<code>Integer.parseInt(\"42\")</code> → 42 (String → int), <code>Double.parseDouble(\"3.5\")</code>, <code>Integer.valueOf(\"7\")</code> → Integer, <code>Integer.MAX_VALUE</code>, <code>Integer.MIN_VALUE</code>, <code>String.valueOf(12)</code> → \"12\"."
          },
          {
            "t": "p",
            "html": "Wrapper nesneler de <b>immutable</b>'dır ve <code>null</code> olabilirler (ilkel tipler olamaz)."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Java'da \"her şey nesne\" değildir: performans için int, double gibi ilkel tipler var. Ama koleksiyonlar, polimorfizm ve <code>Object</code> parametresi alan metotlar nesne ister. Wrapper sınıflar bu iki dünya arasındaki <b>köprüdür</b>; autoboxing de bu köprüyü görünmez kılar."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>ArrayList&lt;int&gt;</code> → derleme hatası; <code>ArrayList&lt;Integer&gt;</code> kullan.</li><li><code>ArrayList&lt;Integer&gt; l</code> için <code>l.remove(1)</code> <b>indeks 1</b>'i siler; değeri 1 olan elemanı silmek için <code>l.remove(Integer.valueOf(1))</code>.</li><li>İki Integer'ı <code>==</code> ile karşılaştırma! -128..127 arası önbellekten geldiği için true, dışındaysa false çıkabilir. <code>equals</code> kullan.</li><li><code>Integer x = null; int y = x;</code> → unboxing sırasında <code>NullPointerException</code>.</li><li><code>Integer.parseInt(\"12a\")</code> → <code>NumberFormatException</code> (unchecked).</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-wrapper"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Çıktı nedir?",
            "options": [
              "[6, 7]",
              "[5, 6, 7]",
              "[5, 7]",
              "Derleme hatası"
            ],
            "answer": 0,
            "a": "remove(0): 0 bir int → indeks 0 silinir.",
            "code": "ArrayList<Integer> l = new ArrayList<>();\nl.add(5); l.add(6); l.add(7);\nl.remove(0);\nSystem.out.println(l);"
          },
          {
            "type": "fill",
            "q": "Kullanıcının girdiği metni sayıya çevir ve listeye ekle:",
            "code": "String metin = \"25\";\nArrayList<⟦0⟧> sayilar = new ArrayList<>();\nsayilar.add(Integer.⟦1⟧(metin));",
            "answers": [
              [
                "Integer"
              ],
              [
                "parseInt",
                "valueOf"
              ]
            ],
            "a": "Liste tipi <code>Integer</code> olmalı; <code>parseInt</code> int döndürür ve autoboxing ile eklenir."
          },
          {
            "type": "mc",
            "q": "<code>Double</code> hangi ilkel tipin wrapper'ıdır ve hangi pakettedir?",
            "options": [
              "float, java.util",
              "double, java.lang",
              "double, java.util",
              "long, java.lang"
            ],
            "answer": 1,
            "a": "Wrapper'lar java.lang'tadır; import gerekmez."
          }
        ]
      }
    ]
  });

  const T = OOPLab.java.trace;
  T("tr-nesne-nedir", {
    "files": [
      {
        "name": "Circle.java",
        "code": "\n// ŞABLON: her Circle nesnesinde bir radius olacak\nclass Circle {\n    double radius;               // durum (data field)\n\n    double getArea() {           // davranış (method)\n        return radius * radius * 3.14159;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Circle c1 = new Circle();   // 1. nesne\n        Circle c2 = new Circle();   // 2. nesne\n        c1.radius = 2;\n        c2.radius = 4;\n        System.out.println(c1.getArea());\n        System.out.println(c2.getArea());\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          12
        ],
        "note": "<code>new Circle()</code> bellekte (heap) yeni bir nesne oluşturur. radius henüz 0.0.",
        "vars": {
          "c1": "→ Circle#1 {radius=0.0}"
        }
      },
      {
        "lines": [
          13
        ],
        "note": "Aynı şablondan <b>ikinci, bağımsız</b> bir nesne.",
        "vars": {
          "c1": "→ Circle#1 {radius=0.0}",
          "c2": "→ Circle#2 {radius=0.0}"
        }
      },
      {
        "lines": [
          14,
          15
        ],
        "note": "Her nesnenin kendi <code>radius</code>'u var: biri değişince diğeri etkilenmez.",
        "vars": {
          "c1": "→ Circle#1 {radius=2.0}",
          "c2": "→ Circle#2 {radius=4.0}"
        }
      },
      {
        "lines": [
          16,
          6
        ],
        "note": "c1 üzerinde çağrılan getArea, <b>c1'in</b> radius'unu kullanır: 2·2·3.14159",
        "out": "12.56636"
      },
      {
        "lines": [
          17,
          6
        ],
        "note": "Aynı metot, c2'nin durumuyla: 4·4·3.14159",
        "out": "50.26544"
      }
    ]
  });

  T("tr-sinif-anatomi", {
    "files": [
      {
        "name": "Circle.java",
        "code": "\nclass Circle {\n    /** Veri alanı (data field) */\n    double radius = 1.0;\n\n    /** Yapıcı #1: parametresiz (no-arg) */\n    Circle() {\n    }\n\n    /** Yapıcı #2: yarıçap alan */\n    Circle(double newRadius) {\n        radius = newRadius;\n    }\n\n    /** Metot: alanı döndür */\n    double getArea() {\n        return radius * radius * 3.14159;\n    }\n}"
      }
    ],
    "hl": [
      4
    ],
    "steps": [
      {
        "lines": [
          4
        ],
        "note": "<b>Veri alanı</b>: her Circle nesnesinin bir radius'u var; ilk değeri 1.0. UML: <code>radius: double</code>"
      },
      {
        "lines": [
          7,
          8
        ],
        "note": "<b>Yapıcı #1</b>: sınıfla aynı isim, dönüş tipi yok. UML: <code>Circle()</code>"
      },
      {
        "lines": [
          11,
          12,
          13
        ],
        "note": "<b>Yapıcı #2</b> (aşırı yüklenmiş): parametre alıyor. UML: <code>Circle(newRadius: double)</code>"
      },
      {
        "lines": [
          16,
          17,
          18
        ],
        "note": "<b>Metot</b>: dönüş tipi double. UML: <code>getArea(): double</code>"
      }
    ]
  });

  T("tr-yapici", {
    "files": [
      {
        "name": "Ogrenci.java",
        "code": "\nclass Ogrenci {\n    String ad;\n    int no;\n\n    Ogrenci(String ad, int no) {     // tek yapıcı -> varsayılan yapıcı YOK\n        this.ad = ad;\n        this.no = no;\n        System.out.println(ad + \" oluşturuldu\");\n    }\n\n    void Ogrenci() {                 // DİKKAT: void var -> bu bir METOT\n        System.out.println(\"ben yapıcı değilim\");\n    }\n}\n\npublic class Test {\n    public static void main(String[] args) {\n        Ogrenci o = new Ogrenci(\"Ece\", 101);\n        // Ogrenci x = new Ogrenci();  // HATA: Ogrenci() yapıcısı yok\n        o.Ogrenci();                  // sıradan metot çağrısı\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          18
        ],
        "note": "<code>new Ogrenci(\"Ece\", 101)</code>: argümanlar (String, int) → eşleşen yapıcı çalışır."
      },
      {
        "lines": [
          5,
          6,
          7
        ],
        "note": "Yapıcı alanları doldurur (this konusunu ileride göreceğiz).",
        "vars": {
          "o.ad": "\"Ece\"",
          "o.no": "101"
        }
      },
      {
        "lines": [
          8
        ],
        "note": "Yapıcı gövdesindeki her şey nesne oluşurken çalışır.",
        "out": "Ece oluşturuldu"
      },
      {
        "lines": [
          19
        ],
        "note": "Bu satır açılsa <b>derlenmezdi</b>: sınıfa yapıcı yazdığımız için derleyici <code>Ogrenci()</code> eklemedi."
      },
      {
        "lines": [
          20,
          11,
          12
        ],
        "note": "<code>void Ogrenci()</code> yapıcı değil; nesne üzerinden metot gibi çağrılabiliyor.",
        "out": "ben yapıcı değilim"
      }
    ]
  });

  T("tr-referans-iz", {
    "files": [
      {
        "name": "TraceCircle.java",
        "code": "\nclass Circle {\n    double radius = 1.0;\n    Circle() { }\n    Circle(double newRadius) { radius = newRadius; }\n}\n\npublic class TraceCircle {\n    public static void main(String[] args) {\n        Circle myCircle = new Circle(5.0);\n        Circle yourCircle = new Circle();\n        yourCircle.radius = 100;\n        System.out.println(myCircle.radius + \" \" + yourCircle.radius);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          9
        ],
        "note": "① <b>myCircle bildirildi</b>. Henüz hiçbir nesneyi göstermiyor.",
        "vars": {
          "myCircle": "(değer yok)"
        }
      },
      {
        "lines": [
          9,
          4
        ],
        "note": "② <code>new Circle(5.0)</code>: heap'te nesne oluştu, alan önce 1.0 ile başlatıldı, sonra yapıcı radius'u 5.0 yaptı.",
        "vars": {
          "myCircle": "(değer yok)",
          "heap: Circle#1": "{radius=5.0}"
        }
      },
      {
        "lines": [
          9
        ],
        "note": "③ Nesnenin <b>referansı</b> myCircle'a atandı.",
        "vars": {
          "myCircle": "→ Circle#1",
          "heap: Circle#1": "{radius=5.0}"
        }
      },
      {
        "lines": [
          10
        ],
        "note": "④ yourCircle bildirildi.",
        "vars": {
          "myCircle": "→ Circle#1",
          "heap: Circle#1": "{radius=5.0}",
          "yourCircle": "(değer yok)"
        }
      },
      {
        "lines": [
          10,
          3
        ],
        "note": "⑤ İkinci nesne: no-arg yapıcı hiçbir şey yapmıyor, radius alan başlangıcından 1.0 kalıyor.",
        "vars": {
          "myCircle": "→ Circle#1",
          "heap: Circle#1": "{radius=5.0}",
          "yourCircle": "(değer yok)",
          "heap: Circle#2": "{radius=1.0}"
        }
      },
      {
        "lines": [
          10
        ],
        "note": "⑥ Referans yourCircle'a atandı.",
        "vars": {
          "myCircle": "→ Circle#1",
          "heap: Circle#1": "{radius=5.0}",
          "yourCircle": "→ Circle#2",
          "heap: Circle#2": "{radius=1.0}"
        }
      },
      {
        "lines": [
          11
        ],
        "note": "⑦ Nokta operatörüyle <b>yourCircle'ın gösterdiği</b> nesnenin radius'u değişti. myCircle etkilenmez.",
        "vars": {
          "myCircle": "→ Circle#1",
          "heap: Circle#1": "{radius=5.0}",
          "yourCircle": "→ Circle#2",
          "heap: Circle#2": "{radius=100.0}"
        }
      },
      {
        "lines": [
          12
        ],
        "note": "int 100, double alana atanınca 100.0 olur.",
        "out": "5.0 100.0"
      }
    ]
  });

  T("tr-varsayilan-deger", {
    "files": [
      {
        "name": "Student.java",
        "code": "\npublic class Student {\n    String name;            // null\n    int age;                // 0\n    boolean isScienceMajor; // false\n    char gender;            // '\\u0000'\n}"
      },
      {
        "name": "Test.java",
        "code": "\npublic class Test {\n    public static void main(String[] args) {\n        Student student = new Student();\n        System.out.println(\"name? \" + student.name);\n        System.out.println(\"age? \" + student.age);\n        System.out.println(\"isScienceMajor? \" + student.isScienceMajor);\n\n        int x;               // yerel değişken: varsayılan değeri YOK\n        // System.out.println(x);   // derleme hatası: not initialized\n\n        System.out.println(student.name.length());\n    }\n}"
      }
    ],
    "steps": [
      {
        "file": 1,
        "lines": [
          3
        ],
        "note": "Nesne oluştu; tüm alanlar varsayılan değerleri aldı.",
        "vars": {
          "student.name": "null",
          "student.age": "0",
          "student.isScienceMajor": "false"
        }
      },
      {
        "file": 1,
        "lines": [
          4
        ],
        "note": "null, String birleştirmede \"null\" yazısı olarak görünür.",
        "out": "name? null"
      },
      {
        "file": 1,
        "lines": [
          5
        ],
        "note": "",
        "out": "age? 0"
      },
      {
        "file": 1,
        "lines": [
          6
        ],
        "note": "",
        "out": "isScienceMajor? false"
      },
      {
        "file": 1,
        "lines": [
          8,
          9
        ],
        "note": "Yerel <code>x</code>'in değeri yok. Yorum satırı açılsa program <b>derlenmezdi</b>."
      },
      {
        "file": 1,
        "lines": [
          11
        ],
        "note": "<code>name</code> null; null üzerinde metot çağrılamaz → çalışma zamanında çöker.",
        "out": "!!Exception in thread \"main\" java.lang.NullPointerException"
      }
    ]
  });

  T("tr-ilkel-referans", {
    "files": [
      {
        "name": "Kopya.java",
        "code": "\npublic class Kopya {\n    public static void main(String[] args) {\n        int i = 1, j = 2;\n        i = j;          // değer kopyalanır\n        j = 50;\n\n        Circle c1 = new Circle(5);\n        Circle c2 = new Circle(9);\n        c1 = c2;        // referans kopyalanır\n        c1.radius = 7;\n        System.out.println(i + \" \" + j);\n        System.out.println(c2.radius + \" \" + (c1 == c2));\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          3
        ],
        "vars": {
          "i": "1",
          "j": "2"
        },
        "note": "İki ilkel değişken; değerler kutuların içinde."
      },
      {
        "lines": [
          4
        ],
        "vars": {
          "i": "2",
          "j": "2"
        },
        "note": "j'nin <b>değeri</b> i'ye kopyalandı."
      },
      {
        "lines": [
          5
        ],
        "vars": {
          "i": "2",
          "j": "50"
        },
        "note": "j değişti, i etkilenmedi: ayrı kutular."
      },
      {
        "lines": [
          7,
          8
        ],
        "vars": {
          "i": "2",
          "j": "50",
          "c1": "→ Circle#A {radius=5}",
          "c2": "→ Circle#B {radius=9}"
        },
        "note": "İki ayrı nesne, iki referans."
      },
      {
        "lines": [
          9
        ],
        "vars": {
          "i": "2",
          "j": "50",
          "c1": "→ Circle#B",
          "c2": "→ Circle#B {radius=9}",
          "Circle#A": "ÇÖP (kimse göstermiyor)"
        },
        "note": "c1 artık B'yi gösteriyor. A'ya giden yol kalmadı → <b>garbage collection</b> onu toplayabilir."
      },
      {
        "lines": [
          10
        ],
        "vars": {
          "i": "2",
          "j": "50",
          "c1": "→ Circle#B",
          "c2": "→ Circle#B {radius=7}",
          "Circle#A": "ÇÖP (kimse göstermiyor)"
        },
        "note": "c1 üzerinden değiştirdik ama nesne ortak → c2 de 7 görür."
      },
      {
        "lines": [
          11
        ],
        "out": "2 50"
      },
      {
        "lines": [
          12
        ],
        "out": "7.0 true",
        "note": "Aynı nesneyi gösterdikleri için <code>==</code> true."
      }
    ]
  });

  T("tr-date-random", {
    "files": [
      {
        "name": "RastgeleTest.java",
        "code": "\nimport java.util.Date;\nimport java.util.Random;\n\npublic class RastgeleTest {\n    public static void main(String[] args) {\n        Date date = new Date();\n        System.out.println(date.toString());\n\n        Random random1 = new Random(3);\n        System.out.print(\"From random1: \");\n        for (int i = 0; i < 10; i++)\n            System.out.print(random1.nextInt(1000) + \" \");\n\n        Random random2 = new Random(3);\n        System.out.print(\"\\nFrom random2: \");\n        for (int i = 0; i < 10; i++)\n            System.out.print(random2.nextInt(1000) + \" \");\n\n        int zar = new Random().nextInt(6) + 1;   // 1..6\n    }\n}"
      }
    ],
    "output": "Sun Mar 09 13:50:19 EST 2003   (çalıştırdığın ana göre değişir)\nFrom random1: 734 660 210 581 128 202 549 564 459 961 \nFrom random2: 734 660 210 581 128 202 549 564 459 961 "
  });

  T("tr-static", {
    "files": [
      {
        "name": "Circle2.java",
        "code": "\npublic class Circle2 {\n    double radius;                    // instance: her nesneye ayrı\n    static int numberOfObjects = 0;   // static: sınıfa tek kopya\n\n    Circle2() {\n        radius = 1.0;\n        numberOfObjects++;\n    }\n    Circle2(double newRadius) {\n        radius = newRadius;\n        numberOfObjects++;\n    }\n    static int getNumberOfObjects() {\n        return numberOfObjects;\n    }\n    double getArea() {\n        return radius * radius * Math.PI;\n    }\n}"
      },
      {
        "name": "TestCircle2.java",
        "code": "\npublic class TestCircle2 {\n    public static void main(String[] args) {\n        System.out.println(\"Başta: \" + Circle2.numberOfObjects);\n        Circle2 c1 = new Circle2();\n        Circle2 c2 = new Circle2(5);\n        c1.radius = 9;\n        System.out.println(\"c1: \" + c1.radius + \", c2: \" + c2.radius);\n        System.out.println(\"Sayı: \" + Circle2.getNumberOfObjects());\n        System.out.println(\"c1 üzerinden: \" + c1.numberOfObjects);\n    }\n}"
      }
    ],
    "steps": [
      {
        "file": 1,
        "lines": [
          3
        ],
        "note": "Hiç nesne yokken bile static alan vardır ve sınıf adıyla erişilir.",
        "vars": {
          "Circle2.numberOfObjects": "0"
        },
        "out": "Başta: 0"
      },
      {
        "file": 0,
        "lines": [
          5,
          6,
          7
        ],
        "note": "c1 oluşurken no-arg yapıcı ortak sayacı artırdı.",
        "vars": {
          "Circle2.numberOfObjects": "1",
          "c1.radius": "1.0"
        }
      },
      {
        "file": 0,
        "lines": [
          9,
          10,
          11
        ],
        "note": "c2 oluşurken aynı <b>ortak</b> sayaç tekrar arttı.",
        "vars": {
          "Circle2.numberOfObjects": "2",
          "c1.radius": "1.0",
          "c2.radius": "5.0"
        }
      },
      {
        "file": 1,
        "lines": [
          6
        ],
        "note": "Instance alan değişti: sadece c1 etkilenir.",
        "vars": {
          "Circle2.numberOfObjects": "2",
          "c1.radius": "9.0",
          "c2.radius": "5.0"
        }
      },
      {
        "file": 1,
        "lines": [
          7
        ],
        "out": "c1: 9.0, c2: 5.0"
      },
      {
        "file": 1,
        "lines": [
          8
        ],
        "note": "Static metot sınıf adıyla çağrılır.",
        "out": "Sayı: 2"
      },
      {
        "file": 1,
        "lines": [
          9
        ],
        "note": "Nesne üzerinden erişince de aynı tek kopyayı görürsün.",
        "out": "c1 üzerinden: 2"
      }
    ]
  });

  T("tr-static-erisim", {
    "files": [
      {
        "name": "A.java",
        "code": "\npublic class A {\n    int i = 5;\n    static int k = 2;\n\n    public static void main(String[] args) {\n        // int j = i;   // HATA: i bir instance değişkeni\n        // m1();        // HATA: m1 bir instance metodu\n        A a = new A();  // çözüm: önce nesne\n        int j = a.i;\n        a.m1();\n        System.out.println(j + \" \" + a.i + \" \" + k);\n    }\n\n    public void m1() {\n        // instance metot her şeye erişebilir\n        i = i + k + m2(i, k);\n    }\n\n    public static int m2(int i, int j) {\n        return (int) (Math.pow(i, j));\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          6
        ],
        "note": "Açılsa <b>derlenmez</b>: static main'de hangi nesnenin i'si olduğu belli değil."
      },
      {
        "lines": [
          7
        ],
        "note": "Açılsa <b>derlenmez</b>: m1 bir nesne üzerinden çağrılmalı."
      },
      {
        "lines": [
          8,
          9
        ],
        "note": "Nesne oluşturunca sorun kalmaz.",
        "vars": {
          "a.i": "5",
          "A.k": "2",
          "j": "5"
        }
      },
      {
        "lines": [
          10,
          16
        ],
        "note": "Instance metot: instance alan (i), static alan (k) ve static metot (m2) hepsi serbest.",
        "vars": {
          "a.i": "5",
          "A.k": "2",
          "j": "5"
        }
      },
      {
        "lines": [
          19,
          20
        ],
        "note": "m2(5, 2) = 5² = 25",
        "vars": {
          "a.i": "5",
          "A.k": "2",
          "j": "5",
          "m2 sonucu": "25"
        }
      },
      {
        "lines": [
          16
        ],
        "note": "i = 5 + 2 + 25 = 32",
        "vars": {
          "a.i": "32",
          "A.k": "2",
          "j": "5"
        }
      },
      {
        "lines": [
          11
        ],
        "note": "j, i'nin eski değerinin kopyasıydı; değişmedi.",
        "out": "5 32 2"
      }
    ]
  });

  T("tr-gorunurluk", {
    "files": [
      {
        "name": "p1/C1.java",
        "code": "\npackage p1;\n\npublic class C1 {\n    public int x;\n    int y;              // default (package-private)\n    private int z;\n\n    public void m1() { }\n    void m2() { }\n    private void m3() { }\n}"
      },
      {
        "name": "p1/C2.java",
        "code": "\npackage p1;              // AYNI paket\n\npublic class C2 {\n    void aMethod() {\n        C1 o = new C1();\n        o.x = 1;         // ✓ public\n        o.y = 2;         // ✓ default, aynı paket\n        // o.z = 3;      // ✗ private\n        o.m1();          // ✓\n        o.m2();          // ✓\n        // o.m3();       // ✗\n    }\n}"
      },
      {
        "name": "p2/C3.java",
        "code": "\npackage p2;              // FARKLI paket\nimport p1.C1;\n\npublic class C3 {\n    void aMethod() {\n        C1 o = new C1();\n        o.x = 1;         // ✓ public\n        // o.y = 2;      // ✗ default, paket dışı\n        // o.z = 3;      // ✗ private\n        o.m1();          // ✓\n        // o.m2();       // ✗\n        // o.m3();       // ✗\n    }\n}"
      }
    ],
    "steps": [
      {
        "file": 0,
        "lines": [
          4,
          5,
          6
        ],
        "note": "C1'de üç farklı erişim seviyesinde alan var."
      },
      {
        "file": 1,
        "lines": [
          6,
          7
        ],
        "note": "Aynı paketteki C2: public ve default üyelere erişir."
      },
      {
        "file": 1,
        "lines": [
          8,
          12
        ],
        "note": "private üyeler C1 dışında hiçbir yerden görünmez."
      },
      {
        "file": 2,
        "lines": [
          8
        ],
        "note": "Farklı paketteki C3: sadece public üyeler."
      },
      {
        "file": 2,
        "lines": [
          9,
          12
        ],
        "note": "Default üyeler paket sınırında durur."
      }
    ]
  });

  T("tr-kapsulleme", {
    "files": [
      {
        "name": "Circle3.java",
        "code": "\npublic class Circle3 {\n    private double radius = 1;\n    private static int numberOfObjects = 0;\n\n    public Circle3() { numberOfObjects++; }\n    public Circle3(double newRadius) {\n        setRadius(newRadius);\n        numberOfObjects++;\n    }\n\n    public double getRadius() {          // getter\n        return radius;\n    }\n    public void setRadius(double newRadius) {   // setter + doğrulama\n        radius = (newRadius >= 0) ? newRadius : 0;\n    }\n    public static int getNumberOfObjects() {\n        return numberOfObjects;\n    }\n    public double getArea() {\n        return radius * radius * Math.PI;\n    }\n}"
      },
      {
        "name": "TestCircle3.java",
        "code": "\npublic class TestCircle3 {\n    public static void main(String[] args) {\n        Circle3 myCircle = new Circle3(5.0);\n        System.out.println(\"Yarıçap: \" + myCircle.getRadius());\n        // myCircle.radius = -10;     // HATA: radius private\n        myCircle.setRadius(-10);       // kapıdan geçmek zorunda\n        System.out.println(\"Yarıçap: \" + myCircle.getRadius());\n        System.out.println(\"Nesne sayısı: \" + Circle3.getNumberOfObjects());\n    }\n}"
      }
    ],
    "steps": [
      {
        "file": 1,
        "lines": [
          3
        ],
        "note": "Yapıcı, doğrudan atama yerine setter'ı kullanıyor: kural tek yerde.",
        "vars": {
          "myCircle.radius": "5.0",
          "numberOfObjects": "1"
        }
      },
      {
        "file": 1,
        "lines": [
          4
        ],
        "out": "Yarıçap: 5.0"
      },
      {
        "file": 1,
        "lines": [
          5
        ],
        "note": "Açılsa derleme hatası: private alana dışarıdan erişilemez."
      },
      {
        "file": 0,
        "lines": [
          14,
          15
        ],
        "note": "Setter -10'u reddedip 0 atadı. Nesne geçersiz duruma düşmedi.",
        "vars": {
          "myCircle.radius": "0.0",
          "numberOfObjects": "1"
        }
      },
      {
        "file": 1,
        "lines": [
          7
        ],
        "out": "Yarıçap: 0.0"
      },
      {
        "file": 1,
        "lines": [
          8
        ],
        "out": "Nesne sayısı: 1"
      }
    ]
  });

  T("tr-pass-by-value", {
    "files": [
      {
        "name": "TestPassObject.java",
        "code": "\npublic class TestPassObject {\n    static void degistir(int n, Circle c) {\n        n = 100;               // sadece kopya değişir\n        c.radius = 100;        // ortak nesne değişir\n        c = new Circle(1);     // kopya referans başka nesneye döner\n        c.radius = 50;         // yeni nesne değişir, dışarısı görmez\n    }\n\n    public static void main(String[] args) {\n        int x = 5;\n        Circle k = new Circle(5);\n        degistir(x, k);\n        System.out.println(x + \" \" + k.radius);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          10,
          11
        ],
        "note": "main'in stack çerçevesi: x ilkel, k bir referans.",
        "vars": {
          "main.x": "5",
          "main.k": "→ Circle#1 {radius=5}"
        }
      },
      {
        "lines": [
          12,
          2
        ],
        "note": "Çağrı: x'in <b>değeri</b> (5) n'ye, k'nin <b>referansı</b> c'ye kopyalandı. c ve k aynı nesneyi gösteriyor.",
        "vars": {
          "main.x": "5",
          "main.k": "→ Circle#1 {radius=5}",
          "degistir.n": "5",
          "degistir.c": "→ Circle#1"
        }
      },
      {
        "lines": [
          3
        ],
        "note": "n değişti; main.x'in bundan haberi yok.",
        "vars": {
          "main.x": "5",
          "main.k": "→ Circle#1 {radius=5}",
          "degistir.n": "100",
          "degistir.c": "→ Circle#1"
        }
      },
      {
        "lines": [
          4
        ],
        "note": "c üzerinden <b>ortak</b> nesnenin içi değişti → main.k de bunu görür.",
        "vars": {
          "main.x": "5",
          "main.k": "→ Circle#1 {radius=100}",
          "degistir.n": "100",
          "degistir.c": "→ Circle#1"
        }
      },
      {
        "lines": [
          5
        ],
        "note": "c'ye yeni nesne atandı. Sadece kopya referans yön değiştirdi; main.k hâlâ Circle#1'i gösteriyor.",
        "vars": {
          "main.x": "5",
          "main.k": "→ Circle#1 {radius=100}",
          "degistir.n": "100",
          "degistir.c": "→ Circle#2 {radius=1}"
        }
      },
      {
        "lines": [
          6
        ],
        "note": "Bu değişiklik Circle#2'ye; main'in hiç görmediği bir nesne.",
        "vars": {
          "main.x": "5",
          "main.k": "→ Circle#1 {radius=100}",
          "degistir.n": "100",
          "degistir.c": "→ Circle#2 {radius=50}"
        }
      },
      {
        "lines": [
          13
        ],
        "note": "Metot bitti, n ve c yok oldu (Circle#2 artık çöp).",
        "vars": {
          "main.x": "5",
          "main.k": "→ Circle#1 {radius=100}"
        },
        "out": "5 100.0"
      }
    ]
  });

  T("tr-immutable", {
    "files": [
      {
        "name": "Student.java",
        "code": "\npublic class Student {\n    private int id;\n    private BirthDate birthDate;\n\n    public Student(int ssn, int year, int month, int day) {\n        id = ssn;\n        birthDate = new BirthDate(year, month, day);\n    }\n    public int getId() { return id; }\n    public BirthDate getBirthDate() {\n        return birthDate;          // SIZINTI: iç nesnenin referansı\n    }\n}"
      },
      {
        "name": "BirthDate.java",
        "code": "\npublic class BirthDate {\n    private int year, month, day;\n\n    public BirthDate(int newYear, int newMonth, int newDay) {\n        year = newYear; month = newMonth; day = newDay;\n    }\n    public void setYear(int newYear) {   // BirthDate değiştirilebilir!\n        year = newYear;\n    }\n    public int getYear() { return year; }\n}"
      },
      {
        "name": "Test.java",
        "code": "\npublic class Test {\n    public static void main(String[] args) {\n        Student student = new Student(111223333, 1970, 5, 3);\n        BirthDate date = student.getBirthDate();\n        date.setYear(2010);   // öğrencinin doğum yılı değişti!\n        System.out.println(student.getBirthDate().getYear());\n    }\n}"
      }
    ],
    "steps": [
      {
        "file": 2,
        "lines": [
          3
        ],
        "note": "Student oluştu; içinde private bir BirthDate nesnesi var.",
        "vars": {
          "student": "→ Student {id=111223333, birthDate→BD#1}",
          "BD#1": "{year=1970}"
        }
      },
      {
        "file": 0,
        "lines": [
          10,
          11
        ],
        "note": "Getter iç nesnenin <b>referansını</b> dışarı verdi.",
        "vars": {
          "student": "→ Student {birthDate→BD#1}",
          "BD#1": "{year=1970}",
          "date": "→ BD#1 (aynı nesne!)"
        }
      },
      {
        "file": 2,
        "lines": [
          5
        ],
        "note": "Dışarıdaki kod, Student'ın private nesnesini değiştirdi. Kapsülleme delindi.",
        "vars": {
          "student": "→ Student {birthDate→BD#1}",
          "BD#1": "{year=2010}",
          "date": "→ BD#1"
        }
      },
      {
        "file": 2,
        "lines": [
          6
        ],
        "out": "2010"
      }
    ]
  });

  T("tr-kapsam", {
    "files": [
      {
        "name": "Kapsam.java",
        "code": "\npublic class Kapsam {\n    public double getArea() {\n        return radius * radius * Math.PI;   // radius aşağıda ama sorun değil\n    }\n    private double radius = 1;               // alan: tüm sınıfta geçerli\n\n    void yerel() {\n        int toplam = 0;\n        for (int i = 0; i < 3; i++) {\n            int kare = i * i;                // sadece bu blokta\n            toplam += kare;\n        }\n        // System.out.println(i);           // HATA: i kapsam dışı\n        // System.out.println(kare);        // HATA: kare kapsam dışı\n        System.out.println(toplam);\n    }\n}"
      }
    ],
    "hl": [
      4,
      6
    ]
  });

  T("tr-this", {
    "files": [
      {
        "name": "Circle.java",
        "code": "\npublic class Circle {\n    private double radius;\n\n    public Circle(double radius) {\n        this.radius = radius;      // alan = parametre\n    }\n\n    public Circle() {\n        this(1.0);                 // diğer yapıcıya devret\n    }\n\n    public void hataliSet(double radius) {\n        radius = radius;           // parametre = parametre (!)\n    }\n\n    public double getArea() {\n        return this.radius * this.radius * Math.PI;\n    }\n\n    public static void main(String[] args) {\n        Circle c = new Circle();\n        c.hataliSet(50);\n        System.out.println(c.radius);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          21,
          8
        ],
        "note": "<code>new Circle()</code> → no-arg yapıcı seçildi."
      },
      {
        "lines": [
          9,
          4
        ],
        "note": "<code>this(1.0)</code> ilk satırda, <code>Circle(double)</code> yapıcısına devrediyor."
      },
      {
        "lines": [
          5
        ],
        "note": "<code>this.radius</code> = alan, sağdaki <code>radius</code> = parametre (1.0).",
        "vars": {
          "c.radius": "1.0"
        }
      },
      {
        "lines": [
          22,
          12,
          13
        ],
        "note": "Burada <code>this</code> yok: parametre kendine atandı. Alan <b>değişmedi</b>!",
        "vars": {
          "c.radius": "1.0",
          "parametre radius": "50.0"
        }
      },
      {
        "lines": [
          23
        ],
        "out": "1.0"
      }
    ]
  });

  T("tr-nesne-dizileri", {
    "files": [
      {
        "name": "TotalArea.java",
        "code": "\npublic class TotalArea {\n    public static void main(String[] args) {\n        Circle[] circleArray = new Circle[3];\n        System.out.println(circleArray[0]);\n\n        for (int i = 0; i < circleArray.length; i++)\n            circleArray[i] = new Circle(i + 1);\n\n        double total = 0;\n        for (Circle c : circleArray)\n            total += c.getArea();\n        System.out.printf(\"Toplam alan: %.2f%n\", total);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          3
        ],
        "note": "3 referans kutulu bir dizi. <b>Hiç Circle nesnesi yok.</b>",
        "vars": {
          "circleArray": "→ [null, null, null]"
        }
      },
      {
        "lines": [
          4
        ],
        "out": "null"
      },
      {
        "lines": [
          6,
          7
        ],
        "note": "Döngü her kutuya yeni bir nesne koyuyor.",
        "vars": {
          "circleArray": "→ [→C(r=1), →C(r=2), →C(r=3)]"
        }
      },
      {
        "lines": [
          9,
          10,
          11
        ],
        "note": "π·(1 + 4 + 9) = 14π",
        "vars": {
          "circleArray": "→ [→C(r=1), →C(r=2), →C(r=3)]",
          "total": "43.98…"
        }
      },
      {
        "lines": [
          12
        ],
        "out": "Toplam alan: 43.98"
      }
    ]
  });

  T("tr-arraylist", {
    "files": [
      {
        "name": "TestArrayList.java",
        "code": "\nimport java.util.ArrayList;\n\npublic class TestArrayList {\n    public static void main(String[] args) {\n        ArrayList<String> cityList = new ArrayList<>();\n        cityList.add(\"London\");\n        cityList.add(\"Denver\");\n        cityList.add(\"Paris\");\n        cityList.add(\"Miami\");\n        cityList.add(\"Seoul\");\n        cityList.add(\"Tokyo\");\n\n        System.out.println(\"List size? \" + cityList.size());\n        System.out.println(\"Is Miami in the list? \" + cityList.contains(\"Miami\"));\n        System.out.println(\"The location of Denver? \" + cityList.indexOf(\"Denver\"));\n        System.out.println(\"Is the list empty? \" + cityList.isEmpty());\n\n        cityList.add(2, \"Xian\");     // araya ekle (sağa kaydırır)\n        cityList.remove(\"Miami\");    // nesneyi sil\n        cityList.remove(1);          // 1. indeksi sil (sola kaydırır)\n        System.out.println(cityList.toString());\n\n        for (int i = cityList.size() - 1; i >= 0; i--)\n            System.out.print(cityList.get(i) + \" \");\n        System.out.println();\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          5
        ],
        "note": "Boş liste.",
        "vars": {
          "cityList": "[]",
          "size": "0"
        }
      },
      {
        "lines": [
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "note": "add() hep sona ekler.",
        "vars": {
          "cityList": "[London, Denver, Paris, Miami, Seoul, Tokyo]",
          "size": "6"
        }
      },
      {
        "lines": [
          13
        ],
        "out": "List size? 6"
      },
      {
        "lines": [
          14
        ],
        "out": "Is Miami in the list? true"
      },
      {
        "lines": [
          15
        ],
        "note": "İndeksler 0'dan başlar.",
        "out": "The location of Denver? 1"
      },
      {
        "lines": [
          16
        ],
        "out": "Is the list empty? false"
      },
      {
        "lines": [
          18
        ],
        "note": "2. indekse Xian girdi; Paris ve sonrası bir sağa kaydı.",
        "vars": {
          "cityList": "[London, Denver, Xian, Paris, Miami, Seoul, Tokyo]",
          "size": "7"
        }
      },
      {
        "lines": [
          19
        ],
        "note": "remove(Object): \"Miami\" bulunup silindi.",
        "vars": {
          "cityList": "[London, Denver, Xian, Paris, Seoul, Tokyo]",
          "size": "6"
        }
      },
      {
        "lines": [
          20
        ],
        "note": "remove(int): 1. indeksteki Denver silindi, sonrakiler sola kaydı.",
        "vars": {
          "cityList": "[London, Xian, Paris, Seoul, Tokyo]",
          "size": "5"
        }
      },
      {
        "lines": [
          21
        ],
        "out": "[London, Xian, Paris, Seoul, Tokyo]"
      },
      {
        "lines": [
          23,
          24,
          25
        ],
        "note": "Sondan başa dolaşma.",
        "out": "Tokyo Seoul Paris Xian London "
      }
    ]
  });

  T("tr-wrapper", {
    "files": [
      {
        "name": "WrapperDemo.java",
        "code": "\nimport java.util.ArrayList;\n\npublic class WrapperDemo {\n    public static void main(String[] args) {\n        int n = Integer.parseInt(\"42\");        // String -> int\n        Integer kutu = n;                       // autoboxing\n        int geri = kutu + 8;                    // unboxing, sonra toplama\n\n        ArrayList<Integer> l = new ArrayList<>();\n        l.add(10); l.add(1); l.add(20);         // autoboxing\n        l.remove(1);                            // İNDEKS 1 silinir!\n        System.out.println(l);\n        l.remove(Integer.valueOf(10));          // DEĞER 10 silinir\n        System.out.println(l);\n\n        Integer a = 127, b = 127, c = 1000, d = 1000;\n        System.out.println((a == b) + \" \" + (c == d) + \" \" + c.equals(d));\n        System.out.println(geri + \" \" + Integer.MAX_VALUE);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          5
        ],
        "note": "parseInt metni sayıya çevirir.",
        "vars": {
          "n": "42"
        }
      },
      {
        "lines": [
          6
        ],
        "note": "Autoboxing: derleyici <code>Integer.valueOf(n)</code> yazar.",
        "vars": {
          "n": "42",
          "kutu": "→ Integer(42)"
        }
      },
      {
        "lines": [
          7
        ],
        "note": "Unboxing: <code>kutu.intValue() + 8</code>.",
        "vars": {
          "n": "42",
          "kutu": "→ Integer(42)",
          "geri": "50"
        }
      },
      {
        "lines": [
          9,
          10
        ],
        "note": "int'ler otomatik Integer'a dönüşüp listeye girdi.",
        "vars": {
          "l": "[10, 1, 20]"
        }
      },
      {
        "lines": [
          11
        ],
        "note": "<code>remove(int)</code> overload'u seçilir → <b>indeks 1</b> (değeri 1 olan eleman) silindi.",
        "vars": {
          "l": "[10, 20]"
        }
      },
      {
        "lines": [
          12
        ],
        "out": "[10, 20]"
      },
      {
        "lines": [
          13
        ],
        "note": "Integer nesnesi verilince <code>remove(Object)</code> seçilir → değeri 10 olan silindi.",
        "vars": {
          "l": "[20]"
        }
      },
      {
        "lines": [
          14
        ],
        "out": "[20]"
      },
      {
        "lines": [
          16,
          17
        ],
        "note": "127 önbellekte → aynı nesne → true. 1000 için iki ayrı nesne → == false. equals içeriğe bakar → true.",
        "out": "true false true"
      },
      {
        "lines": [
          18
        ],
        "out": "50 2147483647"
      }
    ]
  });
})(window.OOPLab = window.OOPLab || {});
