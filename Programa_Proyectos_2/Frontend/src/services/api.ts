import { request, ApiError } from './http';

// Rows retain the SQL field names exposed by the FastAPI contracts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;
import type {
  Vehicle,
  Driver,
  Client,
  Order,
  Route,
  OperationalParameters,
  SustainabilityMetrics,
  CostAnalysis,
  EmissionsBreakdown,
  CarbonCompensationPlan,
  CarbonInitiative,
  ReoptimizationResult,
  DriverSchedule,
  Notification,
} from '@/types';

// ---- Mappers: DB snake_case -> TS camelCase ----

function mapVehicle(r: Row): Vehicle {
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

function toVehicleRow(v: Partial<Vehicle>): Row {
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
    driver_id: v.driverId,
  };
}

function mapDriver(r: Row): Driver {
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

function toDriverRow(d: Partial<Driver>): Row {
  return {
    name: d.name,
    dni: d.dni,
    phone: d.phone,
    license: d.license,
    license_type: d.licenseType,
    status: d.status,
    available: d.available,
    vehicle_id: d.vehicleId,
    shift_start: d.shiftStart,
    shift_end: d.shiftEnd,
    avatar_initials: d.avatarInitials,
  };
}

function mapClient(r: Row): Client {
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

function toClientRow(c: Partial<Client>): Row {
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

function mapOrder(r: Row): Order {
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

function toOrderRow(o: Partial<Order>): Row {
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

function mapRoute(r: Row): Route {
  const stops = (r.stops || []).map((s: Row) => ({
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

function mapNotification(r: Row): Notification {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    message: r.message,
    timestamp: r.created_at,
    read: r.read,
  };
}

function mapParameters(r: Row): OperationalParameters {
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

// Operational writes always go through FastAPI, which enforces roles and transactions.
export const vehicleService = {
  async getAll(): Promise<Vehicle[]> {
    return (await request<Row[]>('/vehicles/')).map(mapVehicle).sort((a, b) => a.code.localeCompare(b.code));
  },
  async create(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const row = toVehicleRow(vehicle);
    delete row.driver_id;
    return mapVehicle(await request<Row>('/vehicles/', 'POST', row));
  },
  async update(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const row = toVehicleRow(updates);
    delete row.driver_id;
    return mapVehicle(await request<Row>(`/vehicles/${id}`, 'PATCH', row));
  },
  async toggleAvailability(id: string): Promise<Vehicle> {
    const current = mapVehicle(await request<Row>(`/vehicles/${id}`));
    const available = !current.available;
    const status = available && current.status === 'unavailable' ? 'available'
      : !available && current.status === 'available' ? 'unavailable' : current.status;
    return vehicleService.update(id, { available, status });
  },
  async delete(id: string): Promise<void> { await request(`/vehicles/${id}`, 'DELETE'); },
};

export const driverService = {
  async getAll(): Promise<Driver[]> {
    return (await request<Row[]>('/drivers/')).map(mapDriver).sort((a, b) => a.name.localeCompare(b.name));
  },
  async create(driver: Omit<Driver, 'id'>): Promise<Driver> {
    const row = toDriverRow(driver);
    delete row.vehicle_id;
    return mapDriver(await request<Row>('/drivers/', 'POST', row));
  },
  async update(id: string, updates: Partial<Driver>): Promise<Driver> {
    const row = toDriverRow(updates);
    delete row.vehicle_id;
    return mapDriver(await request<Row>(`/drivers/${id}`, 'PATCH', row));
  },
  async toggleAvailability(id: string): Promise<Driver> {
    const current = mapDriver(await request<Row>(`/drivers/${id}`));
    const available = !current.available;
    return driverService.update(id, { available, status: available ? 'available' : 'resting' });
  },
  async assignVehicle(driverId: string, vehicleId: string): Promise<Driver> {
    return mapDriver(await request<Row>(`/drivers/${driverId}/vehicle`, 'PUT', { vehicle_id: vehicleId }));
  },
  async delete(id: string): Promise<void> { await request(`/drivers/${id}`, 'DELETE'); },
  async getSchedules(): Promise<DriverSchedule[]> {
    return (await driverService.getAll()).map(d => ({
      driverId: d.id, shiftStart: d.shiftStart, shiftEnd: d.shiftEnd,
      status: d.status, available: d.available,
    }));
  },
};

export const clientService = {
  async getAll(): Promise<Client[]> {
    return (await request<Row[]>('/clients/')).map(mapClient).sort((a, b) => a.name.localeCompare(b.name));
  },
  async create(client: Omit<Client, 'id'>): Promise<Client> {
    return mapClient(await request<Row>('/clients/', 'POST', toClientRow(client)));
  },
  async update(id: string, updates: Partial<Client>): Promise<Client> {
    return mapClient(await request<Row>(`/clients/${id}`, 'PATCH', toClientRow(updates)));
  },
  async delete(id: string): Promise<void> { await request(`/clients/${id}`, 'DELETE'); },
};

export const orderService = {
  async getAll(): Promise<Order[]> {
    return (await request<Row[]>('/orders/')).map(mapOrder).sort((a, b) => a.code.localeCompare(b.code));
  },
  async create(order: Omit<Order, 'id'>): Promise<Order> {
    return mapOrder(await request<Row>('/orders/', 'POST', toOrderRow(order)));
  },
  async update(id: string, updates: Partial<Order>): Promise<Order> {
    const row = toOrderRow(updates);
    for (const field of ['status', 'route_id', 'driver_id', 'delivery_order']) delete row[field];
    return mapOrder(await request<Row>(`/orders/${id}`, 'PATCH', row));
  },
  async updateStatus(id: string, status: Order['status'], extras?: Partial<Order>): Promise<Order> {
    return mapOrder(await request<Row>(`/orders/${id}/status`, 'PUT', {
      status, incident_reason: extras?.incidentReason, incident_notes: extras?.incidentNotes,
    }));
  },
  async delete(id: string): Promise<void> { await request(`/orders/${id}`, 'DELETE'); },
};

export const routeService = {
  async getAll(): Promise<Route[]> { return (await request<Row[]>('/routes/')).map(mapRoute); },
  async getById(id: string): Promise<Route | null> {
    try { return mapRoute(await request<Row>(`/routes/${id}`)); }
    catch (error) { if (error instanceof ApiError && error.status === 404) return null; throw error; }
  },
  async generatePlan(date: string, orderIds: string[], driverIds: string[], vehicleIds: string[]): Promise<Route[]> {
    const result = await request<{ valid: boolean; errors: string[]; routes: Row[] }>('/routes/generate', 'POST', {
      date, order_ids: orderIds, driver_ids: driverIds, vehicle_ids: vehicleIds,
    });
    if (!result.valid) throw new Error(result.errors.join('\n') || 'No se pudo generar el plan');
    return result.routes.map(mapRoute);
  },
  async updateStatus(id: string, status: Route['status']): Promise<Route> {
    return mapRoute(await request<Row>(`/routes/${id}/status`, 'PUT', { status }));
  },
  async reoptimize(id: string, reason: string): Promise<ReoptimizationResult> {
    return request<ReoptimizationResult>(`/routes/${id}/reoptimize`, 'POST', { reason });
  },
  async delete(id: string): Promise<void> { await request(`/routes/${id}`, 'DELETE'); },
};

export const parameterService = {
  async get(): Promise<OperationalParameters> { return mapParameters(await request<Row>('/parameters/')); },
  async update(updates: Partial<OperationalParameters>): Promise<OperationalParameters> {
    const row = {
      max_vehicle_capacity_kg: updates.maxVehicleCapacityKg, max_weight_kg: updates.maxWeightKg,
      max_volume_m3: updates.maxVolumeM3, average_speed_km_h: updates.averageSpeedKmH,
      max_operation_time_h: updates.maxOperationTimeH, estimated_consumption_km_per_l: updates.estimatedConsumptionKmPerL,
      emission_factor: updates.emissionFactor, fuel_type: updates.fuelType,
      max_distance_km: updates.maxDistanceKm, max_deliveries_per_route: updates.maxDeliveriesPerRoute,
    };
    return mapParameters(await request<Row>('/parameters/', 'PUT', row));
  },
};

// ---- Sustainability ----
export const sustainabilityService = {
  async getMetrics(): Promise<SustainabilityMetrics> {
    const [routes, vehicles, orders] = await Promise.all([
      request<Row[]>('/routes/'), request<Row[]>('/vehicles/'), request<Row[]>('/orders/'),
    ]);

    const r = routes || [];
    const v = vehicles || [];
    const o = orders || [];

    const totalDistance = r.reduce((s: number, rt: Row) => s + +rt.total_distance_km, 0);
    const totalEmissions = r.reduce((s: number, rt: Row) => s + +rt.emissions_kg_co2, 0);
    const totalConsumption = r.reduce((s: number, rt: Row) => {
      const veh = v.find((vv: Row) => vv.id === rt.vehicle_id);
      if (!veh || veh.fuel_type === 'electric' || +veh.consumption_km_per_l === 0) return s;
      return s + +rt.total_distance_km / +veh.consumption_km_per_l;
    }, 0);
    const completed = o.filter((oo: Row) => oo.status === 'delivered').length;

    return {
      totalEmissionsKgCO2: +totalEmissions.toFixed(1),
      totalDistanceKm: +totalDistance.toFixed(1),
      estimatedConsumptionL: +totalConsumption.toFixed(1),
      deliveriesCompleted: completed,
      emissionsByRoute: r.map((rt: Row) => ({ routeCode: rt.code, emissions: +rt.emissions_kg_co2 })),
      emissionsByVehicle: v
        .filter((vv: Row) => vv.fuel_type !== 'electric')
        .map((vv: Row) => {
          const emissions = r.filter((rt: Row) => rt.vehicle_id === vv.id)
            .reduce((sum, route) => sum + +route.emissions_kg_co2, 0);
          return { vehicleCode: vv.code, emissions: +emissions.toFixed(1) };
        }),
      efficiencyIndex: +(completed / (totalDistance || 1)).toFixed(2),
    };
  },

  async getCostAnalysis(): Promise<CostAnalysis> {
    const [routes, vehicles, orders] = await Promise.all([
      request<Row[]>('/routes/'), request<Row[]>('/vehicles/'), request<Row[]>('/orders/'),
    ]);

    const r = routes || [];
    const v = vehicles || [];
    const o = orders || [];

    const dieselPricePerL = 16.5; // PEN per liter (Peru 2026 estimate)
    const maintenanceCostPerKm = 0.85; // PEN per km

    const fuelCostPerRoute = r.map((rt: Row) => {
      const veh = v.find((vv: Row) => vv.id === rt.vehicle_id);
      const consumption = veh && veh.fuel_type !== 'electric' && +veh.consumption_km_per_l > 0
        ? +rt.total_distance_km / +veh.consumption_km_per_l
        : 0;
      const fuelType = veh?.fuel_type || 'diesel';
      const pricePerL = fuelType === 'gasoline' ? 18.5 : fuelType === 'diesel' ? 16.5 : fuelType === 'cng' ? 8.5 : 16.5;
      return { routeCode: rt.code, cost: +(consumption * pricePerL).toFixed(2) };
    });

    const fuelCostPerVehicle = v.map((vv: Row) => {
      const distance = r.filter((rt: Row) => rt.vehicle_id === vv.id)
        .reduce((sum, route) => sum + +route.total_distance_km, 0);
      const consumption = vv.fuel_type !== 'electric' && +vv.consumption_km_per_l > 0
        ? distance / +vv.consumption_km_per_l
        : 0;
      const pricePerL = vv.fuel_type === 'gasoline' ? 18.5 : vv.fuel_type === 'diesel' ? 16.5 : vv.fuel_type === 'cng' ? 8.5 : 16.5;
      return { vehicleCode: vv.code, cost: +(consumption * pricePerL).toFixed(2), fuelType: vv.fuel_type };
    });

    const fuelCostTotal = fuelCostPerRoute.reduce((s, f) => s + f.cost, 0);
    const totalDistance = r.reduce((s, rt) => s + +rt.total_distance_km, 0);
    const maintenanceCostTotal = +(totalDistance * maintenanceCostPerKm).toFixed(2);
    const totalOperationalCost = +(fuelCostTotal + maintenanceCostTotal).toFixed(2);
    const completed = o.filter((oo: Row) => oo.status === 'delivered').length;

    return {
      fuelCostTotal: +fuelCostTotal.toFixed(2),
      fuelCostPerRoute,
      fuelCostPerVehicle,
      maintenanceCostTotal,
      totalOperationalCost,
      costPerDelivery: completed > 0 ? +(totalOperationalCost / completed).toFixed(2) : 0,
      costPerKm: totalDistance > 0 ? +(totalOperationalCost / totalDistance).toFixed(2) : 0,
      dieselPricePerL,
      maintenanceCostPerKm,
    };
  },

  async getEmissionsBreakdown(): Promise<EmissionsBreakdown> {
    const [routes, vehicles] = await Promise.all([request<Row[]>('/routes/'), request<Row[]>('/vehicles/')]);

    const r = routes || [];
    const v = vehicles || [];

    const totalEmissionsKg = r.reduce((s, rt) => s + +rt.emissions_kg_co2, 0);
    const totalEmissionsTons = +(totalEmissionsKg / 1000).toFixed(3);

    // Emissions by fuel type
    const fuelMap: Record<string, number> = {};
    r.forEach((rt: Row) => {
      const veh = v.find((vv: Row) => vv.id === rt.vehicle_id);
      const ft = veh?.fuel_type || 'diesel';
      const label = ft === 'diesel' ? 'Diésel' : ft === 'gasoline' ? 'Gasolina' : ft === 'hybrid' ? 'Híbrido' : ft === 'electric' ? 'Eléctrico' : 'GNC';
      fuelMap[label] = (fuelMap[label] || 0) + +rt.emissions_kg_co2;
    });
    const totalForPct = Object.values(fuelMap).reduce((s, n) => s + n, 0) || 1;
    const emissionsByFuelType = Object.entries(fuelMap).map(([fuelType, emissions]) => ({
      fuelType,
      emissions: +emissions.toFixed(1),
      percentage: +((emissions / totalForPct) * 100).toFixed(1),
    }));

    // Emissions by district
    const districtMap: Record<string, number> = {};
    r.forEach((rt: Row) => {
      (rt.stops || []).forEach((s: Row) => {
        districtMap[s.district] = (districtMap[s.district] || 0) + (+rt.emissions_kg_co2 / (rt.stops?.length || 1));
      });
    });
    const emissionsByDistrict = Object.entries(districtMap)
      .map(([district, emissions]) => ({ district, emissions: +emissions.toFixed(1) }))
      .sort((a, b) => b.emissions - a.emissions);

    const emissionsByRoute = r.map((rt: Row) => ({
      routeCode: rt.code,
      emissions: +rt.emissions_kg_co2,
      distance: +rt.total_distance_km,
    }));

    // Savings: electric vs diesel average, hybrid vs diesel average
    const dieselAvgEmissionsPerKm = 0.295;
    const electricRoutes = r.filter((rt: Row) => {
      const veh = v.find((vv: Row) => vv.id === rt.vehicle_id);
      return veh?.fuel_type === 'electric';
    });
    const hybridRoutes = r.filter((rt: Row) => {
      const veh = v.find((vv: Row) => vv.id === rt.vehicle_id);
      return veh?.fuel_type === 'hybrid';
    });
    const electricVehicleSavings = electricRoutes.reduce((s, rt) =>
      s + +rt.total_distance_km * dieselAvgEmissionsPerKm, 0);
    const hybridVehicleSavings = hybridRoutes.reduce((s, rt) => {
      const veh = v.find((vv: Row) => vv.id === rt.vehicle_id);
      const actualPerKm = veh ? +veh.emissions_per_km : 0.165;
      return s + +rt.total_distance_km * (dieselAvgEmissionsPerKm - actualPerKm);
    }, 0);

    // Equivalencies: 1 tree absorbs ~22 kg CO2/year
    const equivalentTreesNeeded = Math.ceil(totalEmissionsKg / 22);
    // 1 car emits ~120 kg CO2/100km => 1.2 kg/km
    const equivalentCarsOffRoad = +(totalEmissionsKg / 120).toFixed(1);

    return {
      totalEmissionsKgCO2: +totalEmissionsKg.toFixed(1),
      totalEmissionsTonsCO2: totalEmissionsTons,
      emissionsByFuelType,
      emissionsByDistrict,
      emissionsByRoute,
      electricVehicleSavings: +electricVehicleSavings.toFixed(1),
      hybridVehicleSavings: +hybridVehicleSavings.toFixed(1),
      equivalentTreesNeeded,
      equivalentCarsOffRoad,
    };
  },

  async getCarbonCompensationPlan(): Promise<CarbonCompensationPlan> {
    const routes = await request<Row[]>('/routes/');
    const r = routes || [];
    const totalEmissionsKg = r.reduce((s, rt) => s + +rt.emissions_kg_co2, 0);
    const totalEmissionsTons = +(totalEmissionsKg / 1000).toFixed(3);
    const compensationTargetTons = +(totalEmissionsTons * 0.8).toFixed(3); // 80% target

    const initiatives: CarbonInitiative[] = [
      {
        id: 'reforestacion-lomas',
        name: 'Reforestación Lomas de Lachay',
        description: 'Plantación de 500 árboles nativos en áreas degradadas de las Lomas de Lachay, Lima. Cada árbol absorbe aproximadamente 22 kg CO₂/año.',
        type: 'reforestation',
        compensationTons: +(0.022 * 500).toFixed(3),
        costUSD: 2500,
        costPerTon: +(2500 / (0.022 * 500)).toFixed(2),
        timeframe: '12 meses',
        impact: 'high',
      },
      {
        id: 'paneles-solares-deposito',
        name: 'Paneles solares en almacén central',
        description: 'Instalación de 50 kWp en paneles fotovoltaicos en el depósito de DistriRápido para alimentar operaciones de carga de vehículos eléctricos.',
        type: 'renewable_energy',
        compensationTons: +(totalEmissionsTons * 0.15).toFixed(3),
        costUSD: 45000,
        costPerTon: +(45000 / (totalEmissionsTons * 0.15 || 1)).toFixed(2),
        timeframe: '6 meses',
        impact: 'high',
      },
      {
        id: 'renovacion-flota-hibrida',
        name: 'Renovación de flota a vehículos híbridos',
        description: 'Reemplazo de 3 vehículos diésel por híbridos, reduciendo emisiones en approximately 45% por kilómetro recorrido.',
        type: 'fleet_renewal',
        compensationTons: +(totalEmissionsTons * 0.25).toFixed(3),
        costUSD: 180000,
        costPerTon: +(180000 / (totalEmissionsTons * 0.25 || 1)).toFixed(2),
        timeframe: '18 meses',
        impact: 'high',
      },
      {
        id: 'optimizacion-rutas-vrp',
        name: 'Optimización de rutas con algoritmo VRP',
        description: 'Implementación del algoritmo de ahorros (Clarke-Wright) para reducir distancia total recorrida en approximately 30%. Referencia: literatura VRP.',
        type: 'route_optimization',
        compensationTons: +(totalEmissionsTons * 0.30).toFixed(3),
        costUSD: 12000,
        costPerTon: +(12000 / (totalEmissionsTons * 0.30 || 1)).toFixed(2),
        timeframe: '3 meses',
        impact: 'medium',
      },
      {
        id: 'creditos-carbon-peru',
        name: 'Compra de créditos de carbono certificados',
        description: 'Adquisición de créditos REDD+ de proyectos certificados en la Amazonía peruana (Madre de Dios). Certificación VCS/Verra.',
        type: 'carbon_credits',
        compensationTons: +(totalEmissionsTons * 0.10).toFixed(3),
        costUSD: +(totalEmissionsTons * 0.10 * 15).toFixed(2), // $15/ton
        costPerTon: 15,
        timeframe: 'Inmediato',
        impact: 'medium',
      },
    ];

    const totalCompensationTons = initiatives.reduce((s, i) => s + i.compensationTons, 0);
    const totalInvestmentUSD = initiatives.reduce((s, i) => s + i.costUSD, 0);
    const remainingEmissionsTons = +(totalEmissionsTons - totalCompensationTons).toFixed(3);
    const netEmissionsTons = Math.max(0, remainingEmissionsTons);
    const compensationPercentage = totalEmissionsTons > 0
      ? +((totalCompensationTons / totalEmissionsTons) * 100).toFixed(1)
      : 0;

    return {
      totalEmissionsTonsCO2: totalEmissionsTons,
      compensationTargetTons,
      compensationPercentage,
      initiatives,
      totalCompensationTons: +totalCompensationTons.toFixed(3),
      totalInvestmentUSD: +totalInvestmentUSD.toFixed(2),
      remainingEmissionsTons,
      netEmissionsTons,
    };
  },
};

// ---- Notifications ----
export const notificationService = {
  async getAll(): Promise<Notification[]> {
    return (await request<Row[]>('/notifications/')).map(mapNotification);
  },
  async markAsRead(id: string): Promise<void> { await request(`/notifications/${id}/read`, 'PUT'); },
  async markAllAsRead(): Promise<void> { await request('/notifications/read', 'PUT'); },
};
