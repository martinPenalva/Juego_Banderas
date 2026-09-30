'use strict';
// Minimal host data expected by the unmodified Chromium runner.
window.loadTimeData = { valueExists: () => false };
const title = document.getElementById('title');
const statusText = document.getElementById('status');
const badge = document.getElementById('badge');
const offline = document.getElementById('offline');
const retry = document.getElementById('retry');
const enter = document.getElementById('enter');
let busy = false;
let dinosaurStarted = false;
let online = false;

async function connectionAvailable() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);
  try {
    // Test the actual SDK needed by the game, not just the Wi-Fi adapter.
    const response = await fetch('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js', {
      cache: 'no-store', signal: controller.signal
    });
    const source = await response.text();
    return response.ok && source.includes('initializeApp');
  } catch { return false; }
  finally { clearTimeout(timeout); }
}

async function startDinosaur() {
  offline.hidden = false;
  if (dinosaurStarted) return;
  dinosaurStarted = true;
  const script = document.createElement('script');
  script.src = 'dino/offline.js';
  script.onload = () => {
    const runner = new window.Runner('#runner');
    // Adapt the old runner's full-page touch controller to an embedded game.
    // Keep its keyboard handling, but use one scoped pointer path for mouse/touch.
    runner.containerEl.removeEventListener(Runner.events.TOUCHSTART, runner);
    document.removeEventListener(Runner.events.POINTERDOWN, runner);
    document.removeEventListener(Runner.events.POINTERUP, runner);
    const surface = document.getElementById('runner');
    surface.style.touchAction = 'none';
    surface.addEventListener('pointerdown', event => {
      event.preventDefault();
      surface.setPointerCapture(event.pointerId);
      if (runner.crashed) runner.restart();
      else runner.onKeyDown({ keyCode: 32, type: 'keydown', preventDefault() {} });
    });
    for (const event of ['pointerup', 'pointercancel']) surface.addEventListener(event, () => {
      runner.onKeyUp({ keyCode: 32, type: 'keyup', target: runner.canvas, preventDefault() {} });
    });
  };
  script.onerror = () => { statusText.textContent = 'No se pudo abrir el dinosaurio. Reinstala la aplicación o vuelve a comprobar la conexión.'; };
  document.head.appendChild(script);
}

async function checkConnection(initial = false) {
  if (busy) return;
  busy = true;
  retry.disabled = true;
  retry.textContent = 'Comprobando…';
  online = await connectionAvailable();
  busy = false;
  retry.disabled = false;
  retry.textContent = 'Volver a comprobar';
  if (online && initial) return location.replace('game.html');
  if (online) {
    badge.textContent = 'Conexión recuperada';
    title.textContent = 'Ya puedes volver a Banderas.';
    statusText.textContent = 'Termina tu partida del dinosaurio o entra al juego cuando quieras.';
    enter.hidden = false;
  } else {
    badge.textContent = 'Sin conexión';
    title.textContent = 'Sin Internet. Con dinosaurio.';
    statusText.textContent = 'No podemos conectar con el juego ahora. Mientras tanto, salta los cactus y supera tu marca.';
    enter.hidden = true;
    await startDinosaur();
  }
}

retry.addEventListener('click', () => checkConnection());
enter.addEventListener('click', async () => {
  await checkConnection();
  if (online) location.replace('game.html');
});
for (const button of [retry, enter]) {
  for (const event of ['keydown', 'keyup', 'touchstart', 'touchend']) button.addEventListener(event, e => e.stopPropagation());
}
window.addEventListener('online', () => checkConnection());
window.addEventListener('offline', () => { if (!busy) checkConnection(); });
if (new URLSearchParams(location.search).has('offline')) {
  badge.textContent = 'Dinosaurio';
  title.textContent = 'Un salto más.';
  statusText.textContent = 'El dinosaurio está listo. Puedes comprobar la conexión cuando quieras volver a Banderas.';
  startDinosaur();
} else checkConnection(true);
setInterval(() => { if (dinosaurStarted && !document.hidden) checkConnection(); }, 15000);
