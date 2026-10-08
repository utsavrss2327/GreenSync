"use client";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for leaflet icons in next.js
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapComponent() {
  // Mock data for hackathon demo
  const mockPolygons = [
    {
      id: 1,
      species: "Eucalyptus",
      status: "Verified",
      index_used: "MSAVI2",
      score: 0.65,
      co2: "1.2 tons",
      coords: [
        [28.7041, 77.1025],
        [28.7045, 77.1025],
        [28.7045, 77.1030],
        [28.7041, 77.1030],
      ],
    },
    {
      id: 2,
      species: "Oak",
      status: "Pending 3-month audit",
      index_used: "N/A",
      score: null,
      co2: "0.1 tons",
      coords: [
        [28.7051, 77.1045],
        [28.7055, 77.1045],
        [28.7055, 77.1050],
        [28.7051, 77.1050],
      ],
    }
  ];

  return (
    <MapContainer 
      center={[28.7041, 77.1025] as any} 
      zoom={15} 
      scrollWheelZoom={false}
      style={{ height: "600px", width: "100%", borderRadius: "0.75rem", zIndex: 10 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Sentinel-2 Satellite Base Layer (mock using ESRI World Imagery for demo) */}
      <TileLayer
        attribution='Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        opacity={0.6}
      />
      
      {mockPolygons.map((plot) => (
        <Polygon 
          key={plot.id} 
          positions={plot.coords as any} 
          pathOptions={{ 
            color: plot.status === "Verified" ? "#10b981" : "#f59e0b",
            fillOpacity: 0.5 
          }}
        >
          <Popup>
            <div className="text-gray-800">
              <h3 className="font-bold text-lg">{plot.species} Plot</h3>
              <p><strong>Status:</strong> {plot.status}</p>
              <p><strong>Satellite Index:</strong> {plot.index_used}</p>
              {plot.score && <p><strong>Score:</strong> {plot.score}</p>}
              <p><strong>CO2 Sequestered:</strong> {plot.co2}</p>
            </div>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
}
