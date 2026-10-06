import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader, useToast, Toast } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Form';
import { orderStatusConfig, priorityConfig, formatMinutes } from '@/utils/formatters';
import { Calendar, Package, Users, Truck, Map, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Route } from '@/types';
import { useNavigate } from 'react-router-dom';

export function PlanningPage() {
  const { orders, drivers, vehicles, generatePlan, routes } = useApp();
  const { toast, showToast } = useToast();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedRoutes, setGeneratedRoutes] = useState<Route[]>([]);

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === 'pending' || o.status === 'planned'),
    [orders]
  );
  const availableDrivers = useMemo(() => drivers.filter((d) => d.available), [drivers]);
  const availableVehicles = useMemo(() => vehicles.filter((v) => v.available), [vehicles]);

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
      showToast(`Planificación simulada generada: ${newRoutes.length} ruta(s)`);
    } catch {
      showToast('Error al generar la planificación', 'error');
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planificación de rutas"
        subtitle="Preparar y generar una planificación simulada de rutas optimizadas"
      />

      <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
        <div className="flex items-start gap-3">
          <Sparkles size={20} className="mt-0.5 text-teal-600" />
          <p className="text-sm text-teal-800">
            Esta herramienta genera una <strong>planificación simulada</strong> de rutas utilizando datos mock.
            Posteriormente será reemplazada por el motor real de optimización.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <Input label="Fecha de planificación" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders */}
        <Card>
          <CardHeader
            title="Pedidos pendientes"
            subtitle={`${selectedOrders.length} seleccionados`}
            action={
              <button onClick={selectAllOrders} className="text-xs text-teal-600 hover:text-teal-700">
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
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{o.code}</span>
                    <Badge color={priorityConfig[o.priority].color}>{priorityConfig[o.priority].label}</Badge>
                  </div>
                  <p className="truncate text-xs text-slate-500">{o.address.district} · {o.timeWindowStart}-{o.timeWindowEnd}</p>
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
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-xs font-bold text-white">
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
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
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
          <CardHeader title="Rutas generadas" subtitle="Planificación simulada" />
          <div className="divide-y divide-slate-100">
            {generatedRoutes.map((r) => {
              const driver = drivers.find((d) => d.id === r.driverId);
              const vehicle = vehicles.find((v) => v.id === r.vehicleId);
              return (
                <div key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
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
