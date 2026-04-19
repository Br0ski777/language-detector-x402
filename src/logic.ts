import type { Hono } from "hono";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

// --------------- Trigram profiles for top 30 languages ---------------
// Each profile contains the most frequent trigrams for that language
const TRIGRAM_PROFILES: Record<string, string[]> = {
  en: ["the", "ing", "tion", "and", "her", "for", "tha", "hat", "ent", "ion", "ter", "was", "you", "ith", "ver", "all", "wit", "thi", "his", "ati", "ere", "oul", "ear", "ons", "rea", "est", "ght", "not", "con", "out"],
  fr: ["les", "ent", "ion", "des", "que", "ait", "par", "une", "ous", "est", "eur", "tio", "con", "ait", "com", "dan", "ans", "men", "qui", "sur", "ais", "lle", "tre", "res", "our", "ont", "pas", "pou", "ell", "sio"],
  de: ["ein", "ich", "der", "die", "und", "den", "sch", "ber", "ung", "cht", "ine", "eit", "gen", "ter", "ent", "ver", "ten", "ach", "hen", "nte", "ges", "nen", "ers", "ier", "ste", "ren", "nic", "uch", "auf", "ere"],
  es: ["que", "ción", "los", "ent", "las", "del", "ion", "con", "ado", "est", "par", "nte", "ien", "res", "por", "una", "aci", "com", "tra", "tos", "era", "sta", "mos", "bre", "pre", "ter", "ell", "dos", "nte", "ido"],
  it: ["che", "ell", "zione", "ion", "per", "lla", "con", "ent", "del", "ato", "one", "gli", "nte", "sta", "ano", "tti", "rit", "ato", "men", "pre", "nel", "ale", "ess", "ica", "are", "oll", "ett", "tta", "sti", "tra"],
  pt: ["que", "ção", "ent", "ção", "dos", "com", "par", "nte", "res", "est", "ado", "ment", "con", "uma", "tra", "sta", "ais", "ter", "era", "por", "ica", "ida", "cia", "mos", "rio", "nto", "tos", "não", "ões", "pro"],
  nl: ["een", "het", "van", "aar", "den", "ver", "oor", "ijn", "erd", "gen", "ing", "ten", "aan", "ond", "ter", "sch", "ede", "aar", "eni", "die", "ren", "cht", "ijk", "oor", "wor", "ste", "niet", "nde", "dat", "met"],
  ru: ["ста", "ени", "ать", "ого", "ние", "пре", "ост", "ова", "ест", "ком", "при", "ель", "тел", "ние", "ной", "про", "ред", "все", "кот", "ных", "что", "это", "мож", "нос", "раз", "ска", "ных", "ить", "нов", "дел"],
  pl: ["nie", "prz", "rze", "ize", "owa", "ani", "dzi", "sta", "eni", "ych", "kie", "pod", "nia", "icz", "ego", "wie", "tow", "ski", "prz", "icz", "rzy", "jak", "jes", "cze", "pow", "arz", "spo", "wyp", "ale", "rego"],
  sv: ["och", "att", "för", "den", "som", "det", "var", "ing", "med", "har", "till", "ade", "inte", "ett", "lig", "för", "kan", "nde", "igt", "ska", "ter", "gen", "ens", "dag", "und", "ste", "han", "all", "ock", "ell"],
  no: ["for", "det", "som", "med", "har", "til", "att", "den", "ene", "ble", "ing", "var", "ikke", "kan", "vil", "fra", "lig", "sak", "ved", "gen", "dag", "ste", "ell", "nde", "ene", "all", "ett", "ene", "ket", "enn"],
  da: ["for", "det", "som", "med", "har", "til", "den", "var", "ikke", "der", "ble", "kan", "ene", "ige", "dag", "gen", "ste", "ell", "ket", "ene", "all", "att", "ing", "nde", "lig", "sak", "end", "ted", "ere", "hed"],
  fi: ["inen", "ista", "tta", "ssa", "nen", "sta", "ais", "ist", "uom", "kan", "lla", "tta", "iin", "een", "tai", "ise", "lta", "oli", "lle", "sen", "tta", "ksi", "nsa", "maa", "van", "nut", "aja", "ett", "oit", "aan"],
  hu: ["sze", "ogy", "egy", "nak", "ban", "nek", "tte", "ság", "van", "ala", "meg", "min", "tet", "elt", "les", "nde", "kez", "att", "ent", "kor", "ebb", "ell", "lem", "jel", "gya", "eze", "mag", "fog", "hoz", "ség"],
  cs: ["pro", "ost", "ení", "ova", "není", "cht", "pře", "ský", "ání", "ných", "ech", "ale", "sta", "při", "ého", "kter", "pod", "rod", "tel", "ním", "dne", "str", "věd", "roz", "toho", "jeho", "nov", "lid", "moh", "všec"],
  ro: ["are", "ent", "rea", "lui", "tea", "ate", "ent", "ion", "ste", "car", "con", "lor", "pen", "tru", "pri", "sta", "cal", "pre", "min", "ile", "tur", "tat", "eri", "tre", "ces", "and", "ter", "res", "nar", "pro"],
  tr: ["lar", "bir", "ler", "ini", "ile", "eri", "arak", "dan", "nda", "rin", "ası", "len", "yor", "ine", "anı", "yet", "olu", "ara", "top", "dır", "mak", "ınd", "ede", "ala", "bili", "gün", "lik", "den", "ter", "aya"],
  ja: ["して", "ている", "こと", "です", "した", "ます", "から", "ない", "れる", "もの", "ある", "これ", "その", "でき", "よう", "さん", "まし", "です", "ため", "なっ", "いう", "なり", "まで", "でし", "との", "ので", "にな", "ので", "ませ", "おり"],
  ko: ["하는", "것이", "하고", "있는", "으로", "에서", "이다", "한다", "되는", "하여", "것을", "있다", "대한", "에는", "이는", "되어", "하지", "부터", "까지", "으며", "해서", "하면", "것은", "에게", "으나", "같은", "모든", "하기", "많은", "대로"],
  zh: ["的是", "是一", "一个", "我们", "没有", "他们", "这个", "不是", "什么", "可以", "已经", "因为", "但是", "这样", "就是", "那么", "如果", "所以", "还是", "自己", "他的", "知道", "我的", "也是", "不会", "现在", "时候", "出来", "看到", "很多"],
  ar: ["الم", "من", "في", "على", "أن", "كان", "لم", "هذا", "إلى", "عن", "لا", "ما", "قال", "هي", "بين", "ذلك", "كل", "حت", "ول", "يم", "عل", "جم", "حم", "سل", "كت", "رح", "بع", "مس", "خل", "صل"],
  hi: ["के", "है", "में", "की", "को", "का", "ने", "से", "और", "पर", "एक", "यह", "हैं", "कि", "नहीं", "कर", "भी", "था", "इस", "ही", "गया", "अपन", "जो", "तो", "लिए", "रहा", "हो", "जा", "बात", "दो"],
  th: ["ของ", "ที่", "และ", "ใน", "การ", "เป็น", "ได้", "จะ", "มี", "ไม่", "นี้", "คือ", "จาก", "แต่", "ให้", "กับ", "อยู่", "ว่า", "ทำ", "โดย", "เรา", "แล้ว", "ก็", "มา", "ไป", "นั้น", "หรือ", "คน", "ดี", "จึง"],
  vi: ["của", "và", "là", "cho", "các", "một", "trong", "được", "người", "không", "có", "từ", "này", "như", "đã", "với", "nhưng", "về", "đến", "cũng", "khi", "tại", "sẽ", "nhiều", "họ", "những", "nào", "hay", "rất", "hơn"],
  id: ["yang", "dan", "ini", "itu", "ada", "dengan", "untuk", "dari", "tidak", "akan", "pada", "juga", "saya", "dia", "bisa", "sudah", "kami", "mereka", "oleh", "atau", "satu", "lebih", "tapi", "hanya", "banyak", "telah", "lain", "orang", "sebuah", "waktu"],
  ms: ["yang", "dan", "ini", "itu", "ada", "dengan", "untuk", "dari", "tidak", "akan", "pada", "juga", "saya", "dia", "bisa", "sudah", "kami", "oleh", "atau", "satu", "lebih", "tapi", "hanya", "banyak", "telah", "lain", "orang", "sebuah", "waktu", "bagi"],
  uk: ["що", "для", "але", "все", "цей", "його", "від", "при", "так", "вже", "або", "ще", "які", "бути", "один", "цього", "після", "свого", "може", "також", "між", "хоч", "якщо", "тому", "ним", "них", "під", "інш", "нов", "час"],
  el: ["και", "του", "την", "για", "που", "στο", "των", "από", "μια", "στη", "ένα", "τον", "της", "ότι", "αλλ", "αυτ", "εστ", "θα", "δεν", "νται", "στις", "μετ", "έχε", "είν", "κάθ", "πρέ", "μπο", "αρχ", "πολ", "περ"],
  he: ["של", "את", "על", "לא", "הוא", "זה", "אם", "כל", "היא", "גם", "אני", "או", "מה", "יש", "אל", "עם", "בין", "כי", "אבל", "היה", "לו", "עוד", "אחר", "כמו", "בו", "פני", "רק", "שלא", "כדי", "לפי"],
  bg: ["на", "за", "от", "да", "се", "не", "че", "със", "по", "при", "като", "това", "тя", "той", "ще", "има", "или", "са", "бе", "вече", "все", "може", "след", "без", "ако", "кога", "също", "нов", "тук", "там"],
};

