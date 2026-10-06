import type {
  User,
  Vehicle,
  Driver,
  Client,
  Order,
  Route,
  OperationalParameters,
  Notification,
} from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Ana Rodríguez', email: 'admin@distrirapido.pe', role: 'admin', avatarInitials: 'AR' },
  { id: 'u2', name: 'Luis Fernández', email: 'operador@distrirapido.pe', role: 'operator', avatarInitials: 'LF' },
  { id: 'u3', name: 'Carlos Mendoza', email: 'conductor@distrirapido.pe', role: 'driver', driverId: 'd1', avatarInitials: 'CM' },
];

const limaDistricts = [
  { name: 'San Juan de Lurigancho', lat: -12.0039, lng: -77.0219 },
  { name: 'El Agustino', lat: -12.0453, lng: -77.0117 },
  { name: 'Santa Anita', lat: -12.0431, lng: -76.9773 },
  { name: 'Ate', lat: -12.0402, lng: -76.9493 },
  { name: 'Cercado de Lima', lat: -12.0464, lng: -77.0428 },
  { name: 'Rímac', lat: -12.0286, lng: -77.0291 },
  { name: 'La Victoria', lat: -12.0708, lng: -77.0175 },
  { name: 'San Luis', lat: -12.0600, lng: -76.9717 },
  { name: 'Chaclacayo', lat: -12.0047, lng: -76.7819 },
  { name: 'Lurigancho', lat: -11.9942, lng: -76.8764 },
];

const randomOffset = (base: number, delta = 0.01) =>
  +(base + (Math.random() - 0.5) * delta).toFixed(4);

export const mockVehicles: Vehicle[] = [
  { id: 'v1', code: 'VAN-001', plate: 'ABC-123', type: 'Furgoneta', brand: 'Toyota', model: 'Hiace 2023', capacityKg: 1200, capacityM3: 8.5, consumptionKmPerL: 10.5, fuelType: 'diesel', emissionsPerKm: 0.247, status: 'available', available: true },
  { id: 'v2', code: 'VAN-002', plate: 'DEF-456', type: 'Furgoneta', brand: 'Ford', model: 'Transit 2022', capacityKg: 1400, capacityM3: 9.2, consumptionKmPerL: 9.8, fuelType: 'diesel', emissionsPerKm: 0.254, status: 'in_route', available: false, driverId: 'd1' },
  { id: 'v3', code: 'VAN-003', plate: 'GHI-789', type: 'Furgoneta', brand: 'Toyota', model: 'Hiace 2024', capacityKg: 1200, capacityM3: 8.5, consumptionKmPerL: 10.5, fuelType: 'hybrid', emissionsPerKm: 0.158, status: 'available', available: true },
  { id: 'v4', code: 'CAM-001', plate: 'JKL-012', type: 'Camión', brand: 'Isuzu', model: 'NPR 2023', capacityKg: 4500, capacityM3: 20.0, consumptionKmPerL: 7.5, fuelType: 'diesel', emissionsPerKm: 0.385, status: 'maintenance', available: false },
  { id: 'v5', code: 'CAM-002', plate: 'MNO-345', type: 'Camión', brand: 'Hino', model: '300 2022', capacityKg: 4000, capacityM3: 18.5, consumptionKmPerL: 8.0, fuelType: 'diesel', emissionsPerKm: 0.360, status: 'available', available: true },
  { id: 'v6', code: 'MOT-001', plate: 'PQR-678', type: 'Motocicleta', brand: 'Honda', model: 'CG 160 2023', capacityKg: 80, capacityM3: 0.5, consumptionKmPerL: 45.0, fuelType: 'gasoline', emissionsPerKm: 0.052, status: 'available', available: true },
  { id: 'v7', code: 'MOT-002', plate: 'STU-901', type: 'Motocicleta', brand: 'Yamaha', model: 'FZ 150 2024', capacityKg: 75, capacityM3: 0.4, consumptionKmPerL: 48.0, fuelType: 'gasoline', emissionsPerKm: 0.048, status: 'in_route', available: false, driverId: 'd3' },
  { id: 'v8', code: 'PCK-001', plate: 'VWX-234', type: 'Pickup', brand: 'Mitsubishi', model: 'L200 2023', capacityKg: 1000, capacityM3: 6.0, consumptionKmPerL: 11.0, fuelType: 'hybrid', emissionsPerKm: 0.165, status: 'available', available: true },
  { id: 'v9', code: 'PCK-002', plate: 'YZA-567', type: 'Pickup', brand: 'Nissan', model: 'Navara 2022', capacityKg: 1050, capacityM3: 6.5, consumptionKmPerL: 10.8, fuelType: 'diesel', emissionsPerKm: 0.230, status: 'unavailable', available: false },
  { id: 'v10', code: 'ELC-001', plate: 'EV0-001', type: 'Eléctrico', brand: 'Maxus', model: 'eDeliver3 2024', capacityKg: 900, capacityM3: 6.5, consumptionKmPerL: 0, fuelType: 'electric', emissionsPerKm: 0.000, status: 'available', available: true },
];

