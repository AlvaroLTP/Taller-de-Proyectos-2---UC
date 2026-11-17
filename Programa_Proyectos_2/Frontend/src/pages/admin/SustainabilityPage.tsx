import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader, StatCard, Card, CardHeader, DonutChart, BarChart } from '@/components/ui';

import { Leaf, Truck, Route as RouteIcon, Package, TrendingUp, Gauge, DollarSign, Fuel, Wrench, Calculator, Cloud, TreePine, Sun, Car, ArrowDownRight, ArrowUpRight, Sprout, FileText, Target, Award, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fuelTypeConfig } from '@/utils/formatters';
import type { CarbonInitiative } from '@/types';

type Tab = 'resumen' | 'costos' | 'emisiones' | 'compensacion';

export function SustainabilityPage() {
  const { sustainability, costAnalysis, emissionsBreakdown, carbonCompensationPlan, routes, vehicles } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('resumen');

  if (!sustainability) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sostenibilidad" subtitle="Indicadores ambientales" />
        <Card><div className="py-16 text-center text-sm text-slate-400">Cargando métricas...</div></Card>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'resumen', label: 'Resumen', icon: <Gauge size={16} /> },
    { id: 'costos', label: 'Costos y cumplimiento', icon: <DollarSign size={16} /> },
    { id: 'emisiones', label: 'Emisiones CO₂', icon: <Cloud size={16} /> },
    { id: 'compensacion', label: 'Compensación de carbono', icon: <TreePine size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Sostenibilidad" subtitle="Reportes ambientales, costos operativos y plan de compensación de carbono" />

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <Leaf size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-800">DistriRápido S.A.C. — Reporte de sostenibilidad ambiental</p>
            <p className="text-xs text-emerald-600">Datos calculados a partir de rutas planificadas y ejecutadas. Las estimaciones usan factores de emisión por tipo de combustible.</p>
          </div>
        </div>
      </div>

      {activeTab === 'resumen' && <ResumenTab sustainability={sustainability} routes={routes} vehicles={vehicles} />}
      {activeTab === 'costos' && <CostosTab costAnalysis={costAnalysis} />}
      {activeTab === 'emisiones' && <EmisionesTab emissionsBreakdown={emissionsBreakdown} />}
      {activeTab === 'compensacion' && <CompensacionTab plan={carbonCompensationPlan} />}
    </div>
  );
}

// ============ US-021: Resumen de Reportes de Sostenibilidad ============

