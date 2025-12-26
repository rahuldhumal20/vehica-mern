const Vehicle = require("../models/Vehicle");
const Review = require("../models/Review");

// TOP RATED VEHICLES
exports.topRatedVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .sort({ rating: -1 })
      .limit(5);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// MOST REVIEWED VEHICLES
exports.mostReviewedVehicles = async (req, res) => {
  try {
    const data = await Review.aggregate([
      { $group: { _id: "$vehicleId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CATEGORY ANALYTICS
exports.categoryAnalytics = async (req, res) => {
  try {
    const data = await Vehicle.aggregate([
      { $group: { _id: "$category", total: { $sum: 1 } } }
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
