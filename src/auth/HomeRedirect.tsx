import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.admin ? '/admin/eventos' : '/eventos'} replace />;
}
