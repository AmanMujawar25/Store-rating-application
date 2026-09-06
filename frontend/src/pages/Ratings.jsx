import { useEffect, useState } from "react";
import "./Ratings.css";

function Ratings({ setAdminPage }) {
    const [ratings, setRatings] = useState([]);
    const [search, setSearch] = useState("");
    const [rating, setRating] = useState("");
    const [sort, setSort] = useState("created_at");
    const [order, setOrder] = useState("DESC");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchRatings = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const params = new URLSearchParams({
                search,
                rating,
                sort,
                order,
            });

            const response = await fetch(
                `http://localhost:5000/api/admin/ratings?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load ratings");
            }

            setRatings(data.ratings || []);
        } catch (error) {
            console.error("Ratings error:", error);
            setError(error.message || "Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, [search, rating, sort, order]);

    const renderStars = (value) => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={i <= Number(value) ? "star active" : "star"}
                >
                    ★
                </span>
            );
        }

        return <div className="stars">{stars}</div>;
    };

    const clearFilters = () => {
        setSearch("");
        setRating("");
        setSort("created_at");
        setOrder("DESC");
    };

    return (
        <div className="ratings-page">

            <div className="ratings-header">
                <div>
                    <h1>Ratings</h1>
                    <p>View and manage customer ratings</p>
                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() => setAdminPage("dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="ratings-container">

                <div className="filter-card">

                    <div className="filter-group search-group">
                        <label>Search</label>

                        <input
                            type="text"
                            placeholder="Search customer or store..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>Rating</label>

                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        >
                            <option value="">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Sort By</label>

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="created_at">Date</option>
                            <option value="rating">Rating</option>
                            <option value="customer_name">Customer</option>
                            <option value="store_name">Store</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Order</label>

                        <select
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                        >
                            <option value="DESC">Descending</option>
                            <option value="ASC">Ascending</option>
                        </select>
                    </div>

                    <button
                        className="clear-btn"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>

                </div>

                {error && (
                    <div className="error-message">
                        ✕ {error}
                    </div>
                )}

                <div className="ratings-card">

                    <div className="ratings-card-header">
                        <div>
                            <h2>Customer Ratings</h2>
                            <p>Total Ratings: {ratings.length}</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">
                            Loading ratings...
                        </div>
                    ) : ratings.length === 0 ? (
                        <div className="no-data">
                            No ratings found.
                        </div>
                    ) : (
                        <div className="table-wrapper">

                            <table className="ratings-table">

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Email</th>
                                        <th>Store</th>
                                        <th>Rating</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {ratings.map((item) => (
                                        <tr key={item.id}>

                                            <td>#{item.id}</td>

                                            <td>
                                                <strong>
                                                    {item.customer_name}
                                                </strong>
                                            </td>

                                            <td>
                                                {item.customer_email}
                                            </td>

                                            <td>
                                                {item.store_name}
                                            </td>

                                            <td>
                                                <div className="rating-cell">
                                                    {renderStars(item.rating)}
                                                    <span>
                                                        {item.rating}/5
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                {item.created_at
                                                    ? new Date(
                                                          item.created_at
                                                      ).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Ratings;