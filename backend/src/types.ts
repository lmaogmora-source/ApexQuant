export type SentimentLabel = "positive" | "neutral" | "negative";

export interface SentimentResult {
  score: number; // -1 to 1
  label: SentimentLabel;
  headlineSamples: string[];
}

export interface IndicatorSummary {
  sma20: number | null;
  sma50: number | null;
  rsi14: number | null;
  volumeSpike: boolean;
  trendStrength: number; // 0-100
}

export interface MarketSnapshot {
  ticker: string;
  price: number | null;
  changePercent: number | null;
  currency?: string;
  indicators: IndicatorSummary;
  sentiment: SentimentResult;
  riskFlags: string[];
  lastUpdated: string;
}

export interface Holding {
  ticker: string;
  weight: number; // as decimal 0-1
  sector?: string;
  beta?: number;
}

export interface PortfolioAnalysis {
  diversificationScore: number;
  concentrationRisk: number;
  sectorAllocations: Record<string, number>;
  notes: string[];
}
