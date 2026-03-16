"use client";

import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { api } from "../../lib/api";
import { Sidebar } from "../../components/dashboard/Sidebar";

type Holding = { ticker: string; weight: number; sector?: string };

const TICKER_SECTOR_MAP: Record<string, string> = {
  "RELIANCE": "Energy",
  "TCS": "Technology",
  "HDFCBANK": "Finance",
  "INFY": "Technology",
  "ICICIBANK": "Finance",
  "BHARTIARTL": "Telecommunication",
  "SBIN": "Finance",
  "LICI": "Finance",
  "LTIM": "Technology",
  "ITC": "Consumer Goods",
  "HINDUNILVR": "Consumer Goods",
  "ADANIPORTS": "Utilities",
  "AXISBANK": "Finance",
  "BAJFINANCE": "Finance"
};

const TICKERS = Object.keys(TICKER_SECTOR_MAP);

const defaults: Holding[] = [
  { ticker: "RELIANCE", weight: 0.35, sector: "Energy" },
  { ticker: "TCS", weight: 0.25, sector: "Technology" },
  { ticker: "HDFCBANK", weight: 0.2, sector: "Finance" },
  { ticker: "INFY", weight: 0.2, sector: "Technology" },
];

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>(defaults);

  const mutation = useMutation({
    mutationFn: (payload: Holding[]) => api.analyzePortfolio(payload),
  });

  const total = useMemo(() => holdings.reduce((sum, h) => sum + h.weight, 0), [holdings]);

  return (
    <Sidebar>
      <div className="flex flex-col gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-500/80 font-bold mb-1">Step 2: Check Your Balance</div>
          <h1 className="text-3xl font-semibold text-white">Stock Mix Checker</h1>
          <p className="text-slate-400">Add your stocks below to see how safe and balanced your investments are.</p>
        </div>

        <div className="glass rounded-xl border border-slate-800/70 p-4 overflow-x-auto">
          <table className="w-full text-sm text-slate-200">
            <thead className="text-slate-400">
              <tr>
                <th className="text-left py-2 font-semibold">Stock Name</th>
                <th className="text-left py-2 font-semibold">Percentage (%)</th>
                <th className="text-left py-2 font-semibold uppercase text-[10px] tracking-widest text-slate-500">Calculated Sector</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, idx) => (
                <tr key={idx} className="border-t border-slate-800/70">
                  <td className="py-2">
                    <select
                      value={h.ticker}
                      onChange={(e) => {
                        const copy = [...holdings];
                        const ticker = e.target.value;
                        copy[idx].ticker = ticker;
                        copy[idx].sector = TICKER_SECTOR_MAP[ticker] || "Other";
                        setHoldings(copy);
                      }}
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-1 w-full text-slate-200 focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="">Choose Stock...</option>
                      {TICKERS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={h.weight}
                      onChange={(e) => {
                        const copy = [...holdings];
                        copy[idx].weight = Number(e.target.value);
                        setHoldings(copy);
                      }}
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-1 w-24"
                    />
                  </td>
                  <td className="py-2">
                    <div className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-800/50 text-slate-300 border border-slate-700/50 italic">
                      {h.sector || "Auto-detected"}
                    </div>
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => setHoldings((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-rose-300 hover:text-rose-200 text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between text-sm text-slate-400 mt-3">
            <button
              className="text-cyan-300 hover:text-cyan-200 font-medium"
              onClick={() => {
                const ticker = TICKERS[0];
                setHoldings((prev) => [...prev, { ticker, weight: 0.1, sector: TICKER_SECTOR_MAP[ticker] }]);
              }}
            >
              + Add holding
            </button>
            <div>Total weight: {total.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => mutation.mutate(holdings)}
            className="px-8 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/20"
          >
            Check My Mini-Portfolio
          </button>
          {mutation.isPending && <span className="text-slate-400 text-sm animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
            Analyzing your safety...
          </span>}
        </div>

        {mutation.data && (
          <div className="glass rounded-2xl border border-slate-800/70 p-6 grid gap-6 md:grid-cols-3 bg-slate-900/40">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Safety Rating</div>
              <div className="text-3xl font-bold text-emerald-400">
                {(mutation.data.analysis.diversificationScore * 100).toFixed(0)}%
              </div>
              <p className="text-[10px] text-slate-500">How well you mixed your stocks</p>
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Riskiest Spot</div>
              <div className="text-3xl font-bold text-amber-400">
                {(mutation.data.analysis.concentrationRisk * 100).toFixed(0)}%
              </div>
              <p className="text-[10px] text-slate-500">Biggest single investment</p>
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Industry Split</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(mutation.data.analysis.sectorAllocations).map(([k, v]) => (
                  <span key={k} className="px-2 py-1 text-xs rounded-full bg-slate-800/60 text-slate-200 border border-slate-700/70">
                    {k}: {(Number(v) * 100).toFixed(1)}%
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-3 text-sm text-slate-300">
              {mutation.data.analysis.notes.length
                ? mutation.data.analysis.notes.map((n: string) => (
                    <div key={n} className="text-amber-200">• {n}</div>
                  ))
                : "No critical risks detected."}
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
