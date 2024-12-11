import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { URL_AUTH } from "../routes/CustomAPI";
import "./ConfirmResetPassword.css";

const ConfirmResetPassword = () => {
  const { uid, token } = useParams(); // Extract uid and token from the URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!uid || !token) {
      setError("Invalid or expired reset link. Please try again.");
    }
  }, [uid, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(URL_AUTH.PasswordResetConfirmAPI, {
        uid,
        token,
        new_password: password,
      });

      setSuccessMessage(
        response.data.message || "Password reset successfully!"
      );
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || [
        "This password is too short. It must contain at least 8 characters.",
        "This password is too common.",
        "This password is entirely numeric.",
      ];
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="confirm-reset-password-container">
        <div className="confirm-reset-password-main">
          <h2>Reset Your Password</h2>
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
        <div>
          {error && (
            <div className="error-message">
              <ul>
                {Array.isArray(error) ? (
                  error.map((err, index) => <li key={index}>{err}</li>)
                ) : (
                  <li>{error}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfirmResetPassword;
