import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader, useToast, Toast } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Input, Select } from '@/components/ui/Form';
import { fuelTypeConfig } from '@/utils/formatters';
import { Save, Sliders, Gauge, Leaf, Fuel, Route } from 'lucide-react';
import type { FuelType } from '@/types';

export function ParametersPage() {
  const { parameters, updateParameters } = useApp();
  const { toast, showToast } = useToast();
  const [form, setForm] = useState(parameters);

  const handleSubmit = async () => {
    await updateParameters(form);
    showToast('Parámetros actualizados correctamente');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parámetros operativos"
        subtitle="Configuración de parámetros para la planificación y optimización de rutas"
        actions={<Button icon={<Save size={18} />} onClick={handleSubmit}>Guardar parámetros</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Capacidad y carga" subtitle="Límites de capacidad de vehículos" />
          <div className="grid grid-cols-2 gap-4 p-5">
            <Input label="Capacidad máxima del vehículo (kg)" type="number" value={form.maxVehicleCapacityKg || ''} onChange={(e) => setForm({ ...form, maxVehicleCapacityKg: +e.target.value })} />
            <Input label="Peso máximo por pedido (kg)" type="number" value={form.maxWeightKg || ''} onChange={(e) => setForm({ ...form, maxWeightKg: +e.target.value })} />
            <Input label="Volumen máximo (m³)" type="number" value={form.maxVolumeM3 || ''} onChange={(e) => setForm({ ...form, maxVolumeM3: +e.target.value })} />
            <Input label="Entregas máximas por ruta" type="number" value={form.maxDeliveriesPerRoute || ''} onChange={(e) => setForm({ ...form, maxDeliveriesPerRoute: +e.target.value })} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Operación y velocidad" subtitle="Parámetros de tiempo y distancia" />
          <div className="grid grid-cols-2 gap-4 p-5">
            <Input label="Velocidad promedio (km/h)" type="number" value={form.averageSpeedKmH || ''} onChange={(e) => setForm({ ...form, averageSpeedKmH: +e.target.value })} />
            <Input label="Tiempo máximo de operación (h)" type="number" value={form.maxOperationTimeH || ''} onChange={(e) => setForm({ ...form, maxOperationTimeH: +e.target.value })} />
            <Input label="Distancia máxima permitida (km)" type="number" value={form.maxDistanceKm || ''} onChange={(e) => setForm({ ...form, maxDistanceKm: +e.target.value })} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Combustible y consumo" subtitle="Parámetros de consumo estimado" />
          <div className="grid grid-cols-2 gap-4 p-5">
            <Input label="Consumo estimado (km/L)" type="number" step="0.1" value={form.estimatedConsumptionKmPerL || ''} onChange={(e) => setForm({ ...form, estimatedConsumptionKmPerL: +e.target.value })} />
            <Select label="Tipo de combustible" value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value as FuelType })}>
              {Object.entries(fuelTypeConfig).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
            </Select>
          </div>
        </Card>

        <Card>
          <CardHeader title="Sostenibilidad" subtitle="Parámetros ambientales" />
          <div className="grid grid-cols-2 gap-4 p-5">
            <Input label="Factor de emisión (kg CO₂/L)" type="number" step="0.01" value={form.emissionFactor || ''} onChange={(e) => setForm({ ...form, emissionFactor: +e.target.value })} />
            <div className="flex items-end">
              <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <Leaf size={16} className="mb-1 inline" /> Estos parámetros se usarán en el motor de optimización para calcular emisiones estimadas.
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
            <Sliders size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-teal-900">Parámetros para el motor de optimización</p>
            <p className="mt-1 text-xs text-teal-700">
              Estos valores serán utilizados posteriormente por el motor real de optimización de rutas.
              En esta etapa funcionan con datos simulados para validar la interfaz.
            </p>
          </div>
        </div>
      </div>

      <Toast {...toast} />
    </div>
  );
}
