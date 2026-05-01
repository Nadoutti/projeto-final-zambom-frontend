import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, CalendarDays, MapPin, Tag, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getShow } from '@/api/events';
import { buyTicket } from '@/api/tickets';
import { formatDateTime } from '@/lib/utils';
import { useAuth } from '@/auth/AuthContext';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();
  const showId = id ? Number(id) : NaN;

  const { data: show, isLoading, isError } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => getShow(showId),
    enabled: Number.isFinite(showId),
  });

  const buyMutation = useMutation({
    mutationFn: () => buyTicket({ show_id: showId }),
    onSuccess: () => {
      toast.success('Compra realizada! Veja em "Ingressos".');
      qc.invalidateQueries({ queryKey: ['shows'] });
      qc.invalidateQueries({ queryKey: ['show', showId] });
      qc.invalidateQueries({ queryKey: ['tickets'] });
      navigate('/ingressos');
    },
    onError: (err) => {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.detail ?? err.response?.data?.message ?? 'Falha ao comprar'
        : 'Falha ao comprar';
      toast.error(msg);
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Carregando...</p>;
  if (isError || !show)
    return (
      <div className="space-y-4">
        <p className="text-destructive">Evento não encontrado.</p>
        <Button asChild variant="outline">
          <Link to="/eventos">Voltar</Link>
        </Button>
      </div>
    );

  const semVagas = show.capacity <= 0;

  function handleBuy() {
    if (!user) {
      toast.error('Faça login para comprar');
      navigate('/login', { state: { from: { pathname: `/eventos/${showId}` } } });
      return;
    }
    buyMutation.mutate();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/eventos">
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para eventos
        </Link>
      </Button>

      <Card className="overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{show.name}</h1>
            <div className="text-sm uppercase tracking-wide text-muted-foreground mt-1">
              {show.show_type}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> {formatDateTime(show.date)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {show.city}, {show.state} – {show.country}
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Tag className="h-4 w-4 text-primary" /> {show.address}
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" /> {show.capacity} vaga(s) disponível(is)
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            {semVagas ? (
              <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                Ingressos esgotados.
              </div>
            ) : (
              <Button
                size="lg"
                className="w-full"
                onClick={handleBuy}
                disabled={buyMutation.isPending}
              >
                {buyMutation.isPending ? 'Processando...' : 'Comprar ingresso'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
