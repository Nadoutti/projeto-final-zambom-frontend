export type TicketStatus = 'ativo' | 'cancelado';

export interface Ticket {
  id: number;
  user_id: string;
  show_id: number;
  status: TicketStatus;
  created_at: string;
}

export interface BuyTicketPayload {
  show_id: number;
}
