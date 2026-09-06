import { useEffect, useState } from "react";
import "./Stores.css";

function Stores({ setAdminPage }) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/stores?search=${encodeURIComponent(
          search,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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

  return (
    <div className="admin-stores-page">
      {/* Header */}

      <button onClick={() => setAdminPage("dashboard")}>
        ← Back to Dashboard
      </button>
      <div className="stores-page-header">
        <div>
          <span className="stores-page-label">STORE MANAGEMENT</span>

          <h1>Stores Management</h1>

          <p>View and manage all registered stores and their owners.</p>
        </div>

        <div className="stores-header-icon">🏪</div>
      </div>

      {/* Search */}
      <div className="stores-search-card">
        <div className="stores-search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search stores by name, email or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              className="clear-stores-search"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="stores-message">
          <span>!</span>
          {message}
        </div>
      )}

      {/* Main Card */}
      <div className="stores-table-card">
        {/* Card Header */}
        <div className="stores-table-header">
          <div>
            <h2>Registered Stores</h2>

            <p>
              {loading
                ? "Loading stores..."
                : `${stores.length} store${
                    stores.length !== 1 ? "s" : ""
                  } found`}
            </p>
          </div>

          <div className="total-stores-badge">🏪 {stores.length}</div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="stores-loading">
            <div className="stores-spinner"></div>
            <p>Loading stores...</p>
          </div>
        ) : stores.length === 0 ? (
          /* Empty State */
          <div className="stores-empty">
            <div className="stores-empty-icon">🏪</div>

            <h3>No stores found</h3>

            <p>Try changing your search to find a store.</p>

            {search && (
              <button onClick={() => setSearch("")}>Clear Search</button>
            )}
          </div>
        ) : (
          /* Table */
          <div className="stores-table-wrapper">
            <table className="stores-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Store</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Store Owner</th>
                  <th>Owner Email</th>
                </tr>
              </thead>

              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    {/* ID */}
                    <td>
                      <span className="store-id">#{store.id}</span>
                    </td>

                    {/* Store */}
                    <td>
                      <div className="store-info">
                        <div className="store-avatar">
                          {store.name?.charAt(0).toUpperCase() || "S"}
                        </div>

                        <div>
                          <strong>{store.name}</strong>
                          <small>Store ID: {store.id}</small>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <span className="store-email">{store.email}</span>
                    </td>

                    {/* Address */}
                    <td>
                      <span className="store-address">
                        {store.address || "Not provided"}
                      </span>
                    </td>

                    {/* Owner */}
                    <td>
                      <div className="owner-info">
                        <div className="owner-avatar">
                          {store.owner_name?.charAt(0).toUpperCase() || "O"}
                        </div>

                        <span>{store.owner_name || "Not assigned"}</span>
                      </div>
                    </td>

                    {/* Owner Email */}
                    <td>
                      <span className="owner-email">
                        {store.owner_email || "Not available"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="stores-footer">
        <span>🔒</span>
        Store information is securely managed by the administrator.
      </div>
    </div>
  );
}

export default Stores;
