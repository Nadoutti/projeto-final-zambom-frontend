import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import type { Show } from '@/types/event';

export function EventCard({ show }: { show: Show }) {
  const semVagas = show.capacity <= 0;
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardContent className="flex-1 p-5 space-y-2">
        <h3 className="text-lg font-semibold leading-tight line-clamp-2">{show.name}</h3>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {show.show_type}
        </div>
        <div className="pt-2 space-y-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> {formatDateTime(show.date)}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {show.city}, {show.state}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Ticket className="h-4 w-4" /> {show.capacity} vaga(s)
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex items-center justify-end">
        <Button asChild disabled={semVagas}>
          <Link to={`/eventos/${show.id}`}>{semVagas ? 'Esgotado' : 'Ver evento'}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
