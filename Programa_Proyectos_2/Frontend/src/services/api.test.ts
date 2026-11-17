import { beforeEach, expect, it, vi } from 'vitest';
const request = vi.hoisted(() => vi.fn());
vi.mock('./http', () => ({ apiRequest: request }));
import { orderService, routeService, vehicleService, sustainabilityService } from './api';
beforeEach(() => { request.mockReset(); });

it('does not clear assignments when updating availability', async () => {
  request.mockResolvedValue({ id: 'v', capacity_kg: 100, capacity_m3: 10, consumption_km_per_l: 10, emissions_per_km: 0.1 });
  await vehicleService.update('v', { available: false });
  const payload = request.mock.calls[0][2];
  expect(JSON.parse(JSON.stringify(payload))).toEqual({ available: false });
});
it('routes planning through the API and displays constraint errors', async () => {
  request.mockResolvedValue({ valid: false, errors: ['Capacidad insuficiente'], routes: [] });
  await expect(routeService.generatePlan('2026-10-26', ['o'], ['d'], ['v'])).rejects.toThrow('Capacidad insuficiente');
  expect(request).toHaveBeenCalledWith('/routes/generate', 'POST', { date: '2026-10-26', order_ids: ['o'], driver_ids: ['d'], vehicle_ids: ['v'] });
});
it('does not send client supplied assignments to the delivery endpoint', async () => {
  request.mockResolvedValue({ id: 'o', restrictions: [] });
  await orderService.updateStatus('o', 'not_delivered', { driverId: 'other', routeId: 'other', incidentReason: 'Ausente' });
  expect(JSON.parse(JSON.stringify(request.mock.calls[0][2]))).toEqual({ status: 'not_delivered', incident_reason: 'Ausente' });
});
it('sums emissions from all routes of a vehicle', async () => {
  request.mockImplementation(async (path: string) => {
    if (path === '/routes/') return [{ vehicle_id: 'v', emissions_kg_co2: 2, total_distance_km: 10 }, { vehicle_id: 'v', emissions_kg_co2: 3, total_distance_km: 15 }];
    if (path === '/vehicles/') return [{ id: 'v', code: 'V-1', consumption_km_per_l: 10 }];
    return [];
  });
  expect((await sustainabilityService.getMetrics()).emissionsByVehicle).toEqual([{ vehicleCode: 'V-1', emissions: 5 }]);
});
