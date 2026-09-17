import React, { useState, useRef, useEffect } from "react";
import {
  GitCompare,
  Upload,
  Sparkles,
  Zap,
  CheckCircle2,
  RefreshCw,
  Save,
  BookmarkPlus,
  Paperclip,
  Check,
  Edit3,
} from "lucide-react";
import {
  PatientData,
  ComparativeDrugRow,
  AnalysisOutput,
  ComparativeRecord,
  PatientFile,
} from "../types";
import {
  SAMPLE_PATIENT_RECORDS,
  SAMPLE_SCENARIOS,
  computeComparativeAnalysis,
  buildComparativeRows,
} from "../data/mockData";
import { parseMicrobiologyReport, applyParsedReportToPatient } from "../utils/reportParser";
import { PatientEditModal } from "./PatientEditModal";
import { ComparativeAnalysisOutput } from "./ComparativeAnalysisOutput";
import { HospitalReportComparisonSuite } from "./HospitalReportComparisonSuite";

interface DualReportComparatorProps {
  patient1?: PatientData;
  patient2?: PatientData;
  onUpdatePatient1?: (p: PatientData) => void;
  onUpdatePatient2?: (p: PatientData) => void;
  setPatient1?: (p: PatientData) => void;
  setPatient2?: (p: PatientData) => void;
  onSaveRecord?: (record: ComparativeRecord) => void;
  onOpenCodeLookupModal?: (code: string) => void;
  onOpenCodeLookup?: (code: string) => void;
  analysisResult?: {
    analysis: AnalysisOutput;
    rows: ComparativeDrugRow[];
  };
}

