# Implementación de la Semana 4: Sistema de Reseñas de Películas

Este documento detalla la implementación del sistema de reseñas de películas en el proyecto LaFilmoteca, permitiendo a los usuarios valorar y compartir sus opiniones sobre las películas.

## Funcionalidades Implementadas

### 1. Modelo de Datos para Reseñas

- **Estructura de Reseña**: Implementación completa en Firestore con los siguientes campos:
  - id: Identificador único de la reseña
  - movieId: ID de la película reseñada
  - userId: ID del usuario que escribió la reseña
  - userName: Nombre del usuario para mostrar
  - rating: Valoración de 1 a 5 estrellas
  - title: Título de la reseña
  - content: Contenido detallado de la reseña
  - createdAt: Fecha de creación
  - updatedAt: Fecha de última actualización
  - isApproved: Estado de aprobación (para moderación)
  - likes: Número de "me gusta"
  - userPhotoURL: URL de la foto de perfil del usuario

### 2. Componentes de Reseñas

- **StarRating**: 
  - Componente reutilizable para valoración con estrellas
  - Soporte para modo de solo lectura y diferentes tamaños
  - Interacción visual con hover y selección

- **ReviewForm**: 
  - Formulario para crear y editar reseñas
  - Validación de campos con react-hook-form
  - Integración con el componente StarRating
  - Manejo de estados de carga y errores

- **ReviewItem**: 
  - Visualización individual de reseñas
  - Funcionalidad para dar "me gusta"
  - Opciones de edición y eliminación para el autor
  - Moderación para administradores

- **ReviewList**: 
  - Listado de reseñas para una película
  - Opciones de ordenación (más recientes, mejor valoradas, etc.)
  - Integración con ReviewForm para añadir nuevas reseñas
  - Control para evitar reseñas duplicadas por usuario

- **UserReviews**: 
  - Visualización de reseñas en el perfil de usuario
  - Obtención de detalles de películas para cada reseña
  - Diseño adaptado para mostrar información resumida

### 3. Servicios de Gestión de Reseñas

- **getMovieReviews**: Obtención de reseñas para una película específica con opciones de ordenación
- **getUserReviews**: Obtención de todas las reseñas realizadas por un usuario
- **createReview**: Creación de nuevas reseñas con validación
- **updateReview**: Actualización de reseñas existentes
- **deleteReview**: Eliminación de reseñas
- **likeReview/unlikeReview**: Gestión de "me gusta" en reseñas
- **moderateReview**: Funcionalidad para administradores para aprobar/rechazar reseñas

### 4. Integración con Otras Características

- **Perfil de Usuario**: 
  - Visualización de reseñas del usuario en su perfil
  - Acceso directo a las películas reseñadas

- **Detalles de Película**: 
  - Sección de reseñas en la página de detalles de película
  - Posibilidad de añadir reseñas directamente desde la página de la película

- **Sistema de Autenticación**: 
  - Verificación de usuario para crear/editar reseñas
  - Control de permisos basado en roles

## Estructura de Archivos

```
src/
  ├── components/
  │   └── ui/
  │       ├── ReviewForm.tsx    # Formulario de creación/edición de reseñas
  │       ├── ReviewItem.tsx    # Componente individual de reseña
  │       ├── ReviewList.tsx    # Listado de reseñas para una película
  │       ├── StarRating.tsx    # Componente de valoración con estrellas
  │       └── UserReviews.tsx   # Reseñas en perfil de usuario
  ├── lib/
  │   └── reviews.ts           # Servicios para gestión de reseñas en Firestore
  └── types/
      └── index.ts             # Definición del tipo Review
```

## Reglas de Seguridad

Se han implementado reglas de seguridad en Firestore para garantizar que:

- Solo usuarios autenticados pueden crear reseñas
- Los usuarios solo pueden editar o eliminar sus propias reseñas
- Los administradores pueden moderar cualquier reseña

## Próximos Pasos

- Implementar sistema de reportes para reseñas inapropiadas
- Añadir estadísticas de reseñas en el perfil de usuario
- Mejorar el sistema de "me gusta" con persistencia por usuario
- Implementar recomendaciones basadas en reseñas similares
- Añadir funcionalidad de comentarios en reseñas