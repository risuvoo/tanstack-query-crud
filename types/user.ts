export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  active: boolean;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  website: string;
}

export interface UpdateUserInput extends CreateUserInput {
  id: number;
  active: boolean;
}

export interface PatchUserInput {
  id: number;
  data: Partial<Omit<User, "id">>;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
