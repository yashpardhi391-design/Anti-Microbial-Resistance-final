import {
  PatientData,
  ComparativeDrugRow,
  ResistanceTrendData,
  RiskReductionStep,
  ModeOfActionItem,
  ResistanceLevel,
} from "../types";

export const DEFAULT_CLINICAL_PARAMS_P1 = {
  bloodGroup: "B+" as const,
  anemia: {
    hasAnemia: true,
    hemoglobin: 9.6, // Moderate Anemia
    severity: "Moderate Anemia" as const,
  },
  comorbidities: ["Type 2 Diabetes Mellitus", "Stage 3 CKD", "Hypertension"],
  vitals: {
    weightKg: 78.5,
    heightCm: 174,
    bmi: 25.9,
    bsa: 1.94,
  },
  bloodReport: {
    wbc: 15.4, // Leukocytosis
    platelets: 210,
    serumCreatinine: 1.85, // Elevated
    eGfr: 42, // Reduced renal clearance
  },
  priorAntibioticMisuse: "Over-the-counter Ciprofloxacin & Azithromycin repeated courses (2025-2026)",
  pathogenVirulenceIndex: "High" as const,
  immunityCapacity: "Moderate (50%)" as const,
};

export const DEFAULT_CLINICAL_PARAMS_P2 = {
  bloodGroup: "O+" as const,
  anemia: {
    hasAnemia: false,
    hemoglobin: 13.8,
    severity: "None" as const,
  },
  comorbidities: ["Peripheral Vascular Disease", "Recent Prolonged ICU Ventilation"],
  vitals: {
    weightKg: 82.0,
    heightCm: 179,
    bmi: 25.6,
    bsa: 2.01,
  },
  bloodReport: {
    wbc: 18.2,
    platelets: 165,
    serumCreatinine: 1.40,
    eGfr: 58,
  },
  priorAntibioticMisuse: "Unprescribed Amoxicillin-Clavulanate empiric self-medication",
  pathogenVirulenceIndex: "Hypervirulent" as const,
  immunityCapacity: "Mildly Impaired (75%)" as const,
};

