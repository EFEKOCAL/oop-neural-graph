/*
 * lessons-ch5.js — Bölüm 5: Vize Provası (Geçmiş vizeler (2022–2026) + hocanın şablonu).
 * Blok türleri: p, h, list, table, code (lang:'java' renklendirir), note (exam/why/key/trap/warn/extra), dg (şekil), br.
 * checks: { type:'mc', q, code?, options, answer, a } · { type:'fill', q, code (⟦0⟧ boşluk), answers:[[...]], a }
 *         { type:'fill', prose:true, q, text } (kavram cümlesi) · { type:'write', q, given?, rubric?, solution?, output, a }
 *         { type:'bug', q, code, bugs:[satır], explain, fixed, output } · { type:'skeleton', q, req, code (⟦n⟧ = [Bn+1]), blanks:[{model, answers?}], output }
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
    "source": "Geçmiş vizeler (2022–2026) + hocanın şablonu",
    "objectives": [
      "Hocanın 5 soru türünü (boşluk, D/Y, çıktı, hata bulma, iskelet/tasarım) tanımak",
      "Geçmiş vizelerin tüm sorularını çözmek",
      "40 puanlık iskelet sorusunu iş kurallarıyla tamamlamak",
      "80 dakikalık simülasyonda süreyi yönetmek"
    ],
    "lessons": [
      {
        "id": "gecmis-vizeler",
        "title": "Hocanın vize şablonu: 3 geçmiş vizenin analizi",
        "en": "Past Midterms Blueprint",
        "src": "2022-23, 2024-25, 2025-26 vizeleri",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "Üç geçmiş vize (80 dk, Prof. Dr. Kazım Yıldız / Dr. E. Emre Ülkü) aynı kalıbı izliyor. Bu bölümdeki dersler bu sıraya göre dizildi; gerçek soruların <b>hepsi</b> burada."
          },
          {
            "t": "table",
            "head": [
              "Soru türü",
              "2022-23",
              "2024-25",
              "2025-26",
              "Burada"
            ],
            "rows": [
              [
                "Kavram boşluğu",
                "5p (4 cümle)",
                "14p (9 cümle)",
                "15p (11 cümle)",
                "<a href=\"#/learn/ch5/gercek-bosluk\">Gerçek boşluklar</a> · <a href=\"#/learn/ch5/kavram-bosluk\">Konu konu</a>"
              ],
              [
                "Doğru / Yanlış",
                "10p (10)",
                "10p (10)",
                "yok",
                "<a href=\"#/learn/ch5/dogru-yanlis\">Doğru/Yanlış</a>"
              ],
              [
                "Kod çıktısı",
                "10p (this zinciri, Parent/Child)",
                "5p + 12p + 7p (override math, komut satırı, overload/override)",
                "15p + 15p (resize, A/B/C, iç içe try, static sayaç)",
                "<a href=\"#/learn/ch5/cikti-sorulari\">Çıktı soruları</a>"
              ],
              [
                "Hata bul / düzelt",
                "5p (super() yok, 2 çözüm)",
                "12p (Echo)",
                "15p (interface sabiti)",
                "<a href=\"#/learn/ch5/hata-bulma\">Hata bulma</a>"
              ],
              [
                "Büyük tasarım",
                "45p Vasıta + 25p Yarışma",
                "40p Akıllı cihazlar",
                "<b>40p iskelet [B1]–[B21]</b>",
                "<a href=\"#/learn/ch5/iskelet\">İskelet tamamlama</a> · <a href=\"#/learn/ch5/arka-sayfa\">Sıfırdan yazma</a>"
              ]
            ]
          },
          {
            "t": "h",
            "text": "Büyük sorunun değişmeyen bileşenleri"
          },
          {
            "t": "list",
            "items": [
              "<b>Soyut sınıf</b>: nesnesi oluşturulamayan kök (Device, Vasıta, Cihaz): private alanlar, parametreli yapıcı, getter, soyut metot.",
              "<b>Arayüz</b>: sadece bazı sınıfların yeteneği (Controllable, Otonom, TelefonIleKontrol).",
              "<b>Comparable</b>: fiyat / hız gibi bir alana göre karşılaştırma.",
              "<b>Yalnızca okunur alan</b>: yapıcıda atanır, sadece getter (brightness, kayitNo).",
              "<b>Yönetici sınıf + ArrayList&lt;ÜstTip&gt;</b>: ekleme ve listeleme; eklerken <b>iş kuralı</b> (instanceof ile tip kontrolü, \"zaten atanmış mı?\" durum kontrolü).",
              "<b>Test sınıfında polimorfizm</b>: üst tip referans / dizi / liste üzerinden çağrı."
            ]
          },
          {
            "t": "note",
            "kind": "exam",
            "html": "Soyut sınıf, arayüz, Comparable ve Cloneable dönem planında vizeden sonra görünse de <b>üç vizenin üçünde de</b> soruldu. <a href=\"#/learn/ch4\">Bölüm 4</a>'ü mutlaka çalış."
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Gerçek sınav provası için en sondaki <a href=\"#/learn/ch5/vize-simulasyonu\">Vize simülasyonu</a>'nu 80 dakikalık sayaçla çöz."
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "2025-26 vizesinde 40 puanlık soru hangi biçimdeydi?",
            "options": [
              "Sıfırdan sınıf tasarımı",
              "Kod iskeletindeki [B1]–[B21] bloklarını doldurma",
              "Çoktan seçmeli",
              "Sadece çıktı yazma"
            ],
            "answer": 1,
            "a": "Hoca 2025'te iskelet tamamlamaya geçti; önceki yıllarda sıfırdan tasarlattı. İkisine de hazırlan."
          }
        ]
      },
      {
        "id": "gercek-bosluk",
        "title": "Gerçek vize boşlukları (2022 · 2024 · 2025)",
        "en": "Past Exam Fill-in-the-Blanks",
        "src": "Geçmiş vizeler · Soru 1",
        "minutes": 15,
        "blocks": [
          {
            "t": "p",
            "html": "Üç vizenin birinci sorusundaki <b>tüm</b> cümleler, aynen. Cevabı Türkçe ya da İngilizce yazabilirsin (dinamik bağlama / dynamic binding, işaretleyici / marker…); ikisi de kabul edilir."
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Hoca aynı kavramları yıllar içinde farklı cümlelerle soruyor: extends/implements, Comparable/compareTo, super, soyut metot kuralı her yıl var."
          }
        ],
        "checks": [
          {
            "type": "fill",
            "prose": true,
            "q": "2025-26 vize",
            "text": "Bir metot final anahtar kelimesiyle tanımlanmışsa, bu metot alt sınıfta ⟦0⟧ edilemez.",
            "answers": [
              [
                "override",
                "geçersiz kılma",
                "ezme"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2025-26 vize",
            "text": "instanceof operatörü ⟦0⟧ zamanında, bir nesnenin belirli bir sınıfın örneği olup olmadığını test eder ve ⟦1⟧ tipinde sonuç döndürür.",
            "answers": [
              [
                "çalışma",
                "runtime",
                "çalışma zamanı"
              ],
              [
                "boolean"
              ]
            ],
            "a": "Derleme zamanında da tip uyumu kontrol edilir (alakasız sınıflar arasında instanceof derleme hatası), ama nesnenin <b>gerçek</b> tipine bakılması çalışma zamanında olur."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2025-26 vize",
            "text": "Java'da bir sınıfın hem bir sınıftan miras alıp hem de bir arayüzü uygulaması gerekiyorsa, kalıtım ⟦0⟧, arayüz uygulaması ise ⟦1⟧ anahtar kelimesiyle yapılır.",
            "answers": [
              [
                "extends"
              ],
              [
                "implements"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2025-26 vize",
            "text": "Java'da iki veya daha fazla arayüz aynı imzaya sahip ama farklı dönüş tipine sahip metotlar içeriyorsa, bu durum ⟦0⟧ hatasına neden olur.",
            "answers": [
              [
                "derleme",
                "compile",
                "derleme zamanı"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2025-26 vize",
            "text": "Cloneable arayüzü ⟦0⟧ arayüzüdür; bu arayüz herhangi bir metot içermez ancak bir sınıfın klonlanabilir olduğunu ⟦1⟧ için kullanılır.",
            "answers": [
              [
                "marker",
                "işaretleyici",
                "işaretçi",
                "boş",
                "etiket"
              ],
              [
                "belirtmek",
                "işaretlemek",
                "göstermek",
                "bildirmek",
                "etiketlemek"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2025-26 vize",
            "text": "Soyut sınıflarda tanımlanan metotlar, alt sınıflar tarafından ⟦0⟧ edilmediği sürece alt sınıfın da ⟦1⟧ olarak tanımlanması gerekir.",
            "answers": [
              [
                "override",
                "uygulan",
                "implemente",
                "geçersiz kılma"
              ],
              [
                "soyut",
                "abstract"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2025-26 vize",
            "text": "Bir sınıf, Comparable arayüzünü uyguladığında ⟦0⟧ metodunu override etmelidir.",
            "answers": [
              [
                "compareTo",
                "compareTo()"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2025-26 vize",
            "text": "Cloneable arayüzünü uygulayan bir sınıfta, nesnenin kopyalanabilmesi için ⟦0⟧ metodu override edilmelidir.",
            "answers": [
              [
                "clone",
                "clone()"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2025-26 vize",
            "text": "⟦0⟧ kavramı, bir nesnenin başka bir sınıfın örneğine dönüştürülmesini ifade eder.",
            "answers": [
              [
                "casting",
                "cast",
                "tip dönüşümü",
                "downcasting",
                "upcasting"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2025-26 vize",
            "text": "Bir istisna meydana geldiğinde, bu hatayı yakalamak için ⟦0⟧ bloğu kullanılır.",
            "answers": [
              [
                "catch",
                "try-catch"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2025-26 vize",
            "text": "⟦0⟧ ifadesi, bir istisnanın oluşturulup fırlatılmasını sağlar.",
            "answers": [
              [
                "throw",
                "throw new"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2024-25 vize",
            "text": "⟦0⟧ kavramı, bir sınıfın başka bir sınıftan özellikleri miras almasını sağlar. Bu metotların geçersiz kılınabilmesi için üst sınıftaki erişim seviyesi ⟦1⟧ olmalıdır.",
            "answers": [
              [
                "kalıtım",
                "inheritance",
                "miras"
              ],
              [
                "public",
                "protected",
                "public veya protected",
                "protected veya public",
                "public/protected",
                "private olmamalı",
                "private dışında",
                "erişilebilir"
              ]
            ],
            "a": "Private metot alt sınıfa görünmez, override edilemez. Aynı paketteyse default da yeter; hocanın beklediği cevap <b>public / protected</b>."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2024-25 vize",
            "text": "Bir sınıfın soyut bir sınıftan türemesi durumunda, alt sınıf ⟦0⟧ metotları mutlaka uygulamalıdır. Aksi takdirde alt sınıf da ⟦1⟧ olarak tanımlanmalıdır.",
            "answers": [
              [
                "soyut",
                "abstract"
              ],
              [
                "soyut",
                "abstract"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2024-25 vize",
            "text": "Java'da çalışma zamanında hangi metodun çağrılacağını belirleyen mekanizma ⟦0⟧ olarak adlandırılır.",
            "answers": [
              [
                "dinamik bağlama",
                "dynamic binding"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2024-25 vize",
            "text": "⟦0⟧ ve ⟦1⟧ istisna türleri, Java'da kontrolsüz istisnalar (unchecked exceptions) arasında yer alır ve genellikle mantık hatalarını ifade eder.",
            "answers": [
              [
                "RuntimeException",
                "Error",
                "NullPointerException",
                "ArithmeticException",
                "ArrayIndexOutOfBoundsException",
                "IndexOutOfBoundsException",
                "ClassCastException",
                "NumberFormatException",
                "IllegalArgumentException",
                "InputMismatchException"
              ],
              [
                "RuntimeException",
                "Error",
                "NullPointerException",
                "ArithmeticException",
                "ArrayIndexOutOfBoundsException",
                "IndexOutOfBoundsException",
                "ClassCastException",
                "NumberFormatException",
                "IllegalArgumentException",
                "InputMismatchException"
              ]
            ],
            "a": "Beklenen cevap genelde <b>RuntimeException ve Error</b>; somut örnek (NullPointerException, ArithmeticException…) yazmak da doğru."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2024-25 vize",
            "text": "Java'da ⟦0⟧ anahtar kelimesi ile tanımlanan bir sınıf başka bir sınıftan türetilir. Bunun yanı sıra bir sınıf birden fazla arayüzü ⟦1⟧ anahtar kelimesi ile uygulayabilir.",
            "answers": [
              [
                "extends"
              ],
              [
                "implements"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2024-25 vize",
            "text": "⟦0⟧ metodu Object sınıfında tanımlanmıştır ve bir nesnenin string gösterimini döndüren varsayılan bir metottur.",
            "answers": [
              [
                "toString",
                "toString()"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2024-25 vize",
            "text": "⟦0⟧ anahtar kelimesi, bir alt sınıfta üst sınıfın bir yapıcısını çağırmak için kullanılır. Bu çağrı alt sınıf yapıcısının ilk satırında yer almalıdır.",
            "answers": [
              [
                "super",
                "super()"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2024-25 vize",
            "text": "Java'da ⟦0⟧ arayüzü nesnelerin karşılaştırılabilir ve sıralanabilir olmasını sağlar. Bu arayüzü uygulayan bir sınıf ⟦1⟧ metodunu gerçekleştirmelidir.",
            "answers": [
              [
                "Comparable"
              ],
              [
                "compareTo",
                "compareTo()"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2024-25 vize",
            "text": "Bir sınıfın yalnızca soyut metotları içermesini sağlayan, ayrıca çoklu kalıtımı destekleyen bir yapı olan ⟦0⟧, nesnelerin belirli bir davranışı uygulamasını zorunlu kılar.",
            "answers": [
              [
                "arayüz",
                "interface"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2022-23 vize",
            "text": "Java'da bir nesnenin hangi sınıftan türediğini bulmak için ⟦0⟧ anahtar kelimesi kullanılır.",
            "answers": [
              [
                "instanceof"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2022-23 vize",
            "text": "Java'da bir nesne oluşturmak için ⟦0⟧ anahtar kelimesi kullanılarak ⟦1⟧ metot çağrılır.",
            "answers": [
              [
                "new"
              ],
              [
                "yapıcı",
                "constructor",
                "kurucu"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2022-23 vize",
            "text": "Java'da veri alanlarını kapsüllemek (encapsulation) için ⟦0⟧ anahtar kelimesi kullanılır.",
            "answers": [
              [
                "private"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2022-23 vize",
            "text": "Yöntem başlığında istisnaları (exceptions) bildirmek için ⟦0⟧ anahtar sözcüğü kullanılır.",
            "answers": [
              [
                "throws"
              ]
            ],
            "a": ""
          }
        ]
      },
      {
        "id": "kavram-bosluk",
        "title": "Kavram boşlukları: konu konu (38 cümle)",
        "en": "Fill in the Concepts",
        "src": "Tüm vize konuları",
        "minutes": 25,
        "blocks": [
          {
            "t": "p",
            "html": "Bölüm 0–3'ün tüm kavramları, vize cümlesi tarzında. Gerçek vize cümleleri için önceki derse bak. Türkçe ya da İngilizce terim yazabilirsin; büyük/küçük harf ve boşluk önemsiz."
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Sınavda <b>terimin kendisini</b> yazman beklenir. Terimleri tam adıyla bil, anlamını derslerden öğren."
          }
        ],
        "checks": [
          {
            "type": "fill",
            "prose": true,
            "q": "Java temelleri",
            "text": "Java kaynak kodu derleyici tarafından ⟦0⟧ koda çevrilir; bu kodu ⟦1⟧ çalıştırır.",
            "answers": [
              [
                "bytecode",
                "byte code",
                "bayt kod",
                "baytkod"
              ],
              [
                "JVM",
                "Java Virtual Machine",
                "Java sanal makinesi",
                "sanal makine"
              ]
            ],
            "a": "javac → <code>.class</code> (bytecode) → JVM. Bu sayede \"bir kez yaz, her yerde çalıştır\"."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Sınıf ve nesne",
            "text": "Sınıf, nesneler için bir ⟦0⟧dur; bir sınıftan oluşturulan nesneye o sınıfın ⟦1⟧ denir.",
            "answers": [
              [
                "şablon",
                "kalıp",
                "plan",
                "template",
                "şablon (template)"
              ],
              [
                "örneği",
                "örnek",
                "instance",
                "örneği (instance)"
              ]
            ],
            "a": "Sınıf = şablon (template / blueprint), nesne = örnek (instance). Örnek oluşturmaya <b>instantiation</b> denir."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Sınıf ve nesne",
            "text": "Bir nesnenin durumu ⟦0⟧ ile, davranışı ⟦1⟧ ile tanımlanır.",
            "answers": [
              [
                "veri alanları",
                "veri alanı",
                "alanlar",
                "alan",
                "özellikler",
                "data fields",
                "değişkenler",
                "nitelikler"
              ],
              [
                "metotlar",
                "metot",
                "metodlar",
                "methods",
                "metodlar"
              ]
            ],
            "a": "Nesnenin kimliği, durumu (veri alanları / properties) ve davranışı (metotlar) vardır."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Yapıcılar",
            "text": "Yapıcının dönüş tipi ⟦0⟧; adı ise ⟦1⟧ ile aynı olmalıdır.",
            "answers": [
              [
                "yoktur",
                "yok",
                "olmaz",
                "bulunmaz"
              ],
              [
                "sınıfın adı",
                "sınıf adı",
                "sınıf",
                "sınıfın ismi",
                "sınıf ismi"
              ]
            ],
            "a": "<code>void</code> bile yazılmaz. <code>public void Circle()</code> yazarsan bu yapıcı değil, sıradan bir metot olur."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Yapıcılar",
            "text": "Sınıfta hiç yapıcı yazılmazsa derleyici gövdesi boş, parametresiz bir ⟦0⟧ ekler. Sınıfa herhangi bir yapıcı yazılırsa bu yapıcı ⟦1⟧.",
            "answers": [
              [
                "varsayılan yapıcı",
                "default constructor",
                "varsayılan",
                "default yapıcı",
                "varsayılan constructor"
              ],
              [
                "eklenmez",
                "eklenmiyor",
                "oluşturulmaz",
                "yazılmaz"
              ]
            ],
            "a": "Bu yüzden sadece <code>Circle(double r)</code> yazılmış sınıfta <code>new Circle()</code> derleme hatası verir."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Referanslar",
            "text": "Nesneler ⟦0⟧ operatörüyle oluşturulur; hiçbir nesneyi göstermeyen referans değişkeninin değeri ⟦1⟧ olur ve onunla metot çağırmak ⟦2⟧ fırlatır.",
            "answers": [
              [
                "new"
              ],
              [
                "null"
              ],
              [
                "NullPointerException",
                "NPE"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Referanslar",
            "text": "Hiçbir referansın göstermediği nesneler JVM tarafından ⟦0⟧ ile otomatik olarak bellekten temizlenir.",
            "answers": [
              [
                "çöp toplama",
                "garbage collection",
                "çöp toplayıcı",
                "garbage collector",
                "gc",
                "çöp toplama (garbage collection)"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Varsayılan değerler",
            "text": "Sınıfın veri alanlarının varsayılan değerleri: int için ⟦0⟧, boolean için ⟦1⟧, referans tipler için ⟦2⟧. Yerel değişkenlere ise varsayılan değer ⟦3⟧.",
            "answers": [
              [
                "0"
              ],
              [
                "false"
              ],
              [
                "null"
              ],
              [
                "atanmaz",
                "verilmez",
                "yoktur",
                "yok",
                "atanmaz (derleme hatası)"
              ]
            ],
            "a": "Atanmamış yerel değişkeni kullanmak <b>derleme hatasıdır</b> (\"might not have been initialized\"). char'ın varsayılanı <code>'\\u0000'</code>, double'ınki 0.0."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "static",
            "text": "static bir değişken sınıfın ⟦0⟧ nesneleri tarafından paylaşılır; static bir metodun içinden instance değişkenlerine doğrudan ⟦1⟧.",
            "answers": [
              [
                "tüm",
                "bütün",
                "tum",
                "butun",
                "hepsi"
              ],
              [
                "erişilemez",
                "erisilemez",
                "ulaşılamaz"
              ]
            ],
            "a": "static üye nesneye değil sınıfa aittir; static metodun bir <code>this</code>'i yoktur."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "static",
            "text": "Sabit tanımlamak için ⟦0⟧ ve ⟦1⟧ anahtar kelimeleri birlikte kullanılır (Math.PI gibi).",
            "answers": [
              [
                "static",
                "final"
              ],
              [
                "final",
                "static"
              ]
            ],
            "a": "<code>public static final double PI = 3.14159;</code> Sabit adları BÜYÜK_HARF ile yazılır."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Görünürlük",
            "text": "⟦0⟧ üyeye her yerden, ⟦1⟧ üyeye sadece kendi sınıfından erişilir; değiştiricisiz (default) üyeye ise yalnızca aynı ⟦2⟧ içinden erişilebilir.",
            "answers": [
              [
                "public"
              ],
              [
                "private"
              ],
              [
                "paket",
                "package",
                "pakette",
                "paketten"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Kapsülleme",
            "text": "Veri alanlarını private yapıp onlara erişimi get/set metotlarıyla sağlamaya ⟦0⟧ denir. Değeri okuyan metoda ⟦1⟧, değiştiren metoda ⟦2⟧ denir.",
            "answers": [
              [
                "kapsülleme",
                "encapsulation",
                "veri kapsülleme",
                "veri alanı kapsülleme"
              ],
              [
                "getter",
                "accessor",
                "get",
                "erişimci"
              ],
              [
                "setter",
                "mutator",
                "set",
                "değiştirici"
              ]
            ],
            "a": "Kapsülleme veriyi korur (setter'da doğrulama yapılabilir) ve sınıfın bakımını kolaylaştırır."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Metoda nesne geçirme",
            "text": "Java'da argümanlar her zaman ⟦0⟧ ile geçirilir; nesne geçirildiğinde kopyalanan şey nesnenin ⟦1⟧dır.",
            "answers": [
              [
                "değer",
                "değerle",
                "pass-by-value",
                "value",
                "değer ile"
              ],
              [
                "referansı",
                "referans",
                "adresi",
                "referans değeri",
                "adres"
              ]
            ],
            "a": "Bu yüzden metot nesnenin <b>içini</b> değiştirebilir ama çağıranın değişkenini başka bir nesneye yönlendiremez."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Değişmez nesneler",
            "text": "Oluşturulduktan sonra içeriği değiştirilemeyen nesneye ⟦0⟧ nesne denir; ⟦1⟧ sınıfı buna en bilinen örnektir.",
            "answers": [
              [
                "değişmez",
                "immutable",
                "değiştirilemez"
              ],
              [
                "String"
              ]
            ],
            "a": "Koşullar: tüm alanlar private, setter yok, değiştirilebilir bir alanın referansını döndüren getter yok."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "this",
            "text": "Aynı sınıftaki başka bir yapıcıyı çağırmak için ⟦0⟧ kullanılır ve bu çağrı yapıcının ⟦1⟧ ifadesi olmalıdır.",
            "answers": [
              [
                "this(...)",
                "this()",
                "this",
                "this(…)"
              ],
              [
                "ilk",
                "birinci",
                "ilk satırı",
                "ilk satır"
              ]
            ],
            "a": "Parametre adı alanı gizlediğinde alana <code>this.radius</code> ile ulaşılır."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Wrapper",
            "text": "İlkel bir değeri nesne olarak saran sınıflara ⟦0⟧ sınıflar denir. int → Integer otomatik dönüşümüne ⟦1⟧, tersine ⟦2⟧ denir.",
            "answers": [
              [
                "wrapper",
                "sarmalayıcı",
                "sarmalayıcı (wrapper)",
                "zarf"
              ],
              [
                "autoboxing",
                "boxing",
                "otomatik kutulama",
                "kutulama"
              ],
              [
                "unboxing",
                "auto-unboxing",
                "autounboxing",
                "kutudan çıkarma"
              ]
            ],
            "a": "ArrayList ilkel tip tutamaz: <code>ArrayList&lt;int&gt;</code> derlenmez, <code>ArrayList&lt;Integer&gt;</code> yazılır."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "ArrayList",
            "text": "Dizinin boyutu oluşturulduktan sonra ⟦0⟧. ArrayList'in eleman sayısı ⟦1⟧ metoduyla, dizininki ise ⟦2⟧ ile öğrenilir.",
            "answers": [
              [
                "değiştirilemez",
                "değişmez",
                "sabittir",
                "değişemez"
              ],
              [
                "size()",
                "size"
              ],
              [
                "length",
                ".length"
              ]
            ],
            "a": "Dikkat: dizide <code>length</code> bir alandır (parantezsiz), String'de <code>length()</code> metottur, ArrayList'te <code>size()</code>."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Kalıtım",
            "text": "Alt sınıf üst sınıftan ⟦0⟧ anahtar kelimesiyle türetilir; Java'da bir sınıf yalnızca ⟦1⟧ üst sınıftan türeyebilir.",
            "answers": [
              [
                "extends"
              ],
              [
                "bir",
                "1",
                "tek"
              ]
            ],
            "a": "Çoklu kalıtım sınıflarda yok; arayüzlerle sağlanır (Bölüm 4)."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "super",
            "text": "Alt sınıf yapıcısı üst sınıf yapıcısını açıkça çağırmazsa derleyici ilk satıra ⟦0⟧ ekler. Üst sınıfta parametresiz yapıcı yoksa bu ⟦1⟧ hatasına yol açar.",
            "answers": [
              [
                "super()",
                "super();",
                "super"
              ],
              [
                "derleme",
                "compile",
                "derleme zamanı",
                "compile-time"
              ]
            ],
            "a": "Hocanın sevdiği tuzak: Apple extends Fruit, Fruit'te sadece <code>Fruit(String)</code> var → derleme hatası."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Yapıcı zinciri",
            "text": "Bir nesne oluşturulurken yapıcılar kalıtım zincirinde ⟦0⟧ sınıftan başlayarak çalışır; buna yapıcı zinciri (constructor chaining) denir.",
            "answers": [
              [
                "en üst",
                "üst",
                "en üstteki",
                "object",
                "en üst sınıftan",
                "üst sınıftan"
              ]
            ],
            "a": "Faculty → Employee → Person örneğinde çıktı: Person → Employee → Faculty sırasıyla basılır."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Override / overload",
            "text": "Alt sınıfta aynı imzalı metodu yeniden tanımlamaya ⟦0⟧, aynı adla farklı parametreli metot yazmaya ⟦1⟧ denir.",
            "answers": [
              [
                "override",
                "overriding",
                "geçersiz kılma",
                "ezme",
                "üzerine yazma"
              ],
              [
                "overload",
                "overloading",
                "aşırı yükleme"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Override kuralları",
            "text": "private metotlar override ⟦0⟧. static bir metot alt sınıfta aynı imzayla yeniden tanımlanırsa üst sınıftaki ⟦1⟧.",
            "answers": [
              [
                "edilemez",
                "edilmez",
                "yapılamaz"
              ],
              [
                "gizlenir",
                "hiding",
                "gizlenir (hidden)",
                "saklanır"
              ]
            ],
            "a": "Override sadece erişilebilir instance metotlar için geçerlidir."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Object",
            "text": "Java'daki her sınıf doğrudan ya da dolaylı olarak ⟦0⟧ sınıfından türer. Onun ⟦1⟧ metodu varsayılan olarak SinifAdi@hashcode biçiminde bir metin döndürür.",
            "answers": [
              [
                "Object",
                "java.lang.Object"
              ],
              [
                "toString",
                "toString()"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Dinamik bağlama",
            "text": "Çağrılacak metodun derlemede ⟦0⟧ tipe göre kontrol edilip çalışma zamanında nesnenin ⟦1⟧ tipine göre seçilmesine dinamik bağlama denir.",
            "answers": [
              [
                "bildirilen",
                "declared",
                "referansın",
                "tanımlanan",
                "statik"
              ],
              [
                "gerçek",
                "actual",
                "asıl",
                "dinamik"
              ]
            ],
            "a": "Eşleştirme (matching) derlemede, bağlama (binding) çalışma zamanında."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Casting",
            "text": "Üst tip referansını alt tipe çevirmek ⟦0⟧ cast gerektirir; güvenli olup olmadığını önce ⟦1⟧ ile kontrol ederiz. Yanlış çevirmede ⟦2⟧ fırlatılır.",
            "answers": [
              [
                "açık",
                "explicit",
                "açıkça",
                "aşağı",
                "down"
              ],
              [
                "instanceof"
              ],
              [
                "ClassCastException"
              ]
            ],
            "a": "Upcast (alt → üst) her zaman güvenli ve otomatiktir."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "equals",
            "text": "<code>==</code> iki referansın ⟦0⟧ nesneyi gösterip göstermediğini; override edilmiş equals ise nesnelerin ⟦1⟧ karşılaştırır.",
            "answers": [
              [
                "aynı"
              ],
              [
                "içeriğini",
                "içeriklerini",
                "içerik",
                "değerlerini",
                "içeriği"
              ]
            ],
            "a": "Object'teki varsayılan equals de <code>==</code> gibi davranır; içerik karşılaştırması için override gerekir."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "protected ve final",
            "text": "protected üyeye aynı paketten ve ⟦0⟧ erişilebilir. final bir sınıf ⟦1⟧; final bir metot ⟦2⟧.",
            "answers": [
              [
                "alt sınıflardan",
                "alt sınıftan",
                "alt sınıflar",
                "subclass",
                "alt sınıflardan (farklı paket olsa bile)"
              ],
              [
                "türetilemez",
                "kalıtılamaz",
                "extend edilemez",
                "genişletilemez",
                "miras alınamaz"
              ],
              [
                "override edilemez",
                "ezilemez",
                "geçersiz kılınamaz",
                "overrideedilemez"
              ]
            ],
            "a": "Erişim sırası: private &lt; default &lt; protected &lt; public. Override ederken erişim <b>daraltılamaz</b>."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "İstisna hiyerarşisi",
            "text": "Tüm istisna sınıflarının kökü ⟦0⟧ sınıfıdır. RuntimeException, Error ve alt sınıfları ⟦1⟧ istisnalardır.",
            "answers": [
              [
                "Throwable",
                "java.lang.Throwable"
              ],
              [
                "kontrolsüz",
                "unchecked",
                "denetlenmeyen",
                "kontrol edilmeyen"
              ]
            ],
            "a": "Geri kalan Exception alt sınıfları (IOException, FileNotFoundException…) kontrollüdür (checked)."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Yakala ya da bildir",
            "text": "Kontrollü (checked) bir istisna fırlatabilen kod ya onu try-catch ile ⟦0⟧ ya da metot başlığında ⟦1⟧ ile bildirmelidir.",
            "answers": [
              [
                "yakalamalı",
                "yakalar",
                "yakalamalıdır",
                "catch",
                "yakala"
              ],
              [
                "throws"
              ]
            ],
            "a": "Catch-or-declare kuralı. Uymazsan <b>derleme hatası</b>."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "throw / throws",
            "text": "İstisna fırlatmak için ⟦0⟧, bir metodun fırlatabileceği istisnaları bildirmek için ⟦1⟧ kullanılır.",
            "answers": [
              [
                "throw"
              ],
              [
                "throws"
              ]
            ],
            "a": "<code>throw new IllegalArgumentException(\"…\");</code> · <code>void oku() throws IOException</code>"
          },
          {
            "type": "fill",
            "prose": true,
            "q": "finally",
            "text": "⟦0⟧ bloğu istisna olsa da olmasa da, try içinde return olsa bile her zaman çalışır.",
            "answers": [
              [
                "finally"
              ]
            ],
            "a": "Tek istisnası <code>System.exit()</code>."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "catch sırası",
            "text": "Birden çok catch varsa alt sınıf istisnası, üst sınıf istisnasından ⟦0⟧ yazılmalıdır; aksi halde ⟦1⟧ hatası alınır.",
            "answers": [
              [
                "önce",
                "daha önce",
                "yukarıda",
                "üstte"
              ],
              [
                "derleme",
                "compile",
                "derleme zamanı",
                "unreachable"
              ]
            ],
            "a": "<code>catch (Exception e)</code> önce yazılırsa alttaki <code>catch (ArithmeticException e)</code>'a asla ulaşılamaz."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Yayılım",
            "text": "Bir metotta yakalanmayan istisna, ⟦0⟧ boyunca çağıran metotlara doğru yayılır; hiçbir yerde yakalanmazsa program ⟦1⟧.",
            "answers": [
              [
                "çağrı yığını",
                "call stack",
                "yığın",
                "metot çağrı zinciri",
                "stack",
                "çağrı zinciri"
              ],
              [
                "sonlanır",
                "durur",
                "çöker",
                "biter",
                "sonlandırılır"
              ]
            ],
            "a": "Yayılım sırasında, istisnanın geçtiği metotlarda try bloğundan sonraki satırlar çalışmaz (finally hariç)."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Özel istisna",
            "text": "Kendi kontrollü istisna sınıfımızı yazmak için onu ⟦0⟧ sınıfından türetiriz; mesajı üst sınıfa ⟦1⟧ ile iletiriz.",
            "answers": [
              [
                "Exception",
                "java.lang.Exception"
              ],
              [
                "super(mesaj)",
                "super",
                "super()",
                "super(message)",
                "super(msg)"
              ]
            ],
            "a": "RuntimeException'dan türetirsen kontrolsüz olur."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "İstisna bilgisi",
            "text": "Yakalanan istisnanın mesajını ⟦0⟧, çağrı yığınını ekrana ⟦1⟧ metoduyla alırız.",
            "answers": [
              [
                "getMessage()",
                "getMessage"
              ],
              [
                "printStackTrace()",
                "printStackTrace"
              ]
            ],
            "a": "Ayrıca <code>toString()</code>: sınıf adı + mesaj; <code>getStackTrace()</code>: StackTraceElement dizisi."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "File ve metin I/O",
            "text": "File sınıfı dosyanın ⟦0⟧ okuyup yazmaz; yalnızca adı ve özellikleriyle ilgilenir. Dosyaya yazmak için ⟦1⟧, okumak için ⟦2⟧ kullanılır.",
            "answers": [
              [
                "içeriğini",
                "içeriği",
                "içerik",
                "verisini",
                "içindekileri"
              ],
              [
                "PrintWriter"
              ],
              [
                "Scanner"
              ]
            ],
            "a": "PrintWriter dosya yoksa oluşturur, varsa <b>içini siler</b>. İkisi de dosya açılamazsa FileNotFoundException (kontrollü) fırlatabilir."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "try-with-resources",
            "text": "try-with-resources ile açılan kaynak, blok bitince ⟦0⟧ kapatılır; bunun için kaynağın ⟦1⟧ arayüzünü uygulaması gerekir.",
            "answers": [
              [
                "otomatik",
                "otomatik olarak",
                "kendiliğinden"
              ],
              [
                "AutoCloseable",
                "Closeable"
              ]
            ],
            "a": "Kapatmayı unutursan PrintWriter'a yazdıkların dosyaya hiç yazılmayabilir."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Scanner",
            "text": "Scanner ile tam sayı beklenirken harf girilirse ⟦0⟧ fırlatılır.",
            "answers": [
              [
                "InputMismatchException",
                "java.util.InputMismatchException"
              ]
            ],
            "a": "Yakaladıktan sonra hatalı girdiyi <code>nextLine()</code> ile atmazsan döngü sonsuza girer."
          }
        ]
      },
      {
        "id": "dogru-yanlis",
        "title": "Doğru / Yanlış: gerçek sorular + benzerleri",
        "en": "True / False",
        "src": "2022-23 ve 2024-25 vizeleri · Soru 2",
        "minutes": 12,
        "blocks": [
          {
            "t": "p",
            "html": "İlk 20 soru iki vizeden aynen alındı, gerisi aynı tarzda. Hocanın yöntemi: doğru bir kuralda <b>tek kelimeyi</b> değiştirmek (parametresiz → parametreli, farklı → aynı, edilemez → edilebilir)."
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "Her cümlede şu kelimelere dikkat: <b>tüm, mecburi, zorunda, her zaman, olabilir, aynı/farklı imza</b>. Genelleme içeren cümle genelde yanlıştır, ama \"Abstract sınıfın <b>tüm</b> alt sınıfları…\" gibi."
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Bir sınıfta yapıcı tanımlanmazsa Java varsayılan bir <b>parametreli</b> yapıcı ekler ve sınıf dışından örneklenmesini sağlar. <small>(2024)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Varsayılan yapıcı <b>parametresizdir</b>. Hocanın klasik tuzağı: tek kelime değiştirip yanlış yapmak."
          },
          {
            "type": "mc",
            "q": "Bir interface'de tanımlanan tüm metotlar varsayılan olarak public ve abstract'tır. <small>(2024)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Bir nesne referansı null atanmışsa, bu nesneye yapılan erişim NullPointerException oluşturabilir. <small>(2024)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "RuntimeException sınıfından türetilen istisnalar derleme zamanında kontrol edilmez. <small>(2024)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "Kontrolsüz (unchecked) istisnalar."
          },
          {
            "type": "mc",
            "q": "Abstract bir sınıfın tüm alt sınıfları soyut metotları geçersiz kılmak zorundadır. <small>(2024)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Alt sınıf da abstract ise zorunda değil."
          },
          {
            "type": "mc",
            "q": "Bir sınıf hem bir başka sınıfı genişletebilir (extend) hem de bir veya daha fazla arayüzü uygulayabilir (implement). <small>(2024)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Arayüzler, bir sınıfın özelliklerini detaylandıran ve sınıfa bağımlılıkları azaltan bir soyutlama sağlar. <small>(2024)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "Arayüz \"ne yapılacağını\" tanımlar; kod somut sınıfa değil arayüze bağlı yazılabilir."
          },
          {
            "type": "mc",
            "q": "Arayüzler (interfaces) bir yapıcı (constructor) tanımlayabilir. <small>(2024)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Final anahtar kelimesiyle tanımlanan bir sınıf, başka bir sınıf tarafından genişletilemez (extend edilemez). <small>(2024)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "instanceof operatörü, bir nesnenin belirli bir sınıf veya arayüzle ilişkilendirildiğini kontrol eder. <small>(2024)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Bir alt sınıf genellikle üst sınıfından daha fazla işlev ve daha ayrıntılı bilgi içerecek şekilde genişletilir. <small>(2022)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Nesne ve Sınıf Java programlama dilinde aynı kavramları ifade eder. <small>(2022)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Sınıf şablon, nesne o şablonun örneği."
          },
          {
            "type": "mc",
            "q": "Bir metot başka bir metodu geçersiz kılarsa (override), bu iki metodun aynı imzası olması gerekir. <small>(2022)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Yapıcı metotların (constructor) dönüş türü olabilir. <small>(2022)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "void bile yazılmaz; yazılırsa sıradan metot olur."
          },
          {
            "type": "mc",
            "q": "Bir yöntem başka bir yöntemi aşırı yüklerse (overload), bu iki yöntemin aynı imzası olması gerekir. <small>(2022)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Overload'da parametre listesi <b>farklı</b> olmalı."
          },
          {
            "type": "mc",
            "q": "Java'da final olarak tanımlanan bir metot override edilebilir. <small>(2022)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Soyut sınıflara (Abstract Class) soyut metotlar tanımlamak mecburidir. <small>(2022)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Nesneye yönelik programlama, mevcut sınıfların özelliklerini yeni sınıflara aktarabilmenizi sağlar. Buna inheritance (miras) denir. <small>(2022)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Soyut bir metot soyut olmayan bir sınıfta yer alabilir. <small>(2022)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Üst sınıfta yer alan bir metot override edilerek soyut bir metoda çevrilebilir. <small>(2022)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "static bir metodun içinden <code>this</code> kullanılabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "static metot nesneye değil sınıfa ait; this yok."
          },
          {
            "type": "mc",
            "q": "Yerel değişkenlere varsayılan olarak 0 atanır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Yerel değişkenlerin varsayılan değeri yoktur; atanmadan kullanmak derleme hatası."
          },
          {
            "type": "mc",
            "q": "Bir sınıf birden fazla sınıfı extend edebilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "private metotlar alt sınıfta override edilebilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Alt sınıf aynı imzayla metot yazarsa bu yeni bir metottur, override değil."
          },
          {
            "type": "mc",
            "q": "Alt sınıf yapıcısında super(...) yazılmazsa derleyici ilk satıra super() ekler.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "try bloğunda return çalışsa bile finally bloğu çalışır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "catch bloklarında üst sınıf istisnası (Exception) alt sınıf istisnasından önce yazılabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Alttaki catch erişilemez olur → derleme hatası."
          },
          {
            "type": "mc",
            "q": "static bir değişken her nesne için ayrı bir kopya tutar.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Yapıcı metotlar static olabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Override ederken erişim seviyesi daraltılabilir (public → protected).",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Genişletilebilir, daraltılamaz."
          },
          {
            "type": "mc",
            "q": "Overload edilen metotlar yalnızca dönüş tipleri farklı olarak yazılabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Dönüş tipi imzaya dahil değil; parametreler farklı olmalı."
          },
          {
            "type": "mc",
            "q": "protected bir üyeye farklı paketteki alt sınıftan erişilebilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Soyut sınıfın yapıcısı olabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "Wrapper sınıflar sayesinde int değerler ArrayList'e eklenebilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "ArrayList&lt;Integer&gt; + autoboxing."
          }
        ]
      },
      {
        "id": "kod-tamamla",
        "title": "Kodu tamamla (tek satırlık boşluklar)",
        "en": "Complete the Code",
        "src": "Tüm vize konuları",
        "minutes": 15,
        "blocks": [
          {
            "t": "p",
            "html": "Sınavda kodun bir kısmı boş bırakılır; eksik <b>anahtar kelimeyi, tipi ya da metodu</b> yazman istenir. Boşluğu doldurmak için kodu ezberlemene gerek yok: <b>o satırın ne iş yaptığını</b> sor."
          },
          {
            "t": "table",
            "head": [
              "Boşluğun yeri",
              "Sor kendine",
              "Muhtemel cevap"
            ],
            "rows": [
              [
                "Yapıcının ilk satırı",
                "Aynı sınıfın mı, üst sınıfın mı yapıcısı?",
                "<code>this(...)</code> / <code>super(...)</code>"
              ],
              [
                "Sınıf başlığı",
                "Kalıtım mı, istisna sınıfı mı?",
                "<code>extends</code>"
              ],
              [
                "Metot başlığının sonu",
                "Kontrollü istisna fırlatılıyor mu?",
                "<code>throws X</code>"
              ],
              [
                "if içinde <code>new XException</code> öncesi",
                "Fırlatma mı?",
                "<code>throw</code>"
              ],
              [
                "Alan tanımı",
                "Paylaşılan mı? Gizli mi?",
                "<code>static</code> / <code>private</code>"
              ],
              [
                "Cast öncesi kontrol",
                "Gerçek tip uygun mu?",
                "<code>instanceof</code>"
              ],
              [
                "Override edilen metodun içi",
                "Üst sınıfın sürümü mü?",
                "<code>super.metot()</code>"
              ]
            ]
          }
        ],
        "checks": [
          {
            "type": "fill",
            "q": "Parametresiz yapıcı, varsayılan yarıçapla diğer yapıcıyı çağırsın:",
            "code": "public class Circle {\n    private double radius;\n\n    public Circle() {\n        ⟦0⟧(1.0);\n    }\n\n    public Circle(double radius) {\n        ⟦1⟧.radius = radius;\n    }\n}",
            "answers": [
              [
                "this"
              ],
              [
                "this"
              ]
            ],
            "a": "<code>this(1.0)</code> aynı sınıftaki yapıcıyı çağırır (ilk satırda olmalı). <code>this.radius</code> alanı, gölgeleyen parametreden ayırır."
          },
          {
            "type": "fill",
            "q": "Ogrenci, Kisi'den türesin ve adı üst sınıf yapıcısına iletsin:",
            "code": "class Kisi {\n    protected String ad;\n    public Kisi(String ad) { this.ad = ad; }\n}\n\nclass Ogrenci ⟦0⟧ Kisi {\n    private int no;\n\n    public Ogrenci(String ad, int no) {\n        ⟦1⟧(ad);\n        this.no = no;\n    }\n}",
            "answers": [
              [
                "extends"
              ],
              [
                "super"
              ]
            ],
            "a": "Kisi'de parametresiz yapıcı yok; <code>super(ad)</code> yazılmazsa derleyicinin eklediği <code>super()</code> derleme hatası verir."
          },
          {
            "type": "fill",
            "q": "Oluşturulan nesne sayısını tüm nesneler için ortak tut:",
            "code": "public class Sayac {\n    private ⟦0⟧ int adet = 0;\n\n    public Sayac() {\n        adet++;\n    }\n\n    public ⟦1⟧ int getAdet() {\n        return adet;\n    }\n}",
            "answers": [
              [
                "static"
              ],
              [
                "static"
              ]
            ],
            "a": "Paylaşılan sayaç static olmalı; <code>Sayac.getAdet()</code> diye nesnesiz çağrılabilmesi için metot da static."
          },
          {
            "type": "fill",
            "q": "Kapsüllenmiş alan ve doğrulamalı setter:",
            "code": "public class Urun {\n    ⟦0⟧ double fiyat;\n\n    public double getFiyat() {\n        return fiyat;\n    }\n\n    public ⟦1⟧ setFiyat(double fiyat) {\n        if (fiyat >= 0)\n            ⟦2⟧.fiyat = fiyat;\n    }\n}",
            "answers": [
              [
                "private"
              ],
              [
                "void"
              ],
              [
                "this"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "q": "Object'ten gelen metodu ez:",
            "code": "public class Nokta {\n    private int x, y;\n\n    @⟦0⟧\n    public ⟦1⟧ toString() {\n        return \"(\" + x + \", \" + y + \")\";\n    }\n}",
            "answers": [
              [
                "Override"
              ],
              [
                "String"
              ]
            ],
            "a": "<code>System.out.println(nokta)</code> toString'i otomatik çağırır. İmza birebir aynı olmalı: <code>public String toString()</code>."
          },
          {
            "type": "fill",
            "q": "Güvenli aşağı çevirme (downcast):",
            "code": "Object o = new Circle(2);\nif (o ⟦0⟧ Circle) {\n    Circle c = ⟦1⟧ o;\n    System.out.println(c.getArea());\n}",
            "answers": [
              [
                "instanceof"
              ],
              [
                "(Circle)"
              ]
            ],
            "a": "Cast olmadan <code>o.getArea()</code> derlenmez: bildirilen tip Object'te getArea yok."
          },
          {
            "type": "fill",
            "q": "Üst tip dizisi üzerinden polimorfizm:",
            "code": "GeometricObject[] sekiller = { new Circle(1), new Rectangle(2, 3) };\ndouble toplam = 0;\nfor (⟦0⟧ s : sekiller)\n    toplam += s.⟦1⟧();      // her nesnenin kendi metodu çalışır",
            "answers": [
              [
                "GeometricObject"
              ],
              [
                "getArea"
              ]
            ],
            "a": "Dinamik bağlama: Circle için Circle.getArea, Rectangle için Rectangle.getArea."
          },
          {
            "type": "fill",
            "q": "try-catch-finally iskeletini tamamla:",
            "code": "⟦0⟧ {\n    int[] a = new int[3];\n    a[5] = 1;\n} ⟦1⟧ (ArrayIndexOutOfBoundsException e) {\n    System.out.println(\"Hata: \" + e.⟦2⟧());\n} ⟦3⟧ {\n    System.out.println(\"her zaman çalışır\");\n}",
            "answers": [
              [
                "try"
              ],
              [
                "catch"
              ],
              [
                "getMessage"
              ],
              [
                "finally"
              ]
            ],
            "a": "Çıktı: <code>Hata: Index 5 out of bounds for length 3</code> sonra <code>her zaman çalışır</code>."
          },
          {
            "type": "fill",
            "q": "Kontrollü özel istisna yaz ve fırlat:",
            "code": "class NegatifException ⟦0⟧ Exception {\n    public NegatifException(String mesaj) {\n        ⟦1⟧(mesaj);\n    }\n}\n\npublic static double karekok(double x) ⟦2⟧ NegatifException {\n    if (x < 0)\n        ⟦3⟧ new NegatifException(\"negatif: \" + x);\n    return Math.sqrt(x);\n}",
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
              ]
            ],
            "a": "Exception'dan türediği için kontrollü: metot <code>throws</code> ile bildirmek zorunda; çağıran da yakalamalı ya da bildirmeli."
          },
          {
            "type": "fill",
            "q": "Dosyayı satır satır oku:",
            "code": "public static void oku(String ad) ⟦0⟧ FileNotFoundException {\n    Scanner in = new Scanner(new ⟦1⟧(ad));\n    while (in.⟦2⟧())\n        System.out.println(in.nextLine());\n    in.⟦3⟧();\n}",
            "answers": [
              [
                "throws"
              ],
              [
                "File",
                "java.io.File"
              ],
              [
                "hasNextLine",
                "hasNext"
              ],
              [
                "close"
              ]
            ],
            "a": "<code>new Scanner(\"veri.txt\")</code> yazsaydık dosyayı değil \"veri.txt\" <b>metnini</b> okurdu."
          },
          {
            "type": "fill",
            "q": "Dosyaya yaz; dosya otomatik kapansın:",
            "code": "⟦0⟧ (PrintWriter out = new PrintWriter(\"notlar.txt\")) {\n    out.⟦1⟧(\"Ali 85\");\n    out.println(\"Ece 92\");\n}",
            "answers": [
              [
                "try"
              ],
              [
                "println",
                "print"
              ]
            ],
            "a": "try-with-resources: parantez içindeki kaynak blok bitince <code>close()</code> edilir."
          },
          {
            "type": "fill",
            "q": "ArrayList ve wrapper:",
            "code": "ArrayList<⟦0⟧> sayilar = new ArrayList<>();\nsayilar.⟦1⟧(5);              // autoboxing: 5 → Integer\nint ilk = sayilar.⟦2⟧(0);     // unboxing\nint n = Integer.⟦3⟧(\"42\");   // String → int",
            "answers": [
              [
                "Integer"
              ],
              [
                "add"
              ],
              [
                "get"
              ],
              [
                "parseInt"
              ]
            ],
            "a": "<code>Integer.valueOf(\"42\")</code> ise Integer nesnesi döndürür."
          },
          {
            "type": "fill",
            "q": "Override edilen metottan üst sınıfınkini çağır:",
            "code": "class Calisan {\n    protected double maas = 1000;\n    public double maasHesapla() { return maas; }\n}\n\nclass Yonetici extends Calisan {\n    private double prim = 500;\n\n    @Override\n    public double maasHesapla() {\n        return ⟦0⟧.maasHesapla() + prim;\n    }\n}",
            "answers": [
              [
                "super"
              ]
            ],
            "a": "<code>super.</code> yazılmazsa metot kendini çağırır → sonsuz özyineleme, StackOverflowError."
          }
        ]
      },
      {
        "id": "cikti-sorulari",
        "title": "Kod çıktısı: gerçek vize soruları",
        "en": "Output Tracing",
        "src": "Geçmiş vizeler",
        "minutes": 25,
        "blocks": [
          {
            "t": "p",
            "html": "Üç tip çıktı sorusu var: <b>yapıcı zinciri</b> (this/super), <b>override + super.metot() aritmetiği</b> (resize, calculate), <b>iç içe try-catch-finally</b>. Önce kâğıda çıktıyı yaz, sonra cevaba bak. İki tanesinin adım adım izi aşağıda."
          },
          {
            "t": "h",
            "text": "İz 1: 2025 vize, Shape / Circle (override + overload + super)"
          },
          {
            "t": "dg",
            "id": "tr-v25-shape"
          },
          {
            "t": "h",
            "text": "İz 2: 2025 vize, iç içe try-catch-finally"
          },
          {
            "t": "dg",
            "id": "tr-v25-trycatch"
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Yöntem: (1) Her <code>new</code> için yapıcı zincirini yukarıdan aşağı yaz. (2) Her çağrıda önce \"hangi imza?\" (overload, derleme), sonra \"kimin sürümü?\" (override, gerçek tip). (3) İstisnada \"en yakın uygun catch neresi?\", sonra finally'ler içten dışa. (4) print ile println farkı."
          }
        ],
        "checks": [
          {
            "type": "write",
            "q": "<b>2025-26 vize S2 (a)</b>: Aşağıda verilen kodun çıktısını yazınız.",
            "given": "class Shape {\n    int area = 1;\n    public void resize(int factor) {\n        area *= factor;\n    }\n}\nclass Circle extends Shape {\n    public void resize() {\n        area += 3;\n    }\n    public void resize(int factor) {\n        resize();\n        super.resize(factor);\n        area += 2;\n    }\n    public static void main(String[] args) {\n        Circle c = new Circle();\n        c.resize(2);\n        System.out.println(\"Area = \" + c.area);\n    }\n}",
            "output": "Area = 10",
            "a": "area = 1 → <code>c.resize(2)</code>: Circle'daki override çalışır → içindeki <code>resize()</code> <b>parametresiz</b> olan (overload) → 1+3 = 4 → <code>super.resize(2)</code> Shape'inkini çağırır → 4·2 = 8 → +2 → <b>10</b>. Adım adım iz derste."
          },
          {
            "type": "write",
            "q": "<b>2025-26 vize S2 (b)</b>: Aşağıda verilen kodun çıktısını yazınız.",
            "given": "class A {\n    public A() {\n        this(5);\n        System.out.println(\"A() constructor\");\n    }\n    public A(int x) {\n        System.out.println(\"A(int) constructor: \" + x);\n    }\n}\nclass B extends A {\n    public B() {\n        this(10);\n        System.out.println(\"B() constructor\");\n    }\n    public B(int y) {\n        super(y - 2);\n        System.out.println(\"B(int) constructor: \" + y);\n    }\n}\nclass C extends B {\n    public C() {\n        super(20);\n        System.out.println(\"C() constructor\");\n    }\n    public static void main(String[] args) {\n        new C();\n    }\n}",
            "output": "A(int) constructor: 18\nB(int) constructor: 20\nC() constructor",
            "a": "<code>new C()</code> → C() ilk satır <code>super(20)</code> → B(int y=20) ilk satır <code>super(18)</code> → A(int x=18) yazar. Sonra geri dönülürken B(int), en son C() yazar. <b>A() ve B() hiç çalışmaz</b>: zincir açıkça <code>super(…)</code> ile yönlendirildi. Tuzak: \"this(5)\" ve \"this(10)\" satırlarına bakıp onları yazmak."
          },
          {
            "type": "write",
            "q": "<b>2025-26 vize S4</b>: Program çalıştırıldığında ekrana ne yazdırılır? <code>count</code> değişkeninin değeri neden bu sonucu verir?",
            "given": "class Counter {\n    static int count = 0;\n\n    public Counter() {\n        count++;\n        System.out.println(\"Constructor called\");\n    }\n\n    public void showCount() {\n        System.out.println(\"Count = \" + count);\n    }\n}\n\npublic class TestCounter {\n    public static void main(String[] args) {\n        Counter c1 = new Counter();\n        Counter c2 = new Counter();\n        c1.showCount();\n        c2.showCount();\n    }\n}",
            "output": "Constructor called\nConstructor called\nCount = 2\nCount = 2",
            "a": "<code>count</code> <b>static</b>: tüm Counter nesneleri <b>tek bir</b> count'u paylaşır. İki yapıcı çağrısı aynı değişkeni 2 kez artırır; c1 ve c2 aynı değeri (2) görür. static olmasaydı her nesnenin kendi count'u olur, ikisi de 1 yazardı."
          },
          {
            "type": "write",
            "q": "<b>2025-26 vize (iç içe try)</b>: Aşağıdaki kodun çıktısını yazınız.",
            "given": "public class CiktiTryCatch {\n    public static void main(String[] args) {\n        int a = 0, b = 5;\n        String[] c = {\"A\", \"B\", \"C\"};\n        try {\n            System.out.print(c[a / b]);\n            try {\n                for (int i = 1; i < 4; i++) {\n                    System.out.print(c[i]);\n                }\n            } catch (Exception e) {\n                System.out.println(\"D\");\n            } finally {\n                System.out.println(\"E\");\n            }\n        } catch (Exception e) {\n            System.out.println(\"F\");\n        } finally {\n            System.out.println(\"G\");\n        }\n    }\n}",
            "output": "ABCD\nE\nG",
            "a": "<code>a / b</code> = 0/5 = <b>0</b> (sıfıra bölme yok!) → \"A\". İç döngü B, C yazar; i = 3'te <code>c[3]</code> → ArrayIndexOutOfBounds → <b>içteki</b> catch \"D\" (println, satır sonu) → içteki finally \"E\". İstisna içeride yakalandığı için dıştaki catch (\"F\") çalışmaz; dıştaki finally \"G\". print/println farkına dikkat: ABCD aynı satırda."
          },
          {
            "type": "write",
            "q": "<b>2024-25 vize S3</b>: Aşağıda verilen kodun çıktısını yazınız.",
            "given": "package com.mycompany.nyp_deneme;\n\nclass SimpleCalc {\n    public int value;\n    public void calculate() { value += 7; }\n}\nclass MultiCalc extends SimpleCalc {\n    public void calculate() { value += 3; }\n    public void calculate(int multipier) {\n        calculate();\n        super.calculate();\n        value *= multipier;\n    }\n}\npublic class NypDeneme {\n    public static void main(String[] args) {\n        MultiCalc calculator = new MultiCalc();\n        calculator.calculate(2);\n        System.out.println(\"Value is:\" + calculator.value);\n    }\n}",
            "output": "Value is:20",
            "a": "value = 0 → <code>calculate(2)</code> (overload, MultiCalc) → <code>calculate()</code>: gerçek tip MultiCalc → <b>MultiCalc'ın</b> override'ı → 0+3 = 3 → <code>super.calculate()</code> → SimpleCalc: 3+7 = 10 → ·2 → <b>20</b>. (Sınav kâğıdında main sınıf adı görünmüyor; burada NypDeneme dedik.)"
          },
          {
            "type": "write",
            "q": "<b>2024-25 vize S5</b>: Aşağıdaki komutların çıktılarını yazınız veya program aniden sonlanırsa konsola yazdırılan istisnanın adını yazınız: <code>java Exceptional 4 2</code> · <code>3 null</code> · <code>1 0</code> · <code>2</code>",
            "given": "public class Exceptional {\n\n    public static void divide(String x, String y) {\n        String ans = \"\";\n        try {\n            int dx = Integer.parseInt(x);\n            int dy = Integer.parseInt(y);\n            ans = String.valueOf(dx/dy);\n        } catch (NumberFormatException nfe) {\n            ans = \"bad input\";\n        } catch (NullPointerException npe) {\n            ans = \"null input\";\n        } finally {\n            System.out.print(\"answer: \");\n        }\n        System.out.println(ans);\n    }\n\n    public static void main(String[] args) {\n        divide(args[0], args[1]);\n    }\n}",
            "output": "java Exceptional 4 2  →  answer: 2\njava Exceptional 3 null  →  answer: bad input\njava Exceptional 1 0  →  answer:  + program sonlanır: ArithmeticException\njava Exceptional 2  →  (çıktı yok)  + program sonlanır: ArrayIndexOutOfBoundsException",
            "a": "<ul><li><b>3 null</b>: \"null\" burada bir <b>String</b> (4 harfli metin), null referans değil → <code>parseInt(\"null\")</code> → NumberFormatException → <b>bad input</b>. \"null input\" çıkmaz: en büyük tuzak.</li><li><b>1 0</b>: 1/0 → ArithmeticException, hiçbir catch yakalamaz → önce <b>finally</b> \"answer: \" yazar, sonra istisna main'e ve oradan dışarı yayılır; 16. satır çalışmaz.</li><li><b>2</b>: <code>args[1]</code> yok → ArrayIndexOutOfBoundsException <b>main</b> içinde, divide hiç çağrılmaz → hiçbir şey yazılmaz.</li></ul>"
          },
          {
            "type": "write",
            "q": "<b>2024-25 vize S7</b>: Aşağıda verilen programın çıktısını yazınız.",
            "given": "class Cihaz {\n    public void islev(String mesaj) {\n        System.out.println(\"Cihaz: Mesaj alındı - \" + mesaj);\n    }\n    public void islev(int deger) {\n        System.out.println(\"Cihaz: Değer işleniyor - \" + deger);\n    }\n    public void islev(int deger, String ek) {\n        System.out.println(\"Cihaz: \" + deger + \" - \" + ek);\n    }\n}\nclass Bilgisayar extends Cihaz {\n    public void islev() {\n        System.out.println(\"Bilgisayar: İşlem başlatılıyor.\");\n    }\n    @Override\n    public void islev(int deger) {\n        System.out.println(\"Bilgisayar: Değer alındı - \" + deger);\n    }\n}\nclass Tablet extends Cihaz {\n    @Override\n    public void islev(String mesaj) {\n        System.out.println(\"Tablet: Mesaj gösteriliyor - \" + mesaj);\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Bilgisayar pc = new Bilgisayar();\n        pc.islev();\n        pc.islev(42);\n\n        Cihaz cihaz = new Tablet();\n        cihaz.islev(\"Merhaba\");\n        cihaz.islev(100);\n        cihaz.islev(5, \"Veri gönderildi\");\n    }\n}",
            "output": "Bilgisayar: İşlem başlatılıyor.\nBilgisayar: Değer alındı - 42\nTablet: Mesaj gösteriliyor - Merhaba\nCihaz: Değer işleniyor - 100\nCihaz: 5 - Veri gönderildi",
            "a": "Her çağrı için iki soru: (1) <b>hangi imza?</b> (overload, derlemede, parametrelere göre) (2) <b>hangi sınıfın sürümü?</b> (override, çalışmada, gerçek tipe göre). <code>cihaz.islev(100)</code>: Tablet <code>islev(int)</code>'i override etmedi → Cihaz'ınki. <code>pc.islev()</code> sadece Bilgisayar'da var (yeni overload); <code>cihaz.islev()</code> yazılsaydı derleme hatası olurdu."
          },
          {
            "type": "write",
            "q": "<b>2022-23 vize S3 (a)</b>: Aşağıdaki programın çıktısını yazınız.",
            "given": "public class Demo {\n    Demo() {\n        this(5);\n        System.out.println(\"The Default constructor\");\n    }\n    Demo(int x) {\n        this(5, 15);\n        System.out.println(\"One-argument constructor\");\n        System.out.println(x);\n    }\n    Demo(int x, int y) {\n        System.out.println(\"Two-argument constructor\");\n        System.out.println(x * y);\n    }\n    public static void main(String args[]) {\n        new Demo();\n    }\n}",
            "output": "Two-argument constructor\n75\nOne-argument constructor\n5\nThe Default constructor",
            "a": "<code>this(…)</code> ilk satırda olduğu için önce çağrılan yapıcı <b>tamamen</b> biter, sonra kalan satırlar çalışır: en içteki (iki parametreli) önce yazar. Çıktı yapıcı çağrı sırasının <b>tersi</b>."
          },
          {
            "type": "write",
            "q": "<b>2022-23 vize S3 (b)</b>: Aşağıdaki programın çıktısını yazınız.",
            "given": "public class ParentTest {\n    public static void main(String arg[]) {\n        Child obj1 = new Child();\n        Child obj2 = new Child(10);\n    }\n}\nclass Parent {\n    Parent() {\n        System.out.println(\"Parent class default constructor\");\n    }\n    Parent(int x) {\n        System.out.println(\"Parent class one-argument constructor\");\n    }\n}\nclass Child extends Parent {\n    Child() {\n        System.out.println(\"Child class default constructor\");\n    }\n    Child(int x) {\n        super(x);\n        System.out.println(\"Child class one-argument constructor\");\n    }\n}",
            "output": "Parent class default constructor\nChild class default constructor\nParent class one-argument constructor\nChild class one-argument constructor",
            "a": "<code>Child()</code>'da super yazılmadı → derleyici <code>super()</code> ekler → Parent'ın <b>parametresiz</b> yapıcısı. <code>Child(10)</code> açıkça <code>super(x)</code> çağırır → Parent'ın <b>tek parametreli</b> yapıcısı. Her durumda önce üst sınıf."
          },
          {
            "type": "write",
            "q": "<b>Benzer soru (yeni)</b>: return ile finally. Çıktıyı yazınız.",
            "given": "public class Akis {\n    static int f(int n) {\n        try {\n            System.out.println(\"try \" + n);\n            if (n == 0) throw new ArithmeticException(\"sıfır\");\n            return 10 / n;\n        } catch (ArithmeticException e) {\n            System.out.println(\"catch \" + e.getMessage());\n            return -1;\n        } finally {\n            System.out.println(\"finally \" + n);\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println(f(2));\n        System.out.println(f(0));\n    }\n}",
            "output": "try 2\nfinally 2\n5\ntry 0\ncatch sıfır\nfinally 0\n-1",
            "a": "<code>return 10 / n</code> değeri <b>hesaplanır</b>, ama metot dönmeden önce finally çalışır; dönen değer sonra main'de yazılır. Bu yüzden \"finally 2\" satırı \"5\"ten <b>önce</b> gelir."
          }
        ]
      },
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
        "id": "hata-bulma",
        "title": "Hata bulma ve düzeltme",
        "en": "Find the Bug",
        "src": "2022-23, 2024-25, 2025-26 vizeleri",
        "minutes": 15,
        "blocks": [
          {
            "t": "p",
            "html": "Kodda hatalı satırlara tıklıyorsun; kontrol edince hangi satırların gerçekten hatalı olduğu, hatanın <b>derleme mi çalışma zamanı mı</b> olduğu, nedeni, düzeltilmiş kod ve çıktısı gelir. Buradaki her derleme hatası javac ile doğrulandı."
          },
          {
            "t": "table",
            "head": [
              "Hocanın favori hatası",
              "Tür"
            ],
            "rows": [
              [
                "Üst sınıfta sadece parametreli yapıcı var, alt sınıf <code>super(...)</code> çağırmıyor",
                "Derleme"
              ],
              [
                "Arayüz değişkenini değiştirmek (<code>counter++</code>): değişken final",
                "Derleme"
              ],
              [
                "void metotta <code>return değer;</code>",
                "Derleme"
              ],
              [
                "<code>i &lt;= dizi.length</code>",
                "Çalışma (ArrayIndexOutOfBounds)"
              ],
              [
                "Soyut sınıftan <code>new</code>; soyut metodu uygulamayan somut sınıf",
                "Derleme"
              ],
              [
                "static metottan instance alanına erişim",
                "Derleme"
              ],
              [
                "Kontrollü istisnayı bildirmemek; catch sırası",
                "Derleme"
              ]
            ]
          },
          {
            "t": "note",
            "kind": "exam",
            "html": "Sınavda istenen üç şey: <b>satır numarası</b>, <b>neden</b>, <b>düzeltilmiş kod (+ çıktısı)</b>. \"Super yok\" hatasında hoca <b>iki farklı çözüm</b> istiyor."
          }
        ],
        "checks": [
          {
            "type": "bug",
            "q": "<b>2025-26 vize S3</b>: Kodda yer alan hata veya hataları satır numarasıyla bulup nedenini açıklayınız. Düzeltilmiş kodu ve çıktısını yazınız.",
            "code": "interface Count {\n    short counter = 0;\n    void countUp();\n}\npublic class TestCount implements Count {\n    public static void main(String[] args) {\n        TestCount t = new TestCount();\n        t.countUp();\n    }\n    public void countUp() {\n        for (int x = 6; x > counter; x--, ++counter) {\n            System.out.println(\" \" + counter);\n        }\n    }\n}",
            "bugs": [
              11
            ],
            "explain": [
              {
                "line": 11,
                "kind": "Derleme",
                "text": "<code>++counter</code>: arayüzdeki <code>counter</code> otomatik <b>public static final</b>, yani sabit. Final değişkene atama yapılamaz (cannot assign a value to final variable)."
              },
              {
                "line": 2,
                "kind": "Not",
                "text": "(Kök neden) Arayüze değişken koymak onu sabit yapar. Hata 11'de raporlanır ama düzeltme burada: sayaç arayüzden çıkarılıp sınıfa alınmalı."
              }
            ],
            "fixed": "interface Count {\n    void countUp();\n}\npublic class TestCount implements Count {\n    private short counter = 0;          // sayaç artık sınıfın kendi (final olmayan) alanı\n\n    public static void main(String[] args) {\n        TestCount t = new TestCount();\n        t.countUp();\n    }\n    public void countUp() {\n        for (int x = 6; x > counter; x--, ++counter) {\n            System.out.println(\" \" + counter);\n        }\n    }\n}",
            "output": " 0\n 1\n 2",
            "a": "Döngü: x 6'dan azalır, counter 0'dan artar; x > counter oldukça yazar: (6,0) (5,1) (4,2) → (3,3)'te durur. Not: sınav kâğıdındaki “ ” kıvrık tırnaklar Word'den geliyor; gerçek dosyada onlar da derleme hatası olurdu, sınavda sayılmaz."
          },
          {
            "type": "bug",
            "q": "<b>2024-25 vize S4</b>: (a) print metodundaki derleme hatalarını düzeltin. (b) Program çalışınca <code>ArrayIndexOutOfBoundsException: 0 at Echo.print(Echo.java:7)</code> veriyor: hangi satır, neden? (c) Düzeltin.",
            "code": "public class Echo {\n    public static void main(String[] args) {\n        print(args);\n    }\n    static void print(String[] greetings) {\n        for (int i = 0; i <= greetings.length; i++) {\n            System.out.print(greetings[i] + \" \");\n        }\n        return true;\n    }\n}",
            "bugs": [
              6,
              9
            ],
            "explain": [
              {
                "line": 9,
                "kind": "Derleme",
                "text": "<code>return true;</code>: metot <code>void</code>, değer döndüremez. Çözüm: satırı sil (ya da dönüş tipini boolean yap)."
              },
              {
                "line": 6,
                "kind": "Çalışma",
                "text": "<code>i &lt;= greetings.length</code>: geçerli indeksler 0..length-1. Argümansız çalışınca length = 0, döngü yine de i = 0 ile girer → <code>greetings[0]</code>. Hata <b>7. satırda atılır</b> ama sebebi 6. satırdaki <code>&lt;=</code>; doğrusu <code>&lt;</code>."
              }
            ],
            "fixed": "public class Echo {\n    public static void main(String[] args) {\n        print(args);\n    }\n    static void print(String[] greetings) {\n        for (int i = 0; i < greetings.length; i++) {\n            System.out.print(greetings[i] + \" \");\n        }\n        System.out.println();\n    }\n}",
            "output": "Merhaba Dünya",
            "a": "Soru \"iki derleme hatası\" diyor; javac bu kodda yalnızca <code>return true</code> için hata verir. Hocanın ikinci saydığı muhtemelen dönüş tipi uyumsuzluğunun iki yüzü (void + değer döndürme). Kâğıtta ikisini de yaz: \"void metot değer döndüremez, return true silinmeli\"."
          },
          {
            "type": "bug",
            "q": "<b>2022-23 vize S4</b>: Kod bloğundaki hatayı bulup, giderilmesini sağlayacak <b>2 farklı çözümü</b> yazınız. <small>(Kâğıtta iki sınıf da public; tek dosyada derlenebilsin diye burada public kaldırıldı.)</small>",
            "code": "class Ogrenci {\n    public Ogrenci(String ad) {\n        System.out.println(\"Öğrenci sınıfından nesne oluşturmak için yapıcı metodu çağrıldı\");\n    }\n}\n\nclass DoktoraOgrenci extends Ogrenci {\n}",
            "bugs": [
              7
            ],
            "explain": [
              {
                "line": 7,
                "kind": "Derleme",
                "text": "DoktoraOgrenci'de yapıcı yok → derleyici varsayılan yapıcı ekler: <code>DoktoraOgrenci() { super(); }</code>. Ama Ogrenci'de <b>parametresiz yapıcı yok</b> (yapıcı yazıldığı için varsayılan eklenmedi) → \"constructor Ogrenci cannot be applied\"."
              }
            ],
            "fixed": "class Ogrenci {\n    // ÇÖZÜM 1: üst sınıfa parametresiz yapıcı ekle\n    public Ogrenci() {\n        System.out.println(\"Ogrenci()\");\n    }\n    public Ogrenci(String ad) {\n        System.out.println(\"Öğrenci sınıfından nesne oluşturmak için yapıcı metodu çağrıldı\");\n    }\n}\n\nclass DoktoraOgrenci extends Ogrenci {\n    // ÇÖZÜM 2: alt sınıfta yapıcı yazıp üst sınıfın parametreli yapıcısını açıkça çağır\n    public DoktoraOgrenci(String ad) {\n        super(ad);\n    }\n}\n\npublic class OgrenciTest {\n    public static void main(String[] args) {\n        new DoktoraOgrenci(\"Ayşe\");\n    }\n}",
            "output": "Öğrenci sınıfından nesne oluşturmak için yapıcı metodu çağrıldı",
            "a": "İki çözüm birbirinden bağımsız; biri yeterli. Sınavda ikisini ayrı ayrı yaz ve \"neden\" cümlesini ekle."
          },
          {
            "type": "bug",
            "q": "<b>Benzer soru (yeni)</b>: Derleme hatalarını satır numarasıyla bulunuz, nedenini açıklayınız.",
            "code": "abstract class Hayvan {\n    private String ad;\n    public Hayvan(String ad) { this.ad = ad; }\n    public abstract String ses();\n}\ninterface Evcil {\n    void oyna();\n}\nclass Kopek extends Hayvan implements Evcil {\n    public Kopek(String ad) { super(ad); }\n    public String ses() { return \"Hav\"; }\n    void oyna() { System.out.println(ad + \" top oynuyor\"); }\n}\nclass Kus extends Hayvan {\n    public Kus(String ad) { super(ad); }\n}\npublic class Zoo {\n    int ziyaretci = 0;\n    public static void main(String[] args) {\n        Hayvan h = new Hayvan(\"Genel\");\n        ziyaretci++;\n        Hayvan k = new Kopek(\"Karabaş\");\n        System.out.println(k.ses());\n    }\n}",
            "bugs": [
              12,
              14,
              20,
              21
            ],
            "explain": [
              {
                "line": 12,
                "kind": "Derleme",
                "text": "(1) Arayüz metodu <code>public</code>'tir; <code>void oyna()</code> erişimi daraltıyor. (2) <code>ad</code> Hayvan'da <b>private</b>, alt sınıftan erişilemez (getter gerekir)."
              },
              {
                "line": 14,
                "kind": "Derleme",
                "text": "Kus somut ama soyut <code>ses()</code>'i uygulamadı → ya uygulamalı ya da abstract olmalı."
              },
              {
                "line": 20,
                "kind": "Derleme",
                "text": "Soyut sınıftan <code>new</code> ile nesne oluşturulamaz."
              },
              {
                "line": 21,
                "kind": "Derleme",
                "text": "static <code>main</code> içinden instance değişkeni <code>ziyaretci</code>'ye erişilemez (static yap ya da nesne üzerinden eriş)."
              }
            ],
            "fixed": "abstract class Hayvan {\n    private String ad;\n    public Hayvan(String ad) { this.ad = ad; }\n    public String getAd() { return ad; }\n    public abstract String ses();\n}\ninterface Evcil {\n    void oyna();\n}\nclass Kopek extends Hayvan implements Evcil {\n    public Kopek(String ad) { super(ad); }\n    public String ses() { return \"Hav\"; }\n    public void oyna() { System.out.println(getAd() + \" top oynuyor\"); }\n}\nclass Kus extends Hayvan {\n    public Kus(String ad) { super(ad); }\n    public String ses() { return \"Cik\"; }\n}\npublic class Zoo {\n    static int ziyaretci = 0;\n    public static void main(String[] args) {\n        Hayvan h = new Kus(\"Maviş\");\n        ziyaretci++;\n        Hayvan k = new Kopek(\"Karabaş\");\n        System.out.println(k.ses());\n        ((Evcil) k).oyna();\n        System.out.println(h.ses() + \", ziyaretçi: \" + ziyaretci);\n    }\n}",
            "output": "Hav\nKarabaş top oynuyor\nCik, ziyaretçi: 1",
            "a": ""
          },
          {
            "type": "bug",
            "q": "<b>Benzer soru (yeni)</b>: İstisna kuralları. Derleme hatalarını bulunuz.",
            "code": "import java.io.File;\nimport java.util.Scanner;\n\nclass StokHatasi extends Exception {\n    public StokHatasi(String m) { super(m); }\n}\npublic class Depo {\n    static int stok = 5;\n    static void cek(int adet) {\n        if (adet > stok)\n            throw new StokHatasi(\"Yetersiz stok\");\n        stok -= adet;\n    }\n    public static void main(String[] args) {\n        try {\n            cek(10);\n            Scanner in = new Scanner(new File(\"stok.txt\"));\n        } catch (Exception e) {\n            System.out.println(\"Genel hata\");\n        } catch (StokHatasi e) {\n            System.out.println(e.getMessage());\n        }\n    }\n}",
            "bugs": [
              11,
              20
            ],
            "explain": [
              {
                "line": 11,
                "kind": "Derleme",
                "text": "StokHatasi <b>kontrollü</b> (Exception'dan türedi). Fırlatan metot <code>throws StokHatasi</code> ile bildirmeli (10. satırdaki başlığa eklenir) ya da yakalamalı."
              },
              {
                "line": 20,
                "kind": "Derleme",
                "text": "Üst sınıf <code>catch (Exception e)</code> önce yazıldığı için bu catch'e asla ulaşılamaz (already been caught). Alt sınıf istisnası <b>önce</b> yazılmalı."
              }
            ],
            "fixed": "import java.io.File;\nimport java.io.FileNotFoundException;\nimport java.util.Scanner;\n\nclass StokHatasi extends Exception {\n    public StokHatasi(String m) { super(m); }\n}\npublic class Depo {\n    static int stok = 5;\n    static void cek(int adet) throws StokHatasi {\n        if (adet > stok)\n            throw new StokHatasi(\"Yetersiz stok\");\n        stok -= adet;\n    }\n    public static void main(String[] args) {\n        try {\n            cek(10);\n            Scanner in = new Scanner(new File(\"stok.txt\"));\n        } catch (StokHatasi e) {\n            System.out.println(e.getMessage());\n        } catch (FileNotFoundException e) {\n            System.out.println(\"Dosya yok\");\n        }\n    }\n}",
            "output": "Yetersiz stok",
            "a": "Not: <code>new Scanner(new File(...))</code> FileNotFoundException (kontrollü) fırlatabilir; orijinalde <code>catch (Exception e)</code> onu da karşılıyordu. Düzeltmede ayrı catch ile yakaladık."
          }
        ]
      },
      {
        "id": "iskelet",
        "title": "İskelet tamamlama [B1]–[B21] (40 puanlık soru)",
        "en": "Skeleton Code",
        "src": "2025-26 vize S5 · 2024-25 S6 · 2022-23 S5",
        "minutes": 60,
        "blocks": [
          {
            "t": "p",
            "html": "2025 vizesinde hoca 40 puanlık soruyu hazır bir <b>kod iskeleti</b> verip <code>// [B1]</code> … <code>// [B21]</code> bloklarını doldurtarak sordu. Burada üç iskelet var: 2025'in kendisi, 2024 ve 2022'nin büyük soruları aynı formata çevrilmiş halleri."
          },
          {
            "t": "list",
            "ordered": true,
            "items": [
              "Önce <b>İstenilenler</b> listesini oku, her maddeyi bir bloğa eşle.",
              "Sınıf başlığındaki bloklar (<code>class Light [B3]</code>) neredeyse her zaman <code>extends … implements …</code>.",
              "Alt sınıfın yapıcısı: <code>super(...)</code> <b>ilk satır</b>, sonra kendi alanı.",
              "\"Yalnızca getter ile erişilsin\" → <code>private</code> (+ final) alan, getter var, <b>setter yok</b>.",
              "Yönetici sınıf: <code>private ArrayList&lt;ÜstTip&gt;</code>, ekleme metodu (iş kuralı varsa önce kontrol), listeleme döngüsü.",
              "main: nesneleri üst tip üzerinden oluştur/ekle, sonra listele."
            ]
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Bloğa yazdığın kod model cevapla birebir aynı olmak zorunda değil. Kontrol boşluğu, <code>@Override</code>'u ve sondaki <code>;</code>'yi önemsemez. Değişken adın farklıysa model cevapla karşılaştırıp \"aynı anlamda\" diyebilirsin. Sekme (Tab) tuşu kutuda girinti ekler."
          }
        ],
        "checks": [
          {
            "type": "skeleton",
            "q": "<b>2025-26 vize S5 (40p)</b>: Aşağıdaki kod iskeletinde bazı kısımlar eksik bırakılmıştır. Kodu tamamlayarak belirtilen özellikleri sağlayan çalışır bir program haline getiriniz.",
            "req": [
              "Device soyut sınıfında getStatus() metodu soyut olarak tanımlanmalıdır.",
              "Light ve Thermostat sınıfları Device'den <b>türetilmeli</b> ve getStatus() metodunu <b>override</b> etmelidir.",
              "Her iki sınıf da Controllable arayüzünü <b>implemente etmeli</b> ve display() metodunu override etmelidir.",
              "Light'ta brightness, Thermostat'ta temperature alanları <b>encapsulation</b> ilkesine uygun tanımlanmalıdır.",
              "Bu alanlar constructor içinde atanmalı ve yalnızca <b>getter</b> metoduyla erişilmelidir.",
              "DeviceManager bir ArrayList&lt;Device&gt; içerir; cihaz <b>ekleme</b> ve <b>listeleme</b> yapar.",
              "Polymorphism sayesinde DeviceManager hem Light hem Thermostat nesnelerini saklayabilmelidir.",
              "Çıktıda her cihazın detay bilgisi yazdırılmalıdır."
            ],
            "code": "import java.util.ArrayList;   // kâğıtta DeviceManager'ın üstündeydi; Java'da dosyanın başında olmalı\n\n// 1. Soyut sınıf Device\nabstract class Device {\n    private String name;\n\n    public Device(String name) {\n        this.name = name;\n    }\n\n    public String getName() { return name; }\n\n    ⟦0⟧\n}\n\n// 2. Interface Controllable\ninterface Controllable {\n    ⟦1⟧\n}\n\n// 3. Light sınıfı\nclass Light ⟦2⟧ {\n    ⟦3⟧\n    ⟦4⟧\n    ⟦5⟧\n    ⟦6⟧\n    ⟦7⟧\n}\n\n// 4. Thermostat sınıfı\nclass Thermostat ⟦8⟧ {\n    ⟦9⟧\n    ⟦10⟧\n    ⟦11⟧\n    ⟦12⟧\n    ⟦13⟧\n}\n\n// 5. DeviceManager sınıfı\nclass DeviceManager {\n    ⟦14⟧\n    ⟦15⟧\n    ⟦16⟧\n}\n\n// 6. Test sınıfı\npublic class SmartHomeTest {\n    public static void main(String[] args) {\n        ⟦17⟧\n        ⟦18⟧\n        ⟦19⟧\n        ⟦20⟧\n    }\n}",
            "blanks": [
              {
                "model": "public abstract String getStatus();",
                "answers": [
                  "abstract public String getStatus();",
                  "abstract String getStatus();"
                ],
                "note": "Gövde yok, noktalı virgül var."
              },
              {
                "model": "void display();",
                "answers": [
                  "public void display();",
                  "public abstract void display();",
                  "abstract void display();"
                ],
                "note": "Arayüz metodu otomatik public abstract."
              },
              {
                "model": "extends Device implements Controllable",
                "note": "Sıra: önce extends, sonra implements."
              },
              {
                "model": "private final int brightness;",
                "answers": [
                  "private int brightness;"
                ],
                "note": "private = encapsulation; final + setter yok = sadece okunur (read-only)."
              },
              {
                "model": "public Light(String name, int brightness) {\n    super(name);\n    this.brightness = brightness;\n}",
                "note": "name Device'te private → super(name) ile üst yapıcıya iletilir; ilk satır olmalı."
              },
              {
                "model": "public int getBrightness() { return brightness; }",
                "answers": [
                  "public int getBrightness() {\n    return brightness;\n}"
                ],
                "note": "Sadece getter; setter YOK (istenen: yalnızca getter ile erişim)."
              },
              {
                "model": "@Override\npublic String getStatus() {\n    return getName() + \" ışığı, parlaklık: %\" + brightness;\n}",
                "note": "name'e getName() ile erişilir (private)."
              },
              {
                "model": "@Override\npublic void display() {\n    System.out.println(\"[Light] \" + getStatus());\n}",
                "note": "public zorunlu (arayüz metodu)."
              },
              {
                "model": "extends Device implements Controllable"
              },
              {
                "model": "private final double temperature;",
                "answers": [
                  "private double temperature;"
                ]
              },
              {
                "model": "public Thermostat(String name, double temperature) {\n    super(name);\n    this.temperature = temperature;\n}"
              },
              {
                "model": "public double getTemperature() { return temperature; }",
                "answers": [
                  "public double getTemperature() {\n    return temperature;\n}"
                ]
              },
              {
                "model": "@Override\npublic String getStatus() {\n    return getName() + \" termostatı, sıcaklık: \" + temperature + \"°C\";\n}"
              },
              {
                "model": "@Override\npublic void display() {\n    System.out.println(\"[Thermostat] \" + getStatus());\n}"
              },
              {
                "model": "private ArrayList<Device> devices = new ArrayList<>();",
                "answers": [
                  "private ArrayList<Device> devices = new ArrayList<Device>();",
                  "ArrayList<Device> devices = new ArrayList<>();"
                ],
                "note": "Tip Device: polimorfizm sayesinde Light da Thermostat da girer."
              },
              {
                "model": "public void addDevice(Device d) {\n    devices.add(d);\n}"
              },
              {
                "model": "public void listDevices() {\n    for (Device d : devices) {\n        if (d instanceof Controllable)\n            ((Controllable) d).display();\n        else\n            System.out.println(d.getStatus());\n    }\n}",
                "note": "Device tipinde display() yok → Controllable'a cast gerekir. Daha basit kabul edilen hali: <code>System.out.println(d.getStatus());</code> (dinamik bağlama)."
              },
              {
                "model": "DeviceManager manager = new DeviceManager();"
              },
              {
                "model": "manager.addDevice(new Light(\"Salon\", 80));"
              },
              {
                "model": "manager.addDevice(new Thermostat(\"Yatak odası\", 22.5));"
              },
              {
                "model": "manager.listDevices();"
              }
            ],
            "output": "[Light] Salon ışığı, parlaklık: %80\n[Thermostat] Yatak odası termostatı, sıcaklık: 22.5°C",
            "a": "Puanı getiren kritik noktalar: <code>abstract</code> metot (B1), <code>extends … implements</code> (B3/B9), <code>private</code> + yalnızca getter (B4/B6), yapıcıda <code>super(name)</code> (B5/B11), <code>ArrayList&lt;Device&gt;</code> (B15), listede polimorfik dolaşma (B17)."
          },
          {
            "type": "skeleton",
            "q": "<b>2024-25 vize S6 (40p) iskelet hali</b>: \"Akıllı Cihazlar Yönetim Sistemi\". Sınavda sıfırdan tasarlattı; burada aynı tasarım hocanın 2025 formatında [Bn] bloklarıyla. Önce kendin boş kâğıtta tasarlamayı dene.",
            "req": [
              "AkilliCihaz → AkilliLamba, AkilliTermostat; GiyilebilirCihaz → AkilliSaat, AkilliGozluk.",
              "<b>Giyilebilir cihazların tamamı</b> telefonla kontrol edilebilir; akıllı cihazların <b>bazıları</b> (termostat evet, lamba hayır: gün ışığına göre ayarlar).",
              "Cihaz: cihazID, cihazAdi, fiyat; ac(), kapat(), enerjiTuketimi(), durumGoster().",
              "<b>İş kuralı</b>: KisiselTelefon.cihazEkle → cihaz <b>telefonla kontrol edilebiliyorsa</b> eklensin.",
              "Tüm cihazların <b>fiyatı</b> karşılaştırılabilir (Comparable) olmalı.",
              "Main'de polimorfizm kullanılmalı."
            ],
            "code": "import java.util.ArrayList;\nimport java.util.Collections;\n\n// Telefonla kontrol edilebilmek bir YETENEK → arayüz\ninterface TelefonIleKontrol {\n    ⟦0⟧\n}\n\n// Ortak alanlar + yapıcı var, nesnesi olmamalı → soyut sınıf\nabstract class Cihaz ⟦1⟧ {\n    private int cihazID;\n    private String cihazAdi;\n    private double fiyat;\n    protected boolean acik;\n\n    public Cihaz(int cihazID, String cihazAdi, double fiyat) {\n        ⟦2⟧\n    }\n\n    public String getCihazAdi() { return cihazAdi; }\n    public double getFiyat() { return fiyat; }\n    public void ac() { acik = true; }\n    public void kapat() { acik = false; }\n\n    ⟦3⟧\n\n    public void durumGoster() {\n        System.out.println(cihazID + \" \" + cihazAdi + \" (\" + fiyat + \" TL) \"\n            + (acik ? \"açık\" : \"kapalı\") + \", \" + enerjiTuketimi() + \" W\");\n    }\n\n    @Override\n    public int compareTo(Cihaz diger) {\n        ⟦4⟧\n    }\n}\n\nabstract class AkilliCihaz extends Cihaz {\n    public AkilliCihaz(int id, String ad, double fiyat) {\n        ⟦5⟧\n    }\n}\n\n// Giyilebilirlerin HEPSİ telefonla kontrol edilir → arayüzü üst sınıf uygular\nabstract class GiyilebilirCihaz extends Cihaz ⟦6⟧ {\n    public GiyilebilirCihaz(int id, String ad, double fiyat) { super(id, ad, fiyat); }\n\n    @Override\n    public void telefondanKontrol() {\n        System.out.println(getCihazAdi() + \" telefondan kontrol ediliyor\");\n    }\n}\n\nclass AkilliLamba extends AkilliCihaz {            // telefonla kontrol EDİLEMEZ\n    public AkilliLamba(int id, String ad, double fiyat) { super(id, ad, fiyat); }\n    public void gunIsiginaGoreAyarla() { System.out.println(getCihazAdi() + \" gün ışığına göre ayarlandı\"); }\n    @Override\n    public double enerjiTuketimi() { return acik ? 9 : 0; }\n}\n\nclass AkilliTermostat ⟦7⟧ {\n    public AkilliTermostat(int id, String ad, double fiyat) { super(id, ad, fiyat); }\n    ⟦8⟧\n    @Override\n    public double enerjiTuketimi() { return acik ? 1500 : 0; }\n}\n\nclass AkilliSaat extends GiyilebilirCihaz {\n    public AkilliSaat(int id, String ad, double fiyat) { super(id, ad, fiyat); }\n    @Override\n    public double enerjiTuketimi() { return acik ? 0.5 : 0; }\n}\n\nclass AkilliGozluk extends GiyilebilirCihaz {\n    public AkilliGozluk(int id, String ad, double fiyat) { super(id, ad, fiyat); }\n    @Override\n    public double enerjiTuketimi() { return acik ? 2 : 0; }\n}\n\nclass KisiselTelefon {\n    ⟦9⟧\n\n    // İŞ KURALI: yalnızca telefonla kontrol edilebilen cihaz eklenir\n    public boolean cihazEkle(Cihaz c) {\n        ⟦10⟧\n    }\n\n    public void hepsiniGoster() {\n        Collections.sort(cihazlar);              // compareTo → fiyata göre\n        for (Cihaz c : cihazlar) {\n            ⟦11⟧\n        }\n    }\n}\n\npublic class AkilliCihazTest {\n    public static void main(String[] args) {\n        KisiselTelefon tel = new KisiselTelefon();\n        Cihaz[] hepsi = {                         // polimorfizm: üst tip dizisi\n            new AkilliLamba(1, \"Lamba\", 450),\n            new AkilliGozluk(4, \"Gözlük\", 12000),\n            new AkilliTermostat(2, \"Termostat\", 3200),\n            new AkilliSaat(3, \"Saat\", 5400)\n        };\n        for (Cihaz c : hepsi) {\n            c.ac();\n            System.out.println(c.getCihazAdi() + (tel.cihazEkle(c) ? \" eklendi\" : \" eklenemedi: telefonla kontrol edilemez\"));\n        }\n        tel.hepsiniGoster();\n    }\n}",
            "blanks": [
              {
                "model": "void telefondanKontrol();",
                "answers": [
                  "public void telefondanKontrol();",
                  "public abstract void telefondanKontrol();"
                ]
              },
              {
                "model": "implements Comparable<Cihaz>",
                "note": "Fiyat karşılaştırması tüm cihazlar için → en üst sınıfta."
              },
              {
                "model": "this.cihazID = cihazID;\nthis.cihazAdi = cihazAdi;\nthis.fiyat = fiyat;"
              },
              {
                "model": "public abstract double enerjiTuketimi();",
                "answers": [
                  "abstract public double enerjiTuketimi();"
                ],
                "note": "Her cihaz farklı tüketir → soyut; alt sınıflar zorunlu override eder."
              },
              {
                "model": "return Double.compare(this.fiyat, diger.fiyat);",
                "answers": [
                  "return Double.compare(fiyat, diger.fiyat);",
                  "return Double.compare(getFiyat(), diger.getFiyat());",
                  "return Double.compare(this.getFiyat(), diger.getFiyat());"
                ],
                "note": "<code>(int)(fiyat - diger.fiyat)</code> da çoğu durumda çalışır ama 0.5 gibi farkları 0'a yuvarlar."
              },
              {
                "model": "super(id, ad, fiyat);"
              },
              {
                "model": "implements TelefonIleKontrol"
              },
              {
                "model": "extends AkilliCihaz implements TelefonIleKontrol",
                "note": "Termostat akıllı cihazlardan telefonla kontrol edilebilen → arayüzü kendisi uygular. Lamba uygulamaz."
              },
              {
                "model": "@Override\npublic void telefondanKontrol() {\n    System.out.println(getCihazAdi() + \" telefondan kontrol ediliyor\");\n}"
              },
              {
                "model": "private ArrayList<Cihaz> cihazlar = new ArrayList<>();",
                "answers": [
                  "private ArrayList<Cihaz> cihazlar = new ArrayList<Cihaz>();",
                  "ArrayList<Cihaz> cihazlar = new ArrayList<>();"
                ]
              },
              {
                "model": "if (c instanceof TelefonIleKontrol) {\n    cihazlar.add(c);\n    return true;\n}\nreturn false;",
                "note": "İş kuralının kalbi: <code>instanceof</code> arayüzle çalışır."
              },
              {
                "model": "c.durumGoster();",
                "note": "Polimorfizm: durumGoster içindeki enerjiTuketimi() her nesnenin kendi sürümü."
              }
            ],
            "output": "Lamba eklenemedi: telefonla kontrol edilemez\nGözlük eklendi\nTermostat eklendi\nSaat eklendi\n2 Termostat (3200.0 TL) açık, 1500.0 W\n3 Saat (5400.0 TL) açık, 0.5 W\n4 Gözlük (12000.0 TL) açık, 2.0 W",
            "a": "Tasarım kararları (sınavda gerekçesini yazmak puan getirir): Cihaz <b>soyut sınıf</b> (ortak alan + yapıcı, nesnesi anlamsız), TelefonIleKontrol <b>arayüz</b> (sadece bazı cihazların yeteneği), Comparable <b>en üstte</b> (tüm cihazlar fiyatla karşılaştırılır). Giyilebilirlerin tamamı kontrol edildiği için arayüzü GiyilebilirCihaz uygular; akıllı cihazlarda sadece termostat."
          },
          {
            "type": "skeleton",
            "q": "<b>2022-23 vize S5 (45p) iskelet hali</b>: Vasıta / Otonom / Şoför. Sınavda sıfırdan tasarlattı; iş kurallarına (hız sınırı, şoför kontrolü) dikkat.",
            "req": [
              "Genel bir Vasıta nesnesi <b>oluşturulamamalı</b>; davranışlar hizlan() ve fren().",
              "Araba: hizlan → \"Araba Hızlanıyor\", +20; fren → \"Araba Yavaşlıyor\", −20; <b>hız 0–180</b>.",
              "Drone: ±5, <b>hız 0–90</b>. Drone aynı zamanda <b>otonom</b>: otonomHareket() → \"Drone otonom uçabiliyor\".",
              "ElektrikliSuperge otonom özelliğini alır: \"Kendi süpürebiliyor\".",
              "Araba ve Drone <b>hızlarına göre</b> karşılaştırılabilir (Comparable).",
              "<b>İş kuralı</b>: Arabaya şoför ata; önceden atanmışsa kontrol et; şoför değiştirme metodu; <b>aynı şoför tekrar atanmaya çalışılırsa</b> engelle.",
              "Test sınıfında polimorfizm."
            ],
            "code": "import java.util.ArrayList;\n\nabstract class Vasita ⟦0⟧ {\n    private int hiz;\n    private final int maxHiz;\n\n    public Vasita(int maxHiz) { this.maxHiz = maxHiz; }\n\n    public int getHiz() { return hiz; }\n\n    // İŞ KURALI: hız 0 ile maxHiz arasında kalmalı\n    protected void hizDegistir(int fark) {\n        ⟦1⟧\n    }\n\n    ⟦2⟧\n\n    @Override\n    public int compareTo(Vasita diger) {\n        return Integer.compare(this.hiz, diger.hiz);\n    }\n}\n\ninterface Otonom {\n    ⟦3⟧\n}\n\nclass Sofor {\n    private String ad;\n    public Sofor(String ad) { this.ad = ad; }\n    public String getAd() { return ad; }\n}\n\nclass Araba extends Vasita {\n    private Sofor sofor;\n\n    public Araba() {\n        ⟦4⟧\n    }\n\n    @Override\n    public void hizlan() { System.out.println(\"Araba Hızlanıyor\"); hizDegistir(20); }\n    @Override\n    public void fren() { System.out.println(\"Araba Yavaşlıyor\"); hizDegistir(-20); }\n\n    // İŞ KURALI: atanmışsa uyar; aynı şoför tekrar atanamaz\n    public void soforAta(Sofor s) {\n        ⟦5⟧\n    }\n\n    public void soforDegistir(Sofor yeni) {\n        ⟦6⟧\n    }\n}\n\nclass Drone ⟦7⟧ {\n    public Drone() { super(90); }\n    @Override\n    public void hizlan() { System.out.println(\"Drone Hızlanıyor\"); hizDegistir(5); }\n    @Override\n    public void fren() { System.out.println(\"Drone Yavaşlıyor\"); hizDegistir(-5); }\n    ⟦8⟧\n}\n\nclass ElektrikliSuperge implements Otonom {\n    ⟦9⟧\n}\n\npublic class VasitaTest {\n    public static void main(String[] args) {\n        ArrayList<Vasita> vasitalar = new ArrayList<>();\n        Araba araba = new Araba();\n        Drone drone = new Drone();\n        vasitalar.add(araba);\n        vasitalar.add(drone);\n\n        for (Vasita v : vasitalar) {               // polimorfizm\n            v.hizlan();\n            v.hizlan();\n        }\n        araba.fren(); araba.fren(); araba.fren();    // 40 → 20 → 0 → 0 (alt sınır)\n        araba.hizlan();\n\n        ⟦10⟧\n\n        System.out.println(araba.compareTo(drone) > 0 ? \"Araba daha hızlı\" : \"Drone daha hızlı ya da eşit\");\n\n        Sofor ali = new Sofor(\"Ali\"), ayse = new Sofor(\"Ayşe\");\n        araba.soforAta(ali);\n        araba.soforAta(ali);\n        araba.soforAta(ayse);\n        araba.soforDegistir(ayse);\n        araba.soforDegistir(ayse);\n    }\n}",
            "blanks": [
              {
                "model": "implements Comparable<Vasita>",
                "note": "Hem Araba hem Drone karşılaştırılacak → ortak üst sınıfta. Araba ile Drone birbiriyle de karşılaştırılabilir."
              },
              {
                "model": "hiz += fark;\nif (hiz > maxHiz) hiz = maxHiz;\nif (hiz < 0) hiz = 0;",
                "answers": [
                  "hiz = Math.max(0, Math.min(maxHiz, hiz + fark));"
                ]
              },
              {
                "model": "public abstract void hizlan();\npublic abstract void fren();",
                "note": "Vasıta soyut: \"genel bir vasıta nesnesi oluşturulamamalı\"."
              },
              {
                "model": "void otonomHareket();",
                "answers": [
                  "public void otonomHareket();",
                  "public abstract void otonomHareket();"
                ]
              },
              {
                "model": "super(180);",
                "note": "maxHiz üst sınıfta, yapıcıyla iletilir."
              },
              {
                "model": "if (sofor == null) {\n    sofor = s;\n    System.out.println(s.getAd() + \" arabaya atandı\");\n} else if (sofor == s) {\n    System.out.println(s.getAd() + \" zaten bu arabanın şoförü\");\n} else {\n    System.out.println(\"Arabanın şoförü var: \" + sofor.getAd() + \" (soforDegistir kullanın)\");\n}"
              },
              {
                "model": "if (sofor == yeni) {\n    System.out.println(yeni.getAd() + \" zaten şoför, değişiklik yok\");\n} else {\n    sofor = yeni;\n    System.out.println(\"Şoför değişti: \" + yeni.getAd());\n}"
              },
              {
                "model": "extends Vasita implements Otonom"
              },
              {
                "model": "@Override\npublic void otonomHareket() {\n    System.out.println(\"Drone otonom uçabiliyor\");\n}"
              },
              {
                "model": "@Override\npublic void otonomHareket() {\n    System.out.println(\"Kendi süpürebiliyor\");\n}"
              },
              {
                "model": "Otonom[] otonomlar = { drone, new ElektrikliSuperge() };\nfor (Otonom o : otonomlar)\n    o.otonomHareket();",
                "note": "Arayüz tipinde dizi: birbiriyle alakasız Drone ve süpürge aynı yetenek üzerinden kullanılır."
              }
            ],
            "output": "Araba Hızlanıyor\nAraba Hızlanıyor\nDrone Hızlanıyor\nDrone Hızlanıyor\nAraba Yavaşlıyor\nAraba Yavaşlıyor\nAraba Yavaşlıyor\nAraba Hızlanıyor\nDrone otonom uçabiliyor\nKendi süpürebiliyor\nAraba daha hızlı\nAli arabaya atandı\nAli zaten bu arabanın şoförü\nArabanın şoförü var: Ali (soforDegistir kullanın)\nŞoför değişti: Ayşe\nAyşe zaten şoför, değişiklik yok",
            "a": "Neden böyle? Vasıta <b>soyut sınıf</b> (ortak hız alanı + sınır mantığı + \"nesnesi oluşturulamamalı\"), Otonom <b>arayüz</b> (Drone bir Vasıta, süpürge değil; ortak olan sadece yetenek). Hız sınırı tek yerde (hizDegistir) kontrol edilir; alt sınıflar private hiz'e dokunamaz."
          }
        ]
      },
      {
        "id": "arka-sayfa",
        "title": "Sıfırdan yazma problemleri (2022 Yarışma dahil)",
        "en": "Write the Code",
        "src": "Tüm vize konuları",
        "minutes": 60,
        "blocks": [
          {
            "t": "p",
            "html": "Sınavın arka sayfasında bir problem verilir ve kodunun tamamını yazman istenir. Burada 7 problem var; her biri birkaç konuyu birleştirir. <b>Önce kutuya (ya da kâğıda) kendin yaz</b>, sonra model çözümü aç ve \"Hoca neye bakar?\" listesiyle kendini puanla. Yazdıkların bu tarayıcıda saklanır."
          },
          {
            "t": "h",
            "text": "Kâğıda kod yazarken puan kaybettiren şeyler"
          },
          {
            "t": "list",
            "items": [
              "Yapıcıya dönüş tipi yazmak (<code>public void Daire(...)</code>)",
              "<code>throw</code> ile <code>throws</code>'u karıştırmak; kontrollü istisnayı bildirmemek",
              "Alt sınıfta <code>super(...)</code>'ı ilk satıra koymamak ya da üst sınıfın private alanına doğrudan erişmek",
              "<code>ArrayList&lt;int&gt;</code> yazmak; dizide <code>length()</code>, ArrayList'te <code>length</code> kullanmak",
              "Tam sayı bölmesi: ortalamayı <code>(double)</code> yapmamak",
              "toString imzasını yanlış yazmak (<code>public String toString()</code>)",
              "import'ları unutmak (Scanner, ArrayList, java.io)"
            ]
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Önce <b>sınıf iskeletini</b> yaz (alanlar, yapıcı, metot başlıkları), sonra gövdeleri doldur. Zaman yetmezse iskelet ve doğru başlıklar bile puan getirir."
          }
        ],
        "checks": [
          {
            "type": "write",
            "q": "<b>2022-23 vize S6</b>: Yarisma sınıfı, takımların puanlarını tutan bir <code>ArrayList&lt;Integer&gt;</code> içersin; <code>puanEkle</code> ile puan eklensin. Eklenmek istenen puan <b>Integer değilse TypeError</b>, <b>10'dan büyük veya 0'dan küçükse ValueError</b> fırlatsın. Kendi Exception sınıflarınızı yazın; hatayı yakalayıp şu biçimde mesaj verin: <code>TypeError: 6.25 puan olarak eklenemez.</code> · <code>ValueError: 14 not olarak eklenemez.</code>",
            "rubric": [
              "İki özel istisna <code>extends Exception</code>, yapıcıda <code>super(mesaj)</code>",
              "puanEkle parametresi <code>Object</code> (ya da double): yoksa 6.25 hiç gönderilemez",
              "<code>instanceof Integer</code> kontrolü",
              "Aralık kontrolü <code>p &lt; 0 || p &gt; 10</code>",
              "Metot başlığında <code>throws TypeError, ValueError</code>",
              "try-catch döngü içinde; mesaj <code>System.out.println(e)</code> ile \"Sınıf: mesaj\" biçiminde",
              "Alan <code>private</code> (encapsulation)"
            ],
            "solution": "import java.util.ArrayList;\n\nclass TypeError extends Exception {\n    public TypeError(String mesaj) { super(mesaj); }\n}\n\nclass ValueError extends Exception {\n    public ValueError(String mesaj) { super(mesaj); }\n}\n\nclass Yarisma {\n    private ArrayList<Integer> puanlar = new ArrayList<>();\n\n    // Object alır: Integer olmayan değer (6.25 gibi) de gönderilebilsin diye\n    public void puanEkle(Object puan) throws TypeError, ValueError {\n        if (!(puan instanceof Integer))\n            throw new TypeError(puan + \" puan olarak eklenemez.\");\n        int p = (Integer) puan;                          // unboxing\n        if (p < 0 || p > 10)\n            throw new ValueError(p + \" not olarak eklenemez.\");\n        puanlar.add(p);                                  // autoboxing\n    }\n\n    public ArrayList<Integer> getPuanlar() { return puanlar; }\n}\n\npublic class YarismaTest {\n    public static void main(String[] args) {\n        Yarisma y = new Yarisma();\n        Object[] denemeler = {7, 6.25, 14, 10};\n        for (Object d : denemeler) {\n            try {\n                y.puanEkle(d);\n                System.out.println(d + \" eklendi\");\n            } catch (TypeError e) {\n                System.out.println(e);       // Throwable.toString → \"TypeError: mesaj\"\n            } catch (ValueError e) {\n                System.out.println(e);\n            }\n        }\n        System.out.println(\"Puanlar: \" + y.getPuanlar());\n    }\n}",
            "output": "7 eklendi\nTypeError: 6.25 puan olarak eklenemez.\nValueError: 14 not olarak eklenemez.\n10 eklendi\nPuanlar: [7, 10]",
            "a": "Kâğıttaki metin hem \"0–10\" hem \"0–100\" diyor; ifadeyi takip ettik (0–10). <code>System.out.println(e)</code> istisnanın toString'ini çağırır: paketsiz sınıfta <b>\"SınıfAdı: mesaj\"</b>, tam olarak istenen biçim. \"Ogrenci sınıfı…\" cümlesi sorunun eski bir sürümünden kalmış."
          },
          {
            "type": "write",
            "q": "<b>BankaHesabi</b> sınıfını yazınız: private <code>hesapNo</code> (int), <code>sahip</code> (String), <code>bakiye</code> (double); parametreli yapıcı; bakiye için getter. <code>paraYatir(double)</code> pozitif olmayan miktarda, <code>paraCek(double)</code> bakiyeden fazla miktarda <code>IllegalArgumentException</code> fırlatsın. toString'i override edin. main'de 1000 bakiyeli hesap açıp 500 yatırın, 2000 çekmeyi deneyin; hatayı yakalayıp mesajını yazdırın, son durumu yazdırın.",
            "rubric": [
              "Alanlar <code>private</code>",
              "Yapıcıda dönüş tipi yok, <code>this.alan = parametre</code>",
              "Fırlatmada <code>throw new …(mesaj)</code> (throws değil)",
              "Kontrol main'de <code>try-catch</code> ile, mesaj <code>e.getMessage()</code>",
              "<code>@Override public String toString()</code>",
              "Hatalı işlemde bakiye değişmiyor"
            ],
            "solution": "public class BankaTest {\n    public static void main(String[] args) {\n        BankaHesabi h = new BankaHesabi(1001, \"Ayşe\", 1000);\n        h.paraYatir(500);\n        try {\n            h.paraCek(2000);\n            System.out.println(\"Para çekildi\");      // istisna olursa çalışmaz\n        } catch (IllegalArgumentException e) {\n            System.out.println(\"Hata: \" + e.getMessage());\n        }\n        System.out.println(h);\n    }\n}\n\nclass BankaHesabi {\n    private int hesapNo;\n    private String sahip;\n    private double bakiye;\n\n    public BankaHesabi(int hesapNo, String sahip, double bakiye) {\n        this.hesapNo = hesapNo;\n        this.sahip = sahip;\n        this.bakiye = bakiye;\n    }\n\n    public double getBakiye() {\n        return bakiye;\n    }\n\n    public void paraYatir(double miktar) {\n        if (miktar <= 0)\n            throw new IllegalArgumentException(\"Miktar pozitif olmalı\");\n        bakiye += miktar;\n    }\n\n    public void paraCek(double miktar) {\n        if (miktar > bakiye)\n            throw new IllegalArgumentException(\"Yetersiz bakiye: \" + bakiye);\n        bakiye -= miktar;\n    }\n\n    @Override\n    public String toString() {\n        return hesapNo + \" - \" + sahip + \" - bakiye: \" + bakiye;\n    }\n}",
            "a": "IllegalArgumentException kontrolsüz (RuntimeException) olduğu için metotlarda <code>throws</code> zorunlu değil; yazsan da hata olmaz.",
            "output": "Hata: Yetersiz bakiye: 1500.0\n1001 - Ayşe - bakiye: 1500.0"
          },
          {
            "type": "write",
            "q": "<b>Sekil</b> sınıfı: private <code>renk</code>, yapıcı, <code>getAlan()</code> 0 döndürsün, toString renk ve alanı versin. <b>Daire</b> (yaricap) ve <b>Dikdortgen</b> (en, boy) Sekil'den türesin; yapıcılarında <code>super(renk)</code> çağırsın, getAlan'ı override etsin, toString'de <code>super.toString()</code>'i kullansın. main'de bir <b>Sekil dizisine</b> 2 daire ve 1 dikdörtgen koyup her şekli ve toplam alanı yazdırın.",
            "rubric": [
              "<code>class Daire extends Sekil</code>",
              "Alt sınıf yapıcısının <b>ilk satırı</b> <code>super(renk)</code>",
              "getAlan imzası üst sınıftakiyle birebir aynı (+ @Override)",
              "Dizi tipi <code>Sekil[]</code>; döngüde cast yok (dinamik bağlama)",
              "toString'de <code>super.toString()</code>",
              "private <code>renk</code>'e alt sınıftan doğrudan erişilmiyor"
            ],
            "solution": "public class SekilTest {\n    public static void main(String[] args) {\n        Sekil[] sekiller = {\n            new Daire(\"kırmızı\", 1),\n            new Dikdortgen(\"mavi\", 2, 3),\n            new Daire(\"yeşil\", 2)\n        };\n        double toplam = 0;\n        for (Sekil s : sekiller) {\n            System.out.println(s);          // hangi toString? → gerçek tip\n            toplam += s.getAlan();          // hangi getAlan? → gerçek tip\n        }\n        System.out.println(\"Toplam alan: \" + Math.round(toplam * 100) / 100.0);\n    }\n}\n\nclass Sekil {\n    private String renk;\n\n    public Sekil(String renk) {\n        this.renk = renk;\n    }\n\n    public double getAlan() {\n        return 0;\n    }\n\n    @Override\n    public String toString() {\n        return \"renk: \" + renk + \", alan: \" + Math.round(getAlan() * 100) / 100.0;\n    }\n}\n\nclass Daire extends Sekil {\n    private double yaricap;\n\n    public Daire(String renk, double yaricap) {\n        super(renk);\n        this.yaricap = yaricap;\n    }\n\n    @Override\n    public double getAlan() {\n        return Math.PI * yaricap * yaricap;\n    }\n\n    @Override\n    public String toString() {\n        return \"Daire [\" + super.toString() + \"]\";\n    }\n}\n\nclass Dikdortgen extends Sekil {\n    private double en, boy;\n\n    public Dikdortgen(String renk, double en, double boy) {\n        super(renk);\n        this.en = en;\n        this.boy = boy;\n    }\n\n    @Override\n    public double getAlan() {\n        return en * boy;\n    }\n\n    @Override\n    public String toString() {\n        return \"Dikdörtgen [\" + super.toString() + \"]\";\n    }\n}",
            "a": "İnce nokta: Sekil.toString içindeki <code>getAlan()</code> çağrısı da dinamik bağlanır; Daire nesnesi için Daire.getAlan çalışır, bu yüzden alan 0 yazmaz.",
            "output": "Daire [renk: kırmızı, alan: 3.14]\nDikdörtgen [renk: mavi, alan: 6.0]\nDaire [renk: yeşil, alan: 12.57]\nToplam alan: 21.71"
          },
          {
            "type": "write",
            "q": "<b>Ogrenci</b> sınıfı: <b>static</b> bir sayaç sayesinde her yeni öğrenciye otomatik artan numara (1, 2, 3…) verilsin; ad ve not (int) alanları olsun. main'de bir <code>ArrayList&lt;Ogrenci&gt;</code>'e 4 öğrenci ekleyip not ortalamasını, en yüksek notlu öğrenciyi ve toplam kaç öğrenci oluşturulduğunu (static metotla) yazdırın.",
            "rubric": [
              "Sayaç <code>private static int</code>, numara ise instance alanı",
              "Sayaç yapıcıda artırılıyor",
              "<code>getSayac()</code> static, <code>Ogrenci.getSayac()</code> ile çağrılıyor",
              "<code>ArrayList&lt;Ogrenci&gt;</code>, ekleme <code>add</code>, boyut <code>size()</code>",
              "Ortalamada tam sayı bölmesine dikkat: <code>(double) toplam / size()</code>",
              "En büyüğü bulurken başlangıç ilk eleman (0 değil)"
            ],
            "solution": "import java.util.ArrayList;\n\npublic class OgrenciTest {\n    public static void main(String[] args) {\n        ArrayList<Ogrenci> liste = new ArrayList<>();\n        liste.add(new Ogrenci(\"Ali\", 70));\n        liste.add(new Ogrenci(\"Ece\", 92));\n        liste.add(new Ogrenci(\"Can\", 55));\n        liste.add(new Ogrenci(\"Su\", 81));\n\n        int toplam = 0;\n        Ogrenci enIyi = liste.get(0);\n        for (Ogrenci o : liste) {\n            toplam += o.getNot();\n            if (o.getNot() > enIyi.getNot())\n                enIyi = o;\n        }\n        System.out.println(\"Ortalama: \" + (double) toplam / liste.size());\n        System.out.println(\"En yüksek: \" + enIyi);\n        System.out.println(\"Oluşturulan öğrenci: \" + Ogrenci.getSayac());\n    }\n}\n\nclass Ogrenci {\n    private static int sayac = 0;   // tüm nesneler paylaşır\n    private int no;                 // her nesnenin kendi numarası\n    private String ad;\n    private int not;\n\n    public Ogrenci(String ad, int not) {\n        sayac++;\n        this.no = sayac;\n        this.ad = ad;\n        this.not = not;\n    }\n\n    public int getNot() {\n        return not;\n    }\n\n    public static int getSayac() {\n        return sayac;\n    }\n\n    @Override\n    public String toString() {\n        return no + \" \" + ad + \" (\" + not + \")\";\n    }\n}",
            "a": "Sayaç static olmasaydı her nesnede ayrı bir sayaç olur, herkesin numarası 1 olurdu.",
            "output": "Ortalama: 74.5\nEn yüksek: 2 Ece (92)\nOluşturulan öğrenci: 4"
          },
          {
            "type": "write",
            "q": "<b>GecersizNotException</b> adında <b>kontrollü</b> bir istisna sınıfı yazın. <b>Ders</b> sınıfındaki <code>notEkle(int)</code> metodu 0–100 dışındaki notta bu istisnayı fırlatsın ve <code>throws</code> ile bildirsin. main'de 85, 120 ve 40 notlarını sırayla eklemeyi deneyin: başarılı eklemede \"eklendi\", hatada mesajı yazdırın; her denemeden sonra <code>finally</code> ile \"deneme bitti\" yazdırın. Sonunda geçerli notların ortalamasını yazdırın.",
            "rubric": [
              "<code>class GecersizNotException extends Exception</code> (RuntimeException değil)",
              "Yapıcıda <code>super(mesaj)</code>",
              "Metot başlığında <code>throws GecersizNotException</code>",
              "Gövdede <code>throw new GecersizNotException(…)</code>",
              "try-catch-finally döngünün <b>içinde</b> (hatadan sonra devam edebilmek için)",
              "\"eklendi\" satırı try içinde, notEkle'den sonra"
            ],
            "solution": "import java.util.ArrayList;\n\npublic class NotTest {\n    public static void main(String[] args) {\n        Ders ders = new Ders();\n        int[] notlar = {85, 120, 40};\n        for (int n : notlar) {\n            try {\n                ders.notEkle(n);\n                System.out.println(n + \" eklendi\");\n            } catch (GecersizNotException e) {\n                System.out.println(\"Hata: \" + e.getMessage());\n            } finally {\n                System.out.println(\"deneme bitti\");\n            }\n        }\n        System.out.println(\"Ortalama: \" + ders.ortalama());\n    }\n}\n\nclass GecersizNotException extends Exception {\n    public GecersizNotException(String mesaj) {\n        super(mesaj);\n    }\n}\n\nclass Ders {\n    private ArrayList<Integer> notlar = new ArrayList<>();\n\n    public void notEkle(int not) throws GecersizNotException {\n        if (not < 0 || not > 100)\n            throw new GecersizNotException(\"Geçersiz not: \" + not);\n        notlar.add(not);\n    }\n\n    public double ortalama() {\n        if (notlar.isEmpty())\n            return 0;\n        int toplam = 0;\n        for (int n : notlar)\n            toplam += n;\n        return (double) toplam / notlar.size();\n    }\n}",
            "a": "try-catch döngünün dışında olsaydı 120'de döngü kırılır, 40 hiç eklenmezdi. throws yazılmasaydı derleme hatası: kontrollü istisna bildirilmeli.",
            "output": "85 eklendi\ndeneme bitti\nHata: Geçersiz not: 120\ndeneme bitti\n40 eklendi\ndeneme bitti\nOrtalama: 62.5"
          },
          {
            "type": "write",
            "q": "<code>sayilar.txt</code> dosyasına <b>PrintWriter</b> ile 1'den 10'a kadar sayıların karelerini her satıra bir tane yazın. Ardından aynı dosyayı <b>Scanner</b> ile okuyup kaç sayı okunduğunu ve toplamlarını yazdırın. Dosya açılamazsa oluşacak kontrollü istisnayı ele alın.",
            "rubric": [
              "<code>new PrintWriter(dosya)</code> ve <code>new Scanner(dosya)</code>: File nesnesiyle (String metinle değil)",
              "FileNotFoundException yakalanıyor ya da <code>main … throws</code> ile bildiriliyor",
              "Yazıcı okuma başlamadan <b>kapatılıyor</b> (try-with-resources veya <code>close()</code>)",
              "Okuma döngüsü <code>while (in.hasNextInt())</code>",
              "Gerekli import'lar: java.io.*, java.util.Scanner"
            ],
            "solution": "import java.io.File;\nimport java.io.FileNotFoundException;\nimport java.io.PrintWriter;\nimport java.util.Scanner;\n\npublic class DosyaTest {\n    public static void main(String[] args) {\n        File dosya = new File(\"sayilar.txt\");\n\n        try (PrintWriter out = new PrintWriter(dosya)) {\n            for (int i = 1; i <= 10; i++)\n                out.println(i * i);\n        } catch (FileNotFoundException e) {\n            System.out.println(\"Yazılamadı: \" + e.getMessage());\n            return;\n        }\n\n        int toplam = 0, adet = 0;\n        try (Scanner in = new Scanner(dosya)) {\n            while (in.hasNextInt()) {\n                toplam += in.nextInt();\n                adet++;\n            }\n        } catch (FileNotFoundException e) {\n            System.out.println(\"Okunamadı: \" + e.getMessage());\n        }\n        System.out.println(adet + \" sayı okundu, toplam = \" + toplam);\n    }\n}",
            "a": "Yazıcıyı kapatmadan okumaya başlarsan veriler henüz dosyaya aktarılmamış olabilir; Scanner boş dosya görür ve 0 okur.",
            "output": "10 sayı okundu, toplam = 385"
          },
          {
            "type": "write",
            "q": "<b>Calisan</b>: private ad, maas; yapıcı (içinde \"Calisan yapıcısı\" yazdırsın); <code>maasHesapla()</code> maaşı döndürsün; toString. <b>Yonetici</b> Calisan'dan türesin, ek alanı <code>prim</code>; yapıcısı \"Yonetici yapıcısı\" yazdırsın; <code>maasHesapla()</code>'yı override edip <code>super.maasHesapla() + prim</code> döndürsün; toString'i de super ile genişletsin. main'de <code>Calisan c = new Yonetici(\"Deniz\", 30000, 5000);</code> ile maaşı ve nesneyi yazdırın. Çıktının sırasını açıklayın.",
            "rubric": [
              "<code>super(ad, maas)</code> Yonetici yapıcısının ilk satırı",
              "Yonetici <code>maas</code>'a doğrudan erişmiyor (private): <code>super.maasHesapla()</code> kullanıyor",
              "Çıktı sırası: önce Calisan, sonra Yonetici yapıcısı",
              "Bildirilen tip Calisan olsa da <code>c.maasHesapla()</code> Yonetici'ninkini çalıştırıyor (35000.0)",
              "getAd gibi bir getter (ad private)"
            ],
            "solution": "public class SirketTest {\n    public static void main(String[] args) {\n        Calisan c = new Yonetici(\"Deniz\", 30000, 5000);\n        System.out.println(c.getAd() + \" maaşı: \" + c.maasHesapla());\n        System.out.println(c);\n    }\n}\n\nclass Calisan {\n    private String ad;\n    private double maas;\n\n    public Calisan(String ad, double maas) {\n        this.ad = ad;\n        this.maas = maas;\n        System.out.println(\"Calisan yapıcısı\");\n    }\n\n    public String getAd() {\n        return ad;\n    }\n\n    public double maasHesapla() {\n        return maas;\n    }\n\n    @Override\n    public String toString() {\n        return \"Çalışan \" + ad;\n    }\n}\n\nclass Yonetici extends Calisan {\n    private double prim;\n\n    public Yonetici(String ad, double maas, double prim) {\n        super(ad, maas);\n        this.prim = prim;\n        System.out.println(\"Yonetici yapıcısı\");\n    }\n\n    @Override\n    public double maasHesapla() {\n        return super.maasHesapla() + prim;\n    }\n\n    @Override\n    public String toString() {\n        return \"Yönetici / \" + super.toString();\n    }\n}",
            "a": "Yapıcı zinciri: <code>new Yonetici</code> → ilk satır <code>super(ad, maas)</code> → Calisan yapıcısı biter → Yonetici yapıcısının kalanı. Maaş double olduğu için <code>35000.0</code> yazılır.",
            "output": "Calisan yapıcısı\nYonetici yapıcısı\nDeniz maaşı: 35000.0\nYönetici / Çalışan Deniz"
          },
          {
            "type": "write",
            "q": "Kullanıcıdan <b>0 girilene kadar</b> tam sayılar okuyup bir <code>ArrayList&lt;Integer&gt;</code>'de saklayın. Sayı yerine harf girilirse <code>InputMismatchException</code>'ı yakalayıp \"Sayı giriniz\" yazdırın ve okumaya devam edin. Sonunda en büyük sayıyı ve çift sayıların adedini yazdırın.",
            "rubric": [
              "<code>ArrayList&lt;Integer&gt;</code> (int değil)",
              "try-catch döngünün <b>içinde</b>",
              "catch içinde hatalı girdiyi <code>sc.nextLine()</code> ile atma (yoksa sonsuz döngü)",
              "0 girilince <code>break</code>, 0 listeye eklenmiyor",
              "Boş liste durumu kontrol ediliyor",
              "En büyük için başlangıç ilk eleman (negatif sayılar olabilir)"
            ],
            "solution": "import java.util.ArrayList;\nimport java.util.InputMismatchException;\nimport java.util.Scanner;\n\npublic class SayiListesi {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        ArrayList<Integer> sayilar = new ArrayList<>();\n        while (true) {\n            System.out.print(\"Sayı (bitirmek için 0): \");\n            try {\n                int x = sc.nextInt();\n                if (x == 0)\n                    break;\n                sayilar.add(x);                  // autoboxing: int → Integer\n            } catch (InputMismatchException e) {\n                System.out.println(\"Sayı giriniz\");\n                sc.nextLine();                   // hatalı girdiyi at!\n            }\n        }\n        if (sayilar.isEmpty()) {\n            System.out.println(\"Hiç sayı girilmedi\");\n            return;\n        }\n        int enBuyuk = sayilar.get(0), cift = 0;\n        for (int s : sayilar) {                  // unboxing: Integer → int\n            if (s > enBuyuk)\n                enBuyuk = s;\n            if (s % 2 == 0)\n                cift++;\n        }\n        System.out.println(\"En büyük: \" + enBuyuk);\n        System.out.println(\"Çift sayı adedi: \" + cift);\n    }\n}",
            "a": "Girdi: 7, 12, abc, -4, 9, 0. \"abc\" nextInt'te kalır; nextLine ile atılmazsa her turda aynı \"abc\" tekrar okunur ve program sonsuz döngüye girer. -4 % 2 == 0 olduğu için çifttir.",
            "output": "Sayı (bitirmek için 0): 7\nSayı (bitirmek için 0): 12\nSayı (bitirmek için 0): abc\nSayı giriniz\nSayı (bitirmek için 0): -4\nSayı (bitirmek için 0): 9\nSayı (bitirmek için 0): 0\nEn büyük: 12\nÇift sayı adedi: 2"
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
      },
      {
        "id": "vize-simulasyonu",
        "title": "Vize simülasyonu (80 dakika, 100 puan)",
        "en": "Mock Midterm",
        "src": "Hocanın şablonuyla yeni sorular",
        "minutes": 80,
        "blocks": [
          {
            "t": "p",
            "html": "Geçmiş vizelerin şablonuyla hazırlanmış, <b>daha önce görmediğin</b> sorular: S1 boşluk (15p), S2 doğru/yanlış (10p), S3 çıktı (15p), S4 hata bulma (15p), S5 iskelet (40p) + S6 kısa çıktı (5p). Sayacı başlat, sorulara geç; bitirince her kartta kendini değerlendir."
          },
          {
            "t": "dg",
            "id": "exam-timer"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "prose": true,
            "q": "S1 · 15p",
            "text": "Bir sınıfın nesnesinin oluşturulmasını engellemek ama ortak kodu alt sınıflarla paylaşmak için sınıf ⟦0⟧ olarak tanımlanır.",
            "answers": [
              [
                "abstract",
                "soyut"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Arayüzde tanımlanan değişkenler varsayılan olarak ⟦0⟧ ⟦1⟧ ⟦2⟧ niteliklidir.",
            "answers": [
              [
                "public",
                "static",
                "final"
              ],
              [
                "static",
                "final",
                "public"
              ],
              [
                "final",
                "static",
                "public"
              ]
            ],
            "a": "public static final (sıra önemsiz)."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Üst sınıfın override edilmiş bir metodunu alt sınıf içinden çağırmak için ⟦0⟧ kullanılır.",
            "answers": [
              [
                "super",
                "super.metot()",
                "super."
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Aynı sınıfta aynı adlı ama farklı parametre listeli metotlar yazmaya ⟦0⟧ denir; bu seçim ⟦1⟧ zamanında yapılır.",
            "answers": [
              [
                "overload",
                "overloading",
                "aşırı yükleme"
              ],
              [
                "derleme",
                "compile"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "static bir değişken sınıfın tüm ⟦0⟧ tarafından paylaşılır.",
            "answers": [
              [
                "nesneleri",
                "nesneler",
                "örnekleri",
                "instance",
                "objects"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Kontrollü bir istisna fırlatan metot, onu yakalamıyorsa başlığında ⟦0⟧ ile bildirmelidir; aksi halde ⟦1⟧ hatası oluşur.",
            "answers": [
              [
                "throws"
              ],
              [
                "derleme",
                "compile"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Yalnızca okunur (read-only) bir alan için alan ⟦0⟧ tanımlanır, yapıcıda atanır ve yalnızca ⟦1⟧ metodu yazılır.",
            "answers": [
              [
                "private",
                "private final",
                "final"
              ],
              [
                "getter",
                "get",
                "accessor"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Üst tip bir referansı alt tipe çevirmeden önce güvenliği ⟦0⟧ ile kontrol edilir; yanlış çevirme ⟦1⟧ fırlatır.",
            "answers": [
              [
                "instanceof"
              ],
              [
                "ClassCastException"
              ]
            ],
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · 10p · Soyut sınıfın yapıcısı olamaz.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · Bir arayüz başka bir arayüzü extends edebilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · Bir sınıf iki farklı sınıfı extend edebilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · static metotlar override edilerek dinamik bağlanır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "static metotlar gizlenir (hiding); dinamik bağlama yok."
          },
          {
            "type": "mc",
            "q": "S2 · Bir catch bloğu birden çok istisna türünü yakalayabilir (multi-catch).",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "<code>catch (A | B e)</code> (Java 7+)."
          },
          {
            "type": "mc",
            "q": "S2 · compareTo metodu boolean döndürür.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · Bir sınıf final ve abstract olarak birlikte tanımlanabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · Upcasting (alt → üst) açık cast gerektirir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · finally bloğu System.exit() çağrılmadıkça her zaman çalışır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · Object sınıfındaki equals varsayılan olarak referansları karşılaştırır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "write",
            "q": "<b>S3 · 15p</b>: Çıktıyı yazınız.",
            "given": "class X {\n    static int sayac = 0;\n    int deger = 10;\n    X() {\n        this(1);\n        System.out.println(\"X() deger=\" + deger);\n    }\n    X(int k) {\n        sayac++;\n        deger += k;\n        System.out.println(\"X(int) sayac=\" + sayac);\n    }\n    void yaz() { System.out.println(\"X.yaz \" + deger); }\n}\nclass Y extends X {\n    Y() {\n        System.out.println(\"Y()\");\n    }\n    Y(int k) {\n        super(k * 2);\n        System.out.println(\"Y(int)\");\n    }\n    @Override\n    void yaz() {\n        super.yaz();\n        deger *= 2;\n        System.out.println(\"Y.yaz \" + deger);\n    }\n}\npublic class Sim {\n    public static void main(String[] args) {\n        X a = new Y();\n        X b = new Y(3);\n        a.yaz();\n        System.out.println(X.sayac + \" \" + b.deger);\n    }\n}",
            "output": "X(int) sayac=1\nX() deger=11\nY()\nX(int) sayac=2\nY(int)\nX.yaz 11\nY.yaz 22\n2 16",
            "a": "<code>new Y()</code> → gizli <code>super()</code> → X() → <code>this(1)</code> → X(int): sayac 1, deger 11. <code>new Y(3)</code> → <code>super(6)</code> → X(int): sayac 2, deger 16. <code>a.yaz()</code> gerçek tip Y → super.yaz (11) → 22. sayac static: 2."
          },
          {
            "type": "bug",
            "q": "<b>S4 · 15p</b>: Hataları satır numarasıyla bulunuz, nedenini açıklayınız, düzeltilmiş kodu ve çıktısını yazınız.",
            "code": "interface Sekil {\n    double PI = 3.14;\n    double alan();\n}\nabstract class Temel implements Sekil {\n    private String ad;\n    Temel(String ad) { this.ad = ad; }\n    abstract double cevre();\n}\nclass Kare extends Temel {\n    private double a;\n    Kare(double a) { this.a = a; }\n    public double alan() { return a * a; }\n    double cevre() { return 4 * a; }\n}\npublic class SimHata {\n    public static void main(String[] args) {\n        Sekil s = new Kare(2);\n        PI = 3.14159;\n        System.out.println(s.alan() + \" \" + s.cevre());\n    }\n}",
            "bugs": [
              12,
              19,
              20
            ],
            "explain": [
              {
                "line": 12,
                "kind": "Derleme",
                "text": "Temel'in sadece <code>Temel(String)</code> yapıcısı var; Kare yapıcısındaki gizli <code>super()</code> eşleşmez → <code>super(\"Kare\");</code> ilk satıra yazılmalı."
              },
              {
                "line": 19,
                "kind": "Derleme",
                "text": "PI arayüz sabiti (public static final) → atanamaz."
              },
              {
                "line": 20,
                "kind": "Derleme",
                "text": "<code>s</code>'nin bildirilen tipi Sekil; Sekil'de <code>cevre()</code> yok. Referans tipi Temel (veya Kare) olmalı ya da cast edilmeli."
              }
            ],
            "fixed": "interface Sekil {\n    double PI = 3.14;\n    double alan();\n}\nabstract class Temel implements Sekil {\n    private String ad;\n    Temel(String ad) { this.ad = ad; }\n    abstract double cevre();\n}\nclass Kare extends Temel {\n    private double a;\n    Kare(double a) {\n        super(\"Kare\");\n        this.a = a;\n    }\n    public double alan() { return a * a; }\n    double cevre() { return 4 * a; }\n}\npublic class SimHata {\n    public static void main(String[] args) {\n        Temel s = new Kare(2);\n        System.out.println(s.alan() + \" \" + s.cevre() + \" \" + Sekil.PI);\n    }\n}",
            "output": "4.0 8.0 3.14",
            "a": ""
          },
          {
            "type": "skeleton",
            "q": "<b>S5 (40p)</b>: Kütüphane Medya Sistemi. Kod iskeletini tamamlayınız.",
            "req": [
              "Medya soyut sınıfı: private <b>kayitNo</b> (yalnızca okunur, yapıcıda atanır), baslik, yil; soyut <code>gecikmeUcreti(int gun)</code>.",
              "Kitap ve Dergi Medya'dan türer. <b>Sadece Kitap</b> ödünç verilebilir: <code>OduncVerilebilir</code> arayüzü.",
              "Medyalar <b>yıla göre</b> karşılaştırılabilir (Comparable).",
              "Özel kontrollü istisna: <code>OduncHatasi</code>.",
              "<b>İş kuralları</b>: Kutuphane.oduncVer → ödünç verilemeyen medya veya <b>zaten ödünçteki</b> bir kitap için OduncHatasi fırlatsın.",
              "Main'de polimorfizm ve try-catch."
            ],
            "code": "import java.util.ArrayList;\nimport java.util.Collections;\n\nclass OduncHatasi ⟦0⟧ {\n    public OduncHatasi(String mesaj) {\n        ⟦1⟧\n    }\n}\n\ninterface OduncVerilebilir {\n    boolean oduncte();\n    void oduncVer();\n}\n\nabstract class Medya implements Comparable<Medya> {\n    ⟦2⟧\n    private String baslik;\n    private int yil;\n\n    public Medya(int kayitNo, String baslik, int yil) {\n        this.kayitNo = kayitNo;\n        this.baslik = baslik;\n        this.yil = yil;\n    }\n\n    public int getKayitNo() { return kayitNo; }\n    public String getBaslik() { return baslik; }\n\n    ⟦3⟧\n\n    @Override\n    public int compareTo(Medya o) {\n        ⟦4⟧\n    }\n\n    @Override\n    public String toString() { return kayitNo + \" \" + baslik + \" (\" + yil + \")\"; }\n}\n\nclass Kitap ⟦5⟧ {\n    private boolean oduncte;\n\n    public Kitap(int kayitNo, String baslik, int yil) { super(kayitNo, baslik, yil); }\n\n    @Override\n    public double gecikmeUcreti(int gun) { return gun * 2.5; }\n\n    @Override\n    public boolean oduncte() { return oduncte; }\n\n    ⟦6⟧\n}\n\nclass Dergi extends Medya {\n    public Dergi(int kayitNo, String baslik, int yil) { super(kayitNo, baslik, yil); }\n\n    ⟦7⟧\n}\n\nclass Kutuphane {\n    private ArrayList<Medya> medyalar = new ArrayList<>();\n\n    public void ekle(Medya m) { medyalar.add(m); }\n\n    public void oduncVer(Medya m) ⟦8⟧ {\n        ⟦9⟧\n    }\n\n    public void listele() {\n        Collections.sort(medyalar);\n        for (Medya m : medyalar)\n            System.out.println(m + \" · 3 gün gecikme: \" + m.gecikmeUcreti(3) + \" TL\");\n    }\n}\n\npublic class KutuphaneTest {\n    public static void main(String[] args) {\n        Kutuphane k = new Kutuphane();\n        Medya kitap = new Kitap(1, \"Suç ve Ceza\", 1866);\n        Medya dergi = new Dergi(2, \"Bilim Teknik\", 2024);\n        k.ekle(dergi);\n        k.ekle(kitap);\n        Medya[] istekler = { kitap, kitap, dergi };\n        for (Medya m : istekler) {\n            ⟦10⟧\n        }\n        k.listele();\n    }\n}",
            "blanks": [
              {
                "model": "extends Exception",
                "note": "Kontrollü istisna → Exception."
              },
              {
                "model": "super(mesaj);"
              },
              {
                "model": "private final int kayitNo;",
                "answers": [
                  "private int kayitNo;"
                ],
                "note": "Yalnızca okunur: final + getter, setter yok."
              },
              {
                "model": "public abstract double gecikmeUcreti(int gun);"
              },
              {
                "model": "return Integer.compare(this.yil, o.yil);",
                "answers": [
                  "return Integer.compare(yil, o.yil);",
                  "return this.yil - o.yil;",
                  "return yil - o.yil;"
                ]
              },
              {
                "model": "extends Medya implements OduncVerilebilir"
              },
              {
                "model": "@Override\npublic void oduncVer() { oduncte = true; }",
                "answers": [
                  "@Override\npublic void oduncVer() {\n    oduncte = true;\n}",
                  "public void oduncVer() { this.oduncte = true; }"
                ]
              },
              {
                "model": "@Override\npublic double gecikmeUcreti(int gun) { return gun * 1.0; }",
                "note": "Soyut metodu uygulamazsa Dergi de abstract olmak zorunda kalırdı. Ücret değeri serbest."
              },
              {
                "model": "throws OduncHatasi"
              },
              {
                "model": "if (!(m instanceof OduncVerilebilir))\n    throw new OduncHatasi(m.getBaslik() + \" ödünç verilemez\");\nOduncVerilebilir o = (OduncVerilebilir) m;\nif (o.oduncte())\n    throw new OduncHatasi(m.getBaslik() + \" zaten ödünçte\");\no.oduncVer();\nSystem.out.println(m.getBaslik() + \" ödünç verildi\");",
                "note": "İki iş kuralı: tip kontrolü (instanceof) ve durum kontrolü (zaten ödünçte)."
              },
              {
                "model": "try {\n    k.oduncVer(m);\n} catch (OduncHatasi e) {\n    System.out.println(\"Hata: \" + e.getMessage());\n}"
              }
            ],
            "output": "Suç ve Ceza ödünç verildi\nHata: Suç ve Ceza zaten ödünçte\nHata: Bilim Teknik ödünç verilemez\n1 Suç ve Ceza (1866) · 3 gün gecikme: 7.5 TL\n2 Bilim Teknik (2024) · 3 gün gecikme: 3.0 TL",
            "a": ""
          },
          {
            "type": "write",
            "q": "<b>S6 · 5p</b>: Çıktıyı yazınız.",
            "given": "public class Son {\n    static String f(int[] d, int i) {\n        try {\n            return \"d=\" + (10 / d[i]);\n        } catch (ArithmeticException e) {\n            return \"sıfır\";\n        } catch (ArrayIndexOutOfBoundsException e) {\n            return \"indeks\";\n        } finally {\n            System.out.print(\"[f\" + i + \"] \");\n        }\n    }\n    public static void main(String[] args) {\n        int[] d = {5, 0};\n        for (int i = 0; i < 3; i++)\n            System.out.println(f(d, i));\n    }\n}",
            "output": "[f0] d=2\n[f1] sıfır\n[f2] indeks",
            "a": "Dönüş değeri hesaplanır, finally (print) önce çalışır, sonra main değeri println ile yazar: <code>[f0] d=2</code>."
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

  T("tr-v25-shape", {
    "files": [
      {
        "name": "Circle.java",
        "code": "\nclass Shape {\n    int area = 1;\n    public void resize(int factor) {\n        area *= factor;\n    }\n}\nclass Circle extends Shape {\n    public void resize() {\n        area += 3;\n    }\n    public void resize(int factor) {\n        resize();\n        super.resize(factor);\n        area += 2;\n    }\n    public static void main(String[] args) {\n        Circle c = new Circle();\n        c.resize(2);\n        System.out.println(\"Area = \" + c.area);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          17
        ],
        "note": "Nesne oluşur. <code>area</code> Shape'ten miras, başlangıç değeri <b>1</b>.",
        "vars": {
          "area": "1"
        }
      },
      {
        "lines": [
          18,
          11
        ],
        "note": "Gerçek tip Circle → Circle'daki <code>resize(int)</code> çalışır (override).",
        "vars": {
          "area": "1",
          "factor": "2"
        }
      },
      {
        "lines": [
          12,
          9
        ],
        "note": "<code>resize()</code> parametresiz → Circle'daki <b>overload</b>: area = 1 + 3.",
        "vars": {
          "area": "4",
          "factor": "2"
        }
      },
      {
        "lines": [
          13,
          4
        ],
        "note": "<code>super.</code> → Shape'teki <code>resize(int)</code>: area = 4 · 2.",
        "vars": {
          "area": "8",
          "factor": "2"
        }
      },
      {
        "lines": [
          14
        ],
        "note": "area = 8 + 2.",
        "vars": {
          "area": "10"
        }
      },
      {
        "lines": [
          19
        ],
        "out": "Area = 10"
      }
    ]
  });

  T("tr-v25-trycatch", {
    "files": [
      {
        "name": "CiktiTryCatch.java",
        "code": "\npublic class CiktiTryCatch {\n    public static void main(String[] args) {\n        int a = 0, b = 5;\n        String[] c = {\"A\", \"B\", \"C\"};\n        try {\n            System.out.print(c[a / b]);\n            try {\n                for (int i = 1; i < 4; i++) {\n                    System.out.print(c[i]);\n                }\n            } catch (Exception e) {\n                System.out.println(\"D\");\n            } finally {\n                System.out.println(\"E\");\n            }\n        } catch (Exception e) {\n            System.out.println(\"F\");\n        } finally {\n            System.out.println(\"G\");\n        }\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          3,
          4
        ],
        "note": "a = 0, b = 5. Dikkat: <b>a / b</b> = 0 / 5 = 0; sıfıra bölme b = 0 olsaydı olurdu.",
        "vars": {
          "a": "0",
          "b": "5",
          "c": "{A, B, C}"
        }
      },
      {
        "lines": [
          6
        ],
        "note": "c[0] → \"A\" (<code>print</code>: satır sonu yok).",
        "out": "A",
        "nl": false
      },
      {
        "lines": [
          8,
          9
        ],
        "note": "i = 1 → \"B\", i = 2 → \"C\".",
        "vars": {
          "i": "1 → 2"
        },
        "out": "BC",
        "nl": false
      },
      {
        "lines": [
          9
        ],
        "note": "i = 3 → <code>c[3]</code>: dizi 3 elemanlı (0..2) → <b>ArrayIndexOutOfBoundsException</b>.",
        "vars": {
          "i": "3"
        }
      },
      {
        "lines": [
          12
        ],
        "note": "En yakın uygun catch: <b>içteki</b> catch (Exception). println → satır biter.",
        "out": "D"
      },
      {
        "lines": [
          14
        ],
        "note": "İçteki finally her durumda çalışır.",
        "out": "E"
      },
      {
        "lines": [
          17
        ],
        "note": "İstisna içeride yakalandı → dış try normal biter, <b>dış catch atlanır</b>."
      },
      {
        "lines": [
          19
        ],
        "note": "Dış finally.",
        "out": "G"
      }
    ]
  });
})(window.OOPLab = window.OOPLab || {});
