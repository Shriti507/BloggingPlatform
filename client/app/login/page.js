"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("author");

  function handleSubmit(e) {
    e.preventDefault();
    login({
      email: email.trim() || "reader@explorer.app",
      displayName: email.trim() ? email.split("@")[0] : "Explorer Reader",
      role,
    });
    router.push("/");
  }

  function quickSignIn(nextRole) {
    const labels = { viewer: "Curious Reader", author: "Staff Writer", admin: "Site Admin" };
    login({
      email: `${nextRole}@explorer.app`,
      displayName: labels[nextRole],
      role: nextRole,
    });
    router.push("/");
  }

  if (isLoggedIn) {
    return (
      <div className="mx-auto max-w-sm flex-1 px-4 py-20 text-center">
        <p className="text-neutral-600">You are already signed in.</p>
        <Link href="/" className="mt-4 inline-block font-medium text-[#1a8917] hover:underline">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm flex-1 px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-center font-serif text-3xl font-semibold text-neutral-900">Welcome back</h1>
      <p className="mt-2 text-center text-sm text-neutral-500">Sign in is simulated for UI preview only.</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-neutral-700">
            Mock role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-[15px] focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="viewer">Viewer (read-only)</option>
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-[#1a8917] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#157d14]"
        >
          Sign in
        </button>
      </form>

      <div className="mt-8 rounded-lg border border-neutral-200 bg-neutral-50/80 p-4">
        <p className="text-center text-xs font-medium uppercase tracking-wide text-neutral-500">Quick demo</p>
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            onClick={() => quickSignIn("viewer")}
            className="rounded-full border border-neutral-300 bg-white py-2 text-sm text-neutral-800 transition-colors hover:border-neutral-900"
          >
            Continue as viewer
          </button>
          <button
            type="button"
            onClick={() => quickSignIn("author")}
            className="rounded-full border border-neutral-300 bg-white py-2 text-sm text-neutral-800 transition-colors hover:border-neutral-900"
          >
            Continue as author
          </button>
          <button
            type="button"
            onClick={() => quickSignIn("admin")}
            className="rounded-full border border-neutral-300 bg-white py-2 text-sm text-neutral-800 transition-colors hover:border-neutral-900"
          >
            Continue as admin
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-neutral-600">
        No account?{" "}
        <Link href="/signup" className="font-medium text-[#1a8917] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
