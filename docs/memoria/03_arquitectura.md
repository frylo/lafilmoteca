# 3. Arquitectura del Sistema

## 3.1 Visión General

LaFilmoteca implementa una arquitectura moderna serverless que se divide en tres capas principales:

1. **Frontend (Cliente)**: Aplicación React que maneja la interfaz de usuario
2. **Backend Serverless**: Servicios Firebase para autenticación y datos
3. **Servicios Externos**: Integración con TMDB API para información de películas

### 3.1.1 Diagrama de Arquitectura
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│    Frontend     │────▶│ Firebase Services │────▶│  Firestore  │
│    (React)      │     │  (Auth, Hosting)  │     │  Database   │
└────────┬────────┘     └──────────────────┘     └─────────────┘
         │
         │              ┌──────────────────┐
         └─────────────▶│    TMDB API      │
                       │  (Movie Data)     │
                       └──────────────────┘
```

### 3.1.2 Características Principales
- Arquitectura serverless para minimizar mantenimiento
- Escalado automático con Firebase
- Caché en múltiples niveles
- Autenticación integrada
- API REST para datos de películas

## 3.2 Frontend

### 3.2.1 Componentes Principales
El frontend se organiza en módulos funcionales:

```typescript
// Ejemplo de organización de módulos
interface Module {
  routes: Route[];
  components: Component[];
  services: Service[];
  hooks: Hook[];
}

const MovieModule: Module = {
  routes: ['/movies', '/movies/:id'],
  components: [MovieList, MovieDetail],
  services: [movieService],
  hooks: [useMovie, useMovieSearch]
};
```

### 3.2.2 Gestión de Estado
Implementamos una estrategia de estado por niveles:

1. **Estado Global** (Auth, Theme):
```typescript
const AppState = {
  auth: AuthContext,
  theme: ThemeContext,
  notifications: NotificationContext
};
```

2. **Estado de Módulo** (Movies, Reviews):
```typescript
const MovieState = {
  movies: MovieContext,
  filters: FilterContext,
  pagination: PaginationContext
};
```

3. **Estado Local** (Componentes individuales)

## 3.3 Backend Serverless

### 3.3.1 Firebase Authentication
Sistema completo de autenticación:

```typescript
interface AuthService {
  // Métodos principales
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, data: UserData) => Promise<User>;
  signOut: () => Promise<void>;
  
  // Gestión de sesiones
  getCurrentUser: () => User | null;
  onAuthStateChanged: (callback: (user: User | null) => void) => Unsubscribe;
  
  // Roles y permisos
  verifyAdmin: (user: User) => Promise<boolean>;
  updateUserClaims: (uid: string, claims: CustomClaims) => Promise<void>;
}
```

### 3.3.2 Cloud Firestore
Base de datos NoSQL con las siguientes características:

1. **Colecciones Principales**:
```typescript
interface Collections {
  users: Collection<User>;
  movies: Collection<Movie>;
  reviews: Collection<Review>;
  collections: Collection<MovieCollection>;
}
```

2. **Índices Optimizados**:
```javascript
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
    }
  ]
}
```

3. **Reglas de Seguridad**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función helper para verificar admin
    function isAdmin() {
      return request.auth.token.admin == true;
    }
    
    // Reglas para reviews
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId || isAdmin();
    }
  }
}
```

### 3.3.3 Firebase Hosting
Configuración de hosting optimizada:

```javascript
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      }
    ]
  }
}
```

## 3.4 Integración con TMDB

### 3.4.1 Cliente API
Implementación del cliente TMDB:

```typescript
class TMDBClient {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  // Métodos principales
  async getMovie(id: string): Promise<Movie> {
    return this.get(`/movie/${id}`);
  }
  
  async searchMovies(query: string): Promise<MovieSearchResponse> {
    return this.get('/search/movie', { query });
  }
  
  // Método base para requests
  private async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('api_key', this.apiKey);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }
    
    return response.json();
  }
}
```

### 3.4.2 Caché y Rate Limiting
Sistema de caché para optimizar llamadas:

```typescript
class TMDBCache {
  private cache = new Map<string, CacheEntry>();
  private readonly ttl: number;
  
  constructor(ttl = 3600000) { // 1 hora por defecto
    this.ttl = ttl;
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}
```

## 3.5 Seguridad (detallada y aplicada)

La seguridad es transversal y se aplica en todas las capas del sistema. A continuación se detallan los mecanismos y cómo se implementan y aplican en frontend y backend:

### 3.5.1 Seguridad en el Frontend
- **Protección de rutas**: Se implementa mediante componentes como `ProtectedRoute` y comprobaciones de rol en el router. Solo usuarios autenticados pueden acceder a rutas protegidas y solo los administradores a rutas de administración. Ejemplo:
  ```tsx
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="admin">
      <AdminLayout />
    </ProtectedRoute>
  } />
  ```
