import { CalendarDays, MapPin, Ticket as TicketIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatBRL, formatDateTime } from '@/lib/utils';
import type { Evento } from '@/types/event';
import type { Ingresso } from '@/types/ticket';

interface Props {
  ticket: Ingresso;
  event?: Evento;
  onCancel?: (id: string) => void;
  cancelling?: boolean;
}

export function TicketCard({ ticket, event, onCancel, cancelling }: Props) {
  const cancelado = ticket.status === 'cancelado';
  const total = ticket.precoUnit * ticket.quantidade;

  return (
    <Card className={cancelado ? 'opacity-60' : ''}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold flex items-center gap-2">
              <TicketIcon className="h-4 w-4 text-primary" />
              {event?.nome ?? 'Evento'}
            </h3>
            {event && (
              <>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> {formatDateTime(event.data)}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {event.local}
                </div>
              </>
            )}
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> {ticket.comprador}
              {ticket.email && <span>· {ticket.email}</span>}
            </div>
          </div>
          <span
            className={`text-xs font-medium rounded-full px-2.5 py-1 ${
              cancelado ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
            }`}
          >
            {cancelado ? 'Cancelado' : 'Ativo'}
          </span>
        </div>

        <div className="flex items-end justify-between border-t pt-3">
          <div className="text-sm">
            <div className="text-muted-foreground">
              {ticket.quantidade}x {formatBRL(ticket.precoUnit)}
            </div>
            <div className="font-semibold">{formatBRL(total)}</div>
          </div>
          {!cancelado && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(ticket.id)}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelando...' : 'Cancelar'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
