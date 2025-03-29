import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    axios.get("http://localhost:5000/api/test-detection")
      .then((res) => setResult(res.data))
      .catch((err) => setError("⚠️ Could not connect to backend"));
  }, []);

  return (
    <div className="App" style={{ padding: "1rem" }}>
      <h1>🛰️ OrbitalDoc – Satellite Change Detection</h1>
      
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      {result && (
        <div style={{ marginBottom: "1rem", backgroundColor: "#e8ffe8", padding: "1rem", borderRadius: "8px" }}>
          <p><strong>Change Score:</strong> {result.change_score}</p>
          <p>{result.message}</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <MapViewer />
        <DatePickerPanel />
        <ImageSlider />
        <SummaryBox />
      </div>
    </div>
  );
}

export default App;
