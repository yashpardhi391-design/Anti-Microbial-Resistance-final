import React from "react";
import { HostSusceptibilityExplainer } from "../components/HostSusceptibilityExplainer";
import { GraduationCap, ArrowRight, Dna } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HostExplainerPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-teal-600 dark:text-teal-400 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>IMMUNOLOGICAL TERRAIN &bull; HOST DEFENSE MECHANISMS</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Does Bacteria Harm Person 1, But NOT Person 2?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Comprehensive medical analysis explaining why identical bacterial colonizations produce asymptomatic carriage vs septic shock based on host immune terrain.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/scanner")}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2"
        >
          <span>Test in Dual Scanner</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Explainer Component */}
      <HostSusceptibilityExplainer
        onSimulateInScanner={() => navigate("/scanner")}
      />
    </div>
  );
};
