import type { UserRole } from '@/types';
import type { ReactNode } from 'react';
import {
  LayoutDashboard, Truck, Users, Package, Calendar, Settings,
  Map, Route as RouteIcon, ClipboardList, History, Leaf,
  User as UserIcon, BarChart3, ListOrdered, Gauge, Ban, Sliders,
} from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
}

export const navConfig: Record<UserRole, NavItem[]> = {
  admin: [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/vehicles', label: 'Vehículos', icon: <Truck size={20} /> },
    { path: '/drivers', label: 'Conductores', icon: <Users size={20} /> },
    { path: '/clients', label: 'Clientes', icon: <UserIcon size={20} /> },
    { path: '/orders', label: 'Pedidos', icon: <Package size={20} /> },
    { path: '/availability', label: 'Disponibilidad', icon: <Calendar size={20} /> },
    { path: '/parameters', label: 'Parámetros operativos', icon: <Sliders size={20} /> },
    { path: '/restrictions', label: 'Restricciones y preferencias', icon: <Ban size={20} /> },
    { path: '/planning', label: 'Planificación', icon: <Map size={20} /> },
    { path: '/routes', label: 'Rutas', icon: <RouteIcon size={20} /> },
    { path: '/dispatch', label: 'Despacho', icon: <ClipboardList size={20} /> },
    { path: '/tracking', label: 'Seguimiento', icon: <ListOrdered size={20} /> },
    { path: '/sustainability', label: 'Sostenibilidad', icon: <Leaf size={20} /> },
    { path: '/settings', label: 'Configuración', icon: <Settings size={20} /> },
  ],
  operator: [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/orders', label: 'Pedidos', icon: <Package size={20} /> },
    { path: '/vehicles', label: 'Vehículos', icon: <Truck size={20} /> },
    { path: '/drivers', label: 'Conductores', icon: <Users size={20} /> },
    { path: '/availability', label: 'Disponibilidad', icon: <Calendar size={20} /> },
    { path: '/restrictions', label: 'Restricciones', icon: <Ban size={20} /> },
    { path: '/planning', label: 'Planificación', icon: <Map size={20} /> },
    { path: '/routes', label: 'Rutas', icon: <RouteIcon size={20} /> },
    { path: '/dispatch', label: 'Despacho', icon: <ClipboardList size={20} /> },
    { path: '/tracking', label: 'Seguimiento', icon: <ListOrdered size={20} /> },
    { path: '/sustainability', label: 'Sostenibilidad', icon: <Leaf size={20} /> },
  ],
  driver: [
    { path: '/dashboard', label: 'Inicio', icon: <LayoutDashboard size={20} /> },
    { path: '/my-route', label: 'Mi ruta', icon: <Map size={20} /> },
    { path: '/my-deliveries', label: 'Mis entregas', icon: <Package size={20} /> },
    { path: '/history', label: 'Historial', icon: <History size={20} /> },
    { path: '/my-vehicle', label: 'Mi vehículo', icon: <Truck size={20} /> },
    { path: '/profile', label: 'Mi perfil', icon: <UserIcon size={20} /> },
  ],
};

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  operator: 'Operador Logístico',
  driver: 'Conductor',
};
