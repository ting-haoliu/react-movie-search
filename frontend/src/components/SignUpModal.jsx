import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { signUp } from '../services/auth';
import { useAuth } from '../context/useAuth';

const SignUpModal = ({ isOpen, onClose }) => {
   const { login } = useAuth();

   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState({});

   useEffect(() => {
      if (isOpen) {
         // Reset form fields and errors when the modal opens
         setName('');
         setEmail('');
         setPassword('');
         setConfirmPassword('');
         setError({});
      }
   }, [isOpen]);

   const handleSignUp = async (e) => {
      e.preventDefault();
      setError({});

      try {
         const result = await signUp(email, password, confirmPassword, name);

         login(result.user);
         toast.success('Account created successfully!');
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

   if (!isOpen) return null;

   return (
      <div
         className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
         onClick={onClose}
      >
         <div
            className="bg-black border border-gray-700 p-8 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
         >
            <h2 className="text-2xl font-bold text-white mb-6">
               Create Account
            </h2>

            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
               <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
               />

               <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
               />
               {error.email && (
                  <p className="text-red-500 text-sm">{error.email}</p>
               )}

               <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
               />
               {error.password && (
                  <p className="text-red-500 text-sm">{error.password}</p>
               )}

               <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
               />
               {error.confirmPassword && (
                  <p className="text-red-500 text-sm">
                     {error.confirmPassword}
                  </p>
               )}

               {error.general && (
                  <p className="text-red-500 text-sm">{error.general}</p>
               )}

               <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors mt-2"
               >
                  Sign Up
               </button>
            </form>

            <button
               onClick={onClose}
               className="w-full px-4 py-2 mt-4 bg-transparent text-gray-400 rounded border border-gray-600 hover:bg-gray-800 transition-colors"
            >
               Cancel
            </button>
         </div>
      </div>
   );
};

export default SignUpModal;
