# 5. Frontend

## 5.1 Tecnologías Utilizadas
- **React 18 + TypeScript**: Toda la interfaz está construida con componentes funcionales y tipado estricto. Se emplean hooks personalizados y el sistema de tipado de TypeScript para evitar errores y mejorar la mantenibilidad.
- **Vite**: Bundler y servidor de desarrollo con recarga instantánea y hot module replacement. La configuración personalizada en `vite.config.ts` incluye optimización de imágenes y soporte para variables de entorno.
- **Tailwind CSS**: Framework de utilidades CSS. El archivo `tailwind.config.cjs` define la paleta de colores, breakpoints y variantes para modo oscuro. Utilidades como `flex`, `grid`, `gap`, `rounded`, `shadow`, etc., se emplean en todos los componentes visuales.
- **React Router v6**: Navegación SPA, con rutas anidadas, layouts y protección de rutas según el rol del usuario.
- **Zod**: Validación de formularios y datos antes de enviarlos al backend.
- **Firebase SDK**: Autenticación, acceso a Firestore y Analytics desde el frontend.

## 5.2 Estructura y Organización
- **Dominio funcional**: El código está organizado por dominio, no por tipo. Por ejemplo, los componentes de administración están en `components/admin/`, los de usuario en `components/ui/`, y los contextos en `contexts/`.
- **Componentes reutilizables**: Elementos como `LoadingSpinner`, `StarRating`, `ReviewCard`, `MovieResults` y `AddToCollection` se usan en múltiples páginas y flujos.
- **Páginas**: Cada vista principal (Home, MovieDetails, Profile, Admin, CollectionDetails) tiene su propio archivo en `pages/` y puede importar componentes, hooks y servicios según necesidad.
- **Servicios y lógica de negocio**: En `lib/` se centralizan los servicios para acceso a Firebase (`firebase.ts`), TMDB (`tmdb.ts`), colecciones (`collections.ts`), reviews (`reviews.ts`) y estadísticas (`stats.ts`).
- **Hooks personalizados**: En `hooks/` se implementan hooks como `useAuth`, `useMovieSearch`, `useCollection`, `useReviewModeration`, que encapsulan lógica compleja y la hacen reutilizable.
- **Contextos globales**: `AuthContext.tsx` gestiona el usuario autenticado, su rol y el estado de login en toda la app. Otros contextos pueden gestionar notificaciones o el tema visual.

## 5.3 Gestión del Estado
- **Context API**: `AuthContext` expone el usuario, el rol, métodos de login/logout y el estado de carga. Se usa en toda la app para proteger rutas y mostrar información personalizada.
- **Estado local**: Formularios como `ReviewForm` y `CollectionForm` usan `useState` para campos, errores y feedback visual.
- **Estado derivado y memorización**: Se emplea `useMemo` para calcular, por ejemplo, la media de valoraciones de una película a partir de las reviews, o para filtrar colecciones por nombre.
- **Funciones memorizadas**: `useCallback` se usa en handlers de eventos que se pasan a componentes hijos, como el submit de formularios o la gestión de favoritos.
- **Ejemplo real**: En `MovieSearch.tsx`, el hook `useMovieSearch` implementa debouncing y caché en memoria para evitar peticiones duplicadas a TMDB:

```tsx
// hooks/useMovieSearch.ts
import { useState, useCallback } from "react";
import { searchMovies } from "../lib/tmdb";
import debounce from "lodash.debounce";

export function useMovieSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      setLoading(true);
      const data = await searchMovies(query);
      setResults(data.results);
      setLoading(false);
    }, 300),
    []
  );

  return { results, loading, debouncedSearch };
}
```

## 5.4 Routing y Navegación
- **Definición centralizada**: Todas las rutas están en `router/AppRouter.tsx`. Se definen rutas públicas, protegidas y de administrador.
- **Rutas protegidas**: El componente `ProtectedRoute` comprueba el estado de autenticación y el rol antes de renderizar la página. Si el usuario no cumple los requisitos, se le redirige a `/auth`.
- **Layouts**: El layout principal (`Layout.tsx`) incluye cabecera, menú lateral y área de contenido. El layout de admin (`AdminLayout.tsx`) añade navegación específica y paneles de gestión.
- **Navegación programática**: Se usa el hook `useNavigate` para redirigir tras login, logout o acciones administrativas.
- **Ejemplo real**: En `AppRouter.tsx`:

```tsx
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminLayout />
  </ProtectedRoute>
} />
```

## 5.5 Optimización y Rendimiento
- **Lazy loading de páginas**: Se usa `React.lazy` y `Suspense` para cargar `AdminPanel`, `MovieDetails` y `CollectionDetails` solo cuando se navega a esas rutas.
- **Code splitting**: Cada página principal se empaqueta en un bundle independiente.
- **Lazy loading de imágenes**: En `MovieResults.tsx` y `MovieDetails.tsx`, los posters usan `loading="lazy"` y placeholders para mejorar la experiencia en conexiones lentas.
- **Caché en memoria**: El cliente TMDB (`lib/tmdb.ts`) implementa un Map para cachear resultados de búsquedas y detalles de películas durante la sesión.
- **Optimización de renders**: Componentes como `ReviewList` y `MovieResults` usan `React.memo` para evitar renders innecesarios cuando los props no cambian.
- **Ejemplo real**: En `lib/tmdb.ts`:

