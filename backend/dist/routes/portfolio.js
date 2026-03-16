"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const risk_1 = require("../ai/risk");
const router = (0, express_1.Router)();
router.post("/analyze", (req, res) => {
    const holdings = (req.body?.holdings ?? []);
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
    }));
    const analysis = (0, risk_1.analyzePortfolio)(cleaned);
    res.json({ holdings: cleaned, analysis });
});
exports.default = router;
//# sourceMappingURL=portfolio.js.map