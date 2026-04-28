import { http, HttpResponse } from 'msw';
import { db, genId, persist } from '../db';
import type { EventoInput } from '@/types/event';

const BASE = 'http://localhost:3001/api';

export const eventsHandlers = [
  http.get(`${BASE}/events`, () => HttpResponse.json(db.events)),

  http.get(`${BASE}/events/:id`, ({ params }) => {
    const ev = db.events.find((e) => e.id === params.id);
    if (!ev) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 });
    return HttpResponse.json(ev);
  }),

  http.post(`${BASE}/events`, async ({ request }) => {
    const body = (await request.json()) as EventoInput;
    const newEv = { id: genId('e'), ...body };
    db.events.push(newEv);
    persist();
    return HttpResponse.json(newEv, { status: 201 });
  }),

  http.put(`${BASE}/events/:id`, async ({ request, params }) => {
    const idx = db.events.findIndex((e) => e.id === params.id);
    if (idx < 0) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 });
    const body = (await request.json()) as Partial<EventoInput>;
    db.events[idx] = { ...db.events[idx], ...body };
    persist();
    return HttpResponse.json(db.events[idx]);
  }),

  http.delete(`${BASE}/events/:id`, ({ params }) => {
    const idx = db.events.findIndex((e) => e.id === params.id);
    if (idx < 0) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 });
    db.events.splice(idx, 1);
    persist();
    return HttpResponse.json({ ok: true });
  }),
];
