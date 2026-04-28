import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listTickets, cancelTicket } from '@/api/tickets';
import { listEvents } from '@/api/events';
import { formatBRL, formatDateTime } from '@/lib/utils';

export function TicketsAdminPage() {
  const qc = useQueryClient();
  const [eventFilter, setEventFilter] = useState<string>('all');

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: listTickets,
  });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: listEvents });

  const eventsById = useMemo(() => new Map(events.map((e) => [e.id, e])), [events]);

  const filtered =
    eventFilter === 'all' ? tickets : tickets.filter((t) => t.eventId === eventFilter);

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelTicket(id),
    onSuccess: () => {
      toast.success('Ingresso cancelado');
      qc.invalidateQueries({ queryKey: ['tickets'] });
      qc.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (err) => {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Falha ao cancelar'
        : 'Falha ao cancelar';
      toast.error(msg);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Ingressos</h1>
          <p className="text-sm text-muted-foreground">
            Veja todas as compras realizadas e cancele se necessário.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os eventos</SelectItem>
              {events.map((ev) => (
                <SelectItem key={ev.id} value={ev.id}>
                  {ev.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead>Comprador</TableHead>
              <TableHead>Qtd</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Quando</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Nenhum ingresso.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((t) => {
              const ev = eventsById.get(t.eventId);
              return (
                <TableRow key={t.id}>
                  <TableCell className="font-medium max-w-[260px] truncate">
                    {ev?.nome ?? t.eventId}
                  </TableCell>
                  <TableCell>
                    <div>{t.comprador}</div>
                    {t.email && <div className="text-xs text-muted-foreground">{t.email}</div>}
                  </TableCell>
                  <TableCell>{t.quantidade}</TableCell>
                  <TableCell>{formatBRL(t.precoUnit * t.quantidade)}</TableCell>
                  <TableCell>{formatDateTime(t.criadoEm)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.status === 'ativo'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {t.status === 'ativo' ? 'Ativo' : 'Cancelado'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={t.status === 'cancelado'}
                      onClick={() => {
                        if (confirm('Cancelar este ingresso?')) cancelMutation.mutate(t.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
