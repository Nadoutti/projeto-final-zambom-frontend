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
import { listAllTickets, cancelTicket } from '@/api/tickets';
import { listShows } from '@/api/events';
import { formatDateTime } from '@/lib/utils';

export function TicketsAdminPage() {
  const qc = useQueryClient();
  const [showFilter, setShowFilter] = useState<string>('all');

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: listAllTickets,
  });
  const { data: shows = [] } = useQuery({ queryKey: ['shows'], queryFn: listShows });

  const showsById = useMemo(() => new Map(shows.map((s) => [s.id, s])), [shows]);

  const filtered =
    showFilter === 'all'
      ? tickets
      : tickets.filter((t) => String(t.show_id) === showFilter);

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelTicket(id),
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
          <Select value={showFilter} onValueChange={setShowFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os eventos</SelectItem>
              {shows.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
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
              <TableHead>Usuário</TableHead>
              <TableHead>Quando</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum ingresso.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((t) => {
              const show = showsById.get(t.show_id);
              return (
                <TableRow key={t.id}>
                  <TableCell className="font-medium max-w-[260px] truncate">
                    {show?.name ?? `Show #${t.show_id}`}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{t.user_id}</TableCell>
                  <TableCell>{formatDateTime(t.created_at)}</TableCell>
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
