import axios from "axios";
import { SentimentResult, SentimentLabel } from "../types";

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_MODEL = process.env.NVIDIA_MODEL ?? "meta/llama-3.1-8b-instruct";
const NVIDIA_ENDPOINT =
  process.env.NVIDIA_ENDPOINT ??
  "https://integrate.api.nvidia.com/v1/chat/completions";

export async function analyzeNewsSentiment(
  headlines: string[]
): Promise<SentimentResult> {
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
    console.log(`[AI] Analyzing sentiment for headlines...`);
    const { withRetry, getGeminiModel } = require("./gemini");
    
    const content = await withRetry(async (model: any) => {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    });

    console.log(`[AI] Sentiment analysis complete via Gemini.`);
    console.log(`[AI] Gemini raw response: ${content.slice(0, 100)}...`);
    
    const parsed = safeParse(content);
    const label = normalizeLabel(parsed?.label);
    return {
      score: parsed?.score ?? 0,
      label,
      headlineSamples: headlines.slice(0, 5),
    };
  } catch {
    return ruleBasedSentiment(headlines);
  }
}

function safeParse(text: string): { score?: number; label?: string } | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function normalizeLabel(raw?: string): SentimentLabel {
  if (raw?.toLowerCase().startsWith("pos")) return "positive";
  if (raw?.toLowerCase().startsWith("neg")) return "negative";
  return "neutral";
}

function ruleBasedSentiment(headlines: string[]): SentimentResult {
  const positiveWords = ["beat", "surge", "gain", "strong", "record", "upgrade"];
  const negativeWords = ["miss", "drop", "loss", "probe", "downgrade", "fall"];
  let score = 0;
  headlines.forEach((h) => {
    const lower = h.toLowerCase();
    if (positiveWords.some((w) => lower.includes(w))) score += 0.2;
    if (negativeWords.some((w) => lower.includes(w))) score -= 0.2;
  });
  score = Math.max(-1, Math.min(1, score));
  const label: SentimentLabel = score > 0.1 ? "positive" : score < -0.1 ? "negative" : "neutral";
  return { score, label, headlineSamples: headlines.slice(0, 5) };
}
