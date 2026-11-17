import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from '@/store/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginScreen } from '@/pages/LoginScreen';

// Lazy-loaded pages for code-splitting (EN-001)
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const VehiclesPage = lazy(() => import('@/pages/admin/VehiclesPage').then((m) => ({ default: m.VehiclesPage })));
const DriversPage = lazy(() => import('@/pages/admin/DriversPage').then((m) => ({ default: m.DriversPage })));
const ClientsPage = lazy(() => import('@/pages/admin/ClientsPage').then((m) => ({ default: m.ClientsPage })));
const OrdersPage = lazy(() => import('@/pages/admin/OrdersPage').then((m) => ({ default: m.OrdersPage })));
const AvailabilityPage = lazy(() => import('@/pages/admin/AvailabilityPage').then((m) => ({ default: m.AvailabilityPage })));
const ParametersPage = lazy(() => import('@/pages/admin/ParametersPage').then((m) => ({ default: m.ParametersPage })));
const RestrictionsPage = lazy(() => import('@/pages/admin/RestrictionsPage').then((m) => ({ default: m.RestrictionsPage })));
const PlanningPage = lazy(() => import('@/pages/admin/PlanningPage').then((m) => ({ default: m.PlanningPage })));
const RoutesPage = lazy(() => import('@/pages/admin/RoutesPage').then((m) => ({ default: m.RoutesPage })));
const RouteDetailPage = lazy(() => import('@/pages/admin/RouteDetailPage').then((m) => ({ default: m.RouteDetailPage })));
const DispatchPage = lazy(() => import('@/pages/admin/DispatchPage').then((m) => ({ default: m.DispatchPage })));
const TrackingPage = lazy(() => import('@/pages/admin/TrackingPage').then((m) => ({ default: m.TrackingPage })));
const SustainabilityPage = lazy(() => import('@/pages/admin/SustainabilityPage').then((m) => ({ default: m.SustainabilityPage })));
const MonitoringPage = lazy(() => import('@/pages/admin/MonitoringPage').then((m) => ({ default: m.MonitoringPage })));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage').then((m) => ({ default: m.SettingsPage })));

const DriverDashboardPage = lazy(() => import('@/pages/driver/DriverDashboardPage').then((m) => ({ default: m.DriverDashboardPage })));
const MyRoutePage = lazy(() => import('@/pages/driver/MyRoutePage').then((m) => ({ default: m.MyRoutePage })));
const MyDeliveriesPage = lazy(() => import('@/pages/driver/MyDeliveriesPage').then((m) => ({ default: m.MyDeliveriesPage })));
const DriverHistoryPage = lazy(() => import('@/pages/driver/DriverHistoryPage').then((m) => ({ default: m.DriverHistoryPage })));
const MyVehiclePage = lazy(() => import('@/pages/driver/MyVehiclePage').then((m) => ({ default: m.MyVehiclePage })));
const DriverProfilePage = lazy(() => import('@/pages/driver/DriverProfilePage').then((m) => ({ default: m.DriverProfilePage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
    </div>
  );
}

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

  return (
    <>
      <ScrollToTop />
      <MainLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Shared */}
            <Route path="/dashboard" element={isDriver ? <DriverDashboardPage /> : <DashboardPage />} />
            <Route path="/sustainability" element={<SustainabilityPage />} />

            {/* Admin & Operator */}
            {!isDriver && (
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
