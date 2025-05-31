import React, { useState, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Importación dinámica de los componentes del panel de administración
const Dashboard = React.lazy(() => import('../components/admin/Dashboard'));
const UserManagement = React.lazy(() => import('../components/admin/UserManagement'));
const ReviewModeration = React.lazy(() => import('../components/admin/ReviewModeration'));
const StatsPanel = React.lazy(() => import('../components/admin/StatsPanel'));

// Tabs disponibles en el panel de administración
const TABS = {
  DASHBOARD: 'dashboard',
  USERS: 'users',
  REVIEWS: 'reviews',
  STATS: 'stats'
};

const Admin = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

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

export default Admin;