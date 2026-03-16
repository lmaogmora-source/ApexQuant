import { Router } from "express";
import { withRetry } from "../ai/gemini";

const router = Router();

// In-memory store for demo purposes. In production, this would be a database.
let userProfile = {
  investmentAmount: 0,
  holdingPeriod: "long-term",
  riskTolerance: "medium",
  preferredSectors: [] as string[],
  investmentTiming: "gradually",
  expectedReturn: 15,
  liquidityRequirement: "flexible",
  marketPreference: "large-cap",
  recommendations: [] as any[],
};

const FALLBACK_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd.", sector: "Energy", risk: "low" },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd.", sector: "Technology", risk: "low" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", sector: "Finance", risk: "low" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", sector: "Finance", risk: "medium" },
  { symbol: "INFY", name: "Infosys Ltd.", sector: "Technology", risk: "medium" },
  { symbol: "SBIN", name: "State Bank of India", sector: "Finance", risk: "medium" },
  { symbol: "ITC", name: "ITC Ltd.", sector: "Consumer Brands", risk: "low" },
  { symbol: "TITAN", name: "Titan Company Ltd.", sector: "Consumer Brands", risk: "medium" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd.", sector: "Automobile", risk: "high" },
  { symbol: "ADANIENT", name: "Adani Enterprises Ltd.", sector: "Infrastructure", risk: "high" },
  { symbol: "ZOMATO", name: "Zomato Ltd.", sector: "Technology", risk: "high" },
  { symbol: "PAYTM", name: "One 97 Communications", sector: "Fintech", risk: "high" },
];

async function generateRecommendations(profile: typeof userProfile) {
  try {
    const prompt = `Based on the following Indian stock market investment profile, recommend 10-15 appropriate NSE stocks.
    Amount: ₹${profile.investmentAmount}
    Period: ${profile.holdingPeriod}
    Risk: ${profile.riskTolerance}
    Sectors: ${profile.preferredSectors.join(", ")}
    Market Cap: ${profile.marketPreference}
    
    Return ONLY a valid JSON array of objects.
    Each object MUST have:
    - symbol, name, reason, sector
    
    Format: [{"symbol": "...", "name": "...", "reason": "...", "sector": "..."}]`;

    const text = await withRetry(async (model) => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });
    
    // ... logic to parse text ...
    const startIdx = text.indexOf("[");
    const endIdx = text.lastIndexOf("]");
    if (startIdx !== -1 && endIdx !== -1) {
      const jsonStr = text.substring(startIdx, endIdx + 1).replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) return parsed;
    }
    throw new Error("Invalid output format");

  } catch (err) {
    console.warn("[Profile] AI Fallback triggered for recommendations.");
    // Filter by risk tolerance
    return FALLBACK_STOCKS
      .filter(s => {
        if (profile.riskTolerance === 'high') return true;
        if (profile.riskTolerance === 'medium') return s.risk !== 'high';
        return s.risk === 'low';
      })
      .map(s => ({
        ...s,
        reason: `Selected matches your ${profile.riskTolerance} risk profile and ${profile.holdingPeriod} horizon.`
      }));
  }
}

router.get("/", (req, res) => {
  res.json(userProfile);
});

router.post("/", async (req, res) => {
  userProfile = { ...userProfile, ...req.body };
  console.log("[Profile] Generating recommendations for updated profile...");
  const recommendations = await generateRecommendations(userProfile);
  userProfile.recommendations = recommendations;
  res.json({ message: "Profile updated", profile: userProfile });
});

export default router;
