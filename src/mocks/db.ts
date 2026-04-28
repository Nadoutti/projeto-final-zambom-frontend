import type { User } from '@/types/user';
import type { Evento } from '@/types/event';
import type { Ingresso } from '@/types/ticket';

const STORAGE_KEY = 'zambom-mock-db';

interface DB {
  users: User[];
  events: Evento[];
  tickets: Ingresso[];
}

function seed(): DB {
  const now = Date.now();
  const futureDays = (d: number) =>
    new Date(now + d * 24 * 60 * 60 * 1000).toISOString();

  return {
    users: [
      { id: 'u-admin', nome: 'Admin Zambom', email: 'admin@zambom.com', role: 'admin' },
      { id: 'u-user', nome: 'Maria Compradora', email: 'user@zambom.com', role: 'user' },
    ],
    events: [
      {
        id: 'e-01',
        nome: 'Show do Zambom — Turnê Nacional',
        descricao: 'O fenômeno do momento em uma noite inesquecível com banda completa.',
        data: futureDays(15),
        local: 'Allianz Parque, São Paulo - SP',
        preco: 180,
        estoque: 200,
        imagem: 'https://picsum.photos/seed/zambom1/800/400',
      },
      {
        id: 'e-02',
        nome: 'Festival Beats & Vibes',
        descricao: 'Três palcos, mais de 20 atrações, food trucks e área VIP.',
        data: futureDays(40),
        local: 'Jockey Club, Rio de Janeiro - RJ',
        preco: 320,
        estoque: 50,
        imagem: 'https://picsum.photos/seed/festival/800/400',
      },
      {
        id: 'e-03',
        nome: 'Stand-up: Riso Solto',
        descricao: 'Quatro comediantes em uma noite de pura risada.',
        data: futureDays(7),
        local: 'Teatro Renaissance, São Paulo - SP',
        preco: 90,
        estoque: 120,
        imagem: 'https://picsum.photos/seed/stand/800/400',
      },
      {
        id: 'e-04',
        nome: 'Peça: O Último Trem',
        descricao: 'Drama contemporâneo aclamado pela crítica.',
        data: futureDays(22),
        local: 'Teatro Bradesco, Belo Horizonte - MG',
        preco: 75,
        estoque: 80,
        imagem: 'https://picsum.photos/seed/teatro/800/400',
      },
      {
        id: 'e-05',
        nome: 'Eletrônica Open Air',
        descricao: 'Line-up internacional, do pôr do sol ao amanhecer.',
        data: futureDays(60),
        local: 'Praia de Copacabana, Rio de Janeiro - RJ',
        preco: 250,
        estoque: 0,
        imagem: 'https://picsum.photos/seed/eletronica/800/400',
      },
      {
        id: 'e-06',
        nome: 'Indie Rock Brasil',
        descricao: 'O melhor da nova cena indie em uma noite especial.',
        data: futureDays(30),
        local: 'Audio Club, São Paulo - SP',
        preco: 120,
        estoque: 300,
        imagem: 'https://picsum.photos/seed/indie/800/400',
      },
    ],
    tickets: [
      {
        id: 't-01',
        eventId: 'e-03',
        quantidade: 2,
        precoUnit: 90,
        comprador: 'Maria Compradora',
        email: 'user@zambom.com',
        criadoEm: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ativo',
      },
      {
        id: 't-02',
        eventId: 'e-06',
        quantidade: 1,
        precoUnit: 120,
        comprador: 'João Silva',
        email: 'joao@example.com',
        criadoEm: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ativo',
      },
    ],
  };
}

function load(): DB {
  if (typeof localStorage === 'undefined') return seed();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw) as DB;
  } catch {
    const initial = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function save() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
}

export const db: DB = load();

export function persist() {
  save();
}

export function genId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

export function resetDb() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  const fresh = seed();
  db.users = fresh.users;
  db.events = fresh.events;
  db.tickets = fresh.tickets;
  save();
}
