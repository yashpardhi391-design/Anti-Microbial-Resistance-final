import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Dna,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { PatientData, WhyBacteriaAffectsReport } from "../types";

interface PathogenHostDefenseReportViewProps {
  patient1: PatientData;
  patient2: PatientData;
  report?: WhyBacteriaAffectsReport;
}

export const PathogenHostDefenseReportView: React.FC<PathogenHostDefenseReportViewProps> = ({
  patient1,
  patient2,
  report,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"side-by-side" | "matrix" | "hindi-guide">("side-by-side");
  const [expandedFactor, setExpandedFactor] = useState<number | null>(0);

  if (!report) return null;

  const handleCopySummary = () => {
    const text = `=== PHARMARESIST PRO: PATHOGEN HOST DEFENSE COMPARATIVE DOSSIER ===
REPORT: ${report.title}
SUMMARY: ${report.executiveSummary}

PATIENT 1: ${patient1.name} (${patient1.id}) - ${patient1.pathogen}
Impact: ${report.patient1Summary.overallImpact}
Why Affects:
${report.patient1Summary.whyAffectsOrNotBullets.map((b) => `  - ${b}`).join("\n")}
Bacterial Resistance Failure: ${report.patient1Summary.bacterialResistanceFailureReason}
Host Defense Breakdown: ${report.patient1Summary.hostDefenseBreakdown}

PATIENT 2: ${patient2.name} (${patient2.id}) - ${patient2.pathogen}
Impact: ${report.patient2Summary.overallImpact}
Why Protected/Different:
${report.patient2Summary.whyAffectsOrNotBullets.map((b) => `  - ${b}`).join("\n")}
Microbial Mechanism: ${report.patient2Summary.bacterialResistanceFailureReason}
Defense Shield: ${report.patient2Summary.hostDefenseBreakdown}

HINDI SUMMARY (सरल हिंदी में समझें):
${report.bilingualKeyPointsHindi.points.map((p) => `${p.factor}: ${p.kyoAsarKartaHaiYaNahi}`).join("\n\n")}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="pathogen-host-defense-report"
      className="rounded-2xl border-2 border-teal-500/40 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl overflow-hidden transition-all duration-300"
    >
      {/* Dossier Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-5 sm:p-6 text-white border-b border-teal-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-[11px] font-mono font-bold text-teal-300 uppercase tracking-widest">
              <Dna className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>Host-Pathogen Susceptibility &amp; Resistance Rationale Dossier</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Why Does This Bacteria Affect Person 1, But NOT Person 2?</span>
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/80 max-w-3xl leading-relaxed font-sans">
              यह बैक्टीरिया क्यों Patient 1 को नुकसान पहुँचाता है और Patient 2 को सुरक्षित रखता है &bull; Mechanistic evaluation of Blood Group antigens, tissue oxygenation, hydrodynamic renal clearance, and mutational enzyme shields.
            </p>
          </div>
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={handleCopySummary}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600/40 hover:bg-teal-600/60 text-white font-semibold text-xs border border-teal-400/40 transition-all cursor-pointer shadow-sm hover:shadow-teal-500/20"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-teal-200" />}
              <span>{copied ? "Copied Rationale!" : "Copy Full Rationale"}</span>
            </button>
          </div>
        </div>

        {/* Executive Clinical Summary Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/60 border border-teal-500/30 text-xs text-slate-200 leading-relaxed font-mono">
          <span className="text-teal-400 font-bold uppercase tracking-wider block mb-1">
            Clinical Executive Finding:
          </span>
          {report.executiveSummary}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-5 border-t border-slate-800 pt-3">
          <button
            onClick={() => setActiveTab("side-by-side")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "side-by-side"
                ? "bg-teal-500 text-slate-950 shadow-md font-mono"
                : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            Dual Patient Comparison Cards
          </button>
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "matrix"
                ? "bg-teal-500 text-slate-950 shadow-md font-mono"
                : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            Factor-by-Factor Mechanism Table ({report.detailedFactors.length})
          </button>
          <button
            onClick={() => setActiveTab("hindi-guide")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "hindi-guide"
                ? "bg-amber-400 text-slate-950 shadow-md font-mono"
                : "bg-slate-800/80 text-amber-300 hover:text-amber-200 hover:bg-slate-800"
            }`}
          >
            सरल हिंदी में समझें (Simple Explanation)
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        {/* TAB 1: SIDE-BY-SIDE CARDS */}
        {activeTab === "side-by-side" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient 1 Vulnerability Card */}
            <div className="rounded-2xl border-2 border-rose-300 dark:border-rose-900/60 bg-gradient-to-b from-rose-50/70 to-white dark:from-rose-950/20 dark:to-slate-900 p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-start justify-between border-b border-rose-200 dark:border-rose-900/50 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">
                    Patient 1 Pathogen Status
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {patient1.name} (UHID: {patient1.id})
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Pathogen: <strong className="text-rose-700 dark:text-rose-400">{patient1.pathogen}</strong>
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/50 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 text-[11px] font-bold font-mono text-right shrink-0">
                  <ShieldAlert className="w-3.5 h-3.5 inline mr-1 text-rose-600 dark:text-rose-400" />
                  HIGH VULNERABILITY
                </div>
              </div>

              {/* Specific Reasons Bullets */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Why the Bacteria Invades &amp; Affects Patient 1:</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  {report.patient1Summary.whyAffectsOrNotBullets.map((bullet, idx) => (
                    <li
                      key={`p1-affects-${idx}`}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-rose-200 dark:border-rose-900/40 text-slate-800 dark:text-slate-200 leading-relaxed font-sans shadow-xs flex items-start gap-2"
                    >
                      <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enzymatic Drug Failure Breakdown */}
              <div className="p-3.5 rounded-xl bg-rose-100/50 dark:bg-rose-950/40 border border-rose-300/80 dark:border-rose-800 text-xs space-y-1">
                <span className="font-bold text-rose-800 dark:text-rose-300 block font-mono">
                  Why Standard Antibiotics Fail (Enzymatic Barrier):
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {report.patient1Summary.bacterialResistanceFailureReason}
                </p>
              </div>

              {/* Host Defense Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block font-mono">
                  Innate Host Defense Breakdown:
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {report.patient1Summary.hostDefenseBreakdown}
                </p>
              </div>
            </div>

            {/* Patient 2 Protection Shield Card */}
            <div className="rounded-2xl border-2 border-emerald-300 dark:border-emerald-900/60 bg-gradient-to-b from-emerald-50/70 to-white dark:from-emerald-950/20 dark:to-slate-900 p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-start justify-between border-b border-emerald-200 dark:border-emerald-900/50 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
                    Patient 2 Pathogen Status
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {patient2.name} (UHID: {patient2.id})
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Pathogen: <strong className="text-emerald-700 dark:text-emerald-400">{patient2.pathogen}</strong>
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold font-mono text-right shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-600 dark:text-emerald-400" />
                  DEFENSE SHIELD ACTIVE
                </div>
              </div>

              {/* Specific Protection Bullets */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Why Bacteria Cannot Colonize / Has Lower Impact on Patient 2:</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  {report.patient2Summary.whyAffectsOrNotBullets.map((bullet, idx) => (
                    <li
                      key={`p2-affects-${idx}`}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-emerald-200 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200 leading-relaxed font-sans shadow-xs flex items-start gap-2"
                    >
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Microbial Susceptibility Breakdown */}
              <div className="p-3.5 rounded-xl bg-emerald-100/50 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800 text-xs space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block font-mono">
                  Antimicrobial Treatment Sensitivity:
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {report.patient2Summary.bacterialResistanceFailureReason}
                </p>
              </div>

              {/* Host Defense Intact Summary */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block font-mono">
                  Active Host Clearance Shield:
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {report.patient2Summary.hostDefenseBreakdown}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED FACTOR MATRIX */}
        {activeTab === "matrix" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">
              Click any physiological factor below to expand the exact molecular, biochemical, and pharmacological rationale comparing both patients:
            </p>
            <div className="space-y-3">
              {report.detailedFactors.map((factor, index) => {
                const isExpanded = expandedFactor === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => setExpandedFactor(isExpanded ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-xs font-mono">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                            {factor.factorTitle}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {factor.clinicalVerdict}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-medium hidden sm:inline">
                          View Rationale
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4 text-xs">
                        {/* Scientific Mechanism */}
                        <div className="p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 text-teal-950 dark:text-teal-200 leading-relaxed font-sans">
                          <strong className="font-bold font-mono uppercase block text-[11px] text-teal-800 dark:text-teal-400 mb-0.5">
                            Microbiological &amp; Immunological Principle:
                          </strong>
                          {factor.scientificMechanism}
                        </div>

                        {/* Dual Patient Comparative Columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-slate-950 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                                {patient1.name} ({factor.p1Status.value})
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">
                                {factor.p1Status.isProtected ? "Protected" : "Susceptible / Affected"}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {factor.p1Status.effectDescription}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-slate-950 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                                {patient2.name} ({factor.p2Status.value})
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                                {factor.p2Status.isProtected ? "Protected / Cleared" : "Susceptible"}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {factor.p2Status.effectDescription}
                            </p>
                          </div>
                        </div>

                        {/* Clinical Takeaway */}
                        <div className="p-2.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px] flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span>
                            <strong>Clinical Verdict:</strong> {factor.clinicalVerdict}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: BILINGUAL HINDI GUIDE */}
        {activeTab === "hindi-guide" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 text-amber-950 dark:text-amber-200 space-y-1">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{report.bilingualKeyPointsHindi.heading}</span>
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                यह खंड सरल भाषा में बताता है कि क्यों एक ही बैक्टीरिया Person 1 को गंभीर बीमार करता है जबकि Person 2 को कोई नुकसान नहीं पहुंचाता।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.bilingualKeyPointsHindi.points.map((pt, i) => (
                <div
                  key={`hindi-pt-${i}-${pt.factor}`}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-2 shadow-xs"
                >
                  <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-400 font-bold text-xs font-mono border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    <span>{pt.factor}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {pt.kyoAsarKartaHaiYaNahi}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick summary box */}
            <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-2 text-xs font-sans">
              <h4 className="font-bold text-teal-400 uppercase tracking-wider text-[11px] font-mono">
                क्लीनिकल निष्कर्ष (Doctor &amp; Patient Takeaway):
              </h4>
              <p className="text-slate-300 leading-relaxed">
                बैक्टीरिया केवल बीज है, और मरीज का शरीर खेत (ज़मीन)। Person 1 के कमजोर इम्यून सिस्टम, एनीमिया (कम हीमोग्लोबिन) और रिसेप्टर्स की वजह से बैक्टीरिया ने आक्रमण कर दिया। Person 2 की मजबूत प्रतिरोधक क्षमता और प्राकृतिक सफाई तंत्र ने बैक्टीरिया को शरीर से बाहर निकाल दिया।
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
