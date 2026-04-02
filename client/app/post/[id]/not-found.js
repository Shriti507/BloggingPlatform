import Link from "next/link";

export default function PostNotFound() {
  return (
    <div className="mx-auto max-w-lg flex-1 px-4 py-24 text-center">
      <h1 className="font-serif text-2xl font-semibold text-neutral-900">
        Story not found
      </h1>
      <p className="mt-3 text-neutral-600">
        This post does not exist in the mock catalog yet.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm font-medium text-neutral-900 underline"
      >
        Back to home
      </Link>
    </div>
  );
}
