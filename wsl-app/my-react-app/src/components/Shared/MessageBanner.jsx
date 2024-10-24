import React from "react";
import "./MessageBanner.css";

const MessageBanner = ({ message, type }) => {
  if (!message) return null; // Don't render if no message
  if (type === "error") {
    return (
      <div className="error-banner">
        <p>{message}</p>
      </div>
    );
  }
  if (type === "success") {
    return (
      <div className="success-banner">
        <p>{message}</p>
      </div>
    );
  }
};

export default MessageBanner;
