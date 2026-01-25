import { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from 'react-use';

import Carousel from '../components/Carousel';
import Search from '../components/Search';
import Skeleton from '../components/Skeleton';
import MovieCard from '../components/MovieCard';

import { fetchMovies, fetchTrendingMovies } from '../services/tmdb';

const HomePage = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [movieError, setMovieError] = useState('');
   const [trendingError, setTrendingError] = useState('');
   const [movieList, setMovieList] = useState([]);
   const [trendingMovies, setTrendingMovies] = useState([]);
   const [movieLoading, setMovieLoading] = useState(false);
   const [trendingLoading, setTrendingLoading] = useState(false);
   const [debounceSearchTerm, setDebounceSearchTerm] = useState('');

   // Infinite scroll states
   const [currentPage, setCurrentPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const observerTarget = useRef(null);

   // Debounce the search term to prevent making too many API request
   // by waiting for the user to stop typing for 500ms
   useDebounce(
      () => {
         setDebounceSearchTerm(searchTerm);
      },
      500,
      [searchTerm]
   );

   const loadMovies = async (query = '', page = 1, append = false) => {
      if (append) {
         setIsLoadingMore(true);
      } else {
         setMovieLoading(true);
      }
      setMovieError('');

      try {
         const data = await fetchMovies(query, page);

         if (!data.results || data.results.length === 0) {
            if (!append) {
               setMovieError('No movies found');
               setMovieList([]);
            }
            setHasMore(false);
            return;
         }

         if (append) {
            setMovieList((prev) => [...prev, ...data.results]);
         } else {
            setMovieList(data.results);
         }

         // Check if there are more pages
         setHasMore(page < data.total_pages);
      } catch (error) {
         console.error('Error fetching movies:', error);
         setMovieError('Failed to fetch movies, Please try again later.');
      } finally {
         if (append) {
            setIsLoadingMore(false);
         } else {
            setMovieLoading(false);
         }
      }
   };

   const loadTrendingMovies = async () => {
      setTrendingLoading(true);
      setTrendingError('');

      try {
         const data = await fetchTrendingMovies();
         const movies = data.results.slice(0, 10); // Get top 10 trending movies

         setTrendingMovies(movies);
      } catch (error) {
         console.error('Error fetching trending movies:', error);
         setTrendingError(
            'Failed to fetch trending movies, Please try again later.'
         );
      } finally {
         setTrendingLoading(false);
      }
   };

   // Load more movies when scrolling to bottom
   const loadMore = useCallback(() => {
      if (!isLoadingMore && hasMore && !movieLoading) {
         const nextPage = currentPage + 1;
         setCurrentPage(nextPage);
         loadMovies(debounceSearchTerm, nextPage, true);
      }
   }, [isLoadingMore, hasMore, movieLoading, currentPage, debounceSearchTerm]);

   // Reset page when search term changes
   useEffect(() => {
      setCurrentPage(1);
      setHasMore(true);
      loadMovies(debounceSearchTerm, 1, false);
   }, [debounceSearchTerm]);

   useEffect(() => {
      loadTrendingMovies();
   }, []);

   // Set up Intersection Observer for infinite scroll
   useEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            if (entries[0].isIntersecting) {
               loadMore();
            }
         },
         { threshold: 0.1 }
      );

      const currentTarget = observerTarget.current;
      if (currentTarget) {
         observer.observe(currentTarget); // Start observing the target element
      }

      return () => {
         if (currentTarget) {
            observer.unobserve(currentTarget); // Clean up the observer on unmount
         }
      };
   }, [loadMore]);

   return (
      <>
         <div className="pattern" />

         <div className="wrapper">
            <header>
               <img src="./hero.png" alt="Hero Banner" />
               <h1>
                  Find <span className="text-gradient">Movies</span> You'll
                  Enjoy Without the Hassle
               </h1>

               <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </header>

            <section className="mt-20">
               <h2 className="mb-5">Trending This Week</h2>

               {trendingLoading ? (
                  <ol className="flex flex-row overflow-x-auto w-full hide-scrollbar">
                     <Skeleton variant="carousel" count={5} />
                  </ol>
               ) : trendingError ? (
                  <p className="text-red-500">{trendingError}</p>
               ) : (
                  <ol className="flex flex-row overflow-x-auto w-full hide-scrollbar">
                     {trendingMovies.map((movie, index) => (
                        <Carousel
                           key={movie.id}
                           trendingMovies={trendingMovies}
                           movie={movie}
                           index={index}
                        />
                     ))}
                  </ol>
               )}
            </section>

            <section className="all-movies">
               <h2 className="mt-10">Latest Movies</h2>

               {movieLoading ? (
                  <ul>
                     <Skeleton variant="card" count={8} />
                  </ul>
               ) : movieError ? (
                  <p className="text-red-500">{movieError}</p>
               ) : (
                  <>
                     <ul>
                        {movieList.map((movie) => (
                           <MovieCard key={movie.id} movie={movie} />
                        ))}
                     </ul>

                     {/* Loading indicator for infinite scroll */}
                     {isLoadingMore && (
                        <ul className="mt-5">
                           <Skeleton variant="card" count={4} />
                        </ul>
                     )}

                     {/* Observer target for infinite scroll */}
                     {hasMore && !isLoadingMore && (
                        <div ref={observerTarget} className="h-10" />
                     )}

                     {/* End of results message */}
                     {!hasMore && movieList.length > 0 && (
                        <p className="text-center text-gray-500 mt-8 mb-8">
                           No more movies to load
                        </p>
                     )}
                  </>
               )}
            </section>
         </div>
      </>
   );
};

export default HomePage;
