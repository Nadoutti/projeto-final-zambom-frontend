import { Link, NavLink } from 'react-router-dom';
import { Shield, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
    );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/eventos" className="flex items-center gap-2 font-semibold">
          <Ticket className="h-5 w-5 text-primary" />
          <span>Zambom Ingressos</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/eventos" className={navLinkClass}>
            Eventos
          </NavLink>
          <NavLink to="/ingressos" className={navLinkClass}>
            Ingressos
          </NavLink>
          <NavLink to="/admin/eventos" className={navLinkClass}>
            <span className="inline-flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              Admin
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
