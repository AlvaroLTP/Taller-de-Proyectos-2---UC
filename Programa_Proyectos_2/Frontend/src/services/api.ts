import { apiRequest } from './http';
import type {
  Address,
  Vehicle,
  Driver,
  Client,
  Order,
  Route,
  OperationalParameters,
  SustainabilityMetrics,
  DriverSchedule,
  Notification,
} from '@/types';


type Snake<S extends string> = S extends `${infer A}${infer B}` ? `${A extends Lowercase<A> ? A : `_${Lowercase<A>}`}${Snake<B>}` : S;
type Row<T> = { [K in keyof T as Snake<K & string>]: T[K] };
type VehicleRow = Row<Vehicle>;
type DriverRow = Row<Driver>;
type ClientRow = Omit<Row<Client>, 'address'> & Row<Address>;
type OrderRow = Omit<Row<Order>, 'address' | 'preferences'> & Row<Address> & {
  preferred_time: string; pref_time_window_start: string; pref_time_window_end: string;
  restrictions: string[]; requires_special_attention: boolean; no_lunch_hours: boolean;
  requires_phone_coordination: boolean; pref_observations: string;
};
type RouteRow = Omit<Row<Route>, 'emissions_kg_c_o2'> & { emissions_kg_co2: number };
type ParametersRow = Omit<Row<OperationalParameters>, 'electricity_emission_factor_kg_c_o2e_per_kwh'> & {
  electricity_emission_factor_kg_co2e_per_kwh?: number;
};
type NotificationRow = Omit<Row<Notification>, 'timestamp'> & { created_at: string };


function mapVehicle(r: VehicleRow): Vehicle {
  return {
    id: r.id,
    code: r.code,
    plate: r.plate,
    type: r.type,
    brand: r.brand,
    model: r.model,
    capacityKg: +r.capacity_kg,
    capacityM3: +r.capacity_m3,
    consumptionKmPerL: +r.consumption_km_per_l,
    fuelType: r.fuel_type,
    emissionsPerKm: +r.emissions_per_km,
    energyKwhPerKm: r.energy_kwh_per_km == null ? undefined : +r.energy_kwh_per_km,
    emissionFactorSource: r.emission_factor_source || undefined,
    status: r.status,
    available: r.available,
    driverId: r.driver_id || undefined,
  };
}

function toVehicleRow(v: Partial<Vehicle>): Record<string, unknown> {
  return {
    code: v.code,
    plate: v.plate,
    type: v.type,
    brand: v.brand,
    model: v.model,
    capacity_kg: v.capacityKg,
    capacity_m3: v.capacityM3,
    consumption_km_per_l: v.consumptionKmPerL,
    fuel_type: v.fuelType,
    emissions_per_km: v.emissionsPerKm,
    energy_kwh_per_km: v.energyKwhPerKm,
    emission_factor_source: v.emissionFactorSource,
    status: v.status,
    available: v.available,
  };
}

function mapDriver(r: DriverRow): Driver {
  return {
    id: r.id,
    name: r.name,
    dni: r.dni,
    phone: r.phone,
    license: r.license,
    licenseType: r.license_type,
    status: r.status,
    available: r.available,
    vehicleId: r.vehicle_id || undefined,
    shiftStart: r.shift_start,
    shiftEnd: r.shift_end,
    avatarInitials: r.avatar_initials,
  };
}

function toDriverRow(d: Partial<Driver>): Record<string, unknown> {
  return {
    name: d.name,
    dni: d.dni,
    phone: d.phone,
    license: d.license,
    license_type: d.licenseType,
    status: d.status,
    available: d.available,
    shift_start: d.shiftStart,
    shift_end: d.shiftEnd,
    avatar_initials: d.avatarInitials,
  };
}

function mapClient(r: ClientRow): Client {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email,
    address: {
      street: r.street,
      reference: r.reference,
      district: r.district,
      neighborhood: r.neighborhood,
      lat: +r.lat,
      lng: +r.lng,
      indications: r.indications,
      accessType: r.access_type,
    },
    priority: r.priority,
    notes: r.notes,
  };
}

function toClientRow(c: Partial<Client>): Record<string, unknown> {
  const a = c.address;
  return {
    name: c.name,
    phone: c.phone,
    email: c.email,
    street: a?.street,
    reference: a?.reference,
    district: a?.district,
    neighborhood: a?.neighborhood,
    lat: a?.lat,
    lng: a?.lng,
    indications: a?.indications,
    access_type: a?.accessType,
    priority: c.priority,
    notes: c.notes,
  };
}

