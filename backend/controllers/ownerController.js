const pool = require("../config/db");

const getOwnerDashboard = async (req, res) => {
    try {
        const owner_id = req.user.userId;

        const storeResult = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(AVG(r.rating), 0) AS average_rating,
                COUNT(r.id) AS total_ratings
             FROM stores s
             LEFT JOIN ratings r
                ON s.id = r.store_id
             WHERE s.owner_id = $1
             GROUP BY s.id
             ORDER BY s.id ASC`,
            [owner_id]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                message: "No store found for this owner"
            });
        }

        const storeIds = storeResult.rows.map(store => store.id);

        const ratingsResult = await pool.query(
            `SELECT
                r.id,
                r.rating,
                r.created_at,
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email
             FROM ratings r
             INNER JOIN users u
                ON r.user_id = u.id
             WHERE r.store_id = ANY($1::int[])
             ORDER BY r.created_at DESC`,
            [storeIds]
        );

        res.status(200).json({
            stores: storeResult.rows,
            ratings: ratingsResult.rows
        });

    } catch (error) {
        console.error("Owner dashboard error:", error);

        res.status(500).json({
            message: "Failed to fetch owner dashboard"
        });
    }
};

module.exports = {
    getOwnerDashboard
};