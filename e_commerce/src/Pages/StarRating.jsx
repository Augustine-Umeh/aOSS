import React from 'react';
import './StarRating.css';

const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const partialStar = rating % 1;
    const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0);

    return (
        <div className="rating-container">
            <div className="rating-number">Rating: {rating.toFixed(1)}</div>
            <div className="rate">
                {[...Array(fullStars)].map((_, index) => (
                    <span key={`full-${index}`} className="star full">&#9733;</span>
                ))}
                {partialStar > 0 && (
                    <span className="star partial" style={{ '--star-fill': `${partialStar * 100}%` }}>&#9733;</span>
                )}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={`empty-${index}`} className="star empty">&#9733;</span>
                ))}
            </div>
        </div>
    );
};

export default StarRating;
