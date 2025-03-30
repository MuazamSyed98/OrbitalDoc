import React, { useState } from "react";
import { MapContainer, TileLayer, Rectangle, useMapEvents } from "react-leaflet";

const MapViewer = ({ onSelectBounds }) => {
  const [clicks, setClicks] = useState([]);
  const [bounds, setBounds] = useState(null);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const newClicks = [...clicks, [lat, lng]];

        if (newClicks.length === 2) {
          const sw = newClicks[0];
          const ne = newClicks[1];
          const selectedBounds = [
            [Math.min(sw[0], ne[0]), Math.min(sw[1], ne[1])], // bottom-left
            [Math.max(sw[0], ne[0]), Math.max(sw[1], ne[1])]  // top-right
          ];

          setBounds(selectedBounds);
          onSelectBounds(selectedBounds); // Send to App.js
          setClicks([]); // Reset for new selection
        } else {
          setClicks(newClicks);
        }
      }
    });

    return null;
  };

  return (
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
      {bounds && <Rectangle bounds={bounds} pathOptions={{ color: "blue" }} />}
    </MapContainer>
  );
};

export default MapViewer;
