import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Users,
  AlertTriangle,
  FileCheck2,
  Download,
  Settings,
  Activity,
  CheckCircle2,
  Clock,
  Radio,
  RefreshCw,
  Lock,
  Search,
  Filter,
  Shield,
  ArrowRight,
  Database,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export const AdminPage: React.FC = () => {
  const { user, loginAsAdmin, loginAsDoctor } = useAuth();
  const [guidelineVersion, setGuidelineVersion] = useState<"CLSI-M100" | "EUCAST-v14">("CLSI-M100");
  const [isolationStrictness, setIsolationStrictness] = useState<"standard" | "high" | "critical">("high");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [activeTab, setActiveTab] = useState<"surveillance" | "users" | "settings">("surveillance");

  const [usersList, setUsersList] = useState([
    {
      id: "DOC-8492",
      name: "Dr. Elena Vance, MD",
      role: "doctor",
      dept: "Clinical Microbiology",
      status: "Active",
      lastLogin: "10 mins ago",
      clearance: "Tier 3 (Clinical)",
    },
    {
      id: "STF-4029",
      name: "Pooja Nair, BSc MLT",
      role: "user",
      dept: "Bacteriology Lab Bench",
      status: "Active",
      lastLogin: "2 mins ago",
      clearance: "Tier 2 (Laboratory)",
    },
    {
      id: "PAT-2041",
      name: "Rajesh Sharma",
      role: "patient",
      dept: "ICU Ward B (Bed 14)",
      status: "Verified",
      lastLogin: "1 hour ago",
      clearance: "Tier 1 (Confidential Patient)",
    },
    {
      id: "ADM-8801",
      name: "Dr. Alok Verma",
      role: "admin",
      dept: "Superintendent Directorate",
      status: "Apex Active",
      lastLogin: "Just now",
      clearance: "Tier 4 (Executive Governance)",
    },
  ]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage("");
    }, 4000);
  };

  return (
    <div className="min-h-[85vh] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>EXECUTIVE GOVERNANCE DIRECTORATE &bull; TIER 4 APEX</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hospital AMR Administration Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Centrally govern Antimicrobial Stewardship, ward isolation alerts, role permissions, and ICMR compliance.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => {
              alert("ICMR National AMR Surveillance Audit Dossier generated successfully (PDF / JSON).");
            }}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export ICMR Audit Log</span>
          </button>

          <Link
            to="/"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold transition-all"
          >
            Clinical View &rarr;
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>High Risk AMR Patients</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
            3 Active Wards
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ICU Ward B &bull; High Carbapenemase threat
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Isolation Directives</span>
            <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            Tier-2 Contact Precautions
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Negative Pressure Barrier active
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Active Clinical Sessions</span>
            <Users className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">
            4 Users Online
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            1 Admin &bull; 1 Doctor &bull; 1 Staff &bull; 1 Patient
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Compliance Standard</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {guidelineVersion}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Breakpoint 2026 Edition Verified
          </div>
        </div>
      </div>

      {/* Directorate Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6">
        <button
          type="button"
          onClick={() => setActiveTab("surveillance")}
          className={`pb-3 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "surveillance"
              ? "text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Hospital Surveillance &amp; Directive Broadcasting
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "users"
              ? "text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          User &amp; Role Security Management ({usersList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`pb-3 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "settings"
              ? "text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Clinical Standard &amp; Breakpoint Rules
        </button>
      </div>

      {/* TAB 1: SURVEILLANCE & BROADCAST */}
      {activeTab === "surveillance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Isolation Protocol Enforcement */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Urgent Hospital Cross-Infection Isolation Directive</span>
              </h3>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 mb-5 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <div className="font-bold">
                  ACTIVE ALERT: Klebsiella pneumoniae (NDM-1 / OXA-48 Carbapenemase Positive) in ICU Ward B
                </div>
                <div>
                  Patient Rajesh Sharma (Bed 14) exhibits Colistin-only sensitivity with 86% resistance profile.
                  Cross-ward transmission risk to Patient Anita Desai (General Ward 4) is evaluated as CRITICAL.
                </div>
              </div>

              {/* Isolation strictness buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ward Isolation Protocol Level:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsolationStrictness("standard")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isolationStrictness === "standard"
                        ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    Standard Droplet
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsolationStrictness("high")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isolationStrictness === "high"
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    Contact + Barrier
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsolationStrictness("critical")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isolationStrictness === "critical"
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    Negative Pressure ICU
                  </button>
                </div>
              </div>

              {/* Broadcast Form */}
              <form onSubmit={handleSendBroadcast} className="mt-6 space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Broadcast Direct Electronic Alert to Clinicians &amp; Nursing Staff:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. STRICT GOWN & GLOVE REQUIRED IN ICU B BED 14 - DO NOT TRANSFER LINEN"
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1 shrink-0"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Broadcast</span>
                  </button>
                </div>
                {broadcastSent && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Directive dispatched to 28 nursing monitors and clinical smartphones.</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Quick Security Status */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>System Security &amp; Compliance</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Encryption Level</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">AES-256 Bit</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">HIPAA Compliance Audit</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">PASSED (100%)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">AI AST Inference Engine</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">Online &bull; 18ms</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Database Sync</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">Synchronized</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/hospital-suite"
                  className="w-full py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center space-x-2 border border-teal-200 dark:border-teal-800/60"
                >
                  <span>Open Hospital Comparison Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER & ROLE MANAGEMENT */}
      {activeTab === "users" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Hospital Personnel &amp; Patient Sessions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Grant or revoke clinical AST permissions, reset 2FA keys, and enforce RBAC rules.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const name = prompt("Enter new staff member name:");
                if (name) {
                  setUsersList((prev) => [
                    ...prev,
                    {
                      id: `STF-${Math.floor(1000 + Math.random() * 9000)}`,
                      name,
                      role: "user",
                      dept: "General Diagnostic Laboratory",
                      status: "Active",
                      lastLogin: "Just created",
                      clearance: "Tier 2 (Laboratory)",
                    },
                  ]);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer"
            >
              + Add New Staff / Clinician
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Clearance</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                      {u.id}
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="p-3">
                      <span className="uppercase font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{u.dept}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{u.clearance}</td>
                    <td className="p-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{u.status}</span>
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Permissions for ${u.name} verified and re-audited.`);
                        }}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer text-[11px] font-medium"
                      >
                        Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BREAKPOINTS & SETTINGS */}
      {activeTab === "settings" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Antimicrobial Susceptibility Testing (AST) Interpretive Standards
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select which clinical authority governs Minimum Inhibitory Concentration (MIC) and Zone of Inhibition (mm) cutoffs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setGuidelineVersion("CLSI-M100")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                guidelineVersion === "CLSI-M100"
                  ? "bg-teal-50 dark:bg-teal-950/30 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  CLSI M100 - 34th Edition (2024–2026)
                </span>
                {guidelineVersion === "CLSI-M100" && (
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Clinical and Laboratory Standards Institute guidelines. Standard adopted across AIIMS, ICMR, and North American hospitals.
              </p>
            </div>

            <div
              onClick={() => setGuidelineVersion("EUCAST-v14")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                guidelineVersion === "EUCAST-v14"
                  ? "bg-teal-50 dark:bg-teal-950/30 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  EUCAST Clinical Breakpoint v14.0
                </span>
                {guidelineVersion === "EUCAST-v14" && (
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                European Committee on Antimicrobial Susceptibility Testing. Incorporates pharmacokinetic/pharmacodynamic (PK/PD) dosing indices.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
