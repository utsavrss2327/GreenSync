"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup, Marker, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { Activity, ShieldCheck, Clock, ExternalLink } from "lucide-react";

// Fix Leaflet default marker icons in Next.js
const customIcon = L.divIcon({
  className: "custom-pin",
  html: `<div style="background-color: #10b981; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(16,185,129,0.8);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

interface SaplingPlot {
  id: number;
  species: string;
  common_name: string;
  latitude: number;
  longitude: number;
  polygon: number[][];
  photo_url: string;
  planted_at: string;
  age_months: number;
  status: string;
  latest_index: string;
  latest_score: number;
  carbon_estimate: number;
}

interface MapComponentProps {
  selectedStatus?: string;
  onSelectPlot?: (plot: SaplingPlot) => void;
}

export default function MapComponent({ selectedStatus = "All" }: MapComponentProps) {
  const [plots, setPlots] = useState<SaplingPlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPlots = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/saplings");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPlots(data);
      } else {
        throw new Error("Empty plots array");
      }
    } catch (err) {
      console.warn("Using fallback plots for map:", err);
      // Resilient fallback dataset if backend isn't reachable
      setPlots([
        {
          id: 1,
          species: "Eucalyptus",
          common_name: "Eucalyptus Tereticornis",
          latitude: 28.7041,
          longitude: 77.1025,
          polygon: [
            [28.7038, 77.1021],
            [28.7044, 77.1021],
            [28.7044, 77.1029],
            [28.7038, 77.1029],
          ],
          photo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
          planted_at: "2025-10-01",
          age_months: 12,
          status: "Verified",
          latest_index: "NDVI",
          latest_score: 0.74,
          carbon_estimate: 1.5,
        },
        {
          id: 2,
          species: "Neem",
          common_name: "Azadirachta Indica",
          latitude: 28.7055,
          longitude: 77.1042,
          polygon: [
            [28.7052, 77.1038],
            [28.7058, 77.1038],
            [28.7058, 77.1046],
            [28.7052, 77.1046],
          ],
          photo_url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
          planted_at: "2026-04-01",
          age_months: 6,
          status: "Verified",
          latest_index: "MSAVI2",
          latest_score: 0.58,
          carbon_estimate: 0.6,
        },
        {
          id: 3,
          species: "Bamboo",
          common_name: "Bambusa Tulda",
          latitude: 28.7070,
          longitude: 77.1010,
          polygon: [
            [28.7067, 77.1006],
            [28.7073, 77.1006],
            [28.7073, 77.1014],
            [28.7067, 77.1014],
          ],
          photo_url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
          planted_at: "2026-07-01",
          age_months: 3,
          status: "Pending 3-month audit",
          latest_index: "N/A",
          latest_score: 0.0,
          carbon_estimate: 0.35,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  const filteredPlots = plots.filter((plot) => {
    if (selectedStatus === "All") return true;
    if (selectedStatus === "Verified") return plot.status === "Verified";
    if (selectedStatus === "Pending") return plot.status.includes("Pending");
    return true;
  });

  return (
    <div className="relative w-full h-[640px] rounded-xl overflow-hidden shadow-2xl">
      <MapContainer
        center={[28.7048, 77.1035]}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <LayersControl position="topright">
          {/* Base Layer: Satellite Imagery */}
          <LayersControl.BaseLayer checked name="Sentinel-2 / Satellite (ESRI World)">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Sentinel-2 Copernicus Multispectral"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          {/* Base Layer: OpenStreetMap */}
          <LayersControl.BaseLayer name="Street Map (OpenStreetMap)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {filteredPlots.map((plot) => {
          const isVerified = plot.status === "Verified";
          const isPending = plot.status.includes("Pending");
          const strokeColor = isVerified ? "#10b981" : isPending ? "#f59e0b" : "#ef4444";
          const fillColor = isVerified ? "#10b981" : isPending ? "#f59e0b" : "#ef4444";

          return (
            <div key={plot.id}>
              {/* Marker pin at plot centroid */}
              <Marker position={[plot.latitude, plot.longitude]} icon={customIcon} />

              {/* Plantation Plot Polygon */}
              <Polygon
                positions={plot.polygon as any}
                pathOptions={{
                  color: strokeColor,
                  weight: 2,
                  fillColor: fillColor,
                  fillOpacity: 0.45,
                }}
              >
                <Popup className="greensync-popup">
                  <div className="text-gray-900 w-64 p-1 space-y-3 font-sans">
                    {/* Plot Photo Preview */}
                    <div className="relative h-28 w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={plot.photo_url}
                        alt={plot.species}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-white backdrop-blur-sm">
                        Plot #{plot.id}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base text-gray-900">{plot.species}</h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isVerified
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {plot.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 italic">{plot.common_name}</p>
                    </div>

                    {/* Spectral Index Metrics */}
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spectral Index:</span>
                        <span className="font-mono font-bold text-teal-700">
                          {plot.latest_index !== "N/A" ? plot.latest_index : "MSAVI2 (Scheduled)"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Veg. Score:</span>
                        <span className="font-mono font-bold text-emerald-700">
                          {plot.latest_score > 0 ? plot.latest_score.toFixed(3) : "Pending"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CO₂ Sequestered:</span>
                        <span className="font-mono font-bold text-gray-800">
                          {plot.carbon_estimate} tons
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plot Age:</span>
                        <span className="text-gray-700">{plot.age_months} Months</span>
                      </div>
                    </div>

                    {/* Action link */}
                    <Link
                      href="/audits"
                      className="w-full py-1.5 px-3 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Activity size={13} className="text-emerald-400" />
                      <span>Growth Audit History</span>
                    </Link>
                  </div>
                </Popup>
              </Polygon>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
