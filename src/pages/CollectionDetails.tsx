import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getCollectionMovies, removeMovieFromCollection } from '../lib/collections';
import { getMovieDetails } from '../lib/tmdb';
import { Collection } from '../types/collections';
import { Movie } from '../types';
import { useAuth } from '../contexts/AuthContext';

const CollectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [removeLoading, setRemoveLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollectionDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch collection details
        const collectionDoc = await getDoc(doc(db, 'collections', id));
        
        if (!collectionDoc.exists()) {
          setError('La colección no existe');
          setLoading(false);
          return;
        }
        
        const collectionData = collectionDoc.data();
        const collection: Collection = {
          id: collectionDoc.id,
          userId: collectionData.userId,
          name: collectionData.name,
          description: collectionData.description || '',
          isPublic: collectionData.isPublic,
          createdAt: collectionData.createdAt?.toDate() || new Date(),
          updatedAt: collectionData.updatedAt?.toDate(),
          coverImage: collectionData.coverImage,
          movieCount: collectionData.movieCount || 0
        };
        
        setCollection(collection);
        
        // Check if user has access to this collection
        if (!collection.isPublic && currentUser?.uid !== collection.userId) {
          setError('No tienes permiso para ver esta colección');
          setLoading(false);
          return;
        }
        
        // Fetch movies in collection
        const movieIds = await getCollectionMovies(id);
        
        if (movieIds.length === 0) {
          setMovies([]);
          setLoading(false);
          return;
        }
        
        // Fetch details for each movie
        const moviePromises = movieIds.map(async (movieId) => {
          try {
            return await getMovieDetails(movieId);
          } catch (err) {
            console.error(`Error fetching movie ${movieId}:`, err);
            return null;
          }
        });
        
        const moviesData = await Promise.all(moviePromises);
        setMovies(moviesData.filter((movie): movie is Movie => movie !== null));
        
      } catch (err) {
        console.error('Error fetching collection details:', err);
        setError('No se pudo cargar la información de la colección. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCollectionDetails();
  }, [id, currentUser]);

  const handleRemoveMovie = async (movieId: string) => {
    if (!id || !currentUser || currentUser.uid !== collection?.userId) return;
    
    if (!confirm('¿Estás seguro de que deseas eliminar esta película de la colección?')) {
      return;
    }
    
    try {
      setRemoveLoading(movieId);
      await removeMovieFromCollection(id, movieId);
      
      // Update UI
      setMovies(movies.filter(movie => movie.id !== movieId));
      
      // Update collection count
      if (collection) {
        setCollection({
          ...collection,
          movieCount: collection.movieCount - 1
        });
      }
    } catch (err) {
      console.error('Error removing movie from collection:', err);
      alert('Error al eliminar la película de la colección. Por favor, inténtalo de nuevo.');
    } finally {
      setRemoveLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-filmoteca-olive"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-4 rounded-lg">
          {error}
        </div>
        <div className="mt-4">
          <Link to="/profile" className="text-filmoteca-olive hover:text-filmoteca-white transition-colors duration-200">
            &larr; Volver a mi perfil
          </Link>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-900 bg-opacity-30 border border-yellow-800 text-filmoteca-white p-4 rounded-lg">
          No se encontró la colección solicitada.
        </div>
        <div className="mt-4">
          <Link to="/profile" className="text-filmoteca-olive hover:text-filmoteca-white transition-colors duration-200">
            &larr; Volver a mi perfil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/profile" className="text-filmoteca-olive hover:text-filmoteca-white transition-colors duration-200">
          &larr; Volver a mi perfil
        </Link>
      </div>
      
      <div className="bg-filmoteca-dark p-6 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-filmoteca-white">{collection.name}</h1>
            <p className="text-filmoteca-light mt-1">{collection.description || 'Sin descripción'}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${collection.isPublic ? 'bg-green-900 bg-opacity-30 text-green-300' : 'bg-yellow-900 bg-opacity-30 text-yellow-300'}`}>
            {collection.isPublic ? 'Pública' : 'Privada'}
          </span>
        </div>
        
        <div className="text-sm text-filmoteca-gray mb-4">
          <p>Creada el {collection.createdAt.toLocaleDateString()}</p>
          <p>{collection.movieCount} {collection.movieCount === 1 ? 'película' : 'películas'}</p>
        </div>
      </div>
      
      {movies.length === 0 ? (
        <div className="text-center py-12 bg-filmoteca-dark bg-opacity-50 rounded-lg border border-filmoteca-gray border-opacity-20">
          <p className="text-filmoteca-light mb-4">Esta colección no tiene películas todavía.</p>
          <Link to="/" className="btn-primary">
            Buscar películas para añadir
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map(movie => (
            <div key={movie.id} className="bg-filmoteca-dark rounded-lg overflow-hidden border border-filmoteca-gray border-opacity-20 flex flex-col">
              <Link to={`/movie/${movie.id}`} className="block">
                {movie.poster ? (
                  <img 
                    src={movie.poster} 
                    alt={`${movie.title} poster`} 
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-filmoteca-gray bg-opacity-20 flex items-center justify-center">
                    <span className="text-filmoteca-gray">No hay imagen</span>
                  </div>
                )}
              </Link>
              
              <div className="p-4 flex-grow">
                <Link to={`/movie/${movie.id}`} className="block">
                  <h3 className="text-lg font-medium text-filmoteca-white mb-1 hover:text-filmoteca-olive transition-colors duration-200">
                    {movie.title}
                  </h3>
                </Link>
                
                <div className="flex items-center text-sm text-filmoteca-light mb-2">
                  {movie.year && <span className="mr-2">{movie.year}</span>}
                  {movie.rating && (
                    <span className="flex items-center">
                      <span className="text-filmoteca-olive mr-1">★</span>
                      {(movie.rating / 2).toFixed(1)}
                    </span>
                  )}
                </div>
                
                {currentUser && currentUser.uid === collection.userId && (
                  <button
                    onClick={() => handleRemoveMovie(movie.id)}
                    className="text-red-400 hover:text-red-300 text-sm mt-2"
                    disabled={removeLoading === movie.id}
                  >
                    {removeLoading === movie.id ? 'Eliminando...' : 'Quitar de la colección'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionDetails;