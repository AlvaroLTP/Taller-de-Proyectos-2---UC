import type {
  Vehicle,
  Driver,
  Client,
  Order,
  Route,
  OperationalParameters,
  SustainabilityMetrics,
  DriverSchedule,
  VehicleSchedule,
  Notification,
} from '@/types';
import {
  mockVehicles,
  mockDrivers,
  mockClients,
  mockOrders,
  mockRoutes,
  mockParameters,
  mockNotifications,
} from '@/data/mockData';

const SIMULATED_LATENCY = 150;

function delay<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), SIMULATED_LATENCY));
}

function deepClone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// ---- Vehicles ----
export const vehicleService = {
  async getAll(): Promise<Vehicle[]> {
    return delay(deepClone(mockVehicles));
  },
  async create(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const newVehicle: Vehicle = { ...vehicle, id: `v${Date.now()}` };
    mockVehicles.push(newVehicle);
    return delay(deepClone(newVehicle));
  },
  async update(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const idx = mockVehicles.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Vehículo no encontrado');
    mockVehicles[idx] = { ...mockVehicles[idx], ...updates };
    return delay(deepClone(mockVehicles[idx]));
  },
  async toggleAvailability(id: string): Promise<Vehicle> {
    const vehicle = mockVehicles.find((v) => v.id === id);
    if (!vehicle) throw new Error('Vehículo no encontrado');
    vehicle.available = !vehicle.available;
    if (vehicle.available && vehicle.status === 'unavailable') {
      vehicle.status = 'available';
    } else if (!vehicle.available && vehicle.status === 'available') {
      vehicle.status = 'unavailable';
    }
    return delay(deepClone(vehicle));
  },
  async delete(id: string): Promise<void> {
    const idx = mockVehicles.findIndex((v) => v.id === id);
    if (idx !== -1) mockVehicles.splice(idx, 1);
    return delay(undefined);
  },
};

// ---- Drivers ----
export const driverService = {
  async getAll(): Promise<Driver[]> {
    return delay(deepClone(mockDrivers));
  },
  async create(driver: Omit<Driver, 'id'>): Promise<Driver> {
    const newDriver: Driver = { ...driver, id: `d${Date.now()}` };
    mockDrivers.push(newDriver);
    return delay(deepClone(newDriver));
  },
  async update(id: string, updates: Partial<Driver>): Promise<Driver> {
    const idx = mockDrivers.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Conductor no encontrado');
    mockDrivers[idx] = { ...mockDrivers[idx], ...updates };
    return delay(deepClone(mockDrivers[idx]));
  },
  async toggleAvailability(id: string): Promise<Driver> {
    const driver = mockDrivers.find((d) => d.id === id);
    if (!driver) throw new Error('Conductor no encontrado');
    driver.available = !driver.available;
    driver.status = driver.available ? 'available' : 'resting';
    return delay(deepClone(driver));
  },
  async assignVehicle(driverId: string, vehicleId: string): Promise<Driver> {
    const driver = mockDrivers.find((d) => d.id === driverId);
    if (!driver) throw new Error('Conductor no encontrado');
    const oldDriver = mockDrivers.find((d) => d.vehicleId === vehicleId && d.id !== driverId);
    if (oldDriver) oldDriver.vehicleId = undefined;
    driver.vehicleId = vehicleId;
    const vehicle = mockVehicles.find((v) => v.id === vehicleId);
    if (vehicle) vehicle.driverId = driverId;
    return delay(deepClone(driver));
  },
  async getSchedules(): Promise<DriverSchedule[]> {
    return delay(
      deepClone(
        mockDrivers.map((d) => ({
          driverId: d.id,
          shiftStart: d.shiftStart,
          shiftEnd: d.shiftEnd,
          status: d.status,
          available: d.available,
        }))
      )
    );
  },
};

// ---- Clients ----
export const clientService = {
  async getAll(): Promise<Client[]> {
    return delay(deepClone(mockClients));
  },
  async create(client: Omit<Client, 'id'>): Promise<Client> {
    const newClient: Client = { ...client, id: `c${Date.now()}` };
    mockClients.push(newClient);
    return delay(deepClone(newClient));
  },
  async update(id: string, updates: Partial<Client>): Promise<Client> {
    const idx = mockClients.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Cliente no encontrado');
    mockClients[idx] = { ...mockClients[idx], ...updates };
    return delay(deepClone(mockClients[idx]));
  },
  async delete(id: string): Promise<void> {
    const idx = mockClients.findIndex((c) => c.id === id);
    if (idx !== -1) mockClients.splice(idx, 1);
    return delay(undefined);
  },
};

// ---- Orders ----
export const orderService = {
  async getAll(): Promise<Order[]> {
    return delay(deepClone(mockOrders));
  },
  async create(order: Omit<Order, 'id'>): Promise<Order> {
    const newOrder: Order = { ...order, id: `o${Date.now()}` };
    mockOrders.push(newOrder);
    return delay(deepClone(newOrder));
  },
  async update(id: string, updates: Partial<Order>): Promise<Order> {
    const idx = mockOrders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('Pedido no encontrado');
    mockOrders[idx] = { ...mockOrders[idx], ...updates };
    return delay(deepClone(mockOrders[idx]));
  },
  async updateStatus(id: string, status: Order['status'], extras?: Partial<Order>): Promise<Order> {
    const order = mockOrders.find((o) => o.id === id);
    if (!order) throw new Error('Pedido no encontrado');
    order.status = status;
    if (extras) Object.assign(order, extras);
    if (status === 'delivered') order.deliveredAt = new Date().toISOString();
    return delay(deepClone(order));
  },
  async delete(id: string): Promise<void> {
    const idx = mockOrders.findIndex((o) => o.id === id);
    if (idx !== -1) mockOrders.splice(idx, 1);
    return delay(undefined);
  },
};

