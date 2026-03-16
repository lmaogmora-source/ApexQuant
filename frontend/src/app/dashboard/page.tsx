"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { SentimentBadge } from "../../components/dashboard/SentimentBadge";
import { TrendLineChart } from "../../components/charts/TrendLineChart";
import { MarketResponse } from "../../types";

export default function DashboardPage() {
  const [ticker, setTicker] = useState("RELIANCE");
  const { data, isLoading } = useQuery<MarketResponse>({
    queryKey: ["market", ticker],
    queryFn: () => api.getMarket(ticker),
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });

  const top10 = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "BHARTIARTL", "SBIN", "LICI", "LTIM", "ITC"];

  const historyLabels = (data?.history ?? []).map((p) =>
    new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );
  const prices = (data?.history ?? []).map((p) => p.close);

  return (
    <Sidebar>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Overview</div>
          <h1 className="text-3xl font-semibold text-white">Market Dashboard</h1>
          <p className="text-slate-400 max-w-2xl">
            Live snapshot with technical signals, sentiment, and risk flags for top 10 NSE stocks.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {top10.map((t) => (
            <button
              key={t}
              onClick={() => setTicker(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                ticker === t
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Price"
            value={isLoading ? "Loading..." : `${data?.price?.toLocaleString('en-IN') ?? "–"} ${data?.currency === 'INR' ? '₹' : (data?.currency ?? '')}`}
            sub="Regular market price"
            accent="sky"
          />
          <MetricCard
            label="Daily Change"
            value={
              isLoading
                ? "Loading..."
                : data?.changePercent !== null && data?.changePercent !== undefined
                ? `${data.changePercent.toFixed(2)}%`
                : "–"
            }
            sub="Percent vs previous close"
            accent="emerald"
          />
          <MetricCard
            label="RSI (14)"
            value={isLoading ? "Loading..." : data?.indicators?.rsi14?.toFixed?.(1) ?? "–"}
            sub="Overbought > 70, Oversold < 30"
            accent="violet"
          />
          <MetricCard
            label="Volume Spike"
            value={isLoading ? "…" : data?.indicators?.volumeSpike ? "Yes" : "No"}
            sub={data?.indicators?.volumeSpike ? "Recent sessions above norm" : "Within typical range"}
            accent="amber"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <TrendLineChart labels={historyLabels} prices={prices} />
          <div className="glass rounded-xl border border-slate-800/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">News Sentiment</div>
                {data?.sentiment && <SentimentBadge label={data.sentiment.label} score={data.sentiment.score} />}
              </div>
              <div className="text-xs text-slate-500">Last update: {data?.lastUpdated && new Date(data.lastUpdated).toLocaleTimeString()}</div>
            </div>
            <div className="text-sm text-slate-300 mt-3">{data?.insight}</div>
            <div className="text-xs text-slate-500 mt-4">Headlines</div>
            <ul className="space-y-2 text-sm text-slate-400 mt-2">
              {(data?.headlines ?? []).slice(0, 3).map((h) => (
                <li key={h.title} className="leading-relaxed">
                  • {h.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glass rounded-xl border border-slate-800/70 p-4">
          <div className="text-sm text-slate-400 mb-2">Risk Alerts</div>
          <div className="flex flex-wrap gap-2">
            {(data?.riskFlags ?? []).length === 0 && <span className="text-slate-500 text-sm">No elevated risks.</span>}
            {(data?.riskFlags ?? []).map((r: string) => (
              <span key={r} className="px-3 py-1 rounded-full text-xs border border-amber-400/30 text-amber-200 bg-amber-500/10">
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
