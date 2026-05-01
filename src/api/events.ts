import { eventsApi } from './http';
import type { Show, ShowInput } from '@/types/event';

export async function listShows(): Promise<Show[]> {
  const { data } = await eventsApi.get<Show[]>('/api/eventos');
  return data;
}

export async function getShow(id: number): Promise<Show> {
  const { data } = await eventsApi.get<Show>(`/api/eventos/${id}`);
  return data;
}

export async function createShow(payload: ShowInput): Promise<Show> {
  const { data } = await eventsApi.post<Show>('/api/eventos', payload);
  return data;
}

export async function updateShow(id: number, payload: ShowInput): Promise<Show> {
  const { data } = await eventsApi.put<Show>(`/api/eventos/${id}`, payload);
  return data;
}

export async function deleteShow(id: number): Promise<void> {
  await eventsApi.delete(`/api/eventos/${id}`);
}
