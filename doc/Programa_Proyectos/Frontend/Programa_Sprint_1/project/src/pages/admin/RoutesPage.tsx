import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/ui';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { routeStatusConfig, formatMinutes } from '@/utils/formatters';
import { Route as RouteIcon, Map, ArrowRight, Truck, Users, Clock, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function RoutesPage() {
  const { routes, drivers, vehicles } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader title="Rutas" subtitle="Listado de rutas planificadas y en ejecución" />

      {routes.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
            <RouteIcon size={48} strokeWidth={1.5} />
            <p className="text-sm">No hay rutas generadas. Vaya a Planificación para generar rutas.</p>
            <Button variant="outline" icon={<Map size={16} />} onClick={() => navigate('/planning')}>
              Ir a planificación
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {routes.map((r) => {
            const driver = drivers.find((d) => d.id === r.driverId);
            const vehicle = vehicles.find((v) => v.id === r.vehicleId);
            const pct = r.totalDeliveries > 0 ? (r.completedDeliveries / r.totalDeliveries) * 100 : 0;
            return (
              <Card key={r.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                      <RouteIcon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{r.code}</p>
                      <p className="text-xs text-slate-400">{r.date}</p>
                    </div>
                  </div>
                  <Badge color={routeStatusConfig[r.status].color}>{routeStatusConfig[r.status].label}</Badge>
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={14} className="text-slate-400" />
                    <span className="text-slate-700">{driver?.name || 'Sin asignar'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck size={14} className="text-slate-400" />
                    <span className="text-slate-700">{vehicle?.code || 'Sin asignar'} · {vehicle?.plate}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-3 text-center">
                    <div><p className="text-xs text-slate-400">Entregas</p><p className="text-sm font-semibold text-slate-900">{r.totalDeliveries}</p></div>
                    <div><p className="text-xs text-slate-400">Distancia</p><p className="text-sm font-semibold text-slate-900">{r.totalDistanceKm} km</p></div>
                    <div><p className="text-xs text-slate-400">Tiempo</p><p className="text-sm font-semibold text-slate-900">{formatMinutes(r.estimatedTimeMin)}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={12} /> Salida: {r.departureTime}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> Llegada: {r.estimatedArrivalTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Leaf size={14} className="text-emerald-500" />
                    <span className="text-slate-600">Emisiones: {r.emissionsKgCO2} kg CO₂</span>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                      <span>Progreso</span><span>{r.completedDeliveries}/{r.totalDeliveries}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" icon={<ArrowRight size={14} />} onClick={() => navigate(`/routes/${r.id}`)}>
                    Ver detalle
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
