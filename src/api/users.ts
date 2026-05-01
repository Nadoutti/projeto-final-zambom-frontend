import { usersApi } from './http';
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  UpdateUserPayload,
  User,
} from '@/types/user';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await usersApi.post<LoginResponse>('/login', payload);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await usersApi.get<User>('/getme');
  return data;
}

export async function listUsers(): Promise<User[]> {
  const { data } = await usersApi.get<User[]>('/users');
  return data;
}

export async function createUser(payload: RegisterPayload): Promise<User> {
  const { data } = await usersApi.post<User>('/users', payload);
  return data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const { data } = await usersApi.put<User>(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await usersApi.delete(`/users/${id}`);
}
