const Vehicle = require("../models/Vehicle");

// 🔹 SCORE FUNCTION (YOUR LOGIC – FINAL)
const getScore = (v) => {
  let score = 0;

  // Rating (most important)
  if (v.rating) score += v.rating * 4;

  // Mileage
  if (v.mileage) score += v.mileage * 0.1;

  // Price affordability
  if (v.price?.min) {
    if (v.price.min < 100000) score += 3;
    else if (v.price.min < 200000) score += 2;
    else score += 1;
  }

  // Category popularity
  if (["Bike", "Car"].includes(v.category)) {
    score += 1.5;
  }

  return score;
};

// 🔹 GET RECOMMENDATIONS
exports.getRecommendations = async (req, res) => {
  try {
    // 1️⃣ Fetch all vehicles
    const vehicles = await Vehicle.find();

    if (!vehicles || vehicles.length === 0) {
      return res.json([]);
    }

    // 2️⃣ Apply score to each vehicle
    const scoredVehicles = vehicles.map((v) => ({
      vehicle: v,
      score: getScore(v)
    }));

    // 3️⃣ Sort by score (DESC)
    scoredVehicles.sort((a, b) => b.score - a.score);

    // 4️⃣ Limit results
    const topRecommendations = scoredVehicles.slice(0, 20);

    // 5️⃣ Send response
    res.json(topRecommendations);

  } catch (error) {
    console.error("❌ Recommendation error:", error);
    res.status(500).json({
      message: "Failed to fetch recommendations"
    });
  }
};
