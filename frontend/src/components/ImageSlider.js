import React from "react";

const ImageSlider = ({ before, after }) => {
  return (
    <div style={{ padding: "1rem", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
      <h3>🖼️ Before & After Image Preview</h3>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {before ? (
          <div style={{ textAlign: "center" }}>
            <p><strong>Before</strong></p>
            <img
              src={before}
              alt="Before"
              style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>
        ) : (
          <p style={{ color: "#999" }}>No before image yet.</p>
        )}

        {after ? (
          <div style={{ textAlign: "center" }}>
            <p><strong>After</strong></p>
            <img
              src={after}
              alt="After"
              style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>
        ) : (
          <p style={{ color: "#999" }}>No after image yet.</p>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;
