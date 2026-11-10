import type { OrderStatus } from '@/types';
const transitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['cancelled'], planned: ['in_route', 'cancelled'],
  in_route: ['delivered', 'not_delivered'], delivered: [], not_delivered: [], cancelled: [],
};
export const nextOrderStatuses = (status: OrderStatus): OrderStatus[] => transitions[status];
