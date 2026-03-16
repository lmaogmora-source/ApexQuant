const BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getMarket: (ticker: string) => request<import("../types").MarketResponse>(`/market/${ticker}`),
  analyzePortfolio: (holdings: import("../types").PortfolioResult["holdings"]) =>
    request<import("../types").PortfolioResult>(`/portfolio/analyze`, {
      method: "POST",
      body: JSON.stringify({ holdings }),
    }),
  askChat: (payload: { question: string; ticker?: string }) =>
    request<import("../types").ChatResult>(`/chat`, { method: "POST", body: JSON.stringify(payload) }),
  getProfile: () => request<any>(`/profile`),
  updateProfile: (profile: any) => request<any>(`/profile`, { method: "POST", body: JSON.stringify(profile) }),
  getPicks: () => request<any>(`/picks`),
  askPicksChat: (payload: { symbol: string; message: string; userProfile: any }) =>
    request<any>(`/picks/chat`, { method: "POST", body: JSON.stringify(payload) }),
};
