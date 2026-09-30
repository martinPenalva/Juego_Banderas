# Banderas para Windows, Android e iOS

El juego comparte interfaz, Firebase (`banderas-f31cf`), usuarios y APIs con la web. Windows usa **Electron**; Android e iOS usan **Capacitor**, porque Electron no funciona en teléfonos. Los recursos del juego están incluidos en las aplicaciones. No se ha desplegado ni migrado la base de datos.

Estado comprobado el 30 de septiembre de 2026:

| Plataforma | Entrega local | Verificación |
| --- | --- | --- |
| Windows x64 | `release/Banderas-1.0.0-win-x64.zip` | ZIP y contenido verificados. El cliente Electron se probó en Linux; pendiente ejecución en Windows real. |
| Android | `release/Banderas-1.0.0-android-debug.apk` | Compilación Gradle correcta, firma de depuración e integridad verificadas. Pendiente prueba en teléfono/emulador Android. |
| iOS | `release/Banderas-iOS-proyecto-Xcode.zip` | Proyecto y recursos preparados. No se ha compilado ni ejecutado en iOS; requiere Mac/Xcode y firma para instalar en iPhone. |

También se incluyen los hashes en `release/SHA256SUMS.txt`. Pasaron las ocho pruebas de navegador de escritorio/móvil y la prueba real de Electron hasta la pantalla de acceso de Firebase. No se probó un inicio de sesión autenticado ni se escribieron datos en producción. La generación local del instalador NSIS no se completó por falta de Wine; el ZIP de Windows es la entrega disponible y el workflow permite generar el instalador en Windows.

Al abrir la aplicación se comprueba por HTTPS la disponibilidad del SDK de Firebase, con un límite de 6,5 segundos. Si no responde, aparece el **dinosaurio original de Chromium**, incluido localmente con gráficos y sonidos. Espacio/↑ para saltar, ↓ para agacharse; en móvil, tocar el juego. Si vuelve la conexión, el usuario decide cuándo abandonar el dinosaurio y entrar en Banderas. Una caída del proveedor también puede activar esta pantalla aunque haya acceso a otras webs.

## Ejecutar y compilar

Requiere Node.js 22 o superior. Desde la raíz del repositorio:

```bash
npm ci
npm start
```

Para probar el dinosaurio directamente:

```bash
npm run start:offline
```

### Windows

```bash
npm run dist:win
```

Genera `release/Banderas-1.0.0-win-x64.zip`. Extraer **todo** el ZIP y abrir `Banderas.exe`; el ejecutable necesita los archivos de su carpeta. El usuario final no necesita Node.js.

Para generar un instalador NSIS, ejecutar en Windows (o Linux con Wine):

```bash
npm run dist:win:installer
```

Los binarios iniciales no están firmados con un certificado de editor. Antes de una distribución pública, configurar la firma de Windows. El desinstalador está configurado para conservar los datos locales de la aplicación.

### Android

Abrir en Android Studio, con SDK 36 y JDK 21:

```bash
npm run android:open
```

O generar un APK de prueba con el SDK y Java configurados:

```bash
npm run android:debug
```

Resultado: `android/app/build/outputs/apk/debug/app-debug.apk`. Es un APK de desarrollo instalable manualmente, firmado con la clave de depuración; no es un AAB de publicación. Para Google Play, generar un AAB de release firmado con la clave del propietario desde Android Studio. No versionar claves ni contraseñas. Android mínimo: 7.0 (API 24).

### iOS (iPhone/iPad)

Requiere un Mac con Xcode 26 o posterior. El proyecto usa Swift Package Manager.

```bash
npm ci
npm run ios:open
```

En Xcode, seleccionar el proyecto App, configurar el equipo de desarrollo en “Signing & Capabilities” y elegir un simulador o dispositivo. Para distribución, crear un Archive y usar la cuenta Apple correspondiente para TestFlight/App Store o el canal autorizado. Un proyecto Xcode o una compilación de simulador no es un IPA instalable en cualquier iPhone. iOS mínimo del proyecto: 15.

El identificador inicial es `com.martinpenalva.banderas`; el propietario debe confirmar su disponibilidad antes de firmar/publicar. Si se cambia, actualizar tanto Capacitor como los identificadores nativos.

