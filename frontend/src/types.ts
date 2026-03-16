export type SentimentLabel = "positive" | "neutral" | "negative";

export interface SentimentResult {
  score: number;
  label: SentimentLabel;
  headlineSamples: string[];
}

export interface IndicatorSummary {
  sma20: number | null;
  sma50: number | null;
  rsi14: number | null;
  volumeSpike: boolean;
  trendStrength: number;
}

export interface HistoricalPoint {
  date: string;
  close: number;
  volume: number;
}

export interface Headline {
  title: string;
  publishedAt?: string;
  source?: string;
}

export interface MarketResponse {
  ticker: string;
  price: number | null;
  changePercent: number | null;
  currency?: string;
  history: HistoricalPoint[];
  indicators: IndicatorSummary;
  sentiment: SentimentResult;
  insight: string;
  riskFlags: string[];
  headlines: Headline[];
  lastUpdated: string;
}

export interface PortfolioResult {
  analysis: {
    diversificationScore: number;
    concentrationRisk: number;
    sectorAllocations: Record<string, number>;
    notes: string[];
  };
  holdings: { ticker: string; weight: number; sector?: string }[];
}

export interface ChatResult {
  answer: string;
  reasoning?: string;
  sentiment?: SentimentResult;
  indicators?: IndicatorSummary;
  price?: number;
  currency?: string;
}
