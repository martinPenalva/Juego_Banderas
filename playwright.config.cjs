const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './native/test/browser', timeout: 20000, retries: 0, workers: 2,
  use: { baseURL: 'http://127.0.0.1:4178', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'android-layout', use: { ...devices['Pixel 7'] } }
  ],
  webServer: { command: 'node native/test/serve.cjs', url: 'http://127.0.0.1:4178', reuseExistingServer: false }
});
