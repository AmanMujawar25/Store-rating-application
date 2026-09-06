import { useEffect, useState } from "react";
import "./CreateStore.css";

function CreateStore({ setAdminPage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [owners, setOwners] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/users?role=STORE_OWNER",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to load store owners");
          return;
        }

        setOwners(data.users || []);
      } catch (error) {
        console.error("Owners error:", error);
        setMessage("Server connection failed");
      } finally {
        setLoadingOwners(false);
      }
    };

    fetchOwners();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (message) {
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setCreating(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/admin/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          owner_id: Number(formData.owner_id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create store");
        return;
      }

      setMessage("Store created successfully!");

      setFormData({
        name: "",
        email: "",
        address: "",
        owner_id: "",
      });
    } catch (error) {
      console.error("Create store error:", error);
      setMessage("Server connection failed");
    } finally {
      setCreating(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      address: "",
      owner_id: "",
    });

    setMessage("");
  };

  return (
    <div className="create-store-page">
      {/* Page Header */}
      <button onClick={() => setAdminPage("dashboard")}>
        ← Back to Dashboard
      </button>
      <div className="create-store-header">
        <div>
          <span className="page-label">STORE MANAGEMENT</span>

          <h1>Create New Store</h1>

          <p>Add a new store and assign a store owner to manage it.</p>
        </div>

        <div className="store-header-icon">🏪</div>
      </div>

      {/* Form Card */}
      <div className="create-store-card">
        <div className="card-title">
          <div className="card-icon">🏬</div>

          <div>
            <h2>Store Information</h2>
            <p>Enter the details of the new store below.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Store Name + Email */}
          <div className="form-row">
            <div className="form-group">
              <label>
                Store Name <span>*</span>
              </label>

              <div className="input-wrapper">
                <span className="input-icon">🏪</span>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter store name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Store Email <span>*</span>
              </label>

              <div className="input-wrapper">
                <span className="input-icon">✉️</span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter store email"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label>
              Store Address <span>*</span>
            </label>

            <div className="textarea-wrapper">
              <span className="textarea-icon">📍</span>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete store address"
                rows="4"
                required
              />
            </div>
          </div>

          {/* Owner */}
          <div className="form-group">
            <label>
              Store Owner <span>*</span>
            </label>

            <div className="input-wrapper select-wrapper">
              <span className="input-icon">👤</span>

              <select
                name="owner_id"
                value={formData.owner_id}
                onChange={handleChange}
                required
                disabled={loadingOwners}
              >
                <option value="">
                  {loadingOwners
                    ? "Loading store owners..."
                    : "Select Store Owner"}
                </option>

                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} - {owner.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="owner-info">
              <span>💡</span>

              <p>
                Select the user who will be responsible for managing this store
                and its ratings.
              </p>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`store-message ${
                message.includes("successfully") ? "success" : "error"
              }`}
            >
              <span>{message.includes("successfully") ? "✓" : "!"}</span>

              {message}
            </div>
          )}

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="clear-store-btn"
              onClick={handleClear}
            >
              Clear
            </button>

            <button
              type="submit"
              className="create-store-btn"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Store"}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="create-store-footer">
        <span>🔒</span>
        Store information is securely managed by the administrator.
      </div>
    </div>
  );
}

export default CreateStore;
