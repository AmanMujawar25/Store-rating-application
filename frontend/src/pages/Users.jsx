import { useEffect, useState } from "react";
import "./Users.css";

function Users({ setAdminPage }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/users?search=${encodeURIComponent(
          search,
        )}&role=${encodeURIComponent(role)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load users");
        return;
      }

      setUsers(data.users || []);
      setMessage("");
    } catch (error) {
      console.error("Users error:", error);
      setMessage("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, role]);

  const getRoleClass = (userRole) => {
    if (userRole === "ADMIN") {
      return "role-admin";
    }

    if (userRole === "STORE_OWNER") {
      return "role-owner";
    }

    return "role-user";
  };

  const getRoleName = (userRole) => {
    if (userRole === "STORE_OWNER") {
      return "Store Owner";
    }

    if (userRole === "NORMAL_USER") {
      return "Normal User";
    }

    if (userRole === "ADMIN") {
      return "Admin";
    }

    return userRole;
  };

  return (
    <div className="users-page">
      {/* Header */}
      <button onClick={() => setAdminPage("dashboard")}>
        ← Back to Dashboard
      </button>
      <div className="users-header">
        <div>
          <span className="users-label">USER MANAGEMENT</span>

          <h1>Users Management</h1>

          <p>View, search and manage all registered users.</p>
        </div>

        <div className="users-header-icon">👥</div>
      </div>

      {/* Filters */}
      <div className="users-filter-card">
        <div className="user-search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search by name, email or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button className="clear-user-search" onClick={() => setSearch("")}>
              ×
            </button>
          )}
        </div>

        <div className="role-filter">
          <span>🎯</span>

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="NORMAL_USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="users-message">
          <span>!</span>
          {message}
        </div>
      )}

      {/* Table Card */}
      <div className="users-table-card">
        {/* Table Header */}
        <div className="users-table-header">
          <div>
            <h2>Registered Users</h2>

            <p>
              {loading
                ? "Loading users..."
                : `${users.length} user${users.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          <div className="total-users-badge">👤 {users.length}</div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="users-loading">
            <div className="users-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          /* Empty */
          <div className="users-empty">
            <div className="users-empty-icon">👥</div>

            <h3>No users found</h3>

            <p>Try changing your search or role filter.</p>

            {(search || role) && (
              <button
                onClick={() => {
                  setSearch("");
                  setRole("");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Table */
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <span className="user-id">#{user.id}</span>
                    </td>

                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div>
                          <strong>{user.name}</strong>
                          <small>User ID: {user.id}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="user-email">{user.email}</span>
                    </td>

                    <td>
                      <span className="user-address">
                        {user.address || "Not provided"}
                      </span>
                    </td>

                    <td>
                      <span className={`role-badge ${getRoleClass(user.role)}`}>
                        <span className="role-dot"></span>
                        {getRoleName(user.role)}
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
      <div className="users-footer">
        <span>🔒</span>
        User information is securely managed by the administrator.
      </div>
    </div>
  );
}

export default Users;
