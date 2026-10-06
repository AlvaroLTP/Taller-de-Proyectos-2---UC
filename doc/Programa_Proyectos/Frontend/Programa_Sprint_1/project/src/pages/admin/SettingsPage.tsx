import { useApp } from '@/store/AppContext';
import { PageHeader, useToast, Toast } from '@/components/ui';
import { Card, CardHeader } from '@/components/ui/Charts';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Form';
import { Save, Building, Bell, Map } from 'lucide-react';
import { useState } from 'react';

export function SettingsPage() {
  const { currentUser } = useApp();
  const { toast, showToast } = useToast();
  const [companyName, setCompanyName] = useState('DistriRápido S.A.C.');
  const [companyRuc, setCompanyRuc] = useState('20512345678');
  const [companyPhone, setCompanyPhone] = useState('+51 1 234-5678');
  const [companyEmail, setCompanyEmail] = useState('contacto@distrirapido.pe');

  const handleSave = () => {
    showToast('Configuración guardada correctamente');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Configuración" subtitle="Ajustes generales del sistema" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Información de la empresa" subtitle="Datos generales" />
          <div className="space-y-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Building size={24} />
              </div>
              <div>
                <p className="font-medium text-slate-900">{companyName}</p>
                <p className="text-xs text-slate-400">RUC: {companyRuc}</p>
              </div>
            </div>
            <Input label="Nombre de la empresa" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <Input label="RUC" value={companyRuc} onChange={(e) => setCompanyRuc(e.target.value)} />
            <Input label="Teléfono" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
            <Input label="Email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
            <Button icon={<Save size={16} />} onClick={handleSave}>Guardar cambios</Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Notificaciones" subtitle="Preferencias de alertas" />
            <div className="space-y-3 p-5">
              {[
                { label: 'Vehículo no disponible', desc: 'Alertar cuando un vehículo cambia a no disponible' },
                { label: 'Conductor sin disponibilidad', desc: 'Alertar cuando un conductor no está disponible' },
                { label: 'Pedido prioritario', desc: 'Notificar nuevos pedidos prioritarios' },
                { label: 'Entrega fuera de horario', desc: 'Alertar entregas fuera de ventana horaria' },
                { label: 'Ruta con incidencia', desc: 'Notificar incidencias en rutas activas' },
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked={i < 3} className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                </label>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Integraciones futuras" subtitle="Preparado para las siguientes etapas" />
            <div className="space-y-3 p-5">
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                <Map size={20} className="text-slate-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Mapas reales</p>
                  <p className="text-xs text-slate-400">Integración con servicios de mapas</p>
                </div>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Pendiente</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                <Bell size={20} className="text-slate-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Backend FastAPI</p>
                  <p className="text-xs text-slate-400">API real y motor de optimización</p>
                </div>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Pendiente</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Toast {...toast} />
    </div>
  );
}
