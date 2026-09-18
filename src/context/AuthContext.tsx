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
  resetOrUpdatePassword: (email: string, newPassword: string) => Promise<boolean>;
  firebaseSignUp: (email: string, password: string, profile: Partial<UserAccount>) => Promise<void>;
  firebaseSignIn: (email: string, password: string, fallbackRole?: UserRole) => Promise<void>;
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

  const resetOrUpdatePassword = async (email: string, newPassword: string) => {
    const normEmail = email.toLowerCase().trim();
    const cleanPass = newPassword.trim();
    const docId = `usr_${normEmail.replace(/[^a-z0-9]/g, "_")}`;

    // 1. Update Firestore Cloud
    try {
      await setDoc(
        doc(db, "users", docId),
        {
          email: normEmail,
          password: cleanPass,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Firestore reset password error:", e);
    }

    // 2. Update localStorage
    try {
      const stored = localStorage.getItem("pharmashield_local_users");
      let localUsers: Array<{ email: string; password?: string; profile: any }> = stored ? JSON.parse(stored) : [];
      const idx = localUsers.findIndex((u) => u.email.toLowerCase().trim() === normEmail);
      if (idx >= 0) {
        localUsers[idx].password = cleanPass;
      } else {
        localUsers.push({
          email: normEmail,
          password: cleanPass,
          profile: {
            id: `USR-${Date.now()}`,
            name: normEmail.split("@")[0],
            email: normEmail,
            role: "doctor",
            isVerified: true,
          },
        });
      }
      localStorage.setItem("pharmashield_local_users", JSON.stringify(localUsers));
    } catch (e) {
      console.error(e);
    }

    return true;
  };

  const firebaseSignUp = async (email: string, password: string, profile: Partial<UserAccount>) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const cleanPass = password.trim();

      // 1. Get existing local users
      let localUsers: Array<{ email: string; password?: string; profile: UserAccount }> = [];
      try {
        const stored = localStorage.getItem("pharmashield_local_users");
        if (stored) {
          localUsers = JSON.parse(stored);
        }
      } catch {}

      // 2. Check local uniqueness
      const existsLocally = localUsers.some((u) => u.email.toLowerCase().trim() === normalizedEmail);

      // 3. Create profile
      const uid = profile.id || `USR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const fullProfile: UserAccount = {
        id: uid,
        role: profile.role || "doctor",
        name: profile.name || email.split("@")[0],
        email: normalizedEmail,
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
      if (existsLocally) {
        const idx = localUsers.findIndex((u) => u.email.toLowerCase().trim() === normalizedEmail);
        localUsers[idx] = { email: normalizedEmail, password: cleanPass, profile: fullProfile };
      } else {
        localUsers.push({
          email: normalizedEmail,
          password: cleanPass,
          profile: fullProfile,
        });
      }
      localStorage.setItem("pharmashield_local_users", JSON.stringify(localUsers));

      // 5. Direct Cloud Sync to Firestore collection 'users'
      try {
        const cloudDocId = `usr_${normalizedEmail.replace(/[^a-z0-9]/g, "_")}`;
        const cloudRecord = {
          ...fullProfile,
          password: cleanPass,
          email: normalizedEmail,
          updatedAt: new Date().toISOString(),
        };
        await setDoc(doc(db, "users", cloudDocId), cloudRecord);
      } catch (e) {
        console.warn("Firestore user backup error (non-blocking):", e);
      }

      setUser({
        ...fullProfile,
        sessionToken: `CLOUD-${uid.slice(0, 6)}`,
        loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setIsAuthModalOpen(false);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  const firebaseSignIn = async (email: string, password: string, fallbackRole?: UserRole) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    try {
      const cleanEmail = (email || "").trim();
      const cleanPass = (password || "").trim();
      const normalizedInput = cleanEmail.toLowerCase();

      // 1. Check ALL Demo Persona Variations first
      if (
        normalizedInput.includes("dr.vance") ||
        normalizedInput.includes("vance") ||
        normalizedInput === "doc-8921" ||
        normalizedInput.startsWith("dr.vance")
      ) {
        loginAsDoctor();
        setIsLoading(false);
        return;
      }

      if (
        normalizedInput === "admin" ||
        normalizedInput.includes("alok") ||
        normalizedInput === "admin-8801" ||
        normalizedInput === "adm-8801" ||
        normalizedInput === "admin-icmr-ncr-8801"
      ) {
        loginAsAdmin();
        setIsLoading(false);
        return;
      }

      if (
        normalizedInput.includes("rajesh") ||
        normalizedInput.includes("uhid-2041") ||
        normalizedInput.includes("uhid-2026") ||
        normalizedInput === "pat-2041"
      ) {
        loginAsPatient();
        setIsLoading(false);
        return;
      }

      if (
        normalizedInput.includes("pooja") ||
        normalizedInput.includes("stf-4029") ||
        normalizedInput.includes("stf-lab")
      ) {
        loginAsUser();
        setIsLoading(false);
        return;
      }

      // 2. Identify Project Architect & Developer (Yash Pardhi)
      const isLeadArchitect = 
        normalizedInput === "yashpardhi391@gmail.com" || 
        normalizedInput === "yash" || 
        normalizedInput === "yash pardhi" ||
        normalizedInput.includes("yashpardhi");

      // 3. Search local device storage
      let localUsers: Array<{ email: string; password?: string; profile: UserAccount }> = [];
      try {
        const stored = localStorage.getItem("pharmashield_local_users");
        if (stored) {
          localUsers = JSON.parse(stored);
        }
      } catch {}

      const inputPrefix = normalizedInput.split("@")[0];
      const localFound = localUsers.find((u) => {
        const uEmail = (u.email || "").toLowerCase().trim();
        const uPrefix = uEmail.split("@")[0];
        const uName = (u.profile?.name || "").toLowerCase().trim();

        return (
          uEmail === normalizedInput ||
          uPrefix === inputPrefix ||
          uName === normalizedInput ||
          (u.profile?.uhid && u.profile.uhid.toLowerCase().trim() === normalizedInput) ||
          (u.profile?.adminId && u.profile.adminId.toLowerCase().trim() === normalizedInput) ||
          (u.profile?.staffId && u.profile.staffId.toLowerCase().trim() === normalizedInput) ||
          (u.profile?.medicalLicenseNo && u.profile.medicalLicenseNo.toLowerCase().trim() === normalizedInput)
        );
      });

      if (localFound) {
        const savedPass = (localFound.password || "").trim();
        // Strict password check
        if (savedPass) {
          const passMatches = 
            savedPass === cleanPass ||
            (isLeadArchitect && (cleanPass.toLowerCase() === "b pharmacy 2026" || cleanPass === "Yash@2026"));
          
          if (!passMatches) {
            throw new Error("auth/wrong-password");
          }
        }

        setUser({
          ...localFound.profile,
          sessionToken: `LOCAL-${localFound.profile.id.slice(0, 6)}`,
          loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        setIsAuthModalOpen(false);
        setIsLoading(false);
        return;
      }

      // 4. CROSS-DEVICE CLOUD SYNC: Query Firestore Cloud Database
      try {
        const cloudDocId = `usr_${normalizedInput.replace(/[^a-z0-9]/g, "_")}`;
        const docSnap = await getDoc(doc(db, "users", cloudDocId));
        let cloudUser: any = null;

        if (docSnap.exists()) {
          cloudUser = docSnap.data();
        } else {
          // Fallback query across collection
          const { collection, getDocs, query, where } = await import("firebase/firestore");
          const q = query(collection(db, "users"), where("email", "==", normalizedInput));
          const snap = await getDocs(q);
          if (!snap.empty) {
            cloudUser = snap.docs[0].data();
          }
        }

        if (cloudUser) {
          const savedPass = (cloudUser.password || "").trim();
          if (savedPass) {
            const passMatches = 
              savedPass === cleanPass ||
              (isLeadArchitect && (cleanPass.toLowerCase() === "b pharmacy 2026" || cleanPass === "Yash@2026"));
            
            if (!passMatches) {
              throw new Error("auth/wrong-password");
            }
          }

          const userProfile: UserAccount = {
            id: cloudUser.id || `USR-${Date.now()}`,
            role: cloudUser.role || fallbackRole || "doctor",
            name: cloudUser.name || cleanEmail.split("@")[0],
            email: cloudUser.email || normalizedInput,
            phone: cloudUser.phone || "",
            adminId: cloudUser.adminId || (cloudUser.role === "admin" ? normalizedInput : undefined),
            securityClearance: cloudUser.securityClearance || "",
            auditScope: cloudUser.auditScope || "",
            medicalLicenseNo: cloudUser.medicalLicenseNo || "",
            hospitalName: cloudUser.hospitalName || "AIIMS Apex Antimicrobial Center",
            department: cloudUser.department || "",
            designation: cloudUser.designation || "",
            uhid: cloudUser.uhid || "",
            staffId: cloudUser.staffId || "",
            isVerified: true,
            twoFactorEnabled: false,
          };

          // Cache on this device
          localUsers.push({
            email: normalizedInput,
            password: savedPass || cleanPass,
            profile: userProfile,
          });
          localStorage.setItem("pharmashield_local_users", JSON.stringify(localUsers));

          setUser({
            ...userProfile,
            sessionToken: `CLOUD-${userProfile.id.slice(0, 6)}`,
            loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });
          setIsAuthModalOpen(false);
          setIsLoading(false);
          return;
        }
      } catch (err: any) {
        if (err.message === "auth/wrong-password") {
          throw err;
        }
        console.warn("Firestore lookup check warning:", err);
      }

      // 5. Special Recognition for Project Architect (Yash Pardhi)
      if (isLeadArchitect) {
        // Enforce Yash's exact password: "B Pharmacy 2026" (or fallback "Yash@2026")
        const isCorrectYashPass = cleanPass.toLowerCase() === "b pharmacy 2026" || cleanPass === "Yash@2026";
        if (!isCorrectYashPass) {
          throw new Error("auth/wrong-password");
        }

        const architectRole = fallbackRole || "admin";
        const uid = "USR-YASH-ARCHITECT";
        const architectProfile: UserAccount = {
          id: uid,
          role: architectRole,
          name: "Yash Pardhi",
          email: "yashpardhi391@gmail.com",
          phone: "+91 98765 00000",
          hospitalName: "AIIMS Apex Antimicrobial Governance Directorate",
          department: "Project Architecture & Clinical Informatics",
          designation: "Lead Developer & System Architect",
          adminId: "ADMIN-YASH-DIR",
          securityClearance: "Level 4 (Directorate Governance Clearance)",
          auditScope: "All Hospital Wards & Global Antibiogram Repositories",
          isVerified: true,
          twoFactorEnabled: true,
        };

        const existingIdx = localUsers.findIndex((u) => u.email.toLowerCase().trim() === "yashpardhi391@gmail.com");
        if (existingIdx >= 0) {
          localUsers[existingIdx] = { email: "yashpardhi391@gmail.com", password: cleanPass, profile: architectProfile };
        } else {
          localUsers.push({ email: "yashpardhi391@gmail.com", password: cleanPass, profile: architectProfile });
        }
        localStorage.setItem("pharmashield_local_users", JSON.stringify(localUsers));

        try {
          const cloudDocId = "usr_yashpardhi391_gmail_com";
          await setDoc(doc(db, "users", cloudDocId), {
            ...architectProfile,
            password: "B Pharmacy 2026",
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        } catch (e) {
          console.warn("Firestore save architect:", e);
        }

        setUser({
          ...architectProfile,
          sessionToken: "ARCHITECT-ROOT",
          loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        setIsAuthModalOpen(false);
        setIsLoading(false);
        return;
      }

      // If user does not exist in local storage or cloud, throw user-not-found
      throw new Error("auth/user-not-found");
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
        resetOrUpdatePassword,
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
