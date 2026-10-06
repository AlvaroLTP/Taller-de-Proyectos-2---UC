import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader, SearchBar, FilterSelect } from '@/components/ui';
import { Card } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { orderStatusConfig, formatDateTime } from '@/utils/formatters';

export function DriverHistoryPage() {
  const { currentUser, orders, clients, routes } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  return (
    <div className="space-y-6">
      <PageHeader title="Historial" subtitle="Consultar entregas anteriores" />

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
      </div>

      <Card className="overflow-hidden">
        <DataTable
          columns={[
            { key: 'code', label: 'Pedido', render: (o) => <span className="font-medium text-slate-900">{o.code}</span> },
            { key: 'client', label: 'Cliente', render: (o) => clients.find((c) => c.id === o.clientId)?.name || '-' },
            { key: 'route', label: 'Ruta', render: (o) => routes.find((r) => r.id === o.routeId)?.code || '-' },
            { key: 'date', label: 'Fecha', render: (o) => o.deliveryDate },
            { key: 'deliveredAt', label: 'Hora', render: (o) => o.deliveredAt ? formatDateTime(o.deliveredAt) : '-' },
            { key: 'status', label: 'Estado', render: (o) => <Badge color={orderStatusConfig[o.status].color}>{orderStatusConfig[o.status].label}</Badge> },
            { key: 'incident', label: 'Incidencia', render: (o) => o.incidentReason ? <span className="text-xs text-red-600">{o.incidentReason}</span> : '-' },
          ]}
          data={filtered}
          emptyMessage="No hay entregas en el historial"
        />
      </Card>
    </div>
  );
}
