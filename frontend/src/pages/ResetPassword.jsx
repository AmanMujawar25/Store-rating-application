import { useState } from "react";
import { useParams } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword({ onLogin }) {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password.length < 8 || password.length > 16) {
      setError("Password must be between 8 and 16 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to reset password."
        );
        return;
      }

      setMessage("Password reset successful.");

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Reset password error:", error);

      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">

      <div className="reset-container">

        {/* Left Section */}
        <div className="reset-left">

          <div className="reset-logo">
            SR
          </div>

          <h1>Store Rating</h1>

          <p>
            Securely update your password and
            continue using your account.
          </p>

          <div className="reset-features">

            <div className="reset-feature">
              <span>01</span>

              <div>
                <strong>Secure Reset</strong>
                <small>
                  Create a new account password
                </small>
              </div>
            </div>

            <div className="reset-feature">
              <span>02</span>

              <div>
                <strong>Password Protection</strong>
                <small>
                  Keep your account protected
                </small>
              </div>
            </div>

            <div className="reset-feature">
              <span>03</span>

              <div>
                <strong>Quick Access</strong>
                <small>
                  Login with your new password
                </small>
              </div>
            </div>

          </div>

        </div>

        {/* Right Section */}
        <div className="reset-right">

          <div className="reset-header">

            <div className="reset-label">
              PASSWORD RESET
            </div>

            <h2>Set a new password</h2>

            <p>
              Create a new password for your
              Store Rating account.
            </p>

          </div>

          <form onSubmit={handleResetPassword}>

            {/* New Password */}
            <div className="reset-input-group">

              <div className="reset-label-row">

                <label htmlFor="password">
                  New Password
                </label>

                <span>
                  8–16 characters
                </span>

              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

            {/* Confirm Password */}
            <div className="reset-input-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

            </div>

            {/* Password Requirements */}
            <div className="password-requirements">

              <p>Password requirements:</p>

              <span>
                Minimum 8 characters
              </span>

              <span>
                Maximum 16 characters
              </span>

              <span>
                Both passwords must match
              </span>

            </div>

            {/* Reset Button */}
            <button
              className="reset-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Updating Password..."
                : "Update Password"}
            </button>

          </form>

          {/* Success Message */}
          {message && (
            <div className="reset-message reset-success">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="reset-message reset-error">
              {error}
            </div>
          )}

          <div className="reset-divider">
            <span>Secure Password Recovery</span>
          </div>

          <p className="reset-login-text">
            Remember your password?

            <button
              type="button"
              onClick={onLogin}
            >
              Back to Login
            </button>
          </p>

        </div>
      </div>

      <div className="reset-copyright">
        © 2026 Store Rating Application. All rights reserved.
      </div>

    </div>
  );
}

export default ResetPassword;