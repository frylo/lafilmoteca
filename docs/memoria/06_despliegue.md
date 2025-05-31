# 6. Despliegue

## 6.1 Entornos de Desarrollo

### 6.1.1 Entorno Local
Configuración del entorno de desarrollo:

```bash
# Instalación de dependencias
npm install

# Variables de entorno
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_TMDB_API_KEY=xxx

# Comandos de desarrollo
npm run dev        # Servidor de desarrollo
npm run test      # Ejecutar tests
npm run build     # Construir para producción
```

### 6.1.2 Entorno de Staging
Pipeline de staging:

```yaml
# .github/workflows/staging.yml
name: Deploy to Staging

on:
  push:
    branches:
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Dependencies
        run: npm ci
      - name: Run Tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy to Firebase Staging
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}'
          projectId: lafilmoteca-staging
          channelId: live
```

## 6.2 CI/CD

### 6.2.1 GitHub Actions
Pipeline completo de CI/CD:

```yaml
# .github/workflows/production.yml
name: Production Deployment

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install Dependencies
        run: npm ci
      - name: Run Tests
        run: npm test
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_PROD }}'
          projectId: lafilmoteca-prod
          channelId: live
```

### 6.2.2 Control de Calidad
Configuración de herramientas de calidad:

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/types/**',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## 6.3 Configuración de Firebase

### 6.3.1 Firebase Hosting
Configuración optimizada del hosting:

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
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg)",
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

### 6.3.2 Firestore Rules
Reglas de seguridad para la base de datos:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Funciones helper
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return request.auth.token.admin == true;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Reglas para usuarios
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) || isAdmin();
    }

    // Reglas para reviews
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.userId) || isAdmin();
    }

    // Reglas para colecciones
    match /collections/{collectionId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.userId);
    }
  }
}
```

## 6.4 Monitorización y Logging

### 6.4.1 Firebase Analytics
Implementación de analytics:

```typescript
// src/lib/analytics.ts
import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from './firebase';

const analytics = getAnalytics(app);

export const trackEvent = (
  eventName: string,
  params?: Record<string, string>
) => {
  logEvent(analytics, eventName, params);
};

export const trackPageView = (page: string) => {
  logEvent(analytics, 'page_view', {
    page_path: page,
    page_title: document.title
  });
};

export const trackError = (error: Error) => {
  logEvent(analytics, 'error', {
    error_name: error.name,
    error_message: error.message,
    error_stack: error.stack
  });
};
```

### 6.4.2 Performance Monitoring
Configuración de monitorización:

```typescript
// src/lib/performance.ts
import { getPerformance, trace } from 'firebase/performance';
import { app } from './firebase';

const performance = getPerformance(app);

export const startTrace = (name: string) => {
  const currentTrace = trace(performance, name);
  currentTrace.start();
  return currentTrace;
};

export const measureApiCall = async <T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const apiTrace = startTrace(`API_${name}`);
  try {
    const result = await apiCall();
    apiTrace.stop();
    return result;
  } catch (error) {
    apiTrace.putAttribute('error', error.message);
    apiTrace.stop();
    throw error;
  }
};
```

## 6.5 Optimización de Recursos

### 6.5.1 Optimización de Imágenes
Configuración de procesamiento de imágenes:

```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      jpg: {
        quality: 80,
        progressive: true
      },
      png: {
        quality: 80,
        strip: true
      },
      webp: {
        lossless: true
      }
    })
  ]
});
```

### 6.5.2 Lazy Loading
Implementación de carga diferida:

```typescript
// src/router/routes.ts
import { lazy } from 'react';

export const routes = [
  {
    path: '/',
    component: lazy(() => import('../pages/Home'))
  },
  {
    path: '/movies/:id',
    component: lazy(() => import('../pages/MovieDetails'))
  },
  {
    path: '/profile',
    component: lazy(() => import('../pages/Profile')),
    protected: true
  },
  {
    path: '/admin',
    component: lazy(() => import('../pages/Admin')),
    protected: true,
    adminOnly: true
  }
];
```

## 6.6 Backup y Recuperación

### 6.6.1 Estrategia de Backup
Plan de respaldo de datos:

```typescript
// scripts/backup.ts
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const backup = async () => {
  const db = getFirestore();
  const collections = ['users', 'reviews', 'collections'];
  
  for (const collection of collections) {
    const snapshot = await db.collection(collection).get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Guardar en storage
    await storage
      .bucket()
      .file(`backups/${collection}_${Date.now()}.json`)
      .save(JSON.stringify(data));
  }
};
```

### 6.6.2 Plan de Recuperación
Procedimientos de recuperación:

```typescript
// scripts/restore.ts
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const restore = async (backupDate: string) => {
  const db = getFirestore();
  const collections = ['users', 'reviews', 'collections'];
  
  for (const collection of collections) {
    const backupFile = await storage
      .bucket()
      .file(`backups/${collection}_${backupDate}.json`)
      .download();
    
    const data = JSON.parse(backupFile[0].toString());
    
    const batch = db.batch();
    data.forEach((doc: any) => {
      const ref = db.collection(collection).doc(doc.id);
      batch.set(ref, doc);
    });
    
    await batch.commit();
  }
};
```

## 6.7 Seguridad en el despliegue y producción

La seguridad en el despliegue y la operación en producción se garantiza mediante:

### 6.7.1 Variables de entorno y secretos
- Todas las claves y credenciales (Firebase, TMDB, etc.) se gestionan mediante variables de entorno y secretos de GitHub Actions.
- Nunca se suben claves al repositorio ni se exponen en el frontend.

### 6.7.2 Reglas y headers de seguridad
- Las reglas de Firestore se despliegan junto con el código y se validan en cada pipeline.
- El hosting aplica headers de seguridad (CSP, X-Frame-Options, etc.) para proteger la aplicación.

### 6.7.3 Auditoría y monitorización
- Se monitorizan logs y métricas en tiempo real para detectar accesos indebidos o errores de seguridad.
- Se emplea Firebase Analytics y Performance Monitoring para detectar patrones anómalos.

### 6.7.4 Backups y recuperación segura
- Los backups se almacenan en buckets protegidos y solo accesibles por administradores.
- El proceso de restauración requiere autenticación y autorización explícita.