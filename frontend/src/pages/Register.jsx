import { useState } from "react";
import "./Register.css";

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Registration successful!");

      setFormData({
        name: "",
        email: "",
        address: "",
        password: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Server connection failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side */}
        <div className="register-left">
          <div className="register-brand-icon">★</div>

          <h1>Store Rating</h1>

          <p>
            Join our community and discover, rate and review your favorite
            stores.
          </p>

          <div className="register-features">
            <div className="register-feature">
              <span>★</span>
              <div>
                <strong>Rate Stores</strong>
                <small>Share your shopping experience</small>
              </div>
            </div>

            <div className="register-feature">
              <span>✓</span>
              <div>
                <strong>Trusted Reviews</strong>
                <small>Help others choose better stores</small>
              </div>
            </div>

            <div className="register-feature">
              <span>⌕</span>
              <div>
                <strong>Discover Stores</strong>
                <small>Find highly rated stores around you</small>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="register-right">
          <div className="register-header">
            <h2>Create Account </h2>
            <p>Register to get started with Store Rating</p>
          </div>

          <form onSubmit={handleRegister}>
            {/* Name */}
            <div className="register-input-group">
              <label>Full Name</label>

              <div className="register-input-wrapper">
                <span></span>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="register-input-group">
              <label>Email Address</label>

              <div className="register-input-wrapper">
                <span>✉</span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="register-input-group">
              <label>Address</label>

              <div className="register-input-wrapper register-textarea-wrapper">
                <span></span>

                <textarea
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="register-input-group">
              <label>Password</label>

              <div className="register-input-wrapper">
                <span></span>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button className="register-button" type="submit">
              Create Account
              <span>→</span>
            </button>
          </form>

          {message && (
            <div
              className={
                message.toLowerCase().includes("successful")
                  ? "register-message register-success"
                  : "register-message register-error"
              }
            >
              {message}
            </div>
          )}

          <div className="register-divider">Secure Registration</div>

          <p className="login-link-text">
            Already have an account?
            <span onClick={onLogin}>Login</span>
          </p>
        </div>
      </div>

      <div className="register-copyright">
        © 2026 Store Rating Application. All rights reserved.
      </div>
    </div>
  );
}

export default Register;
