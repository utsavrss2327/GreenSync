"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trees, MapPin, Activity, Leaf, Award, PlusCircle, Radio } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Overview", icon: Trees },
    { href: "/explorer", label: "Explorer", icon: MapPin },
    { href: "/audits", label: "Audits", icon: Activity },
    { href: "/carbon", label: "Carbon", icon: Leaf },
    { href: "/certificates", label: "Badges", icon: Award },
    { href: "/onboard", label: "Register", icon: PlusCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
            <Trees className="w-5 h-5 text-gray-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                GreenSync
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.2
              </span>
            </div>
            <p className="text-[10px] text-gray-400 hidden sm:block tracking-wide">
              Satellite & Geotagged Plantation Verification
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sentinel Live Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-xs">
          <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span className="text-gray-400">Sentinel-2 CDSE:</span>
          <span className="text-emerald-400 font-mono font-medium">Synchronized</span>
        </div>
      </div>
    </header>
  );
}
