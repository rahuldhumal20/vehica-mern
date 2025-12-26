import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FilterContext } from "../context/FilterContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { filters, setFilters } = useContext(FilterContext); 
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 🔹 Click category
  const goCategory = (category) => {
    setFilters({
      category,
      search: "",
      minPrice: "",
      maxPrice: ""
    });
    navigate(`/category/${category}`);
  };

  // 🔹 Apply price filter
  const applyPrice = () => {
    setFilters((prev) => ({
      ...prev,
      minPrice,
      maxPrice
    }));
    navigate(`/category/${filters.category || ""}`);
  };

  // 🔹 Search
  const doSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search
    }));
    navigate(`/category/${filters.category || ""}`);
  };

  // 🔹 Home (Vehica logo)
  const goHome = () => {
    setFilters({
      category: "",
      search: "",
      minPrice: "",
      maxPrice: ""
    });
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4">
      <button className="navbar-brand btn btn-link text-warning fw-bold" onClick={goHome}>
        Vehica
      </button>

      <div className="collapse navbar-collapse">
        {/* Categories */}
        <ul className="navbar-nav me-auto">
          {["Car", "Bike", "Scooty", "Truck"].map((c) => (
            <li key={c} className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => goCategory(c)}
              >
                {c}s
              </button>
            </li>
          ))}
        </ul>

        {/* Search */}
        <form
          className="d-flex me-3"
          onSubmit={(e) => {
            e.preventDefault();

            setFilters(prev => ({
              ...prev,
              search: prev.search.trim(),
              category: ""   // clear category
            }));

            navigate("/"); // 🔥 ALWAYS GO TO HOME
          }}
          >
          <input
            className="form-control me-2"
            placeholder="Search vehicle"
            value={filters.search}
            onChange={(e) =>
              setFilters(prev => ({
                ...prev,
                search: e.target.value
              }))
            }
          />
          <button className="btn btn-outline-light">Search</button>
        </form>


        {/* Price filter */}
        <input
          className="form-control me-2"
          style={{ width: "110px" }}
          placeholder="Min ₹"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          className="form-control me-2"
          style={{ width: "110px" }}
          placeholder="Max ₹"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button className="btn btn-outline-info me-3" onClick={applyPrice}>
          Apply
        </button>

        {/* Recommendations */}
        {user && (
          <Link to="/recommendations" className="btn btn-outline-light me-2">
            Recommendations
          </Link>
        )}


        {/* Auth */}
        {user?.role === "admin" && (
          <Link to="/admin" className="btn btn-warning me-2">
            Admin
          </Link>
        )}

        {!user ? (
          <Link to="/login" className="btn btn-success">
            Login
          </Link>
        ) : (
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
