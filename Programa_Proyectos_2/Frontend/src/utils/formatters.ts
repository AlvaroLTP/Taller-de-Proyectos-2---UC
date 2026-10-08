import type {
  VehicleStatus,
  DriverStatus,
  OrderStatus,
  RouteStatus,
  FuelType,
} from '@/types';

export const vehicleStatusConfig: Record<VehicleStatus, { label: string; color: string }> = {
  available: { label: 'Disponible', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  in_route: { label: 'En ruta', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  maintenance: { label: 'Mantenimiento', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  unavailable: { label: 'No disponible', color: 'bg-red-100 text-red-700 border-red-200' },
};

export const driverStatusConfig: Record<DriverStatus, { label: string; color: string }> = {
  available: { label: 'Disponible', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  in_route: { label: 'En ruta', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  unavailable: { label: 'No disponible', color: 'bg-red-100 text-red-700 border-red-200' },
  resting: { label: 'Descanso', color: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export const orderStatusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  planned: { label: 'Planificado', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  in_route: { label: 'En ruta', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  delivered: { label: 'Entregado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  not_delivered: { label: 'No entregado', color: 'bg-red-100 text-red-700 border-red-200' },
  cancelled: { label: 'Cancelado', color: 'bg-slate-100 text-slate-500 border-slate-200' },
};

export const routeStatusConfig: Record<RouteStatus, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  preparing: { label: 'Preparando', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  in_route: { label: 'En ruta', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  finished: { label: 'Finalizada', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  with_incidents: { label: 'Con incidencias', color: 'bg-red-100 text-red-700 border-red-200' },
};

export const fuelTypeConfig: Record<FuelType, { label: string }> = {
  gasoline: { label: 'Gasolina' },
  diesel: { label: 'Diésel' },
  electric: { label: 'Eléctrico' },
  hybrid: { label: 'Híbrido' },
  cng: { label: 'Gas Natural' },
};

export const priorityConfig: Record<'high' | 'medium' | 'low', { label: string; color: string }> = {
  high: { label: 'Alta', color: 'bg-red-100 text-red-700 border-red-200' },
  medium: { label: 'Media', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  low: { label: 'Baja', color: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  return `${h} h ${m} min`;
}

export function formatCurrency(value: number): string {
  return `S/ ${value.toFixed(2)}`;
}

export function formatDate(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}
