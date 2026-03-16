// Quick smoke test to verify market data fetch works without starting server.
const { YahooFinance } = require("yahoo-finance2");
const yahooFinance = new YahooFinance();
const { fetchQuote, fetchHistorical } = require("./dist/data/marketData");

async function run() {
  try {
    const q = await fetchQuote("AAPL");
    console.log("AAPL quote:", q);
    
    const h = await fetchHistorical("AAPL");
    console.log("AAPL history length:", h.length);
  } catch (err) {
    console.error("Caught expected/unexpected error:", err);
  }
}

run();
