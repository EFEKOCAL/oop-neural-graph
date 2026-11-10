/*
 * lessons-ch2.js — Bölüm 2: Kalıtım ve Çok Biçimlilik (Slide02_BPII.pdf).
 * Blok türleri: p, h, list, table, code (lang:'java' renklendirir), note (exam/why/key/trap/warn/extra), dg (şekil), br.
 * checks: { type:'mc', q, code?, options, answer, a } · { type:'fill', q, code (⟦0⟧ boşluk), answers:[[...]], a }
 * Kod iz sürme şekilleri (tr-*) en altta OOPLab.java.trace ile kaydedilir.
 */
(function (OOPLab) {
  'use strict';

  OOPLab.lessons = OOPLab.lessons || { chapters: [] };

  OOPLab.lessons.chapters.push({
    "id": "ch2",
    "num": 2,
    "title": "Kalıtım ve Çok Biçimlilik",
    "en": "Inheritance and Polymorphism",
    "source": "Slide02_BPII.pdf",
    "objectives": [
      "extends ile alt sınıf tanımlamak ve neyin miras alındığını söylemek",
      "super kullanımını ve yapıcı zincirinin çıktı sırasını bulmak",
      "Override ile overload arasındaki farkı ve seçilme zamanlarını açıklamak",
      "Polimorfizm ve dinamik bağlamada bildirilen tip ile gerçek tipin rolünü ayırmak",
      "Casting, instanceof ve equals metodunu doğru kullanmak",
      "protected ve final değiştiricilerinin etkisini açıklamak"
    ],
    "lessons": [
      {
        "id": "kalitim-giris",
        "title": "Kalıtım: üst sınıf ve alt sınıf (extends)",
        "en": "Superclasses and Subclasses",
        "src": "Slide02 · s.2–3, 19",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "Daire, dikdörtgen ve üçgeni modelleyeceğimizi düşün. Hepsinin bir rengi, dolu olup olmadığı ve oluşturulma tarihi var. Bu ortak kısmı üç kez yazmak yerine <b>bir kez</b> <code>GeometricObject</code> sınıfında yazar, diğerlerini ondan <b>türetiriz</b>:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public class Circle extends GeometricObject { ... }"
          },
          {
            "t": "list",
            "items": [
              "<code>GeometricObject</code>: <b>üst sınıf</b> (superclass, parent, base class)",
              "<code>Circle</code>: <b>alt sınıf</b> (subclass, child, extended/derived class)"
            ]
          },
          {
            "t": "p",
            "html": "Alt sınıf, üst sınıfın (erişilebilir) alanlarını ve metotlarını <b>miras alır</b>. Ayrıca:"
          },
          {
            "t": "list",
            "items": [
              "<b>Yeni alanlar</b> ekleyebilir (Circle → <code>radius</code>),",
              "<b>Yeni metotlar</b> ekleyebilir (Circle → <code>getArea()</code>, <code>getDiameter()</code>),",
              "Üst sınıfın metotlarını <b>geçersiz kılabilir (override)</b>."
            ],
            "ordered": true
          },
          {
            "t": "p",
            "html": "Kalıtım bir <b>\"is-a\" (bir ...dır)</b> ilişkisidir: \"Daire <i>bir</i> geometrik nesnedir.\" Bu cümle mantıklı değilse kalıtım kullanma."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Kalıtımın amacı <b>kod tekrarını önlemek</b> ve ortak davranışı tek yerde tutmaktır. Renk mantığında bir hata düzeltirsen üç sınıfta değil tek sınıfta düzeltirsin. Java'da bir sınıf <b>yalnızca bir</b> sınıfı extend edebilir (tekli kalıtım)."
          },
          {
            "t": "p",
            "html": "Slayttaki UML'de (s.3) GeometricObject'in <b>iki</b> alt sınıfı var: <b>Circle</b> (<code>-radius</code>, getArea, getPerimeter, getDiameter, printCircle) ve <b>Rectangle</b> (<code>-width</code>, <code>-height</code>, getter/setter'ları, getArea, getPerimeter). İkisi de color, filled ve dateCreated'i miras alır; kendi alanlarını ve metotlarını ekler."
          },
          {
            "t": "p",
            "html": "Alt sınıf, miras aldığı bir metodu <code>super.</code> ile açıkça çağırabilir (s.20):"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public void printCircle() {\n    System.out.println(\"The circle is created \" +\n        super.getDateCreated() + \" and the radius is \" + radius);\n}"
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Üst sınıfın <code>private</code> alanları alt sınıfta <b>doğrudan</b> kullanılamaz: Circle içinde <code>color = \"red\"</code> derleme hatası; <code>setColor(\"red\")</code> kullanılır.</li><li>Java'da <code>class C extends A, B</code> yazılamaz; sınıflar arası çoklu kalıtım yoktur.</li><li>Alt sınıf, üst sınıfın bir <b>alt kümesi değildir</b>; genellikle daha fazla bilgi ve metot içerir (\"sub\" adına aldanma).</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-kalitim-giris"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Aşağıdakilerden hangisi doğru bir kalıtım (is-a) ilişkisidir?",
            "options": [
              "Araba extends Motor",
              "Ogrenci extends Insan",
              "Kitap extends Kutuphane",
              "Daire extends Nokta"
            ],
            "answer": 1,
            "a": "\"Öğrenci bir insandır\" doğru. \"Araba bir motordur\" değil — araba bir motora <i>sahiptir</i> (has-a)."
          },
          {
            "type": "fill",
            "q": "Kare sınıfını Dikdortgen'den türet:",
            "code": "public class Kare ⟦0⟧ Dikdortgen {\n}",
            "answers": [
              [
                "extends"
              ]
            ],
            "a": "Kalıtım <code>extends</code> anahtar kelimesiyle yapılır."
          }
        ]
      },
      {
        "id": "super-yapici",
        "title": "Üst sınıfın yapıcısı miras alınır mı? super()",
        "en": "Superclass Constructors and super",
        "src": "Slide02 · s.4–7",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "<b>Hayır.</b> Alanlar ve metotlar miras alınır ama <b>yapıcılar miras alınmaz</b>. Üst sınıfın yapıcısı, alt sınıfın yapıcısından <b>açıkça</b> (<code>super(...)</code>) veya <b>dolaylı</b> olarak çağrılır."
          },
          {
            "t": "h",
            "text": "Üst sınıfın yapıcısı HER ZAMAN çağrılır"
          },
          {
            "t": "p",
            "html": "Bir yapıcının ilk satırında <code>this(...)</code> veya <code>super(...)</code> yoksa, derleyici oraya <b>gizlice</b> <code>super();</code> ekler:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public A() { }                  ≡   public A() { super(); }\npublic A(double d) {            ≡   public A(double d) {\n    // ifadeler                         super();\n}                                       // ifadeler\n                                    }"
          },
          {
            "t": "h",
            "text": "super anahtar kelimesinin iki kullanımı"
          },
          {
            "t": "list",
            "items": [
              "Üst sınıf <b>yapıcısını</b> çağırmak: <code>super()</code> veya <code>super(argümanlar)</code>",
              "Üst sınıf <b>metodunu</b> çağırmak: <code>super.metot(argümanlar)</code>"
            ],
            "ordered": true
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Neden yapıcı miras alınmaz? Yapıcının işi <b>kendi sınıfının</b> alanlarını başlatmaktır. <code>GeometricObject(String, boolean)</code> Circle'ın radius'unu bilemez. Ama bir Circle aynı zamanda bir GeometricObject olduğu için, onun parçasının da düzgün başlatılması gerekir. Bu yüzden Java her alt sınıf yapıcısının <b>önce</b> üst sınıf yapıcısını çağırmasını garanti eder: önce temel, sonra kat."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>super(...)</code> yapıcının <b>ilk ifadesi</b> olmalıdır; aksi halde derleme hatası.</li><li>Alt sınıfta üst sınıf yapıcısını adıyla çağırmak (<code>GeometricObject();</code>) sözdizimi hatasıdır; <code>super()</code> kullanılır.</li><li>Bir yapıcıda hem <code>this(...)</code> hem <code>super(...)</code> olamaz; ikisi de ilk satırda olmak ister.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-super-yapici"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Çıktı nedir?",
            "options": [
              "C",
              "CBA",
              "ABC",
              "AC"
            ],
            "answer": 2,
            "a": "Her yapıcı önce gizli super()'i çağırır: C → B → A. A önce biter, sonra B, sonra C yazar.",
            "code": "class A { A() { System.out.print(\"A\"); } }\nclass B extends A { B() { System.out.print(\"B\"); } }\nclass C extends B { C() { System.out.print(\"C\"); } }\n// main:\nnew C();"
          },
          {
            "type": "mc",
            "q": "Yapıcılar için hangisi doğrudur?",
            "options": [
              "Alt sınıf üst sınıfın yapıcılarını miras alır",
              "Alt sınıf yapıcısı üst sınıf yapıcısını ancak super ile çağırabilir; çağırmazsa super() otomatik eklenir",
              "super() yapıcının herhangi bir satırında olabilir",
              "Üst sınıf yapıcısı sadece açıkça çağrılırsa çalışır"
            ],
            "answer": 1,
            "a": "Slide02 s.4–5."
          }
        ],
        "lab": {
          "label": "Yapıcı zinciri laboratuvarında super() çağrılarını izle",
          "preset": {
            "module": "dispatch",
            "tab": "chain",
            "preset": "arac"
          }
        }
      },
      {
        "id": "yapici-zinciri",
        "title": "Yapıcı zincirleme (constructor chaining)",
        "en": "Constructor Chaining",
        "src": "Slide02 · s.8–17",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "Bir sınıftan nesne oluşturmak, kalıtım zinciri boyunca <b>tüm üst sınıfların yapıcılarını</b> çağırır. Buna <b>yapıcı zincirleme</b> denir."
          },
          {
            "t": "p",
            "html": "Sınavdaki klasik soru: <b>\"Bu kod ne yazdırır?\"</b> Çözüm yöntemi:"
          },
          {
            "t": "list",
            "items": [
              "<code>new X()</code> hangi yapıcıyla eşleşiyor? (argüman tiplerine bak)",
              "O yapıcının ilk satırı <code>this(...)</code> mı, <code>super(...)</code> mı, yoksa hiçbiri mi (→ gizli <code>super()</code>)?",
              "Zinciri en tepeye (Object) kadar takip et. <b>Yazdırma işlemleri geri dönerken</b> (en üstten aşağı doğru) gerçekleşir."
            ],
            "ordered": true
          },
          {
            "t": "p",
            "html": "Sağdaki slayt örneğini ▶ ile adım adım izle. Dikkat: <code>Employee()</code>'nin ilk satırı <code>this(...)</code> olduğu için <b>orada</b> gizli <code>super()</code> eklenmez; super çağrısı <code>Employee(String)</code>'de yapılır."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Bir yapıcı ya kendi sınıfının başka bir yapıcısına devreder (<code>this(...)</code>) ya da üst sınıfa çıkar (<code>super(...)</code>). <code>this</code> zinciri sonunda mutlaka bir <code>super</code>'e varır. Böylece Object'ten başlayarak her katman, kendi alanlarını alt katman kullanmaya başlamadan önce başlatmış olur."
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Çıktı sırası = <b>en üst sınıftan en alt sınıfa</b>. Çağrı sırası = <b>en alttan en üste</b>."
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-yapici-zinciri"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Çıktı nedir?",
            "options": [
              "P Q5 Q",
              "P5 Q5 Q",
              "P P5 Q5 Q",
              "Q Q5 P5"
            ],
            "answer": 1,
            "a": "Q() → this(5) → Q(int) → super(5) → P(int) 'P5' yazar. Dönüşte 'Q5', sonra 'Q'. P() hiç çağrılmaz.",
            "code": "class P {\n    P() { System.out.print(\"P \"); }\n    P(int x) { System.out.print(\"P\" + x + \" \"); }\n}\nclass Q extends P {\n    Q() { this(5); System.out.print(\"Q \"); }\n    Q(int x) { super(x); System.out.print(\"Q\" + x + \" \"); }\n}\n// main:\nnew Q();"
          },
          {
            "type": "mc",
            "q": "<code>new Faculty()</code> sırasında <code>Person()</code> yapıcısı kaç kez çalışır?",
            "options": [
              "0",
              "1",
              "2",
              "4"
            ],
            "answer": 1,
            "a": "Zincir tek bir nesne için bir kez kurulur; Person() bir kez çalışır."
          }
        ],
        "lab": {
          "label": "Faculty → Employee → Person zincirini laboratuvarda çalıştır",
          "preset": {
            "module": "dispatch",
            "tab": "chain",
            "preset": "faculty"
          }
        }
      },
      {
        "id": "noarg-hata",
        "title": "Parametresiz yapıcısı olmayan üst sınıf tuzağı",
        "en": "Superclass Without a No-arg Constructor",
        "src": "Slide02 · s.18",
        "minutes": 3,
        "blocks": [
          {
            "t": "p",
            "html": "Slayttaki soru: <b>\"Programdaki hataları bulunuz\"</b>"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public class Apple extends Fruit { }\n\nclass Fruit {\n    public Fruit(String name) { ... }\n}"
          },
          {
            "t": "p",
            "html": "Adım adım düşün:"
          },
          {
            "t": "list",
            "items": [
              "<code>Apple</code>'a hiç yapıcı yazılmamış → derleyici <b>varsayılan yapıcı</b> ekler: <code>public Apple() { super(); }</code>",
              "<code>super()</code> → <code>Fruit()</code> no-arg yapıcısını arar.",
              "<code>Fruit</code>'e bir yapıcı yazılmış (<code>Fruit(String)</code>) → derleyici Fruit'e varsayılan yapıcı <b>eklemez</b>.",
              "<code>Fruit()</code> yok → <b>derleme hatası</b>."
            ],
            "ordered": true
          },
          {
            "t": "h",
            "text": "Çözümler"
          },
          {
            "t": "list",
            "items": [
              "Fruit'e parametresiz bir yapıcı ekle, <b>veya</b>",
              "Apple'a yapıcı yazıp açıkça <code>super(\"Apple\")</code> çağır."
            ]
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Bu hata, önceki iki kuralın birleşimidir: (1) yapıcı yazınca varsayılan yapıcı kaybolur, (2) alt sınıf yapıcısı gizlice <code>super()</code> çağırır. Bu yüzden Liang'ın tavsiyesi: <b>genişletilmek üzere tasarlanan her sınıfa bir no-arg yapıcı koy.</b>"
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Hata Apple'ın <b>derlenmesi</b> sırasında çıkar, nesne oluşturulmasa bile.</li><li>Hata mesajı: <i>constructor Fruit in class Fruit cannot be applied to given types</i>.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kod örneği"
          },
          {
            "t": "dg",
            "id": "tr-noarg-hata"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Aşağıdaki kod derlenir mi?",
            "options": [
              "Evet",
              "Hayır, X'in no-arg yapıcısı yok",
              "Hayır, super(3) yanlış yerde",
              "Hayır, Y'nin X(int)'i miras alması gerekir"
            ],
            "answer": 0,
            "a": "Y açıkça super(3) çağırıyor; X(int) var. Gizli super() eklenmediği için sorun yok.",
            "code": "class X {\n    X(int a) { }\n}\nclass Y extends X {\n    Y() { super(3); }\n}"
          }
        ],
        "lab": {
          "label": "Apple / Fruit derleme hatasını laboratuvarda gör",
          "preset": {
            "module": "dispatch",
            "tab": "chain",
            "preset": "apple"
          }
        }
      },
      {
        "id": "override",
        "title": "Metot geçersiz kılma (override) ve super.metot()",
        "en": "Overriding Methods",
        "src": "Slide02 · s.20–23",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "Alt sınıf, üst sınıftan aldığı bir metodun <b>davranışını değiştirmek</b> isteyebilir. Bunun için metodu <b>aynı imza</b> (aynı ad, aynı parametre listesi) ve <b>aynı (veya uyumlu alt) dönüş tipiyle</b> yeniden yazar. Buna <b>override</b> denir."
          },
          {
            "t": "p",
            "html": "Üst sınıfın orijinal versiyonunu da kullanmak istersen <code>super.metot()</code> yazarsın:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public String toString() {\n    return super.toString() + \"\nradius is \" + radius;\n}"
          },
          {
            "t": "p",
            "html": "<code>@Override</code> notasyonu (annotation) zorunlu değildir ama yazarsan derleyici gerçekten override ettiğini kontrol eder; imzayı yanlış yazarsan seni uyarır."
          },
          {
            "t": "h",
            "text": "Override edilemeyenler"
          },
          {
            "t": "list",
            "items": [
              "<b>private metotlar</b>: Alt sınıftan erişilemedikleri için override edilemezler. Alt sınıfta aynı adla yazılan metot tamamen <b>ilgisiz yeni bir metottur</b>.",
              "<b>static metotlar</b>: Miras alınırlar ama override edilemezler. Alt sınıfta yeniden tanımlanırsa üsttekini <b>gizler (hiding)</b>; hangisinin çalışacağını değişkenin <b>bildirilen tipi</b> belirler.",
              "<b>final metotlar</b>: Bölüm sonunda."
            ]
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Override, polimorfizmin temelidir: \"her şekil alanını hesaplayabilir ama <b>nasıl</b> hesaplayacağını kendisi bilir.\" Instance metotlar nesneye bağlıdır, bu yüzden çalışma anında nesnenin gerçek tipine göre seçilir. Static metotlar nesneye bağlı olmadığı için bu seçimi yapacak bir nesne yoktur — derleyici bildirilen tipe bakar ve iş biter."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Static metot \"override\" edilmiş gibi görünse bile aslında <b>gizlenmiştir</b>: <code>A x = new B(); x.statikMetot();</code> → <b>A</b>'nınki çalışır.</li><li>Override eden metot, üst sınıftakinden <b>daha kısıtlı erişime</b> sahip olamaz (public → protected olamaz).</li><li><code>@Override</code> yazıp imzayı farklı yazarsan derleme hatası alırsın (bu iyi bir şeydir).</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-override"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Çıktı nedir?",
            "options": [
              "Kedi Miyav",
              "Hayvan Miyav",
              "Hayvan ...",
              "Kedi ..."
            ],
            "answer": 1,
            "a": "static tur() bildirilen tipe (Hayvan) göre, instance ses() gerçek tipe (Kedi) göre seçilir.",
            "code": "class Hayvan {\n    static String tur() { return \"Hayvan\"; }\n    String ses() { return \"...\"; }\n}\nclass Kedi extends Hayvan {\n    static String tur() { return \"Kedi\"; }\n    String ses() { return \"Miyav\"; }\n}\n// main:\nHayvan h = new Kedi();\nSystem.out.println(h.tur() + \" \" + h.ses());"
          },
          {
            "type": "fill",
            "q": "Üst sınıfın toString'ini koruyarak genişlet:",
            "code": "⟦0⟧\npublic String toString() {\n    return ⟦1⟧.toString() + \"\\nradius is \" + radius;\n}",
            "answers": [
              [
                "@Override"
              ],
              [
                "super"
              ]
            ],
            "a": "<code>@Override</code> derleyiciye kontrol ettirir, <code>super.toString()</code> üst sınıfın versiyonunu çağırır."
          }
        ],
        "lab": {
          "label": "Dinamik bağlama laboratuvarında metot aramasını izle",
          "preset": {
            "module": "dispatch",
            "tab": "bind",
            "declared": "Person",
            "actual": "GraduateStudent",
            "method": "toString"
          }
        }
      },
      {
        "id": "override-overload",
        "title": "Overriding mi, overloading mi?",
        "en": "Overriding vs Overloading",
        "src": "Slide02 · s.24–26",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "<b>Aşırı yükleme (overloading)</b>: aynı ada sahip, <b>farklı imzalı</b> birden çok metot. <b>Geçersiz kılma (overriding)</b>: alt sınıfta, üst sınıftaki metoda <b>aynı imzayla</b> yeni bir uygulama vermek."
          },
          {
            "t": "table",
            "head": [
              "Overloading",
              "Overriding"
            ],
            "rows": [
              [
                "Aynı ismi farklı parametrelerle yeniden kullanır",
                "Üst sınıftan gelen davranışı değiştirir"
              ],
              [
                "Genelde tek sınıfta (alt sınıfta da olabilir)",
                "<b>Her zaman</b> is-a ilişkili iki sınıfta"
              ],
              [
                "Parametreler <b>farklı olmalı</b>",
                "İsim ve parametreler <b>aynı olmalı</b>"
              ],
              [
                "Dönüş tipi farklı olabilir",
                "Aynı veya uyumlu (covariant) dönüş tipi"
              ],
              [
                "Erişim değiştirici farklı olabilir",
                "Daha <b>kısıtlı olamaz</b>, daha geniş olabilir"
              ],
              [
                "Farklı exception'lar fırlatabilir",
                "Yeni veya daha geniş <b>checked</b> exception fırlatamaz"
              ],
              [
                "Seçim <b>derleme</b> zamanında",
                "Seçim <b>çalışma</b> zamanında (dinamik bağlama)"
              ]
            ]
          },
          {
            "t": "p",
            "html": "Sağdaki iki sekme slayttaki örneğin aynısı. Tek fark A'daki metodun parametre tipi: <code>double</code> → override, <code>int</code> → overload."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Override'da A'nın p(double)'ı B'ninkinin <b>yerini alır</b>: A nesnesinde sadece bir p vardır. Overload'da ise A nesnesinde <b>iki ayrı</b> p vardır: B'den gelen p(double) ve A'nın kendi p(int)'i. Derleyici argümanın tipine bakıp hangisini çağıracağını seçer."
          },
          {
            "t": "p",
            "html": "Slayt 26'daki görsel özet: <b>override</b>: aynı ad, <b>aynı parametreler</b>, alt sınıfta. <b>Overload</b>: aynı ad, <b>farklı parametreler</b>, aynı sınıfta olabilir."
          },
          {
            "t": "code",
            "lang": "java",
            "text": "// OVERRIDING: same name, same parameters\nclass Dog {\n    public void bark() { System.out.println(\"woof\"); }\n}\nclass GermanShepherd extends Dog {\n    @Override\n    public void bark() { System.out.println(\"woof woof woof\"); }\n}\n\n// OVERLOADING: same name, different parameters\nclass Dog {\n    public void bark() { System.out.println(\"woof\"); }\n    public void bark(int number) {\n        for (int i = 0; i < number; i++)\n            System.out.println(\"woof\");\n    }\n}"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-override-overload"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Aşağıdaki B.m metodu A.m'yi override mı eder, overload mu?",
            "options": [
              "Override",
              "Overload",
              "Derleme hatası",
              "Hiçbiri"
            ],
            "answer": 1,
            "a": "Parametre tipi farklı (int vs long) → farklı imza → overload.",
            "code": "class A { void m(int x) { } }\nclass B extends A { void m(long x) { } }"
          },
          {
            "type": "mc",
            "q": "Hangisi override için <b>zorunlu değildir</b>?",
            "options": [
              "Aynı metot adı",
              "Aynı parametre listesi",
              "@Override yazmak",
              "Is-a ilişkisi"
            ],
            "answer": 2,
            "a": "@Override tavsiye edilir ama zorunlu değildir."
          }
        ]
      },
      {
        "id": "object-tostring",
        "title": "Object sınıfı ve toString()",
        "en": "The Object Class and toString()",
        "src": "Slide02 · s.27–28",
        "minutes": 4,
        "blocks": [
          {
            "t": "p",
            "html": "Java'daki <b>her sınıf</b> <code>java.lang.Object</code>'ten türer. Bir sınıf <code>extends</code> yazmazsa üst sınıfı otomatik olarak <code>Object</code>'tir:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public class Circle { }   ≡   public class Circle extends Object { }"
          },
          {
            "t": "p",
            "html": "Bu yüzden her nesnede Object'ten gelen metotlar vardır: <code>toString()</code>, <code>equals(Object)</code>, <code>hashCode()</code>, <code>getClass()</code>…"
          },
          {
            "t": "h",
            "text": "toString()"
          },
          {
            "t": "p",
            "html": "Nesnenin metin temsilini döndürür. Varsayılan hali: <code>SınıfAdı@hexSayı</code> (ör. <code>Loan@15037e5</code>) — pek işe yaramaz. Bu yüzden genellikle <b>override edilir</b>."
          },
          {
            "t": "p",
            "html": "<code>System.out.println(nesne)</code> ve <code>\"metin\" + nesne</code> ifadeleri <b>otomatik olarak</b> <code>toString()</code>'i çağırır."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Object'in her şeyin atası olması, ileride göreceğin <b>polimorfizmin</b> anahtarıdır: <code>Object</code> tipindeki bir parametre <b>her türlü</b> nesneyi kabul eder."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>toString override edilirken imza tam olarak <code>public String toString()</code> olmalı; <code>public</code> yazmazsan erişimi daralttığın için derleme hatası.</li><li><code>println(c)</code> ile <code>println(c.toString())</code> aynı çıktıyı verir.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-object-tostring"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "<code>class Kalem { }</code> sınıfının üst sınıfı nedir?",
            "options": [
              "Yoktur",
              "java.lang.Object",
              "java.lang.Class",
              "java.util.Object"
            ],
            "answer": 1,
            "a": "extends yazılmazsa üst sınıf Object'tir."
          }
        ]
      },
      {
        "id": "polimorfizm",
        "title": "Çok biçimlilik (polymorphism) ve dinamik bağlama",
        "en": "Polymorphism and Dynamic Binding",
        "src": "Slide02 · s.29–31, 33",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "<b>Polimorfizm</b>: Bir <b>üst tip</b> değişkeni, bir <b>alt tip</b> nesneyi gösterebilir. Alt tipin nesnesi, üst tip değerinin beklendiği <b>her yerde</b> kullanılabilir."
          },
          {
            "t": "p",
            "html": "Neden? Çünkü alt sınıfın her nesnesi aynı zamanda üst sınıfının da bir nesnesidir: her daire bir geometrik nesnedir (ama tersi değil)."
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public static void m(Object x) { System.out.println(x.toString()); }\nm(new Student());  m(new Person());  m(new Object());   // hepsi geçerli"
          },
          {
            "t": "h",
            "text": "Dinamik bağlama (dynamic binding)"
          },
          {
            "t": "p",
            "html": "<code>x.toString()</code> çalıştığında <b>hangi</b> toString çalışacak? Bunu derleyici değil, <b>JVM çalışma zamanında</b> belirler:"
          },
          {
            "t": "p",
            "html": "Nesnenin gerçek sınıfı C1 olsun ve zincir <code>C1 → C2 → … → Cn (Object)</code> olsun. JVM metodu önce <b>C1</b>'de arar, yoksa C2'de, … <b>ilk bulduğu</b> uygulamayı çalıştırır ve aramayı durdurur. Yani <b>en özel (en alttaki)</b> versiyon kazanır."
          },
          {
            "t": "h",
            "text": "Genel programlama (generic programming)"
          },
          {
            "t": "p",
            "html": "Parametre tipi üst sınıf (örn. Object) olan tek bir metot, onun tüm alt sınıflarıyla çalışır. Kodun genel, davranışın özel olmasıdır."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Sabah bir <code>Sekil[]</code> dizisi oluşturup içine Daire, Kare, Üçgen koyduğunu düşün. <code>for (Sekil s : sekiller) s.alan();</code> yazarsın; her biri <b>kendi</b> alan formülünü kullanır. Yarın Altıgen eklersen bu döngüye <b>hiç dokunmazsın</b>. Polimorfizm, yeni tipler eklendiğinde mevcut kodun değişmemesini sağlar."
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Hangi metodun çalışacağını <b>nesnenin gerçek tipi</b> belirler, değişkenin tipi değil. (Instance metotlar için.)"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-polimorfizm"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Çıktı nedir?",
            "options": [
              "0.0",
              "9.0",
              "Derleme hatası",
              "3.0"
            ],
            "answer": 1,
            "a": "Dinamik bağlama: gerçek tip Kare → Kare.alan().",
            "code": "class Sekil { double alan() { return 0; } }\nclass Kare extends Sekil {\n    double k = 3;\n    double alan() { return k * k; }\n}\n// main:\nSekil s = new Kare();\nSystem.out.println(s.alan());"
          },
          {
            "type": "mc",
            "q": "\"Dinamik bağlama\" ne demektir?",
            "options": [
              "Metodun derleme zamanında seçilmesi",
              "Çalıştırılacak metot uygulamasının çalışma zamanında nesnenin gerçek tipine göre seçilmesi",
              "Değişkenin tipinin değiştirilmesi",
              "İki nesnenin birbirine bağlanması"
            ],
            "answer": 1,
            "a": "Slide02 s.30–31."
          }
        ],
        "lab": {
          "label": "PolymorphismDemo'yu dinamik bağlama laboratuvarında çalıştır",
          "preset": {
            "module": "dispatch",
            "tab": "bind",
            "declared": "Object",
            "actual": "GraduateStudent",
            "method": "toString"
          }
        }
      },
      {
        "id": "eslestirme-baglama",
        "title": "Metot eşleştirme (derleme) vs bağlama (çalışma)",
        "en": "Method Matching vs Binding",
        "src": "Slide02 · s.32",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "Slaytın en önemli cümlesi: <i>\"Bir yöntem imzasını eşleştirmek ve bir yöntem uygulamasını bağlamak <b>iki ayrı</b> konudur.\"</i>"
          },
          {
            "t": "table",
            "head": [
              "",
              "Kim yapar?",
              "Neye bakar?"
            ],
            "rows": [
              [
                "<b>Eşleştirme (matching)</b>",
                "Derleyici, <b>derleme zamanında</b>",
                "Değişkenin <b>bildirilen tipine</b> ve argümanların tip/sayı/sırasına"
              ],
              [
                "<b>Bağlama (binding)</b>",
                "JVM, <b>çalışma zamanında</b>",
                "Nesnenin <b>gerçek tipine</b>"
              ]
            ]
          },
          {
            "t": "p",
            "html": "Sonuç olarak <code>Hayvan h = new Kedi();</code> için:"
          },
          {
            "t": "list",
            "items": [
              "<code>h.ses()</code>: Derleyici Hayvan'da <code>ses()</code> var mı diye bakar → var, derlenir. Çalışırken Kedi'ninki çalışır.",
              "<code>h.tirman()</code>: Derleyici Hayvan'da <code>tirman()</code> arar → <b>yok</b> → <b>derleme hatası</b>, nesne gerçekte Kedi olsa bile!"
            ]
          },
          {
            "t": "p",
            "html": "<b>Ne çağırabileceğini bildirilen tip</b>, <b>hangisinin çalışacağını gerçek tip</b> belirler."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Derleyici çalışma zamanını göremez: <code>h</code>'ye ileride bir Köpek de atanabilir. Güvenli olsun diye \"Hayvan olduğu kesin olan her şeyin yapabildikleri\" ile sınırlar. Kedi'ye özgü bir şey çağırmak istiyorsan derleyiciye \"bu bir Kedi, bana güven\" demen gerekir: bu da bir sonraki ders, <b>casting</b>."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Üst tip referansı üzerinden alt sınıfa özgü metot çağırmak <b>derleme</b> hatasıdır (çalışma zamanı değil).</li><li>Alanlar (field) polimorfik değildir: <code>A x = new B(); x.alan</code> → bildirilen tipteki (A) alan okunur. Sadece instance metotlar dinamik bağlanır.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-eslestirme-baglama"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "<code>Object o = new Circle(2);</code> sonrası hangisi <b>derlenir</b>?",
            "options": [
              "o.getArea()",
              "o.getRadius()",
              "o.toString()",
              "o.radius"
            ],
            "answer": 2,
            "a": "Derleyici sadece Object'in üyelerine izin verir; toString Object'te var."
          },
          {
            "type": "mc",
            "q": "Bildirilen tip ve gerçek tip için doğru eşleştirme hangisi?",
            "options": [
              "Bildirilen tip → hangi metodun çalışacağı; gerçek tip → hangi metotların çağrılabileceği",
              "Bildirilen tip → hangi metotların çağrılabileceği; gerçek tip → hangi uygulamanın çalışacağı",
              "İkisi de aynı şeyi belirler",
              "Sadece gerçek tip önemlidir"
            ],
            "answer": 1,
            "a": "Eşleştirme derleme zamanında bildirilen tiple, bağlama çalışma zamanında gerçek tiple."
          }
        ],
        "lab": {
          "label": "Bildirilen tip / gerçek tip ayrımını laboratuvarda dene",
          "preset": {
            "module": "dispatch",
            "tab": "bind",
            "declared": "Person",
            "actual": "Student",
            "method": "study"
          }
        }
      },
      {
        "id": "casting",
        "title": "Nesnelerde casting ve instanceof",
        "en": "Casting Objects and instanceof",
        "src": "Slide02 · s.34–40",
        "minutes": 10,
        "blocks": [
          {
            "t": "p",
            "html": "İlkel tiplerdeki casting mantığı kalıtım hiyerarşisinde de geçerlidir:"
          },
          {
            "t": "list",
            "items": [
              "<b>Yukarı (upcasting) — örtük (implicit)</b>: <code>Object o = new Student();</code> Her öğrenci bir Object'tir, <b>her zaman güvenli</b>.",
              "<b>Aşağı (downcasting) — açık (explicit)</b>: <code>Student b = (Student) o;</code> Her Object bir öğrenci değildir; derleyiciye \"eminim\" demek için parantezli cast yazılır. <b>Her zaman başarılı olmayabilir</b>."
            ]
          },
          {
            "t": "p",
            "html": "<code>Student b = o;</code> (cast olmadan) → <b>derleme hatası</b>. Nesne gerçekten Student olsa bile derleyici bunu bilecek kadar akıllı değildir."
          },
          {
            "t": "p",
            "html": "Cast edilen nesne gerçekte o tipten değilse <b>çalışma zamanında</b> <code>ClassCastException</code> fırlatılır."
          },
          {
            "t": "h",
            "text": "instanceof"
          },
          {
            "t": "p",
            "html": "<code>nesne instanceof Sinif</code> → nesne o sınıfın (veya alt sınıflarının) bir örneği mi? Güvenli downcasting kalıbı:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "if (myObject instanceof Circle) {\n    double d = ((Circle) myObject).getDiameter();\n}"
          },
          {
            "t": "h",
            "text": "Meyve benzetmesi (s.38–39)"
          },
          {
            "t": "code",
            "text": "        Fruit\n       /     \\\n    Apple   Orange\n    /    \\\nGolden  McIntosh"
          },
          {
            "t": "p",
            "html": "Elma bir meyvedir → Elma'yı Meyve değişkenine güvenle atarsın. Ama bir meyve elma olmak zorunda değildir → Meyve'yi Elma değişkenine atamak için açık cast gerekir."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Casting <b>nesneyi değiştirmez</b>; sadece derleyicinin ona hangi gözlükle baktığını değiştirir. Nesne heap'te neyse odur. Bu yüzden bir Orange'ı Apple gözlüğüyle görmeye çalışmak çalışma zamanında yakalanır (ClassCastException)."
          },
          {
            "t": "note",
            "kind": "warn",
            "html": "Bölüm sonu özetinde (s.61) iki cümle bozuk çevrilmiş: (1) \"üst sınıf tarafından tanımlanan bir tür, bir <b>alt tür</b> olarak adlandırılır\" → doğrusu \"<b>üst tür (supertype)</b>\". (2) \"Bir nesnenin bir sınıf örneği olup olmadığını sınamak için <b>AClass nesnesini</b> kullanabilirsiniz\" → doğrusu \"<code>nesne instanceof AClass</code> ifadesini kullanabilirsiniz\"."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>((Circle) obj).getDiameter()</code>: cast'in parantezi şart. <code>(Circle) obj.getDiameter()</code> önce metodu çağırmaya çalışır.</li><li>İlişkisiz sınıflar arası cast (ör. <code>(Orange) apple</code>) veya <code>orange instanceof Apple</code> <b>derleme hatasıdır</b>.</li><li>Downcast derleniyorsa bile gerçek tip uymuyorsa <code>ClassCastException</code> (çalışma zamanı).</li><li><code>null instanceof X</code> her zaman <b>false</b>.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-casting"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Hangisi <b>derleme hatası</b> verir?",
            "options": [
              "(1)",
              "(2)",
              "(3)",
              "Hiçbiri"
            ],
            "answer": 1,
            "a": "Object → Student downcast açık cast ister.",
            "code": "Object o = new Student();   // (1)\nStudent s = o;              // (2)\nStudent t = (Student) o;    // (3)"
          },
          {
            "type": "fill",
            "q": "Güvenli downcasting yaz:",
            "code": "Object obj = getirSekil();\nif (obj ⟦0⟧ Circle) {\n    Circle c = ⟦1⟧ obj;\n    System.out.println(c.getDiameter());\n}",
            "answers": [
              [
                "instanceof"
              ],
              [
                "(Circle)"
              ]
            ],
            "a": "Önce <code>instanceof</code> ile kontrol, sonra <code>(Circle)</code> ile açık cast."
          },
          {
            "type": "mc",
            "q": "<code>Fruit f = new Orange(); Apple a = (Apple) f;</code> ne olur?",
            "options": [
              "Derleme hatası",
              "Çalışır, a bir Orange'ı gösterir",
              "Çalışma zamanında ClassCastException",
              "a = null olur"
            ],
            "answer": 2,
            "a": "Fruit → Apple cast'i derlenir (olabilirdi), ama gerçek nesne Orange olduğu için JVM reddeder."
          }
        ],
        "lab": {
          "label": "Downcast ve ClassCastException'ı laboratuvarda dene",
          "preset": {
            "module": "dispatch",
            "tab": "bind",
            "declared": "Person",
            "actual": "Student",
            "method": "cast:GraduateStudent"
          }
        }
      },
      {
        "id": "equals",
        "title": "equals() metodu ve == farkı",
        "en": "The equals Method",
        "src": "Slide02 · s.41–42",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "<code>==</code> operatörü:"
          },
          {
            "t": "list",
            "items": [
              "İlkel tiplerde: <b>değerleri</b> karşılaştırır.",
              "Referans tiplerde: iki değişkenin <b>aynı nesneyi</b> gösterip göstermediğini karşılaştırır."
            ]
          },
          {
            "t": "p",
            "html": "<code>equals(Object)</code> metodu ise iki nesnenin <b>içeriğinin</b> aynı olup olmadığını sınamak içindir. Ama Object'teki varsayılan hali sadece şudur:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public boolean equals(Object obj) {\n    return (this == obj);\n}"
          },
          {
            "t": "p",
            "html": "Yani <b>override etmezsen equals de == gibi davranır</b>. String, Integer gibi sınıflar equals'ı zaten override etmiştir; kendi sınıfların için sen etmelisin:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public boolean equals(Object o) {\n    if (o instanceof Circle)\n        return radius == ((Circle) o).radius;\n    else\n        return false;\n}"
          },
          {
            "t": "p",
            "html": "Slayttaki \"== equals'tan daha güçlüdür\" ifadesinin anlamı: <code>==</code> true ise iki referans <b>aynı nesnedir</b>, dolayısıyla içerikleri de kesinlikle aynıdır. Tersi her zaman doğru değil."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "\"Eşitlik\" sınıfa göre değişen bir kavramdır: iki daire yarıçapları eşitse mi eşittir, yoksa renkleri de mi eşit olmalı? Bunu Java bilemez; sen karar verirsin ve kararını equals'ı override ederek kodlarsın. Parametre tipinin <code>Object</code> olması, override'ın (ve polimorfizmin) çalışması için şarttır."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>public boolean equals(Circle c)</code> yazarsan bu bir <b>overload</b>'dur, override değil! ArrayList.contains gibi metotlar senin metodunu çağırmaz. Parametre <code>Object</code> olmalı.</li><li><code>new String(\"a\") == new String(\"a\")</code> → <b>false</b>; <code>.equals</code> → true.</li><li>Override edilmemiş equals → referans karşılaştırması (== ile aynı).</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-equals"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Bir sınıf equals'ı override etmemişse <code>a.equals(b)</code> neyi karşılaştırır?",
            "options": [
              "Tüm alanları",
              "Referansları (a == b)",
              "toString çıktılarını",
              "Derleme hatası verir"
            ],
            "answer": 1,
            "a": "Object.equals → this == obj."
          },
          {
            "type": "fill",
            "q": "equals'ı doğru imzayla override et:",
            "code": "@Override\npublic ⟦0⟧ equals(⟦1⟧ o) {\n    if (o instanceof Nokta)\n        return x == ((Nokta) o).x;\n    return false;\n}",
            "answers": [
              [
                "boolean"
              ],
              [
                "Object"
              ]
            ],
            "a": "İmza: <code>public boolean equals(Object o)</code>. Parametre Object değilse override değil overload olur."
          }
        ]
      },
      {
        "id": "protected",
        "title": "protected ve erişilebilirlik özeti",
        "en": "The protected Modifier",
        "src": "Slide02 · s.49–53",
        "minutes": 4,
        "blocks": [
          {
            "t": "p",
            "html": "<code>protected</code> üyeye: <b>aynı paketteki</b> her sınıf <b>ve</b> (farklı pakette olsa bile) <b>alt sınıflar</b> erişebilir."
          },
          {
            "t": "p",
            "html": "Görünürlük artış sırası: <code>private</code> → <code>default</code> (hiçbir şey yazılmamış) → <code>protected</code> → <code>public</code>"
          },
          {
            "t": "table",
            "head": [
              "Üyedeki değiştirici",
              "Aynı sınıf",
              "Aynı paket",
              "Alt sınıf (farklı paket)",
              "Farklı paket"
            ],
            "rows": [
              [
                "<code>public</code>",
                "✓",
                "✓",
                "✓",
                "✓"
              ],
              [
                "<code>protected</code>",
                "✓",
                "✓",
                "✓",
                "–"
              ],
              [
                "<i>default</i>",
                "✓",
                "✓",
                "–",
                "–"
              ],
              [
                "<code>private</code>",
                "✓",
                "–",
                "–",
                "–"
              ]
            ]
          },
          {
            "t": "h",
            "text": "Ne zaman hangisi? (s.53)"
          },
          {
            "t": "list",
            "items": [
              "Sınıf dışında kullanılması amaçlanmıyorsa → <b>private</b>",
              "Sınıfı kullanacak herkes için → <b>public</b>",
              "Sınıfı <b>genişletecek</b> olanlar için ama sıradan kullanıcılar için değilse → <b>protected</b>"
            ]
          },
          {
            "t": "p",
            "html": "<code>private</code> ve <code>protected</code> yalnızca <b>sınıf üyelerinde</b> kullanılabilir; üst seviye sınıflar sadece <code>public</code> veya default olabilir."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Kalıtım bir sınıfın iki tür kullanıcısı olduğunu ortaya çıkarır: onu <b>kullananlar</b> (nesne oluşturup metot çağıranlar) ve onu <b>genişletenler</b> (alt sınıf yazanlar). protected, ikinci gruba birinciden daha fazla güvenmeni sağlar."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>protected, default'tan <b>daha geniştir</b>: aynı paketteki herkes zaten erişebilir, buna ek olarak farklı paketteki alt sınıflar da.</li><li>Farklı paketteki alt sınıf, protected üyeye <b>kendi kalıtımı yoluyla</b> erişir (C4 içinde <code>y</code>), ama başka bir C1 nesnesi üzerinden değil.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kod örneği"
          },
          {
            "t": "dg",
            "id": "tr-protected"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Farklı paketteki, alt sınıf <b>olmayan</b> bir sınıf C1'in hangi üyesine erişebilir?",
            "options": [
              "public ve protected",
              "Sadece public",
              "public, protected ve default",
              "Hepsine"
            ],
            "answer": 1,
            "a": "Tablonun son sütunu: sadece public."
          },
          {
            "type": "mc",
            "q": "Aynı paketteki (alt sınıf olmayan) bir sınıf protected üyeye erişebilir mi?",
            "options": [
              "Hayır, protected sadece alt sınıflar içindir",
              "Evet, protected aynı paketi de kapsar",
              "Sadece static ise",
              "Sadece getter ile"
            ],
            "answer": 1,
            "a": "Java'da protected = paket erişimi + alt sınıf erişimi."
          }
        ]
      },
      {
        "id": "final",
        "title": "final ve erişilebilirliği zayıflatamama",
        "en": "The final Modifier",
        "src": "Slide02 · s.54–56",
        "minutes": 5,
        "blocks": [
          {
            "t": "h",
            "text": "Alt sınıf erişilebilirliği zayıflatamaz"
          },
          {
            "t": "p",
            "html": "Override eden metot, üst sınıftakinden <b>daha kısıtlı</b> olamaz. Üst sınıfta <code>public</code> ise alt sınıfta da <code>public</code> olmalı. protected bir metot override edilirken <code>public</code> yapılabilir (genişletmek serbest)."
          },
          {
            "t": "h",
            "text": "final değiştiricisi — üç kullanım"
          },
          {
            "t": "table",
            "head": [
              "Nerede?",
              "Anlamı",
              "Örnek"
            ],
            "rows": [
              [
                "<b>Sınıf</b>",
                "Genişletilemez (extends edilemez)",
                "<code>final class Math</code>, <code>String</code>"
              ],
              [
                "<b>Metot</b>",
                "Alt sınıflarda override edilemez",
                "<code>public final void m()</code>"
              ],
              [
                "<b>Değişken</b>",
                "Sabit: bir kez atanır, değiştirilemez",
                "<code>final static double PI = 3.14159;</code>"
              ]
            ]
          },
          {
            "t": "p",
            "html": "Değiştiriciler normalde sınıf ve üyelerde kullanılır; ama <code>final</code> bir metodun <b>yerel değişkeni</b> için de kullanılabilir (metot içinde sabit)."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Erişimi daraltmak polimorfizmi bozardı: <code>Ust u = new Alt(); u.m();</code> derleyici Ust'te public olduğu için izin verir; çalışma anında Alt.m private olsaydı çağrı imkânsız olurdu. Java bunu baştan yasaklar. <code>final</code> ise \"bu tasarım burada bitti\" demektir: String'in final olması, kimsenin onu değiştirilebilir bir alt sınıfla taklit edememesini sağlar."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>final</code> referans değişkeni başka nesneyi gösteremez ama gösterdiği nesnenin <b>içi</b> değişebilir: <code>final int[] a = {1}; a[0] = 5;</code> geçerli.</li><li><code>final</code> sınıfın metotları da dolaylı olarak override edilemez (çünkü alt sınıf yok).</li><li>Override ederken <code>public</code> → <code>protected</code>/default/<code>private</code> yapmak derleme hatası.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kod örneği"
          },
          {
            "t": "dg",
            "id": "tr-final"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Üst sınıfta <code>protected void m()</code> var. Alt sınıfta hangisi <b>geçerli</b> bir override'dır?",
            "options": [
              "private void m()",
              "void m()",
              "public void m()",
              "Hiçbiri"
            ],
            "answer": 2,
            "a": "Erişim aynı kalabilir veya genişleyebilir: protected veya public."
          },
          {
            "type": "mc",
            "q": "<code>final</code> bir sınıf için doğru olan?",
            "options": [
              "Nesnesi oluşturulamaz",
              "Alt sınıfı olamaz",
              "Tüm alanları sabittir",
              "Metotları static olmalıdır"
            ],
            "answer": 1,
            "a": "final sınıf extends edilemez (ör. String, Math)."
          }
        ]
      }
    ]
  });

  const T = OOPLab.java.trace;
  T("tr-kalitim-giris", {
    "files": [
      {
        "name": "GeometricObject.java",
        "code": "\npublic class GeometricObject {\n    private String color = \"white\";\n    private boolean filled;\n    private java.util.Date dateCreated;\n\n    public GeometricObject() {\n        dateCreated = new java.util.Date();\n    }\n    public GeometricObject(String color, boolean filled) {\n        dateCreated = new java.util.Date();\n        this.color = color;\n        this.filled = filled;\n    }\n    public String getColor() { return color; }\n    public void setColor(String color) { this.color = color; }\n    public boolean isFilled() { return filled; }\n    public void setFilled(boolean filled) { this.filled = filled; }\n    public java.util.Date getDateCreated() { return dateCreated; }\n\n    public String toString() {\n        return \"color: \" + color + \" and filled: \" + filled;\n    }\n}"
      },
      {
        "name": "Circle.java",
        "code": "\npublic class Circle extends GeometricObject {\n    private double radius;                    // YENİ alan\n\n    public Circle() { }\n    public Circle(double radius) {\n        this.radius = radius;\n    }\n    public Circle(double radius, String color, boolean filled) {\n        super(color, filled);                 // üst sınıfın yapıcısı\n        this.radius = radius;\n        // this.color = color;   // HATA: color, GeometricObject'te private\n    }\n    public double getRadius() { return radius; }\n    public double getArea() {                 // YENİ metot\n        return radius * radius * Math.PI;\n    }\n    public double getDiameter() { return 2 * radius; }\n}"
      },
      {
        "name": "TestCircle.java",
        "code": "\npublic class TestCircle {\n    public static void main(String[] args) {\n        Circle c = new Circle(1, \"red\", true);\n        System.out.println(c.getColor());     // miras alınan metot\n        System.out.println(c.isFilled());\n        System.out.println(c.getDiameter());  // kendi metodu\n        System.out.println(c.toString());     // miras alınan toString\n    }\n}"
      }
    ],
    "steps": [
      {
        "file": 2,
        "lines": [
          3
        ],
        "note": "Circle'ın 3 parametreli yapıcısı çalışacak."
      },
      {
        "file": 1,
        "lines": [
          8,
          9
        ],
        "note": "<code>super(color, filled)</code>: renk ve doluluk işini üst sınıfa bırakıyoruz.",
        "vars": {
          "c.color": "\"red\"",
          "c.filled": "true"
        }
      },
      {
        "file": 1,
        "lines": [
          10,
          11
        ],
        "note": "Alt sınıf kendi alanını ayarlıyor. color'a doğrudan dokunamaz (private).",
        "vars": {
          "c.color": "\"red\"",
          "c.filled": "true",
          "c.radius": "1.0"
        }
      },
      {
        "file": 2,
        "lines": [
          4
        ],
        "note": "getColor Circle'da yazılmadı ama <b>miras</b> alındı.",
        "out": "red"
      },
      {
        "file": 2,
        "lines": [
          5
        ],
        "out": "true"
      },
      {
        "file": 2,
        "lines": [
          6
        ],
        "note": "Circle'a özel metot.",
        "out": "2.0"
      },
      {
        "file": 2,
        "lines": [
          7
        ],
        "note": "toString de miras; Circle override etmediği için üst sınıfınki çalışır.",
        "out": "color: red and filled: true"
      }
    ]
  });

  T("tr-super-yapici", {
    "files": [
      {
        "name": "SuperDemo.java",
        "code": "\nclass Arac {\n    protected int tekerSayisi;\n    Arac() {\n        System.out.println(\"Arac() çalıştı\");\n    }\n    Arac(int teker) {\n        tekerSayisi = teker;\n        System.out.println(\"Arac(int) çalıştı: \" + teker);\n    }\n}\n\nclass Bisiklet extends Arac {\n    Bisiklet() {\n        // derleyici buraya gizlice super(); ekler\n        System.out.println(\"Bisiklet() çalıştı\");\n    }\n}\n\nclass Araba extends Arac {\n    Araba() {\n        super(4);                // açık çağrı, İLK satır\n        System.out.println(\"Araba() çalıştı\");\n    }\n}\n\npublic class SuperDemo {\n    public static void main(String[] args) {\n        new Bisiklet();\n        new Araba();\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          28,
          13
        ],
        "note": "<code>new Bisiklet()</code> → Bisiklet() yapıcısı."
      },
      {
        "lines": [
          14,
          3
        ],
        "note": "İlk satırda super/this yok → derleyicinin eklediği <code>super()</code> → <b>Arac()</b> çalışır."
      },
      {
        "lines": [
          4
        ],
        "out": "Arac() çalıştı"
      },
      {
        "lines": [
          15
        ],
        "note": "Üst sınıf bittikten sonra alt sınıfın gövdesine dönülür.",
        "out": "Bisiklet() çalıştı"
      },
      {
        "lines": [
          29,
          20,
          21
        ],
        "note": "<code>new Araba()</code>: ilk satırda açık <code>super(4)</code> → <b>Arac(int)</b> seçilir, Arac() çağrılmaz."
      },
      {
        "lines": [
          6,
          7,
          8
        ],
        "out": "Arac(int) çalıştı: 4",
        "vars": {
          "tekerSayisi": "4"
        }
      },
      {
        "lines": [
          22
        ],
        "out": "Araba() çalıştı"
      }
    ]
  });

  T("tr-yapici-zinciri", {
    "files": [
      {
        "name": "Faculty.java",
        "code": "\npublic class Faculty extends Employee {\n    public static void main(String[] args) {\n        new Faculty();\n    }\n\n    public Faculty() {\n        System.out.println(\"(4) Faculty's no-arg constructor is invoked\");\n    }\n}\n\nclass Employee extends Person {\n    public Employee() {\n        this(\"(2) Invoke Employee's overloaded constructor\");\n        System.out.println(\"(3) Employee's no-arg constructor is invoked\");\n    }\n\n    public Employee(String s) {\n        System.out.println(s);\n    }\n}\n\nclass Person {\n    public Person() {\n        System.out.println(\"(1) Person's no-arg constructor is invoked\");\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          2
        ],
        "note": "1. main metottan başla.",
        "vars": {
          "çağrı yığını": "main"
        }
      },
      {
        "lines": [
          3,
          6
        ],
        "note": "2. <code>new Faculty()</code> → Faculty'nin no-arg yapıcısı çağrıldı. Gövdesine girmeden önce ilk satıra bakılır: this/super yok → gizli <code>super()</code>.",
        "vars": {
          "çağrı yığını": "main → Faculty()"
        }
      },
      {
        "lines": [
          12
        ],
        "note": "3. <code>super()</code> → Employee'nin no-arg yapıcısı.",
        "vars": {
          "çağrı yığını": "main → Faculty() → Employee()"
        }
      },
      {
        "lines": [
          13,
          17
        ],
        "note": "4. İlk satır <code>this(\"(2) ...\")</code> → aynı sınıfın <b>Employee(String)</b> yapıcısına gidilir. (Burada gizli super() <b>eklenmez</b>.)",
        "vars": {
          "çağrı yığını": "main → Faculty() → Employee() → Employee(String)"
        }
      },
      {
        "lines": [
          17,
          22,
          23
        ],
        "note": "5. Employee(String)'in ilk satırında this/super yok → gizli <code>super()</code> → <b>Person()</b>. (Person da gizlice Object()'i çağırır.)",
        "vars": {
          "çağrı yığını": "… → Employee(String) → Person() → Object()"
        }
      },
      {
        "lines": [
          24
        ],
        "note": "6. Zincirin tepesine varıldı; Person'ın gövdesi çalışır.",
        "out": "(1) Person's no-arg constructor is invoked",
        "vars": {
          "çağrı yığını": "… → Employee(String) → Person()"
        }
      },
      {
        "lines": [
          18
        ],
        "note": "7. Person bitti, Employee(String)'in gövdesine dönülür.",
        "out": "(2) Invoke Employee's overloaded constructor",
        "vars": {
          "çağrı yığını": "… → Employee() → Employee(String)"
        }
      },
      {
        "lines": [
          14
        ],
        "note": "8. Employee(String) bitti, Employee()'nin kalan satırı.",
        "out": "(3) Employee's no-arg constructor is invoked",
        "vars": {
          "çağrı yığını": "main → Faculty() → Employee()"
        }
      },
      {
        "lines": [
          7
        ],
        "note": "9. En son Faculty'nin gövdesi.",
        "out": "(4) Faculty's no-arg constructor is invoked",
        "vars": {
          "çağrı yığını": "main → Faculty()"
        }
      }
    ]
  });

  T("tr-noarg-hata", {
    "files": [
      {
        "name": "Hatali.java",
        "code": "\npublic class Apple extends Fruit {\n    // derleyicinin eklediği:  public Apple() { super(); }\n}                                      // HATA: Fruit() yok!\n\nclass Fruit {\n    public Fruit(String name) {\n        System.out.println(\"Fruit's constructor is invoked\");\n    }\n}"
      },
      {
        "name": "Duzeltilmis.java",
        "code": "\npublic class Apple extends Fruit {\n    public Apple() {\n        super(\"Apple\");                // uygun üst yapıcıyı açıkça çağır\n    }\n}\n\nclass Fruit {\n    public Fruit() { }                 // veya: no-arg yapıcı ekle\n    public Fruit(String name) {\n        System.out.println(\"Fruit's constructor is invoked\");\n    }\n}"
      }
    ],
    "hl": [
      2,
      3
    ]
  });

  T("tr-override", {
    "files": [
      {
        "name": "OverrideDemo.java",
        "code": "\nclass A {\n    public void ornek()        { System.out.println(\"A.ornek\"); }\n    public static void statik() { System.out.println(\"A.statik\"); }\n    private void gizli()       { System.out.println(\"A.gizli\"); }\n    public void cagir()        { gizli(); }\n}\n\nclass B extends A {\n    @Override\n    public void ornek()        { System.out.println(\"B.ornek\");\n                                 super.ornek(); }\n    public static void statik() { System.out.println(\"B.statik\"); } // hiding\n    private void gizli()       { System.out.println(\"B.gizli\"); }  // ilgisiz\n}\n\npublic class OverrideDemo {\n    public static void main(String[] args) {\n        A x = new B();\n        x.ornek();\n        x.statik();\n        x.cagir();\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          18
        ],
        "note": "Bildirilen tip <b>A</b>, gerçek nesne <b>B</b>.",
        "vars": {
          "x (bildirilen)": "A",
          "x (gerçek)": "B"
        }
      },
      {
        "lines": [
          19,
          10
        ],
        "note": "Instance metot → <b>gerçek tipe</b> (B) göre seçilir: B.ornek çalışır.",
        "out": "B.ornek"
      },
      {
        "lines": [
          11,
          3
        ],
        "note": "<code>super.ornek()</code> A'daki orijinal versiyonu çağırır.",
        "out": "A.ornek"
      },
      {
        "lines": [
          20,
          3
        ],
        "note": "Static metot → <b>bildirilen tipe</b> (A) göre seçilir. B.statik A.statik'i sadece gizler.",
        "out": "A.statik"
      },
      {
        "lines": [
          21,
          5,
          4
        ],
        "note": "cagir() A'da tanımlı ve A'nın private gizli()'sini çağırır. B.gizli bir override değil, ilgisiz bir metot.",
        "out": "A.gizli"
      }
    ]
  });

  T("tr-override-overload", {
    "files": [
      {
        "name": "Override.java",
        "code": "\npublic class Test {\n    public static void main(String[] args) {\n        A a = new A();\n        a.p(10);\n        a.p(10.0);\n    }\n}\nclass B {\n    public void p(double i) {\n        System.out.println(i * 2);\n    }\n}\nclass A extends B {\n    // Bu metot B'dekini OVERRIDE eder\n    public void p(double i) {\n        System.out.println(i);\n    }\n}"
      },
      {
        "name": "Overload.java",
        "code": "\npublic class Test {\n    public static void main(String[] args) {\n        A a = new A();\n        a.p(10);\n        a.p(10.0);\n    }\n}\nclass B {\n    public void p(double i) {\n        System.out.println(i * 2);\n    }\n}\nclass A extends B {\n    // Bu metot B'dekini OVERLOAD eder\n    public void p(int i) {\n        System.out.println(i);\n    }\n}"
      }
    ],
    "steps": [
      {
        "file": 0,
        "lines": [
          4,
          15
        ],
        "note": "<b>Override</b>: A'da tek bir p(double) var (B'ninkini ezdi). 10 → 10.0'a genişler.",
        "out": "10.0"
      },
      {
        "file": 0,
        "lines": [
          5,
          15
        ],
        "note": "Yine A'nın p(double)'ı.",
        "out": "10.0"
      },
      {
        "file": 1,
        "lines": [
          4,
          15
        ],
        "note": "<b>Overload</b>: A'da iki p var: p(int) [A] ve p(double) [B'den]. 10 bir int → birebir eşleşen <b>p(int)</b>.",
        "out": "10"
      },
      {
        "file": 1,
        "lines": [
          5,
          9
        ],
        "note": "10.0 bir double → <b>B'nin p(double)</b>'ı çalışır: 10.0 × 2.",
        "out": "20.0"
      }
    ]
  });

  T("tr-object-tostring", {
    "files": [
      {
        "name": "ToStringDemo.java",
        "code": "\nclass Loan {\n    double amount = 1000;\n}\n\nclass Ogrenci {\n    String ad = \"Deniz\";\n    int no = 42;\n    @Override\n    public String toString() {\n        return \"Ogrenci[ad=\" + ad + \", no=\" + no + \"]\";\n    }\n}\n\npublic class ToStringDemo {\n    public static void main(String[] args) {\n        Loan loan = new Loan();\n        System.out.println(loan.toString());\n        Ogrenci o = new Ogrenci();\n        System.out.println(o);              // toString otomatik\n        System.out.println(\"Kayıt: \" + o);  // burada da\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          16,
          17
        ],
        "note": "Loan toString'i override etmedi → Object'inki: sınıf adı + @ + hash (her çalıştırmada değişebilir).",
        "out": "Loan@15037e5"
      },
      {
        "lines": [
          18,
          19,
          9
        ],
        "note": "println(Object) içeride toString() çağırır → override edilen versiyon.",
        "out": "Ogrenci[ad=Deniz, no=42]"
      },
      {
        "lines": [
          20
        ],
        "note": "String birleştirme de toString() çağırır.",
        "out": "Kayıt: Ogrenci[ad=Deniz, no=42]"
      }
    ]
  });

  T("tr-polimorfizm", {
    "files": [
      {
        "name": "PolymorphismDemo.java",
        "code": "\npublic class PolymorphismDemo {\n    public static void main(String[] args) {\n        m(new GraduateStudent());\n        m(new Student());\n        m(new Person());\n        m(new Object());\n    }\n\n    public static void m(Object x) {\n        System.out.println(x.toString());\n    }\n}\n\nclass GraduateStudent extends Student {\n}\n\nclass Student extends Person {\n    public String toString() {\n        return \"Student\";\n    }\n}\n\nclass Person extends Object {\n    public String toString() {\n        return \"Person\";\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          3,
          9,
          10
        ],
        "note": "x'in bildirilen tipi Object, gerçek tipi <b>GraduateStudent</b>. JVM toString'i arar: GraduateStudent'ta yok → üst sınıf <b>Student</b>'ta buldu.",
        "vars": {
          "x gerçek tipi": "GraduateStudent",
          "arama yolu": "GraduateStudent ✗ → Student ✓"
        }
      },
      {
        "lines": [
          18,
          19
        ],
        "note": "İlk bulunan uygulama çalıştı.",
        "out": "Student",
        "vars": {
          "x gerçek tipi": "GraduateStudent",
          "arama yolu": "GraduateStudent ✗ → Student ✓"
        }
      },
      {
        "lines": [
          4,
          18,
          19
        ],
        "note": "Gerçek tip Student → doğrudan Student.toString.",
        "out": "Student",
        "vars": {
          "x gerçek tipi": "Student",
          "arama yolu": "Student ✓"
        }
      },
      {
        "lines": [
          5,
          24,
          25
        ],
        "note": "Gerçek tip Person → Person.toString.",
        "out": "Person",
        "vars": {
          "x gerçek tipi": "Person",
          "arama yolu": "Person ✓"
        }
      },
      {
        "lines": [
          6,
          10
        ],
        "note": "Gerçek tip Object → Object'in varsayılan toString'i (sınıf adı@hash).",
        "out": "java.lang.Object@1b6d3586",
        "vars": {
          "x gerçek tipi": "Object",
          "arama yolu": "Object ✓"
        }
      }
    ]
  });

  T("tr-eslestirme-baglama", {
    "files": [
      {
        "name": "Eslestirme.java",
        "code": "\nclass Hayvan {\n    String ad = \"hayvan\";\n    void ses() { System.out.println(\"...\"); }\n}\nclass Kedi extends Hayvan {\n    String ad = \"kedi\";\n    @Override\n    void ses() { System.out.println(\"Miyav\"); }\n    void tirman() { System.out.println(\"Ağaca tırmandı\"); }\n}\n\npublic class Eslestirme {\n    public static void main(String[] args) {\n        Hayvan h = new Kedi();\n        h.ses();               // derlenir (Hayvan'da var), Kedi'ninki çalışır\n        // h.tirman();         // DERLEME HATASI: Hayvan'da tirman() yok\n        ((Kedi) h).tirman();   // casting ile derleyiciyi ikna et\n        System.out.println(h.ad);   // alanlar polimorfik DEĞİL\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          14
        ],
        "vars": {
          "bildirilen tip": "Hayvan",
          "gerçek tip": "Kedi"
        },
        "note": "Değişkenin iki tipi var: derleyicinin bildiği ve JVM'in bildiği."
      },
      {
        "lines": [
          15,
          8
        ],
        "note": "Derleyici: Hayvan'da ses() var ✓. JVM: gerçek tip Kedi → Kedi.ses.",
        "out": "Miyav",
        "vars": {
          "bildirilen tip": "Hayvan",
          "gerçek tip": "Kedi"
        }
      },
      {
        "lines": [
          16
        ],
        "note": "Derleyici sadece Hayvan'a bakar; tirman() orada yok → program <b>derlenmez</b>.",
        "vars": {
          "bildirilen tip": "Hayvan",
          "gerçek tip": "Kedi"
        }
      },
      {
        "lines": [
          17,
          9
        ],
        "note": "Cast ile ifade tipi Kedi oldu; derleyici tirman()'ı bulur.",
        "out": "Ağaca tırmandı",
        "vars": {
          "bildirilen tip": "Hayvan",
          "gerçek tip": "Kedi"
        }
      },
      {
        "lines": [
          18,
          2
        ],
        "note": "Alan erişimi bildirilen tipe göre: Hayvan.ad.",
        "out": "hayvan",
        "vars": {
          "bildirilen tip": "Hayvan",
          "gerçek tip": "Kedi"
        }
      }
    ]
  });

  T("tr-casting", {
    "files": [
      {
        "name": "CastingDemo.java",
        "code": "\nclass Fruit { }\nclass Apple extends Fruit { }\nclass Orange extends Fruit { }\nclass GoldenDelicious extends Apple { }\nclass McIntosh extends Apple { }\n\npublic class CastingDemo {\n    public static void main(String[] args) {\n        Fruit fruit = new GoldenDelicious();   // implicit upcast\n        Orange orange = new Orange();\n\n        System.out.println(fruit instanceof Fruit);\n        System.out.println(fruit instanceof Apple);\n        System.out.println(fruit instanceof GoldenDelicious);\n        System.out.println(fruit instanceof McIntosh);\n        System.out.println(fruit instanceof Orange);\n        // System.out.println(orange instanceof Apple);  // DERLEME HATASI\n\n        Apple a = (Apple) fruit;               // explicit downcast: OK\n        McIntosh m = (McIntosh) fruit;         // derlenir ama...\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          9
        ],
        "note": "Bildirilen tip Fruit, gerçek nesne GoldenDelicious. Upcast otomatik.",
        "vars": {
          "fruit": "Fruit → GoldenDelicious",
          "orange": "(henüz yok)"
        }
      },
      {
        "lines": [
          10
        ],
        "vars": {
          "fruit": "Fruit → GoldenDelicious",
          "orange": "Orange → Orange"
        }
      },
      {
        "lines": [
          12
        ],
        "note": "Her GoldenDelicious bir Fruit'tir.",
        "out": "true"
      },
      {
        "lines": [
          13
        ],
        "note": "GoldenDelicious bir Apple'dır.",
        "out": "true"
      },
      {
        "lines": [
          14
        ],
        "out": "true"
      },
      {
        "lines": [
          15
        ],
        "note": "Kardeş sınıf: GoldenDelicious bir McIntosh değildir.",
        "out": "false"
      },
      {
        "lines": [
          16
        ],
        "note": "Derlenir (Fruit, Orange olabilirdi) ama gerçek nesne Orange değil.",
        "out": "false"
      },
      {
        "lines": [
          17
        ],
        "note": "Orange ile Apple arasında hiçbir kalıtım ilişkisi yok; derleyici bu testin asla true olamayacağını bilir → <b>derleme hatası</b>."
      },
      {
        "lines": [
          19
        ],
        "note": "Gerçek nesne bir Apple (GoldenDelicious) olduğu için downcast başarılı.",
        "vars": {
          "fruit": "Fruit → GoldenDelicious",
          "a": "Apple → GoldenDelicious"
        }
      },
      {
        "lines": [
          20
        ],
        "note": "Derleyici izin verir (Fruit, McIntosh <i>olabilirdi</i>) ama JVM gerçek tipi kontrol eder.",
        "out": "!!Exception in thread \"main\" java.lang.ClassCastException: class GoldenDelicious cannot be cast to class McIntosh"
      }
    ]
  });

  T("tr-equals", {
    "files": [
      {
        "name": "EqualsDemo.java",
        "code": "\nclass Circle {\n    double radius;\n    Circle(double r) { radius = r; }\n\n    @Override\n    public boolean equals(Object o) {\n        if (o instanceof Circle)\n            return radius == ((Circle) o).radius;\n        else\n            return false;\n    }\n}\n\npublic class EqualsDemo {\n    public static void main(String[] args) {\n        Circle c1 = new Circle(3), c2 = new Circle(3), c3 = c1;\n        System.out.println(c1 == c2);\n        System.out.println(c1.equals(c2));\n        System.out.println(c1 == c3);\n\n        String s1 = new String(\"java\"), s2 = new String(\"java\");\n        System.out.println(s1 == s2);\n        System.out.println(s1.equals(s2));\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          16
        ],
        "vars": {
          "c1": "→ Circle#1 {r=3}",
          "c2": "→ Circle#2 {r=3}",
          "c3": "→ Circle#1"
        },
        "note": "c1 ve c2 farklı nesne ama içerik aynı; c3 c1'in aynısı."
      },
      {
        "lines": [
          17
        ],
        "note": "Farklı nesneler → == false.",
        "out": "false"
      },
      {
        "lines": [
          18,
          7,
          8
        ],
        "note": "Override edilen equals yarıçapları karşılaştırır.",
        "out": "true"
      },
      {
        "lines": [
          19
        ],
        "note": "Aynı nesne.",
        "out": "true"
      },
      {
        "lines": [
          21,
          22
        ],
        "note": "new ile iki ayrı String nesnesi.",
        "out": "false"
      },
      {
        "lines": [
          23
        ],
        "note": "String equals'ı override etmiştir: karakterleri karşılaştırır.",
        "out": "true"
      }
    ]
  });

  T("tr-protected", {
    "files": [
      {
        "name": "p1/C1.java",
        "code": "\npackage p1;\n\npublic class C1 {\n    public int x;\n    protected int y;\n    int z;                 // default\n    private int u;\n\n    protected void m() { }\n}"
      },
      {
        "name": "p1/C2.java",
        "code": "\npackage p1;              // aynı paket, alt sınıf değil\n\npublic class C2 {\n    C1 o = new C1();\n    void test() {\n        o.x = 1;         // ✓ public\n        o.y = 1;         // ✓ protected: aynı paket\n        o.z = 1;         // ✓ default: aynı paket\n        // o.u = 1;      // ✗ private\n        o.m();           // ✓\n    }\n}"
      },
      {
        "name": "p2/C4.java",
        "code": "\npackage p2;              // farklı paket, ALT SINIF\nimport p1.C1;\n\npublic class C4 extends C1 {\n    void test() {\n        x = 1;           // ✓ public\n        y = 1;           // ✓ protected: alt sınıf\n        // z = 1;        // ✗ default: paket dışı\n        // u = 1;        // ✗ private\n        m();             // ✓ protected\n    }\n}"
      },
      {
        "name": "p2/C5.java",
        "code": "\npackage p2;              // farklı paket, alt sınıf DEĞİL\nimport p1.C1;\n\npublic class C5 {\n    C1 o = new C1();\n    void test() {\n        o.x = 1;         // ✓ public\n        // o.y = 1;      // ✗ protected\n        // o.z = 1;      // ✗ default\n        // o.u = 1;      // ✗ private\n        // o.m();        // ✗ protected\n    }\n}"
      }
    ]
  });

  T("tr-final", {
    "files": [
      {
        "name": "FinalDemo.java",
        "code": "\nfinal class Sabit { }\n// class Alt extends Sabit { }      // HATA: final sınıf genişletilemez\n\nclass Ust {\n    public final void kilitli() { }\n    public void acik() { }\n    protected void korumali() { }\n}\n\nclass Alt extends Ust {\n    // public void kilitli() { }    // HATA: final metot override edilemez\n    // void acik() { }               // HATA: public -> default (zayıflatma)\n    @Override\n    public void korumali() { }       // OK: protected -> public (genişletme)\n}\n\npublic class FinalDemo {\n    public static void main(String[] args) {\n        final double ORAN = 0.18;\n        // ORAN = 0.20;               // HATA: final değişkene tekrar atanamaz\n        final int[] dizi = {1, 2};\n        dizi[0] = 99;                 // OK: içerik değişebilir\n        // dizi = new int[3];         // HATA: referans değişemez\n        System.out.println(ORAN + \" \" + dizi[0]);\n    }\n}"
      }
    ],
    "hl": [
      2,
      11,
      12,
      20,
      23
    ],
    "output": "0.18 99"
  });
})(window.OOPLab = window.OOPLab || {});
