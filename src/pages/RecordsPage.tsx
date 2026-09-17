import React from "react";
import { PatientRecordsView } from "../components/PatientRecordsView";
import { SavedComparativeRecord } from "../types";
import { Database, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface RecordsPageProps {
  savedRecords: SavedComparativeRecord[];
  onDeleteRecord: (id: string) => void;
  onViewRecordModal: (rec: SavedComparativeRecord) => void;
  onOpenCodeLookup: (code?: string) => void;
}

export const RecordsPage: React.FC<RecordsPageProps> = ({
  savedRecords,
  onDeleteRecord,
  onViewRecordModal,
  onOpenCodeLookup,
}) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            <Database className="w-4 h-4" />
            <span>CLINICAL ARCHIVE &bull; LOCAL &amp; CLOUD REPOSITORY</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Patient Comparative Records Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Browse, search, export, and re-evaluate saved dual-patient AST sensitivity assessments and official verification codes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/scanner")}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Comparative Evaluation</span>
        </button>
      </div>

      {/* Patient Records Component */}
      <PatientRecordsView
        records={savedRecords || []}
        savedRecords={savedRecords || []}
        onDeleteRecord={onDeleteRecord}
        onViewRecord={onViewRecordModal}
        onViewRecordModal={onViewRecordModal}
        onOpenCodeLookup={onOpenCodeLookup}
        onNewScan={() => navigate("/scanner")}
        onNavigateToScanner={() => navigate("/scanner")}
      />
    </div>
  );
};
