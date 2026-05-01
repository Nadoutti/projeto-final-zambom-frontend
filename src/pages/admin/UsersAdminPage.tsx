import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
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
import { UserForm, type UserFormPayload } from '@/components/users/UserForm';
import { deleteUser, listUsers, updateUser } from '@/api/users';
import type { User } from '@/types/user';

export function UsersAdminPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
  });

  function errorMessage(err: unknown, fallback: string) {
    if (axios.isAxiosError(err)) {
      return err.response?.data?.error ?? err.response?.data?.message ?? fallback;
    }
    return fallback;
  }

  const saveMutation = useMutation({
    mutationFn: (input: UserFormPayload) => {
      if (!editing) return Promise.reject(new Error('Sem usuário selecionado'));
      const { password, ...rest } = input;
      return updateUser(editing.id, password ? { ...rest, password } : rest);
    },
    onSuccess: () => {
      toast.success('Usuário atualizado');
      qc.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
      setEditing(null);
    },
    onError: (err) => toast.error(errorMessage(err, 'Falha ao salvar')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success('Usuário excluído');
      qc.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => toast.error(errorMessage(err, 'Falha ao excluir')),
  });

  function handleEdit(u: User) {
    setEditing(u);
    setOpen(true);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Usuários</h1>
        <p className="text-sm text-muted-foreground">Gerencie contas e papéis.</p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Papel</TableHead>
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
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.cpf}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.admin
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {u.admin ? 'Admin' : 'Usuário'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(u)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Excluir usuário "${u.name}"?`)) deleteMutation.mutate(u.id);
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
            <DialogTitle>{editing ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
          </DialogHeader>
          <UserForm
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
