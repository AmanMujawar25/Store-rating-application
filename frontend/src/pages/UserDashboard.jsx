import { useEffect, useState } from "react";
import "./UserDashboard.css";

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(null);

  const fetchStores = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/stores?search=${encodeURIComponent(search)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load stores");
        return;
      }

      setStores(data.stores || []);
      setMessage("");
    } catch (error) {
      console.error("Stores error:", error);
      setMessage("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStores();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const submitRating = async (storeId, rating) => {
    try {
      setRatingLoading(`${storeId}-${rating}`);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/ratings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            store_id: storeId,
            rating: rating,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to submit rating");
        return;
      }

      setMessage(data.message || "Rating submitted successfully!");

      await fetchStores();
    } catch (error) {
      console.error("Rating error:", error);
      setMessage("Server connection failed");
    } finally {
      setRatingLoading(null);
    }
  };

 const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.reload();
};

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "S";
  };

  const getUserName = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.name || "Customer";
    } catch {
      return "Customer";
    }
  };

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <aside className="user-sidebar">
        <div className="user-brand">
          <div className="user-brand-icon">★</div>

          <div>
            <h2>Store Rating</h2>
            <span>Customer Panel</span>
          </div>
        </div>

        <nav className="user-nav">
          <a className="user-nav-item active">
            <span>▦</span>
            Dashboard
          </a>

          <a className="user-nav-item">
            <span>🏪</span>
            Browse Stores
          </a>

          <a className="user-nav-item">
            <span>★</span>
            My Ratings
          </a>
        </nav>

        <div className="user-sidebar-bottom">
          <a className="user-nav-item">
            <span>⚙</span>
            Settings
          </a>

          <button className="user-logout" onClick={logout}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="user-main">
        {/* Header */}
        <header className="user-header">
          <div>
            <p className="user-header-label">CUSTOMER DASHBOARD</p>

            <h1>Discover Stores</h1>

            <p className="user-header-subtitle">
              Find your favorite stores and share your experience.
            </p>
          </div>

          <div className="user-profile">
            <div className="user-avatar">
              {getInitial(getUserName())}
            </div>

            <div>
              <strong>{getUserName()}</strong>
              <span>Customer</span>
            </div>
          </div>
        </header>

        {/* Welcome Banner */}
        <section className="welcome-banner">
          <div>
            <span className="welcome-small">WELCOME BACK 👋</span>

            <h2>Rate. Review. Discover.</h2>

            <p>
              Your ratings help other customers make better choices.
            </p>
          </div>

          <div className="welcome-star">★</div>
        </section>

        {/* Search */}
        <section className="search-section">
          <div className="search-title">
            <div>
              <p className="section-label">EXPLORE</p>
              <h2>Find a Store</h2>
            </div>

            <span className="store-total">
              {stores.length} {stores.length === 1 ? "Store" : "Stores"}
            </span>
          </div>

          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by store name, email or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>
        </section>

        {/* Message */}
        {message && (
          <div
            className={`user-message ${
              message.toLowerCase().includes("failed") ||
              message.toLowerCase().includes("error")
                ? "user-error"
                : "user-success"
            }`}
          >
            <span>
              {message.toLowerCase().includes("failed") ||
              message.toLowerCase().includes("error")
                ? "⚠"
                : "✓"}
            </span>

            {message}
          </div>
        )}

        {/* Stores */}
        <section className="stores-section">
          {loading ? (
            <div className="user-loading">
              <div className="user-spinner"></div>
              <p>Finding stores...</p>
            </div>
          ) : stores.length === 0 ? (
            <div className="user-empty">
              <div className="empty-store-icon">🏪</div>

              <h3>No stores found</h3>

              <p>
                We couldn't find any stores matching your search.
              </p>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="clear-button"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="user-store-grid">
              {stores.map((store) => {
                const myRating = Number(store.my_rating || 0);
                const overallRating = Number(
                  store.overall_rating || 0
                );

                return (
                  <article className="user-store-card" key={store.id}>
                    {/* Card Top */}
                    <div className="store-card-top">
                      <div className="user-store-logo">
                        {getInitial(store.name)}
                      </div>

                      <div className="store-main-info">
                        <h3>{store.name}</h3>

                        <p>✉ {store.email}</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="user-store-address">
                      <span>📍</span>

                      <p>
                        {store.address || "Address not available"}
                      </p>
                    </div>

                    {/* Rating Overview */}
                    <div className="rating-overview">
                      <div className="overall-rating">
                        <span className="rating-label">
                          OVERALL RATING
                        </span>

                        <div className="rating-number">
                          <strong>
                            {overallRating.toFixed(1)}
                          </strong>

                          <span>★</span>

                          <small>/ 5.0</small>
                        </div>
                      </div>

                      <div className="vertical-divider"></div>

                      <div className="my-rating">
                        <span className="rating-label">
                          MY RATING
                        </span>

                        {myRating > 0 ? (
                          <div className="my-rating-value">
                            <strong>{myRating}</strong>
                            <span>★</span>
                          </div>
                        ) : (
                          <p className="not-rated">
                            Not rated yet
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rating Area */}
                    <div className="rate-area">
                      <div className="rate-heading">
                        <div>
                          <h4>
                            {myRating > 0
                              ? "Update Your Rating"
                              : "Rate This Store"}
                          </h4>

                          <p>
                            {myRating > 0
                              ? "Change your rating anytime"
                              : "How was your experience?"}
                          </p>
                        </div>

                        <span className="rate-star">★</span>
                      </div>

                      <div className="rating-buttons">
                        {[1, 2, 3, 4, 5].map((rating) => {
                          const isActive = rating === myRating;
                          const isLoading =
                            ratingLoading ===
                            `${store.id}-${rating}`;

                          return (
                            <button
                              key={rating}
                              className={`rating-button ${
                                isActive ? "selected" : ""
                              }`}
                              onClick={() =>
                                submitRating(store.id, rating)
                              }
                              disabled={ratingLoading !== null}
                              title={`Give ${rating} star rating`}
                            >
                              {isLoading ? "..." : rating}
                              {!isLoading && "★"}
                            </button>
                          );
                        })}
                      </div>

                      <div className="rating-scale">
                        <span>Very Poor</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="user-footer">
          © 2026 Store Rating Application
          <span>•</span>
          Customer Dashboard
        </footer>
      </main>
    </div>
  );
}

export default UserDashboard;