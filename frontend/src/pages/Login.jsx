import { useState } from "react";
import "./Login.css";

function Login({
  onRegister,
  onLoginSuccess,
  onForgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

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
        setMessage(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Login successful:", data.user);

      if (onLoginSuccess) {
        onLoginSuccess(data.user.role);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert("Forgot password feature is coming soon.");
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* Left Section */}
        <div className="login-left">

          <div className="brand-icon">
            ★
          </div>

          <h1>Store Rating</h1>

          <p>
            Discover stores, share your experience,
            and help others make better choices.
          </p>

          <div className="features">

            <div className="feature">
              <span>1</span>

              <div>
                <strong>Rate Stores</strong>
                <small>Share your experience</small>
              </div>
            </div>

            <div className="feature">
              <span>2</span>

              <div>
                <strong>Trusted Reviews</strong>
                <small>Find customer feedback</small>
              </div>
            </div>

            <div className="feature">
              <span>3</span>

              <div>
                <strong>Find Better Stores</strong>
                <small>Discover highly rated stores</small>
              </div>
            </div>

          </div>
        </div>

        {/* Right Section */}
        <div className="login-right">

          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Login to continue to your account</p>
          </div>

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">

                <span>Email</span>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>

            </div>

            {/* Password */}
            <div className="input-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <span>Password</span>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

              </div>

            </div>

            {/* Login Options */}
            <div className="login-options">

              <label className="remember">

                <input type="checkbox" />

                Remember me

              </label>

              <button
  type="button"
  className="forgot-btn"
  onClick={onForgotPassword}
>
  Forgot Password?
</button>

            </div>

            {/* Login Button */}
            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Message */}
          {message && (
            <div className="message error">
              {message}
            </div>
          )}

          <div className="divider">
            <span>Secure Login</span>
          </div>

          <p className="signup-text">
            Don't have an account?{" "}
            <span onClick={onRegister}>
              Create Account
            </span>
          </p>

        </div>
      </div>

      <div className="copyright">
        © 2026 Store Rating Application. All rights reserved.
      </div>

    </div>
  );
}

export default Login;