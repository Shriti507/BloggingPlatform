"use client";

import { createClient } from "@/lib/supabase/client";
import { ensurePublicUserRow } from "@/services/profileSyncService";
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
      const { error: ensureErr } = await ensurePublicUserRow(s.user);
      if (ensureErr) console.error("ensurePublicUserRow:", ensureErr);
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

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!cancelled) applySession(s);
    });

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
    await ensurePublicUserRow(s.user);
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

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      refreshUser,
      logout,
      isLoggedIn: Boolean(session?.user),
      canWrite: Boolean(
        user && (user.role === "author" || user.role === "admin")
      ),
      isAdmin: user?.role === "admin",
      isAuthor: user?.role === "author",
      isViewer: user?.role === "viewer",
    }),
    [session, user, loading, refreshUser, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
