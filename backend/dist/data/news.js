"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNewsHeadlines = fetchNewsHeadlines;
const axios_1 = __importDefault(require("axios"));
const NEWS_API_KEY = process.env.NEWS_API_KEY;
// Lightweight news fetcher; falls back to mocked headlines if no key is provided.
async function fetchNewsHeadlines(ticker) {
    if (!NEWS_API_KEY) {
        return buildFallback(ticker);
    }
    try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(ticker)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;
        const { data } = await axios_1.default.get(url);
        return (data?.articles ?? []).map((a) => ({
            title: a.title,
            publishedAt: a.publishedAt,
            source: a.source?.name,
            url: a.url,
        }));
    }
    catch {
        return buildFallback(ticker);
    }
}
function buildFallback(ticker) {
    return [
        {
            title: `${ticker} posts solid earnings; analysts raise guidance`,
            publishedAt: new Date().toISOString(),
            source: "MockWire",
        },
        {
            title: `${ticker} trading volume surges on market open`,
            publishedAt: new Date().toISOString(),
            source: "StreetPulse",
        },
    ];
}
//# sourceMappingURL=news.js.map