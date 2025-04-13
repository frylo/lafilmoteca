# Implementación de Perfiles de Usuario

## Rama: feature/user-profiles

**Fecha**: 29/03/2025

**Descripción**: Implementación de perfiles de usuario con colecciones personalizadas de películas y estadísticas.

## Objetivos

1. Crear página de perfil de usuario personalizable
2. Implementar sistema de colecciones personalizadas de películas
3. Desarrollar estadísticas de usuario basadas en sus reseñas y películas favoritas
4. Permitir la configuración de preferencias de usuario
5. Implementar funcionalidad de seguimiento entre usuarios

## Cambios a Realizar

- Creación de servicio para la gestión de perfiles de usuario en Firestore
- Desarrollo de componentes UI para la visualización y edición del perfil
- Implementación de sistema de colecciones personalizadas
- Creación de componentes para mostrar estadísticas de usuario
- Desarrollo de funcionalidad de seguimiento entre usuarios

## Detalles Técnicos

### Estructura de Datos

```typescript
interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  favoriteGenres: string[];
  watchedMovies: string[];
  favoriteMovies: string[];
  watchlist: string[];
  customCollections: Collection[];
  followers: string[];
  following: string[];
  joinedDate: Date;
  lastActive: Date;
  preferences: UserPreferences;
  stats: UserStats;
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  movies: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface UserPreferences {
  darkMode: boolean;
  emailNotifications: boolean;
  language: string;
  showAdultContent: boolean;
}

interface UserStats {
  totalReviews: number;
  averageRating: number;
  mostReviewedGenre: string;
  favoriteDirector?: string;
  reviewsPerMonth: Record<string, number>;
}
```

### Componentes UI

- **ProfileHeader**: Muestra información básica del usuario y estadísticas
- **ProfileTabs**: Navegación entre secciones del perfil (colecciones, reseñas, etc.)
- **CollectionGrid**: Visualización de colecciones del usuario
- **CollectionForm**: Formulario para crear y editar colecciones
- **UserStats**: Visualización de estadísticas del usuario
- **UserSettings**: Formulario para configurar preferencias

### Reglas de Seguridad

Se implementarán reglas de seguridad en Firestore para garantizar que:

- Los usuarios solo pueden editar su propio perfil
- Las colecciones privadas solo son visibles para su propietario
- Las estadísticas se calculan automáticamente basadas en la actividad del usuario

### Integración con Otras Características

- **Autenticación**: Vinculación con el sistema de autenticación para acceso al perfil
- **TMDB API**: Uso de datos de películas para colecciones y estadísticas
- **Reseñas**: Integración con el sistema de reseñas para mostrar actividad del usuario
- **Panel de Administración**: Herramientas para moderadores y administradores