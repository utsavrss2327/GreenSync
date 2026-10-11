import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenSync — Satellite & Geotagged Plantation Verification Portal",
  description: "Autonomous verification portal combining geotagged EXIF sapling data with Sentinel-2 satellite MSAVI2/NDVI spectral indices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100 font-sans selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-800/80 bg-gray-900/40 py-6 text-center text-xs text-gray-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              GreenSync © 2026 • European Space Agency (ESA) Sentinel-2 Spectral Cross-Check Engine
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <span>MSAVI2 Soil-Adjusted Index</span>
              <span>•</span>
              <span>Zero-Human-Touch Audits</span>
              <span>•</span>
              <span>Anti-Spoofing EXIF</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