function mapOrder(r: OrderRow): Order {
  return {
    id: r.id,
    code: r.code,
    clientId: r.client_id,
    phone: r.phone,
    address: {
      street: r.street,
      reference: r.reference,
      district: r.district,
      neighborhood: r.neighborhood,
      lat: +r.lat,
      lng: +r.lng,
      indications: r.indications,
      accessType: r.access_type,
    },
    deliveryDate: r.delivery_date,
    timeWindowStart: r.time_window_start,
    timeWindowEnd: r.time_window_end,
    priority: r.priority,
    weightKg: +r.weight_kg,
    volumeM3: +r.volume_m3,
    productType: r.product_type,
    observations: r.observations,
    status: r.status,
    preferences: {
      preferredTime: r.preferred_time,
      timeWindowStart: r.pref_time_window_start,
      timeWindowEnd: r.pref_time_window_end,
      priority: r.priority,
      restrictions: r.restrictions || [],
      accessType: r.access_type,
      requiresSpecialAttention: r.requires_special_attention,
      noLunchHours: r.no_lunch_hours,
      requiresPhoneCoordination: r.requires_phone_coordination,
      observations: r.pref_observations,
    },
    routeId: r.route_id || undefined,
    deliveryOrder: r.delivery_order ?? undefined,
    driverId: r.driver_id || undefined,
    deliveredAt: r.delivered_at || undefined,
    incidentReason: r.incident_reason || undefined,
    incidentNotes: r.incident_notes || undefined,
  };
}

function toOrderRow(o: Partial<Order>): Record<string, unknown> {
  const a = o.address;
  const p = o.preferences;
  return {
    code: o.code,
    client_id: o.clientId,
    phone: o.phone,
    street: a?.street,
    reference: a?.reference,
    district: a?.district,
    neighborhood: a?.neighborhood,
    lat: a?.lat,
    lng: a?.lng,
    indications: a?.indications,
    access_type: a?.accessType,
    delivery_date: o.deliveryDate,
    time_window_start: o.timeWindowStart,
    time_window_end: o.timeWindowEnd,
    priority: o.priority,
    weight_kg: o.weightKg,
    volume_m3: o.volumeM3,
    product_type: o.productType,
    observations: o.observations,
    status: o.status,
    preferred_time: p?.preferredTime,
    pref_time_window_start: p?.timeWindowStart,
    pref_time_window_end: p?.timeWindowEnd,
    restrictions: p?.restrictions,
    requires_special_attention: p?.requiresSpecialAttention,
    no_lunch_hours: p?.noLunchHours,
    requires_phone_coordination: p?.requiresPhoneCoordination,
    pref_observations: p?.observations,
  };
}

function mapRoute(r: RouteRow): Route {
  const stops = (r.stops || []).map((s) => ({
    orderId: s.orderId || '',
    order: s.order,
    clientName: s.clientName || '',
    address: s.address || '',
    district: s.district || '',
    lat: s.lat || 0,
    lng: s.lng || 0,
    timeWindow: s.timeWindow || '',
    status: s.status,
  }));
  return {
    id: r.id,
    code: r.code,
    driverId: r.driver_id,
    vehicleId: r.vehicle_id,
    date: r.date,
    stops,
    totalDistanceKm: +r.total_distance_km,
    estimatedTimeMin: r.estimated_time_min,
    departureTime: r.departure_time,
    estimatedArrivalTime: r.estimated_arrival_time,
    emissionsKgCO2: +r.emissions_kg_co2,
    outboundDistanceKm: r.outbound_distance_km == null ? undefined : +r.outbound_distance_km,
    returnDistanceKm: r.return_distance_km == null ? undefined : +r.return_distance_km,
    payloadTonneKm: r.payload_tonne_km == null ? undefined : +r.payload_tonne_km,
    energyKwh: r.energy_kwh == null ? undefined : +r.energy_kwh,
    emissionsMethod: r.emissions_method || undefined,
    emissionsSource: r.emissions_source || undefined,
    status: r.status,
    completedDeliveries: r.completed_deliveries,
    totalDeliveries: r.total_deliveries,
  };
}

function mapNotification(r: NotificationRow): Notification {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    message: r.message,
    timestamp: r.created_at,
    read: r.read,
  };
}

