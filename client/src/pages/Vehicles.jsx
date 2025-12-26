import { useEffect, useState } from "react";
import API from "../api/api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    API.get("/vehicles").then(res => setVehicles(res.data));
  }, []);

  return (
    <div style={grid}>
      {vehicles.map(v => (
        <div key={v._id} style={card}>
          <img
            src={v.images[0]}
            alt={v.name}
            style={{ width: "100%", height: "180px", objectFit: "cover" }}
          />
          <h3>{v.name}</h3>
          <p>{v.brand}</p>
          <p>
            {v.price?.min && v.price?.max
              ? `₹${v.price.min.toLocaleString()} - ₹${v.price.max.toLocaleString()}`
              : "Price not available"}
          </p>


        </div>
      ))}
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "20px",
  padding: "20px"
};

const card = {
  border: "1px solid #ddd",
  padding: "10px",
  borderRadius: "6px"
};
