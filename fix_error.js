// Script para corregir el error tipográfico en index.html
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Reemplazar el error tipográfico
content = content.replace(/python -m http\.server/g, 'python -m http.server');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Error tipográfico corregido: python -m http.server → python -m http.server');
