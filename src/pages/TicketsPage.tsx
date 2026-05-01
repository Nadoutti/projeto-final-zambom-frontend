import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { TicketCard } from '@/components/tickets/TicketCard';
import { listTicketsByUser, cancelTicket } from '@/api/tickets';
import { listShows } from '@/api/events';
import { useAuth } from '@/auth/AuthContext';

export function TicketsPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [pendingId, setPendingId] = useState<number | null>(null);

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets', 'user', user?.id],
    queryFn: () => listTicketsByUser(user!.id),
    enabled: !!user,
  });
  const { data: shows = [] } = useQuery({ queryKey: ['shows'], queryFn: listShows });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelTicket(id),
    onMutate: (id) => setPendingId(id),
    onSuccess: () => {
      toast.success('Ingresso cancelado');
      qc.invalidateQueries({ queryKey: ['tickets'] });
      qc.invalidateQueries({ queryKey: ['shows'] });
    },
    onError: (err) => {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.detail ?? err.response?.data?.message ?? 'Falha ao cancelar'
        : 'Falha ao cancelar';
      toast.error(msg);
    },
    onSettled: () => setPendingId(null),
  });

  const showsById = new Map(shows.map((s) => [s.id, s]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meus ingressos</h1>
        <p className="text-muted-foreground">Todas as suas compras.</p>
      </div>

      {isLoading && <p className="text-muted-foreground">Carregando...</p>}

      {!isLoading && tickets.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center space-y-3">
          <p className="text-muted-foreground">Nenhum ingresso comprado ainda.</p>
          <Button asChild>
            <Link to="/eventos">Ver eventos disponíveis</Link>
          </Button>
        </div>
      )}

      {tickets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              show={showsById.get(t.show_id)}
              onCancel={(id) => cancelMutation.mutate(id)}
              cancelling={pendingId === t.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
