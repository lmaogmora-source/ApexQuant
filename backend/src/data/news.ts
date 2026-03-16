import axios from "axios";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export interface NewsItem {
  title: string;
  publishedAt?: string;
  source?: string;
  url?: string;
}

// Lightweight news fetcher; falls back to mocked headlines if no key is provided.
export async function fetchNewsHeadlines(ticker: string): Promise<NewsItem[]> {
  if (!NEWS_API_KEY) {
    return buildFallback(ticker);
  }

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      ticker
    )}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;
    const { data } = await axios.get(url);
    return (data?.articles ?? []).map((a: any) => ({
      title: a.title,
      publishedAt: a.publishedAt,
      source: a.source?.name,
      url: a.url,
    }));
  } catch {
    return buildFallback(ticker);
  }
}

function buildFallback(ticker: string): NewsItem[] {
  return [
    {
      title: `${ticker} posts solid earnings; analysts raise guidance`,
      publishedAt: new Date().toISOString(),
      source: "MockWire",
    },
    {
      title: `${ticker} trading volume surges on market open`,
      publishedAt: new Date().toISOString(),
      source: "StreetPulse",
    },
  ];
}
