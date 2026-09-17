import React, { useState, useEffect } from "react";
import {
  X,
  User,
  HeartPulse,
  Save,
  Plus,
  Trash2,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";
import { PatientData, BloodGroup, ResistanceLevel, AntibioticItem } from "../types";
import { KNOWN_ANTIBIOTICS_DICT } from "../utils/reportParser";
import { SAMPLE_SCENARIOS } from "../data/mockData";

interface PatientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientData;
  patientNumber: 1 | 2;
  onSave: (updatedPatient: PatientData) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

const COMMON_PATHOGENS = [
  "Klebsiella pneumoniae",
  "Klebsiella pneumoniae (KPC-3+)",
  "Acinetobacter baumannii (MDR)",
  "Pseudomonas aeruginosa",
  "Escherichia coli (ESBL+)",
  "Staphylococcus aureus (MRSA)",
  "Enterococcus faecium (VRE)",
  "Enterobacter cloacae",
];

const COMMON_SPECIMENS = [
  "Blood Culture",
  "Endotracheal Aspirate",
  "Deep Wound Swab",
  "Surgical Site Fluid",
  "Urine & Catheter Tip",
  "Bronchoalveolar Lavage (BAL)",
  "Sputum",
];

export const PatientEditModal: React.FC<PatientEditModalProps> = ({
  isOpen,
  onClose,
  patient,
  patientNumber,
  onSave,
}) => {
  const [formData, setFormData] = useState<PatientData>(patient);
  const [newDrugName, setNewDrugName] = useState("");
  const [newDrugMic, setNewDrugMic] = useState("");
  const [newDrugStatus, setNewDrugStatus] = useState<ResistanceLevel>("Sensitive");

  useEffect(() => {
    if (isOpen) {
      setFormData(JSON.parse(JSON.stringify(patient)));
    }
  }, [isOpen, patient]);

  if (!isOpen) return null;

  const handleApplyPreset = (presetKey: "cityCentralLab" | "icuCarbapenem" | "postOpSurgery") => {
    const preset = SAMPLE_SCENARIOS[presetKey];
    if (!preset) return;
    const target = patientNumber === 1 ? preset.p1 : preset.p2;
    setFormData(JSON.parse(JSON.stringify(target)));
  };

  const handleUpdateClinicalParam = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (!updated.clinicalParams) {
        updated.clinicalParams = {
          bloodGroup: "O+",
          anemia: { hasAnemia: false, hemoglobin: 13.5, severity: "None" },
          comorbidities: [],
          vitals: { weightKg: 70, heightCm: 170, bmi: 24, bsa: 1.8 },
          bloodReport: { wbc: 8, platelets: 200, serumCreatinine: 0.9, eGfr: 90 },
          priorAntibioticMisuse: "None reported",
          pathogenVirulenceIndex: "Moderate",
          immunityCapacity: "Normal (100%)",
        };
      }

      if (field === "bloodGroup") {
        updated.clinicalParams.bloodGroup = value;
      } else if (field === "eGfr") {
        const egfrVal = Number(value) || 0;
        updated.clinicalParams.bloodReport.eGfr = egfrVal;
        // Recalculate immunity capacity
        if (egfrVal < 30) updated.clinicalParams.immunityCapacity = "Severely Compromised (25%)";
        else if (egfrVal < 60) updated.clinicalParams.immunityCapacity = "Moderate (50%)";
        else if (egfrVal < 80) updated.clinicalParams.immunityCapacity = "Mildly Impaired (75%)";
        else updated.clinicalParams.immunityCapacity = "Normal (100%)";
      } else if (field === "hemoglobin") {
        const hbVal = Number(value) || 0;
        updated.clinicalParams.anemia.hemoglobin = hbVal;
        updated.clinicalParams.anemia.hasAnemia = hbVal < 12.0;
        if (hbVal < 8.0) updated.clinicalParams.anemia.severity = "Severe Anemia";
        else if (hbVal < 11.0) updated.clinicalParams.anemia.severity = "Moderate Anemia";
        else if (hbVal < 12.0) updated.clinicalParams.anemia.severity = "Mild Anemia";
        else updated.clinicalParams.anemia.severity = "None";
      } else if (field === "priorAntibioticMisuse") {
        updated.clinicalParams.priorAntibioticMisuse = value;
      }

      return updated;
    });
  };

  const handleToggleDrugStatus = (index: number) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const current = updated.antibiotics[index].status;
      const nextStatus: ResistanceLevel =
        current === "Sensitive"
          ? "Intermediate"
          : current === "Intermediate"
          ? "Resistant"
          : "Sensitive";
      updated.antibiotics[index].status = nextStatus;
      return updated;
    });
  };

  const handleUpdateDrugMic = (index: number, mic: string) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated.antibiotics[index].mic = mic;
      return updated;
    });
  };

  const handleRemoveDrug = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      antibiotics: prev.antibiotics.filter((_, i) => i !== index),
    }));
  };

  const handleAddDrug = () => {
    if (!newDrugName.trim()) return;
    const drugClass = KNOWN_ANTIBIOTICS_DICT[newDrugName] || "Antimicrobial Agent";
    const newItem: AntibioticItem = {
      drug: newDrugName.trim(),
      drugClass,
      status: newDrugStatus,
      mic: newDrugMic.trim() || undefined,
    };
    setFormData((prev) => ({
      ...prev,
      antibiotics: [...prev.antibiotics, newItem],
    }));
    setNewDrugName("");
    setNewDrugMic("");
  };

  const handleSaveAll = () => {
    onSave(formData);
    onClose();
  };

  const currentEGfr = formData.clinicalParams?.bloodReport.eGfr || 90;
  const currentHb = formData.clinicalParams?.anemia.hemoglobin || 13.5;
  const currentBloodGroup = formData.clinicalParams?.bloodGroup || "O+";

  const getEgfrColor = (val: number) => {
    if (val >= 90) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
    if (val >= 60) return "text-teal-500 bg-teal-500/10 border-teal-500/30";
    if (val >= 30) return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    return "text-rose-500 bg-rose-500/10 border-rose-500/30";
  };

  const getEgfrBadge = (val: number) => {
    if (val >= 90) return "Normal Renal Clearance (G1)";
    if (val >= 60) return "Mild Reduction (G2)";
    if (val >= 30) return "Moderate CKD / Renal Impairment (G3)";
    return "Severe Renal Failure (G4/G5)";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        id="patient-edit-modal"
        className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-teal-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center space-x-3">
            <span
              className={`w-3 h-3 rounded-full ${
                patientNumber === 1 ? "bg-teal-500" : "bg-cyan-500"
              } animate-pulse`}
            />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Edit Clinical Parameters & AST</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/30">
                  Patient 0{patientNumber}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Modify blood group, eGFR, hemoglobin, pathogen & antibiogram panel in real time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Report Presets */}
        <div className="px-6 py-2.5 bg-teal-50/60 dark:bg-teal-950/20 border-b border-teal-100 dark:border-teal-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Quick Clinical Scenarios:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleApplyPreset("cityCentralLab")}
              className="px-2.5 py-1 rounded-lg font-medium bg-white dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700/60 transition-colors"
            >
              City Central Lab (P-204119 &bull; O+, eGFR 90)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("icuCarbapenem")}
              className="px-2.5 py-1 rounded-lg font-medium bg-white dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 transition-colors"
            >
              ICU CRE Resistant (P-9021 &bull; B+, eGFR 42)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("postOpSurgery")}
              className="px-2.5 py-1 rounded-lg font-medium bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 transition-colors"
            >
              Post-Op Surgical (P-7719 &bull; A+, eGFR 68)
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Section 1: Demographics & Pathogen */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>1. Patient Demographics & Pathogen Identification</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Patient Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">UHID / Patient ID</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Age & Gender</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-1/2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-1/2 px-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Ward / Bed</label>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Pathogen & Specimen Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">
                  Organism Isolated (Pathogen)
                </label>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={formData.pathogen}
                    onChange={(e) => setFormData({ ...formData, pathogen: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-rose-600 dark:text-rose-400 focus:outline-none focus:border-teal-500"
                    placeholder="e.g. Klebsiella pneumoniae"
                  />
                  <div className="flex flex-wrap gap-1">
                    {COMMON_PATHOGENS.slice(0, 4).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({ ...formData, pathogen: p })}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-300 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">
                  Specimen / Sample Type
                </label>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={formData.specimen}
                    onChange={(e) => setFormData({ ...formData, specimen: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    placeholder="e.g. Blood Culture"
                  />
                  <div className="flex flex-wrap gap-1">
                    {COMMON_SPECIMENS.slice(0, 4).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, specimen: s })}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-300 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Host Susceptibility & Clinical Parameters */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>2. Host Susceptibility Biomarkers (Blood Group, eGFR, Hemoglobin)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Blood Group */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Blood Group:
                  </label>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                      currentBloodGroup.startsWith("O")
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                        : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                    }`}
                  >
                    {currentBloodGroup.startsWith("O") ? "Adhesin-Deficient (Protected)" : "High Receptor Density"}
                  </span>
                </div>
                <select
                  value={currentBloodGroup}
                  onChange={(e) => handleUpdateClinicalParam("bloodGroup", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-base font-bold text-teal-700 dark:text-teal-400 focus:outline-none focus:border-teal-500"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      Blood Group {bg} {bg.startsWith("O") ? "(Universal Donor / Low Fimbrial Adhesion)" : ""}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Group O lacks A/B carbohydrate anchors; Group B/A binds bacterial fimbriae tightly.
                </p>
              </div>

              {/* eGFR / Creatinine Clearance */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    eGFR (Creatinine Clearance):
                  </label>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${getEgfrColor(currentEGfr)}`}>
                    {getEgfrBadge(currentEGfr)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="5"
                    max="140"
                    value={currentEGfr}
                    onChange={(e) => handleUpdateClinicalParam("eGfr", e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">mL/min</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="130"
                  value={currentEGfr}
                  onChange={(e) => handleUpdateClinicalParam("eGfr", e.target.value)}
                  className="w-full accent-teal-600"
                />
              </div>

              {/* Hemoglobin */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Hemoglobin (Hb):
                  </label>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                      currentHb >= 12.5
                        ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/30"
                        : currentHb >= 10.0
                        ? "text-amber-500 bg-amber-500/10 border-amber-500/30"
                        : "text-rose-500 bg-rose-500/10 border-rose-500/30"
                    }`}
                  >
                    {currentHb >= 12.5 ? "Normal Oxygenation" : currentHb >= 10.0 ? "Mild Hypoxia" : "Severe Anemia"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    min="4"
                    max="20"
                    value={currentHb}
                    onChange={(e) => handleUpdateClinicalParam("hemoglobin", e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">g/dL</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Governs neutrophil oxidative burst & reactive oxygen species generation.
                </p>
              </div>
            </div>

            {/* Prior Antibiotic Misuse */}
            <div className="text-xs">
              <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">
                Prior Antibiotic Exposure & Misuse History:
              </label>
              <input
                type="text"
                value={formData.clinicalParams?.priorAntibioticMisuse || ""}
                onChange={(e) => handleUpdateClinicalParam("priorAntibioticMisuse", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                placeholder="e.g. None reported OR Repeated OTC Azithromycin / Ciprofloxacin"
              />
            </div>
          </div>

          {/* Section 3: Antimicrobial Susceptibility Testing (AST) Panel */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>3. Antimicrobial Susceptibility Test (AST) Panel ({formData.antibiotics.length})</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Click status pill to toggle: <span className="text-emerald-500 font-bold">Sensitive</span> &rarr;{" "}
                <span className="text-amber-500 font-bold">Intermediate</span> &rarr;{" "}
                <span className="text-rose-500 font-bold">Resistant</span>
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300">
                    <th className="py-2.5 px-3 font-semibold">Antibiotic</th>
                    <th className="py-2.5 px-3 font-semibold hidden sm:table-cell">Drug Class</th>
                    <th className="py-2.5 px-3 font-semibold">MIC (µg/mL)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Status / Interpretation</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {formData.antibiotics.map((item, idx) => (
                    <tr key={`${item.drug}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        {item.drug}
                      </td>
                      <td className="py-2 px-3 text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                        {item.drugClass}
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.mic || ""}
                          onChange={(e) => handleUpdateDrugMic(idx, e.target.value)}
                          placeholder="<= 1"
                          className="w-20 px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:outline-none focus:border-teal-500"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleDrugStatus(idx)}
                          className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                            item.status === "Sensitive"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                              : item.status === "Intermediate"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-700"
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </button>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveDrug(idx)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition-colors"
                          title="Delete Antibiotic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Add New Drug Row */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Add antibiotic (e.g. Amikacin)"
                  value={newDrugName}
                  onChange={(e) => setNewDrugName(e.target.value)}
                  className="flex-1 min-w-[150px] px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
                <input
                  type="text"
                  placeholder="MIC (e.g. <= 2)"
                  value={newDrugMic}
                  onChange={(e) => setNewDrugMic(e.target.value)}
                  className="w-24 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
                <select
                  value={newDrugStatus}
                  onChange={(e) => setNewDrugStatus(e.target.value as ResistanceLevel)}
                  className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold focus:outline-none focus:border-teal-500"
                >
                  <option value="Sensitive">Sensitive</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Resistant">Resistant</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddDrug}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Applying changes immediately updates all comparative models & risk scores.
          </span>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              id="save-patient-changes-btn"
              onClick={handleSaveAll}
              className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/20 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Comparison</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
