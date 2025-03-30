import React from "react";

const ImageSlider = ({ before, after, dateFrom, dateTo }) => {
  return (
    <div className="orbitaldoc-image-container">
      <div className="orbitaldoc-image-row">
        <div className="orbitaldoc-image-box before">
          {before ? (
            <img src={before} alt="Before" className="orbitaldoc-image" />
          ) : (
            <div className="orbitaldoc-image-placeholder">Before Image</div>
          )}
        </div>

        <div className="orbitaldoc-image-divider">➤</div>

        <div className="orbitaldoc-image-box after">
          {after ? (
            <img src={after} alt="After" className="orbitaldoc-image" />
          ) : (
            <div className="orbitaldoc-image-placeholder">After Image</div>
          )}
        </div>
      </div>

      <div className="orbitaldoc-image-labels">
        <div className="orbitaldoc-date-label">{dateFrom || "Date 1"}</div>
        <div className="orbitaldoc-date-label">{dateTo || "Date 2"}</div>
      </div>
    </div>
  );
};

export default ImageSlider;
