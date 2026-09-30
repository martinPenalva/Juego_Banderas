import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(root, 'native/public');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// Explicit assets only: never package Git history, server code, credentials or the ZIP backup.
const assets = ['world-flags.js', 'audios-manifest.js', 'audios-manifest.json',
  'api_Brainrots_martin.json', 'api_Star_WARS', 'api_football_teams.json',
  'OIG1.jpg', 'icon-192.png', 'icon-512.png', 'audios', 'kk-stickersgg-pack'];
for (const asset of assets) await cp(path.join(root, asset), path.join(output, asset), { recursive: true });
await cp(path.join(root, 'native/web'), output, { recursive: true });
await cp(path.join(root, 'native/vendor/chromium'), path.join(output, 'dino'), { recursive: true });

let game = await readFile(path.join(root, 'index.html'), 'utf8');
if (!game.includes('<head>')) throw new Error('No se encontró la cabecera del juego.');
const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; media-src 'self' https: data: blob:; connect-src 'self' https: wss:; font-src 'self' data:; object-src 'none'; base-uri 'self'; frame-src 'none'";
game = game.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}">\n    <script src="native-runtime.js"></script>`);
game = game.replace(/<link rel="manifest"[^>]*>/, '');
game = game.replaceAll('https://martinpenalva.github.io/Juego_Banderas/OIG1.jpg', './OIG1.jpg');
await writeFile(path.join(output, 'game.html'), game);

// Chromium expects the audio resources as inline data URLs.
let launcher = await readFile(path.join(output, 'index.html'), 'utf8');
for (const sound of ['button-press', 'hit', 'score-reached']) {
  const data = await readFile(path.join(output, 'dino', `${sound}.mp3`));
  launcher = launcher.replace(`{{${sound}}}`, `data:audio/mpeg;base64,${data.toString('base64')}`);
}
await writeFile(path.join(output, 'index.html'), launcher);
console.log('Cliente compartido preparado en native/public (Firebase original conservado).');
