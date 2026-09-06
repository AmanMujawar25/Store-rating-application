import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ setAdminPage, onLogout }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    totalOwners: 0,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to load dashboard");
          return;
        }

        setStats({
          totalUsers: data.totalUsers || 0,
          totalStores: data.totalStores || 0,
          totalRatings: data.totalRatings || 0,
          totalOwners: data.totalOwners || 0,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
        setMessage("Server connection failed");
      }
    };

    fetchStats();
  }, []);


  

  

  return (
    <div className="admin-dashboard">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          <div className="admin-logo-icon">★</div>

          <div>
            <h2>Store Rating</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-nav">

          <a
            className="nav-item active"
            onClick={() => setAdminPage("dashboard")}
          >
            <span>▦</span>
            Dashboard
          </a>

          <a
            className="nav-item"
            onClick={() => setAdminPage("users")}
          >
            <span>👥</span>
            Users
          </a>

          <a
            className="nav-item"
            onClick={() => setAdminPage("stores")}
          >
            <span>🏪</span>
            Stores
          </a>

          <a
            className="nav-item"
            onClick={() => setAdminPage("ratings")}
          >
            <span>★</span>
            Ratings
          </a>

          <a
            className="nav-item"
            onClick={() => setAdminPage("reports")}
          >
            <span>📊</span>
            Reports
          </a>

          <a
            className="nav-item"
            onClick={() => setAdminPage("create-user")}
          >
            <span>➕</span>
            Add User
          </a>

          <a
            className="nav-item"
            onClick={() => setAdminPage("create-store")}
          >
            <span>➕</span>
            Add Store
          </a>

        </nav>

        <div className="sidebar-bottom">

          <a
            className="nav-item"
            onClick={() => setAdminPage("settings")}
          >
            <span>⚙</span>
            Settings
          </a>

          <button
    className="logout-btn"
    onClick={onLogout}
>
    <span>↪</span>
    Logout
</button>

        </div>

      </aside>

      {/* Main Content */}
      <main className="admin-main">

        {/* Header */}
        <header className="admin-header">

          <div>
            <p className="header-small">
              ADMINISTRATION
            </p>

            <h1>
              Dashboard
            </h1>

            <p className="header-subtitle">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>

          <div className="admin-profile">

            <div className="notification">
              🔔
            </div>

            <div className="profile-avatar">
              A
            </div>

            <div className="profile-info">
              <strong>
                Administrator
              </strong>

              <span>
                Super Admin
              </span>
            </div>

          </div>

        </header>

        {/* Error Message */}
        {message && (
          <div className="dashboard-message">
            ⚠ {message}
          </div>
        )}

        {/* Statistics */}
        <section className="stats-grid">

          {/* Users */}
          <div className="stat-card users-card">

            <div className="stat-top">

              <div className="stat-icon">
                👥
              </div>

              <span className="stat-label">
                USERS
              </span>

            </div>

            <h2>
              {stats.totalUsers}
            </h2>

            <p>
              Total registered users
            </p>

            <div className="stat-footer">
              <span>●</span>
              Active platform users
            </div>

          </div>

          {/* Stores */}
          <div className="stat-card stores-card">

            <div className="stat-top">

              <div className="stat-icon">
                🏪
              </div>

              <span className="stat-label">
                STORES
              </span>

            </div>

            <h2>
              {stats.totalStores}
            </h2>

            <p>
              Total registered stores
            </p>

            <div className="stat-footer">
              <span>●</span>
              Stores on platform
            </div>

          </div>

          {/* Ratings */}
          <div className="stat-card ratings-card">

            <div className="stat-top">

              <div className="stat-icon">
                ★
              </div>

              <span className="stat-label">
                RATINGS
              </span>

            </div>

            <h2>
              {stats.totalRatings}
            </h2>

            <p>
              Total customer ratings
            </p>

            <div className="stat-footer">
              <span>●</span>
              Reviews submitted
            </div>

          </div>

          {/* Owners */}
          <div className="stat-card owners-card">

            <div className="stat-top">

              <div className="stat-icon">
                👔
              </div>

              <span className="stat-label">
                OWNERS
              </span>

            </div>

            <h2>
              {stats.totalOwners}
            </h2>

            <p>
              Registered store owners
            </p>

            <div className="stat-footer">
              <span>●</span>
              Store managers
            </div>

          </div>

        </section>

        {/* Bottom Section */}
        <section className="dashboard-grid">

          {/* Platform Overview */}
          <div className="dashboard-panel">

            <div className="panel-header">

              <div>
                <h3>
                  Platform Overview
                </h3>

                <p>
                  Current system statistics
                </p>
              </div>

              <button className="view-btn">
                View Details →
              </button>

            </div>

            <div className="overview-list">

              <div className="overview-item">

                <div className="overview-icon">
                  👥
                </div>

                <div>
                  <strong>
                    Registered Users
                  </strong>

                  <span>
                    Users using the platform
                  </span>
                </div>

                <b>
                  {stats.totalUsers}
                </b>

              </div>

              <div className="overview-item">

                <div className="overview-icon">
                  🏪
                </div>

                <div>
                  <strong>
                    Available Stores
                  </strong>

                  <span>
                    Stores registered in system
                  </span>
                </div>

                <b>
                  {stats.totalStores}
                </b>

              </div>

              <div className="overview-item">

                <div className="overview-icon">
                  ★
                </div>

                <div>
                  <strong>
                    Customer Ratings
                  </strong>

                  <span>
                    Total ratings submitted
                  </span>
                </div>

                <b>
                  {stats.totalRatings}
                </b>

              </div>

              <div className="overview-item">

                <div className="overview-icon">
                  👔
                </div>

                <div>
                  <strong>
                    Store Owners
                  </strong>

                  <span>
                    Registered store owners
                  </span>
                </div>

                <b>
                  {stats.totalOwners}
                </b>

              </div>

            </div>

          </div>

          {/* Quick Actions */}
          <div className="dashboard-panel quick-panel">

            <div className="panel-header">

              <div>
                <h3>
                  Quick Actions
                </h3>

                <p>
                  Manage your platform
                </p>
              </div>

            </div>

            <button
              className="quick-action"
              onClick={() => setAdminPage("create-user")}
            >
              <span>➕</span>

              <div>
                <strong>
                  Add New User
                </strong>

                <small>
                  Create a new platform user
                </small>
              </div>

              <b>
                →
              </b>
            </button>

            <button
              className="quick-action"
              onClick={() => setAdminPage("users")}
            >
              <span>👥</span>

              <div>
                <strong>
                  Manage Users
                </strong>

                <small>
                  View and manage registered users
                </small>
              </div>

              <b>
                →
              </b>
            </button>

            <button
              className="quick-action"
              onClick={() => setAdminPage("create-store")}
            >
              <span>🏪</span>

              <div>
                <strong>
                  Add New Store
                </strong>

                <small>
                  Register a new store
                </small>
              </div>

              <b>
                →
              </b>
            </button>

            <button
              className="quick-action"
              onClick={() => setAdminPage("stores")}
            >
              <span>🏪</span>

              <div>
                <strong>
                  Manage Stores
                </strong>

                <small>
                  View registered stores
                </small>
              </div>

              <b>
                →
              </b>
            </button>

            <button
              className="quick-action"
              onClick={() => setAdminPage("ratings")}
            >
              <span>★</span>

              <div>
                <strong>
                  View Ratings
                </strong>

                <small>
                  Monitor customer reviews
                </small>
              </div>

              <b>
                →
              </b>
            </button>

            <button
              className="quick-action"
              onClick={() => setAdminPage("reports")}
            >
              <span>📊</span>

              <div>
                <strong>
                  Generate Reports
                </strong>

                <small>
                  View platform reports
                </small>
              </div>

              <b>
                →
              </b>
            </button>

          </div>

        </section>

        {/* Footer */}
        <footer className="admin-footer">

          © 2026 Store Rating Application

          <span>•</span>

          Admin Dashboard

        </footer>

      </main>

    </div>
  );
}

export default AdminDashboard;