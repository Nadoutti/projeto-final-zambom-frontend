import { ticketsApi } from './http';
import type { BuyTicketPayload, Ticket } from '@/types/ticket';

export async function listAllTickets(): Promise<Ticket[]> {
  const { data } = await ticketsApi.get<Ticket[]>('/tickets');
  return data;
}

export async function listTicketsByUser(userId: string): Promise<Ticket[]> {
  const { data } = await ticketsApi.get<Ticket[]>(`/tickets/user/${userId}`);
  return data;
}

export async function buyTicket(payload: BuyTicketPayload): Promise<Ticket> {
  const { data } = await ticketsApi.post<Ticket>('/tickets', payload);
  return data;
}

export async function cancelTicket(id: number): Promise<Ticket> {
  const { data } = await ticketsApi.delete<Ticket>(`/tickets/${id}`);
  return data;
}
