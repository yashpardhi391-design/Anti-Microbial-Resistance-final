import React from "react";
import {
  Shield,
  Lock,
  Stethoscope,
  User,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  LogOut,
  RefreshCw,
  Fingerprint,
  ShieldCheck,
  FlaskConical,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export const SecurityGateBanner: React.FC = () => {
  const {
    user,
    isAuthenticated,
    openAuthModal,
    loginAsAdmin,
    loginAsDoctor,
    loginAsPatient,
    loginAsUser,
    logout,
  } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div
        id="unauthenticated-security-gate"
        className="mb-8 rounded-3xl border-2 border-dashed border-teal-400/60 dark:border-teal-500/40 bg-gradient-to-r from-teal-50 via-cyan-50 to-slate-50 dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900 p-6 sm:p-8 text-center shadow-lg"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 text-white shadow-md mb-3">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Hospital Security Gateway &bull; Role-Based Access Control
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-2 leading-relaxed">
          Access to microbiological AST culture sensitivity records, hospital cross-infection directives, and governance audit trails requires verified credentials under CLSI/HIPAA security protocols.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            id="gate-admin-login-btn"
            onClick={() => loginAsAdmin()}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin (1-Click)</span>
          </button>

          <button
            type="button"
            id="gate-doctor-login-btn"
            onClick={() => loginAsDoctor()}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor (1-Click)</span>
          </button>

          <button
            type="button"
            id="gate-patient-login-btn"
            onClick={() => loginAsPatient()}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <User className="w-4 h-4" />
            <span>Patient (1-Click)</span>
          </button>

          <button
            type="button"
            id="gate-staff-login-btn"
            onClick={() => loginAsUser()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Staff (1-Click)</span>
          </button>

          <Link
            to="/login"
            id="gate-dedicated-login-link"
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <KeyRound className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Login Page &rarr;</span>
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>AES-256 Bit Data Encryption</span>
          </span>
          <span>&bull;</span>
          <span className="flex items-center space-x-1">
            <Fingerprint className="w-3.5 h-3.5 text-teal-500" />
            <span>4-Tier RBAC Clearance</span>
          </span>
          <span>&bull;</span>
          <span>ICMR &amp; EUCAST Audit Logged</span>
        </div>
      </div>
    );
  }

  // When Authenticated: Show active security & role strip
  const getRoleBadgeStyle = () => {
    switch (user.role) {
      case "admin":
        return {
          icon: <ShieldCheck className="w-5 h-5" />,
          bg: "bg-amber-600 text-white",
          pill: "bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40",
          title: "Hospital Administrator / AMR Director",
        };
      case "doctor":
        return {
          icon: <Stethoscope className="w-5 h-5" />,
          bg: "bg-teal-600 text-white",
          pill: "bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/40",
          title: "Doctor / Clinical Microbiologist",
        };
      case "patient":
        return {
          icon: <User className="w-5 h-5" />,
          bg: "bg-cyan-600 text-white",
          pill: "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40",
          title: "Patient / Family Health Portal",
        };
      case "user":
      default:
        return {
          icon: <FlaskConical className="w-5 h-5" />,
          bg: "bg-indigo-600 text-white",
          pill: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/40",
          title: "Clinical Staff / Lab Technologist",
        };
    }
  };

  const roleStyle = getRoleBadgeStyle();

  return (
    <div
      id="authenticated-security-strip"
      className="mb-6 rounded-2xl border border-teal-200 dark:border-teal-500/30 bg-gradient-to-r from-teal-50/90 via-slate-50 to-cyan-50/90 dark:from-slate-900/90 dark:via-teal-950/30 dark:to-slate-900/90 p-3 sm:p-4 shadow-xs transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* User Role & Info */}
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${roleStyle.bg}`}>
            {roleStyle.icon}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${roleStyle.pill}`}
              >
                {roleStyle.title}
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Active Session</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                {user.role === "admin" && `${user.adminId} (Clearance: ${user.securityClearance || "Apex"})`}
                {user.role === "doctor" && `${user.medicalLicenseNo} (${user.hospitalName || "AIIMS AMR Lab"})`}
                {user.role === "patient" && `${user.uhid} | Blood Group: ${user.bloodGroup || "O+"}`}
                {user.role === "user" && `${user.staffId} (${user.laboratoryBranch || "Diagnostic Lab"})`}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Switch & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick 1-Click Role Switcher */}
          <div className="flex items-center space-x-1 bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => loginAsAdmin()}
              className={`px-2 py-1 rounded-lg font-medium text-[11px] transition-colors cursor-pointer ${
                user.role === "admin" ? "bg-amber-500 text-white font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700"
              }`}
              title="Switch to Admin role"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => loginAsDoctor()}
              className={`px-2 py-1 rounded-lg font-medium text-[11px] transition-colors cursor-pointer ${
                user.role === "doctor" ? "bg-teal-600 text-white font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700"
              }`}
              title="Switch to Doctor role"
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => loginAsPatient()}
              className={`px-2 py-1 rounded-lg font-medium text-[11px] transition-colors cursor-pointer ${
                user.role === "patient" ? "bg-cyan-600 text-white font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700"
              }`}
              title="Switch to Patient role"
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => loginAsUser()}
              className={`px-2 py-1 rounded-lg font-medium text-[11px] transition-colors cursor-pointer ${
                user.role === "user" ? "bg-indigo-600 text-white font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700"
              }`}
              title="Switch to Staff role"
            >
              Staff
            </button>
          </div>

          {user.role === "admin" && (
            <Link
              to="/admin"
              id="goto-admin-portal-link"
              className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Admin Directorate</span>
            </Link>
          )}

          {user.role === "patient" && (
            <Link
              to="/patient-portal"
              id="goto-patient-portal-link"
              className="px-3 py-1.5 rounded-xl bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-950/50 dark:hover:bg-cyan-900/60 text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1"
            >
              <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>My Report Portal</span>
            </Link>
          )}

          <button
            type="button"
            id="security-manage-auth-btn"
            onClick={() => openAuthModal("doctor", "signin")}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-all cursor-pointer flex items-center space-x-1"
          >
            <KeyRound className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Switch</span>
          </button>

          <button
            type="button"
            id="security-logout-btn"
            onClick={logout}
            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-medium transition-all cursor-pointer flex items-center space-x-1"
            title="Lock session & Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>
    </div>
  );
};

