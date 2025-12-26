import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";



export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      login(res.data);
      navigate("/"); // redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <div className="card shadow-lg" style={{ width: "380px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Sign In</h3>

          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* SUBMIT */}
            <button type="submit" className="btn btn-primary w-100">
              Sign In
            </button>
            <p className="text-center mt-3">
              New user?{" "}
              <Link to="/register" className="text-decoration-none">
                Create an account
              </Link>
            </p>

          </form>

          <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: "14px" }}>
            Vehica – Smart Vehicle Recommendation System
          </p>
        </div>
      </div>
    </div>
  );
}
