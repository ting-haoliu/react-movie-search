import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../context/useAuth';
import {
   getFavorites,
   toggleFavorite as toggleFavoriteAPI,
} from '../services/favorite';
import Spinner from '../components/Spinner';

import {
   fetchMovieById,
   fetchMovieCredits,
   fetchMovieVideos,
} from '../services/tmdb';

const MovieDetailPage = () => {
   const { id } = useParams();
   const { user, updateFavoriteCount } = useAuth();
   const [movie, setMovie] = useState(null);
   const [cast, setCast] = useState([]);
   const [videos, setVideos] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');
   const [isFavorite, setIsFavorite] = useState(false);
   const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

   // Page will scroll to top on load
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   // check the movie is in favorites
   useEffect(() => {
      const checkFavorite = async () => {
         if (!user) {
            setIsFavorite(false);
            return;
         }

         try {
            const favorites = await getFavorites();
            const movieIds = favorites.map((fav) => fav.movieId);
            setIsFavorite(movieIds.includes(Number(id)));
         } catch (error) {
            console.error('Check favorite error:', error);
         }
      };

      checkFavorite();
   }, [user, id]);

   const handleToggleFavorite = async () => {
      if (!user) {
         toast.error('Please log in to manage favorites.');
         return;
      }

      setIsTogglingFavorite(true);

      try {
         const result = await toggleFavoriteAPI(Number(id));
         setIsFavorite(result.isFavorite);

         // Update favorite count in context
         updateFavoriteCount(result.isFavorite ? 1 : -1);

         toast.success(
            result.isFavorite
               ? 'Added to favorites!'
               : 'Removed from favorites!'
         );
      } catch (error) {
         console.error('Toggle favorite error:', error);
         toast.error('Failed to update favorite');
      } finally {
         setIsTogglingFavorite(false);
      }
   };

   const loadMovieById = async (id) => {
      setIsLoading(true);
      setErrorMessage('');

      try {
         const [movieData, creditsData, videosData] = await Promise.all([
            fetchMovieById(id),
            fetchMovieCredits(id),
            fetchMovieVideos(id),
         ]);

         setMovie(movieData);
         setCast(creditsData.cast);
         setVideos(videosData.results);
      } catch (error) {
         console.error('Error fetching movie:', error);
         setErrorMessage('Failed to fetch movie. Please try again later.');
      } finally {
         setIsLoading(false);
      }
   };

   const trailer = videos.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
   );

   useEffect(() => {
      loadMovieById(id);
   }, [id]);

   return (
      <>
         {isLoading ? (
            <Spinner />
         ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
         ) : (
            movie && (
               <div className="flex flex-col gap-12 max-w-4xl mx-auto">
                  <section className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
                     {/* Header */}
                     <div className="flex justify-between items-center p-6 border-b border-gray-800 md:py-4 lg:py-2">
                        <h1 className="text-2xl m-0">{movie.title}</h1>
                     </div>

                     {/* Content */}
                     <div className="flex flex-col md:flex-row">
                        {/* Poster */}
                        <div className="md:w-1/3">
                           <img
                              src={
                                 movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : '/No-Poster.png'
                              }
                              alt={`Poster of ${movie.title}`}
                              className="w-full h-full object-cover rounded-xl shadow-md"
                           />
                        </div>

                        {/* Details */}
                        <div className="p-6 space-y-6 text-sm text-left text-gray-400 md:w-2/3">
                           <div>
                              <h3 className="font-medium text-gray-200">
                                 Runtime
                              </h3>
                              <p className="mt-1">
                                 {Math.floor(movie.runtime / 60)}h{' '}
                                 {movie.runtime % 60}
                                 min
                              </p>
                           </div>
                           <div>
                              <h3 className="font-medium text-gray-200">
                                 Release Date
                              </h3>
                              <p className="mt-1">{movie.release_date}</p>
                           </div>
                           <div>
                              <h3 className="font-medium text-gray-200">
                                 Rating
                              </h3>
                              <p className="mt-1">
                                 {movie.vote_average.toFixed(1)} / 10 (
                                 {movie.vote_count} votes)
                              </p>
                           </div>
                           <div>
                              <p className="text-gray-300 text-lg leading-relaxed">
                                 {movie.overview}
                              </p>
                           </div>

                           {movie.genres && (
                              <div className="flex flex-wrap gap-2">
                                 {movie.genres.map((genre) => (
                                    <span
                                       key={genre.id}
                                       className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-200"
                                    >
                                       {genre.name}
                                    </span>
                                 ))}
                              </div>
                           )}

                           <button
                              className={`flex justify-center items-center text-lg transition-colors border-2 rounded-lg px-3 py-1 min-w-[5.5rem] ${
                                 isFavorite
                                    ? 'text-red-500 hover:text-red-400 border-red-500 hover:border-red-400'
                                    : 'text-gray-400 hover:text-gray-200 border-gray-400 hover:border-gray-200'
                              }`}
                              onClick={handleToggleFavorite}
                              aria-label={
                                 isFavorite
                                    ? 'Remove from favorites'
                                    : 'Add to favorites'
                              }
                              disabled={isTogglingFavorite}
                           >
                              {isTogglingFavorite ? (
                                 <Spinner width={5} height={5} />
                              ) : (
                                 <span className="text-lg">
                                    {isFavorite ? '❤️' : '🤍'}
                                 </span>
                              )}

                              <span className="ml-1">
                                 {isFavorite ? 'Liked' : 'Like'}
                              </span>
                           </button>
                        </div>
                     </div>
                  </section>

                  <section>
                     {cast.length > 0 && (
                        <div>
                           <h2 className="font-semibold text-gray-200 mb-5">
                              Top Cast
                           </h2>
                           <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {cast.slice(0, 8).map((actor) => (
                                 <li
                                    key={actor.cast_id}
                                    className="text-center"
                                 >
                                    <img
                                       src={
                                          actor.profile_path
                                             ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                             : '/No-Profile.png'
                                       }
                                       alt={actor.name}
                                       className="w-24 h-24 mx-auto rounded-full object-cover mb-2"
                                    />
                                    <p className="text-gray-200 font-medium text-sm">
                                       {actor.name}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                       as {actor.character}
                                    </p>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     )}
                  </section>

                  {trailer && (
                     <section className="mb-8">
                        <h2 className="font-semibold text-gray-200 mb-5">
                           Trailer
                        </h2>
                        <div className="aspect-video">
                           <iframe
                              src={`https://www.youtube.com/embed/${trailer.key}`}
                              title={trailer.name}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full rounded-xl shadow-md"
                           ></iframe>
                        </div>
                     </section>
                  )}
               </div>
            )
         )}
      </>
   );
};

export default MovieDetailPage;
