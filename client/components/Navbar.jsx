"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/membership", label: "Membership" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
];

function NavLink({ href, label, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="text-[15px] text-neutral-600 transition-colors hover:text-neutral-900"
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { user, hydrated, logout, canWrite, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const closeMobile = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-sans text-xl font-semibold tracking-tight text-neutral-900 transition-opacity hover:opacity-80"
            onClick={closeMobile}
          >
            Explorer
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            {navLinks.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!hydrated ? (
            <span className="h-9 w-20 animate-pulse rounded-full bg-neutral-100" aria-hidden />
          ) : !isLoggedIn ? (
            <Link
              href="/login"
              className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Login
            </Link>
          ) : (
            <>
              {canWrite && (
                <Link
                  href="/create"
                  className="hidden rounded-full border border-[#1a8917] bg-[#1a8917] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#157d14] sm:inline-flex"
                >
                  Start Writing
                </Link>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-semibold text-white ring-2 ring-white transition-transform hover:scale-105"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  aria-label="Account menu"
                >
                  {(user?.displayName || user?.email || "U").slice(0, 1).toUpperCase()}
                </button>

                {profileOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-40 cursor-default bg-transparent"
                      aria-label="Close menu"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div
                      role="menu"
                      className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
                    >
                      <Link
                        href="/dashboard"
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                        onClick={() => setProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      {canWrite && (
                        <Link
                          href="/create"
                          role="menuitem"
                          className="block px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 sm:hidden"
                          onClick={() => setProfileOpen(false)}
                        >
                          Start Writing
                        </Link>
                      )}
                      <button
                        type="button"
                        role="menuitem"
                        className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-neutral-100 bg-white md:hidden ${open ? "block" : "hidden"}`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2.5 text-[15px] text-neutral-700 hover:bg-neutral-50"
              onClick={closeMobile}
            >
              {l.label}
            </Link>
          ))}
          {hydrated && isLoggedIn && canWrite && (
            <Link
              href="/create"
              className="rounded-md px-3 py-2.5 text-[15px] font-medium text-[#157d14] hover:bg-emerald-50"
              onClick={closeMobile}
            >
              Start Writing
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
