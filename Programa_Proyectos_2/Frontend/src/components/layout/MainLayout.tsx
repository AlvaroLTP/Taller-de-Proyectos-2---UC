import { useState, type ReactNode } from 'react';
import { useApp } from '@/store/AppContext';
import { navConfig, roleLabels } from './navConfig';
import { Truck, Bell, LogOut, Menu, X, Leaf } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDate } from '@/utils/formatters';

interface LayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: LayoutProps) {
  const { currentUser, setCurrentUser, notifications, markNotificationRead, markAllNotificationsRead, loading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  if (!currentUser) return null;

  const navItems = navConfig[currentUser.role] || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-blue-950">
      <div className="flex items-center gap-3 border-b border-blue-900 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20">
          <Truck size={22} className="text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold text-white">EcoLogística Lima</h1>
          <p className="truncate text-xs text-blue-300">DistriRápido S.A.C.</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-blue-400">
          {roleLabels[currentUser.role]}
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-500/15 text-blue-400 shadow-sm'
                      : 'text-slate-400 hover:bg-blue-900/50 hover:text-slate-200'
                  }`}
                >
                  <span className={isActive ? 'text-blue-400' : 'text-slate-500'}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                  {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-blue-900 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-blue-900/50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white">
            {currentUser.avatarInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{currentUser.name}</p>
            <p className="truncate text-xs text-blue-300">{roleLabels[currentUser.role]}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-900 hover:text-red-400"
            title="Cambiar de rol"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute -right-10 top-4 z-50 rounded-lg bg-slate-800 p-2 text-white"
            >
              <X size={20} />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-700">
                {formatDate(new Date().toISOString())}
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1">
              <Leaf size={14} className="text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Operación sostenible</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-12 z-40 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-900">Notificaciones</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllNotificationsRead()}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Marcar todas como leídas
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-400">Sin notificaciones</p>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`flex w-full gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                              !n.read ? 'bg-blue-50/40' : ''
                            }`}
                          >
                            <div
                              className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                                n.type === 'error' ? 'bg-red-500' : n.type === 'warning' ? 'bg-amber-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-sky-500'
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-900">{n.title}</p>
                              <p className="mt-0.5 text-xs text-slate-500">{n.message}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white">
                {currentUser.avatarInitials}
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-700">{currentUser.name}</p>
                <p className="text-xs text-slate-400">{roleLabels[currentUser.role]}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
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
