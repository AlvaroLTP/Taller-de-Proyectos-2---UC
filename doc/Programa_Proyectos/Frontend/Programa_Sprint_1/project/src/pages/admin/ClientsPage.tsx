import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import type { Client, Address } from '@/types';
import { PageHeader, SearchBar, FilterSelect, useToast, Toast, ConfirmDialog } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { priorityConfig } from '@/utils/formatters';
import { UserPlus, Eye, Edit, Trash2, Phone, MapPin } from 'lucide-react';

const limaDistricts = [
  'San Juan de Lurigancho', 'El Agustino', 'Santa Anita', 'Ate', 'Cercado de Lima',
  'Rímac', 'La Victoria', 'San Luis', 'Chaclacayo', 'Lurigancho',
];

const accessTypes = ['Fácil', 'Moderado', 'Difícil', 'Restringido', 'Con permiso'];

const emptyAddress: Address = {
  street: '', reference: '', district: 'San Juan de Lurigancho',
  neighborhood: '', lat: -12.0039, lng: -77.0219, indications: '', accessType: 'Fácil',
};

const emptyForm: Omit<Client, 'id'> = {
  name: '', phone: '', email: '', address: { ...emptyAddress },
  priority: 'medium', notes: '',
};

export function ClientsPage() {
  const { clients, orders, addClient, updateClient, deleteClient } = useApp();
  const { toast, showToast } = useToast();
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [form, setForm] = useState<Omit<Client, 'id'>>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search);
      const matchDistrict = !districtFilter || c.address.district === districtFilter;
      return matchSearch && matchDistrict;
    });
  }, [clients, search, districtFilter]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditClient(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (c: Client) => {
    setForm({ ...c, address: { ...c.address } });
    setEditClient(c);
    setErrors({});
    setModalOpen(true);
    setViewClient(null);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'El nombre es obligatorio';
    if (!form.phone.trim()) e.phone = 'El teléfono es obligatorio';
    if (!form.address.street.trim()) e.street = 'La dirección es obligatoria';
    if (!form.address.district) e.district = 'El distrito es obligatorio';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editClient) {
        await updateClient(editClient.id, form);
        showToast('Cliente actualizado correctamente');
      } else {
        await addClient(form);
        showToast('Cliente registrado correctamente');
      }
      setModalOpen(false);
    } catch {
      showToast('Error al guardar el cliente', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteClient(deleteTarget.id);
    showToast('Cliente eliminado');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        subtitle="Gestión de clientes y direcciones de entrega"
        actions={<Button icon={<UserPlus size={18} />} onClick={openCreate}>Nuevo cliente</Button>}
      />

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre o teléfono..." />
        <FilterSelect
          label="Distrito"
          value={districtFilter}
          onChange={setDistrictFilter}
          options={[
            { value: '', label: 'Todos' },
            ...limaDistricts.map((d) => ({ value: d, label: d })),
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <DataTable
          columns={[
            { key: 'name', label: 'Cliente', render: (c) => <span className="font-medium text-slate-900">{c.name}</span> },
            { key: 'phone', label: 'Teléfono', render: (c) => (
              <span className="flex items-center gap-1.5 text-slate-600">
                <Phone size={13} className="text-slate-400" /> {c.phone}
              </span>
            ) },
            { key: 'district', label: 'Distrito', render: (c) => c.address.district },
            { key: 'address', label: 'Dirección', render: (c) => (
              <span className="flex items-center gap-1.5 text-slate-600">
                <MapPin size={13} className="text-slate-400" />
                <span className="max-w-xs truncate">{c.address.street}</span>
              </span>
            ) },
            { key: 'priority', label: 'Prioridad', render: (c) => <Badge color={priorityConfig[c.priority].color}>{priorityConfig[c.priority].label}</Badge> },
            { key: 'orders', label: 'Pedidos', render: (c) => orders.filter((o) => o.clientId === c.id).length },
            { key: 'actions', label: '', render: (c) => (
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); setViewClient(c); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Ver">
                  <Eye size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); openEdit(c); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600" title="Editar">
                  <Edit size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(c); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600" title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </div>
            ) },
          ]}
          data={filtered}
          onRowClick={(c) => setViewClient(c)}
          emptyMessage="No se encontraron clientes"
        />
      </div>

      {/* View Modal */}
      {viewClient && (
        <Modal isOpen={!!viewClient} onClose={() => setViewClient(null)} title={viewClient.name} size="lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-sm text-slate-600"><Phone size={14} /> {viewClient.phone}</p>
                <p className="text-sm text-slate-500">{viewClient.email}</p>
              </div>
              <Badge color={priorityConfig[viewClient.priority].color}>Prioridad {priorityConfig[viewClient.priority].label}</Badge>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <h4 className="mb-3 text-sm font-semibold text-slate-700">Dirección de entrega</h4>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Dirección" value={viewClient.address.street} />
                <InfoRow label="Distrito" value={viewClient.address.district} />
                <InfoRow label="Urbanización" value={viewClient.address.neighborhood} />
                <InfoRow label="Tipo de acceso" value={viewClient.address.accessType} />
                <InfoRow label="Referencia" value={viewClient.address.reference} />
                <InfoRow label="Indicaciones" value={viewClient.address.indications} />
                <InfoRow label="Coordenadas (simuladas)" value={`${viewClient.address.lat}, ${viewClient.address.lng}`} />
              </div>
            </div>
            {viewClient.notes && (
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-400">Notas</p>
                <p className="text-sm text-slate-700">{viewClient.notes}</p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setViewClient(null)}>Cerrar</Button>
              <Button icon={<Edit size={16} />} onClick={() => openEdit(viewClient)}>Editar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editClient ? 'Editar cliente' : 'Nuevo cliente'} size="xl">
        <div className="space-y-5">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-700">Datos del cliente</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombre / Razón social *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
              <Input label="Teléfono *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
              <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Select label="Prioridad" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Client['priority'] })}>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </Select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-700">Dirección de entrega</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input label="Dirección *" value={form.address.street} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} error={errors.street} placeholder="Jr. Los Olivos 245" />
              </div>
              <Select label="Distrito" value={form.address.district} onChange={(e) => setForm({ ...form, address: { ...form.address, district: e.target.value } })} error={errors.district}>
                {limaDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
              <Input label="Urbanización" value={form.address.neighborhood} onChange={(e) => setForm({ ...form, address: { ...form.address, neighborhood: e.target.value } })} />
              <Input label="Referencia" value={form.address.reference} onChange={(e) => setForm({ ...form, address: { ...form.address, reference: e.target.value } })} placeholder="Frente al parque, portón azul" />
              <Select label="Tipo de acceso" value={form.address.accessType} onChange={(e) => setForm({ ...form, address: { ...form.address, accessType: e.target.value } })}>
                {accessTypes.map((a) => <option key={a} value={a}>{a}</option>)}
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Latitud (simulada)" type="number" step="0.0001" value={form.address.lat} onChange={(e) => setForm({ ...form, address: { ...form.address, lat: +e.target.value } })} />
                <Input label="Longitud (simulada)" type="number" step="0.0001" value={form.address.lng} onChange={(e) => setForm({ ...form, address: { ...form.address, lng: +e.target.value } })} />
              </div>
              <Textarea label="Indicaciones especiales" rows={2} value={form.address.indications} onChange={(e) => setForm({ ...form, address: { ...form.address, indications: e.target.value } })} />
            </div>
          </div>

          <Textarea label="Notas del cliente" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>{editClient ? 'Guardar cambios' : 'Registrar cliente'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar cliente"
        message={`¿Está seguro de eliminar el cliente ${deleteTarget?.name}?`}
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
