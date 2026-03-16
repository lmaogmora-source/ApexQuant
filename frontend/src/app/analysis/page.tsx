"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../lib/api";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { SentimentBadge } from "../../components/dashboard/SentimentBadge";
import { TrendLineChart } from "../../components/charts/TrendLineChart";
import { MarketResponse } from "../../types";

export default function AnalysisPage() {
  const [ticker, setTicker] = useState("MSFT");
  const { data, isFetching, refetch } = useQuery<MarketResponse>({
    queryKey: ["market", ticker],
    queryFn: () => api.getMarket(ticker),
    enabled: !!ticker,
  });

  const labels = (data?.history ?? []).map((p) =>
    new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );
  const prices = (data?.history ?? []).map((p) => p.close);

  return (
    <Sidebar>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Deep Dive</div>
            <h1 className="text-3xl font-semibold text-white">Stock Analysis</h1>
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              refetch();
            }}
          >
            <input
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
              placeholder="Ticker (e.g., NVDA)"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400"
            >
              Analyze
            </button>
          </form>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Price" value={isFetching ? "…" : `${data?.price ?? "–"} ${data?.currency ?? ""}`} />
          <MetricCard
            label="RSI (14)"
            value={isFetching ? "…" : data?.indicators?.rsi14?.toFixed?.(1) ?? "–"}
            sub="Overbought > 70 / Oversold < 30"
            accent="violet"
          />
          <MetricCard
            label="SMA 20 vs 50"
            value={
              isFetching
                ? "…"
                : `${data?.indicators?.sma20?.toFixed?.(2) ?? "–"} / ${data?.indicators?.sma50?.toFixed?.(2) ?? "–"}`
            }
            accent="emerald"
          />
          <MetricCard
            label="Trend strength"
            value={isFetching ? "…" : `${Math.round(data?.indicators?.trendStrength ?? 0)} / 100`}
            accent="amber"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <TrendLineChart labels={labels} prices={prices} />
          <div className="glass rounded-xl border border-slate-800/70 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">Sentiment</div>
              {data?.sentiment && <SentimentBadge label={data.sentiment.label} score={data.sentiment.score} />}
            </div>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">{data?.insight}</p>
            <div className="text-xs text-slate-500 mt-4">Recent headlines</div>
            <ul className="space-y-2 text-sm text-slate-400 mt-2">
              {(data?.headlines ?? []).slice(0, 4).map((h) => (
                <li key={h.title}>• {h.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
