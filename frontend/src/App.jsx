import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import FavoritePage from './pages/FavoritePage';

const App = () => {
   return (
      <>
         <Toaster
            position="top-center"
            toastOptions={{
               duration: 3000,
               style: {
                  background: '#1f2937',
                  color: '#fff',
                  border: '1px solid #374151',
               },
               success: {
                  iconTheme: {
                     primary: '#10b981',
                     secondary: '#fff',
                  },
               },
               error: {
                  iconTheme: {
                     primary: '#ef4444',
                     secondary: '#fff',
                  },
               },
            }}
         />

         <Router>
            <Routes>
               <Route path="/" element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/movie/:id" element={<MovieDetailPage />} />
                  <Route path="/favorites" element={<FavoritePage />} />
               </Route>
            </Routes>
         </Router>
      </>
   );
};

export default App;
