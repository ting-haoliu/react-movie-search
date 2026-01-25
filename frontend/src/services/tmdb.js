const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
   method: 'GET',
   headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
   },
};

export async function fetchMovies(query = '', page = 1) {
   const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

   const endpoint = query
      ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
      : `${API_URL}/discover/movie?` +
        `primary_release_date.lte=${today}` +
        `&sort_by=primary_release_date.desc` +
        `&vote_count.gte=50` +
        `&popularity.gte=30` +
        `&page=${page}`;

   const response = await fetch(endpoint, API_OPTIONS);
   if (!response.ok) {
      throw new Error('Network response was not ok');
   }

   return response.json();
}

export async function fetchTrendingMovies() {
   const endpoint = `${API_URL}/trending/movie/week`;

   const response = await fetch(endpoint, API_OPTIONS);
   if (!response.ok) {
      throw new Error('Network response was not ok');
   }

   return response.json();
}

export async function fetchMovieById(id) {
   const endpoint = `${API_URL}/movie/${id}`;

   const response = await fetch(endpoint, API_OPTIONS);
   if (!response.ok) {
      if (response.status === 404) {
         throw new Error('Movie not found');
      }
      throw new Error('Failed to fetch movie');
   }

   return response.json();
}

export async function fetchMovieCredits(id) {
   const endpoint = `${API_URL}/movie/${id}/credits`;

   const response = await fetch(endpoint, API_OPTIONS);
   if (!response.ok) {
      throw new Error('Failed to fetch movie credits');
   }

   return response.json();
}

export async function fetchMovieVideos(id) {
   const endpoint = `${API_URL}/movie/${id}/videos`;

   const response = await fetch(endpoint, API_OPTIONS);
   if (!response.ok) {
      throw new Error('Failed to fetch movie videos');
   }

   return response.json();
}

export async function fetchMovieStreams(id) {
   const endpoint = `${API_URL}/movie/${id}/watch/providers`;

   const response = await fetch(endpoint, API_OPTIONS);
   if (!response.ok) {
      throw new Error('Failed to fetch movie streaming providers');
   }

   return response.json();
}
