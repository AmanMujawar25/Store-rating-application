import { useEffect, useState } from "react";
import "./OwnerDashboard.css";

function OwnerDashboard({ onLogout }) {
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOwnerDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/owner/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load owner dashboard");
        return;
      }

      setStores(data.stores || []);
      setMessage("");
    } catch (error) {
      console.error("Owner dashboard error:", error);
      setMessage("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerDashboard();
  }, []);

  const owner = JSON.parse(localStorage.getItem("user") || "{}");

  const totalRatings = stores.reduce(
    (total, store) => total + Number(store.total_ratings || 0),
    0
  );

  const averageRating =
    stores.length > 0
      ? (
          stores.reduce(
            (total, store) =>
              total + Number(store.average_rating || 0),
            0
          ) / stores.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="owner-page">

      {/* SIDEBAR */}
      <aside className="owner-sidebar">

        <div className="owner-logo">
          <div className="owner-logo-icon">★</div>

          <div>
            <h2>Store Rating</h2>
            <span>Owner Panel</span>
          </div>
        </div>

        <nav className="owner-nav">

          <div className="owner-nav-item active">
            <span>▣</span>
            Dashboard
          </div>

          <div className="owner-nav-item">
            <span>🏪</span>
            My Stores
          </div>

          <div className="owner-nav-item">
            <span>⭐</span>
            Customer Ratings
          </div>

          <div className="owner-nav-item">
            <span>⚙</span>
            Settings
          </div>

        </nav>

        <button
          className="owner-logout"
          onClick={onLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </aside>

      {/* MAIN */}
      <main className="owner-main">

        {/* HEADER */}
        <header className="owner-header">

          <div>
            <span className="owner-label">
              STORE OWNER
            </span>

            <h1>Owner Dashboard</h1>

            <p>
              Manage your stores and monitor customer ratings.
            </p>
          </div>

          <div className="owner-profile">

            <div className="owner-avatar">
              {(owner.name || "O").charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{owner.name || "Store Owner"}</strong>
              <span>{owner.email || "Owner Account"}</span>
            </div>

          </div>

        </header>

        {/* WELCOME */}
        <section className="owner-welcome">

          <div>
            <span>WELCOME BACK 👋</span>

            <h2>
              Hello, {owner.name || "Store Owner"}!
            </h2>

            <p>
              Here's an overview of your stores and customer feedback.
            </p>
          </div>

          <div className="welcome-icon">
            🏪
          </div>

        </section>

        {/* STATS */}
        <section className="owner-stats">

          <div className="owner-stat-card">
            <div className="stat-icon purple">
              🏪
            </div>

            <div>
              <span>My Stores</span>
              <strong>{stores.length}</strong>
            </div>
          </div>

          <div className="owner-stat-card">
            <div className="stat-icon yellow">
              ⭐
            </div>

            <div>
              <span>Average Rating</span>
              <strong>{averageRating}</strong>
            </div>
          </div>

          <div className="owner-stat-card">
            <div className="stat-icon blue">
              👥
            </div>

            <div>
              <span>Total Ratings</span>
              <strong>{totalRatings}</strong>
            </div>
          </div>

          <div className="owner-stat-card">
            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <span>Account Status</span>
              <strong>Active</strong>
            </div>
          </div>

        </section>

        {/* MESSAGE */}
        {message && (
          <div className="owner-message error">
            ⚠ {message}
          </div>
        )}

        {/* CONTENT */}
        <section className="owner-content">

          <div className="section-heading">
            <div>
              <span>YOUR BUSINESS</span>
              <h2>My Stores</h2>
            </div>

            <button
              className="refresh-button"
              onClick={fetchOwnerDashboard}
            >
              ↻ Refresh
            </button>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="owner-loading">
              <div className="owner-spinner"></div>
              <p>Loading your stores...</p>
            </div>
          ) : stores.length === 0 ? (
            /* EMPTY */
            <div className="owner-empty">

              <div className="empty-icon">
                🏪
              </div>

              <h3>No Stores Found</h3>

              <p>
                You don't have any stores assigned to your account yet.
              </p>

            </div>
          ) : (
            /* STORES */
            <div className="owner-stores">

              {stores.map((store) => (

                <article
                  className="owner-store-card"
                  key={store.id}
                >

                  {/* STORE HEADER */}
                  <div className="store-header">

                    <div className="store-icon">
                      🏪
                    </div>

                    <div className="store-title">
                      <h2>{store.name}</h2>
                      <span>
                        Store ID: #{store.id}
                      </span>
                    </div>

                    <div className="rating-badge">
                      ⭐{" "}
                      {Number(
                        store.average_rating || 0
                      ).toFixed(1)}
                    </div>

                  </div>

                  {/* STORE INFO */}
                  <div className="store-info">

                    <div className="info-item">
                      <span>✉</span>

                      <div>
                        <small>Email</small>
                        <p>{store.email}</p>
                      </div>
                    </div>

                    <div className="info-item">
                      <span>⌖</span>

                      <div>
                        <small>Address</small>
                        <p>{store.address}</p>
                      </div>
                    </div>

                  </div>

                  {/* RATING SUMMARY */}
                  <div className="rating-summary">

                    <div>
                      <span>Average Rating</span>

                      <strong>
                        {Number(
                          store.average_rating || 0
                        ).toFixed(1)}
                        <small>/ 5</small>
                      </strong>
                    </div>

                    <div>
                      <span>Total Reviews</span>

                      <strong>
                        {store.total_ratings || 0}
                      </strong>
                    </div>

                  </div>

                  {/* CUSTOMER RATINGS */}
                  <div className="ratings-section">

                    <div className="ratings-heading">
                      <div>
                        <h3>Customer Ratings</h3>
                        <p>
                          Feedback received from customers
                        </p>
                      </div>

                      <span className="review-count">
                        {store.total_ratings || 0} Reviews
                      </span>
                    </div>

                    {!store.ratings ||
                    store.ratings.length === 0 ? (
                      <div className="no-ratings">
                        <span>⭐</span>
                        <p>No customer ratings yet.</p>
                      </div>
                    ) : (
                      <div className="ratings-table-wrapper">

                        <table className="ratings-table">

                          <thead>
                            <tr>
                              <th>Customer</th>
                              <th>Email</th>
                              <th>Rating</th>
                              <th>Date</th>
                            </tr>
                          </thead>

                          <tbody>

                            {store.ratings.map(
                              (rating) => (

                                <tr key={rating.id}>

                                  <td>
                                    <div className="customer-cell">

                                      <div className="customer-avatar">
                                        {(rating.user_name || "U")
                                          .charAt(0)
                                          .toUpperCase()}
                                      </div>

                                      <strong>
                                        {rating.user_name}
                                      </strong>

                                    </div>
                                  </td>

                                  <td>
                                    <span className="customer-email">
                                      {rating.user_email}
                                    </span>
                                  </td>

                                  <td>
                                    <span className="rating-value">
                                      ⭐ {rating.rating}
                                    </span>
                                  </td>

                                  <td>
                                    <span className="rating-date">
                                      {new Date(
                                        rating.created_at
                                      ).toLocaleDateString()}
                                    </span>
                                  </td>

                                </tr>

                              )
                            )}

                          </tbody>

                        </table>

                      </div>
                    )}

                  </div>

                </article>

              ))}

            </div>
          )}

        </section>

        <footer className="owner-footer">
          © 2026 Store Rating System
        </footer>

      </main>
    </div>
  );
}

export default OwnerDashboard;