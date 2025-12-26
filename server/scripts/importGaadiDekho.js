require("dotenv").config();
const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const gaadiDekhoData = require("./gaadiDekhoData.json");

// Normalize category names
const normalizeCategory = (cat = "") => {
  const c = cat.toLowerCase();

  if (c.includes("bike")) return "Bike";
  if (c.includes("car")) return "Car";
  if (c.includes("scooter") || c.includes("scooty")) return "Scooty";
  if (c.includes("truck")) return "Truck";

  // 🔥 fallback: default to Bike (most GaadiDekho data)
  return "Bike";
};


// Extract brand from vehicle name
const extractBrand = (name = "") => {
  return name.split(" ")[0];
};

// Transform GaadiDekho → Vehica
const transformVehicle = (item) => ({
  name: item.name,
  brand: extractBrand(item.name),
  category: normalizeCategory(item.category),
  price: {
    min: Number(item.priceMin) || 0,
    max: Number(item.priceMax) || 0
  },
  mileage: Number(item.mileage) || 0,
  fuelType: "Petrol", // default
  rating: Number(item.averageRating) || 0,
  images: item.image ? [item.image] : [],
  engineCapacity: item.engineCapacity,
  transmission: item.transmission,
  kerbWeight: item.kerbWeight
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // ⚠️ Optional: clear old Vehica vehicles
    await Vehicle.deleteMany();

    const transformed = gaadiDekhoData.map(transformVehicle);

    await Vehicle.insertMany(transformed);

    console.log(`✅ Imported ${transformed.length} vehicles into Vehica`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Import failed:", err);
    process.exit(1);
  }
})();
