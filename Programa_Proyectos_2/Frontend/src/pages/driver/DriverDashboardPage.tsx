import { useApp } from '@/store/AppContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { orderStatusConfig } from '@/utils/formatters';
import {
  Package, CheckCircle2, AlertTriangle, MapPin, Truck, ArrowRight,
  Navigation, Clock, Phone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DriverDashboardPage() {
  const { currentUser, orders, drivers, vehicles, routes } = useApp();
  const navigate = useNavigate();

  const driver = drivers.find((d) => d.id === currentUser?.driverId);
  const myRoute = routes.find((r) => r.driverId === currentUser?.driverId);
  const myOrders = orders.filter((o) => o.driverId === currentUser?.driverId);
  const myVehicle = vehicles.find((v) => v.id === driver?.vehicleId);

  const completed = myOrders.filter((o) => o.status === 'delivered').length;
  const pending = myOrders.filter((o) => o.status === 'in_route' || o.status === 'planned').length;
  const incidents = myOrders.filter((o) => o.status === 'not_delivered').length;

  const nextDelivery = myOrders.find((o) => o.status === 'in_route' || o.status === 'planned');
  const routeProgress = myRoute && myRoute.totalDeliveries > 0
    ? Math.round((myRoute.completedDeliveries / myRoute.totalDeliveries) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Saludo grande y claro */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white">
        <p className="text-sm font-medium text-blue-100">Bienvenido</p>
        <h1 className="mt-1 text-2xl font-bold">{currentUser?.name}</h1>
        <p className="mt-1 text-sm text-blue-200">
          {myRoute
            ? `Ruta ${myRoute.code} · ${myRoute.completedDeliveries}/${myRoute.totalDeliveries} entregas`
            : 'Sin ruta asignada hoy'}
        </p>
        {myRoute && (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs text-blue-100">
              <span>Progreso del día</span>
              <span>{routeProgress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-blue-900/50">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${routeProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tarjetas de resumen grandes y simples */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <button
          onClick={() => navigate('/my-deliveries')}
          className="flex flex-col items-start rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Ver mis entregas"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Package size={26} />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">{myOrders.length}</p>
          <p className="text-sm text-slate-500">Entregas asignadas</p>
        </button>

        <button
          onClick={() => navigate('/my-deliveries')}
          className="flex flex-col items-start rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all hover:border-emerald-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Ver entregas completadas"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={26} />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">{completed}</p>
          <p className="text-sm text-slate-500">Completadas</p>
        </button>

        <button
          onClick={() => navigate('/my-deliveries')}
          className="flex flex-col items-start rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all hover:border-amber-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Ver entregas pendientes"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Clock size={26} />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">{pending}</p>
          <p className="text-sm text-slate-500">Pendientes</p>
        </button>

        <button
          onClick={() => navigate('/my-deliveries')}
          className="flex flex-col items-start rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all hover:border-red-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Ver incidencias"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <AlertTriangle size={26} />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">{incidents}</p>
          <p className="text-sm text-slate-500">Incidencias</p>
        </button>
      </div>

      {/* Próxima entrega - tarjeta destacada */}
      {nextDelivery && (
        <div className="overflow-hidden rounded-2xl border-2 border-blue-300 bg-white">
          <div className="flex items-center gap-3 bg-blue-50 px-5 py-3">
            <Navigation size={18} className="text-blue-600" />
            <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Próxima entrega</p>
          </div>
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{nextDelivery.code}</p>
                <p className="text-sm text-slate-600">{nextDelivery.address.street}, {nextDelivery.address.district}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {nextDelivery.timeWindowStart} - {nextDelivery.timeWindowEnd}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={14} /> {nextDelivery.phone}
                  </span>
                </div>
              </div>
            </div>
            <Button size="lg" icon={<ArrowRight size={18} />} onClick={() => navigate('/my-deliveries')}>
              Ir a entregar
            </Button>
          </div>
        </div>
      )}

      {/* Accesos rápidos grandes */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <QuickAccess
          icon={<MapPin size={28} />}
          label="Mi ruta"
          description={myRoute ? `Ruta ${myRoute.code}` : 'Sin asignar'}
          color="blue"
          onClick={() => navigate('/my-route')}
        />
        <QuickAccess
          icon={<Package size={28} />}
          label="Mis entregas"
          description={`${myOrders.length} entregas`}
          color="emerald"
          onClick={() => navigate('/my-deliveries')}
        />
        <QuickAccess
          icon={<Truck size={28} />}
          label="Mi vehículo"
          description={myVehicle ? myVehicle.code : 'Sin asignar'}
          color="amber"
          onClick={() => navigate('/my-vehicle')}
        />
      </div>

      {/* Entregas recientes - lista simple */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Entregas recientes</h2>
          <button
            onClick={() => navigate('/history')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Ver historial
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {myOrders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                {o.code.slice(-3)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">{o.address.district}</p>
                <p className="truncate text-xs text-slate-500">{o.address.street}</p>
              </div>
              <Badge color={orderStatusConfig[o.status].color}>{orderStatusConfig[o.status].label}</Badge>
            </div>
          ))}
          {myOrders.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-400">No tiene entregas asignadas</p>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAccess({
  icon, label, description, color, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: 'blue' | 'emerald' | 'amber';
  onClick: () => void;
}) {
  const colors = {
    blue: 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    amber: 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100',
  };
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${colors[color]}`}
    >
      <div className="mb-3">{icon}</div>
      <p className="text-base font-bold text-slate-900">{label}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </button>
  );
}
