import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'e2e-tests',
      testDir: './src/test/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual-tests',
      testDir: './src/test/visual',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'cross-browser',
      testDir: './src/test/e2e',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile',
      testDir: './src/test/e2e',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

