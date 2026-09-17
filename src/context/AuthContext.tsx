import React, { createContext, useContext, useState, useEffect } from "react";
import { UserAccount, UserRole } from "../types";

export const DEMO_ADMIN: UserAccount = {
  id: "ADM-8801",
  role: "admin",
  name: "Dr. Alok Verma, MHA, FICMR",
  email: "admin.director@aiims-amr.org",
  phone: "+91 99881 22334",
  adminId: "ADMIN-ICMR-NCR-8801",
  securityClearance: "Level 4 (Full Governance & Audit Master)",
  auditScope: "All Hospital Wards, HICC Containment & AST Repositories",
  hospitalName: "AIIMS Apex Antimicrobial Governance Directorate",
  department: "Hospital Administration & Clinical Epidemiology",
  designation: "Medical Superintendent & AMR Surveillance Director",
  isVerified: true,
  twoFactorEnabled: true,
  sessionToken: "AUTH-SEC-256-ADMIN-8801",
  loginTime: "Active Session (Admin Governance Clearance)",
};

export const DEMO_DOCTOR: UserAccount = {
  id: "DOC-8921",
  role: "doctor",
  name: "Dr. Elena Vance, MD, FACP",
  email: "dr.vance@aiims-amr.org",
  phone: "+91 98765 43210",
  medicalLicenseNo: "MCI-ND-2016-84920",
  hospitalName: "AIIMS & ICMR AMR Surveillance Center",
  department: "Clinical Microbiology & Infectious Diseases",
  designation: "Chief Antimicrobial Stewardship Officer",
  isVerified: true,
  twoFactorEnabled: true,
  sessionToken: "AUTH-SEC-256-VANCE-8921",
  loginTime: "Active Session (Doctor Stewardship Clearance)",
};

export const DEMO_PATIENT: UserAccount = {
  id: "PAT-2041",
  role: "patient",
  name: "Rajesh Sharma",
  email: "rajesh.sharma@gmail.com",
  phone: "+91 94120 58392",
  uhid: "UHID-2026-P204119",
  bloodGroup: "O+",
  associatedReportCode: "PRP-2041-1092-8801",
  wardOrBed: "General Medical Ward - Bed 08",
  isVerified: true,
  twoFactorEnabled: false,
  sessionToken: "AUTH-SEC-256-SHARMA-2041",
  loginTime: "Active Session (Patient / Relative Portal)",
};

export const DEMO_USER: UserAccount = {
  id: "STF-4029",
  role: "user",
  name: "Pooja Nair, M.Sc (Microbiology)",
  email: "pooja.nair@aiims-amr.org",
  phone: "+91 97654 32190",
  staffId: "STF-LAB-4029",
  staffRole: "Senior Clinical Microbiologist & AST Technologist",
  laboratoryBranch: "Central Bacteriology & Automated AST Wing",
  department: "Diagnostic Microbiology & Culture Bench",
  hospitalName: "AIIMS Diagnostic Pathology Laboratories",
  isVerified: true,
  twoFactorEnabled: true,
  sessionToken: "AUTH-SEC-256-STAFF-4029",
  loginTime: "Active Session (Clinical Staff / Technologist)",
};

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  modalDefaultRole: UserRole;
  modalDefaultMode: "signin" | "signup";
  loginAsAdmin: (adminId?: string, email?: string) => void;
  loginAsDoctor: (email?: string, licenseNo?: string) => void;
  loginAsPatient: (uhid?: string, phoneOrCode?: string) => void;
  loginAsUser: (staffId?: string, email?: string) => void;
  loginCustom: (account: UserAccount) => void;
  logout: () => void;
  openAuthModal: (defaultRole?: UserRole, defaultMode?: "signin" | "signup") => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const sessionStored = sessionStorage.getItem("pharmashield_auth_user");
      if (sessionStored) {
        return JSON.parse(sessionStored);
      }
    } catch {
      // fallback
    }
    // Require username and password login on opening the website
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [modalDefaultRole, setModalDefaultRole] = useState<UserRole>("doctor");
  const [modalDefaultMode, setModalDefaultMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem("pharmashield_auth_user", JSON.stringify(user));
        localStorage.setItem("pharmashield_auth_user", JSON.stringify(user));
      } else {
        sessionStorage.removeItem("pharmashield_auth_user");
        localStorage.removeItem("pharmashield_auth_user");
      }
    } catch {
      // ignore
    }
  }, [user]);

  const loginAsAdmin = (adminId?: string, email?: string) => {
    const updated: UserAccount = {
      ...DEMO_ADMIN,
      adminId: adminId || DEMO_ADMIN.adminId,
      email: email || DEMO_ADMIN.email,
      sessionToken: `ADM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setUser(updated);
    setIsAuthModalOpen(false);
  };

  const loginAsDoctor = (email?: string, licenseNo?: string) => {
    const updated: UserAccount = {
      ...DEMO_DOCTOR,
      email: email || DEMO_DOCTOR.email,
      medicalLicenseNo: licenseNo || DEMO_DOCTOR.medicalLicenseNo,
      sessionToken: `DOC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setUser(updated);
    setIsAuthModalOpen(false);
  };

  const loginAsPatient = (uhid?: string, phoneOrCode?: string) => {
    const updated: UserAccount = {
      ...DEMO_PATIENT,
      uhid: uhid || DEMO_PATIENT.uhid,
      associatedReportCode: phoneOrCode || DEMO_PATIENT.associatedReportCode,
      sessionToken: `PAT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setUser(updated);
    setIsAuthModalOpen(false);
  };

  const loginAsUser = (staffId?: string, email?: string) => {
    const updated: UserAccount = {
      ...DEMO_USER,
      staffId: staffId || DEMO_USER.staffId,
      email: email || DEMO_USER.email,
      sessionToken: `STF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setUser(updated);
    setIsAuthModalOpen(false);
  };

  const loginCustom = (account: UserAccount) => {
    setUser({
      ...account,
      sessionToken: `${account.role.toUpperCase()}-${Date.now()}`,
      loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    try {
      sessionStorage.removeItem("pharmashield_auth_user");
      localStorage.removeItem("pharmashield_auth_user");
    } catch {
      // ignore
    }
    setUser(null);
  };

  const openAuthModal = (defaultRole: UserRole = "doctor", defaultMode: "signin" | "signup" = "signin") => {
    setModalDefaultRole(defaultRole);
    setModalDefaultMode(defaultMode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        modalDefaultRole,
        modalDefaultMode,
        loginAsAdmin,
        loginAsDoctor,
        loginAsPatient,
        loginAsUser,
        loginCustom,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
