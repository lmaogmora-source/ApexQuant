"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { TrendLineChart } from "../../components/charts/TrendLineChart";
import { motion, AnimatePresence } from "framer-motion";

export default function PicksPage() {
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isSending, setIsSending] = useState(false);

  const { data: sectors, isLoading: sectorsLoading } = useQuery({
    queryKey: ["picks"],
    queryFn: () => api.getPicks(),
  });

  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ["market", selectedStock?.symbol],
    queryFn: () => api.getMarket(selectedStock.symbol),
    enabled: !!selectedStock,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getProfile(),
  });

  const [adviceMetrics, setAdviceMetrics] = useState<any>(null);

  const handleSendChat = async () => {
    if (!chatMessage.trim() || isSending) return;

    const userMsg = chatMessage;
    setChatMessage("");
    setChatHistory((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsSending(true);

    try {
      const data = await api.askPicksChat({
        symbol: selectedStock.symbol,
        message: userMsg,
        userProfile: profile?.profile,
      });

      let rawResponse = data.response;
      let displayMsg = rawResponse;

      // Parse structured JSON if present
      if (rawResponse.includes("---JSON---")) {
        const parts = rawResponse.split("---JSON---");
        displayMsg = parts[0].trim();
        try {
          const jsonStr = parts[1].trim();
          const metrics = JSON.parse(jsonStr);
          setAdviceMetrics(metrics);
        } catch (e) {
          console.error("Failed to parse advice metrics", e);
        }
      }

      setChatHistory((prev) => [...prev, { role: "assistant", content: displayMsg }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: "assistant", content: "Sorry, I hit a snag getting advice for this stock." }]);
    } finally {
      setIsSending(false);
    }
  };

  const historyLabels = (marketData?.history ?? []).map((p: any) =>
    new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );
  const prices = (marketData?.history ?? []).map((p: any) => p.close);

  return (
    <Sidebar>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Curated Intelligence</div>
          <h1 className="text-3xl font-semibold text-white">Market Picks</h1>
          <p className="text-slate-400 max-w-2xl">
            Explore the most suggested stocks by sector, selected for growth, stability, and safety.
          </p>
        </div>

        {sectorsLoading ? (
          <div className="p-10 text-center text-slate-500 italic">Finding top picks...</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {Object.entries(sectors || {}).map(([sector, stocks]: [string, any]) => (
              <div key={sector} className="glass rounded-xl border border-slate-800/70 p-5 bg-slate-900/30">
                <h2 className="text-lg font-medium text-cyan-300 mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  {sector}
                </h2>
                <div className="flex flex-col gap-3">
                  {stocks.map((stock: any) => (
                    <motion.button
                      key={stock.symbol}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        setSelectedStock(stock);
                        setChatHistory([]);
                      }}
                      className="p-3 rounded-lg border border-slate-800 bg-slate-950/40 hover:border-cyan-500/30 text-left transition-colors group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-200 group-hover:text-cyan-200 uppercase tracking-wide">{stock.symbol}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-700 text-slate-400">{stock.type}</span>
                      </div>
                      <div className="text-sm text-slate-400 mt-1">{stock.name}</div>
                      <div className="text-[10px] uppercase text-emerald-400/80 mt-2 font-medium tracking-wider">Safety: {stock.safety}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selectedStock && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 border-t border-slate-800 pt-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white uppercase">{selectedStock.symbol} Deep Dive</h2>
                  <p className="text-slate-400">{selectedStock.name}</p>
                </div>
                <button
                  onClick={() => setSelectedStock(null)}
                  className="p-2 text-slate-500 hover:text-slate-200 transition-colors"
                >
                  ✕ Close Analysis
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <div className="glass rounded-xl border border-slate-800/70 p-4">
                    <div className="text-sm text-slate-400 mb-4 uppercase tracking-wider text-[11px] font-bold">Trend Analysis (Mock / Live)</div>
                    {marketLoading ? (
                      <div className="h-64 flex items-center justify-center text-slate-600 animate-pulse italic">Loading charts...</div>
                    ) : (
                      <TrendLineChart labels={historyLabels} prices={prices} />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Buy Amount</div>
                      <div className="text-lg font-medium text-white italic">{adviceMetrics?.suggestedQuantity || "Ask Advisor..."}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Horizon</div>
                      <div className="text-lg font-medium text-emerald-400">{adviceMetrics?.suggestedHorizon || "Select..."}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 mt-0">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Advisor's Risk Assessment</div>
                    <div className="text-sm text-slate-300 mt-1 italic">{adviceMetrics?.riskMatch ? `Confirmed as ${adviceMetrics.riskMatch}` : "Awaiting analysis..."}</div>
                  </div>
                </div>

                <div className="flex flex-col h-[600px] glass rounded-xl border border-slate-800/70 overflow-hidden bg-slate-950/30">
                  <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center text-xs text-slate-400">
                    <span className="font-mono text-cyan-400 uppercase">{selectedStock.symbol} ADVISOR</span>
                    <span className="italic">Grounded in NSE Data</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatHistory.length === 0 && (
                      <div className="text-center text-slate-600 mt-10 px-6">
                        <p className="italic mb-4 text-sm font-medium">Ask specific doubts about ${selectedStock.symbol}:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {["How much should I buy?", "What is the risks?", "Holding for 2 years?"].map((q) => (
                            <button
                              key={q}
                              onClick={() => { setChatMessage(q); }}
                              className="text-[10px] px-3 py-1.5 rounded-full border border-slate-800 text-slate-500 hover:border-cyan-500/50 hover:text-cyan-300 transition-all font-semibold uppercase tracking-widest"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {chatHistory.map((m, idx) => (
                      <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            m.role === "user"
                              ? "bg-cyan-500 text-slate-950 font-medium"
                              : "bg-slate-800/50 text-slate-200 border border-slate-700/50 prose prose-invert prose-sm"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex justify-start">
                        <div className="bg-slate-800/50 text-slate-400 rounded-2xl px-4 py-3 text-xs italic border border-slate-700/50 animate-pulse">
                          Advisor is thinking...
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-900/50 border-t border-slate-800">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                        placeholder={`Ask about ${selectedStock.symbol}...`}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-600"
                      />
                      <button
                        onClick={handleSendChat}
                        disabled={isSending || !chatMessage.trim()}
                        className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs uppercase hover:bg-cyan-400 transition-colors disabled:opacity-50 tracking-tighter"
                      >
                        Ask
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Sidebar>
  );
}
