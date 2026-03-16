"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeNewsSentiment = analyzeNewsSentiment;
const axios_1 = __importDefault(require("axios"));
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_MODEL = process.env.NVIDIA_MODEL ?? "meta/llama-3.1-8b-instruct";
const NVIDIA_ENDPOINT = process.env.NVIDIA_ENDPOINT ??
    "https://integrate.api.nvidia.com/v1/chat/completions";
async function analyzeNewsSentiment(headlines) {
    if (!headlines.length) {
        return { score: 0, label: "neutral", headlineSamples: [] };
    }
    if (!NVIDIA_API_KEY) {
        return ruleBasedSentiment(headlines);
    }
    const prompt = `You are a financial news classifier. Rate the overall sentiment of these headlines towards the stock on a scale -1 (very negative) to 1 (very positive). Reply with JSON: {"score": number, "label": "positive|neutral|negative"}. Headlines: ${headlines
        .map((h, i) => `${i + 1}. ${h}`)
        .join(" | ")}`;
    try {
        const { data } = await axios_1.default.post(NVIDIA_ENDPOINT, {
            model: NVIDIA_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            extra_body: { chat_template_kwargs: { thinking: true } },
        }, {
            headers: {
                Authorization: `Bearer ${NVIDIA_API_KEY}`,
                "Content-Type": "application/json",
            },
            timeout: 15000,
        });
        const choice = data?.choices?.[0];
        const text = choice?.message?.content ?? "";
        const reasoning = choice?.message?.reasoning_content ?? "";
        if (reasoning) {
            console.log(`DeepSeek Reasoning for Sentiment: ${reasoning}`);
        }
        const parsed = safeParse(text);
        const label = normalizeLabel(parsed?.label);
        return {
            score: parsed?.score ?? 0,
            label,
            headlineSamples: headlines.slice(0, 5),
        };
    }
    catch {
        return ruleBasedSentiment(headlines);
    }
}
function safeParse(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return null;
    }
}
function normalizeLabel(raw) {
    if (raw?.toLowerCase().startsWith("pos"))
        return "positive";
    if (raw?.toLowerCase().startsWith("neg"))
        return "negative";
    return "neutral";
}
function ruleBasedSentiment(headlines) {
    const positiveWords = ["beat", "surge", "gain", "strong", "record", "upgrade"];
    const negativeWords = ["miss", "drop", "loss", "probe", "downgrade", "fall"];
    let score = 0;
    headlines.forEach((h) => {
        const lower = h.toLowerCase();
        if (positiveWords.some((w) => lower.includes(w)))
            score += 0.2;
        if (negativeWords.some((w) => lower.includes(w)))
            score -= 0.2;
    });
    score = Math.max(-1, Math.min(1, score));
    const label = score > 0.1 ? "positive" : score < -0.1 ? "negative" : "neutral";
    return { score, label, headlineSamples: headlines.slice(0, 5) };
}
//# sourceMappingURL=sentiment.js.map