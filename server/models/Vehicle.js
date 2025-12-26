const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Car", "Bike", "Scooty", "Truck"],
    required: true
  },
  price: {
  min: { type: Number, default: 0 },
  max: { type: Number, default: 0 }
  },
  mileage: Number,
  fuelType: {
    type: String,
    enum: ["Petrol", "Diesel", "Electric", "Hybrid"]
  },
  rating: {
    type: Number,
    default: 0
  },
  images: [String],
  specs: {
    engine: String,
    transmission: String,
    seatingCapacity: Number
  }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
