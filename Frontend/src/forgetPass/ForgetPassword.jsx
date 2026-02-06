import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate
import BASE_URL from "../config/Config"; // ✅ Adjust path if needed

const ForgotPassword = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });

    // ✅ Simple Gmail validation
    if (!email || !email.endsWith("@gmail.com")) {
      setStatus({ message: "Please enter a valid Mmail address", type: "danger" });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus({
          message: result.message || "OTP sent successfully to your Gmail.",
          type: "success",
        });

        // ✅ Redirect to reset-password page with email after short delay
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else {
        setStatus({
          message: result.message || "Email not found. Please try again.",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error while sending OTP:", error);
      setStatus({
        message: "Something went wrong. Please try again later.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4 text-primary">Forgot Password</h3>
      <form onSubmit={handleSendOtp} className="border p-4 shadow rounded">
        {/* ✅ Alert message */}
        {status.message && (
          <div className={`alert alert-${status.type} text-center`} role="alert">
            {status.message}
          </div>
        )}

        {/* ✅ Gmail input */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Gmail Address
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* ✅ Submit button */}
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
