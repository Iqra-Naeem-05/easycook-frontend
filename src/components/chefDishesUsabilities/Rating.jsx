import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { FaStar } from 'react-icons/fa';

const Rating = ({ chefId, user, averageRating = null, interactive = true }) => {
    const [userRating, setUserRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [message, setMessage] = useState("");

    // Fetch rating if interactive
    useEffect(() => {
        if (interactive && user) {
            axios.get(`/get-chef-rating/${chefId}/`)
                .then(response => {
                    if (response.data.rating) {
                        setUserRating(response.data.rating);
                    }
                })
                .catch(error => {
                    console.error("Error fetching rating:", error);
                });
        }
    }, [chefId, interactive, user]);

    const handleRatingSubmit = (value) => {
        setUserRating(value);
        axios.post(`/rate-chef/${chefId}/`, { rating: value })
            .then(response => {
                if (response.status === 201) {
                    setMessage("Rating submitted successfully!");
                }
            })
            .catch(error => {
                setMessage("Error submitting rating.");
                console.error("Error submitting rating:", error);
            });
    };

    const effectiveRating = interactive ? userRating : averageRating || 0;

    if (!interactive) {
        // 🔒 Non-interactive version (e.g., Chef Card with decimal support)
        return (
            <div className="d-flex justify-content-center align-item-center gap-2" >
                {[1, 2, 3, 4, 5].map((star) => {
                    const fillPercent = Math.min(Math.max(effectiveRating - star + 1, 0), 1) * 100;
                    return (
                        <div key={star} style={{ position: 'relative', width: '20px', height: '20px' }}>
                            <FaStar size={20} color="#d3d3d3" />
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: `${fillPercent}%`,
                                overflow: 'hidden',
                                height: '100%',
                            }}>
                                <FaStar size={20} color="#FFD700" />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // ✅ Interactive version (clickable stars on profile)
    return (
        <div>
            <div className="d-flex gap-2" >
                {[1, 2, 3, 4, 5].map((value) => (
                    <FaStar
                        key={value}
                        size={24}
                        color={value <= (hoveredRating || userRating) ? "#FFD700" : "#d3d3d3"}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRatingSubmit(value)}
                        onMouseEnter={() => setHoveredRating(value)}
                        onMouseLeave={() => setHoveredRating(0)}
                    />
                ))}
            </div>
            {message && <p className="mt-2 small">{message}</p>}
        </div>
    );
};

export default Rating;
