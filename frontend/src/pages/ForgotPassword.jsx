import { useState } from "react";
import "./ForgotPassword.css";

function ForgotPassword({ onLogin }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to process request");
        return;
      }

      setMessage(
        "If an account exists with this email, a password reset link has been sent."
      );

      setEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">

      <div className="forgot-container">

        {/* Left Section */}
        <div className="forgot-left">

          <div className="forgot-logo">
            SR
          </div>

          <h1>Store Rating</h1>

          <p>
            Manage your account securely and
            keep your store reviews connected.
          </p>

          <div className="forgot-features">

            <div className="forgot-feature">
              <span>01</span>
              <div>
                <strong>Secure Account</strong>
                <small>Your account remains protected</small>
              </div>
            </div>

            <div className="forgot-feature">
              <span>02</span>
              <div>
                <strong>Password Recovery</strong>
                <small>Reset your password securely</small>
              </div>
            </div>

            <div className="forgot-feature">
              <span>03</span>
              <div>
                <strong>Easy Access</strong>
                <small>Get back to your account quickly</small>
              </div>
            </div>

          </div>
        </div>

        {/* Right Section */}
        <div className="forgot-right">

          <div className="forgot-header">

            <div className="forgot-label">
              PASSWORD RECOVERY
            </div>

            <h2>Forgot your password?</h2>

            <p>
              Enter your registered email address and
              we will send you a password reset link.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="forgot-input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            <button
              className="forgot-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

          </form>

          {message && (
            <div className="forgot-message success">
              {message}
            </div>
          )}

          {error && (
            <div className="forgot-message error">
              {error}
            </div>
          )}

          <div className="forgot-divider">
            <span>Secure Password Recovery</span>
          </div>

          <p className="back-login">
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

      <div className="forgot-copyright">
        © 2026 Store Rating Application. All rights reserved.
      </div>

    </div>
  );
}

export default ForgotPassword;