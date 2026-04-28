import { eventsApi } from './http';
import type { Evento, EventoInput } from '@/types/event';

export async function listEvents(): Promise<Evento[]> {
  const { data } = await eventsApi.get<Evento[]>('/events');
  return data;
}

export async function getEvent(id: string): Promise<Evento> {
  const { data } = await eventsApi.get<Evento>(`/events/${id}`);
  return data;
}

export async function createEvent(payload: EventoInput): Promise<Evento> {
  const { data } = await eventsApi.post<Evento>('/events', payload);
  return data;
}

export async function updateEvent(id: string, payload: Partial<EventoInput>): Promise<Evento> {
  const { data } = await eventsApi.put<Evento>(`/events/${id}`, payload);
  return data;
}

export async function deleteEvent(id: string): Promise<void> {
  await eventsApi.delete(`/events/${id}`);
}
