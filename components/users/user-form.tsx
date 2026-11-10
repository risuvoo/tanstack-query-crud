"use client";

import { FormEvent, useEffect, useState } from "react";
import type { User } from "@/types/user";
import { useCreateUser, useUpdateUser } from "@/lib/queries/users";

type Props = {
  user?: User | null;
  onDone: () => void;
};

export default function UserForm({ user, onDone }: Props) {
  const isEdit = Boolean(user);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [website, setWebsite] = useState(user?.website ?? "");

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const mutation = isEdit
    ? updateMutation
    : createMutation;

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPhone(user?.phone ?? "");
    setWebsite(user?.website ?? "");
  }, [user]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isEdit && user) {
      updateMutation.mutate(
        {
          id: user.id,
          name,
          email,
          phone,
          website,
          active: user.active
        },
        { onSuccess: onDone }
      );
      return;
    }

    createMutation.mutate(
      { name, email, phone, website },
      { onSuccess: onDone }
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Rahim"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="rahim@example.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Phone
        </label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="01700000000"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Website
        </label>
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="example.dev"
        />
      </div>

      {mutation.isError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {mutation.error.message}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {mutation.isPending
            ? "Saving..."
            : isEdit
              ? "Update User"
              : "Create User"}
        </button>

        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
