import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable front-end access this server with different origin
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
   res.json({
      success: true,
      message: 'Movie API Server',
      endpoints: {
         register: 'POST /api/auth/register',
         login: 'POST /api/auth/login',
         toggleFavorite: 'POST /api/favorites',
         listFavorite: 'GET /api/favorites',
         countFavorite: 'GET /api/favorites/count',
      },
   });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);

// 404 handler
app.use('*', (req, res) => {
   res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
   console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
