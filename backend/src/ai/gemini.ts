import { GoogleGenerativeAI } from "@google/generative-ai";

const keys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "").split(",").map(k => k.trim()).filter(k => !!k);
let currentKeyIndex = 0;

export function getGeminiModel() {
  const key = keys[currentKeyIndex];
  if (!key) throw new Error("No Gemini API key available in rotation.");
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: "gemini-flash-latest" });
}

export function rotateGeminiKey() {
  if (keys.length > 1) {
    currentKeyIndex = (currentKeyIndex + 1) % keys.length;
    console.log(`[Gemini] Rotating to key ${currentKeyIndex + 1}/${keys.length}`);
    return true;
  }
  return false;
}

export async function withRetry<T>(fn: (model: any) => Promise<T>): Promise<T> {
  let attempts = 0;
  const maxAttempts = Math.max(1, keys.length);

  while (attempts < maxAttempts) {
    try {
      const model = getGeminiModel();
      return await fn(model);
    } catch (err: any) {
      if (err.status === 429 && rotateGeminiKey()) {
        attempts++;
        continue;
      }
      throw err;
    }
  }
  throw new Error("Gemini quota exhausted on all keys.");
}
