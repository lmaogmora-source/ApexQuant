const axios = require("axios");

async function testRecommendations() {
  const profile = {
    investmentAmount: 2888,
    holdingPeriod: "long-term",
    riskTolerance: "medium",
    preferredSectors: ["Energy", "Consumer Goods"],
    marketPreference: "large-cap"
  };

  try {
    console.log("Testing Profile Recommendations...");
    const res = await axios.post("http://localhost:4000/api/profile", profile);
    console.log("Status:", res.data.message);
    console.log("Recommendations Count:", res.data.profile.recommendations.length);
    if (res.data.profile.recommendations.length > 0) {
      console.log("Sample Recommendation:", res.data.profile.recommendations[0]);
    } else {
      console.log("Full Response:", JSON.stringify(res.data, null, 2));
    }
  } catch (err) {
    console.error("FAIL:", err.response?.data || err.message);
  }
}

testRecommendations();
