import React from "react";
import { HospitalReportComparisonSuite } from "../components/HospitalReportComparisonSuite";
import {
  AnalysisOutput,
  ComparativeDrugRow,
  PatientData,
} from "../types";
import { Building2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { SAMPLE_PATIENT_RECORDS, computeComparativeAnalysis, buildComparativeRows } from "../data/mockData";

export interface HospitalSuitePageProps {
  currentAnalysisResult?: {
    analysis: AnalysisOutput;
    rows: ComparativeDrugRow[];
  };
  p1?: PatientData;
  p2?: PatientData;
  onOpenCodeLookup?: (code?: string) => void;
}

export const HospitalSuitePage: React.FC<HospitalSuitePageProps> = ({
  currentAnalysisResult,
  p1: propP1,
  p2: propP2,
  onOpenCodeLookup,
}) => {
  const p1 = propP1 || SAMPLE_PATIENT_RECORDS[0];
  const p2 = propP2 || SAMPLE_PATIENT_RECORDS[1];
  const safeAnalysisResult = currentAnalysisResult || {
    analysis: computeComparativeAnalysis(p1, p2),
    rows: buildComparativeRows(p1, p2),
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
            <Building2 className="w-4 h-4" />
            <span>ICU CROSS-INFECTION CONTROL &bull; HOSPITAL LABORATORY SUITE</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hospital Dual-Report Comparison Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Official side-by-side comparative laboratory slips, ward isolation directives, and carbapenemase risk assessment.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Directorate &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Hospital Suite Component */}
      <HospitalReportComparisonSuite
        patient1={p1}
        patient2={p2}
        analysisResult={safeAnalysisResult}
        onOpenCodeLookup={onOpenCodeLookup}
      />
    </div>
  );
};
