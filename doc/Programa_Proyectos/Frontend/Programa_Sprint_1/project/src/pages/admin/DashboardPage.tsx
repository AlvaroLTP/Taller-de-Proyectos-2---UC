import { useApp } from '@/store/AppContext';
import { StatCard, Card, CardHeader, DonutChart, BarChart, ActivityChart } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import {
  Package, CheckCircle2, Truck, Users, Route as RouteIcon, AlertTriangle,
  MapPin, Clock, Leaf,
} from 'lucide-react';
import { orderStatusConfig, routeStatusConfig, formatMinutes } from '@/utils/formatters';
import { PageHeader } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const { orders, vehicles, drivers, routes, sustainability, currentUser } = useApp();
  const navigate = useNavigate();

  const pending = orders.filter((o) => o.status === 'pending').length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const inRoute = orders.filter((o) => o.status === 'in_route').length;
  const availableDrivers = drivers.filter((d) => d.available).length;
  const availableVehicles = vehicles.filter((v) => v.available).length;
  const plannedRoutes = routes.length;
  const incidents = orders.filter((o) => o.status === 'not_delivered').length;
  const totalDistance = routes.reduce((s, r) => s + r.totalDistanceKm, 0);
  const totalTime = routes.reduce((s, r) => s + r.estimatedTimeMin, 0);
  const totalEmissions = routes.reduce((s, r) => s + r.emissionsKgCO2, 0);

  const statusData = [
    { label: 'Pendientes', value: pending, color: 'fill-amber-500' },
    { label: 'Planificados', value: orders.filter((o) => o.status === 'planned').length, color: 'fill-sky-500' },
    { label: 'En ruta', value: inRoute, color: 'fill-blue-500' },
    { label: 'Entregados', value: delivered, color: 'fill-emerald-500' },
    { label: 'No entregados', value: incidents, color: 'fill-red-500' },
    { label: 'Cancelados', value: orders.filter((o) => o.status === 'cancelled').length, color: 'fill-slate-400' },
  ];

  const donutData = [
    { label: 'Disponibles', value: availableVehicles, color: '#10b981' },
    { label: 'En ruta', value: vehicles.filter((v) => v.status === 'in_route').length, color: '#3b82f6' },
    { label: 'Mantenimiento', value: vehicles.filter((v) => v.status === 'maintenance').length, color: '#f59e0b' },
    { label: 'No disponibles', value: vehicles.filter((v) => v.status === 'unavailable').length, color: '#ef4444' },
  ];

  const activityData = [
    { hour: '06:00', value: 2 }, { hour: '07:00', value: 5 }, { hour: '08:00', value: 8 },
    { hour: '09:00', value: 12 }, { hour: '10:00', value: 9 }, { hour: '11:00', value: 6 },
    { hour: '12:00', value: 3 }, { hour: '13:00', value: 1 }, { hour: '14:00', value: 4 },
    { hour: '15:00', value: 7 }, { hour: '16:00', value: 5 }, { hour: '17:00', value: 2 },
  ];

  const emissionsByRoute = routes.map((r) => ({
    label: r.code,
    value: r.emissionsKgCO2,
    color: 'bg-teal-500',
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de control"
        subtitle={`Resumen operativo del día · ${currentUser?.role === 'driver' ? 'Vista del conductor' : 'DistriRápido S.A.C.'}`}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard title="Pedidos pendientes" value={pending} icon={<Package size={22} />} color="amber" />
        <StatCard title="Pedidos en ruta" value={inRoute} icon={<Truck size={22} />} color="blue" />
        <StatCard title="Pedidos entregados" value={delivered} icon={<CheckCircle2 size={22} />} color="emerald" />
        <StatCard title="Conductores disponibles" value={availableDrivers} icon={<Users size={22} />} color="sky" />
        <StatCard title="Vehículos disponibles" value={availableVehicles} icon={<Truck size={22} />} color="teal" />
        <StatCard title="Rutas planificadas" value={plannedRoutes} icon={<RouteIcon size={22} />} color="indigo" />
        <StatCard title="Entregas con incidencias" value={incidents} icon={<AlertTriangle size={22} />} color="red" />
        <StatCard title="Distancia total" value={`${totalDistance.toFixed(1)} km`} icon={<MapPin size={22} />} color="slate" />
        <StatCard title="Tiempo estimado" value={formatMinutes(totalTime)} icon={<Clock size={22} />} color="blue" />
        <StatCard title="Emisiones CO₂" value={`${totalEmissions.toFixed(1)} kg`} icon={<Leaf size={22} />} color="emerald" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders status donut */}
        <Card>
          <CardHeader title="Estado de pedidos" subtitle="Distribución actual" />
          <div className="p-5">
            <DonutChart
              data={statusData.map((d) => ({
                label: d.label,
                value: d.value,
                color: d.color.replace('fill-', 'bg-').replace('-500', '-500'),
              }))}
            />
          </div>
        </Card>

        {/* Vehicle utilization */}
        <Card>
          <CardHeader title="Utilización de vehículos" subtitle="Estado de la flota" />
          <div className="p-5">
            <DonutChart data={donutData} />
          </div>
        </Card>

        {/* Activity chart */}
        <Card>
          <CardHeader title="Actividad de entregas" subtitle="Entregas por hora del día" />
          <div className="p-5">
            <ActivityChart data={activityData} />
          </div>
        </Card>

        {/* Emissions by route */}
        <Card>
          <CardHeader title="Indicadores ambientales" subtitle="Emisiones estimadas por ruta (kg CO₂)" />
          <div className="p-5">
            {emissionsByRoute.length > 0 ? (
              <BarChart data={emissionsByRoute} unit=" kg" />
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">Sin datos de rutas</p>
            )}
          </div>
        </Card>
      </div>

      {/* Active routes table */}
      <Card>
        <CardHeader title="Rutas activas" subtitle="Seguimiento de operaciones en curso" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-4 py-3 font-semibold text-slate-600">Ruta</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Conductor</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Vehículo</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Entregas</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Progreso</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {routes.map((r) => {
                const driver = drivers.find((d) => d.id === r.driverId);
                const vehicle = vehicles.find((v) => v.id === r.vehicleId);
                const pct = r.totalDeliveries > 0 ? (r.completedDeliveries / r.totalDeliveries) * 100 : 0;
                return (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/routes/${r.id}`)}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">{r.code}</td>
                    <td className="px-4 py-3 text-slate-700">{driver?.name || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{vehicle?.code || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{r.completedDeliveries}/{r.totalDeliveries}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full rounded-full bg-teal-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{pct.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={routeStatusConfig[r.status].color}>
                        {routeStatusConfig[r.status].label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
