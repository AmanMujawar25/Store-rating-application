const express = require("express");

const {
    registerUser,
    loginUser,
    changePassword
} = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put(
    "/change-password",
    authenticateToken,
    changePassword
);

module.exports = router;