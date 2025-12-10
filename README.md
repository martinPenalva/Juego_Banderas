# 🏳️ Juego de Adivinar Banderas

Un juego interactivo de adivinar banderas de países con sistema de racha y comodines.

## 🎮 Características

- **4 opciones de respuesta**: Mayor dificultad con 1 respuesta correcta y 3 incorrectas
- **Sistema de racha**: Acumula respuestas correctas consecutivas
- **Fuego animado**: Visualiza tu racha con una animación de fuego que se intensifica
- **Comodín**: Al alcanzar 5 de racha, obtienes un comodín que elimina 2 opciones incorrectas
- **Banderas Unicode**: Usa emojis de banderas que siempre funcionan, sin depender de APIs externas
- **Lista de respaldo**: 70 países predefinidos para garantizar que el juego siempre funcione

## 🚀 Cómo jugar

1. Abre el archivo `index.html` en tu navegador
2. Se mostrará una bandera aleatoria
3. Selecciona el país correcto de las 4 opciones
4. Acumula racha para desbloquear el comodín
5. Usa el comodín cuando tengas 5 de racha para eliminar 2 opciones incorrectas

## 🎯 Mecánicas del juego

- **Puntuación**: Cada respuesta correcta suma 1 punto
- **Racha**: Las respuestas correctas consecutivas aumentan tu racha
- **Comodín**: 
  - Aparece automáticamente al alcanzar 5 de racha
  - Elimina 2 opciones incorrectas aleatoriamente
  - Se consume al usarlo (reduce la racha en 5)
  - Vuelve a aparecer cuando alcances 5 de racha nuevamente

## 🛠️ Tecnologías

- HTML5
- CSS3 (con animaciones)
- JavaScript (Vanilla)
- Emojis Unicode para banderas

## 📱 Instalación en Móvil

Para agregar el juego a la pantalla de inicio de tu móvil:

1. **Habilita GitHub Pages** (si quieres que funcione desde el repositorio):
   - Ve a Settings → Pages en tu repositorio
   - Selecciona la rama `main` como fuente
   - El juego estará disponible en `https://tuusuario.github.io/Juego_Banderas/`

2. **O abre directamente el archivo**:
   - Descarga el repositorio
   - Abre `index.html` en tu navegador móvil
   - Agrega a pantalla de inicio desde el menú del navegador

3. **El icono aparecerá automáticamente** cuando agregues la app a tu pantalla de inicio

## 📝 Notas

- El juego funciona completamente offline una vez cargado
- Las banderas se muestran como emojis Unicode para máxima compatibilidad
- El juego intenta cargar más países desde la API de REST Countries, pero tiene una lista de respaldo
- Los iconos PWA están incluidos en el repositorio (`icon-192.png`, `icon-512.png`)

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