```ts
const cache = new Map<string, any>();

export async function getMovie(id: string) {
  if (cache.has(id)) return cache.get(id);
  const res = await fetch(...);
  const data = await res.json();
  cache.set(id, data);
  return data;
}
```

## 5.6 Componentes Principales
- **MovieSearch**: Input de búsqueda con sugerencias en tiempo real, spinner de carga y manejo de errores.
- **MovieResults**: Grid responsive de tarjetas de película, con título, poster, año y botón para añadir a colección.
- **ReviewForm**: Formulario controlado con validación Zod, feedback visual y soporte para edición y creación.
- **StarRating**: Componente visual interactivo para seleccionar valoraciones, usado en formularios y visualización.
- **UserCollections**: Lista de colecciones del usuario, con acciones para crear, editar y eliminar.
- **CollectionForm**: Formulario para crear/editar colecciones, con validación y feedback.
- **AdminPanel**: Panel de administración con pestañas para usuarios, reviews y estadísticas.
- **ReviewModeration**: Lista de reviews pendientes de moderación, con acciones de aprobar/rechazar.
- **UserManagement**: Gestión de usuarios, cambio de roles y desactivación de cuentas.
- **StatsPanel**: Visualización de métricas de uso y actividad.
- **LoadingSpinner**: Indicador visual reutilizable.
- **MovieSection, ReviewList, UserReviews**: Componentes de agrupación y presentación de datos.

## 5.7 Hooks Personalizados
- **useAuth**: Expone usuario, rol, login, logout y estado de carga.
- **useMovieSearch**: Búsqueda de películas con debouncing y caché.
- **useCollection**: Gestión de colecciones del usuario, con métodos para añadir, eliminar y actualizar.
- **useReviewModeration**: Obtiene reviews pendientes y permite aprobar/rechazar.
- **useStats**: Obtiene métricas de uso para el panel de admin.
- **Ejemplo real**: `useCollection` en `hooks/useCollection.ts`:

```ts
import { useState, useEffect } from "react";
import { getUserCollections, addMovieToCollection } from "../lib/collections";

export function useCollection(userId: string) {
  const [collections, setCollections] = useState([]);
  useEffect(() => {
    getUserCollections(userId).then(setCollections);
  }, [userId]);
  const addMovie = (collectionId: string, movieId: string) =>
    addMovieToCollection(collectionId, movieId).then(() =>
      getUserCollections(userId).then(setCollections)
    );
  return { collections, addMovie };
}
```

## 5.8 Calidad y Buenas Prácticas
- **TypeScript estricto**: Todas las props, estados y servicios están tipados.
- **ESLint y Prettier**: Configuración estricta para evitar errores y mantener el estilo.
- **Separación de responsabilidades**: Los componentes de UI no contienen lógica de negocio ni acceso a datos.
- **Validación de formularios**: Se usa Zod para validar antes de enviar datos al backend.
- **Accesibilidad**: Uso de etiquetas semánticas, roles y atributos ARIA en componentes interactivos.
- **Preparado para testing**: Aunque no hay tests automatizados, la estructura permite añadirlos fácilmente.

## 5.9 Estilización y Diseño Responsive
- **Mobile-first**: Todos los componentes usan utilidades de Tailwind para adaptarse a cualquier pantalla.
- **Modo oscuro**: Implementado con clases de Tailwind y toggle en la UI.
- **Paleta y tipografía**: Definidas en `tailwind.config.cjs` y aplicadas globalmente.
- **Componentes adaptativos**: Grids, tarjetas y formularios se adaptan automáticamente al espacio disponible.
- **Ejemplo real**: En `MovieResults.tsx`:

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {movies.map(movie => (
    <MovieCard key={movie.id} {...movie} />
  ))}
</div>
```

## 5.10 Seguridad en el Frontend
- **Protección de rutas**: Solo usuarios autenticados pueden acceder a rutas protegidas, y solo admins a `/admin`.
- **Sanitización de inputs**: Todos los formularios sanitizan los datos antes de enviarlos.
- **CSP**: Se aplica Content Security Policy desde el backend.
- **No exposición de secretos**: Las claves de API y credenciales nunca se exponen en el frontend.
- **Validación doble**: Los datos se validan en frontend y backend.

---

Este documento amplía y detalla cada aspecto del frontend de LaFilmoteca, reflejando la riqueza de componentes, hooks y servicios implementados. Se justifica el uso de cada tecnología y patrón, y se incluyen ejemplos reales en técnicas avanzadas o relevantes para la comprensión del funcionamiento interno.