# Documentación del Proceso de Desarrollo de LaFilmoteca

## Estructura del Proyecto

LaFilmoteca es una aplicación web desarrollada con el stack MERN (modificado para usar Firebase en lugar de MongoDB/Express), que permite a los usuarios buscar películas, crear reseñas y gestionar su colección personal de películas favoritas.

## Flujo de Trabajo Git

Para este proyecto, se ha adoptado un flujo de trabajo basado en Git Flow con las siguientes ramas principales:

- **main**: Rama principal que contiene el código en producción
- **develop**: Rama de desarrollo donde se integran las nuevas funcionalidades
- **feature/xxx**: Ramas para el desarrollo de funcionalidades específicas
- **bugfix/xxx**: Ramas para la corrección de errores
- **release/xxx**: Ramas para la preparación de versiones para producción

## Registro de Desarrollo

### Rama: develop

**Fecha**: 29/03/2025

**Descripción**: Creación de la rama develop a partir de main para comenzar el desarrollo del proyecto siguiendo el flujo de trabajo Git Flow.

**Cambios realizados**:
- Configuración inicial del flujo de trabajo Git Flow
- Creación de la documentación del proceso de desarrollo

### Próximas Tareas

1. Implementar sistema de autenticación con Firebase (roles: invitado, general, administrador)
2. Desarrollar la integración completa con TMDB API
3. Crear componentes UI para la visualización de películas
4. Implementar sistema CRUD para reseñas de películas
5. Desarrollar panel de administración para gestión de usuarios y moderación de reseñas