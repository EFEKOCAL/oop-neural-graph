/*
 * chapter-outlines.js — Bölümlerin giriş sayfası: hocanın PDF'indeki konu sırası ve bölümde öğrenilecek
 * temel kavramlar. Her konu, onu anlatan derslere bağlanır. slide: konu listesinin dayandığı slayt.
 */
(function (OOPLab) {
  'use strict';

  OOPLab.chapterOutlines = {
    ch0: {
      slide: 'Lab Hafta 1 s.2, Hafta 3.1',
      topics: [
        ['İlk adımlar: değişkenler, ekrana çıktı', ['iskelet', 'tipler']],
        ['Kullanıcıdan veri alma (Scanner)', ['scanner']],
        ['Karar ve döngü yapıları', ['karar-dongu']],
        ['Metotlar ve method overloading', ['metot-overload']],
        ['Diziler ve String (Ödev 2 tekrarı)', ['diziler']],
        ['Lab Hafta 1 uygulamaları ve Ödev 1', ['lab-hafta1']]
      ],
      concepts: ['main metodu', 'bytecode ve JVM', 'ilkel tipler', 'tam sayı bölmesi', 'casting', 'Scanner', 'nextLine tuzağı', 'switch fall-through', 'do-while', 'metot imzası', 'overloading', 'dizi referansı', 'length']
    },
    ch1: {
      slide: 'Slide01 s.6–89',
      topics: [
        ['NYP kavramları: nesne ve sınıf', ['nesne-nedir', 'sinif-anatomi', 'tv-ornegi']],
        ['Yapıcılar ve varsayılan yapıcı', ['yapici']],
        ['Referans değişkenleri ve nesnelere erişim', ['referans-iz']],
        ['Varsayılan değerler ve null', ['varsayilan-deger']],
        ['İlkel ve nesne tipleri, çöp toplama', ['ilkel-referans']],
        ['Date ve Random sınıfları', ['date-random']],
        ['Statik değişkenler, sabitler ve metotlar', ['static', 'static-erisim']],
        ['Görünürlük değiştiricileri, getter/setter', ['gorunurluk', 'kapsulleme']],
        ['Nesneleri metotlara geçirmek', ['pass-by-value']],
        ['Değişmez nesneler, değişken kapsamı, this', ['immutable', 'kapsam', 'this']],
        ['Nesne dizileri, veri yapıları ve ArrayList', ['nesne-dizileri', 'liste-yapilari', 'arraylist']],
        ['Wrapper sınıflar (ek)', ['wrapper']],
        ['Lab Hafta 3: HesapMakinesi ve Okul', ['lab-hafta3']]
      ],
      concepts: ['nesne: kimlik, durum, davranış', 'sınıf = şablon', 'UML (+ - # altı çizili)', 'yapıcı', 'no-arg constructor', 'varsayılan yapıcı', 'referans değişkeni', 'null', 'NullPointerException', 'aliasing', 'garbage collection', 'static / instance', 'public / default / private', 'kapsülleme', 'getter / setter', 'pass-by-value', 'immutable', 'this ve this(...)', 'veri yapısı / konteyner nesne', 'dizi tabanlı liste ve kapasite', 'ArrayList', 'Vector', 'autoboxing']
    },
    ch2: {
      slide: 'Slide02 s.2–61',
      topics: [
        ['Üst sınıflar ve alt sınıflar', ['kalitim-giris']],
        ['super anahtar kelimesi ve yapıcı zinciri', ['super-yapici', 'yapici-zinciri', 'noarg-hata']],
        ['Metotları override etmek, override vs overload', ['override', 'override-overload']],
        ['Object sınıfı ve toString()', ['object-tostring']],
        ['Polimorfizm, dinamik bağlama, genel programlama', ['polimorfizm', 'eslestirme-baglama']],
        ['Nesnelerde casting ve instanceof', ['casting']],
        ['equals metodu', ['equals']],
        ['ArrayList (tekrar)', []],
        ['protected, erişilebilirlik özeti, final', ['protected', 'final']]
      ],
      concepts: ['extends', 'is-a ilişkisi', 'super()', 'super.metot()', 'yapıcı zinciri', 'gizli super()', 'override', '@Override', 'hiding (static)', 'overloading', 'Object', 'toString', 'polimorfizm', 'dinamik bağlama', 'bildirilen tip / gerçek tip', 'upcast / downcast', 'ClassCastException', 'instanceof', 'equals vs ==', 'protected', 'final']
    },
    ch3: {
      slide: 'Slide03 s.3 (Amaçlar)',
      topics: [
        ['İstisnalar ve istisna işlemeye genel bakış', ['istisna-motivasyon', 'istisna-avantaj', 'inputmismatch']],
        ['İstisna tipleri: Error / Exception, kontrollü / kontrolsüz', ['hiyerarsi', 'checked-unchecked']],
        ['İstisna bildirme, atma, try-catch ile yakalama', ['declare-throw-catch', 'try-catch']],
        ['İstisnanın nasıl yayıldığı', ['yayilim', 'catch-or-declare']],
        ['İstisna nesnesinden bilgi alma', ['istisna-bilgi']],
        ['finally kullanma', ['finally']],
        ['Yeniden atma ve zincirleme istisna', ['rethrow']],
        ['İstisnaları ne zaman kullanmalı', ['ne-zaman']],
        ['Özel istisna sınıfları', ['ozel-istisna']],
        ['File sınıfı', ['file-sinifi']],
        ['PrintWriter, try-with-resources, Scanner', ['printwriter', 'try-with-resources', 'scanner-dosya']],
        ['Metin değiştirme, web\'den okuma, web crawler', ['replace-text', 'web-okuma']]
      ],
      concepts: ['Throwable', 'Error', 'Exception', 'RuntimeException', 'checked / unchecked', 'throw', 'throws', 'try-catch', 'catch sırası', 'çağrı yığını', 'yakala ya da bildir', 'getMessage / toString', 'finally', 'rethrow', 'chained exception', 'özel istisna', 'File', 'PrintWriter', 'try-with-resources', 'Scanner(File)']
    },
    ch4: {
      slide: 'Liang Bölüm 13 · 2022, 2024, 2025 vizeleri',
      topics: [
        ['Soyut sınıflar ve soyut metotlar', ['abstract-sinif', 'soyut-kurallar']],
        ['Arayüzler ve kuralları', ['interface', 'arayuz-kurallar']],
        ['Soyut sınıf mı arayüz mü?', ['soyut-vs-arayuz']],
        ['Comparable ve compareTo', ['comparable']],
        ['Cloneable ve clone()', ['cloneable']]
      ],
      concepts: ['abstract class', 'abstract method', 'soyut sınıfın yapıcısı', 'interface', 'implements', 'extends + implements sırası', 'public static final sabitler', 'imza çakışması', 'çoklu arayüz', 'Comparable', 'compareTo', 'Cloneable', 'marker interface', 'clone()', 'sığ / derin kopya']
    },
    ch5: {
      slide: 'Hafta 8 · 2022, 2024, 2025 vizeleri',
      topics: [
        ['Hocanın vize şablonu', ['gecmis-vizeler']],
        ['S1 · Kavram boşlukları', ['gercek-bosluk', 'kavram-bosluk']],
        ['S2 · Doğru / Yanlış', ['dogru-yanlis']],
        ['Kodu tamamla', ['kod-tamamla']],
        ['S3 · Kod çıktısı', ['cikti-sorulari', 'karma-iz']],
        ['S4 · Hata bulma ve düzeltme', ['hata-bulma']],
        ['S5 · 40p iskelet / tasarım', ['iskelet', 'arka-sayfa']],
        ['Deneme ve 80 dk simülasyon', ['deneme-sinavi', 'vize-simulasyonu']]
      ],
      concepts: ['yapıcı zinciri (this / super)', 'override + super.metot()', 'overload seçimi', 'iç içe try-catch-finally', 'komut satırı argümanları', 'interface sabiti final', 'iş kuralı + instanceof', 'read-only alan', 'Comparable', 'özel istisna']
    },
    ch6: {
      slide: 'Hocanın şablonuyla yeni sınavlar',
      topics: [
        ['Deneme 1 · Hastane (2025 formatı)', ['deneme-1']],
        ['Deneme 2 · E-ticaret Ödeme (2024 formatı)', ['deneme-2']],
        ['Deneme 3 · Lojistik Filo (2022 formatı)', ['deneme-3']],
        ['Deneme 4 · IoT Sensör Ağı (2025 formatı)', ['deneme-4']],
        ['Deneme 5 · Konferans Kayıt (karma)', ['deneme-5']]
      ],
      concepts: ['pass-by-value', 'Integer önbelleği', 'overload seçimi (bildirilen tip)', 'yapıcıdan override metot çağrısı', 'Cloneable / sığ kopya', 'catch içinde yeniden fırlatma', 'ArrayList remove(int) / remove(Object)', 'equals override', 'dosya I/O', 'iş kuralları']
    }
  };
})(window.OOPLab = window.OOPLab || {});
