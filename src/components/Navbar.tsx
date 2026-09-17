import React, { useState } from "react";
import {
  Shield,
  Dna,
  ChevronDown,
  User,
  Activity,
  FileSpreadsheet,
  ScanLine,
  Menu,
  X,
  Database,
  CheckCircle2,
  KeyRound,
  Building2,
  Sun,
  Moon,
  GraduationCap,
  Lock,
  LogIn,
  LogOut,
  Stethoscope,
  RefreshCw,
  ShieldCheck,
  FlaskConical,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

export type NavTabId = "overview" | "dashboard" | "scanner" | "hospital" | "explainer" | "analytics" | "records";

export interface NavbarProps {
  activeTab?: string;
  onSelectTab?: (tab: any) => void;
  onTabChange?: (tab: any) => void;
  savedRecordsCount?: number;
  recordsCount?: number;
  aiOnline?: boolean;
  onOpenCodePortal?: () => void;
  onOpenCodeLookup?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab: propActiveTab,
  onSelectTab,
  onTabChange,
  savedRecordsCount,
  recordsCount,
  aiOnline = true,
  onOpenCodePortal,
  onOpenCodeLookup,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const {
    user,
    isAuthenticated,
    openAuthModal,
    logout,
    loginAsAdmin,
    loginAsDoctor,
    loginAsPatient,
    loginAsUser,
  } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine current active page based on pathname or prop
  const currentPath = location.pathname;
  const activeTab =
    propActiveTab ||
    (currentPath === "/"
      ? "overview"
      : currentPath === "/scanner"
      ? "scanner"
      : currentPath === "/hospital-suite"
      ? "hospital"
      : currentPath === "/host-susceptibility"
      ? "explainer"
      : currentPath === "/analytics"
      ? "analytics"
      : currentPath === "/records"
      ? "records"
      : currentPath === "/admin"
      ? "admin"
      : currentPath === "/patient-portal"
      ? "patient-portal"
      : currentPath === "/login"
      ? "login"
      : "overview");

  const handleSelectTab = (tabId: string) => {
    if (typeof onSelectTab === "function") {
      onSelectTab(tabId);
    }
    if (typeof onTabChange === "function") {
      onTabChange(tabId);
    }

    if (tabId === "overview" || tabId === "dashboard") navigate("/");
    else if (tabId === "scanner") navigate("/scanner");
    else if (tabId === "hospital") navigate("/hospital-suite");
    else if (tabId === "explainer") navigate("/host-susceptibility");
    else if (tabId === "analytics") navigate("/analytics");
    else if (tabId === "records") navigate("/records");
    else if (tabId === "admin") navigate("/admin");
    else if (tabId === "patient-portal") navigate("/patient-portal");
    else if (tabId === "login") navigate("/login");
  };

  const openCodeModal = onOpenCodePortal || onOpenCodeLookup;
  const totalRecordsCount = savedRecordsCount ?? recordsCount ?? 0;

  const navItems = [
    { id: "overview", path: "/", label: "Overview", icon: Activity },
    { id: "scanner", path: "/scanner", label: "Dual Scanner", icon: ScanLine },
    { id: "hospital", path: "/hospital-suite", label: "Hospital Suite", icon: Building2, highlight: true, highlightBadge: "ICU Lab" },
    { id: "explainer", path: "/host-susceptibility", label: "Host Immunity", icon: GraduationCap },
    { id: "analytics", path: "/analytics", label: "Lab Analytics", icon: FileSpreadsheet },
    { id: "records", path: "/records", label: "Patient Records", icon: Database, badge: totalRecordsCount },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => handleSelectTab("overview")}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 group-hover:border-teal-500 transition-all shadow-sm">
              <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <Dna className="w-3 h-3 text-cyan-500 dark:text-cyan-300 absolute" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Pharma<span className="text-teal-600 dark:text-teal-400">Resist</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30">
                  PRO
                </span>
              </div>
              <span className="text-[10px] tracking-wide text-slate-500 dark:text-teal-400/90 font-medium">
                Anti-Bacterial Resistance (AMR) Suite
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === "overview" && activeTab === "dashboard");
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-slate-800 border border-teal-200 dark:border-teal-500/40 shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                  {"highlightBadge" in item && item.highlightBadge && (
                    <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                      {item.highlightBadge}
                    </span>
                  )}
                  {item.badge !== undefined && (
                    <span className="ml-1 text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-cyan-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Area */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              type="button"
              aria-label={theme === "dark" ? "Switch to Clean Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={theme === "dark" ? "Switch to Clean Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Quick Access Code Lookup Button */}
            {openCodeModal && (
              <button
                type="button"
                id="navbar-code-lookup-btn"
                onClick={openCodeModal}
                aria-label="Enter unique verification code to load report"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 hover:bg-teal-100 dark:hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40 text-xs font-mono font-semibold transition-all cursor-pointer shadow-xs"
                title="Enter Unique Verification Code to load official report"
              >
                <KeyRound className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Verify Code</span>
              </button>
            )}

            {/* AI Engine Status Badge */}
            <div
              id="ai-engine-status-badge"
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-[11px] tracking-wide">
                {aiOnline ? "AI Active" : "Ready"}
              </span>
            </div>

            {/* User Profile / Security Login Dropdown (Desktop) */}
            <div className="relative hidden md:block">
              {!isAuthenticated || !user ? (
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    id="navbar-security-login-btn"
                    onClick={() => navigate("/login")}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    title="Sign In with Admin, Doctor, Patient, or Staff credentials"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    id="user-profile-button"
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="User profile and security actions"
                    className="flex items-center space-x-2 p-1.5 pl-2 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
                    aria-expanded={profileOpen}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs font-mono shadow-xs ${
                        user.role === "admin"
                          ? "bg-amber-500 text-slate-950"
                          : user.role === "doctor"
                          ? "bg-teal-600"
                          : user.role === "patient"
                          ? "bg-cyan-600"
                          : "bg-indigo-600"
                      }`}
                    >
                      {user.role === "admin"
                        ? "ADM"
                        : user.role === "doctor"
                        ? "DR"
                        : user.role === "patient"
                        ? "PT"
                        : "STF"}
                    </div>
                    <div className="text-left pr-1">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[110px]">
                        {user.name.split(",")[0]}
                      </div>
                      <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 capitalize">
                        {user.role} Portal
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => logout()}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-all cursor-pointer shadow-2xs"
                    title="Sign Out & Lock Session (लॉगआउट)"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">Sign Out</span>
                  </button>

                  {profileOpen && (
                    <div
                      id="profile-dropdown-menu"
                      className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 mb-1">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              user.role === "admin"
                                ? "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300"
                                : user.role === "doctor"
                                ? "bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300"
                                : user.role === "patient"
                                ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300"
                                : "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300"
                            }`}
                          >
                            {user.role === "admin"
                              ? "Directorate Admin"
                              : user.role === "doctor"
                              ? "Physician / Lead"
                              : user.role === "patient"
                              ? "Patient Account"
                              : "Laboratory Staff"}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>AES-256</span>
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {user.role === "admin"
                            ? user.adminId || "Apex Directorate"
                            : user.role === "doctor"
                            ? user.hospitalName
                            : user.role === "patient"
                            ? user.uhid
                            : user.staffId || "Microbiology Lab"}
                        </p>
                      </div>

                      {/* Quick 1-Click Role Switchers */}
                      <div className="p-1 mb-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/70 dark:border-slate-800/70 grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            loginAsAdmin();
                            setProfileOpen(false);
                            navigate("/admin");
                          }}
                          className="px-2 py-1.5 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/50 font-semibold transition-colors text-left flex items-center space-x-1 cursor-pointer"
                        >
                          <ShieldCheck className="w-3 h-3 text-amber-500" />
                          <span>Admin View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            loginAsDoctor();
                            setProfileOpen(false);
                            navigate("/hospital-suite");
                          }}
                          className="px-2 py-1.5 rounded-lg text-[11px] text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-950/50 font-semibold transition-colors text-left flex items-center space-x-1 cursor-pointer"
                        >
                          <Stethoscope className="w-3 h-3 text-teal-500" />
                          <span>Doctor View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            loginAsPatient();
                            setProfileOpen(false);
                            navigate("/patient-portal");
                          }}
                          className="px-2 py-1.5 rounded-lg text-[11px] text-cyan-800 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-950/50 font-semibold transition-colors text-left flex items-center space-x-1 cursor-pointer"
                        >
                          <User className="w-3 h-3 text-cyan-500" />
                          <span>Patient View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            loginAsUser();
                            setProfileOpen(false);
                            navigate("/scanner");
                          }}
                          className="px-2 py-1.5 rounded-lg text-[11px] text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 font-semibold transition-colors text-left flex items-center space-x-1 cursor-pointer"
                        >
                          <FlaskConical className="w-3 h-3 text-indigo-500" />
                          <span>Staff View</span>
                        </button>
                      </div>

                      <div className="space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                          <span>Admin Directorate Suite</span>
                        </Link>
                        <Link
                          to="/patient-portal"
                          onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-cyan-500" />
                          <span>Patient Pathology Portal</span>
                        </Link>
                        <Link
                          to="/hospital-suite"
                          onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                        >
                          <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          <span>Hospital Comparison Suite</span>
                        </Link>
                        <Link
                          to="/login"
                          onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                          <span>Switch Account / Sign In Page</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Lock Session &amp; Sign Out</span>
                        </button>
                      </div>
                      <div className="pt-2 mt-1 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 px-3 py-1 flex justify-between items-center font-mono">
                        <span>HIPAA / CLSI Certified</span>
                        <span className="text-teal-600 dark:text-teal-400">Encrypted</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center">
              <button
                id="mobile-menu-toggle"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                title="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick-Tabs Bar */}
      <div className="lg:hidden border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/90 px-2 py-1.5 overflow-x-auto scrollbar-none flex items-center space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === "overview" && activeTab === "dashboard");
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/40 shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400"}`} />
              <span className="whitespace-nowrap">{item.label}</span>
              {"highlightBadge" in item && item.highlightBadge && (
                <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  {item.highlightBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === "overview" && activeTab === "dashboard");
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-teal-50 dark:bg-slate-800 text-teal-900 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-cyan-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          {openCodeModal && (
            <button
              onClick={() => {
                openCodeModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/40 mt-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Verify by Report Code</span>
            </button>
          )}

          {/* Mobile User Profile / Auth Control */}
          <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800">
            {isAuthenticated && user ? (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs font-mono ${
                        user.role === "doctor" ? "bg-teal-600" : "bg-cyan-600"
                      }`}
                    >
                      {user.role === "doctor" ? "DR" : "PT"}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user.name}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{user.role} Portal</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-xs font-semibold cursor-pointer flex items-center space-x-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (user.role === "doctor") {
                        loginAsPatient();
                      } else {
                        loginAsDoctor();
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Switch Role</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal(user.role === "doctor" ? "patient" : "doctor", "signin");
                      setMobileMenuOpen(false);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Security Portal</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  openAuthModal("doctor", "signin");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Doctor / Patient Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
