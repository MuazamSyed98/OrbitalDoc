// components/LoadingSpinner.js
import React from "react";
import "../styles/OrbitalDoc.css";

const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner" />
      <p>Analyzing satellite images...</p>
    </div>
  );
};

export default LoadingSpinner;
