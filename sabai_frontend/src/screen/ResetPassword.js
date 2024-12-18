import React, { useState } from "react";
import axios from "axios";
import { URL_AUTH } from "../routes/CustomAPI";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await axios.post(URL_AUTH.PasswordResetAPI, { email });
      setSuccessMessage("Please check your email for the password reset link.");
      setEmail("");
    } catch (err) {
      setError(`Error: ${err.message || err.response?.data}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
