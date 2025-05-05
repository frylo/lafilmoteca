import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, deactivateUser } from '../../lib/admin';
import { User } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        setError('Error al cargar usuarios. Por favor, inténtalo de nuevo.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrar usuarios según término de búsqueda
  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Manejar cambio de rol
  const handleRoleChange = async (userId: string, newRole: 'guest' | 'user' | 'admin') => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.uid === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError('Error al actualizar el rol. Por favor, inténtalo de nuevo.');
      console.error('Error updating user role:', err);
    }
  };

  // Manejar desactivación/activación de usuario
  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (window.confirm(`¿Estás seguro de que deseas ${currentStatus ? 'desactivar' : 'activar'} este usuario?`)) {
      try {
        await deactivateUser(userId, !currentStatus);
        setUsers(users.map(user => 
          user.uid === userId ? { ...user, isActive: !currentStatus } : user
        ));
      } catch (err) {
        setError('Error al actualizar el estado del usuario. Por favor, inténtalo de nuevo.');
        console.error('Error updating user status:', err);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold p-6 text-filmoteca-white">Gestión de Usuarios</h2>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="p-6 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          className="form-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="p-6 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-filmoteca-gray border-opacity-30">
              <th className="py-3 px-4 text-left text-filmoteca-light">Usuario</th>
              <th className="py-3 px-4 text-left text-filmoteca-light">Email</th>
              <th className="py-3 px-4 text-left text-filmoteca-light">Rol</th>
              <th className="py-3 px-4 text-left text-filmoteca-light">Estado</th>
              <th className="py-3 px-4 text-left text-filmoteca-light">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.uid} className="border-b border-filmoteca-gray border-opacity-20 hover:bg-filmoteca-gray hover:bg-opacity-10">
                <td className="py-3 px-4 text-filmoteca-white">
                  <div className="flex items-center">
                    {user.photoURL && (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'Usuario'} 
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    )}
                    {user.displayName || 'Sin nombre'}
                  </div>
                </td>
                <td className="py-3 px-4 text-filmoteca-light">{user.email}</td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.uid, e.target.value as 'guest' | 'user' | 'admin')}
                    className="form-input"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleUserStatus(user.uid, user.isActive)}
                    className="btn-secondary"
                  >
                    {user.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav>
            <ul className="flex">
              <li>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <li key={page}>
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`btn-secondary ${
                      currentPage === page ? 'bg-filmoteca-olive text-filmoteca-white' : ''
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default UserManagement;