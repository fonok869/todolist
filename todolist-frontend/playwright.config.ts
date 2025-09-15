import { defineConfig, devices } from '@playwright/test';

// Determine if we're running against test backend
const isTestMode = process.env.TEST_PROFILE === 'test';
const frontendPort = process.env.FRONTEND_PORT || '5175';
const backendPort = isTestMode ? '8081' : '8080';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${frontendPort}`,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: `http://localhost:${frontendPort}`,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      VITE_API_BASE_URL: `http://localhost:${backendPort}`,
    },
  },
});