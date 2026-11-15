/*
 * lessons-ch4.js — Bölüm 4: Soyut Sınıflar ve Arayüzler (Liang Bölüm 13 · vizede kesin çıkar).
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
    "id": "ch4",
    "num": 4,
    "title": "Soyut Sınıflar ve Arayüzler",
    "en": "Abstract Classes and Interfaces",
    "source": "Liang Bölüm 13 · vizede kesin çıkar",
    "objectives": [
      "Soyut sınıf ve soyut metodun kurallarını (D/Y tuzaklarıyla) açıklamak",
      "Arayüzün sabit/metot kurallarını, extends + implements sırasını, imza çakışmasını bilmek",
      "Comparable ile nesneleri bir alana göre karşılaştırmak ve sıralamak",
      "Cloneable (marker interface) ve clone() ile sığ/derin kopya yapmak",
      "Number, Calendar, Rational örneklerini ve sınıf tasarım yönergelerini (Slide04) açıklamak"
    ],
    "tag": "Vize konusu · 3 vizede de çıktı",
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
        "id": "soyut-kurallar",
        "title": "Soyut sınıfın ince kuralları",
        "en": "Abstract Class Rules",
        "src": "Liang 13.2–13.3 · 2022 ve 2024 vizeleri",
        "minutes": 8,
        "blocks": [
          {
            "t": "p",
            "html": "Vizelerdeki Doğru/Yanlış sorularının çoğu bu tablodan çıkıyor. Her satırı \"neden\" sütunuyla birlikte öğren; ezberlersen ters çevrilmiş cümlede yanılırsın."
          },
          {
            "t": "table",
            "head": [
              "İfade",
              "D / Y",
              "Neden"
            ],
            "rows": [
              [
                "Soyut sınıftan <code>new</code> ile nesne oluşturulabilir.",
                "<b>Y</b>",
                "Derleme hatası. Ama tip olarak (<code>Hayvan h = new Kedi()</code>) ve dizi olarak (<code>new Hayvan[3]</code>) kullanılabilir."
              ],
              [
                "Soyut sınıfta soyut metot tanımlamak <b>mecburidir</b>.",
                "<b>Y</b>",
                "Soyut metotsuz soyut sınıf geçerlidir; amaç sadece nesne oluşturmayı engellemek olabilir. (2022 vize S2-7)"
              ],
              [
                "Soyut bir metot soyut olmayan bir sınıfta yer alabilir.",
                "<b>Y</b>",
                "Soyut metodu olan sınıf mutlaka <code>abstract</code> bildirilir. (2022 vize S2-9)"
              ],
              [
                "Üst sınıftaki bir metot override edilerek soyut metoda çevrilebilir.",
                "<b>D</b>",
                "Somut <code>toString()</code>, alt sınıfta <code>public abstract String toString();</code> yapılabilir; o alt sınıf da abstract olur. (2022 vize S2-10)"
              ],
              [
                "Soyut sınıfın tüm alt sınıfları soyut metotları override etmek <b>zorundadır</b>.",
                "<b>Y</b>",
                "Alt sınıf <b>abstract</b> ise etmeyebilir; zorunluluk sadece <b>somut</b> alt sınıflar için. (2024 vize S2-5)"
              ],
              [
                "Soyut sınıfın yapıcısı olabilir.",
                "<b>D</b>",
                "Nesne oluşturmak için değil, alt sınıf yapıcısı <code>super(...)</code> ile ortak alanları başlatsın diye."
              ],
              [
                "Üst sınıf somutken alt sınıf soyut olabilir.",
                "<b>D</b>",
                "Object somuttur ama GeometricObject soyuttur."
              ],
              [
                "<code>abstract</code> ile <code>final</code>, <code>private</code> veya <code>static</code> birlikte kullanılabilir.",
                "<b>Y</b>",
                "Soyut metot override edilmek için vardır; final/private/static override edilemez → çelişki, derleme hatası."
              ],
              [
                "Soyut metodun gövdesi boş olabilir: <code>abstract void f() { }</code>",
                "<b>Y</b>",
                "Soyut metodun gövdesi <b>hiç</b> olmaz; noktalı virgülle biter."
              ]
            ]
          },
          {
            "t": "note",
            "kind": "exam",
            "html": "Boşluk doldurmada (2024 ve 2025 vizeleri): \"Soyut sınıftaki metotlar alt sınıf tarafından <b>override / uygulanmadığı</b> sürece alt sınıfın da <b>soyut (abstract)</b> olarak tanımlanması gerekir.\""
          },
          {
            "t": "h",
            "text": "Kodda gör: tüm kurallar tek programda"
          },
          {
            "t": "dg",
            "id": "tr-soyut-kurallar"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Soyut sınıflara (abstract class) soyut metotlar tanımlamak mecburidir. <small>(2022 vize)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Soyut metotsuz soyut sınıf geçerlidir."
          },
          {
            "type": "mc",
            "q": "Soyut bir metot soyut olmayan bir sınıfta yer alabilir. <small>(2022 vize)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Soyut metodu olan sınıf abstract olmak zorunda."
          },
          {
            "type": "mc",
            "q": "Üst sınıfta yer alan bir metot override edilerek soyut bir metoda çevrilebilir. <small>(2022 vize)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "Alt sınıf bu durumda abstract olur."
          },
          {
            "type": "mc",
            "q": "Abstract bir sınıfın tüm alt sınıfları soyut metotları geçersiz kılmak zorundadır. <small>(2024 vize)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Alt sınıf da abstract ise zorunda değil."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2024 vize",
            "text": "Bir sınıfın soyut bir sınıftan türemesi durumunda, alt sınıf ⟦0⟧ metotları mutlaka uygulamalıdır. Aksi takdirde alt sınıf da ⟦1⟧ olarak tanımlanmalıdır.",
            "answers": [
              [
                "soyut",
                "abstract",
                "tüm soyut"
              ],
              [
                "soyut",
                "abstract"
              ]
            ],
            "a": ""
          }
        ]
      },
      {
        "id": "number-calendar",
        "title": "Kütüphanedeki soyut sınıflar: Number ve Calendar",
        "en": "Abstract Number & Calendar",
        "src": "Slide04 s.11–16, 30 · Liang 13.3–13.4",
        "minutes": 8,
        "blocks": [
          {
            "t": "p",
            "html": "Soyut sınıf sadece ders örneği değil; Java kütüphanesinde gerçekten kullanılıyor. Slayttaki iki örnek: <b><code>Number</code></b> ve <b><code>Calendar</code></b>. İkisinin de mantığı aynı: <b>üst sınıf ortak işi ilan eder, nasıl yapılacağını alt sınıf bilir.</b>"
          },
          {
            "t": "h",
            "text": "Soyut Number sınıfı (s.11)"
          },
          {
            "t": "list",
            "items": [
              "<code>Number</code>; <code>Byte, Short, Integer, Long, Float, Double</code>, <code>BigInteger</code> ve <code>BigDecimal</code> sınıflarının <b>soyut üst sınıfıdır</b>.",
              "Soyut metotları: <code>intValue()</code>, <code>longValue()</code>, <code>floatValue()</code>, <code>doubleValue()</code>. Somut olanlar: <code>byteValue()</code>, <code>shortValue()</code> (intValue üzerinden çalışır).",
              "Neden soyut? \"Bir sayıyı double'a çevir\" demek her sayı türünde farklı yapılır; formülü Number değil, alt sınıf bilir.",
              "Kazanç: <code>ArrayList&lt;Number&gt;</code> içine Integer, Double, BigInteger <b>karışık</b> konabilir; <code>getLargestNumber</code> hepsini <code>doubleValue()</code> ile karşılaştırır (<b>LargestNumbers</b> örneği)."
            ]
          },
          {
            "t": "h",
            "text": "Soyut Calendar ve GregorianCalendar (s.12–16)"
          },
          {
            "t": "list",
            "items": [
              "<code>java.util.Date</code> belli bir anı <b>milisaniye</b> hassasiyetinde tutar.",
              "<code>java.util.Calendar</code> soyut temel sınıftır: bir Date'ten yıl, ay, gün, saat, dakika, saniye ayıklamaya yarar. Alt sınıfları farklı takvim sistemlerini (Gregorian, Lunar, Jewish) uygulayabilir; Java API'de hazır olan <b><code>GregorianCalendar</code></b>.",
              "<code>new GregorianCalendar()</code> → <b>şu anki</b> tarih/saat. <code>new GregorianCalendar(yıl, ay, gün)</code> → belirtilen tarih.",
              "<b>Ay parametresi 0 tabanlıdır: 0 = Ocak, 11 = Aralık.</b>",
              "<code>get(int field)</code> bilgiyi ayıklar; alanlar <code>Calendar</code> içinde sabit olarak tanımlıdır."
            ]
          },
          {
            "t": "table",
            "head": [
              "Sabit",
              "Anlamı"
            ],
            "rows": [
              [
                "<code>YEAR</code>",
                "Yıl"
              ],
              [
                "<code>MONTH</code>",
                "Ay, <b>0–11</b> (0 = Ocak)"
              ],
              [
                "<code>DATE</code> / <code>DAY_OF_MONTH</code>",
                "Ayın günü (1–31)"
              ],
              [
                "<code>HOUR</code> / <code>HOUR_OF_DAY</code>",
                "12 saatlik / 24 saatlik saat"
              ],
              [
                "<code>MINUTE</code>, <code>SECOND</code>",
                "Dakika, saniye"
              ],
              [
                "<code>DAY_OF_WEEK</code>",
                "Haftanın günü, <b>1 = Pazar</b>, 7 = Cumartesi"
              ],
              [
                "<code>DAY_OF_YEAR</code>",
                "Yılın kaçıncı günü (1 = 1 Ocak)"
              ],
              [
                "<code>WEEK_OF_MONTH</code>, <code>WEEK_OF_YEAR</code>",
                "Ayın / yılın kaçıncı haftası"
              ],
              [
                "<code>AM_PM</code>",
                "0 = öğleden önce, 1 = öğleden sonra"
              ]
            ]
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>new Calendar()</code> → <b>derleme hatası</b> (soyut). <code>Calendar c = new GregorianCalendar();</code> doğru: soyut sınıf <b>tip</b> olarak kullanılır.</li><li><code>new GregorianCalendar(2026, 10, 17)</code> <b>17 Kasım</b>'dır, Ekim değil. <code>c.get(Calendar.MONTH)</code> de 10 döndürür.</li></ul>"
          },
          {
            "t": "h",
            "text": "Calendar klonlanabilir (s.30)"
          },
          {
            "t": "p",
            "html": "Kütüphanede <code>Date</code> ve <code>Calendar</code> gibi birçok sınıf <code>Cloneable</code>'ı uygular. Klon <b>yeni bir nesnedir</b> (<code>==</code> false) ama <b>içeriği aynıdır</b> (<code>equals</code> true):"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "Calendar calendar = new GregorianCalendar(2003, 2, 1);\nCalendar calendarCopy = (Calendar) calendar.clone();   // clone() Object döndürür → cast\nSystem.out.println(\"calendar == calendarCopy is \" + (calendar == calendarCopy));\nSystem.out.println(\"calendar.equals(calendarCopy) is \" + calendar.equals(calendarCopy));\n// calendar == calendarCopy is false\n// calendar.equals(calendarCopy) is true"
          },
          {
            "t": "note",
            "kind": "exam",
            "html": "Çıktı sorusu olarak çok uygun: <code>==</code> <b>referansları</b>, <code>equals</code> <b>içeriği</b> karşılaştırır. Klon her zaman farklı adreste durur."
          },
          {
            "t": "h",
            "text": "Kodda gör: hepsi tek programda"
          },
          {
            "t": "dg",
            "id": "tr-number-calendar"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Aşağıdakilerden hangisi <b>derleme hatası</b> verir?",
            "options": [
              "Number n = new Integer(5);",
              "Calendar c = new GregorianCalendar();",
              "Number n = new Number();",
              "ArrayList<Number> l = new ArrayList<>();"
            ],
            "answer": 2,
            "a": "Number soyut sınıftır; <code>new Number()</code> yapılamaz. Diğerlerinde Number/Calendar sadece <b>tip</b> olarak kullanılıyor."
          },
          {
            "type": "mc",
            "q": "<code>new GregorianCalendar(2025, 0, 15)</code> hangi tarihi gösterir?",
            "options": [
              "15 Ocak 2025",
              "15 Şubat 2025",
              "15 Aralık 2024",
              "Geçersiz, hata verir"
            ],
            "answer": 0,
            "a": "Ay 0 tabanlı: 0 = Ocak."
          },
          {
            "type": "mc",
            "q": "Number sınıfının <code>doubleValue()</code> metodu soyuttur; her sayısal wrapper sınıf onu kendisi uygular.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "intValue, longValue, floatValue, doubleValue soyuttur."
          },
          {
            "type": "mc",
            "q": "Calendar.DAY_OF_WEEK değeri 1 ise gün Pazartesi'dir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "1 = Pazar (SUNDAY), 2 = Pazartesi."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Slide04 s.13–14",
            "text": "java.util.Date örneği belirli bir anı ⟦0⟧ hassasiyetinde temsil eder. Calendar soyut sınıfının Java API'de hazır bulunan alt sınıfı ⟦1⟧ sınıfıdır. Bu sınıfın yapıcısındaki ay parametresi ⟦2⟧ tabanlıdır.",
            "answers": [
              [
                "milisaniye",
                "ms"
              ],
              [
                "GregorianCalendar"
              ],
              [
                "0",
                "sıfır"
              ]
            ],
            "a": ""
          },
          {
            "type": "write",
            "q": "Çıktıyı yazınız.",
            "given": "import java.util.*;\n\npublic class Takvim {\n    public static void main(String[] args) {\n        Calendar c = new GregorianCalendar(2024, 11, 31);\n        System.out.println(c.get(Calendar.MONTH) + \" \" + c.get(Calendar.DAY_OF_MONTH));\n        Calendar k = (Calendar) c.clone();\n        System.out.println(c == k);\n        System.out.println(c.equals(k));\n    }\n}",
            "output": "11 31\nfalse\ntrue",
            "a": "Ay 11 olarak verildi (Aralık) ve <code>get(MONTH)</code> de <b>11</b> döner, 12 değil. Klon farklı nesne (<code>==</code> false), içerik aynı (<code>equals</code> true)."
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
        "id": "arayuz-kurallar",
        "title": "Arayüzün ince kuralları: sabitler, imza çakışması, extends + implements",
        "en": "Interface Rules",
        "src": "Liang 13.5 · 2024 ve 2025 vizeleri",
        "minutes": 9,
        "blocks": [
          {
            "t": "list",
            "items": [
              "<b>Alanlar</b> otomatik <code>public static final</code>: sabittir, değiştirilemez. 2025 vizesindeki <code>interface Count { short counter = 0; }</code> sorusunda <code>++counter</code> bu yüzden <b>derleme hatası</b>.",
              "<b>Metotlar</b> otomatik <code>public abstract</code>. Uygulayan sınıf <code>public</code> yazmazsa erişimi daraltmış olur → derleme hatası. (Java 8 ile gövdeli <code>default</code> ve <code>static</code> metotlar da yazılabilir; vize sorularında \"tüm metotlar public abstract\" ifadesi <b>Doğru</b> kabul edilir.)",
              "<b>Yapıcı yoktur</b>, <code>new</code> ile örneklenemez. (\"Arayüzler yapıcı tanımlayabilir\" → <b>Yanlış</b>.)",
              "Sınıf <b>tek</b> sınıftan <code>extends</code>, <b>birden çok</b> arayüzden <code>implements</code>. Sıra: <b>önce extends, sonra implements</b>: <code>class Light extends Device implements Controllable</code>",
              "Arayüz başka arayüzleri <code>extends</code> ile genişletir (birden çok olabilir): <code>interface A extends B, C</code>",
              "İki arayüz <b>aynı imzalı ama farklı dönüş tipli</b> metot içerirse ikisini birden uygulayan sınıf yazılamaz → <b>derleme hatası</b>. Dönüş tipi de aynıysa tek gövde ikisini de karşılar.",
              "<code>instanceof</code> arayüzle de çalışır: <code>cihaz instanceof Controllable</code>. Hocanın \"sadece kontrol edilebilir cihazları listeye ekle\" kuralı buna dayanır.",
              "Arayüz tipinde referans (<code>Kontrol k = t;</code>) üzerinden sadece arayüzün metotları çağrılabilir."
            ]
          },
          {
            "t": "note",
            "kind": "exam",
            "html": "Çoklu kalıtım sınıflarda yok, arayüzlerle sağlanır: \"Bir sınıfın yalnızca soyut metotları içermesini sağlayan, ayrıca <b>çoklu kalıtımı destekleyen</b> yapı → <b>arayüz (interface)</b>\" (2024 vize)."
          },
          {
            "t": "h",
            "text": "Kodda gör"
          },
          {
            "t": "dg",
            "id": "tr-arayuz-kurallar"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Bir interface'de tanımlanan tüm metotlar varsayılan olarak public ve abstract'tır. <small>(2024 vize)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "Gövdesiz arayüz metotları otomatik public abstract."
          },
          {
            "type": "mc",
            "q": "Arayüzler (interfaces) bir yapıcı (constructor) tanımlayabilir. <small>(2024 vize)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Arayüzün yapıcısı olmaz."
          },
          {
            "type": "mc",
            "q": "Bir sınıf hem bir başka sınıfı genişletebilir (extend) hem de bir veya daha fazla arayüzü uygulayabilir (implement). <small>(2024 vize)</small>",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "<code>class A extends B implements C, D</code>"
          },
          {
            "type": "mc",
            "q": "<code>interface Count { short counter = 0; }</code> uygulayan sınıfta <code>counter++;</code> yazılırsa ne olur? <small>(2025 vize S3)</small>",
            "options": [
              "counter 1 olur",
              "Her nesnenin kendi counter'ı artar",
              "Derleme hatası: final alana atama yapılamaz",
              "Çalışma zamanında hata"
            ],
            "answer": 2,
            "a": "Arayüz alanları public static final'dır."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2025 vize",
            "text": "Java'da iki veya daha fazla arayüz aynı imzaya sahip ama farklı dönüş tipine sahip metotlar içeriyorsa, bu durum ⟦0⟧ hatasına neden olur.",
            "answers": [
              [
                "derleme",
                "compile",
                "derleme zamanı",
                "compile-time"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "q": "Light, Device'den türesin ve Controllable'ı uygulasın:",
            "code": "class Light ⟦0⟧ Device ⟦1⟧ Controllable {\n    ...\n}",
            "answers": [
              [
                "extends"
              ],
              [
                "implements"
              ]
            ],
            "a": "Sıra değişmez: önce extends, sonra implements."
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
      },
      {
        "id": "comparable",
        "title": "Comparable ve compareTo: fiyata / hıza göre karşılaştırma",
        "en": "The Comparable Interface",
        "src": "Liang 13.6 · 2022 ve 2024 vizeleri",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "İki vizenin büyük sorusunda da istendi: \"Tüm cihazların <b>fiyat</b> bilgisi karşılaştırılabilir (Comparable) olmalı\" (2024), \"Otomobil ve Drone <b>hızlarına göre</b> karşılaştırılabilir olmalı\" (2022)."
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public interface Comparable<T> {\n    int compareTo(T o);\n}"
          },
          {
            "t": "table",
            "head": [
              "compareTo sonucu",
              "Anlamı"
            ],
            "rows": [
              [
                "negatif",
                "<code>this</code> diğerinden <b>küçük</b> (sıralamada önce)"
              ],
              [
                "0",
                "eşit"
              ],
              [
                "pozitif",
                "<code>this</code> diğerinden <b>büyük</b> (sıralamada sonra)"
              ]
            ]
          },
          {
            "t": "list",
            "items": [
              "Generic yaz: <code>implements Comparable&lt;Araba&gt;</code> → parametre <code>Araba</code> olur, cast gerekmez. Ham hali <code>Comparable</code> yazarsan parametre <code>Object</code> olur ve <code>(Araba) o</code> cast'i gerekir.",
              "double alanlarda <code>Double.compare(a, b)</code>, int alanlarda <code>Integer.compare(a, b)</code> ya da <code>this.hiz - o.hiz</code>.",
              "<code>Collections.sort(liste)</code>, <code>Arrays.sort(dizi)</code>, <code>Collections.max/min</code> compareTo'yu kullanır.",
              "String, Integer, Double, Date zaten Comparable'dır."
            ]
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "compareTo <b>int</b> döndürür, boolean değil. İmza: <code>public int compareTo(Araba o)</code>; public unutulursa derleme hatası."
          },
          {
            "t": "h",
            "text": "Kodda gör"
          },
          {
            "t": "dg",
            "id": "tr-comparable"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "q": "Drone'ları hıza göre karşılaştırılabilir yap:",
            "code": "class Drone extends Vasita ⟦0⟧ Comparable<Drone> {\n    ...\n    @Override\n    public ⟦1⟧ compareTo(Drone diger) {\n        return Integer.compare(this.getHiz(), diger.getHiz());\n    }\n}",
            "answers": [
              [
                "implements"
              ],
              [
                "int"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2024 vize",
            "text": "Java'da ⟦0⟧ arayüzü nesnelerin karşılaştırılabilir ve sıralanabilir olmasını sağlar. Bu arayüzü uygulayan bir sınıf ⟦1⟧ metodunu gerçekleştirmelidir.",
            "answers": [
              [
                "Comparable",
                "java.lang.Comparable"
              ],
              [
                "compareTo",
                "compareTo()"
              ]
            ],
            "a": ""
          },
          {
            "type": "mc",
            "q": "<code>a.compareTo(b)</code> negatif döndü. Ne anlama gelir?",
            "options": [
              "a, b'den büyüktür",
              "a, b'den küçüktür (sıralamada önce gelir)",
              "a ve b eşittir",
              "Hata oluştu"
            ],
            "answer": 1,
            "a": ""
          }
        ]
      },
      {
        "id": "comparable-ornekler",
        "title": "Wrapper sınıflar, compareTo çıktıları ve ComparableRectangle",
        "en": "Comparable in the Library",
        "src": "Slide04 s.22–28 · Liang 13.5–13.6",
        "minutes": 8,
        "blocks": [
          {
            "t": "h",
            "text": "Wrapper sınıflar ne override eder? (s.24–25)"
          },
          {
            "t": "list",
            "items": [
              "Her wrapper sınıf (<code>Integer, Double, Character</code>...) Object'ten gelen <b><code>toString</code>, <code>equals</code> ve <code>hashCode</code></b> metotlarını override eder.",
              "Tüm sayısal wrapper sınıflar ve <code>Character</code> <b><code>Comparable</code></b>'ı uygular; <code>compareTo</code> bu sınıflarda yazılmıştır.",
              "İmza kalıbı: <code>public class Integer extends Number implements Comparable&lt;Integer&gt;</code>. Aynı şekilde <code>BigInteger extends Number implements Comparable&lt;BigInteger&gt;</code>, <code>String extends Object implements Comparable&lt;String&gt;</code>, <code>Date extends Object implements Comparable&lt;Date&gt;</code>."
            ]
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Comparable <b>generic</b>tir: <code>Comparable&lt;E&gt;</code> içindeki tek metot <code>public int compareTo(E o)</code>. Paketi <b><code>java.lang</code></b> (import gerekmez)."
          },
          {
            "t": "h",
            "text": "Slayttaki çıktı örneği (s.26)"
          },
          {
            "t": "table",
            "head": [
              "İfade",
              "Çıktı",
              "Neden"
            ],
            "rows": [
              [
                "<code>new Integer(3).compareTo(new Integer(5))</code>",
                "<b>-1</b>",
                "3 &lt; 5 → negatif (Integer tam olarak -1/0/1 döndürür)"
              ],
              [
                "<code>\"ABC\".compareTo(\"ABE\")</code>",
                "<b>-2</b>",
                "İlk farklı karakter: 'C' − 'E' = 67 − 69 = <b>-2</b>"
              ],
              [
                "<code>date1.compareTo(date2)</code> (2013 ile 2012)",
                "<b>1</b>",
                "date1 daha sonra → pozitif"
              ]
            ]
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "String'in compareTo'su sadece işaret değil, <b>karakter farkını</b> döndürür: <code>\"a\".compareTo(\"c\")</code> = -2, <code>\"b\".compareTo(\"a\")</code> = 1. Biri diğerinin öneki ise <b>uzunluk farkı</b>: <code>\"AB\".compareTo(\"ABCD\")</code> = -2."
          },
          {
            "t": "h",
            "text": "instanceof ve Arrays.sort (s.27)"
          },
          {
            "t": "p",
            "html": "n bir Integer, s bir String, d bir Date ise şunların <b>hepsi true</b>:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "s instanceof String      s instanceof Object      s instanceof Comparable\nd instanceof java.util.Date   d instanceof Object   d instanceof Comparable\nn instanceof Integer     n instanceof Object      n instanceof Comparable"
          },
          {
            "t": "p",
            "html": "Bir nesne, sınıfının, tüm üst sınıflarının <b>ve uyguladığı tüm arayüzlerin</b> örneğidir. <code>java.util.Arrays.sort(dizi)</code> dizideki öğelerin <code>Comparable&lt;E&gt;</code> örneği olmasını <b>gerektirir</b> (SortComparableObjects örneği: String, BigInteger dizileri doğrudan sıralanır)."
          },
          {
            "t": "h",
            "text": "Kendi sınıfını Comparable yapmak: ComparableRectangle (s.28)"
          },
          {
            "t": "p",
            "html": "Rectangle'ı değiştirmeden, ondan türeyip Comparable'ı uygulayan bir sınıf yazılır: <code>class ComparableRectangle extends Rectangle implements Comparable&lt;ComparableRectangle&gt;</code>. Sıra kuralı: önce <b>extends</b>, sonra <b>implements</b>. compareTo alanları karşılaştırır, böylece <code>Arrays.sort</code> dikdörtgenleri alana göre sıralar."
          },
          {
            "t": "h",
            "text": "Kodda gör"
          },
          {
            "t": "dg",
            "id": "tr-comparable-ornekler"
          }
        ],
        "checks": [
          {
            "type": "write",
            "q": "Çıktıyı yazınız. <small>(Slide04 s.26 tarzı)</small>",
            "given": "public class Karsilastir {\n    public static void main(String[] args) {\n        System.out.println(Integer.valueOf(8).compareTo(Integer.valueOf(2)));\n        System.out.println(\"ABC\".compareTo(\"ABE\"));\n        System.out.println(\"Ali\".compareTo(\"Ali\"));\n        System.out.println(\"b\".compareTo(\"a\"));\n        System.out.println(\"AB\".compareTo(\"ABCD\"));\n    }\n}",
            "output": "1\n-2\n0\n1\n-2",
            "a": "Integer: 8 &gt; 2 → <b>1</b>. \"ABC\"/\"ABE\": 'C'−'E' = <b>-2</b>. Eşit stringler → <b>0</b>. 'b'−'a' = <b>1</b>. \"AB\" öneki → uzunluk farkı 2−4 = <b>-2</b>."
          },
          {
            "type": "mc",
            "q": "Integer n = 5; için hangisi <b>false</b> olur?",
            "options": [
              "n instanceof Integer",
              "n instanceof Comparable",
              "n instanceof Number",
              "Hiçbiri, hepsi true"
            ],
            "answer": 3,
            "a": "Integer, Number'ın alt sınıfıdır ve Comparable&lt;Integer&gt;'ı uygular; hepsi true."
          },
          {
            "type": "fill",
            "q": "ComparableRectangle sınıf başlığını tamamla:",
            "code": "public class ComparableRectangle ⟦0⟧ Rectangle\n        ⟦1⟧ Comparable<⟦2⟧> {\n    public int ⟦3⟧(ComparableRectangle o) { ... }\n}",
            "answers": [
              [
                "extends"
              ],
              [
                "implements"
              ],
              [
                "ComparableRectangle"
              ],
              [
                "compareTo"
              ]
            ],
            "a": "Önce extends, sonra implements; generic tip sınıfın kendisi."
          },
          {
            "type": "fill",
            "prose": true,
            "q": "Slide04 s.24",
            "text": "Her wrapper sınıfı, Object sınıfında tanımlanan toString, ⟦0⟧ ve ⟦1⟧ yöntemlerini override eder. Tüm nümerik wrapper sınıfları ve ⟦2⟧ sınıfı Comparable arayüzünü uygular.",
            "answers": [
              [
                "equals",
                "hashCode"
              ],
              [
                "hashCode",
                "equals"
              ],
              [
                "Character"
              ]
            ],
            "a": ""
          },
          {
            "type": "mc",
            "q": "<code>java.util.Arrays.sort(dizi)</code> dizinin öğelerinin Comparable örneği olmasını gerektirir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "Değilse çalışma zamanında ClassCastException."
          }
        ]
      },
      {
        "id": "cloneable",
        "title": "Cloneable: işaretleyici (marker) arayüz ve clone()",
        "en": "The Cloneable Interface",
        "src": "Liang 13.7 · 2025 vizesi",
        "minutes": 7,
        "blocks": [
          {
            "t": "def",
            "term": "İşaretleyici arayüz",
            "en": "Marker interface",
            "html": "Hiç metot ve sabit içermeyen arayüz. Sınıfa bir yetenek <b>etiketi</b> koyar. <code>Cloneable</code> böyledir: \"bu sınıfın nesneleri klonlanabilir\" diye <b>işaretler</b>."
          },
          {
            "t": "code",
            "lang": "java",
            "text": "package java.lang;\npublic interface Cloneable {\n}"
          },
          {
            "t": "list",
            "ordered": true,
            "items": [
              "Sınıf <code>implements Cloneable</code> der.",
              "<code>clone()</code> metodunu <b>override</b> eder. Object'teki <code>clone()</code> <b>protected</b> olduğu için override ederken <b>public</b> yapılır.",
              "Gövdede <code>super.clone()</code> çağrılır; sonuç <code>Object</code> olduğundan <b>cast</b> edilir.",
              "<code>super.clone()</code> kontrollü <code>CloneNotSupportedException</code> fırlatabilir → yakala ya da <code>throws</code> ile bildir.",
              "Sınıf Cloneable <b>değilse</b> <code>super.clone()</code> çalışma zamanında CloneNotSupportedException fırlatır."
            ]
          },
          {
            "t": "compare",
            "cols": [
              {
                "title": "Sığ kopya (shallow)",
                "items": [
                  "<code>super.clone()</code>'un varsayılanı",
                  "İlkel alanlar kopyalanır",
                  "Referans alanlar (dizi, Date…) <b>aynı nesneyi</b> gösterir: birinde değişiklik diğerini etkiler"
                ]
              },
              {
                "title": "Derin kopya (deep)",
                "items": [
                  "Referans alanlar da ayrıca klonlanır: <code>kopya.odalar = odalar.clone();</code>",
                  "Kopya ile orijinal tamamen bağımsız"
                ]
              }
            ]
          },
          {
            "t": "note",
            "kind": "exam",
            "html": "2025 vizesi boşlukları: \"Cloneable arayüzü <b>işaretleyici (marker)</b> arayüzüdür; metot içermez ama bir sınıfın klonlanabilir olduğunu <b>belirtmek / işaretlemek</b> için kullanılır.\" · \"Cloneable'ı uygulayan sınıfta nesnenin kopyalanabilmesi için <b>clone()</b> metodu override edilmelidir.\""
          },
          {
            "t": "h",
            "text": "Kodda gör"
          },
          {
            "t": "dg",
            "id": "tr-cloneable"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "prose": true,
            "q": "2025 vize",
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
                "belirtmek (işaretlemek)",
                "etiketlemek"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "2025 vize",
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
            "type": "mc",
            "q": "Object sınıfındaki <code>clone()</code> metodunun erişim belirleyicisi nedir?",
            "options": [
              "public",
              "protected",
              "private",
              "default"
            ],
            "answer": 1,
            "a": "Bu yüzden override ederken public yapılır."
          },
          {
            "type": "mc",
            "q": "Sığ kopyalanmış iki Ev nesnesi aynı <code>int[] odalar</code> dizisini paylaşıyor. <code>kopya.getOdalar()[0] = 99</code> sonrası orijinalin ilk odası?",
            "options": [
              "Değişmez",
              "99 olur",
              "Derleme hatası",
              "CloneNotSupportedException"
            ],
            "answer": 1,
            "a": "Sığ kopyada referans alanlar aynı nesneyi gösterir."
          },
          {
            "type": "write",
            "q": "Slayttaki <b>House</b> sınıfı (s.31–33): Cloneable + Comparable. Çıktıyı yazınız; kopya sığ mı derin mi?",
            "given": "public class House implements Cloneable, Comparable<House> {\n    private int id;\n    private double area;\n    private java.util.Date whenBuilt;\n\n    public House(int id, double area) {\n        this.id = id;\n        this.area = area;\n        whenBuilt = new java.util.Date();\n    }\n\n    public java.util.Date getWhenBuilt() { return whenBuilt; }\n\n    @Override\n    public Object clone() {\n        try {\n            House houseClone = (House) super.clone();               // sığ kopya\n            houseClone.whenBuilt = (java.util.Date) whenBuilt.clone(); // derin kopya için\n            return houseClone;\n        } catch (CloneNotSupportedException ex) {\n            return null;\n        }\n    }\n\n    @Override\n    public int compareTo(House o) {\n        return Double.compare(area, o.area);\n    }\n\n    public static void main(String[] args) {\n        House house1 = new House(1, 1750.50);\n        House house2 = (House) house1.clone();\n        System.out.println(house1 == house2);\n        System.out.println(house1.getWhenBuilt() == house2.getWhenBuilt());\n        System.out.println(house1.compareTo(house2));\n    }\n}",
            "output": "false\nfalse\n0",
            "a": "Klon farklı nesne → <b>false</b>. whenBuilt da ayrıca klonlandığı için Date nesneleri farklı → <b>false</b> (<b>derin</b> kopya). Sadece <code>super.clone()</code> olsaydı ikinci satır <b>true</b> olurdu (<b>sığ</b> kopya: iki ev aynı Date'i paylaşır). Alanlar eşit → compareTo <b>0</b>."
          },
          {
            "type": "mc",
            "q": "Cloneable arayüzü clone() metodunu tanımlar.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Cloneable <b>boştur</b> (marker). clone() <b>Object</b> sınıfında tanımlıdır (protected); Cloneable sadece \"bu sınıf klonlanabilir\" diye işaretler."
          }
        ]
      },
      {
        "id": "rational",
        "title": "Örnek olay: Rational sınıfı (Number + Comparable)",
        "en": "The Rational Class",
        "src": "Slide04 s.38, 45 · Liang 13.9",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "Bölümün bütün fikirleri tek sınıfta: <code>Rational</code> (rasyonel sayı, <b>pay/payda</b>) hem <b>soyut Number</b>'dan türer hem <b>Comparable</b>'ı uygular:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public class Rational extends Number implements Comparable<Rational>"
          },
          {
            "t": "list",
            "items": [
              "<b>Number'dan türediği için</b> 4 soyut metodu uygulamak zorunda: <code>intValue, longValue, floatValue, doubleValue</code>. Uygulamasaydı Rational da abstract olmak zorunda kalırdı.",
              "<b>Comparable olduğu için</b> <code>compareTo</code> yazılır; Rational dizisi <code>Arrays.sort</code> ile sıralanabilir.",
              "Yapıcı kesri <b>sadeleştirir</b>: <code>new Rational(4, 2)</code> → <b>2</b>; payda her zaman pozitif tutulur (işaret paya taşınır).",
              "<code>gcd</code> (en büyük ortak bölen) <b><code>private</code></b>: sadece sınıfın içinde kullanılır, istemcinin işi değil (s.45).",
              "Ayrıca <code>toString</code> (payda 1 ise sadece pay yazar) ve <code>equals</code> override edilir; no-arg yapıcı <code>Rational()</code> = 0/1.",
              "<code>add / subtract / multiply / divide</code> yeni Rational döndürür; nesnenin kendisi değişmez (<b>immutable</b>)."
            ]
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Neden Number'dan türetiyoruz? Böylece Rational, Integer/Double ile aynı listeye girip <code>getLargestNumber(ArrayList&lt;Number&gt;)</code> gibi genel metotlarda kullanılabilir. Soyut sınıfın kazancı budur."
          },
          {
            "t": "h",
            "text": "Kodda gör: TestRationalClass"
          },
          {
            "t": "dg",
            "id": "tr-rational"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "<code>System.out.println(new Rational(6, 3));</code> ne yazar?",
            "options": [
              "6/3",
              "2/1",
              "2",
              "2.0"
            ],
            "answer": 2,
            "a": "Yapıcı gcd ile sadeleştirir (2/1); toString payda 1 ise sadece payı yazar."
          },
          {
            "type": "mc",
            "q": "Rational, Number'dan türeyip <code>doubleValue()</code>'yu uygulamasaydı ne olurdu?",
            "options": [
              "Sorun olmaz, Number'ınki kullanılır",
              "Derleme hatası; Rational abstract bildirilmedikçe",
              "Çalışma zamanında hata",
              "doubleValue 0 döndürür"
            ],
            "answer": 1,
            "a": "doubleValue Number'da soyuttur; somut alt sınıf onu uygulamak zorunda."
          },
          {
            "type": "fill",
            "q": "Rational sınıf başlığını tamamla:",
            "code": "public class Rational ⟦0⟧ Number ⟦1⟧ Comparable<Rational> {\n    ⟦2⟧ static long gcd(long n, long d) { ... }   // sadece sınıf içi\n}",
            "answers": [
              [
                "extends"
              ],
              [
                "implements"
              ],
              [
                "private"
              ]
            ],
            "a": "gcd istemci için değil, sadece iç kullanım için → private."
          },
          {
            "type": "write",
            "q": "Çıktıyı yazınız.",
            "given": "// Rational: Number'dan türer (soyut metotları uygular) + Comparable (s.38)\nclass Rational extends Number implements Comparable<Rational> {\n    private long numerator = 0;     // pay\n    private long denominator = 1;   // payda\n\n    public Rational() { this(0, 1); }          // no-arg yapıcı (tasarım kuralı)\n\n    public Rational(long numerator, long denominator) {\n        long gcd = gcd(numerator, denominator);\n        this.numerator = ((denominator > 0) ? 1 : -1) * numerator / gcd;\n        this.denominator = Math.abs(denominator) / gcd;\n    }\n\n    // private: sadece sınıf içi kullanım (s.45)\n    private static long gcd(long n, long d) {\n        long n1 = Math.abs(n), n2 = Math.abs(d);\n        int gcd = 1;\n        for (int k = 1; k <= n1 && k <= n2; k++)\n            if (n1 % k == 0 && n2 % k == 0) gcd = k;\n        return gcd;\n    }\n\n    public long getNumerator() { return numerator; }\n    public long getDenominator() { return denominator; }\n\n    public Rational add(Rational s) {\n        long n = numerator * s.getDenominator() + denominator * s.getNumerator();\n        return new Rational(n, denominator * s.getDenominator());\n    }\n    public Rational subtract(Rational s) {\n        long n = numerator * s.getDenominator() - denominator * s.getNumerator();\n        return new Rational(n, denominator * s.getDenominator());\n    }\n    public Rational multiply(Rational s) {\n        return new Rational(numerator * s.getNumerator(), denominator * s.getDenominator());\n    }\n    public Rational divide(Rational s) {\n        return new Rational(numerator * s.getDenominator(), denominator * s.numerator);\n    }\n\n    @Override\n    public String toString() {\n        if (denominator == 1) return numerator + \"\";\n        else return numerator + \"/\" + denominator;\n    }\n\n    @Override\n    public boolean equals(Object other) {\n        return (this.subtract((Rational) other)).getNumerator() == 0;\n    }\n\n    // Number'ın soyut metotları\n    @Override public int intValue() { return (int) doubleValue(); }\n    @Override public float floatValue() { return (float) doubleValue(); }\n    @Override public double doubleValue() { return numerator * 1.0 / denominator; }\n    @Override public long longValue() { return (long) doubleValue(); }\n\n    @Override\n    public int compareTo(Rational o) {\n        if (this.subtract(o).getNumerator() > 0) return 1;\n        else if (this.subtract(o).getNumerator() < 0) return -1;\n        else return 0;\n    }\n}\n\npublic class Kesir {\n    public static void main(String[] args) {\n        Rational a = new Rational(1, 4);\n        Rational b = new Rational(3, -4);\n        System.out.println(b);\n        System.out.println(a.add(b));\n        System.out.println(a.multiply(new Rational(8, 1)));\n        System.out.println(a.compareTo(b));\n    }\n}",
            "output": "-3/4\n-1/2\n2\n1",
            "a": "3/−4 yapıcıda <b>-3/4</b> olur (işaret paya). 1/4 + (−3/4) = −2/4 → sadeleşir <b>-1/2</b>. 1/4 · 8 = 8/4 → <b>2</b>. 1/4 &gt; −3/4 → <b>1</b>."
          }
        ]
      },
      {
        "id": "sinif-tasarimi",
        "title": "Sınıf tasarım yönergeleri ve arayüzün kalan detayları",
        "en": "Class Design Guidelines",
        "src": "Slide04 s.17–22, 34–37, 39–46 · Liang 13.10",
        "minutes": 8,
        "blocks": [
          {
            "t": "p",
            "html": "Slaytın son 8 sayfası kod değil, <b>tasarım kuralları</b>. Boşluk doldurma ve \"açıklayınız\" sorusuna en uygun kısım burası. Her kuralı bir örnekle öğren."
          },
          {
            "t": "table",
            "head": [
              "Kural (slayt)",
              "Ne diyor?",
              "Örnek"
            ],
            "rows": [
              [
                "<b>Tutarlılık</b> (cohesion, s.39)",
                "Bir sınıf <b>tek bir varlığı</b> tanımlamalı; tüm işlemleri tutarlı bir amaca hizmet etmeli.",
                "Öğrenci için bir sınıf olur ama <b>öğrenci ve personel aynı sınıfta birleştirilmez</b>."
              ],
              [
                "<b>Sorumlulukları ayırmak</b> (s.40)",
                "Çok fazla sorumluluğu olan sınıf birkaç sınıfa bölünür.",
                "<code>String</code> değişmez (immutable) stringler; <code>StringBuilder</code> değiştirilebilir stringler; <code>StringBuffer</code> = StringBuilder + <b>senkronize</b> metotlar."
              ],
              [
                "<b>Yeniden kullanım</b> (s.41)",
                "Kullanıcıya <b>ne / ne zaman</b> yapacağı konusunda kısıt koyma; özellikler <b>her değer kombinasyonuyla</b> ayarlanabilmeli, metotlar <b>çağrılma sırasından bağımsız</b> çalışmalı.",
                "set metotlarını hangi sırayla çağırırsan çağır nesne tutarlı kalmalı."
              ],
              [
                "<b>No-arg yapıcı + override</b> (s.42)",
                "<b>Public no-arg yapıcı</b> sağla; mümkünse Object'ten gelen <code>equals</code> ve <code>toString</code>'i override et.",
                "<code>Rational()</code>, <code>Rational.toString()</code>"
              ],
              [
                "<b>Adlandırma ve düzen</b> (s.43)",
                "Standart Java stili ve açıklayıcı adlar. <b>Veri alanları → yapıcılar → metotlar</b> sırası. Her zaman yapıcı sağla, değişkenleri başlat.",
                "<code>class Ogrenci { alanlar; Ogrenci(){...}; metotlar }</code>"
              ],
              [
                "<b>İki kontrat</b> (s.44)",
                "Sınıf iki kontrat sunar: <b>kullanıcılar</b> için (alanlar <code>private</code>, erişimciler <code>public</code>) ve <b>genişleticiler</b> (alt sınıflar) için (alanlar/metotlar <code>protected</code>). Genişleticilerin kontratı kullanıcılarınkini kapsar.",
                "Alt sınıf bir metodun görünürlüğünü <b>protected → public artırabilir</b>, ama kontratı ihlal edecek şekilde değiştirmemeli."
              ],
              [
                "<b>Veri gizleme</b> (s.45)",
                "Veri <code>private</code>; erişim <b>get/set</b> ile, ve <b>sadece</b> kullanıcının görmesi/değiştirmesi gereken veriye. İstemciye yönelik olmayan <b>metotlar da gizlenir</b>.",
                "<code>Rational.gcd</code> <b>private</b>."
              ],
              [
                "<b>static</b> (s.46)",
                "Sınıfın <b>tüm örneklerince paylaşılan</b> özellik <code>static</code> bildirilmeli.",
                "Oluşturulan nesne sayısı: <code>static int count</code>."
              ]
            ]
          },
          {
            "t": "note",
            "kind": "exam",
            "html": "Muhtemel boşluk: \"Sınıfın tüm örnekleri tarafından paylaşılan bir özellik <b>statik</b> olarak bildirilmelidir.\" · \"Bir sınıf, verilerini istemcilerden gizlemek için <b>private</b> anahtar kelimesini kullanmalıdır.\" · \"Bir sınıf <b>tek bir varlığı</b> tanımlamalıdır (tutarlılık).\""
          },
          {
            "t": "h",
            "text": "Arayüz: slaytta olup gözden kaçabilecek cümleler"
          },
          {
            "t": "list",
            "items": [
              "<b>Motivasyon (s.2):</b> arayüz, <b>ilgisiz sınıflar dahil</b> sınıflar için ortak davranış tanımlar (Chicken ve Apple ikisi de Edible).",
              "<b>Arayüz özel bir sınıftır (s.20):</b> her arayüz, normal sınıf gibi <b>ayrı bir bayt kodu (.class) dosyasına</b> derlenir. <code>new</code> ile örneği oluşturulamaz ama değişken tipi olarak ve cast sonucunda kullanılabilir.",
              "<b>Sabite erişim (s.22):</b> <code>ArayuzAdi.SABIT_ADI</code>, örneğin <code>T1.K</code>. <code>int K = 1;</code> yazmak = <code>public static final int K = 1;</code>, <code>void p();</code> = <code>public abstract void p();</code>.",
              "<b>Tek kök yok (s.35):</b> tüm sınıfların kökü <code>Object</code>'tir, ama <b>arayüzlerin tek bir kökü yoktur</b>. Arayüz de bir <b>tür</b> tanımlar; arayüz tipindeki değişken, onu uygulayan herhangi bir sınıfın nesnesini gösterebilir ve cast edilebilir.",
              "<b>Çakışma (s.36):</b> iki arayüzde farklı değerli aynı adlı sabit veya aynı imzalı ama farklı dönüş tipli metot → <b>derleyici yakalar</b>.",
              "<b>Arayüz mü sınıf mı (s.37):</b> <b>güçlü</b> ebeveyn-çocuk ilişkisi (staff member bir personeldir) → <b>sınıf</b>. <b>Zayıf</b> ilişki, bir özelliğe sahip olma (String karşılaştırılabilir) → <b>arayüz</b>. Çoklu miras gerekiyorsa birini üst sınıf, diğerlerini arayüz yap."
            ]
          },
          {
            "t": "code",
            "lang": "java",
            "text": "interface T1 {\n    int K = 1;          // public static final\n    void p();           // public abstract\n}\n\nclass Uygula implements T1 {\n    public void p() {   // public ZORUNLU: arayüzdeki p() public\n        System.out.println(\"K = \" + T1.K);\n    }\n}"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "Arayüz metodunu uygularken <code>public</code> yazmazsan <b>derleme hatası</b>: görünürlük daraltılamaz (public → paket). Bu, \"iki kontrat\" kuralının tersi: görünürlük <b>artırılabilir</b>, azaltılamaz."
          }
        ],
        "checks": [
          {
            "type": "fill",
            "prose": true,
            "q": "Slide04 s.39–46",
            "text": "Bir sınıf tek bir ⟦0⟧ tanımlamalı ve tüm işlemleri tutarlı bir amacı desteklemelidir. Sınıfın tüm örnekleri tarafından paylaşılan bir özellik ⟦1⟧ olarak bildirilmelidir. Veriler istemcilerden ⟦2⟧ anahtar kelimesiyle gizlenir ve onlara ⟦3⟧ ve set yöntemleriyle erişilir.",
            "answers": [
              [
                "varlığı",
                "varlık",
                "entity"
              ],
              [
                "statik",
                "static"
              ],
              [
                "private"
              ],
              [
                "get"
              ]
            ],
            "a": ""
          },
          {
            "type": "mc",
            "q": "String, StringBuilder ve StringBuffer'ın ayrı sınıflar olması hangi tasarım ilkesine örnektir?",
            "options": [
              "Tutarlılık",
              "Sorumlulukları ayırmak",
              "Veri gizleme",
              "static kullanımı"
            ],
            "answer": 1,
            "a": "Hepsi stringlerle ilgilenir ama sorumlulukları farklıdır: değişmez / değiştirilebilir / senkronize değiştirilebilir."
          },
          {
            "type": "mc",
            "q": "Rational sınıfındaki <code>gcd</code> metodunun <code>private</code> olmasının sebebi nedir?",
            "options": [
              "static olduğu için",
              "Sadece sınıf içinde dahili kullanım içindir",
              "Override edilmesin diye zorunlu",
              "Number sınıfı öyle istediği için"
            ],
            "answer": 1,
            "a": "İstemci kullanımı için tasarlanmamış metotlar da gizlenmelidir (s.45)."
          },
          {
            "type": "mc",
            "q": "Tüm arayüzlerin ortak tek bir kök arayüzü vardır, tıpkı sınıflardaki Object gibi.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Sınıfların tek kökü Object'tir; arayüzlerin tek kökü yoktur."
          },
          {
            "type": "mc",
            "q": "Her arayüz, normal bir sınıf gibi ayrı bir bayt kodu dosyasına derlenir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "Arayüz özel bir sınıf gibi ele alınır (s.20)."
          },
          {
            "type": "mc",
            "q": "Bir sınıf, farklı dönüş tipine sahip aynı imzalı metot içeren iki arayüzü uygularsa hata çalışma zamanında ortaya çıkar.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Bu tür çakışmaları <b>derleyici</b> yakalar (s.36)."
          },
          {
            "type": "mc",
            "q": "\"Personel üyesi bir personeldir\" ilişkisi ve \"String karşılaştırılabilirdir\" ilişkisi sırasıyla nasıl modellenir?",
            "options": [
              "Arayüz / sınıf",
              "Sınıf / arayüz",
              "İkisi de arayüz",
              "İkisi de sınıf"
            ],
            "answer": 1,
            "a": "Güçlü ebeveyn-çocuk → sınıf (kalıtım). Zayıf, özellik belirten → arayüz (Comparable)."
          },
          {
            "type": "mc",
            "q": "Bir arayüzdeki <code>int K = 1;</code> sabitine sınıf dışından nasıl erişilir? (Arayüz adı T1)",
            "options": [
              "new T1().K",
              "T1.K",
              "T1->K",
              "Erişilemez, private"
            ],
            "answer": 1,
            "a": "Sabit public static final olduğu için ArayuzAdi.SABIT sözdizimi."
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

  T("tr-soyut-kurallar", {
    "files": [
      {
        "name": "SoyutKurallar.java",
        "code": "\nabstract class Hayvan {\n    private String ad;\n\n    public Hayvan(String ad) {          // soyut sınıfın yapıcısı OLABİLİR\n        this.ad = ad;\n        System.out.println(\"Hayvan yapıcısı: \" + ad);\n    }\n\n    public String getAd() { return ad; }\n\n    public abstract String ses();       // gövdesiz, ; ile biter\n}\n\nclass Kedi extends Hayvan {\n    public Kedi(String ad) { super(ad); }\n\n    @Override\n    public String ses() { return \"Miyav\"; }\n}\n\n// Soyut metodu uygulamayan alt sınıf da abstract olmak ZORUNDA\nabstract class EvcilHayvan extends Hayvan {\n    public EvcilHayvan(String ad) { super(ad); }\n}\n\n// Soyut metodu OLMAYAN soyut sınıf da geçerli: sadece new'i engeller\nabstract class Arac {\n    public void bilgi() { System.out.println(\"Ben bir aracım\"); }\n}\n\nclass Tasit {\n    public String toString() { return \"somut toString\"; }\n}\n// Somut bir metot alt sınıfta SOYUT olarak override edilebilir\nabstract class SoyutTasit extends Tasit {\n    @Override\n    public abstract String toString();\n}\n\npublic class SoyutKurallar {\n    public static void main(String[] args) {\n        // Hayvan h = new Hayvan(\"x\");   // DERLEME HATASI: abstract sınıf örneklenemez\n        Hayvan h = new Kedi(\"Tekir\");     // ama TİP olarak kullanılabilir\n        System.out.println(h.getAd() + \" der ki \" + h.ses());\n\n        Hayvan[] dizi = new Hayvan[3];    // referans dizisi de serbest (nesne yok)\n        System.out.println(\"Dizi uzunluğu: \" + dizi.length + \", ilk eleman: \" + dizi[0]);\n    }\n}"
      }
    ],
    "output": "Hayvan yapıcısı: Tekir\nTekir der ki Miyav\nDizi uzunluğu: 3, ilk eleman: null"
  });

  T("tr-arayuz-kurallar", {
    "files": [
      {
        "name": "ArayuzKurallar.java",
        "code": "\ninterface Kontrol {\n    int MAX = 100;                 // = public static final int MAX = 100;\n    void ac();                     // = public abstract void ac();\n    void kapat();\n}\n\ninterface Olcum {\n    double deger();\n}\n\n// Bir arayüz başka arayüzleri extends ile genişletebilir (birden çok)\ninterface AkilliSensor extends Kontrol, Olcum {\n    String ad();\n}\n\nabstract class Cihaz {\n    private String ad;\n    public Cihaz(String ad) { this.ad = ad; }\n    public String getAd() { return ad; }\n}\n\n// ÖNCE extends, SONRA implements; birden çok arayüz virgülle\nclass Termostat extends Cihaz implements Kontrol, Olcum {\n    private boolean acik;\n\n    public Termostat(String ad) { super(ad); }\n\n    @Override public void ac() { acik = true; }        // public yazmak ZORUNLU\n    @Override public void kapat() { acik = false; }\n    @Override public double deger() { return acik ? 22.5 : 0; }\n}\n\npublic class ArayuzKurallar {\n    public static void main(String[] args) {\n        Termostat t = new Termostat(\"Salon\");\n        Kontrol k = t;                 // arayüz tipinde referans\n        k.ac();\n        // k.deger();                  // DERLEME HATASI: Kontrol'de deger() yok\n        System.out.println(t.getAd() + \" ölçüm: \" + ((Olcum) k).deger());\n        System.out.println(\"MAX = \" + Kontrol.MAX);\n        System.out.println(t instanceof Kontrol);   // arayüzle de çalışır\n        System.out.println(t instanceof Olcum);\n        // Kontrol.MAX = 5;            // DERLEME HATASI: final alana atama\n    }\n}"
      }
    ],
    "output": "Salon ölçüm: 22.5\nMAX = 100\ntrue\ntrue"
  });

  T("tr-comparable", {
    "files": [
      {
        "name": "Siralama.java",
        "code": "\nimport java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.Collections;\n\nclass Araba implements Comparable<Araba> {\n    private String model;\n    private int hiz;\n    private double fiyat;\n\n    public Araba(String model, int hiz, double fiyat) {\n        this.model = model;\n        this.hiz = hiz;\n        this.fiyat = fiyat;\n    }\n\n    public int getHiz() { return hiz; }\n\n    // negatif: this önce gelir · 0: eşit · pozitif: this sonra gelir\n    @Override\n    public int compareTo(Araba diger) {\n        return Double.compare(this.fiyat, diger.fiyat);\n    }\n\n    @Override\n    public String toString() { return model + \"(\" + fiyat + \")\"; }\n}\n\npublic class Siralama {\n    public static void main(String[] args) {\n        ArrayList<Araba> liste = new ArrayList<>();\n        liste.add(new Araba(\"Clio\", 180, 950000));\n        liste.add(new Araba(\"Egea\", 175, 820000));\n        liste.add(new Araba(\"Golf\", 210, 1400000));\n\n        Araba a = liste.get(0), b = liste.get(1);\n        System.out.println(\"Clio.compareTo(Egea) = \" + a.compareTo(b));\n        System.out.println(\"Egea.compareTo(Clio) = \" + b.compareTo(a));\n\n        Collections.sort(liste);                 // compareTo'ya göre sıralar\n        System.out.println(\"Fiyata göre: \" + liste);\n        System.out.println(\"En ucuz: \" + Collections.min(liste));\n\n        Integer[] sayilar = {5, 2, 9};           // Integer zaten Comparable\n        Arrays.sort(sayilar);\n        System.out.println(Arrays.toString(sayilar));\n    }\n}"
      }
    ],
    "output": "Clio.compareTo(Egea) = 1\nEgea.compareTo(Clio) = -1\nFiyata göre: [Egea(820000.0), Clio(950000.0), Golf(1400000.0)]\nEn ucuz: Egea(820000.0)\n[2, 5, 9]"
  });

  T("tr-cloneable", {
    "files": [
      {
        "name": "KlonTest.java",
        "code": "\nclass Ev implements Cloneable {\n    private int id;\n    private double alan;\n    private int[] odalar;                 // referans tipli alan\n\n    public Ev(int id, double alan, int[] odalar) {\n        this.id = id;\n        this.alan = alan;\n        this.odalar = odalar;\n    }\n\n    public int[] getOdalar() { return odalar; }\n\n    // Object.clone() protected'dır → public olarak override edilir\n    @Override\n    public Ev clone() throws CloneNotSupportedException {\n        Ev kopya = (Ev) super.clone();    // alan alan (sığ) kopya\n        kopya.odalar = odalar.clone();    // derin kopya: diziyi de kopyala\n        return kopya;\n    }\n}\n\nclass Kutu {                               // Cloneable DEĞİL\n    public Object kopyala() throws CloneNotSupportedException {\n        return super.clone();\n    }\n}\n\npublic class KlonTest {\n    public static void main(String[] args) throws CloneNotSupportedException {\n        Ev e1 = new Ev(1, 120.5, new int[]{3, 1});\n        Ev e2 = e1.clone();\n\n        System.out.println(e1 == e2);                          // farklı nesneler\n        System.out.println(e1.getOdalar() == e2.getOdalar());  // derin kopya → false\n        e2.getOdalar()[0] = 99;\n        System.out.println(e1.getOdalar()[0]);                 // etkilenmez: 3\n\n        try {\n            new Kutu().kopyala();\n        } catch (CloneNotSupportedException ex) {\n            System.out.println(\"Kutu: \" + ex);\n        }\n    }\n}"
      }
    ],
    "output": "false\nfalse\n3\nKutu: java.lang.CloneNotSupportedException: Kutu"
  });

  T("tr-number-calendar", {
    "files": [
      {
        "name": "NumberCalendar.java",
        "code": "\nimport java.math.BigDecimal;\nimport java.math.BigInteger;\nimport java.util.ArrayList;\nimport java.util.Calendar;\nimport java.util.GregorianCalendar;\n\npublic class NumberCalendar {\n    // Parametre tipi SOYUT Number: Integer, Double, BigInteger, BigDecimal... hepsi gelebilir\n    public static Number getLargestNumber(ArrayList<Number> list) {\n        if (list == null || list.size() == 0) return null;\n        Number number = list.get(0);\n        for (int i = 1; i < list.size(); i++)\n            if (number.doubleValue() < list.get(i).doubleValue())   // doubleValue() Number'da abstract\n                number = list.get(i);\n        return number;\n    }\n\n    public static void main(String[] args) {\n        ArrayList<Number> list = new ArrayList<>();\n        list.add(45);                                        // Integer (autoboxing)\n        list.add(3445.53);                                   // Double\n        list.add(new BigInteger(\"3432323234344343101\"));     // BigInteger\n        list.add(new BigDecimal(\"2.0909090989091343433344343\"));\n        System.out.println(\"En büyük: \" + getLargestNumber(list));\n\n        // Calendar soyut → new Calendar() YOK; alt sınıfı GregorianCalendar\n        Calendar c = new GregorianCalendar(2026, 10, 17);    // AY 0 TABANLI: 10 = Kasım!\n        System.out.println(\"YEAR: \" + c.get(Calendar.YEAR));\n        System.out.println(\"MONTH: \" + c.get(Calendar.MONTH));          // 10 (Kasım)\n        System.out.println(\"DAY_OF_MONTH: \" + c.get(Calendar.DAY_OF_MONTH));\n        System.out.println(\"DAY_OF_WEEK: \" + c.get(Calendar.DAY_OF_WEEK)); // 1 = Pazar\n        System.out.println(\"DAY_OF_YEAR: \" + c.get(Calendar.DAY_OF_YEAR));\n\n        // Calendar Cloneable'dır (slayt s.30)\n        Calendar calendar = new GregorianCalendar(2003, 2, 1);\n        Calendar calendarCopy = (Calendar) calendar.clone();\n        System.out.println(\"calendar == calendarCopy is \" + (calendar == calendarCopy));\n        System.out.println(\"calendar.equals(calendarCopy) is \" + calendar.equals(calendarCopy));\n    }\n}"
      }
    ],
    "output": "En büyük: 3432323234344343101\nYEAR: 2026\nMONTH: 10\nDAY_OF_MONTH: 17\nDAY_OF_WEEK: 3\nDAY_OF_YEAR: 321\ncalendar == calendarCopy is false\ncalendar.equals(calendarCopy) is true"
  });

  T("tr-comparable-ornekler", {
    "files": [
      {
        "name": "SortRectangles.java",
        "code": "\nclass Rectangle {\n    private double width, height;\n    public Rectangle(double width, double height) { this.width = width; this.height = height; }\n    public double getArea() { return width * height; }\n    @Override\n    public String toString() { return \"Width: \" + width + \" Height: \" + height + \" Area: \" + getArea(); }\n}\n\n// Rectangle'dan miras al + Comparable sözleşmesini üstlen (slayt s.28)\nclass ComparableRectangle extends Rectangle implements Comparable<ComparableRectangle> {\n    public ComparableRectangle(double width, double height) { super(width, height); }\n\n    @Override\n    public int compareTo(ComparableRectangle o) {      // alana göre doğal sıralama\n        if (getArea() > o.getArea()) return 1;\n        else if (getArea() < o.getArea()) return -1;\n        else return 0;\n    }\n}\n\npublic class SortRectangles {\n    public static void main(String[] args) {\n        // s.26: hazır sınıfların compareTo'su\n        System.out.println(Integer.valueOf(3).compareTo(Integer.valueOf(5)));   // -1\n        System.out.println(\"ABC\".compareTo(\"ABE\"));                             // 'C'-'E' = -2\n        System.out.println(new java.util.Date(2013, 1, 1).compareTo(new java.util.Date(2012, 1, 1))); // 1\n\n        // s.27: String hem String, hem Object, hem Comparable'dır\n        String s = \"Java\";\n        Integer n = 7;\n        System.out.println((s instanceof Comparable) + \" \" + (n instanceof Comparable) + \" \" + (n instanceof Object));\n\n        ComparableRectangle[] rectangles = {\n            new ComparableRectangle(3.4, 5.4),\n            new ComparableRectangle(13.24, 55.4),\n            new ComparableRectangle(7.4, 35.4),\n            new ComparableRectangle(1.4, 25.4)\n        };\n        java.util.Arrays.sort(rectangles);                 // compareTo'yu kullanır\n        for (Rectangle r : rectangles) System.out.println(r);\n    }\n}"
      }
    ],
    "output": "-1\n-2\n1\ntrue true true\nWidth: 3.4 Height: 5.4 Area: 18.36\nWidth: 1.4 Height: 25.4 Area: 35.559999999999995\nWidth: 7.4 Height: 35.4 Area: 261.96\nWidth: 13.24 Height: 55.4 Area: 733.496"
  });

  T("tr-rational", {
    "files": [
      {
        "name": "TestRationalClass.java",
        "code": "\n// Rational: Number'dan türer (soyut metotları uygular) + Comparable (s.38)\nclass Rational extends Number implements Comparable<Rational> {\n    private long numerator = 0;     // pay\n    private long denominator = 1;   // payda\n\n    public Rational() { this(0, 1); }          // no-arg yapıcı (tasarım kuralı)\n\n    public Rational(long numerator, long denominator) {\n        long gcd = gcd(numerator, denominator);\n        this.numerator = ((denominator > 0) ? 1 : -1) * numerator / gcd;\n        this.denominator = Math.abs(denominator) / gcd;\n    }\n\n    // private: sadece sınıf içi kullanım (s.45)\n    private static long gcd(long n, long d) {\n        long n1 = Math.abs(n), n2 = Math.abs(d);\n        int gcd = 1;\n        for (int k = 1; k <= n1 && k <= n2; k++)\n            if (n1 % k == 0 && n2 % k == 0) gcd = k;\n        return gcd;\n    }\n\n    public long getNumerator() { return numerator; }\n    public long getDenominator() { return denominator; }\n\n    public Rational add(Rational s) {\n        long n = numerator * s.getDenominator() + denominator * s.getNumerator();\n        return new Rational(n, denominator * s.getDenominator());\n    }\n    public Rational subtract(Rational s) {\n        long n = numerator * s.getDenominator() - denominator * s.getNumerator();\n        return new Rational(n, denominator * s.getDenominator());\n    }\n    public Rational multiply(Rational s) {\n        return new Rational(numerator * s.getNumerator(), denominator * s.getDenominator());\n    }\n    public Rational divide(Rational s) {\n        return new Rational(numerator * s.getDenominator(), denominator * s.numerator);\n    }\n\n    @Override\n    public String toString() {\n        if (denominator == 1) return numerator + \"\";\n        else return numerator + \"/\" + denominator;\n    }\n\n    @Override\n    public boolean equals(Object other) {\n        return (this.subtract((Rational) other)).getNumerator() == 0;\n    }\n\n    // Number'ın soyut metotları\n    @Override public int intValue() { return (int) doubleValue(); }\n    @Override public float floatValue() { return (float) doubleValue(); }\n    @Override public double doubleValue() { return numerator * 1.0 / denominator; }\n    @Override public long longValue() { return (long) doubleValue(); }\n\n    @Override\n    public int compareTo(Rational o) {\n        if (this.subtract(o).getNumerator() > 0) return 1;\n        else if (this.subtract(o).getNumerator() < 0) return -1;\n        else return 0;\n    }\n}\n\npublic class TestRationalClass {\n    public static void main(String[] args) {\n        Rational r1 = new Rational(4, 2);   // 2'ye sadeleşir\n        Rational r2 = new Rational(2, 3);\n\n        System.out.println(r1 + \" + \" + r2 + \" = \" + r1.add(r2));\n        System.out.println(r1 + \" - \" + r2 + \" = \" + r1.subtract(r2));\n        System.out.println(r1 + \" * \" + r2 + \" = \" + r1.multiply(r2));\n        System.out.println(r1 + \" / \" + r2 + \" = \" + r1.divide(r2));\n        System.out.println(r2 + \" is \" + r2.doubleValue());\n        System.out.println(new Rational(1, 2).equals(new Rational(2, 4)));\n        System.out.println(r1.compareTo(r2));\n    }\n}"
      }
    ],
    "output": "2 + 2/3 = 8/3\n2 - 2/3 = 4/3\n2 * 2/3 = 4/3\n2 / 2/3 = 3\n2/3 is 0.6666666666666666\ntrue\n1"
  });
})(window.OOPLab = window.OOPLab || {});
