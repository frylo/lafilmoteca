import MovieSearch from '../components/ui/MovieSearch';
import MovieSection from '../components/ui/MovieSection';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies } from '../lib/tmdb';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-filmoteca-white">Buscador de Películas</h1>
      <MovieSearch />
      
      <MovieSection
        title="En Cartelera"
        fetchMovies={() => getNowPlayingMovies(1)}
      />
      
      <MovieSection
        title="Películas Populares"
        fetchMovies={() => getPopularMovies(1)}
      />
      
      <MovieSection
        title="Mejor Valoradas"
        fetchMovies={() => getTopRatedMovies(1)}
      />
      
      <MovieSection
        title="Próximos Estrenos"
        fetchMovies={() => getUpcomingMovies(1)}
      />
    </div>
  );
};

export default Home;