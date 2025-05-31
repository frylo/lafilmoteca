# 4. Backend

## 4.1 Arquitectura Serverless

### 4.1.1 Firebase como Backend
LaFilmoteca utiliza Firebase como plataforma principal de backend, aprovechando sus servicios serverless para proporcionar una solución escalable y mantenible.

### 4.1.2 Servicios Principales

```typescript
interface FirebaseServices {
  auth: FirebaseAuth;         // Autenticación de usuarios
  firestore: Firestore;       // Base de datos NoSQL
  storage: Storage;           // Almacenamiento de archivos
  functions: Functions;       // Funciones serverless
  analytics: Analytics;       // Análisis de uso
}
```

## 4.2 Autenticación

### 4.2.1 Sistema de Autenticación
Implementación del sistema de autenticación:

```typescript
interface AuthService {
  // Métodos de autenticación
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  
  // Gestión de sesiones
  getCurrentUser: () => User | null;
  onAuthStateChanged: (callback: (user: User | null) => void) => Unsubscribe;
  
  // Recuperación de cuenta
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

// Implementación con Firebase Auth
class FirebaseAuthService implements AuthService {
  private auth: Auth;
  
  constructor() {
    this.auth = getAuth(app);
  }
  
  async signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  
  // ... implementación de otros métodos
}
```

### 4.2.2 Gestión de Roles
Sistema de roles y permisos:

```typescript
interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

const roles: Role[] = [
  {
    id: 'user',
    name: 'Usuario Regular',
    permissions: [
      {
        resource: 'reviews',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        resource: 'collections',
        actions: ['create', 'read', 'update', 'delete']
      }
    ]
  },
  {
    id: 'admin',
    name: 'Administrador',
    permissions: [
      {
        resource: '*',
        actions: ['create', 'read', 'update', 'delete']
      }
    ]
  }
];
```

## 4.3 Base de Datos

### 4.3.1 Estructura de Datos
Modelo de datos en Firestore:

```typescript
// Colección: users
interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

// Colección: reviews
interface Review {
  id: string;
  userId: string;
  movieId: string;
  rating: number;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Colección: collections
interface MovieCollection {
  id: string;
  userId: string;
  name: string;
  description: string;
  movies: string[]; // Array de IDs de películas
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 4.3.2 Índices y Consultas
Optimización de consultas:

```typescript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "reviews",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "movieId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "collections",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## 4.4 Cloud Functions

### 4.4.1 Funciones de Usuario
Gestión de usuarios:

```typescript
// functions/src/users.ts
import * as functions from 'firebase-functions';
import { auth, firestore } from 'firebase-admin';

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const userDoc = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    role: 'user',
    createdAt: firestore.Timestamp.now(),
    lastLogin: firestore.Timestamp.now()
  };
  
  await firestore()
    .collection('users')
    .doc(user.uid)
    .set(userDoc);
});
```

### 4.4.2 Funciones de Reviews
Gestión de reseñas:

```typescript
// functions/src/reviews.ts
import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

export const onReviewCreated = functions.firestore
  .document('reviews/{reviewId}')
  .onCreate(async (snap, context) => {
    const review = snap.data();
    const movieId = review.movieId;
    
    // Actualizar estadísticas de la película
    const movieStats = firestore()
      .collection('movieStats')
      .doc(movieId);
      
    await movieStats.update({
      totalReviews: firestore.FieldValue.increment(1),
      averageRating: // Cálculo del promedio
    });
  });
```

## 4.5 APIs Externas

### 4.5.1 Integración con TMDB
Cliente para The Movie Database:

```typescript
// src/lib/tmdb.ts
interface TMDBConfig {
  apiKey: string;
  baseUrl: string;
  imageBaseUrl: string;
}

class TMDBClient {
  private config: TMDBConfig;
  
  constructor(config: TMDBConfig) {
    this.config = config;
  }
  
  async getMovie(id: string): Promise<Movie> {
    const response = await fetch(
      `${this.config.baseUrl}/movie/${id}?api_key=${this.config.apiKey}`
    );
    return response.json();
  }
  
  async searchMovies(query: string): Promise<MovieSearchResult> {
    const response = await fetch(
      `${this.config.baseUrl}/search/movie?api_key=${this.config.apiKey}&query=${query}`
    );
    return response.json();
  }
}
```

### 4.5.2 Caché y Rate Limiting
Sistema de caché para APIs externas:

```typescript
// src/lib/cache.ts
interface CacheConfig {
  ttl: number;          // Time to live en ms
  maxSize: number;      // Máximo número de items
}

class APICache<T> {
  private cache: Map<string, {
    data: T;
    timestamp: number;
  }>;
  private config: CacheConfig;
  
  constructor(config: CacheConfig) {
    this.cache = new Map();
    this.config = config;
  }
  
  set(key: string, data: T): void {
    // Limpiar caché si excede tamaño máximo
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Verificar TTL
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  private getOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }
    
    return oldestKey;
  }
}
```