// ---- Routes ----
export const routeService = {
  async getAll(): Promise<Route[]> {
    return delay(deepClone(mockRoutes));
  },
  async getById(id: string): Promise<Route | null> {
    const route = mockRoutes.find((r) => r.id === id);
    return delay(route ? deepClone(route) : null);
  },
  async generatePlan(
    date: string,
    orderIds: string[],
    driverIds: string[],
    vehicleIds: string[]
  ): Promise<Route[]> {
    const orders = mockOrders.filter((o) => orderIds.includes(o.id));
    const drivers = mockDrivers.filter((d) => driverIds.includes(d.id));
    const vehicles = mockVehicles.filter((v) => vehicleIds.includes(v.id));

    const maxPerRoute = 6;
    const newRoutes: Route[] = [];
    const stopBatches: Order[][] = [];
    for (let i = 0; i < orders.length; i += maxPerRoute) {
      stopBatches.push(orders.slice(i, i + maxPerRoute));
    }

    stopBatches.forEach((batch, idx) => {
      const driver = drivers[idx % drivers.length];
      const vehicle = vehicles[idx % vehicles.length];
      if (!driver || !vehicle) return;

      const distance = +(batch.length * 3.5 + Math.random() * 10).toFixed(1);
      const timeMin = Math.round(distance * 4 + batch.length * 10);
      const routeCode = `R-${String(mockRoutes.length + idx + 1).padStart(3, '0')}`;

      const stops = batch.map((o, i) => {
        const client = mockClients.find((c) => c.id === o.clientId);
        o.status = 'planned';
        o.routeId = `r_new_${idx}`;
        o.deliveryOrder = i + 1;
        o.driverId = driver.id;
        return {
          orderId: o.id,
          order: i + 1,
          clientName: client?.name || '',
          address: o.address.street,
          district: o.address.district,
          lat: o.address.lat,
          lng: o.address.lng,
          timeWindow: `${o.timeWindowStart} - ${o.timeWindowEnd}`,
          status: o.status as Order['status'],
        };
      });

      const route: Route = {
        id: `r_new_${idx}`,
        code: routeCode,
        driverId: driver.id,
        vehicleId: vehicle.id,
        date,
        stops,
        totalDistanceKm: distance,
        estimatedTimeMin: timeMin,
        departureTime: driver.shiftStart,
        estimatedArrivalTime: addMinutesToTime(driver.shiftStart, timeMin),
        emissionsKgCO2: +(distance * vehicle.emissionsPerKm).toFixed(1),
        status: 'pending',
        completedDeliveries: 0,
        totalDeliveries: batch.length,
      };
      newRoutes.push(route);
    });

    mockRoutes.push(...newRoutes);

    const vehicleSchedules: VehicleSchedule[] = mockVehicles.map((v) => ({
      vehicleId: v.id,
      shiftStart: '06:00',
      shiftEnd: '14:00',
      status: v.status,
      available: v.available,
    }));

    return delay(deepClone(newRoutes));
  },
  async updateStatus(id: string, status: Route['status']): Promise<Route> {
    const route = mockRoutes.find((r) => r.id === id);
    if (!route) throw new Error('Ruta no encontrada');
    route.status = status;
    if (status === 'in_route') {
      route.stops.forEach((s) => {
        if (s.status === 'planned') s.status = 'in_route';
      });
    }
    return delay(deepClone(route));
  },
};

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

// ---- Parameters ----
export const parameterService = {
  async get(): Promise<OperationalParameters> {
    return delay(deepClone(mockParameters));
  },
  async update(updates: Partial<OperationalParameters>): Promise<OperationalParameters> {
    Object.assign(mockParameters, updates);
    return delay(deepClone(mockParameters));
  },
};

// ---- Sustainability ----
export const sustainabilityService = {
  async getMetrics(): Promise<SustainabilityMetrics> {
    const routes = mockRoutes;
    const totalDistance = routes.reduce((s, r) => s + r.totalDistanceKm, 0);
    const totalEmissions = routes.reduce((s, r) => s + r.emissionsKgCO2, 0);
    const totalConsumption = routes.reduce((s, r) => {
      const v = mockVehicles.find((v) => v.id === r.vehicleId);
      if (!v || v.consumptionKmPerL === 0) return s;
      return s + r.totalDistanceKm / v.consumptionKmPerL;
    }, 0);
    const completed = mockOrders.filter((o) => o.status === 'delivered').length;

    return delay({
      totalEmissionsKgCO2: +totalEmissions.toFixed(1),
      totalDistanceKm: +totalDistance.toFixed(1),
      estimatedConsumptionL: +totalConsumption.toFixed(1),
      deliveriesCompleted: completed,
      emissionsByRoute: routes.map((r) => ({ routeCode: r.code, emissions: r.emissionsKgCO2 })),
      emissionsByVehicle: mockVehicles
        .filter((v) => v.fuelType !== 'electric')
        .map((v) => {
          const route = routes.find((r) => r.vehicleId === v.id);
          return { vehicleCode: v.code, emissions: route ? route.emissionsKgCO2 : 0 };
        }),
      efficiencyIndex: +(completed / (totalDistance || 1)).toFixed(2),
    });
  },
};

// ---- Notifications ----
export const notificationService = {
  async getAll(): Promise<Notification[]> {
    return delay(deepClone(mockNotifications));
  },
  async markAsRead(id: string): Promise<void> {
    const n = mockNotifications.find((n) => n.id === id);
    if (n) n.read = true;
    return delay(undefined);
  },
  async markAllAsRead(): Promise<void> {
    mockNotifications.forEach((n) => (n.read = true));
    return delay(undefined);
  },
};
