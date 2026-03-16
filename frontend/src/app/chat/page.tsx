"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../lib/api";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { SentimentBadge } from "../../components/dashboard/SentimentBadge";

export default function ChatPage() {
  const [mode, setMode] = useState("custom");
  const [question, setQuestion] = useState("");
  const [ticker, setTicker] = useState("RELIANCE");

  const top10 = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "BHARTIARTL", "SBIN", "LICI", "LTIM", "ITC"];
  
  const suggestions = mode === "custom" 
    ? ["Market outlook for today?", "Top performing sector?", "General investment advice?"]
    : [`Is ${ticker} a good buy at current price?`, `What are the risks for ${ticker}?`, `Support and resistance for ${ticker}?`];

  const mutation = useMutation({
    mutationFn: () => api.askChat({ question, ticker: mode === "custom" ? (ticker || "RELIANCE") : ticker }),
  });

  const handleModeChange = (val: string) => {
    setMode(val);
    if (val !== "custom") {
      setTicker(val);
      setQuestion(`Provide a detailed market analysis for ${val} based on latest signals.`);
    } else {
      setQuestion("");
    }
  };

  return (
    <Sidebar>
      <div className="flex flex-col gap-6 max-w-4xl">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-500 font-bold mb-1">AI Copilot assistant</div>
          <h1 className="text-3xl font-semibold text-white">Market Intelligence Chat</h1>
          <p className="text-slate-400">
            Select a stock or ask a custom question. Our AI uses real-time Gemini verification for prices and news.
          </p>
        </div>

        <div className="glass rounded-2xl border border-white/5 p-6 space-y-5 bg-slate-900/40 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Select Target</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                value={mode}
                onChange={(e) => handleModeChange(e.target.value)}
              >
                <option value="custom">✨ Custom Question</option>
                <optgroup label="Company Stocks">
                  {top10.map(t => <option key={t} value={t}>Analyze {t}</option>)}
                </optgroup>
              </select>
            </div>
            
            {mode === "custom" && (
              <div className="w-full md:w-1/3 space-y-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Ticker Symbol</label>
                <input
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  placeholder="e.g. RELIANCE"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Your Question</label>
            <textarea
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-cyan-500 outline-none transition-all min-h-[140px] resize-none shadow-inner"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={mode === "custom" ? "Ask anything about the market..." : `Ask about ${ticker}...`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => setQuestion(s)}
                className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-slate-800 text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-all hover:bg-cyan-500/5 bg-slate-900/50"
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => mutation.mutate()}
            disabled={!question || mutation.isPending}
            className="w-full md:w-auto px-10 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
          >
            {mutation.isPending ? "Generating Insight..." : "Ask AI Assistant"}
            {!mutation.isPending && (
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="ArrowRightIcon" />
              </svg>
            )}
          </button>
        </div>

        {mutation.isPending && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <div className="text-slate-400 text-sm font-medium animate-pulse">Consulting Gemini for latest market data...</div>
          </div>
        )}

        {mutation.data && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass rounded-2xl border border-white/5 p-6 space-y-4 bg-slate-900/40 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <svg className="w-32 h-32 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <div className="w-5 h-5 text-cyan-400 font-bold flex items-center justify-center text-xs">AI</div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Analysis Result</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{ticker} Market Signal</p>
                  </div>
                </div>
                {mutation.data.sentiment && (
                  <SentimentBadge label={mutation.data.sentiment.label} score={mutation.data.sentiment.score} />
                )}
              </div>

              <div className="text-slate-200 leading-relaxed whitespace-pre-wrap text-sm border-l-2 border-cyan-500/30 pl-4 py-1">
                {mutation.data.answer}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 mt-4 border-t border-white/5">
                <div className="space-y-1 text-center border-r border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Current Price</p>
                  <p className="text-white font-bold text-sm">₹{mutation.data.price?.toLocaleString('en-IN')}</p>
                </div>
                <div className="space-y-1 text-center border-r border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Strength</p>
                  <p className="text-cyan-400 font-bold text-sm">
                    {Math.round(mutation.data.indicators?.trendStrength ?? 0)}/100
                  </p>
                </div>
                <div className="space-y-1 text-center border-r border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">RSI (14)</p>
                  <p className="text-violet-400 font-bold text-sm">{mutation.data.indicators?.rsi14?.toFixed(1) ?? "–"}</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Volume</p>
                  <p className={`text-sm font-bold ${mutation.data.indicators?.volumeSpike ? "text-amber-400" : "text-slate-400"}`}>
                    {mutation.data.indicators?.volumeSpike ? "Surge" : "Normal"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
