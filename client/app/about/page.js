export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">
        About Explorer
      </h1>
      <div className="mt-8 space-y-4 text-neutral-600 leading-relaxed">
        <p>
          Explorer is a blogging platform inspired by calm, readable publishing. We care
          about typography, generous whitespace, and stories that respect your attention.
        </p>
        <p>
          This build is frontend-only: no database calls yet. The next steps will connect
          auth, posts, and comments to Supabase.
        </p>
      </div>
    </div>
  );
}
