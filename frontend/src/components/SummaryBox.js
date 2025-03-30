import React from "react";

const SummaryBox = ({ result, startDate, endDate, regionBounds }) => {
  if (!result) {
    return (
      <div className="orbitaldoc-summary orbitaldoc-summary-box" style={{ textAlign: "center", fontStyle: "italic" }}>
        No analysis results yet. Perform an analysis to see the summary.
      </div>
    );
  }

  return (
    <div className="orbitaldoc-summary">
      <h3>
        <span
          style={{
            background: "linear-gradient(45deg, #4CAF50, #81C784)",
            padding: "0.5rem",
            borderRadius: "50%",
          }}
        >
          📊
        </span>
        Analysis Summary
      </h3>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        {/* Date Range */}
        {startDate && endDate && (
          <div className="orbitaldoc-summary-box">
            <p className="orbitaldoc-summary-label">Date Range:</p>
            <p className="orbitaldoc-summary-value">
              {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Region Bounds */}
        {regionBounds && (
          <div className="orbitaldoc-summary-box">
            <p className="orbitaldoc-summary-label">Region Bounds:</p>
            <p className="orbitaldoc-summary-value">
              South-West: [{regionBounds[0][0].toFixed(2)}, {regionBounds[0][1].toFixed(2)}]
            </p>
            <p className="orbitaldoc-summary-value">
              North-East: [{regionBounds[1][0].toFixed(2)}, {regionBounds[1][1].toFixed(2)}]
            </p>
          </div>
        )}
      </div>

      {/* Scores */}
      <p>
        <strong>Change Score:</strong>{" "}
        <span className="orbitaldoc-summary-score">{result.change_score}</span>
      </p>
      <p>
        <strong>Pixel Change Count:</strong> {result.pixel_change_count}
      </p>
      <p>
        <strong>Cloud Coverage (%):</strong> {result.cloud_coverage_percentage}
      </p>
      <p>
        <strong>AI Detected Substantial Change:</strong>{" "}
        <span style={{ color: "#4caf50", fontWeight: "bold" }}>
          ✅ {result.ai_prediction ? "Yes" : "No"}
        </span>
      </p>
      <p>
        <strong>Message:</strong>{" "}
        <span style={{ color: "#2e7d32" }}>✅ {result.message}</span>
      </p>
    </div>
  );
};

export default SummaryBox;
