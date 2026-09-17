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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BloodGroup, UserRole } from "../types";
import { useNavigate } from "react-router-dom";

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
  } = useAuth();

  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>("doctor");
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Doctor Form
  const [docUsername, setDocUsername] = useState("dr.vance@aiims-amr.org");
  const [docPassword, setDocPassword] = useState("DocPass@2026");
  const [docLicense, setDocLicense] = useState("MCI-ND-2016-84920");
  const [docHospital, setDocHospital] = useState("AIIMS Apex Antimicrobial Center");
  const [docName, setDocName] = useState("");

  // Admin Form
  const [adminUsername, setAdminUsername] = useState("ADMIN-ICMR-NCR-8801");
  const [adminPassword, setAdminPassword] = useState("AdminPass@2026");
  const [adminEmail, setAdminEmail] = useState("admin.director@aiims-amr.org");
  const [adminName, setAdminName] = useState("");

  // Patient Form
  const [patUsername, setPatUsername] = useState("UHID-2026-P204119");
  const [patPassword, setPatPassword] = useState("PatPass@2026");
  const [patPhone, setPatPhone] = useState("+91 94120 58392");
  const [patName, setPatName] = useState("");
  const [patBloodGroup, setPatBloodGroup] = useState<BloodGroup>("O+");
  const [patReportCode, setPatReportCode] = useState("PRP-2041-1092-8801");

  // Staff Form
  const [staffUsername, setStaffUsername] = useState("STF-LAB-4029");
  const [staffPassword, setStaffPassword] = useState("StaffPass@2026");
  const [staffEmail, setStaffEmail] = useState("pooja.nair@aiims-amr.org");
  const [staffName, setStaffName] = useState("");
  const [staffBranch, setStaffBranch] = useState("Central Bacteriology Wing");

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
  const handleSubmit = (e: React.FormEvent, isRegisterForm: boolean) => {
    e.preventDefault();
    setErrorMsg("");

    if (role === "doctor") {
      if (!docUsername.trim()) {
        setErrorMsg("Please enter Doctor Username / Email");
        return;
      }
      if (!docPassword.trim()) {
        setErrorMsg("Please enter password");
        return;
      }
      if (!isRegisterForm) {
        loginAsDoctor(docUsername, docLicense);
        navigate("/");
      } else {
        if (!docName.trim()) {
          setErrorMsg("Please enter Doctor Name");
          return;
        }
        loginCustom({
          id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
          role: "doctor",
          name: docName.startsWith("Dr.") ? docName : `Dr. ${docName}`,
          email: docUsername,
          medicalLicenseNo: docLicense || "MCI-REG-PENDING",
          hospitalName: docHospital,
          department: "Infectious Diseases & Clinical Stewardship",
          designation: "Attending Consultant / Stewardship Officer",
          isVerified: true,
          twoFactorEnabled: true,
        });
        navigate("/");
      }
    } else if (role === "admin") {
      if (!adminUsername.trim()) {
        setErrorMsg("Please enter Admin ID");
        return;
      }
      if (!adminPassword.trim()) {
        setErrorMsg("Please enter password");
        return;
      }
      if (!isRegisterForm) {
        loginAsAdmin(adminUsername, adminEmail);
        navigate("/admin");
      } else {
        if (!adminName.trim()) {
          setErrorMsg("Please enter Admin Name");
          return;
        }
        loginCustom({
          id: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
          role: "admin",
          name: adminName,
          email: adminEmail,
          adminId: adminUsername,
          securityClearance: "Level 4 (Directorate Governance)",
          hospitalName: "AIIMS Apex Antimicrobial Governance Directorate",
          isVerified: true,
          twoFactorEnabled: true,
        });
        navigate("/admin");
      }
    } else if (role === "patient") {
      if (!patUsername.trim()) {
        setErrorMsg("Please enter Patient UHID");
        return;
      }
      if (!patPassword.trim()) {
        setErrorMsg("Please enter password");
        return;
      }
      if (!isRegisterForm) {
        loginAsPatient(patUsername, patReportCode);
        navigate("/patient-portal");
      } else {
        if (!patName.trim()) {
          setErrorMsg("Please enter Patient Name");
          return;
        }
        loginCustom({
          id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
          role: "patient",
          name: patName,
          email: `${patName.toLowerCase().replace(/\s+/g, ".")}@patient-portal.org`,
          phone: patPhone,
          uhid: patUsername,
          bloodGroup: patBloodGroup,
          associatedReportCode: patReportCode || "PRP-2041-1092-8801",
          wardOrBed: "General Medical Ward - Bed 08",
          isVerified: true,
        });
        navigate("/patient-portal");
      }
    } else if (role === "user") {
      if (!staffUsername.trim()) {
        setErrorMsg("Please enter Staff ID");
        return;
      }
      if (!staffPassword.trim()) {
        setErrorMsg("Please enter password");
        return;
      }
      if (!isRegisterForm) {
        loginAsUser(staffUsername, staffEmail);
        navigate("/scanner");
      } else {
        if (!staffName.trim()) {
          setErrorMsg("Please enter Staff Name");
          return;
        }
        loginCustom({
          id: `STF-${Math.floor(1000 + Math.random() * 9000)}`,
          role: "user",
          name: staffName,
          email: staffEmail,
          staffId: staffUsername,
          staffRole: "Senior Lab Microbiologist",
          laboratoryBranch: staffBranch,
          isVerified: true,
          twoFactorEnabled: true,
        });
        navigate("/scanner");
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
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
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

              <button
                type="submit"
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                <span>Verify & Sign-In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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

          {/* Active signin form trigger */}
          <div className="login-toggle-panel toggle-right px-10 text-center">
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
            <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
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

            <button
              type="submit"
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isRegisterActive ? "Register & Sign-In" : "Verify & Sign-In"}</span>
            </button>
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

    </div>
  );
};
