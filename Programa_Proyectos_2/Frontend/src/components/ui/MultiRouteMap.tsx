import type { RouteStop } from '@/types';

interface MultiRouteStop extends RouteStop {
  routeCode: string;
  routeStatus: string;
}

interface MultiRouteMapProps {
  routes: Array<{
    code: string;
    stops: RouteStop[];
    status: string;
  }>;
}

const routeColors = ['#0d9488', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#06b6d4', '#f97316'];

export function MultiRouteMap({ routes }: MultiRouteMapProps) {
  if (routes.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">
        Sin rutas para mostrar
      </div>
    );
  }

  const allStops: MultiRouteStop[] = routes.flatMap((r) =>
    r.stops.map((s) => ({ ...s, routeCode: r.code, routeStatus: r.status }))
  );

  if (allStops.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">
        Las rutas no tienen paradas
      </div>
    );
  }

  const minLat = Math.min(...allStops.map((s) => s.lat));
  const maxLat = Math.max(...allStops.map((s) => s.lat));
  const minLng = Math.min(...allStops.map((s) => s.lng));
  const maxLng = Math.max(...allStops.map((s) => s.lng));

  const padLat = (maxLat - minLat) * 0.15 || 0.01;
  const padLng = (maxLng - minLng) * 0.15 || 0.01;

  const bounds = {
    minLat: minLat - padLat,
    maxLat: maxLat + padLat,
    minLng: minLng - padLng,
    maxLng: maxLng + padLng,
  };

  const W = 900;
  const H = 480;
  const padding = 60;

  const project = (lat: number, lng: number) => {
    const x = padding + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (W - 2 * padding);
    const y = H - padding - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * (H - 2 * padding);
    return { x, y };
  };

  const depot = { lat: (minLat + maxLat) / 2, lng: minLng - padLng * 0.3 };
  const depotPos = project(depot.lat, depot.lng);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <p className="text-xs font-medium text-slate-600">
          Mapa operativo · {routes.length} rutas · {allStops.length} paradas
        </p>
      </div>
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: '380px' }} role="img" aria-label="Mapa de rutas operativas">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((f) => (
            <g key={f}>
              <line x1={f * W} y1={0} x2={f * W} y2={H} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
              <line x1={0} y1={f * H} x2={W} y2={f * H} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
            </g>
          ))}

          {/* Route paths */}
          {routes.map((r, idx) => {
            const color = routeColors[idx % routeColors.length];
            const stops = r.stops;
            if (stops.length === 0) return null;
            const pts = [depotPos, ...stops.map((s) => project(s.lat, s.lng)), depotPos];
            const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
            return (
              <path
                key={r.code}
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeDasharray="5 3"
                opacity={0.55}
              />
            );
          })}

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
          {allStops.map((s, i) => {
            const routeIdx = routes.findIndex((r) => r.code === s.routeCode);
            const color = routeColors[routeIdx % routeColors.length];
            const isCompleted = s.status === 'delivered';
            const isIncident = s.status === 'not_delivered' || s.status === 'cancelled';
            const isCurrent = s.status === 'in_route';
            const fill = isCompleted ? '#10b981' : isIncident ? '#ef4444' : isCurrent ? '#3b82f6' : color;
            const pos = project(s.lat, s.lng);
            return (
              <g key={i}>
                <circle cx={pos.x} cy={pos.y} r={10} fill="white" stroke={fill} strokeWidth={2.5} />
                <circle cx={pos.x} cy={pos.y} r={5} fill={fill} />
                <text x={pos.x} y={pos.y - 14} textAnchor="middle" fontSize={8} fill="#64748b">
                  {s.district.length > 12 ? s.district.slice(0, 10) + '…' : s.district}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <g transform={`translate(${W - 200}, 20)`}>
            <rect x={0} y={0} width={185} height={28 + routes.length * 16} fill="white" stroke="#e2e8f0" strokeWidth={1} rx={8} opacity={0.95} />
            <text x={10} y={18} fontSize={10} fill="#475569" fontWeight="600">Leyenda de rutas</text>
            {routes.map((r, i) => (
              <g key={r.code} transform={`translate(10, ${28 + i * 16})`}>
                <circle cx={6} cy={6} r={5} fill={routeColors[i % routeColors.length]} />
                <text x={16} y={9} fontSize={9} fill="#475569">{r.code} · {r.stops.length} paradas</text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
