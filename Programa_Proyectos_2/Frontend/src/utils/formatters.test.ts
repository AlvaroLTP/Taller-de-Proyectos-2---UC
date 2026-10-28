import { describe, expect, it } from 'vitest';

import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatMinutes,
} from './formatters';

describe('formatters', () => {
  it('formats durations shorter and longer than one hour', () => {
    expect(formatMinutes(45)).toBe('45 min');
    expect(formatMinutes(135)).toBe('2 h 15 min');
  });

  it('formats Peruvian currency with two decimals', () => {
    expect(formatCurrency(42)).toBe('S/ 42.00');
  });

  it('returns a placeholder for missing dates', () => {
    expect(formatDate('')).toBe('-');
    expect(formatDateTime('')).toBe('-');
  });

  it('formats valid dates using the configured locale', () => {
    expect(formatDate('2026-10-27T12:30:00Z')).not.toBe('-');
    expect(formatDateTime('2026-10-27T12:30:00Z')).not.toBe('-');
  });
});
