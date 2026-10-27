/* =========================================================================
   search.js — Arama ve filtreleme
   -------------------------------------------------------------------------
   Kullanıcı yazdıkça (input olayı) sorgu normalize edilir ve her düğümün
   arama metniyle (başlık, kısa ad, id, kategori) karşılaştırılır.
   Sonuç iki küme olarak tutulur:
     - matches : sorguyla eşleşen düğümler (parlar, nabız halkası alır)
     - focus   : eşleşenler + DAG'deki tüm önkoşulları (oraya giden yol)
   main.js her karede bu kümelere bakarak geri kalanları soluklaştırır.
   ========================================================================= */

class GraphSearch {
  #index;
  query = "";
  matches = new Set();
  focus = new Set();

  constructor(graph) {
    // Arama indeksi bir kez hazırlanır: başlık + kısa ad + id + kategori
    this.#index = graph.nodes.map((node) => ({
      node,
      title: GraphSearch.normalize(node.title),
      text: GraphSearch.normalize(`${node.title} ${node.label} ${node.id.replace(/-/g, " ")} ${node.parent?.title ?? ""}`),
    }));
  }

  // Türkçe duyarsız arama: "kalitim" → "Kalıtım", "istisna" → "İstisna"
  static normalize(text) {
    return text
      .toLocaleLowerCase("tr")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ı/g, "i");
  }

  get active() {
    return this.query.length > 0;
  }

  /** Sorguyu günceller ve eşleşme sayısını döndürür. Tüm kelimeler geçmeli. */
  setQuery(raw) {
    this.query = GraphSearch.normalize(raw.trim());
    this.matches.clear();
    this.focus.clear();
    if (!this.query) return 0;

    const terms = this.query.split(/\s+/);
    for (const { node, text } of this.#index) {
      if (!terms.every((t) => text.includes(t))) continue;
      this.matches.add(node);
      this.focus.add(node);
      node.ancestors.forEach((a) => this.focus.add(a));
    }
    return this.matches.size;
  }

  /** Enter ile açılacak en iyi eşleşme: başlığı sorguyla başlayan önce gelir. */
  get best() {
    let best = null;
    let bestScore = Infinity;
    for (const { node, title, text } of this.#index) {
      if (!this.matches.has(node)) continue;
      const score = title.startsWith(this.query) ? 0 : text.includes(` ${this.query}`) ? 1 : 2;
      if (score < bestScore) { best = node; bestScore = score; }
    }
    return best;
  }
}
