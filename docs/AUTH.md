# Implementación del Sistema de Autenticación

## Rama: feature/auth-firebase

**Fecha**: 29/03/2025

**Descripción**: Implementación del sistema de autenticación con Firebase, incluyendo la gestión de roles de usuario (invitado, general y administrador).

## Objetivos

1. Configurar Firebase Authentication para el manejo de usuarios
2. Implementar el registro y login de usuarios
3. Crear un sistema de roles para distinguir entre usuarios invitados, generales y administradores
4. Desarrollar componentes UI para el registro, login y perfil de usuario
5. Implementar rutas protegidas según el rol del usuario

## Cambios Realizados

- Creación de contexto de autenticación para gestionar el estado del usuario
- Implementación de hooks personalizados para operaciones de autenticación
- Desarrollo de componentes de UI para registro y login
- Configuración de reglas de seguridad en Firestore para control de acceso basado en roles
- Implementación de middleware de autenticación para proteger rutas según el rol del usuario

## Detalles Técnicos

### Estructura de Datos de Usuario

```typescript
interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'guest' | 'user' | 'admin';
  createdAt: Date;
  lastLogin: Date;
}
```

### Flujo de Autenticación

1. El usuario se registra o inicia sesión mediante Firebase Authentication
2. Se crea o actualiza un documento en Firestore con la información extendida del usuario
3. El contexto de autenticación carga los datos del usuario y su rol
4. Las rutas y componentes de la aplicación se renderizan condicionalmente según el rol del usuario

### Reglas de Seguridad

Se implementarán reglas de seguridad en Firestore para garantizar que:

- Los usuarios invitados solo pueden leer datos públicos
- Los usuarios generales pueden crear y gestionar sus propias reseñas
- Los administradores tienen acceso completo a todos los datos y pueden moderar contenido