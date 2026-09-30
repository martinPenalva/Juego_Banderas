const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const { localPath, isLocalPage } = require('../electron/paths.cjs');
const root = path.resolve(__dirname, '../public');

test('el protocolo solo sirve archivos del paquete y rechaza rutas maliciosas', () => {
  assert.equal(localPath('banderas://app/game.html', root), path.join(root, 'game.html'));
  for (const url of ['file:///etc/passwd', 'https://app/game.html', 'banderas://evil/game.html',
    'banderas://user@app/game.html', 'banderas://app/%2e%2e%2fsecret', 'banderas://app/%00',
    'banderas://app/..%5csecret', 'banderas://app/%invalid']) assert.equal(localPath(url, root), null, url);
  assert.ok(isLocalPage('banderas://app/index.html?offline=1'));
  assert.equal(isLocalPage('https://martinpenalva.github.io/Juego_Banderas/'), false);
});

test('el paquete conserva Firebase y contiene recursos offline reales', () => {
  const game = readFileSync(path.join(root, 'game.html'), 'utf8');
  const web = readFileSync(path.join(root, '../../index.html'), 'utf8');
  const project = /projectId:\s*"([^"]+)"/;
  assert.equal(game.match(project)[1], web.match(project)[1]);
  assert.match(game, /native-runtime\.js/);
  assert.doesNotMatch(game, /<link rel="manifest"/);
  assert.match(readFileSync(path.join(root, 'index.html'), 'utf8'), /data:audio\/mpeg;base64,/);
  for (const file of ['dino/offline.js', 'dino/sprite-1x.png', 'dino/sprite-2x.png', 'dino/LICENSE',
    'world-flags.js', 'audios-manifest.json', 'api_Brainrots_martin.json']) assert.ok(existsSync(path.join(root, file)), file);
  for (const file of ['functions', '.git', 'kk-stickersgg-pack.zip', 'firebase.json']) assert.equal(existsSync(path.join(root, file)), false, file);
});
