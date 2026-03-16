"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const marketData_1 = require("../data/marketData");
const news_1 = require("../data/news");
const sentiment_1 = require("../ai/sentiment");
const insightGenerator_1 = require("../ai/insightGenerator");
const risk_1 = require("../ai/risk");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const question = req.body?.question ?? "";
    const ticker = req.body?.ticker;
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
            (0, marketData_1.fetchHistorical)(symbol, 60),
            (0, marketData_1.fetchQuote)(symbol),
            (0, news_1.fetchNewsHeadlines)(symbol),
        ]);
        const indicators = (0, marketData_1.computeIndicators)(history);
        const sentiment = await (0, sentiment_1.analyzeNewsSentiment)(headlines.map((h) => h.title));
        const insight = (0, insightGenerator_1.generateInsight)({ ticker: symbol, indicators, sentiment });
        const risks = (0, risk_1.detectMarketRisks)(indicators);
        const prompt = `You are a professional financial advisor. User asked: "${question}".
    Context for ${symbol}:
    Insight: ${insight}
    Price: ${quote.price} ${quote.currency}
    Sentiment: ${sentiment.label} (score ${sentiment.score})
    Risks: ${risks.join("; ")}
    
    Provide a detailed, grounded answer. Explain the reasoning using the data provided.`;
        const { data } = await axios_1.default.post(process.env.NVIDIA_ENDPOINT, {
            model: process.env.NVIDIA_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            extra_body: { chat_template_kwargs: { thinking: true } },
        }, {
            headers: {
                Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
                "Content-Type": "application/json",
            },
            timeout: 20000,
        });
        const choice = data?.choices?.[0];
        const answer = choice?.message?.content ?? "I couldn't generate a response at this moment.";
        const reasoning = choice?.message?.reasoning_content ?? "";
        res.json({
            answer,
            reasoning,
            insight,
            indicators,
            sentiment,
            price: quote.price,
            currency: quote.currency
        });
    }
    catch (err) {
        res.status(500).json({ error: err?.message ?? "Failed to answer question" });
    }
});
exports.default = router;
//# sourceMappingURL=chat.js.map