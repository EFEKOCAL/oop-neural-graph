/*
 * lessons-ch5.js — Bölüm 5: Vize Provası (Tüm vize konuları).
 * Blok türleri: p, h, list, table, code (lang:'java' renklendirir), note (exam/why/key/trap/warn/extra), dg (şekil), br.
 * checks: { type:'mc', q, code?, options, answer, a } · { type:'fill', q, code (⟦0⟧ boşluk), answers:[[...]], a }
 * Kod iz sürme şekilleri (tr-*) en altta OOPLab.java.trace ile kaydedilir.
 */
(function (OOPLab) {
  'use strict';

  OOPLab.lessons = OOPLab.lessons || { chapters: [] };

  OOPLab.lessons.chapters.push({
    "id": "ch5",
    "num": 5,
    "title": "Vize Provası",
    "en": "Midterm Rehearsal",
    "source": "Tüm vize konuları",
    "objectives": [
      "Birden çok kavramı birleştiren kodun çıktısını adım adım bulmak",
      "Sınav formatındaki karma soruları çözmek"
    ],
    "lessons": [
      {
        "id": "karma-iz",
        "title": "Hepsi bir arada: karma kod izleme",
        "en": "Mixed Code Tracing",
        "src": "Slide01 + Slide02 + Slide03",
        "minutes": 8,
        "blocks": [
          {
            "t": "p",
            "html": "Vize sorularının çoğu tek bir kavramı değil, birkaçını <b>birlikte</b> sorar: \"Bu kod ne yazdırır?\" Sağdaki program şunları içeriyor:"
          },
          {
            "t": "list",
            "items": [
              "<code>this(...)</code> ve <code>super(...)</code> ile <b>yapıcı zinciri</b>",
              "<b>static</b> sayaç",
              "<b>override</b> + <code>super.metot()</code>",
              "üst tip dizisi üzerinden <b>polimorfizm / dinamik bağlama</b>",
              "<b>throw</b>, <b>try-catch-finally</b>",
              "<code>toString()</code>'in otomatik çağrılması"
            ]
          },
          {
            "t": "p",
            "html": "<b>Önce kendin kâğıda çıktıyı yaz</b>, sonra ▶ ile adım adım kontrol et. Takıldığın adımın notunu oku; hangi derse dönmen gerektiğini gösterir."
          },
          {
            "t": "h",
            "text": "Çözüm stratejisi"
          },
          {
            "t": "list",
            "items": [
              "<code>new</code> gördüğünde: hangi yapıcı? İlk satırı ne? Zinciri tepeye kadar çık, çıktıları <b>tepeden aşağı</b> yaz.",
              "Metot çağrısında: değişkenin <b>bildirilen</b> tipinde metot var mı (derlenir mi)? Nesnenin <b>gerçek</b> tipinde hangisi var (hangisi çalışır)?",
              "<code>throw</code> gördüğünde: try'ın kalanını atla → uyan catch → finally → try-catch'ten sonrası."
            ],
            "ordered": true
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-karma-iz"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Yukarıdaki programda <code>h1.cek(50)</code> yerine <code>h1.cek(0)</code> olsaydı h1 için hangi satırlar yazılırdı?",
            "options": [
              "HATA Yetersiz bakiye / islem bitti",
              "OK Hesap[0.0] / islem bitti",
              "OK Hesap[0.0]",
              "Sadece islem bitti"
            ],
            "answer": 1,
            "a": "0 > 0.0 yanlış → istisna yok; OK satırı ve finally."
          }
        ]
      },
      {
        "id": "deneme-sinavi",
        "title": "Karma deneme sınavı",
        "en": "Practice Exam",
        "src": "Tüm vize konuları",
        "minutes": 20,
        "blocks": [
          {
            "t": "p",
            "html": "Sınav formatında 16 soru. Her soruyu çözdükten sonra açıklamayı mutlaka oku; yanlış yaptığın konunun dersine sol menüden dönebilirsin. Doğru cevapların bu tarayıcıda kaydedilir."
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Çıktı sorularında kâğıt-kalem kullan: değişken tablosu çiz, her <code>new</code> için yapıcı zincirini, her metot çağrısı için <b>bildirilen tip / gerçek tip</b> ayrımını yaz."
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "1) Çıktı nedir?",
            "options": [
              "b1ac b5d",
              "cab1 db5",
              "ab1c b5d",
              "b1ac ab5d"
            ],
            "answer": 0,
            "a": "new B(): B() → gizli super() → A() → this(1) → A(int) 'b1', geri A() 'a', geri B() 'c'. new B(5): super(5) → A(int) 'b5', sonra 'd'.",
            "code": "class A {\n    A() { this(1); System.out.print(\"a\"); }\n    A(int x) { System.out.print(\"b\" + x); }\n}\nclass B extends A {\n    B() { System.out.print(\"c\"); }\n    B(int x) { super(x); System.out.print(\"d\"); }\n}\n// main:\nnew B(); System.out.print(\" \"); new B(5);"
          },
          {
            "type": "mc",
            "q": "2) Hangi satır derleme hatası verir?",
            "options": [
              "(1)",
              "(2)",
              "(3)",
              "(4)"
            ],
            "answer": 1,
            "a": "Static metot instance alana erişemez.",
            "code": "public class T {\n    int sayi = 3;\n    static int toplam = 0;\n    static void ekle() {\n        toplam += 1;          // (1)\n        sayi += 1;            // (2)\n    }\n    void yaz() {\n        System.out.println(sayi + toplam);   // (3)\n        ekle();                              // (4)\n    }\n}"
          },
          {
            "type": "mc",
            "q": "3) Çıktı nedir?",
            "options": [
              "2 2 hi!",
              "1 2 hi",
              "1 1 hi",
              "1 2 hi!"
            ],
            "answer": 1,
            "a": "int kopyalanır (a değişmez). Dizinin içi ortak (b[0] = 2). String immutable; s'ye yeni nesne atamak c'yi etkilemez.",
            "code": "static void f(int x, int[] d, String s) {\n    x++; d[0]++; s = s + \"!\";\n}\n// main:\nint a = 1; int[] b = {1}; String c = \"hi\";\nf(a, b, c);\nSystem.out.println(a + \" \" + b[0] + \" \" + c);"
          },
          {
            "type": "mc",
            "q": "4) Çıktı nedir?",
            "options": [
              "AUA",
              "AUU",
              "AAA",
              "UUU"
            ],
            "answer": 1,
            "a": "Alt.m(int) bir overload. x (Alt) için m(3) → m(int) 'A', m(3.0) → m(double) 'U'. y'nin bildirilen tipi Ust: sadece m(double) görünür → 3 genişler → Ust.m ve override edilmediği için 'U'.",
            "code": "class Ust { void m(double d) { System.out.print(\"U\"); } }\nclass Alt extends Ust { void m(int i) { System.out.print(\"A\"); } }\n// main:\nAlt x = new Alt();\nx.m(3); x.m(3.0);\nUst y = new Alt();\ny.m(3);"
          },
          {
            "type": "mc",
            "q": "5) <code>GeometricObject g = new Circle(2);</code> sonrası hangisi derleme hatası verir? (getDiameter sadece Circle'da var)",
            "options": [
              "g.toString()",
              "g.getColor()",
              "g.getDiameter()",
              "((Circle) g).getDiameter()"
            ],
            "answer": 2,
            "a": "Derleyici bildirilen tipe (GeometricObject) bakar."
          },
          {
            "type": "mc",
            "q": "6) Ne olur?",
            "options": [
              "Derleme hatası",
              "i = null",
              "Çalışma zamanında ClassCastException",
              "i = 0"
            ],
            "answer": 2,
            "a": "Object → Integer cast'i derlenir; gerçek nesne String olduğu için JVM reddeder.",
            "code": "Object o = \"metin\";\nInteger i = (Integer) o;"
          },
          {
            "type": "mc",
            "q": "7) Çıktı nedir?",
            "options": [
              "true true",
              "false true",
              "false false",
              "true false"
            ],
            "answer": 1,
            "a": "equals(P) bir <b>overload</b>'dur. a'nın bildirilen tipi Object → derleyici equals(Object) seçer → Object'in versiyonu (==) → false. c ve d P tipinde → equals(P) → true.",
            "code": "class P {\n    int x;\n    P(int x) { this.x = x; }\n    public boolean equals(P o) { return x == o.x; }\n}\n// main:\nObject a = new P(1), b = new P(1);\nP c = new P(1), d = new P(1);\nSystem.out.println(a.equals(b) + \" \" + c.equals(d));"
          },
          {
            "type": "mc",
            "q": "8) Hangisi <b>derlenmez</b>?",
            "options": [
              "void a() { throw new RuntimeException(); }",
              "void b() { throw new IllegalArgumentException(); }",
              "void c() { throw new java.io.IOException(); }",
              "void d() throws Exception { throw new Exception(); }"
            ],
            "answer": 2,
            "a": "IOException checked'tır; throws ile bildirilmeli ya da yakalanmalı."
          },
          {
            "type": "mc",
            "q": "9) <code>m()</code> ne döndürür ve ne yazdırır?",
            "options": [
              "F yazar, 2 döner",
              "F yazar, 3 döner",
              "Hiçbir şey yazmaz, 2 döner",
              "Derleme hatası"
            ],
            "answer": 0,
            "a": "return x anında dönüş değeri (2) belirlenir; finally sonra çalışır ve F yazar. finally'deki x = 3 dönen değeri değiştirmez.",
            "code": "static int m() {\n    int x = 1;\n    try {\n        x = 2;\n        return x;\n    } finally {\n        x = 3;\n        System.out.print(\"F\");\n    }\n}"
          },
          {
            "type": "mc",
            "q": "10) Hangi catch sıralaması <b>derlenir</b>?",
            "options": [
              "catch (Exception e) … catch (ArithmeticException e)",
              "catch (RuntimeException e) … catch (NullPointerException e)",
              "catch (NullPointerException e) … catch (RuntimeException e) … catch (Exception e)",
              "catch (Throwable t) … catch (Error e)"
            ],
            "answer": 2,
            "a": "Özelden genele."
          },
          {
            "type": "mc",
            "q": "11) Çıktı nedir?",
            "options": [
              "[2]",
              "[1, 2]",
              "[3, 2]",
              "[1]"
            ],
            "answer": 0,
            "a": "remove(1) indeks 1'i (değer 1) siler → [3, 2]. remove(Integer 3) değeri 3'ü siler → [2].",
            "code": "ArrayList<Integer> l = new ArrayList<>();\nl.add(3); l.add(1); l.add(2);\nl.remove(1);\nl.remove(Integer.valueOf(3));\nSystem.out.println(l);"
          },
          {
            "type": "mc",
            "q": "12) <code>package p1</code>'deki C1'in <code>protected int y</code> alanına hangisi <b>erişemez</b>?",
            "options": [
              "C1'in kendisi",
              "p1 paketindeki başka bir sınıf",
              "p2 paketindeki C1'in alt sınıfı (kendi kalıtımıyla)",
              "p2 paketindeki, C1'den türemeyen bir sınıf"
            ],
            "answer": 3,
            "a": "protected = aynı paket + alt sınıflar."
          },
          {
            "type": "mc",
            "q": "13) Neden derlenmez?",
            "options": [
              "this.no yanlış",
              "Ogrenci yapıcısı gizlice super() çağırır ama Kisi() yapıcısı yok",
              "Ogrenci, ad alanını miras alamaz",
              "Kisi abstract olmalı"
            ],
            "answer": 1,
            "a": "Kisi'ye yapıcı yazıldığı için varsayılan yapıcı yok. Çözüm: Ogrenci yapıcısında super(\"...\") çağırmak.",
            "code": "class Kisi {\n    String ad;\n    Kisi(String ad) { this.ad = ad; }\n}\nclass Ogrenci extends Kisi {\n    int no;\n    Ogrenci(int no) { this.no = no; }\n}"
          },
          {
            "type": "mc",
            "q": "14) Çıktı nedir?",
            "options": [
              "5",
              "10",
              "20",
              "0"
            ],
            "answer": 0,
            "a": "Parametre alanı gizliyor; this olmadan sadece parametre değişir. Alan 5 kalır.",
            "code": "class Sayac {\n    int deger = 5;\n    void ayarla(int deger) {\n        deger = deger * 2;\n    }\n}\n// main:\nSayac s = new Sayac();\ns.ayarla(10);\nSystem.out.println(s.deger);"
          },
          {
            "type": "mc",
            "q": "15) Bir metin dosyasından sayı okumak için doğru kod hangisi?",
            "options": [
              "Scanner in = new Scanner(\"sayilar.txt\");",
              "Scanner in = new Scanner(new File(\"sayilar.txt\"));",
              "File in = new File(\"sayilar.txt\"); in.nextInt();",
              "PrintWriter in = new PrintWriter(\"sayilar.txt\");"
            ],
            "answer": 1,
            "a": "Scanner(String) metnin kendisini okur; File'ın okuma metodu yoktur; PrintWriter yazar (ve dosyayı siler!)."
          },
          {
            "type": "fill",
            "q": "16) Boşlukları doldur: negatif tutar gelince özel checked istisna fırlat ve yakala.",
            "code": "class NegatifTutarException ⟦0⟧ Exception {\n    NegatifTutarException(double t) { ⟦1⟧(\"Negatif: \" + t); }\n}\nclass Kasa {\n    void yatir(double t) ⟦2⟧ NegatifTutarException {\n        if (t < 0) ⟦3⟧ new NegatifTutarException(t);\n    }\n}\n// main:\ntry { new Kasa().yatir(-5); }\n⟦4⟧ (NegatifTutarException ex) { System.out.println(ex.⟦5⟧()); }",
            "answers": [
              [
                "extends"
              ],
              [
                "super"
              ],
              [
                "throws"
              ],
              [
                "throw"
              ],
              [
                "catch"
              ],
              [
                "getMessage"
              ]
            ],
            "a": "extends Exception → checked. Mesaj super(...) ile; başlıkta throws, gövdede throw; catch ile yakala; getMessage() mesajı verir."
          }
        ]
      }
    ]
  });

  const T = OOPLab.java.trace;
  T("tr-karma-iz", {
    "files": [
      {
        "name": "Karma.java",
        "code": "\nclass Hesap {\n    private static int sayac = 0;\n    protected double bakiye;\n\n    Hesap(double b) {\n        bakiye = b;\n        sayac++;\n        System.out.println(\"Hesap(\" + b + \")\");\n    }\n    Hesap() {\n        this(0);\n        System.out.println(\"Hesap()\");\n    }\n    void cek(double t) {\n        if (t > bakiye)\n            throw new IllegalArgumentException(\"Yetersiz bakiye\");\n        bakiye -= t;\n    }\n    static int getSayac() { return sayac; }\n    public String toString() { return \"Hesap[\" + bakiye + \"]\"; }\n}\n\nclass Vadeli extends Hesap {\n    Vadeli(double b) {\n        super(b);\n        System.out.println(\"Vadeli(\" + b + \")\");\n    }\n    @Override\n    void cek(double t) {\n        System.out.println(\"Vadeli: ceza kesildi\");\n        super.cek(t + 10);\n    }\n    @Override\n    public String toString() { return \"Vadeli\" + super.toString(); }\n}\n\npublic class Karma {\n    public static void main(String[] args) {\n        Hesap h1 = new Hesap();\n        Hesap h2 = new Vadeli(100);\n        Hesap[] hesaplar = { h1, h2 };\n        for (Hesap h : hesaplar) {\n            try {\n                h.cek(50);\n                System.out.println(\"OK \" + h);\n            } catch (IllegalArgumentException ex) {\n                System.out.println(\"HATA \" + ex.getMessage());\n            } finally {\n                System.out.println(\"islem bitti\");\n            }\n        }\n        System.out.println(\"Toplam: \" + Hesap.getSayac());\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          39,
          10,
          11
        ],
        "note": "<code>new Hesap()</code> → no-arg yapıcı. İlk satırı <code>this(0)</code> → Hesap(double)'a devreder. (Bkz. <i>this</i> dersi)",
        "vars": {
          "Hesap.sayac": "0"
        }
      },
      {
        "lines": [
          5,
          6,
          7
        ],
        "note": "Hesap(double): ilk satırda this/super yok → gizli super() (Object). Sonra alanlar. int 0 → double 0.0'a genişledi.",
        "vars": {
          "Hesap.sayac": "1",
          "h1.bakiye": "0.0"
        }
      },
      {
        "lines": [
          8
        ],
        "out": "Hesap(0.0)",
        "vars": {
          "Hesap.sayac": "1",
          "h1.bakiye": "0.0"
        }
      },
      {
        "lines": [
          12
        ],
        "note": "this(0) döndü; no-arg yapıcının kalanı.",
        "out": "Hesap()"
      },
      {
        "lines": [
          40,
          24,
          25
        ],
        "note": "<code>new Vadeli(100)</code> → açık <code>super(b)</code> → Hesap(double). (Bkz. <i>Yapıcı zincirleme</i>)"
      },
      {
        "lines": [
          6,
          7,
          8
        ],
        "note": "<b>Static</b> sayaç tüm nesnelerde ortak → 2 oldu.",
        "out": "Hesap(100.0)",
        "vars": {
          "Hesap.sayac": "2",
          "h1.bakiye": "0.0",
          "h2.bakiye": "100.0"
        }
      },
      {
        "lines": [
          26
        ],
        "note": "Üst yapıcı bitti, alt sınıfın gövdesi.",
        "out": "Vadeli(100.0)"
      },
      {
        "lines": [
          41,
          42
        ],
        "note": "Dizi elemanlarının bildirilen tipi Hesap. Döngü h1 ile başlıyor.",
        "vars": {
          "h": "Hesap → Hesap",
          "Hesap.sayac": "2",
          "h1.bakiye": "0.0",
          "h2.bakiye": "100.0"
        }
      },
      {
        "lines": [
          44,
          14,
          15,
          16
        ],
        "note": "Gerçek tip Hesap → Hesap.cek. 50 > 0.0 → <b>istisna fırlatıldı</b>. 17. ve 45. satırlar atlanır.",
        "vars": {
          "h": "Hesap → Hesap",
          "fırlatılan": "IllegalArgumentException"
        }
      },
      {
        "lines": [
          46,
          47
        ],
        "out": "HATA Yetersiz bakiye"
      },
      {
        "lines": [
          48,
          49
        ],
        "note": "finally her zaman.",
        "out": "islem bitti"
      },
      {
        "lines": [
          42,
          44,
          29,
          30
        ],
        "note": "Şimdi h = h2. Bildirilen tip Hesap (cek var → derlenir), gerçek tip <b>Vadeli</b> → <b>Vadeli.cek</b> çalışır (dinamik bağlama).",
        "out": "Vadeli: ceza kesildi",
        "vars": {
          "h": "Hesap → Vadeli",
          "h2.bakiye": "100.0"
        }
      },
      {
        "lines": [
          31,
          14,
          15,
          17
        ],
        "note": "<code>super.cek(60)</code> → Hesap'ın versiyonu. 60 > 100 değil → bakiye 40.",
        "vars": {
          "h": "Hesap → Vadeli",
          "h2.bakiye": "40.0"
        }
      },
      {
        "lines": [
          45,
          34,
          20
        ],
        "note": "<code>\"OK \" + h</code> → h.toString() → gerçek tip Vadeli → \"Vadeli\" + super.toString().",
        "out": "OK VadeliHesap[40.0]"
      },
      {
        "lines": [
          48,
          49
        ],
        "note": "İstisna olmasa da finally çalışır.",
        "out": "islem bitti"
      },
      {
        "lines": [
          52,
          19
        ],
        "note": "Static metot sınıf adıyla. İki nesne oluşturuldu.",
        "out": "Toplam: 2"
      }
    ]
  });
})(window.OOPLab = window.OOPLab || {});
