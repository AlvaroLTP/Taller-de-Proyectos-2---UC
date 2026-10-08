import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/ui';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RouteMap } from '@/components/ui/RouteMap';
import { routeStatusConfig, orderStatusConfig, formatMinutes } from '@/utils/formatters';
import { ArrowLeft, Truck, Users, Clock, Leaf, MapPin, Package } from 'lucide-react';
import type { RouteStatus } from '@/types';

export function RouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { routes, drivers, vehicles, updateRouteStatus } = useApp();

  const route = routes.find((r) => r.id === id);

  if (!route) {
    return (
      <div className="space-y-6">
        <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={() => navigate('/routes')}>Volver</Button>
        <Card>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
            <Package size={48} strokeWidth={1.5} />
            <p className="text-sm">Ruta no encontrada</p>
          </div>
        </Card>
      </div>
    );
  }

  const driver = drivers.find((d) => d.id === route.driverId);
  const vehicle = vehicles.find((v) => v.id === route.vehicleId);
  const pct = route.totalDeliveries > 0 ? (route.completedDeliveries / route.totalDeliveries) * 100 : 0;

  const handleStatusChange = async (status: RouteStatus) => {
    await updateRouteStatus(route.id, status);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={() => navigate('/routes')}>Volver</Button>
        <PageHeader title={`Ruta ${route.code}`} subtitle={`Fecha: ${route.date}`} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge color={routeStatusConfig[route.status].color}>{routeStatusConfig[route.status].label}</Badge>
        <div className="ml-auto flex gap-2">
          {route.status === 'pending' && (
            <Button size="sm" onClick={() => handleStatusChange('preparing')}>Iniciar preparación</Button>
          )}
          {route.status === 'preparing' && (
            <Button size="sm" onClick={() => handleStatusChange('in_route')}>Iniciar ruta</Button>
          )}
          {route.status === 'in_route' && (
            <>
              <Button size="sm" variant="danger" onClick={() => handleStatusChange('with_incidents')}>Reportar incidencia</Button>
              <Button size="sm" variant="success" onClick={() => handleStatusChange('finished')}>Finalizar ruta</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <InfoStat icon={<Users size={18} />} label="Conductor" value={driver?.name || '-'} color="text-blue-600" />
        <InfoStat icon={<Truck size={18} />} label="Vehículo" value={vehicle?.code || '-'} color="text-blue-600" />
        <InfoStat icon={<Clock size={18} />} label="Tiempo estimado" value={formatMinutes(route.estimatedTimeMin)} color="text-sky-600" />
        <InfoStat icon={<Leaf size={18} />} label="Emisiones" value={`${route.emissionsKgCO2} kg CO₂`} color="text-emerald-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Mapa de ruta" subtitle="Representación visual simulada" />
            <div className="p-4">
              <RouteMap
                stops={route.stops}
                driverName={driver?.name}
                vehicleCode={vehicle?.code}
                totalDistance={route.totalDistanceKm}
              />
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Resumen" subtitle="Información general" />
          <div className="space-y-3 p-5">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Hora de salida</span><span className="font-medium text-slate-900">{route.departureTime}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Hora estimada de llegada</span><span className="font-medium text-slate-900">{route.estimatedArrivalTime}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Distancia total</span><span className="font-medium text-slate-900">{route.totalDistanceKm} km</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Total de entregas</span><span className="font-medium text-slate-900">{route.totalDeliveries}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Completadas</span><span className="font-medium text-emerald-600">{route.completedDeliveries}</span></div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Progreso</span><span>{pct.toFixed(0)}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Paradas de entrega" subtitle={`${route.stops.length} paradas`} />
        <div className="divide-y divide-slate-100">
          {route.stops.map((s) => (
            <div key={s.orderId} className="flex items-center gap-4 px-5 py-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                {s.order}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{s.clientName}</p>
                <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                  <MapPin size={12} /> {s.address}, {s.district}
                </p>
              </div>
              <div className="hidden text-xs text-slate-500 sm:block">
                <Clock size={12} className="inline" /> {s.timeWindow}
              </div>
              <Badge color={orderStatusConfig[s.status].color}>{orderStatusConfig[s.status].label}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function InfoStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
