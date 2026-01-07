const API_URL = import.meta.env.VITE_API_URL || '/api';

export const signUp = async (email, password, confirmPassword, name) => {
   const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, confirmPassword, name }),
   });

   const result = await response.json();

   // Deal with errors from validator
   if (!result.success) {
      if (result.errors && Array.isArray(result.errors)) {
         throw new Error(JSON.stringify(result.errors));
      }

      // Deal with general errors
      throw new Error(result.message || 'Registration failed');
   }

   localStorage.setItem('token', result.data.token);

   return result.data;
};

export const signIn = async (email, password) => {
   const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
   });

   const result = await response.json();

   if (!result.success) {
      if (result.errors && Array.isArray(result.errors)) {
         throw new Error(JSON.stringify(result.errors));
      }

      throw new Error(result.message || 'Login failed');
   }

   localStorage.setItem('token', result.data.token);

   return { user: result.data.user, session: { token: result.data.token } };
};

export const signInWithGoogle = async () => {
   throw new Error('Google sign-in not implemented yet');
};

export const signOut = async () => {
   localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
   const token = localStorage.getItem('token');

   if (!token) {
      return null;
   }

   try {
      const response = await fetch(`${API_URL}/auth/me`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      const result = await response.json();

      if (!result.success) {
         localStorage.removeItem('token');
         return null;
      }

      return result.data; // { id, email, name }
   } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('token');
      return null;
   }
};
