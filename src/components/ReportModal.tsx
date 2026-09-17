import React, { useRef, useState } from "react";
import { X, Printer, Shield, Dna, CheckCircle2, Download } from "lucide-react";
import { AnalysisOutput, ComparativeDrugRow, PatientData } from "../types";
import { executeMedicalPrint } from "../utils/printReport";
import { SAMPLE_PATIENT_RECORDS, computeComparativeAnalysis, buildComparativeRows } from "../data/mockData";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis?: AnalysisOutput;
  rows?: ComparativeDrugRow[];
  patient1?: PatientData;
  patient2?: PatientData;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  analysis,
  rows,
  patient1,
  patient2,
}) => {
  const [printNotice, setPrintNotice] = useState<string | null>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const safeP1: PatientData = patient1 || SAMPLE_PATIENT_RECORDS[0];
  const safeP2: PatientData = patient2 || SAMPLE_PATIENT_RECORDS[1];
  const safeAnalysis: AnalysisOutput = analysis || computeComparativeAnalysis(safeP1, safeP2);
  const safeRows: ComparativeDrugRow[] = rows && rows.length > 0 ? rows : buildComparativeRows(safeP1, safeP2);

  const handlePrint = () => {
    try {
      setPrintNotice("Generating high-resolution official laboratory dossier...");
      const result = executeMedicalPrint({
        documentTitle: `PharmaResist_${safeP1.id}_vs_${safeP2.id}_Comparative_Report`,
        patient1: safeP1,
        patient2: safeP2,
        analysis: safeAnalysis,
        rows: safeRows,
        element: modalContainerRef.current,
      });

      if (result.method === "browser") {
        setPrintNotice("Print dialog opened. Select 'Save as PDF' or your printer.");
      } else if (result.method === "popup") {
        setPrintNotice("Print preview opened in standalone window.");
      } else {
        setPrintNotice("Report exported as standalone PDF-ready HTML document!");
      }

      setTimeout(() => {
        setPrintNotice(null);
      }, 4000);
    } catch {
      // Fallback without throwing
      try {
        window.print();
      } catch {
        setPrintNotice("Report generated. Use Ctrl+P to print or open in full window.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 dark:bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div
        ref={modalContainerRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl glass-panel border border-slate-200 dark:border-slate-700 p-6 sm:p-8 bg-white dark:bg-slate-900 shadow-2xl text-slate-900 dark:text-slate-100 transition-colors"
      >
        {/* Print Status Feedback Toast */}
        {printNotice && (
          <div className="no-print mb-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-700 flex items-center justify-between text-xs text-teal-800 dark:text-teal-200 animate-in fade-in duration-150">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="font-semibold">{printNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setPrintNotice(null)}
              className="text-teal-600 dark:text-teal-400 hover:underline font-bold text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Modal Action Bar (No Print) */}
        <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
            <Shield className="w-4 h-4" />
            <span>CONFIDENTIAL MEDICAL ANTIMICROBIAL DOSSIER</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              id="report-modal-print-btn"
              onClick={handlePrint}
              aria-label="Print or Save Report as PDF"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Report Modal"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Laboratory Header */}
        <div className="border-b-2 border-slate-200 dark:border-slate-700 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-500/20 border border-teal-300 dark:border-teal-500/40 flex items-center justify-center text-teal-700 dark:text-teal-400">
                  <Dna className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                  PHARMA<span className="text-teal-600 dark:text-teal-400">RESIST</span> PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Hospital Clinical Microbiology &amp; Antimicrobial Stewardship Division
              </p>
            </div>
            <div className="text-right text-xs font-mono space-y-0.5 text-slate-500 dark:text-slate-400">
              <p>
                Report ID: <span className="text-slate-900 dark:text-white font-bold">{safeAnalysis.uniqueAccessCode || `AST-CMP-${Date.now().toString().slice(-6)}`}</span>
              </p>
              <p>
                Date: <span className="text-slate-700 dark:text-slate-200 font-medium">{new Date().toLocaleDateString()}</span>
              </p>
              <p>
                Standard: <span className="text-teal-700 dark:text-teal-400 font-bold">EUCAST / CLSI M100-Ed34</span>
              </p>
            </div>
          </div>
        </div>

        {/* Dual Patient Profiles Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl bg-teal-50/50 dark:bg-slate-950/70 border border-teal-200 dark:border-slate-800 p-4 text-xs space-y-1">
            <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 uppercase font-bold tracking-wider">
              Patient 1 Profile (Index Patient)
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {safeP1.name} (ID: {safeP1.id})
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Age/Ward: {safeP1.age} y/o &bull; {safeP1.ward}
            </p>
            <p className="text-teal-700 dark:text-teal-300 font-semibold">Pathogen: {safeP1.pathogen}</p>
            <p className="text-slate-600 dark:text-slate-400">Specimen: {safeP1.specimen}</p>
            {safeP1.clinicalParams && (
              <p className="text-slate-500 dark:text-slate-400 pt-1 font-mono text-[11px]">
                Blood: {safeP1.clinicalParams.bloodGroup || "O+"} | Hb: {safeP1.clinicalParams.anemia?.hemoglobin ?? 13.5} g/dL | eGFR: {safeP1.clinicalParams.bloodReport?.eGfr ?? 90} mL/min
              </p>
            )}
          </div>
          <div className="rounded-xl bg-cyan-50/50 dark:bg-slate-950/70 border border-cyan-200 dark:border-slate-800 p-4 text-xs space-y-1">
            <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 uppercase font-bold tracking-wider">
              Patient 2 Profile (Comparative Isolate)
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {safeP2.name} (ID: {safeP2.id})
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Age/Ward: {safeP2.age} y/o &bull; {safeP2.ward}
            </p>
            <p className="text-cyan-700 dark:text-cyan-300 font-semibold">Pathogen: {safeP2.pathogen}</p>
            <p className="text-slate-600 dark:text-slate-400">Specimen: {safeP2.specimen}</p>
            {safeP2.clinicalParams && (
              <p className="text-slate-500 dark:text-slate-400 pt-1 font-mono text-[11px]">
                Blood: {safeP2.clinicalParams.bloodGroup || "AB+"} | Hb: {safeP2.clinicalParams.anemia?.hemoglobin ?? 12.0} g/dL | eGFR: {safeP2.clinicalParams.bloodReport?.eGfr ?? 65} mL/min
              </p>
            )}
          </div>
        </div>

        {/* Risk & Compatibility Status Summary */}
        <div className="rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-4 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Cross-Resistance Risk Level</span>
            <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
              {safeAnalysis.riskLevel}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Resistance Profile Overlap</span>
            <span className="text-base font-bold text-teal-700 dark:text-teal-400 font-mono">
              {safeAnalysis.compatibilityPercentage}%
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Risk Severity Index</span>
            <span className="text-base font-bold text-rose-600 dark:text-rose-400 font-mono">
              {safeAnalysis.riskScore}/100
            </span>
          </div>
        </div>

        {/* Antibiogram Matrix Table */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
            Comparative Antibiogram Susceptibility Matrix
          </h4>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-2.5">Antibiotic</th>
                  <th className="p-2.5">Class</th>
                  <th className="p-2.5">{safeP1.name}</th>
                  <th className="p-2.5">{safeP2.name}</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {safeRows.length > 0 ? (
                  safeRows.map((row) => (
                    <tr key={row.id}>
                      <td className="p-2.5 font-sans font-semibold text-slate-900 dark:text-white">{row.drug}</td>
                      <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">{row.drugClass}</td>
                      <td className="p-2.5 text-slate-800 dark:text-slate-200">
                        {row.p1Status} ({row.p1Mic || "N/A"})
                      </td>
                      <td className="p-2.5 text-slate-800 dark:text-slate-200">
                        {row.p2Status} ({row.p2Mic || "N/A"})
                      </td>
                      <td className="p-2.5 font-sans text-xs font-semibold">{row.crossCompatibility}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500 font-sans">
                      No comparative antibiotic records to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Directives */}
        <div className="space-y-4 mb-6 text-xs">
          <div>
            <h5 className="font-bold text-rose-600 dark:text-rose-400 mb-1">Critical Overlaps</h5>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300">
              {(safeAnalysis.criticalOverlaps || []).map((o, i) => (
                <li key={`rep-overlap-${i}-${o}`}>{o}</li>
              ))}
              {(!safeAnalysis.criticalOverlaps || safeAnalysis.criticalOverlaps.length === 0) && (
                <li className="text-slate-500 list-none">No critical overlaps detected between isolates.</li>
              )}
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-amber-700 dark:text-amber-400 mb-1">Mutational Resistance Markers</h5>
            <div className="flex flex-wrap gap-1.5">
              {(safeAnalysis.mutatedStrainFlags || []).map((m, i) => (
                <span
                  key={`rep-mut-${i}-${m}`}
                  className="px-2 py-0.5 rounded bg-amber-50 dark:bg-slate-800 font-mono text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-slate-700"
                >
                  {m}
                </span>
              ))}
              {(!safeAnalysis.mutatedStrainFlags || safeAnalysis.mutatedStrainFlags.length === 0) && (
                <span className="text-slate-500 text-[11px]">No active mutational resistance markers flagged.</span>
              )}
            </div>
          </div>
          <div>
            <h5 className="font-bold text-teal-700 dark:text-teal-400 mb-1">Recommended Alternative Therapies</h5>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300">
              {(safeAnalysis.suggestedAlternatives || []).map((alt, i) => (
                <li key={`rep-alt-${i}-${alt}`}>{alt}</li>
              ))}
              {(!safeAnalysis.suggestedAlternatives || safeAnalysis.suggestedAlternatives.length === 0) && (
                <li className="text-slate-500 list-none">Standard first-line antibiotic regimens applicable.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Pathogen Host Susceptibility & Defense Rationale Section */}
        {safeAnalysis.whyBacteriaAffectsReport && (
          <div className="mb-6 p-4 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/40 dark:bg-slate-950/70 space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-400 font-bold uppercase tracking-wider text-[11px] font-mono">
              <Dna className="w-4 h-4" />
              <span>Host Susceptibility &amp; Bacterial Penetration Analysis (Why Bacteria Affects Person 1 vs 2)</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {safeAnalysis.whyBacteriaAffectsReport.executiveSummary}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-1">
                <span className="font-bold text-rose-800 dark:text-rose-400 block font-mono text-[11px]">
                  {safeP1.name} (Vulnerable / Bacterial Invasion):
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 text-[11px]">
                  {(safeAnalysis.whyBacteriaAffectsReport?.patient1Summary?.whyAffectsOrNotBullets || [])
                    .slice(0, 3)
                    .map((b, i) => (
                      <li key={`p1-bullet-${i}`}>{b}</li>
                    ))}
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 block font-mono text-[11px]">
                  {safeP2.name} (Protected / Defense Shield Active):
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 text-[11px]">
                  {(safeAnalysis.whyBacteriaAffectsReport?.patient2Summary?.whyAffectsOrNotBullets || [])
                    .slice(0, 3)
                    .map((b, i) => (
                      <li key={`p2-bullet-${i}`}>{b}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Stewardship Signatures */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Elena Vance, MD, FACP</p>
            <p>Lead Clinical Microbiologist, Antimicrobial Stewardship</p>
            <p className="text-[10px] text-teal-700 dark:text-teal-400 mt-0.5 font-medium">
              Electronically Verified &bull; EUCAST Protocol 2026
            </p>
          </div>
          <div className="text-right sm:text-right">
            <p className="text-[10px]">Pharma Resist Pro Clinical Engine</p>
            <p className="font-mono text-slate-400 dark:text-slate-500">HASH: 9a7b-88e2-c441-2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};
