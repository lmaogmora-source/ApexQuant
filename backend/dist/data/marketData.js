"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHistorical = fetchHistorical;
exports.fetchQuote = fetchQuote;
exports.computeIndicators = computeIndicators;
exports.latestClose = latestClose;
const yahoo_finance2_1 = __importDefault(require("yahoo-finance2"));
const yahooFinance = new yahoo_finance2_1.default();
const technicalindicators_1 = require("technicalindicators");
const LOOKBACK_DAYS = 120;
function formatTicker(ticker) {
    if (ticker.includes(".") || ticker.includes(":"))
        return ticker;
    // Fallback to NSE for Indian context
    return `${ticker}.NS`;
}
async function fetchHistorical(ticker, days = LOOKBACK_DAYS) {
    const symbol = formatTicker(ticker);
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    const rows = (await yahooFinance.historical(symbol, {
        period1: start,
        period2: end,
        interval: "1d",
    }));
    return rows
        .filter((row) => row.close != null && row.volume != null)
        .map((row) => ({
        date: row.date,
        close: Number(row.close),
        volume: Number(row.volume),
    }));
}
async function fetchQuote(ticker) {
    const symbol = formatTicker(ticker);
    try {
        const quote = await yahooFinance.quote(symbol);
        return {
            price: quote?.regularMarketPrice ?? null,
            changePercent: quote?.regularMarketChangePercent ?? null,
            currency: quote?.currency ?? "INR",
        };
    }
    catch (err) {
        return { price: null, changePercent: null, currency: "INR" };
    }
}
function computeIndicators(data) {
    const closes = data.map((d) => d.close);
    const volumes = data.map((d) => d.volume);
    const sma20 = closes.length >= 20 ? technicalindicators_1.SMA.calculate({ period: 20, values: closes }).pop() ?? null : null;
    const sma50 = closes.length >= 50 ? technicalindicators_1.SMA.calculate({ period: 50, values: closes }).pop() ?? null : null;
    const rsi14 = closes.length >= 14 ? technicalindicators_1.RSI.calculate({ period: 14, values: closes }).pop() ?? null : null;
    const recentVolume = volumes.slice(-5);
    const avgVolume = volumes.length
        ? volumes
            .slice(-30)
            .reduce((sum, v) => sum + v, 0) /
            Math.max(1, Math.min(30, volumes.length))
        : 0;
    const maxRecent = recentVolume.length ? Math.max(...recentVolume) : 0;
    const volumeSpike = avgVolume > 0 ? maxRecent > 1.8 * avgVolume : false;
    // Trend strength: compare SMA20 vs SMA50 and recent slope
    let trendStrength = 50;
    if (sma20 && sma50) {
        const last = closes[closes.length - 1] ?? 0;
        const earlier = closes[Math.max(0, closes.length - 6)] ?? last;
        const slope = (last - earlier) / Math.max(1, Math.min(5, closes.length));
        trendStrength = Math.max(0, Math.min(100, 50 + (sma20 - sma50) * 0.1 + slope * 0.2));
    }
    return { sma20: sma20 ?? null, sma50: sma50 ?? null, rsi14: rsi14 ?? null, volumeSpike, trendStrength };
}
function latestClose(data) {
    if (!data.length)
        return null;
    return data[data.length - 1]?.close ?? null;
}
//# sourceMappingURL=marketData.js.map