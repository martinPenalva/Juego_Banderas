const { test, expect } = require('@playwright/test');

test('arranque sin red: dinosaurio local, salto, choque y reinicio', async ({ page, isMobile }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://**/*', route => route.abort('internetdisconnected'));
  await page.goto('/');
  await expect(page.locator('#title')).toHaveText('Sin Internet. Con dinosaurio.');
  await expect(page.locator('.runner-canvas')).toBeVisible();
  if (isMobile) await page.locator('.runner-canvas').tap();
  else await page.keyboard.press('Space');
  await expect.poll(() => page.evaluate(() => Runner.instance_.distanceRan)).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => Runner.instance_.crashed), { timeout: 15000 }).toBe(true);
  await page.waitForTimeout(800);
  if (isMobile) await page.locator('#runner').tap();
  else await page.keyboard.press('Space');
  await expect.poll(() => page.evaluate(() => Runner.instance_.crashed)).toBe(false);
  await page.screenshot({ path: `test-results/dinosaurio-${isMobile ? 'movil' : 'escritorio'}.png` });
  expect(errors).toEqual([]);
});

test('recuperar conexión conserva el dinosaurio hasta elegir abrir el juego', async ({ page }) => {
  let connected = false;
  await page.route('https://www.gstatic.com/**', route => connected
    ? route.fulfill({ body: 'export function initializeApp() {}', contentType: 'text/javascript' })
    : route.abort('internetdisconnected'));
  await page.route('**/game.html', route => route.fulfill({ body: '<h1>Juego conectado</h1>', contentType: 'text/html' }));
  await page.goto('/');
  await expect(page.locator('.runner-canvas')).toBeVisible();
  connected = true;
  await page.locator('#retry').click();
  await expect(page.locator('#enter')).toBeVisible();
  await expect(page).not.toHaveURL(/game\.html/);
  await page.locator('#enter').click();
  await expect(page).toHaveURL(/game\.html/);
});

test('con Internet abre el juego; un portal cautivo no cuenta como conexión válida', async ({ page }) => {
  await page.route('https://www.gstatic.com/**', route => route.fulfill({ body: '<html>Inicia sesión en el Wi-Fi</html>', contentType: 'text/html' }));
  await page.goto('/');
  await expect(page.locator('#badge')).toHaveText('Sin conexión');
  await page.unroute('https://www.gstatic.com/**');
  await page.route('https://www.gstatic.com/**', route => route.fulfill({ body: 'export function initializeApp() {}', contentType: 'text/javascript' }));
  await page.route('**/game.html', route => route.fulfill({ body: 'Juego', contentType: 'text/html' }));
  await page.goto('/');
  await expect(page).toHaveURL(/game\.html/);
});

test('la carga lenta tiene un límite y muestra el dinosaurio', async ({ page }) => {
  await page.route('https://www.gstatic.com/**', async route => {
    await new Promise(resolve => setTimeout(resolve, 8000));
    await route.abort().catch(() => {});
  });
  await page.goto('/');
  await expect(page.locator('.runner-canvas')).toBeVisible({ timeout: 10000 });
});
