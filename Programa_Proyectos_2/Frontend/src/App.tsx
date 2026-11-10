import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { AppProvider, useApp } from '@/store/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginScreen } from '@/pages/LoginScreen';

const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage').then(({ DashboardPage }) => ({ default: DashboardPage })));
const VehiclesPage = lazy(() => import('@/pages/admin/VehiclesPage').then(({ VehiclesPage }) => ({ default: VehiclesPage })));
const DriversPage = lazy(() => import('@/pages/admin/DriversPage').then(({ DriversPage }) => ({ default: DriversPage })));
const ClientsPage = lazy(() => import('@/pages/admin/ClientsPage').then(({ ClientsPage }) => ({ default: ClientsPage })));
const OrdersPage = lazy(() => import('@/pages/admin/OrdersPage').then(({ OrdersPage }) => ({ default: OrdersPage })));
const AvailabilityPage = lazy(() => import('@/pages/admin/AvailabilityPage').then(({ AvailabilityPage }) => ({ default: AvailabilityPage })));
const ParametersPage = lazy(() => import('@/pages/admin/ParametersPage').then(({ ParametersPage }) => ({ default: ParametersPage })));
const RestrictionsPage = lazy(() => import('@/pages/admin/RestrictionsPage').then(({ RestrictionsPage }) => ({ default: RestrictionsPage })));
const PlanningPage = lazy(() => import('@/pages/admin/PlanningPage').then(({ PlanningPage }) => ({ default: PlanningPage })));
const RoutesPage = lazy(() => import('@/pages/admin/RoutesPage').then(({ RoutesPage }) => ({ default: RoutesPage })));
const RouteDetailPage = lazy(() => import('@/pages/admin/RouteDetailPage').then(({ RouteDetailPage }) => ({ default: RouteDetailPage })));
const DispatchPage = lazy(() => import('@/pages/admin/DispatchPage').then(({ DispatchPage }) => ({ default: DispatchPage })));
const TrackingPage = lazy(() => import('@/pages/admin/TrackingPage').then(({ TrackingPage }) => ({ default: TrackingPage })));
const SustainabilityPage = lazy(() => import('@/pages/admin/SustainabilityPage').then(({ SustainabilityPage }) => ({ default: SustainabilityPage })));
const MonitoringPage = lazy(() => import('@/pages/admin/MonitoringPage').then(({ MonitoringPage }) => ({ default: MonitoringPage })));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage').then(({ SettingsPage }) => ({ default: SettingsPage })));
const DriverDashboardPage = lazy(() => import('@/pages/driver/DriverDashboardPage').then(({ DriverDashboardPage }) => ({ default: DriverDashboardPage })));
const MyRoutePage = lazy(() => import('@/pages/driver/MyRoutePage').then(({ MyRoutePage }) => ({ default: MyRoutePage })));
const MyDeliveriesPage = lazy(() => import('@/pages/driver/MyDeliveriesPage').then(({ MyDeliveriesPage }) => ({ default: MyDeliveriesPage })));
const DriverHistoryPage = lazy(() => import('@/pages/driver/DriverHistoryPage').then(({ DriverHistoryPage }) => ({ default: DriverHistoryPage })));
const MyVehiclePage = lazy(() => import('@/pages/driver/MyVehiclePage').then(({ MyVehiclePage }) => ({ default: MyVehiclePage })));
const DriverProfilePage = lazy(() => import('@/pages/driver/DriverProfilePage').then(({ DriverProfilePage }) => ({ default: DriverProfilePage })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const { currentUser, authReady } = useApp();

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  const isDriver = currentUser.role === 'driver';
  const isStaff = currentUser.role === 'admin' || currentUser.role === 'operator';
  if (!isDriver && !isStaff) return <LoginScreen />;

  return (
    <>
      <ScrollToTop />
      <MainLayout>
        <Suspense fallback={<div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" /></div>}>
          <Routes>
          {/* Shared */}
          <Route path="/dashboard" element={isDriver ? <DriverDashboardPage /> : <DashboardPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />

          {/* Admin & Operator */}
          {isStaff && (
            <>
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/drivers" element={<DriversPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/availability" element={<AvailabilityPage />} />
              <Route path="/parameters" element={<ParametersPage />} />
              <Route path="/restrictions" element={<RestrictionsPage />} />
              <Route path="/planning" element={<PlanningPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/routes/:id" element={<RouteDetailPage />} />
              <Route path="/monitoring" element={<MonitoringPage />} />
              <Route path="/dispatch" element={<DispatchPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </>
          )}

          {/* Driver */}
          {isDriver && (
            <>
              <Route path="/my-route" element={<MyRoutePage />} />
              <Route path="/my-deliveries" element={<MyDeliveriesPage />} />
              <Route path="/history" element={<DriverHistoryPage />} />
              <Route path="/my-vehicle" element={<MyVehiclePage />} />
              <Route path="/profile" element={<DriverProfilePage />} />
            </>
          )}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
