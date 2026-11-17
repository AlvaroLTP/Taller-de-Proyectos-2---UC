import { defineConfig, devices } from '@playwright/test';

if (!process.env.MONITOR_FRONTEND_URL || !process.env.MONITOR_API_URL) {
  throw new Error('Configure MONITOR_FRONTEND_URL y MONITOR_API_URL (raíz de FastAPI, sin /api/v1).');
}

export default defineConfig({
  timeout: 60000,
  expect: { timeout: 30000 },
  testDir: './monitor',
  workers: 1,
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'monitor-report', open: 'never' }], ['json', { outputFile: 'monitor-results/results.json' }]],
  outputDir: 'monitor-results',
  use: { baseURL: process.env.MONITOR_FRONTEND_URL, trace: 'retain-on-failure', screenshot: 'only-on-failure', channel: process.env.PLAYWRIGHT_CHANNEL },
  projects: [{ name: 'chromium-monitor', use: { ...devices['Desktop Chrome'] } }],
});
