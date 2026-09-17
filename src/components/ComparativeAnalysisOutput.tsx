import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Copy,
  Check,
  Dna,
  Search,
  Pill,
  ArrowRight,
  Info,
  Sparkles,
  Volume2,
  VolumeX,
  KeyRound,
  ExternalLink,
  Activity,
  BookOpen,
  UserCheck,
  Stethoscope,
} from "lucide-react";
import {
  AnalysisOutput,
  ComparativeDrugRow,
  PatientData,
  RiskLevel,
} from "../types";
import {
  STANDARD_MODE_OF_ACTION_CATALOG,
  STANDARD_RISK_REDUCTION_GUIDE,
} from "../data/mockData";
import { PathogenHostDefenseReportView } from "./PathogenHostDefenseReportView";

interface ComparativeAnalysisOutputProps {
  analysis: AnalysisOutput;
  rows: ComparativeDrugRow[];
  patient1: PatientData;
  patient2: PatientData;
  onOpenCodePortal?: (code: string) => void;
}

export const ComparativeAnalysisOutput: React.FC<ComparativeAnalysisOutputProps> = ({
  analysis,
  rows,
  patient1,
  patient2,
  onOpenCodePortal,
}) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeMoaCategory, setActiveMoaCategory] = useState<string>("all");

  const uniqueCode = analysis.uniqueAccessCode || "PRP-9021-8842-8801";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(uniqueCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInsights = () => {
    const textToCopy = `[Pharma Resist Pro - Comparative Antimicrobial Resistance Report]
Analyzed: ${patient1.name} (${patient1.id}) vs ${patient2.name} (${patient2.id})
Risk Level: ${analysis.riskLevel} (${analysis.riskScore}/100)
Compatibility Match: ${analysis.compatibilityPercentage}%

CRITICAL RESISTANCE OVERLAPS:
${analysis.criticalOverlaps.map((o) => `  - ${o}`).join("\n")}

MUTATED STRAIN FLAGS:
${analysis.mutatedStrainFlags.map((m) => `  - ${m}`).join("\n")}

SUGGESTED CLINICAL ALTERNATIVES:
${analysis.suggestedAlternatives.map((s) => `  - ${s}`).join("\n")}

CLINICAL SUMMARY:
${analysis.clinicalSummary}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2505);
  };

  const handleToggleSpeech = () => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(analysis.clinicalSummary);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const safeRows = rows || [];
  const filteredRows = safeRows.filter((row) => {
    if (!row) return false;
    const matchesSearch =
      (row.drug || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.drugClass || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === "shared") {
      return row.crossCompatibility === "Shared Resistance";
    }
    if (filterType === "sensitive") {
      return row.crossCompatibility === "Sensitive to Both";
    }
    if (filterType === "divergent") {
      return row.crossCompatibility === "Divergent";
    }
    return true;
  });

  const radius = 68;
  const circumference = 2 * Math.PI * radius;

  const sharedCount = safeRows.filter((r) => r?.crossCompatibility === "Shared Resistance").length;
  const sensitiveCount = safeRows.filter((r) => r?.crossCompatibility === "Sensitive to Both").length;
  const divergentCount = safeRows.filter((r) => r?.crossCompatibility === "Divergent").length;

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case "Critical Risk":
      case "High Risk":
        return {
          bg: "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-500/50 shadow-xs",
          icon: ShieldAlert,
          color: "text-rose-600 dark:text-rose-400",
          gaugeStroke: "#F43F5E",
        };
      case "Moderate Risk":
        return {
          bg: "bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-500/50 shadow-xs",
          icon: AlertTriangle,
          color: "text-amber-600 dark:text-amber-400",
          gaugeStroke: "#F59E0B",
        };
      case "Low Risk":
      default:
        return {
          bg: "bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/50 shadow-xs",
          icon: ShieldCheck,
          color: "text-emerald-600 dark:text-emerald-400",
          gaugeStroke: "#10B981",
        };
    }
  };

  const riskBadge = getRiskBadge(analysis.riskLevel);
  const RiskIcon = riskBadge.icon;

  const currentRiskScore = Math.min(100, Math.max(0, analysis.riskScore));
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(5, currentRiskScore)) / 100) * circumference;

  const riskReductionGuide = analysis.riskReductionGuide && analysis.riskReductionGuide.length > 0
    ? analysis.riskReductionGuide
    : STANDARD_RISK_REDUCTION_GUIDE;

  const modeOfActionList = analysis.modeOfActionList && analysis.modeOfActionList.length > 0
    ? analysis.modeOfActionList
    : STANDARD_MODE_OF_ACTION_CATALOG;

  return (
    <div
      id="comparative-analysis-output"
      className="mt-10 space-y-8 animate-in fade-in duration-300"
    >
      {/* 0. Unique Access Code Bar */}
      <div
        id="unique-access-code-banner"
        className="rounded-2xl p-5 border border-teal-300 dark:border-teal-500/40 bg-gradient-to-r from-teal-50 via-white to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-sm dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-gradient-to-br dark:from-teal-500/20 dark:to-cyan-500/20 border border-teal-300 dark:border-teal-500/40 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                Official Report Verification Key
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
                Active Verification Code
              </span>
            </div>
            <div className="flex items-center space-x-2.5 mt-1">
              <span className="text-lg sm:text-2xl font-mono font-extrabold text-slate-900 dark:text-white tracking-wider">
                {uniqueCode}
              </span>
              <button
                type="button"
                id="copy-unique-code-btn"
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                title="Copy unique code"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="text-teal-700 dark:text-teal-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Share this code with attending clinicians or the patient for dual-mode secure verification.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 self-stretch md:self-auto">
          {onOpenCodePortal && (
            <button
              type="button"
              id="open-verification-portal-btn"
              onClick={() => onOpenCodePortal(uniqueCode)}
              className="w-full md:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-500 dark:to-cyan-500 hover:brightness-110 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-white dark:text-slate-950" />
              <span>Open Doctor / Patient Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-white dark:text-slate-950" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Compatibility & Risk Gauge Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm dark:shadow-xl">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>AMR Risk Severity Index</span>
          </div>

          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke={riskBadge.gaugeStroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                {currentRiskScore}
                <span className="text-base font-normal text-slate-500 dark:text-slate-400">/100</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Clinical AMR Risk
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center space-x-2">
            <span
              id="risk-status-badge"
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-wide ${riskBadge.bg}`}
            >
              <RiskIcon className="w-4 h-4" />
              <span>{analysis.riskLevel}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 max-w-xs">
            Profile Overlap:{" "}
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {analysis.compatibilityPercentage}%
            </span>{" "}
            • Evaluated against CLSI &amp; EUCAST guidelines
          </p>
        </div>

        {/* Breakdown Metric Summary Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 content-center">
          <div className="rounded-xl p-5 border border-rose-200 dark:border-rose-500/30 bg-rose-50/70 dark:bg-rose-950/30 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                Shared Resistance
              </span>
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="mt-3 text-3xl font-bold font-mono text-rose-950 dark:text-rose-100">
              {sharedCount}
            </div>
            <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-1">
              Antibiotics resistant in both patient isolates. Avoid for cohort.
            </p>
          </div>

          <div className="rounded-xl p-5 border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/30 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                Both Sensitive
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-3 text-3xl font-bold font-mono text-emerald-950 dark:text-emerald-100">
              {sensitiveCount}
            </div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 mt-1">
              Agents retaining sensitivity in both isolates. Ideal candidates.
            </p>
          </div>

          <div className="rounded-xl p-5 border border-amber-200 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-950/30 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Divergent Susceptibility
              </span>
              <Pill className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="mt-3 text-3xl font-bold font-mono text-amber-950 dark:text-amber-100">
              {divergentCount}
            </div>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-1">
              Differential efficacy. Requires tailored individualized dosing.
            </p>
          </div>

          <div className="sm:col-span-3 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">
                {patient1.name} ({patient1.pathogen})
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="font-mono text-cyan-700 dark:text-cyan-400 font-bold">
                {patient2.name} ({patient2.pathogen})
              </span>
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              Surveillance Standard: EUCAST Breakpoints v14.0 &amp; CLSI M100-Ed34
            </span>
          </div>
        </div>
      </div>

      {/* 2. Host Susceptibility & Pathogen Defense Rationale Dossier */}
      <PathogenHostDefenseReportView
        patient1={patient1}
        patient2={patient2}
        report={analysis.whyBacteriaAffectsReport}
      />

      {/* 3. Side-By-Side Comparison Table */}
      <div
        id="side-by-side-comparison-table-container"
        className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm dark:shadow-xl"
      >
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Antimicrobial Susceptibility Comparison Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Side-by-side evaluation of Minimum Inhibitory Concentrations (MIC) and clinical interpretations
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search antibiotic or class..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
              <button
                onClick={() => setFilterType("all")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  filterType === "all"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                All ({rows.length})
              </button>
              <button
                onClick={() => setFilterType("shared")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  filterType === "shared"
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Shared Resistance ({sharedCount})
              </button>
              <button
                onClick={() => setFilterType("sensitive")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  filterType === "sensitive"
                    ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Both Sensitive ({sensitiveCount})
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Antibiotic / Drug Name</th>
                <th className="px-4 py-3">Drug Class</th>
                <th className="px-4 py-3">
                  <span className="text-teal-700 dark:text-teal-400 font-bold">{patient1.name}</span> (P1)
                </th>
                <th className="px-4 py-3">
                  <span className="text-cyan-700 dark:text-cyan-400 font-bold">{patient2.name}</span> (P2)
                </th>
                <th className="px-4 py-3">Cross-Compatibility Flag</th>
                <th className="px-4 py-3">Clinical Stewardship Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {filteredRows.map((row) => {
                const renderStatusBadge = (status: string, mic?: string) => {
                  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
                  if (status === "Resistant") {
                    badgeStyle = "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800/60";
                  } else if (status === "Sensitive") {
                    badgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/60";
                  } else if (status === "Intermediate") {
                    badgeStyle = "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/60";
                  }
                  return (
                    <div className="inline-flex items-center space-x-1.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badgeStyle}`}>
                        {status}
                      </span>
                      {mic && (
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {mic}
                        </span>
                      )}
                    </div>
                  );
                };

                const renderCrossBadge = (cross: string) => {
                  if (cross === "Shared Resistance") {
                    return (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/90 dark:text-rose-300 dark:border-rose-600/60 font-semibold text-[10px]">
                        <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>Shared Resistance</span>
                      </span>
                    );
                  }
                  if (cross === "Sensitive to Both") {
                    return (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-600/60 font-semibold text-[10px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Sensitive to Both</span>
                      </span>
                    );
                  }
                  if (cross === "Intermediate Overlap") {
                    return (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/90 dark:text-amber-300 dark:border-amber-600/60 font-semibold text-[10px]">
                        <Info className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Intermediate Shift</span>
                      </span>
                    );
                  }
                  return (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 text-[10px]">
                      <span>Divergent</span>
                    </span>
                  );
                };

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {row.drug}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {row.drugClass}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderStatusBadge(row.p1Status, row.p1Mic)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderStatusBadge(row.p2Status, row.p2Mic)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderCrossBadge(row.crossCompatibility)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs">
                      {row.clinicalNote}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. AI Insights Box */}
      <div
        id="ai-insights-box"
        className="rounded-2xl p-6 sm:p-7 border border-teal-300 dark:border-teal-500/40 bg-gradient-to-br from-teal-50/60 via-white to-cyan-50/60 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-[#0A1628]/95 shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors"
      >
        <div className="absolute top-4 right-6 opacity-10 pointer-events-none">
          <Dna className="w-40 h-40 text-teal-600 dark:text-teal-400" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 border border-teal-300 dark:border-teal-500/40 flex items-center justify-center text-teal-700 dark:text-teal-300">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  AI Clinical Stewardship Insights
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/40 font-bold">
                  {analysis.source === "gemini-3.8-flash"
                    ? "Gemini 3.8-Flash Live"
                    : "CLSI / EUCAST AI Engine"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated molecular mutational correlation and infectious disease salvage strategies
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={handleToggleSpeech}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              title="Read AI Insights Aloud"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-rose-600 dark:text-rose-400">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Audio Brief</span>
                </>
              )}
            </button>
            <button
              onClick={handleCopyInsights}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="text-teal-700 dark:text-teal-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Copy Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Critical Drug Resistance Overlaps</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {analysis.criticalOverlaps.map((overlap, idx) => (
                <div
                  key={`overlap-${idx}-${overlap}`}
                  className="rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 p-3 flex items-start space-x-2.5 text-xs text-rose-900 dark:text-rose-200"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{overlap}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
              <Dna className="w-4 h-4" />
              <span>Mutated Strain &amp; Genotype Surveillance Flags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.mutatedStrainFlags.map((flag, idx) => (
                <span
                  key={`flag-${idx}-${flag}`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 text-xs font-mono text-amber-800 dark:text-amber-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{flag}</span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
              <Pill className="w-4 h-4" />
              <span>Recommended Clinical Alternatives &amp; Salvage Regimens</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {analysis.suggestedAlternatives.map((alt, idx) => (
                <div
                  key={`alt-${idx}-${alt}`}
                  className="rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-500/30 p-3 flex items-start space-x-2.5 text-xs text-teal-900 dark:text-teal-200"
                >
                  <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <span>{alt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs">
            <span className="font-bold text-slate-900 dark:text-white block mb-1.5 text-sm">
              Microbiology Laboratory Assessment:
            </span>
            <p className="whitespace-pre-line">{analysis.clinicalSummary}</p>
          </div>
        </div>
      </div>

      {/* 4. Verified Patient Clinical Parameters Comparison Panel */}
      <div
        id="clinical-biomarkers-comparison-section"
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-xl space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Verified Patient Clinical Biomarkers &amp; Vulnerability Assessment
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Host characteristics calibrated from verified medical records to evaluate nephrotoxicity risks, clearance kinetics, and immune defense.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40 self-start sm:self-auto font-semibold">
            Host Risk Factors Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient 1 Biomarker Profile */}
          <div className="bg-teal-50/50 dark:bg-slate-950/60 border border-teal-200 dark:border-teal-500/30 rounded-xl p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-teal-200 dark:border-slate-800 pb-2.5">
              <span className="text-xs font-mono font-bold text-teal-800 dark:text-teal-400">
                PATIENT 1 &bull; {patient1.id}
              </span>
              <span className="text-xs text-slate-900 dark:text-white font-bold">{patient1.name} ({patient1.age} y/o)</span>
            </div>
            {patient1.clinicalParams ? (
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-semibold">Blood Group:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{patient1.clinicalParams.bloodGroup}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-semibold">Anemia Severity:</span>
                    <span className={`text-sm font-bold font-mono ${patient1.clinicalParams.anemia.hasAnemia ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {patient1.clinicalParams.anemia.hemoglobin} g/dL
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{patient1.clinicalParams.anemia.severity}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-semibold">Weight &amp; Height:</span>
                    <span className="text-xs text-slate-900 dark:text-white font-mono font-semibold">
                      {patient1.clinicalParams.vitals.weightKg} kg &bull; {patient1.clinicalParams.vitals.heightCm} cm
                    </span>
                    <span className="text-[10px] text-teal-700 dark:text-teal-300 block font-mono font-medium">BMI: {patient1.clinicalParams.vitals.bmi} kg/m²</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-semibold">Renal Clearance:</span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
                      eGFR {patient1.clinicalParams.bloodReport.eGfr} mL/min
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">Cr: {patient1.clinicalParams.bloodReport.serumCreatinine} mg/dL</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No clinical biomarkers recorded for Patient 1.</p>
            )}
          </div>

          {/* Patient 2 Biomarker Profile */}
          <div className="bg-cyan-50/50 dark:bg-slate-950/60 border border-cyan-200 dark:border-cyan-500/30 rounded-xl p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-cyan-200 dark:border-slate-800 pb-2.5">
              <span className="text-xs font-mono font-bold text-cyan-800 dark:text-cyan-400">
                PATIENT 2 &bull; {patient2.id}
              </span>
              <span className="text-xs text-slate-900 dark:text-white font-bold">{patient2.name} ({patient2.age} y/o)</span>
            </div>
            {patient2.clinicalParams ? (
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-semibold">Blood Group:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{patient2.clinicalParams.bloodGroup}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-semibold">Anemia Severity:</span>
                    <span className={`text-sm font-bold font-mono ${patient2.clinicalParams.anemia.hasAnemia ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {patient2.clinicalParams.anemia.hemoglobin} g/dL
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{patient2.clinicalParams.anemia.severity}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-semibold">Weight &amp; Height:</span>
                    <span className="text-xs text-slate-900 dark:text-white font-mono font-semibold">
                      {patient2.clinicalParams.vitals.weightKg} kg &bull; {patient2.clinicalParams.vitals.heightCm} cm
                    </span>
                    <span className="text-[10px] text-cyan-700 dark:text-cyan-300 block font-mono font-medium">BMI: {patient2.clinicalParams.vitals.bmi} kg/m²</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-semibold">Renal Clearance:</span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
                      eGFR {patient2.clinicalParams.bloodReport.eGfr} mL/min
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">Cr: {patient2.clinicalParams.bloodReport.serumCreatinine} mg/dL</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No clinical biomarkers recorded for Patient 2.</p>
            )}
          </div>
        </div>
      </div>

      {/* 5. How to Reduce Risk: Actionable Clinical Protocols */}
      <div
        id="how-to-reduce-risk-section"
        className="rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-xl space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {analysis.riskLevel} Mitigation &bull; How to Reduce Risk
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actionable infection barrier steps, PK/PD renal adaptations, and antimicrobial stewardship de-escalations.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 self-start sm:self-auto">
            {riskReductionGuide.length} Active Protocols
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskReductionGuide.map((item, idx) => {
            const isImmediate = item.priority === "Immediate";
            const isHigh = item.priority === "High";
            return (
              <div
                key={`guide-${idx}-${item.title}`}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-amber-400 dark:hover:border-amber-500/60 rounded-xl p-5 space-y-2.5 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    {item.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isImmediate
                        ? "bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30"
                        : isHigh
                        ? "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30"
                        : "bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/30"
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.action}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Mode of Action */}
      <div
        id="mode-of-action-section"
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-xl space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-500/20 border border-teal-300 dark:border-teal-500/40 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Pharmacological Mode of Action (MoA) &amp; Resistance Counter-Mechanisms
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed biochemical target organelles, enzymatic mutation pathways, and clinical salvage strategies.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveMoaCategory("all")}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeMoaCategory === "all" ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              All Classes
            </button>
            {modeOfActionList.slice(0, 3).map((m) => (
              <button
                key={m.drugClass}
                onClick={() => setActiveMoaCategory(m.drugClass)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-colors hidden sm:inline cursor-pointer ${
                  activeMoaCategory === m.drugClass ? "bg-teal-100 text-teal-900 dark:bg-teal-500/20 dark:text-teal-300" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {m.drugClass}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {modeOfActionList
            .filter((m) => activeMoaCategory === "all" || m.drugClass === activeMoaCategory)
            .map((moa, idx) => (
              <div
                key={`moa-${idx}-${moa.drugClass}-${moa.representativeDrug}`}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-teal-400 dark:hover:border-teal-500/40 rounded-xl p-5 space-y-3.5 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{moa.drugClass}</span>
                    <span className="text-xs font-mono text-teal-700 dark:text-teal-300 font-semibold">({moa.representativeDrug})</span>
                  </div>
                  <span className="text-xs font-mono text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-500/40 self-start sm:self-auto font-medium">
                    Target: {moa.targetOrganelle}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-teal-700 dark:text-teal-400 block">
                      Pharmacological Action:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{moa.pharmacologicalAction}</p>
                  </div>
                  <div className="bg-rose-50/70 dark:bg-rose-950/20 p-3.5 rounded-lg border border-rose-200 dark:border-rose-500/30 space-y-1 shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-rose-700 dark:text-rose-400 block">
                      Bacterial Resistance Mechanism:
                    </span>
                    <p className="text-rose-900 dark:text-rose-200 leading-relaxed">{moa.bacterialResistanceMechanism}</p>
                  </div>
                  <div className="bg-teal-50/70 dark:bg-teal-950/20 p-3.5 rounded-lg border border-teal-200 dark:border-teal-500/30 space-y-1 shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-teal-700 dark:text-teal-400 block">
                      Clinical Counter-Strategy:
                    </span>
                    <p className="text-teal-900 dark:text-teal-200 leading-relaxed">{moa.clinicalCounterStrategy}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 7. Patient & Family Accessible Care Guide */}
      <div
        id="patient-care-guide-section"
        className="rounded-2xl border border-teal-200 dark:border-teal-500/30 bg-gradient-to-r from-teal-50/70 via-white to-cyan-50/70 dark:from-teal-950/30 dark:via-slate-900 dark:to-slate-950 p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors"
      >
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 border border-teal-300 dark:border-teal-500/40 flex items-center justify-center text-teal-700 dark:text-teal-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Patient &amp; Family Plain-Language Care Summary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear, accessible explanation formatted for discharge instructions and patient education.
            </p>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed shadow-xs">
          {analysis.patientFriendlySummary ||
            `Dear patient, your laboratory report has detected bacterial resistance to common antibiotics. This means standard oral pills will not effectively eradicate the infection. Your clinical medical team has reviewed your kidney functions and blood reports and selected safe, targeted alternative treatments designed specifically to cure this strain. Please do not take leftover or unprescribed pills.`}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
          <span className="font-mono">
            Unique Verification Code: <strong className="text-teal-700 dark:text-teal-300 font-bold">{uniqueCode}</strong>
          </span>
          {onOpenCodePortal && (
            <button
              onClick={() => onOpenCodePortal(uniqueCode)}
              className="text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 underline font-semibold cursor-pointer"
            >
              Click here to view in dedicated Patient Portal Mode
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
