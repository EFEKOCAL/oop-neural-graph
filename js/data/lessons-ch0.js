/*
 * lessons-ch0.js — Bölüm 0: Java Temelleri (Lab Hafta 1–3).
 * Blok türleri: p, h, list, table, code (lang:'java' renklendirir), note (exam/why/key/trap/warn/extra), dg (şekil), br.
 * checks: { type:'mc', q, code?, options, answer, a } · { type:'fill', q, code (⟦0⟧ boşluk), answers:[[...]], a }
 * Kod iz sürme şekilleri (tr-*) en altta OOPLab.java.trace ile kaydedilir.
 */
(function (OOPLab) {
  'use strict';

  OOPLab.lessons = OOPLab.lessons || { chapters: [] };

  OOPLab.lessons.chapters.push({
    "id": "ch0",
    "num": 0,
    "title": "Java Temelleri",
    "en": "Java Basics",
    "source": "Lab Hafta 1–3",
    "objectives": [
      "Bir Java programının iskeletini, derleme ve çalıştırma adımlarını açıklamak",
      "İlkel tipleri, tür dönüşümünü ve tam sayı bölmesini doğru kullanmak",
      "Scanner ile kullanıcıdan farklı tiplerde veri almak ve nextLine tuzağını bilmek",
      "Metot imzasını tanımlamak ve aşırı yüklemede hangi metodun seçileceğini bulmak",
      "Dizilerin referans olduğunu ve sınırlarını kavramak"
    ],
    "lessons": [
      {
        "id": "iskelet",
        "title": "Bir Java programının iskeleti",
        "en": "Anatomy of a Java Program",
        "src": "Lab Hafta 1",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "Java'da <b>her kod bir sınıfın içinde</b> yaşar. Program, JVM'in aradığı özel bir metottan başlar: <code>public static void main(String[] args)</code>."
          },
          {
            "t": "list",
            "items": [
              "<code>public</code>: JVM dışarıdan çağırabilsin diye herkese açık.",
              "<code>static</code>: Henüz hiç nesne yokken çağrılabilsin diye sınıfa ait.",
              "<code>void</code>: Geriye değer döndürmez.",
              "<code>String[] args</code>: Komut satırından gelen argümanlar."
            ]
          },
          {
            "t": "p",
            "html": "Dosya adı, içindeki <b>public sınıfın adıyla aynı</b> olmalıdır: <code>Merhaba.java</code> → <code>public class Merhaba</code>."
          },
          {
            "t": "h",
            "text": "Derleme → çalıştırma"
          },
          {
            "t": "p",
            "html": "<code>javac Merhaba.java</code> kaynak kodu <b>bytecode</b>'a (<code>Merhaba.class</code>) çevirir; <code>java Merhaba</code> ise bu bytecode'u <b>JVM</b> üzerinde çalıştırır. Bu yüzden Java \"bir kez yaz, her yerde çalıştır\" der."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "<code>main</code> neden <code>static</code>? Program başladığında elinde hiçbir nesne yoktur. Instance (örnek) metodu çağırmak için önce bir nesne gerekir; tavuk-yumurta problemine düşmemek için başlangıç noktası sınıfa ait (static) olmak zorundadır."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>System.out.print</code> satır sonu eklemez, <code>println</code> ekler. Çıktı sorularında alt alta mı yan yana mı yazıldığına dikkat.</li><li>Bir <code>.java</code> dosyasında en fazla <b>bir</b> public üst seviye sınıf olabilir ve adı dosya adıyla aynı olmalıdır.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-iskelet"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Aşağıdaki satır ne yazdırır?",
            "options": [
              "15",
              "3345",
              "1239",
              "33 45"
            ],
            "answer": 1,
            "a": "1+2 = 3 (sayı). 3 + \"3\" = \"33\" (artık String). Sonra \"33\"+4 = \"334\", +5 = \"3345\".",
            "code": "System.out.println(1 + 2 + \"3\" + 4 + 5);"
          },
          {
            "type": "mc",
            "q": "<code>main</code> metodunun <code>static</code> olmasının sebebi nedir?",
            "options": [
              "Daha hızlı çalışsın diye",
              "Program başladığında hiç nesne olmadan çağrılabilsin diye",
              "Başka sınıflar çağıramasın diye",
              "Geriye değer döndürmesin diye"
            ],
            "answer": 1,
            "a": "static üyeler sınıfa aittir; çağırmak için nesne oluşturmak gerekmez."
          }
        ]
      },
      {
        "id": "tipler",
        "title": "Değişkenler, ilkel tipler ve tür dönüşümü",
        "en": "Primitive Types and Casting",
        "src": "Lab Hafta 1",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "Java <b>statik tipli</b> bir dildir: her değişkenin tipi derleme zamanında bellidir. 8 <b>ilkel (primitive)</b> tip vardır:"
          },
          {
            "t": "table",
            "head": [
              "Tip",
              "Boyut",
              "Örnek",
              "Varsayılan (alan ise)"
            ],
            "rows": [
              [
                "<code>byte</code> / <code>short</code>",
                "8 / 16 bit",
                "100",
                "0"
              ],
              [
                "<code>int</code>",
                "32 bit",
                "42",
                "0"
              ],
              [
                "<code>long</code>",
                "64 bit",
                "42L",
                "0"
              ],
              [
                "<code>float</code>",
                "32 bit",
                "3.14f",
                "0.0"
              ],
              [
                "<code>double</code>",
                "64 bit",
                "3.14",
                "0.0"
              ],
              [
                "<code>char</code>",
                "16 bit",
                "'A'",
                "'\\u0000'"
              ],
              [
                "<code>boolean</code>",
                "—",
                "true",
                "false"
              ]
            ]
          },
          {
            "t": "h",
            "text": "Tür dönüşümü (casting)"
          },
          {
            "t": "p",
            "html": "<b>Genişletme</b> (küçükten büyüğe, ör. <code>int → double</code>) otomatiktir. <b>Daraltma</b> (<code>double → int</code>) bilgi kaybı olabileceği için açıkça <code>(int)</code> yazmayı gerektirir ve ondalık kısım <b>kesilir</b> (yuvarlanmaz)."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Derleyici, bilgi kaybedebilecek dönüşümü sessizce yapmaz; \"bunu bilerek yapıyorum\" demen için <code>(int)</code> yazmanı ister. Aynı mantığı ileride <b>nesnelerde casting</b> konusunda (üst sınıftan alt sınıfa) tekrar göreceksin."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>7 / 2</code> → <b>3</b> (iki int → tam sayı bölme). <code>7 / 2.0</code> → 3.5.</li><li><code>(int) 3.99</code> → <b>3</b>. Casting yuvarlamaz, keser.</li><li>Tam sayıyı 0'a bölmek <code>ArithmeticException</code> fırlatır; ama <code>5.0 / 0</code> hata vermez, <code>Infinity</code> verir.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-tipler"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "<code>double x = 10 / 4;</code> satırından sonra <code>x</code> kaçtır?",
            "options": [
              "2.5",
              "2.0",
              "2",
              "Derleme hatası"
            ],
            "answer": 1,
            "a": "Önce sağ taraf hesaplanır: 10/4 iki int → 2. Sonra 2, double'a genişletilir → 2.0."
          },
          {
            "type": "fill",
            "q": "3.7 değerini tam sayıya dönüştürüp <code>n</code>'e ata:",
            "code": "double puan = 3.7;\nint n = ⟦0⟧ puan;   // n = 3",
            "answers": [
              [
                "(int)"
              ]
            ],
            "a": "Daraltma için açık cast gerekir: <code>(int) puan</code>."
          }
        ]
      },
      {
        "id": "scanner",
        "title": "Scanner ile kullanıcıdan veri almak",
        "en": "Reading Input with Scanner",
        "src": "Lab Hafta 1 · s.5",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "<code>java.util.Scanner</code> girdiyi <b>token</b>'lara (boşlukla ayrılmış parçalara) böler. Hangi tipte okumak istiyorsan o metodu çağırırsın:"
          },
          {
            "t": "table",
            "head": [
              "Metot",
              "Ne okur?"
            ],
            "rows": [
              [
                "<code>nextInt()</code>",
                "Sonraki token'ı int olarak"
              ],
              [
                "<code>nextDouble()</code>",
                "Sonraki token'ı double olarak"
              ],
              [
                "<code>next()</code>",
                "Sonraki token'ı String olarak (boşluğa kadar)"
              ],
              [
                "<code>nextLine()</code>",
                "Satırın <b>geri kalanının tamamını</b> (Enter'a kadar)"
              ],
              [
                "<code>hasNext()</code>",
                "Okunacak token var mı? (boolean)"
              ]
            ]
          },
          {
            "t": "p",
            "html": "Kullanmak için dosyanın başına <code>import java.util.Scanner;</code> yazılır ve <code>new Scanner(System.in)</code> ile klavyeye bağlanır."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "<code>nextInt()</code> sayıyı okur ama kullanıcının bastığı <b>Enter (satır sonu)</b> karakterini tamponda bırakır. Arkasından gelen <code>nextLine()</code> bu boş satırı görür ve hemen boş String döndürür. Çözüm: araya fazladan bir <code>nextLine()</code> koyup satır sonunu \"yutmak\"."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>nextInt()</code>'ten sonra gelen <code>nextLine()</code> boş String döndürür (Enter tamponda kalır).</li><li>Sayı beklerken harf girilirse <code>InputMismatchException</code> fırlatılır (Bölüm 3'te nasıl yakalandığını göreceğiz).</li><li><code>next()</code> \"Ali Veli\" girdisinden sadece <b>\"Ali\"</b>yi alır; tüm satır için <code>nextLine()</code>.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-scanner"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Kullanıcı <code>Ayşe Yılmaz</code> yazıp Enter'a basarsa <code>input.next()</code> ne döndürür?",
            "options": [
              "\"Ayşe Yılmaz\"",
              "\"Ayşe\"",
              "\"Yılmaz\"",
              "\"\""
            ],
            "answer": 1,
            "a": "next() boşluğa kadar olan tek token'ı okur."
          },
          {
            "type": "fill",
            "q": "Klavyeden okuyan bir Scanner oluştur ve ondalıklı bir sayı oku:",
            "code": "Scanner sc = new Scanner(⟦0⟧);\ndouble ort = sc.⟦1⟧();",
            "answers": [
              [
                "System.in"
              ],
              [
                "nextDouble"
              ]
            ],
            "a": "Klavye = <code>System.in</code>; double için <code>nextDouble()</code>."
          }
        ]
      },
      {
        "id": "karar-dongu",
        "title": "Karar ve döngü yapıları",
        "en": "Selections and Loops",
        "src": "Lab Hafta 1 · s.11–19",
        "minutes": 7,
        "blocks": [
          {
            "t": "h",
            "text": "if / else"
          },
          {
            "t": "p",
            "html": "Koşul her zaman <code>boolean</code> olmalı. <code>&amp;&amp;</code> (VE), <code>||</code> (VEYA), <code>!</code> (DEĞİL). <code>&amp;&amp;</code> ve <code>||</code> <b>kısa devre</b> yapar: sonuç belli olunca sağ tarafı hiç değerlendirmez."
          },
          {
            "t": "h",
            "text": "switch"
          },
          {
            "t": "p",
            "html": "Bir değeri sabitlerle karşılaştırır. Her <code>case</code> sonunda <code>break</code> yoksa, alttaki case'lere <b>düşer (fall-through)</b>."
          },
          {
            "t": "h",
            "text": "Döngüler"
          },
          {
            "t": "list",
            "items": [
              "<code>while (koşul) {...}</code> — önce koşul, sonra gövde. Hiç çalışmayabilir.",
              "<code>do {...} while (koşul);</code> — önce gövde: <b>en az bir kez</b> çalışır.",
              "<code>for (başlangıç; koşul; artış) {...}</code> — sayaçlı döngü."
            ]
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>switch</code>'te <code>break</code> unutulursa eşleşen case'ten itibaren alttaki tüm case'ler çalışır.</li><li><code>do-while</code> koşul baştan yanlış olsa bile gövdeyi bir kez çalıştırır ve sonunda <b>noktalı virgül</b> vardır.</li><li><code>if (x = 5)</code> Java'da derleme hatasıdır (int, boolean değildir). Karşılaştırma <code>==</code> ile yapılır.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-karar-dongu"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Aşağıdaki kod kaç kez \"Merhaba\" yazdırır?",
            "options": [
              "0",
              "1",
              "5",
              "Sonsuz"
            ],
            "answer": 1,
            "a": "do-while gövdeyi koşula bakmadan önce bir kez çalıştırır; sonra 10 < 5 yanlış olur.",
            "code": "int k = 10;\ndo {\n    System.out.println(\"Merhaba\");\n} while (k < 5);"
          },
          {
            "type": "mc",
            "q": "0'dan 150'ye kadar 3'er 3'er sayan doğru <code>for</code> başlığı hangisi?",
            "options": [
              "for (int i = 0; i < 150; i + 3)",
              "for (int i = 0; i <= 150; i += 3)",
              "for (int i = 0, i <= 150, i += 3)",
              "for (i = 0; i <= 150; i++3)"
            ],
            "answer": 1,
            "a": "Ayırıcı noktalı virgüldür ve artış ifadesi <code>i += 3</code> olmalıdır (<code>i + 3</code> i'yi değiştirmez)."
          }
        ]
      },
      {
        "id": "metot-overload",
        "title": "Metotlar ve aşırı yükleme (overloading)",
        "en": "Methods and Overloading",
        "src": "Lab Hafta 3.1 · s.2–5",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "Metot = isimlendirilmiş, tekrar kullanılabilir kod bloğu. Başlığı (header) şunlardan oluşur:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "erişim  [static]  dönüşTipi  isim ( parametreListesi )\npublic   static     int      topla( int a, int b )"
          },
          {
            "t": "p",
            "html": "<b>İmza (signature)</b> = metot adı + parametre <b>tipleri, sayısı ve sırası</b>. Dönüş tipi imzaya <b>dahil değildir</b>."
          },
          {
            "t": "h",
            "text": "Overloading (Aşırı yükleme)"
          },
          {
            "t": "p",
            "html": "Aynı sınıfta <b>aynı isimde, farklı imzada</b> birden çok metot tanımlamaktır. Hangisinin çalışacağına <b>derleyici</b>, çağrıdaki argümanların tiplerine bakarak <b>derleme zamanında</b> karar verir."
          },
          {
            "t": "p",
            "html": "Önce birebir eşleşme aranır; yoksa genişletme (<code>int → long → float → double</code>) ile en yakın eşleşme seçilir."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Overloading sayesinde aynı <i>işi</i> farklı veri tipleri için tek bir isimle yaparsın: <code>Math.max(int,int)</code>, <code>Math.max(double,double)</code>… Kullanıcı hangi versiyonu çağırdığını düşünmek zorunda kalmaz. Ama karar <b>derleme anında</b> verilir; bunu Bölüm 2'deki <b>override</b> (çalışma anında karar) ile karıştırma."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Sadece dönüş tipi farklı iki metot overloading <b>değildir</b> → derleme hatası (imza aynı).</li><li>Parametre <b>isimlerini</b> değiştirmek imzayı değiştirmez: <code>f(int a)</code> ile <code>f(int b)</code> aynı imzadır.</li><li><code>yaz(5)</code> çağrısında <code>yaz(int)</code> yoksa ama <code>yaz(double)</code> varsa, 5 otomatik double'a genişletilip o çalışır.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-metot-overload"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Hangi metot çifti aynı sınıfta <b>birlikte bulunamaz</b>?",
            "options": [
              "void f(int a) / void f(double a)",
              "int f(int a) / double f(int a)",
              "void f(int a, double b) / void f(double a, int b)",
              "void f() / void f(int a)"
            ],
            "answer": 1,
            "a": "İmza = isim + parametre tipleri. İkisi de <code>f(int)</code>; sadece dönüş tipi farklı olduğu için derleme hatası."
          },
          {
            "type": "mc",
            "q": "<code>topla(2, 3L)</code> çağrısı yukarıdaki sınıfta hangisini çalıştırır? (<code>3L</code> long'dur)",
            "options": [
              "topla(int,int)",
              "topla(double,double)",
              "Derleme hatası",
              "topla(int,int,int)"
            ],
            "answer": 1,
            "a": "long, int'e otomatik daralmaz; ama hem int hem long double'a genişleyebilir → topla(double,double)."
          }
        ]
      },
      {
        "id": "diziler",
        "title": "Diziler (array) ve String'e kısa bakış",
        "en": "Arrays and Strings",
        "src": "Lab Hafta 1 Ödev 2 · Slide01 s.68–69",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "Dizi, <b>aynı tipten sabit sayıda</b> elemanı ardışık tutan yapıdır. Dizi de bir <b>nesnedir</b>: değişken diziyi değil, diziye <b>referansı</b> tutar."
          },
          {
            "t": "code",
            "lang": "java",
            "text": "int[] notlar = new int[5];          // 5 eleman, hepsi 0\ndouble[] d = {1.5, 2.0, 3.25};      // ilk değerlerle\nint n = notlar.length;              // length bir ALAN (parantez yok)"
          },
          {
            "t": "p",
            "html": "İndeks <b>0</b>'dan başlar, son indeks <code>length - 1</code>'dir. Oluşturulduktan sonra <b>boyutu değişmez</b> — bu kısıt bizi ileride <code>ArrayList</code>'e götürecek."
          },
          {
            "t": "h",
            "text": "String"
          },
          {
            "t": "p",
            "html": "<code>String</code> ilkel değil, bir <b>sınıftır</b> ve <b>değiştirilemez (immutable)</b>. Uzunluk <code>s.length()</code> (metot!), karakter <code>s.charAt(i)</code>, içerik karşılaştırma <code>s.equals(t)</code> ile yapılır."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Dizide uzunluk <code>arr.length</code> (alan), String'de <code>s.length()</code> (metot), ArrayList'te <code>list.size()</code>.</li><li>Geçersiz indeks (ör. <code>arr[arr.length]</code>) → <code>ArrayIndexOutOfBoundsException</code> (çalışma zamanı).</li><li>İki String'i <code>==</code> ile karşılaştırmak referansı karşılaştırır; içerik için <code>equals</code> kullan.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-diziler"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "<code>String[] s = new String[3];</code> sonrasında <code>s[0]</code> nedir?",
            "options": [
              "\"\" (boş String)",
              "null",
              "Derleme hatası",
              "\"0\""
            ],
            "answer": 1,
            "a": "Referans tipli dizi elemanlarının varsayılan değeri <code>null</code>'dır (int dizisinde 0 olurdu)."
          },
          {
            "type": "fill",
            "q": "Dizinin son elemanını yazdır:",
            "code": "int[] dizi = {4, 7, 1, 9};\nSystem.out.println(dizi[dizi.⟦0⟧ - 1]);",
            "answers": [
              [
                "length"
              ]
            ],
            "a": "Dizilerde <code>length</code> bir alandır, parantez yoktur."
          }
        ]
      }
    ]
  });

  const T = OOPLab.java.trace;
  T("tr-iskelet", {
    "files": [
      {
        "name": "Merhaba.java",
        "code": "\npublic class Merhaba {\n    public static void main(String[] args) {\n        System.out.print(\"Merhaba \");\n        System.out.println(\"NYP!\");\n        System.out.println(\"Toplam: \" + 2 + 3);\n        System.out.println(\"Toplam: \" + (2 + 3));\n        System.out.println(2 + 3 + \" elma\");\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          2
        ],
        "note": "JVM programı <code>main</code> metodundan başlatır."
      },
      {
        "lines": [
          3
        ],
        "note": "<code>print</code> yazar ama alt satıra <b>geçmez</b>.",
        "out": "Merhaba ",
        "nl": false
      },
      {
        "lines": [
          4
        ],
        "note": "<code>println</code> yazar ve satır sonu ekler. İki çıktı aynı satırda birleşti.",
        "out": "NYP!"
      },
      {
        "lines": [
          5
        ],
        "note": "Soldan sağa: önce <code>\"Toplam: \" + 2</code> → <code>\"Toplam: 2\"</code> (String). Sonra + 3 de metne eklenir → <b>23</b>!",
        "out": "Toplam: 23"
      },
      {
        "lines": [
          6
        ],
        "note": "Parantez önce hesaplanır: 2+3 = 5, sonra metne eklenir.",
        "out": "Toplam: 5"
      },
      {
        "lines": [
          7
        ],
        "note": "Soldan sağa: önce 2+3 = 5 (ikisi de sayı), sonra <code>\" elma\"</code> ile birleşir.",
        "out": "5 elma"
      }
    ]
  });

  T("tr-tipler", {
    "files": [
      {
        "name": "Tipler.java",
        "code": "\npublic class Tipler {\n    public static void main(String[] args) {\n        int a = 7, b = 2;\n        double d = a;            // genişletme: otomatik\n        int bolum = a / b;       // tam sayı bölmesi\n        double gercek = a / 2.0; // biri double ise sonuç double\n        int kesik = (int) 3.99;  // daraltma: açık cast, kesme\n        char c = 'A';\n        int kod = c + 1;         // char aslında bir sayı (Unicode)\n        System.out.println(d + \" \" + bolum + \" \" + gercek);\n        System.out.println(kesik + \" \" + kod + \" \" + (char) kod);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          3
        ],
        "note": "İki int değişken oluşturuldu.",
        "vars": {
          "a": "7",
          "b": "2"
        }
      },
      {
        "lines": [
          4
        ],
        "note": "int → double genişletme otomatik yapılır.",
        "vars": {
          "a": "7",
          "b": "2",
          "d": "7.0"
        }
      },
      {
        "lines": [
          5
        ],
        "note": "İki int bölününce sonuç da <b>int</b>: 3.5 değil 3.",
        "vars": {
          "a": "7",
          "b": "2",
          "d": "7.0",
          "bolum": "3"
        }
      },
      {
        "lines": [
          6
        ],
        "note": "Bir taraf double olduğu için gerçek bölme yapılır.",
        "vars": {
          "a": "7",
          "b": "2",
          "d": "7.0",
          "bolum": "3",
          "gercek": "3.5"
        }
      },
      {
        "lines": [
          7
        ],
        "note": "(int) ondalık kısmı <b>keser</b>: 3.99 → 3.",
        "vars": {
          "a": "7",
          "b": "2",
          "d": "7.0",
          "bolum": "3",
          "gercek": "3.5",
          "kesik": "3"
        }
      },
      {
        "lines": [
          8,
          9
        ],
        "note": "'A' karakterinin kodu 65'tir; 65+1 = 66.",
        "vars": {
          "a": "7",
          "b": "2",
          "d": "7.0",
          "bolum": "3",
          "gercek": "3.5",
          "kesik": "3",
          "c": "'A'",
          "kod": "66"
        }
      },
      {
        "lines": [
          10
        ],
        "note": "Çıktı.",
        "out": "7.0 3 3.5"
      },
      {
        "lines": [
          11
        ],
        "note": "(char) 66 → 'B'.",
        "out": "3 66 B"
      }
    ]
  });

  T("tr-scanner", {
    "files": [
      {
        "name": "Girdi.java",
        "code": "\nimport java.util.Scanner;\n\npublic class Girdi {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        System.out.print(\"Yaş: \");\n        int yas = input.nextInt();      // \"20⏎\" -> 20 okunur, ⏎ kalır\n        input.nextLine();               // kalan ⏎'yi yut\n        System.out.print(\"Ad Soyad: \");\n        String ad = input.nextLine();   // \"Ali Veli⏎\" -> \"Ali Veli\"\n        System.out.println(ad + \" (\" + yas + \")\");\n        input.close();\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          5
        ],
        "note": "Scanner klavyeye (System.in) bağlandı."
      },
      {
        "lines": [
          6,
          7
        ],
        "note": "Kullanıcı <code>20⏎</code> yazdı. <code>nextInt()</code> sadece 20'yi aldı; tamponda <code>⏎</code> kaldı.",
        "vars": {
          "yas": "20",
          "tampon": "\"⏎\""
        },
        "out": "Yaş: 20"
      },
      {
        "lines": [
          8
        ],
        "note": "Bu satır olmasaydı bir sonraki <code>nextLine()</code> bu ⏎'yi okuyup <b>\"\"</b> döndürürdü.",
        "vars": {
          "yas": "20",
          "tampon": "\"\""
        }
      },
      {
        "lines": [
          9,
          10
        ],
        "note": "Şimdi tüm satır okunur.",
        "vars": {
          "yas": "20",
          "ad": "\"Ali Veli\""
        },
        "out": "Ad Soyad: Ali Veli"
      },
      {
        "lines": [
          11
        ],
        "note": "Birleştirilmiş çıktı.",
        "out": "Ali Veli (20)"
      }
    ]
  });

  T("tr-karar-dongu", {
    "files": [
      {
        "name": "Faktoriyel.java",
        "code": "\npublic class Faktoriyel {\n    public static void main(String[] args) {\n        int n = 4;\n        long sonuc = 1;\n        int i = 1;\n        while (i <= n) {\n            sonuc *= i;\n            i++;\n        }\n        System.out.println(n + \"! = \" + sonuc);\n\n        int ay = 2;\n        switch (ay) {\n            case 1: System.out.println(\"Ocak\");\n            case 2: System.out.println(\"Şubat\");\n            case 3: System.out.println(\"Mart\"); break;\n            default: System.out.println(\"?\");\n        }\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          3,
          4,
          5
        ],
        "note": "Başlangıç değerleri.",
        "vars": {
          "n": "4",
          "sonuc": "1",
          "i": "1"
        }
      },
      {
        "lines": [
          6,
          7,
          8
        ],
        "note": "1 ≤ 4 → sonuc = 1·1 = 1, i = 2",
        "vars": {
          "n": "4",
          "sonuc": "1",
          "i": "2"
        }
      },
      {
        "lines": [
          6,
          7,
          8
        ],
        "note": "2 ≤ 4 → sonuc = 1·2 = 2, i = 3",
        "vars": {
          "n": "4",
          "sonuc": "2",
          "i": "3"
        }
      },
      {
        "lines": [
          6,
          7,
          8
        ],
        "note": "3 ≤ 4 → sonuc = 2·3 = 6, i = 4",
        "vars": {
          "n": "4",
          "sonuc": "6",
          "i": "4"
        }
      },
      {
        "lines": [
          6,
          7,
          8
        ],
        "note": "4 ≤ 4 → sonuc = 6·4 = 24, i = 5",
        "vars": {
          "n": "4",
          "sonuc": "24",
          "i": "5"
        }
      },
      {
        "lines": [
          6
        ],
        "note": "5 ≤ 4 yanlış → döngü biter.",
        "vars": {
          "n": "4",
          "sonuc": "24",
          "i": "5"
        }
      },
      {
        "lines": [
          10
        ],
        "note": "Sonuç yazdırılır.",
        "out": "4! = 24"
      },
      {
        "lines": [
          13,
          15
        ],
        "note": "ay = 2 → <code>case 2</code>'ye atlanır (case 1 atlanır).",
        "out": "Şubat"
      },
      {
        "lines": [
          16
        ],
        "note": "case 2'de <b>break yok</b> → aşağı düşer, case 3 de çalışır, orada break var.",
        "out": "Mart"
      }
    ]
  });

  T("tr-metot-overload", {
    "files": [
      {
        "name": "Hesap.java",
        "code": "\npublic class Hesap {\n    static int topla(int a, int b) {\n        return a + b;\n    }\n    static double topla(double a, double b) {\n        return a + b;\n    }\n    static int topla(int a, int b, int c) {\n        return a + b + c;\n    }\n    static void yaz(double x) {\n        System.out.println(\"double: \" + x);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(topla(2, 3));\n        System.out.println(topla(2.5, 1));\n        System.out.println(topla(1, 2, 3));\n        yaz(7);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          16,
          2
        ],
        "note": "<code>topla(2, 3)</code>: iki int → <b>birebir</b> eşleşme <code>topla(int,int)</code>.",
        "out": "5"
      },
      {
        "lines": [
          17,
          5
        ],
        "note": "<code>topla(2.5, 1)</code>: (int,int) uymaz. 1 double'a genişletilir → <code>topla(double,double)</code>.",
        "out": "3.5"
      },
      {
        "lines": [
          18,
          8
        ],
        "note": "Üç argüman → sadece üç parametreli versiyon uyar.",
        "out": "6"
      },
      {
        "lines": [
          19,
          11
        ],
        "note": "<code>yaz(int)</code> yok; 7 → 7.0 genişletilir ve <code>yaz(double)</code> çalışır.",
        "out": "double: 7.0"
      }
    ]
  });

  T("tr-diziler", {
    "files": [
      {
        "name": "Diziler.java",
        "code": "\npublic class Diziler {\n    public static void main(String[] args) {\n        int[] a = {5, 8, 2};\n        int[] b = a;          // kopya DEĞİL, aynı diziyi gösterir\n        b[0] = 99;\n        System.out.println(a[0]);\n\n        int toplam = 0;\n        for (int i = 0; i < a.length; i++)\n            toplam += a[i];\n        System.out.println(\"Toplam: \" + toplam);\n\n        for (int x : a)       // for-each\n            System.out.print(x + \" \");\n        System.out.println();\n        System.out.println(a[3]);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          3
        ],
        "note": "Heap'te 3 elemanlı bir dizi oluştu; <code>a</code> ona referans tutuyor.",
        "vars": {
          "a": "→ [5, 8, 2]"
        }
      },
      {
        "lines": [
          4
        ],
        "note": "<code>b = a</code> diziyi kopyalamaz, <b>referansı</b> kopyalar. İkisi aynı diziyi gösterir.",
        "vars": {
          "a": "→ [5, 8, 2]",
          "b": "→ (aynı dizi)"
        }
      },
      {
        "lines": [
          5
        ],
        "note": "b üzerinden değiştirince a'nın gördüğü dizi de değişir.",
        "vars": {
          "a": "→ [99, 8, 2]",
          "b": "→ (aynı dizi)"
        }
      },
      {
        "lines": [
          6
        ],
        "note": "a[0] artık 99.",
        "out": "99"
      },
      {
        "lines": [
          8,
          9,
          10
        ],
        "note": "Klasik indeksli döngü: 99 + 8 + 2.",
        "vars": {
          "a": "→ [99, 8, 2]",
          "toplam": "109"
        }
      },
      {
        "lines": [
          11
        ],
        "note": "",
        "out": "Toplam: 109"
      },
      {
        "lines": [
          13,
          14,
          15
        ],
        "note": "for-each elemanları sırayla verir (indeks gerekmez).",
        "out": "99 8 2 "
      },
      {
        "lines": [
          16
        ],
        "note": "Son geçerli indeks 2'dir. <code>a[3]</code> çalışma zamanında patlar.",
        "out": "!!Exception in thread \"main\" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3"
      }
    ]
  });
})(window.OOPLab = window.OOPLab || {});
