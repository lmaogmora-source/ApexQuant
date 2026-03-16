import { Router } from "express";
import { analyzePortfolio } from "../ai/risk";
import { Holding } from "../types";

const router = Router();

router.post("/analyze", (req, res) => {
  const holdings = (req.body?.holdings ?? []) as Holding[];
  if (!Array.isArray(holdings) || !holdings.length) {
    return res.status(400).json({ error: "Provide holdings as an array with ticker and weight." });
  }

  const cleaned = holdings
    .filter((h) => h.ticker && typeof h.weight === "number")
    .map((h) => ({
      ticker: h.ticker.toUpperCase(),
      weight: h.weight,
      sector: h.sector ?? undefined,
      beta: h.beta ?? undefined,
    })) as Holding[];

  const analysis = analyzePortfolio(cleaned);
  res.json({ holdings: cleaned, analysis });
});

export default router;
