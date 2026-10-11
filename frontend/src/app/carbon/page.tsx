"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Leaf, 
  Trees, 
  TrendingUp, 
  Car, 
  Smartphone, 
  Zap, 
  Plane, 
  ShieldCheck, 
  HelpCircle,
  FileText,
  Calculator,
  RefreshCw,
  Layers,
  ArrowRight
} from "lucide-react";

interface CarbonResult {
  status: string;
  inputs: {
    species: string;
    initial_tree_count: number;
    surviving_trees: number;
    survival_rate_percent: number;
    age_months: number;
    soil_region: string;
  };
  results: {
    co2e_tons: number;
    above_ground_biomass_kg_per_tree: number;
    total_biomass_tons: number;
    ipcc_tier: string;
    root_shoot_ratio: number;
    carbon_fraction: number;
  };
  trajectory: Array<{
    year: number;
    co2e_tons: number;
    biomass_tons: number;
  }>;
  equivalencies: {
    passenger_car_km_offset: number;
    smartphone_charges_offset: number;
    household_power_days_offset: number;
    passenger_flight_hours_offset: number;
  };
}

export default function CarbonEstimator() {
  const [species, setSpecies] = useState<string>("Bamboo");
  const [treeCount, setTreeCount] = useState<number>(250);
  const [ageMonths, setAgeMonths] = useState<number>(18);
  const [survivalRate, setSurvivalRate] = useState<number>(0.92);
  const [soilRegion, setSoilRegion] = useState<string>("Alluvial Plains");
  const [loading, setLoading] = useState<boolean>(false);
  const [carbonData, setCarbonData] = useState<CarbonResult | null>(null);

  const speciesOptions = [
    { name: "Bamboo", desc: "Ultra-fast biomass accumulation (38 kg/yr)" },
    { name: "Eucalyptus", desc: "Rapid timber growth (28 kg/yr)" },
    { name: "Teak", desc: "High density hardwood (24 kg/yr)" },
    { name: "Neem", desc: "Hardy tropical evergreen (21 kg/yr)" },
    { name: "Banyan", desc: "Sprawling canopy fixture (32 kg/yr)" },
    { name: "Oak", desc: "Temperate slow-growing deciduous (16 kg/yr)" },
    { name: "Moringa", desc: "Fast-growing agroforestry pioneer (20 kg/yr)" },
  ];

  const regionOptions = [
    "Alluvial Plains",
    "Tropical Moist",
    "Sub-tropical Arid",
    "Temperate Mountain",
    "Coastal Delta"
  ];

  const calculateEstimate = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/carbon/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          species,
          tree_count: treeCount,
          age_months: ageMonths,
          survival_rate: survivalRate,
          soil_region: soilRegion
        })
      });
      const data = await res.json();
      if (data && data.results) {
        setCarbonData(data);
      }
    } catch (err) {
      console.error("Failed to estimate carbon:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateEstimate();
  }, [species, treeCount, ageMonths, survivalRate, soilRegion]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
              <Leaf size={13} />
              <span>FR-6: Algorithmic Carbon Sequestration Model</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Carbon Sequestration Estimator
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              IPCC Tier 2 allometric expansion modeling. Integrates species growth curves, below-ground root ratios, and verified satellite survival rates to project verified carbon offsets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/certificates"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <ShieldCheck size={15} />
              <span>View Verification Badges</span>
            </Link>
          </div>
        </div>

        {/* Main Grid: Inputs vs Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator size={18} className="text-emerald-400" />
                <span>Afforestation Parameters</span>
              </h2>

              {/* Species Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2 font-mono uppercase tracking-wider">
                  Target Tree Species
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {speciesOptions.map((sp) => (
                    <button
                      key={sp.name}
                      type="button"
                      onClick={() => setSpecies(sp.name)}
                      className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                        species === sp.name
                          ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold shadow-sm"
                          : "bg-gray-950/60 border-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
                      }`}
                    >
                      <span className="block font-medium">{sp.name}</span>
                      <span className="text-[10px] text-gray-400 truncate block mt-0.5">{sp.desc.split(" (")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tree Count Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-300 font-mono uppercase tracking-wider">
                    Plantation Tree Count
                  </label>
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {treeCount.toLocaleString()} trees
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="2000"
                  step="10"
                  value={treeCount}
                  onChange={(e) => setTreeCount(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-gray-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                  <span>Plot (20)</span>
                  <span>Grove (500)</span>
                  <span>Forest (2,000)</span>
                </div>
              </div>

              {/* Age in Months Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-300 font-mono uppercase tracking-wider">
                    Plantation Age
                  </label>
                  <span className="font-mono text-sm font-bold text-cyan-400">
                    {ageMonths} Months ({ (ageMonths / 12).toFixed(1) } Years)
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="48"
                  step="1"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 bg-gray-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                  <span>Sapling (1M)</span>
                  <span>1 Year (12M)</span>
                  <span>Canopy (48M)</span>
                </div>
              </div>

              {/* Satellite Verified Survival Rate Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-300 font-mono uppercase tracking-wider">
                    Satellite Verified Survival Rate
                  </label>
                  <span className="font-mono text-sm font-bold text-teal-300">
                    {Math.round(survivalRate * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.0"
                  step="0.01"
                  value={survivalRate}
                  onChange={(e) => setSurvivalRate(parseFloat(e.target.value))}
                  className="w-full accent-teal-400 bg-gray-800 h-2 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  Derived from Sentinel-2 MSAVI2 / NDVI longitudinal audit pass rate.
                </span>
              </div>

              {/* Soil / Agro Region */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2 font-mono uppercase tracking-wider">
                  Agro-Ecological Soil Zone
                </label>
                <select
                  value={soilRegion}
                  onChange={(e) => setSoilRegion(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs font-mono text-gray-200 focus:outline-none focus:border-emerald-500"
                >
                  {regionOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scientific IPCC Note */}
            <div className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800 text-xs text-gray-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <HelpCircle size={14} className="text-emerald-400" />
                <span>IPCC Tier 2 Allometric Formula</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                Total Biomass = AboveGroundBiomass × (1 + RootShootRatio: 0.24)
                <br />
                Carbon = TotalBiomass × 0.47 × (44/12 CO₂:C Conversion)
              </p>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {carbonData && (
              <>
                {/* Big Metric Highlight Banner */}
                <div className="bg-gradient-to-br from-emerald-950/60 via-gray-900 to-gray-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

                  <div className="relative z-10 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-emerald-400 font-mono uppercase tracking-wider font-semibold block mb-1">
                          Current Verified Carbon Stock
                        </span>
                        <div className="flex items-baseline gap-3">
                          <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                            {carbonData.results.co2e_tons.toLocaleString()}
                          </span>
                          <span className="text-xl sm:text-2xl font-bold text-gray-400">
                            tCO₂e
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-900/80 p-3.5 rounded-2xl border border-gray-800 text-right font-mono text-xs space-y-1">
                        <span className="text-gray-400 block">Surviving Trees:</span>
                        <span className="text-white font-bold text-sm">
                          {carbonData.inputs.surviving_trees.toLocaleString()} of {carbonData.inputs.initial_tree_count}
                        </span>
                        <span className="text-emerald-400 block text-[10px]">
                          ({carbonData.inputs.survival_rate_percent}% Audit Pass)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-800">
                      <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
                        <span className="text-[10px] text-gray-400 block">Total Living Biomass</span>
                        <span className="text-lg font-bold text-white font-mono">
                          {carbonData.results.total_biomass_tons} tons
                        </span>
                      </div>
                      <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
                        <span className="text-[10px] text-gray-400 block">Biomass / Tree</span>
                        <span className="text-lg font-bold text-teal-300 font-mono">
                          {carbonData.results.above_ground_biomass_kg_per_tree} kg
                        </span>
                      </div>
                      <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-gray-400 block">Root System (BGB)</span>
                        <span className="text-lg font-bold text-cyan-300 font-mono">
                          +{Math.round(carbonData.results.root_shoot_ratio * 100)}% Roots
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-World Environmental Equivalencies */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={16} className="text-cyan-400" />
                    <span>Real-World Offset Equivalencies</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-gray-950/80 p-3.5 rounded-2xl border border-gray-800 flex flex-col items-center text-center">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2">
                        <Car size={18} />
                      </div>
                      <span className="text-base font-bold text-white font-mono">
                        {carbonData.equivalencies.passenger_car_km_offset.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Car km avoided</span>
                    </div>

                    <div className="bg-gray-950/80 p-3.5 rounded-2xl border border-gray-800 flex flex-col items-center text-center">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
                        <Smartphone size={18} />
                      </div>
                      <span className="text-base font-bold text-white font-mono">
                        {(carbonData.equivalencies.smartphone_charges_offset / 1000).toFixed(0)}k
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Phone charges</span>
                    </div>

                    <div className="bg-gray-950/80 p-3.5 rounded-2xl border border-gray-800 flex flex-col items-center text-center">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                        <Zap size={18} />
                      </div>
                      <span className="text-base font-bold text-white font-mono">
                        {carbonData.equivalencies.household_power_days_offset}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Home power days</span>
                    </div>

                    <div className="bg-gray-950/80 p-3.5 rounded-2xl border border-gray-800 flex flex-col items-center text-center">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2">
                        <Plane size={18} />
                      </div>
                      <span className="text-base font-bold text-white font-mono">
                        {carbonData.equivalencies.passenger_flight_hours_offset}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Flight hrs offset</span>
                    </div>
                  </div>
                </div>

                {/* Multi-Year Trajectory Growth Forecast */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                      <Trees size={16} className="text-emerald-400" />
                      <span>Long-Term Sequestration Trajectory</span>
                    </h3>
                    <span className="text-xs text-gray-400 font-mono">Cumulative tCO₂e</span>
                  </div>

                  <div className="space-y-3">
                    {carbonData.trajectory.map((t) => {
                      const maxCo2 = carbonData.trajectory[carbonData.trajectory.length - 1].co2e_tons;
                      const percentage = Math.min(Math.round((t.co2e_tons / (maxCo2 || 1)) * 100), 100);

                      return (
                        <div key={t.year} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-gray-300 font-medium">Year {t.year}</span>
                            <div className="space-x-3">
                              <span className="text-gray-400">{t.biomass_tons} t Biomass</span>
                              <span className="text-emerald-400 font-bold">{t.co2e_tons} tCO₂e</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden border border-gray-800">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(percentage, 4)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
