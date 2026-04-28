import { usersApi } from './http';
import type { Role, User } from '@/types/user';

export interface UserUpsertPayload {
  nome: string;
  email: string;
  role: Role;
}

export async function listUsers(): Promise<User[]> {
  const { data } = await usersApi.get<User[]>('/users');
  return data;
}

export async function createUser(payload: UserUpsertPayload): Promise<User> {
  const { data } = await usersApi.post<User>('/users', payload);
  return data;
}

export async function updateUser(id: string, payload: Partial<UserUpsertPayload>): Promise<User> {
  const { data } = await usersApi.put<User>(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await usersApi.delete(`/users/${id}`);
}
