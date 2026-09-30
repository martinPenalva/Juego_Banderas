'use strict';
// Included only in the packaged game, never in the published web page.
window.BanderasNative = true;
window.addEventListener('DOMContentLoaded', () => {
  const banner = document.createElement('aside');
  banner.setAttribute('role', 'status');
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:999999;background:#233e30;color:white;padding:12px 16px max(12px,env(safe-area-inset-bottom));font:14px system-ui;text-align:center;';
  banner.hidden = true;
  const message = document.createElement('span');
  const back = document.createElement('a');
  back.href = 'index.html?offline=1';
  back.textContent = ' Jugar al dinosaurio';
  back.style.cssText = 'color:white;text-decoration:underline;font-weight:bold;margin-left:12px;';
  banner.append(message, back);
  document.body.appendChild(banner);
  const update = () => {
    banner.hidden = navigator.onLine;
    message.textContent = 'Se ha perdido la conexión. Tus datos guardados siguen en tu cuenta.';
  };
  window.addEventListener('offline', update);
  window.addEventListener('online', update);
  update();
  setTimeout(() => {
    if (!window.firebaseReady) {
      banner.hidden = false;
      message.textContent = 'No se pudo iniciar la conexión con el juego.';
      back.href = 'index.html';
      back.textContent = ' Reintentar / dinosaurio';
    }
  }, 12000);
});
