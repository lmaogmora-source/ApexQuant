"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marketData_1 = require("../data/marketData");
const news_1 = require("../data/news");
const sentiment_1 = require("../ai/sentiment");
const insightGenerator_1 = require("../ai/insightGenerator");
const risk_1 = require("../ai/risk");
const router = (0, express_1.Router)();
router.get("/:ticker", async (req, res) => {
    const ticker = String(req.params.ticker).toUpperCase();
    try {
        const [history, quote, headlines] = await Promise.all([
            (0, marketData_1.fetchHistorical)(ticker),
            (0, marketData_1.fetchQuote)(ticker),
            (0, news_1.fetchNewsHeadlines)(ticker),
        ]);
        const indicators = (0, marketData_1.computeIndicators)(history);
        const sentiment = await (0, sentiment_1.analyzeNewsSentiment)(headlines.map((h) => h.title));
        const insight = (0, insightGenerator_1.generateInsight)({ ticker, indicators, sentiment });
        const riskFlags = (0, risk_1.detectMarketRisks)(indicators);
        res.json({
            ticker,
            price: quote.price ?? (0, marketData_1.latestClose)(history),
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
    }
    catch (err) {
        res.status(500).json({ error: err?.message ?? "Failed to load market data" });
    }
});
exports.default = router;
//# sourceMappingURL=market.js.map