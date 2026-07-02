# Language Detector API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://language-detector.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Detect language from text using trigram frequency analysis. Supports 30+ languages with script detection. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "language-detector": {
      "url": "https://language-detector.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://language-detector.api.klymax402.com/api/detect" \
  -H "Content-Type: application/json" \
  -d '{"text":"..."}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `text_detect_language` | POST | `/api/detect` | $0.002 | Detect the language of input text with confidence scores and script identification |

### `text_detect_language`

Use this when you need to identify what language a text is written in. Uses n-gram frequency analysis to detect 30+ languages with confidence scores. Returns top 3 language matches, script detection (Latin, Cyrillic, Arabic, CJK, Devanagari), and character statistics. Ideal for multilingual content routing, pre-translation detection, and content filtering. Do NOT use for translation — use text_translate. Do NOT use for sentiment — use text_analyze_sentiment.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `text` | string | yes | The text to detect language for (min 10 characters for accuracy) |

## Example agent prompts

- "Identify what language a text is written in"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
