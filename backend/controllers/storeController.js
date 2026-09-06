const pool = require("../config/db");

const getStores = async (req, res) => {
    try {
        const { search } = req.query;
        const user_id = req.user.userId;

        const result = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(AVG(r.rating), 0) AS overall_rating,
                COALESCE(
                    MAX(CASE WHEN r.user_id = $1 THEN r.rating END),
                    0
                ) AS my_rating
             FROM stores s
             LEFT JOIN ratings r
                ON s.id = r.store_id
             WHERE
                s.name ILIKE $2
                OR s.address ILIKE $2
             GROUP BY s.id
             ORDER BY s.name ASC`,
            [
                user_id,
                `%${search || ""}%`
            ]
        );

        res.status(200).json({
            stores: result.rows
        });

    } catch (error) {
        console.error("Get stores error:", error);

        res.status(500).json({
            message: "Failed to fetch stores"
        });
    }
};

module.exports = {
    getStores
};