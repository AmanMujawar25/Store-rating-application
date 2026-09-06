import { useState } from "react";
import "./CreateUser.css";

function CreateUser({ setAdminPage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "NORMAL_USER",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create user");
        return;
      }

      setMessage("User created successfully!");

      setFormData({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "NORMAL_USER",
      });
    } catch (error) {
      console.error("Create user error:", error);
      setMessage("Server connection failed");
    }
  };

  return (
    <div className="create-user-page">
      {/* Header */}

      <button onClick={() => setAdminPage("dashboard")}>
        ← Back to Dashboard
      </button>
      <div className="create-user-header">
        <div>
          <p className="page-label">USER MANAGEMENT</p>
          <h1>Create New User</h1>
          <p className="page-description">
            Add a new user to the Store Rating platform.
          </p>
        </div>

        <div className="header-icon">👤</div>
      </div>

      {/* Main Card */}
      <div className="create-user-card">
        <div className="form-title">
          <div className="form-icon">+</div>

          <div>
            <h2>User Information</h2>
            <p>Enter the details of the new user</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name + Email */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>

              <div className="input-box">
                <span>👤</span>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>

              <div className="input-box">
                <span>✉</span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Address</label>

            <div className="input-box textarea-box">
              <span>📍</span>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address"
                required
              />
            </div>
          </div>

          {/* Password + Role */}
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>

              <div className="input-box">
                <span>🔒</span>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>User Role</label>

              <div className="input-box">
                <span>⚙</span>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="NORMAL_USER">Normal User</option>

                  <option value="STORE_OWNER">Store Owner</option>

                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Role Information */}
          <div className="role-info">
            <div className="info-icon">i</div>

            <div>
              <strong>Role Information</strong>

              <p>
                Normal users can rate stores. Store owners can manage their
                stores, while administrators have full platform access.
              </p>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={
                message.toLowerCase().includes("success")
                  ? "create-message success-message"
                  : "create-message error-message"
              }
            >
              <span>
                {message.toLowerCase().includes("success") ? "✓" : "⚠"}
              </span>

              {message}
            </div>
          )}

          {/* Button */}
          <div className="form-actions">
            <button
              type="button"
              className="clear-button"
              onClick={() =>
                setFormData({
                  name: "",
                  email: "",
                  address: "",
                  password: "",
                  role: "NORMAL_USER",
                })
              }
            >
              Clear
            </button>

            <button type="submit" className="create-user-button">
              <span>+</span>
              Create User
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="create-user-footer">
        Store Rating Admin Panel
        <span>•</span>
        User Management
      </div>
    </div>
  );
}

export default CreateUser;
