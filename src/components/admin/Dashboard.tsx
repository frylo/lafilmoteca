import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../../lib/admin';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AdminStats {
  totalUsers: number;
  totalReviews: number;
  pendingReviews: number;
  totalMoviesInCollections?: number;
  recentActivity?: {
    type: 'review' | 'user' | 'collection';
    description: string;
    timestamp: number;
  }[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const adminStats = await getAdminStats();
        setStats(adminStats);
        setError(null);
      } catch (err) {
        setError('Error al cargar estadísticas. Por favor, inténtalo de nuevo.');
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <p className="text-filmoteca-light">No se pudieron cargar las estadísticas.</p>
      </div>
    );
  }

  return (
    <div className="card">
      
      {/* Información de actividad */}
      <div className="bg-filmoteca-dark rounded-lg shadow p-6 mb-8 border border-filmoteca-gray border-opacity-30">
        <h3 className="text-xl font-semibold mb-4 text-filmoteca-white">Información de Actividad</h3>
        <div className="space-y-4">
          <p className="text-filmoteca-light">
            <span className="font-medium">Usuarios activos:</span> El sistema cuenta con {stats.totalUsers} usuarios registrados.
          </p>
          <p className="text-filmoteca-light">
            <span className="font-medium">Contenido generado:</span> Los usuarios han creado un total de {stats.totalReviews} reseñas.
          </p>
          <p className="text-filmoteca-light">
            <span className="font-medium">Moderación pendiente:</span> Hay {stats.pendingReviews} reseñas esperando aprobación.
          </p>
          <div className="mt-4 pt-4 border-t border-filmoteca-gray border-opacity-30">
            <p className="text-sm text-filmoteca-light">Última actualización: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;