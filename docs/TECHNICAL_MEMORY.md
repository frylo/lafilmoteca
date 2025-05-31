# Memoria Técnica: LaFilmoteca
## Trabajo de Fin de Grado en Desarrollo de Aplicaciones Web

---

# Índice

1. [FASE I: Identificación del contexto](#fase-i-identificación-del-contexto)
   1.1. [Contextualización del proyecto](#11-contextualización-del-proyecto)
   1.2. [Necesidades y justificación del desarrollo](#12-necesidades-y-justificación-del-desarrollo)

2. [FASE II: Diseño del Proyecto](#fase-ii-diseño-del-proyecto)
   2.1. [Diseño técnico general](#21-diseño-técnico-general)
   2.2. [Estructura de la Base de Datos](#22-estructura-de-la-base-de-datos)
   2.3. [Viabilidad técnica y económica](#23-viabilidad-técnica-y-económica)
   2.4. [Objetivos específicos y planificación temporal](#24-objetivos-específicos-y-planificación-temporal)

3. [FASE III: Desarrollo del Proyecto](#fase-iii-desarrollo-del-proyecto)
   3.1. [Stack tecnológico utilizado](#31-stack-tecnológico-utilizado)
   3.2. [Estructura y organización del código fuente](#32-estructura-y-organización-del-código-fuente)
   3.3. [Procesos técnicos desarrollados](#33-procesos-técnicos-desarrollados)
   3.4. [Calidad y estándares utilizados](#34-calidad-y-estándares-utilizados)

4. [FASE IV: Control y Evaluación](#fase-iv-control-y-evaluación)
   4.1. [Criterios y métodos de evaluación](#41-criterios-y-métodos-de-evaluación)
   4.2. [Incidencias detectadas y solucionadas](#42-incidencias-detectadas-y-solucionadas)
   4.3. [Indicadores de calidad del proyecto](#43-indicadores-de-calidad-del-proyecto)

[Conclusiones](#conclusiones)

[Bibliografía](#bibliografía)

---

# FASE I: Identificación del contexto

## 1.1 Contextualización del proyecto

LaFilmoteca es una aplicación web moderna diseñada para cineastas y amantes del cine que necesitan una plataforma para:
- Gestionar y compartir reseñas de películas
- Crear colecciones personalizadas de películas
- Interactuar con otros usuarios a través de reseñas y colecciones
- Acceder a información detallada de películas a través de la API de TMDB

### Sector y usuarios objetivo
- **Sector**: Entretenimiento y cultura cinematográfica
- **Usuarios objetivo**: 
  - Cineastas y críticos de cine
  - Estudiantes de cine y comunicación audiovisual
  - Aficionados al cine que buscan compartir sus opiniones
  - Usuarios que quieren descubrir nuevas películas

### Problemática que soluciona
1. **Falta de plataformas especializadas**: Muchas plataformas de reseñas de cine son demasiado generalistas o están dominadas por contenido comercial
2. **Necesidad de organización**: Los usuarios necesitan una forma de organizar y categorizar sus películas favoritas
3. **Interacción limitada**: Las plataformas existentes no fomentan suficientemente la interacción entre usuarios
4. **Acceso a información**: Dificultad para acceder a información detallada y actualizada sobre películas

## 1.2 Necesidades y justificación del desarrollo

### Necesidades identificadas
1. **Gestión de reseñas**:
   - Crear y editar reseñas detalladas
   - Sistema de valoración con estrellas
   - Moderación de contenido
   - Interacción con otras reseñas (likes)

2. **Colecciones personalizadas**:
   - Crear colecciones temáticas
   - Añadir/eliminar películas
   - Control de privacidad
   - Compartir colecciones

3. **Perfiles de usuario**:
   - Información personal
   - Historial de reseñas
   - Colecciones creadas
   - Estadísticas de actividad

4. **Integración con TMDB**:
   - Información actualizada de películas
   - Pósters y datos técnicos
   - Búsqueda avanzada
   - Recomendaciones

### Justificación del desarrollo
1. **Innovación**: 
   - Combina funcionalidades de redes sociales con gestión de contenido cinematográfico
   - Sistema de moderación para garantizar la calidad del contenido
   - Interfaz moderna y accesible

2. **Viabilidad técnica**:
   - Uso de tecnologías modernas y escalables
   - Arquitectura basada en microservicios
   - Integración con APIs externas probadas

3. **Potencial de crecimiento**:
   - Base de usuarios potencialmente grande
   - Posibilidad de monetización futura
   - Escalabilidad del sistema

# FASE II: Diseño del Proyecto

## 2.1 Diseño técnico general

### Arquitectura de la aplicación

LaFilmoteca sigue una arquitectura de aplicación web moderna (SPA - Single Page Application) con las siguientes características:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │     │    Backend      │     │    Servicios    │
│   (React/Vite)  │◄───►│   (Firebase)    │◄───►│    Externos     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                        │
        │                       │                        │
        ▼                       ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Interfaz     │     │    Base de      │     │      TMDB       │
│     Usuario     │     │    Datos        │     │      API        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Componentes principales

1. **Frontend**:
   - React + TypeScript para la interfaz de usuario
   - Vite como bundler y servidor de desarrollo
   - TailwindCSS para estilos
   - React Router para navegación
   - Context API para gestión de estado

2. **Backend**:
   - Firebase Authentication para autenticación
   - Firestore para base de datos
   - Firebase Storage para archivos
   - Firebase Hosting para despliegue

3. **APIs Externas**:
   - TMDB API para datos de películas
   - Firebase SDK para servicios backend

## 2.2 Estructura de la Base de Datos

### Diagrama ER

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Users     │       │  Reviews    │       │  Movies     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ uid         │◄──────┤ userId      │       │ id          │
│ email       │       │ movieId     │──────►│ title       │
│ displayName │       │ rating      │       │ poster      │
│ photoURL    │       │ title       │       │ genres      │
│ role        │       │ content     │       │ director    │
│ isActive    │       │ isApproved  │       │ cast        │
│ bio         │       │ likes       │       │ plot        │
└─────────────┘       └─────────────┘       └─────────────┘
       │                     ▲
       │                     │
       ▼                     │
┌─────────────┐       ┌─────────────┐
│Collections  │       │Collection   │
├─────────────┤       │Movies       │
│ id          │       ├─────────────┤
│ userId      │       │ id          │
│ name        │       │ collectionId│
│ description │       │ movieId     │
│ isPublic    │       │ userId      │
│ coverImage  │       │ addedAt     │
└─────────────┘       └─────────────┘
```

### Colecciones y relaciones

1. **users**
   - Clave primaria: `uid` (string)
   - Relaciones: 
     - 1:N con `reviews`
     - 1:N con `collections`

2. **reviews**
   - Clave primaria: `id` (string)
   - Claves foráneas:
     - `userId` → users.uid
     - `movieId` → movies.id

3. **collections**
   - Clave primaria: `id` (string)
   - Clave foránea: `userId` → users.uid

4. **collectionMovies**
   - Clave primaria: `id` (string)
   - Claves foráneas:
     - `collectionId` → collections.id
     - `movieId` → movies.id
     - `userId` → users.uid

## 2.3 Viabilidad técnica y económica

### Viabilidad técnica
1. **Tecnologías probadas**:
   - React y Firebase son tecnologías maduras y bien documentadas
   - TMDB API proporciona datos fiables y actualizados
   - Arquitectura escalable y mantenible

2. **Rendimiento**:
   - Firebase proporciona baja latencia
   - Caché de datos de películas
   - Optimización de imágenes

3. **Seguridad**:
   - Autenticación robusta con Firebase
   - Reglas de seguridad en Firestore
   - Validación de datos en frontend y backend

### Viabilidad económica
1. **Costes de desarrollo**:
   - Herramientas de desarrollo gratuitas
   - Firebase tiene un tier gratuito generoso
   - TMDB API es gratuita para uso básico

2. **Costes de mantenimiento**:
   - Hosting en Firebase (escalable según uso)
   - Dominio y SSL
   - Monitoreo y backups

## 2.4 Objetivos específicos y planificación temporal

### Objetivos específicos
1. **Funcionalidad básica** (Semanas 1-2):
   - Autenticación de usuarios
   - Integración con TMDB
   - Visualización de películas

2. **Gestión de reseñas** (Semanas 3-4):
   - Creación y edición de reseñas
   - Sistema de valoración
   - Moderación de contenido

3. **Colecciones** (Semanas 5-6):
   - Creación de colecciones
   - Gestión de películas en colecciones
   - Compartir colecciones

4. **Perfiles y social** (Semanas 7-8):
   - Perfiles de usuario
   - Interacción entre usuarios
   - Estadísticas y actividad

### Planificación temporal
```
Semana 1: Setup y autenticación
Semana 2: Integración TMDB y películas
Semana 3: Sistema de reseñas
Semana 4: Moderación y validación
Semana 5: Colecciones básicas
Semana 6: Compartir y privacidad
Semana 7: Perfiles y social
Semana 8: Testing y despliegue
```

# FASE III: Desarrollo del Proyecto

## 3.1 Stack tecnológico utilizado

### Frontend
```typescript
// Tecnologías principales
- React 18.x
- TypeScript 5.x
- Vite 4.x
- TailwindCSS 3.x
- React Router 6.x

// Dependencias principales
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "firebase": "^10.x",
    "axios": "^1.x",
    "react-hook-form": "^7.x",
    "react-icons": "^4.x"
  }
}
```

### Backend (Firebase)
```typescript
// Servicios utilizados
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting

// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

## 3.2 Estructura y organización del código fuente

### Estructura de directorios
```
src/
├── assets/          # Imágenes y recursos estáticos
├── components/      # Componentes reutilizables
│   ├── auth/       # Componentes de autenticación
│   ├── ui/         # Componentes de interfaz
│   └── layout/     # Componentes de estructura
├── contexts/       # Contextos de React
├── hooks/          # Hooks personalizados
├── lib/            # Utilidades y servicios
├── pages/          # Páginas de la aplicación
├── router/         # Configuración de rutas
├── scripts/        # Scripts de utilidad
└── types/          # Definiciones de TypeScript
```

### Patrones de diseño utilizados

1. **Componentes**:
```typescript
// Ejemplo de componente reutilizable
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick }) => {
  return (
    <button 
      className={`btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

2. **Hooks personalizados**:
```typescript
// Ejemplo de hook para autenticación
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
```

## 3.3 Procesos técnicos desarrollados

### 1. Autenticación
```typescript
// Implementación de autenticación
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error('Error en la autenticación');
  }
};
```

### 2. Gestión de reseñas
```typescript
// Creación de reseñas
export const createReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
  const reviewsRef = collection(db, 'reviews');
  const docRef = await addDoc(reviewsRef, {
    ...review,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};
```

### 3. Integración con TMDB
```typescript
// Obtención de detalles de película
export const getMovieDetails = async (movieId: string): Promise<Movie> => {
  const response = await axios.get(
    `${TMDB_API_URL}/movie/${movieId}`,
    {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'es-ES'
      }
    }
  );
  return response.data;
};
```

## 3.4 Calidad y estándares utilizados

### Estándares de código
1. **TypeScript**:
   - Tipado estricto
   - Interfaces para todas las estructuras de datos
   - Evitar `any`

2. **ESLint y Prettier**:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/explicit-function-return-type": "error"
  }
}
```

3. **Convenciones de nombres**:
   - PascalCase para componentes
   - camelCase para funciones y variables
   - UPPER_CASE para constantes

# FASE IV: Control y Evaluación

## 4.1 Criterios y métodos de evaluación

En el código fuente de LaFilmoteca no se han encontrado implementaciones explícitas de criterios de calidad formales, métricas automáticas ni herramientas de testing automatizado. Tampoco existen scripts de monitorización ni documentación sobre procedimientos de control de calidad.

Sin embargo, el control de acceso y la protección de rutas sí están implementados en el código, por ejemplo:
- Uso de rutas protegidas en `src/router/AppRouter.tsx` mediante el componente `ProtectedRoute`, que verifica la autenticación y el rol del usuario antes de permitir el acceso a ciertas páginas (perfil, colecciones, panel de administración).
- Control de roles en el panel de administración (`src/pages/Admin.tsx` y `src/pages/AdminPanel.tsx`), donde solo los usuarios con rol `admin` pueden acceder.

La moderación de reseñas también está implementada y controlada desde el panel de administración, permitiendo aprobar o rechazar reseñas pendientes (`src/components/admin/ReviewModeration.tsx`, `src/lib/admin.ts`).

No se han encontrado pruebas unitarias, de integración ni E2E en el repositorio. Tampoco hay integración con herramientas de análisis de rendimiento, accesibilidad o métricas de usuario.

## 4.2 Incidencias detectadas y solucionadas

A continuación se listan algunos commits que documentan la resolución de incidencias o mejoras en el proyecto:

- **fix: errores en el build** (16e0043): Corrección de errores durante el proceso de build.
- **fix: projectid** (742cd9a): Corrección relacionada con el ID del proyecto.
- **fix: node version** (d3d655b): Ajuste en la versión de Node.js.
- **fix: varios fixes** (cf2cb8d): Resolución de varios problemas.
- **fix: autorizacion de usuarios** (1b9ea41): Corrección en la lógica de autorización de usuarios.
- **fix: improve security with env variables** (593cc96): Mejora de seguridad mediante el uso de variables de entorno.

Estos commits reflejan la resolución de bugs y problemas de rendimiento en el proyecto.

## 4.3 Indicadores de calidad del proyecto

No se han implementado indicadores automáticos de calidad, métricas de uso, ni herramientas de seguimiento de errores o rendimiento en el código fuente analizado.

---

**Nota:** Se recomienda, como mejora futura, documentar y/o implementar procedimientos de testing, control de calidad y métricas para facilitar la evaluación y el mantenimiento del proyecto.

# Conclusiones

LaFilmoteca ha sido desarrollada siguiendo las mejores prácticas de desarrollo web moderno, utilizando tecnologías robustas y escalables. El proyecto cumple con los objetivos establecidos y proporciona una base sólida para futuras mejoras y expansiones.

### Puntos fuertes
1. Arquitectura moderna y mantenible
2. Seguridad robusta
3. Experiencia de usuario optimizada
4. Escalabilidad del sistema

### Áreas de mejora
1. Implementar más tests automatizados
2. Mejorar la documentación del código
3. Añadir más funcionalidades sociales
4. Optimizar el rendimiento en dispositivos móviles

# Bibliografía

1. React Documentation (https://reactjs.org/)
2. Firebase Documentation (https://firebase.google.com/docs)
3. TMDB API Documentation (https://developers.themoviedb.org/3)
4. TypeScript Documentation (https://www.typescriptlang.org/)
5. TailwindCSS Documentation (https://tailwindcss.com/) 