// --------------- Script detection ---------------
interface ScriptInfo {
  name: string;
  pattern: RegExp;
}

const SCRIPTS: ScriptInfo[] = [
  { name: "Latin", pattern: /[a-zA-ZÀ-ÿĀ-žƀ-ɏ]/ },
  { name: "Cyrillic", pattern: /[\u0400-\u04ff\u0500-\u052f]/ },
  { name: "Arabic", pattern: /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/ },
  { name: "CJK", pattern: /[\u4e00-\u9fff\u3400-\u4dbf]/ },
  { name: "Hiragana", pattern: /[\u3040-\u309f]/ },
  { name: "Katakana", pattern: /[\u30a0-\u30ff]/ },
  { name: "Hangul", pattern: /[\uac00-\ud7af\u1100-\u11ff]/ },
  { name: "Devanagari", pattern: /[\u0900-\u097f]/ },
  { name: "Thai", pattern: /[\u0e00-\u0e7f]/ },
  { name: "Greek", pattern: /[\u0370-\u03ff\u1f00-\u1fff]/ },
  { name: "Hebrew", pattern: /[\u0590-\u05ff]/ },
];

function detectScripts(text: string): { script: string; percentage: number }[] {
  const results: { script: string; count: number }[] = [];
  const totalChars = text.replace(/\s/g, "").length || 1;

  for (const { name, pattern } of SCRIPTS) {
    const matches = text.match(new RegExp(pattern.source, "g"));
    if (matches && matches.length > 0) {
      results.push({ script: name, count: matches.length });
    }
  }

  return results
    .map((r) => ({ script: r.script, percentage: Math.round((r.count / totalChars) * 100) }))
    .filter((r) => r.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);
}

