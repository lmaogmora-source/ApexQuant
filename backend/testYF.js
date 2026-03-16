const yfModules = require("yahoo-finance2");
console.log("Keys:", Object.keys(yfModules));

async function run() {
  try {
    console.log("\nAttempt 1: new require('yahoo-finance2').default()");
    const YF1 = require("yahoo-finance2").default;
    const instance1 = new YF1();
    const q1 = await instance1.quote("AAPL");
    console.log("Success 1:", q1.symbol, q1.regularMarketPrice);
  } catch (e) {
    console.log("Fail 1:", e.message);
  }

  try {
    console.log("\nAttempt 2: require('yahoo-finance2').default.quote()");
    const YF2 = require("yahoo-finance2").default;
    const q2 = await YF2.quote("AAPL");
    console.log("Success 2:", q2.symbol, q2.regularMarketPrice);
  } catch (e) {
    console.log("Fail 2:", e.message);
  }

  try {
    console.log("\nAttempt 3: require('yahoo-finance2').quote()");
    const YF3 = require("yahoo-finance2");
    const q3 = await YF3.quote("AAPL");
    console.log("Success 3:", q3.symbol, q3.regularMarketPrice);
  } catch (e) {
    console.log("Fail 3:", e.message);
  }
}

run();