export const mockDrivers: Driver[] = [
  { id: 'd1', name: 'Carlos Mendoza', dni: '45123456', phone: '987654321', license: 'B-II-12345', licenseType: 'B-II', status: 'in_route', available: false, vehicleId: 'v2', shiftStart: '06:00', shiftEnd: '14:00', avatarInitials: 'CM' },
  { id: 'd2', name: 'Rosa Quispe', dni: '44876543', phone: '987123456', license: 'A-II-B-67890', licenseType: 'A-II-B', status: 'available', available: true, shiftStart: '08:00', shiftEnd: '16:00', avatarInitials: 'RQ' },
  { id: 'd3', name: 'Jorge Ramírez', dni: '70123456', phone: '987654122', license: 'A-I-34567', licenseType: 'A-I', status: 'in_route', available: false, vehicleId: 'v7', shiftStart: '07:00', shiftEnd: '15:00', avatarInitials: 'JR' },
  { id: 'd4', name: 'María Flores', dni: '46876543', phone: '987123765', license: 'B-I-89101', licenseType: 'B-I', status: 'available', available: true, vehicleId: 'v8', shiftStart: '09:00', shiftEnd: '17:00', avatarInitials: 'MF' },
  { id: 'd5', name: 'Pedro Castillo', dni: '72123456', phone: '987654011', license: 'B-II-23456', licenseType: 'B-II', status: 'resting', available: false, shiftStart: '14:00', shiftEnd: '22:00', avatarInitials: 'PC' },
  { id: 'd6', name: 'Lucía Torres', dni: '47567890', phone: '987111222', license: 'A-II-B-45678', licenseType: 'A-II-B', status: 'available', available: true, shiftStart: '08:00', shiftEnd: '16:00', avatarInitials: 'LT' },
  { id: 'd7', name: 'Diego Huamán', dni: '73123456', phone: '987333444', license: 'B-I-90212', licenseType: 'B-I', status: 'unavailable', available: false, shiftStart: '06:00', shiftEnd: '14:00', avatarInitials: 'DH' },
  { id: 'd8', name: 'Sofía Vargas', dni: '48567890', phone: '987555666', license: 'A-II-B-11223', licenseType: 'A-II-B', status: 'available', available: true, shiftStart: '09:00', shiftEnd: '17:00', avatarInitials: 'SV' },
  { id: 'd9', name: 'Manuel Ríos', dni: '74123456', phone: '987777888', license: 'B-II-33445', licenseType: 'B-II', status: 'available', available: true, shiftStart: '07:00', shiftEnd: '15:00', avatarInitials: 'MR' },
  { id: 'd10', name: 'Carmen Díaz', dni: '49567890', phone: '987999000', license: 'A-I-55667', licenseType: 'A-I', status: 'resting', available: false, shiftStart: '14:00', shiftEnd: '22:00', avatarInitials: 'CD' },
];

const clientNames = [
  'Distribuidora Norte SRL', 'Bodega San Juan', 'Farmacia SaludPlus', 'Mercado Santa Anita',
  'Ferretería El Tornillo', 'Restaurant El Buen Sabor', 'Tienda La Económica', 'Librería Central',
  'Floristería Jardín', 'Minimarket Express', 'Panadería El Trigo', 'Farmacia Vida Sana',
  'Ventura Importaciones SAC', 'Technology Store PE', 'Moda Express SAC',
  'Muebles Madera Viva', 'Limpieza Total SAC', 'Abarrotes Don Luis', 'Deportes Action',
  'Cosméticos Belleza Peruana',
];

const productTypes = ['Abarrotes', 'Medicinas', 'Ferretería', 'Vestido', 'Electrodomésticos', 'Panadería', 'Limpieza', 'Cosméticos', 'Muebles', 'Electrónica'];

const accessTypes = ['Fácil', 'Moderado', 'Difícil', 'Restringido', 'Con permiso'];
const restrictionOptions = ['Solo mañana', 'No almuerzo', 'Cliente prioritario', 'Difícil acceso', 'Coordinación telefónica', 'Portón eléctrico', 'Frente a parque'];

