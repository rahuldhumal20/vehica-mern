const express = require("express");

const {
  addVehicle,
  getVehicles,
  getVehicleById,
  deleteVehicle,
  updateVehicle,
  getSimilarVehicles
} = require("../controllers/vehicleController");


const { protect, adminOnly } = require("../middleware/authmiddleware");

const router = express.Router();

// SIMILAR VEHICLES (MUST BE ABOVE :id)
router.get("/similar/:id", getSimilarVehicles);

// Get All
router.get("/", getVehicles);

// GET SINGLE VEHICLE
router.get("/:id", getVehicleById);


// Admin Routes
router.post("/", protect, adminOnly, addVehicle);
router.delete("/:id", protect, adminOnly, deleteVehicle);
router.put("/:id", protect, adminOnly, updateVehicle);



module.exports = router;
