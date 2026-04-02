import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-16 sm:py-24">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">About Explorer</h1>
      <p className="mt-6 text-lg leading-relaxed text-neutral-600">
        We are building a calm place for essays and ideas—focused reading, respectful discussion, and tools
        that respect writers’ time.
      </p>
      <p className="mt-4 leading-relaxed text-neutral-600">
        This page is a placeholder while the product takes shape.
      </p>
      <Link href="/" className="mt-10 inline-block text-sm font-medium text-[#1a8917] hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
