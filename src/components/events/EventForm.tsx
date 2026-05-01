import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Show, ShowInput } from '@/types/event';

interface Props {
  initial?: Show | null;
  submitting?: boolean;
  onSubmit: (data: ShowInput) => void;
  onCancel: () => void;
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const [name, setName] = useState('');
  const [showType, setShowType] = useState('');
  const [country, setCountry] = useState('Brasil');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [capacity, setCapacity] = useState(0);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setShowType(initial.show_type);
      setCountry(initial.country);
      setState(initial.state);
      setCity(initial.city);
      setAddress(initial.address);
      setDate(toLocalInput(initial.date));
      setCapacity(initial.capacity);
    } else {
      setName('');
      setShowType('');
      setCountry('Brasil');
      setState('');
      setCity('');
      setAddress('');
      setDate('');
      setCapacity(0);
    }
  }, [initial]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      show_type: showType,
      country,
      state,
      city,
      address,
      date: new Date(date).toISOString(),
      capacity: Number(capacity),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Nome do evento</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="show_type">Tipo</Label>
          <Input
            id="show_type"
            value={showType}
            onChange={(e) => setShowType(e.target.value)}
            placeholder="show, festival, teatro..."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Data e hora</Label>
          <Input
            id="date"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacidade</Label>
          <Input
            id="capacity"
            type="number"
            min={0}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            required
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Endereço</Label>
          <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
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
