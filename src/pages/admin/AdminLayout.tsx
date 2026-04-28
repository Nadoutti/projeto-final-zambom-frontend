import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export function AdminLayout() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
