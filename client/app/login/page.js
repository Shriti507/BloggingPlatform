"use client";

import { MOCK_ROLE_OPTIONS, useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("author");

  function handleSubmit(e) {
    e.preventDefault();
    login({
      name: name.trim() || "Member",
      role,
    });
    router.push("/");
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

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Mock login: pick a role to simulate permissions. Password is not checked.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="login-name" className="block text-sm font-medium text-neutral-700">
            Display name
          </label>
          <input
            id="login-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="Alex Writer"
          />
        </div>
        <div>
          <span className="block text-sm font-medium text-neutral-700">Role (mock)</span>
          <select
            id="login-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
          >
            {MOCK_ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-neutral-700">
            Email (optional, mock)
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-neutral-700">
            Password (mock)
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-neutral-900 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Sign in
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-600">
        No account?{" "}
        <Link href="/signup" className="font-medium text-neutral-900 underline-offset-2 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