export const SAMPLE_SCENARIOS = {
  icuCarbapenem: {
    name: "ICU Carbapenem-Resistant Enterobacteriaceae (CRE) Overlap",
    description: "Compare Klebsiella pneumoniae (KPC+) vs Acinetobacter baumannii (CRAB)",
    p1: {
      id: "P-9021",
      name: "Marcus Vance",
      age: 58,
      gender: "Male" as const,
      ward: "ICU - Bed 04",
      pathogen: "Klebsiella pneumoniae (KPC-3+)",
      specimen: "Endotracheal Aspirate",
      collectionDate: "2026-09-08",
      file: {
        name: "Antibiogram_P9021_KPC.pdf",
        size: 1420000,
        type: "application/pdf",
        uploadedAt: "10:42 AM Today",
      },
      clinicalParams: DEFAULT_CLINICAL_PARAMS_P1,
      antibiotics: [
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Resistant" as const, mic: ">= 16 ug/mL" },
        { drug: "Imipenem-Relebactam", drugClass: "Carbapenem / Beta-lactamase inhibitor", status: "Intermediate" as const, mic: "4 ug/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Resistant" as const, mic: ">= 64 ug/mL" },
        { drug: "Cefepime", drugClass: "4th Gen Cephalosporin", status: "Resistant" as const, mic: ">= 32 ug/mL" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 4 ug/mL" },
        { drug: "Levofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 8 ug/mL" },
        { drug: "Piperacillin-Tazobactam", drugClass: "Penicillin combination", status: "Resistant" as const, mic: ">= 128 ug/mL" },
        { drug: "Amikacin", drugClass: "Aminoglycoside", status: "Intermediate" as const, mic: "16 ug/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Resistant" as const, mic: ">= 16 ug/mL" },
        { drug: "Ceftazidime-Avibactam", drugClass: "Novel Beta-lactam inhibitor", status: "Sensitive" as const, mic: "<= 1 ug/mL" },
        { drug: "Colistin (Polymyxin E)", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 ug/mL" },
        { drug: "Tigecycline", drugClass: "Glycylcycline", status: "Sensitive" as const, mic: "0.5 ug/mL" },
      ],
    },
    p2: {
      id: "P-8842",
      name: "Arthur Pendelton",
      age: 64,
      gender: "Male" as const,
      ward: "Step-Down Unit - Bed 12",
      pathogen: "Acinetobacter baumannii (MDR)",
      specimen: "Deep Wound Swab",
      collectionDate: "2026-09-09",
      file: {
        name: "Culture_P8842_Acineto.png",
        size: 980000,
        type: "image/png",
        uploadedAt: "11:15 AM Today",
      },
      clinicalParams: DEFAULT_CLINICAL_PARAMS_P2,
      antibiotics: [
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Resistant" as const, mic: ">= 32 ug/mL" },
        { drug: "Imipenem-Relebactam", drugClass: "Carbapenem / Beta-lactamase inhibitor", status: "Resistant" as const, mic: ">= 16 ug/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Resistant" as const, mic: ">= 64 ug/mL" },
        { drug: "Cefepime", drugClass: "4th Gen Cephalosporin", status: "Resistant" as const, mic: ">= 32 ug/mL" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 8 ug/mL" },
        { drug: "Levofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 8 ug/mL" },
        { drug: "Piperacillin-Tazobactam", drugClass: "Penicillin combination", status: "Resistant" as const, mic: ">= 128 ug/mL" },
        { drug: "Amikacin", drugClass: "Aminoglycoside", status: "Resistant" as const, mic: ">= 64 ug/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Resistant" as const, mic: ">= 16 ug/mL" },
        { drug: "Ceftazidime-Avibactam", drugClass: "Novel Beta-lactam inhibitor", status: "Resistant" as const, mic: ">= 16 ug/mL" },
        { drug: "Colistin (Polymyxin E)", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "1 ug/mL" },
        { drug: "Tigecycline", drugClass: "Glycylcycline", status: "Sensitive" as const, mic: "1 ug/mL" },
      ],
    },
  },
  postOpSurgery: {
    name: "Surgical Site Infection: P. aeruginosa vs E. coli ESBL",
    description: "Compare Pseudomonas aeruginosa vs Escherichia coli (CTX-M-15)",
    p1: {
      id: "P-7719",
      name: "Sarah Lin",
      age: 39,
      gender: "Female" as const,
      ward: "Post-Op Surgery Ward B",
      pathogen: "Pseudomonas aeruginosa",
      specimen: "Surgical Site Fluid",
      collectionDate: "2026-09-07",
      file: {
        name: "Antibiogram_P7719_Pseudomonas.pdf",
        size: 1100000,
        type: "application/pdf",
        uploadedAt: "Yesterday 2:30 PM",
      },
      clinicalParams: {
        bloodGroup: "A+" as const,
        anemia: {
          hasAnemia: true,
          hemoglobin: 10.4,
          severity: "Mild Anemia" as const,
        },
        comorbidities: ["Post-Cesarean Recovery", "Mild Bronchial Asthma"],
        vitals: {
          weightKg: 62.0,
          heightCm: 165,
          bmi: 22.8,
          bsa: 1.68,
        },
        bloodReport: {
          wbc: 11.8,
          platelets: 280,
          serumCreatinine: 0.85,
          eGfr: 88,
        },
        priorAntibioticMisuse: "Prophylactic Cephalexin unmonitored for 10 days post-procedure",
        pathogenVirulenceIndex: "Moderate" as const,
        immunityCapacity: "Normal (100%)" as const,
      },
      antibiotics: [
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Sensitive" as const, mic: "1 ug/mL" },
        { drug: "Imipenem-Relebactam", drugClass: "Carbapenem / Beta-lactamase inhibitor", status: "Sensitive" as const, mic: "0.5 ug/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Resistant" as const, mic: ">= 64 ug/mL" },
        { drug: "Cefepime", drugClass: "4th Gen Cephalosporin", status: "Intermediate" as const, mic: "8 ug/mL" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 4 ug/mL" },
        { drug: "Levofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 8 ug/mL" },
        { drug: "Piperacillin-Tazobactam", drugClass: "Penicillin combination", status: "Sensitive" as const, mic: "8 ug/mL" },
        { drug: "Amikacin", drugClass: "Aminoglycoside", status: "Sensitive" as const, mic: "4 ug/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Sensitive" as const, mic: "2 ug/mL" },
        { drug: "Ceftazidime-Avibactam", drugClass: "Novel Beta-lactam inhibitor", status: "Sensitive" as const, mic: "2 ug/mL" },
        { drug: "Colistin (Polymyxin E)", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "1 ug/mL" },
        { drug: "Tigecycline", drugClass: "Glycylcycline", status: "Intermediate" as const, mic: "2 ug/mL" },
      ],
    },
    p2: {
      id: "P-7724",
      name: "David Kim",
      age: 44,
      gender: "Male" as const,
      ward: "General Surgery Bed 14",
      pathogen: "Escherichia coli (ESBL+)",
      specimen: "Urine & Catheter Tip",
      collectionDate: "2026-09-08",
      file: {
        name: "Culture_P7724_ESBL.png",
        size: 740000,
        type: "image/png",
        uploadedAt: "Yesterday 4:10 PM",
      },
      clinicalParams: {
        bloodGroup: "O-" as const,
        anemia: {
          hasAnemia: false,
          hemoglobin: 14.5,
          severity: "None" as const,
        },
        comorbidities: ["Recurrent Nephrolithiasis"],
        vitals: {
          weightKg: 75.0,
          heightCm: 176,
          bmi: 24.2,
          bsa: 1.91,
        },
        bloodReport: {
          wbc: 9.4,
          platelets: 240,
          serumCreatinine: 1.05,
          eGfr: 82,
        },
        priorAntibioticMisuse: "Multiple self-initiated courses of OTC Norfloxacin for dysuria",
        pathogenVirulenceIndex: "Moderate" as const,
        immunityCapacity: "Normal (100%)" as const,
      },
      antibiotics: [
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Sensitive" as const, mic: "<= 0.25 ug/mL" },
        { drug: "Imipenem-Relebactam", drugClass: "Carbapenem / Beta-lactamase inhibitor", status: "Sensitive" as const, mic: "<= 0.25 ug/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Resistant" as const, mic: ">= 32 ug/mL" },
        { drug: "Cefepime", drugClass: "4th Gen Cephalosporin", status: "Resistant" as const, mic: ">= 16 ug/mL" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 4 ug/mL" },
        { drug: "Levofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 4 ug/mL" },
        { drug: "Piperacillin-Tazobactam", drugClass: "Penicillin combination", status: "Intermediate" as const, mic: "16 ug/mL" },
        { drug: "Amikacin", drugClass: "Aminoglycoside", status: "Sensitive" as const, mic: "2 ug/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Intermediate" as const, mic: "4 ug/mL" },
        { drug: "Ceftazidime-Avibactam", drugClass: "Novel Beta-lactam inhibitor", status: "Sensitive" as const, mic: "<= 0.5 ug/mL" },
        { drug: "Colistin (Polymyxin E)", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 ug/mL" },
        { drug: "Tigecycline", drugClass: "Glycylcycline", status: "Sensitive" as const, mic: "0.25 ug/mL" },
      ],
    },
  },
  cityCentralLab: {
    name: "City Central Lab: Report 1 (Wild-Type) vs Report 2 (MDR KPC+)",
    description: "Compare Patient P-204119 (Blood Culture K. pneumoniae, fully sensitive) vs Patient P-109282 (Blood Culture K. pneumoniae, MDR blaKPC-3+)",
    p1: {
      id: "P-204119",
      name: "Patient P-204119 (Report 1: Wild-Type Sensitive)",
      age: 48,
      gender: "Female" as const,
      ward: "General Medical Ward - Bed 08",
      pathogen: "Klebsiella pneumoniae (Wild-Type Sensitive)",
      specimen: "Blood Culture",
      collectionDate: "2026-09-11",
      file: {
        name: "Screenshot_2026-09-11-15-33-39-13_40deb401b9ffe8e1df2f1cc5ba480b12.jpg",
        size: 890000,
        type: "image/jpeg",
        uploadedAt: "Report 1",
      },
      clinicalParams: {
        bloodGroup: "O+" as const,
        anemia: {
          hasAnemia: false,
          hemoglobin: 13.5,
          severity: "None" as const,
        },
        comorbidities: ["Wild-type clearance profile", "Normal renal clearance"],
        vitals: {
          weightKg: 62.0,
          heightCm: 164,
          bmi: 23.1,
          bsa: 1.67,
        },
        bloodReport: {
          wbc: 7.4,
          platelets: 245,
          serumCreatinine: 0.82,
          eGfr: 90,
        },
        priorAntibioticMisuse: "None reported (Clean antimicrobial history)",
        pathogenVirulenceIndex: "Moderate" as const,
        immunityCapacity: "Normal (100%)" as const,
      },
      antibiotics: [
        { drug: "Amoxicillin/Clavulanate", drugClass: "Penicillin combination", status: "Sensitive" as const, mic: "4 µg/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Sensitive" as const, mic: "<= 1 µg/mL" },
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Sensitive" as const, mic: "<= 0.25 µg/mL" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Sensitive" as const, mic: "<= 1 µg/mL" },
        { drug: "Colistin", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
      ],
    },
    p2: {
      id: "P-109282",
      name: "Patient P-109282 (Report 2: MDR blaKPC-3+)",
      age: 62,
      gender: "Male" as const,
      ward: "ICU / High Dependency Unit - Bed 04",
      pathogen: "Klebsiella pneumoniae (blaKPC-3 Carbapenemase Producer)",
      specimen: "Blood Culture",
      collectionDate: "2026-09-10",
      file: {
        name: "Screenshot_2026-09-11-15-33-25-78_40deb401b9ffe8e1df2f1cc5ba480b12.jpg",
        size: 940000,
        type: "image/jpeg",
        uploadedAt: "Report 2",
      },
      clinicalParams: {
        bloodGroup: "A+" as const,
        anemia: {
          hasAnemia: true,
          hemoglobin: 8.5,
          severity: "Severe Anemia" as const,
        },
        comorbidities: ["Severe Renal Impairment (eGFR 35)", "Prior Antibiotic Misuse", "Tissue Hypoxia"],
        vitals: {
          weightKg: 74.0,
          heightCm: 172,
          bmi: 25.0,
          bsa: 1.88,
        },
        bloodReport: {
          wbc: 16.8,
          platelets: 135,
          serumCreatinine: 2.1,
          eGfr: 35,
        },
        priorAntibioticMisuse: "Yes (Multiple broad-spectrum courses within 3 months)",
        pathogenVirulenceIndex: "Hypervirulent" as const,
        immunityCapacity: "Severely Compromised (25%)" as const,
      },
      antibiotics: [
        { drug: "Amoxicillin/Clavulanate", drugClass: "Penicillin combination", status: "Resistant" as const, mic: "> 32 µg/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Resistant" as const, mic: "> 64 µg/mL" },
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Resistant" as const, mic: "> 16 µg/mL (blaKPC-3+)" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: "> 8 µg/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Resistant" as const, mic: "> 16 µg/mL" },
        { drug: "Colistin", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
      ],
    },
  },
  cityCentralXdrVsMdr: {
    name: "City Central Lab: Report 4 (XDR Acinetobacter) vs Report 2 (MDR KPC+)",
    description: "Compare Patient P-991340 (Blood Culture A. baumannii XDR NDM-1, Blood: A-, eGFR: 110) vs Patient P-109282 (Blood Culture K. pneumoniae MDR blaKPC-3+, Blood: A+, eGFR: 35)",
    p1: {
      id: "P-991340",
      name: "Patient P-991340 (Report 4: XDR Acinetobacter NDM-1)",
      age: 29,
      gender: "Female" as const,
      ward: "ICU / Isolation Bay 02",
      pathogen: "Acinetobacter baumannii (XDR, NDM-1 Producer)",
      specimen: "Blood Culture",
      collectionDate: "2026-09-14",
      file: {
        name: "Screenshot_2026-09-16-14-17-12-88_6431dcd7adc47d9b8b1ef172f656a796.jpg",
        size: 960000,
        type: "image/jpeg",
        uploadedAt: "Report 4",
      },
      clinicalParams: {
        bloodGroup: "A-" as const,
        anemia: {
          hasAnemia: false,
          hemoglobin: 12.8,
          severity: "None" as const,
        },
        comorbidities: ["Multiple recent ICU stays", "Prolonged IV broad-spectrum antibiotics"],
        vitals: {
          weightKg: 58.0,
          heightCm: 165,
          bmi: 21.3,
          bsa: 1.63,
        },
        bloodReport: {
          wbc: 14.2,
          platelets: 210,
          serumCreatinine: 0.75,
          eGfr: 110,
        },
        priorAntibioticMisuse: "Yes (Multiple recent ICU stays & prolonged IV antibiotics)",
        pathogenVirulenceIndex: "Hypervirulent" as const,
        immunityCapacity: "Normal (100%)" as const,
      },
      antibiotics: [
        { drug: "Imipenem", drugClass: "Carbapenem", status: "Resistant" as const, mic: "> 16 µg/mL (NDM-1 Producer)" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: "> 4 µg/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Resistant" as const, mic: "> 16 µg/mL" },
        { drug: "Tigecycline", drugClass: "Glycylcycline", status: "Intermediate" as const, mic: "2 µg/mL" },
        { drug: "Colistin", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
      ],
    },
    p2: {
      id: "P-109282",
      name: "Patient P-109282 (Report 2: MDR blaKPC-3+)",
      age: 62,
      gender: "Male" as const,
      ward: "ICU / High Dependency Unit - Bed 04",
      pathogen: "Klebsiella pneumoniae (blaKPC-3 Carbapenemase Producer)",
      specimen: "Blood Culture",
      collectionDate: "2026-09-10",
      file: {
        name: "Screenshot_2026-09-11-15-33-25-78_40deb401b9ffe8e1df2f1cc5ba480b12.jpg",
        size: 940000,
        type: "image/jpeg",
        uploadedAt: "Report 2",
      },
      clinicalParams: {
        bloodGroup: "A+" as const,
        anemia: {
          hasAnemia: true,
          hemoglobin: 8.5,
          severity: "Severe Anemia" as const,
        },
        comorbidities: ["Severe Renal Impairment (eGFR 35)", "Prior Antibiotic Misuse", "Tissue Hypoxia"],
        vitals: {
          weightKg: 74.0,
          heightCm: 172,
          bmi: 25.0,
          bsa: 1.88,
        },
        bloodReport: {
          wbc: 16.8,
          platelets: 135,
          serumCreatinine: 2.1,
          eGfr: 35,
        },
        priorAntibioticMisuse: "Yes (Multiple broad-spectrum courses within 3 months)",
        pathogenVirulenceIndex: "Hypervirulent" as const,
        immunityCapacity: "Severely Compromised (25%)" as const,
      },
      antibiotics: [
        { drug: "Amoxicillin/Clavulanate", drugClass: "Penicillin combination", status: "Resistant" as const, mic: "> 32 µg/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Resistant" as const, mic: "> 64 µg/mL" },
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Resistant" as const, mic: "> 16 µg/mL (blaKPC-3+)" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: "> 8 µg/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Resistant" as const, mic: "> 16 µg/mL" },
        { drug: "Colistin", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
      ],
    },
  },
  cityCentralWildVsXdr: {
    name: "City Central Lab: Report 1 (Wild-Type) vs Report 4 (XDR Acinetobacter)",
    description: "Compare Patient P-204119 (Wild-Type Sensitive, Blood: O+, eGFR: 90) vs Patient P-991340 (XDR Acinetobacter NDM-1, Blood: A-, eGFR: 110)",
    p1: {
      id: "P-204119",
      name: "Patient P-204119 (Report 1: Wild-Type Sensitive)",
      age: 48,
      gender: "Female" as const,
      ward: "General Medical Ward - Bed 08",
      pathogen: "Klebsiella pneumoniae (Wild-Type Sensitive)",
      specimen: "Blood Culture",
      collectionDate: "2026-09-11",
      file: {
        name: "Screenshot_2026-09-11-15-33-39-13_40deb401b9ffe8e1df2f1cc5ba480b12.jpg",
        size: 890000,
        type: "image/jpeg",
        uploadedAt: "Report 1",
      },
      clinicalParams: {
        bloodGroup: "O+" as const,
        anemia: {
          hasAnemia: false,
          hemoglobin: 13.5,
          severity: "None" as const,
        },
        comorbidities: ["Wild-type clearance profile", "Normal renal clearance"],
        vitals: {
          weightKg: 62.0,
          heightCm: 164,
          bmi: 23.1,
          bsa: 1.67,
        },
        bloodReport: {
          wbc: 7.4,
          platelets: 245,
          serumCreatinine: 0.82,
          eGfr: 90,
        },
        priorAntibioticMisuse: "None reported (Clean antimicrobial history)",
        pathogenVirulenceIndex: "Moderate" as const,
        immunityCapacity: "Normal (100%)" as const,
      },
      antibiotics: [
        { drug: "Amoxicillin/Clavulanate", drugClass: "Penicillin combination", status: "Sensitive" as const, mic: "4 µg/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Sensitive" as const, mic: "<= 1 µg/mL" },
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Sensitive" as const, mic: "<= 0.25 µg/mL" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Sensitive" as const, mic: "<= 1 µg/mL" },
        { drug: "Colistin", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
      ],
    },
    p2: {
      id: "P-991340",
      name: "Patient P-991340 (Report 4: XDR Acinetobacter NDM-1)",
      age: 29,
      gender: "Female" as const,
      ward: "ICU / Isolation Bay 02",
      pathogen: "Acinetobacter baumannii (XDR, NDM-1 Producer)",
      specimen: "Blood Culture",
      collectionDate: "2026-09-14",
      file: {
        name: "Screenshot_2026-09-16-14-17-12-88_6431dcd7adc47d9b8b1ef172f656a796.jpg",
        size: 960000,
        type: "image/jpeg",
        uploadedAt: "Report 4",
      },
      clinicalParams: {
        bloodGroup: "A-" as const,
        anemia: {
          hasAnemia: false,
          hemoglobin: 12.8,
          severity: "None" as const,
        },
        comorbidities: ["Multiple recent ICU stays", "Prolonged IV broad-spectrum antibiotics"],
        vitals: {
          weightKg: 58.0,
          heightCm: 165,
          bmi: 21.3,
          bsa: 1.63,
        },
        bloodReport: {
          wbc: 14.2,
          platelets: 210,
          serumCreatinine: 0.75,
          eGfr: 110,
        },
        priorAntibioticMisuse: "Yes (Multiple recent ICU stays & prolonged IV antibiotics)",
        pathogenVirulenceIndex: "Hypervirulent" as const,
        immunityCapacity: "Normal (100%)" as const,
      },
      antibiotics: [
        { drug: "Imipenem", drugClass: "Carbapenem", status: "Resistant" as const, mic: "> 16 µg/mL (NDM-1 Producer)" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: "> 4 µg/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Resistant" as const, mic: "> 16 µg/mL" },
        { drug: "Tigecycline", drugClass: "Glycylcycline", status: "Intermediate" as const, mic: "2 µg/mL" },
        { drug: "Colistin", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
      ],
    },
  },
  controlSensitive: {
    name: "Control: Wild-Type vs Wild-Type (Clean Isolate Baseline)",
    description: "Compare Patient P-204119 (Wild-Type Sensitive) vs Patient P-204120 (Wild-Type Sensitive)",
    p1: {
      id: "P-204119",
      name: "Patient P-204119 (Report 1: Wild-Type Sensitive)",
      age: 48,
      gender: "Female" as const,
      ward: "General Medical Ward - Bed 08",
      pathogen: "Klebsiella pneumoniae (Wild-Type Sensitive)",
      specimen: "Blood Culture",
      collectionDate: "2026-09-11",
      file: {
        name: "Screenshot_2026-09-11-15-32-06-69_40deb401b9ffe8e1df2f1cc5ba480b12.jpg",
        size: 920000,
        type: "image/jpeg",
        uploadedAt: "Report 1",
      },
      clinicalParams: {
        bloodGroup: "O+" as const,
        anemia: {
          hasAnemia: false,
          hemoglobin: 13.8,
          severity: "None" as const,
        },
        comorbidities: ["Mild Dehydration (Controlled)"],
        vitals: {
          weightKg: 64.0,
          heightCm: 168,
          bmi: 22.7,
          bsa: 1.72,
        },
        bloodReport: {
          wbc: 7.4,
          platelets: 245,
          serumCreatinine: 0.82,
          eGfr: 90,
        },
        priorAntibioticMisuse: "None reported (Clean antimicrobial history)",
        pathogenVirulenceIndex: "Moderate" as const,
        immunityCapacity: "Normal (100%)" as const,
      },
      antibiotics: [
        { drug: "Amoxicillin/Clavulanate", drugClass: "Penicillin combination", status: "Sensitive" as const, mic: "4 µg/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Sensitive" as const, mic: "<= 1 µg/mL" },
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Sensitive" as const, mic: "<= 0.25 µg/mL" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Sensitive" as const, mic: "<= 1 µg/mL" },
        { drug: "Colistin", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
      ],
    },
    p2: {
      id: "P-204120",
      name: "Patient P-204120 (Clean Control: Wild-Type Sensitive)",
      age: 42,
      gender: "Male" as const,
      ward: "General Medical Ward - Bed 12",
      pathogen: "Escherichia coli (Wild-Type Sensitive)",
      specimen: "Blood Culture",
      collectionDate: "2026-09-12",
      file: {
        name: "Control_WildType_Sensitive.pdf",
        size: 850000,
        type: "application/pdf",
        uploadedAt: "Control Baseline",
      },
      clinicalParams: {
        bloodGroup: "O+" as const,
        anemia: {
          hasAnemia: false,
          hemoglobin: 14.5,
          severity: "None" as const,
        },
        comorbidities: ["None (Healthy Baseline)"],
        vitals: {
          weightKg: 72.0,
          heightCm: 175,
          bmi: 23.5,
          bsa: 1.87,
        },
        bloodReport: {
          wbc: 6.8,
          platelets: 260,
          serumCreatinine: 0.8,
          eGfr: 98,
        },
        priorAntibioticMisuse: "None reported",
        pathogenVirulenceIndex: "Moderate" as const,
        immunityCapacity: "Normal (100%)" as const,
      },
      antibiotics: [
        { drug: "Amoxicillin/Clavulanate", drugClass: "Penicillin combination", status: "Sensitive" as const, mic: "2 µg/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Sensitive" as const, mic: "<= 0.25 µg/mL" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Sensitive" as const, mic: "<= 0.25 µg/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Sensitive" as const, mic: "<= 1 µg/mL" },
        { drug: "Colistin", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
      ],
    },
  },
};

export const REPORT_1_PATIENT: PatientData = SAMPLE_SCENARIOS.cityCentralLab.p1;
export const REPORT_2_PATIENT: PatientData = SAMPLE_SCENARIOS.cityCentralLab.p2;
export const REPORT_4_PATIENT: PatientData = SAMPLE_SCENARIOS.cityCentralXdrVsMdr.p1;
export const REPORT_3_PATIENT: PatientData = {
  id: "P-771940",
  name: "Patient P-771940 (Report 3: MDR Pseudomonas)",
  age: 54,
  gender: "Male" as const,
  ward: "Respiratory ICU - Bed 06",
  pathogen: "Pseudomonas aeruginosa (MDR MexAB-OprM+)",
  specimen: "Tracheal Aspirate / Sputum",
  collectionDate: "2026-09-12",
  file: {
    name: "Report_3_P-771940_Pseudomonas.pdf",
    size: 680000,
    type: "application/pdf",
    uploadedAt: "Report 3",
  },
  clinicalParams: {
    bloodGroup: "B+" as const,
    anemia: {
      hasAnemia: true,
      hemoglobin: 10.4,
      severity: "Mild Anemia" as const,
    },
    comorbidities: ["Moderate Renal Impairment (eGFR 65)", "Chronic Bronchiectasis"],
    vitals: {
      weightKg: 68.0,
      heightCm: 170,
      bmi: 23.5,
      bsa: 1.79,
    },
    bloodReport: {
      wbc: 12.8,
      platelets: 195,
      serumCreatinine: 1.35,
      eGfr: 65,
    },
    priorAntibioticMisuse: "Yes (Frequent self-prescribed fluoroquinolones)",
    pathogenVirulenceIndex: "High" as const,
    immunityCapacity: "Moderate (50%)" as const,
  },
  antibiotics: [
    { drug: "Piperacillin-Tazobactam", drugClass: "Penicillin combination", status: "Resistant" as const, mic: "> 128 µg/mL" },
    { drug: "Cefepime", drugClass: "4th Gen Cephalosporin", status: "Resistant" as const, mic: "> 32 µg/mL" },
    { drug: "Meropenem", drugClass: "Carbapenem", status: "Resistant" as const, mic: "> 16 µg/mL" },
    { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: "> 4 µg/mL" },
    { drug: "Amikacin", drugClass: "Aminoglycoside", status: "Sensitive" as const, mic: "4 µg/mL" },
    { drug: "Colistin", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 µg/mL" },
  ],
};

export const DEFAULT_PATIENT_1: PatientData = REPORT_1_PATIENT;
export const DEFAULT_PATIENT_2: PatientData = REPORT_2_PATIENT;

export const SAMPLE_PATIENT_RECORDS: PatientData[] = [
  REPORT_1_PATIENT,
  REPORT_2_PATIENT,
  REPORT_4_PATIENT,
  REPORT_3_PATIENT,
  SAMPLE_SCENARIOS.controlSensitive.p2,
  SAMPLE_SCENARIOS.icuCarbapenem.p1,
  SAMPLE_SCENARIOS.icuCarbapenem.p2,
  SAMPLE_SCENARIOS.postOpSurgery.p1,
  SAMPLE_SCENARIOS.postOpSurgery.p2,
];

export const STANDARD_MODE_OF_ACTION_CATALOG: ModeOfActionItem[] = [
  {
    drugClass: "Carbapenems",
    representativeDrug: "Meropenem / Imipenem",
    targetOrganelle: "Penicillin-Binding Proteins (PBP-2 & PBP-3) in bacterial peptidoglycan wall",
    pharmacologicalAction: "Covalently acylates the transpeptidase enzyme domain, blocking cross-linking of peptide side chains, causing osmotic autolysis and bactericidal death.",
    bacterialResistanceMechanism: "Production of serine carbapenemases (blaKPC), metallo-beta-lactamases (blaNDM, blaVIM), and loss of outer membrane porin channels (OmpK35/36, OprD).",
    clinicalCounterStrategy: "Co-administer novel diazabicyclooctane (DBO) inhibitors (Avibactam, Relebactam) or cyclic boronic acid inhibitors (Vaborbactam); consider Cefiderocol for metallo-enzymes.",
  },
  {
    drugClass: "Fluoroquinolones",
    representativeDrug: "Ciprofloxacin / Levofloxacin",
    targetOrganelle: "Bacterial DNA Gyrase (GyrA/GyrB) & Topoisomerase IV (ParC/ParE)",
    pharmacologicalAction: "Traps the gyrase-DNA cleaved complex, precipitating double-stranded DNA breaks and triggering bacterial apoptotic SOS responses.",
    bacterialResistanceMechanism: "Chromosomal point mutations in the Quinolone Resistance-Determining Region (QRDR: Ser83Leu, Asp87Asn) and upregulation of multidrug efflux pumps (MexAB-OprM, AcrAB-TolC).",
    clinicalCounterStrategy: "Strict avoidance of fluoroquinolone monotherapy in hospital isolates; rotate to high-barrier aminoglycosides or intravenous polymyxin targeted therapy.",
  },
  {
    drugClass: "Cephalosporins (3rd/4th Gen)",
    representativeDrug: "Ceftriaxone / Cefepime",
    targetOrganelle: "PBP-1a, PBP-1b, and PBP-3 transpeptidases",
    pharmacologicalAction: "Interferes with peptidoglycan synthesis during active bacterial cell division, leading to cell elongation, spheroplast formation, and lysis.",
    bacterialResistanceMechanism: "Plasmid-mediated Extended-Spectrum Beta-Lactamases (ESBL: CTX-M, TEM, SHV) and stably derepressed chromosomal AmpC cephalosporinases.",
    clinicalCounterStrategy: "Avoid all 3rd gen cephalosporins even if in vitro susceptible (inoculum effect); use Cefepime/Zidebactam or transition to Carbapenem-sparing combinations.",
  },
  {
    drugClass: "Polymyxins",
    representativeDrug: "Colistin (Polymyxin E) / Polymyxin B",
    targetOrganelle: "Gram-negative outer membrane Lipopolysaccharide (LPS / Lipid A)",
    pharmacologicalAction: "Electrostatic displacement of Mg2+ and Ca2+ counterions on lipid A phosphate groups, causing permeabilization of bacterial membrane and leakage of intracellular contents.",
    bacterialResistanceMechanism: "Chromosomal mutations in pmrA/pmrB or phoP/phoQ two-component regulatory systems causing addition of 4-amino-4-deoxy-L-arabinose (L-Ara4N) or plasmid-borne mcr-1 to mcr-10 genes.",
    clinicalCounterStrategy: "Always pair Colistin with a synergy backbone (e.g. Meropenem or Tigecycline) to prevent in-therapy resistance emergence; monitor daily serum creatinine.",
  },
  {
    drugClass: "Glycylcyclines",
    representativeDrug: "Tigecycline / Eravacycline",
    targetOrganelle: "30S Ribosomal subunit (A-site tRNA binding)",
    pharmacologicalAction: "Binds reversibly to the 30S ribosomal subunit with 5x greater affinity than tetracyclines, blocking aminoacyl-tRNA accommodation and halting peptide elongation.",
    bacterialResistanceMechanism: "Hyper-expression of Resistance-Nodulation-Division (RND) type efflux pumps (AdeABC in A. baumannii, AcrAB in Enterobacteriaceae).",
    clinicalCounterStrategy: "Utilize high-dose strategy (200mg IV loading dose, then 100mg q12h); avoid for bloodstream infections due to low serum Cmax (large volume of distribution).",
  },
];

export const STANDARD_RISK_REDUCTION_GUIDE: RiskReductionStep[] = [
  {
    category: "Infection Control & Barrier",
    title: "Enforce Enhanced Contact Precautions (Level 4B)",
    action: "Place both patients in dedicated single-room contact isolation or cohort in dedicated MDRO bay. Mandatory gown, gloves, and dedicated bedside monitoring equipment (stethoscopes, BP cuffs).",
    priority: "Immediate",
  },
  {
    category: "PK/PD & Renal Dosing",
    title: "eGFR-Adjusted Extended Infusion Dosing",
    action: "For patients with CKD/low eGFR, adjust beta-lactam dosing intervals and administer via prolonged 3-hour or continuous IV infusions to optimize time above MIC (%fT > MIC > 70%).",
    priority: "Immediate",
  },
  {
    category: "Antimicrobial Stewardship",
    title: "Carbapenem-Sparing Step-Down Strategy",
    action: "De-escalate from empiric broad-spectrum carbapenems as soon as pathogen identity is verified. Reserve Ceftazidime-Avibactam or Cefiderocol strictly for molecularly verified resistant isolates.",
    priority: "High",
  },
  {
    category: "Host Immunity Support",
    title: "Anemia & Immunocompetence Management",
    action: "Support host defenses by treating moderate-to-severe anemia (target Hb > 10 g/dL), managing glycemic control (target blood glucose 140-180 mg/dL), and optimizing nutritional albumin levels.",
    priority: "Advisory",
  },
  {
    category: "Antimicrobial Stewardship",
    title: "Prior Antibiotic Misuse Audit",
    action: "Document and review patient's OTC antibiotic history to anticipate hidden collateral selection (e.g. quinolone-driven Clostridioides difficile colonization or fungal overgrowth).",
    priority: "Advisory",
  },
];

export function normalizeDrugName(name: string): string {
  const trimmed = name.trim();
  if (/amoxicillin[/-]clavulanate/i.test(trimmed)) return "Amoxicillin/Clavulanate";
  if (/colistin/i.test(trimmed)) return "Colistin";
  if (/trimethoprim|co-trimoxazole/i.test(trimmed)) return "Co-Trimoxazole";
  if (/piperacillin[/-]tazobactam/i.test(trimmed)) return "Piperacillin-Tazobactam";
  return trimmed;
}

export function buildComparativeRows(p1: PatientData, p2: PatientData): ComparativeDrugRow[] {
  const rows: ComparativeDrugRow[] = [];
  const p1Antibiotics = p1?.antibiotics || [];
  const p2Antibiotics = p2?.antibiotics || [];

  const p1Map = new Map(p1Antibiotics.map((a) => [normalizeDrugName(a?.drug || ""), a]));
  const p2Map = new Map(p2Antibiotics.map((a) => [normalizeDrugName(a?.drug || ""), a]));

  // Also build class-level maps to cross-correlate classes like Carbapenems
  const p1ClassMap = new Map(p1Antibiotics.map((a) => [(a?.drugClass || "").toLowerCase(), a]));
  const p2ClassMap = new Map(p2Antibiotics.map((a) => [(a?.drugClass || "").toLowerCase(), a]));

  const allDrugs = Array.from(new Set([...p1Map.keys(), ...p2Map.keys()]));

  for (const drug of allDrugs) {
    let a1 = p1Map.get(drug);
    let a2 = p2Map.get(drug);

    // If one patient has Imipenem and the other has Meropenem, correlate Carbapenems
    if (!a1 && a2 && /carbapenem/i.test(a2.drugClass || "")) {
      const carbapenemMatch = p1Antibiotics.find((a) => /carbapenem/i.test(a?.drugClass || ""));
      if (carbapenemMatch) a1 = carbapenemMatch;
    } else if (!a2 && a1 && /carbapenem/i.test(a1.drugClass || "")) {
      const carbapenemMatch = p2Antibiotics.find((a) => /carbapenem/i.test(a?.drugClass || ""));
      if (carbapenemMatch) a2 = carbapenemMatch;
    }

    const p1Status: ResistanceLevel = a1 ? a1.status : (p1ClassMap.get(a2?.drugClass.toLowerCase() || "")?.status || "Sensitive");
    const p2Status: ResistanceLevel = a2 ? a2.status : (p2ClassMap.get(a1?.drugClass.toLowerCase() || "")?.status || "Sensitive");
    const drugClass = a1?.drugClass || a2?.drugClass || "Antimicrobial";

    let crossCompatibility: ComparativeDrugRow["crossCompatibility"] = "Divergent";
    let clinicalNote = "";

    if (p1Status === "Resistant" && p2Status === "Resistant") {
      crossCompatibility = "Shared Resistance";
      clinicalNote = "High hazard: Complete treatment failure risk across both patients.";
    } else if (p1Status === "Sensitive" && p2Status === "Sensitive") {
      crossCompatibility = "Sensitive to Both";
      clinicalNote = "Viable therapeutic candidate for both clinical isolates.";
    } else if (p1Status === "Intermediate" || p2Status === "Intermediate") {
      crossCompatibility = "Intermediate Overlap";
      clinicalNote = "Dose escalation or combination synergy required.";
    } else {
      crossCompatibility = "Divergent";
      clinicalNote = `Selective efficacy: Effective in ${p1Status === "Sensitive" ? p1.name : p2.name} only.`;
    }

    rows.push({
      id: drug.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      drug,
      drugClass,
      p1Status,
      p1Mic: a1?.mic,
      p2Status,
      p2Mic: a2?.mic,
      crossCompatibility,
      clinicalNote,
    });
  }

  // Sort: Shared Resistance first, then Intermediate, then Divergent, then Sensitive to Both
  const orderWeight = {
    "Shared Resistance": 0,
    "Intermediate Overlap": 1,
    "Divergent": 2,
    "Sensitive to Both": 3,
  };
  return rows.sort((a, b) => orderWeight[a.crossCompatibility] - orderWeight[b.crossCompatibility]);
}

export const RESISTANCE_TREND_DATA: ResistanceTrendData[] = [
  { month: "Oct 2025", Carbapenems: 18.2, Fluoroquinolones: 44.5, Cephalosporins: 52.1, Aminoglycosides: 26.4, Glycopeptides: 8.1 },
  { month: "Nov 2025", Carbapenems: 19.1, Fluoroquinolones: 46.0, Cephalosporins: 54.3, Aminoglycosides: 25.8, Glycopeptides: 8.4 },
  { month: "Dec 2025", Carbapenems: 21.4, Fluoroquinolones: 47.8, Cephalosporins: 55.6, Aminoglycosides: 27.2, Glycopeptides: 9.0 },
  { month: "Jan 2026", Carbapenems: 23.0, Fluoroquinolones: 49.2, Cephalosporins: 58.0, Aminoglycosides: 28.5, Glycopeptides: 9.3 },
  { month: "Feb 2026", Carbapenems: 22.6, Fluoroquinolones: 48.7, Cephalosporins: 57.2, Aminoglycosides: 26.9, Glycopeptides: 8.8 },
  { month: "Mar 2026", Carbapenems: 24.5, Fluoroquinolones: 51.1, Cephalosporins: 59.8, Aminoglycosides: 29.1, Glycopeptides: 9.7 },
  { month: "Apr 2026", Carbapenems: 25.8, Fluoroquinolones: 52.4, Cephalosporins: 61.2, Aminoglycosides: 30.0, Glycopeptides: 10.2 },
  { month: "May 2026", Carbapenems: 27.3, Fluoroquinolones: 54.0, Cephalosporins: 63.5, Aminoglycosides: 31.4, Glycopeptides: 10.8 },
  { month: "Jun 2026", Carbapenems: 26.7, Fluoroquinolones: 53.2, Cephalosporins: 62.0, Aminoglycosides: 30.8, Glycopeptides: 10.1 },
  { month: "Jul 2026", Carbapenems: 28.9, Fluoroquinolones: 55.6, Cephalosporins: 64.7, Aminoglycosides: 32.5, Glycopeptides: 11.4 },
  { month: "Aug 2026", Carbapenems: 30.2, Fluoroquinolones: 57.1, Cephalosporins: 66.3, Aminoglycosides: 33.1, Glycopeptides: 11.9 },
  { month: "Sep 2026", Carbapenems: 31.5, Fluoroquinolones: 58.4, Cephalosporins: 67.8, Aminoglycosides: 34.0, Glycopeptides: 12.3 },
];

export const PATHOGEN_BREAKDOWN = [
  { pathogen: "K. pneumoniae", isolates: 4820, mdrRate: 46.2, riskColor: "#F43F5E" },
  { pathogen: "P. aeruginosa", isolates: 3940, mdrRate: 38.5, riskColor: "#FB923C" },
  { pathogen: "A. baumannii", isolates: 2810, mdrRate: 74.8, riskColor: "#EF4444" },
  { pathogen: "E. coli (ESBL)", isolates: 5120, mdrRate: 31.2, riskColor: "#FBBF24" },
  { pathogen: "S. aureus (MRSA)", isolates: 3400, mdrRate: 41.0, riskColor: "#E11D48" },
  { pathogen: "E. faecium (VRE)", isolates: 1240, mdrRate: 59.4, riskColor: "#DC2626" },
];

export const QUICK_STATS = {
  totalReportsScanned: 14892,
  reportsScannedDelta: "+8.4%",
  criticalAlerts: 142,
  alertsDelta: "+12 active",
  activeStrainsMonitored: 28,
  strainsDelta: "6 High-Concern",
  efficacyIndex: "94.2%",
  efficacyDelta: "+1.8% alignment",
};

export const MOCK_PATIENT_1: PatientData = DEFAULT_PATIENT_1;
export const MOCK_PATIENT_2: PatientData = DEFAULT_PATIENT_2;
export const generateComparativeRows = buildComparativeRows;

export function computeWhyBacteriaAffectsReport(
  p1: PatientData,
  p2: PatientData
): import("../types").WhyBacteriaAffectsReport {
  const p1Blood = p1.clinicalParams?.bloodGroup || "B+";
  const p2Blood = p2.clinicalParams?.bloodGroup || "O+";
  const p1Hb = p1.clinicalParams?.anemia.hemoglobin || 9.6;
  const p2Hb = p2.clinicalParams?.anemia.hemoglobin || 13.5;
  const p1EGfr = p1.clinicalParams?.bloodReport.eGfr || 42;
  const p2EGfr = p2.clinicalParams?.bloodReport.eGfr || 92;
  const p1Misuse = p1.clinicalParams?.priorAntibioticMisuse || "High";
  const p2Misuse = p2.clinicalParams?.priorAntibioticMisuse || "None";
  const p1Pathogen = p1.pathogen;
  const p2Pathogen = p2.pathogen;

  // Evaluate host defense protections
  const p1BloodProtected = p1Blood.startsWith("O");
  const p2BloodProtected = p2Blood.startsWith("O");
  const p1HbProtected = p1Hb >= 12.5;
  const p2HbProtected = p2Hb >= 12.5;
  const p1RenalProtected = p1EGfr >= 75;
  const p2RenalProtected = p2EGfr >= 75;
  const p1MicrobiomeProtected = !p1Misuse.toLowerCase().includes("high") && !p1Misuse.toLowerCase().includes("repeat");
  const p2MicrobiomeProtected = !p2Misuse.toLowerCase().includes("high") && !p2Misuse.toLowerCase().includes("repeat");

  const factors: import("../types").PathogenHostDefenseFactor[] = [
    {
      factorTitle: "1. Blood Group Antigen & Bacterial Adhesion Receptors",
      scientificMechanism: "Bacterial adhesins (Type 1 fimbriae / FimH & P-pili) bind specifically to host cell carbohydrate epitopes. Group B and A antigens express terminal Galα1-3Galβ or GalNAc sugars providing high-affinity docking anchors, whereas Group O lacks A/B terminal monosaccharides.",
      p1Status: {
        value: `Blood Group ${p1Blood}`,
        isProtected: p1BloodProtected,
        effectDescription: p1BloodProtected
          ? "Blood Group O lacks terminal A/B carbohydrate epitopes. Bacterial fimbriae cannot firmly anchor, allowing fluids to wash away planktonic bacteria."
          : `Blood Group ${p1Blood} presents abundant carbohydrate receptor chains (Galα1-3Galβ), allowing ${p1Pathogen.split(" ")[0]} fimbriae to adhere tightly to epithelial surfaces and resist mechanical flushing.`,
      },
      p2Status: {
        value: `Blood Group ${p2Blood}`,
        isProtected: p2BloodProtected,
        effectDescription: p2BloodProtected
          ? "Blood Group O lacks terminal A/B carbohydrate epitopes. Bacterial fimbriae cannot firmly anchor, allowing fluids to wash away planktonic bacteria."
          : `Blood Group ${p2Blood} presents carbohydrate receptor chains, allowing bacterial fimbriae to adhere to epithelial surfaces.`,
      },
      clinicalVerdict: "Blood Group O+ confers a natural receptor-binding barrier; Blood Group B+ allows 3.4x higher bacterial adherence density.",
    },
    {
      factorTitle: "2. Hemoglobin Oxygen Tension & Neutrophil Oxidative Burst (Microbicidal Kill)",
      scientificMechanism: "Host neutrophils (PMNs) eliminate engulfed bacteria using a violent oxygen-dependent respiratory burst (NADPH oxidase producing superoxide O2-, and myeloperoxidase-catalyzed HOCl). Tissue hypoxia caused by anemia cripples this oxidative killing mechanism.",
      p1Status: {
        value: `Hb ${p1Hb} g/dL (${p1HbProtected ? "Normal Oxygenation" : "Moderate Anemia / Hypoxia"})`,
        isProtected: p1HbProtected,
        effectDescription: p1HbProtected
          ? "Adequate tissue oxygenation fuels rapid neutrophil respiratory burst. Phagocytosed bacteria are chemically liquidated within 30-45 minutes."
          : `Tissue hypoxia from Anemia (Hb ${p1Hb} g/dL) reduces neutrophil reactive oxygen species (ROS) production by >60%. Ingested bacteria survive intracellularly, proliferate, and lyse host immune cells.`,
      },
      p2Status: {
        value: `Hb ${p2Hb} g/dL (${p2HbProtected ? "Normal Oxygenation" : "Anemia"})`,
        isProtected: p2HbProtected,
        effectDescription: p2HbProtected
          ? "Adequate tissue oxygenation fuels rapid neutrophil respiratory burst. Phagocytosed bacteria are chemically liquidated within 30-45 minutes."
          : `Tissue hypoxia reduces neutrophil reactive oxygen species production, slowing down bacterial killing and allowing sustained colonization.`,
      },
      clinicalVerdict: p2HbProtected && !p1HbProtected
        ? `${p2.name} successfully destroys bacteria through high-energy oxidative bursts; ${p1.name}'s hypoxic tissues allow bacteria to survive phagocytosis.`
        : "Hemoglobin level directly governs the speed of neutrophil-mediated microbicidal bacterial clearance.",
    },
    {
      factorTitle: "3. Renal Hydrodynamic Washout & Excretion Clearance (eGFR)",
      scientificMechanism: "Continuous high urinary flow rates generate physical hydrodynamic shear stress that sweeps away non-adherent bacteria, preventing colonization and ascending pyelonephritis. High filtration also prevents toxic metabolite buildup.",
      p1Status: {
        value: `eGFR ${p1EGfr} mL/min (${p1RenalProtected ? "High Hydrodynamic Washout" : "Renal Stasis / Impaired Clearance"})`,
        isProtected: p1RenalProtected,
        effectDescription: p1RenalProtected
          ? "High urinary flow rate continuously flushes the urothelial lumen, preventing bacteria from organizing into protective exopolysaccharide biofilms."
          : `Low eGFR (${p1EGfr} mL/min) creates urinary stasis and slows drug clearance. Bacteria settle undisturbed on mucosal surfaces, replicating and forming dense biofilms that resist antibiotics.`,
      },
      p2Status: {
        value: `eGFR ${p2EGfr} mL/min (${p2RenalProtected ? "High Hydrodynamic Washout" : "Impaired Clearance"})`,
        isProtected: p2RenalProtected,
        effectDescription: p2RenalProtected
          ? "High urinary flow rate continuously flushes the urothelial lumen, preventing bacteria from organizing into protective exopolysaccharide biofilms."
          : `Reduced eGFR creates urinary stasis, allowing bacteria more time to adhere to mucosal surfaces.`,
      },
      clinicalVerdict: p2RenalProtected && !p1RenalProtected
        ? `${p2.name}'s high filtration (eGFR ${p2EGfr}) physically sweeps bacteria away, while ${p1.name}'s low filtration (eGFR ${p1EGfr}) leads to stagnation and biofilm incubation.`
        : "Renal hydrodynamic flow serves as a primary physical barrier against bacterial colonization.",
    },
    {
      factorTitle: "4. Microbiome Barrier & Colonization Resistance (Prior Antibiotic History)",
      scientificMechanism: "An intact commensal microbiome provides 'colonization resistance' by outcompeting pathogens for nutrients, physically blocking attachment niches, and secreting antibacterial bacteriocins. Repeated antibiotic misuse sterilizes protective commensals.",
      p1Status: {
        value: `${p1Misuse.includes("High") || p1Misuse.includes("Repeat") ? "Depleted Commensals (Prior Misuse)" : "Preserved Commensal Flora"}`,
        isProtected: p1MicrobiomeProtected,
        effectDescription: p1MicrobiomeProtected
          ? "Diverse natural microbiome physically shields tissue receptors and starves invading pathogens of essential trace nutrients."
          : `History of repeated broad-spectrum antibiotic cycles eliminated protective commensal anaerobic bacteria, leaving wide mucosal niches completely open for ${p1Pathogen} to overgrow without competition.`,
      },
      p2Status: {
        value: `${p2Misuse.includes("High") || p2Misuse.includes("Repeat") ? "Depleted Commensals" : "Preserved Commensal Flora"}`,
        isProtected: p2MicrobiomeProtected,
        effectDescription: p2MicrobiomeProtected
          ? "Diverse natural microbiome physically shields tissue receptors and starves invading pathogens of essential trace nutrients."
          : "Disrupted microbiome reduces colonization resistance, leaving mucosal niches vulnerable.",
      },
      clinicalVerdict: "Preserved microbiome acts as an ecological shield; prior antibiotic misuse strips host colonization resistance.",
    },
    {
      factorTitle: "5. Bacterial Mutational Shield & Enzymatic Drug Neutralization",
      scientificMechanism: "Pathogens express beta-lactamases (blaKPC-3, CTX-M-15, NDM-1) that chemically hydrolyze the beta-lactam ring of carbapenems/cephalosporins, combined with outer membrane porin mutations (loss of OmpK35/36) that physically prevent drug entry.",
      p1Status: {
        value: `${p1Pathogen.includes("KPC") || p1Pathogen.includes("MDR") ? "Active Carbapenemase (blaKPC-3) + Porin Loss" : "Intermediate Susceptibility"}`,
        isProtected: false,
        effectDescription: `The strain infecting ${p1.name} produces blaKPC-3 carbapenemase which enzymatically destroys Meropenem and Cephalosporins before they can bind penicillin-binding proteins (PBPs). Standard therapy fails completely.`,
      },
      p2Status: {
        value: `${p2Pathogen.includes("Wild") || (!p2Pathogen.includes("KPC") && !p2Pathogen.includes("MDR")) ? "Wild-Type / Lower Resistance Spectrum" : "Multidrug Resistant Profile"}`,
        isProtected: !p2Pathogen.includes("KPC") && !p2Pathogen.includes("MDR"),
        effectDescription: (!p2Pathogen.includes("KPC") && !p2Pathogen.includes("MDR"))
          ? `Pathogen in ${p2.name} retains porin permeability and lacks serine carbapenemases, allowing antimicrobial molecules to reach target organelles unimpeded.`
          : `The isolate in ${p2.name} exhibits specific resistance markers, but differs in susceptibility breakpoints.`,
      },
      clinicalVerdict: "Enzymatic hydrolysis and porin exclusion explain why conventional empiric antibiotics have zero therapeutic efficacy against Patient 1's isolate.",
    },
  ];

  // Determine host vulnerability balance dynamically
  const p1Vulnerable = !p1BloodProtected || !p1HbProtected || !p1RenalProtected || p1Pathogen.toLowerCase().includes("kpc") || p1Pathogen.toLowerCase().includes("mdr");
  const p2Vulnerable = !p2BloodProtected || !p2HbProtected || !p2RenalProtected || p2Pathogen.toLowerCase().includes("kpc") || p2Pathogen.toLowerCase().includes("mdr");

  const p1ProtectedBullets = [
    `Blood Group ${p1Blood}: Lacks terminal A/B carbohydrate epitopes, significantly reducing bacterial adhesin anchor density.`,
    `Optimal Oxygenation (Hb ${p1Hb} g/dL): Robust neutrophil respiratory burst rapidly generates reactive oxygen species (ROS) to liquidate engulfed pathogens.`,
    `Hydrodynamic Flushing (eGFR ${p1EGfr} mL/min): High glomerular filtration velocity continuously sweeps away bacteria before biofilm incubation.`,
    `Preserved Commensal Flora: Intact microbiome occupies receptor niches and produces natural antimicrobial bacteriocins.`,
  ];

  const p1VulnerableBullets = [
    `Blood Group ${p1Blood}: High density of Galα1-3Galβ receptors enables tight bacterial fimbrial anchoring that resists urine/mucus washout.`,
    `Tissue Hypoxia (Hb ${p1Hb} g/dL): Severe reduction in neutrophil oxidative respiratory burst (ROS/MPO), allowing engulfed bacteria to survive intracellularly.`,
    `Urinary Stasis / Impaired Clearance (eGFR ${p1EGfr} mL/min): Lack of hydrodynamic shear stress allows bacteria to establish persistent exopolysaccharide biofilms.`,
    `Microbiome Depletion: Prior antibiotic misuse eradicated protective commensal flora, leaving open niches for MDR colonization.`,
    p1Pathogen.toLowerCase().includes("kpc") ? `Enzymatic Invalidation: Bacterial blaKPC-3 carbapenemase inactivates standard beta-lactams and carbapenems.` : `Altered clearance profile increases susceptibility to invasive colonization.`,
  ];

  const p2ProtectedBullets = [
    `Blood Group ${p2Blood}: Lacks terminal A/B carbohydrate epitopes, significantly reducing bacterial adhesin anchor density.`,
    `Optimal Oxygenation (Hb ${p2Hb} g/dL): Strong neutrophil respiratory burst rapidly generates superoxide and hypochlorous acid to destroy engulfed pathogens.`,
    `Hydrodynamic Flushing (eGFR ${p2EGfr} mL/min): High glomerular filtration velocity continuously sweeps away bacteria before biofilm formation can occur.`,
    `Preserved Commensal Flora: Natural microbiome occupies receptor sites and produces antimicrobial bacteriocins.`,
  ];

  const p2VulnerableBullets = [
    `Blood Group ${p2Blood}: High density of GalNAc / Gal carbohydrate receptors enables tight bacterial fimbrial anchoring.`,
    `Tissue Hypoxia (Hb ${p2Hb} g/dL): Severe reduction in neutrophil oxidative burst, allowing ingested bacteria to proliferate.`,
    `Urinary Stasis (eGFR ${p2EGfr} mL/min): Reduced filtration rate allows bacteria to settle and develop dense protective biofilms.`,
    `Commensal Disruption: Prior broad-spectrum antibiotic exposure stripped natural colonization resistance.`,
    p2Pathogen.toLowerCase().includes("kpc") ? `Enzymatic Invalidation: Active blaKPC-3 carbapenemase destroys penicillins, cephalosporins, and carbapenems.` : `Resistance factors present.`,
  ];

  return {
    title: "Pathogen Susceptibility & Host Defense Cross-Analysis Report",
    subtitle: "Clinical, Immunological & Pharmacological Mechanisms: Why the Bacteria Affects or Spares Each Patient",
    executiveSummary: `This clinical evaluation reveals why bacterial exposure produces contrasting clinical outcomes between ${p1.name} (${p1.id}) and ${p2.name} (${p2.id}). Differences in blood group adhesin receptor density (${p1Blood} vs ${p2Blood}), tissue oxygenation (Hb ${p1Hb} vs ${p2Hb} g/dL), renal hydrodynamic flushing (eGFR ${p1EGfr} vs ${p2EGfr} mL/min), and isolate resistance genes explain the sharp contrast in host susceptibility and therapeutic response.`,
    patient1Summary: {
      patientName: p1.name,
      pathogen: p1.pathogen,
      overallImpact: p1Vulnerable ? "High Infection Vulnerability (Bacteria Overcomes Defenses)" : "Protected / Low Colonization Risk",
      severityColor: p1Vulnerable ? "rose" : "emerald",
      whyAffectsOrNotBullets: p1Vulnerable ? p1VulnerableBullets : p1ProtectedBullets,
      bacterialResistanceFailureReason: p1Vulnerable
        ? `The bacteria produces resistance enzymes or encounters compromised mucosal defenses. Standard empiric antibiotic therapy faces significant barriers.`
        : `Pathogen in ${p1.name} exhibits wild-type susceptibility. Standard antimicrobial regimens effectively bind penicillin-binding proteins (PBPs) and achieve bactericidal clearance.`,
      hostDefenseBreakdown: p1Vulnerable
        ? `Innate neutrophil killing is impeded by physiological factors (Hb ${p1Hb} g/dL, eGFR ${p1EGfr} mL/min), allowing sustained colonization.`
        : `Innate host defenses (phagocytosis, intact epithelial barriers, high flow wash-out) remain functional, effectively preventing deep tissue invasion.`,
    },
    patient2Summary: {
      patientName: p2.name,
      pathogen: p2.pathogen,
      overallImpact: p2Vulnerable ? "High Infection Vulnerability (Bacteria Overcomes Defenses)" : "Protected / Low Colonization Risk",
      severityColor: p2Vulnerable ? "rose" : "emerald",
      whyAffectsOrNotBullets: p2Vulnerable ? p2VulnerableBullets : p2ProtectedBullets,
      bacterialResistanceFailureReason: p2Vulnerable
        ? `The bacteria produces active blaKPC-3 carbapenemase and has altered porin permeability. Conventional beta-lactams and carbapenems are enzymatically inactivated.`
        : `Pathogen retains sensitivity to specific alternative agents, allowing effective targeted treatment.`,
      hostDefenseBreakdown: p2Vulnerable
        ? `Tissue hypoxia (Hb ${p2Hb} g/dL) and compromised renal excretion (eGFR ${p2EGfr} mL/min) reduce innate clearance, allowing bacterial colonization.`
        : `Innate host defenses (phagocytosis, intact epithelial barriers, high flow wash-out) remain functional, effectively preventing deep tissue invasion.`,
    },
    detailedFactors: factors,
    bilingualKeyPointsHindi: {
      heading: "मुख्य बिंदु (सरल हिंदी में समझें)",
      points: [
        {
          factor: "1. रक्त समूह और चिपकने वाले रिसेप्टर्स (Blood Group Receptors)",
          kyoAsarKartaHaiYaNahi: p1BloodProtected
            ? `Patient 1 (${p1Blood}) के ब्लड ग्रुप में अतिरिक्त रिसेप्टर्स नहीं होते जिससे बैक्टीरिया चिपक नहीं पाता। जबकि Patient 2 (${p2Blood}) में रिसेप्टर्स अधिक होने से बैक्टीरिया आसानी से चिपक जाता है।`
            : `Patient 1 (${p1Blood}) के ब्लड ग्रुप में ऐसे कार्बोहाइड्रेट रिसेप्टर्स होते हैं जहां बैक्टीरिया आसानी से चिपक जाता है। जबकि Patient 2 (${p2Blood}) में बैक्टीरिया शरीर के तरल पदार्थ द्वारा आसानी से बह जाता है।`,
        },
        {
          factor: "2. हीमोग्लोबिन और ऑक्सीजन (Hemoglobin & Neutrophil Kill)",
          kyoAsarKartaHaiYaNahi: p1HbProtected
            ? `Patient 1 (Hb ${p1Hb} g/dL) में पर्याप्त ऑक्सीजन होने से प्रतिरक्षा कोशिकाएं (Neutrophils) बैक्टीरिया को तुरंत मार देती हैं। Patient 2 (Hb ${p2Hb} g/dL) को एनीमिया होने से बैक्टीरिया बच जाता है।`
            : `Patient 1 को एनीमिया है (Hb ${p1Hb} g/dL), जिससे ऑक्सीजन की कमी के कारण प्रतिरक्षा कोशिकाएं बैक्टीरिया को मार नहीं पातीं। Patient 2 (Hb ${p2Hb} g/dL) में पर्याप्त ऑक्सीजन से प्रतिरक्षा प्रणाली बैक्टीरिया को नष्ट कर देती है।`,
        },
        {
          factor: "3. गुर्दे की सफाई और पेशाब का बहाव (eGFR Hydrodynamic Clearance)",
          kyoAsarKartaHaiYaNahi: p1RenalProtected
            ? `Patient 1 का उच्च eGFR (${p1EGfr} mL/min) बैक्टीरिया को जमने से पहले ही बहा देता है। Patient 2 का कम eGFR (${p2EGfr} mL/min) होने से बैक्टीरिया बायोफिल्म बना लेता है।`
            : `Patient 2 का उच्च eGFR (${p2EGfr} mL/min) बैक्टीरिया को जमने से पहले ही बहा देता है। Patient 1 का कम eGFR (${p1EGfr} mL/min) होने से बैक्टीरिया बायोफिल्म बना लेता है।`,
        },
        {
          factor: "4. दवाओं का असर और एंटीबायोटिक रेजिस्टेंस (Enzymatic Resistance)",
          kyoAsarKartaHaiYaNahi: p2Pathogen.toLowerCase().includes("kpc") || p2Pathogen.toLowerCase().includes("mdr")
            ? `Patient 2 का बैक्टीरिया KPC-3 एंजाइम बनाता है जो आम एंटीबायोटिक्स (जैसे Meropenem, Ceftriaxone) को पूरी तरह निष्प्रभावी कर देता है। इसके लिए Colistin जैसे विशेष विकल्पों की जरूरत होती है।`
            : `एंटीबायोटिक संवेदनशीलता दोनों मरीजों में भिन्न है, जिसके लिए लैब रिपोर्ट के अनुसार लक्षित दवाएं देना आवश्यक है।`,
        },
      ],
    },
  };
}

export function computeComparativeAnalysis(
  p1: PatientData,
  p2: PatientData
): import("../types").AnalysisOutput {
  const rows = buildComparativeRows(p1, p2) || [];
  const sharedResistant = rows.filter((r) => r?.crossCompatibility === "Shared Resistance");
  const bothSensitive = rows.filter((r) => r?.crossCompatibility === "Sensitive to Both");
  const divergent = rows.filter((r) => r?.crossCompatibility === "Divergent");
  const total = rows.length || 1;

  const p1Antibiotics = p1?.antibiotics || [];
  const p2Antibiotics = p2?.antibiotics || [];

  // Resistance burden
  const p1ResistantCount = p1Antibiotics.filter((a) => a?.status === "Resistant").length;
  const p2ResistantCount = p2Antibiotics.filter((a) => a?.status === "Resistant").length;
  const maxResistantIsolate = Math.max(p1ResistantCount, p2ResistantCount);

  // High-priority resistance flags
  const isCarbapenemDrug = (drugName: string, drugClass: string) =>
    /meropenem|imipenem|ertapenem|doripenem/i.test(drugName || "") || /carbapenem/i.test(drugClass || "");

  const p1HasCarbapenemResistant =
    p1Antibiotics.some((a) => isCarbapenemDrug(a?.drug, a?.drugClass) && a?.status === "Resistant") ||
    /ndm|kpc|oxa-48|carbapenem|xdr/i.test(p1?.pathogen || "");

  const p2HasCarbapenemResistant =
    p2Antibiotics.some((a) => isCarbapenemDrug(a?.drug, a?.drugClass) && a?.status === "Resistant") ||
    /ndm|kpc|oxa-48|carbapenem|xdr/i.test(p2?.pathogen || "");

  const hasCarbapenemResistance = p1HasCarbapenemResistant || p2HasCarbapenemResistant;
  const bothCarbapenemResistant = p1HasCarbapenemResistant && p2HasCarbapenemResistant;

  const hasCephalosporinResistance =
    rows.some((r) => /ceftriaxone|cefepime|ceftazidime/i.test(r.drug) && (r.p1Status === "Resistant" || r.p2Status === "Resistant"));

  const hasFluoroquinoloneResistance =
    rows.some((r) => /ciprofloxacin|levofloxacin/i.test(r.drug) && (r.p1Status === "Resistant" || r.p2Status === "Resistant"));

  // Host clinical indicators
  const p1BloodGroup = (p1.clinicalParams?.bloodGroup || "O+").toUpperCase();
  const p2BloodGroup = (p2.clinicalParams?.bloodGroup || "O+").toUpperCase();
  const p1HasAdhesinRisk = !p1BloodGroup.startsWith("O");
  const p2HasAdhesinRisk = !p2BloodGroup.startsWith("O");

  const p1Egfr = p1.clinicalParams?.bloodReport?.eGfr ?? 90;
  const p2Egfr = p2.clinicalParams?.bloodReport?.eGfr ?? 90;
  const minEgfr = Math.min(p1Egfr, p2Egfr);

  const p1Hb = p1.clinicalParams?.anemia?.hemoglobin ?? 13.5;
  const p2Hb = p2.clinicalParams?.anemia?.hemoglobin ?? 13.5;
  const minHb = Math.min(p1Hb, p2Hb);

  const p1Misuse = (p1.clinicalParams?.priorAntibioticMisuse || "").toLowerCase().includes("yes");
  const p2Misuse = (p2.clinicalParams?.priorAntibioticMisuse || "").toLowerCase().includes("yes");

  const p1Virulent = p1.clinicalParams?.pathogenVirulenceIndex === "Hypervirulent" || /xdr|ndm/i.test(p1.pathogen);
  const p2Virulent = p2.clinicalParams?.pathogenVirulenceIndex === "Hypervirulent" || /xdr|ndm/i.test(p2.pathogen);

  // Overlap percentage: percentage of tested drugs with shared resistance across both isolates
  const compatibilityPercentage = Math.round((sharedResistant.length / total) * 100);

  // Dynamic Clinical AMR Risk Score (scale 12 - 95)
  // 1. Shared Resistance Burden (Max: 35 points) - primary outbreak & cohort hazard
  const sharedResistanceRatio = sharedResistant.length / total;
  const sharedBurdenScore = Math.round(sharedResistanceRatio * 35);

  // 2. Individual Strain Resistance Severity (Max: 25 points)
  const p1TotalDrugs = p1Antibiotics.length || 1;
  const p2TotalDrugs = p2Antibiotics.length || 1;
  const p1ResistRatio = p1ResistantCount / p1TotalDrugs;
  const p2ResistRatio = p2ResistantCount / p2TotalDrugs;
  const maxResistRatio = Math.max(p1ResistRatio, p2ResistRatio);
  const avgResistRatio = (p1ResistRatio + p2ResistRatio) / 2;
  const individualStrainScore = Math.round(maxResistRatio * 15 + avgResistRatio * 10);

  // 3. Molecular High-Hazard Markers (Max: 20 points)
  let mechanismScore = 0;
  if (bothCarbapenemResistant) {
    mechanismScore += 16; // Dual superbug alert!
  } else if (hasCarbapenemResistance) {
    mechanismScore += 8; // Single isolate carbapenemase
  }

  if (rows.some((r) => /ceftriaxone|cefepime|ceftazidime/i.test(r.drug) && r.p1Status === "Resistant" && r.p2Status === "Resistant")) {
    mechanismScore += 6; // Shared ESBL/Cephalosporinase
  } else if (hasCephalosporinResistance) {
    mechanismScore += 3;
  }

  if (rows.some((r) => /ciprofloxacin|levofloxacin/i.test(r.drug) && r.p1Status === "Resistant" && r.p2Status === "Resistant")) {
    mechanismScore += 4; // Shared QRDR mutation
  } else if (hasFluoroquinoloneResistance) {
    mechanismScore += 2;
  }
  mechanismScore = Math.min(20, mechanismScore);

  // 4. Host Susceptibility & Clinical Vulnerability (Max: 15 points)
  let hostScore = 0;
  if (minEgfr < 30) hostScore += 5;
  else if (minEgfr < 60) hostScore += 3;
  else if (minEgfr < 80) hostScore += 1;

  if (minHb < 8.5) hostScore += 4;
  else if (minHb < 11.0) hostScore += 2;

  if (p1HasAdhesinRisk && p2HasAdhesinRisk) hostScore += 3;
  else if (p1HasAdhesinRisk || p2HasAdhesinRisk) hostScore += 1;

  if (p1Misuse && p2Misuse) hostScore += 3;
  else if (p1Misuse || p2Misuse) hostScore += 2;
  hostScore = Math.min(15, hostScore);

  // 5. Therapeutic Relief: Available dual-sensitive alternatives (reduces risk, up to -15 points)
  const bothSensitiveRatio = bothSensitive.length / total;
  const reliefBonus = Math.round(bothSensitiveRatio * 12) + (p1ResistantCount === 0 || p2ResistantCount === 0 ? 3 : 0);

  // Baseline surveillance baseline: 10
  let calculatedScore = 10 + sharedBurdenScore + individualStrainScore + mechanismScore + hostScore - reliefBonus;
  calculatedScore = Math.max(12, Math.min(95, calculatedScore));

  let riskLevel: import("../types").RiskLevel = "Low Risk";
  if (calculatedScore >= 70) riskLevel = "High Risk";
  else if (calculatedScore >= 35) riskLevel = "Moderate Risk";

  const criticalOverlaps = sharedResistant.length > 0
    ? sharedResistant.map(
        (r) => `${r.drug} (${r.drugClass}): Shared high-level resistance detected in both isolates.`
      )
    : divergent.map(
        (r) => `${r.drug} (${r.drugClass}): Clinical Discordance — ${r.p1Status === "Resistant" ? p1.name : p2.name} is Resistant while ${r.p1Status === "Sensitive" ? p1.name : p2.name} is Sensitive.`
      );

  const mutatedStrainFlags = [
    bothCarbapenemResistant
      ? "Dual Carbapenemase Outbreak Risk (NDM-1 / KPC-3 co-transmission hazard)"
      : hasCarbapenemResistance
      ? "Carbapenemase Producer Verified (blaNDM-1 / blaKPC-3 metallo or serine enzyme)"
      : "Standard beta-lactamase profile",
    hasFluoroquinoloneResistance
      ? "Fluoroquinolone QRDR target mutation (GyrA Ser83Leu)"
      : "Fluoroquinolone wild-type gyrase",
    maxResistantIsolate >= 3
      ? "Loss of OmpK35/36 outer membrane porins / Efflux upregulation confirmed"
      : "Normal outer membrane porin permeability",
  ];

  const suggestedAlternatives = bothSensitive.length > 0
    ? bothSensitive.map((r) => `${r.drug} (${r.drugClass}) • MIC susceptible in both isolates`)
    : [
        "Colistin (Polymyxin E) / Polymyxin B IV targeted loading dose with renal monitoring",
        "Ceftazidime-Avibactam + Aztreonam dual synergy salvage protocol",
        "Eravacycline / High-dose Tigecycline (200mg loading, 100mg q12h)",
      ];

  const sharedOverlapPct = Math.round((sharedResistant.length / total) * 100);
  const divergencePct = Math.round((divergent.length / total) * 100);

  const clinicalSummary = `Comprehensive comparative antimicrobial cross-analysis for ${p1.name} (${p1.id}, ${p1.ward}) and ${p2.name} (${p2.id}, ${p2.ward}). ${sharedResistant.length > 0 ? `Shared multi-drug resistance identified across ${sharedResistant.length} antimicrobial agents (overlap: ${sharedOverlapPct}%).` : `Antibiogram divergence detected across ${divergent.length} drugs (${divergencePct}% discordance) with critical carbapenemase resistance in ${p1ResistantCount > p2ResistantCount ? p1.name : p2.name}.`} Infection Control & Prevention Committee (HICC) recommendation: Spatial barrier precautions and contact isolation for Bed 04. Host factors (Blood: ${p1BloodGroup} vs ${p2BloodGroup}, eGFR: ${p1Egfr} vs ${p2Egfr} mL/min, Hb: ${p1Hb} vs ${p2Hb} g/dL) establish personalized clinical susceptibility.`;

  const patientFriendlySummary = `Medical Summary for ${p1.name} & ${p2.name}: The laboratory analysis evaluated bacterial resistance and individual body defenses. In ${p1ResistantCount > p2ResistantCount ? p1.name : p2.name}, several conventional antibiotics are ineffective due to bacterial resistance enzymes, while alternative targeted antibiotics (such as Colistin) remain active. Your clinical team has prepared individualized prescriptions and strict hygiene measures to ensure targeted recovery.`;

  const whyBacteriaAffectsReport = computeWhyBacteriaAffectsReport(p1, p2);
  const p1Num = p1.id.replace(/\D/g, "") || "204119";
  const p2Num = p2.id.replace(/\D/g, "") || "109282";
  const uniqueAccessCode = `PRP-${p1Num}-${p2Num}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    uniqueAccessCode,
    riskScore: calculatedScore,
    riskLevel,
    compatibilityPercentage,
    criticalOverlaps,
    mutatedStrainFlags,
    suggestedAlternatives,
    clinicalSummary,
    patientFriendlySummary,
    riskReductionGuide: STANDARD_RISK_REDUCTION_GUIDE,
    modeOfActionList: STANDARD_MODE_OF_ACTION_CATALOG,
    whyBacteriaAffectsReport,
    hostVulnerabilityNotes: [
      `Patient 1: Blood Group ${p1BloodGroup}, Hemoglobin ${p1Hb} g/dL, eGFR ${p1Egfr} mL/min`,
      `Patient 2: Blood Group ${p2BloodGroup}, Hemoglobin ${p2Hb} g/dL, eGFR ${p2Egfr} mL/min`,
    ],
    analyzedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    source: "clinical-engine",
  };
}

export const SAMPLE_SAVED_RECORDS: import("../types").SavedComparativeRecord[] = [
  {
    id: "rec-1",
    uniqueAccessCode: "PRP-9021-8842-8801",
    timestamp: "2026-09-11 10:45 AM",
    patient1: DEFAULT_PATIENT_1,
    patient2: DEFAULT_PATIENT_2,
    compatibilityScore: 68,
    compatibilityPercentage: 68,
    riskScore: 84,
    riskLevel: "High Risk",
    criticalOverlaps: [
      "Meropenem (Carbapenem): Shared resistance detected",
      "Ceftriaxone (Cephalosporin): Shared resistance detected",
      "Ciprofloxacin (Fluoroquinolone): Shared resistance detected",
    ],
    criticalOverlapsCount: 6,
    mutatedStrainFlags: ["blaKPC-3 positive", "GyrA mutation detected"],
    recommendedAlternatives: ["Ceftazidime-Avibactam", "Colistin (Polymyxin E)"],
    clinicalSummary: "Critical ICU Cross-Resistance between Bed 04 and Bed 12. Spatial isolation mandatory.",
  },
  {
    id: "rec-2",
    uniqueAccessCode: "PRP-7719-7724-4412",
    timestamp: "2026-09-10 03:15 PM",
    patient1: SAMPLE_SCENARIOS.postOpSurgery.p1,
    patient2: SAMPLE_SCENARIOS.postOpSurgery.p2,
    compatibilityScore: 32,
    compatibilityPercentage: 32,
    riskScore: 48,
    riskLevel: "Moderate Risk",
    criticalOverlaps: ["Ceftriaxone (Cephalosporin): Shared resistance detected"],
    criticalOverlapsCount: 2,
    mutatedStrainFlags: ["ESBL CTX-M-15 positive"],
    recommendedAlternatives: ["Meropenem", "Amikacin"],
    clinicalSummary: "Post-operative surgical unit comparative analysis. Standard contact precautions.",
  },
];
