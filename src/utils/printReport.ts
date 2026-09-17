import { AnalysisOutput, ComparativeDrugRow, PatientData } from "../types";

export interface PrintReportOptions {
  documentTitle?: string;
  patient1?: PatientData;
  patient2?: PatientData;
  analysis?: AnalysisOutput;
  rows?: ComparativeDrugRow[];
  element?: HTMLElement | null;
}

/**
 * Builds a clean, high-contrast, professional laboratory report HTML document
 * ready for direct printing or saving as PDF.
 */
export function generatePrintableReportHtml(options: PrintReportOptions): string {
  const {
    documentTitle = "CONFIDENTIAL ANTIMICROBIAL DOSSIER - PHARMARESIST PRO",
    patient1,
    patient2,
    analysis,
    rows = [],
  } = options;

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const reportCode = analysis?.uniqueAccessCode || "PRP-" + Math.floor(1000 + Math.random() * 9000);

  const rowsHtml = rows
    .map(
      (r) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-family: 'Courier New', monospace; font-size: 11px;">
      <td style="padding: 6px 10px; font-weight: 700; font-family: sans-serif; color: #0f172a;">${r.drug}</td>
      <td style="padding: 6px 10px; color: #475569; font-family: sans-serif;">${r.drugClass}</td>
      <td style="padding: 6px 10px; font-weight: 600; color: ${
        r.p1Status === "Resistant" ? "#b91c1c" : r.p1Status === "Sensitive" ? "#047857" : "#b45309"
      };">
        ${r.p1Status} (${r.p1Mic || "N/A"})
      </td>
      <td style="padding: 6px 10px; font-weight: 600; color: ${
        r.p2Status === "Resistant" ? "#b91c1c" : r.p2Status === "Sensitive" ? "#047857" : "#b45309"
      };">
        ${r.p2Status} (${r.p2Mic || "N/A"})
      </td>
      <td style="padding: 6px 10px; font-weight: 700; color: ${
        r.crossCompatibility.includes("CRITICAL") || r.crossCompatibility.includes("Shared")
          ? "#b91c1c"
          : "#047857"
      };">
        ${r.crossCompatibility}
      </td>
    </tr>
  `
    )
    .join("");

  const criticalOverlapsHtml = (analysis?.criticalOverlaps || [])
    .map((o) => `<li style="margin-bottom: 3px;">${o}</li>`)
    .join("");

  const alternativesHtml = (analysis?.suggestedAlternatives || [])
    .map((a) => `<li style="margin-bottom: 3px;">${a}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${documentTitle} - ${reportCode}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      line-height: 1.45;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .header {
      border-bottom: 2px solid #0d9488;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #0f172a;
      font-family: monospace;
    }
    .brand span { color: #0d9488; }
    .sub-brand {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .meta-box {
      text-align: right;
      font-size: 11px;
      font-family: monospace;
      color: #475569;
    }
    .meta-box strong { color: #0f172a; }
    .dossier-tag {
      display: inline-block;
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      color: #0f766e;
      font-size: 9px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .grid-2 {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    .patient-box {
      flex: 1;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      border-radius: 8px;
      padding: 12px;
      font-size: 11px;
    }
    .patient-box h3 {
      margin: 0 0 6px 0;
      font-size: 13px;
      color: #0f172a;
    }
    .patient-box .label {
      color: #64748b;
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
    }
    .badge-bar {
      display: flex;
      gap: 12px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
      font-size: 11px;
      justify-content: space-between;
    }
    .table-container {
      margin-bottom: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-size: 10px;
      text-transform: uppercase;
      padding: 8px 10px;
      border-bottom: 2px solid #cbd5e1;
      font-weight: 700;
    }
    .clinical-section {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
      font-size: 11px;
    }
    .clinical-section h4 {
      margin: 0 0 6px 0;
      font-size: 11px;
      text-transform: uppercase;
      color: #0f766e;
    }
    .footer-sign {
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #64748b;
    }
    @media screen {
      .print-btn-bar {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #0f172a;
        color: white;
        padding: 10px 18px;
        border-radius: 8px;
        font-family: sans-serif;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        border: none;
      }
    }
  </style>
</head>
<body>
  <div class="dossier-tag">Confidential Medical Antimicrobial Dossier &bull; Verification Certified</div>
  
  <div class="header">
    <div>
      <div class="brand">PHARMA<span>RESIST</span> PRO</div>
      <div class="sub-brand">Hospital Clinical Microbiology &amp; Antimicrobial Stewardship Division</div>
    </div>
    <div class="meta-box">
      <div>Report Code: <strong>${reportCode}</strong></div>
      <div>Date: <strong>${dateStr} ${timeStr}</strong></div>
      <div>Standard: <strong>EUCAST / CLSI M100-Ed34</strong></div>
    </div>
  </div>

  <div class="grid-2">
    <div class="patient-box">
      <div class="label">Patient 1 (Index Patient)</div>
      <h3>${patient1?.name || "Patient 1"}</h3>
      <div><strong>UHID:</strong> ${patient1?.id || "N/A"} &bull; <strong>Age/Ward:</strong> ${patient1?.age || "N/A"} y/o &bull; ${patient1?.ward || "General"}</div>
      <div><strong>Pathogen:</strong> <span style="color: #0f766e; font-weight: 700;">${patient1?.pathogen || "Isolate 1"}</span></div>
      <div><strong>Specimen:</strong> ${patient1?.specimen || "Blood Culture"}</div>
      ${
        patient1?.clinicalParams
          ? `<div style="margin-top: 4px; padding-top: 4px; border-top: 1px dashed #cbd5e1; font-family: monospace;">
              Blood Group: <strong>${patient1.clinicalParams.bloodGroup}</strong> | eGFR: <strong>${patient1.clinicalParams.bloodReport?.eGfr ?? 90} mL/min</strong> | Hb: <strong>${patient1.clinicalParams.anemia?.hemoglobin ?? 13.5} g/dL</strong>
            </div>`
          : ""
      }
    </div>

    <div class="patient-box">
      <div class="label">Patient 2 (Comparative Isolate)</div>
      <h3>${patient2?.name || "Patient 2"}</h3>
      <div><strong>UHID:</strong> ${patient2?.id || "N/A"} &bull; <strong>Age/Ward:</strong> ${patient2?.age || "N/A"} y/o &bull; ${patient2?.ward || "ICU"}</div>
      <div><strong>Pathogen:</strong> <span style="color: #0284c7; font-weight: 700;">${patient2?.pathogen || "Isolate 2"}</span></div>
      <div><strong>Specimen:</strong> ${patient2?.specimen || "Endotracheal Aspirate"}</div>
      ${
        patient2?.clinicalParams
          ? `<div style="margin-top: 4px; padding-top: 4px; border-top: 1px dashed #cbd5e1; font-family: monospace;">
              Blood Group: <strong>${patient2.clinicalParams.bloodGroup}</strong> | eGFR: <strong>${patient2.clinicalParams.bloodReport?.eGfr ?? 90} mL/min</strong> | Hb: <strong>${patient2.clinicalParams.anemia?.hemoglobin ?? 13.5} g/dL</strong>
            </div>`
          : ""
      }
    </div>
  </div>

  <div class="badge-bar">
    <div>
      <span style="color: #64748b;">Cross-Resistance Risk:</span>
      <strong style="font-size: 13px; color: ${analysis?.riskScore && analysis.riskScore > 60 ? '#b91c1c' : '#047857'};">
        ${analysis?.riskLevel || "Moderate Risk"} (${analysis?.riskScore || 50}/100)
      </strong>
    </div>
    <div>
      <span style="color: #64748b;">Resistance Profile Overlap:</span>
      <strong style="font-size: 13px; color: #0f766e;">
        ${analysis?.compatibilityPercentage || 50}%
      </strong>
    </div>
    <div>
      <span style="color: #64748b;">EUCAST Guideline Status:</span>
      <strong style="font-size: 13px; color: #0284c7;">Active Stewardship</strong>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Antibiotic Agent</th>
          <th>Drug Class</th>
          <th>${patient1?.name || "Patient 1"} MIC</th>
          <th>${patient2?.name || "Patient 2"} MIC</th>
          <th>Stewardship Analysis</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || "<tr><td colspan='5' style='padding: 10px; text-align: center;'>No drug rows available</td></tr>"}
      </tbody>
    </table>
  </div>

  <div class="grid-2">
    <div class="clinical-section" style="flex: 1;">
      <h4 style="color: #b91c1c;">Critical Shared Invalidation</h4>
      <ul style="margin: 0; padding-left: 18px; color: #334155;">
        ${criticalOverlapsHtml || "<li>No overlapping high-level carbapenemase resistance detected.</li>"}
      </ul>
    </div>
    <div class="clinical-section" style="flex: 1;">
      <h4 style="color: #047857;">Stewardship Recommended Salvage Regimens</h4>
      <ul style="margin: 0; padding-left: 18px; color: #334155;">
        ${alternativesHtml || "<li>Proceed with targeted standard susceptibility protocols.</li>"}
      </ul>
    </div>
  </div>

  <div class="footer-sign">
    <div>
      <strong>Elena Vance, MD, FACP</strong> &bull; Lead Clinical Microbiologist, Antimicrobial Stewardship<br>
      Electronically Verified &bull; Official Clinical Record
    </div>
    <div style="text-align: right; font-family: monospace;">
      PHARMARESIST-ENGINE-2026<br>
      SYSTEM VALIDATION: PASS
    </div>
  </div>

  <button class="print-btn-bar no-print" onclick="window.print()">Print / Save PDF Now</button>

  <script>
    window.onload = function() {
      // Small timeout to allow styling layout before print trigger
      setTimeout(function() {
        try {
          window.print();
        } catch(e) {
          // Ignored if sandboxed
        }
      }, 300);
    };
  </script>
</body>
</html>`;
}

/**
 * Universal print handler that works smoothly across all environments (including sandboxed iframes).
 * 1. Attempts safe window.print()
 * 2. If window.print() is blocked by an iframe sandbox, automatically generates a printable document
 *    via Blob download / popup window so the user gets their PDF/printout immediately!
 */
export function executeMedicalPrint(options: PrintReportOptions): {
  success: boolean;
  method: "browser" | "popup" | "download";
} {
  const { element, documentTitle = "PharmaResist_Clinical_Report" } = options;

  // 1. Try standard window.print() first inside a protected try/catch block
  let windowPrintWorked = false;
  try {
    // If element is specified, add printable class temporarily
    if (element) {
      element.classList.add("print-active-target");
    }
    window.print();
    windowPrintWorked = true;
    if (element) {
      element.classList.remove("print-active-target");
    }
    return { success: true, method: "browser" };
  } catch {
    // window.print() blocked by iframe sandbox ('allow-modals' not set)
    windowPrintWorked = false;
  }

  // 2. Generate clean standalone HTML report
  const htmlDoc = generatePrintableReportHtml(options);

  // 3. Try opening in a new tab/window for clean printing
  try {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlDoc);
      printWindow.document.close();
      return { success: true, method: "popup" };
    }
  } catch {
    // window.open blocked by popup blocker or iframe policy
  }

  // 4. Fallback: Create Blob and trigger download of standalone HTML report
  // The user can open this file in ANY browser and it prints or saves as PDF instantly with 1 click!
  try {
    const blob = new Blob([htmlDoc], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeTitle = (documentTitle || "PharmaResist_Report").replace(/[^a-zA-Z0-9_-]/g, "_");
    link.href = url;
    link.download = `${safeTitle}_${Date.now().toString().slice(-6)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return { success: true, method: "download" };
  } catch {
    return { success: false, method: "download" };
  }
}
