import React from "react";
import { LabAnalyticsView } from "../components/LabAnalyticsView";
import { FileSpreadsheet, GitCompare, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>EPIDEMIOLOGICAL SURVEILLANCE &bull; HOSPITAL ANTIBIOGRAM</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            AMR Resistance Surveillance &amp; Antibiogram Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Cumulative statistical distribution of bacterial isolates, multidrug resistance percentages, and empirical therapy guidelines.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate("/scanner")}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <GitCompare className="w-4 h-4" />
            <span>Dual Scanner &rarr;</span>
          </button>
        </div>
      </div>

      {/* Lab Analytics Component */}
      <LabAnalyticsView
        onNavigateToScanner={() => navigate("/scanner")}
        onNavigateToRecords={() => navigate("/records")}
      />
    </div>
  );
};
