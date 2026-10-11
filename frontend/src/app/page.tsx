"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  Trees, 
  Map as MapIcon, 
  Activity, 
  ShieldCheck, 
  Satellite, 
  Leaf, 
  ArrowRight,
  TrendingUp,
  Cpu
} from "lucide-react";

interface Stats {
  total_trees: number;
  total_plots: number;
  verified_plots: number;
  pending_audits: number;
  total_co2_tons: number;
  avg_vegetation_score: number;
}

export default function Home() {
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
      .catch((err) => console.log("Using cached stats:", err));
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-start p-4 sm:p-8 md:p-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-5xl text-center space-y-6 pt-6 pb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium tracking-wide shadow-sm">
          <Satellite size={14} className="animate-pulse" />
          <span>Autonomous Copernicus Sentinel-2 Verification</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400">
          GreenSync
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          The autonomous verification portal for corporate afforestation. We combine 
          <span className="text-emerald-400 font-semibold"> anti-spoofing geotagged field photos</span> with 
          <span className="text-teal-400 font-semibold"> European Space Agency Sentinel-2 MSAVI2 spectral analysis</span> to 
          guarantee trees planted today survive into tomorrow—with <span className="underline decoration-emerald-500/50 underline-offset-4 font-semibold text-white">zero human touch</span>.
        </p>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
          <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl backdrop-blur-md">
            <span className="text-xs text-gray-400 block mb-1">Total Trees Monitored</span>
            <span className="text-2xl md:text-3xl font-bold text-emerald-400">{stats.total_trees}</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl backdrop-blur-md">
            <span className="text-xs text-gray-400 block mb-1">Plots Verified</span>
            <span className="text-2xl md:text-3xl font-bold text-teal-400">
              {stats.verified_plots} <span className="text-xs text-gray-400">/ {stats.total_plots}</span>
            </span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl backdrop-blur-md">
            <span className="text-xs text-gray-400 block mb-1">CO₂ Sequestered</span>
            <span className="text-2xl md:text-3xl font-bold text-cyan-400">
              {stats.total_co2_tons} <span className="text-sm font-normal text-gray-400">tons</span>
            </span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl backdrop-blur-md">
            <span className="text-xs text-gray-400 block mb-1">Avg Spectral Index</span>
            <span className="text-2xl md:text-3xl font-bold text-emerald-300">
              +{stats.avg_vegetation_score}
            </span>
          </div>
        </div>

        {/* Core Action Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left">
          {/* Card 1: Explorer */}
          <Link href="/explorer" className="group">
            <div className="h-full bg-gray-900/70 border border-gray-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all duration-300 hover:bg-gray-800/80 hover:-translate-y-1 shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-105 transition-transform">
                  <MapIcon size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  Afforestation Explorer
                  <ArrowRight size={16} className="text-teal-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Interactive Leaflet map showing registered plantation plots, Sentinel-2 satellite overlays, live vegetative scores, and carbon projections.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center text-xs text-teal-400 font-medium">
                Explore Verified Polygons →
              </div>
            </div>
          </Link>

          {/* Card 2: Growth Audit Dashboard (FR-2) */}
          <Link href="/audits" className="group">
            <div className="h-full bg-gray-900/70 border border-gray-800 hover:border-cyan-500/50 p-6 rounded-2xl transition-all duration-300 hover:bg-gray-800/80 hover:-translate-y-1 shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                  <Activity size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  Growth Audit Dashboard
                  <ArrowRight size={16} className="text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Zero-human-touch re-verification at 3, 6, and 12-month intervals. Computes MSAVI2 and NDVI spectral deltas to eliminate greenwashing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center text-xs text-cyan-400 font-medium">
                Inspect 3/6/12 Month Audits →
              </div>
            </div>
          </Link>

          {/* Card 3: Volunteer Onboarding */}
          <Link href="/onboard" className="group">
            <div className="h-full bg-gray-900/70 border border-gray-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all duration-300 hover:bg-gray-800/80 hover:-translate-y-1 shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <Trees size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  Volunteer Onboarding
                  <ArrowRight size={16} className="text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Register new saplings with mobile camera capture. Backend verifies raw EXIF GPS coordinates against device sensors to prevent spoofing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center text-xs text-emerald-400 font-medium">
                Register New Plantation →
              </div>
            </div>
          </Link>
        </div>

        {/* Technical Explainer / Scientific Edge */}
        <div className="mt-14 p-6 rounded-2xl bg-gradient-to-r from-gray-900/90 to-gray-800/60 border border-gray-800 text-left">
          <div className="flex items-center gap-3 mb-3">
            <Cpu className="text-emerald-400 w-5 h-5" />
            <h3 className="text-base font-semibold text-white">Why MSAVI2 Instead of Standard NDVI for Young Saplings?</h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            During months 1–6, young sapling canopies are small, exposing large amounts of bare soil. Standard NDVI is heavily skewed by soil reflectance and produces false negative survival audits. GreenSync algorithmically uses <strong>MSAVI2 (Modified Soil-Adjusted Vegetation Index)</strong> with a dynamic L-factor during early stages, transitioning automatically to standard <strong>NDVI</strong> at 12 months once canopy closure occurs.
          </p>
        </div>

        {/* Lower-Third Graphic: Hackathon & Team Submission Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-gray-900/90 border-2 border-emerald-500/50 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <div>
              <span className="font-extrabold text-white text-sm tracking-wide block">
                Bharat Builds Environmental Hacks
              </span>
              <a 
                href="https://www.wemakedevs.org/aws/env" 
                target="_blank" 
                rel="noreferrer" 
                className="text-cyan-400 underline font-mono text-[11px]"
              >
                https://www.wemakedevs.org/aws/env
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
              Team: Vampire.dev.lop
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-gray-800 text-teal-200 border border-gray-700">
              Utsav Raj Singh & Arushi Jain
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