## Qué cambió y qué se conserva

- `native/web`: arranque, detector de conexión y dinosaurio.
- `native/electron`: ventana, protocolo local `banderas://app`, sesión persistente, permisos y navegación limitada.
- `native/scripts/build-web.mjs`: genera `native/public`, copiando únicamente recursos del juego. Renombra la página a `game.html` y añade el arranque en `index.html`.
- `android/` y `ios/`: proyectos nativos de Capacitor con los mismos recursos.
- La web original solo incorpora condiciones que evitan la redirección PWA y el FCM web en clientes nativos. Esas condiciones no se activan en la web publicada.
- Se mantienen Firebase Authentication por correo/contraseña, Firestore, Storage, funciones del servidor y APIs del juego.
- Instalar un cliente no borra cuentas ni reemplaza la web. Los datos guardados exclusivamente en localStorage y las sesiones del navegador no se importan automáticamente.

Como referencia, Discord también ofrece distintos clientes para acceder al mismo servicio. Aquí se conserva Firebase; no se copia la infraestructura de Discord ni se incorporan llamadas o vídeo por usar Electron.

## Notificaciones, conexión y actualizaciones

El FCM de navegador y su service worker se desactivan dentro de los clientes nativos. Así no se bloquea el inicio de sesión esperando un service worker inexistente ni se sobrescribe el token FCM del navegador. Los listeners de Firestore siguen disponibles cuando el cliente está conectado. Electron puede mostrar las notificaciones web mientras está abierto, después del permiso del usuario. El push nativo de Android/iOS y las notificaciones con el programa terminado **no están implementados**; requieren configurar FCM/APNs y las credenciales del propietario.

La aplicación no permanece en la bandeja al salir. Las actualizaciones se distribuyen recompilando e instalando una versión nueva; no hay actualizador automático configurado ni publicación automática de releases.

Los juegos online y los datos de cuenta necesitan Internet. El dinosaurio es el modo completamente local. La detección de red inicial no garantiza que todas las APIs externas estén disponibles. Si el SDK no termina de arrancar, se ofrece volver a comprobar la conexión.

## Seguridad y pruebas

Electron mantiene `sandbox`, `contextIsolation` y `webSecurity` activados, sin acceso a Node desde la interfaz y sin puente privilegiado. No carga páginas remotas como ventanas de escritorio ni admite ventanas emergentes. El cliente empaquetado añade una CSP; conserva scripts inline porque la interfaz original los utiliza. No se incluyen SDK administrativos ni claves de servidor.

```bash
npm test
npx playwright install chromium
npm run test:browser
npm run test:electron
```

Las pruebas de navegador cubren el arranque sin red, salto, choque y reinicio por teclado/tacto, recuperación de conexión, portal cautivo y timeout. La prueba de Electron comprueba el protocolo real, el aislamiento y la inicialización de Firebase hasta la pantalla de acceso. No registra usuarios ni escribe datos en producción. Las pruebas de navegador con tamaño móvil no sustituyen las pruebas en Android/iOS reales.

Antes de distribuir ampliamente, comprobar con cuentas de prueba el login, ranking, chats y archivos en cada plataforma. Si la configuración de Firebase restringe los nuevos orígenes, revisarla en la consola del propietario. No desplegar a ciegas `firebase.json`: sus referencias de reglas/índices ya estaban incompletas en el repositorio original.

## Automatización

`.github/workflows/native-builds.yml` permite generar manualmente el ZIP/instalador de Windows, APK debug de Android y una compilación para el simulador iOS. No publica en tiendas ni genera un IPA firmado. Requiere subir el código al repositorio y ejecutar el workflow; no se ha hecho desde esta sesión.

## Fuentes

- [Capacitor: requisitos de compilación](https://capacitorjs.com/docs/getting-started/environment-setup)
- [Electron: seguridad](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron: protocolos](https://www.electronjs.org/docs/latest/api/protocol)
- [Discord: cliente de escritorio y Electron](https://discord.com/blog/how-discord-seamlessly-upgraded-millions-of-users-to-64-bit-architecture)
- Dinosaurio: `native/vendor/chromium/README.md` y su licencia BSD.
