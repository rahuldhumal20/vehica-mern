import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import { FilterContext } from "../context/FilterContext";

export default function CategoryVehicles() {
  const { category } = useParams();
  const { filters } = useContext(FilterContext);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        let url = "/vehicles"; // Axios baseURL already has /api

        const activeCategory = filters.category || category;
        if (activeCategory) {
          url += `?category=${encodeURIComponent(activeCategory)}`;
        }

        if (filters.search) {
          url += `${url.includes("?") ? "&" : "?"}search=${encodeURIComponent(filters.search)}`;
        }

        if (filters.minPrice) {
          url += `${url.includes("?") ? "&" : "?"}minPrice=${filters.minPrice}`;
        }

        if (filters.maxPrice) {
          url += `${url.includes("?") ? "&" : "?"}maxPrice=${filters.maxPrice}`;
        }

        const res = await API.get(url);
        setVehicles(res.data || []);
      } catch (err) {
        console.error("Fetch vehicles error:", err);
        setVehicles([]);
      }
    };

    fetchVehicles();
  }, [category, filters]);

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {vehicles.length === 0 && <p>No vehicles found</p>}

        {vehicles.map((v) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={v._id}>
            <Link to={`/vehicle/${v._id}`} style={{ textDecoration: "none" }}>
              <div className="card h-100 shadow-sm">
                <img
                  src={v.images?.[0] || "https://via.placeholder.com/300"}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                  alt={v.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{v.name}</h5>
                  <p className="text-muted mb-1">{v.brand}</p>
                  <p className="text-primary fw-semibold">
                    {v.price?.min && v.price?.max
                      ? `₹${v.price.min.toLocaleString()} - ₹${v.price.max.toLocaleString()}`
                      : "Price not available"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
