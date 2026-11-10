import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-medium text-blue-600">
          Next.js + TanStack Query
        </p>
        <h1 className="text-3xl font-bold">
          CRUD Learning Project
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          A complete example covering useQuery, useMutation, query keys,
          invalidation, cache updates, optimistic updates, search,
          pagination and detail queries.
        </p>
        <Link
          href="/users"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 font-medium text-white"
        >
          Open Users
        </Link>
      </div>
    </main>
  );
}
