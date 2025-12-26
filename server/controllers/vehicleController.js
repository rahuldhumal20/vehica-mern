const Vehicle = require("../models/Vehicle");

// ADD VEHICLE (ADMIN)
exports.addVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL / FILTER VEHICLES (USER)
exports.getVehicles = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;

    let conditions = [];

    // CATEGORY FILTER
    if (category) {
      conditions.push({ category });
    }

    // PRICE RANGE FILTER (OVERLAP)
    if (minPrice || maxPrice) {
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || Number.MAX_SAFE_INTEGER;

      conditions.push(
        { "price.min": { $lte: max } },
        { "price.max": { $gte: min } }
      );
    }

    // SEARCH FILTER (MULTI-WORD SAFE)
    if (search) {
      const regex = search
        .trim()
        .split(/\s+/)
        .join(".*"); // Hero Splendor → Hero.*Splendor

      conditions.push({
        $or: [
          { name: { $regex: regex, $options: "i" } },
          { brand: { $regex: regex, $options: "i" } }
        ]
      });
    }

    const query = conditions.length ? { $and: conditions } : {};

    console.log("FINAL MONGO QUERY =", JSON.stringify(query, null, 2));

    const vehicles = await Vehicle.find(query);
    res.json(vehicles);

  } catch (error) {
    console.error("GET VEHICLES ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE VEHICLE
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    res.json(vehicle);
  } catch (error) {
    res.status(404).json({ message: "Vehicle not found" });
  }
};

// DELETE VEHICLE (ADMIN)
exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE VEHICLE (ADMIN)
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SIMILAR VEHICLES
exports.getSimilarVehicles = async (req, res) => {
  try {
    const current = await Vehicle.findById(req.params.id);

    if (!current) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const similar = await Vehicle.find({
      _id: { $ne: current._id },
      category: current.category,
      fuelType: current.fuelType,
      "price.min": { $lte: current.price.max },
      "price.max": { $gte: current.price.min }
    }).limit(4);

    res.json(similar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
