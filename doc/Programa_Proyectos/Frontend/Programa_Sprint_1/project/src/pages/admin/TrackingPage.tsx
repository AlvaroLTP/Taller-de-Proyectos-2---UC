import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader, SearchBar, FilterSelect } from '@/components/ui';
import { Card } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { orderStatusConfig, formatDateTime } from '@/utils/formatters';

export function TrackingPage() {
  const { orders, clients, drivers, routes } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [driverFilter, setDriverFilter] = useState('');

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const client = clients.find((c) => c.id === o.clientId);
      const matchSearch = !search ||
        o.code.toLowerCase().includes(search.toLowerCase()) ||
        (client?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchStatus = !statusFilter || o.status === statusFilter;
      const matchDriver = !driverFilter || o.driverId === driverFilter;
      return matchSearch && matchStatus && matchDriver;
    });
  }, [orders, clients, search, statusFilter, driverFilter]);

  return (
    <div className="space-y-6">
      <PageHeader title="Seguimiento" subtitle="Historial y seguimiento de entregas" />

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por pedido o cliente..." />
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
          label="Conductor"
          value={driverFilter}
          onChange={setDriverFilter}
          options={[
            { value: '', label: 'Todos' },
            ...drivers.map((d) => ({ value: d.id, label: d.name })),
          ]}
        />
      </div>

      <Card className="overflow-hidden">
        <DataTable
          columns={[
            { key: 'code', label: 'Pedido', render: (o) => <span className="font-medium text-slate-900">{o.code}</span> },
            { key: 'client', label: 'Cliente', render: (o) => clients.find((c) => c.id === o.clientId)?.name || '-' },
            { key: 'driver', label: 'Conductor', render: (o) => drivers.find((d) => d.id === o.driverId)?.name || '-' },
            { key: 'route', label: 'Ruta', render: (o) => routes.find((r) => r.id === o.routeId)?.code || '-' },
            { key: 'date', label: 'Fecha', render: (o) => o.deliveryDate },
            { key: 'deliveredAt', label: 'Hora', render: (o) => o.deliveredAt ? formatDateTime(o.deliveredAt) : '-' },
            { key: 'status', label: 'Estado', render: (o) => <Badge color={orderStatusConfig[o.status].color}>{orderStatusConfig[o.status].label}</Badge> },
            { key: 'incident', label: 'Incidencia', render: (o) => o.incidentReason ? <span className="text-xs text-red-600">{o.incidentReason}</span> : '-' },
          ]}
          data={filtered}
          emptyMessage="No se encontraron entregas"
        />
      </Card>
    </div>
  );
}
