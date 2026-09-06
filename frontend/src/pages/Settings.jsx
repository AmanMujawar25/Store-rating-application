import { useState } from "react";
import "./Settings.css";

function Settings({ setAdminPage }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match");
            return;
        }

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordRegex.test(newPassword)) {
            setError(
                "Password must be 8-16 characters with at least one uppercase letter and one special character"
            );
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/auth/change-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message || "Failed to change password"
                );
                return;
            }

            setMessage(
                data.message || "Password changed successfully"
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error("Change password error:", error);

            setError("Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">

            <div className="settings-header">

                <div>
                    <h1>Settings</h1>
                    <p>Manage your account settings</p>
                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() => setAdminPage("dashboard")}
                >
                    ← Back to Dashboard
                </button>

            </div>


            <div className="settings-container">

                <div className="settings-card">

                    <div className="settings-card-header">
                        <div className="settings-icon">
                            🔐
                        </div>

                        <div>
                            <h2>Change Password</h2>
                            <p>
                                Update your account password securely.
                            </p>
                        </div>
                    </div>


                    {message && (
                        <div className="success-message">
                            ✓ {message}
                        </div>
                    )}


                    {error && (
                        <div className="error-message">
                            ✕ {error}
                        </div>
                    )}


                    <form
                        className="password-form"
                        onSubmit={handleChangePassword}
                    >

                        <div className="form-group">

                            <label>
                                Current Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                            />

                            <small>
                                8-16 characters, one uppercase letter
                                and one special character.
                            </small>

                        </div>


                        <div className="form-group">

                            <label>
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                        </div>


                        <button
                            type="submit"
                            className="change-password-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Changing Password..."
                                : "Change Password"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Settings;