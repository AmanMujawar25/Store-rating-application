const pool = require("../config/db");

const submitRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        const user_id = req.user.userId;

        if (!store_id || rating === undefined) {
            return res.status(400).json({
                message: "Store ID and rating are required"
            });
        }

        if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
            return res.status(400).json({
                message: "Rating must be an integer between 1 and 5"
            });
        }

        const storeResult = await pool.query(
            "SELECT id FROM stores WHERE id = $1",
            [store_id]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        const existingRating = await pool.query(
            `SELECT id
             FROM ratings
             WHERE user_id = $1 AND store_id = $2`,
            [user_id, store_id]
        );

        if (existingRating.rows.length > 0) {
            const result = await pool.query(
                `UPDATE ratings
                 SET rating = $1,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE user_id = $2 AND store_id = $3
                 RETURNING id, user_id, store_id, rating, updated_at`,
                [rating, user_id, store_id]
            );

            return res.status(200).json({
                message: "Rating updated successfully",
                rating: result.rows[0]
            });
        }

        const result = await pool.query(
            `INSERT INTO ratings
             (user_id, store_id, rating)
             VALUES ($1, $2, $3)
             RETURNING id, user_id, store_id, rating, created_at`,
            [user_id, store_id, rating]
        );

        res.status(201).json({
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.error("Submit rating error:", error);

        res.status(500).json({
            message: "Failed to submit rating"
        });
    }
};

module.exports = {
    submitRating
};