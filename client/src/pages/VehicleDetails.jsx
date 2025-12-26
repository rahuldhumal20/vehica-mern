import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function VehicleDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch all data
  const fetchData = async () => {
    try {
      const vehicleRes = await API.get(`/vehicles/${id}`);
      setVehicle(vehicleRes.data);

      const reviewsRes = await API.get(`/reviews/${id}`);
      setReviews(reviewsRes.data || []);

      const similarRes = await API.get(`/vehicles/similar/${id}`);
      setSimilar(similarRes.data || []);
    } catch (err) {
      console.error("Vehicle details error:", err);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  // 🔹 Submit review
  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment) return alert("Please write a comment");

    try {
      setLoading(true);
      await API.post("/reviews", {
        vehicleId: id,
        rating,
        comment
      });

      setComment("");
      setRating(5);

      // Refresh reviews & rating
      fetchData();
    } catch (err) {
      alert("Failed to add review");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>{vehicle.name}</h2>

      <img
        src={vehicle.images?.[0] || "https://via.placeholder.com/400"}
        alt={vehicle.name}
        style={{ maxWidth: "400px" }}
        className="mb-3"
      />

      <p><strong>Brand:</strong> {vehicle.brand}</p>

      <p>
        <strong>Price:</strong>{" "}
        {vehicle.price?.min && vehicle.price?.max
          ? `₹${vehicle.price.min.toLocaleString()} – ₹${vehicle.price.max.toLocaleString()}`
          : "Price not available"}
      </p>

      <p><strong>Mileage:</strong> {vehicle.mileage} kmpl</p>
      <p><strong>Rating:</strong> ⭐ {vehicle.rating || "N/A"}</p>

      <hr />

      {/* 🔹 ADD REVIEW */}
      <h4>Add Review</h4>

      {!user ? (
        <p className="text-danger">Login to add a review</p>
      ) : (
        <form onSubmit={submitReview} className="mb-4">
          <select
            className="form-select mb-2"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star
              </option>
            ))}
          </select>

          <textarea
            className="form-control mb-2"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      <hr />

      {/* 🔹 SHOW REVIEWS */}
      <h4>Reviews</h4>
      {reviews.length === 0 && <p>No reviews yet</p>}

      {reviews.map((r) => (
        <div key={r._id} className="border rounded p-2 mb-2">
          <strong>{r.userId?.name || "User"}</strong>
          <p className="mb-1">⭐ {r.rating}</p>
          <p>{r.comment}</p>
        </div>
      ))}

      <hr />

      {/* 🔹 SIMILAR */}
      <h4>Similar Vehicles</h4>
      {similar.length === 0 && <p>No similar vehicles</p>}
      {similar.map((s) => (
        <p key={s._id}>{s.name}</p>
      ))}
    </div>
  );
}
