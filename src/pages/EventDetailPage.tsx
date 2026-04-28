import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, CalendarDays, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getEvent } from '@/api/events';
import { buyTicket } from '@/api/tickets';
import { formatBRL, formatDateTime } from '@/lib/utils';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [qty, setQty] = useState(1);
  const [comprador, setComprador] = useState('');
  const [email, setEmail] = useState('');

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id!),
    enabled: !!id,
  });

  const buyMutation = useMutation({
    mutationFn: () =>
      buyTicket({
        eventId: id!,
        quantidade: qty,
        comprador: comprador.trim(),
        email: email.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success('Compra realizada! Veja em "Ingressos".');
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['event', id] });
      qc.invalidateQueries({ queryKey: ['tickets'] });
      navigate('/ingressos');
    },
    onError: (err) => {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Falha ao comprar'
        : 'Falha ao comprar';
      toast.error(msg);
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Carregando...</p>;
  if (isError || !event)
    return (
      <div className="space-y-4">
        <p className="text-destructive">Evento não encontrado.</p>
        <Button asChild variant="outline">
          <Link to="/eventos">Voltar</Link>
        </Button>
      </div>
    );

  const semEstoque = event.estoque <= 0;
  const total = event.preco * qty;
  const compradorOk = comprador.trim().length > 0;

  function handleBuy() {
    if (!compradorOk) {
      toast.error('Informe o nome do comprador');
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
        {event.imagem && (
          <div className="h-64 w-full overflow-hidden bg-muted">
            <img src={event.imagem} alt={event.nome} className="h-full w-full object-cover" />
          </div>
        )}
        <CardContent className="p-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{event.nome}</h1>
            <p className="text-muted-foreground mt-2">{event.descricao}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> {formatDateTime(event.data)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {event.local}
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" /> {event.estoque} ingresso(s) disponíveis
            </div>
            <div className="text-lg font-semibold text-primary">{formatBRL(event.preco)} cada</div>
          </div>

          <div className="border-t pt-4 space-y-3">
            {semEstoque ? (
              <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                Ingressos esgotados.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="comprador">Nome do comprador</Label>
                    <Input
                      id="comprador"
                      value={comprador}
                      onChange={(e) => setComprador(e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">E-mail (opcional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="qty">Quantidade</Label>
                    <Input
                      id="qty"
                      type="number"
                      min={1}
                      max={event.estoque}
                      value={qty}
                      onChange={(e) =>
                        setQty(Math.max(1, Math.min(event.estoque, Number(e.target.value) || 1)))
                      }
                      className="w-24"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="text-2xl font-bold">{formatBRL(total)}</div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleBuy}
                  disabled={buyMutation.isPending || !compradorOk}
                >
                  {buyMutation.isPending ? 'Processando...' : `Comprar ${qty} ingresso(s)`}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
