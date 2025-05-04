import React, { useState, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
const Dashboard = React.lazy(() => import('../components/admin/Dashboard'));
import { Navigate } from 'react-router-dom';
import UserManagement from '../components/admin/UserManagement';
import ReviewModeration from '../components/admin/ReviewModeration';
import StatsPanel from '../components/admin/StatsPanel';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Tabs disponibles en el panel de administración
const TABS = {
  DASHBOARD: 'dashboard',
  USERS: 'users',
  REVIEWS: 'reviews',
  STATS: 'stats'
};

const AdminPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);

  // Redireccionar si el usuario no es administrador
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Renderizar el contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case TABS.DASHBOARD:
        return <Dashboard />;
      case TABS.USERS:
        return <UserManagement />;
      case TABS.REVIEWS:
        return <ReviewModeration />;
      case TABS.STATS:
        return <StatsPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Suspense fallback={<LoadingSpinner />}>
        {renderContent()}
      </Suspense>
    </AdminLayout>
  );
};

export default AdminPanel;