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
import { createShow, deleteShow, listShows, updateShow } from '@/api/events';
import { formatDateTime } from '@/lib/utils';
import type { Show, ShowInput } from '@/types/event';

export function EventsAdminPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Show | null>(null);
  const [open, setOpen] = useState(false);

  const { data: shows = [], isLoading } = useQuery({
    queryKey: ['shows'],
    queryFn: listShows,
  });

  function errorMessage(err: unknown, fallback: string) {
    if (axios.isAxiosError(err)) {
      return err.response?.data?.error ?? err.response?.data?.message ?? fallback;
    }
    return fallback;
  }

  const saveMutation = useMutation({
    mutationFn: (input: ShowInput) =>
      editing ? updateShow(editing.id, input) : createShow(input),
    onSuccess: () => {
      toast.success(editing ? 'Evento atualizado' : 'Evento criado');
      qc.invalidateQueries({ queryKey: ['shows'] });
      setOpen(false);
      setEditing(null);
    },
    onError: (err) => toast.error(errorMessage(err, 'Falha ao salvar')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteShow(id),
    onSuccess: () => {
      toast.success('Evento excluído');
      qc.invalidateQueries({ queryKey: ['shows'] });
    },
    onError: (err) => toast.error(errorMessage(err, 'Falha ao excluir')),
  });

  function handleNew() {
    setEditing(null);
    setOpen(true);
  }
  function handleEdit(show: Show) {
    setEditing(show);
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
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Capacidade</TableHead>
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
            {!isLoading && shows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum evento ainda.
                </TableCell>
              </TableRow>
            )}
            {shows.map((show) => (
              <TableRow key={show.id}>
                <TableCell className="font-medium max-w-[260px] truncate">{show.name}</TableCell>
                <TableCell>{show.show_type}</TableCell>
                <TableCell>{formatDateTime(show.date)}</TableCell>
                <TableCell className="max-w-[220px] truncate">
                  {show.city}, {show.state}
                </TableCell>
                <TableCell>{show.capacity}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(show)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Excluir "${show.name}"?`)) deleteMutation.mutate(show.id);
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
