import type {
  CreateUserInput,
  PatchUserInput,
  UpdateUserInput,
  User,
  UserListResponse
} from "@/types/user";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function getUsers(
  search = "",
  page = 1,
  limit = 5
): Promise<UserListResponse> {
  const params = new URLSearchParams({
    search,
    page: String(page),
    limit: String(limit)
  });

  const response = await fetch(`/api/users?${params.toString()}`);
  return parseResponse<UserListResponse>(response);
}

export async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return parseResponse<User>(response);
}

export async function createUser(
  input: CreateUserInput
): Promise<User> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  return parseResponse<User>(response);
}

export async function updateUser(
  input: PatchUserInput
): Promise<User> {
  const { id, data: body } = input;

  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return parseResponse<User>(response);
}

export async function deleteUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE"
  });

  return parseResponse<User>(response);
}
