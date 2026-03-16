import { IndicatorSummary, SentimentResult } from "../types";
interface InsightInput {
    ticker: string;
    indicators: IndicatorSummary;
    sentiment: SentimentResult;
}
export declare function generateInsight({ ticker, indicators, sentiment, }: InsightInput): string;
export {};
//# sourceMappingURL=insightGenerator.d.ts.map