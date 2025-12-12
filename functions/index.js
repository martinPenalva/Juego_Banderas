const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Cloud Function que se activa cuando se crea un documento en 'notificacionesPendientes'
 * Envía una notificación push al usuario destinatario
 */
exports.sendPushNotification = functions.firestore
  .document('notificacionesPendientes/{notificationId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    // Evitar procesar notificaciones ya enviadas
    if (data.enviado) {
      console.log('Notificación ya procesada:', context.params.notificationId);
      return null;
    }
    
    // Verificar que tenemos los datos necesarios
    if (!data.fcmToken) {
      console.error('No hay token FCM en la notificación');
      await snap.ref.update({ 
        error: 'No hay token FCM',
        enviado: false
      });
      return null;
    }
    
    // Construir el mensaje de notificación
    const message = {
      notification: {
        title: data.title || '💬 Nuevo mensaje',
        body: data.body || 'Tienes un nuevo mensaje',
      },
      data: {
        type: data.data?.type || 'chat',
        chatId: data.data?.chatId || '',
        fromUserId: data.data?.fromUserId || '',
        click_action: data.data?.click_action || 'https://martinpenalva.github.io/Juego_Banderas/index.html',
        ...data.data
      },
      token: data.fcmToken,
      webpush: {
        notification: {
          icon: 'https://martinpenalva.github.io/Juego_Banderas/OIG1.jpg',
          badge: 'https://martinpenalva.github.io/Juego_Banderas/OIG1.jpg',
          requireInteraction: false,
          vibrate: [200, 100, 200]
        },
        fcmOptions: {
          link: 'https://martinpenalva.github.io/Juego_Banderas/index.html'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };
    
    try {
      // Enviar la notificación push
      const response = await admin.messaging().send(message);
      console.log('Notificación enviada exitosamente:', response);
      
      // Marcar como enviada en Firestore
      await snap.ref.update({ 
        enviado: true, 
        enviadoAt: Date.now(),
        messageId: response
      });
      
      return null;
    } catch (error) {
      console.error('Error enviando notificación:', error);
      
      // Manejar errores específicos
      let errorMessage = error.message;
      if (error.code === 'messaging/invalid-registration-token' || 
          error.code === 'messaging/registration-token-not-registered') {
        // Token inválido, eliminar el token del usuario
        errorMessage = 'Token FCM inválido';
        console.log('Token FCM inválido, debería eliminarse del usuario');
      }
      
      // Marcar como error en Firestore
      await snap.ref.update({ 
        error: errorMessage,
        errorCode: error.code,
        enviado: false,
        intentadoAt: Date.now()
      });
      
      return null;
    }
  });

/**
 * Función para limpiar notificaciones antiguas (opcional)
 * Se ejecuta diariamente para mantener la base de datos limpia
 */
exports.cleanOldNotifications = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    try {
      const snapshot = await admin.firestore()
        .collection('notificacionesPendientes')
        .where('timestamp', '<', oneDayAgo)
        .get();
      
      if (snapshot.empty) {
        console.log('No hay notificaciones antiguas para limpiar');
        return null;
      }
      
      const batch = admin.firestore().batch();
      let count = 0;
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
        count++;
      });
      
      await batch.commit();
      console.log(`Eliminadas ${count} notificaciones antiguas`);
      return null;
    } catch (error) {
      console.error('Error limpiando notificaciones antiguas:', error);
      return null;
    }
  });

