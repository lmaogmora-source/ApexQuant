export interface NewsItem {
    title: string;
    publishedAt?: string;
    source?: string;
    url?: string;
}
export declare function fetchNewsHeadlines(ticker: string): Promise<NewsItem[]>;
//# sourceMappingURL=news.d.ts.map