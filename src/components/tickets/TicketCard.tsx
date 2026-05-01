import { CalendarDays, MapPin, Ticket as TicketIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import type { Show } from '@/types/event';
import type { Ticket } from '@/types/ticket';

interface Props {
  ticket: Ticket;
  show?: Show;
  onCancel?: (id: number) => void;
  cancelling?: boolean;
}

export function TicketCard({ ticket, show, onCancel, cancelling }: Props) {
  const cancelado = ticket.status === 'cancelado';

  return (
    <Card className={cancelado ? 'opacity-60' : ''}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold flex items-center gap-2">
              <TicketIcon className="h-4 w-4 text-primary" />
              {show?.name ?? `Show #${ticket.show_id}`}
            </h3>
            {show && (
              <>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> {formatDateTime(show.date)}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {show.city}, {show.state}
                </div>
              </>
            )}
            <div className="text-xs text-muted-foreground">
              Comprado em {formatDateTime(ticket.created_at)}
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

        {!cancelado && onCancel && (
          <div className="flex justify-end border-t pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(ticket.id)}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelando...' : 'Cancelar'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
