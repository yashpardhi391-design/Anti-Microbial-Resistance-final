import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Stethoscope,
  User,
  FlaskConical,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Building2,
  Facebook,
  Github,
  Linkedin,
  Chrome,
  Phone,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BloodGroup, UserRole } from "../types";
import { useNavigate } from "react-router-dom";

const getFriendlyErrorMessage = (error: any): string => {
  if (!error) return "Authentication failed.";
  const msg = error.message || String(error);
  if (msg.includes("auth/operation-not-allowed") || msg.includes("operation-not-allowed")) {
    return "Firebase Error: 'Email/Password' authentication is disabled. To fix this instantly, go to: Firebase Console > Build > Authentication > Sign-in method > Enable 'Email/Password' & Save.";
  }
  if (msg.includes("auth/email-already-in-use") || msg.includes("email-already-in-use")) {
    return "This email is already registered. Please sign in instead.";
  }
  if (msg.includes("auth/weak-password") || msg.includes("weak-password")) {
    return "Password is too weak. Please use at least 6 characters.";
  }
  if (msg.includes("auth/invalid-email") || msg.includes("invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (
    msg.includes("auth/user-not-found") ||
    msg.includes("user-not-found") ||
    msg.includes("auth/wrong-password") ||
    msg.includes("wrong-password") ||
    msg.includes("invalid-credential")
  ) {
    return "Invalid email or password. Please verify your credentials.";
  }
  return msg;
};

interface LoginPageProps {
  isStandaloneGate?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ isStandaloneGate = false }) => {
  const {
    user,
    isAuthenticated,
    loginAsAdmin,
    loginAsDoctor,
    loginAsPatient,
    loginAsUser,
    loginCustom,
    logout,
    firebaseSignIn,
    firebaseSignUp,
  } = useAuth();

  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>("doctor");
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Forgot Password Modal State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotFullName, setForgotFullName] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [recoveredPassword, setRecoveredPassword] = useState("");

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
    setRecoveredPassword("");

    const emailInput = forgotEmail.toLowerCase().trim();
    const nameInput = forgotFullName.toLowerCase().trim();

    if (!emailInput || !nameInput) {
      setForgotError("Please enter both username/email and full name.");
      return;
    }

    // 1. Check if it matches a Demo account (so users can easily retrieve demo credentials)
    if (
      emailInput.includes("dr.vance") || 
      emailInput.includes("vance") || 
      nameInput.includes("vance")
    ) {
      setRecoveredPassword("DocPass@2026");
      setForgotMessage("Demo credentials recovered successfully!");
      return;
    }
    if (
      emailInput.includes("admin") || 
      nameInput.includes("alok") || 
      nameInput.includes("admin")
    ) {
      setRecoveredPassword("AdminPass@2026");
      setForgotMessage("Demo credentials recovered successfully!");
      return;
    }
    if (
      emailInput.includes("rajesh") || 
      nameInput.includes("rajesh")
    ) {
      setRecoveredPassword("PatPass@2026");
      setForgotMessage("Demo credentials recovered successfully!");
      return;
    }
    if (
      emailInput.includes("pooja") || 
      nameInput.includes("pooja")
    ) {
      setRecoveredPassword("StaffPass@2026");
      setForgotMessage("Demo credentials recovered successfully!");
      return;
    }

    // 2. Search local users
    try {
      const stored = localStorage.getItem("pharmashield_local_users");
      if (stored) {
        const localUsers: Array<{ email: string; password?: string; profile: any }> = JSON.parse(stored);
        const match = localUsers.find(
          (u) => 
            u.email.toLowerCase().trim() === emailInput &&
            u.profile?.fullName?.toLowerCase().trim().includes(nameInput)
        );

        if (match) {
          if (match.password) {
            setRecoveredPassword(match.password);
            setForgotMessage("Account recovered! Your security password is:");
          } else {
            setForgotError("This account was created without a password or is synced only with Firebase.");
          }
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    setForgotError("No matching account found with those credentials. Please check your spelling.");
  };

  // Doctor Form
  const [docUsername, setDocUsername] = useState("");
  const [docPassword, setDocPassword] = useState("");
  const [docLicense, setDocLicense] = useState("");
  const [docHospital, setDocHospital] = useState("");
  const [docName, setDocName] = useState("");

  // Admin Form
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");

  // Patient Form
  const [patUsername, setPatUsername] = useState("");
  const [patPassword, setPatPassword] = useState("");
  const [patPhone, setPatPhone] = useState("");
  const [patName, setPatName] = useState("");
  const [patBloodGroup, setPatBloodGroup] = useState<BloodGroup>("O+");
  const [patReportCode, setPatReportCode] = useState("");

  // Staff Form
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffBranch, setStaffBranch] = useState("");

  // Helper to fill demo credentials into the input fields
  const handleAutoFillFields = () => {
    setErrorMsg("");
    if (role === "doctor") {
      setDocUsername("dr.vance@aiims-amr.org");
      setDocPassword("DocPass@2026");
      setDocLicense("MCI-ND-2016-84920");
      setDocHospital("AIIMS Apex Antimicrobial Center");
    } else if (role === "admin") {
      setAdminUsername("ADMIN-ICMR-NCR-8801");
      setAdminPassword("AdminPass@2026");
      setAdminEmail("admin.director@aiims-amr.org");
    } else if (role === "patient") {
      setPatUsername("UHID-2026-P204119");
      setPatPassword("PatPass@2026");
      setPatPhone("+91 94120 58392");
      setPatReportCode("PRP-2041-1092-8801");
    } else {
      setStaffUsername("STF-LAB-4029");
      setStaffPassword("StaffPass@2026");
      setStaffEmail("pooja.nair@aiims-amr.org");
      setStaffBranch("Central Bacteriology Wing");
    }
  };

  // Quick Demo Auto-Fill & Login
  const handleQuickDemoLogin = (selectedRole: UserRole) => {
    setErrorMsg("");
    setRole(selectedRole);
    if (selectedRole === "doctor") {
      setDocUsername("dr.vance@aiims-amr.org");
      setDocPassword("DocPass@2026");
      loginAsDoctor("dr.vance@aiims-amr.org", "MCI-ND-2016-84920");
      navigate("/");
    } else if (selectedRole === "admin") {
      setAdminUsername("ADMIN-ICMR-NCR-8801");
      setAdminPassword("AdminPass@2026");
      loginAsAdmin("ADMIN-ICMR-NCR-8801", "admin.director@aiims-amr.org");
      navigate("/admin");
    } else if (selectedRole === "patient") {
      setPatUsername("UHID-2026-P204119");
      setPatPassword("PatPass@2026");
      loginAsPatient("UHID-2026-P204119", "PRP-2041-1092-8801");
      navigate("/patient-portal");
    } else {
      setStaffUsername("STF-LAB-4029");
      setStaffPassword("StaffPass@2026");
      loginAsUser("STF-LAB-4029", "pooja.nair@aiims-amr.org");
      navigate("/scanner");
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent, isRegisterForm: boolean) => {
    e.preventDefault();
    setErrorMsg("");

    const getFirebaseEmail = (input: string, userRole: string) => {
      const trimmed = input.trim();
      if (trimmed.includes("@")) return trimmed;
      return `${trimmed.toLowerCase()}@${userRole}-portal.org`;
    };

    if (role === "doctor") {
      if (!docUsername.trim()) {
        setErrorMsg("Please enter Doctor Username / Email");
        return;
      }
      if (!docPassword.trim()) {
        setErrorMsg("Please enter password");
        return;
      }
      try {
        if (!isRegisterForm) {
          // Check if it's the demo credentials
          if (docUsername === "dr.vance@aiims-amr.org" && docPassword === "DocPass@2026") {
            loginAsDoctor(docUsername, docLicense);
          } else {
            const resolvedEmail = getFirebaseEmail(docUsername, "doctor");
            await firebaseSignIn(resolvedEmail, docPassword);
          }
          navigate("/");
        } else {
          if (!docName.trim()) {
            setErrorMsg("Please enter Doctor Name");
            return;
          }
          const resolvedEmail = getFirebaseEmail(docUsername, "doctor");
          await firebaseSignUp(resolvedEmail, docPassword, {
            role: "doctor",
            name: docName.startsWith("Dr.") ? docName : `Dr. ${docName}`,
            email: resolvedEmail,
            medicalLicenseNo: docLicense || "MCI-REG-PENDING",
            hospitalName: docHospital || "AIIMS Apex Antimicrobial Center",
            department: "Infectious Diseases & Clinical Stewardship",
            designation: "Attending Consultant / Stewardship Officer",
            isVerified: true,
          });
          navigate("/");
        }
      } catch (err: any) {
        console.error("Doctor Auth Error:", err);
        setErrorMsg(getFriendlyErrorMessage(err));
      }
    } else if (role === "admin") {
      if (!adminUsername.trim()) {
        setErrorMsg("Please enter Admin ID / Email");
        return;
      }
      if (!adminPassword.trim()) {
        setErrorMsg("Please enter password");
        return;
      }
      try {
        const resolvedEmail = getFirebaseEmail(adminEmail || adminUsername, "admin");
        if (!isRegisterForm) {
          if ((adminUsername === "ADMIN-ICMR-NCR-8801" || adminEmail === "admin.director@aiims-amr.org") && adminPassword === "AdminPass@2026") {
            loginAsAdmin(adminUsername, adminEmail);
          } else {
            await firebaseSignIn(resolvedEmail, adminPassword);
          }
          navigate("/admin");
        } else {
          if (!adminName.trim()) {
            setErrorMsg("Please enter Admin Name");
            return;
          }
          await firebaseSignUp(resolvedEmail, adminPassword, {
            role: "admin",
            name: adminName,
            email: resolvedEmail,
            adminId: adminUsername,
            securityClearance: "Level 4 (Directorate Governance)",
            hospitalName: "AIIMS Apex Antimicrobial Governance Directorate",
            isVerified: true,
          });
          navigate("/admin");
        }
      } catch (err: any) {
        console.error("Admin Auth Error:", err);
        setErrorMsg(getFriendlyErrorMessage(err));
      }
    } else if (role === "patient") {
      if (!patUsername.trim()) {
        setErrorMsg("Please enter Patient UHID / Email");
        return;
      }
      if (!patPassword.trim()) {
        setErrorMsg("Please enter password");
        return;
      }
      try {
        const resolvedEmail = getFirebaseEmail(patUsername, "patient");
        if (!isRegisterForm) {
          if (patUsername === "UHID-2026-P204119" && patPassword === "PatPass@2026") {
            loginAsPatient(patUsername, patReportCode);
          } else {
            await firebaseSignIn(resolvedEmail, patPassword);
          }
          navigate("/patient-portal");
        } else {
          if (!patName.trim()) {
            setErrorMsg("Please enter Patient Name");
            return;
          }
          await firebaseSignUp(resolvedEmail, patPassword, {
            role: "patient",
            name: patName,
            email: resolvedEmail,
            phone: patPhone || "+91 94120 58392",
            uhid: patUsername,
            bloodGroup: patBloodGroup,
            associatedReportCode: patReportCode || "PRP-2041-1092-8801",
            wardOrBed: "General Medical Ward - Bed 08",
            isVerified: true,
          });
          navigate("/patient-portal");
        }
      } catch (err: any) {
        console.error("Patient Auth Error:", err);
        setErrorMsg(getFriendlyErrorMessage(err));
      }
    } else if (role === "user") {
      if (!staffUsername.trim()) {
        setErrorMsg("Please enter Staff ID / Email");
        return;
      }
      if (!staffPassword.trim()) {
        setErrorMsg("Please enter password");
        return;
      }
      try {
        const resolvedEmail = getFirebaseEmail(staffEmail || staffUsername, "staff");
        if (!isRegisterForm) {
          if ((staffUsername === "STF-LAB-4029" || staffEmail === "pooja.nair@aiims-amr.org") && staffPassword === "StaffPass@2026") {
            loginAsUser(staffUsername, staffEmail);
          } else {
            await firebaseSignIn(resolvedEmail, staffPassword);
          }
          navigate("/scanner");
        } else {
          if (!staffName.trim()) {
            setErrorMsg("Please enter Staff Name");
            return;
          }
          await firebaseSignUp(resolvedEmail, staffPassword, {
            role: "user",
            name: staffName,
            email: resolvedEmail,
            staffId: staffUsername,
            staffRole: "Senior Lab Microbiologist",
            laboratoryBranch: staffBranch || "Central Bacteriology Wing",
            isVerified: true,
          });
          navigate("/scanner");
        }
      } catch (err: any) {
        console.error("Staff Auth Error:", err);
        setErrorMsg(getFriendlyErrorMessage(err));
      }
    }
  };


  // Shared Form elements like Role selector tabs to render on either signin or signup forms
  const renderRoleSelector = (currentRole: UserRole, onChange: (r: UserRole) => void) => {
    const roles: { id: UserRole; label: string; sub: string; icon: any; colorClass: string }[] = [
      { id: "doctor", label: "Doctor", sub: "Physician", icon: Stethoscope, colorClass: "text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/40" },
      { id: "admin", label: "Admin", sub: "ICMR", icon: ShieldCheck, colorClass: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40" },
      { id: "patient", label: "Patient", sub: "UHID", icon: User, colorClass: "text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/40" },
      { id: "user", label: "Staff", sub: "Lab Tech", icon: FlaskConical, colorClass: "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/40" },
    ];

    return (
      <div className="grid grid-cols-4 gap-1.5 mb-5 p-1 bg-slate-100/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
        {roles.map((item) => {
          const Icon = item.icon;
          const isActive = currentRole === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onChange(item.id);
                setErrorMsg("");
              }}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? "text-teal-600 dark:text-teal-400" : "opacity-70"}`} />
              <span className="text-[10px] font-bold tracking-tight leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderSocials = () => (
    <div className="flex justify-center space-x-3 mt-4">
      <a href="#" onClick={(e) => e.preventDefault()} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <Chrome className="w-4 h-4" />
      </a>
      <a href="#" onClick={(e) => e.preventDefault()} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <Facebook className="w-4 h-4" />
      </a>
      <a href="#" onClick={(e) => e.preventDefault()} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <Github className="w-4 h-4" />
      </a>
      <a href="#" onClick={(e) => e.preventDefault()} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <Linkedin className="w-4 h-4" />
      </a>
    </div>
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center bg-slate-50 dark:bg-[#060b14] transition-colors duration-300">
      
      {/* Top Directorate Branding Banner */}
      <div className="text-center mb-8 max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-800 dark:text-teal-300 text-xs font-mono font-bold mb-3 shadow-xs">
          <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
          <span>PHARMA RESIST PRO &bull; ADVANCED CLINICAL AMR SURVEILLANCE</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
          Antimicrobial Stewardship Portal
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Clinical security gateway certified under CLSI guidelines for hospital network governance.
        </p>
      </div>

      {/* Active Session Warning notice if already logged in */}
      {isAuthenticated && user && (
        <div className="mb-6 w-full max-w-4xl p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center space-x-3 text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block sm:inline">सक्रिय सत्र (Active Session): </span>
              <span>You are currently signed in as <strong className="text-emerald-700 dark:text-emerald-300">{user.name}</strong> ({user.role.toUpperCase()})</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs"
            >
              Enter Dashboard &rarr;
            </button>
            <button
              type="button"
              onClick={logout}
              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold rounded-xl cursor-pointer flex items-center space-x-1 border border-rose-200 dark:border-rose-900 text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP VIEW: Sliding Panel Transition */}
      <div className={`hidden md:block login-container ${isRegisterActive ? "active" : ""} border border-slate-200/80 dark:border-slate-800/80 shadow-2xl`}>
        
        {/* Registration Form Box (Slides left/right) */}
        <div className="login-form-box register flex-col justify-center items-stretch text-slate-800 dark:text-slate-100">
          <div className="w-full max-w-md mx-auto space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Registration Portal</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Create an AMR authorized credential
              </p>
            </div>

            {renderRoleSelector(role, setRole)}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                {errorMsg.includes("already registered") && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterActive(false);
                      setErrorMsg("");
                    }}
                    className="mt-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-[10px] text-center transition-all cursor-pointer font-mono shadow-xs"
                  >
                    Switch to Sign-In Page &rarr;
                  </button>
                )}
              </div>
            )}

            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-3 text-left">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Enter Full Name"
                    value={role === "doctor" ? docName : role === "admin" ? adminName : role === "patient" ? patName : staffName}
                    onChange={(e) => {
                      if (role === "doctor") setDocName(e.target.value);
                      else if (role === "admin") setAdminName(e.target.value);
                      else if (role === "patient") setPatName(e.target.value);
                      else setStaffName(e.target.value);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                  Username / Identity
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Credential Identity"
                    value={role === "doctor" ? docUsername : role === "admin" ? adminUsername : role === "patient" ? patUsername : staffUsername}
                    onChange={(e) => {
                      if (role === "doctor") setDocUsername(e.target.value);
                      else if (role === "admin") setAdminUsername(e.target.value);
                      else if (role === "patient") setPatUsername(e.target.value);
                      else setStaffUsername(e.target.value);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Password Security"
                    value={role === "doctor" ? docPassword : role === "admin" ? adminPassword : role === "patient" ? patPassword : staffPassword}
                    onChange={(e) => {
                      if (role === "doctor") setDocPassword(e.target.value);
                      else if (role === "admin") setAdminPassword(e.target.value);
                      else if (role === "patient") setPatPassword(e.target.value);
                      else setStaffPassword(e.target.value);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Role-Specific Secondary Fields */}
              {role === "doctor" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">MCI License</label>
                    <input
                      type="text"
                      placeholder="MCI License Code"
                      value={docLicense}
                      onChange={(e) => setDocLicense(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">Institution</label>
                    <input
                      type="text"
                      placeholder="Hospital Name"
                      value={docHospital}
                      onChange={(e) => setDocHospital(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {role === "patient" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">Phone</label>
                    <input
                      type="text"
                      placeholder="Contact No."
                      value={patPhone}
                      onChange={(e) => setPatPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">Blood Group</label>
                    <select
                      value={patBloodGroup}
                      onChange={(e) => setPatBloodGroup(e.target.value as BloodGroup)}
                      className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                    >
                      <option value="O+">O+</option>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="AB+">AB+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-colors"
              >
                <span>Register & Enter Gateway</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="text-center pt-2">
              <span className="text-[10px] text-slate-400 font-mono block">or register with medical credentials</span>
              {renderSocials()}
            </div>
          </div>
        </div>

        {/* Login Form Box (Slides left/right) */}
        <div className="login-form-box login flex-col justify-center items-stretch text-slate-800 dark:text-slate-100">
          <div className="w-full max-w-md mx-auto space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Secure Sign-In</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your hospital credentials to sign in
              </p>
            </div>

            {renderRoleSelector(role, setRole)}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                  Clinical Username / Identifier
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter Identity"
                    value={role === "doctor" ? docUsername : role === "admin" ? adminUsername : role === "patient" ? patUsername : staffUsername}
                    onChange={(e) => {
                      if (role === "doctor") setDocUsername(e.target.value);
                      else if (role === "admin") setAdminUsername(e.target.value);
                      else if (role === "patient") setPatUsername(e.target.value);
                      else setStaffUsername(e.target.value);
                    }}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Security Password
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? "Hide" : "Show"}</span>
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotError("");
                        setForgotMessage("");
                        setRecoveredPassword("");
                        setForgotEmail(
                          role === "doctor" ? docUsername : role === "admin" ? adminUsername : role === "patient" ? patUsername : staffUsername
                        );
                        setIsForgotPasswordOpen(true);
                      }}
                      className="text-[10px] text-rose-500 hover:text-rose-600 hover:underline cursor-pointer font-bold"
                    >
                      Forgot?
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter Security Password"
                    value={role === "doctor" ? docPassword : role === "admin" ? adminPassword : role === "patient" ? patPassword : staffPassword}
                    onChange={(e) => {
                      if (role === "doctor") setDocPassword(e.target.value);
                      else if (role === "admin") setAdminPassword(e.target.value);
                      else if (role === "patient") setPatPassword(e.target.value);
                      else setStaffPassword(e.target.value);
                    }}
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleAutoFillFields}
                  className="px-4 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                  title="Fill fields with standard demo credentials"
                >
                  Auto-Fill Demo
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-colors"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Verify & Sign-In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="text-center pt-2">
              <span className="text-[10px] text-slate-400 font-mono block">or sign in with social network</span>
              {renderSocials()}
            </div>
          </div>
        </div>

        {/* Sliding Overlay / Toggle Panel Box */}
        <div className="login-toggle-box">
          
          {/* Active register form trigger */}
          <div className="login-toggle-panel toggle-left px-10 text-center">
            <h1 className="text-3xl font-black mb-2">New Here?</h1>
            <p className="text-xs text-slate-100/90 mb-6 max-w-xs">
              Join our hospital surveillance grid to upload, scan, and cross-analyze local patient antibiograms instantly.
            </p>
            <button
              onClick={() => {
                setIsRegisterActive(true);
                setErrorMsg("");
              }}
              className="px-6 py-2 rounded-xl bg-transparent border-2 border-white hover:bg-white/10 text-white text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              Create Account
            </button>
          </div>

          {/* Active signin form trigger */}
          <div className="login-toggle-panel toggle-right px-10 text-center">
            <h1 className="text-3xl font-black mb-2">Hello, Friend!</h1>
            <p className="text-xs text-slate-100/90 mb-6 max-w-xs">
              Already configured your credentials? Skip registration and log in directly to continue.
            </p>
            <button
              onClick={() => {
                setIsRegisterActive(false);
                setErrorMsg("");
              }}
              className="px-6 py-2 rounded-xl bg-transparent border-2 border-white hover:bg-white/10 text-white text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              Sign In Instead
            </button>
          </div>

        </div>

      </div>

      {/* MOBILE & TABLET VIEW: Responsive Stacked Cards Layout */}
      <div className="block md:hidden w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {isRegisterActive ? "Registration Portal" : "Clinical Secure Sign-In"}
          </div>
          <button
            onClick={() => {
              setIsRegisterActive(!isRegisterActive);
              setErrorMsg("");
            }}
            className="text-[11px] text-teal-600 dark:text-teal-400 font-bold underline cursor-pointer"
          >
            {isRegisterActive ? "Login instead" : "Create Account"}
          </button>
        </div>

        <div className="p-5">
          {renderRoleSelector(role, setRole)}

          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              {errorMsg.includes("already registered") && (
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterActive(false);
                    setErrorMsg("");
                  }}
                  className="mt-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-[10px] text-center transition-all cursor-pointer font-mono shadow-xs"
                >
                  Switch to Sign-In Page &rarr;
                </button>
              )}
            </div>
          )}

          <form onSubmit={(e) => handleSubmit(e, isRegisterActive)} className="space-y-4">
            {isRegisterActive && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Enter Full Name"
                    value={role === "doctor" ? docName : role === "admin" ? adminName : role === "patient" ? patName : staffName}
                    onChange={(e) => {
                      if (role === "doctor") setDocName(e.target.value);
                      else if (role === "admin") setAdminName(e.target.value);
                      else if (role === "patient") setPatName(e.target.value);
                      else setStaffName(e.target.value);
                    }}
                    className="w-full pl-9 pr-3.5 py-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Username / Identifier
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Enter credential username"
                  value={role === "doctor" ? docUsername : role === "admin" ? adminUsername : role === "patient" ? patUsername : staffUsername}
                  onChange={(e) => {
                    if (role === "doctor") setDocUsername(e.target.value);
                    else if (role === "admin") setAdminUsername(e.target.value);
                    else if (role === "patient") setPatUsername(e.target.value);
                    else setStaffUsername(e.target.value);
                  }}
                  className="w-full pl-9 pr-3.5 py-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotError("");
                      setForgotMessage("");
                      setRecoveredPassword("");
                      setForgotEmail(
                        role === "doctor" ? docUsername : role === "admin" ? adminUsername : role === "patient" ? patUsername : staffUsername
                      );
                      setIsForgotPasswordOpen(true);
                    }}
                    className="text-[10px] text-rose-500 hover:text-rose-600 hover:underline cursor-pointer font-bold"
                  >
                    Forgot?
                  </button>
                </div>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Security Password"
                  value={role === "doctor" ? docPassword : role === "admin" ? adminPassword : role === "patient" ? patPassword : staffPassword}
                  onChange={(e) => {
                    if (role === "doctor") setDocPassword(e.target.value);
                    else if (role === "admin") setAdminPassword(e.target.value);
                    else if (role === "patient") setPatPassword(e.target.value);
                    else setStaffPassword(e.target.value);
                  }}
                  className="w-full pl-9 pr-10 py-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                />
                <span>Remember session</span>
              </label>
              <span className="text-[11px] text-teal-600 dark:text-teal-400">
                CLSI Secured
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleAutoFillFields}
                className="px-4 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                title="Fill fields with standard demo credentials"
              >
                Auto-Fill Demo
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isRegisterActive ? "Register & Enter" : "Verify & Sign-In"}</span>
              </button>
            </div>
          </form>

          <div className="text-center pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">or sign in with clinical network</span>
            {renderSocials()}
          </div>
        </div>
      </div>

      {/* QUICK 1-CLICK DEMO ACCOUNTS FLOATING FOOTER PANEL */}
      <div className="mt-8 w-full max-w-4xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Quick 1-Click Demo Login (डेमो लॉगिन - तुरंत प्रवेश करें):</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Click any role to bypass credentials</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("doctor")}
            className="p-3 rounded-2xl bg-teal-50/50 hover:bg-teal-100/80 dark:bg-teal-950/10 dark:hover:bg-teal-950/30 text-teal-800 dark:text-teal-300 text-left transition-all cursor-pointer border border-teal-100 dark:border-teal-900 flex flex-col justify-between group hover:scale-102 active:scale-98"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-xs flex items-center space-x-1">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>Dr. Vance</span>
              </span>
              <span className="text-[9px] bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 px-1.5 py-0.5 rounded-full uppercase font-black tracking-tight scale-90">Doc</span>
            </div>
            <span className="text-[9px] opacity-75 mt-1 font-mono text-slate-400 group-hover:text-teal-600 transition-colors">dr.vance / DocPass@2026</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin("admin")}
            className="p-3 rounded-2xl bg-amber-50/50 hover:bg-amber-100/80 dark:bg-amber-950/10 dark:hover:bg-amber-950/30 text-amber-900 dark:text-amber-300 text-left transition-all cursor-pointer border border-amber-100 dark:border-amber-900 flex flex-col justify-between group hover:scale-102 active:scale-98"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-xs flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Dr. Alok (Admin)</span>
              </span>
              <span className="text-[9px] bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-300 px-1.5 py-0.5 rounded-full uppercase font-black tracking-tight scale-90">Adm</span>
            </div>
            <span className="text-[9px] opacity-75 mt-1 font-mono text-slate-400 group-hover:text-amber-600 transition-colors">ADMIN-8801 / AdminPass</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin("patient")}
            className="p-3 rounded-2xl bg-cyan-50/50 hover:bg-cyan-100/80 dark:bg-cyan-950/10 dark:hover:bg-cyan-950/30 text-cyan-900 dark:text-cyan-300 text-left transition-all cursor-pointer border border-cyan-100 dark:border-cyan-900 flex flex-col justify-between group hover:scale-102 active:scale-98"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-xs flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-cyan-600" />
                <span>Rajesh (Patient)</span>
              </span>
              <span className="text-[9px] bg-cyan-100 dark:bg-cyan-900 text-cyan-900 dark:text-cyan-300 px-1.5 py-0.5 rounded-full uppercase font-black tracking-tight scale-90">Pat</span>
            </div>
            <span className="text-[9px] opacity-75 mt-1 font-mono text-slate-400 group-hover:text-cyan-600 transition-colors">UHID-2041 / PatPass</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin("user")}
            className="p-3 rounded-2xl bg-indigo-50/50 hover:bg-indigo-100/80 dark:bg-indigo-950/10 dark:hover:bg-indigo-950/30 text-indigo-900 dark:text-indigo-300 text-left transition-all cursor-pointer border border-indigo-100 dark:border-indigo-900 flex flex-col justify-between group hover:scale-102 active:scale-98"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-xs flex items-center space-x-1">
                <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pooja (Staff)</span>
              </span>
              <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-300 px-1.5 py-0.5 rounded-full uppercase font-black tracking-tight scale-90">Lab</span>
            </div>
            <span className="text-[9px] opacity-75 mt-1 font-mono text-slate-400 group-hover:text-indigo-600 transition-colors">STF-4029 / StaffPass</span>
          </button>
        </div>
      </div>

      {/* PROJECT CREATORS & PRESENTERS SECTION */}
      <div className="mt-8 mb-12 w-full max-w-4xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-lg text-center">
        <div className="flex items-center justify-center space-x-2 mb-5">
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          <span className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase font-mono px-3">
            Project Developers & Presenters / परियोजना विकास दल
          </span>
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Yash Pardhi */}
          <div className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs hover:border-teal-500/40 transition-all group">
            <div className="shrink-0 relative">
              <img
                src="/yash_photo.jpg"
                alt="Yash Pardhi"
                referrerPolicy="no-referrer"
                className="w-20 h-26 object-cover object-center rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm aspect-[3/4]"
              />
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-teal-600 text-white font-mono text-[8px] font-black rounded-full uppercase tracking-tight shadow-xs">
                Coder
              </span>
            </div>
            <div className="text-left space-y-1">
              <h5 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                Yash Pardhi
              </h5>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold font-mono">
                Lead Developer & Website Architect
              </p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-relaxed font-sans">
                Full coding, logic, UI architecture and complete system development.
              </p>
            </div>
          </div>

          {/* Mohammad Muaaj Mansuri */}
          <div className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs hover:border-teal-500/40 transition-all group">
            <div className="shrink-0 relative">
              <img
                src="/muaaj_photo.jpg"
                alt="Mohammad Muaaj Mansuri"
                referrerPolicy="no-referrer"
                className="w-20 h-26 object-cover object-center rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm aspect-[3/4]"
              />
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-slate-500 text-white font-mono text-[8px] font-black rounded-full uppercase tracking-tight shadow-xs">
                Presenter
              </span>
            </div>
            <div className="text-left space-y-1">
              <h5 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-slate-300 transition-colors">
                Mohammad Muaaj Mansuri
              </h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono">
                Project Presenter & Introducer
              </p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-relaxed font-sans">
                Introduces, pitches, and defines the presentation goals for our team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Recovery Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-600 dark:text-rose-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Recover Security Password</h3>
                  <p className="text-[10px] text-slate-400">Enter verification info to retrieve key</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Error or Success alerts */}
            {forgotError && (
              <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-200/50 dark:border-rose-900/40 font-semibold">
                {forgotError}
              </div>
            )}
            {forgotMessage && (
              <div className="p-3 text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200/50 dark:border-emerald-900/40 space-y-2">
                <div className="font-semibold">{forgotMessage}</div>
                {recoveredPassword && (
                  <div className="p-2.5 font-mono text-center text-sm font-black tracking-wider bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-800 select-all cursor-pointer" title="Double click to select">
                    {recoveredPassword}
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleForgotPassword} className="space-y-3 text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Credential Username / Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. yashpardhi391@gmail.com or dr.vance"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Registered Full Name (For verification)
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yash pardhi or Dr. Vance"
                    value={forgotFullName}
                    onChange={(e) => setForgotFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer text-center"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer text-center shadow-md"
                >
                  Retrieve Password
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
