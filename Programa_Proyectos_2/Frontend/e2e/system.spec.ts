import { expect, test, type Page } from '@playwright/test';

async function login(page: Page, role = 'admin') {
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill(`${role}@e2e.local`);
  await page.getByLabel('Contraseña', { exact: true }).fill('e2e-password');
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
}

test('rechaza credenciales inválidas', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill('admin@e2e.local');
  await page.getByLabel('Contraseña', { exact: true }).fill('wrong-password');
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
  await expect(page.getByText('Email o contraseña incorrectos')).toBeVisible();
  await expect(page.getByRole('navigation')).toHaveCount(0);
});

test('admin crea, actualiza y elimina un vehículo mediante FastAPI', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await login(page);
  await page.getByRole('navigation').getByRole('button', { name: 'Vehículos', exact: true }).click();
  await page.getByRole('button', { name: 'Nuevo vehículo', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Código', { exact: false }).fill('E2E-V1');
  await dialog.getByLabel('Placa', { exact: false }).fill('E2E-123');
  await dialog.getByLabel('Tipo', { exact: false }).first().fill('Van');
  await dialog.getByLabel('Marca', { exact: false }).fill('Test');
  await dialog.getByLabel('Modelo', { exact: false }).fill('Inicial');
  await dialog.getByLabel('Capacidad de carga', { exact: false }).fill('1000');
  await dialog.getByLabel('Capacidad volumétrica', { exact: false }).fill('10');
  await dialog.getByRole('button', { name: 'Registrar vehículo', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const row = page.getByRole('row').filter({ hasText: 'E2E-V1' });
  await expect(row).toContainText('Inicial');
  await row.getByTitle('Editar', { exact: true }).click();
  await dialog.getByLabel('Modelo', { exact: false }).fill('Actualizado');
  await dialog.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
  await expect(row).toContainText('Actualizado');
  await page.reload();
  await expect(row).toContainText('Actualizado');
  await row.getByTitle('Eliminar', { exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  await expect(row).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('todas las pantallas de operaciones se cargan sin errores de JavaScript', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await login(page);
  const screens = [
    ['/dashboard', 'Dashboard'], ['/orders', 'Pedidos'], ['/drivers', 'Conductores'],
    ['/clients', 'Clientes'], ['/availability', 'Disponibilidad'], ['/parameters', 'Parámetros operativos'],
    ['/restrictions', 'Restricciones y preferencias'], ['/planning', 'Planificación'], ['/routes', 'Rutas'],
    ['/monitoring', 'Monitoreo'], ['/dispatch', 'Despacho'], ['/tracking', 'Seguimiento'],
    ['/sustainability', 'Sostenibilidad'], ['/settings', 'Configuración'],
  ];
  for (const [path, label] of screens) {
    await page.getByRole('navigation').getByRole('button', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.locator('main').getByRole('heading').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reintentar', exact: true })).toHaveCount(0);
    if (path === '/dashboard' || path === '/monitoring') {
      await testInfo.attach(path.slice(1), { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
    }
  }
  expect(errors).toEqual([]);
});

test('conductor tiene navegación limitada y API rechaza escrituras', async ({ page, request }) => {
  await login(page, 'driver');
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Mi ruta', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Vehículos', exact: true })).toHaveCount(0);
  await page.goto('/vehicles');
  await expect(page).toHaveURL(/dashboard/);
  const session = await request.post('http://127.0.0.1:8011/auth/v1/token', { data: { email: 'driver@e2e.local', password: 'e2e-password' } });
  const { access_token } = await session.json();
  const denied = await request.post('http://127.0.0.1:8011/api/v1/vehicles/', { headers: { Authorization: `Bearer ${access_token}` }, data: {} });
  expect(denied.status()).toBe(403);
});

test('muestra un fallo de API y permite reintentar', async ({ page }) => {
  await page.route('**/api/v1/vehicles/**', route => route.fulfill({ status: 503, json: { detail: 'Servicio temporalmente no disponible' } }));
  await login(page);
  await expect(page.getByText(/No se pudieron cargar los datos/)).toBeVisible();
  await page.unroute('**/api/v1/vehicles/**');
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Reintentar', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Panel de control', exact: true })).toBeVisible();
});

test('planifica, despacha y confirma una entrega con cambio de sesión', async ({ page, request }, testInfo) => {
  const browserNumber = { chromium: '1', firefox: '2', webkit: '3' }[testInfo.project.name] || '9';
  const fixture = `${testInfo.project.name}-${testInfo.retry}`;
  const phone = `99911${browserNumber}${testInfo.retry}22`;
  const auth = await request.post('http://127.0.0.1:8011/auth/v1/token', { data: { email: 'admin@e2e.local', password: 'e2e-password' } });
  const { access_token } = await auth.json();
  const headers = { Authorization: `Bearer ${access_token}` };
  const create = async (resource: string, data: Record<string, unknown>) => {
    const response = await request.post(`http://127.0.0.1:8011/api/v1/${resource}/`, { headers, data });
    expect(response.status(), await response.text()).toBe(201);
    return response.json();
  };
  const client = await create('clients', { name: `E2E Destinatario ${fixture}`, phone, street: 'Av. Lima', district: 'Lima' });
  const vehicleCode = 'E2E-PLAN';
  const vehiclesResponse = await request.get('http://127.0.0.1:8011/api/v1/vehicles/', { headers });
  expect(vehiclesResponse.status(), await vehiclesResponse.text()).toBe(200);
  const vehicleExists = (await vehiclesResponse.json()).some((vehicle: { code: string }) => vehicle.code === vehicleCode);
  if (!vehicleExists) {
    await create('vehicles', { code: vehicleCode, plate: 'PLN-001', type: 'Van', brand: 'Test', model: 'Plan', capacity_kg: 1000, capacity_m3: 10, consumption_km_per_l: 10, emissions_per_km: 0.2 });
  }
  const orderCode = `E2E-PEDIDO-${fixture}`;
  await create('orders', { code: orderCode, client_id: client.id, phone, street: 'Av. Lima', district: 'Lima', lat: -12.04, lng: -77.03, delivery_date: '2026-11-16', time_window_start: '09:00', time_window_end: '12:00', weight_kg: 100, volume_m3: 1 });
  await login(page);
  await page.goto('/planning');
  await page.getByLabel('Fecha de planificación').fill('2026-11-16');
  await page.getByRole('checkbox', { name: new RegExp(orderCode) }).check();
  await page.getByRole('checkbox', { name: /E2E Driver/ }).check();
  await page.getByRole('checkbox', { name: vehicleCode }).check();
  const generated = page.waitForResponse(response => response.url().endsWith('/routes/generate') && response.request().method() === 'POST');
  await page.getByRole('button', { name: 'Generar planificación', exact: true }).click();
  const planResponse = await generated;
  expect(planResponse.ok(), await planResponse.text()).toBeTruthy();
  const plan = await planResponse.json();
  expect(plan.valid).toBeTruthy();
  const routeId = plan.routes[0].id;
  await expect(page.getByText('Rutas generadas', { exact: true })).toBeVisible();
  await page.getByRole('navigation').getByRole('button', { name: 'Despacho', exact: true }).click();
  await page.getByRole('button', { name: 'Iniciar', exact: true }).click();
  await page.getByRole('button', { name: 'Despachar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Finalizar', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar sesión', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ingresar', exact: true })).toBeVisible();
  await login(page, 'driver');
  await page.getByRole('navigation').getByRole('button', { name: 'Mis entregas', exact: true }).click();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(page.getByText('Entrega completada', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(orderCode, { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'OK', exact: true })).toHaveCount(0);
  const orders = await request.get('http://127.0.0.1:8011/api/v1/orders/', { headers });
  expect((await orders.json()).find((order: { code: string }) => order.code === orderCode).status).toBe('delivered');
  const finished = await request.put(`http://127.0.0.1:8011/api/v1/routes/${routeId}/status`, {
    headers,
    data: { status: 'finished' },
  });
  expect(finished.status(), await finished.text()).toBe(200);
});
