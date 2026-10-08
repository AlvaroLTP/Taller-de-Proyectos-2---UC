import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from '@/store/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginScreen } from '@/pages/LoginScreen';

// Admin/Operator pages
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { VehiclesPage } from '@/pages/admin/VehiclesPage';
import { DriversPage } from '@/pages/admin/DriversPage';
import { ClientsPage } from '@/pages/admin/ClientsPage';
import { OrdersPage } from '@/pages/admin/OrdersPage';
import { AvailabilityPage } from '@/pages/admin/AvailabilityPage';
import { ParametersPage } from '@/pages/admin/ParametersPage';
import { RestrictionsPage } from '@/pages/admin/RestrictionsPage';
import { PlanningPage } from '@/pages/admin/PlanningPage';
import { RoutesPage } from '@/pages/admin/RoutesPage';
import { RouteDetailPage } from '@/pages/admin/RouteDetailPage';
import { DispatchPage } from '@/pages/admin/DispatchPage';
import { TrackingPage } from '@/pages/admin/TrackingPage';
import { SustainabilityPage } from '@/pages/admin/SustainabilityPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';

// Driver pages
import { DriverDashboardPage } from '@/pages/driver/DriverDashboardPage';
import { MyRoutePage } from '@/pages/driver/MyRoutePage';
import { MyDeliveriesPage } from '@/pages/driver/MyDeliveriesPage';
import { DriverHistoryPage } from '@/pages/driver/DriverHistoryPage';
import { MyVehiclePage } from '@/pages/driver/MyVehiclePage';
import { DriverProfilePage } from '@/pages/driver/DriverProfilePage';

import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <LoginScreen />;
  }

  const isDriver = currentUser.role === 'driver';

  return (
    <>
      <ScrollToTop />
      <MainLayout>
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
