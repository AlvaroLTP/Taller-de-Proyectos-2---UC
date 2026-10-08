import type { RouteStop } from '@/types';
import { MapPin, Flag, Navigation, Truck } from 'lucide-react';

interface RouteMapProps {
  stops: RouteStop[];
  driverName?: string;
  vehicleCode?: string;
  totalDistance?: number;
}

export function RouteMap({ stops, driverName, vehicleCode, totalDistance }: RouteMapProps) {
  if (stops.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">
        Sin paradas para mostrar
      </div>
    );
  }

  const allLats = [0, ...stops.map((s) => s.lat)];
  const allLngs = [0, ...stops.map((s) => s.lng)];
  const minLat = Math.min(...stops.map((s) => s.lat));
  const maxLat = Math.max(...stops.map((s) => s.lat));
  const minLng = Math.min(...stops.map((s) => s.lng));
  const maxLng = Math.max(...stops.map((s) => s.lng));

  const padLat = (maxLat - minLat) * 0.15 || 0.01;
  const padLng = (maxLng - minLng) * 0.15 || 0.01;

  const bounds = {
    minLat: minLat - padLat,
    maxLat: maxLat + padLat,
    minLng: minLng - padLng,
    maxLng: maxLng + padLng,
  };

  const W = 800;
  const H = 400;
  const padding = 50;

  const project = (lat: number, lng: number) => {
    const x = padding + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (W - 2 * padding);
    const y = H - padding - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * (H - 2 * padding);
    return { x, y };
  };

  const depot = { lat: (minLat + maxLat) / 2 - padLat * 0.5, lng: minLng - padLng * 0.3 };
  const depotPos = project(depot.lat, depot.lng);

  const stopPositions = stops.map((s) => ({ ...s, pos: project(s.lat, s.lng) }));

  const pathPoints = [depotPos, ...stopPositions.map((s) => s.pos), depotPos];
  const pathD = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex items-center gap-3 text-xs">
          {driverName && (
            <span className="flex items-center gap-1.5 text-slate-600">
              <Truck size={14} className="text-slate-400" />
              {driverName}
            </span>
          )}
          {vehicleCode && (
            <span className="rounded bg-slate-200 px-2 py-0.5 font-medium text-slate-600">
              {vehicleCode}
            </span>
          )}
        </div>
        {totalDistance != null && (
          <span className="text-xs font-medium text-slate-500">
            Distancia total: {totalDistance} km
          </span>
        )}
      </div>
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: '300px' }}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((f) => (
            <g key={f}>
              <line x1={f * W} y1={0} x2={f * W} y2={H} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
              <line x1={0} y1={f * H} x2={W} y2={f * H} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
            </g>
          ))}

          {/* Route path */}
          <path
            d={pathD}
            fill="none"
            stroke="#0d9488"
            strokeWidth={2.5}
            strokeDasharray="6 3"
            opacity={0.7}
          />

          {/* Depot */}
          <g>
            <circle cx={depotPos.x} cy={depotPos.y} r={12} fill="#1e293b" />
            <circle cx={depotPos.x} cy={depotPos.y} r={6} fill="#475569" />
            <text x={depotPos.x} y={depotPos.y + 1} textAnchor="middle" fontSize={9} fill="white" fontWeight="bold">
              D
            </text>
            <text x={depotPos.x} y={depotPos.y - 18} textAnchor="middle" fontSize={10} fill="#1e293b" fontWeight="600">
              Depósito
            </text>
          </g>

          {/* Stops */}
          {stopPositions.map((s, i) => {
            const isCompleted = s.status === 'delivered';
            const isIncident = s.status === 'not_delivered' || s.status === 'cancelled';
            const isCurrent = s.status === 'in_route';
            const fill = isCompleted ? '#10b981' : isIncident ? '#ef4444' : isCurrent ? '#3b82f6' : '#f59e0b';
            return (
              <g key={i}>
                <circle cx={s.pos.x} cy={s.pos.y} r={14} fill="white" stroke={fill} strokeWidth={2.5} />
                <circle cx={s.pos.x} cy={s.pos.y} r={8} fill={fill} />
                <text x={s.pos.x} y={s.pos.y + 1} textAnchor="middle" fontSize={8} fill="white" fontWeight="bold">
                  {s.order}
                </text>
                {i < stopPositions.length && (
                  <text x={s.pos.x} y={s.pos.y - 18} textAnchor="middle" fontSize={9} fill="#64748b">
                    {s.district.length > 15 ? s.district.slice(0, 12) + '...' : s.district}
                  </text>
                )}
              </g>
            );
          })}

          {/* Legend */}
          <g transform={`translate(${W - 160}, ${H - 90})`}>
            <rect x={0} y={0} width={150} height={80} fill="white" stroke="#e2e8f0" strokeWidth={1} rx={8} />
            <circle cx={15} cy={20} r={6} fill="#10b981" />
            <text x={28} y={23} fontSize={10} fill="#475569">Entregado</text>
            <circle cx={15} cy={38} r={6} fill="#3b82f6" />
            <text x={28} y={41} fontSize={10} fill="#475569">En ruta</text>
            <circle cx={15} cy={56} r={6} fill="#f59e0b" />
            <text x={28} y={59} fontSize={10} fill="#475569">Pendiente</text>
            <circle cx={90} cy={20} r={6} fill="#ef4444" />
            <text x={103} y={23} fontSize={10} fill="#475569">Incidencia</text>
            <circle cx={90} cy={38} r={6} fill="#1e293b" />
            <text x={103} y={41} fontSize={10} fill="#475569">Depósito</text>
          </g>
        </svg>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white px-4 py-3">
        {stops.slice(0, 6).map((s) => (
          <div key={s.orderId} className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={12} className="text-blue-500" />
            <span>{s.order}. {s.district}</span>
          </div>
        ))}
        {stops.length > 6 && (
          <span className="text-xs text-slate-400">+{stops.length - 6} más</span>
        )}
      </div>
    </div>
  );
}
