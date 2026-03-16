import { Router } from "express";
import { computeIndicators, fetchHistorical, fetchQuote, latestClose } from "../data/marketData";
import { fetchNewsHeadlines } from "../data/news";
import { analyzeNewsSentiment } from "../ai/sentiment";
import { generateInsight } from "../ai/insightGenerator";
import { detectMarketRisks } from "../ai/risk";

const router = Router();

router.get("/:ticker", async (req, res) => {
  const ticker = String(req.params.ticker).toUpperCase();
  try {
    const [history, quote, headlines] = await Promise.all([
      fetchHistorical(ticker),
      fetchQuote(ticker),
      fetchNewsHeadlines(ticker),
    ]);

    const indicators = computeIndicators(history);
    const sentiment = await analyzeNewsSentiment(headlines.map((h) => h.title));
    const insight = generateInsight({ ticker, indicators, sentiment });
    const riskFlags = detectMarketRisks(indicators);

    res.json({
      ticker,
      price: quote.price ?? latestClose(history),
      changePercent: quote.changePercent,
      currency: quote.currency,
      history,
      indicators,
      sentiment,
      insight,
      riskFlags,
      headlines,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to load market data" });
  }
});

export default router;
