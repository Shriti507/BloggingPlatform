"use client";

import { canCreatePosts } from "@/lib/auth/roleChecks";
import { createClient } from "@/lib/supabase/client";
import { fetchUserProfile } from "@/services/userService";
import { signOut as authSignOut } from "@/services/authService";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mockRole, setMockRole] = useState(null);

  // Sync mockRole from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("explorer_mock_role");
    if (saved) setMockRole(saved);
  }, []);

  const updateMockRole = useCallback((role) => {
    setMockRole(role);
    if (role) {
      localStorage.setItem("explorer_mock_role", role);
    } else {
      localStorage.removeItem("explorer_mock_role");
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function applySession(s) {
      setSession(s);

      if (!s?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      
      const { profile, error: profErr } = await fetchUserProfile(
        supabase,
        s.user.id,
        s.user.user_metadata
      );

      if (profErr) console.error("fetchUserProfile:", profErr);

      if (!cancelled) {
        setUser(profile);
        setLoading(false);
      }
    }

    // Initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!cancelled) applySession(s);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setTimeout(() => {
        if (!cancelled) applySession(newSession);
      }, 0);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const refreshUser = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);

    const {
      data: { session: s },
    } = await supabase.auth.getSession();

    setSession(s);

    if (!s?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    
    const { profile } = await fetchUserProfile(
      supabase,
      s.user.id,
      s.user.user_metadata
    );

    setUser(profile);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await authSignOut();
    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo(() => {
    const activeUser = user ? { ...user, role: mockRole || user.role } : null;
    const role = activeUser?.role || "viewer";

    return {
      session,
      user: activeUser,
      loading,
      refreshUser,
      logout,
      isLoggedIn: Boolean(session?.user),
      canWrite: canCreatePosts(role),
      isAdmin: role === "admin",
      isAuthor: role === "author",
      isViewer: role === "viewer",
      mockRole,
      setMockRole: updateMockRole,
    };
  }, [session, user, loading, refreshUser, logout, mockRole, updateMockRole]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}