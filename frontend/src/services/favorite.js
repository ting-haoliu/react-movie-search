const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
   const token = localStorage.getItem('token');
   return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
   };
};

export const toggleFavorite = async (movieId) => {
   const response = await fetch(`${API_URL}/favorites`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ movieId }),
   });

   const result = await response.json();

   if (!result.success) {
      throw new Error(result.message || 'Toggle favorite failed');
   }

   return result.data;
};

export const getFavorites = async () => {
   const response = await fetch(`${API_URL}/favorites`, {
      method: 'GET',
      headers: getAuthHeaders(),
   });

   const result = await response.json();

   if (!result.success) {
      throw new Error(result.message || 'Get favorites failed');
   }

   return result.data;
};

export const getFavoriteCount = async () => {
   const response = await fetch(`${API_URL}/favorites/count`, {
      method: 'GET',
      headers: getAuthHeaders(),
   });

   const result = await response.json();

   if (!result.success) {
      throw new Error(result.message || 'Get count failed');
   }

   return result.data.count;
};
