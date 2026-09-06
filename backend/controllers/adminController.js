const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// ===============================
// VALIDATION HELPERS
// ===============================

const validatePassword = (password) => {
    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    return passwordRegex.test(password);
};

const validateEmail = (email) => {
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
};


// ===============================
// ADMIN DASHBOARD STATS
// ===============================

const getAdminStats = async (req, res) => {
    try {
        const usersResult = await pool.query(
            "SELECT COUNT(*) FROM users"
        );

        const storesResult = await pool.query(
            "SELECT COUNT(*) FROM stores"
        );

        const ratingsResult = await pool.query(
            "SELECT COUNT(*) FROM ratings"
        );

        res.status(200).json({
            totalUsers: Number(usersResult.rows[0].count),
            totalStores: Number(storesResult.rows[0].count),
            totalRatings: Number(ratingsResult.rows[0].count),
        });

    } catch (error) {
        console.error("Admin stats error:", error);

        res.status(500).json({
            message: "Failed to fetch admin statistics",
        });
    }
};


// ===============================
// CREATE USER
// ===============================

const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            password,
            role
        } = req.body;

        // Required fields
        if (
            !name ||
            !email ||
            !address ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Name validation
        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message:
                    "Name must be between 20 and 60 characters",
            });
        }

        // Address validation
        if (address.length > 400) {
            return res.status(400).json({
                message:
                    "Address must not exceed 400 characters",
            });
        }

        // Email validation
        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address",
            });
        }

        // Password validation
        if (!validatePassword(password)) {
            return res.status(400).json({
                message:
                    "Password must be 8-16 characters with at least one uppercase letter and one special character",
            });
        }

        // Role validation
        const allowedRoles = [
            "ADMIN",
            "NORMAL_USER",
            "STORE_OWNER"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        // Check duplicate email
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Insert user
        const result = await pool.query(
            `INSERT INTO users
                (name, email, password, address, role)
             VALUES
                ($1, $2, $3, $4, $5)
             RETURNING
                id,
                name,
                email,
                address,
                role,
                created_at`,
            [
                name,
                email,
                hashedPassword,
                address,
                role
            ]
        );

        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0],
        });

    } catch (error) {
        console.error("Create user error:", error);

        res.status(500).json({
            message: "Failed to create user",
        });
    }
};


// ===============================
// GET ALL USERS
// SEARCH + ROLE FILTER + SORT
// ===============================

