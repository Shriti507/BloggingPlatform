"use client";

import { useAuth } from "@/context/AuthProvider";
import { signInWithPassword } from "@/services/authService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { isLoggedIn, setMockRole, mockRole } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: err } = await signInWithPassword({ email, password });
    setSubmitting(false);
    if (err) {
      setError(err.message || "Sign in failed");
      return;
    }
    router.push("/");
    router.refresh();
  }

  const handleSimulate = (role) => {
    setMockRole(role);
    router.push("/");
  };

  if (isLoggedIn) {
    return (
      <div className="mx-auto max-w-md flex-1 px-4 py-20 text-center">
        <p className="text-neutral-600">You&apos;re already signed in as <span className="font-bold">{mockRole || "default"}</span>.</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/" className="inline-block text-sm font-medium text-neutral-900 underline">
            Back home
          </Link>
          <button
            onClick={() => setMockRole(null)}
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            Clear role override
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Sign in to your account or use the simulation mode below to test different roles.
      </p>

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-neutral-900 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-10 border-t border-neutral-100 pt-8">
        <h2 className="text-center text-xs font-bold uppercase tracking-widest text-neutral-400">
          Simulation Mode
        </h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["viewer", "author", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => handleSimulate(r)}
              className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              Log in as {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-neutral-600">
        No account?{" "}
        <Link href="/signup" className="font-medium text-neutral-900 underline-offset-2 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
