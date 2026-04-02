"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

/** @typedef {'viewer' | 'author' | 'admin'} MockRole */

const AuthContext = createContext(null);

/** Options for mock login/signup role `<select>`. */
export const MOCK_ROLE_OPTIONS = [
  { value: "viewer", label: "Reader (viewer)" },
  { value: "author", label: "Author" },
  { value: "admin", label: "Admin" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /** @param {{ name: string, role: MockRole }} payload */
  const login = useCallback((payload) => {
    const name = (payload.name || "Member").trim() || "Member";
    const role = payload.role;
    if (role !== "viewer" && role !== "author" && role !== "admin") return;
    setUser({ name, role });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isLoggedIn: user != null,
      canWrite: Boolean(
        user && (user.role === "author" || user.role === "admin")
      ),
      isAdmin: user?.role === "admin",
      isAuthor: user?.role === "author",
      isViewer: user?.role === "viewer",
    }),
    [user, login, logout]
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
