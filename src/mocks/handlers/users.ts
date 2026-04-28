import { http, HttpResponse } from 'msw';
import { db, genId, persist } from '../db';
import type { Role } from '@/types/user';

const BASE = 'http://localhost:3003/api';

interface UserPayload {
  nome: string;
  email: string;
  role: Role;
}

export const usersHandlers = [
  http.get(`${BASE}/users`, () => HttpResponse.json(db.users)),

  http.post(`${BASE}/users`, async ({ request }) => {
    const body = (await request.json()) as UserPayload;
    if (db.users.some((u) => u.email.toLowerCase() === body.email.toLowerCase())) {
      return HttpResponse.json({ message: 'Email já cadastrado' }, { status: 409 });
    }
    const newUser = {
      id: genId('u'),
      nome: body.nome,
      email: body.email,
      role: body.role ?? 'user',
    };
    db.users.push(newUser);
    persist();
    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.put(`${BASE}/users/:id`, async ({ request, params }) => {
    const idx = db.users.findIndex((u) => u.id === params.id);
    if (idx < 0) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 });
    const body = (await request.json()) as Partial<UserPayload>;
    db.users[idx] = {
      ...db.users[idx],
      ...(body.nome !== undefined && { nome: body.nome }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.role !== undefined && { role: body.role }),
    };
    persist();
    return HttpResponse.json(db.users[idx]);
  }),

  http.delete(`${BASE}/users/:id`, ({ params }) => {
    const idx = db.users.findIndex((u) => u.id === params.id);
    if (idx < 0) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 });
    db.users.splice(idx, 1);
    persist();
    return HttpResponse.json({ ok: true });
  }),
];
