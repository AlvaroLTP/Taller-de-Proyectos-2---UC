import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import type { Vehicle, VehicleStatus, FuelType } from '@/types';
import { PageHeader, SearchBar, FilterSelect, useToast, Toast, ConfirmDialog } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { vehicleStatusConfig, fuelTypeConfig } from '@/utils/formatters';
import { Truck, Plus, Eye, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const emptyForm: Omit<Vehicle, 'id'> = {
  code: '', plate: '', type: '', brand: '', model: '', capacityKg: 0,
  capacityM3: 0, consumptionKmPerL: 0, fuelType: 'diesel', emissionsPerKm: 0,
  status: 'available', available: true,
};

export function VehiclesPage() {
  const { vehicles, drivers, addVehicle, updateVehicle, toggleVehicleAvailability, deleteVehicle } = useApp();
  const { toast, showToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<Omit<Vehicle, 'id'>>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  const vehicleTypes = useMemo(() => [...new Set(vehicles.map((v) => v.type))], [vehicles]);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch = !search ||
        v.code.toLowerCase().includes(search.toLowerCase()) ||
        v.plate.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || v.status === statusFilter;
      const matchType = !typeFilter || v.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [vehicles, search, statusFilter, typeFilter]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditVehicle(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setForm({ ...v });
    setEditVehicle(v);
    setErrors({});
    setModalOpen(true);
    setViewVehicle(null);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = 'El código es obligatorio';
    if (!form.plate.trim()) e.plate = 'La placa es obligatoria';
    if (!form.type.trim()) e.type = 'El tipo es obligatorio';
    if (!form.brand.trim()) e.brand = 'La marca es obligatoria';
    if (!form.model.trim()) e.model = 'El modelo es obligatorio';
    if (form.capacityKg <= 0) e.capacityKg = 'La capacidad debe ser mayor a 0';
    if (form.capacityM3 <= 0) e.capacityM3 = 'La capacidad volumétrica debe ser mayor a 0';
    if (form.consumptionKmPerL < 0) e.consumptionKmPerL = 'El consumo no puede ser negativo';
    if (form.emissionsPerKm < 0) e.emissionsPerKm = 'Las emisiones no pueden ser negativas';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editVehicle) {
        await updateVehicle(editVehicle.id, form);
        showToast('Vehículo actualizado correctamente');
      } else {
        await addVehicle(form);
        showToast('Vehículo registrado correctamente');
      }
      setModalOpen(false);
    } catch {
      showToast('Error al guardar el vehículo', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteVehicle(deleteTarget.id);
    showToast('Vehículo eliminado');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehículos"
        subtitle="Gestión de la flota de distribución"
        actions={
          <Button icon={<Plus size={18} />} onClick={openCreate}>
            Nuevo vehículo
          </Button>
        }
      />

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por código, placa o marca..." />
        <FilterSelect
          label="Estado"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: '', label: 'Todos' },
            ...Object.entries(vehicleStatusConfig).map(([v, c]) => ({ value: v, label: c.label })),
          ]}
        />
        <FilterSelect
          label="Tipo"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: '', label: 'Todos' },
            ...vehicleTypes.map((t) => ({ value: t, label: t })),
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <DataTable
          columns={[
            { key: 'code', label: 'Código', render: (v) => <span className="font-medium text-slate-900">{v.code}</span> },
            { key: 'plate', label: 'Placa' },
            { key: 'type', label: 'Tipo' },
            { key: 'brand', label: 'Marca', render: (v) => `${v.brand} ${v.model}` },
            { key: 'capacityKg', label: 'Capacidad', render: (v) => `${v.capacityKg} kg / ${v.capacityM3} m³` },
            { key: 'fuelType', label: 'Combustible', render: (v) => fuelTypeConfig[v.fuelType].label },
            { key: 'status', label: 'Estado', render: (v) => <Badge color={vehicleStatusConfig[v.status].color}>{vehicleStatusConfig[v.status].label}</Badge> },
            { key: 'available', label: 'Disponible', render: (v) => v.available ? <Badge color="bg-emerald-100 text-emerald-700 border-emerald-200">Sí</Badge> : <Badge color="bg-slate-100 text-slate-500 border-slate-200">No</Badge> },
            {
              key: 'actions', label: '', render: (v) => (
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setViewVehicle(v); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Ver detalle">
                    <Eye size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); openEdit(v); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600" title="Editar">
                    <Edit size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleVehicleAvailability(v.id); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600" title="Cambiar disponibilidad">
                    {v.available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(v); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600" title="Eliminar">
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            },
          ]}
          data={filtered}
          onRowClick={(v) => setViewVehicle(v)}
          emptyMessage="No se encontraron vehículos"
        />
      </div>

      {/* View Modal */}
      {viewVehicle && (
        <Modal isOpen={!!viewVehicle} onClose={() => setViewVehicle(null)} title={`Vehículo ${viewVehicle.code}`} size="lg">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Truck size={32} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{viewVehicle.brand} {viewVehicle.model}</h3>
                <p className="text-sm text-slate-500">{viewVehicle.code} · {viewVehicle.plate}</p>
              </div>
              <div className="ml-auto">
                <Badge color={vehicleStatusConfig[viewVehicle.status].color}>{vehicleStatusConfig[viewVehicle.status].label}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
              <InfoRow label="Tipo" value={viewVehicle.type} />
              <InfoRow label="Capacidad de carga" value={`${viewVehicle.capacityKg} kg`} />
              <InfoRow label="Capacidad volumétrica" value={`${viewVehicle.capacityM3} m³`} />
              <InfoRow label="Consumo" value={viewVehicle.consumptionKmPerL > 0 ? `${viewVehicle.consumptionKmPerL} km/L` : 'N/A (Eléctrico)'} />
              <InfoRow label="Tipo de combustible" value={fuelTypeConfig[viewVehicle.fuelType].label} />
              <InfoRow label="Emisiones por km" value={`${viewVehicle.emissionsPerKm} kg CO₂/km`} />
              <InfoRow label="Disponibilidad" value={viewVehicle.available ? 'Disponible' : 'No disponible'} />
              <InfoRow label="Conductor asignado" value={drivers.find((d) => d.id === viewVehicle.driverId)?.name || 'Sin asignar'} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setViewVehicle(null)}>Cerrar</Button>
              <Button icon={<Edit size={16} />} onClick={() => openEdit(viewVehicle)}>Editar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editVehicle ? 'Editar vehículo' : 'Nuevo vehículo'}
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Código *" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} error={errors.code} placeholder="VAN-004" />
            <Input label="Placa *" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} error={errors.plate} placeholder="ABC-123" />
            <Input label="Tipo *" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} error={errors.type} placeholder="Furgoneta" />
            <Input label="Marca *" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} error={errors.brand} placeholder="Toyota" />
            <Input label="Modelo *" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} error={errors.model} placeholder="Hiace 2024" />
            <Select label="Combustible" value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value as FuelType })}>
              {Object.entries(fuelTypeConfig).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
            </Select>
            <Input label="Capacidad de carga (kg) *" type="number" value={form.capacityKg || ''} onChange={(e) => setForm({ ...form, capacityKg: +e.target.value })} error={errors.capacityKg} />
            <Input label="Capacidad volumétrica (m³) *" type="number" value={form.capacityM3 || ''} onChange={(e) => setForm({ ...form, capacityM3: +e.target.value })} error={errors.capacityM3} />
            <Input label="Consumo (km/L)" type="number" value={form.consumptionKmPerL || ''} onChange={(e) => setForm({ ...form, consumptionKmPerL: +e.target.value })} error={errors.consumptionKmPerL} />
            <Input label="Emisiones (kg CO₂/km)" type="number" step="0.001" value={form.emissionsPerKm || ''} onChange={(e) => setForm({ ...form, emissionsPerKm: +e.target.value })} error={errors.emissionsPerKm} />
            <Select label="Estado" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as VehicleStatus })}>
              {Object.entries(vehicleStatusConfig).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="available" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
            <label htmlFor="available" className="text-sm text-slate-700">Disponible para asignación</label>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>{editVehicle ? 'Guardar cambios' : 'Registrar vehículo'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar vehículo"
        message={`¿Está seguro de eliminar el vehículo ${deleteTarget?.code}? Esta acción no se puede deshacer.`}
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
