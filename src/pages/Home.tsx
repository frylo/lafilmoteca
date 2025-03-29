import { useState, useEffect } from 'react';
import MovieSearch from '../components/ui/MovieSearch';
import { Movie } from '../types';

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // TODO: Replace with actual Firebase fetch
    // This is just a placeholder for now
    const fetchMovies = async () => {
      try {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - will be replaced with Firebase data
        const mockMovies: Movie[] = [
          { id: '1', title: 'Pulp Fiction', poster: 'https://example.com/poster1.jpg', year: 1994, director: 'Quentin Tarantino' },
          { id: '2', title: 'The Godfather', poster: 'https://example.com/poster2.jpg', year: 1972, director: 'Francis Ford Coppola' },
        ];
        
        setMovies(mockMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Buscador de Películas</h1>
      <MovieSearch onSelectMovie={(movie) => console.log('Selected movie:', movie)} />
      
      {movies.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Películas Destacadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map(movie => (
              <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={movie.poster} 
                  alt={`${movie.title} poster`} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{movie.title}</h2>
                  <p className="text-gray-400">{movie.year} • {movie.director}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;