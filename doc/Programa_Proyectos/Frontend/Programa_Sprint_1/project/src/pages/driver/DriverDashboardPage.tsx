import { useApp } from '@/store/AppContext';
import { StatCard, Card, CardHeader } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { orderStatusConfig, priorityConfig } from '@/utils/formatters';
import { Package, CheckCircle2, AlertTriangle, Clock, Truck, ArrowRight, MapPin } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hola, {currentUser?.name}</h1>
        <p className="mt-1 text-sm text-slate-500">Resumen de tu jornada de trabajo de hoy</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Entregas asignadas" value={myOrders.length} icon={<Package size={22} />} color="blue" />
        <StatCard title="Completadas" value={completed} icon={<CheckCircle2 size={22} />} color="emerald" />
        <StatCard title="Pendientes" value={pending} icon={<Clock size={22} />} color="amber" />
        <StatCard title="Incidencias" value={incidents} icon={<AlertTriangle size={22} />} color="red" />
      </div>

      {/* Next delivery */}
      {nextDelivery && (
        <Card className="overflow-hidden border-teal-200">
          <div className="bg-teal-50 px-5 py-3">
            <p className="text-sm font-semibold text-teal-800">Próxima entrega</p>
          </div>
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{nextDelivery.code}</p>
                <p className="text-sm text-slate-600">{nextDelivery.address.street}, {nextDelivery.address.district}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500"><Clock size={12} /> {nextDelivery.timeWindowStart} - {nextDelivery.timeWindowEnd}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge color={priorityConfig[nextDelivery.priority].color}>Prioridad {priorityConfig[nextDelivery.priority].label}</Badge>
              <Button icon={<ArrowRight size={16} />} onClick={() => navigate('/my-deliveries')}>
                Ir a mis entregas
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* My vehicle */}
        <Card>
          <CardHeader title="Mi vehículo" subtitle={myVehicle ? myVehicle.code : 'Sin asignar'} />
          {myVehicle ? (
            <div className="space-y-3 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{myVehicle.brand} {myVehicle.model}</p>
                  <p className="text-sm text-slate-500">{myVehicle.plate} · {myVehicle.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-3 text-center">
                <div><p className="text-xs text-slate-400">Capacidad</p><p className="text-sm font-semibold text-slate-900">{myVehicle.capacityKg} kg</p></div>
                <div><p className="text-xs text-slate-400">Volumen</p><p className="text-sm font-semibold text-slate-900">{myVehicle.capacityM3} m³</p></div>
                <div><p className="text-xs text-slate-400">Combustible</p><p className="text-sm font-semibold text-slate-900">{myVehicle.fuelType === 'electric' ? 'Eléc.' : myVehicle.fuelType === 'hybrid' ? 'Híbr.' : 'Diésel'}</p></div>
              </div>
            </div>
          ) : (
            <div className="p-5 text-sm text-slate-400">No tiene vehículo asignado</div>
          )}
        </Card>

        {/* My route */}
        <Card>
          <CardHeader title="Mi ruta" subtitle={myRoute ? myRoute.code : 'Sin ruta asignada'} />
          {myRoute ? (
            <div className="space-y-3 p-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total de entregas</span>
                <span className="font-medium text-slate-900">{myRoute.totalDeliveries}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Completadas</span>
                <span className="font-medium text-emerald-600">{myRoute.completedDeliveries}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Distancia total</span>
                <span className="font-medium text-slate-900">{myRoute.totalDistanceKm} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tiempo estimado</span>
                <span className="font-medium text-slate-900">{myRoute.estimatedTimeMin} min</span>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Progreso</span><span>{myRoute.completedDeliveries}/{myRoute.totalDeliveries}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${(myRoute.completedDeliveries / myRoute.totalDeliveries) * 100}%` }} />
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" icon={<ArrowRight size={14} />} onClick={() => navigate('/my-route')}>
                Ver mi ruta
              </Button>
            </div>
          ) : (
            <div className="p-5 text-sm text-slate-400">No tiene ruta asignada</div>
          )}
        </Card>
      </div>

      {/* Recent deliveries */}
      <Card>
        <CardHeader title="Mis entregas recientes" />
        <div className="divide-y divide-slate-100">
          {myOrders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center gap-4 px-5 py-3">
              <span className="font-medium text-slate-900">{o.code}</span>
              <span className="flex-1 truncate text-sm text-slate-600">{o.address.district}</span>
              <Badge color={orderStatusConfig[o.status].color}>{orderStatusConfig[o.status].label}</Badge>
            </div>
          ))}
          {myOrders.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No tiene entregas asignadas</p>}
        </div>
      </Card>
    </div>
  );
}
