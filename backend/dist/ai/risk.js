"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectMarketRisks = detectMarketRisks;
exports.analyzePortfolio = analyzePortfolio;
function detectMarketRisks(indicators) {
    const alerts = [];
    if (indicators.volumeSpike)
        alerts.push("Unusual volume spike detected");
    if (indicators.rsi14 !== null && indicators.rsi14 > 75)
        alerts.push("RSI suggests overbought conditions");
    if (indicators.rsi14 !== null && indicators.rsi14 < 25)
        alerts.push("RSI suggests oversold conditions");
    if (indicators.trendStrength < 35)
        alerts.push("Weak price momentum");
    return alerts;
}
function analyzePortfolio(holdings) {
    const totalWeight = holdings.reduce((sum, h) => sum + h.weight, 0) || 1;
    const normalized = holdings.map((h) => ({ ...h, weight: h.weight / totalWeight }));
    const hhi = normalized.reduce((sum, h) => sum + Math.pow(h.weight, 2), 0);
    const diversificationScore = Math.max(0, 1 - hhi); // 0 to 1
    const concentrationRisk = Math.max(...normalized.map((h) => h.weight));
    const sectorAllocations = {};
    normalized.forEach((h) => {
        const key = h.sector ?? "Unspecified";
        sectorAllocations[key] = (sectorAllocations[key] ?? 0) + h.weight;
    });
    const notes = [];
    const topSectorEntry = Object.entries(sectorAllocations).sort((a, b) => b[1] - a[1])[0];
    if (topSectorEntry && topSectorEntry[1] > 0.4) {
        notes.push(`High sector concentration in ${topSectorEntry[0]} (${(topSectorEntry[1] * 100).toFixed(1)}%)`);
    }
    if (diversificationScore < 0.6) {
        notes.push("Portfolio is moderately concentrated; consider diversifying holdings.");
    }
    return { diversificationScore, concentrationRisk, sectorAllocations, notes };
}
//# sourceMappingURL=risk.js.map