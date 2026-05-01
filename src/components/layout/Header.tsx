import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Shield, Ticket, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/auth/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
    );

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  if (!user) return null;

  const isAdmin = user.admin;
  const homeHref = isAdmin ? '/admin/eventos' : '/eventos';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link to={homeHref} className="flex items-center gap-2 font-semibold">
          {isAdmin ? (
            <Shield className="h-5 w-5 text-primary" />
          ) : (
            <Ticket className="h-5 w-5 text-primary" />
          )}
          <span>Zambom Ingressos{isAdmin && ' · Admin'}</span>
        </Link>

        <nav className="flex items-center gap-1">
          {isAdmin ? (
            <>
              <NavLink to="/admin/eventos" className={navLinkClass}>
                Eventos
              </NavLink>
              <NavLink to="/admin/usuarios" className={navLinkClass}>
                Usuários
              </NavLink>
              <NavLink to="/admin/ingressos" className={navLinkClass}>
                Ingressos
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/eventos" className={navLinkClass}>
                Eventos
              </NavLink>
              <NavLink to="/ingressos" className={navLinkClass}>
                Meus Ingressos
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <UserRound className="h-4 w-4" /> {user.name}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" /> Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
