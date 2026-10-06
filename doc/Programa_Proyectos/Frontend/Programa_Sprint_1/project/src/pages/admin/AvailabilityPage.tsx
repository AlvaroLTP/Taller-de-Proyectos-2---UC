import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/ui';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { driverStatusConfig, vehicleStatusConfig } from '@/utils/formatters';
import { Calendar, Clock, Truck, Users, CheckCircle2, XCircle } from 'lucide-react';

export function AvailabilityPage() {
  const { drivers, vehicles, toggleDriverAvailability, toggleVehicleAvailability } = useApp();

  return (
    <div className="space-y-6">
      <PageHeader title="Disponibilidad" subtitle="Gestión de horarios y disponibilidad de conductores y vehículos" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Drivers */}
        <Card>
          <CardHeader title="Conductores" subtitle="Horarios y disponibilidad" />
          <div className="divide-y divide-slate-100">
            {drivers.map((d) => (
              <div key={d.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-xs font-bold text-white">
                  {d.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{d.name}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock size={12} /> {d.shiftStart} - {d.shiftEnd}
                  </p>
                </div>
                <Badge color={driverStatusConfig[d.status].color}>{driverStatusConfig[d.status].label}</Badge>
                <button
                  onClick={() => toggleDriverAvailability(d.id)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${d.available ? 'bg-teal-500' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${d.available ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Vehicles */}
        <Card>
          <CardHeader title="Vehículos" subtitle="Horarios y disponibilidad" />
          <div className="divide-y divide-slate-100">
            {vehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Truck size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{v.code}</p>
                  <p className="text-xs text-slate-500">{v.plate} · {v.type} · {v.capacityKg} kg</p>
                </div>
                <Badge color={vehicleStatusConfig[v.status].color}>{vehicleStatusConfig[v.status].label}</Badge>
                <button
                  onClick={() => toggleVehicleAvailability(v.id)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${v.available ? 'bg-teal-500' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${v.available ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">Conductores disponibles</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{drivers.filter((d) => d.available).length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <XCircle size={20} />
            <span className="text-sm font-medium">No disponibles</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{drivers.filter((d) => !d.available).length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <Truck size={20} />
            <span className="text-sm font-medium">Vehículos disponibles</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{vehicles.filter((v) => v.available).length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Truck size={20} />
            <span className="text-sm font-medium">No disponibles</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{vehicles.filter((v) => !v.available).length}</p>
        </div>
      </div>
    </div>
  );
}
