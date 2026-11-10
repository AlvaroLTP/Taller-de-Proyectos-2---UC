import { expect, it } from 'vitest';
import { nextOrderStatuses } from './workflow';
it('does not offer delivery before dispatch', () => {
  expect(nextOrderStatuses('pending')).toEqual(['cancelled']);
  expect(nextOrderStatuses('planned')).not.toContain('delivered');
});
it('does not offer changes to terminal states', () => {
  expect(nextOrderStatuses('delivered')).toEqual([]);
  expect(nextOrderStatuses('cancelled')).toEqual([]);
  expect(nextOrderStatuses('not_delivered')).toEqual([]);
});
