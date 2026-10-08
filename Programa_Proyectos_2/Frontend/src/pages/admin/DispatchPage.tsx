import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/ui';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { routeStatusConfig, formatMinutes } from '@/utils/formatters';
import { Truck, Users, Clock, ArrowRight, Play, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RouteStatus } from '@/types';

export function DispatchPage() {
  const { routes, drivers, vehicles, updateRouteStatus } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader title="Despacho" subtitle="Supervisión de rutas del día" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {(['pending', 'preparing', 'in_route', 'finished', 'with_incidents'] as RouteStatus[]).map((st) => (
          <div key={st} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-400">{routeStatusConfig[st].label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{routes.filter((r) => r.status === st).length}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {routes.map((r) => {
          const driver = drivers.find((d) => d.id === r.driverId);
          const vehicle = vehicles.find((v) => v.id === r.vehicleId);
          const pct = r.totalDeliveries > 0 ? (r.completedDeliveries / r.totalDeliveries) * 100 : 0;
          return (
            <Card key={r.id} className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <span className="font-semibold text-slate-900">{r.code}</span>
                <Badge color={routeStatusConfig[r.status].color}>{routeStatusConfig[r.status].label}</Badge>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-slate-400" /><span className="text-slate-700">{driver?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Truck size={14} className="text-slate-400" /><span className="text-slate-700">{vehicle?.code} · {r.totalDeliveries} entregas</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={12} /> Salida: {r.departureTime} · ETA: {r.estimatedArrivalTime}
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Progreso</span><span>{r.completedDeliveries}/{r.totalDeliveries}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  {r.status === 'pending' && (
                    <Button size="sm" className="flex-1" icon={<Play size={14} />} onClick={() => updateRouteStatus(r.id, 'preparing')}>
                      Iniciar
                    </Button>
                  )}
                  {r.status === 'preparing' && (
                    <Button size="sm" className="flex-1" icon={<Play size={14} />} onClick={() => updateRouteStatus(r.id, 'in_route')}>
                      Despachar
                    </Button>
                  )}
                  {r.status === 'in_route' && (
                    <>
                      <Button size="sm" variant="danger" icon={<AlertTriangle size={14} />} onClick={() => updateRouteStatus(r.id, 'with_incidents')}>
                        Incidencia
                      </Button>
                      <Button size="sm" variant="success" icon={<CheckCircle size={14} />} onClick={() => updateRouteStatus(r.id, 'finished')}>
                        Finalizar
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" icon={<ArrowRight size={14} />} onClick={() => navigate(`/routes/${r.id}`)}>
                    Detalle
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
