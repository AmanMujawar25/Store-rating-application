import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";

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

        // Admin always starts from dashboard
        if (role === "ADMIN") {
            setAdminPage("dashboard");
        }
    };

    // =====================================
    // LOGOUT
    // =====================================

    const handleLogout = () => {
        console.log("Logging out...");

        // Remove authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Clear dashboard
        setDashboard(null);

        // Go to login page
        setPage("login");

        // Reset admin page
        setAdminPage("dashboard");
    };

    // =====================================
    // ADMIN DASHBOARD
    // =====================================

    if (dashboard === "ADMIN") {
        return (
            <>
                {/* ADMIN MAIN DASHBOARD */}

                {adminPage === "dashboard" && (
                    <AdminDashboard
                        setAdminPage={setAdminPage}
                        onLogout={handleLogout}
                    />
                )}

                {/* USERS */}

                {adminPage === "users" && (
                    <Users
                        setAdminPage={setAdminPage}
                    />
                )}

                {/* STORES */}

                {adminPage === "stores" && (
                    <Stores
                        setAdminPage={setAdminPage}
                    />
                )}

                {/* CREATE USER */}

                {adminPage === "create-user" && (
                    <CreateUser
                        setAdminPage={setAdminPage}
                    />
                )}

                {/* CREATE STORE */}

                {adminPage === "create-store" && (
                    <CreateStore
                        setAdminPage={setAdminPage}
                    />
                )}

                {/* RATINGS */}

                {adminPage === "ratings" && (
                    <Ratings
                        setAdminPage={setAdminPage}
                    />
                )}

                {/* REPORTS */}

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
                            ← Back to Dashboard
                        </button>
                    </div>
                )}

                {/* SETTINGS */}

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
    // LOGIN / REGISTER
    // =====================================

    return (
        <div>
            {page === "login" ? (
                <Login
                    onRegister={() =>
                        setPage("register")
                    }
                    onLoginSuccess={
                        handleLoginSuccess
                    }
                />
            ) : (
                <>
                    <Register
                        onLogin={() =>
                            setPage("login")
                        }
                    />

                    <p className="login-text">
                        Already have an account?

                        <span
                            onClick={() =>
                                setPage("login")
                            }
                        >
                            {" "}
                            Login
                        </span>
                    </p>
                </>
            )}
        </div>
    );
}

export default App;