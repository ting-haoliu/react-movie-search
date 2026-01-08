import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { signIn } from '../services/auth';
import { useAuth } from '../context/useAuth';

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
   const { login } = useAuth();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState({});

   useEffect(() => {
      if (isOpen) {
         // Reset form fields and errors when the modal opens
         setEmail('');
         setPassword('');
         setError({});
      }
   }, [isOpen]);

   if (!isOpen) return null;

   const handleSignIn = async (e) => {
      e.preventDefault();
      setError({});

      try {
         const result = await signIn(email, password);

         login(result.user);
         toast.success('Successfully signed in!');
         onClose();
      } catch (err) {
         try {
            const errorArray = JSON.parse(err.message);
            const fieldErrors = {};
            errorArray.forEach((error) => {
               if (error.field) {
                  fieldErrors[error.field] = error.message;
               }
            });

            setError(fieldErrors);
         } catch {
            setError({ general: err.message });
         }
      }
   };

   const handleGoogleSignIn = () => {
      console.log('Google Sign-In clicked');

      toast.error('Google Sign-In is not implemented yet.');
   };

   const handleDemoSignIn = async (e) => {
      e.preventDefault();

      try {
         const result = await signIn('test@abc.com', '123456asdfgh');

         login(result.user);
         toast.success('Successfully signed in as Demo User!');
         onClose();
      } catch (err) {
         try {
            const errorArray = JSON.parse(err.message);
            const fieldErrors = {};
            errorArray.forEach((error) => {
               if (error.field) {
                  fieldErrors[error.field] = error.message;
               }
            });

            setError(fieldErrors);
         } catch {
            setError({ general: err.message });
         }
      }
   };

   return (
      <div
         className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
         onClick={onClose}
      >
         <div
            className="bg-black border border-gray-700 p-8 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
         >
            <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

            {/* Email/Password Form */}
            <form onSubmit={handleSignIn} className="flex flex-col gap-4 mb-4">
               <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-white text-sm">
                     Email
                  </label>
                  <input
                     type="email"
                     id="email"
                     placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                  {error.email && (
                     <p className="text-red-500 text-sm">{error.email}</p>
                  )}
               </div>

               <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-white text-sm">
                     Password
                  </label>
                  <input
                     type="password"
                     id="password"
                     placeholder="Enter your password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                  {error.password && (
                     <p className="text-red-500 text-sm">{error.password}</p>
                  )}
               </div>

               {error.general && (
                  <p className="text-red-500 text-sm">{error.general}</p>
               )}

               <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
               >
                  Sign In
               </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mb-6">
               <span className="text-gray-400 text-sm">
                  Don't have an account?{' '}
               </span>
               <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-blue-500 text-sm hover:text-blue-400 transition-colors underline"
               >
                  Sign Up
               </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
               <div className="flex-1 h-px bg-gray-600" />
               <span className="text-gray-400 text-sm">OR</span>
               <div className="flex-1 h-px bg-gray-600" />
            </div>

            {/* Google Sign In */}
            <button
               className="w-full px-4 py-2 bg-white text-black rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors mb-4"
               onClick={handleGoogleSignIn}
            >
               <img src="./Google.svg" alt="Google Logo" className="w-5 h-5" />
               Sign in with Google
            </button>

            {/* Demo User Sign In */}
            <button
               className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors mb-4"
               onClick={handleDemoSignIn}
            >
               Sign in as Demo User
            </button>

            {/* Cancel Button */}
            <button
               onClick={onClose}
               className="w-full px-4 py-2 bg-transparent text-gray-400 rounded border border-gray-600 hover:bg-gray-800 transition-colors"
            >
               Cancel
            </button>
         </div>
      </div>
   );
};

export default LoginModal;
