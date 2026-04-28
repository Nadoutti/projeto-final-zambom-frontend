import { setupWorker } from 'msw/browser';
import { usersHandlers } from './handlers/users';
import { eventsHandlers } from './handlers/events';
import { ticketsHandlers } from './handlers/tickets';

export const worker = setupWorker(...usersHandlers, ...eventsHandlers, ...ticketsHandlers);
