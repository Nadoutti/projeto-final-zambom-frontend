export interface Show {
  id: number;
  name: string;
  country: string;
  state: string;
  city: string;
  address: string;
  date: string;
  show_type: string;
  capacity: number;
  created_at?: string;
}

export type ShowInput = Omit<Show, 'id' | 'created_at'>;
