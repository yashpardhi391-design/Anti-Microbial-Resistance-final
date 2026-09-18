import React, { useState } from "react";
import {
  Building2,
  Stethoscope,
  FileText,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  HeartPulse,
  Activity,
  Printer,
  Copy,
  Check,
  Info,
  ExternalLink,
} from "lucide-react";
import { PatientData, ComparativeDrugRow, AnalysisOutput } from "../types";
import { executeMedicalPrint } from "../utils/printReport";
import { SAMPLE_PATIENT_RECORDS } from "../data/mockData";

interface HospitalReportComparisonSuiteProps {
  patient1?: PatientData;
  patient2?: PatientData;
  comparativeRows?: ComparativeDrugRow[];
  analysis?: AnalysisOutput | null;
  analysisResult?: {
    analysis: AnalysisOutput;
    rows: ComparativeDrugRow[];
  };
  onOpenCodeLookup?: (code?: string) => void;
}

export const HospitalReportComparisonSuite: React.FC<HospitalReportComparisonSuiteProps> = ({
  patient1: propP1,
  patient2: propP2,
  comparativeRows: propRows,
  analysis: propAnalysis,
  analysisResult,
  onOpenCodeLookup,
}) => {
  const patient1 = propP1 || SAMPLE_PATIENT_RECORDS[0];
  const patient2 = propP2 || SAMPLE_PATIENT_RECORDS[1];
  const comparativeRows = propRows || analysisResult?.rows || [];
  const analysis = propAnalysis !== undefined ? propAnalysis : analysisResult?.analysis || null;
  const [viewMode, setViewMode] = useState<"doctor" | "patient">("doctor");
  const [astFilter, setAstFilter] = useState<"all" | "shared-resistant" | "sensitive">("all");
  const [copiedSlip, setCopiedSlip] = useState(false);

  const [targetPathogen, setTargetPathogen] = useState<string>("Escherichia coli (Gram-Negative)");
  const [antibioticExposure, setAntibioticExposure] = useState<string>("Amoxicillin-Clavulanate (Penicillin)");
  const [immunityCapacity, setImmunityCapacity] = useState<number>(75);
  const [priorMisuse, setPriorMisuse] = useState<number>(30);
  const [virulenceIndex, setVirulenceIndex] = useState<number>(65);
  const [simulateMissedDose, setSimulateMissedDose] = useState<boolean>(false);
  const [showClinicalTooltip, setShowClinicalTooltip] = useState<boolean>(false);

  const failureRisk = Math.min(
    99,
    Math.max(
      8,
      Math.round(
        (100 - immunityCapacity) * 0.4 +
          priorMisuse * 0.35 +
          virulenceIndex * 0.35 +
          (simulateMissedDose ? 22 : 0)
      )
    )
  );

  const mutationVelocity = priorMisuse > 50 || simulateMissedDose ? "Accelerated (2.8x)" : "Standard (1.1x)";
  const projectedIcuDays = Math.round(4 + (failureRisk / 100) * 14 + (simulateMissedDose ? 5 : 0));

  const handleCopyHospitalSlip = () => {
    const text = `--- METROPOLITAN ACADEMIC HEALTH SYSTEM ---
CLINICAL MICROBIOLOGY VERIFIED REPORT COMPARISON
Report Verification Code: ${analysis?.uniqueAccessCode || "PRP-9021-8842-8801"}
Date: ${new Date().toLocaleDateString()}

PATIENT 1: ${patient1.name} (UHID: ${patient1.id}) | Ward: ${patient1.ward}
Pathogen: ${patient1.pathogen} | Specimen: ${patient1.specimen}
Blood Group: ${patient1.clinicalParams?.bloodGroup || "N/A"} | eGFR: ${patient1.clinicalParams?.bloodReport?.eGfr ?? "N/A"} mL/min

PATIENT 2: ${patient2.name} (UHID: ${patient2.id}) | Ward: ${patient2.ward}
Pathogen: ${patient2.pathogen} | Specimen: ${patient2.specimen}
Blood Group: ${patient2.clinicalParams?.bloodGroup || "N/A"} | eGFR: ${patient2.clinicalParams?.bloodReport?.eGfr ?? "N/A"} mL/min

HICC COHORTING STATUS:
Cross-Resistance Risk: ${analysis?.riskLevel || "High Risk"} (${analysis?.riskScore || 84}%)
Directive: Immediate spatial segregation required. Negative-pressure isolation for Bed 04.`;

    navigator.clipboard.writeText(text);
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 2000);
  };

  return (
    <section id="hospital-report-suite" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6">
      {/* 1. Header Banner */}
      <div className="rounded-2xl border border-teal-200 dark:border-teal-500/30 p-6 shadow-sm dark:shadow-2xl relative overflow-hidden bg-white dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-600 dark:text-teal-400">
                <Building2 className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                    Hospital Clinical Microbiology Suite
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-100 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
                    CLSI M100 / EUCAST Certified
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Dual-Patient Verified Laboratory Report Comparison
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Real-time hospital-grade comparative microbiology console for doctors, infection control officers (HICC),
              and patients. Review authentic pathology AST slips, simulate clinical scenario risks, and enforce cross-ward isolation protocols.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="bg-slate-100 dark:bg-slate-950/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center shadow-inner">
              <button
                type="button"
                id="hospital-doctor-mode-btn"
                onClick={() => setViewMode("doctor")}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "doctor"
                    ? "bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950 shadow-md shadow-teal-500/30"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor / Clinician View</span>
              </button>
              <button
                type="button"
                id="hospital-patient-mode-btn"
                onClick={() => setViewMode("patient")}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "patient"
                    ? "bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md shadow-cyan-500/30"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Patient / Family View</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyHospitalSlip}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Copy verified clinical audit summary"
            >
              {copiedSlip ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="text-teal-700 dark:text-teal-300">Slip Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Copy Clinical Slip</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Patient / Family View */}
      {viewMode === "patient" && (
        <div id="patient-accessible-guide-panel" className="rounded-2xl border border-cyan-200 dark:border-cyan-500/40 p-6 space-y-6 shadow-sm dark:shadow-xl bg-cyan-50/30 dark:bg-slate-950/90 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/40 flex items-center justify-center text-cyan-700 dark:text-cyan-400">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Patient &amp; Family Medical Report Guide
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Plain-language medical report translation for {patient1.name} and {patient2.name}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-100 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30">
              Verified Code: {analysis?.uniqueAccessCode || "PRP-9021-8842-8801"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900/90 border border-teal-200 dark:border-teal-500/30 rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">PATIENT 1 &bull; {patient1.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{patient1.ward}</span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-200 space-y-2.5 leading-relaxed">
                <p>
                  <strong>Bacteria Found:</strong> {patient1.pathogen}. Yeh bacteria standard antibiotics se resist kar raha hai.
                </p>
                <p>
                  <strong>Report Analysis:</strong> Doctors ne aapke kidney function (eGFR: {patient1.clinicalParams?.bloodReport?.eGfr ?? "N/A"} mL/min), Hemoglobin ({patient1.clinicalParams?.anemia?.hemoglobin ?? "N/A"} g/dL), aur blood group ({patient1.clinicalParams?.bloodGroup || "N/A"}) ke hisab se targeted safe medicine select ki hai.
                </p>
                <p className="text-teal-800 dark:text-teal-300 font-medium">
                  <strong>Safe Treatment:</strong> Ceftazidime-Avibactam / Polymyxin regimen start kiya gaya hai jo is strain par effective hai.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/90 border border-cyan-200 dark:border-cyan-500/30 rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400">PATIENT 2 &bull; {patient2.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{patient2.ward}</span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-200 space-y-2.5 leading-relaxed">
                <p>
                  <strong>Bacteria Found:</strong> {patient2.pathogen}. Yeh multi-drug resistant hospital strain hai.
                </p>
                <p>
                  <strong>Clinical Parameter Status:</strong> Blood Group {patient2.clinicalParams?.bloodGroup || "N/A"}, eGFR {patient2.clinicalParams?.bloodReport?.eGfr ?? "N/A"} mL/min, Hemoglobin {patient2.clinicalParams?.anemia?.hemoglobin ?? "N/A"} g/dL.
                </p>
                <p className="text-cyan-800 dark:text-cyan-300 font-medium">
                  <strong>Safety Instructions:</strong> Dedicated barrier precautions aur hygiene protocols strictly maintain kiye ja rahe hain.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Authentic Side-by-Side Hospital Medical Pathology Report Slips */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Official Hospital Laboratory Pathology Slips</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clinical Culture &amp; Sensitivity Testing (AST) formatted to hospital microbiology standards.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Filter AST:</span>
            <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg flex text-xs">
              <button
                onClick={() => setAstFilter("all")}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  astFilter === "all" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All Drugs
              </button>
              <button
                onClick={() => setAstFilter("shared-resistant")}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  astFilter === "shared-resistant" ? "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Shared Resistance
              </button>
              <button
                onClick={() => setAstFilter("sensitive")}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  astFilter === "sensitive" ? "bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Dual Sensitive
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                try {
                  executeMedicalPrint({
                    documentTitle: `Hospital_Microbiology_Report_${patient1.id}_vs_${patient2.id}`,
                    patient1,
                    patient2,
                    analysis: analysis || undefined,
                    rows: comparativeRows,
                  });
                } catch {
                  try { window.print(); } catch {}
                }
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
              title="Print or Save Hospital Medical Laboratory Slips as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slips / PDF</span>
            </button>
          </div>
        </div>

        {/* Dual Hospital Report Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PATIENT 1 LAB SLIP */}
          <div
            id="hospital-report-slip-patient-1"
            className="rounded-2xl border border-teal-200 dark:border-teal-500/40 bg-white dark:bg-slate-950 p-6 shadow-md dark:shadow-2xl space-y-4 font-sans text-xs relative transition-colors"
          >
            <div className="absolute top-4 right-4 rotate-12 border-2 border-teal-600 dark:border-teal-500/40 px-2 py-0.5 rounded text-[10px] font-mono uppercase text-teal-700 dark:text-teal-400 font-extrabold tracking-widest pointer-events-none">
              VERIFIED REPORT
            </div>
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 space-y-1">
              <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-400 font-mono text-[11px] font-bold">
                <Building2 className="w-4 h-4" />
                <span>APEX ACADEMIC HEALTH SYSTEM &bull; CENTRAL MICROBIOLOGY LAB</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Ref: LAB-2026-98124</span>
                <span className="font-mono text-teal-700 dark:text-teal-300 font-bold">UHID: {patient1.id}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">PATIENT NAME:</span>
                <span className="text-slate-900 dark:text-white font-bold">{patient1.name}</span> ({patient1.age} y/o, {patient1.gender})
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">HOSPITAL WARD:</span>
                <span className="text-amber-700 dark:text-amber-300 font-semibold">{patient1.ward}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">BLOOD &amp; eGFR:</span>
                <span className="text-teal-700 dark:text-teal-300 font-bold font-mono">
                  {patient1.clinicalParams?.bloodGroup || "N/A"} &bull; eGFR: {patient1.clinicalParams?.bloodReport?.eGfr ?? "N/A"} mL/min
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">HEMOGLOBIN &amp; BMI:</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">
                  Hb: {patient1.clinicalParams?.anemia?.hemoglobin ?? "N/A"} g/dL &bull; BMI: {patient1.clinicalParams?.vitals?.bmi ?? "N/A"}
                </span>
              </div>
            </div>

            {/* Antibiogram Table */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                ANTIMICROBIAL SUSCEPTIBILITY TEST (CLSI BREAKPOINTS):
              </span>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                    <tr>
                      <th className="py-1.5 px-3">Antibiotic Agent</th>
                      <th className="py-1.5 px-2">Class</th>
                      <th className="py-1.5 px-2">MIC (ug/mL)</th>
                      <th className="py-1.5 px-3 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                    {patient1.antibiotics.map((abx, i) => (
                      <tr key={`hosp-p1-${abx.drug}-${i}`} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="py-1.5 px-3 font-medium text-slate-800 dark:text-slate-200">{abx.drug}</td>
                        <td className="py-1.5 px-2 text-slate-500 dark:text-slate-400 text-[10px]">{abx.drugClass}</td>
                        <td className="py-1.5 px-2 font-mono text-slate-700 dark:text-slate-300">{abx.mic || "-"}</td>
                        <td className="py-1.5 px-3 text-right">
                          <span
                            className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                              abx.status === "Resistant"
                                ? "bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30"
                                : abx.status === "Sensitive"
                                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30"
                                : "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30"
                            }`}
                          >
                            {abx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* PATIENT 2 LAB SLIP */}
          <div
            id="hospital-report-slip-patient-2"
            className="rounded-2xl border border-cyan-200 dark:border-cyan-500/40 bg-white dark:bg-slate-950 p-6 shadow-md dark:shadow-2xl space-y-4 font-sans text-xs relative transition-colors"
          >
            <div className="absolute top-4 right-4 rotate-12 border-2 border-cyan-600 dark:border-cyan-500/40 px-2 py-0.5 rounded text-[10px] font-mono uppercase text-cyan-700 dark:text-cyan-400 font-extrabold tracking-widest pointer-events-none">
              VERIFIED REPORT
            </div>
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 space-y-1">
              <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-400 font-mono text-[11px] font-bold">
                <Building2 className="w-4 h-4" />
                <span>APEX ACADEMIC HEALTH SYSTEM &bull; CENTRAL MICROBIOLOGY LAB</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Ref: LAB-2026-77312</span>
                <span className="font-mono text-cyan-700 dark:text-cyan-300 font-bold">UHID: {patient2.id}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">PATIENT NAME:</span>
                <span className="text-slate-900 dark:text-white font-bold">{patient2.name}</span> ({patient2.age} y/o, {patient2.gender})
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">HOSPITAL WARD:</span>
                <span className="text-amber-700 dark:text-amber-300 font-semibold">{patient2.ward}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">BLOOD &amp; eGFR:</span>
                <span className="text-cyan-700 dark:text-cyan-300 font-bold font-mono">
                  {patient2.clinicalParams?.bloodGroup || "N/A"} &bull; eGFR: {patient2.clinicalParams?.bloodReport?.eGfr ?? "N/A"} mL/min
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">HEMOGLOBIN &amp; BMI:</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">
                  Hb: {patient2.clinicalParams?.anemia?.hemoglobin ?? "N/A"} g/dL &bull; BMI: {patient2.clinicalParams?.vitals?.bmi ?? "N/A"}
                </span>
              </div>
            </div>

            {/* Antibiogram Table */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                ANTIMICROBIAL SUSCEPTIBILITY TEST (CLSI BREAKPOINTS):
              </span>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                    <tr>
                      <th className="py-1.5 px-3">Antibiotic Agent</th>
                      <th className="py-1.5 px-2">Class</th>
                      <th className="py-1.5 px-2">MIC (ug/mL)</th>
                      <th className="py-1.5 px-3 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                    {patient2.antibiotics.map((abx, i) => (
                      <tr key={`hosp-p2-${abx.drug}-${i}`} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="py-1.5 px-3 font-medium text-slate-800 dark:text-slate-200">{abx.drug}</td>
                        <td className="py-1.5 px-2 text-slate-500 dark:text-slate-400 text-[10px]">{abx.drugClass}</td>
                        <td className="py-1.5 px-2 font-mono text-slate-700 dark:text-slate-300">{abx.mic || "-"}</td>
                        <td className="py-1.5 px-3 text-right">
                          <span
                            className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                              abx.status === "Resistant"
                                ? "bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30"
                                : abx.status === "Sensitive"
                                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30"
                                : "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30"
                            }`}
                          >
                            {abx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Scenario Input Controls & Dynamic Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div
          id="scenario-input-controls-card"
          className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-700/90 p-6 shadow-sm dark:shadow-2xl bg-white dark:bg-[#0e1626] space-y-5 transition-colors"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
              Scenario Input Controls
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30">
              Interactive Lab Simulator
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold tracking-wider text-[11px] uppercase">
                TARGET PATHOGEN / STRAIN
              </span>
              <button
                type="button"
                onClick={() => setShowClinicalTooltip(!showClinicalTooltip)}
                className="inline-flex items-center space-x-1 text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 text-xs transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span className="text-[11px]">Clinical Info</span>
              </button>
            </div>
            {showClinicalTooltip && (
              <div className="p-2.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 text-xs text-cyan-900 dark:text-cyan-200 leading-relaxed">
                Gram-negative organisms utilize outer membrane porin deletion and carbapenemase enzymes to neutralize beta-lactams.
              </div>
            )}
            <select
              value={targetPathogen}
              onChange={(e) => setTargetPathogen(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#080d1a] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 font-medium focus:outline-none focus:border-teal-500 transition-colors cursor-pointer"
            >
              <option value="Escherichia coli (Gram-Negative)">Escherichia coli (Gram-Negative)</option>
              <option value="Klebsiella pneumoniae (KPC-producing)">Klebsiella pneumoniae (KPC-producing)</option>
              <option value="Pseudomonas aeruginosa (Multi-Drug Resistant)">Pseudomonas aeruginosa (Multi-Drug Resistant)</option>
              <option value="Acinetobacter baumannii (Pan-Drug Resistant)">Acinetobacter baumannii (Pan-Drug Resistant)</option>
              <option value="Staphylococcus aureus (MRSA)">Staphylococcus aureus (MRSA)</option>
              <option value="Enterococcus faecium (VRE)">Enterococcus faecium (VRE)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold tracking-wider text-[11px] uppercase block">
              ANTIBIOTIC CLASS EXPOSURE
            </span>
            <select
              value={antibioticExposure}
              onChange={(e) => setAntibioticExposure(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#080d1a] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 font-medium focus:outline-none focus:border-teal-500 transition-colors cursor-pointer"
            >
              <option value="Amoxicillin-Clavulanate (Penicillin)">Amoxicillin-Clavulanate (Penicillin)</option>
              <option value="Meropenem / Imipenem (Carbapenem)">Meropenem / Imipenem (Carbapenem)</option>
              <option value="Ciprofloxacin / Levofloxacin (Fluoroquinolone)">Ciprofloxacin / Levofloxacin (Fluoroquinolone)</option>
              <option value="Ceftriaxone / Cefepime (Cephalosporin)">Ceftriaxone / Cefepime (Cephalosporin)</option>
              <option value="Colistin / Polymyxin B (Lipopeptide)">Colistin / Polymyxin B (Lipopeptide)</option>
              <option value="Piperacillin-Tazobactam (Zosyn)">Piperacillin-Tazobactam (Zosyn)</option>
            </select>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold tracking-wide text-[11px] uppercase">
                HOST IMMUNITY CAPACITY
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                {immunityCapacity}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={immunityCapacity}
              onChange={(e) => setImmunityCapacity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold tracking-wide text-[11px] uppercase">
                PRIOR ANTIBIOTIC MISUSE
              </span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">
                {priorMisuse}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={priorMisuse}
              onChange={(e) => setPriorMisuse(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold tracking-wide text-[11px] uppercase">
                PATHOGEN VIRULENCE INDEX
              </span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">
                {virulenceIndex}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={virulenceIndex}
              onChange={(e) => setVirulenceIndex(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
            <label className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                    simulateMissedDose ? "bg-teal-600 dark:bg-teal-500" : "bg-slate-300 dark:bg-slate-800"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      simulateMissedDose ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white uppercase tracking-wider block">
                    SIMULATE MISSED DOSE (DAY 3 NON-COMPLIANCE)
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Simulates sub-therapeutic serum troughs triggering mutant selection window.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={simulateMissedDose}
                onChange={(e) => setSimulateMissedDose(e.target.checked)}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {/* Live Hospital Clinical Outcome Predictions */}
        <div className="lg:col-span-6 rounded-2xl border border-teal-200 dark:border-teal-500/30 p-6 shadow-sm dark:shadow-2xl bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-[#0c1524] space-y-5 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Hospital Stewardship &amp; Prognosis Engine
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                Live Simulation Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                  Projected Treatment Failure Risk:
                </span>
                <div className="flex items-baseline space-x-1.5">
                  <span
                    className={`text-2xl font-mono font-extrabold ${
                      failureRisk > 70
                        ? "text-rose-600 dark:text-rose-400"
                        : failureRisk > 40
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {failureRisk}%
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {failureRisk > 70 ? "Critical Hazard" : failureRisk > 40 ? "Guarded" : "Manageable"}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all duration-300 ${
                      failureRisk > 70 ? "bg-rose-500" : failureRisk > 40 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${failureRisk}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                  Mutation Selection Velocity:
                </span>
                <span className="text-sm font-mono font-bold text-purple-700 dark:text-purple-300 block mt-1">
                  {mutationVelocity}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {priorMisuse > 50 ? "Heavy selective pressure" : "Baseline genetic drift"}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                  Projected Hospital / ICU Stay:
                </span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-mono font-bold text-slate-900 dark:text-white">
                    {projectedIcuDays}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">days</span>
                </div>
                <span className="text-[10px] text-cyan-700 dark:text-cyan-300 block">
                  {simulateMissedDose ? "+5 days prolonged by relapse" : "Estimated discharge timeframe"}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                  Stewardship Action:
                </span>
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 block mt-1">
                  {simulateMissedDose
                    ? "Immediate MIC Re-assay Required"
                    : failureRisk > 60
                    ? "Escalate to Novel Adjunct"
                    : "Standard Regimen Maintained"}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Pre-Auth Form Ready</span>
              </div>
            </div>
          </div>

          {/* Quick Action Button to Code Lookup */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-mono">
              Report Key: <strong className="text-teal-700 dark:text-teal-300">{analysis?.uniqueAccessCode || "PRP-9021-8842-8801"}</strong>
            </span>
            {onOpenCodeLookup && (
              <button
                type="button"
                onClick={() => onOpenCodeLookup(analysis?.uniqueAccessCode || "PRP-9021-8842-8801")}
                className="inline-flex items-center space-x-1 text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-semibold underline cursor-pointer"
              >
                <span>Open Verification Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