function ResumenTab({ sustainability, routes, vehicles }: {
  sustainability: NonNullable<ReturnType<typeof useApp>['sustainability']>;
  routes: ReturnType<typeof useApp>['routes'];
  vehicles: ReturnType<typeof useApp>['vehicles'];
}) {
  const fuelDistribution = vehicles.reduce((acc, v) => {
    const label = fuelTypeConfig[v.fuelType].label;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const donutData = Object.entries(fuelDistribution).map(([label, value], i) => ({
    label,
    value,
    color: ['#10b981', '#3b82f6', '#f59e0b', '#06b6d4', '#ec4899'][i % 5],
  }));

  return (
    <div className="space-y-6">
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
              <BarChart data={sustainability.emissionsByVehicle.map((e) => ({ label: e.vehicleCode, value: e.emissions, color: 'bg-blue-500' }))} unit=" kg" />
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

// ============ US-022: Consultar Costos y Cumplimiento Ambiental ============

function CostosTab({ costAnalysis }: { costAnalysis: ReturnType<typeof useApp>['costAnalysis'] }) {
  if (!costAnalysis) {
    return <Card><div className="py-16 text-center text-sm text-slate-400">Cargando análisis de costos...</div></Card>;
  }

  return (
    <div className="space-y-6">
      {/* Cost summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Costo de combustible"
          value={`S/ ${costAnalysis.fuelCostTotal.toFixed(2)}`}
          icon={<Fuel size={22} />}
          color="amber"
          subtitle="Total estimado"
        />
        <StatCard
          title="Costo de mantenimiento"
          value={`S/ ${costAnalysis.maintenanceCostTotal.toFixed(2)}`}
          icon={<Wrench size={22} />}
          color="blue"
          subtitle={`S/ ${costAnalysis.maintenanceCostPerKm}/km`}
        />
        <StatCard
          title="Costo operativo total"
          value={`S/ ${costAnalysis.totalOperationalCost.toFixed(2)}`}
          icon={<DollarSign size={22} />}
          color="emerald"
          subtitle="Combustible + mantenimiento"
        />
        <StatCard
          title="Costo por entrega"
          value={`S/ ${costAnalysis.costPerDelivery.toFixed(2)}`}
          icon={<Calculator size={22} />}
          color="sky"
          subtitle="Por entrega completada"
        />
      </div>

      {/* Cost breakdown charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Costo de combustible por ruta" subtitle="Soles (S/) por ruta" />
          <div className="p-5">
            {costAnalysis.fuelCostPerRoute.length > 0 ? (
              <BarChart
                data={costAnalysis.fuelCostPerRoute.map((e, i) => ({
                  label: e.routeCode,
                  value: e.cost,
                  color: ['bg-amber-500', 'bg-orange-500', 'bg-amber-400', 'bg-orange-400', 'bg-amber-600'][i % 5],
                }))}
                unit=" S/"
              />
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">Sin datos</p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Costo de combustible por vehículo" subtitle="Soles (S/) por vehículo" />
          <div className="p-5">
            {costAnalysis.fuelCostPerVehicle.length > 0 ? (
              <BarChart
                data={costAnalysis.fuelCostPerVehicle.filter((e) => e.cost > 0).map((e) => ({
                  label: e.vehicleCode,
                  value: e.cost,
                  color: 'bg-blue-500',
                }))}
                unit=" S/"
              />
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">Sin datos</p>
            )}
          </div>
        </Card>
      </div>

      {/* Cost efficiency indicators */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="p-5">
            <div className="mb-3 flex items-center gap-2 text-slate-600">
              <TrendingUp size={18} className="text-emerald-600" />
              <span className="text-sm font-medium">Costo por kilómetro</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">S/ {costAnalysis.costPerKm.toFixed(2)}</p>
            <p className="mt-1 text-xs text-slate-400">Combustible + mantenimiento / km</p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <div className="mb-3 flex items-center gap-2 text-slate-600">
              <Fuel size={18} className="text-amber-600" />
              <span className="text-sm font-medium">Precio diésel</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">S/ {costAnalysis.dieselPricePerL.toFixed(2)}/L</p>
            <p className="mt-1 text-xs text-slate-400">Referencia mercado peruano</p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <div className="mb-3 flex items-center gap-2 text-slate-600">
              <Wrench size={18} className="text-blue-600" />
              <span className="text-sm font-medium">Mantenimiento</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">S/ {costAnalysis.maintenanceCostPerKm.toFixed(2)}/km</p>
            <p className="mt-1 text-xs text-slate-400">Costo estimado por kilómetro</p>
          </div>
        </Card>
      </div>

      {/* Cumplimiento ambiental */}
      <Card>
        <CardHeader title="Cumplimiento ambiental" subtitle="Indicadores de sostenibilidad operativa" />
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-800">Vehículos eléctricos en flota</p>
                <p className="text-xs text-emerald-600">Reducción directa de emisiones</p>
              </div>
            </div>
            <span className="text-lg font-bold text-emerald-700">2 unidades</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Vehículos híbridos en flota</p>
                <p className="text-xs text-blue-600">Reducción parcial de emisiones</p>
              </div>
            </div>
            <span className="text-lg font-bold text-blue-700">2 unidades</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} className="text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-800">Vehículos diésel en flota</p>
                <p className="text-xs text-amber-600">Mayor factor de emisión — considerar renovación</p>
              </div>
            </div>
            <span className="text-lg font-bold text-amber-700">7 unidades</span>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-600">
              <strong className="text-slate-800">Recomendación:</strong> Priorizar la renovación de vehículos diésel por híbridos o eléctricos en el próximo ciclo de inversión. La sustitución de 3 vehículos diésel reduciría las emisiones en aproximadamente <strong className="text-emerald-600">45%</strong> por kilómetro.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============ US-023: Calcular Emisiones Totales de CO₂ ============

function EmisionesTab({ emissionsBreakdown }: { emissionsBreakdown: ReturnType<typeof useApp>['emissionsBreakdown'] }) {
  if (!emissionsBreakdown) {
    return <Card><div className="py-16 text-center text-sm text-slate-400">Cargando emisiones CO₂...</div></Card>;
  }

  const fuelColors: Record<string, string> = {
    'Diésel': '#f59e0b',
    'Gasolina': '#3b82f6',
    'Híbrido': '#10b981',
    'Eléctrico': '#06b6d4',
    'GNC': '#8b5cf6',
  };

  const donutData = emissionsBreakdown.emissionsByFuelType.map((e) => ({
    label: e.fuelType,
    value: e.emissions,
    color: fuelColors[e.fuelType] || '#94a3b8',
  }));

  return (
    <div className="space-y-6">
      {/* Total emissions hero */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Emisiones totales"
          value={`${emissionsBreakdown.totalEmissionsKgCO2} kg`}
          icon={<Cloud size={22} />}
          color="emerald"
          subtitle="CO₂ estimado"
        />
        <StatCard
          title="Equivalente en toneladas"
          value={`${emissionsBreakdown.totalEmissionsTonsCO2} t`}
          icon={<Calculator size={22} />}
          color="blue"
          subtitle="CO₂ equivalente"
        />
        <StatCard
          title="Ahorro vehículos eléctricos"
          value={`${emissionsBreakdown.electricVehicleSavings} kg`}
          icon={<Leaf size={22} />}
          color="emerald"
          subtitle="CO₂ evitado"
        />
        <StatCard
          title="Ahorro vehículos híbridos"
          value={`${emissionsBreakdown.hybridVehicleSavings} kg`}
          icon={<Car size={22} />}
          color="sky"
          subtitle="CO₂ evitado"
        />
      </div>

      {/* Equivalencies */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <TreePine size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Árboles necesarios para compensar</p>
              <p className="text-2xl font-bold text-slate-900">{emissionsBreakdown.equivalentTreesNeeded} árboles/año</p>
              <p className="text-xs text-slate-400">Cada árbol absorbe ~22 kg CO₂/año</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Car size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Equivalente a autos fuera de carretera</p>
              <p className="text-2xl font-bold text-slate-900">{emissionsBreakdown.equivalentCarsOffRoad}</p>
              <p className="text-xs text-slate-400">Basado en 120 kg CO₂/100km</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Emisiones por tipo de combustible" subtitle="Distribución de kg CO₂" />
          <div className="p-5">
            {donutData.length > 0 ? (
              <DonutChart data={donutData} />
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">Sin datos</p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Emisiones por ruta" subtitle="kg CO₂ y distancia recorrida" />
          <div className="p-5">
            {emissionsBreakdown.emissionsByRoute.length > 0 ? (
              <BarChart
                data={emissionsBreakdown.emissionsByRoute.map((e) => ({
                  label: e.routeCode,
                  value: e.emissions,
                  color: 'bg-emerald-500',
                }))}
                unit=" kg"
              />
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">Sin datos</p>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Emisiones por distrito" subtitle="Distribución geográfica de kg CO₂" />
          <div className="p-5">
            {emissionsBreakdown.emissionsByDistrict.length > 0 ? (
              <BarChart
                data={emissionsBreakdown.emissionsByDistrict.slice(0, 10).map((e, i) => ({
                  label: e.district,
                  value: e.emissions,
                  color: ['bg-emerald-500', 'bg-emerald-400', 'bg-blue-500', 'bg-blue-400', 'bg-amber-500', 'bg-amber-400'][i % 6],
                }))}
                unit=" kg"
              />
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">Sin datos</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============ US-024: Proponer Plan de Compensación de Carbono ============

const initiativeIcons: Record<CarbonInitiative['type'], React.ReactNode> = {
  reforestation: <TreePine size={22} />,
  renewable_energy: <Sun size={22} />,
  fleet_renewal: <Truck size={22} />,
  route_optimization: <RouteIcon size={22} />,
  carbon_credits: <FileText size={22} />,
};

const initiativeColors: Record<CarbonInitiative['type'], string> = {
  reforestation: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  renewable_energy: 'bg-amber-50 text-amber-600 ring-amber-100',
  fleet_renewal: 'bg-blue-50 text-blue-600 ring-blue-100',
  route_optimization: 'bg-sky-50 text-sky-600 ring-sky-100',
  carbon_credits: 'bg-slate-100 text-slate-600 ring-slate-200',
};

const impactConfig = {
  high: { label: 'Alto impacto', color: 'text-emerald-600 bg-emerald-50', icon: <ArrowUpRight size={14} /> },
  medium: { label: 'Impacto medio', color: 'text-amber-600 bg-amber-50', icon: <ArrowDownRight size={14} /> },
  low: { label: 'Bajo impacto', color: 'text-slate-500 bg-slate-100', icon: <ArrowDownRight size={14} /> },
};

function CompensacionTab({ plan }: { plan: ReturnType<typeof useApp>['carbonCompensationPlan'] }) {
  if (!plan) {
    return <Card><div className="py-16 text-center text-sm text-slate-400">Cargando plan de compensación...</div></Card>;
  }

  const compensationPct = plan.compensationPercentage;

  return (
    <div className="space-y-6">
      {/* Hero: net zero target */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Emisiones totales"
          value={`${plan.totalEmissionsTonsCO2} t`}
          icon={<Cloud size={22} />}
          color="amber"
          subtitle="CO₂ a compensar"
        />
        <StatCard
          title="Meta de compensación"
          value={`${plan.compensationTargetTons} t`}
          icon={<Target size={22} />}
          color="blue"
          subtitle="80% del total"
        />
        <StatCard
          title="Compensación propuesta"
          value={`${plan.totalCompensationTons} t`}
          icon={<Sprout size={22} />}
          color="emerald"
          subtitle={`${compensationPct}% del total`}
        />
        <StatCard
          title="Inversión total"
          value={`$${plan.totalInvestmentUSD.toLocaleString()}`}
          icon={<DollarSign size={22} />}
          color="sky"
          subtitle="USD estimado"
        />
      </div>

      {/* Progress toward net zero */}
      <Card>
        <CardHeader title="Progreso hacia emisiones netas cero" subtitle="Cobertura del plan de compensación" />
        <div className="space-y-5 p-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Emisiones compensadas</span>
              <span className="font-bold text-emerald-600">{compensationPct}%</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
                style={{ width: `${Math.min(100, compensationPct)}%` }}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-amber-50 p-4 text-center">
              <p className="text-xs text-amber-600">Emisiones totales</p>
              <p className="text-xl font-bold text-amber-700">{plan.totalEmissionsTonsCO2} t CO₂</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4 text-center">
              <p className="text-xs text-emerald-600">Compensado</p>
              <p className="text-xl font-bold text-emerald-700">{plan.totalCompensationTons} t CO₂</p>
            </div>
            <div className="rounded-lg bg-slate-100 p-4 text-center">
              <p className="text-xs text-slate-500">Emisiones netas</p>
              <p className="text-xl font-bold text-slate-700">{plan.netEmissionsTons} t CO₂</p>
            </div>
          </div>
          {plan.netEmissionsTons <= 0 && (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-100 p-3 text-emerald-700">
              <Award size={20} />
              <span className="text-sm font-medium">Emisiones netas cero alcanzadas con el plan propuesto</span>
            </div>
          )}
        </div>
      </Card>

      {/* Initiatives */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Iniciativas de compensación propuestas</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {plan.initiatives.map((init) => {
            const impact = impactConfig[init.impact];
            return (
              <Card key={init.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="flex items-start gap-4 p-5">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-4 ${initiativeColors[init.type]}`}>
                    {initiativeIcons[init.type]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-slate-900">{init.name}</h4>
                      <span className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${impact.color}`}>
                        {impact.icon}
                        {impact.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-600">{init.description}</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div>
                        <p className="text-xs text-slate-400">Compensación</p>
                        <p className="text-sm font-bold text-emerald-600">{init.compensationTons} t CO₂</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Costo</p>
                        <p className="text-sm font-bold text-slate-900">${init.costUSD.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Costo/t CO₂</p>
                        <p className="text-sm font-bold text-slate-900">${init.costPerTon}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Plazo</p>
                        <p className="text-sm font-bold text-slate-900">{init.timeframe}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Summary table */}
      <Card>
        <CardHeader title="Resumen del plan" subtitle="Inversión y compensación por iniciativa" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-slate-600">Iniciativa</th>
                <th className="px-5 py-3 text-right font-medium text-slate-600">Compensación (t CO₂)</th>
                <th className="px-5 py-3 text-right font-medium text-slate-600">Costo (USD)</th>
                <th className="px-5 py-3 text-right font-medium text-slate-600">Costo/t CO₂</th>
                <th className="px-5 py-3 text-center font-medium text-slate-600">Plazo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plan.initiatives.map((init) => (
                <tr key={init.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-900">{init.name}</td>
                  <td className="px-5 py-3 text-right text-emerald-600 font-semibold">{init.compensationTons}</td>
                  <td className="px-5 py-3 text-right text-slate-700">${init.costUSD.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-slate-700">${init.costPerTon}</td>
                  <td className="px-5 py-3 text-center text-slate-600">{init.timeframe}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-slate-200 bg-slate-50">
              <tr>
                <td className="px-5 py-3 font-bold text-slate-900">Total</td>
                <td className="px-5 py-3 text-right font-bold text-emerald-600">{plan.totalCompensationTons} t</td>
                <td className="px-5 py-3 text-right font-bold text-slate-900">${plan.totalInvestmentUSD.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-slate-400">—</td>
                <td className="px-5 py-3 text-center text-slate-400">—</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Methodology note */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <FileText size={20} className="mt-0.5 shrink-0 text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-700">Metodología y referencias</p>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-500">
              <li>• Factores de emisión basados en el tipo de combustible de cada vehículo (columna <code className="rounded bg-slate-200 px-1 py-0.5 text-slate-700">emissions_per_km</code>).</li>
              <li>• Compensación de árboles: 22 kg CO₂/año por árbol (referencia FAO).</li>
              <li>• Optimización de rutas: reducción estimada del 30% en distancia (literatura VRP, algoritmo de ahorros Clarke-Wright).</li>
              <li>• Créditos de carbono: precio referencial $15 USD/ton CO₂ (certificación VCS/Verra, proyectos REDD+ Amazonía peruana).</li>
              <li>• Precios de combustible: diésel S/ 16.50/L, gasolina S/ 18.50/L (mercado peruano 2026).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
