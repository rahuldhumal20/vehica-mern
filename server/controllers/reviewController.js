const Review = require("../models/Review");
const Vehicle = require("../models/Vehicle");

// ADD REVIEW
exports.addReview = async (req, res) => {
  try {
    const { vehicleId, rating, comment } = req.body;

    const review = await Review.create({
      userId: req.user.id,
      vehicleId,
      rating,
      comment
    });


    // Recalculate average rating
    const reviews = await Review.find({ vehicleId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Vehicle.findByIdAndUpdate(vehicleId, {
      rating: avgRating.toFixed(1)
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET REVIEWS BY VEHICLE
exports.getReviewsByVehicle = async (req, res) => {
  try {
    const reviews = await Review.find({ vehicleId: req.params.vehicleId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

