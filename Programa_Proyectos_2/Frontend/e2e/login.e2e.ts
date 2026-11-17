import { expect, test } from '@playwright/test';

test('valida el formulario antes de autenticar', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByText('Ingrese su email y contraseña')).toBeVisible();
});

test('muestra el rechazo de credenciales del proveedor de identidad', async ({ page }) => {
  await page.route('https://example.supabase.co/auth/v1/token?grant_type=password', route =>
    route.fulfill({
      status: 400,
      json: { code: 'invalid_credentials', msg: 'Invalid login credentials' },
    }),
  );

  await page.goto('/');
  await page.getByLabel('Email').fill('operador@example.test');
  await page.getByLabel('Contraseña', { exact: true }).fill('clave-de-prueba');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByText('Email o contraseña incorrectos')).toBeVisible();
});

test('el backend local responde a la comprobación de salud', async ({ request }) => {
  const response = await request.get('http://127.0.0.1:8000/health');
  expect(response.ok()).toBeTruthy();
});
