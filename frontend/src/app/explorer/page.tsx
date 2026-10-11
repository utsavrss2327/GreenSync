"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Map as MapIcon, 
  Satellite, 
  ShieldCheck, 
  PlusCircle, 
  Activity, 
  Layers, 
  TrendingUp,
  TreeDeciduous,
  Filter
} from "lucide-react";

// Dynamically import Map to prevent SSR window errors
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[640px] w-full flex flex-col items-center justify-center bg-gray-900 border border-gray-800 rounded-2xl animate-pulse text-gray-400 gap-3">
      <Satellite className="w-8 h-8 text-teal-400 animate-spin" />
      <span className="text-sm font-mono">Loading Copernicus Sentinel-2 Geospatial Layers...</span>
    </div>
  ),
});

interface Stats {
  total_trees: number;
  total_plots: number;
  verified_plots: number;
  pending_audits: number;
  total_co2_tons: number;
  avg_vegetation_score: number;
}

export default function Explorer() {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [stats, setStats] = useState<Stats>({
    total_trees: 300,
    total_plots: 5,
    verified_plots: 3,
    pending_audits: 2,
    total_co2_tons: 3.44,
    avg_vegetation_score: 0.613,
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.total_trees) setStats(data);
      })
      .catch((err) => console.log("Stats fetch:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono mb-2">
              <Layers size={13} />
              <span>FR-5: Interactive Afforestation Explorer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Interactive Afforestation Explorer
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              Public geospatial ledger of registered tree plantations. Toggle satellite imagery to cross-check vegetative indices and longitudinal canopy growth.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/onboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <PlusCircle size={15} />
              <span>Register New Plot</span>
            </Link>
            <Link
              href="/audits"
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <Activity size={15} className="text-cyan-400" />
              <span>Audit Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Metric Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/70 border border-gray-800 p-5 rounded-2xl">
            <span className="text-xs text-gray-400 font-mono block mb-1">Total Trees Verified</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-400">{stats.total_trees}</span>
              <span className="text-xs text-gray-400">across {stats.total_plots} plots</span>
            </div>
          </div>

          <div className="bg-gray-900/70 border border-gray-800 p-5 rounded-2xl">
            <span className="text-xs text-gray-400 font-mono block mb-1">Verified Survivals</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-teal-300">{stats.verified_plots}</span>
              <span className="text-xs text-emerald-500 font-medium font-mono">
                {Math.round((stats.verified_plots / (stats.total_plots || 1)) * 100)}% Pass
              </span>
            </div>
          </div>

          <div className="bg-gray-900/70 border border-gray-800 p-5 rounded-2xl">
            <span className="text-xs text-gray-400 font-mono block mb-1">Carbon Sequestered</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-cyan-400">{stats.total_co2_tons}</span>
              <span className="text-xs text-gray-400">metric tons</span>
            </div>
          </div>

          <div className="bg-gray-900/70 border border-gray-800 p-5 rounded-2xl">
            <span className="text-xs text-gray-400 font-mono block mb-1">Active Automated Audits</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-400">{stats.pending_audits}</span>
              <span className="text-xs text-amber-400/80">scheduled</span>
            </div>
          </div>
        </div>

        {/* Map Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-900/40 p-3 rounded-xl border border-gray-800">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <span className="text-xs text-gray-400 font-mono">Plot Filter:</span>
            {["All", "Verified", "Pending"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedStatus === status
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                    : "text-gray-400 hover:text-white bg-gray-800/40"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Verified (&gt;0.35)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span>Pending Audit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              <span>At Risk</span>
            </div>
          </div>
        </div>

        {/* Geospatial Map Container */}
        <div className="bg-gray-900 p-2 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
          <MapComponent selectedStatus={selectedStatus} />
        </div>

        {/* Bottom Feature Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80">
            <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              <Satellite size={16} className="text-emerald-400" />
              <span>Copernicus Sentinel-2 Bands</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              High-resolution 10m multispectral imagery. Band 4 (Red: 665nm) and Band 8 (NIR: 842nm) are sampled directly across the plot polygon.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80">
            <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              <ShieldCheck size={16} className="text-teal-400" />
              <span>Anti-Spoofing EXIF Integrity</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every onboarded tree requires an authentic camera photograph containing embedded GPS latitude and longitude metadata matching browser geolocation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80">
            <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              <Activity size={16} className="text-cyan-400" />
              <span>Autonomous Cron Audit</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              No continuous human field inspections required. The backend checks MSAVI2 at 3 & 6 months, and NDVI at 12 months, saving hundreds of auditing hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
