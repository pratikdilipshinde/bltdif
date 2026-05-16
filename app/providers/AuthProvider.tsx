"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type UserRole = "USER" | "ADMIN";

type AuthUser = {
  id: string;
  email: string;
  firstname?: string | null;
  lastname?: string | null;
  role: UserRole;
} | null;

type AuthContextType = {
  user: AuthUser;
  loading: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json().catch(() => null);

      setUser(data?.user ?? null);
    } catch (error) {
      console.error("Auth refresh failed:", error);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      setLoading(true);
      await refresh();

      if (mounted) {
        setLoading(false);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}