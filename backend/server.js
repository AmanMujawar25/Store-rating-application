require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "Store Rating API is running"
    });
});

// ===============================
// Database Test
// ===============================

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "PostgreSQL connection successful",
            time: result.rows[0].now
        });

    } catch (error) {
        console.error("DATABASE ERROR:", error);

        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });
    }
});

// ===============================
// Authentication Routes
// ===============================

app.use("/api/auth", authRoutes);

// ===============================
// Admin Routes
// ===============================

app.use("/api/admin", adminRoutes);

// ===============================
// Store Routes
// ===============================

app.use("/api/stores", storeRoutes);

// ===============================
// Rating Routes
// ===============================

app.use("/api/ratings", ratingRoutes);

// ===============================
// Store Owner Routes
// ===============================

app.use("/api/owner", ownerRoutes);

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});