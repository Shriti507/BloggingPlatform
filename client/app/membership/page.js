import Link from "next/link";

export default function MembershipPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">
        Membership
      </h1>
      <p className="mt-4 text-neutral-600 leading-relaxed">
        Explorer membership is a placeholder for now. Later you&apos;ll be able to support
        writers, unlock exclusive stories, and sync across devices.
      </p>
      <ul className="mt-8 space-y-3 text-sm text-neutral-700">
        <li className="flex gap-2">
          <span className="text-emerald-600">✓</span>
          Ad-light reading experience
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-600">✓</span>
          Early access to new features
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-600">✓</span>
          Direct support for authors you follow
        </li>
      </ul>
      <Link
        href="/signup"
        className="mt-10 inline-flex rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
      >
        Get started
      </Link>
    </div>
  );
}
