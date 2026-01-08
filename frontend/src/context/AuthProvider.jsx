import { useEffect, useState } from 'react';

import { AuthContext } from './AuthContext';
import { getCurrentUser } from '../services/auth';
import { getFavoriteCount } from '../services/favorite';

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [favoriteCount, setFavoriteCount] = useState(0);

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const token = localStorage.getItem('token');

            if (token) {
               const currentUser = await getCurrentUser();
               setUser(currentUser);

               const count = await getFavoriteCount();
               setFavoriteCount(count);
            } else {
               setUser(null);
            }
         } catch (error) {
            console.error('Error fetching current user:', error);
            setUser(null);
            localStorage.removeItem('token');
         } finally {
            setLoading(false);
         }
      };

      fetchUser();
   }, []);

   const login = async (userData) => {
      setUser(userData);

      // Fetch favorite count after login
      try {
         const count = await getFavoriteCount();
         setFavoriteCount(count);
      } catch (error) {
         console.error('Error fetching favorite count after login:', error);
      }
   };

   const logout = () => {
      localStorage.removeItem('token');
      setUser(null);
      setFavoriteCount(0);
   };

   const updateFavoriteCount = async (delta) => {
      setFavoriteCount((prevCount) => prevCount + delta);
   };

   return (
      <AuthContext.Provider
         value={{
            user,
            setUser,
            loading,
            favoriteCount,
            login,
            logout,
            updateFavoriteCount,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};
