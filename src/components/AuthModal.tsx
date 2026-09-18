import React, { useState } from "react";
import {
  Shield,
  User,
  Stethoscope,
  Lock,
  Mail,
  Building2,
  CheckCircle2,
  ArrowRight,
  X,
  KeyRound,
  FileCheck2,
  Fingerprint,
  Sparkles,
  Phone,
  AlertCircle,
  FlaskConical,
  ShieldCheck,
  ShieldAlert,
  Key,
  UserCheck,
} from "lucide-react";
import {
  useAuth,
  DEMO_ADMIN,
  DEMO_DOCTOR,
  DEMO_PATIENT,
  DEMO_USER,
} from "../context/AuthContext";
import { BloodGroup, UserRole } from "../types";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    modalDefaultRole,
    modalDefaultMode,
    loginAsAdmin,
    loginAsDoctor,
    loginAsPatient,
    loginAsUser,
    loginCustom,
    firebaseSignUp,
    firebaseSignIn,
  } = useAuth();

  const [role, setRole] = useState<UserRole>(modalDefaultRole || "doctor");
  const [mode, setMode] = useState<"signin" | "signup">(modalDefaultMode || "signin");

  // Admin Form States
  const [adminId, setAdminId] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminMasterKey, setAdminMasterKey] = useState("");

  // Doctor Form States
  const [docEmail, setDocEmail] = useState("");
  const [docPassword, setDocPassword] = useState("");
  const [docLicense, setDocLicense] = useState("");
  const [docHospital, setDocHospital] = useState("");
  const [docName, setDocName] = useState("");
  const [docDept, setDocDept] = useState("Clinical Microbiology & Infectious Diseases");

  // Patient Form States
  const [patUhid, setPatUhid] = useState("");
  const [patPhone, setPatPhone] = useState("");
  const [patPasscode, setPatPasscode] = useState("");
  const [patName, setPatName] = useState("");
  const [patBloodGroup, setPatBloodGroup] = useState<BloodGroup>("O+");
  const [patReportCode, setPatReportCode] = useState("");

  // Staff / User Form States
  const [staffId, setStaffId] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPass, setStaffPass] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffBranch, setStaffBranch] = useState("Central Bacteriology Wing");

  const [errorMsg, setErrorMsg] = useState("");

  const handleAutoFillDemo = () => {
    setErrorMsg("");
    if (role === "admin") {
      setAdminId("ADMIN-ICMR-NCR-8801");
      setAdminEmail("admin.director@aiims-amr.org");
      setAdminPass("AdminPass@2026");
    } else if (role === "doctor") {
      setDocEmail("dr.vance@aiims-amr.org");
      setDocPassword("DocPass@2026");
      setDocLicense("MCI-ND-2016-84920");
      setDocHospital("AIIMS & ICMR AMR Center");
    } else if (role === "patient") {
      setPatUhid("UHID-2026-P204119");
      setPatPhone("+91 94120 58392");
      setPatPasscode("PatPass@2026");
      setPatReportCode("PRP-2041-1092-8801");
    } else {
      setStaffId("STF-LAB-4029");
      setStaffEmail("pooja.nair@aiims-amr.org");
      setStaffPass("StaffPass@2026");
    }
  };

  if (!isAuthModalOpen) return null;

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const cleanUser = (adminEmail || adminId).trim();
      const cleanPass = adminPass.trim();
      if (mode === "signin") {
        await firebaseSignIn(cleanUser, cleanPass, "admin");
      } else {
        // STRICT RBAC: Admin creation is strictly governed and requires Directorate Master Key
        const validMasterKeys = ["AIIMS-DIR-2026", "ICMR-ADMIN-2026", "DIRECTOR-KEY-2026", "ADMIN@2026"];
        const keyClean = adminMasterKey.trim().toUpperCase();
        if (!keyClean) {
          setErrorMsg("Security Violation: Admin creation requires an authorized Directorate Master Key.");
          return;
        }
        if (!validMasterKeys.includes(keyClean)) {
          setErrorMsg("Access Denied (403 Forbidden): Invalid Directorate Master Key. Only verified Hospital Directorate executives can provision an Admin account.");
          return;
        }

        if (!adminName.trim()) {
          setErrorMsg("Please enter Administrator's Name");
          return;
        }
        await firebaseSignUp(cleanUser, cleanPass, {
          role: "admin",
          name: adminName,
          adminId: adminId || "ADMIN-ICMR-NCR-8801",
          securityClearance: "Level 4 (Directorate Governance)",
          hospitalName: "AIIMS Apex Antimicrobial Governance Directorate",
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Check your password.");
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const cleanUser = docEmail.trim();
      const cleanPass = docPassword.trim();
      if (mode === "signin") {
        await firebaseSignIn(cleanUser, cleanPass, "doctor");
      } else {
        if (!docName.trim()) {
          setErrorMsg("Please enter Doctor's Full Name");
          return;
        }
        await firebaseSignUp(cleanUser, cleanPass, {
          role: "doctor",
          name: docName.startsWith("Dr.") ? docName : `Dr. ${docName}`,
          medicalLicenseNo: docLicense || "MCI-ND-2016-84920",
          hospitalName: docHospital || "AIIMS & ICMR AMR Center",
          department: docDept,
          designation: "Attending Consultant / Stewardship Officer",
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed.");
    }
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const cleanUser = (patUhid || patPhone).trim();
      const cleanPass = patPasscode.trim();
      if (mode === "signin") {
        await firebaseSignIn(cleanUser, cleanPass, "patient");
      } else {
        if (!patName.trim()) {
          setErrorMsg("Please enter Patient's Full Name");
          return;
        }
        const email = `${cleanUser.toLowerCase()}@patient-portal.org`;
        await firebaseSignUp(email, cleanPass, {
          role: "patient",
          name: patName,
          phone: patPhone,
          uhid: patUhid || `UHID-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          bloodGroup: patBloodGroup,
          associatedReportCode: patReportCode || "PRP-2041-1092-8801",
          wardOrBed: "General Medical Ward",
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed.");
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const cleanUser = (staffEmail || staffId).trim();
      const cleanPass = staffPass.trim();
      if (mode === "signin") {
        await firebaseSignIn(cleanUser, cleanPass, "user");
      } else {
        if (!staffName.trim()) {
          setErrorMsg("Please enter Staff/Technologist Name");
          return;
        }
        await firebaseSignUp(cleanUser, cleanPass, {
          role: "user",
          name: staffName,
          staffId: staffId || "STF-LAB-4029",
          staffRole: "Clinical Lab Technologist",
          laboratoryBranch: staffBranch,
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed.");
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        id="auth-modal-dialog"
        className="relative w-full max-w-xl my-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all"
      >
        {/* Top Header Banner with Security Indicator */}
        <div className="bg-gradient-to-r from-teal-700 via-cyan-800 to-slate-900 p-6 text-white relative">
          <button
            onClick={closeAuthModal}
            id="close-auth-modal-btn"
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-teal-200 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4 text-teal-300" />
            <span>Hospital Security Gateway &bull; AES-256 Encrypted</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {mode === "signin" ? "Secure Portal Sign In" : "New User Registration"}
          </h2>
          <p className="text-xs text-teal-100/90 mt-1 max-w-md">
            Role-Based Access Control (RBAC): Admin, Doctor, Patient &amp; User Staff clearance.
          </p>

          {/* 4-Role Switcher Tabs */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10">
            <button
              type="button"
              id="auth-tab-admin"
              onClick={() => {
                setRole("admin");
                setErrorMsg("");
              }}
              className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === "admin"
                  ? "bg-amber-500 text-slate-950 shadow-md scale-[1.02]"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              id="auth-tab-doctor"
              onClick={() => {
                setRole("doctor");
                setErrorMsg("");
              }}
              className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === "doctor"
                  ? "bg-teal-500 text-white shadow-md scale-[1.02]"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </button>

            <button
              type="button"
              id="auth-tab-patient"
              onClick={() => {
                setRole("patient");
                setErrorMsg("");
              }}
              className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === "patient"
                  ? "bg-cyan-500 text-white shadow-md scale-[1.02]"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </button>

            <button
              type="button"
              id="auth-tab-user"
              onClick={() => {
                setRole("user");
                setErrorMsg("");
              }}
              className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === "user"
                  ? "bg-indigo-500 text-white shadow-md scale-[1.02]"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>User / Staff</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Sign In vs Sign Up Toggle */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex space-x-4 text-xs font-bold">
              <button
                type="button"
                id="auth-mode-signin-btn"
                onClick={() => setMode("signin")}
                className={`pb-2 transition-all cursor-pointer ${
                  mode === "signin"
                    ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 font-extrabold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Sign In to Account
              </button>
              <button
                type="button"
                id="auth-mode-signup-btn"
                onClick={() => setMode("signup")}
                className={`pb-2 transition-all cursor-pointer ${
                  mode === "signup"
                    ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 font-extrabold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Create New Profile (Sign Up)
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {role.toUpperCase()} Clearance
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick 1-Click Instant Login for Presentations */}
          <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/60 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs text-teal-900 dark:text-teal-200">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                <strong>Quick Presentation Demo:</strong> 1-Click login or fill test data
              </span>
            </div>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Fill input fields with demo credentials"
              >
                Auto-Fill Demo
              </button>
              <button
                type="button"
                id="instant-demo-login-btn"
                onClick={() => {
                  if (role === "admin") loginAsAdmin();
                  else if (role === "doctor") loginAsDoctor();
                  else if (role === "patient") loginAsPatient();
                  else loginAsUser();
                }}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>1-Click Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 1. ADMIN PORTAL FORM */}
          {role === "admin" && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Administrator Full Name
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Alok Verma, Medical Superintendent"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Apex Administrator ID / Badge Code
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. ADMIN-ICMR-NCR-8801"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Directorate Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="admin.director@aiims-amr.org"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Master Security Key / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Enter admin master password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              {mode === "signup" && (
                <div className="space-y-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-start space-x-2 text-amber-700 dark:text-amber-300 text-[11px] leading-tight">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <span className="font-bold block">Hospital Governance Clearance Required</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">
                        Admin accounts govern all hospital-wide antimicrobial policies & surveillance. Self-registration requires the Directorate Master Key.
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-amber-800 dark:text-amber-300 mb-0.5">
                      Directorate Master Key (Demo: AIIMS-DIR-2026)
                    </label>
                    <div className="relative">
                      <Key className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-2" />
                      <input
                        type="password"
                        required
                        placeholder="Enter Master Key (e.g. AIIMS-DIR-2026)"
                        value={adminMasterKey}
                        onChange={(e) => setAdminMasterKey(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                id="submit-admin-auth-btn"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{mode === "signin" ? "Enter Hospital Admin Control Directorate" : "Register Admin Credentials"}</span>
              </button>
            </form>
          )}

          {/* 2. DOCTOR PORTAL FORM */}
          {role === "doctor" && (
            <form onSubmit={handleDoctorSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Doctor's Full Name with Credentials
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Verma, MD (Microbiology)"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email / Hospital ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="doctor@hospital.org"
                    value={docEmail}
                    onChange={(e) => setDocEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Medical Reg. / License No.
                  </label>
                  <div className="relative">
                    <FileCheck2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. MCI-ND-2016-84920"
                      value={docLicense}
                      onChange={(e) => setDocLicense(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hospital / Institution
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="AIIMS, Fortis, PGIMER, etc."
                      value={docHospital}
                      onChange={(e) => setDocHospital(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Secure Access Key / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password or secure PIN"
                    value={docPassword}
                    onChange={(e) => setDocPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="submit-doctor-auth-btn"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{mode === "signin" ? "Authenticate & Access Stewardship Suite" : "Register Doctor Profile"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 3. PATIENT PORTAL FORM */}
          {role === "patient" && (
            <form onSubmit={handlePatientSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Patient's Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={patName}
                      onChange={(e) => setPatName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Patient UHID / Reg. No.
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. UHID-2026-P204119"
                      value={patUhid}
                      onChange={(e) => setPatUhid(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registered Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 01234"
                      value={patPhone}
                      onChange={(e) => setPatPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group (ABO Typing)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"] as BloodGroup[]).map((bg) => (
                      <button
                        type="button"
                        key={bg}
                        onClick={() => setPatBloodGroup(bg)}
                        className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          patBloodGroup === bg
                            ? "bg-cyan-600 text-white border border-cyan-500"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Report Access Code / Secret Key
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. PRP-2041-1092-8801 or 6-digit PIN"
                    value={patReportCode}
                    onChange={(e) => setPatReportCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                  Printed on your physical pathology slip / SMS confirmation
                </span>
              </div>

              <button
                type="submit"
                id="submit-patient-auth-btn"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{mode === "signin" ? "View My Official Laboratory Report" : "Create Patient Record"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 4. USER / STAFF PORTAL FORM */}
          {role === "user" && (
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Clinical Staff Full Name
                  </label>
                  <div className="relative">
                    <FlaskConical className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Nair, Technologist"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Staff Employee / Badge ID
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. STF-LAB-4029"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Laboratory Branch / Wing
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Central Bacteriology Wing"
                      value={staffBranch}
                      onChange={(e) => setStaffBranch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Staff Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="staff@aiims-amr.org"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Laboratory Key / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Enter staff security key"
                    value={staffPass}
                    onChange={(e) => setStaffPass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="submit-staff-auth-btn"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <FlaskConical className="w-4 h-4" />
                <span>{mode === "signin" ? "Login to Microbiology Lab Bench" : "Register Lab Staff"}</span>
              </button>
            </form>
          )}

          {/* Compliance Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>HIPAA &bull; CLSI M100-Ed34 &bull; AES-256 Encrypted</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              Session Timeout: 30 Mins Inactivity
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

