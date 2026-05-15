import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { request, ApiError } from "../lib/api";
import type { User } from "../types";

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type ServerUser = {
  id: number;
  userName: string;
  email?: string;
  role: "customer" | "admin";
};

const toUser = (u: ServerUser): User => ({
  id: String(u.id),
  email: u.email ?? "",
  name: u.userName,
  role: u.role,
});

const errorMessage = (e: unknown, fallback: string): string => {
  if (e instanceof ApiError) return e.message || fallback;
  if (e instanceof Error) return e.message;
  return fallback;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await request<ServerUser>("/users/userinfo");
        if (!cancelled) setUser(toUser(me));
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login: AuthContextValue["login"] = async (email, password) => {
    try {
      const u = await request<ServerUser>("/users/login", {
        method: "POST",
        body: { email, password },
      });
      setUser(toUser(u));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: errorMessage(e, "Failed to login") };
    }
  };

  const signup: AuthContextValue["signup"] = async (name, email, password) => {
    try {
      await request<ServerUser>("/users/signup/customer", {
        method: "POST",
        body: { userName: name, email, password },
      });
      return await login(email, password);
    } catch (e) {
      return { ok: false, error: errorMessage(e, "Failed to sign up") };
    }
  };

  const logout: AuthContextValue["logout"] = async () => {
    try {
      await request("/users/logout", { method: "POST" });
    } catch {
      // ignore — clear local state regardless
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
