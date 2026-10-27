import { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/ui';
import { Card, CardHeader, StatCard, BarChart, DonutChart } from '@/components/ui';
import { MultiRouteMap } from '@/components/ui/MultiRouteMap';
import { Badge } from '@/components/ui/Badge';
import { routeStatusConfig, formatMinutes } from '@/utils/formatters';
import {
  Map as MapIcon, Activity, TrendingDown, Leaf, Clock, Truck, Package,
  Gauge, Route as RouteIcon, AlertTriangle, Fuel, Timer, TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MonitoringPage() {
  const { routes, drivers, vehicles, orders, sustainability } = useApp();
  const navigate = useNavigate();

  // US-017: rutas activas para el mapa
  const activeRoutes = useMemo(
    () => routes.filter((r) => r.status === 'in_route' || r.status === 'preparing' || r.status === 'pending'),
    [routes]
  );
  const inRouteNow = routes.filter((r) => r.status === 'in_route');

  // US-018: niveles de congestión por distrito
  const congestionByDistrict = useMemo(() => {
    const map = new Map<string, number>();
    routes.forEach((r) => {
      r.stops.forEach((s) => {
        map.set(s.district, (map.get(s.district) || 0) + 1);
      });
    });
    return Array.from(map.entries())
      .map(([district, count]) => ({ district, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [routes]);

  const maxCongestion = Math.max(...congestionByDistrict.map((d) => d.count), 1);
  const congestionLevel = (count: number) => {
    const pct = (count / maxCongestion) * 100;
    if (pct >= 75) return { label: 'Alta', color: 'bg-red-100 text-red-700 border-red-200' };
    if (pct >= 45) return { label: 'Media', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Baja', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  // US-019: indicadores operativos
  const totalDeliveries = orders.length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const inRouteOrders = orders.filter((o) => o.status === 'in_route').length;
  const incidents = orders.filter((o) => o.status === 'not_delivered').length;
  const onTimeRate = totalDeliveries > 0 ? ((delivered / totalDeliveries) * 100).toFixed(0) : '0';
  const avgTimePerDelivery =
    routes.length > 0
      ? Math.round(routes.reduce((s, r) => s + r.estimatedTimeMin, 0) / routes.length)
      : 0;
  const vehicleUtilization =
    vehicles.length > 0
      ? Math.round((vehicles.filter((v) => v.status === 'in_route').length / vehicles.length) * 100)
      : 0;
  const activeDrivers = drivers.filter((d) => d.status === 'in_route').length;

  // US-020: ahorros de las rutas (comparación optimizado vs no optimizado)
  const totalDistanceOptimized = routes.reduce((s, r) => s + r.totalDistanceKm, 0);
  // Estimación: sin optimización, la distancia sería ~30% mayor (visitas desordenadas)
  const estimatedUnoptimizedDistance = totalDistanceOptimized * 1.3;
  const distanceSaved = +(estimatedUnoptimizedDistance - totalDistanceOptimized).toFixed(1);
  const distanceSavedPct = estimatedUnoptimizedDistance > 0
    ? Math.round((distanceSaved / estimatedUnoptimizedDistance) * 100)
    : 0;

  const totalTimeOptimized = routes.reduce((s, r) => s + r.estimatedTimeMin, 0);
  const estimatedUnoptimizedTime = totalTimeOptimized * 1.25;
  const timeSavedMin = Math.round(estimatedUnoptimizedTime - totalTimeOptimized);

  const totalEmissionsOptimized = routes.reduce((s, r) => s + r.emissionsKgCO2, 0);
  const emissionsSaved = +(totalEmissionsOptimized * 0.3).toFixed(1);

  const totalFuelOptimized = sustainability?.estimatedConsumptionL || 0;
  const fuelSaved = +(totalFuelOptimized * 0.3).toFixed(1);
  const fuelCostSaved = +(fuelSaved * 5.5).toFixed(2); // S/ por litro de diésel

  const operationalIndicators = [
    { label: 'Rutas activas', value: routes.filter((r) => r.status === 'in_route' || r.status === 'preparing').length, icon: <RouteIcon size={22} />, color: 'blue' as const },
    { label: 'Tasa a tiempo', value: `${onTimeRate}%`, icon: <Gauge size={22} />, color: 'emerald' as const },
    { label: 'Tiempo medio/entrega', value: formatMinutes(avgTimePerDelivery), icon: <Timer size={22} />, color: 'sky' as const },
    { label: 'Uso de flota', value: `${vehicleUtilization}%`, icon: <Truck size={22} />, color: 'amber' as const },
    { label: 'Conductores activos', value: activeDrivers, icon: <Package size={22} />, color: 'blue' as const },
    { label: 'Entregas en ruta', value: inRouteOrders, icon: <Activity size={22} />, color: 'indigo' as const },
  ];

  const savingsData = [
    { label: 'Distancia ahorrada', value: distanceSaved, unit: ' km', icon: <TrendingDown size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Tiempo ahorrado', value: timeSavedMin, unit: ' min', icon: <Clock size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'CO₂ evitado', value: emissionsSaved, unit: ' kg', icon: <Leaf size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Combustible ahorrado', value: fuelSaved, unit: ' L', icon: <Fuel size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Costo combustible ahorrado', value: fuelCostSaved, unit: ' S/', icon: <TrendingUp size={20} />, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  ];

  const statusDistribution = [
    { label: 'Pendientes', value: routes.filter((r) => r.status === 'pending').length, color: '#f59e0b' },
    { label: 'Preparando', value: routes.filter((r) => r.status === 'preparing').length, color: '#0ea5e9' },
    { label: 'En ruta', value: routes.filter((r) => r.status === 'in_route').length, color: '#3b82f6' },
    { label: 'Finalizadas', value: routes.filter((r) => r.status === 'finished').length, color: '#10b981' },
    { label: 'Con incidencias', value: routes.filter((r) => r.status === 'with_incidents').length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoreo operativo"
        subtitle="Visualización y seguimiento de rutas en tiempo real · Sprint 3"
      />

      {/* US-017: Mapa de rutas optimizadas */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Mapa de rutas activas"
              subtitle="Representación visual de paradas y orden de entrega (no es tráfico en tiempo real)"
            />
            <div className="p-4">
              {activeRoutes.length > 0 ? (
                <MultiRouteMap routes={activeRoutes} />
              ) : (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400">
                  <MapIcon size={48} strokeWidth={1.5} />
                  <p className="text-sm">No hay rutas activas para mostrar en el mapa.</p>
                  <button
                    onClick={() => navigate('/planning')}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Ir a planificación
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* US-018: Niveles de congestión */}
        <Card>
          <CardHeader
            title="Niveles de congestión"
            subtitle="Paradas por distrito · datos estimados (no es tráfico en tiempo real)"
          />
          <div className="space-y-3 p-5">
            {congestionByDistrict.length > 0 ? (
              congestionByDistrict.map((d) => {
                const level = congestionLevel(d.count);
                const barPct = (d.count / maxCongestion) * 100;
                return (
                  <div key={d.district}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{d.district}</span>
                      <Badge color={level.color}>{level.label} · {d.count}</Badge>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          level.label === 'Alta' ? 'bg-red-500' : level.label === 'Media' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">Sin datos de congestión</p>
            )}
          </div>
        </Card>
      </div>

      {/* US-019: Indicadores operativos */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Indicadores operativos (US-019)</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {operationalIndicators.map((ind) => (
            <StatCard
              key={ind.label}
              title={ind.label}
              value={ind.value}
              icon={ind.icon}
              color={ind.color}
            />
          ))}
        </div>
      </div>

      {/* Estado de rutas + actividad */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Estado de rutas" subtitle="Distribución actual" />
          <div className="p-5">
            {routes.length > 0 ? (
              <DonutChart data={statusDistribution} />
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">Sin rutas generadas</p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Rutas en ejecución" subtitle="Seguimiento en tiempo real" />
          <div className="divide-y divide-slate-100">
            {inRouteNow.length > 0 ? (
              inRouteNow.map((r) => {
                const driver = drivers.find((d) => d.id === r.driverId);
                const vehicle = vehicles.find((v) => v.id === r.vehicleId);
                const pct = r.totalDeliveries > 0 ? (r.completedDeliveries / r.totalDeliveries) * 100 : 0;
                return (
                  <button
                    key={r.id}
                    onClick={() => navigate(`/routes/${r.id}`)}
                    className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <RouteIcon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900">{r.code}</p>
                        <Badge color={routeStatusConfig[r.status].color}>{routeStatusConfig[r.status].label}</Badge>
                      </div>
                      <p className="truncate text-xs text-slate-500">
                        {driver?.name || '-'} · {vehicle?.code || '-'}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{r.completedDeliveries}/{r.totalDeliveries}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">No hay rutas en ejecución</p>
            )}
          </div>
        </Card>
      </div>

      {/* US-020: Ahorros de las rutas */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Ahorros de las rutas optimizadas (US-020)</h2>
        <div className="mb-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
          <p className="text-sm text-slate-600">
            <strong className="text-emerald-700">Estimación de ahorros.</strong> Los valores comparan la distancia
            y tiempo de las rutas optimizadas almacenadas en Supabase frente a una referencia teórica de
            recorrido sin optimización (visitas en orden aleatorio, ~30% más de distancia según literatura
            de ruteo VRP). No representan una medición real de tráfico ni un seguimiento GPS en vivo.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {savingsData.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${s.bg} ${s.color}`}>
                {s.icon}
              </div>
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className={`mt-1 text-xl font-bold ${s.color}`}>
                {s.value}{s.unit}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Comparativa de distancia" subtitle="Optimizado vs. no optimizado" />
            <div className="p-5">
              <BarChart
                data={[
                  { label: 'Optimizado', value: +totalDistanceOptimized.toFixed(1), color: 'bg-emerald-500' },
                  { label: 'No optimizado (est.)', value: +estimatedUnoptimizedDistance.toFixed(1), color: 'bg-slate-400' },
                ]}
                unit=" km"
              />
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3">
                <TrendingDown size={18} className="text-emerald-600" />
                <span className="text-sm text-emerald-700">
                  Ahorro de {distanceSaved} km ({distanceSavedPct}% menos distancia)
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Comparativa de tiempo" subtitle="Optimizado vs. no optimizado" />
            <div className="p-5">
              <BarChart
                data={[
                  { label: 'Optimizado', value: totalTimeOptimized, color: 'bg-blue-500' },
                  { label: 'No optimizado (est.)', value: Math.round(estimatedUnoptimizedTime), color: 'bg-slate-400' },
                ]}
                unit=" min"
              />
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3">
                <Clock size={18} className="text-blue-600" />
                <span className="text-sm text-blue-700">
                  Ahorro de {formatMinutes(timeSavedMin)} en tiempos de entrega
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Alertas operativas */}
      {incidents > 0 && (
        <Card>
          <CardHeader title="Alertas operativas" subtitle="Incidencias detectadas" />
          <div className="p-5">
            <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle size={20} className="text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {incidents} entrega{incidents !== 1 ? 's' : ''} con incidencia{incidents !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-amber-600">
                  Revise el seguimiento para ver el detalle de las incidencias.
                </p>
              </div>
              <button
                onClick={() => navigate('/tracking')}
                className="ml-auto rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100"
              >
                Ver seguimiento
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
