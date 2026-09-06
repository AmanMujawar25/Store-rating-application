const express = require("express");

const { getStores } = require("../controllers/storeController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    authorizeRoles("NORMAL_USER"),
    getStores
);

module.exports = router;