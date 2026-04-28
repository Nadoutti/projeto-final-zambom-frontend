import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Evento, EventoInput } from '@/types/event';

interface Props {
  initial?: Evento | null;
  submitting?: boolean;
  onSubmit: (data: EventoInput) => void;
  onCancel: () => void;
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [preco, setPreco] = useState(0);
  const [estoque, setEstoque] = useState(0);
  const [imagem, setImagem] = useState('');

  useEffect(() => {
    if (initial) {
      setNome(initial.nome);
      setDescricao(initial.descricao);
      setData(toLocalInput(initial.data));
      setLocal(initial.local);
      setPreco(initial.preco);
      setEstoque(initial.estoque);
      setImagem(initial.imagem ?? '');
    } else {
      setNome('');
      setDescricao('');
      setData('');
      setLocal('');
      setPreco(0);
      setEstoque(0);
      setImagem('');
    }
  }, [initial]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      nome,
      descricao,
      data: new Date(data).toISOString(),
      local,
      preco: Number(preco),
      estoque: Number(estoque),
      imagem: imagem || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do evento</Label>
        <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="data">Data e hora</Label>
          <Input
            id="data"
            type="datetime-local"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="local">Local</Label>
          <Input id="local" value={local} onChange={(e) => setLocal(e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="preco">Preço (R$)</Label>
          <Input
            id="preco"
            type="number"
            min={0}
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(Number(e.target.value))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estoque">Estoque</Label>
          <Input
            id="estoque"
            type="number"
            min={0}
            value={estoque}
            onChange={(e) => setEstoque(Number(e.target.value))}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="imagem">URL da imagem (opcional)</Label>
        <Input
          id="imagem"
          type="url"
          placeholder="https://..."
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        />
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
