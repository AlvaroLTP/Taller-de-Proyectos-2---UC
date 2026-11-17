import { expect, test } from '@playwright/test';

const apiUrl = 'http://127.0.0.1:8011/health';
const apiSamples = Number(process.env.E2E_API_SAMPLES || 5);
const apiMaxMs = Number(process.env.E2E_API_MAX_MS || 500);

test('registra rendimiento local del acceso y de la API', async ({ page, request }, testInfo) => {
  if (!Number.isInteger(apiSamples) || apiSamples < 1) {
    throw new Error('E2E_API_SAMPLES debe ser un entero mayor que cero.');
  }
  if (!Number.isFinite(apiMaxMs) || apiMaxMs <= 0) {
    throw new Error('E2E_API_MAX_MS debe ser un número positivo.');
  }

  await page.addInitScript(() => {
    const perfWindow = window as Window & { __ecologisticaLcp?: number };
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const latest = entries[entries.length - 1];
        if (latest) perfWindow.__ecologisticaLcp = latest.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // Algunos navegadores o contextos no exponen LCP; se registra como no disponible.
    }
  });

  const apiTimings: number[] = [];
  for (let index = 0; index < apiSamples; index += 1) {
    const startedAt = performance.now();
    const response = await request.get(apiUrl);
    apiTimings.push(Number((performance.now() - startedAt).toFixed(2)));
    expect(response.ok(), `${apiUrl}: HTTP ${response.status()}`).toBeTruthy();
  }

  const apiMaxObservedMs = Math.max(...apiTimings);
  expect(apiMaxObservedMs, `máximo de ${apiSamples} muestras de ${apiUrl}`).toBeLessThan(apiMaxMs);

  const response = await page.goto('/');
  expect(response?.ok(), 'respuesta de navegación inicial').toBeTruthy();
  await expect(page.getByRole('button', { name: 'Ingresar', exact: true })).toBeVisible();
  await page.waitForTimeout(250);

  const navigation = await page.evaluate(() => {
    const perfWindow = window as Window & { __ecologisticaLcp?: number };
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const firstContentfulPaint = performance
      .getEntriesByType('paint')
      .find((entry) => entry.name === 'first-contentful-paint');
    return {
      ttfbMs: nav ? Number((nav.responseStart - nav.startTime).toFixed(2)) : null,
      navigationDurationMs: nav ? Number(nav.duration.toFixed(2)) : null,
      fcpMs: firstContentfulPaint ? Number(firstContentfulPaint.startTime.toFixed(2)) : null,
      lcpMs: perfWindow.__ecologisticaLcp ? Number(perfWindow.__ecologisticaLcp.toFixed(2)) : null,
    };
  });

  await testInfo.attach('rendimiento-local', {
    body: JSON.stringify({
      environment: 'E2E local: Vite en 127.0.0.1:5174 y FastAPI en 127.0.0.1:8011',
      api: { endpoint: apiUrl, samples: apiSamples, maxAllowedMs: apiMaxMs, timingsMs: apiTimings, maxObservedMs: apiMaxObservedMs },
      navigation,
    }, null, 2),
    contentType: 'application/json',
  });
});
