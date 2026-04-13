import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "language-detector",
  slug: "language-detector",
  description: "Detect language from text via trigram analysis. 30+ languages, script detection, confidence scores.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/detect",
      price: "$0.002",
      description: "Detect the language of input text with confidence scores and script identification",
      toolName: "text_detect_language",
      toolDescription: `Use this when you need to identify what language a text is written in. Uses n-gram frequency analysis to detect 30+ languages with confidence ranking and script identification.

1. topMatch: best language match with code, name, and confidence (e.g. {code:"fr", name:"French", confidence:0.94})
2. alternatives: 2nd and 3rd best language matches with confidence scores
3. script: detected writing system (Latin, Cyrillic, Arabic, CJK, Devanagari, Hangul, Katakana)
4. isReliable: boolean indicating if detection confidence is high enough to trust
5. charStats: character count, unique characters, script distribution percentages

Example output: {"topMatch":{"code":"fr","name":"French","confidence":0.94},"alternatives":[{"code":"it","name":"Italian","confidence":0.12}],"script":"Latin","isReliable":true,"charStats":{"total":156,"unique":42,"scriptDist":{"Latin":0.98}}}

Use this BEFORE translation to confirm the source language. Essential for multilingual content routing, spam filtering, and pre-processing pipelines.

Do NOT use for translation -- use text_translate. Do NOT use for sentiment analysis -- use text_analyze_sentiment. Do NOT use for text classification -- use text_classify_content.`,
      inputSchema: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "The text to detect language for (min 10 characters for accuracy)",
          },
        },
        required: ["text"],
      },
    },
  ],
};
