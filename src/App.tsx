// Main App component for LaFilmoteca
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './router/AppRouter';
import './index.css'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
