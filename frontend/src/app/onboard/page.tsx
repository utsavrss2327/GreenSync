"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  UploadCloud, 
  LocateFixed, 
  CheckCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Camera, 
  MapPin, 
  Activity, 
  Layers, 
  Sparkles,
  Info
} from "lucide-react";

export default function Onboard() {
  const [species, setSpecies] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [registeredData, setRegisteredData] = useState<any>(null);

  const sampleSpecies = [
    "Neem (Azadirachta indica)",
    "Bamboo (Bambusa tulda)",
    "Eucalyptus (Tereticornis)",
    "Teak (Tectona grandis)",
    "Banyan (Ficus benghalensis)",
    "Moringa (Oleifera)"
  ];

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: parseFloat(position.coords.latitude.toFixed(6)),
            lng: parseFloat(position.coords.longitude.toFixed(6)),
          });
        },
        (error) => {
          console.warn("GPS failed, using sample afforestation coordinates in Delhi.");
          setLocation({ lat: 28.7041, lng: 77.1025 });
        }
      );
    } else {
      setLocation({ lat: 28.7041, lng: 77.1025 });
    }
  };

  const handleUseDemoSample = () => {
    setSpecies("Bamboo (Bambusa tulda)");
    setLocation({ lat: 28.7065, lng: 77.1030 });
    setDemoMode(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!species) return alert("Please specify the tree species.");
    if (!location) return alert("Please capture or specify GPS coordinates.");
    if (!file && !demoMode) return alert("Please select or capture a sapling photo.");

    setStatus("loading");
    const formData = new FormData();
    formData.append("species", species.split(" (")[0]);
    formData.append("latitude", location.lat.toString());
    formData.append("longitude", location.lng.toString());
    formData.append("demo_mode", demoMode ? "true" : "false");

    if (file) {
      formData.append("file", file);
    } else if (demoMode) {
      // Create a dummy JPEG blob for desktop testing if no file selected
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#10b981";
        ctx.fillRect(0, 0, 100, 100);
      }
      canvas.toBlob((blob) => {
        if (blob) {
          const dummyFile = new File([blob], "demo_sapling.jpg", { type: "image/jpeg" });
          formData.append("file", dummyFile);
          executeUpload(formData);
        }
      }, "image/jpeg");
      return;
    }

    await executeUpload(formData);
  };

  const executeUpload = async (formData: FormData) => {
    try {
      const res = await fetch("http://localhost:8000/api/onboard-sapling", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setRegisteredData(data.data);
      } else {
        setStatus("error");
        setMessage(data.detail || "Verification failed");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Failed to reach verification backend service.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-8 sm:py-12 px-4">
      <div className="w-full max-w-xl bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 p-6 sm:p-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
            <Camera size={13} />
            <span>FR-1: Field Sapling Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Register Sapling Plot
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Capture field photos with GPS sensors. Backend algorithms inspect raw EXIF metadata to eliminate spoofed greenwashing.
          </p>
        </div>

        {/* Success Screen */}
        {status === "success" && registeredData ? (
          <div className="p-6 rounded-2xl bg-gray-800/80 border border-gray-700 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle size={36} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">Plot Successfully Boarded!</h2>
              <p className="text-xs text-emerald-400 font-mono mt-1">
                Plot #{registeredData.id} • {registeredData.species}
              </p>
              <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">
                {message}
              </p>
            </div>

            <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-800 text-left text-xs font-mono space-y-1.5 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Verified Coordinates:</span>
                <span className="text-white">
                  {registeredData.verified_latitude}, {registeredData.verified_longitude}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Scheduled Audit:</span>
                <span className="text-cyan-400 font-bold">3-Month (MSAVI2)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Audit Automation:</span>
                <span className="text-emerald-400">Scheduled (Zero Human Touch)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/explorer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
              >
                <Layers size={14} />
                <span>View on Explorer Map</span>
              </Link>
              <Link
                href="/audits"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-gray-700"
              >
                <Activity size={14} className="text-cyan-400" />
                <span>Audit Dashboard</span>
              </Link>
            </div>

            <button
              onClick={() => {
                setStatus("idle");
                setRegisteredData(null);
                setSpecies("");
                setFile(null);
              }}
              className="text-xs text-gray-400 hover:text-white transition-colors underline pt-2 block mx-auto"
            >
              + Register Another Sapling
            </button>
          </div>
        ) : (
          /* Onboarding Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Demo / Testing Quick Fill */}
            <div className="bg-gray-800/60 p-3.5 rounded-xl border border-gray-700/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400 shrink-0" />
                <span className="text-xs text-gray-300">
                  Testing during presentation? Auto-fill sample field data:
                </span>
              </div>
              <button
                type="button"
                onClick={handleUseDemoSample}
                className="px-3 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg shrink-0 transition-colors"
              >
                Auto-Fill Sample
              </button>
            </div>

            {/* Tree Species */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider font-mono">
                Tree Species / Cultivar
              </label>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g. Bamboo, Neem, Eucalyptus"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-gray-600 transition-colors"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {sampleSpecies.map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSpecies(sp)}
                    className="px-2.5 py-1 rounded-md text-[11px] bg-gray-800/80 hover:bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700/60 transition-colors"
                  >
                    {sp.split(" (")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* GPS Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider font-mono">
                Device GPS Coordinates
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : ""}
                  placeholder="Click to acquire sensor GPS"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-300 cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="px-4 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-xl border border-emerald-500/30 transition-colors flex items-center justify-center shrink-0"
                  title="Detect GPS"
                >
                  <LocateFixed size={18} />
                </button>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Acquires device hardware coordinates to match against photo EXIF metadata.
              </span>
            </div>

            {/* Photo Capture */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider font-mono">
                Field Photo (Camera Capture)
              </label>
              <div className="relative border-2 border-dashed border-gray-700 hover:border-emerald-500/60 rounded-2xl p-6 text-center cursor-pointer bg-gray-950 transition-colors group">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud
                  size={32}
                  className="mx-auto mb-2 text-gray-500 group-hover:text-emerald-400 transition-colors"
                />
                <p className="text-xs font-medium text-gray-300">
                  {file ? file.name : "Tap to capture from camera or choose photo"}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">JPEG / PNG accepted</p>
              </div>
            </div>

            {/* Anti-spoofing demo mode toggle */}
            <div className="p-3.5 rounded-xl bg-gray-950/80 border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-white block">
                    Simulate Live Mobile Camera EXIF
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Enable for desktop demo without physical mobile GPS sensors
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={(e) => setDemoMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Error Message */}
            {status === "error" && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl font-bold text-gray-950 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 text-sm active:scale-[0.99]"
            >
              {status === "loading"
                ? "Verifying EXIF & registering plot..."
                : "Register & Initialize Baseline"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
