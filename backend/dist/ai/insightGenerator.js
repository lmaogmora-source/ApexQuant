"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInsight = generateInsight;
function generateInsight({ ticker, indicators, sentiment, }) {
    const pieces = [];
    if (indicators.sma20 && indicators.sma50) {
        if (indicators.sma20 > indicators.sma50) {
            pieces.push("short-term momentum is above the long-term trend");
        }
        else {
            pieces.push("short-term momentum is below the long-term trend");
        }
    }
    if (indicators.rsi14 !== null) {
        if (indicators.rsi14 > 70)
            pieces.push("RSI is elevated (overbought zone)");
        if (indicators.rsi14 < 30)
            pieces.push("RSI is low (oversold zone)");
    }
    if (indicators.volumeSpike) {
        pieces.push("recent sessions show unusual volume spikes");
    }
    if (sentiment.label === "positive")
        pieces.push("news sentiment is positive");
    if (sentiment.label === "negative")
        pieces.push("news sentiment is negative");
    if (!pieces.length) {
        pieces.push("market signals are mixed; monitoring recommended");
    }
    return `${ticker}: ${pieces.join("; ")}.`;
}
//# sourceMappingURL=insightGenerator.js.map