import { useState } from "react";
import "./Login.css";

function Login({ onRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Redirect according to role
      onLoginSuccess(data.user.role);

      console.log("Logged in user:", data.user);

    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server connection failed");
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* Left Side */}
        <div className="login-left">

          <div className="brand-icon">
            ★
          </div>

          <h1>
            Store Rating
          </h1>

          <p>
            Discover stores, share your experience,
            and help others make better choices.
          </p>

          <div className="features">

            <div className="feature">

              <span>★</span>

              <div>
                <strong>
                  Rate Stores
                </strong>

                <small>
                  Share your honest experience
                </small>
              </div>

            </div>

            <div className="feature">

              <span>✓</span>

              <div>
                <strong>
                  Trusted Reviews
                </strong>

                <small>
                  Find reliable customer feedback
                </small>
              </div>

            </div>

            <div className="feature">

              <span>⌕</span>

              <div>
                <strong>
                  Find Better Stores
                </strong>

                <small>
                  Discover highly rated stores
                </small>
              </div>

            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="login-right">

          <div className="login-header">

            <h2>
              Welcome Back 👋
            </h2>

            <p>
              Login to continue to your account
            </p>

          </div>

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="input-group">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <span>
                  ✉
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* Password */}
            <div className="input-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <span>
                  🔒
                </span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* Login Options */}
            <div className="login-options">

              <label className="remember">

                <input
                  type="checkbox"
                />

                Remember me

              </label>

              <button
                type="button"
                className="forgot-btn"
                onClick={() =>
                  alert(
                    "Forgot password feature coming soon!"
                  )
                }
              >
                Forgot Password?
              </button>

            </div>

            {/* Login Button */}
            <button
              className="login-button"
              type="submit"
            >
              Login
              <span>→</span>
            </button>

          </form>

          {message && (
            <div
              className={
                message
                  .toLowerCase()
                  .includes("successful")
                  ? "message success"
                  : "message error"
              }
            >
              {message}
            </div>
          )}

          <div className="divider">
            <span>
              Secure Login
            </span>
          </div>

          <p className="signup-text">

            Don't have an account?

            <span onClick={onRegister}>
              Create Account
            </span>

          </p>

        </div>

      </div>

      <div className="copyright">
        © 2026 Store Rating Application.
        All rights reserved.
      </div>

    </div>
  );
}

export default Login;