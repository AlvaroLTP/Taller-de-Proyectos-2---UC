import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const python = process.env.E2E_PYTHON || (process.platform === 'win32'
  ? '../Backend/.venv/Scripts/python.exe'
  : existsSync('../Backend/.venv/bin/python') ? '../Backend/.venv/bin/python' : 'python');

export default defineConfig({
  timeout: 90000,
  expect: { timeout: 15000 },
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: 'http://127.0.0.1:5174', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], channel: process.env.PLAYWRIGHT_CHANNEL } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: [
    { command: `"${python}" e2e/server.py`, url: 'http://127.0.0.1:8011/health', reuseExistingServer: false, timeout: 60000 },
    { command: 'npm run dev -- --host 127.0.0.1 --port 5174 --strictPort', url: 'http://127.0.0.1:5174', reuseExistingServer: false,
      env: { VITE_API_URL: 'http://127.0.0.1:8011/api/v1', VITE_SUPABASE_URL: 'http://127.0.0.1:8011', VITE_SUPABASE_ANON_KEY: 'e2e-public-key' } },
  ],
});
