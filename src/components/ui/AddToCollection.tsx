import { useState, useEffect } from 'react';
import { getUserCollections, addMovieToCollection, isMovieInCollection } from '../../lib/collections';
import { Collection } from '../../types/collections';

interface AddToCollectionProps {
  userId: string;
  movieId: string;
}

const AddToCollection = ({ userId, movieId }: AddToCollectionProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [addingLoading, setAddingLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [collectionStatus, setCollectionStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCollections = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        const userCollections = await getUserCollections(userId);
        setCollections(userCollections);
        
        // Check if movie is already in collections
        const statusPromises = userCollections.map(async (collection) => {
          const isInCollection = await isMovieInCollection(collection.id, movieId);
          return { id: collection.id, isInCollection };
        });
        
        const statuses = await Promise.all(statusPromises);
        const statusMap: Record<string, boolean> = {};
        statuses.forEach(status => {
          statusMap[status.id] = status.isInCollection;
        });
        
        setCollectionStatus(statusMap);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('No se pudieron cargar las colecciones. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCollections();
  }, [userId, movieId]);

  const handleAddToCollection = async () => {
    if (!selectedCollection) {
      setError('Por favor, selecciona una colección');
      return;
    }
    
    try {
      setAddingLoading(true);
      setError(null);
      setSuccess(null);
      
      await addMovieToCollection(selectedCollection, movieId);
      
      // Update collection status
      setCollectionStatus(prev => ({
        ...prev,
        [selectedCollection]: true
      }));
      
      setSuccess('Película añadida a la colección correctamente');
      setSelectedCollection('');
    } catch (err) {
      console.error('Error adding movie to collection:', err);
      setError('Error al añadir la película a la colección. Por favor, inténtalo de nuevo.');
    } finally {
      setAddingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-filmoteca-olive"></div>
      </div>
    );
  }

  return (
    <div className="bg-filmoteca-dark p-4 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30">
      <h3 className="text-lg font-medium mb-3 text-filmoteca-white">Añadir a colección</h3>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-3 rounded-lg mb-3 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-900 bg-opacity-30 border border-green-800 text-filmoteca-white p-3 rounded-lg mb-3 text-sm">
          {success}
        </div>
      )}
      
      {collections.length === 0 ? (
        <p className="text-filmoteca-light text-sm">No tienes colecciones. Crea una colección en tu perfil para añadir películas.</p>
      ) : (
        <div>
          <div className="mb-3">
            <label htmlFor="collection" className="block text-sm font-medium mb-1 text-filmoteca-light">
              Selecciona una colección
            </label>
            <select
              id="collection"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="form-input"
              disabled={addingLoading}
            >
              <option value="">-- Seleccionar colección --</option>
              {collections.map(collection => (
                <option 
                  key={collection.id} 
                  value={collection.id}
                  disabled={collectionStatus[collection.id]}
                >
                  {collection.name} {collectionStatus[collection.id] ? '(Ya añadida)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleAddToCollection}
            className="btn-primary w-full"
            disabled={addingLoading || !selectedCollection}
          >
            {addingLoading ? 'Añadiendo...' : 'Añadir a colección'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCollection;