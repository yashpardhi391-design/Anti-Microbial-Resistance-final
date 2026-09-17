import React, { useState } from "react";
import {
  User,
  ShieldCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Phone,
  Download,
  Calendar,
  Building2,
  Stethoscope,
  HeartPulse,
  Languages,
  HelpCircle,
  Pill,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SAMPLE_PATIENT_RECORDS } from "../data/mockData";
import { Link } from "react-router-dom";
import { executeMedicalPrint } from "../utils/printReport";

export const PatientPortalPage: React.FC = () => {
  const { user, loginAsPatient } = useAuth();
  const [lang, setLang] = useState<"en" | "hi">("en");

  // Default to sample patient record or logged in patient
  const patient = SAMPLE_PATIENT_RECORDS[1]; // Rajesh Sharma (High resistance case)

  return (
    <div className="min-h-[85vh] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
            <User className="w-4 h-4" />
            <span>PATIENT &amp; RELATIVE CONFIDENTIAL HEALTH PORTAL</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === "en" ? "My Laboratory Microbiology Report" : "मेरी माइक्रोबायोलॉजी पैथोलॉजी रिपोर्ट"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === "en"
              ? "Plain-language antimicrobial sensitivity & doctor's prescription guide."
              : "सरल भाषा में एंटीबायोटिक संवेदनशीलता एवं डॉक्टर के उपचार के निर्देश।"}
          </p>
        </div>

        {/* Language switch & download */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Languages className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{lang === "en" ? "हिन्दी में देखें (Hindi)" : "View in English"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              try {
                executeMedicalPrint({
                  documentTitle: `Patient_Portal_Clinical_Summary_${patient.id}`,
                  patient1: patient,
                });
              } catch {
                try { window.print(); } catch {}
              }
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{lang === "en" ? "Print / PDF" : "प्रिंट या डाउनलोड"}</span>
          </button>
        </div>
      </div>

      {/* Patient Identification Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-900 via-slate-900 to-teal-950 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-bold text-xl font-mono">
              RS
            </div>
            <div>
              <div className="text-xl font-extrabold">{patient.name}</div>
              <div className="text-xs text-cyan-200 font-mono mt-0.5">
                UHID: {patient.uhid || `UHID-2026-${patient.id}`} &bull; Age/Sex: {patient.age}Y / {patient.gender} &bull; Blood: O+
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Hospital: AIIMS Apex Infectious Diseases Wing &bull; Ward: ICU Ward B (Bed 14)
              </div>
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs text-xs space-y-1">
            <div className="text-cyan-300 font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Report Code</span>
            </div>
            <div className="font-mono font-bold text-white tracking-wider">
              PRP-2041-1092-8801
            </div>
            <div className="text-[10px] text-slate-400">
              Sample Collected: 15-Sep-2026 09:30 AM
            </div>
          </div>
        </div>
      </div>

      {/* Patient-Friendly Explanation Banner */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start space-x-3.5">
        <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="font-bold text-sm">
            {lang === "en"
              ? "Important Note for Patient & Family:"
              : "मरीज़ और परिवार के लिए आवश्यक सूचना:"}
          </div>
          <p className="leading-relaxed">
            {lang === "en"
              ? "Your test found a resistant bacterium (Klebsiella pneumoniae). Standard antibiotics like Amoxicillin or Ceftriaxone will NOT cure this infection. Only the specific medications marked 'SAFE & EFFECTIVE' below should be administered under doctor supervision."
              : "आपकी जांच में एक प्रतिरोधी बैक्टीरिया (क्लेबसिएला न्यूमोनिया) पाया गया है। सामान्य एंटीबायोटिक दवाएं (जैसे एमोक्सीसिल्लिन आदि) इस बैक्टीरिया पर बेअसर हैं। कृपया केवल डॉक्टर द्वारा सुझाई गई 'सुरक्षित' दवाएं ही लें।"}
          </p>
        </div>
      </div>

      {/* 2-Column: Safe vs Ineffective Drugs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SAFE & EFFECTIVE DRUGS */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm uppercase tracking-wider font-mono">
              {lang === "en" ? "Medications That Will Work (Sensitive)" : "जो दवाएं असर करेंगी (संवेदनशील)"}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs">
              <div className="flex justify-between items-center font-bold text-emerald-900 dark:text-emerald-200">
                <span className="text-sm">Colistin (Polymyxin E)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-mono">
                  Sensitive (MIC: 0.5 mcg/mL)
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-1 text-[11px]">
                {lang === "en"
                  ? "Effective against this bacteria. Needs kidney monitoring (creatinine checks)."
                  : "यह बैक्टीरिया को समाप्त करने में सक्षम है। गुर्दे की निगरानी के साथ दी जाती है।"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs">
              <div className="flex justify-between items-center font-bold text-emerald-900 dark:text-emerald-200">
                <span className="text-sm">Tigecycline</span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-mono">
                  Sensitive (MIC: 1.0 mcg/mL)
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-1 text-[11px]">
                {lang === "en"
                  ? "Secondary reserve antibiotic. Effective for soft tissue and pulmonary recovery."
                  : "रिज़र्व एंटीबायोटिक जो फेफड़ों और ऊतकों के संक्रमण को नियंत्रित करने में सहायक है।"}
              </p>
            </div>
          </div>
        </div>

        {/* INEFFECTIVE / RESISTANT DRUGS */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800/60 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-bold">
            <XCircle className="w-5 h-5" />
            <h3 className="text-sm uppercase tracking-wider font-mono">
              {lang === "en" ? "Drugs To Avoid (Bacteria is Resistant)" : "जो दवाएं काम नहीं करेंगी (प्रतिरोधी)"}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs">
              <div className="flex justify-between items-center font-bold text-rose-900 dark:text-rose-200">
                <span className="text-sm">Meropenem</span>
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono">
                  Resistant (MIC &gt; 32)
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-1 text-[11px]">
                {lang === "en"
                  ? "NDM-1 enzyme destroys this drug. Do not take."
                  : "बैक्टीरिया का NDM-1 एंजाइम इस दवा को पूरी तरह नष्ट कर देता है। यह बेअसर है।"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs">
              <div className="flex justify-between items-center font-bold text-rose-900 dark:text-rose-200">
                <span className="text-sm">Ciprofloxacin &amp; Levofloxacin</span>
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono">
                  Resistant (0 mm Zone)
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-1 text-[11px]">
                {lang === "en"
                  ? "Fluoroquinolone resistance active. Causes zero bacterial inhibition."
                  : "सामान्य एंटीबायोटिक, जो इस बैक्टीरिया के विकास को बिल्कुल नहीं रोक पाती।"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attending Physician & Hospital Contact Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">
              Attending Microbiologist: Dr. Elena Vance, MD
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Department of Infectious Diseases &bull; Reg: MCI-ND-2016-84920
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="tel:+911126588500"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-2"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call ICU Desk</span>
          </a>
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
          >
            Overview &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