function mapParameters(r: ParametersRow): OperationalParameters {
  return {
    maxVehicleCapacityKg: +r.max_vehicle_capacity_kg,
    maxWeightKg: +r.max_weight_kg,
    maxVolumeM3: +r.max_volume_m3,
    averageSpeedKmH: +r.average_speed_km_h,
    maxOperationTimeH: +r.max_operation_time_h,
    estimatedConsumptionKmPerL: +r.estimated_consumption_km_per_l,
    emissionFactor: +r.emission_factor,
    fuelType: r.fuel_type,
    maxDistanceKm: +r.max_distance_km,
    maxDeliveriesPerRoute: +r.max_deliveries_per_route,
    depotLat: r.depot_lat == null ? undefined : +r.depot_lat,
    depotLng: r.depot_lng == null ? undefined : +r.depot_lng,
    electricityEmissionFactorKgCO2ePerKwh: r.electricity_emission_factor_kg_co2e_per_kwh == null ? undefined : +r.electricity_emission_factor_kg_co2e_per_kwh,
  };
}


function crud<T, R>(resource: string, map: (row: R) => T, toRow: (value: Partial<T>) => Record<string, unknown>) {
  return {
    async getAll(): Promise<T[]> { return (await apiRequest<R[]>(`/${resource}/`)).map(map); },
    async create(value: Omit<T, 'id'>): Promise<T> { return map(await apiRequest<R>(`/${resource}/`, 'POST', toRow(value as Partial<T>))); },
    async update(id: string, value: Partial<T>): Promise<T> { return map(await apiRequest<R>(`/${resource}/${encodeURIComponent(id)}`, 'PATCH', toRow(value))); },
    async delete(id: string): Promise<void> { await apiRequest(`/${resource}/${encodeURIComponent(id)}`, 'DELETE'); },
  };
}
export const vehicleService = {
  ...crud<Vehicle, VehicleRow>('vehicles', mapVehicle, toVehicleRow),
  async toggleAvailability(id: string): Promise<Vehicle> {
    const current = mapVehicle(await apiRequest<VehicleRow>(`/vehicles/${encodeURIComponent(id)}`));
    const available = !current.available;
    const status = available && current.status === 'unavailable' ? 'available' : !available && current.status === 'available' ? 'unavailable' : current.status;
    return this.update(id, { available, status });
  },
};
export const driverService = {
  ...crud<Driver, DriverRow>('drivers', mapDriver, toDriverRow),
  async toggleAvailability(id: string): Promise<Driver> {
    const current = mapDriver(await apiRequest<DriverRow>(`/drivers/${encodeURIComponent(id)}`));
    return this.update(id, { available: !current.available, status: current.available ? 'resting' : 'available' });
  },
  async assignVehicle(id: string, vehicleId: string): Promise<Driver> {
    return mapDriver(await apiRequest<DriverRow>(`/drivers/${encodeURIComponent(id)}/vehicle`, 'PUT', { vehicle_id: vehicleId }));
  },
  async getSchedules(): Promise<DriverSchedule[]> {
    return (await this.getAll()).map(d => ({ driverId: d.id, shiftStart: d.shiftStart, shiftEnd: d.shiftEnd, status: d.status, available: d.available }));
  },
};
export const clientService = crud<Client, ClientRow>('clients', mapClient, toClientRow);
export const orderService = {
  ...crud<Order, OrderRow>('orders', mapOrder, toOrderRow),
  async getPage(options: { limit?: number; offset?: number; status?: Order['status']; deliveryDate?: string } = {}): Promise<Order[]> {
    const params = new URLSearchParams();
    if (options.limit !== undefined) params.set('limit', String(options.limit));
    if (options.offset !== undefined) params.set('offset', String(options.offset));
    if (options.status) params.set('status', options.status);
    if (options.deliveryDate) params.set('delivery_date', options.deliveryDate);
    const query = params.size ? `?${params}` : '';
    return (await apiRequest<OrderRow[]>(`/orders/${query}`)).map(mapOrder);
  },
  async update(id: string, updates: Partial<Order>): Promise<Order> {
    const row = toOrderRow(updates);
    delete row.status;
    return mapOrder(await apiRequest<OrderRow>(`/orders/${encodeURIComponent(id)}`, 'PATCH', row));
  },
  async updateStatus(id: string, status: Order['status'], extras?: Partial<Order>): Promise<Order> {
    return mapOrder(await apiRequest<OrderRow>(`/orders/${encodeURIComponent(id)}/status`, 'PUT', {
      status, incident_reason: extras?.incidentReason, incident_notes: extras?.incidentNotes,
    }));
  },
};
export const routeService = {
  async getAll(): Promise<Route[]> { return (await apiRequest<RouteRow[]>('/routes/')).map(mapRoute); },
  async getById(id: string): Promise<Route> { return mapRoute(await apiRequest<RouteRow>(`/routes/${encodeURIComponent(id)}`)); },
  async generatePlan(date: string, orderIds: string[], driverIds: string[], vehicleIds: string[]): Promise<Route[]> {
    const result = await apiRequest<{ valid: boolean; errors: string[]; routes: RouteRow[] }>('/routes/generate', 'POST', {
      date, order_ids: orderIds, driver_ids: driverIds, vehicle_ids: vehicleIds,
    });
    if (!result.valid) throw new Error(result.errors.join('. '));
    return result.routes.map(mapRoute);
  },
  async updateStatus(id: string, status: Route['status']): Promise<Route> {
    return mapRoute(await apiRequest<RouteRow>(`/routes/${encodeURIComponent(id)}/status`, 'PUT', { status }));
  },
  async delete(id: string): Promise<void> { await apiRequest(`/routes/${encodeURIComponent(id)}`, 'DELETE'); },
};
export const parameterService = {
  async get(): Promise<OperationalParameters> { return mapParameters(await apiRequest<ParametersRow>('/parameters/')); },
  async update(updates: Partial<OperationalParameters>): Promise<OperationalParameters> {
    const keys = { maxVehicleCapacityKg: 'max_vehicle_capacity_kg', maxWeightKg: 'max_weight_kg', maxVolumeM3: 'max_volume_m3',
      averageSpeedKmH: 'average_speed_km_h', maxOperationTimeH: 'max_operation_time_h', estimatedConsumptionKmPerL: 'estimated_consumption_km_per_l',
      emissionFactor: 'emission_factor', fuelType: 'fuel_type', maxDistanceKm: 'max_distance_km', maxDeliveriesPerRoute: 'max_deliveries_per_route',
      depotLat: 'depot_lat', depotLng: 'depot_lng', electricityEmissionFactorKgCO2ePerKwh: 'electricity_emission_factor_kg_co2e_per_kwh' };
    const row = Object.fromEntries(Object.entries(keys).map(([key, column]) => [column, updates[key as keyof OperationalParameters]]));
    return mapParameters(await apiRequest<ParametersRow>('/parameters/', 'PUT', row));
  },
};
export const sustainabilityService = {
  async getMetrics(data?: { routes: Route[]; vehicles: Vehicle[]; orders: Order[] }): Promise<SustainabilityMetrics> {
    const [routes, vehicles, orders] = data ? [data.routes, data.vehicles, data.orders] : await Promise.all([routeService.getAll(), vehicleService.getAll(), orderService.getAll()]);
    const totalDistance = routes.reduce((s, r) => s + r.totalDistanceKm, 0);
    const totalEmissions = routes.reduce((s, r) => s + r.emissionsKgCO2, 0);
    const consumption = routes.reduce((s, r) => {
      const vehicle = vehicles.find(v => v.id === r.vehicleId);
      return s + (vehicle && vehicle.consumptionKmPerL > 0 ? r.totalDistanceKm / vehicle.consumptionKmPerL : 0);
    }, 0);
    const completed = orders.filter(o => o.status === 'delivered').length;
    return { totalEmissionsKgCO2: +totalEmissions.toFixed(1), totalDistanceKm: +totalDistance.toFixed(1),
      estimatedConsumptionL: +consumption.toFixed(1), deliveriesCompleted: completed,
      emissionsByRoute: routes.map(r => ({ routeCode: r.code, emissions: r.emissionsKgCO2 })),
      emissionsByVehicle: vehicles.map(v => ({ vehicleCode: v.code, emissions: routes.filter(r => r.vehicleId === v.id).reduce((s, r) => s+r.emissionsKgCO2, 0) })),
      efficiencyIndex: +(completed / (totalDistance || 1)).toFixed(2) };
  },
};
export const notificationService = {
  async getAll(): Promise<Notification[]> { return (await apiRequest<NotificationRow[]>('/notifications/')).map(mapNotification); },
  async markAsRead(id: string): Promise<void> { await apiRequest(`/notifications/${encodeURIComponent(id)}/read`, 'PUT'); },
  async markAllAsRead(): Promise<void> { await apiRequest('/notifications/read', 'PUT'); },
};
