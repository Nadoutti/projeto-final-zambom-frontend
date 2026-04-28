import { http, HttpResponse } from 'msw';
import { db, genId, persist } from '../db';
import type { BuyTicketPayload } from '@/types/ticket';

const BASE = 'http://localhost:3002/api';

export const ticketsHandlers = [
  http.get(`${BASE}/tickets`, () => HttpResponse.json(db.tickets)),

  http.post(`${BASE}/tickets`, async ({ request }) => {
    const body = (await request.json()) as BuyTicketPayload;
    const ev = db.events.find((e) => e.id === body.eventId);
    if (!ev) return HttpResponse.json({ message: 'Evento não encontrado' }, { status: 404 });
    if (!body.comprador?.trim())
      return HttpResponse.json({ message: 'Informe o nome do comprador' }, { status: 400 });
    if (body.quantidade < 1)
      return HttpResponse.json({ message: 'Quantidade inválida' }, { status: 400 });
    if (ev.estoque < body.quantidade)
      return HttpResponse.json({ message: 'Estoque insuficiente' }, { status: 409 });

    ev.estoque -= body.quantidade;
    const ticket = {
      id: genId('t'),
      eventId: ev.id,
      quantidade: body.quantidade,
      precoUnit: ev.preco,
      comprador: body.comprador.trim(),
      email: body.email?.trim() || undefined,
      criadoEm: new Date().toISOString(),
      status: 'ativo' as const,
    };
    db.tickets.push(ticket);
    persist();
    return HttpResponse.json(ticket, { status: 201 });
  }),

  http.delete(`${BASE}/tickets/:id`, ({ params }) => {
    const ticket = db.tickets.find((t) => t.id === params.id);
    if (!ticket) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 });
    if (ticket.status === 'cancelado')
      return HttpResponse.json({ message: 'Já cancelado' }, { status: 409 });

    ticket.status = 'cancelado';
    const ev = db.events.find((e) => e.id === ticket.eventId);
    if (ev) ev.estoque += ticket.quantidade;
    persist();
    return HttpResponse.json(ticket);
  }),
];
