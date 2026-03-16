"use client";

import { useState } from "react";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    investmentAmount: "",
    holdingPeriod: "long-term",
    riskTolerance: "medium",
    preferredSectors: [] as string[],
    investmentTiming: "gradually",
    expectedReturn: "",
    liquidityRequirement: "flexible",
    marketPreference: "large-cap",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const sectors = ["Technology", "Healthcare", "Finance", "Energy", "Consumer Goods", "Semiconductor", "Green Energy"];

  const handleSectorToggle = (sector: string) => {
    setFormData(prev => ({
      ...prev,
      preferredSectors: prev.preferredSectors.includes(sector)
        ? prev.preferredSectors.filter(s => s !== sector)
        : [...prev.preferredSectors, sector]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setRecommendations(data.profile.recommendations || []);
      if (data.profile.recommendations?.length > 0) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to generate recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-semibold text-white mb-2">Investment Profile Setup</h1>
        <p className="text-slate-400 mb-8 text-sm uppercase tracking-widest">Personalize your AI Copilot</p>

        <form onSubmit={handleSubmit} className="glass border border-slate-800/70 rounded-2xl p-8 space-y-8 bg-slate-900/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Investment Amount (₹)</label>
              <input
                type="number"
                value={formData.investmentAmount}
                onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                placeholder="e.g. 100000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Holding Period</label>
              <select
                value={formData.holdingPeriod}
                onChange={(e) => setFormData({ ...formData, holdingPeriod: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="short-term">Short-term (Days/Weeks)</option>
                <option value="medium-term">Medium-term (Months)</option>
                <option value="long-term">Long-term (Years)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Risk Tolerance</label>
              <div className="flex gap-2">
                {["low", "medium", "high"].map((risk) => (
                  <button
                    key={risk}
                    type="button"
                    onClick={() => setFormData({ ...formData, riskTolerance: risk })}
                    className={`flex-1 py-1.5 rounded-md text-sm transition ${
                      formData.riskTolerance === risk
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-200 border"
                        : "bg-slate-950 border border-slate-800 text-slate-400"
                    }`}
                  >
                    {risk.charAt(0).toUpperCase() + risk.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Market Preference</label>
              <select
                value={formData.marketPreference}
                onChange={(e) => setFormData({ ...formData, marketPreference: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="large-cap">Large-Cap Stocks</option>
                <option value="mid-cap">Mid-Cap Stocks</option>
                <option value="small-cap">Small-Cap Stocks</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Preferred Sectors</label>
            <div className="flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <button
                  key={sector}
                  type="button"
                  onClick={() => handleSectorToggle(sector)}
                  className={`px-3 py-1.5 rounded-full text-xs transition border ${
                    formData.preferredSectors.includes(sector)
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-200"
                      : "border-slate-800 text-slate-500 hover:border-slate-600"
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-10 py-3 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Market...
                </>
              ) : "Save & Generate Recommendations"}
            </button>
          </div>
        </form>

        {recommendations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">AI Recommendations</h2>
                <p className="text-slate-400 text-sm">Based on your investment profile and risk tolerance</p>
              </div>
              <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-medium">
                {recommendations.length} Stocks Found
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((stock, i) => (
                <div key={i} className="glass border border-slate-800/50 p-5 rounded-xl bg-slate-900/20 hover:border-cyan-500/30 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-cyan-400 font-bold tracking-wider group-hover:text-cyan-300 transition-colors">{stock.symbol}</span>
                      <h3 className="text-white text-sm font-medium mt-1">{stock.name}</h3>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 uppercase tracking-tighter">
                      {stock.sector}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed italic">
                    {stock.reason}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Sidebar>
  );
}
