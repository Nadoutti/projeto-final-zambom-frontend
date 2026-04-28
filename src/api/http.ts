import axios from 'axios';

const EVENTS_BASE = import.meta.env.VITE_EVENTS_API ?? 'http://localhost:3001/api';
const TICKETS_BASE = import.meta.env.VITE_TICKETS_API ?? 'http://localhost:3002/api';
const USERS_BASE = import.meta.env.VITE_USERS_API ?? 'http://localhost:3003/api';

export const eventsApi = axios.create({ baseURL: EVENTS_BASE });
export const ticketsApi = axios.create({ baseURL: TICKETS_BASE });
export const usersApi = axios.create({ baseURL: USERS_BASE });
