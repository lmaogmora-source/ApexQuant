export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.png" alt="ApexQuant Logo" className="h-10 w-auto object-contain" />
        </div>
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-semibold text-white leading-tight">
              Real-time market intelligence, AI insights, and portfolio risk in one dashboard.
            </h1>
            <p className="text-lg text-slate-300">
              The Copilot ingests live prices, financial news, and technical indicators to generate plain-English
              insights and actionable risk alerts for every ticker you track.
            </p>
            <div className="flex gap-3">
              <a
                href="/dashboard"
                className="px-5 py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition"
              >
                Open Dashboard
              </a>
              <a
                href="/chat"
                className="px-5 py-3 rounded-lg border border-slate-700 text-slate-100 hover:border-cyan-400 transition"
              >
                Ask the AI
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-400 max-w-xl">
              <div className="glass rounded-lg p-3 border border-slate-800/60">
                • Technical indicators (SMA, RSI, volume spikes) <br />• DeepSeek-V3.1 AI integration
              </div>
              <div className="glass rounded-lg p-3 border border-slate-800/60">
                • Portfolio diversification + risk checks <br />• Chat assistant grounded in your data
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl border border-slate-800/70 p-6 bg-slate-900/50 shadow-2xl">
            <div className="text-sm text-slate-400 mb-3">Live Dashboard Preview</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 p-4 border border-cyan-500/20">
                <div className="text-xs text-slate-300">NIFTY 50</div>
                <div className="text-2xl font-semibold text-white mt-1">+0.84%</div>
                <div className="text-xs text-emerald-300 mt-2">Bullish momentum</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 p-4 border border-violet-500/20">
                <div className="text-xs text-slate-300">Sentiment</div>
                <div className="text-2xl font-semibold text-white mt-1">Positive</div>
                <div className="text-xs text-slate-300 mt-2">AI scored 0.34</div>
              </div>
              <div className="col-span-2 rounded-xl border border-slate-800/60 bg-slate-950/70 p-4">
                <div className="text-xs text-slate-400 mb-2">RELIANCE trend</div>
                <div className="h-32 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center text-slate-500 text-sm">
                  Lightweight line chart
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Market Trend Analyzer", desc: "Moving averages, RSI, and volume anomalies computed server-side." },
          { title: "News Sentiment Engine", desc: "Connect NVIDIA AI or use rule-based fallback sentiment scoring." },
          { title: "AI Insight Generator", desc: "Transforms raw signals into clear explanations for investors." },
          { title: "Portfolio Risk", desc: "Sector allocation, concentration checks, diversification scoring." },
        ].map((item) => (
          <div key={item.title} className="glass p-4 rounded-xl border border-slate-800/70">
            <div className="text-sm text-cyan-300">{item.title}</div>
            <div className="text-slate-300 text-sm mt-2">{item.desc}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
