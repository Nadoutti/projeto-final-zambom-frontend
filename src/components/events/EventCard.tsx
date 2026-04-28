import { Link } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatBRL, formatDateTime } from '@/lib/utils';
import type { Evento } from '@/types/event';

export function EventCard({ event }: { event: Evento }) {
  const semEstoque = event.estoque <= 0;
  return (
    <Card className="overflow-hidden flex flex-col">
      {event.imagem && (
        <div className="h-40 w-full overflow-hidden bg-muted">
          <img
            src={event.imagem}
            alt={event.nome}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <CardContent className="flex-1 p-5 space-y-2">
        <h3 className="text-lg font-semibold leading-tight line-clamp-2">{event.nome}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.descricao}</p>
        <div className="pt-2 space-y-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> {formatDateTime(event.data)}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {event.local}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">A partir de</div>
          <div className="text-lg font-bold text-primary">{formatBRL(event.preco)}</div>
        </div>
        <Button asChild disabled={semEstoque}>
          <Link to={`/eventos/${event.id}`}>{semEstoque ? 'Esgotado' : 'Ver evento'}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
