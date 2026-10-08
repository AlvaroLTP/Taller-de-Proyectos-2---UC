import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/ui';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { priorityConfig } from '@/utils/formatters';
import { Ban, Clock, AlertTriangle, Phone, Eye } from 'lucide-react';
import { useState } from 'react';
import type { Order } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function RestrictionsPage() {
  const { orders, clients } = useApp();
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const ordersWithRestrictions = orders.filter(
    (o) =>
      o.preferences.restrictions.length > 0 ||
      o.preferences.requiresSpecialAttention ||
      o.preferences.noLunchHours ||
      o.preferences.requiresPhoneCoordination
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Restricciones y preferencias"
        subtitle="Condiciones especiales de entrega que serán consideradas en la planificación de rutas"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-amber-600"><AlertTriangle size={20} /><span className="text-sm font-medium">Restricciones</span></div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{ordersWithRestrictions.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-red-600"><Ban size={20} /><span className="text-sm font-medium">Atención especial</span></div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{orders.filter((o) => o.preferences.requiresSpecialAttention).length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sky-600"><Phone size={20} /><span className="text-sm font-medium">Coord. telefónica</span></div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{orders.filter((o) => o.preferences.requiresPhoneCoordination).length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600"><Clock size={20} /><span className="text-sm font-medium">Sin almuerzo</span></div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{orders.filter((o) => o.preferences.noLunchHours).length}</p>
        </div>
      </div>

      <Card>
        <CardHeader title="Pedidos con restricciones" subtitle="Condiciones que afectan la planificación" />
        <div className="divide-y divide-slate-100">
          {ordersWithRestrictions.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No hay pedidos con restricciones</p>
          ) : (
            ordersWithRestrictions.map((o) => {
              const client = clients.find((c) => c.id === o.clientId);
              return (
                <div key={o.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{o.code}</span>
                      <Badge color={priorityConfig[o.priority].color}>{priorityConfig[o.priority].label}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">{client?.name} · {o.address.district}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {o.preferences.restrictions.map((r, i) => (
                        <Badge key={i} color="bg-amber-100 text-amber-700 border-amber-200">{r}</Badge>
                      ))}
                      {o.preferences.requiresSpecialAttention && <Badge color="bg-red-100 text-red-700 border-red-200">Atención especial</Badge>}
                      {o.preferences.noLunchHours && <Badge color="bg-slate-100 text-slate-600 border-slate-200">No almuerzo</Badge>}
                      {o.preferences.requiresPhoneCoordination && <Badge color="bg-sky-100 text-sky-700 border-sky-200">Coord. telefónica</Badge>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={12} /> {o.preferences.timeWindowStart} - {o.preferences.timeWindowEnd}</span>
                    <span>Tipo acceso: {o.preferences.accessType}</span>
                    <button onClick={() => setViewOrder(o)} className="mt-1 flex items-center gap-1 text-blue-600 hover:text-blue-700">
                      <Eye size={14} /> Ver detalle
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {viewOrder && (
        <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Restricciones - ${viewOrder.code}`} size="lg">
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <h4 className="mb-2 text-sm font-semibold text-slate-700">Preferencias de entrega</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-slate-400">Horario preferido</p><p className="text-sm font-medium text-slate-700">{viewOrder.preferences.preferredTime}</p></div>
                <div><p className="text-xs text-slate-400">Ventana de entrega</p><p className="text-sm font-medium text-slate-700">{viewOrder.preferences.timeWindowStart} - {viewOrder.preferences.timeWindowEnd}</p></div>
                <div><p className="text-xs text-slate-400">Tipo de acceso</p><p className="text-sm font-medium text-slate-700">{viewOrder.preferences.accessType}</p></div>
                <div><p className="text-xs text-slate-400">Prioridad</p><p className="text-sm font-medium text-slate-700">{priorityConfig[viewOrder.priority].label}</p></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {viewOrder.preferences.restrictions.map((r, i) => (
                <Badge key={i} color="bg-amber-100 text-amber-700 border-amber-200">{r}</Badge>
              ))}
              {viewOrder.preferences.requiresSpecialAttention && <Badge color="bg-red-100 text-red-700 border-red-200">Requiere atención especial</Badge>}
              {viewOrder.preferences.noLunchHours && <Badge color="bg-slate-100 text-slate-600 border-slate-200">No entregar en almuerzo</Badge>}
              {viewOrder.preferences.requiresPhoneCoordination && <Badge color="bg-sky-100 text-sky-700 border-sky-200">Coordinación telefónica</Badge>}
            </div>
            {viewOrder.preferences.observations && (
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-400">Observaciones</p>
                <p className="text-sm text-slate-700">{viewOrder.preferences.observations}</p>
              </div>
            )}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setViewOrder(null)}>Cerrar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
