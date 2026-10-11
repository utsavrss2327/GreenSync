"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Award, 
  Satellite, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Printer, 
  FileCheck, 
  Trees, 
  MapPin, 
  CheckCircle2, 
  QrCode,
  Sparkles,
  AlertCircle
} from "lucide-react";

interface CertificateItem {
  audit_id: number;
  badge_hash: string;
  audit_milestone: number;
  index_used: string;
  score: number;
  audit_date: string;
  plot_id: number;
  species: string;
  common_name: string;
  latitude: number;
  longitude: number;
  photo_url: string;
  carbon_estimate: number;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchHash, setSearchHash] = useState<string>("");
  const [verifiedResult, setVerifiedResult] = useState<any | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const fetchCertificates = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/certificates");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCertificates(data);
        if (data.length > 0 && !selectedCert) {
          setSelectedCert(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleVerifySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchHash.trim()) return;
    setVerifyError(null);
    setVerifiedResult(null);

    try {
      const res = await fetch(`http://localhost:8000/api/certificates/${encodeURIComponent(searchHash.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setVerifiedResult(data);
      } else {
        setVerifyError(data.detail || "Certificate hash not found in ledger.");
      }
    } catch (err) {
      setVerifyError("Error connecting to verification authority.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
              <Award size={13} />
              <span>FR-4: Afforestation Verification Badges & Digital Certificates</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Verifiable Afforestation Credentials
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              Immutable digital badges issued when both field photo anti-spoofing and Sentinel-2 satellite vegetative trends pass audit thresholds. Designed for corporate CSR reports & carbon credit bodies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/audits"
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium border border-gray-700 transition-colors"
            >
              ← Growth Audit Dashboard
            </Link>
          </div>
        </div>

        {/* Public Certificate Validator Search */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Search size={18} className="text-teal-400" />
              <span>Public Credential Verifier (CSR Auditor Portal)</span>
            </h2>
            <span className="text-xs text-gray-400 font-mono hidden sm:inline">
              Instant SHA-256 Integrity Check
            </span>
          </div>

          <form onSubmit={handleVerifySearch} className="flex gap-2">
            <input
              type="text"
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              placeholder="Paste SHA-256 certificate hash (e.g. GS-CERT-1-...) to verify authenticity"
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 placeholder-gray-600"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs transition-colors flex items-center gap-2 shrink-0"
            >
              <CheckCircle2 size={15} />
              <span>Validate Hash</span>
            </button>
          </form>

          {/* Validation Search Result */}
          {verifiedResult && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Certificate Verified & Authentic: {verifiedResult.certificate_id}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-gray-300 pt-1">
                <div>Species: <span className="text-white">{verifiedResult.species}</span></div>
                <div>Audit Stage: <span className="text-cyan-400">{verifiedResult.audit_milestone}</span></div>
                <div>Index Score: <span className="text-emerald-400">{verifiedResult.score} ({verifiedResult.index_used})</span></div>
                <div>Carbon: <span className="text-teal-300">{verifiedResult.carbon_estimate_tons} tons</span></div>
              </div>
            </div>
          )}

          {verifyError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="text-red-400 shrink-0" />
              <span>{verifyError}</span>
            </div>
          )}
        </div>

        {/* Certificate Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Certificate Selection List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
              Certified Afforestation Plots ({certificates.length})
            </h3>

            <div className="space-y-3">
              {certificates.map((cert) => {
                const isSelected = selectedCert?.badge_hash === cert.badge_hash;

                return (
                  <div
                    key={cert.badge_hash}
                    onClick={() => setSelectedCert(cert)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-gray-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10"
                        : "bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-900/90"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={cert.photo_url}
                          alt={cert.species}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-1.5">
                            <span>Plot #{cert.plot_id}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-emerald-400">{cert.species}</span>
                          </div>
                          <span className="text-[11px] text-gray-400 font-mono block">
                            Milestone: {cert.audit_milestone} Months • {cert.index_used} {cert.score}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                        VERIFIED
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-800/80 flex items-center justify-between text-[11px] font-mono text-gray-400">
                      <span className="truncate max-w-[200px]" title={cert.badge_hash}>
                        {cert.badge_hash.slice(0, 16)}...
                      </span>
                      <span className="text-cyan-400 font-medium">
                        {cert.carbon_estimate} tCO₂e
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Luxury Certificate Card Preview */}
          <div className="lg:col-span-7">
            {selectedCert && (
              <div className="space-y-4 sticky top-24">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
                    Digital Verification Credential
                  </h3>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs text-gray-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Printer size={13} />
                    <span>Print Certificate</span>
                  </button>
                </div>

                {/* The Luxury Certificate */}
                <div className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 border-2 border-emerald-500/50 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden font-serif text-gray-100">
                  {/* Outer Guilloche Border Styling */}
                  <div className="absolute inset-2 border border-emerald-500/20 rounded-2xl pointer-events-none" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

                  {/* Top Seal & Heading */}
                  <div className="text-center space-y-2 relative z-10 pb-6 border-b border-gray-800">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-gray-950 shadow-lg shadow-emerald-500/30 mx-auto mb-2 font-sans">
                      <ShieldCheck size={32} />
                    </div>

                    <div className="font-sans text-[11px] tracking-widest text-emerald-400 uppercase font-bold">
                      European Space Agency (ESA) • Copernicus Sentinel-2
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                      Certificate of Afforestation Verification
                    </h2>
                    <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
                      Issued autonomously by the GreenSync Autonomous Satellite Ledger for zero-greenwashing verified tree growth.
                    </p>
                  </div>

                  {/* Body Content */}
                  <div className="py-6 space-y-6 relative z-10 font-sans text-xs">
                    <div className="text-center space-y-1">
                      <span className="text-gray-400 uppercase text-[10px] tracking-wider">This certifies that plantation plot</span>
                      <div className="text-xl font-bold text-emerald-300 font-serif">
                        Plot #{selectedCert.plot_id} — {selectedCert.species} ({selectedCert.common_name})
                      </div>
                      <span className="text-gray-400 font-mono text-[11px]">
                        Centroid Coordinates: {selectedCert.latitude.toFixed(4)}°N, {selectedCert.longitude.toFixed(4)}°E
                      </span>
                    </div>

                    <p className="text-center text-gray-300 leading-relaxed max-w-lg mx-auto text-xs">
                      Has successfully satisfied all anti-spoofing mobile EXIF verification standards and algorithmically surpassed longitudinal growth milestones across Sentinel-2 multispectral vegetation checks.
                    </p>

                    {/* Verification Badges Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center pt-2">
                      <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800">
                        <span className="text-[10px] text-gray-400 block">Growth Milestone</span>
                        <span className="text-sm font-bold text-white">{selectedCert.audit_milestone} Months</span>
                      </div>
                      <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800">
                        <span className="text-[10px] text-gray-400 block">Spectral Index</span>
                        <span className="text-sm font-bold text-teal-300">{selectedCert.index_used}</span>
                      </div>
                      <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800">
                        <span className="text-[10px] text-gray-400 block">Vegetative Score</span>
                        <span className="text-sm font-bold text-emerald-400">{selectedCert.score}</span>
                      </div>
                      <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800">
                        <span className="text-[10px] text-gray-400 block">Verified CO₂</span>
                        <span className="text-sm font-bold text-cyan-300">{selectedCert.carbon_estimate} t</span>
                      </div>
                    </div>

                    {/* Cryptographic QR and Hash Stamp */}
                    <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-gray-950 shrink-0">
                          <QrCode size={40} />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-gray-400 block">CERTIFICATE ID:</span>
                          <span className="text-xs font-bold text-white block">
                            GS-VERIFIED-2026-{selectedCert.plot_id.toString().padStart(4, "0")}
                          </span>
                          <span className="text-[10px] text-emerald-400 block">
                            Audit Date: {new Date(selectedCert.audit_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="text-right sm:text-right max-w-xs">
                        <span className="text-[10px] text-gray-400 block mb-1">SHA-256 INTEGRITY HASH:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-cyan-400 bg-gray-950 px-2 py-1 rounded border border-gray-800 truncate block max-w-[170px]" title={selectedCert.badge_hash}>
                            {selectedCert.badge_hash}
                          </span>
                          <button
                            onClick={() => copyToClipboard(selectedCert.badge_hash)}
                            className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 shrink-0"
                            title="Copy hash"
                          >
                            {copiedHash === selectedCert.badge_hash ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
