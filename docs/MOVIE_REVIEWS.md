# Implementación del Sistema de Reseñas de Películas

## Rama: feature/movie-reviews

**Fecha**: 29/03/2025

**Descripción**: Implementación de un sistema CRUD completo para la gestión de reseñas de películas por parte de los usuarios.

## Objetivos

1. Crear el modelo de datos para las reseñas de películas
2. Desarrollar componentes UI para la creación y edición de reseñas
3. Implementar la visualización de reseñas por película
4. Integrar con el sistema de autenticación para la autorización
5. Implementar funcionalidad de valoración con estrellas

## Cambios a Realizar

- Creación de servicio para la gestión de reseñas en Firestore
- Desarrollo de componentes UI para la creación, edición y visualización de reseñas
- Implementación de sistema de valoración con estrellas
- Integración con el perfil de usuario para mostrar reseñas realizadas
- Implementación de funcionalidad de moderación para administradores

## Detalles Técnicos

### Estructura de Datos

```typescript
interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 estrellas
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isApproved: boolean; // Para moderación
  likes: number;
  userPhotoURL?: string;
}
```

### Componentes UI

- **ReviewForm**: Formulario para crear y editar reseñas
- **ReviewList**: Listado de reseñas para una película específica
- **ReviewItem**: Componente individual para mostrar una reseña
- **StarRating**: Componente para la valoración con estrellas

### Reglas de Seguridad

Se implementarán reglas de seguridad en Firestore para garantizar que:

- Solo usuarios autenticados pueden crear reseñas
- Los usuarios solo pueden editar o eliminar sus propias reseñas
- Los administradores pueden moderar (aprobar/rechazar) cualquier reseña

### Integración con Otras Características

- **Autenticación**: Verificación de usuario para crear/editar reseñas
- **TMDB API**: Vinculación de reseñas con películas de la base de datos
- **Perfiles de Usuario**: Mostrar reseñas realizadas en el perfil del usuario
- **Panel de Administración**: Herramientas de moderación para administradores