# Diagrama de Base de Datos para LaFilmoteca

## Modelo Entidad-Relación

Este documento describe el modelo de datos para LaFilmoteca, incluyendo las entidades principales, sus atributos y las relaciones entre ellas.

### Entidades Principales

#### Usuario
- **uid**: string - Identificador único del usuario
- **email**: string - Correo electrónico del usuario
- **displayName**: string - Nombre de visualización
- **role**: enum ('guest', 'user', 'admin') - Rol del usuario
- **createdAt**: Date - Fecha de creación de la cuenta
- **lastLogin**: Date - Fecha del último inicio de sesión

#### Película
- **id**: string - Identificador único de la película (de TMDB)
- **title**: string - Título de la película
- **originalTitle**: string - Título original de la película
- **poster**: string - URL del póster de la película
- **backdrop**: string - URL de la imagen de fondo
- **year**: number - Año de lanzamiento
- **director**: string - Director principal
- **runtime**: number - Duración en minutos
- **genres**: string[] - Géneros de la película
- **plot**: string - Sinopsis de la película
- **cast**: string[] - Reparto principal
- **rating**: number - Valoración media (de TMDB)

#### Reseña
- **id**: string - Identificador único de la reseña
- **movieId**: string - Referencia a la película
- **userId**: string - Referencia al usuario
- **userName**: string - Nombre del usuario
- **rating**: number - Valoración (1-5 estrellas)
- **title**: string - Título de la reseña
- **content**: string - Contenido de la reseña
- **createdAt**: Date - Fecha de creación
- **updatedAt**: Date - Fecha de última actualización
- **isApproved**: boolean - Estado de aprobación

#### Colección
- **id**: string - Identificador único de la colección
- **userId**: string - Referencia al usuario propietario
- **name**: string - Nombre de la colección
- **description**: string - Descripción de la colección
- **isPublic**: boolean - Visibilidad de la colección
- **createdAt**: Date - Fecha de creación
- **updatedAt**: Date - Fecha de última actualización

#### PelículaColección
- **collectionId**: string - Referencia a la colección
- **movieId**: string - Referencia a la película
- **addedAt**: Date - Fecha de adición a la colección

### Relaciones

1. **Usuario - Reseña**: Un usuario puede crear múltiples reseñas (1:N)
2. **Película - Reseña**: Una película puede tener múltiples reseñas (1:N)
3. **Usuario - Colección**: Un usuario puede crear múltiples colecciones (1:N)
4. **Colección - Película**: Una colección puede contener múltiples películas y una película puede estar en múltiples colecciones (N:M) a través de PelículaColección

### Diagrama Textual

```
Usuario 1 --- N Reseña N --- 1 Película
   |
   1
   |
   N
Colección N --- M Película
```

## Implementación en Firebase

En Firebase Firestore, este modelo se implementará utilizando las siguientes colecciones:

- **users**: Documentos de usuarios con sus datos básicos
- **userProfiles**: Datos extendidos de perfiles de usuario
- **reviews**: Reseñas de películas
- **collections**: Colecciones de películas
- **collectionMovies**: Relación entre colecciones y películas

Las películas no se almacenarán directamente en Firestore, sino que se obtendrán a través de la API de TMDB y se cachearán localmente cuando sea necesario.

### Reglas de Seguridad

Se implementarán reglas de seguridad en Firestore para garantizar:

- Los datos de usuario solo pueden ser leídos/escritos por el propio usuario o administradores
- Las reseñas pueden ser leídas por todos, pero solo modificadas por su autor o administradores
- Las colecciones privadas solo son accesibles por su propietario
- Los administradores tienen acceso completo para moderación