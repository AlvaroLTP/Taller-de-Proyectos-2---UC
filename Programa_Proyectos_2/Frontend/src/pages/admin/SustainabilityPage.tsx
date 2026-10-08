import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/ui';
import { StatCard, Card, CardHeader, DonutChart, BarChart } from '@/components/ui';
import { Leaf, Truck, Route as RouteIcon, Package, TrendingUp, Gauge } from 'lucide-react';
import { fuelTypeConfig } from '@/utils/formatters';

export function SustainabilityPage() {
  const { sustainability, routes, vehicles } = useApp();

  if (!sustainability) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sostenibilidad" subtitle="Indicadores ambientales" />
        <Card><div className="py-16 text-center text-sm text-slate-400">Cargando métricas...</div></Card>
      </div>
    );
  }

  const fuelDistribution = vehicles.reduce((acc, v) => {
    const label = fuelTypeConfig[v.fuelType].label;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const donutData = Object.entries(fuelDistribution).map(([label, value], i) => ({
    label,
    value,
    color: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'][i % 5],
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Sostenibilidad" subtitle="Indicadores ambientales y eficiencia operativa" />

      <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <Leaf size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-800">DistriRápido S.A.C. - Reporte ambiental</p>
            <p className="text-xs text-emerald-600">Valores simulados basados en rutas planificadas. Serán reemplazados por cálculos reales desde el backend.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Emisiones totales" value={`${sustainability.totalEmissionsKgCO2} kg`} icon={<Leaf size={22} />} color="emerald" subtitle="CO₂ estimado" />
        <StatCard title="Distancia recorrida" value={`${sustainability.totalDistanceKm} km`} icon={<RouteIcon size={22} />} color="blue" />
        <StatCard title="Consumo estimado" value={`${sustainability.estimatedConsumptionL} L`} icon={<Truck size={22} />} color="amber" subtitle="Combustible" />
        <StatCard title="Entregas completadas" value={sustainability.deliveriesCompleted} icon={<Package size={22} />} color="blue" />
        <StatCard title="Índice de eficiencia" value={`${sustainability.efficiencyIndex}`} icon={<TrendingUp size={22} />} color="sky" subtitle="entregas/km" />
        <StatCard title="Rutas activas" value={routes.length} icon={<Gauge size={22} />} color="indigo" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Emisiones por ruta" subtitle="kg CO₂ estimados por ruta" />
          <div className="p-5">
            {sustainability.emissionsByRoute.length > 0 ? (
              <BarChart data={sustainability.emissionsByRoute.map((e) => ({ label: e.routeCode, value: e.emissions, color: 'bg-emerald-500' }))} unit=" kg" />
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">Sin datos</p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Emisiones por vehículo" subtitle="kg CO₂ estimados por vehículo" />
          <div className="p-5">
            {sustainability.emissionsByVehicle.length > 0 ? (
              <BarChart data={sustainability.emissionsByVehicle.map((e => ({ label: e.vehicleCode, value: e.emissions, color: 'bg-blue-500' })))} unit=" kg" />
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">Sin datos</p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Flota por tipo de combustible" subtitle="Distribución de la flota" />
          <div className="p-5">
            <DonutChart data={donutData} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Comparativa de emisiones" subtitle="Vehículos eléctricos vs. convencionales" />
          <div className="space-y-4 p-5">
            <div className="rounded-lg bg-emerald-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Vehículo eléctrico (ELC-001)</p>
                  <p className="text-xs text-emerald-600">0.0 kg CO₂/km</p>
                </div>
                <Leaf size={24} className="text-emerald-500" />
              </div>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">Vehículo diésel promedio</p>
                  <p className="text-xs text-amber-600">0.295 kg CO₂/km (promedio)</p>
                </div>
                <Truck size={24} className="text-amber-500" />
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600">
                El uso de vehículos eléctricos e híbridos puede reducir las emisiones hasta en un <strong className="text-emerald-600">100%</strong> comparado con vehículos diésel convencionales.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
