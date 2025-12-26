const express = require("express");
const { addReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/authmiddleware");
const { getReviewsByVehicle } = require("../controllers/reviewController");

const router = express.Router();

router.post("/", protect, addReview);

// GET reviews of a vehicle
router.get("/:vehicleId", getReviewsByVehicle);

module.exports = router;
