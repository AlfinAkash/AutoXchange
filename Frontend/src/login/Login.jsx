import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { AuthContext } from "../context/Authcontext";
import BASE_URL from "../config/Config";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        const decoded = jwtDecode(result.token);
        const extractedRole = decoded.role || "user";

        Cookies.set("token", result.token, { expires: 1 });
        Cookies.set("role", extractedRole, { expires: 1 });
        localStorage.setItem("role", extractedRole);

        login(result.token);
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4 text-center text-primary">Admin / Staff Login</h3>
      <form onSubmit={handleSubmit} className="border p-4 shadow rounded w-100">
        {error && <p className="text-danger text-center mb-3">{error}</p>}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>

        {/* ✅ Forgot password link */}
        <div className="mt-3 text-center">
          <Link to="/forgot-password" className="text-decoration-none text-primary">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
