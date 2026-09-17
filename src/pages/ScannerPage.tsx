import React from "react";
import { DualReportComparator } from "../components/DualReportComparator";
import { PharmaShieldRadarScanner } from "../components/PharmaShieldRadarScanner";
import {
  AnalysisOutput,
  ComparativeDrugRow,
  ComparativeRecord,
  PatientData,
} from "../types";
import { ScanLine, Shield, Zap, Sparkles } from "lucide-react";

export interface ScannerPageProps {
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
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  currentAnalysisResult,
  p1,
  setP1,
  p2,
  setP2,
  onSaveRecord,
  onOpenCodeLookup,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-teal-600 dark:text-teal-400 mb-1">
            <ScanLine className="w-4 h-4" />
            <span>AI MICROBIOLOGY SCANNER &bull; DUAL AST RADAR</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Antimicrobial Susceptibility Testing (AST) Radar Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Scan and compare microbial culture plates, disk diffusion inhibition zones (mm), and MIC breakpoints in real time.
          </p>
        </div>

        <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl flex items-center space-x-3 text-xs">
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <div>
            <div className="font-bold text-slate-900 dark:text-white">
              CLSI M100-Ed34 Automated Interpretation
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Live breakpoint inference active
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Comparator */}
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
  );
};
