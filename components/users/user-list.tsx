"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types/user";
import { useUsers } from "@/lib/queries/users";
import UserItem from "./user-item";

type Props = {
  onEdit: (user: User) => void;
};

export default function UserList({ onEdit }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const query = useUsers(search, page, limit);

  if (query.isPending && !query.data) {
    return <p>Loading users...</p>;
  }

  if (query.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {query.error.message}
      </div>
    );
  }

  const result = query.data;

  return (
    <div className="space-y-4">
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search users..."
        className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
      />

      {query.isFetching && (
        <p className="text-sm text-slate-500">
          Updating list...
        </p>
      )}

      {result.data.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-slate-500">
          No users found.
        </div>
      ) : (
        result.data.map((user) => (
          <UserItem
            key={user.id}
            user={user}
            onEdit={onEdit}
          />
        ))
      )}

      <div className="flex items-center justify-between rounded-xl border bg-white p-3">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm text-slate-600">
          Page {result.page} of {result.totalPages}
        </span>

        <button
          disabled={page >= result.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
