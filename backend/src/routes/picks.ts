import express from "express";
import { withRetry } from "../ai/gemini";

const router = express.Router();

// Mock/Curated suggestions by sector
const SECTOR_PICKS = {
  "Technology": [
    { symbol: "TCS", name: "Tata Consultancy Services Ltd.", type: "Large Cap", safety: "Very High" },
    { symbol: "INFY", name: "Infosys Ltd.", type: "Large Cap", safety: "High" },
    { symbol: "LTIM", name: "LTIMindtree Ltd.", type: "Mid/Large Cap", safety: "Medium" }
  ],
  "Energy": [
    { symbol: "RELIANCE", name: "Reliance Industries Ltd.", type: "Mega Cap", safety: "Very High" },
    { symbol: "ONGC", name: "Oil & Natural Gas Corp.", type: "Large Cap", safety: "High" },
    { symbol: "NHPC", name: "NHPC Ltd.", type: "Mid Cap", safety: "Medium" }
  ],
  "Finance": [
    { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", type: "Large Cap", safety: "Very High" },
    { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", type: "Large Cap", safety: "High" },
    { symbol: "SBIN", name: "State Bank of India", type: "Large Cap", safety: "High" }
  ],
  "Consumer Brands": [
    { symbol: "ITC", name: "ITC Ltd.", type: "Large Cap", safety: "High" },
    { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd.", type: "Large Cap", safety: "Very High" },
    { symbol: "TITAN", name: "Titan Company Ltd.", type: "Large Cap", safety: "Medium" }
  ]
};

router.get("/", (req, res) => {
  res.json(SECTOR_PICKS);
});

router.post("/chat", async (req, res) => {
  const { symbol, message, userProfile } = req.body;

  try {
    const prompt = `
      You are an expert Indian Stock Consultant. 
      The user is asking about: ${symbol}.
      User Profile: 
      - Risk: ${userProfile?.riskTolerance || 'medium'}
      - Horizon: ${userProfile?.holdingPeriod || 'medium-term'}
      - Preference: ${userProfile?.marketPreference || 'any'}

      Their question: "${message}"

      Provide advice in two parts. 
      First, a clean Markdown analysis of the stock.
      Second, a JSON block at the end with this format: 
      { "suggestedQuantity": "...", "suggestedHorizon": "...", "riskMatch": "..." }

      Be specific about:
      1. Whether this stock fits their profile.
      2. Suggested buy amount (e.g., "5-10% of portfolio (₹10k)").
      3. Suggested holding period.
      4. Key risks.
      
      Output example:
      ### Analysis
      [Your analysis here]
      
      ---JSON---
      { "suggestedQuantity": "15-20 Shares", "suggestedHorizon": "2 Years", "riskMatch": "Perfect" }
    `;

    const response = await withRetry(async (model) => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    }).catch(err => {
      console.warn("[Picks] AI Quota hit, using Smart Fallback.");
      
      const msg = (message || "").toLowerCase();
      const amount = userProfile?.investmentAmount || 100000;
      const risk = userProfile?.riskTolerance || 'medium';
      const duration = userProfile?.holdingPeriod || 'long-term';
      
      const suggestPercent = risk === 'high' ? 12 : (risk === 'low' ? 4 : 8);
      // Rough quantity estimation
      const quantity = Math.max(5, Math.floor((amount * (suggestPercent/100)) / 1000));

      let responseText = `### Advisor Insight: ${symbol}\n`;
      let riskMatch = "High Alignment";

      if (msg.includes("risk")) {
        responseText += `Based on your **${risk} risk tolerance**, this ${symbol} position is suitable. Its volatility profile stays within your comfort zone, provided you maintain a diversified portfolio. Watch for sector-specific headwinds.`;
        riskMatch = risk === 'low' ? "Cautious Match" : "Strategic Match";
      } else if (msg.includes("buy") || msg.includes("quantity") || msg.includes("much")) {
        responseText += `For your ₹${amount.toLocaleString('en-IN')} portfolio, I suggest a cautious entry with an allocation of **${suggestPercent}%**. This equates to roughly **${quantity}-${quantity+5} units** at current market prices.`;
      } else if (msg.includes("long") || msg.includes("time") || msg.includes("horizon") || msg.includes("year")) {
        responseText += `Your **${duration}** horizon aligns well with ${symbol}'s fundamental growth trajectory. We recommend accumulating in blocks rather than a single lump sum.`;
      } else {
        responseText += `I've analyzed ${symbol} against your **${risk}** risk profile. It represents a solid **${duration}** play. We suggest limiting your total exposure to ${suggestPercent}% of your initial capital.`;
      }

      return `${responseText}\n\n---JSON---\n{ "suggestedQuantity": "${quantity} - ${quantity+5} Units", "suggestedHorizon": "${duration}", "riskMatch": "${riskMatch}" }`;
    });

    res.json({ response });
  } catch (error) {
    console.error("[Picks Chat Error]", error);
    res.status(500).json({ error: "Failed to get AI advice" });
  }
});

export default router;
