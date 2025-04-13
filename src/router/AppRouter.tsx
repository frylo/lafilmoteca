import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import MovieDetails from '../pages/MovieDetails';
import Profile from '../pages/Profile';
import CollectionDetails from '../pages/CollectionDetails';
import Admin from '../pages/Admin';
import Layout from '../components/layout/Layout';

// Rutas protegidas que requieren autenticación
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Rutas que solo son accesibles si NO estás autenticado
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Rutas públicas */}
          <Route index element={<Home />} />
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="auth" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />
          
          {/* Rutas protegidas */}
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="collections/:id" element={
            <ProtectedRoute>
              <CollectionDetails />
            </ProtectedRoute>
          } />
          <Route path="admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          
          {/* Ruta para manejar rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;