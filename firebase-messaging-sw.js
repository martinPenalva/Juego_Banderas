importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyDyf2mRx0S1CBOH7u4N8kINoH6Bxe_ItZo',
    authDomain: 'banderas-f31cf.firebaseapp.com',
    projectId: 'banderas-f31cf',
    storageBucket: 'banderas-f31cf.firebasestorage.app',
    messagingSenderId: '413939026360',
    appId: '1:413939026360:web:b6e8b65c1f86cc9cf2274d'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
    const title = payload.notification?.title || 'Nuevo aviso';
    const options = {
        body: payload.notification?.body || 'Tienes una nueva notificacion',
        icon: payload.notification?.icon || 'https://martinpenalva.github.io/Juego_Banderas/OIG1.jpg',
        badge: payload.notification?.icon || 'https://martinpenalva.github.io/Juego_Banderas/OIG1.jpg',
        tag: payload.data?.tag || 'default',
        renotify: false,
        data: payload.data || {},
        vibrate: [200, 100, 200]
    };

    return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || 'https://martinpenalva.github.io/Juego_Banderas/index.html';
    event.waitUntil(clients.openWindow(targetUrl));
});
