import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader, useToast, Toast } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Form';
import { priorityConfig, formatMinutes } from '@/utils/formatters';
import { Package, Users, Truck, Map, Sparkles, ArrowRight, AlertTriangle, TrafficCone } from 'lucide-react';
import type { Route } from '@/types';
import { useNavigate } from 'react-router-dom';

export function PlanningPage() {
  const { orders, drivers, vehicles, generatePlan } = useApp();
  const { toast, showToast } = useToast();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedRoutes, setGeneratedRoutes] = useState<Route[]>([]);

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === 'pending' && !o.routeId && o.deliveryDate === date),
    [orders, date]
  );
  const availableDrivers = useMemo(() => drivers.filter((d) => d.available), [drivers]);
  const availableVehicles = useMemo(() => vehicles.filter((v) => v.available), [vehicles]);

  // US-013: Analyze restrictions in selected orders
  const selectedOrderObjects = useMemo(
    () => pendingOrders.filter((o) => selectedOrders.includes(o.id)),
    [pendingOrders, selectedOrders]
  );

  const restrictionWarnings = useMemo(() => {
    const warnings: { type: string; message: string; count: number }[] = [];
    const specialAttention = selectedOrderObjects.filter((o) => o.preferences?.requiresSpecialAttention);
    const noLunch = selectedOrderObjects.filter((o) => o.preferences?.noLunchHours);
    const phoneCoord = selectedOrderObjects.filter((o) => o.preferences?.requiresPhoneCoordination);
    const highPriority = selectedOrderObjects.filter((o) => o.priority === 'high');

    if (highPriority.length > 0) {
      warnings.push({ type: 'priority', message: `${highPriority.length} pedido(s) de prioridad alta — se planifican primero`, count: highPriority.length });
    }
    if (specialAttention.length > 0) {
      warnings.push({ type: 'attention', message: `${specialAttention.length} pedido(s) requieren atención especial`, count: specialAttention.length });
    }
    if (noLunch.length > 0) {
      warnings.push({ type: 'lunch', message: `${noLunch.length} pedido(s) no permiten entrega en horario de almuerzo (12-14h)`, count: noLunch.length });
    }
    if (phoneCoord.length > 0) {
      warnings.push({ type: 'phone', message: `${phoneCoord.length} pedido(s) requieren coordinación telefónica previa`, count: phoneCoord.length });
    }
    return warnings;
  }, [selectedOrderObjects]);

  // US-013: Check capacity constraints
  const capacityWarnings = useMemo(() => {
    const warnings: string[] = [];
    const totalWeight = selectedOrderObjects.reduce((s, o) => s + o.weightKg, 0);
    const totalVolume = selectedOrderObjects.reduce((s, o) => s + o.volumeM3, 0);
    const totalVehicleCapacity = selectedVehicles.reduce((s, vid) => {
      const v = vehicles.find((vv) => vv.id === vid);
      return s + (v?.capacityKg || 0);
    }, 0);

    const totalVolumeCapacity = selectedVehicles.reduce((sum, id) => sum + (vehicles.find(v => v.id === id)?.capacityM3 || 0), 0);
    if (selectedVehicles.length > 0 && totalVolume > totalVolumeCapacity) {
      warnings.push(`Volumen total (${totalVolume.toFixed(1)} m3) excede capacidad combinada (${totalVolumeCapacity} m3)`);
    }
    if (selectedVehicles.length > 0 && totalWeight > totalVehicleCapacity) {
      warnings.push(`Peso total (${totalWeight.toFixed(0)} kg) excede capacidad combinada de vehículos (${totalVehicleCapacity} kg)`);
    }
    return warnings;
  }, [selectedOrderObjects, selectedVehicles, vehicles]);

  // US-016: Traffic info for selected departure times
  const trafficInfo = useMemo(() => {
    const selectedDriverObjects = drivers.filter((d) => selectedDrivers.includes(d.id));
    if (selectedDriverObjects.length === 0) return null;

    const getTrafficLevel = (time: string): { level: string; factor: number; color: string } => {
      const hour = parseInt((time || '08:00').split(':')[0]);
      if (hour >= 7 && hour < 9) return { level: 'Alto (hora punta matutina)', factor: 1.6, color: 'text-red-600 bg-red-50' };
      if (hour >= 12 && hour < 14) return { level: 'Moderado (hora de almuerzo)', factor: 1.4, color: 'text-amber-600 bg-amber-50' };
      if (hour >= 18 && hour < 20) return { level: 'Alto (hora punta vespertina)', factor: 1.7, color: 'text-red-600 bg-red-50' };
      return { level: 'Bajo (hora valle)', factor: 1.0, color: 'text-emerald-600 bg-emerald-50' };
    };

    return selectedDriverObjects.map((d) => ({
      driverName: d.name,
      shiftStart: d.shiftStart,
      traffic: getTrafficLevel(d.shiftStart),
    }));
  }, [drivers, selectedDrivers]);

  const toggleOrder = (id: string) => {
    setSelectedOrders((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const toggleDriver = (id: string) => {
    setSelectedDrivers((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const toggleVehicle = (id: string) => {
    setSelectedVehicles((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const selectAllOrders = () => {
    if (selectedOrders.length === pendingOrders.length) setSelectedOrders([]);
    else setSelectedOrders(pendingOrders.map((o) => o.id));
  };

  const handleGenerate = async () => {
    if (selectedOrders.length === 0) { showToast('Seleccione al menos un pedido', 'error'); return; }
    if (selectedDrivers.length === 0) { showToast('Seleccione al menos un conductor', 'error'); return; }
    if (selectedVehicles.length === 0) { showToast('Seleccione al menos un vehículo', 'error'); return; }
    setGenerating(true);
    try {
      const newRoutes = await generatePlan(date, selectedOrders, selectedDrivers, selectedVehicles);
      setGeneratedRoutes(newRoutes);
      setSelectedOrders([]);
      showToast(`Planificación generada: ${newRoutes.length} ruta(s) con validación de capacidad y horarios`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al generar la planificación', 'error');
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planificación de rutas"
        subtitle="Generar rutas considerando restricciones, prioridades y capacidad"
      />

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Sparkles size={20} className="mt-0.5 text-blue-600" />
          <p className="text-sm text-blue-800">
            El motor planifica por ventanas de entrega y prioridad, valida la capacidad y los turnos,
            y estima distancias geográficas entre paradas. Los tiempos no incluyen tráfico en tiempo real.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <Input label="Fecha de planificación" type="date" value={date} onChange={(e) => { setDate(e.target.value); setSelectedOrders([]); setGeneratedRoutes([]); }} />
        <div className="flex items-end gap-2 text-sm text-slate-500">
          <Package size={16} /> {pendingOrders.length} pedidos ·
          <Users size={16} /> {availableDrivers.length} conductores ·
          <Truck size={16} /> {availableVehicles.length} vehículos
        </div>
        <div className="ml-auto">
          <Button
            icon={<Sparkles size={18} />}
            onClick={handleGenerate}
            disabled={generating || selectedOrders.length === 0 || selectedDrivers.length === 0 || selectedVehicles.length === 0}
          >
            {generating ? 'Generando...' : 'Generar planificación'}
          </Button>
        </div>
      </div>

      {/* US-013: Restriction warnings */}
      {restrictionWarnings.length > 0 && (
        <Card>
          <CardHeader title="Restricciones detectadas" subtitle="Consideraciones aplicadas en la planificación" />
          <div className="space-y-2 p-5">
            {restrictionWarnings.map((w, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-amber-50 p-3">
                <AlertTriangle size={18} className="shrink-0 text-amber-600" />
                <span className="text-sm text-amber-800">{w.message}</span>
              </div>
            ))}
            {capacityWarnings.map((w, i) => (
              <div key={`cap-${i}`} className="flex items-center gap-3 rounded-lg bg-red-50 p-3">
                <AlertTriangle size={18} className="shrink-0 text-red-600" />
                <span className="text-sm text-red-800">{w}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* US-016: Traffic info */}
      {trafficInfo && trafficInfo.length > 0 && (
        <Card>
          <CardHeader title="Tráfico estimado por horario de salida" subtitle="Referencia horaria informativa; no se aplica al cálculo del plan" />
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {trafficInfo.map((t, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.traffic.color}`}>
                  <TrafficCone size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{t.driverName}</p>
                  <p className="text-xs text-slate-500">Sale a las {t.shiftStart}</p>
                  <p className={`text-xs font-medium ${t.traffic.color.split(' ')[0]}`}>
                    {t.traffic.level} · factor {t.traffic.factor}x
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders */}
        <Card>
          <CardHeader
            title="Pedidos pendientes"
            subtitle={`${selectedOrders.length} seleccionados`}
            action={
              <button onClick={selectAllOrders} className="text-xs text-blue-600 hover:text-blue-700">
                {selectedOrders.length === pendingOrders.length ? 'Deseleccionar' : 'Seleccionar'} todos
              </button>
            }
          />
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
            {pendingOrders.map((o) => (
              <label key={o.id} className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(o.id)}
                  onChange={() => toggleOrder(o.id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{o.code}</span>
                    <Badge color={priorityConfig[o.priority].color}>{priorityConfig[o.priority].label}</Badge>
                  </div>
                  <p className="truncate text-xs text-slate-500">{o.address.district} · {o.timeWindowStart}-{o.timeWindowEnd}</p>
                  {(o.preferences?.requiresSpecialAttention || o.preferences?.requiresPhoneCoordination || o.preferences?.noLunchHours) && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {o.preferences?.requiresSpecialAttention && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">Atención especial</span>
                      )}
                      {o.preferences?.requiresPhoneCoordination && (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">Coord. telefónica</span>
                      )}
                      {o.preferences?.noLunchHours && (
                        <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">Sin almuerzo</span>
                      )}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* Drivers */}
        <Card>
          <CardHeader title="Conductores disponibles" subtitle={`${selectedDrivers.length} seleccionados`} />
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
            {availableDrivers.map((d) => (
              <label key={d.id} className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selectedDrivers.includes(d.id)}
                  onChange={() => toggleDriver(d.id)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white">
                  {d.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{d.name}</p>
                  <p className="text-xs text-slate-500">{d.shiftStart} - {d.shiftEnd} · {d.licenseType}</p>
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* Vehicles */}
        <Card>
          <CardHeader title="Vehículos disponibles" subtitle={`${selectedVehicles.length} seleccionados`} />
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
            {availableVehicles.map((v) => (
              <label key={v.id} className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selectedVehicles.includes(v.id)}
                  onChange={() => toggleVehicle(v.id)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Truck size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{v.code}</p>
                  <p className="text-xs text-slate-500">{v.type} · {v.capacityKg}kg · {v.plate}</p>
                </div>
              </label>
            ))}
          </div>
        </Card>
      </div>

      {/* Generated routes */}
      {generatedRoutes.length > 0 && (
        <Card>
          <CardHeader title="Rutas generadas" subtitle="Planificación optimizada" />
          <div className="divide-y divide-slate-100">
            {generatedRoutes.map((r) => {
              const driver = drivers.find((d) => d.id === r.driverId);
              const vehicle = vehicles.find((v) => v.id === r.vehicleId);
              return (
                <div key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Map size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{r.code}</span>
                      <Badge color="bg-sky-100 text-sky-700 border-sky-200">Planificada</Badge>
                    </div>
                    <p className="text-sm text-slate-500">
                      {driver?.name} · {vehicle?.code} · {r.totalDeliveries} entregas
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-600">
                    <div className="text-center"><p className="text-xs text-slate-400">Distancia</p><p className="font-medium">{r.totalDistanceKm} km</p></div>
                    <div className="text-center"><p className="text-xs text-slate-400">Tiempo</p><p className="font-medium">{formatMinutes(r.estimatedTimeMin)}</p></div>
                    <div className="text-center"><p className="text-xs text-slate-400">CO₂</p><p className="font-medium">{r.emissionsKgCO2} kg</p></div>
                  </div>
                  <Button size="sm" variant="outline" icon={<ArrowRight size={14} />} onClick={() => navigate(`/routes/${r.id}`)}>
                    Ver ruta
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Toast {...toast} />
    </div>
  );
}
