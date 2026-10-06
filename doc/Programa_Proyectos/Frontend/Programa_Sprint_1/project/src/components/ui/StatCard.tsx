import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'sky' | 'teal' | 'slate' | 'indigo';
  trend?: { value: string; up: boolean };
  subtitle?: string;
}

const colorClasses: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
  red: { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-100' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-100' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', ring: 'ring-teal-100' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-100' },
};

export function StatCard({ title, value, icon, color = 'blue', trend, subtitle }: StatCardProps) {
  const c = colorClasses[color];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              {trend.up ? (
                <TrendingUp size={14} className="text-emerald-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
              <span className={trend.up ? 'text-emerald-600' : 'text-red-600'}>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.bg} ${c.text} ring-4 ${c.ring}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
