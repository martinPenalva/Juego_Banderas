const { app, BrowserWindow, protocol, session, Menu, dialog } = require('electron');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const { localPath, isLocalPage } = require('./paths.cjs');

const root = path.join(__dirname, '../public');
const startURL = 'banderas://app/index.html' + (process.argv.includes('--offline') ? '?offline=1' : '');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.webp': 'image/webp',
  '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.m4a': 'audio/mp4' };

protocol.registerSchemesAsPrivileged([{ scheme: 'banderas', privileges: {
  standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true
} }]);

let mainWindow;
const hasLock = app.requestSingleInstanceLock();
if (!hasLock) app.quit();
else {
  app.on('second-instance', () => {
    if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); }
  });
  app.whenReady().then(async () => {
    session.fromPartition('persist:banderas').protocol.handle('banderas', async request => {
      const file = localPath(request.url, root);
      if (!file || !['GET', 'HEAD'].includes(request.method)) return new Response('No permitido', { status: 403 });
      try {
        const data = await readFile(file);
        const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
          'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes' };
        const range = request.headers.get('range');
        if (range) {
          const match = /^bytes=(\d+)-(\d*)$/.exec(range);
          const start = match ? Number(match[1]) : -1;
          const end = match && match[2] ? Math.min(Number(match[2]), data.length - 1) : data.length - 1;
          if (start < 0 || start > end || start >= data.length) return new Response(null, {
            status: 416, headers: { 'Content-Range': `bytes */${data.length}` }
          });
          headers['Content-Range'] = `bytes ${start}-${end}/${data.length}`;
          return new Response(request.method === 'HEAD' ? null : data.subarray(start, end + 1), { status: 206, headers });
        }
        return new Response(request.method === 'HEAD' ? null : data, { headers });
      } catch { return new Response('Archivo no encontrado', { status: 404 }); }
    });
    createWindow();
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      { label: 'Banderas', submenu: [
        { label: 'Inicio / comprobar conexión', click: () => mainWindow?.loadURL('banderas://app/index.html') },
        { label: 'Jugar al dinosaurio', click: () => mainWindow?.loadURL('banderas://app/index.html?offline=1') },
        { type: 'separator' }, { role: 'quit', label: 'Salir' }
      ] },
      { label: 'Editar', submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' },
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }] },
      { label: 'Ver', submenu: [{ role: 'reload', label: 'Recargar' }, { role: 'resetZoom' },
        { role: 'zoomIn' }, { role: 'zoomOut' }, { role: 'togglefullscreen', label: 'Pantalla completa' }] }
    ]));
  }).catch(error => { console.error(error); app.quit(); });
}

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1180, height: 820, minWidth: 380, minHeight: 560,
    title: 'Banderas', icon: path.join(root, 'icon-512.png'), backgroundColor: '#f7f7f7',
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true,
      webSecurity: true, webviewTag: false, partition: 'persist:banderas' }
  });
  const contents = mainWindow.webContents;
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
  contents.on('will-navigate', (event, url) => { if (!isLocalPage(url)) event.preventDefault(); });
  contents.on('will-redirect', (event, url) => { if (!isLocalPage(url)) event.preventDefault(); });
  let notificationsAllowed = false;
  contents.session.setPermissionCheckHandler((webContents, permission) =>
    webContents === contents && isLocalPage(webContents.getURL()) && permission === 'notifications' && notificationsAllowed);
  contents.session.setPermissionRequestHandler(async (webContents, permission, callback) => {
    if (webContents !== contents || !isLocalPage(webContents.getURL()) || permission !== 'notifications') return callback(false);
    const result = await dialog.showMessageBox(mainWindow, { type: 'question', title: 'Notificaciones',
      message: '¿Permitir avisos de Banderas mientras la aplicación está abierta?',
      buttons: ['Permitir', 'Ahora no'], defaultId: 1, cancelId: 1 });
    notificationsAllowed = result.response === 0;
    callback(notificationsAllowed);
  });
  mainWindow.on('closed', () => { mainWindow = null; });
  mainWindow.loadURL(startURL);
}

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
