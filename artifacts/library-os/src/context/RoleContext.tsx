import { createContext, useContext, useState, ReactNode } from "react";
import { setStoredAccessToken, type AuthSessionDTO, type Role as ApiRole } from "@/lib/api";

const SESSION_STORAGE_KEY = "library-os-session";

export type Role = "super-admin" | ApiRole;

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  session: AuthSessionDTO | null;
  setSession: (session: AuthSessionDTO | null) => void;
  clearSession: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSessionDTO | null>(() => {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved) as AuthSessionDTO;
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  });

  const [role, setRoleState] = useState<Role>(session?.user.role ?? "owner");

  const setSession = (nextSession: AuthSessionDTO | null) => {
    setSessionState(nextSession);

    if (nextSession === null) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setStoredAccessToken(null);
      return;
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    setStoredAccessToken(nextSession.accessToken);
    setRoleState(nextSession.user.role);
  };

  const clearSession = () => {
    setSessionState(null);
    setRoleState("owner");
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setStoredAccessToken(null);
  };

  const setRole = (nextRole: Role) => {
    setRoleState(nextRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, session, setSession, clearSession }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
