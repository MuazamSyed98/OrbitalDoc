import React, { useState } from "react";
import axios from "axios";
import MapViewer from "./components/MapViewer";
import DatePickerPanel from "./components/DatePickerPanel";
import ImageSlider from "./components/ImageSlider";
import SummaryBox from "./components/SummaryBox";
import "leaflet/dist/leaflet.css";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [regionBounds, setRegionBounds] = useState(null);

  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

  const handleAnalyze = () => {
    if (!regionBounds || !startDate || !endDate) {
      alert("Please select both a region and date range.");
      return;
    }

    if (startDate > endDate) {
      alert("Start date must be before end date.");
      return;
    }

    axios
      .post("http://localhost:5000/api/fetch-satellite", {
        bounds: regionBounds,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      })
      .then((res) => {
        console.log("🛰️ Analysis Result:", res.data);
        setResult(res.data);
        if (res.data.beforeImage && res.data.afterImage) {
          setBeforeImage(`http://localhost:5000/${res.data.beforeImage}`);
          setAfterImage(`http://localhost:5000/${res.data.afterImage}`);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Failed to fetch satellite data");
      });
  };

  return (
    <div className="App" style={{ padding: "1rem" }}>
      <h1>🛰️ OrbitalDoc – Satellite Change Detection</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      {result && (
        <div
          style={{
            marginBottom: "1rem",
            backgroundColor: "#e8ffe8",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>Change Score:</strong> {result.change_score}
          </p>
          <p>{result.message}</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <MapViewer onSelectBounds={setRegionBounds} />
        <DatePickerPanel
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <ImageSlider before={beforeImage} after={afterImage} />
        <SummaryBox />
        {regionBounds && startDate && endDate && (
          <button
            onClick={handleAnalyze}
            style={{ marginTop: "1rem", padding: "0.6rem 1rem" }}
          >
            🚀 Start Analysis
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
