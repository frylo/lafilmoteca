import MovieSearch from '../components/ui/MovieSearch';

const Home = () => {
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-filmoteca-white">Buscador de Películas</h1>
      <MovieSearch onSelectMovie={(movie) => console.log('Selected movie:', movie)} />
    </div>
  );
};

export default Home;