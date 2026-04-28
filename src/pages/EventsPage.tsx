import { useQuery } from '@tanstack/react-query';
import { listEvents } from '@/api/events';
import { EventCard } from '@/components/events/EventCard';

export function EventsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: listEvents,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Eventos disponíveis</h1>
        <p className="text-muted-foreground">Escolha um evento e garanta seu ingresso.</p>
      </div>

      {isLoading && <p className="text-muted-foreground">Carregando eventos...</p>}
      {isError && <p className="text-destructive">Não foi possível carregar os eventos.</p>}

      {data && data.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Nenhum evento cadastrado ainda.
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}
    </div>
  );
}
