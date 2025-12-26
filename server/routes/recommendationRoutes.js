const express = require("express");
const { getRecommendations } = require("../controllers/recommendationController");

const router = express.Router();

router.get("/", getRecommendations);

module.exports = router;
