"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import Map to prevent SSR window issues
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false, loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-gray-800 animate-pulse text-gray-500 rounded-xl">Loading Satellite Data...</div> });

export default function Explorer() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-teal-400">Interactive Afforestation Explorer</h1>
          <p className="text-gray-400 mt-2">Public ledger of verified sapling polygons. Overlays show MSAVI2/NDVI cross-checks.</p>
        </div>

        <div className="bg-gray-800 p-2 rounded-2xl border border-gray-700 shadow-xl overflow-hidden relative">
          <MapComponent />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 font-mono text-sm mb-1">Total Trees Verified</h3>
            <p className="text-3xl font-bold text-emerald-400">1,240</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 font-mono text-sm mb-1">Total Carbon Sequestered</h3>
            <p className="text-3xl font-bold text-teal-400">45.2 <span className="text-lg">tons</span></p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 font-mono text-sm mb-1">Active Automated Audits</h3>
            <p className="text-3xl font-bold text-blue-400">12</p>
          </div>
        </div>
      </div>
    </div>
  );
}
