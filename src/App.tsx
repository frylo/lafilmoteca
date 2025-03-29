// Main App component for LaFilmoteca
import { useState } from 'react';
import Home from './pages/Home';
import Auth from './pages/Auth';
import { AuthProvider } from './contexts/AuthContext';
import './App.css'

function App() {
  const [showAuth, setShowAuth] = useState(false);
  
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">LaFilmoteca</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#" className="hover:text-blue-400" onClick={() => setShowAuth(false)}>Inicio</a></li>
                <li><a href="#" className="hover:text-blue-400">Películas</a></li>
                <li><a href="#" className="hover:text-blue-400">Mi Lista</a></li>
                <li><a href="#" className="hover:text-blue-400" onClick={() => setShowAuth(true)}>Iniciar Sesión</a></li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main>
          {showAuth ? <Auth /> : <Home />}
        </main>
        
        <footer className="bg-gray-800 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>© {new Date().getFullYear()} LaFilmoteca - Todos los derechos reservados</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}

export default App
