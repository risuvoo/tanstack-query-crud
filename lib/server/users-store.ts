import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type { User } from "@/types/user";

const filePath = path.join(process.cwd(), "data", "users.json");

async function readUsers(): Promise<User[]> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as User[];
}

async function writeUsers(users: User[]) {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf8");
}

export async function listUsers(search = "") {
  const users = await readUsers();
  const q = search.trim().toLowerCase();

  if (!q) return users;

  return users.filter((user) =>
    [user.name, user.email, user.phone, user.website]
      .some((value) => value.toLowerCase().includes(q))
  );
}

export async function findUser(id: number) {
  const users = await readUsers();
  return users.find((user) => user.id === id) ?? null;
}

export async function createUser(input: Omit<User, "id">) {
  const users = await readUsers();
  const id = users.length
    ? Math.max(...users.map((user) => user.id)) + 1
    : 1;

  const user: User = { id, ...input };
  users.push(user);
  await writeUsers(users);
  return user;
}

export async function updateUser(id: number, input: Partial<Omit<User, "id">>) {
  const users = await readUsers();
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) return null;

  users[index] = { ...users[index], ...input };
  await writeUsers(users);
  return users[index];
}

export async function deleteUser(id: number) {
  const users = await readUsers();
  const user = users.find((item) => item.id === id);

  if (!user) return null;

  await writeUsers(users.filter((item) => item.id !== id));
  return user;
}
