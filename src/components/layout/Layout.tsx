import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const { currentUser, userRole, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-filmoteca-dark text-filmoteca-white flex flex-col">
      <header className="bg-filmoteca-dark shadow-md border-b border-filmoteca-gray border-opacity-30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-filmoteca-white">LaFilmoteca</h1>
          
          {/* Menú para móviles */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-filmoteca-white focus:outline-none focus:ring-2 focus:ring-filmoteca-olive focus:ring-opacity-50 rounded"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Menú para escritorio */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><a href="/" className="text-filmoteca-white hover:text-filmoteca-olive transition-colors duration-200">Inicio</a></li>
              {currentUser ? (
                <>
                  <li><a href="/profile" className="text-filmoteca-white hover:text-filmoteca-olive transition-colors duration-200">Mi Perfil</a></li>
                  <li><a href="#" onClick={handleSignOut} className="text-filmoteca-white hover:text-filmoteca-olive transition-colors duration-200">Cerrar Sesión</a></li>
                </>
              ) : (
                <li><a href="/auth" className="text-filmoteca-white hover:text-filmoteca-olive transition-colors duration-200">Iniciar Sesión</a></li>
              )}
              {userRole === 'admin' && (
                <li><a href="/admin" className="text-filmoteca-white hover:text-filmoteca-olive transition-colors duration-200">Administración</a></li>
              )}
            </ul>
          </nav>
        </div>
        
        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden bg-filmoteca-dark border-t border-filmoteca-gray border-opacity-30 py-2">
            <div className="container mx-auto px-4">
              <ul className="space-y-2">
                <li><a href="/" className="block py-2 text-filmoteca-white hover:text-filmoteca-olive transition-colors duration-200">Inicio</a></li>
                {currentUser ? (
                  <>
                    <li><a href="/profile" className="block py-2 text-filmoteca-white hover:text-filmoteca-olive transition-colors duration-200">Mi Perfil</a></li>
                    <li><a href="#" onClick={handleSignOut} className="block py-2 text-filmoteca-white hover:text-filmoteca-olive transition-colors duration-200">Cerrar Sesión</a></li>
                  </>
                ) : (
                  <li><a href="/auth" className="block py-2 text-filmoteca-white hover:text-filmoteca-olive transition-colors duration-200">Iniciar Sesión</a></li>
                )}
                {userRole === 'admin' && (
                  <li><a href="/admin" className="block py-2 text-filmoteca-white hover:text-filmoteca-olive transition-colors duration-200">Administración</a></li>
                )}
              </ul>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <footer className="bg-filmoteca-dark border-t border-filmoteca-gray border-opacity-30 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-filmoteca-gray">
          <p>© {new Date().getFullYear()} LaFilmoteca - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;