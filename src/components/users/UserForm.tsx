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
import { toast } from 'sonner';
import { isValidCPF, onlyDigits } from '@/lib/utils';
import type { User } from '@/types/user';

export interface UserFormPayload {
  name: string;
  email: string;
  cpf: string;
  password?: string;
  admin: boolean;
}

interface Props {
  initial?: User | null;
  submitting?: boolean;
  onSubmit: (data: UserFormPayload) => void;
  onCancel: () => void;
}

export function UserForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [admin, setAdmin] = useState<'admin' | 'user'>('user');

  useEffect(() => {
    setName(initial?.name ?? '');
    setEmail(initial?.email ?? '');
    setCpf(initial?.cpf ?? '');
    setPassword('');
    setAdmin(initial?.admin ? 'admin' : 'user');
  }, [initial]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidCPF(cpf)) {
      toast.error('CPF inválido — informe os 11 dígitos');
      return;
    }
    const payload: UserFormPayload = {
      name,
      email,
      cpf: onlyDigits(cpf),
      admin: admin === 'admin',
    };
    if (password) payload.password = password;
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
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
        <Label htmlFor="cpf">CPF</Label>
        <Input id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{initial ? 'Nova senha (opcional)' : 'Senha'}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!initial}
          minLength={initial ? 0 : 6}
          placeholder={initial ? 'Deixe em branco para manter' : ''}
        />
      </div>
      <div className="space-y-2">
        <Label>Papel</Label>
        <Select value={admin} onValueChange={(v) => setAdmin(v as 'admin' | 'user')}>
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
