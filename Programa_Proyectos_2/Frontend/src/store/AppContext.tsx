import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
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
import { authService } from '@/services/auth';
import { supabase } from '@/services/supabase';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  authReady: boolean;

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
  loadError: string | null;
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
  const [currentUser, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
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
  const [loadError, setLoadError] = useState<string | null>(null);

  const identity = useRef('');
  const loadVersion = useRef(0);
  const setCurrentUser = useCallback((user: User | null) => {
    const key = user ? `${user.id}:${user.role}:${user.driverId || ''}` : '';
    if (identity.current !== key || !user) {
      identity.current = key;
      loadVersion.current += 1;
      setVehicles([]); setDrivers([]); setClients([]); setOrders([]); setRoutes([]);
      setNotifications([]); setSustainability(null); setDriverSchedules([]);
      setParameters({} as OperationalParameters); setLoadError(null);
      setLoading(Boolean(user));
    }
    setUser(user);
  }, []);

  const refreshAll = useCallback(async () => {
    const expected = identity.current;
    if (!expected) return;
    const version = ++loadVersion.current;
    setLoading(true);
    setLoadError(null);
    try {
      const [v, d, c, o, r, p, n] = await Promise.all([
        api.vehicleService.getAll(),
        api.driverService.getAll(),
        api.clientService.getAll(),
        api.orderService.getAll(),
        api.routeService.getAll(),
        api.parameterService.get(),
        api.notificationService.getAll(),
      ]);
      const s = await api.sustainabilityService.getMetrics({ routes: r, vehicles: v, orders: o });
      const ds = d.map(driver => ({ driverId: driver.id, shiftStart: driver.shiftStart, shiftEnd: driver.shiftEnd, status: driver.status, available: driver.available }));
      if (expected !== identity.current || version !== loadVersion.current) return;
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
      if (expected !== identity.current || version !== loadVersion.current) return;
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setLoadError(`No se pudieron cargar los datos: ${msg}. Verifique su conexión y reintente.`);
    }
    if (version === loadVersion.current) setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    let revision = 0;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const restore = async () => {
      const version = ++revision;
      try {
        const user = await authService.getCurrentUser();
        if (active && version === revision) setCurrentUser(user);
      } catch {
        if (active && version === revision) setCurrentUser(null);
      } finally {
        if (active && version === revision) setAuthReady(true);
      }
    };
    void restore();
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'SIGNED_OUT' || !session?.user) {
        revision += 1;
        setCurrentUser(null);
        setAuthReady(true);
      } else {
        // Supabase callbacks must return before another auth request starts.
        const timer = setTimeout(() => { timers.delete(timer); if (active) void restore(); }, 0);
        timers.add(timer);
      }
    });
    return () => { active = false; revision += 1; timers.forEach(clearTimeout); sub.subscription.unsubscribe(); };
  }, [setCurrentUser]);

  useEffect(() => {
    if (currentUser?.id && authReady) void refreshAll();
  }, [currentUser?.id, currentUser?.role, currentUser?.driverId, authReady, refreshAll]);

  // Vehicle actions
  const addVehicle = useCallback(async (v: Omit<Vehicle, 'id'>) => {
    const account = identity.current;
    await api.vehicleService.create(v);
    const all = await api.vehicleService.getAll();
    if (identity.current !== account) return;
    setVehicles(all);
  }, []);
  const updateVehicle = useCallback(async (id: string, updates: Partial<Vehicle>) => {
    const account = identity.current;
    await api.vehicleService.update(id, updates);
    const all = await api.vehicleService.getAll();
    if (identity.current !== account) return;
    setVehicles(all);
  }, []);
  const toggleVehicleAvailability = useCallback(async (id: string) => {
    const account = identity.current;
    await api.vehicleService.toggleAvailability(id);
    const all = await api.vehicleService.getAll();
    if (identity.current !== account) return;
    setVehicles(all);
  }, []);
  const deleteVehicle = useCallback(async (id: string) => {
    const account = identity.current;
    await api.vehicleService.delete(id);
    const all = await api.vehicleService.getAll();
    if (identity.current !== account) return;
    setVehicles(all);
  }, []);

  // Driver actions
  const addDriver = useCallback(async (d: Omit<Driver, 'id'>) => {
    const account = identity.current;
    await api.driverService.create(d);
    const all = await api.driverService.getAll();
    if (identity.current !== account) return;
    setDrivers(all);
  }, []);
  const updateDriver = useCallback(async (id: string, updates: Partial<Driver>) => {
    const account = identity.current;
    await api.driverService.update(id, updates);
    const all = await api.driverService.getAll();
    if (identity.current !== account) return;
    setDrivers(all);
  }, []);
  const toggleDriverAvailability = useCallback(async (id: string) => {
    const account = identity.current;
    await api.driverService.toggleAvailability(id);
    const all = await api.driverService.getAll();
    if (identity.current !== account) return;
    setDrivers(all);
  }, []);
  const assignVehicleToDriver = useCallback(async (driverId: string, vehicleId: string) => {
    const account = identity.current;
    await api.driverService.assignVehicle(driverId, vehicleId);
    const [d, v] = await Promise.all([api.driverService.getAll(), api.vehicleService.getAll()]);
    if (identity.current !== account) return;
    setDrivers(d);
    if (identity.current !== account) return;
    setVehicles(v);
  }, []);
  const deleteDriver = useCallback(async (id: string) => {
    const account = identity.current;
    await api.driverService.delete(id);
    const all = await api.driverService.getAll();
    if (identity.current !== account) return;
    setDrivers(all);
  }, []);

  // Client actions
  const addClient = useCallback(async (c: Omit<Client, 'id'>) => {
    const account = identity.current;
    await api.clientService.create(c);
    const all = await api.clientService.getAll();
    if (identity.current !== account) return;
    setClients(all);
  }, []);
  const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
    const account = identity.current;
    await api.clientService.update(id, updates);
    const all = await api.clientService.getAll();
    if (identity.current !== account) return;
    setClients(all);
  }, []);
  const deleteClient = useCallback(async (id: string) => {
    const account = identity.current;
    await api.clientService.delete(id);
    const all = await api.clientService.getAll();
    if (identity.current !== account) return;
    setClients(all);
  }, []);

  // Order actions
  const addOrder = useCallback(async (o: Omit<Order, 'id'>) => {
    const account = identity.current;
    await api.orderService.create(o);
    const all = await api.orderService.getAll();
    if (identity.current !== account) return;
    setOrders(all);
  }, []);
  const updateOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    const account = identity.current;
    await api.orderService.update(id, updates);
    const all = await api.orderService.getAll();
    if (identity.current !== account) return;
    setOrders(all);
  }, []);
  const updateOrderStatus = useCallback(async (id: string, status: Order['status'], extras?: Partial<Order>) => {
    const account = identity.current;
    await api.orderService.updateStatus(id, status, extras);
    const all = await api.orderService.getAll();
    if (identity.current !== account) return;
    setOrders(all);
    const metrics = await api.sustainabilityService.getMetrics();
    if (identity.current !== account) return;
    setSustainability(metrics);
  }, []);
  const deleteOrder = useCallback(async (id: string) => {
    const account = identity.current;
    await api.orderService.delete(id);
    const all = await api.orderService.getAll();
    if (identity.current !== account) return;
    setOrders(all);
  }, []);

  // Route actions
  const generatePlan = useCallback(async (date: string, orderIds: string[], driverIds: string[], vehicleIds: string[]) => {
    const account = identity.current;
    const newRoutes = await api.routeService.generatePlan(date, orderIds, driverIds, vehicleIds);
    const allRoutes = await api.routeService.getAll();
    if (identity.current !== account) return [];
    setRoutes(allRoutes);
    const allOrders = await api.orderService.getAll();
    if (identity.current !== account) return [];
    setOrders(allOrders);
    const metrics = await api.sustainabilityService.getMetrics();
    if (identity.current !== account) return [];
    setSustainability(metrics);
    return newRoutes;
  }, []);
  const updateRouteStatus = useCallback(async (id: string, status: Route['status']) => {
    const account = identity.current;
    await api.routeService.updateStatus(id, status);
    const all = await api.routeService.getAll();
    if (identity.current !== account) return;
    setRoutes(all);
    const allOrders = await api.orderService.getAll();
    if (identity.current !== account) return;
    setOrders(allOrders);
  }, []);
  const deleteRoute = useCallback(async (id: string) => {
    const account = identity.current;
    await api.routeService.delete(id);
    const all = await api.routeService.getAll();
    if (identity.current !== account) return;
    setRoutes(all);
  }, []);

  // Parameters
  const updateParameters = useCallback(async (updates: Partial<OperationalParameters>) => {
    const account = identity.current;
    await api.parameterService.update(updates);
    const p = await api.parameterService.get();
    if (identity.current !== account) return;
    setParameters(p);
  }, []);

  // Notifications
  const markNotificationRead = useCallback(async (id: string) => {
    const account = identity.current;
    await api.notificationService.markAsRead(id);
    const all = await api.notificationService.getAll();
    if (identity.current !== account) return;
    setNotifications(all);
  }, []);
  const markAllNotificationsRead = useCallback(async () => {
    const account = identity.current;
    await api.notificationService.markAllAsRead();
    const all = await api.notificationService.getAll();
    if (identity.current !== account) return;
    setNotifications(all);
  }, []);

  const signOut = useCallback(async () => {
    try { await authService.signOut(); } finally { setCurrentUser(null); }
  }, [setCurrentUser]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        signOut,
        authReady,
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
        loadError,
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
