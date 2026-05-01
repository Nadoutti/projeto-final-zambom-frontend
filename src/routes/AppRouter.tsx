import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { EventsPage } from '@/pages/EventsPage';
import { EventDetailPage } from '@/pages/EventDetailPage';
import { TicketsPage } from '@/pages/TicketsPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { EventsAdminPage } from '@/pages/admin/EventsAdminPage';
import { UsersAdminPage } from '@/pages/admin/UsersAdminPage';
import { TicketsAdminPage } from '@/pages/admin/TicketsAdminPage';
import { RequireAuth } from '@/auth/RequireAuth';
import { HomeRedirect } from '@/auth/HomeRedirect';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registrar" element={<RegisterPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeRedirect />} />

          <Route element={<RequireAuth requireRole="user" />}>
            <Route path="/eventos" element={<EventsPage />} />
            <Route path="/eventos/:id" element={<EventDetailPage />} />
            <Route path="/ingressos" element={<TicketsPage />} />
          </Route>

          <Route element={<RequireAuth requireRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<HomeRedirect />} />
              <Route path="eventos" element={<EventsAdminPage />} />
              <Route path="usuarios" element={<UsersAdminPage />} />
              <Route path="ingressos" element={<TicketsAdminPage />} />
            </Route>
          </Route>

          <Route path="*" element={<HomeRedirect />} />
        </Route>
      </Route>
    </Routes>
  );
}
