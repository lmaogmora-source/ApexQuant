import { IndicatorSummary } from "../types";
interface HistoricalPoint {
    date: Date;
    close: number;
    volume: number;
}
export declare function fetchHistorical(ticker: string, days?: number): Promise<HistoricalPoint[]>;
export declare function fetchQuote(ticker: string): Promise<{
    price: any;
    changePercent: any;
    currency: any;
}>;
export declare function computeIndicators(data: HistoricalPoint[]): IndicatorSummary;
export declare function latestClose(data: HistoricalPoint[]): number | null;
export type { HistoricalPoint };
//# sourceMappingURL=marketData.d.ts.map