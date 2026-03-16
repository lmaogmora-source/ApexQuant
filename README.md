# ApexQuant

<div align="center">
  <video src="https://github.com/AmulyaInnovates/ApexQuant/blob/main/Project%20Working.webm" autoplay loop muted playsinline width="100%"></video>
</div>

Full-stack market intelligence platform with a Node/Express backend and Next.js (app router) frontend.

## Run locally

1) Backend (API)
```
cd backend
cp .env.example .env   # add NVIDIA/News API keys if available
npm install
npm run dev            # starts on http://localhost:4000
```

2) Frontend (dashboard)
```
cd frontend
cp .env.local.example .env.local  # adjust API base if the backend port changes
npm install
npm run dev          # starts on http://localhost:3000
```

## What’s included
- Data layer: Yahoo Finance historical quotes, optional NewsAPI headlines (fallback mocks).
- AI layer: NVIDIA chat/sentiment endpoint ready (falls back to rule-based scoring), indicator-to-text insight generator, risk detection for volume/RSI.
- Application layer: Dark analytics UI with landing, market dashboard, stock analysis search, portfolio analyzer, and AI chat panel.

## Key endpoints
- `GET /api/market/:ticker` — prices, indicators (SMA20/50, RSI14, volume spike), sentiment, insight, risk flags, headlines.
- `POST /api/portfolio/analyze` — holdings array `{ ticker, weight, sector?, beta? }` → diversification + notes.
- `POST /api/chat` — question + ticker → grounded answer with indicators and sentiment snapshot.

## Tech stack
- Backend: Node 24, Express, TypeScript, yahoo-finance2, technicalindicators, axios, dotenv.
- Frontend: Next.js 14 app router, Tailwind, React Query, react-chartjs-2/Chart.js, Framer Motion, Zustand-ready.

## Notes
- NVIDIA_API_KEY is optional; without it, sentiment uses a light rule-based scorer.
- The UI is tuned for a “monitoring dashboard” look: dark glass cards, minimal gradients, responsive grid.
