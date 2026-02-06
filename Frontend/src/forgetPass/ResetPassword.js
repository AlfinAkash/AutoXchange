import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config/Config";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });

    if (!otp || !newPassword) {
      setStatus({ message: "Enter both OTP and new password", type: "danger" });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ message: "Password must be at least 6 characters", type: "danger" });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, newPassword }), // ✅ only OTP and newPassword
      });

      const result = await res.json();

      if (res.ok) {
        setStatus({
          message: "✅ Password reset successful. Redirecting to login...",
          type: "success",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setStatus({
          message: result.message || "Failed to reset password. Invalid OTP?",
          type: "danger",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({ message: "Server error. Try again later.", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4 text-primary">Reset Password</h3>

      <form onSubmit={handleSubmit} className="border p-4 shadow rounded">
        {status.message && (
          <div className={`alert alert-${status.type} text-center`} role="alert">
            {status.message}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Enter OTP</label>
          <input
            type="text"
            className="form-control"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
