import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import marketRouter from "./routes/market";
import portfolioRouter from "./routes/portfolio";
import chatRouter from "./routes/chat";
import profileRouter from "./routes/profile";
import picksRouter from "./routes/picks";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/market", marketRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/chat", chatRouter);
app.use("/api/profile", profileRouter);
app.use("/api/picks", picksRouter);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
