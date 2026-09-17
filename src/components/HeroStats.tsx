import React from "react";
import {
  FileText,
  AlertTriangle,
  Biohazard,
  CheckCircle,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { QUICK_STATS } from "../data/mockData";

interface HeroStatsProps {
  onLaunchScanner?: () => void;
  onViewAnalytics?: () => void;
}

export const HeroStats: React.FC<HeroStatsProps> = ({
  onLaunchScanner = () => {},
  onViewAnalytics = () => {},
}) => {
  const metricCards = [
    {
      id: "stat-total-reports",
      label: "Total Reports Scanned",
      value: QUICK_STATS.totalReportsScanned.toLocaleString(),
      delta: QUICK_STATS.reportsScannedDelta,
      deltaLabel: "vs prior month",
      isPositive: true,
      icon: FileText,
      accentColor: "teal",
      bgGlow: "from-teal-500/10 to-transparent",
      borderColor: "border-teal-500/30 hover:border-teal-500/60",
      iconColor: "text-teal-400",
    },
    {
      id: "stat-critical-alerts",
      label: "Critical Cross-Resistance Alerts",
      value: QUICK_STATS.criticalAlerts.toString(),
      delta: QUICK_STATS.alertsDelta,
      deltaLabel: "ICU & High-Dependency",
      isPositive: false,
      icon: AlertTriangle,
      accentColor: "rose",
      bgGlow: "from-rose-500/10 to-transparent",
      borderColor: "border-rose-500/30 hover:border-rose-500/60",
      iconColor: "text-rose-400",
      highlightPulse: true,
    },
    {
      id: "stat-active-strains",
      label: "Active Strains Monitored",
      value: QUICK_STATS.activeStrainsMonitored.toString(),
      delta: QUICK_STATS.strainsDelta,
      deltaLabel: "WHO Priority Pathogens",
      isPositive: true,
      icon: Biohazard,
      accentColor: "amber",
      bgGlow: "from-amber-500/10 to-transparent",
      borderColor: "border-amber-500/30 hover:border-amber-500/60",
      iconColor: "text-amber-400",
    },
    {
      id: "stat-efficacy-index",
      label: "Efficacy Index",
      value: QUICK_STATS.efficacyIndex,
      delta: QUICK_STATS.efficacyDelta,
      deltaLabel: "optimal AST synergy",
      isPositive: true,
      icon: CheckCircle,
      accentColor: "cyan",
      bgGlow: "from-cyan-500/10 to-transparent",
      borderColor: "border-cyan-500/30 hover:border-cyan-500/60",
      iconColor: "text-cyan-400",
    },
  ];

  return (
    <section className="relative pt-6 pb-8">
      {/* Background Subtle Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-12 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header Banner */}
        <div className="rounded-2xl p-6 sm:p-8 mb-8 border border-slate-200 dark:border-slate-700/80 bg-gradient-to-r from-teal-50/70 via-white to-cyan-50/70 dark:from-slate-900/95 dark:via-slate-900/85 dark:to-[#0B1528]/90 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-500/15 border border-teal-300 dark:border-teal-500/40 text-teal-800 dark:text-teal-300 text-xs font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-300" />
                <span>Next-Gen Antimicrobial Surveillance Platform</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                AI-Powered Drug Resistance &amp; Comparative Analytics
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Rapidly compare phenotypic AST reports between dual patient isolates. Identify shared resistance mutations, evaluate cross-transmission risks, and synthesize AI-validated salvage regimens in real time.
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <button
                type="button"
                id="hero-launch-scanner-button"
                onClick={onLaunchScanner}
                aria-label="Launch Dual AST Scanner"
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-500 dark:to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white dark:text-slate-950 font-semibold text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Launch Dual Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="hero-view-analytics-button"
                onClick={onViewAnalytics}
                aria-label="View Hospital Antibiograms Analytics"
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Hospital Antibiograms</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={card.id}
                className="relative rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-sm dark:shadow-md transition-all duration-200 group"
              >
                {card.highlightPulse && (
                  <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                    {card.label}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
                    {card.value}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center text-xs space-x-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/70">
                  <span
                    className={`font-semibold font-mono flex items-center ${
                      card.isPositive ? "text-teal-600 dark:text-teal-400" : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {card.delta}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 truncate">{card.deltaLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
