import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Recommendations() {
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await API.get("/recommendations");

        const list = Array.isArray(res.data) ? res.data : [];

        const groups = {};

        list.forEach((item) => {
          if (!item.vehicle) return;

          const v = item.vehicle;
          const category = v.category || "Other";

          if (!groups[category]) {
            groups[category] = [];
          }

          groups[category].push({
            ...v,
            score: item.score
          });
        });

        setGrouped(groups);
      } catch (err) {
        console.error("Recommendation fetch error:", err);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Recommended for You</h2>

      {Object.keys(grouped).length === 0 && (
        <p>No recommendations available</p>
      )}

      {Object.keys(grouped).map((category) => (
        <div key={category} className="mb-5">
          <h4 className="mb-3">{category}s</h4>

          <div className="row g-4">
            {grouped[category].map((v, idx) => (
              <div
                key={v._id || `${category}-${idx}`}
                className="col-sm-6 col-md-4 col-lg-3"
              >
                {v._id && (
                  <Link
                    to={`/vehicle/${v._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="card h-100 shadow-sm">
                      <img
                        src={v.images?.[0] || "https://via.placeholder.com/300"}
                        className="card-img-top"
                        style={{ height: "180px", objectFit: "cover" }}
                        alt={v.name}
                      />

                      <div className="card-body">
                        <h6>{v.name}</h6>

                        <p className="text-primary fw-semibold mb-1">
                          {v.price?.min && v.price?.max
                            ? `₹${v.price.min.toLocaleString()} – ₹${v.price.max.toLocaleString()}`
                            : "Price not available"}
                        </p>

                        <small className="text-muted">
                          Score: {v.score.toFixed(1)}
                        </small>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
