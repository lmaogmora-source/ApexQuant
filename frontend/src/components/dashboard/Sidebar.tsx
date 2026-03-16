"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Market Dashboard" },
  { href: "/analysis", label: "Stock Analysis" },
  { href: "/portfolio", label: "Portfolio Analyzer" },
  { href: "/profile", label: "Investment Profile" },
  { href: "/picks", label: "Market Picks" },
  { href: "/chat", label: "AI Market Chat" },
];

export function Sidebar({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:flex flex-col gap-4 border-r border-slate-800/70 bg-slate-950/60 px-4 py-6">
        <Link href="/dashboard" className="flex items-center gap-3 px-1 py-2 outline-none group">
          <img src="/logo.png" alt="ApexQuant Logo" className="h-8 w-auto object-contain" />
        </Link>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    active
                      ? "bg-cyan-500/10 text-cyan-200 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </aside>
      <main className="px-4 sm:px-6 lg:px-8 py-6">{children}</main>
    </div>
  );
}
