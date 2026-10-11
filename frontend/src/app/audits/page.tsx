"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, 
  Satellite, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  FileCheck,
  ChevronRight,
  TrendingUp,
  Info,
  Award
} from "lucide-react";

interface AuditRecord {
  id: number;
  sapling_id: number;
  audit_milestone: number;
  index_used: string;
  nir: number;
  red: number;
  score: number;
  threshold: number;
  audit_passed: boolean;
  delta_from_baseline: number;
  vegetation_health: string;
  notes: string;
  audit_date: string;
  badge_hash: string;
  species?: string;
  common_name?: string;
}

interface Sapling {
  id: number;
  species: string;
  common_name: string;
  latitude: number;
  longitude: number;
  planted_at: string;
  age_months: number;
  status: string;
  latest_index: string;
  latest_score: number;
  carbon_estimate: number;
  photo_url: string;
}

interface AuditResultModal {
  isOpen: boolean;
  data: any | null;
}

export default function AuditDashboard() {
  const [saplings, setSaplings] = useState<Sapling[]>([]);
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMilestoneFilter, setSelectedMilestoneFilter] = useState<string>("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("All");
  const [auditingId, setAuditingId] = useState<number | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResultModal>({ isOpen: false, data: null });
  const [notification, setNotification] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [saplingRes, auditRes] = await Promise.all([
        fetch("http://localhost:8000/api/saplings"),
        fetch("http://localhost:8000/api/audits")
      ]);
      const saplingData = await saplingRes.json();
      const auditData = await auditRes.json();
      setSaplings(saplingData);
      setAudits(auditData);
    } catch (err) {
      console.error("Failed to load audit data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunAudit = async (saplingId: number, milestone?: number) => {
    setAuditingId(saplingId);
    try {
      const res = await fetch(`http://localhost:8000/api/saplings/${saplingId}/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ months_elapsed: milestone })
      });
      const data = await res.json();
      if (res.ok) {
        setAuditResult({ isOpen: true, data });
        setNotification(`Successfully verified Plot #${saplingId} via Sentinel-2 ${data.index_used}!`);
        setTimeout(() => setNotification(null), 5000);
        await fetchData();
      } else {
        alert(data.detail || "Audit execution failed");
      }
    } catch (err) {
      alert("Error contacting audit verification service.");
    } finally {
      setAuditingId(null);
    }
  };

  const handleReseed = async () => {
    if (!confirm("Reset demo data to initial baseline state?")) return;
    try {
      await fetch("http://localhost:8000/api/seed", { method: "POST" });
      await fetchData();
      setNotification("Demo data reset to clean initial state.");
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      alert("Failed to reset demo data.");
    }
  };

  // Filtered saplings
  const filteredSaplings = saplings.filter((s) => {
    const matchesStatus = 
      selectedStatusFilter === "All" ||
      (selectedStatusFilter === "Pending" && s.status.includes("Pending")) ||
      (selectedStatusFilter === "Verified" && s.status === "Verified") ||
      (selectedStatusFilter === "Failed" && s.status === "Audit Failed");

    const matchesMilestone = 
      selectedMilestoneFilter === "All" ||
      (selectedMilestoneFilter === "3m" && (s.age_months <= 3 || s.status.includes("3-month"))) ||
      (selectedMilestoneFilter === "6m" && ((s.age_months > 3 && s.age_months <= 6) || s.status.includes("6-month"))) ||
      (selectedMilestoneFilter === "12m" && (s.age_months > 6 || s.status.includes("12-month")));

    return matchesStatus && matchesMilestone;
  });

  // Calculate audit statistics
  const totalAudits = audits.length;
  const passedAudits = audits.filter((a) => a.audit_passed).length;
  const passRate = totalAudits > 0 ? Math.round((passedAudits / totalAudits) * 100) : 100;
  const msavi2Count = audits.filter((a) => a.index_used === "MSAVI2").length;
  const ndviCount = audits.filter((a) => a.index_used === "NDVI").length;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-2">
              <Satellite size={13} className="animate-pulse" />
              <span>FR-2: Automated Longitudinal Growth Audit</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-400">
              Growth Audit Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              Zero-human-touch re-verification engine. Scheduled algorithms query Sentinel-2 multispectral bands at 3, 6, and 12-month intervals to verify vegetative survival.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReseed}
              className="px-3.5 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 text-xs text-gray-300 flex items-center gap-2 transition-colors"
              title="Reseed demo dataset"
            >
              <RefreshCw size={14} />
              <span>Reset Demo State</span>
            </button>
            <Link
              href="/explorer"
              className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-medium text-emerald-400 flex items-center gap-2 transition-colors"
            >
              <Layers size={14} />
              <span>View On Explorer Map</span>
            </Link>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fade-in">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Stat Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gray-900/70 border border-gray-800 p-5 rounded-2xl">
            <span className="text-xs text-gray-400 font-mono block mb-1">Total Audit Checks</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{totalAudits}</span>
              <span className="text-xs text-gray-400">automated</span>
            </div>
          </div>

          <div className="bg-gray-900/70 border border-gray-800 p-5 rounded-2xl">
            <span className="text-xs text-gray-400 font-mono block mb-1">Audit Pass Rate</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-400">{passRate}%</span>
              <span className="text-xs text-emerald-500 font-medium">Verified</span>
            </div>
          </div>

          <div className="bg-gray-900/70 border border-gray-800 p-5 rounded-2xl">
            <span className="text-xs text-gray-400 font-mono block mb-1">3 & 6M (MSAVI2)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-cyan-400">{msavi2Count}</span>
              <span className="text-xs text-gray-400">soil-adjusted</span>
            </div>
          </div>

          <div className="bg-gray-900/70 border border-gray-800 p-5 rounded-2xl">
            <span className="text-xs text-gray-400 font-mono block mb-1">12M+ (NDVI)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-teal-300">{ndviCount}</span>
              <span className="text-xs text-gray-400">canopy closure</span>
            </div>
          </div>

          <div className="bg-gray-900/70 border border-gray-800 p-5 rounded-2xl col-span-2 lg:col-span-1">
            <span className="text-xs text-gray-400 font-mono block mb-1">Pending Audit Queue</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-400">
                {saplings.filter((s) => s.status.includes("Pending")).length}
              </span>
              <span className="text-xs text-amber-400/80">ready to test</span>
            </div>
          </div>
        </div>

        {/* Scientific Context Banner */}
        <div className="bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-800/50 border border-gray-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
              <Info size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Autonomous Spectral Logic: MSAVI2 vs. NDVI
              </h3>
              <p className="text-xs text-gray-300 mt-1 max-w-3xl leading-relaxed">
                Young saplings (Months 1–6) expose significant bare soil that distorts traditional NDVI reflectance. GreenSync automatically invokes <strong>MSAVI2 (Modified Soil-Adjusted Vegetation Index)</strong> with a dynamic soil-adjustment factor. Once canopy closure occurs (Month 12), the engine transitions seamlessly to standard <strong>NDVI</strong>.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-teal-400">
            <span>Pass Threshold: ≥ 0.350</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-400 mr-1">Status:</span>
            {["All", "Pending", "Verified", "Failed"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedStatusFilter === st
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-gray-800/60 text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-400 mr-1">Interval Milestone:</span>
            {[
              { id: "All", label: "All Intervals" },
              { id: "3m", label: "3-Month (MSAVI2)" },
              { id: "6m", label: "6-Month (MSAVI2)" },
              { id: "12m", label: "12-Month (NDVI)" }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMilestoneFilter(m.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedMilestoneFilter === m.id
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                    : "bg-gray-800/60 text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plantation Plots & Scheduled Audits Table */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" />
              <span>Plantation Polygons & Longitudinal Audit Queue</span>
            </h2>
            <span className="text-xs text-gray-400 font-mono">
              Showing {filteredSaplings.length} plots
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-800/50 text-gray-400 text-xs font-mono uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Plot / Species</th>
                  <th className="py-3 px-4">Planted & Age</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Target Index</th>
                  <th className="py-3 px-4">Latest Score</th>
                  <th className="py-3 px-4">CO₂ Sequestered</th>
                  <th className="py-3 px-4 text-right">Autonomous Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredSaplings.map((sapling) => {
                  const isPending = sapling.status.includes("Pending");
                  const isVerified = sapling.status === "Verified";
                  const nextMilestone = sapling.status.includes("3-month") ? 3 : sapling.status.includes("6-month") ? 6 : 12;

                  return (
                    <tr key={sapling.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={sapling.photo_url}
                            alt={sapling.species}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-700 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>Plot #{sapling.id}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-emerald-400">{sapling.species}</span>
                            </div>
                            <span className="text-xs text-gray-400 font-mono">
                              {sapling.latitude.toFixed(4)}, {sapling.longitude.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-gray-300 font-medium">{sapling.age_months} months old</div>
                        <div className="text-xs text-gray-400">
                          {new Date(sapling.planted_at).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            isVerified
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : isPending
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-red-500/10 text-red-400 border-red-500/30"
                          }`}
                        >
                          {isVerified ? (
                            <CheckCircle2 size={12} />
                          ) : isPending ? (
                            <Clock size={12} />
                          ) : (
                            <AlertTriangle size={12} />
                          )}
                          <span>{sapling.status}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono text-xs">
                        <span className={`px-2 py-0.5 rounded ${sapling.age_months <= 6 ? "bg-cyan-500/15 text-cyan-300" : "bg-emerald-500/15 text-emerald-300"}`}>
                          {sapling.age_months <= 6 ? "MSAVI2 (Soil Adj.)" : "NDVI (Canopy)"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {sapling.latest_score > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white">
                              {sapling.latest_score.toFixed(3)}
                            </span>
                            <span className="text-xs text-emerald-400 font-medium">Passed</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-mono">Awaiting initial check</span>
                        )}
                      </td>

                      <td className="py-4 px-4 font-mono text-cyan-400 font-medium">
                        {sapling.carbon_estimate} <span className="text-xs text-gray-400">tons</span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleRunAudit(sapling.id, nextMilestone)}
                          disabled={auditingId === sapling.id}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 ml-auto transition-all ${
                            isPending
                              ? "bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-gray-950 shadow-md shadow-cyan-500/20 active:scale-95"
                              : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
                          }`}
                        >
                          {auditingId === sapling.id ? (
                            <>
                              <RefreshCw size={13} className="animate-spin" />
                              <span>Querying Sentinel-2...</span>
                            </>
                          ) : (
                            <>
                              <Satellite size={13} />
                              <span>{isPending ? `Run ${nextMilestone}M Audit` : "Re-Verify Index"}</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Trail Ledger Table */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck size={18} className="text-emerald-400" />
              <span>Immutable Audit Trail & Certificate Log</span>
            </h2>
            <span className="text-xs text-gray-400 font-mono">
              {audits.length} recorded verifications
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-800/50 text-gray-400 text-xs font-mono uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Audit ID</th>
                  <th className="py-3 px-4">Plot / Species</th>
                  <th className="py-3 px-4">Milestone</th>
                  <th className="py-3 px-4">Spectral Index</th>
                  <th className="py-3 px-4">NIR / Red Bands</th>
                  <th className="py-3 px-4">Score / Threshold</th>
                  <th className="py-3 px-4">Health Assessment</th>
                  <th className="py-3 px-4">Certificate Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {audits.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-400">
                      #{a.id}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-white">
                      <span>Plot #{a.sapling_id}</span>
                      {a.species && <span className="text-emerald-400 ml-1.5">({a.species})</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-gray-800 text-gray-300 border border-gray-700">
                        {a.audit_milestone} Months
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-teal-400">
                      {a.index_used}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-gray-300">
                      NIR: {a.nir.toFixed(2)} | Red: {a.red.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-emerald-400">
                        {a.score.toFixed(3)}
                      </span>
                      <span className="text-xs text-gray-400 font-mono ml-1.5">
                        (min {a.threshold.toFixed(2)})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-300">
                      {a.vegetation_health}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400 max-w-[180px] truncate" title={a.badge_hash}>
                      {a.badge_hash ? `${a.badge_hash.slice(0, 14)}...` : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Audit Result Modal */}
      {auditResult.isOpen && auditResult.data && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Satellite Re-Verification Receipt
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    Plot #{auditResult.data.sapling_id} • {auditResult.data.species}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAuditResult({ isOpen: false, data: null })}
                className="text-gray-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-800/80 border border-gray-700/80 space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                  <span>AUDIT MILESTONE:</span>
                  <span className="text-white font-bold">{auditResult.data.milestone}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                  <span>INDEX SELECTED:</span>
                  <span className="text-teal-400 font-bold">{auditResult.data.index_used}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                  <span>RAW BANDS:</span>
                  <span className="text-gray-300">
                    NIR (B8) = {auditResult.data.bands.nir_band_8} | Red (B4) = {auditResult.data.bands.red_band_4}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                  <span>SCORE CALCULATED:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {auditResult.data.score} (Threshold: {auditResult.data.threshold})
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 font-mono pt-2 border-t border-gray-700/60">
                  <span>VERIFICATION VERDICT:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                    PASSED & CERTIFIED
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-400 font-mono block mb-1">Scientific Rationale:</span>
                <p className="text-xs text-gray-300 bg-gray-950/70 p-3 rounded-lg border border-gray-800">
                  {auditResult.data.scientific_rationale}
                </p>
              </div>

              <div>
                <span className="text-xs text-gray-400 font-mono block mb-1">Cryptographic Badge Hash (FR-4):</span>
                <p className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-800/40 break-all select-all">
                  {auditResult.data.badge_hash}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-gray-300 pt-1">
                <span>Updated Carbon Estimate:</span>
                <span className="text-emerald-400 font-bold">
                  {auditResult.data.carbon_estimate_tons} tons CO₂
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/certificates"
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 font-bold rounded-xl text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Award size={14} />
                <span>View Digital Badge (FR-4)</span>
              </Link>
              <button
                onClick={() => setAuditResult({ isOpen: false, data: null })}
                className="py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl text-xs transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
