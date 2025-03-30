import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Rectangle, useMapEvents } from "react-leaflet";


const MapViewer = ({ onSelectBounds }) => {
  const [clicks, setClicks] = useState([]);
  const [bounds, setBounds] = useState(null);

  const MapClickHandler = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const newClicks = [...clicks, [lat, lng]];

        if (newClicks.length === 2) {
          const sw = newClicks[0];
          const ne = newClicks[1];
          const selectedBounds = [
            [Math.min(sw[0], ne[0]), Math.min(sw[1], ne[1])], // bottom-left
            [Math.max(sw[0], ne[0]), Math.max(sw[1], ne[1])] // top-right
          ];

          setBounds(selectedBounds);
          onSelectBounds(selectedBounds); // Pass bounds to App.js
          setClicks([]); // Reset clicks for a new selection
        } else {
          setClicks(newClicks);
        }
      }
    });

    return null;
  };

  // Zoom/pan the map to fit the selected region when bounds are updated
  useEffect(() => {
    const map = document.querySelector(".leaflet-container")?.__reactLeaflet?.map;
    if (bounds && map) {
      map.fitBounds(bounds);
    }
  }, [bounds]);

  return (
    <div>
      <MapContainer
        center={[45.4215, -75.6972]}
        zoom={6}
        style={{ height: "400px", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {bounds && (
          <Rectangle
            bounds={bounds}
            pathOptions={{ color: "blue", weight: 2 }}
          />
        )}
      </MapContainer>

      {/* Clear Selection Button */}
      {bounds && (
        <button
          onClick={() => {
            setBounds(null);
            onSelectBounds(null); // Inform App.js about the reset
          }}
          style={{
            marginTop: "0.5rem",
            padding: "0.4rem 0.8rem",
            backgroundColor: "#ffdddd",
            border: "1px solid #cc0000",
            borderRadius: "5px",
            color: "#cc0000",
            cursor: "pointer",
          }}
        >
          🧹 Clear Selection
        </button>
      )}
    </div>
  );
};

export default MapViewer;