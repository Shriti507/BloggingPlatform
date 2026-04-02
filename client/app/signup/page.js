"use client";

import { MOCK_ROLE_OPTIONS, useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("author");

  function handleSubmit(e) {
    e.preventDefault();
    login({
      name: name.trim() || "New member",
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
        Join Explorer
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Mock signup sets local session only. Choose a role to preview the UI.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium text-neutral-700">
            Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="Your name"
          />
        </div>
        <div>
          <span className="block text-sm font-medium text-neutral-700">Role (mock)</span>
          <select
            id="signup-role"
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
          <label htmlFor="signup-email" className="block text-sm font-medium text-neutral-700">
            Email (optional, mock)
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-neutral-700">
            Password (mock)
          </label>
          <input
            id="signup-password"
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
          Create account
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
