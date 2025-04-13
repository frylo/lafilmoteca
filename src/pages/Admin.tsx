import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  
  // Redirect non-admin users
  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/');
    }
  }, [userRole, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <p className="text-filmoteca-light mb-4">
        Esta página está en construcción. Pronto tendrás acceso a herramientas de administración.
      </p>
      <div className="bg-filmoteca-dark p-6 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30">
        <h2 className="text-xl font-semibold mb-4">Funcionalidades próximamente:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Gestión de usuarios</li>
          <li>Moderación de contenido</li>
          <li>Estadísticas de uso</li>
          <li>Configuración del sitio</li>
        </ul>
      </div>
    </div>
  );
};

export default Admin;