import { expect, test } from '@playwright/test';

test('API y conexión SQL disponibles', async ({ request }, testInfo) => {
  const timings: Record<string, number> = {};
  for (const endpoint of ['/health', '/health/ready']) {
    const start = Date.now();
    const response = await request.get(`${process.env.MONITOR_API_URL!.replace(/\/$/, '')}${endpoint}`);
    timings[endpoint] = Date.now() - start;
    expect(response.ok(), `${endpoint}: HTTP ${response.status()}`).toBeTruthy();
    expect(timings[endpoint]).toBeLessThan(Number(process.env.MONITOR_MAX_API_MS || 15000));
  }
  await testInfo.attach('tiempos-api', { body: JSON.stringify(timings, null, 2), contentType: 'application/json' });
});

test('frontend muestra el acceso sin errores', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Ingresar', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('sesión real carga datos de operaciones (solo lectura)', async ({ page }) => {
  test.skip(!process.env.MONITOR_EMAIL || !process.env.MONITOR_PASSWORD, 'Configure credenciales de una cuenta de monitoreo para verificar autenticación y datos reales.');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill(process.env.MONITOR_EMAIL!);
  await page.getByLabel('Contraseña', { exact: true }).fill(process.env.MONITOR_PASSWORD!);
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.locator('main').getByRole('heading').first()).toBeVisible();
  await expect(page.getByText(/No se pudieron cargar los datos/)).toHaveCount(0);
  expect(errors).toEqual([]);
});
