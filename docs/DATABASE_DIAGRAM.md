# Diagrama de la Base de Datos de LaFilmoteca

## Colecciones y Campos

### users
```typescript
{
  uid: string;              // ID del usuario (mismo que auth)
  email: string;            // Email del usuario
  displayName: string;      // Nombre mostrado
  photoURL?: string;        // URL de la foto de perfil
  role: 'user' | 'admin';   // Rol del usuario
  isActive: boolean;        // Estado de la cuenta
  bio?: string;             // Biografía del usuario
  createdAt: Timestamp;     // Fecha de creación
  updatedAt: Timestamp;     // Fecha de última actualización
}
```

### collections
```typescript
{
  id: string;              // ID de la colección
  userId: string;          // ID del usuario creador
  name: string;            // Nombre de la colección
  description?: string;    // Descripción
  isPublic: boolean;       // Visibilidad pública
  createdAt: Timestamp;    // Fecha de creación
  updatedAt: Timestamp;    // Fecha de última actualización
  coverImage?: string;     // Imagen de portada
  movieCount: number;      // Número de películas
}
```

### collectionMovies
```typescript
{
  id: string;              // ID de la relación
  collectionId: string;    // ID de la colección
  movieId: string;         // ID de la película
  userId: string;          // ID del usuario dueño
  addedAt: Timestamp;      // Fecha de adición
}
```

### reviews
```typescript
{
  id: string;              // ID de la reseña
  movieId: string;         // ID de la película
  userId: string;          // ID del usuario
  userName: string;        // Nombre del usuario
  userPhotoURL?: string;   // URL de la foto del usuario
  rating: number;          // Valoración (1-5)
  title: string;           // Título de la reseña
  content: string;         // Contenido de la reseña
  likes: number;           // Número de likes
  isApproved: boolean;     // Estado de aprobación
  createdAt: Timestamp;    // Fecha de creación
}
```

## Reglas de Seguridad

1. **users**
   - Lectura: Cualquiera puede leer
   - Creación: Solo el propio usuario
   - Actualización/Eliminación: Solo el propio usuario o admin

2. **collections**
   - Lectura: Cualquiera puede leer
   - Creación: Solo usuarios activos
   - Actualización/Eliminación: Solo el propietario

3. **collectionMovies**
   - Lectura: Cualquiera puede leer
   - Escritura: Solo el propietario de la colección

4. **reviews**
   - Lectura: Cualquiera puede leer
   - Escritura: Solo usuarios activos