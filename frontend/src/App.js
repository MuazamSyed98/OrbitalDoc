import React, { useState, useEffect } from "react";
import axios from "axios";
import MapViewer from "./components/MapViewer";
import DatePickerPanel from "./components/DatePickerPanel";
import LoadingSpinner from "./components/LoadingSpinner";
import ImageSlider from "./components/ImageSlider";
import SummaryBox from "./components/SummaryBox";
import ScoreBox from "./components/ScoreBox";
import "leaflet/dist/leaflet.css";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import "./styles/OrbitalDoc.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [regionBounds, setRegionBounds] = useState(null);
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleAnalyze = () => {
    setError("");         // Clear previous error
    setResult(null);      // Clear previous result
    setLoading(true);     // Show loading spinner
  
    if (!regionBounds || !startDate || !endDate) {
      alert("Please select both a region and date range.");
      setLoading(false);
      return;
    }
  
    if (startDate > endDate) {
      alert("Start date must be before end date.");
      setLoading(false);
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
      })
      .finally(() => {
        setLoading(false); // Hide loading spinner
      });
  };
  
  if (loading) return <LoadingSpinner />;

  return (
    <div className={`orbitaldoc-wrapper ${darkMode ? "dark-mode" : ""}`}>
      <div className="orbitaldoc-container">
        <div className="orbitaldoc-header">
          <h1 className="orbitaldoc-title">OrbitalDoc</h1>
          <div className="header-right">
            <span className="orbitaldoc-subtitle">Change Detection</span>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        <MapViewer onSelectBounds={setRegionBounds} />

        <div className="orbitaldoc-dates">
          <div className="orbitaldoc-date-block">
            <label>Date 1</label>
            <input
              type="date"
              value={startDate ? startDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div className="orbitaldoc-date-block">
            <label>Date 2</label>
            <input
              type="date"
              value={endDate ? endDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
          <button className="orbitaldoc-analyze-btn" onClick={handleAnalyze}>
            Analyze
          </button>
        </div>

        {error && <div className="orbitaldoc-error">{error}</div>}
        {result && (
          <div className="orbitaldoc-success">
            {result.message || "Satellite images fetched successfully"}
          </div>
        )}

        <div className="orbitaldoc-image-score-wrapper">
          <ImageSlider
            before={beforeImage}
            after={afterImage}
            dateFrom={startDate?.toISOString().split("T")[0]}
            dateTo={endDate?.toISOString().split("T")[0]}
          />
          <ScoreBox score={result?.change_score} />
        </div>

        <SummaryBox
          result={result}
          startDate={startDate}
          endDate={endDate}
          regionBounds={regionBounds}
        />
      </div>
    </div>
  );
}

export default App;