const getAllUsers = async (req, res) => {
    try {
        const {
            search,
            role,
            sort,
            order
        } = req.query;

        const allowedSortFields = {
            id: "id",
            name: "name",
            email: "email",
            role: "role",
            created_at: "created_at"
        };

        const sortField =
            allowedSortFields[sort] || "id";

        const sortOrder =
            order?.toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                address,
                role,
                created_at,
                updated_at
             FROM users
             WHERE
                (
                    name ILIKE $1
                    OR email ILIKE $1
                    OR address ILIKE $1
                )
                AND ($2 = '' OR role = $2)
             ORDER BY
                ${sortField} ${sortOrder}`,
            [
                `%${search || ""}%`,
                role || ""
            ]
        );

        res.status(200).json({
            users: result.rows,
        });

    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            message: "Failed to fetch users",
        });
    }
};


// ===============================
// CREATE STORE
// ===============================

const createStore = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            owner_id
        } = req.body;

        // Required fields
        if (
            !name ||
            !email ||
            !address ||
            !owner_id
        ) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Email validation
        if (!validateEmail(email)) {
            return res.status(400).json({
                message:
                    "Please enter a valid email address",
            });
        }

        // Address validation
        if (address.length > 400) {
            return res.status(400).json({
                message:
                    "Address must not exceed 400 characters",
            });
        }

        // Check owner
        const ownerResult = await pool.query(
            `SELECT
                id,
                name,
                email,
                role
             FROM users
             WHERE id = $1`,
            [owner_id]
        );

        if (ownerResult.rows.length === 0) {
            return res.status(404).json({
                message: "Store owner not found",
            });
        }

        // Check role
        if (
            ownerResult.rows[0].role !==
            "STORE_OWNER"
        ) {
            return res.status(400).json({
                message:
                    "Selected user is not a store owner",
            });
        }

        // Check duplicate store email
        const existingStore = await pool.query(
            "SELECT id FROM stores WHERE email = $1",
            [email]
        );

        if (existingStore.rows.length > 0) {
            return res.status(409).json({
                message:
                    "Store email already exists",
            });
        }

        // Insert store
        const result = await pool.query(
            `INSERT INTO stores
                (name, email, address, owner_id)
             VALUES
                ($1, $2, $3, $4)
             RETURNING
                id,
                name,
                email,
                address,
                owner_id,
                created_at`,
            [
                name,
                email,
                address,
                owner_id
            ]
        );

        res.status(201).json({
            message: "Store created successfully",
            store: result.rows[0],
        });

    } catch (error) {
        console.error("Create store error:", error);

        res.status(500).json({
            message: "Failed to create store",
        });
    }
};


// ===============================
// GET ALL STORES
// SEARCH + SORT
// ===============================

const getAllStores = async (req, res) => {
    try {
        const {
            search,
            sort,
            order
        } = req.query;

        const allowedSortFields = {
            id: "s.id",
            name: "s.name",
            email: "s.email",
            owner_name: "u.name",
            created_at: "s.created_at"
        };

        const sortField =
            allowedSortFields[sort] || "s.id";

        const sortOrder =
            order?.toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        const result = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                u.name AS owner_name,
                u.email AS owner_email,
                s.created_at,
                s.updated_at
             FROM stores s
             INNER JOIN users u
                ON s.owner_id = u.id
             WHERE
                (
                    s.name ILIKE $1
                    OR s.email ILIKE $1
                    OR s.address ILIKE $1
                    OR u.name ILIKE $1
                    OR u.email ILIKE $1
                )
             ORDER BY
                ${sortField} ${sortOrder}`,
            [
                `%${search || ""}%`
            ]
        );

        res.status(200).json({
            stores: result.rows,
        });

    } catch (error) {
        console.error("Get stores error:", error);

        res.status(500).json({
            message: "Failed to fetch stores",
        });
    }
};


// ===============================
// GET ALL RATINGS
// SEARCH + RATING FILTER + SORT
// ===============================

const getAllRatings = async (req, res) => {
    try {
        const {
            search,
            rating,
            sort,
            order
        } = req.query;

        const allowedSortFields = {
            id: "r.id",
            rating: "r.rating",
            customer_name: "u.name",
            store_name: "s.name",
            created_at: "r.created_at"
        };

        const sortField =
            allowedSortFields[sort] || "r.id";

        const sortOrder =
            order?.toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        const ratingValue =
            rating && rating !== ""
                ? Number(rating)
                : 0;

        const result = await pool.query(
            `SELECT
                r.id,
                r.rating,
                r.created_at,
                r.updated_at,

                u.id AS user_id,
                u.name AS customer_name,
                u.email AS customer_email,

                s.id AS store_id,
                s.name AS store_name,
                s.email AS store_email

             FROM ratings r

             INNER JOIN users u
                ON r.user_id = u.id

             INNER JOIN stores s
                ON r.store_id = s.id

             WHERE
                (
                    u.name ILIKE $1
                    OR u.email ILIKE $1
                    OR s.name ILIKE $1
                    OR s.email ILIKE $1
                )
                AND
                ($2 = 0 OR r.rating = $2)

             ORDER BY
                ${sortField} ${sortOrder}`,
            [
                `%${search || ""}%`,
                ratingValue
            ]
        );

        res.status(200).json({
            ratings: result.rows
        });

    } catch (error) {
        console.error(
            "Get ratings error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch ratings"
        });
    }
};


// ===============================
// EXPORT ALL FUNCTIONS
// ===============================

module.exports = {
    getAdminStats,
    createUser,
    getAllUsers,
    createStore,
    getAllStores,
    getAllRatings
};