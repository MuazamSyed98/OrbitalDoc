import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapViewer = () => {
  return (
    <div>
      <h3>🗺️ Select a Region</h3>
      <MapContainer
        center={[50.1109, -85.4121]} // Somewhere central in Ontario
        zoom={5}
        style={{ height: "400px", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default MapViewer;
