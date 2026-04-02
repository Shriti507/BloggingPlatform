import Link from "next/link";

export default function MembershipPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-16 text-center sm:py-24">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">Membership</h1>
      <p className="mt-4 text-neutral-600 leading-relaxed">
        Support writers and unlock exclusive reads. Pricing and perks will be wired up when billing is ready.
      </p>
      <Link href="/" className="mt-8 inline-block text-sm font-medium text-[#1a8917] hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
