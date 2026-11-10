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
      "Cloneable (marker interface) ve clone() ile sığ/derin kopya yapmak"
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
})(window.OOPLab = window.OOPLab || {});
