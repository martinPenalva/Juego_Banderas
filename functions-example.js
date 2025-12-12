// Ejemplo de Cloud Function para enviar notificaciones push
// Instrucciones:
// 1. Instala Firebase CLI: npm install -g firebase-tools
// 2. Inicia sesión: firebase login
// 3. Inicializa functions: firebase init functions
// 4. Reemplaza el contenido de functions/index.js con este código
// 5. Instala dependencias: cd functions && npm install
// 6. Despliega: firebase deploy --only functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendPushNotification = functions.firestore
  .document('notificacionesPendientes/{notificationId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    // Evitar procesar notificaciones ya enviadas
    if (data.enviado) {
      console.log('Notificación ya procesada');
      return null;
    }
    
    const message = {
      notification: {
        title: data.title,
        body: data.body,
      },
      data: {
        type: data.data?.type || 'chat',
        chatId: data.data?.chatId || '',
        fromUserId: data.data?.fromUserId || '',
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
      }
    };
    
    try {
      const response = await admin.messaging().send(message);
      console.log('Notificación enviada exitosamente:', response);
      
      // Marcar como enviada
      await snap.ref.update({ 
        enviado: true, 
        enviadoAt: Date.now(),
        messageId: response
      });
      
      return null;
    } catch (error) {
      console.error('Error enviando notificación:', error);
      
      // Marcar como error
      await snap.ref.update({ 
        error: error.message,
        enviado: false
      });
      
      return null;
    }
  });

// Función para limpiar notificaciones antiguas (opcional)
exports.cleanOldNotifications = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    const snapshot = await admin.firestore()
      .collection('notificacionesPendientes')
      .where('timestamp', '<', oneDayAgo)
      .get();
    
    const batch = admin.firestore().batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Eliminadas ${snapshot.size} notificaciones antiguas`);
    return null;
  });

