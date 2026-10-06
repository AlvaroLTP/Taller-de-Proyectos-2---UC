import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import type { Order, OrderStatus, DeliveryPreferences } from '@/types';
import { PageHeader, SearchBar, FilterSelect, useToast, Toast, ConfirmDialog } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { orderStatusConfig, priorityConfig } from '@/utils/formatters';
import { Package, Plus, Eye, Edit, Trash2, Clock, MapPin, AlertCircle } from 'lucide-react';

const productTypes = ['Abarrotes', 'Medicinas', 'Ferretería', 'Vestido', 'Electrodomésticos', 'Panadería', 'Limpieza', 'Cosméticos', 'Muebles', 'Electrónica'];

const emptyPrefs: DeliveryPreferences = {
  preferredTime: '09:00', timeWindowStart: '09:00', timeWindowEnd: '12:00',
  priority: 'medium', restrictions: [], accessType: 'Fácil',
  requiresSpecialAttention: false, noLunchHours: false,
  requiresPhoneCoordination: false, observations: '',
};

const emptyForm: Omit<Order, 'id'> = {
  code: '', clientId: '', phone: '', address: {
    street: '', reference: '', district: '', neighborhood: '', lat: 0, lng: 0, indications: '', accessType: 'Fácil',
  },
  deliveryDate: new Date().toISOString().slice(0, 10),
  timeWindowStart: '09:00', timeWindowEnd: '12:00', priority: 'medium',
  weightKg: 0, volumeM3: 0, productType: 'Abarrotes', observations: '',
  status: 'pending', preferences: { ...emptyPrefs },
};

