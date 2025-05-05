import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserCollections, deleteCollection } from '../../lib/collections';
import { Collection } from '../../types/collections';
import CollectionForm from './CollectionForm';

interface UserCollectionsProps {
  userId: string;
  onCountChange: (count: number) => void;
}

const UserCollections = ({ userId, onCountChange }: UserCollectionsProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showCollectionForm, setShowCollectionForm] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        const userCollections = await getUserCollections(userId);
        setCollections(userCollections);
        onCountChange(userCollections.length);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('No se pudieron cargar las colecciones. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCollections();
  }, [userId]);

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta colección? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      setDeleteLoading(collectionId);
      await deleteCollection(collectionId);
      setCollections(collections.filter(collection => collection.id !== collectionId));
      onCountChange(collections.length - 1);
    } catch (err) {
      console.error('Error deleting collection:', err);
      alert('Error al eliminar la colección. Por favor, inténtalo de nuevo.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-filmoteca-olive"></div>
      </div>
    );
  }

  return (
    <div className="bg-filmoteca-dark p-6 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-filmoteca-white">Mis Colecciones</h2>
        <button
          onClick={() => setShowCollectionForm(true)}
          className="btn-primary text-sm"
        >
          Nueva Colección
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {showCollectionForm && (
        <div className="mb-6">
          <CollectionForm
            userId={userId}
            onSuccess={() => {
              setShowCollectionForm(false);
              // Refresh collections
              const fetchCollections = async () => {
                try {
                  const userCollections = await getUserCollections(userId);
                  setCollections(userCollections);
                  onCountChange(userCollections.length);
                } catch (err) {
                  console.error('Error fetching collections:', err);
                }
              };
              fetchCollections();
            }}
            onCancel={() => setShowCollectionForm(false)}
          />
        </div>
      )}
      
      {collections.length === 0 ? (
        <div className="text-center py-8 text-filmoteca-light">
          <p className="mb-4">Aún no has creado ninguna colección.</p>
          <button
            onClick={() => setShowCollectionForm(true)}
            className="btn-secondary text-sm"
          >
            Crear mi primera colección
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map(collection => (
            <div key={collection.id} className="bg-filmoteca-gray bg-opacity-10 rounded-lg overflow-hidden border border-filmoteca-gray border-opacity-20 flex flex-col">
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-filmoteca-white mb-1">{collection.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${collection.isPublic ? 'bg-green-900 bg-opacity-30 text-green-300' : 'bg-yellow-900 bg-opacity-30 text-yellow-300'}`}>
                    {collection.isPublic ? 'Pública' : 'Privada'}
                  </span>
                </div>
                <p className="text-sm text-filmoteca-light mb-2">
                  {collection.description || 'Sin descripción'}
                </p>
                <p className="text-xs text-filmoteca-light">
                  {collection.movieCount} {collection.movieCount === 1 ? 'película' : 'películas'}
                </p>
              </div>
              
              <div className="border-t border-filmoteca-gray border-opacity-20 p-3 flex justify-between">
                <button
                  onClick={() => handleDeleteCollection(collection.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                  disabled={deleteLoading === collection.id}
                >
                  {deleteLoading === collection.id ? 'Eliminando...' : 'Eliminar'}
                </button>
                <Link
                  to={`/collections/${collection.id}`}
                  className="text-filmoteca-olive hover:text-filmoteca-white text-sm"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCollections;