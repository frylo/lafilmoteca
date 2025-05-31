# 4. Modelo de Datos

## 4.1 Estructura de Base de Datos

### 4.1.1 Colección Users
```typescript
interface User {
  uid: string;              // ID único del usuario (Firebase Auth UID)
  email: string;           // Email del usuario
  displayName: string;     // Nombre público del usuario
  photoURL?: string;       // URL de la foto de perfil (opcional)
  role: 'user' | 'admin';  // Rol del usuario
  isActive: boolean;       // Estado de la cuenta
  createdAt: Timestamp;    // Fecha de creación
  updatedAt: Timestamp;    // Fecha de última actualización
}
```

### 4.1.2 Colección Collections
```typescript
interface Collection {
  id: string;           // ID único de la colección
  userId: string;       // ID del usuario propietario
  name: string;         // Nombre de la colección
  description?: string; // Descripción (opcional)
  isPublic: boolean;    // Visibilidad de la colección
  movieCount: number;   // Número de películas en la colección
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 4.1.3 Colección CollectionMovies
```typescript
interface CollectionMovie {
  id: string;           // ID del documento
  collectionId: string; // ID de la colección
  movieId: string;      // ID de TMDB de la película
  userId: string;       // ID del usuario (para queries)
  addedAt: Timestamp;   // Fecha de adición
}
```

### 4.1.4 Colección Reviews
```typescript
interface Review {
  id: string;           // ID único de la reseña
  movieId: string;      // ID de TMDB de la película
  userId: string;       // ID del autor
  userName: string;     // Nombre del autor
  userPhotoURL?: string; // Foto del autor
  title: string;        // Título de la reseña
  content: string;      // Contenido de la reseña
  rating: number;       // Puntuación (1-5)
  likes: number;        // Número de me gusta
  isApproved: boolean;  // Estado de moderación
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 4.2 Índices y Queries

### 4.2.1 Índices Simples
- users: email, role
- reviews: movieId, userId, isApproved
- collections: userId, isPublic
- collectionMovies: userId, collectionId

### 4.2.2 Índices Compuestos
```javascript
{
  "indexes": [
    {
      "collectionGroup": "reviews",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "movieId", "order": "ASCENDING" },
        { "fieldPath": "isApproved", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "collectionMovies",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "addedAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## 4.3 Reglas de Seguridad

### 4.3.1 Reglas para Users
```javascript
match /users/{userId} {
  allow read;
  allow create: if request.auth.uid == userId;
  allow update: if request.auth.uid == userId || 
                  request.auth.token.role == 'admin';
  allow delete: if request.auth.token.role == 'admin';
}
```

### 4.3.2 Reglas para Collections
```javascript
match /collections/{collectionId} {
  allow read: if resource.data.isPublic || 
              request.auth.uid == resource.data.userId;
  allow create: if request.auth != null && 
                 request.auth.uid == request.resource.data.userId;
  allow update, delete: if request.auth.uid == resource.data.userId;
}
```

### 4.3.3 Reglas para Reviews
```javascript
match /reviews/{reviewId} {
  allow read;
  allow create: if request.auth != null;
  allow update: if (request.auth.uid == resource.data.userId &&
                    request.resource.data.isApproved == resource.data.isApproved) ||
                   request.auth.token.role == 'admin';
  allow delete: if request.auth.token.role == 'admin';
}
```

## 4.4 Relaciones y Referencias

### 4.4.1 Referencias Directas
- Collection -> User (userId)
- CollectionMovie -> Collection (collectionId)
- Review -> User (userId)
- Review -> Movie (movieId -> TMDB)

### 4.4.2 Referencias Indirectas
- User -> Collections (query by userId)
- Movie -> Reviews (query by movieId)
- Collection -> Movies (through CollectionMovies)

## 4.5 Optimizaciones

### 4.5.1 Denormalización
- userName y userPhotoURL en Review
- movieCount en Collection
- Campos redundantes para queries

### 4.5.2 Paginación
- Límites en queries
- Cursores para navegación
- Ordenamiento consistente

### 4.5.3 Batch Operations
- Escrituras en lote
- Transacciones atómicas
- Updates incrementales

## 4.6 Validación de Datos

### 4.6.1 Schemas
- Tipos TypeScript
- Zod validators
- Runtime checks

### 4.6.2 Constraints
- Longitud de campos
- Formatos válidos
- Valores permitidos

### 4.6.3 Integridad
- Referencias válidas
- Estados consistentes
- Timestamps automáticos

## 4.7 Seguridad y validación en el modelo de datos

La seguridad y la validación de datos se aplican en todos los niveles del modelo:

### 4.7.1 Reglas de seguridad
- Los accesos a cada colección están protegidos por reglas Firestore específicas (ver ejemplos en la sección de backend).
- Solo el propietario puede modificar sus colecciones y reviews; solo admins pueden borrar usuarios o reviews ajenas.
- Los campos críticos (userId, movieId) se validan en cada operación.

### 4.7.2 Validación de datos
- Se emplean esquemas Zod y tipos TypeScript para garantizar la integridad de los datos.
- Ejemplo de esquema para reviews:
  ```typescript
  export const reviewSchema = z.object({
    movieId: z.string().min(1),
    rating: z.number().min(1).max(5),
    content: z.string().min(10).max(1000),
    spoilers: z.boolean().default(false)
  });
  ```
- Los datos se validan tanto en frontend como en backend antes de ser almacenados.

### 4.7.3 Integridad y consistencia
- Se usan referencias y constraints para evitar datos huérfanos o inconsistentes.
- Los timestamps se generan automáticamente y se validan en cada escritura.