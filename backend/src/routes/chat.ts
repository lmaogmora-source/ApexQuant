import { Router } from "express";
import axios from "axios";
import { fetchHistorical, fetchQuote, computeIndicators } from "../data/marketData";
import { fetchNewsHeadlines } from "../data/news";
import { analyzeNewsSentiment } from "../ai/sentiment";
import { generateInsight } from "../ai/insightGenerator";
import { detectMarketRisks } from "../ai/risk";
import { withRetry } from "../ai/gemini";

const router = Router();

router.post("/", async (req, res) => {
  const question: string = req.body?.question ?? "";
  const ticker: string | undefined = req.body?.ticker;

  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }

  if (!ticker) {
    return res.json({
      answer: "Please provide a ticker symbol so I can ground the analysis (e.g., AAPL, MSFT).",
    });
  }

  const symbol = ticker.toUpperCase();
  try {
    const [history, quote, headlines] = await Promise.all([
      fetchHistorical(symbol, 60),
      fetchQuote(symbol),
      fetchNewsHeadlines(symbol),
    ]);
    const indicators = computeIndicators(history);
    const sentiment = await analyzeNewsSentiment(headlines.map((h) => h.title));
    const insight = generateInsight({ ticker: symbol, indicators, sentiment });
    const risks = detectMarketRisks(indicators);

    const prompt = `You are a professional financial advisor. User asked: "${question}".
    CRITICAL GROUNDING DATA:
    - Current Price of ${symbol}: ₹${quote.price} (Verified via Gemini/Live Market)
    - Sentiment: ${sentiment.label} (Score: ${sentiment.score})
    - Indicators: RSI ${indicators.rsi14?.toFixed(1) || "N/A"}, Strength ${indicators.trendStrength}/100
    - Market Risks: ${risks.length ? risks.join(", ") : "None Detected"}
    
    INSTRUCTIONS:
    1. Your answer MUST be based on the provided Price and Sentiment.
    2. Explain if the price is showing strength or weakness.
    3. Be concise but professional. Use easy terminologies for a basic user.`;

    console.log(`[Chat] Querying Gemini for ${ticker ?? "general query"}...`);
    const answer = await withRetry(async (model) => {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }).catch(err => {
      console.warn("[Chat] AI Quota hit, using grounded fallback.");
      return `### Market Analysis: ${symbol}
Current Price: **₹${quote.price}**

**Signals**:
- **Sentiment**: ${sentiment.label === 'positive' ? 'Bullish' : sentiment.label === 'negative' ? 'Bearish' : 'Neutral'} (${(sentiment.score * 100).toFixed(0)}% confidence)
- **Strength**: ${indicators.trendStrength}/100 
- **RSI**: ${indicators.rsi14?.toFixed(1) || 'N/A'}

**Advisor Insight**:
${insight}

*Note: This response is generated using local data models as the AI advisor is currently over-quota.*`;
    });
    const reasoning = ""; 
    console.log(`[Chat] Gemini response received. Length: ${answer.length}`);
    console.log(`[Chat] AI response received. Length: ${answer.length}`);
    console.log(`[Chat] AI response received. Length: ${answer.length}`);

    res.json({ 
      answer, 
      reasoning,
      insight, 
      indicators, 
      sentiment, 
      price: quote.price, 
      currency: quote.currency 
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to answer question" });
  }
});

export default router;
