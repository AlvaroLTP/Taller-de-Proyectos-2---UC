import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type {
  User,
  Vehicle,
  Driver,
  Client,
  Order,
  Route,
  OperationalParameters,
  Notification,
  SustainabilityMetrics,
  DriverSchedule,
  VehicleSchedule,
} from '@/types';
import * as api from '@/services/api';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  vehicles: Vehicle[];
  drivers: Driver[];
  clients: Client[];
  orders: Order[];
  routes: Route[];
  parameters: OperationalParameters;
  notifications: Notification[];
  sustainability: SustainabilityMetrics | null;
  driverSchedules: DriverSchedule[];
  vehicleSchedules: VehicleSchedule[];

  loading: boolean;
  refreshAll: () => Promise<void>;

  // Vehicle actions
  addVehicle: (v: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  toggleVehicleAvailability: (id: string) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;

  // Driver actions
  addDriver: (d: Omit<Driver, 'id'>) => Promise<void>;
  updateDriver: (id: string, updates: Partial<Driver>) => Promise<void>;
  toggleDriverAvailability: (id: string) => Promise<void>;
  assignVehicleToDriver: (driverId: string, vehicleId: string) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;

  // Client actions
  addClient: (c: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  // Order actions
  addOrder: (o: Omit<Order, 'id'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status'], extras?: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  // Route actions
  generatePlan: (date: string, orderIds: string[], driverIds: string[], vehicleIds: string[]) => Promise<Route[]>;
  updateRouteStatus: (id: string, status: Route['status']) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;

  // Parameters
  updateParameters: (updates: Partial<OperationalParameters>) => Promise<void>;

  // Notifications
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [parameters, setParameters] = useState<OperationalParameters>({} as OperationalParameters);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sustainability, setSustainability] = useState<SustainabilityMetrics | null>(null);
  const [driverSchedules, setDriverSchedules] = useState<DriverSchedule[]>([]);
  const [vehicleSchedules] = useState<VehicleSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [v, d, c, o, r, p, n, s, ds] = await Promise.all([
        api.vehicleService.getAll(),
        api.driverService.getAll(),
        api.clientService.getAll(),
        api.orderService.getAll(),
        api.routeService.getAll(),
        api.parameterService.get(),
        api.notificationService.getAll(),
        api.sustainabilityService.getMetrics(),
        api.driverService.getSchedules(),
      ]);
      setVehicles(v);
      setDrivers(d);
      setClients(c);
      setOrders(o);
      setRoutes(r);
      setParameters(p);
      setNotifications(n);
      setSustainability(s);
      setDriverSchedules(ds);
    } catch (err) {
      console.error('Error loading data:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Vehicle actions
  const addVehicle = useCallback(async (v: Omit<Vehicle, 'id'>) => {
    await api.vehicleService.create(v);
    const all = await api.vehicleService.getAll();
    setVehicles(all);
  }, []);
  const updateVehicle = useCallback(async (id: string, updates: Partial<Vehicle>) => {
    await api.vehicleService.update(id, updates);
    const all = await api.vehicleService.getAll();
    setVehicles(all);
  }, []);
  const toggleVehicleAvailability = useCallback(async (id: string) => {
    await api.vehicleService.toggleAvailability(id);
    const all = await api.vehicleService.getAll();
    setVehicles(all);
  }, []);
  const deleteVehicle = useCallback(async (id: string) => {
    await api.vehicleService.delete(id);
    const all = await api.vehicleService.getAll();
    setVehicles(all);
  }, []);

  // Driver actions
  const addDriver = useCallback(async (d: Omit<Driver, 'id'>) => {
    await api.driverService.create(d);
    const all = await api.driverService.getAll();
    setDrivers(all);
  }, []);
  const updateDriver = useCallback(async (id: string, updates: Partial<Driver>) => {
    await api.driverService.update(id, updates);
    const all = await api.driverService.getAll();
    setDrivers(all);
  }, []);
  const toggleDriverAvailability = useCallback(async (id: string) => {
    await api.driverService.toggleAvailability(id);
    const all = await api.driverService.getAll();
    setDrivers(all);
  }, []);
  const assignVehicleToDriver = useCallback(async (driverId: string, vehicleId: string) => {
    await api.driverService.assignVehicle(driverId, vehicleId);
    const [d, v] = await Promise.all([api.driverService.getAll(), api.vehicleService.getAll()]);
    setDrivers(d);
    setVehicles(v);
  }, []);
  const deleteDriver = useCallback(async (id: string) => {
    await api.driverService.delete(id);
    const all = await api.driverService.getAll();
    setDrivers(all);
  }, []);

  // Client actions
  const addClient = useCallback(async (c: Omit<Client, 'id'>) => {
    await api.clientService.create(c);
    const all = await api.clientService.getAll();
    setClients(all);
  }, []);
  const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
    await api.clientService.update(id, updates);
    const all = await api.clientService.getAll();
    setClients(all);
  }, []);
  const deleteClient = useCallback(async (id: string) => {
    await api.clientService.delete(id);
    const all = await api.clientService.getAll();
    setClients(all);
  }, []);

  // Order actions
  const addOrder = useCallback(async (o: Omit<Order, 'id'>) => {
    await api.orderService.create(o);
    const all = await api.orderService.getAll();
    setOrders(all);
  }, []);
  const updateOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    await api.orderService.update(id, updates);
    const all = await api.orderService.getAll();
    setOrders(all);
  }, []);
  const updateOrderStatus = useCallback(async (id: string, status: Order['status'], extras?: Partial<Order>) => {
    await api.orderService.updateStatus(id, status, extras);
    const all = await api.orderService.getAll();
    setOrders(all);
    const metrics = await api.sustainabilityService.getMetrics();
    setSustainability(metrics);
  }, []);
  const deleteOrder = useCallback(async (id: string) => {
    await api.orderService.delete(id);
    const all = await api.orderService.getAll();
    setOrders(all);
  }, []);

  // Route actions
  const generatePlan = useCallback(async (date: string, orderIds: string[], driverIds: string[], vehicleIds: string[]) => {
    const newRoutes = await api.routeService.generatePlan(date, orderIds, driverIds, vehicleIds);
    const allRoutes = await api.routeService.getAll();
    setRoutes(allRoutes);
    const allOrders = await api.orderService.getAll();
    setOrders(allOrders);
    const metrics = await api.sustainabilityService.getMetrics();
    setSustainability(metrics);
    return newRoutes;
  }, []);
  const updateRouteStatus = useCallback(async (id: string, status: Route['status']) => {
    await api.routeService.updateStatus(id, status);
    const all = await api.routeService.getAll();
    setRoutes(all);
    const allOrders = await api.orderService.getAll();
    setOrders(allOrders);
  }, []);
  const deleteRoute = useCallback(async (id: string) => {
    await api.routeService.delete(id);
    const all = await api.routeService.getAll();
    setRoutes(all);
  }, []);

  // Parameters
  const updateParameters = useCallback(async (updates: Partial<OperationalParameters>) => {
    await api.parameterService.update(updates);
    const p = await api.parameterService.get();
    setParameters(p);
  }, []);

  // Notifications
  const markNotificationRead = useCallback(async (id: string) => {
    await api.notificationService.markAsRead(id);
    const all = await api.notificationService.getAll();
    setNotifications(all);
  }, []);
  const markAllNotificationsRead = useCallback(async () => {
    await api.notificationService.markAllAsRead();
    const all = await api.notificationService.getAll();
    setNotifications(all);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        vehicles,
        drivers,
        clients,
        orders,
        routes,
        parameters,
        notifications,
        sustainability,
        driverSchedules,
        vehicleSchedules,
        loading,
        refreshAll,
        addVehicle,
        updateVehicle,
        toggleVehicleAvailability,
        deleteVehicle,
        addDriver,
        updateDriver,
        toggleDriverAvailability,
        assignVehicleToDriver,
        deleteDriver,
        addClient,
        updateClient,
        deleteClient,
        addOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,
        generatePlan,
        updateRouteStatus,
        deleteRoute,
        updateParameters,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
