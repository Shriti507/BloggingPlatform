"use client";

import { useAuth } from "@/context/AuthProvider";
import { signUpWithProfile } from "@/services/authService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState("viewer");
  const [info, setInfo] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    const { error: err, needsEmailConfirmation } = await signUpWithProfile({
      email,
      password,
      fullName: name.trim() || undefined,
      role,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message || "Sign up failed");
      return;
    }
    if (needsEmailConfirmation) {
      setInfo("Check your email to confirm your account, then sign in.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  if (isLoggedIn) {
    return (
      <div className="mx-auto max-w-md flex-1 px-4 py-20 text-center">
        <p className="text-neutral-600">You&apos;re already signed in.</p>
        <Link href="/" className="mt-4 inline-block text-sm font-medium text-neutral-900 underline">
          Back home
        </Link>
      </div>
    );
  }

  const roleOptions = [
    { id: "viewer", label: "Viewer", desc: "Read posts and comment" },
    { id: "author", label: "Author", desc: "Write and manage your posts" },
    { id: "admin", label: "Admin", desc: "Full control over everything" },
  ];

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">
        Join Explorer
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Choose your role and start your journey. You can change this later in settings.
      </p>

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      {info && (
        <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {info}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium text-neutral-700">
            Display name
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="••••••••"
          />
        </div>

        <div className="pt-2">
          <span className="block text-sm font-medium text-neutral-700">Select Role</span>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {roleOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRole(opt.id)}
                className={`relative flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                  role === opt.id
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-md ring-2 ring-neutral-900 ring-offset-2"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider">{opt.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-xs text-neutral-500 italic">
            {roleOptions.find((o) => o.id === role)?.desc}
          </p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-neutral-900 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-neutral-900 underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
