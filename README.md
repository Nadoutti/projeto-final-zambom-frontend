# projeto-final-zambom-frontend

Frontend de venda de ingressos que **vai consumir 3 APIs separadas** (eventos, ingressos e usuários). Todas as chamadas são interceptadas pelo **MSW (Mock Service Worker)** com dados em memória persistidos em `localStorage` — quando os backends ficarem prontos, basta apontar as variáveis de ambiente para as URLs reais e remover o boot do MSW.

> **Sem autenticação.** Todas as rotas são públicas. A compra de ingresso pede apenas o nome (e e-mail opcional) do comprador no formulário.

## Stack

- React 18 + Vite + TypeScript
- React Router v6
- TanStack Query (cache de chamadas)
- Axios (HTTP)
- Tailwind CSS + componentes estilo shadcn/ui (Radix + cva)
- MSW v2 (mocks)
- Sonner (toasts)

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

Os dados ficam persistidos no `localStorage` do browser (chave `zambom-mock-db`). Para resetar, abra o DevTools → Application → Local Storage e apague essa chave (ou rode `localStorage.clear()` no console).

## Rotas

### Público
- `/eventos` — catálogo
- `/eventos/:id` — detalhe + compra (formulário pede nome do comprador)
- `/ingressos` — todos os ingressos vendidos, com botão de cancelar

### Painel admin (também público)
- `/admin/eventos` — CRUD de eventos
- `/admin/usuarios` — CRUD de usuários (cadastro com papel)
- `/admin/ingressos` — todos os ingressos com filtro por evento

## Arquitetura

```
src/
├── api/             # 3 instâncias axios + wrappers tipados (events, tickets, users)
├── mocks/           # MSW: db em memória + handlers das 3 APIs
├── components/
│   ├── ui/          # primitives (button, input, card, dialog, table, ...)
│   ├── layout/      # Header, AppLayout, AdminSidebar
│   ├── events/      # EventCard, EventForm
│   ├── tickets/     # TicketCard
│   └── users/       # UserForm
├── routes/          # AppRouter
├── pages/           # uma página por rota (+ subpasta admin/)
├── types/           # tipos compartilhados
└── lib/utils.ts     # cn(), formatBRL(), formatDateTime()
```

## Ligando nos backends reais

Quando os 3 backends estiverem prontos, basta:

1. Criar um arquivo `.env`:
   ```env
   VITE_EVENTS_API=http://seu-host/api
   VITE_TICKETS_API=http://seu-host/api
   VITE_USERS_API=http://seu-host/api
   ```
2. Remover (ou desativar) o `enableMocks()` em `src/main.tsx` para não rodar o MSW.

A camada `src/api/*` já está pronta para falar com APIs reais.

## Contratos esperados das 3 APIs

Os handlers em `src/mocks/handlers/{users,events,tickets}.ts` documentam os endpoints, paths, payloads e códigos de status que o frontend espera de cada microserviço.

| API | Endpoint | Método |
|---|---|---|
| events | `/events`, `/events/:id` | GET, POST, PUT, DELETE |
| tickets | `/tickets` | GET, POST, DELETE |
| users | `/users`, `/users/:id` | GET, POST, PUT, DELETE |
