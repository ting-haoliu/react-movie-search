import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signOut } from '../services/auth';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';

import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import CloseIcon from './icons/CloseIcon';
import MenuIcon from './icons/MenuIcon';
import MobileMenu from './MobileMenu';

const Navbar = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
   const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const { user, logout, favoriteCount } = useAuth();
   const navigate = useNavigate();

   const handleSignOut = async () => {
      await signOut();
      logout();
      setIsDropdownOpen(false);
      toast.success('Signed out successfully');

      // redirect to home page after sign out
      navigate('/');
   };

   return (
      <nav className="w-full h-20 bg-black/80 text-white px-6 py-4 flex items-center justify-between fixed top-0 left-0 z-50">
         {/* Logo */}
         <Link to="/" className="text-2xl font-bold text-gradient">
            MovieApp
         </Link>

         {/* Desktop Links */}
         <ul className="hidden sm:flex items-center gap-6">
            <li>
               <Link to="/" className="hover:text-red-400">
                  Home
               </Link>
            </li>

            {user && (
               <li>
                  <Link to="/favorites" className="hover:text-red-400">
                     Favorites
                  </Link>
                  <span className="ml-1 text-red-400 font-semibold">
                     ({favoriteCount})
                  </span>
               </li>
            )}

            <li>
               {!user ? (
                  <button
                     className="hover:text-red-400"
                     onClick={() => setIsLoginModalOpen(true)}
                  >
                     Sign In
                  </button>
               ) : (
                  <div className="relative">
                     <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold">
                           {user.email?.charAt(0).toUpperCase()}
                        </span>
                     </button>

                     {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg py-1 border border-gray-700">
                           <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                              {user.email}
                           </div>

                           <button
                              onClick={handleSignOut}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 hover:text-red-400 transition-colors"
                           >
                              Sign Out
                           </button>
                        </div>
                     )}
                  </div>
               )}
            </li>
         </ul>

         <button
            className="sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
         >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
         </button>

         {/* Mobile Menu Icon */}
         {isMenuOpen && (
            <MobileMenu
               user={user}
               setIsMenuOpen={setIsMenuOpen}
               setIsLoginModalOpen={setIsLoginModalOpen}
               handleSignOut={handleSignOut}
            />
         )}

         <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSwitchToSignup={() => {
               setIsLoginModalOpen(false);
               setIsSignupModalOpen(true);
            }}
         />

         <SignUpModal
            isOpen={isSignupModalOpen}
            onClose={() => setIsSignupModalOpen(false)}
         />
      </nav>
   );
};

export default Navbar;
