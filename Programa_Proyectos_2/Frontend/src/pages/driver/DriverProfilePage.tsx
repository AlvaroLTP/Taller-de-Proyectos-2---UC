import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/ui';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { driverStatusConfig } from '@/utils/formatters';
import { Phone, IdCard, Clock, Truck, Package, CheckCircle2, AlertTriangle } from 'lucide-react';

export function DriverProfilePage() {
  const { currentUser, drivers, vehicles, orders } = useApp();
  const driver = drivers.find((d) => d.id === currentUser?.driverId);
  const vehicle = vehicles.find((v) => v.id === driver?.vehicleId);
  const myOrders = orders.filter((o) => o.driverId === currentUser?.driverId);

  if (!driver) {
    return (
      <div className="space-y-6">
        <PageHeader title="Mi perfil" />
        <Card><div className="p-6 text-sm text-slate-400">No se encontró información del conductor</div></Card>
      </div>
    );
  }

  const completed = myOrders.filter((o) => o.status === 'delivered').length;
  const incidents = myOrders.filter((o) => o.status === 'not_delivered').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Mi perfil" subtitle="Información personal y estadísticas" />

      <Card className="overflow-hidden">
        <div className="flex flex-col items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-800 p-8 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur text-3xl font-bold text-white">
            {driver.avatarInitials}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white">{driver.name}</h2>
            <p className="text-blue-100">Conductor · DistriRápido S.A.C.</p>
            <div className="mt-2 flex justify-center gap-2 sm:justify-start">
              <Badge color={driverStatusConfig[driver.status].color}>{driverStatusConfig[driver.status].label}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Package size={20} className="text-blue-500" />
          <p className="mt-2 text-xs text-slate-400">Total entregas</p>
          <p className="text-xl font-bold text-slate-900">{myOrders.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <CheckCircle2 size={20} className="text-emerald-500" />
          <p className="mt-2 text-xs text-slate-400">Completadas</p>
          <p className="text-xl font-bold text-slate-900">{completed}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <AlertTriangle size={20} className="text-red-500" />
          <p className="mt-2 text-xs text-slate-400">Incidencias</p>
          <p className="text-xl font-bold text-slate-900">{incidents}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Truck size={20} className="text-blue-500" />
          <p className="mt-2 text-xs text-slate-400">Vehículo</p>
          <p className="text-xl font-bold text-slate-900">{vehicle?.code || '-'}</p>
        </div>
      </div>

      <Card>
        <CardHeader title="Datos personales" />
        <div className="grid grid-cols-2 gap-4 p-5">
          <InfoRow icon={<IdCard size={16} />} label="DNI" value={driver.dni} />
          <InfoRow icon={<Phone size={16} />} label="Teléfono" value={driver.phone} />
          <InfoRow icon={<IdCard size={16} />} label="Licencia" value={`${driver.licenseType} · ${driver.license}`} />
          <InfoRow icon={<Clock size={16} />} label="Horario" value={`${driver.shiftStart} - ${driver.shiftEnd}`} />
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">{icon}</div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}
