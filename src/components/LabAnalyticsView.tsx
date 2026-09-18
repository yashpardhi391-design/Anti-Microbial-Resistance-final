import React, { useState } from "react";
import {
  FileSpreadsheet,
  Biohazard,
  Calendar,
} from "lucide-react";
import { PATHOGEN_BREAKDOWN } from "../data/mockData";

interface LabAnalyticsViewProps {
  onNavigateToScanner?: () => void;
  onNavigateToRecords?: () => void;
}

export const LabAnalyticsView: React.FC<LabAnalyticsViewProps> = () => {
  const [selectedQuarter, setSelectedQuarter] = useState("2026-Q3");

  const pathogenBarData = PATHOGEN_BREAKDOWN.map((p) => ({
    name: p.pathogen,
    mdrRate: p.mdrRate,
    susceptibleRate: Number((100 - p.mdrRate).toFixed(1)),
    isolates: p.isolates,
  }));

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600 dark:text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Institutional Antibiogram &amp; Surveillance Analytics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Clinical microbiology aggregate AST data, multidrug-resistant organism (MDRO) infection control rates
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="2026-Q3">Q3 2026 (Current Active)</option>
              <option value="2026-Q2">Q2 2026 (Historical)</option>
              <option value="2026-Q1">Q1 2026 (Historical)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl p-5 border border-teal-200 dark:border-teal-500/30 bg-white dark:bg-slate-900 shadow-sm dark:shadow-md">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Antibiogram Compliance</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">96.8%</span>
            <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-semibold">+2.1%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">EUCAST standard breakpoint alignment</p>
        </div>

        <div className="rounded-xl p-5 border border-rose-200 dark:border-rose-500/30 bg-white dark:bg-slate-900 shadow-sm dark:shadow-md">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Carbapenem Sparing Rate</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-rose-600 dark:text-rose-400">71.4%</span>
            <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold">+4.8% stewardship</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Preservation protocol adherence</p>
        </div>

        <div className="rounded-xl p-5 border border-amber-200 dark:border-amber-500/30 bg-white dark:bg-slate-900 shadow-sm dark:shadow-md">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mean Turnaround Time</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-amber-600 dark:text-amber-400">14.2h</span>
            <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-semibold">-3.6h vs 2025</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">From specimen to AST result</p>
        </div>

        <div className="rounded-xl p-5 border border-cyan-200 dark:border-cyan-500/30 bg-white dark:bg-slate-900 shadow-sm dark:shadow-md">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Isolation Containment</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-cyan-700 dark:text-cyan-400">98.1%</span>
            <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-semibold">0 nosocomial bursts</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Contact precaution enforcement</p>
        </div>
      </div>

      {/* Pathogen Resistance Distribution Bar Chart */}
      <div className="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-sm dark:shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Priority Pathogen Multidrug Resistance (MDR) Ratio
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proportion of resistant vs sensitive isolates across 21,330 annual specimens
            </p>
          </div>
          <span className="text-xs font-mono text-teal-700 dark:text-teal-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            CLSI M100-Ed34
          </span>
        </div>
        <div className="w-full space-y-4">
          <div className="flex items-center justify-end space-x-6 text-xs font-medium text-slate-600 dark:text-slate-300 pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
              <span>MDR Resistance %</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-xs bg-teal-600 inline-block" />
              <span>Wildtype / Susceptible %</span>
            </div>
          </div>

          <div className="space-y-3.5">
            {pathogenBarData.map((item) => (
              <div key={item.name} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.name}
                    <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 ml-2">
                      ({item.isolates.toLocaleString()} isolates)
                    </span>
                  </span>
                  <div className="flex items-center space-x-3 font-mono text-xs">
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      {item.mdrRate}% MDR
                    </span>
                    <span className="text-slate-400">/</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold">
                      {item.susceptibleRate}% Susceptible
                    </span>
                  </div>
                </div>

                <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${item.mdrRate}%` }}
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-300"
                    title={`MDR: ${item.mdrRate}%`}
                  />
                  <div
                    style={{ width: `${item.susceptibleRate}%` }}
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-300"
                    title={`Susceptible: ${item.susceptibleRate}%`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clinical Guidance Box */}
      <div className="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-md">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center space-x-2">
          <Biohazard className="w-4 h-4 text-amber-500" />
          <span>Active Antimicrobial Stewardship Directives (September 2026)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700 dark:text-slate-300 mt-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">Carbapenem Restriction</span>
            <p className="text-slate-500 dark:text-slate-400">
              Meropenem and Imipenem require infectious disease pre-authorization for non-ICU patients. Prioritize Cefepime/Zidebactam under protocol #12.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">Fluoroquinolone Black Box</span>
            <p className="text-slate-500 dark:text-slate-400">
              Avoid empiric ciprofloxacin monotherapy for hospital-acquired urinary tract infections due to local E. coli resistance exceeding 58%.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-teal-700 dark:text-teal-400 block mb-1">Colistin Renal Safeguards</span>
            <p className="text-slate-500 dark:text-slate-400">
              Polymyxin B and Colistin reserved exclusively for documented Pan-Drug-Resistant (PDR) Acinetobacter baumannii with daily creatinine clearance monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
