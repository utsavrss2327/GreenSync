"use client";
import { useState } from "react";
import { UploadCloud, LocateFixed, CheckCircle } from "lucide-react";

export default function Onboard() {
  const [species, setSpecies] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.warn("GPS blocked or failed, using fallback location for demo purposes.");
          // Fallback to a mock location (e.g. New Delhi) so the demo doesn't get blocked
          setLocation({ lat: 28.7041, lng: 77.1025 });
          alert("Could not access physical GPS. Using a mock location for the demo.");
        }
      );
    } else {
      setLocation({ lat: 28.7041, lng: 77.1025 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !location || !species) return alert("Please fill all fields.");

    setStatus("loading");
    const formData = new FormData();
    formData.append("species", species);
    formData.append("latitude", location.lat.toString());
    formData.append("longitude", location.lng.toString());
    formData.append("file", file);

    try {
      // In production, this points to the deployed FastAPI URL
      const res = await fetch("http://localhost:8000/api/onboard-sapling", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.detail || "Verification failed");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Failed to connect to verification server.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
        <h1 className="text-3xl font-bold mb-2 text-emerald-400">Onboard Sapling</h1>
        <p className="text-gray-400 text-sm mb-8">Register a new plantation plot. The system will extract EXIF metadata to ensure zero spoofing.</p>

        {status === "success" ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle size={64} className="text-emerald-400 mx-auto" />
            <h2 className="text-2xl font-semibold">Verified!</h2>
            <p className="text-gray-400">{message}</p>
            <p className="text-sm text-teal-400">Automated MSAVI2 satellite audits will now track this plot every 3 months.</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Register Another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tree Species</label>
              <input 
                type="text" 
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g. Eucalyptus, Bamboo, Oak"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GPS Coordinates</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : ""}
                  placeholder="Click to get location"
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                />
                <button type="button" onClick={handleGetLocation} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center justify-center">
                  <LocateFixed size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sapling Photo (With EXIF)</label>
              <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer bg-gray-900 group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud size={32} className="mx-auto mb-2 text-gray-500 group-hover:text-emerald-400" />
                <p className="text-sm text-gray-400">{file ? file.name : "Tap to capture or upload"}</p>
              </div>
            </div>

            {status === "error" && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === "loading"}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl font-semibold text-white shadow-lg transition-all disabled:opacity-50"
            >
              {status === "loading" ? "Verifying anti-spoofing..." : "Register & Create Baseline"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
