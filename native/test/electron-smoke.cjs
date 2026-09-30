const { _electron: electron } = require('@playwright/test');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
  const args = [path.resolve(__dirname, '../..'), '--offline'];
  const app = await electron.launch({ args, timeout: 30000 });
  try {
    const page = await app.firstWindow();
    await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].focus());
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.waitForSelector('.runner-canvas', { timeout: 15000 });
    await page.keyboard.press('Space');
    await page.waitForFunction(() => Runner.instance_.distanceRan > 0, null, { timeout: 10000 });
    const prefs = await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences());
    assert.equal(prefs.sandbox, true);
    assert.equal(prefs.contextIsolation, true);
    assert.equal(prefs.nodeIntegration, false);
    assert.equal(await page.evaluate(() => typeof require), 'undefined');
    await page.screenshot({ path: 'test-results/electron-dinosaurio.png' });
    await page.goto('banderas://app/game.html');
    await page.waitForFunction(() => window.firebaseReady === true, null, { timeout: 20000 });
    assert.equal(await page.evaluate(() => window.BanderasNative), true);
    assert.equal(await page.evaluate(() => window.db.app.options.projectId), 'banderas-f31cf');
    await page.waitForSelector('#authContainer', { state: 'visible' });
    await page.screenshot({ path: 'test-results/electron-login.png' });
    assert.deepEqual(errors, []);
    console.log('Electron: dinosaurio, aislamiento, SDK Firebase y login comprobados. No se creó ninguna cuenta ni se escribieron datos.');
  } finally { await app.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
