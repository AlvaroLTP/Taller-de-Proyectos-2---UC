import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/ui';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { vehicleStatusConfig, fuelTypeConfig } from '@/utils/formatters';
import { Truck, Gauge, Fuel, Weight, Package, Calendar } from 'lucide-react';

export function MyVehiclePage() {
  const { currentUser, drivers, vehicles } = useApp();
  const driver = drivers.find((d) => d.id === currentUser?.driverId);
  const vehicle = vehicles.find((v) => v.id === driver?.vehicleId);

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <PageHeader title="Mi vehículo" subtitle="Vehículo asignado" />
        <Card>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
            <Truck size={48} strokeWidth={1.5} />
            <p className="text-sm">No tiene vehículo asignado</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Mi vehículo" subtitle="Información del vehículo asignado" />

      <Card className="overflow-hidden">
        <div className="flex items-center gap-5 bg-gradient-to-r from-slate-800 to-slate-900 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <Truck size={40} className="text-white" />
          </div>
          <div className="text-white">
            <h2 className="text-xl font-bold">{vehicle.brand} {vehicle.model}</h2>
            <p className="text-sm text-slate-300">{vehicle.code} · {vehicle.plate}</p>
            <div className="mt-2"><Badge color={vehicleStatusConfig[vehicle.status].color}>{vehicleStatusConfig[vehicle.status].label}</Badge></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3">
          <InfoItem icon={<Gauge size={18} />} label="Tipo" value={vehicle.type} />
          <InfoItem icon={<Fuel size={18} />} label="Combustible" value={fuelTypeConfig[vehicle.fuelType].label} />
          <InfoItem icon={<Weight size={18} />} label="Capacidad de carga" value={`${vehicle.capacityKg} kg`} />
          <InfoItem icon={<Package size={18} />} label="Capacidad volumétrica" value={`${vehicle.capacityM3} m³`} />
          <InfoItem icon={<Gauge size={18} />} label="Consumo" value={vehicle.consumptionKmPerL > 0 ? `${vehicle.consumptionKmPerL} km/L` : 'Eléctrico'} />
          <InfoItem icon={<Fuel size={18} />} label="Emisiones" value={`${vehicle.emissionsPerKm} kg CO₂/km`} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Horario de conducción" subtitle="Jornada laboral" />
        <div className="grid grid-cols-2 gap-4 p-5">
          <InfoItem icon={<Calendar size={18} />} label="Hora de inicio" value={driver?.shiftStart || '-'} />
          <InfoItem icon={<Calendar size={18} />} label="Hora de fin" value={driver?.shiftEnd || '-'} />
        </div>
      </Card>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500">{icon}</div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}