export function OrdersPage() {
  const { orders, clients, routes, addOrder, updateOrder, updateOrderStatus, deleteOrder } = useApp();
  const { toast, showToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [form, setForm] = useState<Omit<Order, 'id'>>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [statusChangeTarget, setStatusChangeTarget] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const client = clients.find((c) => c.id === o.clientId);
      const matchSearch = !search ||
        o.code.toLowerCase().includes(search.toLowerCase()) ||
        (client?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchStatus = !statusFilter || o.status === statusFilter;
      const matchPriority = !priorityFilter || o.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [orders, clients, search, statusFilter, priorityFilter]);

  const openCreate = () => {
    const nextCode = `PED-${String(orders.length + 1).padStart(4, '0')}`;
    setForm({ ...emptyForm, code: nextCode });
    setEditOrder(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (o: Order) => {
    setForm({ ...o, address: { ...o.address }, preferences: { ...o.preferences } });
    setEditOrder(o);
    setErrors({});
    setModalOpen(true);
    setViewOrder(null);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = 'El código es obligatorio';
    if (!form.clientId) e.clientId = 'Seleccione un cliente';
    if (!form.deliveryDate) e.deliveryDate = 'La fecha es obligatoria';
    if (form.weightKg < 0) e.weightKg = 'El peso no puede ser negativo';
    if (form.volumeM3 < 0) e.volumeM3 = 'El volumen no puede ser negativo';
    if (form.timeWindowStart >= form.timeWindowEnd) e.timeWindow = 'La hora de inicio debe ser menor a la hora de fin';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const client = clients.find((c) => c.id === form.clientId);
    const data = {
      ...form,
      phone: client?.phone || form.phone,
      address: client?.address || form.address,
    };
    try {
      if (editOrder) {
        await updateOrder(editOrder.id, data);
        showToast('Pedido actualizado correctamente');
      } else {
        await addOrder(data);
        showToast('Pedido registrado correctamente');
      }
      setModalOpen(false);
    } catch {
      showToast('Error al guardar el pedido', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteOrder(deleteTarget.id);
    showToast('Pedido eliminado');
    setDeleteTarget(null);
  };

  const handleStatusChange = async () => {
    if (!statusChangeTarget) return;
    await updateOrderStatus(statusChangeTarget.id, newStatus);
    showToast('Estado actualizado');
    setStatusChangeTarget(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pedidos"
        subtitle="Gestión de pedidos de entrega"
        actions={<Button icon={<Plus size={18} />} onClick={openCreate}>Nuevo pedido</Button>}
      />

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
        <FilterSelect
          label="Prioridad"
          value={priorityFilter}
          onChange={setPriorityFilter}
          options={[
            { value: '', label: 'Todas' },
            ...Object.entries(priorityConfig).map(([v, c]) => ({ value: v, label: c.label })),
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <DataTable
          columns={[
            { key: 'code', label: 'Código', render: (o) => <span className="font-medium text-slate-900">{o.code}</span> },
            { key: 'client', label: 'Cliente', render: (o) => clients.find((c) => c.id === o.clientId)?.name || '-' },
            { key: 'district', label: 'Distrito', render: (o) => o.address.district },
            { key: 'date', label: 'Fecha', render: (o) => o.deliveryDate },
            { key: 'window', label: 'Ventana', render: (o) => (
              <span className="flex items-center gap-1 text-slate-600">
                <Clock size={13} className="text-slate-400" /> {o.timeWindowStart}-{o.timeWindowEnd}
              </span>
            ) },
            { key: 'priority', label: 'Prioridad', render: (o) => <Badge color={priorityConfig[o.priority].color}>{priorityConfig[o.priority].label}</Badge> },
            { key: 'weight', label: 'Peso/Vol', render: (o) => `${o.weightKg}kg / ${o.volumeM3}m³` },
            { key: 'status', label: 'Estado', render: (o) => <Badge color={orderStatusConfig[o.status].color}>{orderStatusConfig[o.status].label}</Badge> },
            { key: 'actions', label: '', render: (o) => (
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); setViewOrder(o); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Ver">
                  <Eye size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); openEdit(o); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600" title="Editar">
                  <Edit size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setNewStatus(o.status); setStatusChangeTarget(o); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600" title="Cambiar estado">
                  <AlertCircle size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(o); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600" title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </div>
            ) },
          ]}
          data={filtered}
          onRowClick={(o) => setViewOrder(o)}
          emptyMessage="No se encontraron pedidos"
        />
      </div>

      {/* View Modal */}
      {viewOrder && (
        <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Pedido ${viewOrder.code}`} size="lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{clients.find((c) => c.id === viewOrder.clientId)?.name}</h3>
                <p className="text-sm text-slate-500">{viewOrder.phone}</p>
              </div>
              <div className="flex gap-2">
                <Badge color={priorityConfig[viewOrder.priority].color}>Prioridad {priorityConfig[viewOrder.priority].label}</Badge>
                <Badge color={orderStatusConfig[viewOrder.status].color}>{orderStatusConfig[viewOrder.status].label}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
              <InfoRow label="Fecha de entrega" value={viewOrder.deliveryDate} />
              <InfoRow label="Ventana horaria" value={`${viewOrder.timeWindowStart} - ${viewOrder.timeWindowEnd}`} />
              <InfoRow label="Distrito" value={viewOrder.address.district} />
              <InfoRow label="Dirección" value={viewOrder.address.street} />
              <InfoRow label="Referencia" value={viewOrder.address.reference} />
              <InfoRow label="Tipo de acceso" value={viewOrder.address.accessType} />
              <InfoRow label="Peso" value={`${viewOrder.weightKg} kg`} />
              <InfoRow label="Volumen" value={`${viewOrder.volumeM3} m³`} />
              <InfoRow label="Tipo de producto" value={viewOrder.productType} />
              <InfoRow label="Coordenadas (simuladas)" value={`${viewOrder.address.lat}, ${viewOrder.address.lng}`} />
              {viewOrder.routeId && <InfoRow label="Ruta asignada" value={routes.find((r) => r.id === viewOrder.routeId)?.code || '-'} />}
              {viewOrder.deliveryOrder != null && <InfoRow label="Orden de entrega" value={`#${viewOrder.deliveryOrder}`} />}
            </div>
            {viewOrder.observations && (
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-400">Observaciones</p>
                <p className="text-sm text-slate-700">{viewOrder.observations}</p>
              </div>
            )}
            {(viewOrder.preferences.restrictions.length > 0 || viewOrder.preferences.requiresSpecialAttention || viewOrder.preferences.noLunchHours) && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="mb-2 text-xs font-semibold text-amber-700">Restricciones y preferencias</p>
                <div className="flex flex-wrap gap-2">
                  {viewOrder.preferences.restrictions.map((r, i) => (
                    <Badge key={i} color="bg-amber-100 text-amber-700 border-amber-200">{r}</Badge>
                  ))}
                  {viewOrder.preferences.requiresSpecialAttention && <Badge color="bg-red-100 text-red-700 border-red-200">Atención especial</Badge>}
                  {viewOrder.preferences.noLunchHours && <Badge color="bg-amber-100 text-amber-700 border-amber-200">No entregar en almuerzo</Badge>}
                  {viewOrder.preferences.requiresPhoneCoordination && <Badge color="bg-sky-100 text-sky-700 border-sky-200">Coordinación telefónica</Badge>}
                </div>
              </div>
            )}
            {viewOrder.incidentReason && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-xs font-semibold text-red-700">Incidencia: {viewOrder.incidentReason}</p>
                {viewOrder.incidentNotes && <p className="mt-1 text-sm text-red-600">{viewOrder.incidentNotes}</p>}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setViewOrder(null)}>Cerrar</Button>
              <Button icon={<Edit size={16} />} onClick={() => openEdit(viewOrder)}>Editar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editOrder ? 'Editar pedido' : 'Nuevo pedido'} size="xl">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Código *" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} error={errors.code} />
            <Select label="Cliente *" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} error={errors.clientId}>
              <option value="">Seleccionar cliente...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Input label="Fecha de entrega *" type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} error={errors.deliveryDate} />
            <Select label="Prioridad" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Order['priority'] })}>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </Select>
            <Input label="Hora inicio *" type="time" value={form.timeWindowStart} onChange={(e) => setForm({ ...form, timeWindowStart: e.target.value })} />
            <Input label="Hora fin *" type="time" value={form.timeWindowEnd} onChange={(e) => setForm({ ...form, timeWindowEnd: e.target.value })} />
            {errors.timeWindow && <p className="col-span-2 text-xs text-red-500">{errors.timeWindow}</p>}
            <Input label="Peso (kg)" type="number" step="0.1" value={form.weightKg || ''} onChange={(e) => setForm({ ...form, weightKg: +e.target.value })} error={errors.weightKg} />
            <Input label="Volumen (m³)" type="number" step="0.01" value={form.volumeM3 || ''} onChange={(e) => setForm({ ...form, volumeM3: +e.target.value })} error={errors.volumeM3} />
            <Select label="Tipo de producto" value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value })}>
              {productTypes.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
            <Select label="Estado" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as OrderStatus })}>
              {Object.entries(orderStatusConfig).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
            </Select>
          </div>
          <Textarea label="Observaciones" rows={2} value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} />

          {/* Preferences */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-700">Preferencias y restricciones</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Horario preferido" type="time" value={form.preferences.preferredTime} onChange={(e) => setForm({ ...form, preferences: { ...form.preferences, preferredTime: e.target.value } })} />
              <Select label="Tipo de acceso" value={form.preferences.accessType} onChange={(e) => setForm({ ...form, preferences: { ...form.preferences, accessType: e.target.value } })}>
                {['Fácil', 'Moderado', 'Difícil', 'Restringido', 'Con permiso'].map((a) => <option key={a} value={a}>{a}</option>)}
              </Select>
            </div>
            <div className="mt-3 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.preferences.requiresSpecialAttention} onChange={(e) => setForm({ ...form, preferences: { ...form.preferences, requiresSpecialAttention: e.target.checked } })} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                Requiere atención especial
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.preferences.noLunchHours} onChange={(e) => setForm({ ...form, preferences: { ...form.preferences, noLunchHours: e.target.checked } })} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                No entregar en horario de almuerzo
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.preferences.requiresPhoneCoordination} onChange={(e) => setForm({ ...form, preferences: { ...form.preferences, requiresPhoneCoordination: e.target.checked } })} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                Coordinación telefónica
              </label>
            </div>
            <Textarea className="mt-3" label="Observaciones de preferencias" rows={2} value={form.preferences.observations} onChange={(e) => setForm({ ...form, preferences: { ...form.preferences, observations: e.target.value } })} />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>{editOrder ? 'Guardar cambios' : 'Registrar pedido'}</Button>
          </div>
        </div>
      </Modal>

      {/* Status change modal */}
      <Modal isOpen={!!statusChangeTarget} onClose={() => setStatusChangeTarget(null)} title="Cambiar estado del pedido" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Pedido <strong>{statusChangeTarget?.code}</strong></p>
          <Select label="Nuevo estado" value={newStatus} onChange={(e) => setNewStatus(e.target.value as OrderStatus)}>
            {Object.entries(orderStatusConfig).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
          </Select>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStatusChangeTarget(null)}>Cancelar</Button>
            <Button onClick={handleStatusChange}>Confirmar</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar pedido"
        message={`¿Está seguro de eliminar el pedido ${deleteTarget?.code}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Toast {...toast} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}
