# 🚀 Instrucciones para Desplegar Cloud Functions

Sigue estos pasos para desplegar las Cloud Functions y activar las notificaciones push.

## 📋 Requisitos Previos

1. **Node.js instalado** (versión 18 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica instalación: `node --version`

2. **Firebase CLI instalado**
   - Instala con: `npm install -g firebase-tools`
   - Verifica instalación: `firebase --version`

## 🔧 Pasos de Instalación

### 1. Iniciar sesión en Firebase

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte con tu cuenta de Google.

### 2. Inicializar Firebase Functions (si no está inicializado)

```bash
firebase init functions
```

Cuando te pregunte:
- **¿Qué lenguaje quieres usar?** → Selecciona **JavaScript**
- **¿Quieres usar ESLint?** → **Sí**
- **¿Quieres instalar dependencias ahora?** → **Sí**

### 3. Instalar dependencias

```bash
cd functions
npm install
cd ..
```

### 4. Verificar que el proyecto esté configurado

Asegúrate de que `firebase.json` existe y tiene la configuración correcta.

## 🚀 Desplegar las Functions

### Opción 1: Desplegar todas las functions

```bash
firebase deploy --only functions
```

### Opción 2: Desplegar solo la función de notificaciones

```bash
firebase deploy --only functions:sendPushNotification
```

### Opción 3: Desplegar con la función de limpieza

```bash
firebase deploy --only functions:sendPushNotification,functions:cleanOldNotifications
```

## ✅ Verificar el Despliegue

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Functions** en el menú lateral
4. Deberías ver:
   - `sendPushNotification` (activa)
   - `cleanOldNotifications` (activa, se ejecuta diariamente)

## 🧪 Probar las Notificaciones

1. **Recarga la aplicación** en el navegador
2. **Inicia sesión** y acepta los permisos de notificación
3. **Verifica en la consola** que aparezca: `Token FCM obtenido: [token]`
4. **Pide a un amigo que te envíe un mensaje**
5. **Cierra completamente la aplicación** (mata el proceso)
6. **Deberías recibir la notificación push** 🎉

## 🔍 Ver Logs de las Functions

Para ver los logs en tiempo real:

```bash
firebase functions:log
```

O ve a Firebase Console > Functions > Logs

## 🛠️ Solución de Problemas

### Error: "Functions directory does not exist"
- Asegúrate de estar en la carpeta raíz del proyecto
- Verifica que existe la carpeta `functions/`

### Error: "Permission denied"
- Ejecuta `firebase login` nuevamente
- Verifica que tienes permisos en el proyecto de Firebase

### Error: "npm install failed"
- Asegúrate de tener Node.js 18 o superior
- Intenta eliminar `node_modules` y `package-lock.json` y reinstalar

### Las notificaciones no funcionan
- Verifica que la función está desplegada en Firebase Console
- Revisa los logs de las functions para ver errores
- Asegúrate de que el token FCM está guardado en Firestore

## 📝 Notas Importantes

- **Primera vez**: El despliegue puede tardar varios minutos
- **Costos**: Las Cloud Functions tienen un plan gratuito generoso, pero revisa los límites
- **Región**: Las functions se despliegan en `us-central1` por defecto
- **Actualizaciones**: Cada vez que cambies el código, vuelve a desplegar

## 🎯 Próximos Pasos

Una vez desplegadas las functions:
1. Las notificaciones funcionarán incluso cuando la app esté cerrada
2. Los logs te ayudarán a depurar cualquier problema
3. Puedes monitorear el uso en Firebase Console

¡Listo! 🎉 Tus notificaciones push ahora funcionarán completamente.

