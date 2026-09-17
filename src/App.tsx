import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Navbar } from "./components/Navbar";
import { SecurityGateBanner } from "./components/SecurityGateBanner";
import { AuthModal } from "./components/AuthModal";
import { CodeLookupModal } from "./components/CodeLookupModal";
import { ReportModal } from "./components/ReportModal";

// Multi-Page Views
import { DashboardPage } from "./pages/DashboardPage";
import { ScannerPage } from "./pages/ScannerPage";
import { HospitalSuitePage } from "./pages/HospitalSuitePage";
import { HostExplainerPage } from "./pages/HostExplainerPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { RecordsPage } from "./pages/RecordsPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { PatientPortalPage } from "./pages/PatientPortalPage";

import {
  SAMPLE_PATIENT_RECORDS,
  SAMPLE_SAVED_RECORDS,
  computeComparativeAnalysis,
  buildComparativeRows,
} from "./data/mockData";
import {
  SavedComparativeRecord,
  ComparativeRecord,
  AnalysisOutput,
  ComparativeDrugRow,
  PatientData,
} from "./types";
import { Shield } from "lucide-react";

export function AppContent() {
  const { user, isAuthenticated } = useAuth();

  const [savedRecords, setSavedRecords] = useState<SavedComparativeRecord[]>(() => {
    try {
      const stored = localStorage.getItem("pharma_resist_records");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return SAMPLE_SAVED_RECORDS;
  });

  const [p1, setP1] = useState<PatientData>(SAMPLE_PATIENT_RECORDS[0]);
  const [p2, setP2] = useState<PatientData>(SAMPLE_PATIENT_RECORDS[1]);

  // Current working comparative analysis for modals and views
  const [currentAnalysisResult, setCurrentAnalysisResult] = useState<{
    analysis: AnalysisOutput;
    rows: ComparativeDrugRow[];
  }>(() => ({
    analysis: computeComparativeAnalysis(SAMPLE_PATIENT_RECORDS[0], SAMPLE_PATIENT_RECORDS[1]),
    rows: buildComparativeRows(SAMPLE_PATIENT_RECORDS[0], SAMPLE_PATIENT_RECORDS[1]),
  }));

  // Modals state
  const [isCodeLookupOpen, setIsCodeLookupOpen] = useState(false);
  const [codeLookupInitialValue, setCodeLookupInitialValue] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeReportData, setActiveReportData] = useState<{
    analysis: AnalysisOutput;
    rows: ComparativeDrugRow[];
    patient1: PatientData;
    patient2: PatientData;
  }>({
    analysis: currentAnalysisResult.analysis,
    rows: currentAnalysisResult.rows,
    patient1: p1,
    patient2: p2,
  });

  // Automatically synchronize comparative analysis whenever p1 or p2 update
  useEffect(() => {
    const analysis = computeComparativeAnalysis(p1, p2);
    const rows = buildComparativeRows(p1, p2);
    setCurrentAnalysisResult({ analysis, rows });
    setActiveReportData({
      analysis,
      rows,
      patient1: p1,
      patient2: p2,
    });
  }, [p1, p2]);

  // Sync saved records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pharma_resist_records", JSON.stringify(savedRecords));
    } catch {
      // ignore
    }
  }, [savedRecords]);

  const handleSaveRecord = (newRec: ComparativeRecord) => {
    setSavedRecords((prev) => [newRec as SavedComparativeRecord, ...(prev || [])]);
  };

  const handleDeleteRecord = (id: string) => {
    setSavedRecords((prev) => (prev || []).filter((r) => r && r.id !== id));
  };

  const handleOpenCodeLookup = (code?: string) => {
    setCodeLookupInitialValue(code || currentAnalysisResult.analysis.uniqueAccessCode || "PRP-9021-8842-8801");
    setIsCodeLookupOpen(true);
  };

  const handleViewRecordModal = (record: SavedComparativeRecord) => {
    const analysis = computeComparativeAnalysis(record.patient1, record.patient2);
    const rows = buildComparativeRows(record.patient1, record.patient2);
    setActiveReportData({
      analysis,
      rows,
      patient1: record.patient1,
      patient2: record.patient2,
    });
    setIsReportModalOpen(true);
  };

  // Dedicated Authentication Gate: When opening the website, show the Login Page first.
  // Only after entering username and password (or clicking demo login) can the user enter the website!
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col justify-center bg-slate-50 dark:bg-[#060B14] text-slate-900 dark:text-slate-100 selection:bg-teal-500 selection:text-white transition-colors duration-200">
        <LoginPage isStandaloneGate={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060B14] text-slate-900 dark:text-slate-100 selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Sticky Top Navigation Bar */}
      <Navbar
        onOpenCodeLookup={() => handleOpenCodeLookup()}
        onOpenCodePortal={() => handleOpenCodeLookup()}
        savedRecordsCount={savedRecords.length}
        recordsCount={savedRecords.length}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full pb-16">
        {/* Hospital Security & RBAC Access Portal Banner (Universal top security clearance) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <SecurityGateBanner />
        </div>

        {/* Multi-Page Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                currentAnalysisResult={currentAnalysisResult}
                p1={p1}
                setP1={setP1}
                p2={p2}
                setP2={setP2}
                onSaveRecord={handleSaveRecord}
                onOpenCodeLookup={handleOpenCodeLookup}
                savedRecordsCount={savedRecords.length}
              />
            }
          />
          <Route
            path="/scanner"
            element={
              <ScannerPage
                currentAnalysisResult={currentAnalysisResult}
                p1={p1}
                setP1={setP1}
                p2={p2}
                setP2={setP2}
                onSaveRecord={handleSaveRecord}
                onOpenCodeLookup={handleOpenCodeLookup}
              />
            }
          />
          <Route
            path="/hospital-suite"
            element={
              <HospitalSuitePage
                currentAnalysisResult={currentAnalysisResult}
                p1={p1}
                p2={p2}
                onOpenCodeLookup={handleOpenCodeLookup}
              />
            }
          />
          <Route path="/host-susceptibility" element={<HostExplainerPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route
            path="/records"
            element={
              <RecordsPage
                savedRecords={savedRecords}
                onDeleteRecord={handleDeleteRecord}
                onViewRecordModal={handleViewRecordModal}
                onOpenCodeLookup={handleOpenCodeLookup}
              />
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/patient-portal" element={<PatientPortalPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Modals */}
      <CodeLookupModal
        isOpen={isCodeLookupOpen}
        onClose={() => setIsCodeLookupOpen(false)}
        savedRecords={savedRecords}
        currentAnalysis={currentAnalysisResult.analysis}
        patient1={p1}
        patient2={p2}
        initialCode={codeLookupInitialValue}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        analysis={activeReportData.analysis}
        rows={activeReportData.rows}
        patient1={activeReportData.patient1}
        patient2={activeReportData.patient2}
      />

      {/* 4-Role Modal (Admin, Doctor, Patient, User/Staff) */}
      <AuthModal />

      {/* Clinical Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Pharma Resist Pro &bull; Multi-Role Clinical Antimicrobial Resistance Surveillance System
            </span>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span>CLSI M100-Ed34 Compliant</span>
            <span>&bull;</span>
            <span>EUCAST AST v14.0</span>
            <span>&bull;</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">Encrypted Audit Logs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
