import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import type { Driver, DriverStatus } from '@/types';
import { PageHeader, SearchBar, FilterSelect, useToast, Toast, ConfirmDialog } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Input, Select } from '@/components/ui/Form';
import { driverStatusConfig } from '@/utils/formatters';
import { Users, Plus, Eye, Edit, Truck, ToggleLeft, ToggleRight, Phone, Trash2 } from 'lucide-react';

const emptyForm: Omit<Driver, 'id'> = {
  name: '', dni: '', phone: '', license: '', licenseType: 'B-II',
  status: 'available', available: true, shiftStart: '08:00', shiftEnd: '16:00',
  avatarInitials: '',
};

export function DriversPage() {
  const { drivers, vehicles, addDriver, updateDriver, toggleDriverAvailability, assignVehicleToDriver, deleteDriver } = useApp();
  const { toast, showToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewDriver, setViewDriver] = useState<Driver | null>(null);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [form, setForm] = useState<Omit<Driver, 'id'>>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [assignModalDriver, setAssignModalDriver] = useState<Driver | null>(null);
  const [assignVehicleId, setAssignVehicleId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Driver | null>(null);

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      const matchSearch = !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.dni.includes(search) ||
        d.license.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [drivers, search, statusFilter]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditDriver(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (d: Driver) => {
    setForm({ ...d });
    setEditDriver(d);
    setErrors({});
    setModalOpen(true);
    setViewDriver(null);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'El nombre es obligatorio';
    if (!form.dni.trim()) e.dni = 'El DNI es obligatorio';
    if (form.dni && form.dni.length !== 8) e.dni = 'El DNI debe tener 8 dígitos';
    if (!form.phone.trim()) e.phone = 'El teléfono es obligatorio';
    if (!form.license.trim()) e.license = 'La licencia es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const initials = form.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    const data = { ...form, avatarInitials: initials || 'XX' };
    try {
      if (editDriver) {
        await updateDriver(editDriver.id, data);
        showToast('Conductor actualizado correctamente');
      } else {
        await addDriver(data);
        showToast('Conductor registrado correctamente');
      }
      setModalOpen(false);
    } catch {
      showToast('Error al guardar el conductor', 'error');
    }
  };

  const handleAssign = async () => {
    if (!assignModalDriver || !assignVehicleId) return;
    await assignVehicleToDriver(assignModalDriver.id, assignVehicleId);
    showToast('Vehículo asignado correctamente');
    setAssignModalDriver(null);
    setAssignVehicleId('');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDriver(deleteTarget.id);
      showToast('Conductor eliminado');
    } catch {
      showToast('Error al eliminar el conductor', 'error');
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conductores"
        subtitle="Gestión del personal de conducción"
        actions={<Button icon={<Plus size={18} />} onClick={openCreate}>Nuevo conductor</Button>}
      />

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre, DNI o licencia..." />
        <FilterSelect
          label="Estado"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: '', label: 'Todos' },
            ...Object.entries(driverStatusConfig).map(([v, c]) => ({ value: v, label: c.label })),
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <DataTable
          columns={[
            { key: 'name', label: 'Nombre', render: (d) => (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white">
                  {d.avatarInitials}
                </div>
                <span className="font-medium text-slate-900">{d.name}</span>
              </div>
            ) },
            { key: 'dni', label: 'DNI' },
            { key: 'phone', label: 'Teléfono' },
            { key: 'licenseType', label: 'Licencia', render: (d) => `${d.licenseType} · ${d.license}` },
            { key: 'vehicleId', label: 'Vehículo', render: (d) => vehicles.find((v) => v.id === d.vehicleId)?.code || 'Sin asignar' },
            { key: 'shift', label: 'Horario', render: (d) => `${d.shiftStart} - ${d.shiftEnd}` },
            { key: 'status', label: 'Estado', render: (d) => <Badge color={driverStatusConfig[d.status].color}>{driverStatusConfig[d.status].label}</Badge> },
            { key: 'actions', label: '', render: (d) => (
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); setViewDriver(d); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Ver">
                  <Eye size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); openEdit(d); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600" title="Editar">
                  <Edit size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleDriverAvailability(d.id); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600" title="Disponibilidad">
                  {d.available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setAssignModalDriver(d); setAssignVehicleId(d.vehicleId || ''); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600" title="Asignar vehículo">
                  <Truck size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(d); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600" title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </div>
            ) },
          ]}
          data={filtered}
          onRowClick={(d) => setViewDriver(d)}
          emptyMessage="No se encontraron conductores"
        />
      </div>

      {/* View Modal */}
      {viewDriver && (
        <Modal isOpen={!!viewDriver} onClose={() => setViewDriver(null)} title={viewDriver.name} size="lg">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xl font-bold text-white">
                {viewDriver.avatarInitials}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{viewDriver.name}</h3>
                <p className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Phone size={14} /> {viewDriver.phone}
                </p>
              </div>
              <div className="ml-auto">
                <Badge color={driverStatusConfig[viewDriver.status].color}>{driverStatusConfig[viewDriver.status].label}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
              <InfoRow label="DNI" value={viewDriver.dni} />
              <InfoRow label="Licencia" value={`${viewDriver.licenseType} · ${viewDriver.license}`} />
              <InfoRow label="Teléfono" value={viewDriver.phone} />
              <InfoRow label="Horario" value={`${viewDriver.shiftStart} - ${viewDriver.shiftEnd}`} />
              <InfoRow label="Vehículo asignado" value={vehicles.find((v) => v.id === viewDriver.vehicleId)?.code || 'Sin asignar'} />
              <InfoRow label="Disponibilidad" value={viewDriver.available ? 'Disponible' : 'No disponible'} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setViewDriver(null)}>Cerrar</Button>
              <Button icon={<Edit size={16} />} onClick={() => openEdit(viewDriver)}>Editar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editDriver ? 'Editar conductor' : 'Nuevo conductor'} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre completo *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder="Carlos Mendoza" />
            <Input label="DNI *" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} error={errors.dni} placeholder="45123456" maxLength={8} />
            <Input label="Teléfono *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} placeholder="987654321" />
            <Input label="Licencia *" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} error={errors.license} placeholder="B-II-12345" />
            <Select label="Tipo de licencia" value={form.licenseType} onChange={(e) => setForm({ ...form, licenseType: e.target.value })}>
              <option value="A-I">A-I</option>
              <option value="A-II-B">A-II-B</option>
              <option value="A-III-A">A-III-A</option>
              <option value="B-I">B-I</option>
              <option value="B-II">B-II</option>
            </Select>
            <Select label="Estado" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as DriverStatus })}>
              {Object.entries(driverStatusConfig).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
            </Select>
            <Input label="Hora de inicio" type="time" value={form.shiftStart} onChange={(e) => setForm({ ...form, shiftStart: e.target.value })} />
            <Input label="Hora de fin" type="time" value={form.shiftEnd} onChange={(e) => setForm({ ...form, shiftEnd: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="driver-available" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="driver-available" className="text-sm text-slate-700">Disponible para asignación</label>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>{editDriver ? 'Guardar cambios' : 'Registrar conductor'}</Button>
          </div>
        </div>
      </Modal>

      {/* Assign Vehicle Modal */}
      <Modal isOpen={!!assignModalDriver} onClose={() => setAssignModalDriver(null)} title="Asignar vehículo" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Seleccione un vehículo para <strong>{assignModalDriver?.name}</strong></p>
          <Select label="Vehículo" value={assignVehicleId} onChange={(e) => setAssignVehicleId(e.target.value)}>
            <option value="">Sin asignar</option>
            {vehicles.filter((v) => v.available || v.id === assignModalDriver?.vehicleId).map((v) => (
              <option key={v.id} value={v.id}>{v.code} - {v.plate} ({v.brand} {v.model})</option>
            ))}
          </Select>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setAssignModalDriver(null)}>Cancelar</Button>
            <Button onClick={handleAssign}>Asignar</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar conductor"
        message={`¿Está seguro de eliminar el conductor ${deleteTarget?.name}? Esta acción no se puede deshacer.`}
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
