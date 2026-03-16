"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// In-memory store for demo purposes. In production, this would be a database.
let userProfile = {
    investmentAmount: 0,
    holdingPeriod: "long-term",
    riskTolerance: "medium",
    preferredSectors: [],
    investmentTiming: "gradually",
    expectedReturn: 15,
    liquidityRequirement: "flexible",
    marketPreference: "large-cap",
};
router.get("/", (req, res) => {
    res.json(userProfile);
});
router.post("/", (req, res) => {
    userProfile = { ...userProfile, ...req.body };
    res.json({ message: "Profile updated", profile: userProfile });
});
exports.default = router;
//# sourceMappingURL=profile.js.map