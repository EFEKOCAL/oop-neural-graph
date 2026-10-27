/* =========================================================================
   highlight.js — Java / JS sözdizimi vurgulayıcı
   -------------------------------------------------------------------------
   OOP Lab'daki satır bazlı highlight mantığının genişletilmiş hâli.
   Sıralama önemli: önce yorum ve string'ler yakalanır ki içlerindeki
   kelimeler yanlışlıkla anahtar kelime gibi boyanmasın.
   ========================================================================= */

const CodeHighlighter = (() => {
  const KEYWORDS = new Set([
    "public", "private", "protected", "class", "interface", "extends", "implements",
    "new", "static", "final", "void", "int", "double", "boolean", "char", "long",
    "float", "byte", "short", "abstract", "this", "super", "import", "package",
    "var", "const", "let", "function", "enum", "instanceof", "throws",
    // JS'e özgü
    "async", "await", "of", "in", "typeof", "get", "set", "constructor", "delete",
  ]);
  const CONTROL = new Set([
    "return", "if", "else", "for", "while", "do", "switch", "case", "break",
    "continue", "try", "catch", "finally", "throw", "default",
  ]);
  const LITERALS = new Set(["true", "false", "null", "undefined"]);

  //            1 yorum       2 string (", ', `)                                          3 annotation / #private      4 sayı                         5 tanımlayıcı
  const TOKEN_RE = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(@[A-Za-z]\w*|#[A-Za-z_]\w*)|\b(\d+(?:\.\d+)?[fFdDlL]?)\b|([A-Za-z_]\w*)/g;

  // JSDoc / blok yorum satırları: "/**", " * ...", " */"
  const BLOCK_COMMENT_LINE = /^\s*(\/\*|\*)/;

  // Satır sonundaki "//!" işareti: bu satır panel açılınca parlatılacak
  const FOCUS_MARK = /\s*\/\/!\s*$/;

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Tanımlayıcının (identifier) türünü bağlamına göre belirler
  function identifierClass(word, line, start, end) {
    if (KEYWORDS.has(word)) return "tok-keyword";
    if (CONTROL.has(word)) return "tok-control";
    if (LITERALS.has(word)) return "tok-keyword";
    if (/^[A-Z][A-Z0-9_]+$/.test(word)) return "tok-const";    // MAX_VALUE, INDEFINITE
    if (/^[A-Z]/.test(word)) return "tok-class";                // Circle, String
    if (/^\s*\(/.test(line.slice(end))) return "tok-func";      // getArea(
    return "tok-var";
  }

  function highlightLine(line) {
    if (BLOCK_COMMENT_LINE.test(line)) return `<span class="tok-comment">${escapeHtml(line)}</span>`;
    let html = "";
    let last = 0;
    for (const m of line.matchAll(TOKEN_RE)) {
      const start = m.index;
      const end = start + m[0].length;
      let cls;
      if (m[1]) cls = "tok-comment";
      else if (m[2]) cls = "tok-string";
      else if (m[3]) cls = "tok-annotation";
      else if (m[4]) cls = "tok-number";
      else cls = identifierClass(m[5], line, start, end);
      html += escapeHtml(line.slice(last, start)) + `<span class="${cls}">${escapeHtml(m[0])}</span>`;
      last = end;
    }
    return html + escapeHtml(line.slice(last));
  }

  /**
   * Kodu satırlara böler, "//!" işaretlerini ayıklar ve vurgular.
   * @returns {{ plain: string, lines: string[], focus: number[] }}
   *   plain: işaretsiz düz kod (kopyalama için), lines: satır HTML'leri,
   *   focus: parlatılacak satır numaraları (1 tabanlı)
   */
  function prepare(code) {
    const focus = [];
    const rawLines = code.split("\n").map((line, i) => {
      if (FOCUS_MARK.test(line)) {
        focus.push(i + 1);
        return line.replace(FOCUS_MARK, "");
      }
      return line;
    });
    return {
      plain: rawLines.join("\n"),
      lines: rawLines.map(highlightLine),
      focus,
    };
  }

  return { prepare, highlightLine, escapeHtml };
})();
