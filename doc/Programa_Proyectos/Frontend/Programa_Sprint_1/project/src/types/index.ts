export type UserRole = 'admin' | 'operator' | 'driver';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  driverId?: string;
  avatarInitials: string;
}

export type VehicleStatus = 'available' | 'in_route' | 'maintenance' | 'unavailable';
export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'cng';

export interface Vehicle {
  id: string;
  code: string;
  plate: string;
  type: string;
  brand: string;
  model: string;
  capacityKg: number;
  capacityM3: number;
  consumptionKmPerL: number;
  fuelType: FuelType;
  emissionsPerKm: number;
  status: VehicleStatus;
  available: boolean;
  driverId?: string;
}

export type DriverStatus = 'available' | 'in_route' | 'unavailable' | 'resting';

export interface Driver {
  id: string;
  name: string;
  dni: string;
  phone: string;
  license: string;
  licenseType: string;
  status: DriverStatus;
  available: boolean;
  vehicleId?: string;
  shiftStart: string;
  shiftEnd: string;
  avatarInitials: string;
}

export interface Address {
  street: string;
  reference: string;
  district: string;
  neighborhood: string;
  lat: number;
  lng: number;
  indications: string;
  accessType: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: Address;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

export type OrderStatus =
  | 'pending'
  | 'planned'
  | 'in_route'
  | 'delivered'
  | 'not_delivered'
  | 'cancelled';

export interface DeliveryPreferences {
  preferredTime: string;
  timeWindowStart: string;
  timeWindowEnd: string;
  priority: 'high' | 'medium' | 'low';
  restrictions: string[];
  accessType: string;
  requiresSpecialAttention: boolean;
  noLunchHours: boolean;
  requiresPhoneCoordination: boolean;
  observations: string;
}

export interface Order {
  id: string;
  code: string;
  clientId: string;
  phone: string;
  address: Address;
  deliveryDate: string;
  timeWindowStart: string;
  timeWindowEnd: string;
  priority: 'high' | 'medium' | 'low';
  weightKg: number;
  volumeM3: number;
  productType: string;
  observations: string;
  status: OrderStatus;
  preferences: DeliveryPreferences;
  routeId?: string;
  deliveryOrder?: number;
  driverId?: string;
  incidentReason?: string;
  incidentNotes?: string;
  deliveredAt?: string;
}

export type RouteStatus =
  | 'pending'
  | 'preparing'
  | 'in_route'
  | 'finished'
  | 'with_incidents';

export interface RouteStop {
  orderId: string;
  order: number;
  clientName: string;
  address: string;
  district: string;
  lat: number;
  lng: number;
  timeWindow: string;
  status: OrderStatus;
}

export interface Route {
  id: string;
  code: string;
  driverId: string;
  vehicleId: string;
  date: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  estimatedTimeMin: number;
  departureTime: string;
  estimatedArrivalTime: string;
  emissionsKgCO2: number;
  status: RouteStatus;
  completedDeliveries: number;
  totalDeliveries: number;
}

export interface OperationalParameters {
  maxVehicleCapacityKg: number;
  maxWeightKg: number;
  maxVolumeM3: number;
  averageSpeedKmH: number;
  maxOperationTimeH: number;
  estimatedConsumptionKmPerL: number;
  emissionFactor: number;
  fuelType: FuelType;
  maxDistanceKm: number;
  maxDeliveriesPerRoute: number;
}

export interface DriverSchedule {
  driverId: string;
  shiftStart: string;
  shiftEnd: string;
  status: DriverStatus;
  available: boolean;
}

export interface VehicleSchedule {
  vehicleId: string;
  shiftStart: string;
  shiftEnd: string;
  status: VehicleStatus;
  available: boolean;
}

export interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SustainabilityMetrics {
  totalEmissionsKgCO2: number;
  totalDistanceKm: number;
  estimatedConsumptionL: number;
  deliveriesCompleted: number;
  emissionsByRoute: { routeCode: string; emissions: number }[];
  emissionsByVehicle: { vehicleCode: string; emissions: number }[];
  efficiencyIndex: number;
}
