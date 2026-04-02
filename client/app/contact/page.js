"use client";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">
        Contact us
      </h1>
      <p className="mt-4 text-neutral-600 leading-relaxed">
        Have feedback or partnership ideas? This form is visual only for now—there is no
        mailer attached.
      </p>
      <form
        className="mt-10 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
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
            className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
            placeholder="How can we help?"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Send (mock)
        </button>
      </form>
    </div>
  );
}
