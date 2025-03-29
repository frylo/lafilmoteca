// Main App component for LaFilmoteca
import Home from './pages/Home'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">LaFilmoteca</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:text-blue-400">Inicio</a></li>
              <li><a href="#" className="hover:text-blue-400">Películas</a></li>
              <li><a href="#" className="hover:text-blue-400">Mi Lista</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main>
        <Home />
      </main>
      
      <footer className="bg-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} LaFilmoteca - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  )
}

export default App
