import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Role, User } from '@/types/user';

export interface UserFormPayload {
  nome: string;
  email: string;
  role: Role;
}

interface Props {
  initial?: User | null;
  submitting?: boolean;
  onSubmit: (data: UserFormPayload) => void;
  onCancel: () => void;
}

export function UserForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('user');

  useEffect(() => {
    setNome(initial?.nome ?? '');
    setEmail(initial?.email ?? '');
    setRole(initial?.role ?? 'user');
  }, [initial]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ nome, email, role });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Papel</Label>
        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Usuário</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}
