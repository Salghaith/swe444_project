import React, { useState, useEffect, useContext } from "react";
import "./SearchForBusinesses.css";
import Sidebar from "../../components/UserPages/sidebar";
import workerIcon from "../../assets/worker-pic.svg";
import BusinessCard from "../../components/UserPages/BusinessCard";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../components/util/context";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const SearchForBusinesses = () => {
  const location = useLocation();
  const { apiBaseUrl } = useContext(UserContext);
  // const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");

  const [businesses, setBusinesses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  console.log("Category from URL:", category);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true); // Start loading
        setErrorMessage(""); // Reset error message

        const response = await axios.get(
          `${apiBaseUrl}/business/search?category=${category}`
        );

        if (response.data.length === 0) {
          setErrorMessage("No businesses found for this category");
        } else {
          setBusinesses(response.data); // Assuming API returns a list of businesses
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("Error fetching businesses");
      } finally {
        setLoading(false); // Stop loading after fetch is complete
      }
    };

    if (category) {
      setBusinesses([]); // Clear previous businesses
      fetchBusinesses();
    }
  }, [category]);

  // Function to handle page change
  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };
  // const [currentPage, setCurrentPage] = useState(1);
  // const postsPerPage = 1; // Number of posts to display per page
  // // Calculate total number of pages
  // const totalPages = Math.ceil(businesses.length / postsPerPage);

  // // Get the current posts to display
  // const currentPosts = businesses.slice(
  //   (currentPage - 1) * postsPerPage,
  //   currentPage * postsPerPage
  // );
  return (
    <div className="search-page">
      <div className="content-container">
        <Sidebar />
        <div className="post-section">
          <div className="post-header">
            <h2>{`Top 10 Best ${category} in Riyadh`}</h2>
            <select className="sort-dropdown">
              <option>Sort by</option>
              <option>Rating</option>
              <option>Most Popular</option>
              <option>Newest</option>
            </select>
          </div>

          <div className="posts">
            {loading && (
              <div className="loader">
                <CircularProgress color="black" />
              </div>
            )}
            {businesses.map((business, index) => (
              <BusinessCard
                business={business}
                key={index}
                index={index + 1}
                image={workerIcon} // Assuming you have a default image
                title={business.businessName}
                rating={business.ratings || 0}
                reviewers={business.reviews.length}
                description={business.description}
                openFrom={business.openingHours.from}
                openTo={business.openingHours.to}
              />
            ))}
          </div>
        </div>
        <Sidebar empty />
      </div>
    </div>
  );
};

export default SearchForBusinesses;
