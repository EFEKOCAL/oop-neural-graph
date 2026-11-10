/*
 * lessons-ch5.js — Bölüm 5: Vize Provası (Tüm vize konuları).
 * Blok türleri: p, h, list, table, code (lang:'java' renklendirir), note (exam/why/key/trap/warn/extra), dg (şekil), br.
 * checks: { type:'mc', q, code?, options, answer, a } · { type:'fill', q, code (⟦0⟧ boşluk), answers:[[...]], a }
 *         { type:'fill', prose:true, q, text } (kavram cümlesi) · { type:'write', q, given?, rubric, solution, output, a } (problem yaz)
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
      "Kavramları doğru terimle yazabilmek (boşluk doldurma)",
      "Eksik bırakılmış kodu tamamlamak",
      "Birden çok kavramı birleştiren kodun çıktısını adım adım bulmak",
      "Verilen problemin kodunu sınıflar, kalıtım, istisnalar ve dosya/ArrayList ile yazmak"
    ],
    "lessons": [
      {
        "id": "kavram-bosluk",
        "title": "Vize formatı 1: Kavram boşlukları",
        "en": "Fill in the Concepts",
        "src": "Tüm vize konuları",
        "minutes": 25,
        "blocks": [
          {
            "t": "p",
            "html": "Hoca vizede dört tür soru soruyor. Bu bölüm onlara göre dizildi:"
          },
          {
            "t": "table",
            "head": [
              "Sınavdaki tür",
              "Burada çalış"
            ],
            "rows": [
              [
                "<b>1. Boşluk doldurma (kavram)</b>: tanım cümlesinde eksik kelime",
                "Bu ders: tüm bölümlerden 38 cümle"
              ],
              [
                "<b>2. Kodu tamamlama</b>: kodda eksik anahtar kelime / metot",
                "Sonraki ders: <a href=\"#/learn/ch5/kod-tamamla\">Kodu tamamla</a>"
              ],
              [
                "<b>3. Kodu anlama</b>: \"bu kod ne yazdırır, neden?\"",
                "<a href=\"#/learn/ch5/karma-iz\">Karma kod izleme</a> ve <a href=\"#/learn/ch5/deneme-sinavi\">Deneme sınavı</a>"
              ],
              [
                "<b>4. Arka sayfa: problemin kodunu yaz</b>",
                "<a href=\"#/learn/ch5/arka-sayfa\">Arka sayfa problemleri</a>"
              ]
            ]
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Boşluklara Türkçe ya da İngilizce terimi yazabilirsin (ör. \"kapsülleme\" ya da \"encapsulation\"); büyük/küçük harf ve boşluk önemsiz. Sınavda <b>terimin kendisini</b> yazman beklenir; \"şu şey işte\" kabul edilmez. Bu yüzden terimleri tam adıyla ezberle, anlamını derslerden bil."
          },
          {
            "t": "note",
            "kind": "exam",
            "html": "Hocanın en sevdiği kavramlar: hangi yapıcıya gidilir (this(...), super(), varsayılan yapıcı), static ile instance farkı, görünürlük, override/overload, checked/unchecked, throw/throws, finally, wrapper."
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
        "id": "kod-tamamla",
        "title": "Vize formatı 2: Kodu tamamla",
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
        "id": "arka-sayfa",
        "title": "Vize formatı 4: Arka sayfa problemleri",
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
