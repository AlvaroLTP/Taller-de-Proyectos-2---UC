import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { PageHeader, useToast, Toast } from '@/components/ui';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { RouteMap } from '@/components/ui/RouteMap';
import { routeStatusConfig, orderStatusConfig, formatMinutes } from '@/utils/formatters';
import { ArrowLeft, Truck, Users, Clock, Leaf, MapPin, Package, RefreshCw, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { RouteStatus, ReoptimizationResult } from '@/types';

export function RouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { routes, drivers, vehicles, updateRouteStatus, reoptimizeRoute } = useApp();
  const { toast, showToast } = useToast();
  const [showReoptModal, setShowReoptModal] = useState(false);
  const [reoptReason, setReoptReason] = useState('');
  const [reoptResult, setReoptResult] = useState<ReoptimizationResult | null>(null);
  const [reoptimizing, setReoptimizing] = useState(false);

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
    try {
      await updateRouteStatus(route.id, status);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'No se pudo completar la operación', 'error');
    }
  };

  const handleReoptimize = async () => {
    if (!reoptReason.trim()) {
      showToast('Ingrese el motivo de la re-optimización', 'error');
      return;
    }
    setReoptimizing(true);
    try {
      const result = await reoptimizeRoute(route.id, reoptReason.trim());
      setReoptResult(result);
      setShowReoptModal(false);
      showToast('Ruta re-optimizada correctamente');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al re-optimizar la ruta', 'error');
    }
    setReoptimizing(false);
  };

  const canReoptimize = route.status === 'pending' || route.status === 'preparing';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={() => navigate('/routes')}>Volver</Button>
        <PageHeader title={`Ruta ${route.code}`} subtitle={`Fecha: ${route.date}`} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge color={routeStatusConfig[route.status].color}>{routeStatusConfig[route.status].label}</Badge>
        <div className="ml-auto flex flex-wrap gap-2">
          {canReoptimize && (
            <Button
              size="sm"
              variant="secondary"
              icon={<RefreshCw size={14} />}
              onClick={() => setShowReoptModal(true)}
            >
              Re-optimizar ruta
            </Button>
          )}
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

      {/* Re-optimization reason modal */}
      <Modal isOpen={showReoptModal} onClose={() => setShowReoptModal(false)} title="Re-optimizar ruta" size="md">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              La re-optimización reordenará las paradas utilizando el algoritmo de vecino más cercano (nearest-neighbor),
              recalculando distancia, tiempo y emisiones. Esta acción es recomendada ante cambios operativos como
              cancelaciones, nuevas entregas o incidencias de tráfico.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Motivo del cambio operativo
            </label>
            <textarea
              value={reoptReason}
              onChange={(e) => setReoptReason(e.target.value)}
              placeholder="Ej: Cliente canceló entrega, tráfico reportado en zona, nuevo pedido agregado..."
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowReoptModal(false)}>Cancelar</Button>
            <Button
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={handleReoptimize}
              disabled={reoptimizing || !reoptReason.trim()}
            >
              {reoptimizing ? 'Re-optimizando...' : 'Confirmar re-optimización'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Re-optimization result modal */}
      <Modal
        isOpen={!!reoptResult}
        onClose={() => setReoptResult(null)}
        title="Resultado de re-optimización"
        size="md"
      >
        {reoptResult && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4">
              <CheckCircle2 size={24} className="text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-800">Ruta {reoptResult.routeCode} re-optimizada</p>
                <p className="text-xs text-emerald-600">{reoptResult.stopsReordered} paradas reordenadas</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 text-xs font-medium text-slate-500">Distancia</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 line-through">{reoptResult.previousDistance} km</span>
                  <TrendingDown size={14} className="text-emerald-500" />
                  <span className="text-lg font-bold text-slate-900">{reoptResult.newDistance} km</span>
                </div>
                <p className={`mt-1 text-xs font-medium ${reoptResult.distanceSaved > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {reoptResult.distanceSaved > 0 ? '−' : '+'}{Math.abs(reoptResult.distanceSaved)} km
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 text-xs font-medium text-slate-500">Emisiones CO₂</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 line-through">{reoptResult.previousEmissions} kg</span>
                  <TrendingDown size={14} className="text-emerald-500" />
                  <span className="text-lg font-bold text-slate-900">{reoptResult.newEmissions} kg</span>
                </div>
                <p className={`mt-1 text-xs font-medium ${reoptResult.emissionsSaved > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {reoptResult.emissionsSaved > 0 ? '−' : '+'}{Math.abs(reoptResult.emissionsSaved)} kg CO₂
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="mb-1 text-xs font-medium text-slate-500">Motivo registrado</p>
              <p className="text-sm text-slate-700">{reoptResult.reason}</p>
            </div>

            <div className="flex justify-end">
              <Button size="sm" onClick={() => setReoptResult(null)}>Cerrar</Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast {...toast} />
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
