"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function SignupPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("author");

  function handleSubmit(e) {
    e.preventDefault();
    login({
      email: email.trim() || "new@explorer.app",
      displayName: displayName.trim() || "New Explorer",
      role,
    });
    router.push("/");
  }

  if (isLoggedIn) {
    return (
      <div className="mx-auto max-w-sm flex-1 px-4 py-20 text-center">
        <p className="text-neutral-600">You already have an active session.</p>
        <Link href="/" className="mt-4 inline-block font-medium text-[#1a8917] hover:underline">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm flex-1 px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-center font-serif text-3xl font-semibold text-neutral-900">Join Explorer</h1>
      <p className="mt-2 text-center text-sm text-neutral-500">Create an account (mock—no data leaves your browser).</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
            Display name
          </label>
          <input
            id="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            placeholder="Jordan Lee"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            placeholder="At least 8 characters"
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
            <option value="viewer">Viewer</option>
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-[#1a8917] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#157d14]"
        >
          Create account
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-600">
        Already a member?{" "}
        <Link href="/login" className="font-medium text-[#1a8917] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
