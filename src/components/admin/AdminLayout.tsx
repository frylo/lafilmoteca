import React from 'react';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange 
}) => {
  // Definición de las pestañas del panel
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'chart-pie' },
    { id: 'users', label: 'Usuarios', icon: 'users' },
    { id: 'reviews', label: 'Reseñas', icon: 'star' },
    { id: 'stats', label: 'Estadísticas', icon: 'chart-bar' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-filmoteca-white">Panel de Administración</h1>
        <Link to="/" className="text-filmoteca-olive hover:text-filmoteca-white">
          Volver a la aplicación
        </Link>
      </div>

      {/* Navegación por pestañas */}
      <div className="border-b border-filmoteca-gray border-opacity-30 mb-6">
        <nav className="flex -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === tab.id
                  ? 'border-filmoteca-olive text-filmoteca-olive'
                  : 'border-transparent text-filmoteca-light hover:text-filmoteca-white hover:border-filmoteca-gray'
              }`}
            >
              <i className={`fas fa-${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="card">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;