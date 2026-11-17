import { useState, type ReactNode } from 'react';
import { useApp } from '@/store/AppContext';
import { navConfig, roleLabels } from './navConfig';
import { Truck, Bell, LogOut, Menu, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDate } from '@/utils/formatters';

interface LayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: LayoutProps) {
  const { currentUser, signOut, notifications, markNotificationRead, markAllNotificationsRead, loading, loadError, refreshAll } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const runAction = async (action: () => Promise<void>) => {
    setActionError(null);
    try { await action(); } catch (error) { setActionError(error instanceof Error ? error.message : "No se pudo completar la operacion"); }
  };

  if (!currentUser) return null;

  const navItems = navConfig[currentUser.role] || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-blue-950 text-white">
      <div className="flex items-center gap-3 border-b border-blue-900 p-5"><Truck /><span className="font-bold">EcoLogística Lima</span></div>
      <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <button key={item.path} onClick={() => { navigate(item.path); setSidebarOpen(false); }}
            aria-current={location.pathname === item.path ? 'page' : undefined}
            className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${location.pathname === item.path ? 'bg-blue-700' : 'hover:bg-blue-900'}`}>
            {item.icon}{item.label}
          </button>
        ))}
      </nav>
      <div className="border-t border-blue-900 p-4"><p>{currentUser.name}</p><p className="text-xs text-blue-200">{roleLabels[currentUser.role]}</p>
        <button onClick={() => { void runAction(handleLogout); }} className="mt-3 flex items-center gap-2 text-sm"><LogOut size={18} />Cerrar sesión</button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      <a href="#contenido-principal" className="sr-only focus:not-sr-only">Saltar al contenido</a>
      <aside className="hidden w-64 shrink-0 lg:block">{sidebar}</aside>
      {sidebarOpen && <div className="fixed inset-0 z-40 lg:hidden">
        <button aria-label="Cerrar menú" onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-slate-900/60" />
        <aside className="relative h-full w-64">{sidebar}</aside>
      </div>}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-5 py-4">
          <button aria-label="Abrir menú" onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu /></button>
          <span className="font-semibold text-slate-700">{navItems.find((item) => item.path === location.pathname)?.label || 'EcoLogística Lima'}</span>
          <div className="relative flex items-center gap-4">
            <button aria-label="Actualizar datos" onClick={() => { void refreshAll(); }} disabled={loading}><RefreshCw size={20} /></button>
            <button aria-label="Notificaciones" aria-expanded={notifOpen} onClick={() => setNotifOpen(!notifOpen)} className="flex items-center gap-2"><Bell size={20} />{unreadCount > 0 && <span>{unreadCount}</span>}</button>
            {notifOpen && <section aria-label="Lista de notificaciones" className="absolute right-0 z-30 mt-3 max-h-96 w-80 overflow-auto rounded-xl border bg-white p-4 shadow-lg">
              {notifications.length === 0 && <p className="text-sm">Sin notificaciones</p>}
              {notifications.map((n) => <button key={n.id} onClick={() => { void runAction(() => markNotificationRead(n.id)); }} className="mb-2 block w-full rounded border p-3 text-left text-sm">
                <strong>{n.title}</strong><p>{n.message}</p><time>{formatDate(n.timestamp)}</time>
              </button>)}
              <button onClick={() => { void runAction(markAllNotificationsRead); }} className="text-sm text-blue-700">Marcar todas como leídas</button>
            </section>}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6" id="contenido-principal" tabIndex={-1}>
          <div className="mx-auto max-w-7xl">
            {actionError && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{actionError}</p>}
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <AlertCircle size={28} />
                </div>
                <p className="max-w-md text-center text-sm text-slate-600">{loadError}</p>
                <button
                  onClick={() => refreshAll()}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <RefreshCw size={16} />
                  Reintentar
                </button>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
