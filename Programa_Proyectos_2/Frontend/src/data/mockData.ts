import type { User } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Ana Rodríguez', email: 'admin@distrirapido.pe', role: 'admin', avatarInitials: 'AR' },
  { id: 'u2', name: 'Luis Fernández', email: 'operador@distrirapido.pe', role: 'operator', avatarInitials: 'LF' },
  { id: 'u3', name: 'Carlos Mendoza', email: 'conductor@distrirapido.pe', role: 'driver', driverId: 'd1', avatarInitials: 'CM' },
];
