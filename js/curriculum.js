/* =========================================================================
   curriculum.js — İlerleme ve Rehberli Keşif (Müfredat)
   -------------------------------------------------------------------------
   - Öğrenilen kavramların id'lerini localStorage'da saklar.
   - "Hazır" kavram: henüz öğrenilmemiş ama TÜM önkoşulları öğrenilmiş olan.
   - Sınır (frontier): hazır kavramların topolojik sıradaki listesi.
     Müfredat Modu bu listeyi "sıradaki hedefler" olarak parlatır.
   Hiçbir kavram kilitlenmez: kullanıcı her düğümü açıp okuyabilir ve
   istediğini "öğrendim" olarak işaretleyebilir (bilişsel yükü azaltmak için
   rehberlik var, zorlama yok).
   ========================================================================= */

const LEARNED_STORAGE_KEY = "oop-neural:learned";

class Curriculum {
  #graph;
  #learned;
  #listeners = new Set();

  constructor(graph) {
    this.#graph = graph;
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(LEARNED_STORAGE_KEY)) || []; } catch { /* yoksay */ }
    this.#learned = new Set(saved.filter((id) => graph.byId.has(id)));
  }

  /** Topolojik sıra: her kavram, önkoşullarından sonra gelir. */
  get order() {
    return this.#graph.topo;
  }

  isLearned(node) {
    return this.#learned.has(node.id);
  }

  isReady(node) {
    return node.deps.every((d) => this.#learned.has(d.id));
  }

  /** Öğrenilmemiş ve önkoşulları tamam olan kavramlar (topolojik sırada). */
  get frontier() {
    return this.order.filter((n) => !this.isLearned(n) && this.isReady(n));
  }

  /** Müfredattaki ilk hedef. Hepsi öğrenildiyse null. */
  get next() {
    return this.frontier[0] ?? null;
  }

  get progress() {
    const total = this.#graph.nodes.length;
    return { done: this.#learned.size, total, ratio: total ? this.#learned.size / total : 0 };
  }

  /**
   * Öğrenildi durumunu değiştirir.
   * @returns {GraphNode[]} bu işlemle yeni "hazır" hâle gelen kavramlar
   */
  setLearned(node, value) {
    if (value === this.isLearned(node)) return [];
    if (value) this.#learned.add(node.id);
    else this.#learned.delete(node.id);
    try { localStorage.setItem(LEARNED_STORAGE_KEY, JSON.stringify([...this.#learned])); } catch { /* yoksay */ }
    const unlocked = value ? node.dependents.filter((d) => !this.isLearned(d) && this.isReady(d)) : [];
    this.#listeners.forEach((fn) => fn(node, value));
    return unlocked;
  }

  toggle(node) {
    return this.setLearned(node, !this.isLearned(node));
  }

  /** Topolojik sırada bir önceki kavram (Müfredat Modu'nda "geri" için). */
  previousInOrder(node) {
    const i = this.order.indexOf(node);
    return i > 0 ? this.order[i - 1] : null;
  }

  onChange(fn) {
    this.#listeners.add(fn);
  }
}
