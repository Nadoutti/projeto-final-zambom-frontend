import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EventForm } from '@/components/events/EventForm';
import { createEvent, deleteEvent, listEvents, updateEvent } from '@/api/events';
import { formatBRL, formatDateTime } from '@/lib/utils';
import type { Evento, EventoInput } from '@/types/event';

export function EventsAdminPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Evento | null>(null);
  const [open, setOpen] = useState(false);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: listEvents,
  });

  function errorMessage(err: unknown, fallback: string) {
    return axios.isAxiosError(err) ? err.response?.data?.message ?? fallback : fallback;
  }

  const saveMutation = useMutation({
    mutationFn: (input: EventoInput) =>
      editing ? updateEvent(editing.id, input) : createEvent(input),
    onSuccess: () => {
      toast.success(editing ? 'Evento atualizado' : 'Evento criado');
      qc.invalidateQueries({ queryKey: ['events'] });
      setOpen(false);
      setEditing(null);
    },
    onError: (err) => toast.error(errorMessage(err, 'Falha ao salvar')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      toast.success('Evento excluído');
      qc.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (err) => toast.error(errorMessage(err, 'Falha ao excluir')),
  });

  function handleNew() {
    setEditing(null);
    setOpen(true);
  }
  function handleEdit(ev: Evento) {
    setEditing(ev);
    setOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Eventos</h1>
          <p className="text-sm text-muted-foreground">Gerencie o catálogo de eventos.</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-1" /> Novo evento
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && events.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum evento ainda.
                </TableCell>
              </TableRow>
            )}
            {events.map((ev) => (
              <TableRow key={ev.id}>
                <TableCell className="font-medium max-w-[280px] truncate">{ev.nome}</TableCell>
                <TableCell>{formatDateTime(ev.data)}</TableCell>
                <TableCell className="max-w-[220px] truncate">{ev.local}</TableCell>
                <TableCell>{formatBRL(ev.preco)}</TableCell>
                <TableCell>{ev.estoque}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(ev)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Excluir "${ev.nome}"?`)) deleteMutation.mutate(ev.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar evento' : 'Novo evento'}</DialogTitle>
          </DialogHeader>
          <EventForm
            initial={editing}
            submitting={saveMutation.isPending}
            onSubmit={(data) => saveMutation.mutate(data)}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
