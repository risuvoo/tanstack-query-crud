"use client";

import Link from "next/link";
import { useUser } from "@/lib/queries/users";

export default function UserDetail({ id }: { id: number }) {
  const query = useUser(id);

  if (query.isPending) {
    return <p>Loading user...</p>;
  }

  if (query.isError) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-700">
        {query.error.message}
      </div>
    );
  }

  const user = query.data;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-slate-500">
            User ID: {user.id}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            user.active
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {user.active ? "Active" : "Inactive"}
        </span>
      </div>

      <dl className="space-y-4">
        <div>
          <dt className="text-sm text-slate-500">Email</dt>
          <dd className="font-medium">{user.email}</dd>
        </div>

        <div>
          <dt className="text-sm text-slate-500">Phone</dt>
          <dd className="font-medium">{user.phone}</dd>
        </div>

        <div>
          <dt className="text-sm text-slate-500">Website</dt>
          <dd className="font-medium">{user.website}</dd>
        </div>
      </dl>

      <Link
        href="/users"
        className="mt-6 inline-block rounded-lg border px-4 py-2"
      >
        ← Back to users
      </Link>
    </div>
  );
}
