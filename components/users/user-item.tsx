"use client";

import Link from "next/link";
import type { User } from "@/types/user";
import {
  useDeleteUser,
  useToggleUserActive
} from "@/lib/queries/users";

type Props = {
  user: User;
  onEdit: (user: User) => void;
};

export default function UserItem({ user, onEdit }: Props) {
  const deleteMutation = useDeleteUser();
  const toggleMutation = useToggleUserActive();

  function handleDelete() {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    deleteMutation.mutate(user.id);
  }

  function handleToggle() {
    toggleMutation.mutate({
      id: user.id,
      active: !user.active
    });
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={`/users/${user.id}`}
            className="text-lg font-semibold hover:underline"
          >
            {user.name}
          </Link>

          <p className="text-sm text-slate-600">
            {user.email}
          </p>

          <p className="text-sm text-slate-500">
            {user.phone}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleToggle}
            disabled={toggleMutation.isPending}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              user.active
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {user.active ? "Active" : "Inactive"}
          </button>

          <button
            onClick={() => onEdit(user)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
