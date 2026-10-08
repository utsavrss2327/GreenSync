import Link from "next/link";
import { Trees, Map as MapIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-3xl text-center space-y-8">
        <div className="flex justify-center mb-6">
          <Trees size={64} className="text-emerald-400" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
          GreenSync
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The autonomous verification portal for corporate afforestation. We combine 
          geotagged field data with Sentinel-2 satellite MSAVI2 indexing to prove 
          trees planted today grow into forests tomorrow—with zero ongoing human touch.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">
          <Link href="/onboard" className="group">
            <div className="h-full bg-gray-800/50 border border-gray-700 hover:border-emerald-400/50 p-8 rounded-2xl transition-all duration-300 hover:bg-gray-800 flex flex-col items-center text-center">
              <Trees size={32} className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-semibold mb-2">Volunteer Onboarding</h2>
              <p className="text-gray-400 text-sm">
                Plant a sapling, take a photo, and register the polygon. Our backend 
                validates EXIF metadata to prevent spoofing.
              </p>
            </div>
          </Link>

          <Link href="/explorer" className="group">
            <div className="h-full bg-gray-800/50 border border-gray-700 hover:border-teal-400/50 p-8 rounded-2xl transition-all duration-300 hover:bg-gray-800 flex flex-col items-center text-center">
              <MapIcon size={32} className="text-teal-400 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-semibold mb-2">Public Explorer</h2>
              <p className="text-gray-400 text-sm">
                View verified plantations on an interactive map. See the satellite 
                vegetation index cross-checks and carbon estimates.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