function makeAddress(idx: number) {
  const district = limaDistricts[idx % limaDistricts.length];
  return {
    street: `Jr. ${['Los Olivos', 'Las Flores', 'San Martín', 'Los Andes', 'El Sol', 'Ayacucho', 'Junín', 'Miraflores', 'Grau', 'Bolognesi'][idx % 10]} ${100 + (idx * 23) % 800}`,
    reference: ['Frente al parque principal', 'Portón azul, 2da casa', 'Frente a comisaría', 'Al lado del mercado', 'Esquina con av. principal', 'Frente a colegio', 'Portón blanco con rejas', 'De color verde, 2do piso'][idx % 8],
    district: district.name,
    neighborhood: ['Urb. ${district.name}', 'Coop. Vivienda', 'Asoc. de Vivienda', 'Barrio Popular', 'Residencial'][idx % 5],
    lat: randomOffset(district.lat, 0.02),
    lng: randomOffset(district.lng, 0.02),
    indications: ['Ingreso por puerta lateral', 'Tocar timbre 2 veces', 'Preguntar por encargado', 'Entregar en recepción', 'Coordinar con vigilancia'][idx % 5],
    accessType: accessTypes[idx % accessTypes.length],
  };
}

export const mockClients: Client[] = clientNames.map((name, i) => ({
  id: `c${i + 1}`,
  name,
  phone: `98${(700000 + i * 1111).toString().slice(0, 6)}`,
  email: `contacto${i + 1}@cliente.pe`,
  address: makeAddress(i),
  priority: (['high', 'medium', 'low'] as const)[i % 3],
  notes: ['Cliente frecuente', 'Cliente nuevo', 'Pago contra entrega', 'Cliente VIP', 'Entrega programada semanal'][i % 5],
}));

const orderStatuses = ['pending', 'planned', 'in_route', 'delivered', 'not_delivered', 'cancelled'] as const;

export const mockOrders: Order[] = Array.from({ length: 30 }, (_, i) => {
  const client = mockClients[i % mockClients.length];
  const status = orderStatuses[i % orderStatuses.length];
  const prefs = {
    preferredTime: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'][i % 6],
    timeWindowStart: ['09:00', '10:00', '11:00', '14:00', '15:00'][i % 5],
    timeWindowEnd: ['11:00', '12:00', '13:00', '16:00', '17:00'][i % 5],
    priority: (['high', 'medium', 'low'] as const)[i % 3],
    restrictions: [restrictionOptions[i % restrictionOptions.length], restrictionOptions[(i + 2) % restrictionOptions.length]],
    accessType: accessTypes[i % accessTypes.length],
    requiresSpecialAttention: i % 4 === 0,
    noLunchHours: i % 3 === 0,
    requiresPhoneCoordination: i % 5 === 0,
    observations: ['Llamar 15 min antes', 'Producto frágil', 'Manejar con cuidado', 'Confirmar recepción', 'Cliente frecuentemente ausente'][i % 5],
  };
  return {
    id: `o${i + 1}`,
    code: `PED-${String(i + 1).padStart(4, '0')}`,
    clientId: client.id,
    phone: client.phone,
    address: client.address,
    deliveryDate: `2026-10-${String((i % 28) + 1).padStart(2, '0')}`,
    timeWindowStart: prefs.timeWindowStart,
    timeWindowEnd: prefs.timeWindowEnd,
    priority: prefs.priority,
    weightKg: +(Math.random() * 500 + 20).toFixed(1),
    volumeM3: +(Math.random() * 5 + 0.2).toFixed(2),
    productType: productTypes[i % productTypes.length],
    observations: ['Cargar con montacargas', 'Producto perecible', 'Entregar en recepción', 'Sin observaciones', 'Cliente retira en local'][i % 5],
    status,
    preferences: prefs,
    routeId: status === 'planned' || status === 'in_route' || status === 'delivered' ? `r${(i % 4) + 1}` : undefined,
    deliveryOrder: status === 'planned' || status === 'in_route' || status === 'delivered' ? (i % 12) + 1 : undefined,
    driverId: status === 'in_route' || status === 'delivered' ? `d${(i % 3) + 1}` : undefined,
    deliveredAt: status === 'delivered' ? `2026-10-0${(i % 6) + 1}T${10 + (i % 8)}:30:00` : undefined,
    incidentReason: status === 'not_delivered' ? ['Cliente ausente', 'Dirección incorrecta', 'Acceso restringido'][i % 3] : undefined,
    incidentNotes: status === 'not_delivered' ? 'Se intentó entregar en 2 ocasiones' : undefined,
  };
});

