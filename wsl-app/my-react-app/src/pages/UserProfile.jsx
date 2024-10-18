import React, { useState, useContext, useEffect } from "react";
import "./UserProfile.css";
import "./editCard.css";
import { UserContext } from "../components/util/context";
import { useNavigate } from "react-router-dom";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
} from "../components/util/validators";
import axios from "axios";

const UserProfile = () => {
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    //To prevent unauth users from reaching this page.
    if (!loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser, navigate]);


  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(loggedInUser ? loggedInUser.name : "");
  const [email, setEmail] = useState(loggedInUser ? loggedInUser.email : "");
  const [password, setPassword] = useState("password");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  if (!loggedInUser) {
    return <div>Redirecting...</div>;
  }
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length === 0) {
      try{
        const response = await axios.put('http://localhost:3001/api/user/update', {
          name,
          email,
          password
        }, { withCredentials: true });

      localStorage.setItem('currentUser', JSON.stringify(response.data));
      setIsEditing(false);
      setErrors({}); // Clear errors on successful submission

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 5000); // Message disappears after 5 seconds
      }catch(error){
        setErrors({ general: 'Failed to update profile' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";

    return newErrors;
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="profile-title">User Profile</h2>
        <div className="profile-field">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            className={isEditing ? "editable" : ""}
            style={{ color: isEditing ? "black" : "grey" }} // Dynamic placeholder color
          />
        </div>
        <div className="profile-field">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
            className={isEditing ? "editable" : ""}
            style={{ color: isEditing ? "black" : "grey" }}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="profile-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isEditing}
            className={isEditing ? "editable" : ""}
            style={{ color: isEditing ? "black" : "grey" }}
          />
        </div>

        <div className="button-container">
          <button className="edit-btn" onClick={handleEditClick}>
            Edit
          </button>
          {isEditing && (
            <button className="save-btn" onClick={handleSaveClick}>
              Submit
            </button>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
