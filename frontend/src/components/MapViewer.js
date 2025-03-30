import React, { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Rectangle,
  useMap,
  useMapEvents,
} from "react-leaflet";

const MapClickHandler = ({ clicks, setClicks, setBounds, onSelectBounds }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newClicks = [...clicks, [lat, lng]];

      if (newClicks.length === 2) {
        const sw = newClicks[0];
        const ne = newClicks[1];
        const selectedBounds = [
          [Math.min(sw[0], ne[0]), Math.min(sw[1], ne[1])],
          [Math.max(sw[0], ne[0]), Math.max(sw[1], ne[1])],
        ];

        setBounds(selectedBounds);
        onSelectBounds(selectedBounds);
        setClicks([]);
      } else {
        setClicks(newClicks);
      }
    },
  });

  return null;
};

const FitBoundsOnChange = ({ bounds }) => {
  const map = useMap();
  if (bounds) map.fitBounds(bounds);
  return null;
};

const MapViewer = ({ onSelectBounds }) => {
  const [clicks, setClicks] = useState([]);
  const [bounds, setBounds] = useState(null);

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
        <MapClickHandler
          clicks={clicks}
          setClicks={setClicks}
          setBounds={setBounds}
          onSelectBounds={onSelectBounds}
        />
        {bounds && (
          <>
            <Rectangle bounds={bounds} pathOptions={{ color: "blue", weight: 2 }} />
            <FitBoundsOnChange bounds={bounds} />
          </>
        )}
      </MapContainer>

      {/* Clear Selection Button */}
      {bounds && (
        <button
          onClick={() => {
            setBounds(null);
            onSelectBounds(null);
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
