const fs = require('fs');

// Leer el archivo
let content = fs.readFileSync('index.html', 'utf8');

// Corregir el error específico
content = content.replace('python -m http.server', 'python -m http.server');

// Escribir el archivo corregido
fs.writeFileSync('index.html', content, 'utf8');

console.log('Error tipográfico corregido exitosamente');
