# 🚀 ApexQuant

<div align="center">
  <img src="visuals/final_e2e_walkthrough_1773663000000_1773664271778.webp" alt="ApexQuant Visual Showcase" width="100%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
</div>

<div align="center">
  <video src="https://github.com/AmulyaInnovates/ApexQuant/blob/main/Project%20Working.webm" autoplay loop muted playsinline width="100%"></video>
</div>

---

## ✨ Features

- **Data Layer:** Yahoo Finance historical quotes, optional NewsAPI headlines (fallback mocks available).
- **AI Layer:** NVIDIA chat/sentiment endpoint ready (falls back to rule-based scoring), indicator-to-text insight generator, risk detection for volume/RSI.
- **Application Layer:** Dark analytics UI with a stunning landing page, comprehensive market dashboard, stock analysis search, portfolio analyzer, and an interactive AI chat panel.

## 🛠 Tech Stack

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) 
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
* **Libraries:** `yahoo-finance2`, `technicalindicators`, `axios`, `dotenv`

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
* **Libraries:** Next.js 14 (App Router), React Query, Chart.js (`react-chartjs-2`), Framer Motion, Zustand-ready

---

## 🚀 Run Locally

### 1. Backend (API)
```bash
cd backend
cp .env.example .env   # add NVIDIA/News API keys if available
npm install
npm run dev            # starts on http://localhost:4000
```

### 2. Frontend (Dashboard)
```bash
cd frontend
cp .env.local.example .env.local  # adjust API base if the backend port changes
npm install
npm run dev            # starts on http://localhost:3000
```

> **Note:**
> - `NVIDIA_API_KEY` is optional; without it, sentiment uses a light rule-based scorer.
> - The UI is tuned for a “monitoring dashboard” look: dark glass cards, minimal gradients, responsive grid.

---

## 📡 API Endpoints

- `GET /api/market/:ticker` — Prices, indicators (SMA20/50, RSI14, volume spike), sentiment, insight, risk flags, headlines.
- `POST /api/portfolio/analyze` — Provide holdings array `{ ticker, weight, sector?, beta? }` to receive diversification metrics and notes.
- `POST /api/chat` — Send a question + ticker to get a grounded answer combined with indicators and a sentiment snapshot.

---

## 📜 License

This project is licensed under the **Apache License 2.0**.

### What you get with Apache License 2.0:
- **Commercial Use:** You can use the software for commercial purposes.
- **Modification:** You are free to modify the source code.
- **Distribution:** You can distribute the original or modified software.
- **Patent Use:** It provides an express grant of patent rights from contributors.
- **Private Use:** You can use and modify the software privately.

*For more details, see the full [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).*
