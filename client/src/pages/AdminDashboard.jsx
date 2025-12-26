import { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    name: "",
    brand: "",
    category: "Car",
    minPrice: "",
    maxPrice: "",
    mileage: "",
    fuelType: "Petrol",
    image: ""
  };

  const [form, setForm] = useState(emptyForm);

  const loadVehicles = async () => {
    const res = await API.get("/vehicles");
    setVehicles(res.data || []);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ADD / UPDATE
  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: {
        min: Number(form.minPrice) || 0,
        max: Number(form.maxPrice) || 0
      },
      mileage: Number(form.mileage) || 0,
      fuelType: form.fuelType,
      images: form.image ? [form.image] : []
    };

    if (editId) {
      await API.put(`/vehicles/${editId}`, payload);
    } else {
      await API.post("/vehicles", payload);
    }

    setEditId(null);
    setForm(emptyForm);
    loadVehicles();
  };

  // EDIT (SAFE)
  const editVehicle = (v) => {
    setEditId(v._id);

    setForm({
      name: v.name || "",
      brand: v.brand || "",
      category: v.category || "Car",
      minPrice: v.price?.min ?? "",
      maxPrice: v.price?.max ?? "",
      mileage: v.mileage ?? "",
      fuelType: v.fuelType || "Petrol",
      image: v.images?.[0] || ""
    });
  };

  // DELETE
  const deleteVehicle = async (id) => {
    if (window.confirm("Delete this vehicle?")) {
      await API.delete(`/vehicles/${id}`);
      loadVehicles();
    }
  };

  //Validation

  const validateForm = () => {
  if (!form.name || !form.brand) {
    alert("Name and Brand are required");
    return false;
  }

  if (Number(form.minPrice) <= 0 || Number(form.maxPrice) <= 0) {
    alert("Price must be positive numbers");
    return false;
  }

  if (Number(form.minPrice) > Number(form.maxPrice)) {
    alert("Min price cannot be greater than Max price");
    return false;
  }

  if (Number(form.mileage) <= 0) {
    alert("Mileage must be a positive number");
    return false;
  }

  if (!form.image.startsWith("http")) {
    alert("Image must be a valid URL");
    return false;
  }

  return true;
  };


  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {/* FORM */}
      <form onSubmit={submit} style={styles.form}>
        <h3>{editId ? "Edit Vehicle" : "Add Vehicle"}</h3>

        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={form.minPrice}
          onChange={handleChange}
          min="0"
          required
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={form.maxPrice}
          onChange={handleChange}
          min="0"
          required
        />
        <input
          type="number"
          name="mileage"
          placeholder="Mileage"
          value={form.mileage}
          onChange={handleChange}
          min="0"
          required
        />        
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />

        <select name="category" value={form.category} onChange={handleChange}>
          <option>Car</option>
          <option>Bike</option>
          <option>Scooty</option>
          <option>Truck</option>
        </select>

        <select name="fuelType" value={form.fuelType} onChange={handleChange}>
          <option>Petrol</option>
          <option>Diesel</option>
          <option>Electric</option>
        </select>

        <button>{editId ? "Update Vehicle" : "Add Vehicle"}</button>
      </form>

      {/* VEHICLE GRID */}
      <h3 style={{ marginTop: "40px" }}>All Vehicles</h3>

      <div style={styles.grid}>
        {vehicles.map(v => (
          <div key={v._id} style={styles.card}>
            <img
              src={v.images?.[0] || "https://via.placeholder.com/300"}
              alt={v.name}
              style={styles.image}
            />

            <h4>{v.name}</h4>
            <p>{v.brand}</p>

            <p>
              {v.price?.min && v.price?.max
                ? `₹${v.price.min.toLocaleString()} - ₹${v.price.max.toLocaleString()}`
                : "Price not available"}
            </p>

            <div style={styles.actions}>
              <button onClick={() => editVehicle(v)}>Edit</button>
              <button onClick={() => deleteVehicle(v._id)} style={{ color: "red" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  form: {
    maxWidth: "450px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px"
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "10px"
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  }
};
