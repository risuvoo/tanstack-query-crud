"use client";

import { useState } from "react";
import type { User } from "@/types/user";
import UserForm from "./user-form";
import UserList from "./user-list";

export default function UsersPage() {
  const [editingUser, setEditingUser] =
    useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  function startCreate() {
    setEditingUser(null);
    setShowForm(true);
  }

  function startEdit(user: User) {
    setEditingUser(user);
    setShowForm(true);
  }

  function closeForm() {
    setEditingUser(null);
    setShowForm(false);
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            TanStack Query CRUD example
          </p>
        </div>

        <button
          onClick={startCreate}
          className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white"
        >
          + Add User
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            {editingUser ? "Edit User" : "Create User"}
          </h2>

          <UserForm
            user={editingUser}
            onDone={closeForm}
          />
        </div>
      )}

      <UserList onEdit={startEdit} />
    </main>
  );
}
