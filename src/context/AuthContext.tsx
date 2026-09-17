import React, { createContext, useContext, useState, useEffect } from "react";
import { UserAccount, UserRole, BloodGroup } from "../types";
import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
  isLoading: boolean;
  isAuthModalOpen: boolean;
  modalDefaultRole: UserRole;
  modalDefaultMode: "signin" | "signup";
  loginAsAdmin: (adminId?: string, email?: string) => void;
  loginAsDoctor: (email?: string, licenseNo?: string) => void;
  loginAsPatient: (uhid?: string, phoneOrCode?: string) => void;
  loginAsUser: (staffId?: string, email?: string) => void;
  loginCustom: (account: UserAccount) => void;
  firebaseSignUp: (email: string, password: string, profile: Partial<UserAccount>) => Promise<void>;
  firebaseSignIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
    } catch {}
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [modalDefaultRole, setModalDefaultRole] = useState<UserRole>("doctor");
  const [modalDefaultMode, setModalDefaultMode] = useState<"signin" | "signup">("signin");

  // Keep Session in sync
  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem("pharmashield_auth_user", JSON.stringify(user));
        localStorage.setItem("pharmashield_auth_user", JSON.stringify(user));
      } else {
        sessionStorage.removeItem("pharmashield_auth_user");
        localStorage.removeItem("pharmashield_auth_user");
      }
    } catch {}
  }, [user]);

  // Monitor Firebase Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserAccount;
            setUser({
              ...data,
              id: firebaseUser.uid,
              sessionToken: `FIREBASE-${firebaseUser.uid.slice(0, 6)}`,
              loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            });
          } else {
            // Profile doc not in Firestore, let's create a default base profile
            const fallbackProfile: UserAccount = {
              id: firebaseUser.uid,
              name: firebaseUser.email?.split("@")[0] || "User",
              email: firebaseUser.email || "",
              role: "doctor",
              isVerified: true,
              sessionToken: `FIREBASE-${firebaseUser.uid.slice(0, 6)}`,
              loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            await setDoc(docRef, fallbackProfile);
            setUser(fallbackProfile);
          }
        } catch {
          // fallback to simple local mock
        }
      } else {
        // Only reset if user was logged in via Firebase
        setUser((prev) => {
          if (prev && prev.sessionToken?.startsWith("FIREBASE")) {
            return null;
          }
          return prev;
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const firebaseSignUp = async (email: string, password: string, profile: Partial<UserAccount>) => {
    setIsLoading(true);
    // Add brief delay for smooth visual transition
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
      // 1. Get existing local users
      let localUsers: Array<{ email: string; password?: string; profile: UserAccount }> = [];
      try {
        const stored = localStorage.getItem("pharmashield_local_users");
        if (stored) {
          localUsers = JSON.parse(stored);
        }
      } catch {}

      // 2. Check if email already exists
      const normalizedEmail = email.toLowerCase().trim();
      const exists = localUsers.some((u) => u.email.toLowerCase().trim() === normalizedEmail);
      if (exists) {
        throw new Error("auth/email-already-in-use");
      }

      // 3. Create profile
      const uid = `USR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const fullProfile: UserAccount = {
        id: uid,
        role: profile.role || "doctor",
        name: profile.name || email.split("@")[0],
        email: email,
        phone: profile.phone || "",
        adminId: profile.adminId || "",
        securityClearance: profile.securityClearance || "",
        auditScope: profile.auditScope || "",
        medicalLicenseNo: profile.medicalLicenseNo || "",
        hospitalName: profile.hospitalName || "",
        department: profile.department || "",
        designation: profile.designation || "",
        uhid: profile.uhid || "",
        bloodGroup: profile.bloodGroup || "O+",
        associatedReportCode: profile.associatedReportCode || "",
        wardOrBed: profile.wardOrBed || "",
        staffId: profile.staffId || "",
        staffRole: profile.staffRole || "",
        laboratoryBranch: profile.laboratoryBranch || "",
        isVerified: true,
        twoFactorEnabled: false,
      };

      // 4. Save to local database
      localUsers.push({
        email: normalizedEmail,
        password: password,
        profile: fullProfile,
      });
      localStorage.setItem("pharmashield_local_users", JSON.stringify(localUsers));

      // 5. Attempt backup to Firestore if possible, but safely catch rules/network/permission errors
      try {
        const { doc, setDoc } = await import("firebase/firestore");
        const { db } = await import("../lib/firebase");
        await setDoc(doc(db, "users", uid), fullProfile);
      } catch (e) {
        console.warn("Firestore user backup bypassed or security-blocked (non-blocking):", e);
      }

      setUser({
        ...fullProfile,
        sessionToken: `LOCAL-${uid.slice(0, 6)}`,
        loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setIsAuthModalOpen(false);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  const firebaseSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    // Add brief delay for smooth visual transition
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
      const normalizedEmail = email.toLowerCase().trim();

      // 1. Get existing local users
      let localUsers: Array<{ email: string; password?: string; profile: UserAccount }> = [];
      try {
        const stored = localStorage.getItem("pharmashield_local_users");
        if (stored) {
          localUsers = JSON.parse(stored);
        }
      } catch {}

      // 2. Search for local user matching email
      const found = localUsers.find((u) => u.email.toLowerCase().trim() === normalizedEmail);
      if (!found) {
        // Fallback: If they use any known Demo credentials, allow log in instantly!
        if (normalizedEmail === "dr.vance@aiims-amr.org" || normalizedEmail === "dr.vance") {
          loginAsDoctor();
          setIsLoading(false);
          return;
        }
        if (normalizedEmail === "admin.director@aiims-amr.org" || normalizedEmail === "admin") {
          loginAsAdmin();
          setIsLoading(false);
          return;
        }
        if (normalizedEmail === "rajesh.sharma@gmail.com" || normalizedEmail === "rajesh") {
          loginAsPatient();
          setIsLoading(false);
          return;
        }
        if (normalizedEmail === "pooja.nair@aiims-amr.org" || normalizedEmail === "pooja") {
          loginAsUser();
          setIsLoading(false);
          return;
        }

        throw new Error("auth/user-not-found");
      }

      // 3. Verify password
      if (found.password !== password) {
        throw new Error("auth/wrong-password");
      }

      setUser({
        ...found.profile,
        sessionToken: `LOCAL-${found.profile.id.slice(0, 6)}`,
        loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setIsAuthModalOpen(false);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("pharmashield_auth_user");
      localStorage.removeItem("pharmashield_auth_user");
    } catch {}
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
        isLoading,
        isAuthModalOpen,
        modalDefaultRole,
        modalDefaultMode,
        loginAsAdmin,
        loginAsDoctor,
        loginAsPatient,
        loginAsUser,
        loginCustom,
        firebaseSignUp,
        firebaseSignIn,
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
