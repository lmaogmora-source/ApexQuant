"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const market_1 = __importDefault(require("./routes/market"));
const portfolio_1 = __importDefault(require("./routes/portfolio"));
const chat_1 = __importDefault(require("./routes/chat"));
const profile_1 = __importDefault(require("./routes/profile"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
});
app.use("/api/market", market_1.default);
app.use("/api/portfolio", portfolio_1.default);
app.use("/api/chat", chat_1.default);
app.use("/api/profile", profile_1.default);
const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map