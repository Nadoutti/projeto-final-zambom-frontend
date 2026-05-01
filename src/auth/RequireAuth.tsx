import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface Props {
  requireRole?: 'admin' | 'user';
}

export function RequireAuth({ requireRole }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireRole === 'admin' && !user.admin) {
    return <Navigate to="/eventos" replace />;
  }

  if (requireRole === 'user' && user.admin) {
    return <Navigate to="/admin/eventos" replace />;
  }

  return <Outlet />;
}
