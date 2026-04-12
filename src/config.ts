import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "language-detector",
  slug: "language-detector",
  description: "Detect language from text using trigram frequency analysis. Supports 30+ languages with script detection.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/detect",
      price: "$0.002",
      description: "Detect the language of input text with confidence scores and script identification",
      toolName: "text_detect_language",
      toolDescription:
        "Use this when you need to identify what language a text is written in. Uses n-gram frequency analysis to detect 30+ languages with confidence scores. Returns top 3 language matches, script detection (Latin, Cyrillic, Arabic, CJK, Devanagari), and character statistics. Ideal for multilingual content routing, pre-translation detection, and content filtering. Do NOT use for translation — use text_translate. Do NOT use for sentiment — use text_analyze_sentiment.",
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
