import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";

import Users from "./pages/Users";
import Stores from "./pages/Stores";
import CreateUser from "./pages/CreateUser";
import CreateStore from "./pages/CreateStore";
import Ratings from "./pages/Ratings";
import Settings from "./pages/Settings";

function App() {
  // =====================================
  // PAGE STATE
  // =====================================

  const [page, setPage] = useState("login");

  // Logged-in dashboard role
  const [dashboard, setDashboard] = useState(null);

  // Admin internal page
  const [adminPage, setAdminPage] = useState("dashboard");

  // =====================================
  // LOGIN SUCCESS
  // =====================================

  const handleLoginSuccess = (role) => {
    console.log("Login role:", role);

    setDashboard(role);

    // Reset page when admin logs in
    if (role === "ADMIN") {
      setAdminPage("dashboard");
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    console.log("Logging out...");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setDashboard(null);
    setPage("login");
    setAdminPage("dashboard");
  };

  // =====================================
  // ADMIN DASHBOARD
  // =====================================

  if (dashboard === "ADMIN") {
    return (
      <>
        {/* Admin Dashboard */}

        {adminPage === "dashboard" && (
          <AdminDashboard
            setAdminPage={setAdminPage}
            onLogout={handleLogout}
          />
        )}

        {/* Users */}

        {adminPage === "users" && (
          <Users
            setAdminPage={setAdminPage}
          />
        )}

        {/* Stores */}

        {adminPage === "stores" && (
          <Stores
            setAdminPage={setAdminPage}
          />
        )}

        {/* Create User */}

        {adminPage === "create-user" && (
          <CreateUser
            setAdminPage={setAdminPage}
          />
        )}

        {/* Create Store */}

        {adminPage === "create-store" && (
          <CreateStore
            setAdminPage={setAdminPage}
          />
        )}

        {/* Ratings */}

        {adminPage === "ratings" && (
          <Ratings
            setAdminPage={setAdminPage}
          />
        )}

        {/* Reports */}

        {adminPage === "reports" && (
          <div
            style={{
              padding: "40px",
              minHeight: "100vh",
              background: "#f5f7fb",
            }}
          >
            <h1>Reports</h1>

            <p>
              Reports section coming soon.
            </p>

            <button
              onClick={() =>
                setAdminPage("dashboard")
              }
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Settings */}

        {adminPage === "settings" && (
          <Settings
            setAdminPage={setAdminPage}
          />
        )}
      </>
    );
  }

  // =====================================
  // NORMAL USER DASHBOARD
  // =====================================

  if (dashboard === "NORMAL_USER") {
    return (
      <UserDashboard
        onLogout={handleLogout}
      />
    );
  }

  // =====================================
  // STORE OWNER DASHBOARD
  // =====================================

  if (dashboard === "STORE_OWNER") {
    return (
      <OwnerDashboard
        onLogout={handleLogout}
      />
    );
  }

  // =====================================
  // FORGOT PASSWORD
  // =====================================

  if (page === "forgot-password") {
    return (
      <ForgotPassword
        onLogin={() => setPage("login")}
      />
    );
  }

  // =====================================
  // REGISTER
  // =====================================

  if (page === "register") {
    return (
      <Register
        onLogin={() => setPage("login")}
      />
    );
  }

  // =====================================
  // LOGIN
  // =====================================

  return (
    <Login
      onRegister={() => setPage("register")}

      onForgotPassword={() =>
        setPage("forgot-password")
      }

      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;