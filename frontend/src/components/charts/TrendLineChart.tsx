"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { ChartData, ChartOptions } from "chart.js";

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), { ssr: false });
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
  Chart as ChartJS,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

interface TrendLineChartProps {
  labels: string[];
  prices: number[];
}

export function TrendLineChart({ labels, prices }: TrendLineChartProps) {
  const data = useMemo<ChartData<"line">>(
    () => ({
      labels,
      datasets: [
        {
          label: "Close",
          data: prices,
          borderColor: "#22d3ee",
          backgroundColor: "rgba(34,211,238,0.15)",
          tension: 0.4,
          fill: true,
          pointRadius: 0,
        },
      ],
    }),
    [labels, prices]
  );

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8", maxTicksLimit: 8 },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
    },
  };

  return (
    <div className="glass rounded-xl p-4 border border-slate-800/70">
      <Line data={data} options={options} height={220} />
    </div>
  );
}
