import React, { useState } from "react";
import {
  Shield,
  HeartPulse,
  Dna,
  Sliders,
  Sparkles,
  Activity,
  Layers,
  GraduationCap,
} from "lucide-react";
import { PatientData } from "../types";
import { SAMPLE_PATIENT_RECORDS } from "../data/mockData";

interface HostSusceptibilityExplainerProps {
  patient1?: PatientData;
  patient2?: PatientData;
  onSimulateInScanner?: () => void;
}

export const HostSusceptibilityExplainer: React.FC<HostSusceptibilityExplainerProps> = ({
  patient1: propP1,
  patient2: propP2,
  onSimulateInScanner,
}) => {
  const patient1 = propP1 || SAMPLE_PATIENT_RECORDS[0];
  const patient2 = propP2 || SAMPLE_PATIENT_RECORDS[1];
  // Interactive Simulator States
  const [hasDiabetes, setHasDiabetes] = useState<boolean>(false);
  const [hasCatheter, setHasCatheter] = useState<boolean>(true);
  const [hasAntibioticMisuse, setHasAntibioticMisuse] = useState<boolean>(false);
  const [immunityLevel, setImmunityLevel] = useState<number>(65); // 0 to 100%
  const [mucosalBarrierIntact, setMucosalBarrierIntact] = useState<boolean>(true);

  // Calculated Vulnerability Score
  const calculateRisk = () => {
    let score = 12; // baseline exposure
    if (hasDiabetes) score += 18;
    if (hasCatheter) score += 20;
    if (hasAntibioticMisuse) score += 16;
    if (!mucosalBarrierIntact) score += 14;
    score += Math.round((100 - immunityLevel) * 0.2);
    return Math.max(10, Math.min(96, score));
  };

  const simulatedRisk = calculateRisk();

  const getClinicalOutcome = (score: number) => {
    if (score < 40) {
      return {
        label: "Asymptomatic Colonization or Rapid Clearance",
        badge: "Zero Sickness / Harmless",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/30",
        description:
          "Host neutrophils and intact mucosal barriers eliminate the bacterial inoculum within hours. The person feels 100% healthy.",
      };
    } else if (score < 70) {
      return {
        label: "Mild Localized Mucosal Infection",
        badge: "Moderate Symptoms",
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/30",
        description:
          "Bacteria adhere locally, causing localized inflammation (e.g. low-grade dysuria or cough), but immune defense prevents vascular entry.",
      };
    } else {
      return {
        label: "Severe Invasive Sepsis & Tissue Damage",
        badge: "High-Risk Invasive Disease",
        color: "text-rose-400",
        bg: "bg-rose-500/10 border-rose-500/30",
        description:
          "Bacteria breach damaged barriers, release toxins, resist paralyzed neutrophils, and seed the bloodstream (Bacteremia).",
      };
    }
  };

  const outcome = getClinicalOutcome(simulatedRisk);

  return (
    <div className="space-y-6">
      {/* Top Banner: Academic Question Highlight */}
      <div className="rounded-2xl border border-teal-200 dark:border-teal-500/30 bg-gradient-to-r from-teal-50 via-slate-50 to-teal-50 dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900 p-6 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono text-teal-600 dark:text-teal-400 font-bold uppercase">
              <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Microbiology &amp; Immunology Viva Master Question</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Why Does a Bacteria Harm Person 1, But NOT Person 2?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Infectious disease is never caused by the pathogen alone. It is determined by the{" "}
              <strong className="text-slate-900 dark:text-white font-mono">Epidemiologic Triad</strong>:{" "}
              <span className="text-teal-700 dark:text-teal-300">Host Vulnerability</span> +{" "}
              <span className="text-amber-700 dark:text-amber-300">Microbiome Barrier</span> +{" "}
              <span className="text-rose-700 dark:text-rose-300">Pathogen Virulence</span>.
            </p>
          </div>
          <div className="shrink-0 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">GOLDEN CLINICAL RULE</span>
            <span className="text-xs font-bold font-mono text-teal-700 dark:text-teal-300">
              Exposure ≠ Infection ≠ Disease
            </span>
          </div>
        </div>
      </div>

      {/* 5 Core Biological Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Host Immune Status */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 space-y-3 shadow-sm transition-colors">
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400">
            <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Innate Immune &amp; Phagocytic Defense</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>In Person 2 (Resistant/Protected):</strong> Healthy neutrophils (PMNs) perform rapid chemotaxis, engulf bacteria, and kill them via oxidative bursts (H2O2 &amp; myeloperoxidase).
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong>In Person 1 (Sick):</strong> Neutropenia, steroid usage, or immune senescence paralyzes phagocytes. Bacteria replicate unhindered.
          </p>
          <div className="text-[11px] font-mono text-teal-700 dark:text-teal-300 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
            Key Metric: Neutrophil Count &amp; Secretory IgA Levels
          </div>
        </div>

        {/* 2. Physical Barriers & Devices */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 space-y-3 shadow-sm transition-colors">
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
            <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Mucosal Integrity &amp; Medical Devices</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>In Person 2:</strong> Intact keratinized skin, acid stomach pH (&lt;2.0), and ciliated respiratory epithelium trap and expel foreign bacteria automatically.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong>In Person 1:</strong> Endotracheal tubes, urinary Foley catheters, or IV cannulas bypass barriers, allowing bacteria to form protective biofilms.
          </p>
          <div className="text-[11px] font-mono text-amber-700 dark:text-amber-300 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
            Key Metric: Indwelling Catheter Days &amp; Skin Breaches
          </div>
        </div>

        {/* 3. Normal Microbiome Colonization Resistance */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 space-y-3 shadow-sm transition-colors">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <Dna className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Normal Flora Colonization Resistance</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>In Person 2:</strong> A diverse gut and skin microbiome physically occupies all binding receptors and secretes natural bacteriocins to starve out invaders.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong>In Person 1:</strong> Prior misuse of broad-spectrum antibiotics wiped out healthy gut flora, leaving empty ecological niches for superbugs to multiply.
          </p>
          <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
            Key Metric: Microbiome Diversity &amp; Prior OTC Antibiotics
          </div>
        </div>

        {/* 4. Comorbidities & Cellular Microenvironment */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 space-y-3 shadow-sm transition-colors">
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
            <Activity className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">4. Diabetes, CKD &amp; Cellular Environment</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>In Person 2:</strong> Euglycemia (normal blood sugar) and normal renal perfusion maintain tissue oxygenation, enabling prompt cellular repair.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong>In Person 1:</strong> Hyperglycemia in Diabetes glycates antibodies and impairs neutrophil motility. High glucose acts as rich broth for bacterial proliferation.
          </p>
          <div className="text-[11px] font-mono text-rose-700 dark:text-rose-300 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
            Key Metric: HbA1c, eGFR, Blood Urea Nitrogen
          </div>
        </div>

        {/* 5. Colonization vs True Invasive Infection */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 space-y-3 shadow-sm transition-colors">
          <div className="flex items-center space-x-2 text-teal-600 dark:text-cyan-400">
            <HeartPulse className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">5. Asymptomatic Colonizer vs. Disease</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>In Person 2:</strong> Bacteria may actually be present on their skin or throat, but they are a <em>harmless carrier</em> without tissue invasion or cytokine release.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong>In Person 1:</strong> Bacteria produce virulence factors (capsules, endotoxins) that trigger massive IL-1, IL-6, and TNF-alpha, leading to septic shock.
          </p>
          <div className="text-[11px] font-mono text-teal-700 dark:text-cyan-300 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
            Key Metric: Serum Procalcitonin &amp; CRP Biomarkers
          </div>
        </div>

        {/* 6. Receptor Polymorphisms & Host Genetics */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 space-y-3 shadow-sm transition-colors">
          <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">6. Genetic Receptors &amp; Epithelial Ligands</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>In Person 2:</strong> Cellular surface ligands (e.g. Lewis blood antigens or uroplakin variants) do not match bacterial fimbriae adhesins, so bacteria get flushed out.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong>In Person 1:</strong> High density of specific host receptors allows bacterial Type-1 and P-pili to lock on tight and resist urine/mucus clearance.
          </p>
          <div className="text-[11px] font-mono text-purple-700 dark:text-purple-300 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
            Key Metric: Epithelial Adhesin Affinity &amp; Host Genetics
          </div>
        </div>
      </div>

      {/* Interactive Host Vulnerability Simulator */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-6 shadow-sm dark:shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-teal-600 dark:text-teal-400 font-bold uppercase mb-1">
              <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Interactive Clinical Experiment</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Host Vulnerability &amp; Clinical Penetration Simulator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Toggle patient clinical factors below to see why identical bacterial exposure produces zero illness in a healthy host vs fatal sepsis in a compromised host.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setHasDiabetes(false);
                setHasCatheter(false);
                setHasAntibioticMisuse(false);
                setImmunityLevel(90);
                setMucosalBarrierIntact(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-300 dark:border-emerald-700 transition-colors cursor-pointer"
            >
              Simulate {patient2.name} (Blood {patient2.clinicalParams?.bloodGroup || "O+"}, Protected)
            </button>
            <button
              onClick={() => {
                setHasDiabetes(true);
                setHasCatheter(true);
                setHasAntibioticMisuse(true);
                setImmunityLevel(30);
                setMucosalBarrierIntact(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-800 dark:text-rose-300 text-xs font-semibold border border-rose-300 dark:border-rose-700 transition-colors cursor-pointer"
            >
              Simulate {patient1.name} (Blood {patient1.clinicalParams?.bloodGroup || "O+"}, Vulnerable)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-4">
            {/* Toggle 1: Diabetes */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Uncontrolled Diabetes Mellitus (HbA1c &gt; 8.5%)</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Impairs neutrophil oxidative burst &amp; chemotaxis</span>
              </div>
              <button
                onClick={() => setHasDiabetes(!hasDiabetes)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  hasDiabetes
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                }`}
              >
                {hasDiabetes ? "YES (Active)" : "NO (Normoglycemic)"}
              </button>
            </div>

            {/* Toggle 2: Catheter / Device */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Indwelling Medical Device (Foley / Central Line)</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Direct portal through mucosal barrier; biofilm surface</span>
              </div>
              <button
                onClick={() => setHasCatheter(!hasCatheter)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  hasCatheter
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                }`}
              >
                {hasCatheter ? "YES (Breached)" : "NO (Intact Barrier)"}
              </button>
            </div>

            {/* Toggle 3: Antibiotic Misuse */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Prior Broad-Spectrum Antibiotic Misuse</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Destroys normal gut flora colonization resistance</span>
              </div>
              <button
                onClick={() => setHasAntibioticMisuse(!hasAntibioticMisuse)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  hasAntibioticMisuse
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                }`}
              >
                {hasAntibioticMisuse ? "YES (Flora Depleted)" : "NO (Intact Microbiome)"}
              </button>
            </div>

            {/* Immunity Capacity Slider */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Host Immunity Capacity</span>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">{immunityLevel}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={immunityLevel}
                onChange={(e) => setImmunityLevel(Number(e.target.value))}
                className="w-full accent-teal-600 dark:accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Severe Immunosuppression (10%)</span>
                <span>Normal Host (100%)</span>
              </div>
            </div>
          </div>

          {/* Live Outcome Column */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/80 p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold">
                  Predicted Clinical Penetration
                </span>
                <span className="text-xs font-mono text-teal-600 dark:text-teal-400">Live Computational Bio-Model</span>
              </div>

              {/* Big Gauge */}
              <div className="space-y-2 mb-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Invasive Infection Probability</span>
                  <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white">{simulatedRisk}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      simulatedRisk < 40
                        ? "bg-emerald-500"
                        : simulatedRisk < 70
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${simulatedRisk}%` }}
                  />
                </div>
              </div>

              {/* Status Box */}
              <div className={`p-4 rounded-xl border ${outcome.bg} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold uppercase ${outcome.color}`}>
                    {outcome.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Host Fate</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{outcome.label}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{outcome.description}</p>
              </div>
            </div>

            {/* Direct Answer takeaway */}
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="text-teal-700 dark:text-teal-400 font-bold font-mono text-[11px] block">
                VIVA CONCLUSION FOR PHARMACY / CLINICAL EXAMS:
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                <em>
                  &quot;Bacteria is only the seed; the patient&apos;s body is the soil. Person 2 didn&apos;t get sick because their neutrophil oxidative burst and normal gut flora cleared the bacteria before it could attach to receptors and enter the blood.&quot;
                </em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
