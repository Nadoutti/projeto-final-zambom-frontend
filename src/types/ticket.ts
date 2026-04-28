export type TicketStatus = 'ativo' | 'cancelado';

export interface Ingresso {
  id: string;
  eventId: string;
  quantidade: number;
  precoUnit: number;
  comprador: string;
  email?: string;
  criadoEm: string;
  status: TicketStatus;
}

export interface BuyTicketPayload {
  eventId: string;
  quantidade: number;
  comprador: string;
  email?: string;
}