- **Sanitización de inputs**: Todos los formularios (por ejemplo, `ReviewForm`, `CollectionForm`) sanitizan los datos antes de enviarlos, evitando XSS y ataques de inyección. Se emplean utilidades de validación y limpieza de strings.
- **Validación doble**: Se usa Zod en frontend para validar los datos antes de enviarlos y se valida de nuevo en backend (reglas Firestore y validadores en Cloud Functions). Esto previene manipulación de datos desde el cliente.
- **No exposición de secretos**: Las claves de API y credenciales sensibles nunca se exponen en el frontend. Se usan variables de entorno y el código cliente solo accede a las funciones públicas de Firebase y TMDB.
- **CSP y headers de seguridad**: El backend (Firebase Hosting) aplica Content Security Policy y otros headers de seguridad para evitar ataques de tipo script injection y clickjacking.
- **Gestión de sesión**: El estado de autenticación se gestiona con el SDK de Firebase, que almacena los tokens de sesión de forma segura y los renueva automáticamente.
- **Accesibilidad y feedback**: Los formularios muestran mensajes claros ante errores de validación, evitando fugas de información sensible.

### 3.5.2 Seguridad en Backend y reglas
- **Reglas Firestore**: Solo el usuario o un admin puede modificar su perfil. Solo el autor o un admin puede editar/eliminar una review. Validación de rangos y longitudes en reviews y colecciones. Ejemplo:
  ```javascript
  match /reviews/{reviewId} {
    allow read: if true;
    allow create: if request.auth != null;
    allow update, delete: if request.auth.uid == resource.data.userId || isAdmin();
  }
  ```
- **Validación de datos**: Se usan validadores Zod en backend (Cloud Functions) para asegurar que los datos cumplen los requisitos antes de ser escritos en la base de datos.
- **Roles y claims personalizados**: Los roles de usuario (admin, user) se gestionan mediante custom claims en Firebase Auth y se comprueban en reglas y funciones.
- **No exposición de datos sensibles**: Los endpoints y funciones nunca devuelven información sensible (por ejemplo, tokens, emails de otros usuarios, etc.).
- **Auditoría y logging**: Todas las acciones críticas (cambios de rol, borrado de reviews, etc.) se registran en logs estructurados para su posterior auditoría.

### 3.5.3 Aplicación práctica
- Todas las rutas protegidas en frontend verifican el estado de autenticación y el rol antes de mostrar la información.
- Los formularios validan y sanitizan los datos antes de enviarlos, y el backend los valida de nuevo.
- Las reglas de Firestore y las funciones Cloud Functions impiden accesos no autorizados y validan los datos antes de cualquier operación.
- Los logs y métricas permiten detectar y analizar intentos de acceso indebido o errores de seguridad.

## 3.6 Escalabilidad y Performance

### 3.6.1 Estrategias de Caché
Implementación de caché en múltiples niveles:

```typescript
interface CacheStrategy {
  // Caché en memoria
  memory: {
    ttl: number;
    maxSize: number;
  };
  
  // Caché en localStorage
  local: {
    prefix: string;
    ttl: number;
  };
  
  // Caché en Firebase
  remote: {
    collection: string;
    ttl: number;
  };
}

const cacheConfig: CacheStrategy = {
  memory: {
    ttl: 3600, // 1 hora
    maxSize: 100 // máximo 100 items
  },
  local: {
    prefix: 'filmoteca_',
    ttl: 86400 // 24 horas
  },
  remote: {
    collection: 'cache',
    ttl: 604800 // 1 semana
  }
};
```

### 3.6.2 Optimización de Queries
Estrategias para queries eficientes:

```typescript
interface QueryOptimization {
  // Paginación
  pagination: {
    limit: number;
    cursors: boolean;
  };
  
  // Campos parciales
  fieldsToFetch: string[];
  
  // Ordenamiento
  orderBy: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

const queryConfig: QueryOptimization = {
  pagination: {
    limit: 20,
    cursors: true
  },
  fieldsToFetch: ['id', 'title', 'poster_path'],
  orderBy: {
    field: 'popularity',
    direction: 'desc'
  }
};
```

## 3.7 Monitorización

### 3.7.1 Logging
Sistema de logging estructurado:

```typescript
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

interface Logger {
  debug: (message: string, meta?: object) => void;
  info: (message: string, meta?: object) => void;
  warn: (message: string, meta?: object) => void;
  error: (message: string, error?: Error, meta?: object) => void;
}

const logger: Logger = {
  debug: (message, meta) => {
    console.debug(JSON.stringify({ level: LogLevel.DEBUG, message, meta }));
  },
  // ... otros métodos
};
```

### 3.7.2 Métricas
Sistema de métricas para monitorización:

```typescript
interface Metrics {
  // Tiempos de respuesta
  timing: {
    apiCalls: Record<string, number>;
    pageLoads: Record<string, number>;
  };
  
  // Errores
  errors: {
    count: number;
    types: Record<string, number>;
  };
  
  // Uso
  usage: {
    activeUsers: number;
    searchQueries: number;
    reviewsCreated: number;
  };
}
```