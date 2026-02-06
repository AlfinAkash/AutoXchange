import React from "react";
import "./BookLoader.css";

const BookLoader = () => {
  return (
    <div className="loader-wrapper">
      {/* Bike running animation */}
      {/* <div className="bike-track">
        <i className="bi bi-bicycle bike-icon"></i>
      </div> */}

      {/* Text-filled progress bar */}
      <div className="progress-bar">
        <div className="progress-fill fw-5">
          AutoXchange
        </div>
      </div>

      <div className="book-part top-part"></div>
      <div className="book-part bottom-part"></div>
    </div>
  );
};

export default BookLoader;
