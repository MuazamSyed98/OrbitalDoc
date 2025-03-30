import React from "react";

const SummaryBox = ({ result, startDate, endDate, regionBounds }) => {
  if (!result) {
    return (
      <div
        style={{
          backgroundColor: "#F9F9F9",
          padding: "1rem",
          borderRadius: "8px",
          border: "2px dashed #CCCCCC",
          textAlign: "center",
          color: "#666666",
          fontStyle: "italic",
        }}
      >
        📊 No analysis results yet. Perform an analysis to see the summary.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#E8FCE8",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginTop: "1.5rem",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <h3
        style={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          marginBottom: "1rem",
          color: "#2E7D32",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            background: "linear-gradient(45deg, #4CAF50, #81C784)",
            padding: "0.5rem",
            borderRadius: "50%",
            display: "inline-block",
          }}
        >
          📊
        </span>
        Analysis Summary
      </h3>

      {/* Date Range Box */}
      {startDate && endDate ? (
        <div
          style={{
            display: "inline-block",
            border: "1px solid #B9F6CA",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
            backgroundColor: "#F1F8E9",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#424242",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Date Range:
          </p>
          <p
            style={{
              margin: 0,
              color: "#1B5E20",
              textAlign: "center",
            }}
          >
            {startDate?.toLocaleDateString()} – {endDate?.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p style={{ color: "#666666", fontStyle: "italic" }}>No date range selected.</p>
      )}

      {/* Region Bounds Box */}
      {regionBounds ? (
        <div
          style={{
            display: "inline-block",
            border: "1px solid #B9F6CA",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
            backgroundColor: "#F1F8E9",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#424242",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Region Bounds:
          </p>
          <p
            style={{
              margin: 0,
              color: "#1B5E20",
              textAlign: "center",
            }}
          >
            South-West: [{regionBounds[0][0].toFixed(2)}, {regionBounds[0][1].toFixed(2)}]
          </p>
          <p
            style={{
              margin: 0,
              color: "#1B5E20",
              textAlign: "center",
            }}
          >
            North-East: [{regionBounds[1][0].toFixed(2)}, {regionBounds[1][1].toFixed(2)}]
          </p>
        </div>
      ) : (
        <p style={{ color: "#666666", fontStyle: "italic" }}>No region selected.</p>
      )}

      {/* Change Score */}
      <p style={{ margin: "0.5rem 0", color: "#424242" }}>
        <strong>Change Score:</strong>{" "}
        <span style={{ color: "#FF5722", fontWeight: "bold", fontSize: "1.2rem" }}>
          {result.change_score}
        </span>
      </p>

      {/* Message */}
      <p style={{ margin: "0.5rem 0", color: "#424242" }}>
        <strong>Message:</strong>{" "}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#2E7D32",
          }}
        >
          ✅ {result.message}
        </span>
      </p>
    </div>
  );
};

export default SummaryBox;