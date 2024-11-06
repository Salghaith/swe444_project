import React, { useContext, useEffect, useState } from "react";
import BusinessInfo from "../../components/UserPages/businessInfoComponents/BusinessInfo";
import ContactInfo from "../../components/UserPages/businessInfoComponents/ContactInfo";
import LicenseSection from "../../components/UserPages/businessInfoComponents/LicenseSection";
import AboutSection from "../../components/UserPages/businessInfoComponents/AboutSection";
import LocationHoursSection from "../../components/UserPages/businessInfoComponents/LocationHoursSection";
import UserRating from "../../components/UserPages/businessInfoComponents/UserRating";
import CustomerRating from "../../components/UserPages/businessInfoComponents/CustomerRating";
import "./BusinessInfoPage.css";
import { UserContext } from "../../components/util/context";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function BusinessPage() {
  const { loggedInUser, apiBaseUrl } = useContext(UserContext);
  const location = useLocation();
  const { businessData } = location.state || {};
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  if (!businessData) {
    return <p>No Business Data Available</p>;
  }

  useEffect(() => {
    if (businessData) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(
            `${apiBaseUrl}/business/${businessData._id}/reviews`
          );
          setReviews(response.data.reviews); // Assuming the API returns reviews in this format
        } catch (error) {
          console.error("Error fetching reviews:", error);
          setErrorMessage("Failed to load reviews");
        } finally {
          setLoading(false);
        }
      };

      fetchReviews();
    }
  }, [businessData]);

  

  const onReviewSubmit = async (newReview) => {
    try {
      const { rating, text } = newReview;
  
      const response = await axios.post(
        `${apiBaseUrl}/business/review`,
        {
          businessId: businessData._id, // Pass the business ID
          rating,
          text,
        },
        { withCredentials: true }
      );
  
      if (response.status === 201) {
        console.log("Review submitted successfully:", response.data);
        // Optionally update local state to display the new review immediately
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  

  return (
    <div className="business-page-container">
      <div className="business-info-wrapper">
        <BusinessInfo
          businessInfo={
            businessData
          } /* Checked businessInfo = business Object*/
        />
        <hr className="section-divider" />
        <LicenseSection /* Checked */ />
        <hr className="section-divider" />
        <AboutSection owner={businessData.owner} /* Checked owner = business Object*/ />
        <hr className="section-divider" />
        {/* <LocationHoursSection
          location={location}
          hours={businessData.openingHours} // Not ready yet! 
        />
        <hr className="section-divider" /> */}

        {/* User Rating Section */}
        {loggedInUser && (
          <>
            <UserRating
              /* Checked businessInfo = business Object*/
              userName={loggedInUser.name}
              businessName={businessData}
              overallRating={businessData.ratings}
              totalReviews={businessData.reviews.length}
              //ratingDistribution={ratingDistribution}
              onReviewSubmit={onReviewSubmit}
            />

            <hr className="section-divider" />
          </>
        )}

        {/* Customer Ratings Section */}
        <CustomerRating reviews={reviews} /* Checked */ />
      </div>

      <div className="contact-info-wrapper">
        <ContactInfo
          contactInfo={businessData}
          /* Checked contactInfo = business Object*/
        />
      </div>
    </div>
  );
}
