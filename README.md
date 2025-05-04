# LaFilmoteca

A modern web application for movie enthusiasts to discover, search, and manage their personal film collection.

## Features

- Search for movies using The Movie Database (TMDB) API
- Save favorite movies to your personal collection
- User authentication with Firebase
- Responsive design with Tailwind CSS
- Built with React, TypeScript, and Vite

## Tech Stack

- React 19
- TypeScript
- Vite
- Firebase (Authentication, Firestore, Storage)
- Tailwind CSS
- TMDB API

## Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn
- Firebase account
- TMDB API key

## Setup

1. Clone the repository

```bash
git clone https://github.com/frylo/lafilmoteca.git
cd lafilmoteca
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory with your API keys (use the provided `.env.example` as a template):

```
# Copy from .env.example and fill with your actual API keys
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
# Add other Firebase environment variables as shown in .env.example
```

> **IMPORTANT SECURITY NOTE**: Never commit your `.env` file to version control. It contains sensitive API keys that should be kept private. The `.env` file is already added to `.gitignore` to prevent accidental commits.

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

## Build for Production

```bash
npm run build
# or
yarn build
```

## Deployment

The project is configured for Firebase Hosting. To deploy:

```bash
npm run build
firebase deploy
```

## Despliegue en Firebase Hosting

### Requisitos Previos
- Tener instalado Node.js y npm
- Tener instalado el CLI de Firebase (`npm install -g firebase-tools`)
- Tener una cuenta de Firebase y un proyecto creado
- Estar autenticado en Firebase (`firebase login`)

### Proceso de Despliegue

1. **Preparación del Proyecto**
   ```bash
   # Instalar dependencias
   npm install

   # Construir la aplicación para producción
   npm run build
   ```

2. **Configuración de Firebase**
   - Asegúrate de tener el archivo `firebase.json` configurado correctamente
   - Verifica que el directorio de salida en `firebase.json` coincida con tu directorio de build (`dist`)

3. **Despliegue Manual**
   ```bash
   # Desplegar a Firebase Hosting
   firebase deploy --only hosting
   ```

4. **Despliegue Automático (CI/CD)**
   - El despliegue automático está configurado para ejecutarse cuando se hace push a la rama `main`
   - Se ejecuta el workflow de GitHub Actions definido en `.github/workflows/deploy.yml`
   - Requiere configurar los secrets de GitHub con las credenciales de Firebase

### Configuración de GitHub Actions

Para que el despliegue automático funcione, necesitas configurar los siguientes secrets en tu repositorio de GitHub:

1. `FIREBASE_TOKEN`: Token de autenticación de Firebase
   ```bash
   firebase login:ci
   ```

2. `FIREBASE_PROJECT_ID`: ID de tu proyecto de Firebase

3. `TMDB_API_KEY`: Clave de API de TMDB

### Estructura de Despliegue

- **Directorio de Build**: `dist/`
- **Configuración de Hosting**: `firebase.json`
- **Workflow de CI/CD**: `.github/workflows/deploy.yml`

### Optimizaciones Implementadas

- Caché de recursos estáticos (1 año)
- Redirección de todas las rutas a index.html para SPA
- Headers de seguridad optimizados
- Compresión y minificación de recursos
- Análisis de rendimiento con Lighthouse CI

### Monitoreo y Mantenimiento

- Revisa los logs de despliegue en la consola de Firebase
- Monitorea el rendimiento con Lighthouse CI
- Verifica el estado del hosting en la consola de Firebase
- Mantén actualizadas las dependencias y configuraciones

### Solución de Problemas

1. **Error de Autenticación**
   ```bash
   firebase logout
   firebase login
   ```

2. **Error de Build**
   - Verifica los logs de build
   - Asegúrate de que todas las dependencias estén instaladas
   - Revisa la configuración de TypeScript y Vite

3. **Error de Despliegue**
   - Verifica los permisos del proyecto
   - Comprueba la configuración de firebase.json
   - Revisa los logs de despliegue en la consola de Firebase

### Recursos Adicionales

- [Documentación de Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Guía de Despliegue de Firebase](https://firebase.google.com/docs/hosting/deploying)
- [Configuración de GitHub Actions con Firebase](https://github.com/marketplace/actions/deploy-to-firebase-hosting)

## Useful Commands

### Development
```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment
```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy specific features
firebase deploy --only hosting,firestore,storage

# List Firebase projects
firebase projects:list

# Generate CI token
firebase login:ci
```

### Analysis
```bash
# Analyze bundle size
npm run analyze

# Run Lighthouse CI
npm run lighthouse

# Clean build cache
npm run clean
```

### Troubleshooting
```bash
# Reset Firebase login
firebase logout
firebase login

# Clear npm cache
npm cache clean --force

# Check Firebase status
firebase status
```

## License

MIT