import React, { useEffect, useState } from 'react';
import { DetailedStats } from '../../types';
import { getDetailedStats } from '../../lib/stats';
import LoadingSpinner from '../ui/LoadingSpinner';

const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'

  useEffect(() => {
    const fetchDetailedStats = async () => {
      try {
        setLoading(true);
        const detailedStats = await getDetailedStats(timeRange);
        setStats(detailedStats);
        setError(null);
      } catch (err) {
        setError('Error al cargar estadísticas detalladas. Por favor, inténtalo de nuevo.');
        console.error('Error fetching detailed stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedStats();
  }, [timeRange]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card">
        <p className="text-filmoteca-light">No se pudieron cargar las estadísticas detalladas.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center p-6">
        <h2 className="text-2xl font-bold text-filmoteca-white">Estadísticas Detalladas</h2>
        
        {/* Selector de rango de tiempo */}
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              timeRange === 'week' 
                ? 'bg-filmoteca-olive text-filmoteca-white' 
                : 'bg-filmoteca-dark text-filmoteca-light hover:bg-filmoteca-gray hover:bg-opacity-20'
            } border border-filmoteca-gray border-opacity-30`}
          >
            Semana
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'month' 
                ? 'bg-filmoteca-olive text-filmoteca-white' 
                : 'bg-filmoteca-dark text-filmoteca-light hover:bg-filmoteca-gray hover:bg-opacity-20'
            } border-t border-b border-filmoteca-gray border-opacity-30`}
          >
            Mes
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              timeRange === 'year' 
                ? 'bg-filmoteca-olive text-filmoteca-white' 
                : 'bg-filmoteca-dark text-filmoteca-light hover:bg-filmoteca-gray hover:bg-opacity-20'
            } border border-filmoteca-gray border-opacity-30`}
          >
            Año
          </button>
        </div>
      </div>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Nuevos Usuarios" 
          value={stats.newUsers} 
          change={stats.newUsersChange || 0}
          icon="user-plus"
        />
        <StatCard 
          title="Nuevas Reseñas" 
          value={stats.newReviews} 
          change={stats.newReviewsChange || 0}
          icon="star"
        />
        <StatCard 
          title="Nuevas Colecciones" 
          value={stats.newCollections || 0} 
          change={stats.newCollectionsChange || 0}
          icon="folder-plus"
        />
        <StatCard 
          title="Películas Añadidas" 
          value={stats.newMoviesInCollections || 0} 
          change={stats.newMoviesChange || 0}
          icon="film"
        />
      </div>
      
      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-filmoteca-dark p-6 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30">
          <h3 className="text-xl font-semibold mb-4 text-filmoteca-white">Usuarios Activos</h3>
          <div className="h-64 flex items-center justify-center">
            {stats.activeUsersData ? (
              <div className="w-full h-full">
                {/* Aquí se renderizaría el gráfico real con los datos */}
                <div className="w-full h-full bg-filmoteca-gray bg-opacity-10 rounded-lg flex items-center justify-center">
                  <p className="text-filmoteca-light">Gráfico de usuarios activos</p>
                </div>
              </div>
            ) : (
              <p className="text-filmoteca-gray">No hay datos disponibles</p>
            )}
          </div>
        </div>
        <div className="bg-filmoteca-dark p-6 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30">
          <h3 className="text-xl font-semibold mb-4 text-filmoteca-white">Reseñas Creadas</h3>
          <div className="h-64 flex items-center justify-center">
            {stats.reviewsCreatedData ? (
              <div className="w-full h-full">
                {/* Aquí se renderizaría el gráfico real con los datos */}
                <div className="w-full h-full bg-filmoteca-gray bg-opacity-10 rounded-lg flex items-center justify-center">
                  <p className="text-filmoteca-light">Gráfico de reseñas creadas</p>
                </div>
              </div>
            ) : (
              <p className="text-filmoteca-gray">No hay datos disponibles</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Tablas de datos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Películas más populares */}
        <div className="bg-filmoteca-dark rounded-lg shadow-md border border-filmoteca-gray border-opacity-30 overflow-hidden">
          <div className="px-6 py-4 border-b border-filmoteca-gray border-opacity-30">
            <h3 className="text-xl font-semibold text-filmoteca-white">Películas Más Populares</h3>
          </div>
          <div className="p-4">
            {stats.popularMovies && stats.popularMovies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-filmoteca-gray border-opacity-30">
                      <th className="py-3 px-4 text-left text-filmoteca-light">Película</th>
                      <th className="py-3 px-4 text-left text-filmoteca-light">Reseñas</th>
                      <th className="py-3 px-4 text-left text-filmoteca-light">Valoración</th>
                      <th className="py-3 px-4 text-left text-filmoteca-light">Colecciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.popularMovies.map((movie, index) => (
                      <tr key={index} className="border-b border-filmoteca-gray border-opacity-20 hover:bg-filmoteca-gray hover:bg-opacity-10">
                        <td className="py-3 px-4 text-filmoteca-white">{movie.title}</td>
                        <td className="py-3 px-4 text-filmoteca-light">{movie.reviewCount}</td>
                        <td className="py-3 px-4 text-filmoteca-light">
                          <span className="flex items-center">
                            <span className="text-filmoteca-olive mr-1">★</span>
                            {(movie.averageRating / 2).toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-filmoteca-light">{movie.collectionCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-filmoteca-light">No hay datos disponibles</p>
            )}
          </div>
        </div>
        
        {/* Usuarios más activos */}
        <div className="bg-filmoteca-dark rounded-lg shadow-md border border-filmoteca-gray border-opacity-30 overflow-hidden">
          <div className="px-6 py-4 border-b border-filmoteca-gray border-opacity-30">
            <h3 className="text-xl font-semibold text-filmoteca-white">Usuarios Más Activos</h3>
          </div>
          <div className="p-4">
            {stats.activeUsers && stats.activeUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-filmoteca-gray border-opacity-30">
                      <th className="py-3 px-4 text-left text-filmoteca-light">Usuario</th>
                      <th className="py-3 px-4 text-left text-filmoteca-light">Reseñas</th>
                      <th className="py-3 px-4 text-left text-filmoteca-light">Colecciones</th>
                      <th className="py-3 px-4 text-left text-filmoteca-light">Última Actividad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.activeUsers.map((user, index) => (
                      <tr key={index} className="border-b border-filmoteca-gray border-opacity-20 hover:bg-filmoteca-gray hover:bg-opacity-10">
                        <td className="py-3 px-4 text-filmoteca-white">{user.displayName}</td>
                        <td className="py-3 px-4 text-filmoteca-light">{user.reviewCount}</td>
                        <td className="py-3 px-4 text-filmoteca-light">{user.collectionCount}</td>
                        <td className="py-3 px-4 text-filmoteca-light">
                          {new Date(user.lastActivity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-filmoteca-light">No hay datos disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para tarjetas de estadísticas
interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  return (
    <div className="bg-filmoteca-dark p-6 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-filmoteca-light">{title}</p>
          <p className="text-3xl font-bold text-filmoteca-white">{value}</p>
          <div className={`flex items-center mt-1 text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <span>{change >= 0 ? '↑' : '↓'} {Math.abs(change)}%</span>
            <span className="ml-1">vs. período anterior</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-filmoteca-olive bg-opacity-20 flex items-center justify-center">
          <i className={`fas fa-${icon} text-filmoteca-olive text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;