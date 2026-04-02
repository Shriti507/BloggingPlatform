import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-16 sm:py-24">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">Contact us</h1>
      <p className="mt-4 text-neutral-600 leading-relaxed">
        Questions, partnerships, or feedback? A real contact form will replace this stub in a later step.
      </p>
      <p className="mt-6 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-sm text-neutral-500">
        hello@explorer.app (placeholder)
      </p>
      <Link href="/" className="mt-10 inline-block text-sm font-medium text-[#1a8917] hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
