const path = require('node:path');

function localPath(url, root) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'banderas:' || parsed.hostname !== 'app' || parsed.port || parsed.username || parsed.password) return null;
    const pathname = decodeURIComponent(parsed.pathname);
    if (pathname.includes('\0') || pathname.includes('\\')) return null;
    const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    const relative = path.relative(root, target);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) return null;
    return target;
  } catch { return null; }
}

function isLocalPage(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'banderas:' && parsed.host === 'app' &&
      !parsed.username && !parsed.password && ['/', '/index.html', '/game.html'].includes(parsed.pathname);
  } catch { return false; }
}

module.exports = { localPath, isLocalPage };