export const mockRoutes: Route[] = [
  {
    id: 'r1', code: 'R-001', driverId: 'd1', vehicleId: 'v2', date: '2026-10-06',
    stops: mockOrders.filter(o => o.routeId === 'r1').sort((a, b) => (a.deliveryOrder || 0) - (b.deliveryOrder || 0)).map((o, i) => ({
      orderId: o.id, order: i + 1, clientName: mockClients.find(c => c.id === o.clientId)?.name || '',
      address: `${o.address.street}`, district: o.address.district, lat: o.address.lat, lng: o.address.lng,
      timeWindow: `${o.timeWindowStart} - ${o.timeWindowEnd}`, status: o.status,
    })),
    totalDistanceKm: 34.5, estimatedTimeMin: 135, departureTime: '06:30', estimatedArrivalTime: '08:45',
    emissionsKgCO2: 8.4, status: 'in_route', completedDeliveries: 4, totalDeliveries: 8,
  },
  {
    id: 'r2', code: 'R-002', driverId: 'd3', vehicleId: 'v7', date: '2026-10-06',
    stops: mockOrders.filter(o => o.routeId === 'r2').sort((a, b) => (a.deliveryOrder || 0) - (b.deliveryOrder || 0)).map((o, i) => ({
      orderId: o.id, order: i + 1, clientName: mockClients.find(c => c.id === o.clientId)?.name || '',
      address: `${o.address.street}`, district: o.address.district, lat: o.address.lat, lng: o.address.lng,
      timeWindow: `${o.timeWindowStart} - ${o.timeWindowEnd}`, status: o.status,
    })),
    totalDistanceKm: 22.3, estimatedTimeMin: 98, departureTime: '07:00', estimatedArrivalTime: '08:38',
    emissionsKgCO2: 3.2, status: 'in_route', completedDeliveries: 2, totalDeliveries: 6,
  },
  {
    id: 'r3', code: 'R-003', driverId: 'd2', vehicleId: 'v1', date: '2026-10-06',
    stops: mockOrders.filter(o => o.routeId === 'r3').sort((a, b) => (a.deliveryOrder || 0) - (b.deliveryOrder || 0)).map((o, i) => ({
      orderId: o.id, order: i + 1, clientName: mockClients.find(c => c.id === o.clientId)?.name || '',
      address: `${o.address.street}`, district: o.address.district, lat: o.address.lat, lng: o.address.lng,
      timeWindow: `${o.timeWindowStart} - ${o.timeWindowEnd}`, status: o.status,
    })),
    totalDistanceKm: 28.7, estimatedTimeMin: 122, departureTime: '08:00', estimatedArrivalTime: '10:02',
    emissionsKgCO2: 7.1, status: 'pending', completedDeliveries: 0, totalDeliveries: 5,
  },
  {
    id: 'r4', code: 'R-004', driverId: 'd4', vehicleId: 'v8', date: '2026-10-06',
    stops: mockOrders.filter(o => o.routeId === 'r4').sort((a, b) => (a.deliveryOrder || 0) - (b.deliveryOrder || 0)).map((o, i) => ({
      orderId: o.id, order: i + 1, clientName: mockClients.find(c => c.id === o.clientId)?.name || '',
      address: `${o.address.street}`, district: o.address.district, lat: o.address.lat, lng: o.address.lng,
      timeWindow: `${o.timeWindowStart} - ${o.timeWindowEnd}`, status: o.status,
    })),
    totalDistanceKm: 19.2, estimatedTimeMin: 87, departureTime: '09:00', estimatedArrivalTime: '10:27',
    emissionsKgCO2: 3.2, status: 'finished', completedDeliveries: 7, totalDeliveries: 7,
  },
];

export const mockParameters: OperationalParameters = {
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

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'warning', title: 'Vehículo en mantenimiento', message: 'CAM-001 se encuentra en mantenimiento programado.', timestamp: '2026-10-06T08:15:00', read: false },
  { id: 'n2', type: 'error', title: 'Entrega con incidencia', message: 'Ruta R-001 reportó una entrega no realizada.', timestamp: '2026-10-06T09:30:00', read: false },
  { id: 'n3', type: 'info', title: 'Pedido prioritario', message: 'PED-0001 marcado como prioritario requiere atención.', timestamp: '2026-10-06T07:45:00', read: true },
  { id: 'n4', type: 'warning', title: 'Conductor sin disponibilidad', message: 'Diego Huamán no disponible para hoy.', timestamp: '2026-10-06T06:00:00', read: false },
  { id: 'n5', type: 'success', title: 'Ruta finalizada', message: 'Ruta R-004 completó todas las entregas.', timestamp: '2026-10-06T10:27:00', read: true },
];
