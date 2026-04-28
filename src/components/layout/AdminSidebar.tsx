import { NavLink } from 'react-router-dom';
import { CalendarDays, Ticket, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { to: '/admin/eventos', label: 'Eventos', icon: CalendarDays },
  { to: '/admin/usuarios', label: 'Usuários', icon: Users },
  { to: '/admin/ingressos', label: 'Ingressos', icon: Ticket },
];

export function AdminSidebar() {
  return (
    <aside className="w-full md:w-56 shrink-0">
      <nav className="flex md:flex-col gap-1 overflow-x-auto">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
