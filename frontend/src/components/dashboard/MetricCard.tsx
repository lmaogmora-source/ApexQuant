"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: "sky" | "violet" | "emerald" | "amber" | "red";
}

const accents: Record<string, string> = {
  sky: "from-cyan-500/30 to-cyan-500/10 text-cyan-100",
  violet: "from-violet-500/30 to-violet-500/10 text-violet-100",
  emerald: "from-emerald-500/30 to-emerald-500/10 text-emerald-100",
  amber: "from-amber-500/30 to-amber-500/10 text-amber-100",
  red: "from-rose-500/30 to-rose-500/10 text-rose-100",
};

export function MetricCard({ label, value, sub, accent = "sky" }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-xl p-4 border border-slate-800/70 bg-gradient-to-br from-slate-900 to-slate-950"
    >
      <div className="text-sm text-slate-400">{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${accents[accent]}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </motion.div>
  );
}
