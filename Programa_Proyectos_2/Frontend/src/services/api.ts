import { supabase } from './supabase';
import type {
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

// ---- Mappers: DB snake_case -> TS camelCase ----

function mapVehicle(r: any): Vehicle {
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
    status: r.status,
    available: r.available,
    driverId: r.driver_id || undefined,
  };
}

function toVehicleRow(v: Partial<Vehicle>): Record<string, any> {
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
    status: v.status,
    available: v.available,
    driver_id: v.driverId || null,
  };
}

function mapDriver(r: any): Driver {
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

function toDriverRow(d: Partial<Driver>): Record<string, any> {
  return {
    name: d.name,
    dni: d.dni,
    phone: d.phone,
    license: d.license,
    license_type: d.licenseType,
    status: d.status,
    available: d.available,
    vehicle_id: d.vehicleId || null,
    shift_start: d.shiftStart,
    shift_end: d.shiftEnd,
    avatar_initials: d.avatarInitials,
  };
}

function mapClient(r: any): Client {
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

function toClientRow(c: Partial<Client>): Record<string, any> {
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

function mapOrder(r: any): Order {
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

function toOrderRow(o: Partial<Order>): Record<string, any> {
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
    route_id: o.routeId || null,
    delivery_order: o.deliveryOrder ?? null,
    driver_id: o.driverId || null,
  };
}

function mapRoute(r: any): Route {
  const stops = (r.stops || []).map((s: any) => ({
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
    status: r.status,
    completedDeliveries: r.completed_deliveries,
    totalDeliveries: r.total_deliveries,
  };
}

function mapNotification(r: any): Notification {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    message: r.message,
    timestamp: r.created_at,
    read: r.read,
  };
}

function mapParameters(r: any): OperationalParameters {
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
  };
}

// ---- Vehicles ----
export const vehicleService = {
  async getAll(): Promise<Vehicle[]> {
    const { data, error } = await supabase.from('vehicles').select('*').order('code');
    if (error) throw error;
    return data.map(mapVehicle);
  },
  async create(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(toVehicleRow(vehicle))
      .select()
      .single();
    if (error) throw error;
    return mapVehicle(data);
  },
  async update(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const { data, error } = await supabase
      .from('vehicles')
      .update(toVehicleRow(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapVehicle(data);
  },
  async toggleAvailability(id: string): Promise<Vehicle> {
    const { data: current } = await supabase
      .from('vehicles')
      .select('available, status')
      .eq('id', id)
      .single();
    if (!current) throw new Error('Vehículo no encontrado');
    const newAvailable = !current.available;
    let newStatus = current.status;
    if (newAvailable && current.status === 'unavailable') newStatus = 'available';
    else if (!newAvailable && current.status === 'available') newStatus = 'unavailable';
    const { data, error } = await supabase
      .from('vehicles')
      .update({ available: newAvailable, status: newStatus })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapVehicle(data);
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) throw error;
  },
};

// ---- Drivers ----
export const driverService = {
  async getAll(): Promise<Driver[]> {
    const { data, error } = await supabase.from('drivers').select('*').order('name');
    if (error) throw error;
    return data.map(mapDriver);
  },
  async create(driver: Omit<Driver, 'id'>): Promise<Driver> {
    const { data, error } = await supabase
      .from('drivers')
      .insert(toDriverRow(driver))
      .select()
      .single();
    if (error) throw error;
    return mapDriver(data);
  },
  async update(id: string, updates: Partial<Driver>): Promise<Driver> {
    const { data, error } = await supabase
      .from('drivers')
      .update(toDriverRow(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapDriver(data);
  },
  async toggleAvailability(id: string): Promise<Driver> {
    const { data: current } = await supabase
      .from('drivers')
      .select('available')
      .eq('id', id)
      .single();
    if (!current) throw new Error('Conductor no encontrado');
    const newAvailable = !current.available;
    const newStatus = newAvailable ? 'available' : 'resting';
    const { data, error } = await supabase
      .from('drivers')
      .update({ available: newAvailable, status: newStatus })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapDriver(data);
  },
  async assignVehicle(driverId: string, vehicleId: string): Promise<Driver> {
    const { data: oldDriver } = await supabase
      .from('drivers')
      .select('id')
      .eq('vehicle_id', vehicleId)
      .neq('id', driverId)
      .maybeSingle();
    if (oldDriver) {
      await supabase.from('drivers').update({ vehicle_id: null }).eq('id', oldDriver.id);
    }
    const { data, error } = await supabase
      .from('drivers')
      .update({ vehicle_id: vehicleId })
      .eq('id', driverId)
      .select()
      .single();
    if (error) throw error;
    await supabase.from('vehicles').update({ driver_id: driverId }).eq('id', vehicleId);
    return mapDriver(data);
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('drivers').delete().eq('id', id);
    if (error) throw error;
  },
  async getSchedules(): Promise<DriverSchedule[]> {
    const { data, error } = await supabase
      .from('drivers')
      .select('id, shift_start, shift_end, status, available')
      .order('name');
    if (error) throw error;
    return data.map((r: any) => ({
      driverId: r.id,
      shiftStart: r.shift_start,
      shiftEnd: r.shift_end,
      status: r.status,
      available: r.available,
    }));
  },
};

// ---- Clients ----
export const clientService = {
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase.from('clients').select('*').order('name');
    if (error) throw error;
    return data.map(mapClient);
  },
  async create(client: Omit<Client, 'id'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(toClientRow(client))
      .select()
      .single();
    if (error) throw error;
    return mapClient(data);
  },
  async update(id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(toClientRow(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapClient(data);
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
  },
};

// ---- Orders ----
export const orderService = {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*').order('code');
    if (error) throw error;
    return data.map(mapOrder);
  },
  async create(order: Omit<Order, 'id'>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(toOrderRow(order))
      .select()
      .single();
    if (error) throw error;
    return mapOrder(data);
  },
  async update(id: string, updates: Partial<Order>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update(toOrderRow(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapOrder(data);
  },
  async updateStatus(id: string, status: Order['status'], extras?: Partial<Order>): Promise<Order> {
    const updateRow: Record<string, any> = { status };
    if (extras) {
      if (extras.incidentReason !== undefined) updateRow.incident_reason = extras.incidentReason;
      if (extras.incidentNotes !== undefined) updateRow.incident_notes = extras.incidentNotes;
      if (extras.driverId !== undefined) updateRow.driver_id = extras.driverId;
      if (extras.routeId !== undefined) updateRow.route_id = extras.routeId;
      if (extras.deliveryOrder !== undefined) updateRow.delivery_order = extras.deliveryOrder;
    }
    if (status === 'delivered') updateRow.delivered_at = new Date().toISOString();
    const { data, error } = await supabase
      .from('orders')
      .update(updateRow)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapOrder(data);
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
  },
};

// ---- Routes ----
function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export const routeService = {
  async getAll(): Promise<Route[]> {
    const { data, error } = await supabase.from('routes').select('*').order('code');
    if (error) throw error;
    return data.map(mapRoute);
  },
  async getById(id: string): Promise<Route | null> {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapRoute(data) : null;
  },
  async generatePlan(
    date: string,
    orderIds: string[],
    driverIds: string[],
    vehicleIds: string[]
  ): Promise<Route[]> {
    const { data: orders } = await supabase.from('orders').select('*').in('id', orderIds);
    const { data: drivers } = await supabase.from('drivers').select('*').in('id', driverIds);
    const { data: vehicles } = await supabase.from('vehicles').select('*').in('id', vehicleIds);
    const { data: existingRoutes } = await supabase.from('routes').select('code');

    if (!orders || !drivers || !vehicles) throw new Error('Error al obtener datos');

    const maxPerRoute = 6;
    const newRoutes: Route[] = [];
    const stopBatches: any[][] = [];
    for (let i = 0; i < orders.length; i += maxPerRoute) {
      stopBatches.push(orders.slice(i, i + maxPerRoute));
    }

    const routeCount = existingRoutes?.length || 0;

    for (let idx = 0; idx < stopBatches.length; idx++) {
      const batch = stopBatches[idx];
      const driver = drivers[idx % drivers.length];
      const vehicle = vehicles[idx % vehicles.length];
      if (!driver || !vehicle) continue;

      const distance = +(batch.length * 3.5 + Math.random() * 10).toFixed(1);
      const timeMin = Math.round(distance * 4 + batch.length * 10);
      const routeCode = `R-${String(routeCount + idx + 1).padStart(3, '0')}`;

      const stops = batch.map((o, i) => ({
        orderId: o.id,
        order: i + 1,
        clientName: '',
        address: o.street,
        district: o.district,
        lat: +o.lat,
        lng: +o.lng,
        timeWindow: `${o.time_window_start} - ${o.time_window_end}`,
        status: 'planned' as const,
      }));

      const insertRow = {
        code: routeCode,
        driver_id: driver.id,
        vehicle_id: vehicle.id,
        date,
        total_distance_km: distance,
        estimated_time_min: timeMin,
        departure_time: driver.shift_start,
        estimated_arrival_time: addMinutesToTime(driver.shift_start, timeMin),
        emissions_kg_co2: +(distance * +vehicle.emissions_per_km).toFixed(1),
        status: 'pending',
        completed_deliveries: 0,
        total_deliveries: batch.length,
        stops,
      };

      const { data: inserted, error } = await supabase
        .from('routes')
        .insert(insertRow)
        .select()
        .single();
      if (error) throw error;

      const orderIds = batch.map((o) => o.id);
      await supabase
        .from('orders')
        .update({
          status: 'planned',
          route_id: inserted.id,
          delivery_order: null,
          driver_id: driver.id,
        })
        .in('id', orderIds);

      newRoutes.push(mapRoute(inserted));
    }

    return newRoutes;
  },
  async updateStatus(id: string, status: Route['status']): Promise<Route> {
    const { data: route } = await supabase.from('routes').select('*').eq('id', id).single();
    if (!route) throw new Error('Ruta no encontrada');

    const stops = (route.stops || []).map((s: any) => {
      if (status === 'in_route' && s.status === 'planned') return { ...s, status: 'in_route' };
      return s;
    });

    const { data, error } = await supabase
      .from('routes')
      .update({ status, stops })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapRoute(data);
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('routes').delete().eq('id', id);
    if (error) throw error;
  },
};

// ---- Parameters ----
export const parameterService = {
  async get(): Promise<OperationalParameters> {
    const { data, error } = await supabase
      .from('parameters')
      .select('*')
      .order('id')
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return {
        maxVehicleCapacityKg: 4500,
        maxWeightKg: 4500,
        maxVolumeM3: 20,
        averageSpeedKmH: 25,
        maxOperationTimeH: 8,
        estimatedConsumptionKmPerL: 9.5,
        emissionFactor: 2.68,
        fuelType: 'diesel',
        maxDistanceKm: 120,
        maxDeliveriesPerRoute: 15,
      };
    }
    return mapParameters(data);
  },
  async update(updates: Partial<OperationalParameters>): Promise<OperationalParameters> {
    const { data: existing } = await supabase
      .from('parameters')
      .select('id')
      .order('id')
      .limit(1)
      .maybeSingle();

    const row: Record<string, any> = {
      max_vehicle_capacity_kg: updates.maxVehicleCapacityKg,
      max_weight_kg: updates.maxWeightKg,
      max_volume_m3: updates.maxVolumeM3,
      average_speed_km_h: updates.averageSpeedKmH,
      max_operation_time_h: updates.maxOperationTimeH,
      estimated_consumption_km_per_l: updates.estimatedConsumptionKmPerL,
      emission_factor: updates.emissionFactor,
      fuel_type: updates.fuelType,
      max_distance_km: updates.maxDistanceKm,
      max_deliveries_per_route: updates.maxDeliveriesPerRoute,
    };

    if (existing) {
      const { data, error } = await supabase
        .from('parameters')
        .update(row)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return mapParameters(data);
    } else {
      const { data, error } = await supabase
        .from('parameters')
        .insert(row)
        .select()
        .single();
      if (error) throw error;
      return mapParameters(data);
    }
  },
};

// ---- Sustainability ----
export const sustainabilityService = {
  async getMetrics(): Promise<SustainabilityMetrics> {
    const { data: routes } = await supabase.from('routes').select('*');
    const { data: vehicles } = await supabase.from('vehicles').select('*');
    const { data: orders } = await supabase.from('orders').select('status');

    const r = routes || [];
    const v = vehicles || [];
    const o = orders || [];

    const totalDistance = r.reduce((s: number, rt: any) => s + +rt.total_distance_km, 0);
    const totalEmissions = r.reduce((s: number, rt: any) => s + +rt.emissions_kg_co2, 0);
    const totalConsumption = r.reduce((s: number, rt: any) => {
      const veh = v.find((vv: any) => vv.id === rt.vehicle_id);
      if (!veh || +veh.consumption_km_per_l === 0) return s;
      return s + +rt.total_distance_km / +veh.consumption_km_per_l;
    }, 0);
    const completed = o.filter((oo: any) => oo.status === 'delivered').length;

    return {
      totalEmissionsKgCO2: +totalEmissions.toFixed(1),
      totalDistanceKm: +totalDistance.toFixed(1),
      estimatedConsumptionL: +totalConsumption.toFixed(1),
      deliveriesCompleted: completed,
      emissionsByRoute: r.map((rt: any) => ({ routeCode: rt.code, emissions: +rt.emissions_kg_co2 })),
      emissionsByVehicle: v
        .filter((vv: any) => vv.fuel_type !== 'electric')
        .map((vv: any) => {
          const route = r.find((rt: any) => rt.vehicle_id === vv.id);
          return { vehicleCode: vv.code, emissions: route ? +route.emissions_kg_co2 : 0 };
        }),
      efficiencyIndex: +(completed / (totalDistance || 1)).toFixed(2),
    };
  },
};

// ---- Notifications ----
export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(mapNotification);
  },
  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) throw error;
  },
  async markAllAsRead(): Promise<void> {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('read', false);
    if (error) throw error;
  },
};
