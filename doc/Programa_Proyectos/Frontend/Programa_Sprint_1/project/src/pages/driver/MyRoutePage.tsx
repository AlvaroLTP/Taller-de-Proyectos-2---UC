import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/ui';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RouteMap } from '@/components/ui/RouteMap';
import { orderStatusConfig, formatMinutes } from '@/utils/formatters';
import { MapPin, Flag, CheckCircle2, Clock, Navigation, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MyRoutePage() {
  const { currentUser, routes, drivers, vehicles } = useApp();
  const navigate = useNavigate();

  const myRoute = routes.find((r) => r.driverId === currentUser?.driverId);
  const driver = drivers.find((d) => d.id === currentUser?.driverId);
  const vehicle = vehicles.find((v) => v.id === myRoute?.vehicleId);

  if (!myRoute) {
    return (
      <div className="space-y-6">
        <PageHeader title="Mi ruta" subtitle="Ruta asignada para el día" />
        <Card>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
            <MapPin size={48} strokeWidth={1.5} />
            <p className="text-sm">No tiene una ruta asignada para hoy</p>
          </div>
        </Card>
      </div>
    );
  }

  const completed = myRoute.stops.filter((s) => s.status === 'delivered');
  const pending = myRoute.stops.filter((s) => s.status === 'in_route' || s.status === 'planned');
  const nextStop = pending[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Mi ruta" subtitle={`${myRoute.code} · ${myRoute.totalDeliveries} entregas`} />

      {nextStop && (
        <Card className="overflow-hidden border-teal-200">
          <div className="flex items-center gap-4 bg-teal-50 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-white">
              <Navigation size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-teal-700">PRÓXIMA ENTREGA</p>
              <p className="font-semibold text-slate-900">Parada #{nextStop.order} - {nextStop.clientName}</p>
              <p className="text-sm text-slate-600">{nextStop.address}, {nextStop.district}</p>
              <p className="flex items-center gap-1 text-xs text-slate-500"><Clock size={12} /> {nextStop.timeWindow}</p>
            </div>
            <Button icon={<ArrowRight size={16} />} onClick={() => navigate('/my-deliveries')}>
              Ir
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <CheckCircle2 size={20} className="text-emerald-500" />
          <p className="mt-2 text-xs text-slate-400">Completadas</p>
          <p className="text-xl font-bold text-slate-900">{completed.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Clock size={20} className="text-amber-500" />
          <p className="mt-2 text-xs text-slate-400">Pendientes</p>
          <p className="text-xl font-bold text-slate-900">{pending.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <MapPin size={20} className="text-blue-500" />
          <p className="mt-2 text-xs text-slate-400">Distancia</p>
          <p className="text-xl font-bold text-slate-900">{myRoute.totalDistanceKm} km</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Clock size={20} className="text-sky-500" />
          <p className="mt-2 text-xs text-slate-400">Tiempo est.</p>
          <p className="text-xl font-bold text-slate-900">{formatMinutes(myRoute.estimatedTimeMin)}</p>
        </div>
      </div>

      <Card>
        <CardHeader title="Mapa de mi ruta" subtitle="Representación visual simulada" />
        <div className="p-4">
          <RouteMap stops={myRoute.stops} driverName={driver?.name} vehicleCode={vehicle?.code} totalDistance={myRoute.totalDistanceKm} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Orden de entregas" subtitle="Siga el orden indicado para optimizar su ruta" />
        <div className="divide-y divide-slate-100">
          {myRoute.stops.map((s) => {
            const isCompleted = s.status === 'delivered';
            const isCurrent = s.status === 'in_route';
            const isIncident = s.status === 'not_delivered' || s.status === 'cancelled';
            return (
              <div key={s.orderId} className="flex items-center gap-4 px-5 py-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  isCompleted ? 'bg-emerald-100 text-emerald-700' :
                  isCurrent ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300' :
                  isIncident ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {isCompleted ? <CheckCircle2 size={18} /> : s.order}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {s.clientName}
                  </p>
                  <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                    <MapPin size={12} /> {s.address}, {s.district}
                  </p>
                </div>
                <div className="hidden text-xs text-slate-500 sm:block">
                  <Clock size={12} className="inline" /> {s.timeWindow}
                </div>
                <Badge color={orderStatusConfig[s.status].color}>{orderStatusConfig[s.status].label}</Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
