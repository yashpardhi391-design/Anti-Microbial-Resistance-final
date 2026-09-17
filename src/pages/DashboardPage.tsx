import React from "react";
import { HeroStats } from "../components/HeroStats";
import { PharmaShieldRadarScanner } from "../components/PharmaShieldRadarScanner";
import { DualReportComparator } from "../components/DualReportComparator";
import { PathogenHostDefenseReportView } from "../components/PathogenHostDefenseReportView";
import {
  AnalysisOutput,
  ComparativeDrugRow,
  ComparativeRecord,
  PatientData,
} from "../types";
import {
  Shield,
  GraduationCap,
  ArrowRight,
  Zap,
  GitCompare,
  Building2,
  FileSpreadsheet,
  Database,
  Users,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export interface DashboardPageProps {
  currentAnalysisResult: {
    analysis: AnalysisOutput;
    rows: ComparativeDrugRow[];
  };
  p1: PatientData;
  setP1: (p: PatientData) => void;
  p2: PatientData;
  setP2: (p: PatientData) => void;
  onSaveRecord: (rec: ComparativeRecord) => void;
  onOpenCodeLookup: (code?: string) => void;
  savedRecordsCount: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentAnalysisResult,
  p1,
  setP1,
  p2,
  setP2,
  onSaveRecord,
  onOpenCodeLookup,
  savedRecordsCount,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Stat Summary */}
      <HeroStats
        onLaunchScanner={() => navigate("/scanner")}
        onViewAnalytics={() => navigate("/analytics")}
      />

      {/* Featured Interactive Hero Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Live Radar Scanner Widget */}
          <div className="lg:col-span-5 space-y-6">
            <PharmaShieldRadarScanner
              onScanClick={() => navigate("/scanner")}
              riskLevel={currentAnalysisResult.analysis.riskLevel}
              riskScore={currentAnalysisResult.analysis.riskScore}
            />

            {/* Clinical Directives Quick Card */}
            <div className="rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase">
                <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>ICU Infection Control Alert</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Cross-resistance detected between ICU Bed 04 and Bed 12 (blaKPC-3 carbapenemase). Shared invalidation of Meropenem &amp; Ciprofloxacin confirmed.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-bold">
                  Spatial Isolation Required
                </span>
                <button
                  type="button"
                  onClick={() => onOpenCodeLookup(currentAnalysisResult.analysis.uniqueAccessCode)}
                  className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-semibold cursor-pointer"
                >
                  Verify Report Code &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Platform Capabilities & Module Jumpers */}
          <div className="lg:col-span-7 space-y-5">
            {/* Master Banner: Academic Host Defense Highlight */}
            <div className="rounded-2xl border border-teal-200 dark:border-teal-500/30 bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-slate-900 dark:via-teal-950/30 dark:to-slate-900 p-6 shadow-xs relative overflow-hidden transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-teal-700 dark:text-teal-400 font-bold uppercase">
                  <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Core Immunological Principle</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-500/40 text-[10px] font-mono font-bold">
                  Host vs Pathogen
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Why Does Bacteria Harm Person 1, But NOT Person 2?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Microbial infection depends equally on the host terrain: intact mucosal barriers, neutrophil oxidative burst capacity, blood group epithelial receptor density, and hydrodynamic renal washout (eGFR).
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  to="/host-susceptibility"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>Open Host Susceptibility Explainer &amp; Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/scanner"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Launch Comparative AST Scanner</span>
                </Link>
              </div>
            </div>

            {/* 4 Interactive Navigation Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Comparative Scanner */}
              <Link
                to="/scanner"
                className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-teal-500/50 hover:shadow-md transition-all group block"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <GitCompare className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Dual Antibiogram Cross-Analysis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Compare isolates from two patients to identify shared multi-drug resistance and get salvage regimens.
                </p>
              </Link>

              {/* Card 2: Hospital Report Suite */}
              <Link
                to="/hospital-suite"
                className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-cyan-500/50 hover:shadow-md transition-all group block"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Hospital Report Suite
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Side-by-side comparative hospital laboratory reports with ward isolation &amp; cross-infection alerts.
                </p>
              </Link>

              {/* Card 3: Lab Analytics */}
              <Link
                to="/analytics"
                className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-indigo-500/50 hover:shadow-md transition-all group block"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  AMR Resistance Surveillance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Cumulative hospital antibiogram, susceptibility distributions, and multi-drug resistance tracking.
                </p>
              </Link>

              {/* Card 4: Patient Records Repository */}
              <Link
                to="/records"
                className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-emerald-500/50 hover:shadow-md transition-all group block"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Patient Records Archive
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                    {savedRecordsCount} Saved
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Access saved comparative evaluations, export audit spreadsheets, or verify official report slips.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Interactive Comparative Analysis Suite */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <DualReportComparator
          patient1={p1}
          setPatient1={setP1}
          patient2={p2}
          setPatient2={setP2}
          analysisResult={currentAnalysisResult}
          onSaveRecord={onSaveRecord}
          onOpenCodeLookup={onOpenCodeLookup}
        />
      </div>

      {/* Academic Explainer: Pathogen vs Host Defense */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PathogenHostDefenseReportView
          patient1={p1}
          patient2={p2}
          report={currentAnalysisResult.analysis.whyBacteriaAffectsReport}
        />
      </div>
    </div>
  );
};