## 4.6 Seguridad

### 4.6.1 Reglas de Firestore
Implementación de reglas de seguridad:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Funciones helper
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return request.auth.token.admin == true;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidReview() {
      let incoming = request.resource.data;
      return incoming.rating >= 1 
        && incoming.rating <= 5
        && incoming.content.size() >= 10
        && incoming.content.size() <= 1000;
    }
    
    // Reglas por colección
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) || isAdmin();
    }
    
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated() && isValidReview();
      allow update, delete: if isOwner(resource.data.userId) || isAdmin();
    }
    
    match /collections/{collectionId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.userId);
    }
  }
}
```

### 4.6.2 Validación de Datos
Implementación de validadores:

```typescript
// src/lib/validators.ts
import { z } from 'zod';

// Esquema de validación para reseñas
export const reviewSchema = z.object({
  movieId: z.string().min(1),
  rating: z.number().min(1).max(5),
  content: z.string().min(10).max(1000),
  spoilers: z.boolean().default(false)
});

// Esquema de validación para colecciones
export const collectionSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
  movies: z.array(z.string()).max(100)
});

// Función helper para validación
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    return { success: false, errors: error as z.ZodError };
  }
};
```

## 4.7 Monitorización

### 4.7.1 Logging
Sistema de logging:

```typescript
// src/lib/logger.ts
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private logStore: FirebaseFirestore.CollectionReference;
  
  constructor() {
    this.logStore = firestore().collection('logs');
  }
  
  async log(entry: LogEntry): Promise<void> {
    await this.logStore.add({
      ...entry,
      timestamp: firestore.Timestamp.now()
    });
    
    // También enviar a Firebase Analytics si es error
    if (entry.level === LogLevel.ERROR) {
      analytics().logEvent('error', {
        error_message: entry.message,
        error_stack: entry.error?.stack
      });
    }
  }
}
```

### 4.7.2 Métricas
Sistema de métricas:

```typescript
// src/lib/metrics.ts
interface Metric {
  name: string;
  value: number;
  timestamp: number;
  labels?: Record<string, string>;
}

class MetricsCollector {
  private metricsStore: FirebaseFirestore.CollectionReference;
  
  constructor() {
    this.metricsStore = firestore().collection('metrics');
  }
  
  async recordMetric(metric: Metric): Promise<void> {
    await this.metricsStore.add({
      ...metric,
      timestamp: firestore.Timestamp.now()
    });
  }
  
  async getMetrics(
    name: string,
    timeRange: { start: Date; end: Date }
  ): Promise<Metric[]> {
    const snapshot = await this.metricsStore
      .where('name', '==', name)
      .where('timestamp', '>=', timeRange.start)
      .where('timestamp', '<=', timeRange.end)
      .get();
      
    return snapshot.docs.map(doc => doc.data() as Metric);
  }
}
```

## 4.8 Seguridad (detallada y aplicada)

La seguridad en el backend de LaFilmoteca se implementa en varias capas y se refuerza con validaciones, reglas y auditoría:

### 4.8.1 Reglas Firestore (ejemplos y justificación)
- Solo el usuario autenticado o un admin puede modificar su perfil (`users`).
- Solo el autor o un admin puede editar/eliminar una review (`reviews`).
- Las colecciones solo pueden ser modificadas por su propietario.
- Validación de rangos y longitudes en reviews y colecciones.
- Ejemplo real:
  ```javascript
  match /reviews/{reviewId} {
    allow read: if true;
    allow create: if isAuthenticated() && isValidReview();
    allow update, delete: if isOwner(resource.data.userId) || isAdmin();
  }
  ```

### 4.8.2 Validación de datos
- Se usan validadores Zod en Cloud Functions para asegurar que los datos cumplen los requisitos antes de ser escritos en la base de datos.
- Ejemplo:
  ```typescript
  export const reviewSchema = z.object({
    movieId: z.string().min(1),
    rating: z.number().min(1).max(5),
    content: z.string().min(10).max(1000),
    spoilers: z.boolean().default(false)
  });
  ```

### 4.8.3 Roles y claims personalizados
- Los roles de usuario (`admin`, `user`) se gestionan mediante custom claims en Firebase Auth y se comprueban en reglas y funciones.
- Ejemplo de comprobación en función:
  ```typescript
  function isAdmin(user) {
    return user.customClaims && user.customClaims.admin === true;
  }
  ```

### 4.8.4 Auditoría y logging
- Todas las acciones críticas (cambios de rol, borrado de reviews, etc.) se registran en logs estructurados en Firestore y Analytics.
- Ejemplo:
  ```typescript
  await logger.log({
    level: LogLevel.INFO,
    message: 'Review eliminada',
    context: { reviewId, userId }
  });
  ```

### 4.8.5 Aplicación práctica
- Las reglas y validaciones impiden accesos no autorizados y garantizan la integridad de los datos.
- Los logs y métricas permiten detectar y analizar intentos de acceso indebido o errores de seguridad.