"use client";
import { Trees, Satellite, ShieldCheck, Award, ExternalLink } from "lucide-react";

export default function IntroSlide() {
  return (
    <div className="w-screen h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Outer border decoration */}
      <div className="absolute inset-8 border border-emerald-500/30 rounded-3xl pointer-events-none" />

      <div className="max-w-4xl w-full text-center space-y-8 relative z-10 p-10 bg-gray-900/60 border border-gray-800 rounded-3xl backdrop-blur-2xl shadow-2xl">
        {/* Top Hackathon Ribbon */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-sm font-semibold tracking-wide shadow-md">
          <Award size={18} className="text-emerald-400" />
          <span>Bharat Builds Environmental Hacks</span>
          <span className="text-gray-500">|</span>
          <span className="font-mono text-cyan-300 text-xs">wemakedevs.org/aws/env</span>
        </div>

        {/* Project Title */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-gray-950 font-bold shadow-xl shadow-emerald-500/30">
              <Trees size={32} />
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400">
              GreenSync
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 font-medium tracking-wide">
            Satellite & Geotagged Tree Plantation Autonomous Verification System
          </p>
        </div>

        {/* Team Credentials Card */}
        <div className="pt-4 border-t border-gray-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="bg-gray-950/80 p-5 rounded-2xl border border-gray-800 space-y-1">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider block">Hackathon Team</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">Team: Vampire.dev.lop</span>
          </div>

          <div className="bg-gray-950/80 p-5 rounded-2xl border border-gray-800 space-y-1">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider block">Team Members</span>
            <span className="text-2xl font-bold text-teal-200">Utsav Raj Singh & Arushi Jain</span>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-gray-400">
          <span className="px-3 py-1 rounded-lg bg-gray-800/80 border border-gray-700 text-gray-300">
            ☁️ Amazon Web Services (AWS S3 & RDS)
          </span>
          <span className="px-3 py-1 rounded-lg bg-gray-800/80 border border-gray-700 text-gray-300">
            🛰️ Copernicus Sentinel-2 (ESA)
          </span>
          <span className="px-3 py-1 rounded-lg bg-gray-800/80 border border-gray-700 text-gray-300">
            🔬 MSAVI2 / NDVI Spectral Delta Engine
          </span>
        </div>
      </div>
    </div>
  );
}
