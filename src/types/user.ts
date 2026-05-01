export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  admin: boolean;
  created_at?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  cpf: string;
  admin?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  cpf?: string;
  password?: string;
  admin?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
