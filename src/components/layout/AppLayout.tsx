import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <Outlet />
      </main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        Zambom Ingressos · Projeto 4º semestre · dados mockados via MSW
      </footer>
    </div>
  );
}