// --------------- Trigram extraction ---------------

function extractTrigrams(text: string): Map<string, number> {
  const trigrams = new Map<string, number>();
  const cleaned = text.toLowerCase().replace(/[0-9\s\n\r\t.,!?;:'"()\[\]{}<>\/\\@#$%^&*+=~`|_-]+/g, " ").trim();
  const words = cleaned.split(/\s+/);

  for (const word of words) {
    if (word.length < 3) continue;
    for (let i = 0; i <= word.length - 3; i++) {
      const tri = word.slice(i, i + 3);
      trigrams.set(tri, (trigrams.get(tri) || 0) + 1);
    }
  }

  return trigrams;
}

// --------------- Language detection ---------------

function detectLanguage(text: string): {
  topLanguages: { language: string; confidence: number }[];
  scripts: { script: string; percentage: number }[];
  charCount: number;
  wordCount: number;
} {
  const scripts = detectScripts(text);
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  const charCount = text.length;

  // Quick script-based detection for non-Latin scripts
  if (scripts.length > 0) {
    const primary = scripts[0];

    // Direct script-to-language mapping for unique scripts
    if (primary.script === "CJK" && primary.percentage > 30) {
      return { topLanguages: [{ language: "zh", confidence: 0.92 }, { language: "ja", confidence: 0.05 }], scripts, charCount, wordCount };
    }
    if (primary.script === "Hangul" && primary.percentage > 30) {
      return { topLanguages: [{ language: "ko", confidence: 0.95 }], scripts, charCount, wordCount };
    }
    if ((primary.script === "Hiragana" || primary.script === "Katakana") && primary.percentage > 10) {
      return { topLanguages: [{ language: "ja", confidence: 0.95 }], scripts, charCount, wordCount };
    }
    if (primary.script === "Devanagari" && primary.percentage > 30) {
      return { topLanguages: [{ language: "hi", confidence: 0.90 }], scripts, charCount, wordCount };
    }
    if (primary.script === "Thai" && primary.percentage > 30) {
      return { topLanguages: [{ language: "th", confidence: 0.95 }], scripts, charCount, wordCount };
    }
    if (primary.script === "Arabic" && primary.percentage > 30) {
      return { topLanguages: [{ language: "ar", confidence: 0.85 }], scripts, charCount, wordCount };
    }
    if (primary.script === "Greek" && primary.percentage > 30) {
      return { topLanguages: [{ language: "el", confidence: 0.92 }], scripts, charCount, wordCount };
    }
    if (primary.script === "Hebrew" && primary.percentage > 30) {
      return { topLanguages: [{ language: "he", confidence: 0.92 }], scripts, charCount, wordCount };
    }
  }

  // Trigram-based detection for Latin/Cyrillic scripts
  const inputTrigrams = extractTrigrams(text);
  if (inputTrigrams.size === 0) {
    return { topLanguages: [{ language: "unknown", confidence: 0 }], scripts, charCount, wordCount };
  }

  // Get top 50 trigrams from input
  const sortedInput = [...inputTrigrams.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([tri]) => tri);

  // Score against each language profile
  const scores: { language: string; score: number }[] = [];

  for (const [lang, profile] of Object.entries(TRIGRAM_PROFILES)) {
    // Skip non-Latin languages already handled above
    if (["ja", "ko", "zh", "ar", "hi", "th", "el", "he"].includes(lang)) continue;

    let matchCount = 0;
    for (const tri of sortedInput) {
      if (profile.includes(tri)) matchCount++;
    }
    scores.push({ language: lang, score: matchCount / Math.max(sortedInput.length, 1) });
  }

  // Sort and take top 3
  scores.sort((a, b) => b.score - a.score);
  const topLanguages = scores.slice(0, 3).map((s) => ({
    language: s.language,
    confidence: Math.round(Math.min(s.score * 2.5, 0.98) * 100) / 100,
  }));

  // Ensure we have at least one result
  if (topLanguages.length === 0 || topLanguages[0].confidence === 0) {
    topLanguages.unshift({ language: "en", confidence: 0.3 });
  }

  return { topLanguages, scripts, charCount, wordCount };
}

// --------------- Routes ---------------

export function registerRoutes(app: Hono) {
  app.post("/api/detect", async (c) => {
    await tryRequirePayment(0.002);
    let body: any;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const { text } = body;

    if (!text || typeof text !== "string") {
      return c.json({
        error: "Missing required parameter 'text'",
        example: { text: "Bonjour le monde, comment allez-vous aujourd'hui?" },
      }, 400);
    }

    if (text.length < 10) {
      return c.json({ error: "Text too short. Minimum 10 characters for accurate detection." }, 400);
    }

    try {
      const result = detectLanguage(text);
      return c.json({
        ...result,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return c.json({ error: "Language detection failed", details: err.message }, 500);
    }
  });
}
