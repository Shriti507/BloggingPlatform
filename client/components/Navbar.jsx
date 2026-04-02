"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/membership", label: "Membership" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
];

function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isLoggedIn, canWrite, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const closeMobile = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-[var(--nav-bg)]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link
            href="/"
            className="shrink-0 text-lg font-semibold tracking-tight text-neutral-900 transition hover:text-neutral-600"
            onClick={closeMobile}
          >
            Explorer
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "text-sm text-neutral-600 transition hover:text-neutral-900",
                    pathname === href && "font-medium text-neutral-900"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div
              className="h-9 w-24 animate-pulse rounded-full bg-neutral-200/80"
              aria-hidden
            />
          ) : !isLoggedIn ? (
            <Link
              href="/login"
              className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Login
            </Link>
          ) : (
            <>
              {canWrite && (
                <Link
                  href="/create"
                  className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-900 transition hover:border-neutral-400 hover:bg-neutral-50"
                >
                  Start Writing
                </Link>
              )}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
                    {user?.name?.charAt(0) ?? "?"}
                  </span>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                  <svg
                    className={cn(
                      "h-4 w-4 text-neutral-500 transition",
                      profileOpen && "rotate-180"
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-neutral-100 px-4 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        {/* Providing a fallback string ensures the UI never looks empty */}
                        Role: {user?.role || 'Viewer'} 
                      </p>
                    </div>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-neutral-50"
                        onClick={() => setProfileOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-50"
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-neutral-200 bg-[var(--nav-bg)] px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "block text-sm text-neutral-600",
                    pathname === href && "font-medium text-neutral-900"
                  )}
                  onClick={closeMobile}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="border-t border-neutral-200 pt-3">
              {loading ? (
                <div className="h-10 animate-pulse rounded-full bg-neutral-200/80" />
              ) : !isLoggedIn ? (
                <Link
                  href="/login"
                  className="block rounded-full bg-neutral-900 py-2 text-center text-sm font-medium text-white"
                  onClick={closeMobile}
                >
                  Login
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  {canWrite && (
                    <Link
                      href="/create"
                      className="block rounded-full border border-neutral-300 py-2 text-center text-sm font-medium"
                      onClick={closeMobile}
                    >
                      Start Writing
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="block py-2 text-center text-sm text-neutral-700"
                    onClick={closeMobile}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="py-2 text-center text-sm text-red-600"
                    onClick={() => {
                      closeMobile();
                      logout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
