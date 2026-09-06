const express = require("express");

const {
    getAdminStats,
    createUser,
    getAllUsers,
    createStore,
    getAllStores,
    getAllRatings
} = require("../controllers/adminController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================
// ADMIN DASHBOARD STATS
// =====================================

router.get(
    "/stats",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getAdminStats
);


// =====================================
// USER MANAGEMENT
// =====================================

// Create user
router.post(
    "/users",
    authenticateToken,
    authorizeRoles("ADMIN"),
    createUser
);

// Get all users
router.get(
    "/users",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getAllUsers
);


// =====================================
// STORE MANAGEMENT
// =====================================

// Create store
router.post(
    "/stores",
    authenticateToken,
    authorizeRoles("ADMIN"),
    createStore
);

// Get all stores
router.get(
    "/stores",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getAllStores
);


// =====================================
// RATING MANAGEMENT
// =====================================

// Get all ratings
router.get(
    "/ratings",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getAllRatings
);


module.exports = router;