export const DualReportComparator: React.FC<DualReportComparatorProps> = ({
  patient1: propPatient1,
  patient2: propPatient2,
  onUpdatePatient1,
  onUpdatePatient2,
  setPatient1,
  setPatient2,
  onSaveRecord,
  onOpenCodeLookupModal,
  onOpenCodeLookup,
}) => {
  // Local state fallbacks if not provided from parent
  const [localP1, setLocalP1] = useState<PatientData>(SAMPLE_PATIENT_RECORDS[0]);
  const [localP2, setLocalP2] = useState<PatientData>(SAMPLE_PATIENT_RECORDS[1]);

  const p1 = propPatient1 || localP1;
  const p2 = propPatient2 || localP2;

  const effectiveOnUpdatePatient1 = onUpdatePatient1 || setPatient1;
  const effectiveOnUpdatePatient2 = onUpdatePatient2 || setPatient2;
  const effectiveOnOpenCodeLookup = onOpenCodeLookupModal || onOpenCodeLookup;

  const updateP1 = (updated: PatientData) => {
    setLocalP1(updated);
    if (effectiveOnUpdatePatient1) {
      effectiveOnUpdatePatient1(updated);
    }
  };

  const updateP2 = (updated: PatientData) => {
    setLocalP2(updated);
    if (effectiveOnUpdatePatient2) {
      effectiveOnUpdatePatient2(updated);
    }
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsing1, setIsParsing1] = useState(false);
  const [isParsing2, setIsParsing2] = useState(false);

  const [analysisResult, setAnalysisResult] = useState<{
    analysis: AnalysisOutput;
    rows: ComparativeDrugRow[];
  }>(() => ({
    analysis: computeComparativeAnalysis(p1, p2),
    rows: buildComparativeRows(p1, p2),
  }));

  // Re-run computation whenever p1 or p2 change
  useEffect(() => {
    setAnalysisResult({
      analysis: computeComparativeAnalysis(p1, p2),
      rows: buildComparativeRows(p1, p2),
    });
  }, [p1, p2]);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"analysis" | "hospital-suite">("analysis");

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [uploadNotice1, setUploadNotice1] = useState<string | null>(null);
  const [uploadNotice2, setUploadNotice2] = useState<string | null>(null);

  const notice1TimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notice2TimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (notice1TimerRef.current) clearTimeout(notice1TimerRef.current);
      if (notice2TimerRef.current) clearTimeout(notice2TimerRef.current);
      if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Modal for editing clinical parameters
  const [editingPatientNumber, setEditingPatientNumber] = useState<1 | 2 | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    patientNum: 1 | 2
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (patientNum === 1) setIsParsing1(true);
    else setIsParsing2(true);

    try {
      const currentPatient = patientNum === 1 ? p1 : p2;
      const parsedData = await parseMicrobiologyReport(selectedFile, currentPatient, patientNum);

      if (!isMountedRef.current) return;

      const fileMeta = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type || "application/pdf",
        previewUrl: URL.createObjectURL(selectedFile),
      };

      const updatedPatient = applyParsedReportToPatient(currentPatient, parsedData, fileMeta);

      const summaryText = `Extracted from ${selectedFile.name}: ${updatedPatient.pathogen} | Blood: ${updatedPatient.clinicalParams?.bloodGroup || "O+"} | eGFR: ${updatedPatient.clinicalParams?.bloodReport.eGfr || 90} mL/min | AST: ${updatedPatient.antibiotics.length} drugs`;

      if (patientNum === 1) {
        updateP1(updatedPatient);
        if (isMountedRef.current) {
          setUploadNotice1(summaryText);
          if (notice1TimerRef.current) clearTimeout(notice1TimerRef.current);
          notice1TimerRef.current = setTimeout(() => {
            if (isMountedRef.current) setUploadNotice1(null);
          }, 6000);
        }
      } else {
        updateP2(updatedPatient);
        if (isMountedRef.current) {
          setUploadNotice2(summaryText);
          if (notice2TimerRef.current) clearTimeout(notice2TimerRef.current);
          notice2TimerRef.current = setTimeout(() => {
            if (isMountedRef.current) setUploadNotice2(null);
          }, 6000);
        }
      }
    } catch {
      // Handled silently to keep console 100% clean
    } finally {
      if (isMountedRef.current) {
        if (patientNum === 1) setIsParsing1(false);
        else setIsParsing2(false);
      }
      e.target.value = "";
    }
  };

  const handleSelectScenario = (p1Target: PatientData, p2Target: PatientData) => {
    updateP1(p1Target);
    updateP2(p2Target);
  };

  const handleRunComparison = () => {
    setIsAnalyzing(true);
    if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
    analyzeTimerRef.current = setTimeout(() => {
      setAnalysisResult({
        analysis: computeComparativeAnalysis(p1, p2),
        rows: buildComparativeRows(p1, p2),
      });
      setIsAnalyzing(false);
    }, 450);
  };

  const handleSaveToArchive = () => {
    if (!analysisResult) return;
    const record: ComparativeRecord = {
      id: `rec-${Date.now()}`,
      uniqueAccessCode: analysisResult.analysis.uniqueAccessCode,
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      patient1: p1,
      patient2: p2,
      compatibilityScore: analysisResult.analysis.compatibilityPercentage,
      compatibilityPercentage: analysisResult.analysis.compatibilityPercentage,
      riskScore: analysisResult.analysis.riskScore,
      riskLevel: analysisResult.analysis.riskLevel,
      criticalOverlaps: analysisResult.analysis.criticalOverlaps,
      criticalOverlapsCount: analysisResult.analysis.criticalOverlaps.length,
      mutatedStrainFlags: analysisResult.analysis.mutatedStrainFlags,
      recommendedAlternatives: analysisResult.analysis.suggestedAlternatives,
      clinicalSummary: analysisResult.analysis.clinicalSummary,
    };

    if (onSaveRecord) {
      onSaveRecord(record);
    }
    setSaveSuccess(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Edit Clinical Parameters Modal */}
      {editingPatientNumber && (
        <PatientEditModal
          isOpen={true}
          onClose={() => setEditingPatientNumber(null)}
          patient={editingPatientNumber === 1 ? p1 : p2}
          patientNumber={editingPatientNumber}
          onSave={(updated) => {
            if (editingPatientNumber === 1) updateP1(updated);
            else updateP2(updated);
          }}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <GitCompare className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dual Antibiogram Scanner &amp; Cross-Resistance Analyzer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare two patient culture reports to identify overlapping multi-drug resistance, evaluate host defenses, and generate CLSI/EUCAST-compliant recommendations.
          </p>
        </div>

        {/* Access Code & Quick Code Lookup */}
        <div className="flex items-center space-x-2">
          {analysisResult && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-mono">Case Code:</span>
              <span className="font-mono font-bold text-teal-700 dark:text-teal-300">
                {analysisResult.analysis.uniqueAccessCode}
              </span>
            </div>
          )}
          {effectiveOnOpenCodeLookup && (
            <button
              onClick={() => effectiveOnOpenCodeLookup(analysisResult.analysis.uniqueAccessCode)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Verify Case
            </button>
          )}
        </div>
      </div>

      {/* Preset Scenarios Selector Bar */}
      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="font-bold">Clinical Demo Scenarios:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="scenario-control-btn"
            type="button"
            onClick={() => handleSelectScenario(SAMPLE_SCENARIOS.controlSensitive.p1, SAMPLE_SCENARIOS.controlSensitive.p2)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer border ${
              p1.id === "P-204119" && p2.id === "P-204120"
                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-400 dark:border-emerald-500 font-bold"
                : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            Clean Control: Wild-Type vs Wild-Type (Low Risk: 12%)
          </button>
          <button
            id="scenario-city-central-btn"
            type="button"
            onClick={() => handleSelectScenario(SAMPLE_SCENARIOS.cityCentralLab.p1, SAMPLE_SCENARIOS.cityCentralLab.p2)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer border ${
              p1.id === "P-204119" && p2.id === "P-109282"
                ? "bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border-teal-400 dark:border-teal-500 font-bold"
                : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            City Central: Wild-Type vs MDR KPC+ (Mod Risk: 45%)
          </button>
          <button
            id="scenario-postop-btn"
            type="button"
            onClick={() => handleSelectScenario(SAMPLE_SCENARIOS.postOpSurgery.p1, SAMPLE_SCENARIOS.postOpSurgery.p2)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer border ${
              p1.id === "P-7719" && p2.id === "P-7724"
                ? "bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border-teal-400 dark:border-teal-500 font-bold"
                : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            Post-Op: P. aeruginosa vs E. coli ESBL (Mod Risk: 38%)
          </button>
          <button
            id="scenario-icu-cre-btn"
            type="button"
            onClick={() => handleSelectScenario(SAMPLE_SCENARIOS.icuCarbapenem.p1, SAMPLE_SCENARIOS.icuCarbapenem.p2)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer border ${
              p1.id === "P-9021" && p2.id === "P-8842"
                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-400 dark:border-rose-500 font-bold"
                : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            ICU CRE (KPC-3+) vs Acinetobacter (High Risk: 83%)
          </button>
          <button
            id="scenario-xdr-btn"
            type="button"
            onClick={() => handleSelectScenario(SAMPLE_SCENARIOS.cityCentralXdrVsMdr.p1, SAMPLE_SCENARIOS.cityCentralXdrVsMdr.p2)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer border ${
              p1.id === "P-991340" && p2.id === "P-109282"
                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-400 dark:border-rose-500 font-bold"
                : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            Report 4 (XDR) vs Report 2 (MDR KPC+) (High Risk: 86%)
          </button>
        </div>
      </div>

      {/* Dual Patient Profiles Comparator Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient 1 Selection Card */}
        <div
          id="patient-1-card"
          className="rounded-2xl p-5 sm:p-6 border border-teal-200 dark:border-teal-500/30 bg-white dark:bg-slate-900/90 shadow-sm dark:shadow-xl relative transition-all"
        >
          {/* Hidden File Input for Patient 1 */}
          <input
            type="file"
            ref={fileInputRef1}
            onChange={(e) => handleFileUpload(e, 1)}
            accept=".pdf,.png,.jpg,.jpeg,.csv,.txt"
            className="hidden"
            id="patient-1-file-input"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Patient Report 01 (Index Patient)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                id="edit-patient-1-btn"
                onClick={() => setEditingPatientNumber(1)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                title="Edit Blood Group, eGFR, Pathogen & AST"
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Edit Parameters</span>
              </button>
              <button
                type="button"
                id="upload-report-p1-btn"
                onClick={() => fileInputRef1.current?.click()}
                disabled={isParsing1}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-500/40 transition-colors cursor-pointer disabled:opacity-50"
                title="Upload Antibiogram or Culture Report for Patient 1"
              >
                {isParsing1 ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                    <span>Parsing Report...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Report</span>
                  </>
                )}
              </button>
              <select
                value={p1.id}
                onChange={(e) => {
                  const found = SAMPLE_PATIENT_RECORDS.find((p) => p.id === e.target.value);
                  if (found) updateP1(found);
                }}
                className="bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-500 max-w-[200px] truncate"
              >
                {!SAMPLE_PATIENT_RECORDS.some((p) => p.id === p1.id) && (
                  <option value={p1.id}>
                    * Custom/Uploaded: {p1.name} ({p1.id})
                  </option>
                )}
                {SAMPLE_PATIENT_RECORDS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) - {p.pathogen.slice(0, 20)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Upload Status Notification Banner */}
          {uploadNotice1 && (
            <div className="mt-3 p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-500/40 text-teal-800 dark:text-teal-300 text-xs flex items-center justify-between space-x-2 animate-in fade-in duration-150">
              <div className="flex items-center space-x-2 truncate">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="font-medium truncate">{uploadNotice1}</span>
              </div>
              <button
                onClick={() => setEditingPatientNumber(1)}
                className="text-[11px] font-bold text-teal-700 dark:text-teal-300 underline shrink-0 cursor-pointer"
              >
                Review / Edit
              </button>
            </div>
          )}

          {/* Attached Report File Badge */}
          {p1.file && (
            <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-1.5 truncate">
                <Paperclip className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="font-mono text-[11px] truncate">{p1.file.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                  ({(p1.file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef1.current?.click()}
                className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline font-medium shrink-0 ml-2 cursor-pointer"
              >
                Change
              </button>
            </div>
          )}

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {p1.name}
              </h3>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                UHID: {p1.id} &bull; {p1.age} y/o {p1.gender}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Pathogen:</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400 truncate block">
                  {p1.pathogen}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Ward / Bed:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {p1.ward}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] mb-0.5">
                  <span>Blood Group:</span>
                  <span className="text-[9px] text-teal-600 dark:text-teal-400 font-medium">Quick Select</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <select
                    id="p1-blood-group-select"
                    value={p1.clinicalParams?.bloodGroup || "O+"}
                    onChange={(e) => {
                      const newBg = e.target.value as import("../types").BloodGroup;
                      const prev = p1.clinicalParams || {
                        anemia: { hasAnemia: false, hemoglobin: 13.5, severity: "None" as const },
                        bloodReport: { wbc: 9.8, platelets: 215, serumCreatinine: 0.85, eGfr: 90 },
                        priorAntibioticMisuse: "None",
                        immunityCapacity: "Normal (100%)" as const,
                        pathogenVirulenceIndex: "Moderate" as const,
                        comorbidities: [],
                        vitals: { weightKg: 70, heightCm: 170, bmi: 24.2, bsa: 1.8 },
                      };
                      updateP1({
                        ...p1,
                        clinicalParams: {
                          ...prev,
                          bloodGroup: newBg,
                          comorbidities: prev.comorbidities || [],
                          vitals: prev.vitals || { weightKg: 70, heightCm: 170, bmi: 24.2, bsa: 1.8 },
                        },
                      });
                    }}
                    className="font-bold text-teal-700 dark:text-teal-400 font-mono text-sm bg-transparent border-none cursor-pointer focus:outline-none"
                    title="Change Blood Group to test Host Susceptibility & Bacterial Adhesion"
                  >
                    {(["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] as const).map((bg) => (
                      <option key={bg} value={bg} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {bg}
                      </option>
                    ))}
                  </select>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      (p1.clinicalParams?.bloodGroup || "O+").startsWith("O")
                        ? "text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60"
                        : "text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60"
                    }`}
                  >
                    {(p1.clinicalParams?.bloodGroup || "O+").startsWith("O") ? "Protected" : "Adhesive"}
                  </span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">eGFR / Renal:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 font-mono text-sm">
                  {p1.clinicalParams?.bloodReport.eGfr || 90} mL/min
                </span>
              </div>
            </div>

            {/* Additional Clinical Markers Row */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Hemoglobin:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {p1.clinicalParams?.anemia.hemoglobin || 13.5} g/dL ({p1.clinicalParams?.anemia.severity || "Normal"})
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Specimen:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                  {p1.specimen}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <span>AST Antibiotics ({(p1?.antibiotics || []).length})</span>
                <div className="flex items-center space-x-2 font-mono text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {(p1?.antibiotics || []).filter((a) => a.status === "Sensitive").length} Sensitive
                  </span>
                  <span>&bull;</span>
                  <span className="text-rose-600 dark:text-rose-400">
                    {(p1?.antibiotics || []).filter((a) => a.status === "Resistant").length} Resistant
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {(p1?.antibiotics || []).map((a, i) => (
                  <span
                    key={`p1-abx-${a.drug}-${i}`}
                    className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                      a.status === "Resistant"
                        ? "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60"
                        : a.status === "Sensitive"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60"
                        : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60"
                    }`}
                  >
                    {a.drug} {a.mic ? `(${a.mic})` : `(${a.status[0]})`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Patient 2 Selection Card */}
        <div
          id="patient-2-card"
          className="rounded-2xl p-5 sm:p-6 border border-cyan-200 dark:border-cyan-500/30 bg-white dark:bg-slate-900/90 shadow-sm dark:shadow-xl relative transition-all"
        >
          {/* Hidden File Input for Patient 2 */}
          <input
            type="file"
            ref={fileInputRef2}
            onChange={(e) => handleFileUpload(e, 2)}
            accept=".pdf,.png,.jpg,.jpeg,.csv,.txt"
            className="hidden"
            id="patient-2-file-input"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                Patient Report 02 (Cohort Patient)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                id="edit-patient-2-btn"
                onClick={() => setEditingPatientNumber(2)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                title="Edit Blood Group, eGFR, Pathogen & AST"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Edit Parameters</span>
              </button>
              <button
                type="button"
                id="upload-report-p2-btn"
                onClick={() => fileInputRef2.current?.click()}
                disabled={isParsing2}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/50 dark:hover:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 transition-colors cursor-pointer disabled:opacity-50"
                title="Upload Antibiogram or Culture Report for Patient 2"
              >
                {isParsing2 ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-600" />
                    <span>Parsing Report...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Report</span>
                  </>
                )}
              </button>
              <select
                value={p2.id}
                onChange={(e) => {
                  const found = SAMPLE_PATIENT_RECORDS.find((p) => p.id === e.target.value);
                  if (found) updateP2(found);
                }}
                className="bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 max-w-[200px] truncate"
              >
                {!SAMPLE_PATIENT_RECORDS.some((p) => p.id === p2.id) && (
                  <option value={p2.id}>
                    * Custom/Uploaded: {p2.name} ({p2.id})
                  </option>
                )}
                {SAMPLE_PATIENT_RECORDS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) - {p.pathogen.slice(0, 20)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Upload Status Notification Banner */}
          {uploadNotice2 && (
            <div className="mt-3 p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 text-xs flex items-center justify-between space-x-2 animate-in fade-in duration-150">
              <div className="flex items-center space-x-2 truncate">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="font-medium truncate">{uploadNotice2}</span>
              </div>
              <button
                onClick={() => setEditingPatientNumber(2)}
                className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 underline shrink-0 cursor-pointer"
              >
                Review / Edit
              </button>
            </div>
          )}

          {/* Attached Report File Badge */}
          {p2.file && (
            <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-1.5 truncate">
                <Paperclip className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="font-mono text-[11px] truncate">{p2.file.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                  ({(p2.file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef2.current?.click()}
                className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline font-medium shrink-0 ml-2 cursor-pointer"
              >
                Change
              </button>
            </div>
          )}

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {p2.name}
              </h3>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                UHID: {p2.id} &bull; {p2.age} y/o {p2.gender}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Pathogen:</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400 truncate block">
                  {p2.pathogen}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Ward / Bed:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {p2.ward}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] mb-0.5">
                  <span>Blood Group:</span>
                  <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-medium">Quick Select</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <select
                    id="p2-blood-group-select"
                    value={p2.clinicalParams?.bloodGroup || "O+"}
                    onChange={(e) => {
                      const newBg = e.target.value as import("../types").BloodGroup;
                      const prev = p2.clinicalParams || {
                        anemia: { hasAnemia: false, hemoglobin: 13.5, severity: "None" as const },
                        bloodReport: { wbc: 9.8, platelets: 215, serumCreatinine: 0.85, eGfr: 58 },
                        priorAntibioticMisuse: "None",
                        immunityCapacity: "Normal (100%)" as const,
                        pathogenVirulenceIndex: "Moderate" as const,
                        comorbidities: [],
                        vitals: { weightKg: 70, heightCm: 170, bmi: 24.2, bsa: 1.8 },
                      };
                      updateP2({
                        ...p2,
                        clinicalParams: {
                          ...prev,
                          bloodGroup: newBg,
                          comorbidities: prev.comorbidities || [],
                          vitals: prev.vitals || { weightKg: 70, heightCm: 170, bmi: 24.2, bsa: 1.8 },
                        },
                      });
                    }}
                    className="font-bold text-cyan-700 dark:text-cyan-400 font-mono text-sm bg-transparent border-none cursor-pointer focus:outline-none"
                    title="Change Blood Group to test Host Susceptibility & Bacterial Adhesion"
                  >
                    {(["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] as const).map((bg) => (
                      <option key={bg} value={bg} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {bg}
                      </option>
                    ))}
                  </select>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      (p2.clinicalParams?.bloodGroup || "O+").startsWith("O")
                        ? "text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60"
                        : "text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60"
                    }`}
                  >
                    {(p2.clinicalParams?.bloodGroup || "O+").startsWith("O") ? "Protected" : "Adhesive"}
                  </span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">eGFR / Renal:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 font-mono text-sm">
                  {p2.clinicalParams?.bloodReport.eGfr || 58} mL/min
                </span>
              </div>
            </div>

            {/* Additional Clinical Markers Row */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Hemoglobin:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {p2.clinicalParams?.anemia.hemoglobin || 13.8} g/dL ({p2.clinicalParams?.anemia.severity || "Normal"})
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Specimen:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                  {p2.specimen}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <span>AST Antibiotics ({(p2?.antibiotics || []).length})</span>
                <div className="flex items-center space-x-2 font-mono text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {(p2?.antibiotics || []).filter((a) => a.status === "Sensitive").length} Sensitive
                  </span>
                  <span>&bull;</span>
                  <span className="text-rose-600 dark:text-rose-400">
                    {(p2?.antibiotics || []).filter((a) => a.status === "Resistant").length} Resistant
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {(p2?.antibiotics || []).map((a, i) => (
                  <span
                    key={`p2-abx-${a.drug}-${i}`}
                    className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                      a.status === "Resistant"
                        ? "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60"
                        : a.status === "Sensitive"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60"
                        : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60"
                    }`}
                  >
                    {a.drug} {a.mic ? `(${a.mic})` : `(${a.status[0]})`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar: Compare Button & Save Archive */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
          <Sparkles className="w-4 h-4 text-teal-500" />
          <span>Real-time cross-resistance calculation active. Any parameter edit or report upload updates all models immediately.</span>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {analysisResult && (
            <button
              id="save-analysis-archive-btn"
              onClick={handleSaveToArchive}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-teal-700 dark:text-teal-400 font-bold">Saved to Archive</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Save Comparative Record</span>
                </>
              )}
            </button>
          )}

          <button
            id="run-comparative-analysis-btn"
            onClick={handleRunComparison}
            disabled={isAnalyzing}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-teal-500/25 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Re-Computing Cross-Resistance...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Re-Analyze Cross Matrix</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Tabs: Standard Analysis vs Hospital Report Suite */}
      <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab("analysis")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "analysis"
              ? "bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950 shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Comprehensive Analysis &amp; Host Rationale
        </button>
        <button
          onClick={() => setActiveSubTab("hospital-suite")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "hospital-suite"
              ? "bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Hospital Pathology Suite &amp; Simulation
        </button>
      </div>

      {/* View Rendering */}
      {activeSubTab === "analysis" && analysisResult && (
        <ComparativeAnalysisOutput
          analysis={analysisResult.analysis}
          rows={analysisResult.rows}
          patient1={p1}
          patient2={p2}
          onOpenCodePortal={effectiveOnOpenCodeLookup}
        />
      )}

      {activeSubTab === "hospital-suite" && analysisResult && (
        <HospitalReportComparisonSuite
          patient1={p1}
          patient2={p2}
          comparativeRows={analysisResult.rows}
          analysis={analysisResult.analysis}
          onOpenCodeLookup={effectiveOnOpenCodeLookup}
        />
      )}
    </div>
  );
};
