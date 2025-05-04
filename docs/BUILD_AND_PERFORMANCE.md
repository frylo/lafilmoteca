# Semana 6: Despliegue y Optimización

## 1. Configuración del Entorno de Producción

### 1.1 Configuración de Vite
Se ha optimizado la configuración de Vite para producción en `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
```

### 1.2 Variables de Entorno
Configuración en `.env.production`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_TMDB_API_KEY=your_tmdb_key
VITE_APP_URL=https://lafilmoteca.com
VITE_API_URL=https://api.lafilmoteca.com
```

## 2. Optimizaciones Implementadas

### 2.1 Optimización de Bundle
- División de código en chunks (React, Firebase, UI)
- Minificación con Terser
- Eliminación de console.logs y debuggers
- Análisis de bundle con rollup-plugin-visualizer

### 2.2 Optimización de CSS
Configuración de Tailwind CSS en `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    options: {
      safelist: ['dark'],
    },
  },
}
```

### 2.3 Optimización de PostCSS
Configuración en `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'cssnano': {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }],
    },
  },
}
```

## 3. Configuración de Seguridad

### 3.1 Firebase Hosting
Configuración en `firebase.json`:
```json
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
        "source": "**/*.@(js|css|eot|otf|ttf|ttc|woff|woff2|font.css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## 4. Proceso de Despliegue

### 4.1 Despliegue Manual
1. Construir la aplicación:
```bash
npm run build
```

2. Desplegar a Firebase:
```bash
firebase deploy --only hosting
```

### 4.2 Despliegue Automático (CI/CD)
Configuración en `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install Dependencies
        run: npm ci
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          # ... otras variables de entorno
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

### 4.3 Configuración de Secrets
Secrets necesarios en GitHub:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`
- `TMDB_API_KEY`
- `FIREBASE_SERVICE_ACCOUNT`
- `LHCI_GITHUB_APP_TOKEN`

## 5. Monitoreo y Análisis

### 5.1 Lighthouse CI
Configuración en `lighthouse.config.js`:
```javascript
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

### 5.2 Scripts de Análisis
Scripts en `package.json`:
```json
{
  "scripts": {
    "analyze": "vite build --mode production",
    "lighthouse": "lhci autorun"
  }
}
```

## 6. Solución de Problemas

### 6.1 Errores Comunes
1. **Error de Build**:
   - Verificar las dependencias
   - Comprobar la configuración de TypeScript
   - Revisar los logs de build

2. **Error de Despliegue**:
   - Verificar la autenticación de Firebase
   - Comprobar los permisos del proyecto
   - Revisar la configuración de firebase.json

3. **Error de CI/CD**:
   - Verificar los secrets en GitHub
   - Comprobar los logs de GitHub Actions
   - Revisar la configuración del workflow

### 6.2 Comandos Útiles
```bash
# Verificar estado de Firebase
firebase projects:list

# Generar token de CI
firebase login:ci

# Limpiar caché de build
npm run clean

# Analizar bundle
npm run analyze

# Ejecutar pruebas de rendimiento
npm run lighthouse
``` 