import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import UserCollections from '../components/ui/UserCollections';
import UserReviews from '../components/ui/UserReviews';

const Profile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [collectionsCount, setCollectionsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDisplayName(userData.displayName || '');
          setBio(userData.bio || '');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('No se pudo cargar el perfil. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    try {
      setUpdateLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName,
        bio
      });
      
      setSuccessMessage('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-filmoteca-olive"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-filmoteca-white">Mi Perfil</h1>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-900 bg-opacity-30 border border-green-800 text-filmoteca-white p-4 rounded-lg mb-6">
          {successMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-filmoteca-dark p-6 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="displayName" className="block text-sm font-medium mb-1 text-filmoteca-light">
                  Nombre
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="bio" className="block text-sm font-medium mb-1 text-filmoteca-light">
                  Biografía
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="form-input min-h-[100px]"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                  disabled={updateLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-filmoteca-white">{displayName}</h2>
                  <p className="text-filmoteca-light">{currentUser?.email}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary"
                >
                  Editar Perfil
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-filmoteca-white">Biografía</h3>
                <p className="text-filmoteca-light">{bio || 'No hay biografía disponible.'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-filmoteca-dark p-6 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30">
          <h2 className="text-xl font-semibold mb-4 text-filmoteca-white">Estadísticas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-filmoteca-gray bg-opacity-20 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-filmoteca-white">Reseñas Escritas</h3>
              <p className="text-2xl font-bold text-filmoteca-olive">{reviewsCount}</p>
            </div>
            <div className="bg-filmoteca-gray bg-opacity-20 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-filmoteca-white">Colecciones</h3>
              <p className="text-2xl font-bold text-filmoteca-olive">{collectionsCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Collections */}
      <div className="mt-8">
        <UserCollections 
          userId={currentUser?.uid || ''} 
          onCountChange={setCollectionsCount}
        />
      </div>
      
      {/* User Reviews */}
      <div className="mt-8">
        <UserReviews userId={currentUser?.uid || ''} isCurrentUser={true}  onCountChange={setReviewsCount}/>
      </div>
    </div>
  );
};

export default Profile;