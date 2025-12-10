# 🔥 Cómo Eliminar un Usuario desde Firebase

## Paso 1: Eliminar el Usuario de Authentication

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **"Banderas"** (o el nombre de tu proyecto)
3. En el menú lateral izquierdo, haz clic en **"Authentication"** (Autenticación)
4. Ve a la pestaña **"Users"** (Usuarios)
5. Busca el usuario **"SkibidiToiletMathias"** (o el email asociado)
6. Haz clic en los **tres puntos (⋮)** a la derecha del usuario
7. Selecciona **"Delete user"** (Eliminar usuario)
8. Confirma la eliminación

## Paso 2: Eliminar el Documento de la Colección "usuarios"

1. En Firebase Console, ve a **"Firestore Database"** en el menú lateral
2. Haz clic en la colección **"usuarios"**
3. Busca el documento con el ID del usuario (el `userId` de la puntuación)
4. Haz clic en el documento para abrirlo
5. Haz clic en el icono de **papelera (🗑️)** en la parte superior
6. Confirma la eliminación

## Paso 3: Eliminar las Puntuaciones del Usuario (Opcional)

1. En Firestore Database, ve a la colección **"puntuaciones"**
2. Usa el filtro para buscar por `userId` igual al ID del usuario eliminado
3. Selecciona todas las puntuaciones de ese usuario
4. Haz clic en **"Delete"** (Eliminar) para borrarlas todas

## Método Alternativo: Usar la Consola de Firestore

Si tienes muchas puntuaciones, puedes:

1. Ve a **Firestore Database**
2. Haz clic en **"puntuaciones"**
3. Usa la barra de búsqueda para filtrar por `userId`
4. Selecciona múltiples documentos (marca la casilla)
5. Haz clic en **"Delete"** para eliminarlos todos

## Nota Importante

- Eliminar el usuario de Authentication NO elimina automáticamente los documentos en Firestore
- Debes eliminar manualmente:
  - El documento en la colección "usuarios"
  - Las puntuaciones en la colección "puntuaciones"
- Después de eliminar, el ranking se actualizará automáticamente la próxima vez que se cargue

## Verificación

Después de eliminar:
1. Recarga la página del juego
2. Abre el ranking
3. Verifica que el usuario "SkibidiToiletMathias" ya no aparezca

