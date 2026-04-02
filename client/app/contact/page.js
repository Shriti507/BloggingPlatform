"use client";

import { useState } from "react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !message) return;
    
    // Mocking an API call
    setIsSent(true);
    setEmail("");
    setMessage("");

    // Hide the success message after 5 seconds
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">
        Contact us
      </h1>
      <p className="mt-4 text-neutral-600 leading-relaxed">
        Have feedback or partnership ideas? We'd love to hear from you.
      </p>

      {isSent && (
        <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 transition-all">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-medium">Thank you!</p>
          </div>
          <p className="mt-1 text-sm text-emerald-700">Your message has been sent successfully. We'll get back to you soon.</p>
        </div>
      )}

      <form
        className="mt-10 space-y-5"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-neutral-700">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="How can we help?"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Send
        </button>
      </form>
    </div>
  );
}
