import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import type { Order, OrderStatus } from '@/types';
import { PageHeader, SearchBar, FilterSelect, useToast, Toast } from '@/components/ui';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea, Select } from '@/components/ui/Form';
import { orderStatusConfig, priorityConfig } from '@/utils/formatters';
import { Package, MapPin, Clock, Phone, AlertTriangle, Play, CheckCircle2, XCircle, Weight, FileText, User } from 'lucide-react';

const incidentReasons = [
  'Cliente ausente',
  'Dirección incorrecta',
  'Acceso restringido',
  'Vehículo no pudo llegar',
  'Cliente rechazó pedido',
  'Otro',
];

export function MyDeliveriesPage() {
  const { currentUser, orders, clients, updateOrderStatus } = useApp();
  const { toast, showToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [incidentOrder, setIncidentOrder] = useState<Order | null>(null);
  const [incidentReason, setIncidentReason] = useState('');
  const [incidentNotes, setIncidentNotes] = useState('');

  const myOrders = useMemo(
    () => orders.filter((o) => o.driverId === currentUser?.driverId),
    [orders, currentUser]
  );

  const filtered = useMemo(() => {
    return myOrders.filter((o) => {
      const client = clients.find((c) => c.id === o.clientId);
      const matchSearch = !search ||
        o.code.toLowerCase().includes(search.toLowerCase()) ||
        (client?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchStatus = !statusFilter || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [myOrders, clients, search, statusFilter]);

  const handleStart = async (order: Order) => {
    await updateOrderStatus(order.id, 'in_route');
    showToast('Entrega iniciada');
    setViewOrder(null);
  };

  const handleComplete = async (order: Order) => {
    await updateOrderStatus(order.id, 'delivered');
    showToast('Entrega completada');
    setViewOrder(null);
  };

  const handleIncident = async () => {
    if (!incidentOrder) return;
    if (!incidentReason) { showToast('Seleccione un motivo', 'error'); return; }
    await updateOrderStatus(incidentOrder.id, 'not_delivered', {
      incidentReason,
      incidentNotes,
    });
    showToast('Incidencia registrada');
    setIncidentOrder(null);
    setIncidentReason('');
    setIncidentNotes('');
    setViewOrder(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Mis entregas" subtitle="Lista de entregas asignadas" />

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por código o cliente..." />
        <FilterSelect
          label="Estado"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: '', label: 'Todos' },
            ...Object.entries(orderStatusConfig).map(([v, c]) => ({ value: v, label: c.label })),
          ]}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((o) => {
          const client = clients.find((c) => c.id === o.clientId);
          return (
            <Card key={o.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="font-semibold text-slate-900">{o.code}</span>
                <div className="flex gap-1.5">
                  <Badge color={priorityConfig[o.priority].color}>{priorityConfig[o.priority].label}</Badge>
                  <Badge color={orderStatusConfig[o.status].color}>{orderStatusConfig[o.status].label}</Badge>
                </div>
              </div>
              <div className="space-y-2 p-4">
                <p className="flex items-center gap-2 text-sm text-slate-700">
                  <User size={14} className="text-slate-400" /> {client?.name}
                </p>
                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={14} className="text-slate-400" /> {o.address.street}, {o.address.district}
                </p>
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={12} /> {o.timeWindowStart} - {o.timeWindowEnd}
                </p>
                {o.address.reference && (
                  <p className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">Ref: {o.address.reference}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setViewOrder(o)}>Ver detalle</Button>
                  {(o.status === 'planned') && (
                    <Button size="sm" className="flex-1" icon={<Play size={14} />} onClick={() => handleStart(o)}>Iniciar</Button>
                  )}
                  {(o.status === 'in_route') && (
                    <>
                      <Button size="sm" variant="danger" icon={<XCircle size={14} />} onClick={() => { setIncidentOrder(o); setIncidentReason(''); setIncidentNotes(''); }}>No</Button>
                      <Button size="sm" variant="success" icon={<CheckCircle2 size={14} />} onClick={() => handleComplete(o)}>OK</Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="col-span-full">
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
              <Package size={48} strokeWidth={1.5} />
              <p className="text-sm">No tiene entregas asignadas</p>
            </div>
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      {viewOrder && (
        <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Entrega ${viewOrder.code}`} size="lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge color={orderStatusConfig[viewOrder.status].color}>{orderStatusConfig[viewOrder.status].label}</Badge>
              <Badge color={priorityConfig[viewOrder.priority].color}>Prioridad {priorityConfig[viewOrder.priority].label}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-4">
              <InfoRow icon={<User size={14} />} label="Cliente" value={clients.find((c) => c.id === viewOrder.clientId)?.name || '-'} />
              <InfoRow icon={<Phone size={14} />} label="Teléfono" value={viewOrder.phone} />
              <InfoRow icon={<MapPin size={14} />} label="Dirección" value={`${viewOrder.address.street}, ${viewOrder.address.district}`} />
              <InfoRow icon={<Clock size={14} />} label="Ventana" value={`${viewOrder.timeWindowStart} - ${viewOrder.timeWindowEnd}`} />
              <InfoRow icon={<Weight size={14} />} label="Peso/Volumen" value={`${viewOrder.weightKg} kg / ${viewOrder.volumeM3} m³`} />
              <InfoRow icon={<FileText size={14} />} label="Producto" value={viewOrder.productType} />
            </div>
            {viewOrder.address.reference && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-semibold text-amber-700">Referencia</p>
                <p className="text-sm text-amber-800">{viewOrder.address.reference}</p>
              </div>
            )}
            {viewOrder.address.indications && (
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-500">Indicaciones especiales</p>
                <p className="text-sm text-slate-700">{viewOrder.address.indications}</p>
              </div>
            )}
            {viewOrder.observations && (
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-500">Observaciones</p>
                <p className="text-sm text-slate-700">{viewOrder.observations}</p>
              </div>
            )}
            {viewOrder.incidentReason && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-red-700"><AlertTriangle size={14} /> Incidencia: {viewOrder.incidentReason}</p>
                {viewOrder.incidentNotes && <p className="mt-1 text-sm text-red-600">{viewOrder.incidentNotes}</p>}
              </div>
            )}
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              {viewOrder.status === 'planned' && (
                <Button icon={<Play size={16} />} onClick={() => handleStart(viewOrder)}>Iniciar entrega</Button>
              )}
              {viewOrder.status === 'in_route' && (
                <>
                  <Button variant="success" icon={<CheckCircle2 size={16} />} onClick={() => handleComplete(viewOrder)}>Marcar como entregada</Button>
                  <Button variant="danger" icon={<XCircle size={16} />} onClick={() => { setIncidentOrder(viewOrder); setIncidentReason(''); setIncidentNotes(''); }}>No se pudo entregar</Button>
                </>
              )}
              <Button variant="outline" onClick={() => setViewOrder(null)}>Cerrar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Incident Modal */}
      <Modal isOpen={!!incidentOrder} onClose={() => setIncidentOrder(null)} title="Registrar incidencia" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Pedido <strong>{incidentOrder?.code}</strong></p>
          <Select label="Motivo" value={incidentReason} onChange={(e) => setIncidentReason(e.target.value)}>
            <option value="">Seleccionar motivo...</option>
            {incidentReasons.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
          <Textarea label="Observaciones" rows={3} value={incidentNotes} onChange={(e) => setIncidentNotes(e.target.value)} placeholder="Describa lo sucedido..." />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIncidentOrder(null)}>Cancelar</Button>
            <Button variant="danger" onClick={handleIncident}>Registrar incidencia</Button>
          </div>
        </div>
      </Modal>

      <Toast {...toast} />
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-xs text-slate-400">{icon} {label}</p>
      <p className="text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}
