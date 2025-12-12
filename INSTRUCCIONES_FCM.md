# 🔔 Instrucciones para Configurar Firebase Cloud Messaging (FCM)

Firebase Cloud Messaging permite recibir notificaciones push incluso cuando la aplicación está completamente cerrada.

## 📋 Pasos para Configurar FCM

### 1. Obtener la VAPID Key

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto (`banderas-f31cf`)
3. Ve a **Project Settings** (⚙️) en el menú lateral
4. Haz clic en la pestaña **Cloud Messaging**
5. En la sección **Web Push certificates**, verás una clave llamada **"Key pair"**
   - Si no existe, haz clic en **"Generate key pair"** para crear una
6. Copia la clave (comienza con `BEl...` o similar)

### 2. Actualizar la VAPID Key en el código

1. Abre el archivo `index.html`
2. Busca la línea que dice:
   ```javascript
   const VAPID_KEY = "BEl62iUYgUivxIkv69yViEuiBIa40TNKuJ4L5lO0KjJ4YgLLPKjV4C9X0BVxO2Y8Q8pK-0RzJ5eT2L4YzJ5eT2L4";
   ```
3. Reemplaza el valor con tu VAPID Key real

### 3. Configurar Cloud Functions (Recomendado para producción)

Para enviar notificaciones push de forma segura, necesitas crear una Cloud Function:

1. **Instala Firebase CLI** (si no lo tienes):
   ```bash
   npm install -g firebase-tools
   ```

2. **Inicia sesión en Firebase**:
   ```bash
   firebase login
   ```

3. **Inicializa Cloud Functions en tu proyecto**:
   ```bash
   firebase init functions
   ```

4. **Crea la función** en `functions/index.js`:
   ```javascript
   const functions = require('firebase-functions');
   const admin = require('firebase-admin');
   admin.initializeApp();

   exports.sendPushNotification = functions.firestore
     .document('notificacionesPendientes/{notificationId}')
     .onCreate(async (snap, context) => {
       const data = snap.data();
       
       if (data.enviado) return null;
       
       const message = {
         notification: {
           title: data.title,
           body: data.body,
         },
         data: {
           ...data.data,
           click_action: data.data.click_action || 'FLUTTER_NOTIFICATION_CLICK'
         },
         token: data.fcmToken,
       };
       
       try {
         await admin.messaging().send(message);
         await snap.ref.update({ enviado: true, enviadoAt: Date.now() });
         console.log('Notificación enviada exitosamente');
       } catch (error) {
         console.error('Error enviando notificación:', error);
       }
     });
   ```

5. **Despliega la función**:
   ```bash
   firebase deploy --only functions
   ```

### 4. Alternativa: Usar Server Key (No recomendado para producción)

Si no puedes configurar Cloud Functions, puedes usar el Server Key directamente:

1. En Firebase Console > Project Settings > Cloud Messaging
2. Copia el **Server Key** (está en la sección superior)
3. En `index.html`, busca la función `sendPushNotification`
4. Descomenta la sección que usa `SERVER_KEY` y pega tu clave

⚠️ **ADVERTENCIA**: Exponer el Server Key en el cliente es un riesgo de seguridad. Solo úsalo para pruebas.

## ✅ Verificación

1. **Inicia sesión** en la aplicación
2. **Acepta los permisos** de notificación cuando te los pida
3. **Abre la consola del navegador** (F12) y verifica que veas:
   ```
   Token FCM obtenido: [tu-token]
   ```
4. **Verifica en Firestore** que tu usuario tenga el campo `fcmToken` guardado
5. **Pide a un amigo que te envíe un mensaje**
6. **Cierra completamente la aplicación** (mata el proceso)
7. Deberías recibir la notificación push

## 🔧 Solución de Problemas

- **No recibo notificaciones**: 
  - Verifica que aceptaste los permisos
  - Revisa la consola del navegador por errores
  - Verifica que la VAPID Key sea correcta
  
- **Error al obtener token FCM**:
  - Asegúrate de que el Service Worker esté registrado
  - Verifica que la VAPID Key sea válida
  
- **Las notificaciones no funcionan cuando la app está cerrada**:
  - Asegúrate de tener Cloud Functions configuradas
  - O usa el método alternativo con Server Key

## 📱 Notas Importantes

- **iOS**: Las notificaciones push en iOS requieren que la app esté instalada como PWA y el usuario haya aceptado los permisos
- **Android**: Funciona mejor que iOS, especialmente cuando la app está en segundo plano
- **Navegador**: Las notificaciones funcionan bien en Chrome, Firefox y Edge modernos

