import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Radio,
  Zap,
} from "lucide-react";

interface RadarBlip {
  id: string;
  label: string;
  type: "resistant" | "sensitive" | "intermediate";
  angle: number; // in degrees
  distance: number; // 0 to 100% from center
  details: string;
}

interface PharmaShieldRadarScannerProps {
  onScanClick?: () => void;
  riskLevel?: string;
  riskScore?: number;
}

export const PharmaShieldRadarScanner: React.FC<PharmaShieldRadarScannerProps> = ({
  onScanClick,
  riskLevel = "High Risk",
  riskScore = 84,
}) => {
  const [isPinging, setIsPinging] = useState(false);
  const [selectedBlip, setSelectedBlip] = useState<RadarBlip | null>(null);
  const [scanSpeed, setScanSpeed] = useState<"normal" | "boost">("normal");

  const blips: RadarBlip[] = [
    {
      id: "blip-1",
      label: "Meropenem 10ug",
      type: "resistant",
      angle: 45,
      distance: 68,
      details: "MIC >16 mg/L • blaKPC-3 positive • Pan-Carbapenem invalidation",
    },
    {
      id: "blip-2",
      label: "Ciprofloxacin 5ug",
      type: "resistant",
      angle: 215,
      distance: 75,
      details: "GyrA Ser83Leu mutation • High-level fluoroquinolone resistance",
    },
    {
      id: "blip-3",
      label: "Ceftazidime-Avibactam",
      type: "sensitive",
      angle: 310,
      distance: 52,
      details: "MIC 2.0 mg/L • Retained sensitivity in both cohort isolates",
    },
    {
      id: "blip-4",
      label: "Colistin 10ug",
      type: "sensitive",
      angle: 140,
      distance: 82,
      details: "Membrane active • Reserve salvage agent",
    },
  ];

  const pingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pingTimeoutRef.current) {
        clearTimeout(pingTimeoutRef.current);
      }
    };
  }, []);

  const handleTriggerPing = () => {
    if (pingTimeoutRef.current) {
      clearTimeout(pingTimeoutRef.current);
    }
    setIsPinging(true);
    setScanSpeed("boost");
    pingTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsPinging(false);
        setScanSpeed("normal");
      }
    }, 2500);
  };

  return (
    <div
      id="pharma-shield-radar-scanner-card"
      className="relative rounded-3xl bg-[#080E1C] border border-teal-500/30 p-5 sm:p-6 shadow-[0_0_35px_rgba(13,148,136,0.18)] overflow-hidden transition-all select-none text-white font-sans"
    >
      {/* Background Soft Glow Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.14)_0%,transparent_70%)] pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between relative z-10 border-b border-teal-500/15 pb-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
            PHARMA SHIELD
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-semibold text-slate-300 tracking-wider">
            SCAN 01
          </span>
        </div>
      </div>

      {/* Top Left Status Badge */}
      <div className="mt-3 flex items-center justify-between relative z-10">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-teal-500/30 text-[10px] font-mono font-semibold tracking-wider text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-400 font-normal uppercase leading-tight">DATABASE</span>
            <span className="text-teal-300 font-bold leading-tight">READY</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-400">
          <Radio className="w-3.5 h-3.5 text-teal-400" />
          <span>EUCAST AST v14.0</span>
        </div>
      </div>

      {/* Main Radar Screen Arena */}
      <div
        className="relative my-4 aspect-square max-w-[320px] mx-auto flex items-center justify-center cursor-pointer group"
        onClick={handleTriggerPing}
        title="Click to trigger high-frequency radar pulse"
      >
        {/* Radar Concentric Rings */}
        <div className="absolute inset-0 rounded-full border border-teal-500/20 bg-teal-950/20" />
        <div className="absolute inset-[15%] rounded-full border border-teal-500/25 border-dashed" />
        <div className="absolute inset-[32%] rounded-full border border-teal-500/30" />
        <div className="absolute inset-[52%] rounded-full border border-teal-500/35" />

        {/* Radar Crosshairs */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-px h-[1px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-px w-[1px] bg-gradient-to-b from-transparent via-teal-500/30 to-transparent" />

        {/* Rotating Radar Sweep Cone / Beam */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-all"
          style={{
            animation: scanSpeed === "boost" ? "radar-sweep 1.2s linear infinite" : "radar-sweep 3.5s linear infinite",
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, rgba(20,184,166,0.08) 300deg, rgba(20,184,166,0.45) 360deg)",
          }}
        >
          <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-teal-300 via-cyan-400 to-white shadow-[0_0_10px_#2dd4bf,0_0_20px_#22d3ee] origin-left -translate-y-1/2" />
        </div>

        {/* Animated Radar Pulse Ping Wave */}
        {(isPinging || scanSpeed === "boost") && (
          <div
            className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none"
            style={{ animation: "radar-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite" }}
          />
        )}

        {/* Centerpiece: Shield Contour with Medical Plus (+) */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative w-24 h-28 flex items-center justify-center">
            <svg
              className="absolute inset-0 w-full h-full drop-shadow-[0_0_12px_rgba(20,184,166,0.8)]"
              viewBox="0 0 100 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 8L86 24V56C86 82 50 110 50 110C50 110 14 82 14 56V24L50 8Z"
                stroke="#2DD4BF"
                strokeWidth="2.5"
                fill="#0A1828"
                fillOpacity="0.85"
              />
              <path
                d="M50 16L80 30V56C80 77 50 100 50 100C50 100 20 77 20 56V30L50 16Z"
                stroke="#14B8A6"
                strokeWidth="1"
                strokeOpacity="0.4"
                fill="none"
              />
            </svg>
            <div className="relative z-20 flex items-center justify-center">
              <span className="text-3xl sm:text-4xl font-light text-white font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] leading-none select-none">
                +
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Detected Blips plotted around the radar */}
        {blips.map((blip) => {
          const rad = (blip.angle * Math.PI) / 180;
          const radiusPct = (blip.distance / 100) * 44;
          const leftPct = 50 + radiusPct * Math.cos(rad);
          const topPct = 50 + radiusPct * Math.sin(rad);
          const isResistant = blip.type === "resistant";
          const dotColor = isResistant ? "bg-rose-500" : "bg-emerald-400";
          const pingColor = isResistant ? "border-rose-500" : "border-emerald-400";

          return (
            <div
              key={blip.id}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBlip(blip);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer p-1 group/blip"
              title={`${blip.label}: Click for details`}
            >
              <div className="relative flex items-center justify-center">
                <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-[0_0_8px_currentColor]`} />
                <span
                  className={`absolute -inset-1 rounded-full border ${pingColor} animate-ping opacity-75`}
                />
              </div>
              {/* Mini Label */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 hidden group-hover/blip:block whitespace-nowrap bg-slate-900/95 border border-teal-500/40 px-2 py-1 rounded text-[10px] font-mono text-slate-200 z-30 shadow-lg">
                <span className={isResistant ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                  {blip.label}
                </span>
                <span className="block text-[9px] text-slate-400">{blip.type.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Blip Detail Card if clicked */}
      {selectedBlip && (
        <div className="mb-3 p-2.5 rounded-xl bg-slate-900/90 border border-teal-500/40 text-xs animate-in fade-in duration-200 relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span
              className={`font-bold font-mono text-[11px] ${
                selectedBlip.type === "resistant" ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {selectedBlip.label}
            </span>
            <button
              onClick={() => setSelectedBlip(null)}
              className="text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-[10px] text-slate-300 leading-tight">{selectedBlip.details}</p>
        </div>
      )}

      {/* Status Active Badge */}
      <div className="flex items-center justify-between pt-1 relative z-10">
        <div className="text-[10px] font-mono text-slate-400">
          <span className="text-teal-400 font-semibold">{blips.length} AST Targets</span> Mapped
        </div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-teal-500/30 text-[10px] font-mono font-semibold tracking-wider text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex flex-col text-right">
            <span className="text-[8px] text-slate-400 font-normal uppercase leading-tight">STATUS</span>
            <span className="text-emerald-400 font-bold leading-tight">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Browser lookup / Secure UI */}
      <div className="mt-3 pt-3 border-t border-teal-500/15 flex items-center justify-between text-[11px] font-mono text-slate-400 relative z-10">
        <div className="flex items-center space-x-1.5 text-teal-400/90">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          <span>Browser lookup</span>
        </div>
        <div className="text-slate-400">
          Secure UI
        </div>
      </div>

      {/* Interactive Quick Scan Action Buttons */}
      <div className="mt-4 space-y-2 relative z-10">
        {onScanClick && (
          <button
            type="button"
            id="radar-launch-scan-btn"
            onClick={onScanClick}
            aria-label="Launch Comparative AST Scan"
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-teal-500/25 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Launch Comparative AST Scan</span>
          </button>
        )}
        <button
          id="radar-boost-pulse-btn"
          type="button"
          onClick={handleTriggerPing}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-teal-300 hover:text-white font-mono text-[11px] border border-teal-500/30 transition-colors cursor-pointer"
        >
          <Radio className="w-3 h-3 text-cyan-400 animate-spin" />
          <span>{scanSpeed === "boost" ? "Scanning Boost Active (1.2s)" : "Trigger Radar Pulse / Test Scanner"}</span>
        </button>
      </div>
    </div>
  );
};
