import { useState, useEffect } from 'react';

import { getFavorites } from '../services/favorite';
import { useAuth } from '../context/useAuth';

import Spinner from '../components/Spinner';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';

import { fetchMovieById } from '../services/tmdb';

const FavoritePage = () => {
   const [favorite, setFavorite] = useState([]);
   const [movies, setMovies] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const { user } = useAuth();

   // Pagination states
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 8;

   // Page will scroll to top on load
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   // Load favorite movie IDs from database in first render
   useEffect(() => {
      const loadFavorites = async () => {
         if (!user) {
            setFavorite([]);
            return;
         }

         try {
            const favoritesData = await getFavorites();
            const movieIds = favoritesData.map((item) => item.movieId);
            setFavorite(movieIds);
         } catch (error) {
            console.error('Error loading favorites:', error);
            setFavorite([]);
         }
      };

      loadFavorites();
   }, [user]);

   // Fetch movie details for favorite movies
   useEffect(() => {
      if (favorite.length === 0) {
         setMovies([]);
         return;
      }

      const fetchMovies = async () => {
         setIsLoading(true);

         try {
            const moviePromises = favorite.map((id) => fetchMovieById(id));
            const moviesData = await Promise.all(moviePromises);

            setMovies(moviesData);
         } catch (error) {
            console.error('Error fetching favorite movies:', error);
         } finally {
            setIsLoading(false);
         }
      };

      if (favorite.length > 0) {
         fetchMovies();
      }
   }, [favorite]);

   // Calculate pagination
   const totalPages = Math.ceil(movies.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const currentMovies = movies.slice(startIndex, endIndex);

   // Handle page change
   const handlePageChange = (page) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   // Reset to first page when movies change
   useEffect(() => {
      setCurrentPage(1);
   }, [movies.length]);

   return (
      <>
         <h2>Favorite</h2>
         {isLoading ? (
            <Spinner />
         ) : movies.length === 0 ? (
            <p className="text-center text-white/50 mt-12">
               You have no favorite movies yet.
            </p>
         ) : (
            <div>
               <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentMovies.map((movie) => (
                     <MovieCard key={movie.id} movie={movie} />
                  ))}
               </div>

               <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
               />
            </div>
         )}
      </>
   );
};

export default FavoritePage;
