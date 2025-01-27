import React, { useState } from "react";
import "./UserRating.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { Rating } from "@mui/material";
import HalfRating from "../../Shared/RatingStars";

export default function UserRating({
  userName,
  businessName,
  overallRating,
  totalReviews,
  ratingDistribution,
  onReviewSubmit,
}) {
  const [userRating, setUserRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const handleSubmit = () => {
    const newReview = {
      name: userName,
      rating: userRating,
      text: reviewText || " ",
    };
    onReviewSubmit(newReview);
    closeModal();
  };
  const userReview = businessName.reviews.find(
    (review) => review.client?.name === userName
  );

  return (
    <div className="user-rating-section">
      <div className="user-info">
        <FontAwesomeIcon
          icon={faUserCircle}
          size="3x"
          className="profile-icon"
        />
        <p className="user-name">{userName}</p>
        <Rating
          name="user-rating"
          value={userReview?.rating ?? 0}
          precision={0.5}
          readOnly={userReview}
          onChange={(event, newValue) => {
            handleRatingChange(newValue);
            openModal();
          }}
          className="user-rating-stars"
        />
        {!userReview && (
          <p className="start-review-text" onClick={openModal}>
            {`Start your review of ${businessName.businessName}`}
          </p>
        )}
      </div>

      <div className="rating-container">
        <div className="rating-details">
          <div className="overall-rating-section">
            <p className="overall-rating-label">Overall Rating</p>
            <HalfRating
              name="overall-rating"
              rating={overallRating?.toFixed(1) || "0.0"}
              reviewers={totalReviews}
            />
            {/* <p className="review-count">{totalReviews} reviews</p> */}
          </div>
        </div>

        {/* <div className="rating-distribution">                                         !!Will do later!!
          {Object.entries(ratingDistribution).map(([stars, count]) => (
            <div key={stars} className="rating-bar-item">
              <span className="star-label">{stars} Stars</span>
              <div className="rating-bar">
                <div
                  className="filled-bar"
                  style={{ width: `${(count / totalReviews) * 100}%` }}
                ></div>
              </div>
              <span className="rating-count">{count}</span>
            </div>
          ))}
        </div> */}
      </div>

      {/* Modal for review submission */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Leave a Review</h3>
            <HalfRating
              name="modal-rating"
              rating={userRating}
              precision={0.5}
              readOnly={false}
              withoutReviews={true}
              onChange={(event, newValue) => handleRatingChange(newValue)}
            />
            <textarea
              className="review-textarea"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button className="submit-button" onClick={handleSubmit}>
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
