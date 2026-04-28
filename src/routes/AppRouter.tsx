import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { EventsPage } from '@/pages/EventsPage';
import { EventDetailPage } from '@/pages/EventDetailPage';
import { TicketsPage } from '@/pages/TicketsPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { EventsAdminPage } from '@/pages/admin/EventsAdminPage';
import { UsersAdminPage } from '@/pages/admin/UsersAdminPage';
import { TicketsAdminPage } from '@/pages/admin/TicketsAdminPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/eventos" replace />} />
        <Route path="/eventos" element={<EventsPage />} />
        <Route path="/eventos/:id" element={<EventDetailPage />} />
        <Route path="/ingressos" element={<TicketsPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/eventos" replace />} />
          <Route path="eventos" element={<EventsAdminPage />} />
          <Route path="usuarios" element={<UsersAdminPage />} />
          <Route path="ingressos" element={<TicketsAdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/eventos" replace />} />
      </Route>
    </Routes>
  );
}
