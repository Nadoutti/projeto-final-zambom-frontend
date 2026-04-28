import { ticketsApi } from './http';
import type { BuyTicketPayload, Ingresso } from '@/types/ticket';

export async function listTickets(): Promise<Ingresso[]> {
  const { data } = await ticketsApi.get<Ingresso[]>('/tickets');
  return data;
}

export async function buyTicket(payload: BuyTicketPayload): Promise<Ingresso> {
  const { data } = await ticketsApi.post<Ingresso>('/tickets', payload);
  return data;
}

export async function cancelTicket(id: string): Promise<Ingresso> {
  const { data } = await ticketsApi.delete<Ingresso>(`/tickets/${id}`);
  return data;
}
