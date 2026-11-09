/*
 * lessons-ch4.js — Bölüm 4: Soyut Sınıflar ve Arayüzler (Liang Bölüm 13 · erken bakış).
 * Blok türleri: p, h, list, table, code (lang:'java' renklendirir), note (exam/why/key/trap/warn/extra), dg (şekil), br.
 * checks: { type:'mc', q, code?, options, answer, a } · { type:'fill', q, code (⟦0⟧ boşluk), answers:[[...]], a }
 * Kod iz sürme şekilleri (tr-*) en altta OOPLab.java.trace ile kaydedilir.
 */
(function (OOPLab) {
  'use strict';

  OOPLab.lessons = OOPLab.lessons || { chapters: [] };

  OOPLab.lessons.chapters.push({
    "id": "ch4",
    "num": 4,
    "title": "Soyut Sınıflar ve Arayüzler",
    "en": "Abstract Classes and Interfaces",
    "source": "Liang Bölüm 13 · erken bakış",
    "objectives": [
      "Soyut sınıf ve soyut metodun kurallarını açıklamak",
      "Arayüzün mantığını, implements ve çoklu arayüzü kullanmak",
      "Soyut sınıf ile arayüz arasında doğru seçimi yapmak; Comparable uygulamak"
    ],
    "tag": "Vize sonrası · erken bakış",
    "lessons": [
      {
        "id": "abstract-sinif",
        "title": "Soyut (abstract) sınıflar ve metotlar",
        "en": "Abstract Classes",
        "src": "Liang Bölüm 13.2 · Hafta 9",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "Kalıtım bölümündeki <code>GeometricObject</code>'i düşün. Her şeklin bir alanı var ama \"genel bir geometrik nesnenin\" alanını hesaplamak anlamsız: formülü yalnızca Circle ve Rectangle bilir. Yine de <code>getArea()</code>'yı üst sınıfta <b>ilan etmek</b> istiyoruz ki <code>GeometricObject g</code> üzerinden polimorfik olarak çağırabilelim."
          },
          {
            "t": "p",
            "html": "Çözüm: <b>soyut metot</b>, yani gövdesi olmayan, sadece imzası olan bir metot:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public abstract double getArea();     // gövde yok, noktalı virgül var"
          },
          {
            "t": "h",
            "text": "Kurallar"
          },
          {
            "t": "list",
            "items": [
              "Soyut metodu olan sınıf <b><code>abstract</code> olarak bildirilmelidir</b>.",
              "Soyut sınıftan <b><code>new</code> ile nesne oluşturulamaz</b>. Ama <b>tip</b> olarak kullanılabilir: <code>GeometricObject g = new Circle(1);</code>",
              "Soyut sınıfın <b>yapıcıları olabilir</b> (genelde <code>protected</code>); alt sınıfların yapıcıları <code>super(...)</code> ile onları çağırır.",
              "Somut (abstract olmayan) bir alt sınıf, miras aldığı <b>tüm</b> soyut metotları uygulamak (override) zorundadır. Uygulamazsa kendisi de abstract olmalıdır.",
              "Soyut sınıfın soyut metodu hiç olmayabilir; yine de nesnesi oluşturulamaz."
            ]
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Soyut sınıf bir <b>sözleşme + ortak kod</b> karışımıdır: \"Her şekil alanını hesaplayabilmeli (sözleşme); rengi ve tarihi ise herkes için aynı şekilde tutulur (ortak kod).\" Derleyici, alt sınıfların sözleşmeyi yerine getirdiğini garanti eder. Böylece <code>equalArea(GeometricObject a, GeometricObject b)</code> gibi genel metotlar yazabilirsin."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>new GeometricObject()</code> → GeometricObject abstract ise <b>derleme hatası</b>. Ama <code>GeometricObject[] dizi = new GeometricObject[5];</code> geçerli (sadece referans dizisi).</li><li>Soyut metodun gövdesi olmaz: <code>abstract double getArea() { }</code> → derleme hatası.</li><li>Soyut metot <code>private</code>, <code>static</code> veya <code>final</code> olamaz (hepsi override'ı engeller).</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-abstract-sinif"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Hangisi <b>doğrudur</b>?",
            "options": [
              "Soyut sınıfın yapıcısı olamaz",
              "Soyut sınıftan new ile nesne oluşturulabilir",
              "Soyut sınıf tipinde değişken tanımlanabilir",
              "Soyut sınıfın tüm metotları soyut olmalıdır"
            ],
            "answer": 2,
            "a": "Soyut sınıf tip olarak kullanılabilir; nesnesi oluşturulamaz, yapıcısı ve somut metotları olabilir."
          },
          {
            "type": "fill",
            "q": "Hayvan'ı soyut yap ve ses() metodunu soyut bildir:",
            "code": "public ⟦0⟧ class Hayvan {\n    public ⟦1⟧ String ses()⟦2⟧\n}",
            "answers": [
              [
                "abstract"
              ],
              [
                "abstract"
              ],
              [
                ";"
              ]
            ],
            "a": "Soyut metodun gövdesi yoktur; imza noktalı virgülle biter."
          }
        ]
      },
      {
        "id": "interface",
        "title": "Arayüz (interface) nedir ve mantığı ne?",
        "en": "Interfaces",
        "src": "Liang Bölüm 13.5 · Hafta 9",
        "minutes": 8,
        "blocks": [
          {
            "t": "p",
            "html": "<b>Arayüz</b>, sınıfların <b>ne yapabileceğini</b> tanımlayan bir <b>sözleşmedir</b>; <b>nasıl</b> yapacaklarını söylemez. Sınıfa benzer ama:"
          },
          {
            "t": "list",
            "items": [
              "<code>interface</code> anahtar kelimesiyle tanımlanır, nesnesi <code>new</code> ile oluşturulamaz.",
              "Tüm <b>alanları</b> otomatik olarak <code>public static final</code>'dır (sabit).",
              "Tüm (soyut) <b>metotları</b> otomatik olarak <code>public abstract</code>'tır. (Java 8+ <code>default</code> ve <code>static</code> gövdeli metotlara da izin verir.)",
              "Bir sınıf arayüzü <b><code>implements</code></b> ile uygular ve tüm soyut metotlarını yazmak zorundadır.",
              "Bir sınıf <b>yalnızca bir</b> sınıfı extend edebilir ama <b>birden çok</b> arayüzü implement edebilir: <code>class Tavuk extends Hayvan implements Yenilebilir, Comparable&lt;Tavuk&gt;</code>",
              "Arayüz bir <b>tiptir</b>: <code>Yenilebilir y = new Tavuk();</code> ve <code>x instanceof Yenilebilir</code> geçerlidir."
            ]
          },
          {
            "t": "p",
            "html": "Liang'ın örneği: Tavuk ve Elma çok farklı şeyler (biri Hayvan, biri Meyve) ama ikisi de <b>yenilebilir</b>. Ortak bir üst sınıfları yok; ortak bir <b>yetenekleri</b> var. Arayüz tam olarak bunu modeller."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Kalıtım <b>\"nedir?\"</b> sorusunu cevaplar (Tavuk bir Hayvandır). Arayüz <b>\"ne yapabilir?\"</b> sorusunu cevaplar (Tavuk yenilebilir, karşılaştırılabilir, kapatılabilir…). Bir şey yalnızca bir şey <i>olabilir</i> ama birçok şey <i>yapabilir</i>; bu yüzden Java tekli sınıf kalıtımı ama çoklu arayüz desteği verir. Bölüm 3'teki try-with-resources bile bir arayüze dayanıyordu: <code>AutoCloseable</code>."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Arayüz metotları otomatik <code>public</code>'tir; uygulayan sınıfta <code>public</code> yazmazsan erişimi daraltmış olursun → <b>derleme hatası</b>.</li><li>Arayüzdeki alan sabittir: <code>interface A { int X = 5; }</code> → <code>A.X = 6;</code> derleme hatası.</li><li><code>new Yenilebilir()</code> derleme hatası; arayüzden nesne oluşturulmaz.</li><li>Sınıf → <code>extends</code> sınıf; sınıf → <code>implements</code> arayüz; arayüz → <code>extends</code> arayüz(ler).</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-interface"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Arayüzde <code>int MAX = 10;</code> diye tanımlanan alan aslında nasıl bir alandır?",
            "options": [
              "private int",
              "public static final int",
              "protected int",
              "public int (değiştirilebilir)"
            ],
            "answer": 1,
            "a": "Arayüz alanları otomatik olarak public static final'dır."
          },
          {
            "type": "fill",
            "q": "Kus sınıfını Hayvan'dan türet ve Ucabilir ile Yuzebilir arayüzlerini uygula:",
            "code": "public class Kus ⟦0⟧ Hayvan ⟦1⟧ Ucabilir, Yuzebilir {\n}",
            "answers": [
              [
                "extends"
              ],
              [
                "implements"
              ]
            ],
            "a": "Önce extends (tek sınıf), sonra implements (virgülle birden çok arayüz)."
          },
          {
            "type": "mc",
            "q": "Arayüzdeki <code>void calis();</code> metodunu uygulayan sınıfta hangisi <b>derlenir</b>?",
            "options": [
              "void calis() { }",
              "protected void calis() { }",
              "public void calis() { }",
              "private void calis() { }"
            ],
            "answer": 2,
            "a": "Arayüz metodu public'tir; uygulama daha kısıtlı olamaz."
          }
        ]
      },
      {
        "id": "soyut-vs-arayuz",
        "title": "Soyut sınıf mı, arayüz mü? Comparable örneği",
        "en": "Abstract Classes vs Interfaces",
        "src": "Liang Bölüm 13.6–13.8 · Hafta 9",
        "minutes": 6,
        "blocks": [
          {
            "t": "table",
            "head": [
              "",
              "Soyut sınıf",
              "Arayüz"
            ],
            "rows": [
              [
                "Alanlar",
                "Her türlü (instance, static)",
                "Sadece <code>public static final</code> sabitler"
              ],
              [
                "Yapıcı",
                "Var (alt sınıflar super ile çağırır)",
                "Yok"
              ],
              [
                "Metotlar",
                "Soyut ve somut karışık",
                "Soyut (+ Java 8 default/static)"
              ],
              [
                "Kalıtım",
                "Sadece bir tane extends edilebilir",
                "Birden çok implements edilebilir"
              ],
              [
                "İlişki",
                "Güçlü <b>is-a</b> (Circle bir GeometricObject'tir)",
                "Zayıf is-a / <b>yetenek</b> (Comparable, Edible)"
              ],
              [
                "new ile nesne",
                "Hayır",
                "Hayır"
              ]
            ]
          },
          {
            "t": "h",
            "text": "Comparable&lt;T&gt;"
          },
          {
            "t": "p",
            "html": "<code>java.lang.Comparable</code>, nesnelerin <b>kendi aralarında sıralanabilmesi</b> için hazır bir arayüzdür:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public interface Comparable<E> {\n    public int compareTo(E o);   // negatif: this küçük, 0: eşit, pozitif: this büyük\n}"
          },
          {
            "t": "p",
            "html": "String, Integer, Double, Date zaten Comparable'ı uygular; bu yüzden <code>Arrays.sort</code> onları sıralayabilir. Kendi sınıfını da Comparable yaparsan <code>Arrays.sort(dizi)</code> onu da sıralar. Sort metodu senin sınıfını tanımaz; sadece <b>sözleşmeye</b> güvenir."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Ortak <b>kod ve durum</b> paylaşılacaksa (alanlar, yapıcılar) → soyut sınıf. Birbiriyle alakasız sınıflara ortak bir <b>yetenek</b> kazandırılacaksa → arayüz. İkisi birlikte de kullanılır: <code>class Circle extends GeometricObject implements Comparable&lt;Circle&gt;</code>."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>compareTo</code> boolean değil <b>int</b> döndürür.</li><li>Comparable'ı uygulamayan nesnelerden oluşan diziyi <code>Arrays.sort</code> ile sıralamak çalışma zamanında <code>ClassCastException</code> verir.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-soyut-vs-arayuz"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Hangisi <b>yalnızca soyut sınıflar</b> için doğrudur?",
            "options": [
              "new ile nesnesi oluşturulamaz",
              "Yapıcısı olabilir",
              "Tip olarak kullanılabilir",
              "Soyut metot içerebilir"
            ],
            "answer": 1,
            "a": "Arayüzlerin yapıcısı yoktur; diğerleri ikisi için de doğru."
          },
          {
            "type": "mc",
            "q": "Bir sınıf aynı anda hangisini yapabilir?",
            "options": [
              "İki sınıfı extend etmek",
              "Bir sınıfı extend edip üç arayüzü implement etmek",
              "Bir arayüzü extend etmek",
              "Bir soyut sınıfı implement etmek"
            ],
            "answer": 1,
            "a": "Tek extends (sınıf), çoklu implements (arayüz)."
          }
        ]
      }
    ]
  });

  const T = OOPLab.java.trace;
  T("tr-abstract-sinif", {
    "files": [
      {
        "name": "GeometricObject.java",
        "code": "\npublic abstract class GeometricObject {\n    private String color = \"white\";\n\n    protected GeometricObject() { }          // yapıcısı olabilir\n    protected GeometricObject(String color) {\n        this.color = color;\n    }\n    public String getColor() { return color; }\n\n    /** Soyut metotlar: alt sınıflar uygulamak ZORUNDA */\n    public abstract double getArea();\n    public abstract double getPerimeter();\n}"
      },
      {
        "name": "Circle.java",
        "code": "\npublic class Circle extends GeometricObject {\n    private double radius;\n\n    public Circle(double radius) {\n        super(\"red\");\n        this.radius = radius;\n    }\n    @Override\n    public double getArea() { return radius * radius * Math.PI; }\n    @Override\n    public double getPerimeter() { return 2 * radius * Math.PI; }\n}"
      },
      {
        "name": "Rectangle.java",
        "code": "\npublic class Rectangle extends GeometricObject {\n    private double width, height;\n\n    public Rectangle(double w, double h) { width = w; height = h; }\n    @Override\n    public double getArea() { return width * height; }\n    @Override\n    public double getPerimeter() { return 2 * (width + height); }\n}"
      },
      {
        "name": "TestGeometricObject.java",
        "code": "\npublic class TestGeometricObject {\n    public static void main(String[] args) {\n        // GeometricObject g = new GeometricObject();   // HATA: abstract\n        GeometricObject g1 = new Circle(1);\n        GeometricObject g2 = new Rectangle(2, 3);\n        System.out.println(\"Eşit alan mı? \" + equalArea(g1, g2));\n        displayGeometricObject(g2);\n    }\n\n    public static boolean equalArea(GeometricObject a, GeometricObject b) {\n        return a.getArea() == b.getArea();       // polimorfik çağrı\n    }\n\n    public static void displayGeometricObject(GeometricObject g) {\n        System.out.println(\"Alan: \" + g.getArea() + \", Çevre: \" + g.getPerimeter());\n    }\n}"
      }
    ],
    "steps": [
      {
        "file": 3,
        "lines": [
          3
        ],
        "note": "Soyut sınıftan nesne oluşturulamaz; bu satır açılsa derlenmez."
      },
      {
        "file": 3,
        "lines": [
          4,
          5
        ],
        "note": "Ama tip olarak kullanılabilir: değişkenler GeometricObject, nesneler somut.",
        "vars": {
          "g1": "GeometricObject → Circle(r=1)",
          "g2": "GeometricObject → Rectangle(2×3)"
        }
      },
      {
        "file": 3,
        "lines": [
          6,
          10,
          11
        ],
        "note": "getArea() GeometricObject'te soyut ama derleyici için var olması yeter. Çalışırken: Circle → π, Rectangle → 6.",
        "vars": {
          "a.getArea()": "3.14159…",
          "b.getArea()": "6.0"
        }
      },
      {
        "file": 3,
        "lines": [
          6
        ],
        "out": "Eşit alan mı? false"
      },
      {
        "file": 3,
        "lines": [
          7,
          14,
          15
        ],
        "note": "Dinamik bağlama Rectangle'ın metotlarını seçer.",
        "out": "Alan: 6.0, Çevre: 10.0"
      }
    ]
  });

  T("tr-interface", {
    "files": [
      {
        "name": "Edible.java",
        "code": "\npublic interface Edible {\n    // otomatik olarak: public abstract\n    String howToEat();\n}"
      },
      {
        "name": "Hayvanlar.java",
        "code": "\nabstract class Animal {\n    public abstract String sound();\n}\n\nclass Chicken extends Animal implements Edible {\n    @Override\n    public String howToEat() { return \"Chicken: Fry it\"; }\n    @Override\n    public String sound() { return \"Chicken: cock-a-doodle-doo\"; }\n}\n\nclass Tiger extends Animal {                // yenilebilir DEĞİL\n    @Override\n    public String sound() { return \"Tiger: RROOAARR\"; }\n}\n\nabstract class Fruit implements Edible { }  // uygulamayı alt sınıfa bırakır\n\nclass Apple extends Fruit {\n    @Override\n    public String howToEat() { return \"Apple: Make apple cider\"; }\n}"
      },
      {
        "name": "TestEdible.java",
        "code": "\npublic class TestEdible {\n    public static void main(String[] args) {\n        Object[] objects = { new Tiger(), new Chicken(), new Apple() };\n        for (Object o : objects) {\n            if (o instanceof Edible)\n                System.out.println(((Edible) o).howToEat());\n            if (o instanceof Animal)\n                System.out.println(((Animal) o).sound());\n        }\n    }\n}"
      }
    ],
    "steps": [
      {
        "file": 2,
        "lines": [
          3
        ],
        "note": "Üç farklı nesne; ortak tipleri sadece Object.",
        "vars": {
          "objects": "[Tiger, Chicken, Apple]"
        }
      },
      {
        "file": 2,
        "lines": [
          4,
          5,
          7,
          8
        ],
        "note": "Tiger: Edible değil, Animal.",
        "out": "Tiger: RROOAARR",
        "vars": {
          "o": "Tiger"
        }
      },
      {
        "file": 2,
        "lines": [
          5,
          6
        ],
        "note": "Chicken Edible'ı uyguluyor → arayüz tipine cast edip çağırabiliriz.",
        "out": "Chicken: Fry it",
        "vars": {
          "o": "Chicken"
        }
      },
      {
        "file": 2,
        "lines": [
          7,
          8
        ],
        "note": "Chicken aynı zamanda bir Animal.",
        "out": "Chicken: cock-a-doodle-doo",
        "vars": {
          "o": "Chicken"
        }
      },
      {
        "file": 2,
        "lines": [
          5,
          6
        ],
        "note": "Apple → Fruit → Edible. Apple bir Animal değil.",
        "out": "Apple: Make apple cider",
        "vars": {
          "o": "Apple"
        }
      }
    ]
  });

  T("tr-soyut-vs-arayuz", {
    "files": [
      {
        "name": "ComparableDemo.java",
        "code": "\nimport java.util.Arrays;\n\nclass Ogrenci implements Comparable<Ogrenci> {\n    String ad;\n    double ort;\n    Ogrenci(String ad, double ort) { this.ad = ad; this.ort = ort; }\n\n    @Override\n    public int compareTo(Ogrenci o) {\n        if (ort < o.ort) return -1;\n        else if (ort > o.ort) return 1;\n        else return 0;\n    }\n    @Override\n    public String toString() { return ad + \"(\" + ort + \")\"; }\n}\n\npublic class ComparableDemo {\n    public static void main(String[] args) {\n        Ogrenci[] sinif = {\n            new Ogrenci(\"Ece\", 3.1), new Ogrenci(\"Can\", 2.4), new Ogrenci(\"Su\", 3.8)\n        };\n        Arrays.sort(sinif);                      // compareTo'yu kullanır\n        System.out.println(Arrays.toString(sinif));\n        System.out.println(\"b\".compareTo(\"a\") > 0);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          20,
          21,
          22
        ],
        "vars": {
          "sinif": "[Ece(3.1), Can(2.4), Su(3.8)]"
        }
      },
      {
        "lines": [
          23,
          9,
          10,
          11,
          12
        ],
        "note": "Arrays.sort sınıfı tanımıyor; sadece Comparable olduğunu biliyor ve compareTo çağırıyor.",
        "vars": {
          "sinif": "[Can(2.4), Ece(3.1), Su(3.8)]"
        }
      },
      {
        "lines": [
          24
        ],
        "out": "[Can(2.4), Ece(3.1), Su(3.8)]"
      },
      {
        "lines": [
          25
        ],
        "note": "String de Comparable: \"b\" alfabetik olarak \"a\"dan sonra → pozitif.",
        "out": "true"
      }
    ]
  });
})(window.OOPLab = window.OOPLab || {});
