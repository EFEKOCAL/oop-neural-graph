/*
 * lessons-ch3.js — Bölüm 3: İstisna Yönetimi ve Metin I/O (Slide03_BPII.pdf).
 * Blok türleri: p, h, list, table, code (lang:'java' renklendirir), note (exam/why/key/trap/warn/extra), dg (şekil), br.
 * checks: { type:'mc', q, code?, options, answer, a } · { type:'fill', q, code (⟦0⟧ boşluk), answers:[[...]], a }
 * Kod iz sürme şekilleri (tr-*) en altta OOPLab.java.trace ile kaydedilir.
 */
(function (OOPLab) {
  'use strict';

  OOPLab.lessons = OOPLab.lessons || { chapters: [] };

  OOPLab.lessons.chapters.push({
    "id": "ch3",
    "num": 3,
    "title": "İstisna Yönetimi ve Metin I/O",
    "en": "Exception Handling and Text I/O",
    "source": "Slide03_BPII.pdf",
    "objectives": [
      "İstisna hiyerarşisini ve checked / unchecked ayrımını açıklamak",
      "throw, throws ve try-catch-finally ile istisna bildirmek, atmak ve yakalamak",
      "Bir istisnanın çağrı yığınında nasıl yayıldığını adım adım izlemek",
      "Özel istisna sınıfı tanımlamak, yeniden fırlatmak ve zincirlemek",
      "File, PrintWriter, Scanner ve try-with-resources ile metin dosyası okumak/yazmak"
    ],
    "lessons": [
      {
        "id": "istisna-motivasyon",
        "title": "Neden istisna yönetimi? Çalışma zamanı hataları",
        "en": "Runtime Errors",
        "src": "Slide03 · s.2, 4",
        "minutes": 5,
        "blocks": [
          {
            "t": "p",
            "html": "Bir program <b>çalışma zamanı hatası (runtime error)</b> ile karşılaştığında <b>anormal şekilde sonlanır</b>: kalan satırlar hiç çalışmaz ve kullanıcı anlamsız bir yığın izi (stack trace) görür."
          },
          {
            "t": "p",
            "html": "Soru: Programın çökmeden çalışmaya devam etmesini ya da düzgünce kapanmasını nasıl sağlarız?"
          },
          {
            "t": "h",
            "text": "Üç yaklaşım (slayttaki Quotient örnekleri)"
          },
          {
            "t": "list",
            "items": [
              "<b>Quotient</b>: Hiçbir önlem yok → 0'a bölünce program çöker.",
              "<b>QuotientWithIf</b>: <code>if (number2 != 0)</code> ile önceden kontrol. Basit durumlarda işe yarar.",
              "<b>QuotientWithMethod</b>: Bölmeyi bir metoda taşıyıp hata durumunda <code>System.exit(1)</code> ile programı bitirmek. Sorun: metot, <b>çağıranın</b> ne yapmak istediğine karar vermeden programı öldürüyor."
            ],
            "ordered": true
          },
          {
            "t": "p",
            "html": "Bir sonraki derste dördüncü ve doğru yolu göreceğiz: <b>istisna fırlatmak</b>."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Hatayı <b>tespit eden</b> yer (kütüphane metodu) ile hatayla <b>ne yapılacağını bilen</b> yer (onu çağıran kod) genellikle farklıdır. Bölme metodu 0 gelince ne yapacağını bilemez: tekrar sorsun mu, varsayılan değer mi kullansın, kapatsın mı? Bu kararı çağırana bırakmanın mekanizması istisnalardır."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Tam sayı bölmede <code>5 / 0</code> → <code>ArithmeticException: / by zero</code>. Ama <code>5.0 / 0</code> → <code>Infinity</code>, istisna yok!</li><li>Yakalanmayan istisna programı o satırda bitirir; sonraki <code>println</code>'ler çalışmaz.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-istisna-motivasyon"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Aşağıdakilerden hangisi istisna <b>fırlatmaz</b>?",
            "options": [
              "int x = 7 / 0;",
              "double y = 7.0 / 0;",
              "int[] a = new int[2]; a[2] = 1;",
              "String s = null; s.length();"
            ],
            "answer": 1,
            "a": "Ondalıklı bölmede 0'a bölmek Infinity verir."
          }
        ]
      },
      {
        "id": "istisna-avantaj",
        "title": "İstisna fırlatmanın avantajı",
        "en": "Advantages of Exceptions",
        "src": "Slide03 · s.5",
        "minutes": 5,
        "blocks": [
          {
            "t": "p",
            "html": "Doğru yaklaşım: metot hatayı fark edince programı öldürmez, bir <b>istisna nesnesi fırlatır</b> (<code>throw</code>). Kararı çağıran verir: yakalayıp (<code>catch</code>) bir şey yapar."
          },
          {
            "t": "code",
            "lang": "java",
            "text": "if (number2 == 0)\n    throw new ArithmeticException(\"Divisor cannot be zero\");"
          },
          {
            "t": "p",
            "html": "İstisna fırlatıldığı an:"
          },
          {
            "t": "list",
            "items": [
              "<code>throw</code> satırından sonraki kodlar (metodun kalanı) <b>atlanır</b>,",
              "kontrol, eşleşen <code>catch</code> bloğuna geçer,",
              "<code>catch</code> bittikten sonra program <b>try-catch'ten sonraki</b> satırdan normal şekilde devam eder."
            ]
          },
          {
            "t": "p",
            "html": "Slaytın cümlesi: <i>\"Bir metot, çağıranına bir istisna fırlatabilir. Bu özellik olmadan metot ya istisnayı kendisi yönetmeli ya da programı sonlandırmalıdır.\"</i>"
          },
          {
            "t": "note",
            "kind": "why",
            "html": "İstisnalar, <b>hata yönetimi kodunu normal akıştan ayırır</b>. try bloğunu okuyan kişi \"her şey yolunda giderse ne olur\"u görür; catch bloğunu okuyan \"ters giderse ne olur\"u. if-else ile her satırı kontrol etmek yerine kod temiz kalır."
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-istisna-avantaj"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "try bloğunda bir istisna fırlatılıp catch tarafından yakalandıktan sonra program nereden devam eder?",
            "options": [
              "İstisnanın fırlatıldığı satırdan sonra",
              "try bloğunun başından",
              "catch (ve varsa finally) bloğundan sonraki ilk satırdan",
              "Program sonlanır"
            ],
            "answer": 2,
            "a": "try'ın kalanı atlanır; catch'ten sonra normal akış devam eder."
          }
        ],
        "lab": {
          "label": "İstisna akışı laboratuvarında throw → catch yolunu izle",
          "preset": {
            "module": "exceptions",
            "preset": "basit"
          }
        }
      },
      {
        "id": "inputmismatch",
        "title": "InputMismatchException ile doğru girdiyi beklemek",
        "en": "InputMismatchException",
        "src": "Slide03 · s.6",
        "minutes": 5,
        "blocks": [
          {
            "t": "p",
            "html": "Scanner, int beklerken \"abc\" gibi bir şey okursa <code>java.util.InputMismatchException</code> fırlatır. Bunu yakalayıp kullanıcıya <b>doğru girdi gelene kadar</b> tekrar sorabiliriz."
          },
          {
            "t": "p",
            "html": "Kalıp: bir <code>boolean</code> bayrak + <code>do-while</code> + try-catch."
          },
          {
            "t": "p",
            "html": "Önemli ayrıntı: Hatalı token Scanner'ın tamponunda <b>kalır</b>. Atmazsan bir sonraki <code>nextInt()</code> aynı \"abc\"yi tekrar okur ve sonsuz döngüye girersin. Bu yüzden catch içinde <code>input.nextLine()</code> ile hatalı satır atılır."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>catch içinde <code>input.nextLine()</code> unutulursa sonsuz döngü!</li><li>InputMismatchException <code>java.util</code> paketindedir ve <b>unchecked</b>'tır (RuntimeException'ın alt sınıfı).</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-inputmismatch"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "q": "Hatalı girdiyi yakala ve tamponu temizle:",
            "code": "try {\n    n = input.nextInt();\n} catch (⟦0⟧ ex) {\n    System.out.println(\"Sayı girin!\");\n    input.⟦1⟧();\n}",
            "answers": [
              [
                "InputMismatchException"
              ],
              [
                "nextLine"
              ]
            ],
            "a": "Scanner'ın tip uyuşmazlığı istisnası InputMismatchException'dır; nextLine() hatalı satırı tüketir."
          }
        ]
      },
      {
        "id": "hiyerarsi",
        "title": "İstisna türleri: Throwable hiyerarşisi",
        "en": "Exception Types",
        "src": "Slide03 · s.7–10",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "İstisnalar birer <b>nesnedir</b> ve sınıfları bir kalıtım ağacı oluşturur. Kök sınıf <code>java.lang.Throwable</code>'dır:"
          },
          {
            "t": "code",
            "text": "Object\n └─ Throwable\n     ├─ Error                      ← sistem hataları (JVM)\n     │   ├─ LinkageError\n     │   └─ VirtualMachineError    (OutOfMemoryError, StackOverflowError)\n     └─ Exception                  ← programın yakalayıp yönetebileceği hatalar\n         ├─ ClassNotFoundException\n         ├─ IOException            (FileNotFoundException, ...)\n         └─ RuntimeException       ← programlama hataları\n             ├─ ArithmeticException\n             ├─ NullPointerException\n             ├─ IndexOutOfBoundsException (ArrayIndexOutOfBounds...)\n             ├─ IllegalArgumentException  (NumberFormatException)\n             └─ ClassCastException, InputMismatchException…"
          },
          {
            "t": "table",
            "head": [
              "Grup",
              "Kim fırlatır / neden?",
              "Ne yapmalı?"
            ],
            "rows": [
              [
                "<b>Error</b> (fatal / ölümcül)",
                "JVM; iç sistem hataları. Nadirdir.",
                "Kullanıcıyı bilgilendirip düzgünce kapatmaktan öte yapılacak pek bir şey yoktur."
              ],
              [
                "<b>Exception</b> (nonfatal / ölümcül değil)",
                "Programın neden olduğu hatalar ve <b>dış koşullar</b> (dosya yok, ağ koptu).",
                "Yakalanabilir ve yönetilebilir."
              ],
              [
                "<b>RuntimeException</b>",
                "Programlama hataları: kötü casting, dizi sınırı aşma, sayısal hatalar.",
                "Genellikle kodu <b>düzeltmek</b> gerekir."
              ]
            ]
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Hiyerarşi önemli çünkü <code>catch (Tip ex)</code> <b>o tipi ve tüm alt tiplerini</b> yakalar (polimorfizm!). <code>catch (Exception ex)</code> IOException'ı da, ArithmeticException'ı da yakalar ama Error'u yakalamaz."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>Error</code>, <code>Exception</code>'ın alt sınıfı <b>değildir</b>; ikisi de Throwable'ın kardeş alt sınıflarıdır.</li><li><code>RuntimeException</code>, <code>Exception</code>'ın alt sınıfıdır; dolayısıyla <code>catch (Exception e)</code> onu da yakalar.</li><li><code>NumberFormatException</code> → IllegalArgumentException → RuntimeException (unchecked).</li></ul>"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Hangisi <code>catch (Exception e)</code> tarafından <b>yakalanamaz</b>?",
            "options": [
              "IOException",
              "NullPointerException",
              "OutOfMemoryError",
              "ArithmeticException"
            ],
            "answer": 2,
            "a": "OutOfMemoryError bir Error'dur; Exception'ın alt sınıfı değildir."
          },
          {
            "type": "mc",
            "q": "<code>ArrayIndexOutOfBoundsException</code> hangi sınıfın alt sınıfıdır?",
            "options": [
              "IOException",
              "Error",
              "IndexOutOfBoundsException",
              "IllegalArgumentException"
            ],
            "answer": 2,
            "a": "Dizi taşması → IndexOutOfBoundsException → RuntimeException."
          },
          {
            "type": "mc",
            "q": "Dosya bulunamaması hangi gruba girer?",
            "options": [
              "Error (sistem hatası)",
              "RuntimeException (programlama hatası)",
              "Exception, ama RuntimeException değil (dış koşul)",
              "Hiçbiri"
            ],
            "answer": 2,
            "a": "FileNotFoundException bir IOException'dır: dış koşul, checked."
          }
        ]
      },
      {
        "id": "checked-unchecked",
        "title": "Kontrollü (checked) ve kontrolsüz (unchecked) istisnalar",
        "en": "Checked vs Unchecked Exceptions",
        "src": "Slide03 · s.11–13",
        "minutes": 6,
        "blocks": [
          {
            "t": "p",
            "html": "<b>Kontrolsüz (unchecked)</b>: <code>RuntimeException</code>, <code>Error</code> ve bunların tüm alt sınıfları.<br> <b>Kontrollü (checked)</b>: Geri kalan <b>tüm</b> istisnalar (Exception ve alt sınıfları, RuntimeException kolu hariç)."
          },
          {
            "t": "p",
            "html": "\"Kontrollü\" demek: <b>derleyici kontrol eder</b>. Checked bir istisna fırlatabilecek kodu ya <code>try-catch</code> ile sarmalı ya da metot başlığında <code>throws</code> ile bildirmelisin. Yoksa program <b>derlenmez</b>."
          },
          {
            "t": "p",
            "html": "Unchecked istisnalar için böyle bir zorunluluk yoktur."
          },
          {
            "t": "h",
            "text": "⚠ Slayttaki cümleye dikkat (s.12)"
          },
          {
            "t": "p",
            "html": "Slaytta <i>\"Java, kontrolsüz istisnaları yakalamak için kod yazmanıza <b>izin vermez</b>\"</i> yazıyor. Bu bir çeviri hatası. Liang'ın orijinali: <i>\"Java <b>does not mandate</b> that you write code to catch or declare unchecked exceptions\"</i>, yani Java bunu <b>zorunlu tutmaz</b>. Unchecked istisnaları <b>yakalayabilirsin</b> (InputMismatchException örneğinde yaptık), sadece mecbur değilsin."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Unchecked istisnalar (null'a erişim, dizi taşması) programın <b>her yerinde</b> olabilir; her satırı try-catch ile sarmak kodu okunamaz hale getirir. Ayrıca bunlar genelde düzeltilmesi gereken <b>mantık hatalarıdır</b>: yakalamak yerine kodu düzeltirsin. Checked istisnalar ise (dosya yok, ağ yok) programcının kontrolünde olmayan, <b>önceden düşünülmesi gereken</b> dış durumlardır; derleyici seni bunları düşünmeye zorlar."
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Ezber kısayolu: <b>RuntimeException veya Error soyundansa → unchecked. Değilse → checked.</b>"
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Slayttaki \"yakalamanıza izin vermez\" ifadesi yanlış; doğrusu \"yakalamanızı/bildirmenizi zorunlu tutmaz\".</li><li><code>IOException</code>, <code>FileNotFoundException</code>, <code>ClassNotFoundException</code>, <code>Exception</code>'ın kendisi → <b>checked</b>.</li><li><code>NullPointerException</code>, <code>ArithmeticException</code>, <code>ClassCastException</code>, <code>IllegalArgumentException</code> → <b>unchecked</b>.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kod örneği"
          },
          {
            "t": "dg",
            "id": "tr-checked-unchecked"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Hangisi <b>checked</b> bir istisnadır?",
            "options": [
              "NullPointerException",
              "IOException",
              "ArithmeticException",
              "ClassCastException"
            ],
            "answer": 1,
            "a": "IOException RuntimeException soyundan değildir."
          },
          {
            "type": "mc",
            "q": "Aşağıdaki metot derlenir mi?",
            "options": [
              "Evet",
              "Hayır: Exception checked'tır; throws Exception bildirilmeli veya yakalanmalı",
              "Hayır: throw yerine throws yazılmalı",
              "Evet ama çalışma zamanında hata verir"
            ],
            "answer": 1,
            "a": "Exception'ın kendisi checked'tır.",
            "code": "void oku() {\n    throw new Exception(\"hata\");\n}"
          },
          {
            "type": "mc",
            "q": "Aşağıdaki metot derlenir mi?",
            "options": [
              "Evet, IllegalArgumentException unchecked'tır",
              "Hayır, throws eklenmeli",
              "Hayır, try-catch eklenmeli",
              "Hayır, new kullanılamaz"
            ],
            "answer": 0,
            "a": "RuntimeException soyundan geldiği için bildirmek zorunlu değil.",
            "code": "void kontrol(int x) {\n    if (x < 0)\n        throw new IllegalArgumentException(\"negatif\");\n}"
          }
        ],
        "lab": {
          "label": "Checked istisnanın derleme kontrolünü laboratuvarda gör",
          "preset": {
            "module": "exceptions",
            "preset": "checked"
          }
        }
      },
      {
        "id": "declare-throw-catch",
        "title": "Bildirme (throws), atma (throw), yakalama (catch)",
        "en": "Declaring, Throwing and Catching",
        "src": "Slide03 · s.14–17",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "İstisna yönetiminin üç parçası vardır:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "method1() {                          method2() throws Exception {   ← BİLDİR\n    try {                                if (bir hata olursa) {\n        method2();                           throw new Exception();   ← AT\n    }                                    }\n    catch (Exception ex) {            }\n        istisnayı işle;    ← YAKALA\n    }\n}"
          },
          {
            "t": "h",
            "text": "1) Bildirme — <code>throws</code> (başlıkta, çoğul \"s\")"
          },
          {
            "t": "p",
            "html": "Her metot fırlatabileceği <b>checked</b> istisnaları başlığında bildirmelidir. Birden fazlası virgülle ayrılır:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "public void myMethod() throws IOException, OtherException"
          },
          {
            "t": "h",
            "text": "2) Atma — <code>throw</code> (gövdede, tekil)"
          },
          {
            "t": "p",
            "html": "Program bir hata fark edince uygun tipte bir istisna <b>nesnesi oluşturup</b> fırlatır:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "throw new IllegalArgumentException(\"Radius cannot be negative\");\n// veya\nIllegalArgumentException ex = new IllegalArgumentException(\"...\");\nthrow ex;"
          },
          {
            "t": "h",
            "text": "3) Yakalama — <code>try-catch</code>"
          },
          {
            "t": "p",
            "html": "İstisna fırlatabilecek kod <code>try</code> içine, işleyici <code>catch</code> içine yazılır (sonraki ders)."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "<code>throws</code> metodun \"sözleşmesinin\" parçasıdır: onu çağıran kişiye \"bu metot şu hatayla dönebilir, hazırlıklı ol\" der. <code>throw</code> ise o hatanın gerçekten olduğu andır. Biri <b>bildirim</b>, diğeri <b>eylem</b>."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>throw</code> ≠ <code>throws</code>: <code>throw</code> gövdede bir nesne fırlatır, <code>throws</code> başlıkta tip(ler) bildirir.</li><li><code>throw new Exception</code> değil, <code>throw new Exception()</code>: bir nesne oluşturulmalı (parantez şart).</li><li><code>throw</code>'dan sonra aynı bloğa yazılan kod erişilemez (unreachable) → derleme hatası.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-declare-throw-catch"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "q": "Negatif yaş gelirse istisna fırlat:",
            "code": "public void setYas(int yas) ⟦0⟧ IllegalArgumentException {\n    if (yas < 0)\n        ⟦1⟧ ⟦2⟧ IllegalArgumentException(\"Yaş negatif olamaz\");\n    this.yas = yas;\n}",
            "answers": [
              [
                "throws"
              ],
              [
                "throw"
              ],
              [
                "new"
              ]
            ],
            "a": "Başlıkta <code>throws</code>, gövdede <code>throw new ...</code>."
          },
          {
            "type": "mc",
            "q": "Yukarıdaki örnekte c3 neden hiç oluşturulmaz?",
            "options": [
              "0 geçersiz bir yarıçaptır",
              "c2'de fırlatılan istisna try bloğunun kalanını atlatır",
              "numberOfObjects static'tir",
              "Yapıcı private'tır"
            ],
            "answer": 1,
            "a": "İstisnadan sonra try içindeki satırlar atlanır, kontrol catch'e geçer."
          }
        ]
      },
      {
        "id": "try-catch",
        "title": "Birden çok catch ve sıralama kuralı",
        "en": "Multiple catch Blocks",
        "src": "Slide03 · s.18",
        "minutes": 5,
        "blocks": [
          {
            "t": "code",
            "lang": "java",
            "text": "try {\n    ifadeler;               // istisna fırlatabilecek kod\n}\ncatch (Exception1 exVar1) { handler1; }\ncatch (Exception2 exVar2) { handler2; }\n...\ncatch (ExceptionN exVarN) { handlerN; }"
          },
          {
            "t": "p",
            "html": "try içinde istisna yoksa catch'ler <b>atlanır</b>. Varsa, catch blokları <b>yukarıdan aşağıya</b> sırayla denenir ve <b>tipi uyan ilk</b> blok çalışır; diğerleri atlanır."
          },
          {
            "t": "h",
            "text": "Sıralama kuralı"
          },
          {
            "t": "p",
            "html": "Bir catch, belirttiği sınıfı <b>ve tüm alt sınıflarını</b> yakalar. Bu yüzden <b>alt sınıf (özel) önce, üst sınıf (genel) sonra</b> yazılmalıdır. Üst sınıfı önce yazarsan alttaki catch'e asla ulaşılamaz → <b>derleme hatası</b>."
          },
          {
            "t": "h",
            "text": "Java 7: çoklu yakalama"
          },
          {
            "t": "p",
            "html": "Aynı işlemi yapacak catch'ler birleştirilebilir: <code>catch (ArithmeticException | NullPointerException ex)</code>"
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Polimorfizmin istisnalara yansımasıdır: <code>Exception</code> tipindeki bir catch, her alt tip istisnayı kabul eder. Önce genel catch gelirse, özel olan \"ölü kod\" olur; Java ölü kodu derleme hatası sayar."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>catch (Exception e)</code> sonra <code>catch (IOException e)</code> → <b>derleme hatası</b> (exception IOException has already been caught).</li><li>Sadece bir catch çalışır: eşleşen ilk catch'ten sonra diğerleri kontrol edilmez.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-try-catch"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Hangisi derlenir?",
            "options": [
              "catch (Exception e) {} catch (IOException e) {}",
              "catch (IOException e) {} catch (Exception e) {}",
              "catch (RuntimeException e) {} catch (ArithmeticException e) {}",
              "Hiçbiri"
            ],
            "answer": 1,
            "a": "Özelden genele sıralanmalı."
          }
        ],
        "lab": {
          "label": "Hangi catch bloğunun yakalayacağını laboratuvarda dene",
          "preset": {
            "module": "exceptions",
            "preset": "basit"
          }
        }
      },
      {
        "id": "yayilim",
        "title": "İstisnanın yayılımı (çağrı yığını)",
        "en": "Exception Propagation",
        "src": "Slide03 · s.19",
        "minutes": 5,
        "blocks": [
          {
            "t": "p",
            "html": "Bir istisna fırlatıldığında JVM, uygun işleyiciyi <b>çağrı yığını (call stack) boyunca geriye doğru</b> arar:"
          },
          {
            "t": "list",
            "items": [
              "İstisnanın oluştuğu metotta, onu saran try'ın catch'lerine bakılır.",
              "Uyan yoksa metot <b>hemen sonlandırılır</b>, istisna onu çağıran metoda iletilir. Orada da aynı arama yapılır.",
              "Bu, uyan bir catch bulunana kadar sürer. <code>main</code>'de de bulunamazsa program sonlanır ve yığın izi yazdırılır."
            ],
            "ordered": true
          },
          {
            "t": "p",
            "html": "Slayttaki senaryo (main → method1 → method2 → method3, istisna method3'te):"
          },
          {
            "t": "list",
            "items": [
              "Tip <b>Exception3</b> ise → method2'deki catch yakalar; <code>statement5</code> atlanır, <code>statement6</code> çalışır.",
              "Tip <b>Exception2</b> ise → method2 sonlanır, method1'deki catch yakalar; <code>statement3</code> atlanır, <code>statement4</code> çalışır.",
              "Tip <b>Exception1</b> ise → method2 ve method1 sonlanır, main yakalar; <code>statement1</code> atlanır, <code>statement2</code> çalışır.",
              "Hiçbiri değilse → program sonlanır."
            ]
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Her metot sadece <b>kendi yönetebileceği</b> istisnaları yakalar, gerisini yukarı bırakır. Sağdaki örnekte method2 sadece null hatalarını, method1 sadece aritmetik hataları yönetebiliyor; IllegalArgumentException ikisini de geçip main'e ulaşıyor."
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-yayilim"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Yukarıdaki kodda method3 <code>throw new NullPointerException()</code> yapsaydı çıktı ne olurdu?",
            "options": [
              "method2 yakaladı / statement6 / statement3 / statement4 / statement1 / statement2",
              "method2 yakaladı / statement6 / statement4 / statement2",
              "main yakaladı / statement2",
              "method1 yakaladı / statement4 / statement1 / statement2"
            ],
            "answer": 0,
            "a": "method2 yakalar → statement6. method2 normal döndüğü için method1'de statement3 ve statement4, main'de statement1 ve statement2 çalışır."
          }
        ],
        "lab": {
          "label": "Slayttaki main → method1 → method2 → method3 yayılımını çalıştır",
          "preset": {
            "module": "exceptions",
            "preset": "yayilim"
          }
        }
      },
      {
        "id": "catch-or-declare",
        "title": "Checked istisna: yakala ya da bildir",
        "en": "Catch or Declare",
        "src": "Slide03 · s.20–21",
        "minutes": 4,
        "blocks": [
          {
            "t": "p",
            "html": "<code>p2</code> metodu checked bir istisna (ör. <code>IOException</code>) bildiriyorsa, onu çağıran <code>p1</code>'in <b>iki seçeneği</b> vardır:"
          },
          {
            "t": "table",
            "head": [
              "(a) Yakala",
              "(b) Bildir (yukarı ilet)"
            ],
            "rows": [
              [
                "<pre class=\"l-code l-code-sm\">void p1() {\n    try {\n        p2();\n    }\n    catch (IOException ex) {\n        ...\n    }\n}</pre>",
                "<pre class=\"l-code l-code-sm\">void p1() throws IOException {\n    p2();\n}</pre>"
              ]
            ]
          },
          {
            "t": "p",
            "html": "İkisini de yapmazsan program <b>derlenmez</b> (<i>unreported exception IOException; must be caught or declared to be thrown</i>)."
          },
          {
            "t": "p",
            "html": "(b) seçilirse sorumluluk p1'i çağırana geçer; o da aynı ikilemle karşılaşır. <code>main</code> de <code>throws</code> diyebilir; bu durumda istisna JVM'e ulaşır ve program sonlanır."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Kararı veren soru: \"<b>Bu metot bu hatayla anlamlı bir şey yapabilir mi?</b>\" Yapabiliyorsa (kullanıcıya tekrar sor, varsayılan dosya kullan) yakala. Yapamıyorsa bildir ve kararı bilen birine bırak."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Bu kural sadece <b>checked</b> istisnalar için geçerlidir; unchecked'ler için zorunluluk yok.</li><li>Override eden metot, üst sınıftaki metodun bildirmediği yeni/daha geniş bir checked istisna bildiremez.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-catch-or-declare"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "<code>void oku() throws IOException</code> metodunu çağıran <code>void islem()</code> için hangisi <b>yanlıştır</b>?",
            "options": [
              "oku()'yu try-catch(IOException) içinde çağırmak",
              "islem()'e throws IOException eklemek",
              "islem()'e throws Exception eklemek",
              "Hiçbir şey yapmadan oku()'yu çağırmak"
            ],
            "answer": 3,
            "a": "Checked istisna yakalanmalı veya bildirilmeli. throws Exception da geçerlidir (daha geniş)."
          }
        ],
        "lab": {
          "label": "Yakala ya da bildir kuralını laboratuvarda dene",
          "preset": {
            "module": "exceptions",
            "preset": "checked"
          }
        }
      },
      {
        "id": "istisna-bilgi",
        "title": "İstisna nesnesinden bilgi almak",
        "en": "Getting Information from Exceptions",
        "src": "Slide03 · s.3 (§12.4.4)",
        "minutes": 3,
        "blocks": [
          {
            "t": "p",
            "html": "Yakalanan istisna bir nesnedir; <code>Throwable</code>'dan miras aldığı metotlarla hakkında bilgi alabilirsin:"
          },
          {
            "t": "table",
            "head": [
              "Metot",
              "Ne döndürür / yapar?"
            ],
            "rows": [
              [
                "<code>getMessage()</code>",
                "İstisna oluşturulurken verilen mesaj (<code>\"Radius cannot be negative\"</code>)"
              ],
              [
                "<code>toString()</code>",
                "Tam sınıf adı + <code>\": \"</code> + mesaj"
              ],
              [
                "<code>printStackTrace()</code>",
                "İstisnayı ve çağrı yığınını konsola yazar"
              ],
              [
                "<code>getStackTrace()</code>",
                "Yığın izi elemanlarını dizi olarak döndürür"
              ]
            ]
          },
          {
            "t": "p",
            "html": "Kendi istisnanı fırlatırken anlamlı bir mesaj vermek, hatayı bulmayı çok kolaylaştırır: <code>new IllegalArgumentException(\"Yarıçap negatif olamaz: \" + r)</code>."
          },
          {
            "t": "h",
            "text": "Kod örneği"
          },
          {
            "t": "dg",
            "id": "tr-istisna-bilgi"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "<code>new Exception(\"Disk dolu\")</code> için <code>toString()</code> ne döndürür?",
            "options": [
              "Disk dolu",
              "java.lang.Exception: Disk dolu",
              "Exception",
              "null"
            ],
            "answer": 1,
            "a": "toString = tam sınıf adı + \": \" + mesaj. getMessage sadece mesajı döndürür."
          }
        ]
      },
      {
        "id": "finally",
        "title": "finally bloğu",
        "en": "The finally Clause",
        "src": "Slide03 · s.24–35",
        "minutes": 8,
        "blocks": [
          {
            "t": "code",
            "lang": "java",
            "text": "try { ifadeler; }\ncatch (TheException ex) { işle; }\nfinally { sonİfadeler; }      // HER ZAMAN çalışır"
          },
          {
            "t": "p",
            "html": "<code>finally</code>, istisna olsa da olmasa da çalışmasını istediğin kod içindir (dosya kapatmak, kaynak serbest bırakmak). Slayttaki animasyonların özeti:"
          },
          {
            "t": "table",
            "head": [
              "Senaryo",
              "Akış"
            ],
            "rows": [
              [
                "1. İstisna yok",
                "try (tamamı) → <b>finally</b> → sonraki ifade"
              ],
              [
                "2. İstisna var, catch yakaladı",
                "try (istisnaya kadar) → catch → <b>finally</b> → sonraki ifade"
              ],
              [
                "3. catch istisnayı yeniden fırlattı (veya yakalayan catch yok)",
                "try → (catch) → <b>finally</b> → istisna çağırana gider; sonraki ifade <b>çalışmaz</b>"
              ]
            ]
          },
          {
            "t": "p",
            "html": "try veya catch içinde <code>return</code> olsa bile finally, metottan çıkmadan <b>önce</b> çalışır."
          },
          {
            "t": "p",
            "html": "catch blokları isteğe bağlıdır: <code>try { } finally { }</code> de geçerlidir."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Bir dosyayı açtın; ortasında hata çıktı. Dosyayı kapatma kodunu try'ın sonuna yazarsan hata durumunda hiç çalışmaz; catch'e yazarsan başarılı durumda çalışmaz; ikisine birden yazarsan kod tekrarı olur. finally, \"ne olursa olsun\" kodunun tek ve doğru yeridir."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>finally, try/catch içinde <code>return</code> olsa bile çalışır.</li><li>Yakalanmayan bir istisnada önce finally çalışır, <b>sonra</b> istisna yukarı yayılır; try-catch-finally'den sonraki satır çalışmaz.</li><li>finally'yi atlatmanın tek pratik yolu <code>System.exit()</code>.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-finally"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Çıktı nedir?",
            "options": [
              "ABDE",
              "ACDE",
              "AD ve ardından program NullPointerException ile sonlanır",
              "ADE"
            ],
            "answer": 2,
            "a": "NPE'yi yakalayan catch yok. finally yine de çalışır (D), sonra istisna yukarı yayılır; E yazılmaz.",
            "code": "try {\n    System.out.print(\"A\");\n    String s = null;\n    s.length();\n    System.out.print(\"B\");\n} catch (ArithmeticException e) {\n    System.out.print(\"C\");\n} finally {\n    System.out.print(\"D\");\n}\nSystem.out.print(\"E\");"
          },
          {
            "type": "mc",
            "q": "<code>try { return 1; } finally { System.out.print(\"F\"); }</code> için doğru olan?",
            "options": [
              "F yazılmaz, 1 döner",
              "Önce F yazılır, sonra 1 döner",
              "Derleme hatası",
              "1 döner, sonra F yazılır"
            ],
            "answer": 1,
            "a": "finally metottan çıkmadan önce çalışır."
          }
        ],
        "lab": {
          "label": "finally bloğunun her yolda çalıştığını laboratuvarda gör",
          "preset": {
            "module": "exceptions",
            "preset": "finally"
          }
        }
      },
      {
        "id": "rethrow",
        "title": "İstisnayı yeniden fırlatma ve zincirleme istisna",
        "en": "Rethrowing and Chained Exceptions",
        "src": "Slide03 · s.23 (§12.7–12.8)",
        "minutes": 4,
        "blocks": [
          {
            "t": "h",
            "text": "Yeniden fırlatma (rethrowing)"
          },
          {
            "t": "p",
            "html": "Bazen bir metot istisnayı yakalar, <b>kendi temizlik işini</b> yapar (log yazar, sayaç günceller) ama hatayı gerçekten çözemez; bu yüzden aynı istisnayı <b>çağırana tekrar fırlatır</b>:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "try { ifadeler; }\ncatch (TheException ex) {\n    çıkmadan önce yapılacaklar;\n    throw ex;\n}"
          },
          {
            "t": "h",
            "text": "Zincirleme istisna (chained exception)"
          },
          {
            "t": "p",
            "html": "Yakaladığın istisnayı <b>yeni, daha anlamlı bir istisnanın içine sararak</b> fırlatırsın. Yeni istisnanın yapıcısına orijinali <b>neden (cause)</b> olarak verilir: <code>new Exception(\"Yeni bilgi\", ex)</code>. Yığın izinde <code>Caused by:</code> satırıyla ikisi de görünür."
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Alt seviye hata (\"dosya bulunamadı\") üst seviyede anlamsız olabilir; kullanıcıya \"ayarlar yüklenemedi\" demek istersin. Zincirleme ile anlamlı mesajı verirsin ama asıl sebebi kaybetmezsin: hata ayıklarken <code>getCause()</code> ile köke inebilirsin."
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-rethrow"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Zincirleme istisnada orijinal istisnaya hangi metotla ulaşılır?",
            "options": [
              "getMessage()",
              "getCause()",
              "getParent()",
              "getOrigin()"
            ],
            "answer": 1,
            "a": "Throwable.getCause()."
          }
        ]
      },
      {
        "id": "ne-zaman",
        "title": "İstisnalar ne zaman kullanılmalı?",
        "en": "When to Use Exceptions",
        "src": "Slide03 · s.36–39",
        "minutes": 3,
        "blocks": [
          {
            "t": "h",
            "text": "Maliyet"
          },
          {
            "t": "p",
            "html": "İstisna yönetimi hata kodunu normal koddan ayırarak okunabilirliği artırır. Ama <b>daha fazla zaman ve kaynak</b> ister: yeni bir istisna nesnesi oluşturmak, çağrı yığınını geri sarmak ve hatayı çağıran metotlara yaymak gerekir."
          },
          {
            "t": "h",
            "text": "Ne zaman fırlatmalı?"
          },
          {
            "t": "p",
            "html": "Metotta bir hata oluştu. Hatanın <b>çağıran tarafından</b> işlenmesini istiyorsan istisna oluşturup fırlat. Metot içinde halledebiliyorsan fırlatmana gerek yok."
          },
          {
            "t": "h",
            "text": "Ne zaman try-catch kullanmalı?"
          },
          {
            "t": "p",
            "html": "<b>Beklenmedik</b> hata durumları için. Basit, <b>beklenen</b> durumlar için kullanma; bir if yeterlidir:"
          },
          {
            "t": "table",
            "head": [
              "✗ Kötü",
              "✓ İyi"
            ],
            "rows": [
              [
                "<pre class=\"l-code l-code-sm\">try {\n  System.out.println(refVar.toString());\n} catch (NullPointerException ex) {\n  System.out.println(\"refVar is null\");\n}</pre>",
                "<pre class=\"l-code l-code-sm\">if (refVar != null)\n  System.out.println(refVar.toString());\nelse\n  System.out.println(\"refVar is null\");</pre>"
              ]
            ]
          },
          {
            "t": "note",
            "kind": "key",
            "html": "Önceden kolayca kontrol edebiliyorsan <b>if</b>. Kontrol edemiyorsan (dosya bir anda silinebilir, ağ kopabilir) veya hatayı tespit eden yer ile çözecek yer farklıysa <b>istisna</b>."
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Hangi durumda istisna kullanmak <b>en uygun</b>dur?",
            "options": [
              "Kullanıcının girdiği sayının çift olup olmadığını kontrol etmek",
              "Bir referansın null olup olmadığını kontrol etmek",
              "Okunmak istenen dosyanın okuma sırasında silinmiş olması",
              "Döngüden çıkmak"
            ],
            "answer": 2,
            "a": "Programın kontrolünde olmayan, beklenmedik bir dış durum."
          }
        ]
      },
      {
        "id": "ozel-istisna",
        "title": "Kendi istisna sınıfını tanımlamak",
        "en": "Custom Exception Classes",
        "src": "Slide03 · s.40–41",
        "minutes": 5,
        "blocks": [
          {
            "t": "list",
            "items": [
              "Mümkün olduğunca <b>API'deki hazır istisna sınıflarını</b> kullan (IllegalArgumentException, IOException…).",
              "Hazır sınıflar yetersizse kendi istisna sınıfını tanımla.",
              "Tanımlarken <code>Exception</code>'ı veya onun bir alt sınıfını <b>extends</b> et."
            ]
          },
          {
            "t": "p",
            "html": "Slayttaki örnek: Yarıçap negatifse <code>setRadius</code> istisna fırlatıyordu. Ama işleyicinin (handler) hatalı <b>yarıçap değerini</b> de bilmesini istiyorsak, bu bilgiyi taşıyan özel bir istisna sınıfı gerekir: <code>InvalidRadiusException</code>."
          },
          {
            "t": "p",
            "html": "<code>Exception</code>'ı genişlettiği için <b>checked</b>'tır: setRadius başlığında <code>throws</code> ile bildirmek ve çağıranda yakalamak zorunludur. (<code>RuntimeException</code>'ı genişletseydin unchecked olurdu.)"
          },
          {
            "t": "note",
            "kind": "why",
            "html": "İstisna da bir sınıftır: alan, yapıcı ve metot ekleyebilirsin. Böylece hatayla birlikte <b>bağlam</b> taşırsın (hangi değer, hangi hesap numarası…). Ayrıca kendi tipin olduğu için <code>catch (InvalidRadiusException ex)</code> ile tam olarak bu hatayı hedefleyebilirsin."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>extends Exception</code> → checked (bildir/yakala zorunlu). <code>extends RuntimeException</code> → unchecked.</li><li>Yapıcıda <code>super(\"mesaj\")</code> çağırmazsan <code>getMessage()</code> null döner.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-ozel-istisna"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "q": "Yetersiz bakiye için checked bir istisna sınıfı tanımla:",
            "code": "public class YetersizBakiyeException ⟦0⟧ ⟦1⟧ {\n    public YetersizBakiyeException(double eksik) {\n        ⟦2⟧(\"Eksik tutar: \" + eksik);\n    }\n}",
            "answers": [
              [
                "extends"
              ],
              [
                "Exception"
              ],
              [
                "super"
              ]
            ],
            "a": "Exception'dan türeyen sınıf checked olur; mesaj super(...) ile verilir."
          }
        ],
        "lab": {
          "label": "Özel checked istisnanın yolunu laboratuvarda izle",
          "preset": {
            "module": "exceptions",
            "preset": "ozel"
          }
        }
      },
      {
        "id": "file-sinifi",
        "title": "File sınıfı",
        "en": "The File Class",
        "src": "Slide03 · s.43–46",
        "minutes": 4,
        "blocks": [
          {
            "t": "p",
            "html": "<code>java.io.File</code>, dosya ve dizin yollarındaki <b>makineye bağımlı karmaşıklığı</b> (Windows <code>\\</code>, Unix <code>/</code>) gizleyen bir soyutlamadır. Dosya adı ve dizin yolu için bir <b>sarmalayıcı (wrapper)</b> sınıftır."
          },
          {
            "t": "p",
            "html": "<b>Önemli:</b> <code>File</code> nesnesi dosyanın <b>özelliklerini</b> içerir ama dosyadan <b>okuma/yazma metotları içermez</b>. Ayrıca <code>new File(\"x.txt\")</code> diskte dosya <b>oluşturmaz</b>; sadece yolu temsil eden bir nesnedir."
          },
          {
            "t": "table",
            "head": [
              "Metot",
              "Ne yapar?"
            ],
            "rows": [
              [
                "<code>exists()</code>, <code>canRead()</code>, <code>canWrite()</code>",
                "Var mı / okunabilir mi / yazılabilir mi"
              ],
              [
                "<code>isDirectory()</code>, <code>isFile()</code>, <code>isHidden()</code>, <code>isAbsolute()</code>",
                "Tür sorguları"
              ],
              [
                "<code>getName()</code>",
                "Son kısım: <code>test.dat</code>"
              ],
              [
                "<code>getPath()</code> / <code>getAbsolutePath()</code>",
                "Verilen yol / tam yol"
              ],
              [
                "<code>getParent()</code>",
                "Üst dizin: <code>c:\\book</code>"
              ],
              [
                "<code>length()</code>, <code>lastModified()</code>",
                "Bayt boyutu (yoksa 0), son değişiklik zamanı (ms)"
              ],
              [
                "<code>delete()</code>, <code>renameTo(File)</code>",
                "Sil / yeniden adlandır (boolean döner)"
              ],
              [
                "<code>mkdir()</code>, <code>mkdirs()</code>",
                "Dizin oluştur / üst dizinlerle birlikte oluştur"
              ],
              [
                "<code>listFiles()</code>",
                "Dizindeki dosyalar (File[])"
              ]
            ]
          },
          {
            "t": "h",
            "text": "Slayttaki UML'de (s.44) olup tabloda geçmeyenler"
          },
          {
            "t": "list",
            "items": [
              "<code>new File(String parent, String child)</code> ve <code>new File(File parent, String child)</code>: üst dizin + alt ad ile oluşturma.",
              "<code>getCanonicalPath()</code>: getAbsolutePath gibi ama <code>.</code> ve <code>..</code> gibi gereksiz parçaları atar, sembolik bağlantıları çözer, Windows'ta sürücü harfini büyük yapar. TestFileClass'ta <code>C:\\book\\.\\image\\us.gif</code> → <code>C:\\book\\image\\us.gif</code>.",
              "<code>lastModified()</code> milisaniye döndürür; okunur tarih için <code>new java.util.Date(file.lastModified())</code>.",
              "Ayırıcılar (TestFileClass çıktısının son iki satırı): <code>File.pathSeparator</code> yol listelerini ayırır (Windows <code>;</code>, Unix <code>:</code>), <code>File.separator</code> dizin adlarını ayırır (Windows <code>\\</code>, Unix <code>/</code>). Platformdan bağımsız kod için bunlar kullanılır."
            ]
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Java String'inde Windows yolu yazarken ters bölü iki kez: <code>\"c:\\\\book\\\\test.dat\"</code>. Ya da <code>/</code> kullan (Java Windows'ta da kabul eder).</li><li><code>new File(...)</code> dosya oluşturmaz, var olmayan bir dosya için de nesne oluşur; <code>exists()</code> false döner.</li><li><code>length()</code> dosya yoksa veya dizinse 0 döndürür.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kod örneği"
          },
          {
            "t": "dg",
            "id": "tr-file-sinifi"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "<code>File f = new File(\"rapor.txt\");</code> satırı ne yapar?",
            "options": [
              "Diskte rapor.txt oluşturur",
              "rapor.txt'yi okumak için açar",
              "Sadece bu yolu temsil eden bir File nesnesi oluşturur",
              "Dosya yoksa FileNotFoundException fırlatır"
            ],
            "answer": 2,
            "a": "File nesnesi dosya oluşturmaz/açmaz."
          },
          {
            "type": "mc",
            "q": "Bir dosyadan veri okumak/yazmak için File tek başına yeterli midir?",
            "options": [
              "Evet, read()/write() metotları vardır",
              "Hayır; Scanner/PrintWriter gibi I/O sınıfları gerekir",
              "Sadece okumak için yeterlidir",
              "Sadece yazmak için yeterlidir"
            ],
            "answer": 1,
            "a": "Slide03 s.47."
          }
        ]
      },
      {
        "id": "printwriter",
        "title": "PrintWriter ile dosyaya yazma",
        "en": "Writing Data Using PrintWriter",
        "src": "Slide03 · s.47–48",
        "minutes": 5,
        "blocks": [
          {
            "t": "p",
            "html": "Metin dosyasına veri yazmak için <code>java.io.PrintWriter</code>:"
          },
          {
            "t": "list",
            "items": [
              "<code>new PrintWriter(String dosyaAdi)</code> veya <code>new PrintWriter(File)</code>: dosya <b>yoksa oluşturur</b>, <b>varsa içeriğini siler</b> (üzerine yazar).",
              "<code>print(...)</code>, <code>println(...)</code>, <code>printf(...)</code>: <code>System.out</code> ile aynı metotlar; String, char, int, double, boolean… için aşırı yüklenmiş.",
              "<code>close()</code>: <b>mutlaka</b> çağrılmalı; yoksa veriler diske tam yazılmayabilir."
            ]
          },
          {
            "t": "p",
            "html": "Yapıcı, dosya oluşturulamazsa <code>FileNotFoundException</code> (checked) fırlatabilir → main'de <code>throws IOException</code> veya try-catch gerekir."
          },
          {
            "t": "p",
            "html": "<code>println</code>'ın eklediği satır sonu sisteme bağlıdır: Windows'ta <code>\\r\\n</code>, Unix'te <code>\\n</code>."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>PrintWriter var olan dosyanın içeriğini <b>siler</b>. Slayttaki örnek bu yüzden önce <code>exists()</code> ile kontrol ediyor.</li><li><code>close()</code> unutulursa dosya boş veya eksik kalabilir.</li><li><code>System.out</code> da bir PrintStream'dir; bu yüzden metotlar tanıdık geliyor.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-printwriter"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "q": "\"notlar.txt\" dosyasına bir satır yaz ve kapat:",
            "code": "PrintWriter pw = new ⟦0⟧(\"notlar.txt\");\npw.⟦1⟧(\"Ali 85\");\npw.⟦2⟧();",
            "answers": [
              [
                "PrintWriter"
              ],
              [
                "println",
                "print"
              ],
              [
                "close"
              ]
            ],
            "a": "Yazdıktan sonra close() unutulmamalı."
          }
        ]
      },
      {
        "id": "try-with-resources",
        "title": "try-with-resources: otomatik kapatma",
        "en": "Try-with-resources",
        "src": "Slide03 · s.49",
        "minutes": 4,
        "blocks": [
          {
            "t": "p",
            "html": "Programcılar dosyayı kapatmayı sık sık unutur. JDK 7, kaynakları <b>otomatik kapatan</b> bir sözdizimi getirdi:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "try (kaynakları bildir ve oluştur) {\n    kaynağı kullanarak dosyayı işle;\n}"
          },
          {
            "t": "list",
            "items": [
              "Parantez içinde oluşturulan kaynaklar, blok bitince (normal bittiğinde de, istisnayla çıkıldığında da) <b>otomatik olarak</b> <code>close()</code> edilir.",
              "Birden fazla kaynak noktalı virgülle ayrılır: <code>try (Scanner in = ...; PrintWriter out = ...)</code>",
              "Kaynağın sınıfı <code>AutoCloseable</code> arayüzünü uygulamalıdır (Scanner, PrintWriter uygular).",
              "İsteğe bağlı olarak catch/finally de eklenebilir."
            ]
          },
          {
            "t": "note",
            "kind": "why",
            "html": "Bu, \"finally içinde close\" kalıbının derleyici tarafından otomatik yazılmış halidir. Daha kısa ve unutulması imkânsız."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>Kaynak değişkeni sadece try bloğunun içinde geçerlidir.</li><li>Kaynağı parantez içinde bildirmek gerekir; try bloğunun <i>içinde</i> oluşturulan nesne otomatik kapanmaz.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kod örneği"
          },
          {
            "t": "dg",
            "id": "tr-try-with-resources"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "q": "Scanner'ı otomatik kapanacak şekilde aç:",
            "code": "⟦0⟧ (Scanner in = new Scanner(new File(\"veri.txt\"))) {\n    while (in.hasNext())\n        System.out.println(in.next());\n}",
            "answers": [
              [
                "try"
              ]
            ],
            "a": "try-with-resources: <code>try (kaynak) { ... }</code>."
          },
          {
            "type": "mc",
            "q": "try-with-resources içinde kullanılan bir kaynağın sınıfı hangi arayüzü uygulamalıdır?",
            "options": [
              "Serializable",
              "AutoCloseable",
              "Comparable",
              "Runnable"
            ],
            "answer": 1,
            "a": "close() metodunu garanti eden AutoCloseable (veya Closeable)."
          }
        ]
      },
      {
        "id": "scanner-dosya",
        "title": "Scanner ile dosyadan okuma",
        "en": "Reading Data Using Scanner",
        "src": "Slide03 · s.50 (§12.11.3–4)",
        "minutes": 7,
        "blocks": [
          {
            "t": "p",
            "html": "Klavyeden okuduğumuz Scanner'ı bir <b>dosyaya</b> da bağlayabiliriz: <code>new Scanner(new File(\"scores.txt\"))</code>."
          },
          {
            "t": "table",
            "head": [
              "Metot",
              "Açıklama"
            ],
            "rows": [
              [
                "<code>Scanner(File source)</code>",
                "Dosyadan okur (dosya yoksa <code>FileNotFoundException</code>, checked)"
              ],
              [
                "<code>Scanner(String source)</code>",
                "Verilen <b>metnin kendisinden</b> okur"
              ],
              [
                "<code>hasNext()</code>",
                "Okunacak token var mı?"
              ],
              [
                "<code>next(): String</code>, <code>nextByte(): byte</code>, <code>nextShort(): short</code>, <code>nextInt(): int</code>, <code>nextLong(): long</code>, <code>nextFloat(): float</code>, <code>nextDouble(): double</code>",
                "Sonraki token'ı ilgili tipte döndürür (slayt 50'deki UML'nin tamamı)"
              ],
              [
                "<code>nextLine()</code>",
                "Satırın kalanını döndürür"
              ],
              [
                "<code>useDelimiter(String)</code>",
                "Ayırıcı deseni değiştirir (varsayılan: boşluklar)"
              ],
              [
                "<code>close()</code>",
                "Kapatır"
              ]
            ]
          },
          {
            "t": "h",
            "text": "Scanner nasıl çalışır?"
          },
          {
            "t": "p",
            "html": "<code>nextInt()</code>, <code>next()</code> gibi <b>token</b> metotları: önce ayırıcıları (boşluk, tab, satır sonu) atlar, sonra bir sonraki ayırıcıya kadar okur. <code>nextLine()</code> ise satır sonuna kadar her şeyi (boşluklar dahil) okur ve satır sonunu tüketir."
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li><code>new Scanner(\"scores.txt\")</code> dosyayı DEĞİL, <b>\"scores.txt\" metnini</b> okur! Dosya için <code>new Scanner(new File(\"scores.txt\"))</code>.</li><li>Token bekleyen bir metot uymayan veri görürse <code>InputMismatchException</code>; veri bittiyse <code>NoSuchElementException</code>.</li><li><code>Scanner(File)</code> checked istisna fırlatır → throws veya try-catch.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kodda gör: adım adım"
          },
          {
            "t": "dg",
            "id": "tr-scanner-dosya"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Çıktı nedir?",
            "options": [
              "ali123.5",
              "15.5ali",
              "12ali3.5",
              "Derleme hatası"
            ],
            "answer": 0,
            "a": "Scanner(String) metnin kendisini okur. b + a + c: \"ali\" + 12 → \"ali12\", + 3.5 → \"ali123.5\".",
            "code": "Scanner sc = new Scanner(\"12 ali 3.5\");\nint a = sc.nextInt();\nString b = sc.next();\ndouble c = sc.nextDouble();\nSystem.out.println(b + a + c);"
          },
          {
            "type": "mc",
            "q": "\"data.txt\" dosyasından okumak için doğru Scanner hangisi?",
            "options": [
              "new Scanner(\"data.txt\")",
              "new Scanner(new File(\"data.txt\"))",
              "new Scanner(System.in, \"data.txt\")",
              "Scanner.open(\"data.txt\")"
            ],
            "answer": 1,
            "a": "String verirsen metni okur, File verirsen dosyayı."
          }
        ]
      },
      {
        "id": "replace-text",
        "title": "Problem: dosyadaki metni değiştirme (ReplaceText)",
        "en": "Case Study: Replacing Text",
        "src": "Slide03 · s.51",
        "minutes": 3,
        "blocks": [
          {
            "t": "p",
            "html": "Bir metin dosyasındaki bir String'i başka bir String'le değiştirip sonucu yeni dosyaya yazan program. Dosya adları ve String'ler <b>komut satırı argümanları</b> olarak verilir:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "java ReplaceText sourceFile targetFile oldString newString\njava ReplaceText FormatString.java t.txt StringBuilder StringBuffer"
          },
          {
            "t": "p",
            "html": "İkinci komut, FormatString.java içindeki tüm <b>StringBuilder</b>'ları <b>StringBuffer</b> ile değiştirir ve sonucu t.txt'ye yazar. (Slayttaki Türkçe cümlede yön ters çevrilmiş; argüman sırası <code>eski yeni</code>'dir.)"
          },
          {
            "t": "p",
            "html": "Bu örnek bölümdeki her şeyi birleştirir: <code>args</code>, File kontrolleri, try-with-resources, Scanner ile satır satır okuma, PrintWriter ile yazma."
          },
          {
            "t": "h",
            "text": "Kod örneği"
          },
          {
            "t": "dg",
            "id": "tr-replace-text"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Bu programda neden <code>next()</code> değil <code>nextLine()</code> kullanılıyor?",
            "options": [
              "Daha hızlı olduğu için",
              "Satırdaki boşlukları ve satır yapısını korumak için",
              "next() String döndürmediği için",
              "hasNext() ile uyumlu olduğu için"
            ],
            "answer": 1,
            "a": "next() token okur; boşluklar kaybolur. nextLine() satırı aynen alır, println ile aynen yazılır."
          }
        ]
      },
      {
        "id": "web-okuma",
        "title": "Web'den veri okuma ve Web Crawler",
        "en": "Reading from the Web, Web Crawler",
        "src": "Slide03 · s.52–56",
        "minutes": 4,
        "blocks": [
          {
            "t": "p",
            "html": "Bilgisayardaki bir dosyadan okuduğun gibi, Web'deki bir dosyadan da okuyabilirsin. İstemci (tarayıcı veya uygulama) internet üzerinden web sunucusuna bağlanır, sunucu yerel dosyalarını gönderir."
          },
          {
            "t": "code",
            "lang": "java",
            "text": "URL url = new URL(\"https://www.google.com/index.html\");\nScanner input = new Scanner(url.openStream());"
          },
          {
            "t": "p",
            "html": "Bir <code>URL</code> nesnesi oluşturduktan sonra <code>openStream()</code> ile bir giriş akışı açıp onu Scanner'a verirsin. Gerisi dosya okumayla aynı."
          },
          {
            "t": "h",
            "text": "Case study: Web Crawler"
          },
          {
            "t": "p",
            "html": "Köprüleri (hyperlink) izleyerek Web'de dolaşan program. Her URL'nin <b>yalnızca bir kez</b> ziyaret edilmesi için iki liste tutar:"
          },
          {
            "t": "code",
            "lang": "java",
            "text": "listOfPendingURLs'a başlangıç URL'sini ekle;\nwhile (listOfPendingURLs boş değil) {\n    listOfPendingURLs'tan bir URL çıkar;\n    if (bu URL listOfTraversedURLs'ta yoksa) {\n        listOfTraversedURLs'a ekle;\n        URL'yi göster;\n        listOfTraversedURLs'ın boyutu 100 olunca döngüden çık;\n        Sayfayı oku ve içindeki her URL için {\n            listOfTraversedURLs'ta yoksa listOfPendingURLs'a ekle;\n        }\n    }\n}"
          },
          {
            "t": "br"
          },
          {
            "t": "note",
            "kind": "trap",
            "html": "<ul><li>URL'de protokol şart: slayttaki <code>new URL(\"www.google.com/index.html\")</code> aslında <code>MalformedURLException</code> fırlatır; <code>\"https://...\"</code> olmalı.</li><li><code>MalformedURLException</code> ve <code>openStream()</code>'in fırlattığı <code>IOException</code> checked'tır.</li></ul>"
          },
          {
            "t": "h",
            "text": "Kod örneği"
          },
          {
            "t": "dg",
            "id": "tr-web-okuma"
          }
        ],
        "checks": [
          {
            "type": "mc",
            "q": "Web Crawler neden iki ayrı liste tutar?",
            "options": [
              "Hız için",
              "Her URL'nin yalnızca bir kez ziyaret edilmesi için",
              "Bellek tasarrufu için",
              "Sıralama yapmak için"
            ],
            "answer": 1,
            "a": "Bekleyenler ve ziyaret edilenler ayrılarak döngüye girme önlenir."
          },
          {
            "type": "mc",
            "q": "<code>catch (IOException)</code> neden <code>catch (MalformedURLException)</code>'dan <b>sonra</b> yazılmış?",
            "options": [
              "Alfabetik sıra",
              "MalformedURLException, IOException'ın alt sınıfı olduğu için; özel olan önce gelmeli",
              "IOException unchecked olduğu için",
              "Fark etmez"
            ],
            "answer": 1,
            "a": "Ters sıra derleme hatası verirdi."
          }
        ]
      }
    ]
  });

  const T = OOPLab.java.trace;
  T("tr-istisna-motivasyon", {
    "files": [
      {
        "name": "Quotient.java",
        "code": "\nimport java.util.Scanner;\n\npublic class Quotient {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        System.out.print(\"Enter two integers: \");\n        int number1 = input.nextInt();\n        int number2 = input.nextInt();\n        System.out.println(number1 + \" / \" + number2 + \" is \" + (number1 / number2));\n        System.out.println(\"Program bitti\");\n    }\n}"
      },
      {
        "name": "QuotientWithIf.java",
        "code": "\nimport java.util.Scanner;\n\npublic class QuotientWithIf {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        System.out.print(\"Enter two integers: \");\n        int number1 = input.nextInt();\n        int number2 = input.nextInt();\n        if (number2 != 0)\n            System.out.println(number1 + \" / \" + number2 + \" is \" + (number1 / number2));\n        else\n            System.out.println(\"Divisor cannot be zero \");\n    }\n}"
      },
      {
        "name": "QuotientWithMethod.java",
        "code": "\nimport java.util.Scanner;\n\npublic class QuotientWithMethod {\n    public static int quotient(int number1, int number2) {\n        if (number2 == 0) {\n            System.out.println(\"Divisor cannot be zero\");\n            System.exit(1);          // program burada ÖLÜR\n        }\n        return number1 / number2;\n    }\n\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        int number1 = input.nextInt();\n        int number2 = input.nextInt();\n        int result = quotient(number1, number2);\n        System.out.println(number1 + \" / \" + number2 + \" is \" + result);\n    }\n}"
      }
    ],
    "steps": [
      {
        "file": 0,
        "lines": [
          7,
          8
        ],
        "note": "Kullanıcı <code>5 0</code> girdi.",
        "vars": {
          "number1": "5",
          "number2": "0"
        },
        "out": "Enter two integers: 5 0"
      },
      {
        "file": 0,
        "lines": [
          9
        ],
        "note": "Tam sayı 0'a bölünemez → JVM bir <b>ArithmeticException</b> nesnesi fırlatır. Yakalayan yok → program ölür.",
        "out": "!!Exception in thread \"main\" java.lang.ArithmeticException: / by zero\n!!\tat Quotient.main(Quotient.java:9)"
      },
      {
        "file": 0,
        "lines": [
          10
        ],
        "note": "Bu satır <b>hiç çalışmadı</b>."
      },
      {
        "file": 1,
        "lines": [
          9,
          12
        ],
        "note": "Aynı girdiyle (5 0) <b>QuotientWithIf</b>: if ile kontrol, 0 olduğu için else'e gidilir, çökme yok.",
        "out": "--- QuotientWithIf (girdi: 5 0) ---\nDivisor cannot be zero "
      },
      {
        "file": 2,
        "lines": [
          5,
          6,
          7
        ],
        "note": "Metot hatayı fark etti ama tek yapabildiği programı sonlandırmak. Çağıran (main) hiç söz hakkı alamadı."
      }
    ]
  });

  T("tr-istisna-avantaj", {
    "files": [
      {
        "name": "QuotientWithException.java",
        "code": "\nimport java.util.Scanner;\n\npublic class QuotientWithException {\n    public static int quotient(int number1, int number2) {\n        if (number2 == 0)\n            throw new ArithmeticException(\"Divisor cannot be zero\");\n        return number1 / number2;\n    }\n\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        System.out.print(\"Enter two integers: \");\n        int number1 = input.nextInt();\n        int number2 = input.nextInt();\n        try {\n            int result = quotient(number1, number2);\n            System.out.println(number1 + \" / \" + number2 + \" is \" + result);\n        }\n        catch (ArithmeticException ex) {\n            System.out.println(\"Exception: an integer cannot be divided by zero \");\n        }\n        System.out.println(\"Execution continues ...\");\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          13,
          14
        ],
        "note": "Kullanıcı <code>5 0</code> girdi.",
        "vars": {
          "number1": "5",
          "number2": "0"
        },
        "out": "Enter two integers: 5 0"
      },
      {
        "lines": [
          15,
          16,
          4
        ],
        "note": "try bloğuna girildi, quotient çağrıldı.",
        "vars": {
          "number1": "5",
          "number2": "0"
        }
      },
      {
        "lines": [
          5,
          6
        ],
        "note": "number2 == 0 → istisna nesnesi oluşturuldu ve <b>fırlatıldı</b>. 7. satır atlandı.",
        "vars": {
          "fırlatılan": "ArithmeticException(\"Divisor cannot be zero\")"
        }
      },
      {
        "lines": [
          17
        ],
        "note": "İstisna main'e döndü. try'ın kalanı (17. satır) <b>atlandı</b>; result hiç atanmadı.",
        "vars": {
          "fırlatılan": "ArithmeticException"
        }
      },
      {
        "lines": [
          19,
          20
        ],
        "note": "Tip eşleşti → catch bloğu çalıştı. <code>ex</code> fırlatılan nesneyi gösteriyor.",
        "out": "Exception: an integer cannot be divided by zero ",
        "vars": {
          "ex": "→ ArithmeticException"
        }
      },
      {
        "lines": [
          22
        ],
        "note": "Program ÇÖKMEDİ, try-catch'ten sonraki satırdan devam etti.",
        "out": "Execution continues ..."
      }
    ]
  });

  T("tr-inputmismatch", {
    "files": [
      {
        "name": "InputMismatchExceptionDemo.java",
        "code": "\nimport java.util.*;\n\npublic class InputMismatchExceptionDemo {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        boolean continueInput = true;\n\n        do {\n            try {\n                System.out.print(\"Enter an integer: \");\n                int number = input.nextInt();\n                System.out.println(\"The number entered is \" + number);\n                continueInput = false;\n            }\n            catch (InputMismatchException ex) {\n                System.out.println(\"Try again. (Incorrect input: an integer is required)\");\n                input.nextLine();   // hatalı satırı at\n            }\n        } while (continueInput);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          6
        ],
        "vars": {
          "continueInput": "true"
        },
        "note": "Döngü bayrağı."
      },
      {
        "lines": [
          10,
          11
        ],
        "note": "Kullanıcı <code>3.5</code> yazdı. nextInt bunu int olarak okuyamaz → istisna. 12–13 atlandı.",
        "vars": {
          "continueInput": "true",
          "tampon": "\"3.5⏎\""
        },
        "out": "Enter an integer: 3.5"
      },
      {
        "lines": [
          15,
          16
        ],
        "note": "Yakalandı, kullanıcı uyarıldı.",
        "out": "Try again. (Incorrect input: an integer is required)"
      },
      {
        "lines": [
          17
        ],
        "note": "Tampondaki hatalı satır atıldı.",
        "vars": {
          "continueInput": "true",
          "tampon": "\"\""
        }
      },
      {
        "lines": [
          19,
          10,
          11
        ],
        "note": "Bayrak hâlâ true → tekrar sor. Kullanıcı <code>4</code> yazdı.",
        "vars": {
          "continueInput": "true",
          "number": "4"
        },
        "out": "Enter an integer: 4"
      },
      {
        "lines": [
          12,
          13
        ],
        "out": "The number entered is 4",
        "vars": {
          "continueInput": "false",
          "number": "4"
        }
      },
      {
        "lines": [
          19
        ],
        "note": "Bayrak false → döngü bitti."
      }
    ]
  });

  T("tr-checked-unchecked", {
    "files": [
      {
        "name": "CheckedDemo.java",
        "code": "\nimport java.io.*;\n\npublic class CheckedDemo {\n    static void unchecked() {\n        int[] a = new int[2];\n        a[5] = 1;          // derleyici bir şey demez (unchecked)\n    }\n\n    static void checked() throws FileNotFoundException {\n        // checked: ya throws ile bildir ya da try-catch ile sar\n        PrintWriter pw = new PrintWriter(\"/yok/klasor/dosya.txt\");\n    }\n\n    // static void hatali() {\n    //     new PrintWriter(\"x.txt\");   // DERLEME HATASI:\n    // }                                // unreported exception FileNotFoundException\n\n    public static void main(String[] args) {\n        try {\n            checked();\n        } catch (FileNotFoundException ex) {\n            System.out.println(\"Checked yakalandı: \" + ex.getClass().getSimpleName());\n        }\n        try {\n            unchecked();\n        } catch (ArrayIndexOutOfBoundsException ex) {   // yakalamak SERBEST\n            System.out.println(\"Unchecked da yakalanabilir: \" + ex.getMessage());\n        }\n    }\n}"
      }
    ],
    "hl": [
      9,
      14,
      15,
      16
    ],
    "output": "Checked yakalandı: FileNotFoundException\nUnchecked da yakalanabilir: Index 5 out of bounds for length 2"
  });

  T("tr-declare-throw-catch", {
    "files": [
      {
        "name": "CircleWithException.java",
        "code": "\npublic class CircleWithException {\n    private double radius;\n    private static int numberOfObjects = 0;\n\n    public CircleWithException() { this(1.0); }\n\n    public CircleWithException(double newRadius) {\n        setRadius(newRadius);\n        numberOfObjects++;\n    }\n\n    public double getRadius() { return radius; }\n\n    /** Set a new radius */\n    public void setRadius(double newRadius)\n            throws IllegalArgumentException {      // bildir (unchecked: isteğe bağlı)\n        if (newRadius >= 0)\n            radius = newRadius;\n        else\n            throw new IllegalArgumentException(    // at\n                \"Radius cannot be negative\");\n    }\n\n    public static int getNumberOfObjects() { return numberOfObjects; }\n}"
      },
      {
        "name": "TestCircleWithException.java",
        "code": "\npublic class TestCircleWithException {\n    public static void main(String[] args) {\n        try {\n            CircleWithException c1 = new CircleWithException(5);\n            CircleWithException c2 = new CircleWithException(-5);\n            CircleWithException c3 = new CircleWithException(0);\n        }\n        catch (IllegalArgumentException ex) {     // yakala\n            System.out.println(ex);\n        }\n        System.out.println(\"Number of objects created: \" +\n            CircleWithException.getNumberOfObjects());\n    }\n}"
      }
    ],
    "steps": [
      {
        "file": 1,
        "lines": [
          5
        ],
        "note": "c1 = new(5): setRadius(5) sorunsuz, sayaç 1.",
        "vars": {
          "numberOfObjects": "1"
        }
      },
      {
        "file": 1,
        "lines": [
          6
        ],
        "note": "c2 = new(-5) yapıcısı setRadius(-5) çağırır.",
        "vars": {
          "numberOfObjects": "1"
        }
      },
      {
        "file": 0,
        "lines": [
          17,
          20,
          21
        ],
        "note": "-5 < 0 → istisna fırlatıldı. Yapıcının kalanı (<code>numberOfObjects++</code>) <b>çalışmadı</b>; c2 nesnesi hiç tamamlanmadı.",
        "vars": {
          "numberOfObjects": "1"
        }
      },
      {
        "file": 1,
        "lines": [
          7
        ],
        "note": "try'ın kalanı atlandı: c3 <b>hiç oluşturulmadı</b>."
      },
      {
        "file": 1,
        "lines": [
          9,
          10
        ],
        "note": "<code>println(ex)</code> → <code>ex.toString()</code> = sınıf adı + \": \" + mesaj.",
        "out": "java.lang.IllegalArgumentException: Radius cannot be negative"
      },
      {
        "file": 1,
        "lines": [
          12,
          13
        ],
        "note": "Sadece c1 tam olarak oluştu.",
        "out": "Number of objects created: 1"
      }
    ]
  });

  T("tr-try-catch", {
    "files": [
      {
        "name": "CokluCatch.java",
        "code": "\npublic class CokluCatch {\n    static void dene(int secim) {\n        try {\n            if (secim == 1) { int x = 5 / 0; }\n            if (secim == 2) { String s = null; s.length(); }\n            if (secim == 3) { Object o = \"metin\"; Integer i = (Integer) o; }\n            System.out.println(secim + \": hata yok\");\n        }\n        catch (ArithmeticException ex) {\n            System.out.println(secim + \": aritmetik -> \" + ex.getMessage());\n        }\n        catch (NullPointerException ex) {\n            System.out.println(secim + \": null erişimi\");\n        }\n        catch (RuntimeException ex) {          // genel olan EN SONDA\n            System.out.println(secim + \": genel -> \" + ex.getClass().getSimpleName());\n        }\n        // catch (ArithmeticException ex) { }  // buraya yazılsa: DERLEME HATASI\n    }\n\n    public static void main(String[] args) {\n        for (int i = 0; i <= 3; i++) dene(i);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          22,
          7
        ],
        "note": "secim=0: hiçbir if çalışmadı, istisna yok → catch'ler atlanır.",
        "out": "0: hata yok"
      },
      {
        "lines": [
          4,
          9,
          10
        ],
        "note": "secim=1: 5/0 → ArithmeticException. İlk catch uyuyor.",
        "out": "1: aritmetik -> / by zero"
      },
      {
        "lines": [
          5,
          12,
          13
        ],
        "note": "secim=2: NPE. 1. catch uymadı, 2. uydu.",
        "out": "2: null erişimi"
      },
      {
        "lines": [
          6,
          15,
          16
        ],
        "note": "secim=3: ClassCastException. İlk iki catch uymadı; RuntimeException üst sınıfı olduğu için 3. yakaladı.",
        "out": "3: genel -> ClassCastException"
      },
      {
        "lines": [
          18
        ],
        "note": "RuntimeException zaten tüm ArithmeticException'ları yakaladığı için bu catch'e asla ulaşılamaz → derleyici reddeder."
      }
    ]
  });

  T("tr-yayilim", {
    "files": [
      {
        "name": "Yayilim.java",
        "code": "\npublic class Yayilim {\n    public static void main(String[] args) {\n        try {\n            method1();\n            System.out.println(\"statement1\");\n        } catch (Exception ex) {\n            System.out.println(\"main yakaladı: \" + ex.getMessage());\n        }\n        System.out.println(\"statement2\");\n    }\n\n    static void method1() {\n        try {\n            method2();\n            System.out.println(\"statement3\");\n        } catch (ArithmeticException ex) {\n            System.out.println(\"method1 yakaladı\");\n        }\n        System.out.println(\"statement4\");\n    }\n\n    static void method2() {\n        try {\n            method3();\n            System.out.println(\"statement5\");\n        } catch (NullPointerException ex) {\n            System.out.println(\"method2 yakaladı\");\n        }\n        System.out.println(\"statement6\");\n    }\n\n    static void method3() {\n        throw new IllegalArgumentException(\"method3'te hata\");\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          4,
          14,
          24
        ],
        "note": "Çağrılar yığına eklenir.",
        "vars": {
          "çağrı yığını": "main → method1 → method2 → method3"
        }
      },
      {
        "lines": [
          33
        ],
        "note": "method3 bir IllegalArgumentException fırlattı. method3'te try yok → method3 sonlandı.",
        "vars": {
          "çağrı yığını": "main → method1 → method2",
          "istisna": "IllegalArgumentException"
        }
      },
      {
        "lines": [
          26
        ],
        "note": "method2'nin catch'i NullPointerException bekliyor → <b>uymadı</b>. statement5 <b>ve statement6</b> atlanır, method2 sonlanır.",
        "vars": {
          "çağrı yığını": "main → method1",
          "istisna": "IllegalArgumentException"
        }
      },
      {
        "lines": [
          16
        ],
        "note": "method1'in catch'i ArithmeticException bekliyor → <b>uymadı</b>. statement3 ve statement4 atlanır.",
        "vars": {
          "çağrı yığını": "main",
          "istisna": "IllegalArgumentException"
        }
      },
      {
        "lines": [
          6,
          7
        ],
        "note": "main'in catch'i Exception: IllegalArgumentException onun alt sınıfı → <b>yakalandı</b>. statement1 atlandı.",
        "out": "main yakaladı: method3'te hata",
        "vars": {
          "çağrı yığını": "main",
          "istisna": "yakalandı ✓"
        }
      },
      {
        "lines": [
          9
        ],
        "note": "try-catch'ten sonra normal akış.",
        "out": "statement2"
      }
    ]
  });

  T("tr-catch-or-declare", {
    "files": [
      {
        "name": "CatchOrDeclare.java",
        "code": "\nimport java.io.*;\n\npublic class CatchOrDeclare {\n    static void p2() throws IOException {\n        throw new IOException(\"File does not exist\");\n    }\n\n    static void p1a() {                     // (a) yakala\n        try {\n            p2();\n        } catch (IOException ex) {\n            System.out.println(\"p1a halletti: \" + ex.getMessage());\n        }\n    }\n\n    static void p1b() throws IOException {  // (b) bildir\n        p2();\n    }\n\n    // static void p1c() { p2(); }          // DERLEME HATASI: yakala ya da bildir!\n\n    public static void main(String[] args) throws IOException {\n        p1a();\n        p1b();                              // main de bildirdi -> JVM'e gider\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          23,
          10,
          5
        ],
        "note": "p1a → p2 → istisna."
      },
      {
        "lines": [
          11,
          12
        ],
        "note": "p1a kendi yakaladı.",
        "out": "p1a halletti: File does not exist"
      },
      {
        "lines": [
          24,
          17,
          5
        ],
        "note": "p1b → p2 → istisna. p1b yakalamıyor, sadece iletiyor."
      },
      {
        "lines": [
          22
        ],
        "note": "main de throws dediği için istisna JVM'e ulaştı → program sonlanır, yığın izi basılır.",
        "out": "!!Exception in thread \"main\" java.io.IOException: File does not exist\n!!\tat CatchOrDeclare.p2(CatchOrDeclare.java:5)\n!!\tat CatchOrDeclare.p1b(CatchOrDeclare.java:17)\n!!\tat CatchOrDeclare.main(CatchOrDeclare.java:24)"
      }
    ]
  });

  T("tr-istisna-bilgi", {
    "files": [
      {
        "name": "IstisnaBilgi.java",
        "code": "\npublic class IstisnaBilgi {\n    public static void main(String[] args) {\n        try {\n            int[] list = new int[3];\n            list[3] = 1;\n        }\n        catch (Exception ex) {\n            System.out.println(\"getMessage(): \" + ex.getMessage());\n            System.out.println(\"toString():   \" + ex.toString());\n            System.out.println(\"Sınıf:        \" + ex.getClass().getName());\n            StackTraceElement[] iz = ex.getStackTrace();\n            System.out.println(\"Satır:        \" + iz[0].getLineNumber());\n            ex.printStackTrace();\n        }\n    }\n}"
      }
    ],
    "output": "getMessage(): Index 3 out of bounds for length 3\ntoString():   java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3\nSınıf:        java.lang.ArrayIndexOutOfBoundsException\nSatır:        5\n!!java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3\n!!\tat IstisnaBilgi.main(IstisnaBilgi.java:5)"
  });

  T("tr-finally", {
    "files": [
      {
        "name": "FinallyDemo.java",
        "code": "\npublic class FinallyDemo {\n    static int bol(int a, int b) {\n        try {\n            System.out.println(\"try başladı\");\n            int s = a / b;\n            System.out.println(\"try bitti\");\n            return s;\n        }\n        catch (ArithmeticException ex) {\n            System.out.println(\"catch: \" + ex.getMessage());\n            return -1;\n        }\n        finally {\n            System.out.println(\"finally HER ZAMAN\");\n        }\n    }\n\n    public static void main(String[] args) {\n        int r1 = bol(10, 2);\n        System.out.println(\"Sonuç: \" + r1);\n        int r2 = bol(10, 0);\n        System.out.println(\"Sonuç: \" + r2);\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          19,
          4
        ],
        "note": "<b>Senaryo 1 (istisna yok)</b>: bol(10, 2).",
        "out": "try başladı"
      },
      {
        "lines": [
          5,
          6
        ],
        "vars": {
          "s": "5"
        },
        "out": "try bitti"
      },
      {
        "lines": [
          7
        ],
        "note": "<code>return 5</code> hazırlandı ama metottan çıkmadan önce…",
        "vars": {
          "s": "5",
          "dönecek değer": "5"
        }
      },
      {
        "lines": [
          13,
          14
        ],
        "note": "…finally çalışır!",
        "out": "finally HER ZAMAN",
        "vars": {
          "dönecek değer": "5"
        }
      },
      {
        "lines": [
          19,
          20
        ],
        "vars": {
          "r1": "5"
        },
        "out": "Sonuç: 5"
      },
      {
        "lines": [
          21,
          4
        ],
        "note": "<b>Senaryo 2 (istisna var, yakalandı)</b>: bol(10, 0).",
        "out": "try başladı"
      },
      {
        "lines": [
          5
        ],
        "note": "10/0 → ArithmeticException. 6–7. satırlar atlanır."
      },
      {
        "lines": [
          9,
          10,
          11
        ],
        "note": "catch çalıştı, -1 dönmeye hazırlanıyor…",
        "out": "catch: / by zero",
        "vars": {
          "dönecek değer": "-1"
        }
      },
      {
        "lines": [
          13,
          14
        ],
        "note": "…ama önce finally.",
        "out": "finally HER ZAMAN",
        "vars": {
          "dönecek değer": "-1"
        }
      },
      {
        "lines": [
          21,
          22
        ],
        "vars": {
          "r1": "5",
          "r2": "-1"
        },
        "out": "Sonuç: -1"
      }
    ]
  });

  T("tr-rethrow", {
    "files": [
      {
        "name": "ChainedExceptionDemo.java",
        "code": "\npublic class ChainedExceptionDemo {\n    public static void main(String[] args) {\n        try {\n            method1();\n        } catch (Exception ex) {\n            System.out.println(\"Yakalandı: \" + ex.getMessage());\n            System.out.println(\"Sebebi:    \" + ex.getCause().getMessage());\n        }\n    }\n\n    public static void method1() throws Exception {\n        try {\n            method2();\n        } catch (Exception ex) {\n            System.out.println(\"method1 temizlik yaptı\");\n            throw new Exception(\"New info from method1\", ex);   // zincirle\n        }\n    }\n\n    public static void method2() throws Exception {\n        throw new Exception(\"New info from method2\");\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          4,
          13,
          21
        ],
        "note": "method2 ilk istisnayı fırlattı.",
        "vars": {
          "istisna #1": "Exception(\"New info from method2\")"
        }
      },
      {
        "lines": [
          14,
          15
        ],
        "note": "method1 yakaladı, kendi işini yaptı…",
        "out": "method1 temizlik yaptı",
        "vars": {
          "istisna #1": "Exception(\"New info from method2\")"
        }
      },
      {
        "lines": [
          16
        ],
        "note": "…ve #1'i <b>cause</b> olarak içine alan yeni bir istisna fırlattı.",
        "vars": {
          "istisna #1": "Exception(\"New info from method2\")",
          "istisna #2": "Exception(\"New info from method1\", cause=#1)"
        }
      },
      {
        "lines": [
          5,
          6
        ],
        "out": "Yakalandı: New info from method1"
      },
      {
        "lines": [
          7
        ],
        "note": "getCause() orijinal istisnaya ulaşır.",
        "out": "Sebebi:    New info from method2"
      }
    ]
  });

  T("tr-ozel-istisna", {
    "files": [
      {
        "name": "InvalidRadiusException.java",
        "code": "\npublic class InvalidRadiusException extends Exception {\n    private double radius;\n\n    /** Construct an exception */\n    public InvalidRadiusException(double radius) {\n        super(\"Invalid radius \" + radius);   // mesajı üst sınıfa ver\n        this.radius = radius;\n    }\n\n    /** Return the radius */\n    public double getRadius() {\n        return radius;\n    }\n}"
      },
      {
        "name": "CircleWithRadiusException.java",
        "code": "\npublic class CircleWithRadiusException {\n    private double radius;\n\n    public CircleWithRadiusException(double newRadius)\n            throws InvalidRadiusException {\n        setRadius(newRadius);\n    }\n\n    public void setRadius(double newRadius)\n            throws InvalidRadiusException {        // checked: bildirmek ZORUNLU\n        if (newRadius >= 0)\n            radius = newRadius;\n        else\n            throw new InvalidRadiusException(newRadius);\n    }\n}"
      },
      {
        "name": "TestCircleWithRadiusException.java",
        "code": "\npublic class TestCircleWithRadiusException {\n    public static void main(String[] args) {\n        try {\n            new CircleWithRadiusException(5);\n            new CircleWithRadiusException(-5);\n            new CircleWithRadiusException(0);\n        }\n        catch (InvalidRadiusException ex) {\n            System.out.println(ex);\n            System.out.println(\"Hatalı değer: \" + ex.getRadius());\n        }\n    }\n}"
      }
    ],
    "steps": [
      {
        "file": 2,
        "lines": [
          4
        ],
        "note": "5 geçerli."
      },
      {
        "file": 2,
        "lines": [
          5
        ],
        "note": "-5 ile yapıcı → setRadius."
      },
      {
        "file": 1,
        "lines": [
          11,
          14
        ],
        "note": "Özel istisna nesnesi oluşturuldu."
      },
      {
        "file": 0,
        "lines": [
          5,
          6,
          7
        ],
        "note": "Mesaj super'e verildi, hatalı değer kendi alanına kaydedildi.",
        "vars": {
          "ex.message": "\"Invalid radius -5.0\"",
          "ex.radius": "-5.0"
        }
      },
      {
        "file": 2,
        "lines": [
          8,
          9
        ],
        "note": "toString = sınıf adı + \": \" + mesaj.",
        "out": "InvalidRadiusException: Invalid radius -5.0"
      },
      {
        "file": 2,
        "lines": [
          10
        ],
        "note": "Özel alan sayesinde handler hatalı değeri biliyor.",
        "out": "Hatalı değer: -5.0"
      }
    ]
  });

  T("tr-file-sinifi", {
    "files": [
      {
        "name": "TestFileClass.java",
        "code": "\nimport java.io.File;\n\npublic class TestFileClass {\n    public static void main(String[] args) {\n        File file = new File(\"image/us.gif\");\n        System.out.println(\"Does it exist? \" + file.exists());\n        System.out.println(\"The file has \" + file.length() + \" bytes\");\n        System.out.println(\"Can it be read? \" + file.canRead());\n        System.out.println(\"Can it be written? \" + file.canWrite());\n        System.out.println(\"Is it a directory? \" + file.isDirectory());\n        System.out.println(\"Is it a file? \" + file.isFile());\n        System.out.println(\"Is it absolute? \" + file.isAbsolute());\n        System.out.println(\"Is it hidden? \" + file.isHidden());\n        System.out.println(\"Absolute path is \" + file.getAbsolutePath());\n        System.out.println(\"Last modified on \" + new java.util.Date(file.lastModified()));\n    }\n}"
      }
    ],
    "output": "Does it exist? true\nThe file has 2998 bytes\nCan it be read? true\nCan it be written? true\nIs it a directory? false\nIs it a file? true\nIs it absolute? false\nIs it hidden? false\nAbsolute path is C:\\book\\image\\us.gif\nLast modified on Sat May 08 14:00:34 EST 1999"
  });

  T("tr-printwriter", {
    "files": [
      {
        "name": "WriteData.java",
        "code": "\npublic class WriteData {\n    public static void main(String[] args) throws java.io.IOException {\n        java.io.File file = new java.io.File(\"scores.txt\");\n        if (file.exists()) {\n            System.out.println(\"File already exists\");\n            System.exit(1);\n        }\n\n        // Create a file\n        java.io.PrintWriter output = new java.io.PrintWriter(file);\n\n        // Write formatted output to the file\n        output.print(\"John T Smith \");\n        output.println(90);\n        output.print(\"Eric K Jones \");\n        output.println(85);\n\n        // Close the file\n        output.close();\n    }\n}"
      }
    ],
    "steps": [
      {
        "lines": [
          3
        ],
        "note": "Sadece yol nesnesi; disk henüz değişmedi."
      },
      {
        "lines": [
          4
        ],
        "note": "Varsa üzerine yazmamak için çık."
      },
      {
        "lines": [
          10
        ],
        "note": "Dosya diskte oluşturuldu (boş).",
        "vars": {
          "scores.txt": "\"\""
        }
      },
      {
        "lines": [
          13,
          14
        ],
        "vars": {
          "scores.txt": "\"John T Smith 90⏎\""
        }
      },
      {
        "lines": [
          15,
          16
        ],
        "vars": {
          "scores.txt": "\"John T Smith 90⏎Eric K Jones 85⏎\""
        }
      },
      {
        "lines": [
          19
        ],
        "note": "close(): tampon diske boşaltılır ve dosya kapanır. Konsola bir şey yazılmadı; çıktı dosyada."
      }
    ]
  });

  T("tr-try-with-resources", {
    "files": [
      {
        "name": "WriteDataWithAutoClose.java",
        "code": "\npublic class WriteDataWithAutoClose {\n    public static void main(String[] args) throws Exception {\n        java.io.File file = new java.io.File(\"scores.txt\");\n        if (file.exists()) {\n            System.out.println(\"File already exists\");\n            System.exit(0);\n        }\n\n        try (\n            // Create a file\n            java.io.PrintWriter output = new java.io.PrintWriter(file);\n        ) {\n            // Write formatted output to the file\n            output.print(\"John T Smith \");\n            output.println(90);\n            output.print(\"Eric K Jones \");\n            output.println(85);\n        }   // <- output.close() burada OTOMATİK çağrılır\n    }\n}"
      }
    ],
    "hl": [
      9,
      10,
      11,
      12,
      18
    ]
  });

  T("tr-scanner-dosya", {
    "files": [
      {
        "name": "ReadData.java",
        "code": "\nimport java.util.Scanner;\n\npublic class ReadData {\n    public static void main(String[] args) throws Exception {\n        // Create a File instance\n        java.io.File file = new java.io.File(\"scores.txt\");\n\n        // Create a Scanner for the file\n        Scanner input = new Scanner(file);\n\n        // Read data from a file\n        while (input.hasNext()) {\n            String firstName = input.next();\n            String mi = input.next();\n            String lastName = input.next();\n            int score = input.nextInt();\n            System.out.println(firstName + \" \" + mi + \" \" + lastName + \" \" + score);\n        }\n\n        // Close the file\n        input.close();\n    }\n}"
      },
      {
        "name": "scores.txt",
        "code": "\nJohn T Smith 90\nEric K Jones 85"
      }
    ],
    "steps": [
      {
        "lines": [
          9
        ],
        "note": "Scanner dosyaya bağlandı; okuma imleci en başta.",
        "vars": {
          "kalan girdi": "John T Smith 90⏎Eric K Jones 85⏎"
        }
      },
      {
        "lines": [
          12,
          13,
          14,
          15,
          16
        ],
        "note": "Dört token okundu: üç String, bir int.",
        "vars": {
          "firstName": "\"John\"",
          "mi": "\"T\"",
          "lastName": "\"Smith\"",
          "score": "90",
          "kalan girdi": "⏎Eric K Jones 85⏎"
        }
      },
      {
        "lines": [
          17
        ],
        "out": "John T Smith 90"
      },
      {
        "lines": [
          12,
          13,
          14,
          15,
          16
        ],
        "note": "hasNext() true. next() önce satır sonunu (ayırıcı) atlar.",
        "vars": {
          "firstName": "\"Eric\"",
          "mi": "\"K\"",
          "lastName": "\"Jones\"",
          "score": "85",
          "kalan girdi": "⏎"
        }
      },
      {
        "lines": [
          17
        ],
        "out": "Eric K Jones 85"
      },
      {
        "lines": [
          12
        ],
        "note": "Sadece ayırıcı kaldı → hasNext() false, döngü biter."
      },
      {
        "lines": [
          21
        ],
        "note": "Kapat."
      }
    ]
  });

  T("tr-replace-text", {
    "files": [
      {
        "name": "ReplaceText.java",
        "code": "\nimport java.io.*;\nimport java.util.*;\n\npublic class ReplaceText {\n    public static void main(String[] args) throws Exception {\n        // Check command line parameter usage\n        if (args.length != 4) {\n            System.out.println(\"Usage: java ReplaceText sourceFile targetFile oldStr newStr\");\n            System.exit(1);\n        }\n\n        // Check if source file exists\n        File sourceFile = new File(args[0]);\n        if (!sourceFile.exists()) {\n            System.out.println(\"Source file \" + args[0] + \" does not exist\");\n            System.exit(2);\n        }\n\n        // Check if target file exists\n        File targetFile = new File(args[1]);\n        if (targetFile.exists()) {\n            System.out.println(\"Target file \" + args[1] + \" already exists\");\n            System.exit(3);\n        }\n\n        try (\n            Scanner input = new Scanner(sourceFile);\n            PrintWriter output = new PrintWriter(targetFile);\n        ) {\n            while (input.hasNext()) {\n                String s1 = input.nextLine();\n                String s2 = s1.replaceAll(args[2], args[3]);\n                output.println(s2);\n            }\n        }\n    }\n}"
      }
    ],
    "hl": [
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34
    ]
  });

  T("tr-web-okuma", {
    "files": [
      {
        "name": "ReadFileFromURL.java",
        "code": "\nimport java.util.Scanner;\n\npublic class ReadFileFromURL {\n    public static void main(String[] args) {\n        System.out.print(\"Enter a URL: \");\n        String URLString = new Scanner(System.in).next();\n\n        try {\n            java.net.URL url = new java.net.URL(URLString);\n            int count = 0;\n            Scanner input = new Scanner(url.openStream());\n            while (input.hasNext()) {\n                String line = input.nextLine();\n                count += line.length();\n            }\n            System.out.println(\"The file size is \" + count + \" characters\");\n        }\n        catch (java.net.MalformedURLException ex) {\n            System.out.println(\"Invalid URL\");\n        }\n        catch (java.io.IOException ex) {\n            System.out.println(\"I/O Errors: no such file\");\n        }\n    }\n}"
      }
    ],
    "hl": [
      9,
      11,
      18,
      21
    ]
  });
})(window.OOPLab = window.OOPLab || {});
