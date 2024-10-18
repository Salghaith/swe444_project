import React, { useContext, useState } from "react";
import "./Auth.css";
import axios from "axios";
import logo from "../../assets/logoWSL.svg";
import userIcon from "../../assets/username-icon.svg";
import emailIcon from "../../assets/email-icon.svg";
import lockIcon from "../../assets/lock-icon.svg";
import homePic from "../../assets/home-picture2.svg";
import Input from "../../components/FormElement/Input.jsx";
import ErrorBanner from "../../components/ErrorBanner.jsx";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
} from "../../components/util/validators.jsx";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../components/util/context.js";
import Button from "../../components/FormElement/Button.jsx";

const Auth = ({ formValidity, onValidityChange }) => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const { login } = useContext(UserContext);

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    let username = "";
    if (!isLoginMode) {
      username = event.target.username.value;
    }
    let email = event.target.email.value;
    let password = event.target.password.value;

    if (!email || !password || (!isLoginMode && !username)) {
      setErrorMessage("Please fill out all required fields.");
      return; // Prevent form submission
    }

    try {
      if (isLoginMode) {
        // Login Mode
        const response = await axios.post(
          "http://localhost:3001/api/auth/login",
          {
            email,
            password,
          },
          { withCredentials: true }
        );

        login(response.data);
        navigate("/");
        console.log("Login successful:", response.data);
        // Save the JWT token or session data
        // localStorage.setItem('token', response.data.token);
        // Redirect user to the dashboard or home page
      } else {
        // Register Mode
        const res = await axios.post(
          "http://localhost:3001/api/auth/register",
          {
            name: username,
            email,
            password,
          },
          { withCredentials: true }
        );
        login(res.data);
        navigate("/");
        // Handle post-registration logic (e.g., auto-login, redirect)
      }
    } catch (error) {
      if (error.response) {
        // If the server sends a meaningful error message
        setErrorMessage(error.response.data || "An unknown error occurred");
      } else {
        // General error
        setErrorMessage("An error occurred. Please try again.");
        console.log(error);
      }
      // Display error message to the user
    }
  };

  const isFormValid = isLoginMode
    ? formValidity.email && formValidity.password
    : formValidity.username && formValidity.email && formValidity.password;

  return (
    <div className="auth-container">
      <div className="left-section">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="WSL Logo" />
          </Link>
        </div>
        <div className="content">
          <div className="header">
            {isLoginMode ? "Login into" : "Register"} your account
          </div>
          <form className="form-content" onSubmit={authSubmitHandler}>
            {/* Display the error message using ErrorBanner */}
            {errorMessage && <ErrorBanner message={errorMessage} type="error"/>}
            <div className="username">
              {!isLoginMode && (
                <React.Fragment>
                  <label htmlFor="username">Name</label>
                  <div className="input-group">
                    <Input
                      element="input"
                      type="text"
                      id="username"
                      placeholder="Mohammed"
                      validators={[
                        VALIDATOR_MINLENGTH(3),
                        VALIDATOR_MAXLENGTH(40),
                      ]}
                      errorText="Please Enter A Valid Name! (between 3 and 40 chars)"
                      onValidityChange={onValidityChange}
                    />
                    <span className="icon-container">
                      <img src={userIcon} alt="icon" />
                    </span>
                  </div>
                </React.Fragment>
              )}
            </div>

            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <Input
                element="input"
                type="email"
                id="email"
                placeholder="alex@gmail.com"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please Enter A Valid Email! (e.g: alex@gmail.com)"
                onValidityChange={onValidityChange}
              />
              <span className="icon-container">
                <img src={emailIcon} alt="icon" />
              </span>
            </div>
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <Input
                element="input"
                type="password"
                id="password"
                placeholder="Enter your password"
                validators={[VALIDATOR_MINLENGTH(6), VALIDATOR_MAXLENGTH(20)]}
                errorText="Please Enter A Valid Password! (between 6 and 20 chars)"
                onValidityChange={onValidityChange}
              />
              <span className="icon-container">
                <img src={lockIcon} alt="icon" />
              </span>
            </div>

            {isLoginMode && (
              <React.Fragment>
                <div className="link-container">
                  <a>Forgot Password?</a>
                </div>
              </React.Fragment>
            )}

            <Button
              type="submit"
              className={`form-btn ${!isLoginMode && "register"}`}
              disabled={!isFormValid}
            >
              {isLoginMode ? "Login" : "Register"}
            </Button>
            <div className="divider">OR</div>
            <Button
              type="button"
              onClick={switchModeHandler}
              hoverInverse={true}
              className="form-btn signup"
            >
              {!isLoginMode ? "Login" : "Signup"}
            </Button>
            <div className="divider">Are you a business?</div>
            {!isLoginMode && (
              <Link to="/business/register">
                <Button type="button" hoverInverse={true} className="form-btn">
                  Register your business
                </Button>
              </Link>
            )}
          </form>
        </div>
      </div>
      <div className="right-section">
        <img src={homePic} alt="icon" />
      </div>
    </div>
  );
};

export default Auth;