/* glossary.js — Kavram sözlüğü: [terim, açıklama, ders id] */
(function (OOPLab) {
  'use strict';
  OOPLab.glossary = [
    [
      "JVM (Java Virtual Machine)",
      "Derlenmiş bytecode'u çalıştıran sanal makine; Java'nın platform bağımsızlığını sağlar.",
      "iskelet"
    ],
    [
      "Bytecode",
      "javac'ın ürettiği, JVM'in anladığı ara kod (.class dosyası).",
      "iskelet"
    ],
    [
      "İlkel tip (primitive)",
      "int, double, char, boolean gibi değeri doğrudan tutan 8 temel tip.",
      "tipler"
    ],
    [
      "Casting (tür dönüşümü)",
      "Bir değeri başka tipe çevirme. Daraltmada (int) gibi açık yazım gerekir.",
      "tipler"
    ],
    [
      "Token",
      "Scanner'ın girdiyi boşluklara göre böldüğü her bir parça.",
      "scanner"
    ],
    [
      "İmza (signature)",
      "Metot adı + parametre tiplerinin sayısı ve sırası. Dönüş tipi dahil değildir.",
      "metot-overload"
    ],
    [
      "Overloading (aşırı yükleme)",
      "Aynı isimde, farklı parametreli metotlar. Seçim derleme zamanında yapılır.",
      "metot-overload"
    ],
    [
      "Fall-through",
      "switch'te break olmadığında alttaki case'lerin de çalışması.",
      "karar-dongu"
    ],
    [
      "Nesne (object / instance)",
      "Bir sınıftan new ile üretilmiş, kimliği, durumu ve davranışı olan somut varlık.",
      "nesne-nedir"
    ],
    [
      "Sınıf (class)",
      "Aynı türden nesnelerin veri alanlarını, yapıcılarını ve metotlarını tanımlayan şablon.",
      "nesne-nedir"
    ],
    [
      "Veri alanı (data field)",
      "Nesnenin durumunu tutan, sınıf içinde tanımlı değişken. Property/attribute da denir.",
      "sinif-anatomi"
    ],
    [
      "Yapıcı (constructor)",
      "Sınıfla aynı adlı, dönüş tipi olmayan, new ile çağrılıp nesneyi başlatan özel metot.",
      "yapici"
    ],
    [
      "Varsayılan yapıcı (default constructor)",
      "Sınıfta hiç yapıcı yoksa derleyicinin eklediği boş, parametresiz yapıcı.",
      "yapici"
    ],
    [
      "No-arg constructor",
      "Parametre almayan yapıcı.",
      "yapici"
    ],
    [
      "Referans değişkeni",
      "Nesnenin kendisini değil, nesnenin bellekteki adresini tutan değişken.",
      "referans-iz"
    ],
    [
      "null",
      "Hiçbir nesneyi göstermeyen referansın değeri; referans alanların varsayılanı.",
      "varsayilan-deger"
    ],
    [
      "Garbage collection (çöp toplama)",
      "Hiçbir referansın göstermediği nesnelerin belleğinin JVM tarafından otomatik geri alınması.",
      "ilkel-referans"
    ],
    [
      "Static (sınıf) değişkeni",
      "Sınıfa ait, tüm nesnelerin paylaştığı tek kopyalı değişken.",
      "static"
    ],
    [
      "Instance (örnek) değişkeni",
      "Her nesneye ayrı kopyası olan veri alanı.",
      "static"
    ],
    [
      "Görünürlük değiştirici (visibility modifier)",
      "public, protected, default, private: erişimi sınırlayan anahtar kelimeler.",
      "gorunurluk"
    ],
    [
      "Kapsülleme (encapsulation)",
      "Veriyi private yapıp kontrollü getter/setter ile erişim vermek.",
      "kapsulleme"
    ],
    [
      "Getter / accessor",
      "private alanı okumak için public metot: getX() veya boolean için isX().",
      "kapsulleme"
    ],
    [
      "Setter / mutator",
      "private alanı değiştirmek için public metot: setX(değer).",
      "kapsulleme"
    ],
    [
      "Pass-by-value",
      "Java'da argümanın değerinin (ilkel için değer, nesne için referans) kopyalanarak geçirilmesi.",
      "pass-by-value"
    ],
    [
      "Immutable (değişmez) nesne",
      "Oluşturulduktan sonra içeriği değiştirilemeyen nesne (ör. String).",
      "immutable"
    ],
    [
      "this",
      "Üzerinde çalışılan nesnenin kendisine referans; this(...) aynı sınıfın diğer yapıcısını çağırır.",
      "this"
    ],
    [
      "Shadowing (gizleme)",
      "Yerel değişken/parametrenin aynı adlı alanı gizlemesi.",
      "kapsam"
    ],
    [
      "ArrayList",
      "Boyutu dinamik büyüyen, ekleme/silme/arama metotları olan liste sınıfı (java.util).",
      "arraylist"
    ],
    [
      "Generic (<T>)",
      "Bir sınıfın hangi tipte nesneyle çalışacağını <...> ile belirtmek: ArrayList<String>.",
      "arraylist"
    ],
    [
      "Wrapper sınıf",
      "İlkel tipleri nesne olarak saran sınıf: Integer, Double, Character, Boolean...",
      "wrapper"
    ],
    [
      "Autoboxing / unboxing",
      "İlkel ↔ wrapper dönüşümünün derleyici tarafından otomatik yapılması.",
      "wrapper"
    ],
    [
      "UML sınıf diyagramı",
      "Sınıfı ad / alanlar / metotlar bölmeleriyle gösteren diyagram; + public, - private, # protected, altı çizili static.",
      "sinif-anatomi"
    ],
    [
      "Kalıtım (inheritance)",
      "Var olan bir sınıftan extends ile yeni sınıf türetmek; alt sınıf üst sınıfın üyelerini miras alır.",
      "kalitim-giris"
    ],
    [
      "Üst sınıf (superclass / parent / base)",
      "Türetilen sınıfın kaynağı olan sınıf.",
      "kalitim-giris"
    ],
    [
      "Alt sınıf (subclass / child / derived)",
      "Başka bir sınıftan türetilen, onu genişleten sınıf.",
      "kalitim-giris"
    ],
    [
      "is-a ilişkisi",
      "Kalıtımın anlamı: \"Daire bir geometrik nesnedir.\"",
      "kalitim-giris"
    ],
    [
      "super",
      "Üst sınıfa referans: super(...) üst yapıcıyı, super.m() üst sınıfın metodunu çağırır.",
      "super-yapici"
    ],
    [
      "Yapıcı zincirleme (constructor chaining)",
      "Nesne oluşturulurken kalıtım zinciri boyunca tüm üst yapıcıların çağrılması.",
      "yapici-zinciri"
    ],
    [
      "Override (geçersiz kılma)",
      "Alt sınıfta, üst sınıftaki metoda aynı imzayla yeni uygulama yazmak.",
      "override"
    ],
    [
      "@Override",
      "Derleyiciye metodun gerçekten override ettiğini kontrol ettiren notasyon.",
      "override"
    ],
    [
      "Hiding (gizleme)",
      "Static metodun alt sınıfta yeniden tanımlanması; override değildir, seçim bildirilen tipe göre.",
      "override"
    ],
    [
      "Object sınıfı",
      "java.lang.Object: Java'daki tüm sınıfların en üst atası.",
      "object-tostring"
    ],
    [
      "toString()",
      "Nesnenin metin temsilini döndüren Object metodu; genelde override edilir.",
      "object-tostring"
    ],
    [
      "Polimorfizm (çok biçimlilik)",
      "Üst tip değişkeninin alt tip nesneyi gösterebilmesi ve her nesnenin kendi davranışını sergilemesi.",
      "polimorfizm"
    ],
    [
      "Dinamik bağlama (dynamic binding)",
      "Çalıştırılacak instance metot uygulamasının çalışma zamanında gerçek tipe göre seçilmesi.",
      "polimorfizm"
    ],
    [
      "Bildirilen tip (declared type)",
      "Değişkenin tanımlandığı tip; hangi metotların çağrılabileceğini belirler.",
      "eslestirme-baglama"
    ],
    [
      "Gerçek tip (actual type)",
      "Değişkenin gösterdiği nesnenin gerçek sınıfı; hangi uygulamanın çalışacağını belirler.",
      "eslestirme-baglama"
    ],
    [
      "Upcasting",
      "Alt tipten üst tipe örtük dönüşüm; her zaman güvenli.",
      "casting"
    ],
    [
      "Downcasting",
      "Üst tipten alt tipe açık (Tip) dönüşüm; gerçek tip uymazsa ClassCastException.",
      "casting"
    ],
    [
      "instanceof",
      "Bir nesnenin belirli bir sınıfın (veya alt sınıfının) örneği olup olmadığını test eden operatör.",
      "casting"
    ],
    [
      "equals()",
      "İki nesnenin içeriğinin eşitliğini sınamak için (override edilmezse == gibi davranır).",
      "equals"
    ],
    [
      "protected",
      "Aynı paket ve (farklı pakette olsa bile) alt sınıflar tarafından erişilebilir.",
      "protected"
    ],
    [
      "final",
      "Sınıfta: genişletilemez; metotta: override edilemez; değişkende: sabit.",
      "final"
    ],
    [
      "İstisna (exception)",
      "Çalışma zamanında oluşan ve normal akışı bozan olayı temsil eden nesne.",
      "istisna-motivasyon"
    ],
    [
      "Throwable",
      "Tüm hata ve istisna sınıflarının kökü; Error ve Exception'ın üst sınıfı.",
      "hiyerarsi"
    ],
    [
      "Error",
      "JVM'in fırlattığı ciddi sistem hataları (OutOfMemoryError…); genelde yakalanmaz.",
      "hiyerarsi"
    ],
    [
      "RuntimeException",
      "Programlama hatalarını temsil eden unchecked istisnaların üst sınıfı.",
      "hiyerarsi"
    ],
    [
      "Checked (kontrollü) istisna",
      "RuntimeException/Error dışındaki istisnalar; yakalanmak veya throws ile bildirilmek zorunda.",
      "checked-unchecked"
    ],
    [
      "Unchecked (kontrolsüz) istisna",
      "RuntimeException, Error ve alt sınıfları; yakalamak/bildirmek zorunlu değil.",
      "checked-unchecked"
    ],
    [
      "throw",
      "Gövdede bir istisna nesnesini fırlatan ifade: throw new X(...).",
      "declare-throw-catch"
    ],
    [
      "throws",
      "Metot başlığında metodun fırlatabileceği (checked) istisnaları bildiren ifade.",
      "declare-throw-catch"
    ],
    [
      "try-catch",
      "Riskli kodu try'a, hata işleyiciyi catch'e yazdığın yapı.",
      "try-catch"
    ],
    [
      "finally",
      "İstisna olsa da olmasa da (return olsa bile) çalışan blok.",
      "finally"
    ],
    [
      "Yığın izi (stack trace)",
      "İstisnanın oluştuğu andaki metot çağrı zinciri.",
      "yayilim"
    ],
    [
      "Yeniden fırlatma (rethrow)",
      "Yakalanan istisnayı işlem yaptıktan sonra throw ex ile tekrar fırlatmak.",
      "rethrow"
    ],
    [
      "Zincirleme istisna (chained)",
      "Yeni istisnayı orijinalini cause olarak içine alarak fırlatmak; getCause() ile ulaşılır.",
      "rethrow"
    ],
    [
      "Özel istisna (custom exception)",
      "Exception (checked) veya RuntimeException (unchecked) genişletilerek yazılan istisna sınıfı.",
      "ozel-istisna"
    ],
    [
      "File",
      "Dosya/dizin yolunu temsil eden, özellik sorgulayan ama okuma/yazma yapmayan sınıf.",
      "file-sinifi"
    ],
    [
      "PrintWriter",
      "Metin dosyasına print/println/printf ile yazan sınıf; dosya varsa üzerine yazar.",
      "printwriter"
    ],
    [
      "try-with-resources",
      "try (kaynak) {...} sözdizimi; blok bitince kaynak otomatik kapatılır (JDK 7).",
      "try-with-resources"
    ],
    [
      "AutoCloseable",
      "close() metodunu tanımlayan arayüz; try-with-resources kaynakları bunu uygulamalı.",
      "try-with-resources"
    ],
    [
      "Ayırıcı (delimiter)",
      "Scanner'ın token'ları ayırdığı karakterler; varsayılan boşluk/tab/satır sonu.",
      "scanner-dosya"
    ],
    [
      "Soyut sınıf (abstract class)",
      "new ile nesnesi oluşturulamayan, soyut metot içerebilen, alt sınıflara şablon olan sınıf.",
      "abstract-sinif"
    ],
    [
      "Soyut metot (abstract method)",
      "Gövdesi olmayan, alt sınıfların uygulamak zorunda olduğu metot imzası.",
      "abstract-sinif"
    ],
    [
      "Arayüz (interface)",
      "Sınıfların ne yapabileceğini tanımlayan sözleşme; sabitler ve soyut metotlar içerir.",
      "interface"
    ],
    [
      "implements",
      "Bir sınıfın bir veya daha çok arayüzü uyguladığını belirten anahtar kelime.",
      "interface"
    ],
    [
      "Comparable",
      "compareTo(T) ile nesnelerin doğal sıralamasını tanımlayan hazır arayüz.",
      "soyut-vs-arayuz"
    ]
  ];
})(window.OOPLab = window.OOPLab || {});
