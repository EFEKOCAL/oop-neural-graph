/*
 * lessons-ch6.js — Bölüm 6: Deneme Vizeleri (Hocanın şablonuyla 5 yeni sınav).
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
    "id": "ch6",
    "num": 6,
    "title": "Deneme Vizeleri",
    "en": "Mock Midterms",
    "source": "Hocanın şablonuyla 5 yeni sınav",
    "objectives": [
      "Hocanın formatında, daha önce görülmemiş senaryolarla tam süreli sınav çözmek",
      "Her vize konusunu farklı bir tuzakla tekrar etmek",
      "40 puanlık soruda iskelet ve sıfırdan tasarım arasında rahat geçiş yapmak"
    ],
    "tag": "Vize · 5 deneme sınavı",
    "lessons": [
      {
        "id": "deneme-1",
        "title": "Deneme Vizesi 1 · Hastane (2025 formatı)",
        "en": "Mock Midterm",
        "src": "Yeni sınav · 80 dk · 100 puan",
        "minutes": 80,
        "blocks": [
          {
            "t": "p",
            "html": "Bu sınavda öne çıkanlar: <b>pass-by-value, Integer önbelleği, String equals, protected, iskelet: Hastane</b>. Sayacı başlat, soruları sırayla çöz; kâğıt kalemle çalışmak gerçek sınava en yakın yol. Her kartta cevabı açınca kendini değerlendir."
          },
          {
            "t": "table",
            "head": [
              "Soru",
              "Tür",
              "Puan"
            ],
            "rows": [
              [
                "S1",
                "Boşluk doldurma (10 cümle)",
                "15"
              ],
              [
                "S2",
                "Kod çıktısı: override aritmetiği + yapıcı zinciri",
                "15"
              ],
              [
                "S3",
                "Hata bul ve düzelt",
                "15"
              ],
              [
                "S4",
                "Çıktı + açıklama: değerle aktarım, immutable, Integer",
                "15"
              ],
              [
                "S5",
                "İskelet [B1]–[B16]: Hastane",
                "40"
              ]
            ]
          },
          {
            "t": "dg",
            "id": "exam-timer-2025"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "prose": true,
            "q": "S1 · 15p",
            "text": "Bir alt sınıf, üst sınıfın ⟦0⟧ üyelerine farklı pakette olsa bile erişebilir; ⟦1⟧ üyelerine ise hiçbir alt sınıf doğrudan erişemez.",
            "answers": [
              [
                "protected"
              ],
              [
                "private"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Java'da metotlara argümanlar her zaman ⟦0⟧ ile aktarılır; bir nesne gönderildiğinde metoda nesnenin ⟦1⟧ kopyalanır.",
            "answers": [
              [
                "değer",
                "değerle",
                "pass-by-value",
                "value"
              ],
              [
                "referansı",
                "referans",
                "adresi",
                "referans değeri"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Bir String nesnesinin içeriği oluşturulduktan sonra değiştirilemez; bu tür nesnelere ⟦0⟧ nesne denir.",
            "answers": [
              [
                "immutable",
                "değişmez"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Alt sınıf nesnesinin üst sınıf tipindeki bir referansa atanmasına ⟦0⟧, tersine ⟦1⟧ denir; ikincisi açık cast gerektirir.",
            "answers": [
              [
                "upcasting",
                "upcast",
                "yukarı dönüşüm",
                "yukarı çevirme"
              ],
              [
                "downcasting",
                "downcast",
                "aşağı dönüşüm",
                "aşağı çevirme"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "int bir değerin otomatik olarak Integer nesnesine çevrilmesine ⟦0⟧ denir.",
            "answers": [
              [
                "autoboxing",
                "boxing",
                "otomatik kutulama"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Bir yapıcının içinden aynı sınıfın başka bir yapıcısını çağırmak için ⟦0⟧ kullanılır.",
            "answers": [
              [
                "this",
                "this()",
                "this(...)"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Kontrollü (checked) istisnalar ⟦0⟧ zamanında denetlenir; RuntimeException'dan türeyenler ise ⟦1⟧ istisnalardır.",
            "answers": [
              [
                "derleme",
                "compile"
              ],
              [
                "kontrolsüz",
                "unchecked"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Hiçbir referansın göstermediği nesneleri bellekten JVM'deki ⟦0⟧ temizler.",
            "answers": [
              [
                "çöp toplayıcı",
                "garbage collector",
                "gc",
                "çöp toplama"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Bir sınıfın tüm nesnelerince paylaşılan değişken ⟦0⟧ anahtar kelimesiyle tanımlanır.",
            "answers": [
              [
                "static"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "İki String'in içeriğini karşılaştırmak için == yerine ⟦0⟧ metodu kullanılır.",
            "answers": [
              [
                "equals",
                "equals()"
              ]
            ],
            "a": ""
          },
          {
            "type": "write",
            "q": "<b>S2 (a) · 7p</b>: Çıktıyı yazınız.",
            "given": "class Hesap {\n    protected int bakiye = 100;\n    public void islem(int x) { bakiye -= x; }\n    public void islem() { bakiye += 10; }\n}\nclass Vadeli extends Hesap {\n    @Override\n    public void islem(int x) {\n        islem();\n        super.islem(x * 2);\n        bakiye += x;\n    }\n    @Override\n    public void islem() { bakiye *= 2; }\n}\npublic class S2a {\n    public static void main(String[] args) {\n        Hesap h = new Vadeli();\n        h.islem(5);\n        System.out.println(\"Bakiye = \" + h.bakiye);\n        h.islem();\n        System.out.println(\"Bakiye = \" + h.bakiye);\n    }\n}",
            "output": "Bakiye = 195\nBakiye = 390",
            "a": "Gerçek tip Vadeli. <code>islem(5)</code> → içindeki <code>islem()</code> da <b>Vadeli'nin</b> override'ı (100·2 = 200) → <code>super.islem(10)</code> Hesap'ınki (190) → +5 = 195. Sonra <code>h.islem()</code> yine Vadeli'nin: 390. Tuzak: içteki <code>islem()</code>'i Hesap'ınki (+10) sanmak."
          },
          {
            "type": "write",
            "q": "<b>S2 (b) · 8p</b>: Çıktıyı yazınız.",
            "given": "class Ust {\n    static int sayac = 0;\n    Ust() {\n        this(\"varsayılan\");\n        System.out.println(\"Ust()\");\n    }\n    Ust(String s) {\n        sayac++;\n        System.out.println(\"Ust(String): \" + s);\n    }\n}\nclass Orta extends Ust {\n    Orta() {\n        System.out.println(\"Orta()\");\n    }\n    Orta(int n) {\n        super(\"n=\" + n);\n        System.out.println(\"Orta(int)\");\n    }\n}\nclass Alt extends Orta {\n    Alt() {\n        this(7);\n        System.out.println(\"Alt()\");\n    }\n    Alt(int n) {\n        super(n * 2);\n        System.out.println(\"Alt(int)\");\n    }\n}\npublic class S2b {\n    public static void main(String[] args) {\n        new Alt();\n        System.out.println(\"---\");\n        new Orta();\n        System.out.println(\"sayac = \" + Ust.sayac);\n    }\n}",
            "output": "Ust(String): n=14\nOrta(int)\nAlt(int)\nAlt()\n---\nUst(String): varsayılan\nUst()\nOrta()\nsayac = 2",
            "a": "<code>new Alt()</code> → this(7) → super(14) → Orta(int) → super(\"n=14\") → Ust(String). <code>new Orta()</code> → gizli super() → Ust() → this(\"varsayılan\") → Ust(String). sayac static: iki nesne → 2."
          },
          {
            "type": "bug",
            "q": "<b>S3 · 15p</b>: Kodda yer alan hataları satır numarasıyla bulup nedenini açıklayınız. Düzeltilmiş kodu ve çıktısını yazınız.",
            "code": "interface Takip {\n    int MAKS_GUN = 7;\n    String durum();\n}\nabstract class Gonderi implements Takip {\n    private double agirlik;\n    public Gonderi(double agirlik) { this.agirlik = agirlik; }\n    public double getAgirlik() { return agirlik; }\n    public abstract double ucret();\n}\nclass Koli extends Gonderi {\n    public Koli(double agirlik) { this.agirlik = agirlik; }\n    public double ucret() { return getAgirlik() * 12.5; }\n    String durum() { return \"Yolda\"; }\n}\npublic class KargoTest {\n    public static void main(String[] args) {\n        Gonderi g = new Koli(4);\n        MAKS_GUN = 10;\n        System.out.println(g.ucret() + \" \" + g.durum());\n    }\n}",
            "bugs": [
              12,
              14,
              19
            ],
            "explain": [
              {
                "line": 12,
                "kind": "Derleme",
                "text": "İki hata: (1) Gonderi'nin parametresiz yapıcısı yok; gizli <code>super()</code> eşleşmez → <code>super(agirlik);</code> yazılmalı. (2) <code>agirlik</code> Gonderi'de private, alt sınıftan erişilemez."
              },
              {
                "line": 14,
                "kind": "Derleme",
                "text": "<code>durum()</code> arayüzden geliyor, yani public; değiştiricisiz yazmak erişimi daraltır."
              },
              {
                "line": 19,
                "kind": "Derleme",
                "text": "KargoTest Takip'i uygulamadığı için <code>MAKS_GUN</code> burada tanımsız (cannot find symbol). <code>Takip.MAKS_GUN = 10</code> yazılsa da hata: arayüz sabiti final."
              }
            ],
            "fixed": "interface Takip {\n    int MAKS_GUN = 7;\n    String durum();\n}\nabstract class Gonderi implements Takip {\n    private double agirlik;\n    public Gonderi(double agirlik) { this.agirlik = agirlik; }\n    public double getAgirlik() { return agirlik; }\n    public abstract double ucret();\n}\nclass Koli extends Gonderi {\n    public Koli(double agirlik) { super(agirlik); }\n    public double ucret() { return getAgirlik() * 12.5; }\n    public String durum() { return \"Yolda\"; }\n}\npublic class KargoTest {\n    public static void main(String[] args) {\n        Gonderi g = new Koli(4);\n        System.out.println(g.ucret() + \" \" + g.durum() + \" (en geç \" + Takip.MAKS_GUN + \" gün)\");\n    }\n}",
            "output": "50.0 Yolda (en geç 7 gün)",
            "a": ""
          },
          {
            "type": "write",
            "q": "<b>S4 · 15p</b>: Programın çıktısını yazınız ve her satırın <b>neden</b> böyle olduğunu kısaca açıklayınız.",
            "given": "class Kutu {\n    int deger;\n    Kutu(int d) { deger = d; }\n}\npublic class S4 {\n    static void a(int x) { x = 50; }\n    static void b(Kutu k) { k.deger = 50; }\n    static void c(Kutu k) { k = new Kutu(70); k.deger = 80; }\n    static void d(int[] arr) { arr[0]++; arr = new int[]{0}; arr[0] = 100; }\n\n    public static void main(String[] args) {\n        int x = 1;\n        Kutu k = new Kutu(1);\n        int[] arr = {1};\n        a(x);\n        b(k);\n        System.out.println(x + \" \" + k.deger);\n        c(k);\n        d(arr);\n        System.out.println(k.deger + \" \" + arr[0]);\n        String s = \"Java\";\n        s.toUpperCase();\n        System.out.println(s);\n        Integer i1 = 127, i2 = 127, i3 = 128, i4 = 128;\n        System.out.println((i1 == i2) + \" \" + (i3 == i4) + \" \" + i3.equals(i4));\n    }\n}",
            "output": "1 50\n50 2\nJava\ntrue false true",
            "a": "<ul><li><code>a</code>: int'in <b>kopyası</b> değişir → x 1 kalır. <code>b</code>: referansın kopyası aynı nesneyi gösterir → nesne 50 olur.</li><li><code>c</code>: yerel <code>k</code> yeni nesneye yönlenir; çağıranın nesnesi etkilenmez (50). <code>d</code>: önce asıl dizi artar (2), sonra yerel değişken yeni diziye döner.</li><li><code>toUpperCase()</code> <b>yeni</b> String döndürür; sonucu atanmadığı için s değişmez (immutable).</li><li>Integer −128..127 arası değerleri önbellekten verir: 127'ler aynı nesne (==true), 128'ler farklı nesne (==false). İçerik karşılaştırması için her zaman <code>equals</code>.</li></ul>"
          },
          {
            "type": "skeleton",
            "q": "<b>S5 · 40p</b>: Hastane Personel ve Randevu Sistemi. Kod iskeletini tamamlayınız.",
            "req": [
              "Personel soyut sınıfı: <b>sicilNo yalnızca okunur</b> (yapıcıda atanır, setter yok), soyut <code>maas()</code>.",
              "Doktor ve Sekreter Personel'den türer. <b>Sadece doktorlar</b> nöbet tutar: <code>Nobetci</code> arayüzü.",
              "Personel <b>kıdeme göre büyükten küçüğe</b> sıralanabilir (Comparable).",
              "<code>RandevuHatasi</code> kontrollü istisnası.",
              "<b>İş kuralı</b>: aynı doktora <b>aynı saate</b> ikinci randevu verilemez.",
              "Nöbet listesinde yalnızca nöbetçi personel yazdırılır (polimorfizm + instanceof)."
            ],
            "code": "import java.util.ArrayList;\nimport java.util.Collections;\n\nclass RandevuHatasi ⟦0⟧ {\n    public RandevuHatasi(String mesaj) {\n        ⟦1⟧\n    }\n}\n\ninterface Nobetci {\n    ⟦2⟧\n}\n\nabstract class Personel ⟦3⟧ {\n    ⟦4⟧\n    private String ad;\n    private int kidem;\n\n    public Personel(int sicilNo, String ad, int kidem) {\n        this.sicilNo = sicilNo;\n        this.ad = ad;\n        this.kidem = kidem;\n    }\n\n    public int getSicilNo() { return sicilNo; }\n    public String getAd() { return ad; }\n    public int getKidem() { return kidem; }\n\n    ⟦5⟧\n\n    @Override\n    public int compareTo(Personel o) {\n        ⟦6⟧\n    }\n\n    @Override\n    public String toString() { return ad + \" (kıdem \" + kidem + \")\"; }\n}\n\nclass Doktor ⟦7⟧ {\n    private String brans;\n\n    public Doktor(int sicilNo, String ad, int kidem, String brans) {\n        ⟦8⟧\n    }\n\n    @Override\n    public double maas() { return 60000 + getKidem() * 2500; }\n\n    ⟦9⟧\n\n    @Override\n    public String toString() { return \"Dr. \" + super.toString() + \" - \" + brans; }\n}\n\nclass Sekreter extends Personel {                // nöbet tutmaz\n    public Sekreter(int sicilNo, String ad, int kidem) { super(sicilNo, ad, kidem); }\n\n    ⟦10⟧\n}\n\nclass Randevu {\n    private Doktor doktor;\n    private String saat;\n    public Randevu(Doktor doktor, String saat) { this.doktor = doktor; this.saat = saat; }\n    public Doktor getDoktor() { return doktor; }\n    public String getSaat() { return saat; }\n}\n\nclass Hastane {\n    private ArrayList<Personel> personeller = new ArrayList<>();\n    ⟦11⟧\n\n    public void personelEkle(Personel p) { personeller.add(p); }\n\n    // İŞ KURALI: aynı doktora aynı saatte ikinci randevu verilemez\n    public void randevuVer(Doktor d, String saat) ⟦12⟧ {\n        ⟦13⟧\n    }\n\n    public void nobetListesi(String gun) {\n        Collections.sort(personeller);\n        for (Personel p : personeller) {\n            ⟦14⟧\n        }\n    }\n\n    public double toplamMaas() {\n        double toplam = 0;\n        for (Personel p : personeller)\n            toplam += p.maas();                  // dinamik bağlama\n        return toplam;\n    }\n}\n\npublic class HastaneTest {\n    public static void main(String[] args) {\n        Hastane h = new Hastane();\n        Doktor d1 = new Doktor(1, \"Ayşe\", 12, \"Kardiyoloji\");\n        Doktor d2 = new Doktor(2, \"Mert\", 4, \"Dahiliye\");\n        h.personelEkle(d2);\n        h.personelEkle(new Sekreter(3, \"Can\", 8));\n        h.personelEkle(d1);\n\n        String[] saatler = {\"09:00\", \"09:30\", \"09:00\"};\n        for (String s : saatler) {\n            ⟦15⟧\n        }\n        h.nobetListesi(\"Pazartesi\");\n        System.out.println(\"Toplam maaş: \" + h.toplamMaas());\n    }\n}",
            "blanks": [
              {
                "model": "extends Exception"
              },
              {
                "model": "super(mesaj);"
              },
              {
                "model": "void nobetTut(String gun);",
                "answers": [
                  "public void nobetTut(String gun);",
                  "public abstract void nobetTut(String gun);"
                ]
              },
              {
                "model": "implements Comparable<Personel>"
              },
              {
                "model": "private final int sicilNo;",
                "answers": [
                  "private int sicilNo;"
                ],
                "note": "Yalnızca okunur: final + getter, setter yok."
              },
              {
                "model": "public abstract double maas();",
                "answers": [
                  "abstract public double maas();"
                ]
              },
              {
                "model": "return Integer.compare(o.kidem, this.kidem);",
                "answers": [
                  "return Integer.compare(o.kidem, kidem);",
                  "return o.kidem - this.kidem;",
                  "return o.kidem - kidem;",
                  "return o.getKidem() - getKidem();"
                ],
                "note": "Büyükten küçüğe: parametre önce (o, this). Küçükten büyüğe olsaydı (this, o)."
              },
              {
                "model": "extends Personel implements Nobetci"
              },
              {
                "model": "super(sicilNo, ad, kidem);\nthis.brans = brans;"
              },
              {
                "model": "@Override\npublic void nobetTut(String gun) {\n    System.out.println(gun + \" nöbetçisi: \" + this);\n}"
              },
              {
                "model": "@Override\npublic double maas() { return 25000 + getKidem() * 1000; }",
                "answers": [
                  "@Override\npublic double maas() {\n    return 25000 + getKidem() * 1000;\n}"
                ],
                "note": "Ücret değeri serbest; önemli olan soyut metodu uygulamak."
              },
              {
                "model": "private ArrayList<Randevu> randevular = new ArrayList<>();"
              },
              {
                "model": "throws RandevuHatasi"
              },
              {
                "model": "for (Randevu r : randevular) {\n    if (r.getDoktor() == d && r.getSaat().equals(saat))\n        throw new RandevuHatasi(d.getAd() + \" için \" + saat + \" dolu\");\n}\nrandevular.add(new Randevu(d, saat));",
                "note": "Saat bir String: <code>==</code> değil <code>equals</code>. Doktor aynı nesne mi diye <code>==</code> yeterli."
              },
              {
                "model": "if (p instanceof Nobetci)\n    ((Nobetci) p).nobetTut(gun);"
              },
              {
                "model": "try {\n    h.randevuVer(d1, s);\n    System.out.println(s + \" randevusu verildi\");\n} catch (RandevuHatasi e) {\n    System.out.println(\"Hata: \" + e.getMessage());\n}"
              }
            ],
            "output": "09:00 randevusu verildi\n09:30 randevusu verildi\nHata: Ayşe için 09:00 dolu\nPazartesi nöbetçisi: Dr. Ayşe (kıdem 12) - Kardiyoloji\nPazartesi nöbetçisi: Dr. Mert (kıdem 4) - Dahiliye\nToplam maaş: 193000.0",
            "a": ""
          }
        ]
      },
      {
        "id": "deneme-2",
        "title": "Deneme Vizesi 2 · E-ticaret Ödeme (2024 formatı)",
        "en": "Mock Midterm",
        "src": "Yeni sınav · 80 dk · 100 puan",
        "minutes": 80,
        "blocks": [
          {
            "t": "p",
            "html": "Bu sınavda öne çıkanlar: <b>overload seçimi, ClassCast/NegativeArraySize, ilklenmemiş yerel değişken, tasarım: Ödeme sistemi</b>. Sayacı başlat, soruları sırayla çöz; kâğıt kalemle çalışmak gerçek sınava en yakın yol. Her kartta cevabı açınca kendini değerlendir."
          },
          {
            "t": "table",
            "head": [
              "Soru",
              "Tür",
              "Puan"
            ],
            "rows": [
              [
                "S1",
                "Boşluk doldurma (9 cümle)",
                "14"
              ],
              [
                "S2",
                "Doğru / Yanlış",
                "10"
              ],
              [
                "S3",
                "Kod çıktısı",
                "5"
              ],
              [
                "S4",
                "Hata bul (derleme + çalışma + mantık)",
                "12"
              ],
              [
                "S5",
                "Komut satırı tablosu",
                "12"
              ],
              [
                "S6",
                "Sıfırdan tasarım: Ödeme sistemi",
                "40"
              ],
              [
                "S7",
                "Overload / override çıktısı",
                "7"
              ]
            ]
          },
          {
            "t": "dg",
            "id": "exam-timer-2024"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "prose": true,
            "q": "S1 · 14p",
            "text": "Object sınıfından gelen ⟦0⟧ metodu varsayılan olarak referansları karşılaştırır; içerik karşılaştırması için override edilmelidir.",
            "answers": [
              [
                "equals",
                "equals()"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "final olarak tanımlanan bir değişkene değer yalnızca ⟦0⟧ kez atanabilir.",
            "answers": [
              [
                "bir",
                "1",
                "tek"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Aşırı yüklenmiş (overloaded) metotlardan hangisinin çağrılacağına ⟦0⟧ zamanında, override edilmiş metotlardan hangisinin çalışacağına ⟦1⟧ zamanında karar verilir.",
            "answers": [
              [
                "derleme",
                "compile"
              ],
              [
                "çalışma",
                "runtime"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "ArrayList'te bir elemanı indeksiyle almak için ⟦0⟧, eleman sayısını öğrenmek için ⟦1⟧ metodu kullanılır.",
            "answers": [
              [
                "get",
                "get()"
              ],
              [
                "size",
                "size()"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Dosyaya metin yazmak için ⟦0⟧ sınıfı kullanılır; bu sınıf dosya yoksa oluşturur, varsa içeriğini ⟦1⟧.",
            "answers": [
              [
                "PrintWriter"
              ],
              [
                "siler",
                "silir",
                "ezer",
                "üzerine yazar",
                "temizler",
                "sıfırlar"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "try-with-resources yapısında açılan kaynaklar blok sonunda ⟦0⟧ kapatılır.",
            "answers": [
              [
                "otomatik",
                "otomatik olarak",
                "kendiliğinden"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Bir sınıf birden fazla arayüzü uygulayabilir; implements'ten sonra arayüz adları ⟦0⟧ ile ayrılır.",
            "answers": [
              [
                "virgül",
                ","
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Soyut bir metodun ⟦0⟧ yoktur, noktalı virgülle biter.",
            "answers": [
              [
                "gövdesi",
                "gövde",
                "body",
                "süslü parantezi"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Yakalanan bir istisnanın açıklama metni ⟦0⟧ metoduyla alınır.",
            "answers": [
              [
                "getMessage",
                "getMessage()"
              ]
            ],
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · 10p · Bir sınıfın birden fazla yapıcısı olabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "Yapıcılar da overload edilebilir."
          },
          {
            "type": "mc",
            "q": "S2 · this anahtar kelimesi static metotlarda kullanılabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · protected üyelere aynı paketteki tüm sınıflar erişebilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "protected, default'un kapsadığı her yeri kapsar + farklı paketteki alt sınıflar."
          },
          {
            "type": "mc",
            "q": "S2 · Bir arayüz bir sınıfı extend edebilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Arayüz yalnızca arayüzleri extend eder."
          },
          {
            "type": "mc",
            "q": "S2 · String sınıfı final olduğu için ondan alt sınıf türetilemez.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · ArrayList ilkel tipleri (int, double) doğrudan saklayabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Wrapper ile: ArrayList&lt;Integer&gt;."
          },
          {
            "type": "mc",
            "q": "S2 · finally bloğu yalnızca istisna oluştuğunda çalışır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · catch bloğu try bloğu olmadan kullanılabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · Soyut sınıf tipinde bir dizi oluşturulabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "<code>new Sekil[5]</code>: referans dizisi, nesne yok."
          },
          {
            "type": "mc",
            "q": "S2 · Bir sınıf hem abstract hem final olarak tanımlanabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "write",
            "q": "<b>S3 · 5p</b>: Çıktıyı yazınız.",
            "given": "class Sayac {\n    public int deger = 2;\n    public void artir() { deger *= 3; }\n}\nclass CiftSayac extends Sayac {\n    public void artir() { deger += 4; }\n    public void artir(int n) {\n        for (int i = 0; i < n; i++)\n            artir();\n        super.artir();\n    }\n}\npublic class S3 {\n    public static void main(String[] args) {\n        CiftSayac c = new CiftSayac();\n        c.artir(2);\n        System.out.println(\"deger = \" + c.deger);\n        Sayac s = c;\n        s.artir();\n        System.out.println(\"deger = \" + s.deger);\n    }\n}",
            "output": "deger = 30\ndeger = 34",
            "a": "2 → döngüde iki kez CiftSayac.artir (+4): 10 → super.artir (·3): 30. <code>s.artir()</code>: bildirilen tip Sayac ama gerçek tip CiftSayac → +4 → 34."
          },
          {
            "type": "bug",
            "q": "<b>S4 · 12p</b>: (a) Kodu derlenebilir hale getiriniz. (b) Derlendikten sonra çalışma zamanında hangi hata, hangi satır yüzünden oluşur? (c) Ortalama doğru hesaplanmıyor: neden? Düzeltilmiş kodu yazınız.",
            "code": "public class Ortalama {\n    public static void main(String[] args) {\n        int[] notlar = {70, 85, 90};\n        System.out.println(ortalama(notlar));\n    }\n    static int ortalama(int[] dizi) {\n        int toplam;\n        for (int i = 1; i <= dizi.length; i++)\n            toplam += dizi[i];\n        return toplam / dizi.length;\n    }\n}",
            "bugs": [
              7,
              8,
              10
            ],
            "explain": [
              {
                "line": 7,
                "kind": "Derleme",
                "text": "<code>toplam</code> yerel değişken, varsayılan değeri yok; javac kullanıldığı 9. ve 10. satırlarda \"might not have been initialized\" der. <code>int toplam = 0;</code>"
              },
              {
                "line": 8,
                "kind": "Çalışma",
                "text": "<code>i &lt;= dizi.length</code> → i = 3'te <code>dizi[3]</code>: ArrayIndexOutOfBoundsException (9. satırda atılır). Ayrıca <code>i = 1</code> ilk elemanı atlar. Doğrusu <code>for (int i = 0; i &lt; dizi.length; i++)</code>."
              },
              {
                "line": 10,
                "kind": "Mantık",
                "text": "İki int bölünür → tam sayı bölmesi (245/3 = 81). Dönüş tipi double, işlem <code>(double) toplam / dizi.length</code>."
              }
            ],
            "fixed": "public class Ortalama {\n    public static void main(String[] args) {\n        int[] notlar = {70, 85, 90};\n        System.out.println(ortalama(notlar));\n    }\n    static double ortalama(int[] dizi) {\n        int toplam = 0;\n        for (int i = 0; i < dizi.length; i++)\n            toplam += dizi[i];\n        return (double) toplam / dizi.length;\n    }\n}",
            "output": "81.66666666666667",
            "a": ""
          },
          {
            "type": "write",
            "q": "<b>S5 · 12p</b>: Aşağıdaki komutların çıktılarını yazınız; program aniden sonlanırsa istisnanın adını yazınız: <code>java Donustur 3 5</code> · <code>abc 1</code> · <code>2</code> · <code>-1 x</code>",
            "given": "public class Donustur {\n    public static void main(String[] args) {\n        try {\n            int a = Integer.parseInt(args[0]);\n            int[] d = new int[a];\n            Object o = args[1];\n            Integer i = (Integer) o;\n            System.out.println(\"sonuç: \" + d[a - 1] + i);\n        } catch (NumberFormatException e) {\n            System.out.println(\"sayı değil\");\n        } catch (ArrayIndexOutOfBoundsException e) {\n            System.out.println(\"eksik argüman\");\n        } finally {\n            System.out.println(\"bitti\");\n        }\n        System.out.println(\"son\");\n    }\n}",
            "output": "java Donustur 3 5  →  bitti  + program sonlanır: ClassCastException\njava Donustur abc 1  →  sayı değil / bitti / son\njava Donustur 2  →  eksik argüman / bitti / son\njava Donustur -1 x  →  bitti  + program sonlanır: NegativeArraySizeException",
            "a": "<ul><li><b>3 5</b>: args[1] bir <b>String</b> (\"5\"); Object'e atanıp Integer'a cast edilemez → <b>ClassCastException</b>. Hiçbir catch yakalamaz → finally \"bitti\", sonra program sonlanır (\"son\" yok).</li><li><b>abc 1</b>: parseInt → NumberFormatException → \"sayı değil\", \"bitti\", \"son\".</li><li><b>2</b>: args[1] yok → ArrayIndexOutOfBoundsException yakalanır.</li><li><b>-1 x</b>: <code>new int[-1]</code> → <b>NegativeArraySizeException</b> (yakalanmaz).</li></ul>"
          },
          {
            "type": "write",
            "q": "<b>S6 · 40p</b>: \"Online Mağaza Ödeme Sistemi\" tasarlayınız. Yapıların sınıf / soyut sınıf / arayüz olmasına siz karar veriniz.<ul><li>Her ödemenin <b>odemeNo</b> (otomatik artan, yalnızca okunur) ve <b>tutar</b> bilgisi olur; tutar pozitif değilse nesne oluşturulamaz. Her ödeme türü kendi <code>komisyon()</code> hesabını yapar.</li><li>Ödeme türleri: KrediKarti (%2), Havale (sabit 5 TL), KapidaOdeme (sabit 30 TL).</li><li><b>Sadece kredi kartı</b> taksitlendirilebilir: <code>taksitTutari(int ay)</code>, en fazla 12 taksit.</li><li>Ödemeler <b>tutara göre</b> karşılaştırılabilir olmalı.</li><li>OdemeYoneticisi ödemeleri ArrayList'te tutar. <b>İş kuralı</b>: kapıda ödeme 5000 TL'yi aşamaz; aşarsa kendi yazacağınız <b>LimitAsildiException</b> fırlatılır.</li><li>taksitlendir(odeme, ay): taksitlendirilemeyen ödeme veya geçersiz taksit sayısı uyarı versin.</li><li>Main'de polimorfizm kullanınız; ödemeleri tutara göre sıralı listeleyip toplam komisyonu yazdırınız.</li></ul>",
            "rubric": [
              "Odeme <b>soyut sınıf</b>, <code>komisyon()</code> soyut",
              "odemeNo: <code>private static</code> sayaç + <code>private final</code> alan, setter yok",
              "Yapıcıda <code>tutar &lt;= 0</code> → IllegalArgumentException",
              "Taksitlendirilebilir <b>arayüz</b>, sadece KrediKarti uygular",
              "<code>implements Comparable&lt;Odeme&gt;</code>, <code>Double.compare</code>",
              "LimitAsildiException <code>extends Exception</code>, ekle metodu <code>throws</code> ile bildiriyor",
              "<code>instanceof</code> ile iş kuralları",
              "ArrayList&lt;Odeme&gt; + Collections.sort + polimorfik döngü"
            ],
            "solution": "import java.util.ArrayList;\nimport java.util.Collections;\n\nclass LimitAsildiException extends Exception {\n    public LimitAsildiException(String mesaj) { super(mesaj); }\n}\n\ninterface Taksitlendirilebilir {\n    int MAKS_TAKSIT = 12;\n    double taksitTutari(int ay);\n}\n\nabstract class Odeme implements Comparable<Odeme> {\n    private static int sonNo = 0;\n    private final int odemeNo;                   // yalnızca okunur\n    private final double tutar;\n\n    public Odeme(double tutar) {\n        if (tutar <= 0)\n            throw new IllegalArgumentException(\"Tutar pozitif olmalı\");\n        this.odemeNo = ++sonNo;\n        this.tutar = tutar;\n    }\n\n    public int getOdemeNo() { return odemeNo; }\n    public double getTutar() { return tutar; }\n\n    public abstract double komisyon();\n\n    public double toplam() { return tutar + komisyon(); }\n\n    @Override\n    public int compareTo(Odeme o) { return Double.compare(tutar, o.tutar); }\n\n    @Override\n    public String toString() { return \"#\" + odemeNo + \" \" + tutar + \" TL (komisyon \" + komisyon() + \")\"; }\n}\n\nclass KrediKarti extends Odeme implements Taksitlendirilebilir {\n    private String kartNo;\n    public KrediKarti(double tutar, String kartNo) { super(tutar); this.kartNo = kartNo; }\n    @Override public double komisyon() { return getTutar() * 0.02; }\n    @Override public double taksitTutari(int ay) { return toplam() / ay; }\n    @Override public String toString() { return \"Kart \" + super.toString(); }\n}\n\nclass Havale extends Odeme {\n    public Havale(double tutar) { super(tutar); }\n    @Override public double komisyon() { return 5; }\n    @Override public String toString() { return \"Havale \" + super.toString(); }\n}\n\nclass KapidaOdeme extends Odeme {\n    public static final double LIMIT = 5000;\n    public KapidaOdeme(double tutar) { super(tutar); }\n    @Override public double komisyon() { return 30; }\n    @Override public String toString() { return \"Kapıda \" + super.toString(); }\n}\n\nclass OdemeYoneticisi {\n    private ArrayList<Odeme> odemeler = new ArrayList<>();\n\n    // İŞ KURALI: kapıda ödeme limiti\n    public void ekle(Odeme o) throws LimitAsildiException {\n        if (o instanceof KapidaOdeme && o.getTutar() > KapidaOdeme.LIMIT)\n            throw new LimitAsildiException(\"Kapıda ödeme limiti \" + KapidaOdeme.LIMIT + \" TL\");\n        odemeler.add(o);\n    }\n\n    public void taksitlendir(Odeme o, int ay) {\n        if (!(o instanceof Taksitlendirilebilir)) {\n            System.out.println(\"#\" + o.getOdemeNo() + \" taksitlendirilemez\");\n        } else if (ay < 2 || ay > Taksitlendirilebilir.MAKS_TAKSIT) {\n            System.out.println(\"Geçersiz taksit sayısı: \" + ay);\n        } else {\n            double t = ((Taksitlendirilebilir) o).taksitTutari(ay);\n            System.out.println(\"#\" + o.getOdemeNo() + \" \" + ay + \" taksit x \" + t + \" TL\");\n        }\n    }\n\n    public void rapor() {\n        Collections.sort(odemeler);\n        double komisyon = 0;\n        for (Odeme o : odemeler) {\n            System.out.println(o);\n            komisyon += o.komisyon();\n        }\n        System.out.println(\"Toplam komisyon: \" + komisyon);\n    }\n}\n\npublic class OdemeTest {\n    public static void main(String[] args) {\n        OdemeYoneticisi y = new OdemeYoneticisi();\n        Odeme[] odemeler = {\n            new KrediKarti(1200, \"1234\"), new Havale(800),\n            new KapidaOdeme(6500), new KapidaOdeme(300)\n        };\n        for (Odeme o : odemeler) {\n            try {\n                y.ekle(o);\n            } catch (LimitAsildiException e) {\n                System.out.println(\"Eklenemedi #\" + o.getOdemeNo() + \": \" + e.getMessage());\n            }\n        }\n        y.taksitlendir(odemeler[0], 6);\n        y.taksitlendir(odemeler[1], 3);\n        y.taksitlendir(odemeler[0], 18);\n        y.rapor();\n        try {\n            new Havale(-50);\n        } catch (IllegalArgumentException e) {\n            System.out.println(\"Hata: \" + e.getMessage());\n        }\n    }\n}",
            "output": "Eklenemedi #3: Kapıda ödeme limiti 5000.0 TL\n#1 6 taksit x 204.0 TL\n#2 taksitlendirilemez\nGeçersiz taksit sayısı: 18\nKapıda #4 300.0 TL (komisyon 30.0)\nHavale #2 800.0 TL (komisyon 5.0)\nKart #1 1200.0 TL (komisyon 24.0)\nToplam komisyon: 59.0\nHata: Tutar pozitif olmalı",
            "a": "Karar gerekçeleri: Odeme soyut (ortak alan + yapıcı + \"genel ödeme\" nesnesi anlamsız), Taksitlendirilebilir arayüz (sadece bir türün yeteneği), Comparable en üstte. Limit kontrolü yönetici sınıfta (iş kuralı), tutar kontrolü yapıcıda (nesne geçersiz oluşmasın)."
          },
          {
            "type": "write",
            "q": "<b>S7 · 7p</b>: Çıktıyı yazınız.",
            "given": "class Yazici {\n    public void yaz(Object o) { System.out.println(\"Yazici-Object: \" + o); }\n    public void yaz(String s) { System.out.println(\"Yazici-String: \" + s); }\n    public void yaz(int n)    { System.out.println(\"Yazici-int: \" + n); }\n}\nclass RenkliYazici extends Yazici {\n    @Override\n    public void yaz(String s) { System.out.println(\"Renkli-String: \" + s); }\n    public void yaz(double d) { System.out.println(\"Renkli-double: \" + d); }\n}\npublic class S7 {\n    public static void main(String[] args) {\n        Yazici y = new RenkliYazici();\n        y.yaz(\"merhaba\");\n        y.yaz(5);\n        y.yaz(2.5);\n        RenkliYazici r = new RenkliYazici();\n        r.yaz(2.5);\n        r.yaz('A');\n        Object o = \"nesne\";\n        y.yaz(o);\n    }\n}",
            "output": "Renkli-String: merhaba\nYazici-int: 5\nYazici-Object: 2.5\nRenkli-double: 2.5\nYazici-int: 65\nYazici-Object: nesne",
            "a": "<ul><li>Overload <b>bildirilen tipe</b> göre derlemede seçilir: <code>y</code> Yazici tipinde, Yazici'de <code>yaz(double)</code> yok → 2.5 Double'a kutulanıp <code>yaz(Object)</code>.</li><li><code>r.yaz('A')</code>: char için yaz(int) ve yaz(double) ikisi de genişletmeyle uyar; daha özel olan int seçilir → 65.</li><li><code>y.yaz(o)</code>: o'nun bildirilen tipi Object → yaz(Object). İçinde String olması seçimi değiştirmez.</li><li>Override ise çalışmada: <code>y.yaz(\"merhaba\")</code> Renkli'nin sürümü.</li></ul>"
          }
        ]
      },
      {
        "id": "deneme-3",
        "title": "Deneme Vizesi 3 · Lojistik Filo (2022 formatı)",
        "en": "Mock Midterm",
        "src": "Yeni sınav · 80 dk · 100 puan",
        "minutes": 80,
        "blocks": [
          {
            "t": "p",
            "html": "Bu sınavda öne çıkanlar: <b>yapıcıdan override metot çağrısı, this zinciri, soyut metot 2 çözüm, tasarım: Filo + Not sistemi</b>. Sayacı başlat, soruları sırayla çöz; kâğıt kalemle çalışmak gerçek sınava en yakın yol. Her kartta cevabı açınca kendini değerlendir."
          },
          {
            "t": "table",
            "head": [
              "Soru",
              "Tür",
              "Puan"
            ],
            "rows": [
              [
                "S1",
                "Boşluk doldurma (4 cümle)",
                "5"
              ],
              [
                "S2",
                "Doğru / Yanlış",
                "10"
              ],
              [
                "S3",
                "İki çıktı sorusu",
                "10"
              ],
              [
                "S4",
                "Hata + 2 çözüm",
                "5"
              ],
              [
                "S5",
                "Sıfırdan tasarım: Lojistik filo",
                "45"
              ],
              [
                "S6",
                "ArrayList + özel istisnalar: Not sistemi",
                "25"
              ]
            ]
          },
          {
            "t": "dg",
            "id": "exam-timer-2022"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "prose": true,
            "q": "S1 · 5p",
            "text": "Bir üyeye yalnızca aynı paketten erişilebilmesi için hiçbir erişim belirleyici yazılmaz; buna ⟦0⟧ erişim denir.",
            "answers": [
              [
                "default",
                "varsayılan",
                "package-private",
                "paket",
                "paket içi"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Bir değişkenin değerinin sonradan değiştirilememesi için ⟦0⟧ anahtar kelimesi kullanılır.",
            "answers": [
              [
                "final"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Bir nesnenin bellekteki yerini gösteren değişkenlere ⟦0⟧ değişken denir.",
            "answers": [
              [
                "referans",
                "reference"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Yakalanan bir istisnayı catch bloğu içinden tekrar fırlatmak için ⟦0⟧ e; yazılır.",
            "answers": [
              [
                "throw"
              ]
            ],
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · 10p · Yapıcı metotlar alt sınıfa miras kalır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Yapıcılar miras alınmaz; alt sınıf super(...) ile çağırır."
          },
          {
            "type": "mc",
            "q": "S2 · Bir metodun içinde tanımlanan değişkene metodun dışından erişilebilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · super anahtar kelimesiyle üst sınıfın private alanına erişilebilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · Bir alt sınıf nesnesi üst sınıf tipindeki bir değişkene atanabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · instanceof operatörü null referans için false döndürür.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · Bir interface'in nesnesi new ile oluşturulabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · Aynı sınıfta aynı isim ve aynı parametre listesine sahip iki metot tanımlanamaz.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": "Dönüş tipi farklı olsa bile."
          },
          {
            "type": "mc",
            "q": "S2 · Object sınıfı Java'daki tüm sınıfların üst sınıfıdır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · NullPointerException kontrollü (checked) bir istisnadır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · Bir sınıfın static metodu o sınıftan nesne oluşturulmadan çağrılabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "write",
            "q": "<b>S3 (a) · 5p</b>: Çıktıyı yazınız.",
            "given": "public class Zincir {\n    int a, b;\n    Zincir() {\n        this(1);\n        a += 10;\n        System.out.println(\"Zincir(): \" + a + \",\" + b);\n    }\n    Zincir(int a) {\n        this(a, a * 3);\n        this.a++;\n        System.out.println(\"Zincir(int): \" + this.a + \",\" + b);\n    }\n    Zincir(int a, int b) {\n        this.a = a;\n        this.b = b;\n        System.out.println(\"Zincir(int,int): \" + a + \",\" + b);\n    }\n    public static void main(String[] args) {\n        new Zincir();\n    }\n}",
            "output": "Zincir(int,int): 1,3\nZincir(int): 2,3\nZincir(): 12,3",
            "a": "En içteki yapıcı önce biter. Dikkat: <code>Zincir(int a)</code> içinde <code>a</code> parametre, <code>this.a</code> alan; <code>this.a++</code> alanı 2 yapar."
          },
          {
            "type": "write",
            "q": "<b>S3 (b) · 5p</b>: Çıktıyı yazınız.",
            "given": "class Ana {\n    Ana() {\n        System.out.println(\"Ana()\");\n        goster();\n    }\n    void goster() { System.out.println(\"Ana.goster\"); }\n}\nclass Yavru extends Ana {\n    int deger = 5;\n    Yavru() {\n        super();\n        System.out.println(\"Yavru() deger=\" + deger);\n    }\n    @Override\n    void goster() { System.out.println(\"Yavru.goster deger=\" + deger); }\n}\npublic class S3b {\n    public static void main(String[] args) {\n        new Yavru();\n    }\n}",
            "output": "Ana()\nYavru.goster deger=0\nYavru() deger=5",
            "a": "Ana yapıcısındaki <code>goster()</code> çağrısı da <b>dinamik bağlanır</b> → Yavru'nun sürümü. Ama o anda Yavru'nun alanları henüz başlatılmadı: <code>deger</code> varsayılan <b>0</b>. Alan başlatıcı (<code>= 5</code>) super() bittikten sonra çalışır."
          },
          {
            "type": "bug",
            "q": "<b>S4 · 5p</b>: Kod bloğundaki hatayı bulup giderilmesini sağlayacak <b>2 farklı çözümü</b> yazınız.",
            "code": "abstract class Sekil {\n    public abstract double alan();\n    public abstract double cevre();\n}\nclass Daire extends Sekil {\n    private double r;\n    public Daire(double r) { this.r = r; }\n    public double alan() { return Math.PI * r * r; }\n}",
            "bugs": [
              5
            ],
            "explain": [
              {
                "line": 5,
                "kind": "Derleme",
                "text": "Daire somut bir sınıf ama soyut <code>cevre()</code>'yi uygulamadı. <b>Çözüm 1</b>: <code>cevre()</code>'yi uygula. <b>Çözüm 2</b>: Daire'yi de <code>abstract</code> yap (o zaman Daire nesnesi oluşturulamaz; bir alt sınıfı cevre()'yi uygular)."
              }
            ],
            "fixed": "abstract class Sekil {\n    public abstract double alan();\n    public abstract double cevre();\n}\n// ÇÖZÜM 1: eksik soyut metodu uygula\nclass Daire extends Sekil {\n    private double r;\n    public Daire(double r) { this.r = r; }\n    public double alan() { return Math.PI * r * r; }\n    public double cevre() { return 2 * Math.PI * r; }\n}\n// ÇÖZÜM 2: alt sınıfı da soyut yap (cevre'yi bir alt sınıfı uygular)\nabstract class SoyutDaire extends Sekil {\n    protected double r;\n    public SoyutDaire(double r) { this.r = r; }\n    public double alan() { return Math.PI * r * r; }\n}\nclass BirimDaire extends SoyutDaire {\n    public BirimDaire() { super(1); }\n    public double cevre() { return 2 * Math.PI * r; }\n}\npublic class SekilTest {\n    public static void main(String[] args) {\n        Sekil s1 = new Daire(2), s2 = new BirimDaire();\n        System.out.println(Math.round(s1.cevre() * 100) / 100.0 + \" \" + Math.round(s2.alan() * 100) / 100.0);\n    }\n}",
            "output": "12.57 3.14",
            "a": ""
          },
          {
            "type": "write",
            "q": "<b>S5 · 45p</b>: \"Lojistik Filo Yönetimi\" tasarlayınız.<ul><li>Genel bir <b>Arac</b> nesnesi oluşturulamamalı. Her aracın <b>plakası</b> (değiştirilemez), <b>kapasitesi</b> (kg) ve mevcut <b>yükü</b> vardır.</li><li><code>yukle(kg)</code>: yük kapasiteyi aşarsa kendi yazacağınız <b>KapasiteAsimiException</b> fırlatılır, yük değişmez.</li><li>Her araç türü kendi <code>yakitTuketimi()</code>'ni hesaplar: Kamyon (20000 kg, 30 + yük/1000), Kamyonet (3500 kg, 12 + yük/1000), Motosiklet (150 kg, 3.5).</li><li><b>Sadece kamyonlar</b> soğutmalıdır: <code>sicaklikAyarla(int)</code>.</li><li>Araçlar <b>yüklerine göre</b> karşılaştırılabilir olmalı.</li><li>Filo sınıfı: araçları ArrayList'te tutar. <b>İş kuralı</b>: aynı plakalı araç ikinci kez eklenemez. Soğuk zincir komutu yalnızca soğutmalı araçlara uygulanır.</li><li>Test sınıfında polimorfizm.</li></ul>",
            "rubric": [
              "Arac <b>soyut</b>; plaka <code>private final</code>",
              "KapasiteAsimiException kontrollü; <code>yukle</code> throws ile bildiriyor; hata durumunda yük değişmiyor",
              "<code>yakitTuketimi()</code> soyut, üç alt sınıf override",
              "Sogutmali <b>arayüz</b>, sadece Kamyon uygular",
              "Comparable&lt;Arac&gt; yüke göre",
              "Plaka kontrolü <code>equals</code> ile (== değil)",
              "instanceof + cast ile soğuk zincir"
            ],
            "solution": "import java.util.ArrayList;\nimport java.util.Collections;\n\nclass KapasiteAsimiException extends Exception {\n    public KapasiteAsimiException(String mesaj) { super(mesaj); }\n}\n\ninterface Sogutmali {\n    void sicaklikAyarla(int derece);\n}\n\nabstract class Arac implements Comparable<Arac> {\n    private final String plaka;\n    private final double kapasite;\n    private double yuk;\n\n    public Arac(String plaka, double kapasite) {\n        this.plaka = plaka;\n        this.kapasite = kapasite;\n    }\n\n    public String getPlaka() { return plaka; }\n    public double getYuk() { return yuk; }\n\n    // İŞ KURALI: kapasite aşılamaz\n    public void yukle(double kg) throws KapasiteAsimiException {\n        if (yuk + kg > kapasite)\n            throw new KapasiteAsimiException(plaka + \": \" + (yuk + kg) + \" kg > kapasite \" + kapasite);\n        yuk += kg;\n    }\n\n    public abstract double yakitTuketimi();\n\n    @Override\n    public int compareTo(Arac o) { return Double.compare(yuk, o.yuk); }\n\n    @Override\n    public String toString() { return plaka + \" yük \" + yuk + \" kg, \" + yakitTuketimi() + \" L/100km\"; }\n}\n\nclass Kamyon extends Arac implements Sogutmali {\n    private int sicaklik = 20;\n    public Kamyon(String plaka) { super(plaka, 20000); }\n    @Override public double yakitTuketimi() { return 30 + getYuk() / 1000; }\n    @Override public void sicaklikAyarla(int derece) {\n        sicaklik = derece;\n        System.out.println(getPlaka() + \" soğutma \" + sicaklik + \"°C\");\n    }\n}\n\nclass Kamyonet extends Arac {\n    public Kamyonet(String plaka) { super(plaka, 3500); }\n    @Override public double yakitTuketimi() { return 12 + getYuk() / 1000; }\n}\n\nclass Motosiklet extends Arac {\n    public Motosiklet(String plaka) { super(plaka, 150); }\n    @Override public double yakitTuketimi() { return 3.5; }\n}\n\nclass Filo {\n    private ArrayList<Arac> araclar = new ArrayList<>();\n\n    // İŞ KURALI: aynı plaka iki kez eklenemez\n    public boolean aracEkle(Arac a) {\n        for (Arac x : araclar)\n            if (x.getPlaka().equals(a.getPlaka()))\n                return false;\n        araclar.add(a);\n        return true;\n    }\n\n    public void sogukZincir(int derece) {\n        for (Arac a : araclar)\n            if (a instanceof Sogutmali)\n                ((Sogutmali) a).sicaklikAyarla(derece);\n    }\n\n    public void rapor() {\n        Collections.sort(araclar);\n        double toplam = 0;\n        for (Arac a : araclar) {\n            System.out.println(a);\n            toplam += a.yakitTuketimi();\n        }\n        System.out.println(\"Toplam tüketim: \" + toplam);\n    }\n}\n\npublic class FiloTest {\n    public static void main(String[] args) {\n        Filo filo = new Filo();\n        Arac[] araclar = { new Kamyon(\"34 ABC 01\"), new Kamyonet(\"06 XY 22\"), new Motosiklet(\"35 M 7\"), new Kamyonet(\"06 XY 22\") };\n        for (Arac a : araclar)\n            System.out.println(a.getPlaka() + (filo.aracEkle(a) ? \" eklendi\" : \" zaten filoda\"));\n\n        double[] yukler = { 12000, 3000, 200 };\n        for (int i = 0; i < 3; i++) {\n            try {\n                araclar[i].yukle(yukler[i]);\n            } catch (KapasiteAsimiException e) {\n                System.out.println(\"Yüklenemedi: \" + e.getMessage());\n            }\n        }\n        filo.sogukZincir(4);\n        filo.rapor();\n    }\n}",
            "output": "34 ABC 01 eklendi\n06 XY 22 eklendi\n35 M 7 eklendi\n06 XY 22 zaten filoda\nYüklenemedi: 35 M 7: 200.0 kg > kapasite 150.0\n34 ABC 01 soğutma 4°C\n35 M 7 yük 0.0 kg, 3.5 L/100km\n06 XY 22 yük 3000.0 kg, 15.0 L/100km\n34 ABC 01 yük 12000.0 kg, 42.0 L/100km\nToplam tüketim: 60.5",
            "a": "Hocanın 2022 Vasıta sorusunun mantığıyla aynı: soyut kök + bazı alt sınıfların arayüz yeteneği + Comparable + yönetici sınıfta iş kuralı."
          },
          {
            "type": "write",
            "q": "<b>S6 · 25p</b>: Ders sınıfı, öğrenci notlarını tutan bir <code>ArrayList&lt;Double&gt;</code> içersin. <code>notEkle</code> metoduyla not eklensin:<ul><li>Eklenmek istenen değer sayı (Integer veya Double) değilse <b>GecersizTipException</b>,</li><li>0–100 aralığında değilse <b>AralikDisiException</b> fırlatılsın.</li></ul>Kendi istisna sınıflarınızı yazınız. <code>ortalama()</code> ve ortalamaya göre <code>harfNotu()</code> (AA ≥ 90, BA ≥ 80, BB ≥ 70, CB ≥ 60, CC ≥ 50, altı FF) metotlarını yazınız. Ders sınıfını encapsulation'a uygun tasarlayınız. 85, 92.5, \"yüz\", 120, 64 değerlerini ekleyerek test ediniz.",
            "rubric": [
              "İki istisna <code>extends Exception</code> + <code>super(mesaj)</code>",
              "Parametre <code>Object</code>; <code>instanceof Integer || instanceof Double</code>",
              "Aralık kontrolü <code>n &lt; 0 || n &gt; 100</code>",
              "<code>throws</code> ile iki istisna bildirilmiş",
              "Boş listede ortalama 0 (sıfıra bölme yok)",
              "Alanlar private; try-catch döngü içinde, iki ayrı catch"
            ],
            "solution": "import java.util.ArrayList;\n\nclass GecersizTipException extends Exception {\n    public GecersizTipException(String mesaj) { super(mesaj); }\n}\n\nclass AralikDisiException extends Exception {\n    public AralikDisiException(String mesaj) { super(mesaj); }\n}\n\nclass Ders {\n    private String ad;\n    private ArrayList<Double> notlar = new ArrayList<>();\n\n    public Ders(String ad) { this.ad = ad; }\n\n    public void notEkle(Object not) throws GecersizTipException, AralikDisiException {\n        if (!(not instanceof Integer || not instanceof Double))\n            throw new GecersizTipException(\"\\\"\" + not + \"\\\" not olarak eklenemez\");\n        double n = (not instanceof Integer) ? (Integer) not : (Double) not;   // unboxing\n        if (n < 0 || n > 100)\n            throw new AralikDisiException(n + \" 0-100 aralığında değil\");\n        notlar.add(n);                                                        // autoboxing\n    }\n\n    public double ortalama() {\n        if (notlar.isEmpty())\n            return 0;\n        double toplam = 0;\n        for (double n : notlar)\n            toplam += n;\n        return toplam / notlar.size();\n    }\n\n    public String harfNotu() {\n        double o = ortalama();\n        if (o >= 90) return \"AA\";\n        if (o >= 80) return \"BA\";\n        if (o >= 70) return \"BB\";\n        if (o >= 60) return \"CB\";\n        if (o >= 50) return \"CC\";\n        return \"FF\";\n    }\n}\n\npublic class NotTest {\n    public static void main(String[] args) {\n        Ders d = new Ders(\"NYP\");\n        Object[] girisler = {85, 92.5, \"yüz\", 120, 64};\n        for (Object g : girisler) {\n            try {\n                d.notEkle(g);\n                System.out.println(g + \" eklendi\");\n            } catch (GecersizTipException e) {\n                System.out.println(\"Tip hatası: \" + e.getMessage());\n            } catch (AralikDisiException e) {\n                System.out.println(\"Aralık hatası: \" + e.getMessage());\n            }\n        }\n        System.out.println(\"Ortalama: \" + d.ortalama() + \" → \" + d.harfNotu());\n    }\n}",
            "output": "85 eklendi\n92.5 eklendi\nTip hatası: \"yüz\" not olarak eklenemez\nAralık hatası: 120.0 0-100 aralığında değil\n64 eklendi\nOrtalama: 80.5 → BA",
            "a": "Koşullu ifadede <code>(Integer) not : (Double) not</code> ikisi de double'a açılır (unboxing + genişletme)."
          }
        ]
      },
      {
        "id": "deneme-4",
        "title": "Deneme Vizesi 4 · IoT Sensör Ağı (2025 formatı)",
        "en": "Mock Midterm",
        "src": "Yeni sınav · 80 dk · 100 puan",
        "minutes": 80,
        "blocks": [
          {
            "t": "p",
            "html": "Bu sınavda öne çıkanlar: <b>Cloneable + sığ/derin kopya, catch içinde yeniden fırlatma, ClassCastException, static paylaşım, iskelet: IoT</b>. Sayacı başlat, soruları sırayla çöz; kâğıt kalemle çalışmak gerçek sınava en yakın yol. Her kartta cevabı açınca kendini değerlendir."
          },
          {
            "t": "table",
            "head": [
              "Soru",
              "Tür",
              "Puan"
            ],
            "rows": [
              [
                "S1",
                "Boşluk doldurma (10 cümle)",
                "15"
              ],
              [
                "S2",
                "Çıktı: istisna akışı + polimorfik dizi",
                "15"
              ],
              [
                "S3",
                "Hata bul: Cloneable, static, arayüz",
                "15"
              ],
              [
                "S4",
                "Çıktı + açıklama: static / instance",
                "15"
              ],
              [
                "S5",
                "İskelet [B1]–[B14]: IoT",
                "40"
              ]
            ]
          },
          {
            "t": "dg",
            "id": "exam-timer-2025"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "prose": true,
            "q": "S1 · 15p",
            "text": "Cloneable arayüzünü uygulamayan bir sınıfta super.clone() çağrılırsa ⟦0⟧ fırlatılır.",
            "answers": [
              [
                "CloneNotSupportedException"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Object sınıfındaki clone() metodunun erişim belirleyicisi ⟦0⟧'dir; bu yüzden override ederken genellikle ⟦1⟧ yapılır.",
            "answers": [
              [
                "protected"
              ],
              [
                "public"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "super.clone() ile yapılan kopyada referans tipli alanlar aynı nesneyi gösterir; buna ⟦0⟧ kopya denir.",
            "answers": [
              [
                "sığ",
                "shallow",
                "yüzeysel"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Bir String'i int'e çevirmek için ⟦0⟧ metodu kullanılır; String sayı biçiminde değilse ⟦1⟧ fırlatılır.",
            "answers": [
              [
                "Integer.parseInt",
                "parseInt",
                "Integer.parseInt()",
                "parseInt()"
              ],
              [
                "NumberFormatException"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Uyumsuz bir aşağı dönüşümde (downcasting) çalışma zamanında ⟦0⟧ oluşur.",
            "answers": [
              [
                "ClassCastException"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Soyut sınıflardan ⟦0⟧ ile nesne oluşturulamaz ama referans ⟦1⟧ olarak kullanılabilirler.",
            "answers": [
              [
                "new"
              ],
              [
                "tipi",
                "tip",
                "türü",
                "tür",
                "type"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "compareTo metodu karşılaştırılan iki nesne eşitse ⟦0⟧ döndürür.",
            "answers": [
              [
                "0",
                "sıfır"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Bir arayüzü uygulayan somut sınıf, arayüzdeki tüm ⟦0⟧ metotları uygulamak zorundadır.",
            "answers": [
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
            "q": "S1",
            "text": "static metotlar override edilmez; alt sınıfta aynı imzayla yazılırsa üst sınıftaki metot ⟦0⟧.",
            "answers": [
              [
                "gizlenir",
                "hiding",
                "saklanır"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Bir sınıfın alt sınıfının yazılmasını engellemek için sınıf ⟦0⟧ olarak tanımlanır.",
            "answers": [
              [
                "final"
              ]
            ],
            "a": ""
          },
          {
            "type": "write",
            "q": "<b>S2 (a) · 8p</b>: Çıktıyı yazınız.",
            "given": "public class S2a {\n    static int sayac = 0;\n\n    static void m(int i) throws Exception {\n        try {\n            sayac++;\n            if (i == 1) throw new IllegalStateException(\"durum\");\n            if (i == 2) throw new Exception(\"genel\");\n            System.out.print(\"T\" + i + \" \");\n        } catch (IllegalStateException e) {\n            System.out.print(\"C1 \");\n            throw new RuntimeException(\"yeni\");\n        } finally {\n            System.out.print(\"F\" + i + \" \");\n        }\n        System.out.print(\"S\" + i + \" \");\n    }\n\n    public static void main(String[] args) {\n        for (int i = 0; i < 3; i++) {\n            try {\n                m(i);\n            } catch (RuntimeException e) {\n                System.out.print(\"R:\" + e.getMessage() + \" \");\n            } catch (Exception e) {\n                System.out.print(\"E:\" + e.getMessage() + \" \");\n            }\n            System.out.println(\"| sayac=\" + sayac);\n        }\n    }\n}",
            "output": "T0 F0 S0 | sayac=1\nC1 F1 R:yeni | sayac=2\nF2 E:genel | sayac=3",
            "a": "<ul><li>i=0: istisna yok → T0, finally F0, sonra S0.</li><li>i=1: IllegalStateException yakalanır (C1), catch içinde <b>yeni</b> RuntimeException fırlatılır → önce finally (F1), sonra main'deki RuntimeException catch'i. S1 çalışmaz.</li><li>i=2: Exception m'de yakalanmaz (catch sadece IllegalStateException) → F2 → main'deki Exception catch'i.</li></ul>"
          },
          {
            "type": "write",
            "q": "<b>S2 (b) · 7p</b>: Programın çıktısını yazınız; program bir istisnayla sonlanıyorsa adını yazınız.",
            "given": "abstract class Calgi {\n    abstract String cal();\n    public String toString() { return \"Çalgı:\" + cal(); }\n}\ninterface Telli {\n    int TEL = 6;\n}\nclass Gitar extends Calgi implements Telli {\n    String cal() { return \"tıngır\"; }\n}\nclass Keman extends Calgi implements Telli {\n    String cal() { return \"vıy\"; }\n    public String toString() { return \"Keman/\" + super.toString(); }\n}\nclass Davul extends Calgi {\n    String cal() { return \"güm\"; }\n}\npublic class S2b {\n    public static void main(String[] args) {\n        Calgi[] c = { new Gitar(), new Davul(), new Keman() };\n        int tel = 0;\n        for (Calgi x : c) {\n            System.out.println(x);\n            if (x instanceof Telli)\n                tel += Telli.TEL;\n        }\n        System.out.println(\"Toplam tel: \" + tel);\n        Gitar g = (Gitar) c[2];\n        System.out.println(g.cal());\n    }\n}",
            "output": "Çalgı:tıngır\nÇalgı:güm\nKeman/Çalgı:vıy\nToplam tel: 12\nException in thread \"main\" java.lang.ClassCastException: class Keman cannot be cast to class Gitar",
            "a": "toString içindeki <code>cal()</code> dinamik bağlanır. Keman, super.toString()'i çağırırken yine Keman'ın cal()'ı kullanılır. Son satır: c[2] bir <b>Keman</b>; Gitar'a cast derlenir (ikisi de Calgi) ama çalışmada <b>ClassCastException</b>."
          },
          {
            "type": "bug",
            "q": "<b>S3 · 15p</b>: Hataları satır numarasıyla bulunuz, nedenlerini açıklayınız, kodu düzelterek çıktısını yazınız.",
            "code": "class Ayar implements Cloneable {\n    private int[] esikler = {10, 20};\n    public int[] getEsikler() { return esikler; }\n    public Ayar clone() {\n        return (Ayar) super.clone();\n    }\n}\ninterface Olcer {\n    double oku();\n}\nclass Termometre implements Olcer {\n    public double oku() { return 21.5; }\n    public static double fahrenheit() { return oku() * 1.8 + 32; }\n}\npublic class AyarTest {\n    public static void main(String[] args) {\n        Ayar a = new Ayar();\n        Ayar b = a.clone();\n        Olcer o = new Olcer();\n        System.out.println(b.getEsikler()[0] + \" \" + Termometre.fahrenheit());\n    }\n}",
            "bugs": [
              5,
              13,
              19
            ],
            "explain": [
              {
                "line": 5,
                "kind": "Derleme",
                "text": "<code>super.clone()</code> kontrollü <b>CloneNotSupportedException</b> fırlatabilir; yakalanmalı ya da bildirilmeli."
              },
              {
                "line": 13,
                "kind": "Derleme",
                "text": "static metottan instance metodu <code>oku()</code> çağrılamaz."
              },
              {
                "line": 19,
                "kind": "Derleme",
                "text": "Arayüzün nesnesi oluşturulamaz: <code>new Termometre()</code>."
              },
              {
                "line": 2,
                "kind": "Not",
                "text": "Derleme hatası değil ama: <code>esikler</code> dizi olduğu için super.clone() <b>sığ kopya</b> yapar; a ve b aynı diziyi paylaşır. Derin kopya için <code>kopya.esikler = esikler.clone();</code>"
              }
            ],
            "fixed": "class Ayar implements Cloneable {\n    private int[] esikler = {10, 20};\n    public int[] getEsikler() { return esikler; }\n    @Override\n    public Ayar clone() {\n        try {\n            Ayar kopya = (Ayar) super.clone();\n            kopya.esikler = esikler.clone();        // derin kopya\n            return kopya;\n        } catch (CloneNotSupportedException e) {\n            return null;                            // Cloneable olduğu için olmaz\n        }\n    }\n}\ninterface Olcer {\n    double oku();\n}\nclass Termometre implements Olcer {\n    public double oku() { return 21.5; }\n    public double fahrenheit() { return oku() * 1.8 + 32; }\n}\npublic class AyarTest {\n    public static void main(String[] args) {\n        Ayar a = new Ayar();\n        Ayar b = a.clone();\n        b.getEsikler()[0] = 99;\n        Termometre t = new Termometre();\n        Olcer o = t;\n        System.out.println(a.getEsikler()[0] + \" \" + b.getEsikler()[0] + \" \" + o.oku() + \" \" + t.fahrenheit());\n    }\n}",
            "output": "10 99 21.5 70.7",
            "a": ""
          },
          {
            "type": "write",
            "q": "<b>S4 · 15p</b>: Programın çıktısını yazınız. <code>toplamSkor</code> ile <code>skor</code> neden farklı davranıyor?",
            "given": "class Oyuncu {\n    static int toplamSkor = 0;\n    int skor = 0;\n    String ad;\n\n    Oyuncu(String ad) { this.ad = ad; }\n\n    void puanAl(int p) {\n        skor += p;\n        toplamSkor += p;\n    }\n\n    static void sifirla() { toplamSkor = 0; }\n}\npublic class S4 {\n    public static void main(String[] args) {\n        Oyuncu a = new Oyuncu(\"Ali\"), b = new Oyuncu(\"Ece\");\n        a.puanAl(10);\n        b.puanAl(5);\n        a.puanAl(3);\n        System.out.println(a.skor + \" \" + b.skor + \" \" + Oyuncu.toplamSkor);\n        b.sifirla();\n        b.puanAl(7);\n        System.out.println(a.skor + \" \" + b.skor + \" \" + a.toplamSkor);\n        Oyuncu c = a;\n        c.skor = 100;\n        System.out.println(a.skor + \" \" + (a == c));\n    }\n}",
            "output": "13 5 18\n13 12 7\n100 true",
            "a": "<code>skor</code> instance: her oyuncunun kendi kopyası. <code>toplamSkor</code> static: tek kopya, herkes paylaşır. <code>b.sifirla()</code> nesne üzerinden yazılsa da static metottur, <b>ortak</b> sayacı sıfırlar (a.toplamSkor da 7 olur). <code>c = a</code> aynı nesneye ikinci referans (aliasing)."
          },
          {
            "type": "skeleton",
            "q": "<b>S5 · 40p</b>: IoT Sensör Ağı. Kod iskeletini tamamlayınız.",
            "req": [
              "Sensor soyut sınıfı: <b>id yalnızca okunur</b>, konum değiştirilebilir; soyut <code>olc()</code>.",
              "Sensörler <b>son ölçüme göre</b> karşılaştırılabilir (Comparable) ve <b>klonlanabilir</b> (Cloneable). clone() public olmalı, kontrollü istisnayı içeride ele almalı.",
              "<b>Sadece sıcaklık sensörü</b> alarm üretebilir: <code>Alarmli</code> arayüzü (eşik aşılırsa alarm).",
              "<b>İş kuralı</b>: ağa aynı id'li ikinci sensör eklenemez (klon da aynı id'ye sahiptir!).",
              "tara(): tüm sensörleri ölçüp sıralar; eşiği aşan alarmlı sensörde <code>AlarmException</code> fırlatır."
            ],
            "code": "import java.util.ArrayList;\nimport java.util.Collections;\n\nclass AlarmException ⟦0⟧ {\n    public AlarmException(String mesaj) { super(mesaj); }\n}\n\ninterface Alarmli {\n    ⟦1⟧\n}\n\nabstract class Sensor ⟦2⟧ {\n    ⟦3⟧\n    private String konum;\n    protected double ham;          // simüle ham değer\n    protected double sonDeger;\n\n    public Sensor(String id, String konum, double ham) {\n        this.id = id;\n        this.konum = konum;\n        this.ham = ham;\n    }\n\n    public String getId() { return id; }\n    public String getKonum() { return konum; }\n    public void setKonum(String konum) { this.konum = konum; }\n\n    ⟦4⟧\n\n    @Override\n    public int compareTo(Sensor o) {\n        ⟦5⟧\n    }\n\n    @Override\n    public Sensor clone() {\n        ⟦6⟧\n    }\n}\n\nclass SicaklikSensoru ⟦7⟧ {\n    private final double esik;\n\n    public SicaklikSensoru(String id, String konum, double ham, double esik) {\n        ⟦8⟧\n    }\n\n    @Override\n    public double olc() { sonDeger = ham; return sonDeger; }\n\n    ⟦9⟧\n}\n\nclass NemSensoru extends Sensor {                 // alarm üretmez\n    public NemSensoru(String id, String konum, double ham) { super(id, konum, ham); }\n\n    ⟦10⟧\n}\n\nclass SensorAgi {\n    private ArrayList<Sensor> sensorler = new ArrayList<>();\n\n    // İŞ KURALI: aynı id'li sensör ikinci kez eklenemez\n    public boolean ekle(Sensor s) {\n        ⟦11⟧\n    }\n\n    public void tara() throws AlarmException {\n        for (Sensor s : sensorler)\n            s.olc();                              // dinamik bağlama\n        Collections.sort(sensorler);\n        for (Sensor s : sensorler) {\n            System.out.println(s.getId() + \" @\" + s.getKonum() + \": \" + s.sonDeger);\n            ⟦12⟧\n        }\n    }\n}\n\npublic class IoTTest {\n    public static void main(String[] args) {\n        SensorAgi ag = new SensorAgi();\n        Sensor s1 = new SicaklikSensoru(\"T1\", \"Salon\", 24.5, 30);\n        Sensor s2 = new NemSensoru(\"N1\", \"Banyo\", 0.65);\n        ⟦13⟧\n        System.out.println(ag.ekle(s1) + \" \" + ag.ekle(s2) + \" \" + ag.ekle(s3));\n        ag.ekle(new SicaklikSensoru(\"T2\", \"Fırın\", 85, 60));\n        try {\n            ag.tara();\n        } catch (AlarmException e) {\n            System.out.println(\"ALARM: \" + e.getMessage());\n        }\n        System.out.println(s1.getKonum() + \" / \" + s3.getKonum());\n    }\n}",
            "blanks": [
              {
                "model": "extends Exception"
              },
              {
                "model": "boolean alarmVarMi();",
                "answers": [
                  "public boolean alarmVarMi();",
                  "public abstract boolean alarmVarMi();"
                ]
              },
              {
                "model": "implements Comparable<Sensor>, Cloneable",
                "answers": [
                  "implements Cloneable, Comparable<Sensor>"
                ],
                "note": "Birden çok arayüz virgülle."
              },
              {
                "model": "private final String id;",
                "answers": [
                  "private String id;"
                ]
              },
              {
                "model": "public abstract double olc();"
              },
              {
                "model": "return Double.compare(sonDeger, o.sonDeger);",
                "answers": [
                  "return Double.compare(this.sonDeger, o.sonDeger);"
                ]
              },
              {
                "model": "try {\n    return (Sensor) super.clone();\n} catch (CloneNotSupportedException e) {\n    return null;\n}",
                "note": "Başlıkta <code>throws</code> yok → kontrollü istisna içeride yakalanmalı."
              },
              {
                "model": "extends Sensor implements Alarmli"
              },
              {
                "model": "super(id, konum, ham);\nthis.esik = esik;"
              },
              {
                "model": "@Override\npublic boolean alarmVarMi() { return sonDeger > esik; }",
                "answers": [
                  "@Override\npublic boolean alarmVarMi() {\n    return sonDeger > esik;\n}"
                ]
              },
              {
                "model": "@Override\npublic double olc() { sonDeger = ham * 100; return sonDeger; }",
                "answers": [
                  "@Override\npublic double olc() {\n    sonDeger = ham * 100;\n    return sonDeger;\n}"
                ],
                "note": "Nem oranı yüzde olarak."
              },
              {
                "model": "for (Sensor x : sensorler)\n    if (x.getId().equals(s.getId()))\n        return false;\nsensorler.add(s);\nreturn true;",
                "note": "id String → <code>equals</code>."
              },
              {
                "model": "if (s instanceof Alarmli && ((Alarmli) s).alarmVarMi())\n    throw new AlarmException(s.getId() + \" eşik aşıldı!\");"
              },
              {
                "model": "Sensor s3 = s1.clone();\ns3.setKonum(\"Mutfak\");",
                "note": "Klon farklı nesne (konumu bağımsız) ama id aynı → ağa eklenemez."
              }
            ],
            "output": "true true false\nT1 @Salon: 24.5\nN1 @Banyo: 65.0\nT2 @Fırın: 85.0\nALARM: T2 eşik aşıldı!\nSalon / Mutfak",
            "a": ""
          }
        ]
      },
      {
        "id": "deneme-5",
        "title": "Deneme Vizesi 5 · Konferans Kayıt (karma format)",
        "en": "Mock Midterm",
        "src": "Yeni sınav · 80 dk · 100 puan",
        "minutes": 80,
        "blocks": [
          {
            "t": "p",
            "html": "Bu sınavda öne çıkanlar: <b>dosya I/O, ArrayList remove(int)/remove(Object), equals override, istisna yayılımı, iskelet: Konferans</b>. Sayacı başlat, soruları sırayla çöz; kâğıt kalemle çalışmak gerçek sınava en yakın yol. Her kartta cevabı açınca kendini değerlendir."
          },
          {
            "t": "table",
            "head": [
              "Soru",
              "Tür",
              "Puan"
            ],
            "rows": [
              [
                "S1",
                "Boşluk doldurma (8 cümle)",
                "10"
              ],
              [
                "S2",
                "Doğru / Yanlış",
                "10"
              ],
              [
                "S3",
                "Çıktı: ArrayList + equals",
                "15"
              ],
              [
                "S4",
                "Hata bul: dosya I/O",
                "15"
              ],
              [
                "S5",
                "İskelet [B1]–[B14]: Konferans",
                "40"
              ],
              [
                "S6",
                "Çıktı: istisna yayılımı",
                "10"
              ]
            ]
          },
          {
            "t": "dg",
            "id": "exam-timer-karma"
          }
        ],
        "checks": [
          {
            "type": "fill",
            "prose": true,
            "q": "S1 · 10p",
            "text": "PrintWriter ile yazılan verilerin dosyaya kaydedilmesi için yazma bitince ⟦0⟧ metodu çağrılmalıdır.",
            "answers": [
              [
                "close",
                "close()",
                "flush",
                "flush()"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "<code>new Scanner(\"veri.txt\")</code> ifadesi dosyayı değil, ⟦0⟧ okur.",
            "answers": [
              [
                "metni",
                "string",
                "stringi",
                "yazıyı",
                "veri.txt metnini",
                "kelimeyi",
                "stringin kendisini"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Bir dosyanın diskte var olup olmadığını File sınıfının ⟦0⟧ metodu söyler.",
            "answers": [
              [
                "exists",
                "exists()"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "ArrayList&lt;Integer&gt; üzerinde <code>remove(1)</code> çağrısı ⟦0⟧ 1'deki elemanı siler.",
            "answers": [
              [
                "indeks",
                "index",
                "indis",
                "konum",
                "sıra"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "ArrayList'in contains ve indexOf metotları elemanları ⟦0⟧ metoduyla karşılaştırır.",
            "answers": [
              [
                "equals",
                "equals()"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Alt sınıfın toString metodu içinden üst sınıfın toString metodunu çağırmak için ⟦0⟧ yazılır.",
            "answers": [
              [
                "super.toString()",
                "super.toString",
                "super"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Tüm istisna ve hata sınıflarının ortak üst sınıfı ⟦0⟧'dir.",
            "answers": [
              [
                "Throwable"
              ]
            ],
            "a": ""
          },
          {
            "type": "fill",
            "prose": true,
            "q": "S1",
            "text": "Scanner'dan nextInt() ile okuma yapılırken sayı olmayan bir giriş gelirse ⟦0⟧ fırlatılır.",
            "answers": [
              [
                "InputMismatchException"
              ]
            ],
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · 10p · File sınıfı bir dosyanın içeriğini okumak için kullanılır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "File dosyanın adı/özellikleriyle ilgilenir; içerik için Scanner."
          },
          {
            "type": "mc",
            "q": "S2 · PrintWriter nesnesi oluşturulurken dosya varsa içeriği silinir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · equals override edilmezse içerikleri aynı olan iki farklı nesne için equals false döner.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · System.out.println(nesne) çağrısında nesnenin toString metodu otomatik çağrılır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · ArrayList oluşturulurken boyutu belirtilmek zorundadır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · final bir referans değişkenin gösterdiği nesnenin alanları değiştirilemez.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "final referans başka nesneye yönlendirilemez; nesnenin içi değişebilir."
          },
          {
            "type": "mc",
            "q": "S2 · Bir metot birden fazla istisnayı throws ile bildirebilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · Error sınıfından türeyen hatalar genellikle program içinde yakalanmalıdır.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": "Error (OutOfMemoryError…) ciddi sistem hatalarıdır; genelde yakalanmaz."
          },
          {
            "type": "mc",
            "q": "S2 · catch bloğunda yakalanan istisna yeniden fırlatılabilir.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 0,
            "a": ""
          },
          {
            "type": "mc",
            "q": "S2 · protected üyelere aynı paketteki, alt sınıf olmayan sınıflardan erişilemez.",
            "options": [
              "Doğru (T)",
              "Yanlış (F)"
            ],
            "answer": 1,
            "a": ""
          },
          {
            "type": "write",
            "q": "<b>S3 · 15p</b>: Çıktıyı yazınız.",
            "given": "import java.util.ArrayList;\n\nclass Kisi {\n    String ad;\n    Kisi(String ad) { this.ad = ad; }\n\n    @Override\n    public boolean equals(Object o) {\n        if (!(o instanceof Kisi))\n            return false;\n        return ad.equals(((Kisi) o).ad);\n    }\n\n    @Override\n    public String toString() { return ad; }\n}\n\npublic class S3 {\n    public static void main(String[] args) {\n        ArrayList<Integer> s = new ArrayList<>();\n        s.add(10); s.add(20); s.add(30); s.add(1);\n        s.remove(1);\n        s.remove(Integer.valueOf(1));\n        System.out.println(s);\n\n        ArrayList<Kisi> k = new ArrayList<>();\n        k.add(new Kisi(\"Ada\"));\n        k.add(new Kisi(\"Bora\"));\n        Kisi x = new Kisi(\"Ada\");\n        System.out.println(k.contains(x) + \" \" + (k.get(0) == x) + \" \" + k.indexOf(new Kisi(\"Bora\")));\n        k.remove(x);\n        System.out.println(k + \" \" + k.size());\n    }\n}",
            "output": "[10, 30]\ntrue false 1\n[Bora] 1",
            "a": "<ul><li><code>remove(1)</code>: int argüman → <b>indeks</b> 1 (20) silinir. <code>remove(Integer.valueOf(1))</code>: nesne → <b>değeri</b> 1 olan silinir.</li><li>contains / indexOf / remove(Object) <b>equals</b> kullanır: override edildiği için ad eşitse aynı sayılır. <code>==</code> ise farklı nesne → false.</li></ul>"
          },
          {
            "type": "bug",
            "q": "<b>S4 · 15p</b>: Program \"Toplam=42\" yazdırmak için yazılmıştır. Derleme hatalarını ve mantık hatalarını satır numarasıyla bulunuz, düzeltilmiş kodu yazınız.",
            "code": "import java.io.File;\nimport java.io.PrintWriter;\nimport java.util.Scanner;\n\npublic class Rapor {\n    public static void main(String[] args) {\n        File f = new File(\"rapor.txt\");\n        PrintWriter yaz = new PrintWriter(f);\n        yaz.println(\"Toplam 42\");\n        Scanner oku = new Scanner(\"rapor.txt\");\n        String kelime = oku.next();\n        int sayi = oku.next();\n        System.out.println(kelime + \"=\" + sayi);\n    }\n}",
            "bugs": [
              8,
              9,
              10,
              12
            ],
            "explain": [
              {
                "line": 8,
                "kind": "Derleme",
                "text": "<code>new PrintWriter(f)</code> kontrollü <b>FileNotFoundException</b> fırlatabilir: main'e <code>throws FileNotFoundException</code> (veya try-catch). javac bunu 12. satır düzelince gösterir."
              },
              {
                "line": 12,
                "kind": "Derleme",
                "text": "<code>next()</code> String döndürür; int'e atanamaz → <code>nextInt()</code>."
              },
              {
                "line": 9,
                "kind": "Mantık",
                "text": "Yazıcı kapatılmadan okumaya geçiliyor; veri dosyaya aktarılmamış olabilir → <code>yaz.close();</code>"
              },
              {
                "line": 10,
                "kind": "Mantık",
                "text": "<code>new Scanner(\"rapor.txt\")</code> dosyayı değil \"rapor.txt\" <b>metnini</b> okur → <code>new Scanner(f)</code>. (Bu haliyle nextInt InputMismatchException verirdi.)"
              }
            ],
            "fixed": "import java.io.File;\nimport java.io.FileNotFoundException;\nimport java.io.PrintWriter;\nimport java.util.Scanner;\n\npublic class Rapor {\n    public static void main(String[] args) throws FileNotFoundException {\n        File f = new File(\"rapor.txt\");\n        PrintWriter yaz = new PrintWriter(f);\n        yaz.println(\"Toplam 42\");\n        yaz.close();\n        Scanner oku = new Scanner(f);\n        String kelime = oku.next();\n        int sayi = oku.nextInt();\n        System.out.println(kelime + \"=\" + sayi);\n        oku.close();\n    }\n}",
            "output": "Toplam=42",
            "a": ""
          },
          {
            "type": "skeleton",
            "q": "<b>S5 · 40p</b>: Konferans Kayıt Sistemi. Kod iskeletini tamamlayınız.",
            "req": [
              "Katilimci soyut sınıfı: <b>kayitNo</b> otomatik artan ve yalnızca okunur; soyut <code>ucret()</code>.",
              "<b>Aynı e-posta = aynı kişi</b>: equals override edilmeli.",
              "Ogrenci (250 TL) ve Akademisyen (1500 TL, bildirisi varsa %20 indirim) sertifika alır: <code>Sertifikali</code> arayüzü. Misafir (ücretsiz) sertifika almaz.",
              "<b>İş kuralları</b>: aynı kişi ikinci kez kaydolamaz (false döner); kontenjan doluysa kontrollü <code>KontenjanDoluException</code>.",
              "Sertifikalar yalnızca sertifikalı katılımcılar için basılır."
            ],
            "code": "import java.util.ArrayList;\n\nclass KontenjanDoluException ⟦0⟧ {\n    public KontenjanDoluException(String mesaj) {\n        ⟦1⟧\n    }\n}\n\ninterface Sertifikali {\n    ⟦2⟧\n}\n\nabstract class Katilimci {\n    private static int sayac = 1000;\n    ⟦3⟧\n    private String ad;\n    protected String eposta;\n\n    public Katilimci(String ad, String eposta) {\n        ⟦4⟧\n    }\n\n    public int getKayitNo() { return kayitNo; }\n    public String getAd() { return ad; }\n\n    ⟦5⟧\n\n    @Override\n    public boolean equals(Object o) {          // aynı e-posta = aynı kişi\n        ⟦6⟧\n    }\n\n    @Override\n    public String toString() { return kayitNo + \" \" + ad; }\n}\n\nclass Ogrenci ⟦7⟧ {\n    public Ogrenci(String ad, String eposta) { super(ad, eposta); }\n\n    @Override\n    public double ucret() { return 250; }\n\n    ⟦8⟧\n}\n\nclass Akademisyen extends Katilimci implements Sertifikali {\n    private boolean bildiriVar;\n\n    public Akademisyen(String ad, String eposta, boolean bildiriVar) {\n        ⟦9⟧\n    }\n\n    @Override\n    public double ucret() {\n        ⟦10⟧\n    }\n\n    @Override\n    public String sertifika() { return getAd() + (bildiriVar ? \" bildiri\" : \" katılım\") + \" sertifikası\"; }\n}\n\nclass Misafir extends Katilimci {               // sertifika almaz\n    public Misafir(String ad, String eposta) { super(ad, eposta); }\n\n    @Override\n    public double ucret() { return 0; }\n}\n\nclass Konferans {\n    private final int kontenjan;\n    private ArrayList<Katilimci> kayitlar = new ArrayList<>();\n\n    public Konferans(int kontenjan) { this.kontenjan = kontenjan; }\n\n    // İŞ KURALLARI: aynı kişi iki kez kaydolamaz; kontenjan dolunca istisna\n    public boolean kaydet(Katilimci k) throws KontenjanDoluException {\n        ⟦11⟧\n    }\n\n    public void sertifikaBas() {\n        for (Katilimci k : kayitlar) {\n            ⟦12⟧\n        }\n    }\n\n    public double toplamGelir() {\n        double toplam = 0;\n        for (Katilimci k : kayitlar)\n            toplam += k.ucret();\n        return toplam;\n    }\n}\n\npublic class KonferansTest {\n    public static void main(String[] args) {\n        Konferans konf = new Konferans(3);\n        Katilimci[] basvurular = {\n            new Ogrenci(\"Deniz\", \"deniz@uni.edu\"),\n            new Akademisyen(\"Prof. Kaya\", \"kaya@uni.edu\", true),\n            new Ogrenci(\"Deniz Y.\", \"deniz@uni.edu\"),\n            new Misafir(\"Selin\", \"selin@mail.com\"),\n            new Akademisyen(\"Dr. Ak\", \"ak@uni.edu\", false)\n        };\n        for (Katilimci k : basvurular) {\n            ⟦13⟧\n        }\n        konf.sertifikaBas();\n        System.out.println(\"Gelir: \" + konf.toplamGelir());\n    }\n}",
            "blanks": [
              {
                "model": "extends Exception"
              },
              {
                "model": "super(mesaj);"
              },
              {
                "model": "String sertifika();",
                "answers": [
                  "public String sertifika();",
                  "public abstract String sertifika();"
                ]
              },
              {
                "model": "private final int kayitNo;",
                "answers": [
                  "private int kayitNo;"
                ]
              },
              {
                "model": "kayitNo = ++sayac;\nthis.ad = ad;\nthis.eposta = eposta;",
                "answers": [
                  "this.kayitNo = ++sayac;\nthis.ad = ad;\nthis.eposta = eposta;"
                ],
                "note": "static sayaç her yeni nesnede artar; final alana yapıcıda bir kez atanır."
              },
              {
                "model": "public abstract double ucret();"
              },
              {
                "model": "if (!(o instanceof Katilimci))\n    return false;\nreturn eposta.equals(((Katilimci) o).eposta);",
                "note": "Parametre Object olmalı (equals(Katilimci) yazmak override değil overload olur!)."
              },
              {
                "model": "extends Katilimci implements Sertifikali"
              },
              {
                "model": "@Override\npublic String sertifika() { return getAd() + \" katılım sertifikası\"; }",
                "answers": [
                  "@Override\npublic String sertifika() {\n    return getAd() + \" katılım sertifikası\";\n}"
                ]
              },
              {
                "model": "super(ad, eposta);\nthis.bildiriVar = bildiriVar;"
              },
              {
                "model": "return bildiriVar ? 1500 * 0.8 : 1500;",
                "answers": [
                  "if (bildiriVar) return 1200;\nreturn 1500;",
                  "return bildiriVar ? 1200 : 1500;"
                ]
              },
              {
                "model": "if (kayitlar.contains(k))\n    return false;\nif (kayitlar.size() >= kontenjan)\n    throw new KontenjanDoluException(\"Kontenjan dolu, \" + k.getAd() + \" kaydedilemedi\");\nkayitlar.add(k);\nreturn true;",
                "note": "<code>contains</code> equals'ı kullanır: \"Deniz Y.\" aynı e-postayla geldiği için aynı kişi sayılır."
              },
              {
                "model": "if (k instanceof Sertifikali)\n    System.out.println(((Sertifikali) k).sertifika());"
              },
              {
                "model": "try {\n    System.out.println(k + (konf.kaydet(k) ? \" kaydedildi\" : \" zaten kayıtlı\"));\n} catch (KontenjanDoluException e) {\n    System.out.println(\"Hata: \" + e.getMessage());\n}"
              }
            ],
            "output": "1001 Deniz kaydedildi\n1002 Prof. Kaya kaydedildi\n1003 Deniz Y. zaten kayıtlı\n1004 Selin kaydedildi\nHata: Kontenjan dolu, Dr. Ak kaydedilemedi\nDeniz katılım sertifikası\nProf. Kaya bildiri sertifikası\nGelir: 1450.0",
            "a": ""
          },
          {
            "type": "write",
            "q": "<b>S6 · 10p</b>: Çıktıyı yazınız.",
            "given": "public class Yayilim {\n    static void c(int x) {\n        System.out.println(\"c başladı\");\n        if (x > 0)\n            throw new IllegalArgumentException(\"x>0\");\n        System.out.println(\"c bitti\");\n    }\n    static void b(int x) {\n        try {\n            c(x);\n            System.out.println(\"b: c sonrası\");\n        } finally {\n            System.out.println(\"b finally\");\n        }\n    }\n    static void a(int x) {\n        try {\n            b(x);\n        } catch (IllegalArgumentException e) {\n            System.out.println(\"a yakaladı: \" + e.getMessage());\n        }\n        System.out.println(\"a bitti\");\n    }\n    public static void main(String[] args) {\n        a(0);\n        System.out.println(\"--\");\n        a(1);\n    }\n}",
            "output": "c başladı\nc bitti\nb: c sonrası\nb finally\na bitti\n--\nc başladı\nb finally\na yakaladı: x>0\na bitti",
            "a": "x=1'de istisna c'den b'ye yayılır: b'de catch yok, \"b: c sonrası\" atlanır ama <b>finally çalışır</b>; sonra a'daki catch yakalar, a normal devam eder."
          }
        ]
      }
    ]
  });

  const T = OOPLab.java.trace;

})(window.OOPLab = window.OOPLab || {});
