const express = require("express");
const {
  topRatedVehicles,
  mostReviewedVehicles,
  categoryAnalytics
} = require("../controllers/analyticsController");

const { protect, adminOnly } = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/top-rated", protect, adminOnly, topRatedVehicles);
router.get("/most-reviewed", protect, adminOnly, mostReviewedVehicles);
router.get("/categories", protect, adminOnly, categoryAnalytics);

module.exports = router;
