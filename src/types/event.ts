export interface Evento {
  id: string;
  nome: string;
  descricao: string;
  data: string;
  local: string;
  preco: number;
  estoque: number;
  imagem?: string;
}

export type EventoInput = Omit<Evento, 'id'>;
