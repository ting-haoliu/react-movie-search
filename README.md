# 🎬 React Movie Search App

A full-stack movie search application built with **React**, **TypeScript**, **Express.js**, **Prisma**, **PostgreSQL**, and **TMDB API**. Features include user authentication, favorite management, and responsive design.

🚀 **Live Demo** [react-tmdb-movie-search.vercel.app](https://react-tmdb-movie-search.vercel.app/)  
📂 **Source Code** [GitHub Repository](https://github.com/ting-haoliu/react-movie-search-app.git)  

---

## Features

### Frontend
- **Movie Search**: Search for movies from the TMDB database by keyword
  - Includes **debounce optimization** (500ms) to reduce API calls
- **Popular Movies**: Homepage displays the latest released movies sorted by release date
- **Trending Movies**: Shows this week's top 10 trending movies with ranking
- **Movie Detail Page**: Click on any movie card to view detailed information including:
  - Cast and crew information
  - Movie trailers and videos
  - Ratings and reviews
- **Favorite Movies**: 
  - Logged-in users can mark or unmark movies as favorites
  - Favorites are stored in PostgreSQL database
  - A dedicated **Favorites Page** lists all saved movies
  - Real-time favorite count display in navbar
- **User Authentication**: 
  - Sign-up and login with email/password
  - JWT-based authentication
  - Persistent sessions using localStorage
- **Responsive Web Design (RWD)**: Fully responsive layout that works seamlessly on desktops, tablets, and mobile devices

### Backend
- **RESTful API**: Express.js backend with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT token-based auth with bcrypt password hashing
- **Validation**: Request validation using express-validator
- **Error Handling**: Global error handler middleware

---

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety (partially migrated)
- **React Router v7** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **react-hot-toast** - Toast notifications
- **react-use** - React hooks library (debounce)

### Backend
- **Express. js** - Web framework
- **TypeScript** - Type-safe backend
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
- **CORS** - Cross-origin resource sharing

### External APIs
- **TMDB API** - Movie database

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

---

## Installation & Usage

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- TMDB API key ([Get it here](https://developer.themoviedb.org/docs/getting-started))

### 1. Clone the Repository
```bash
git clone https://github.com/ting-haoliu/react-movie-search.git
cd react-movie-search
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/movie_search"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Server
PORT=3000
NODE_ENV=development
```

Run Prisma migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Frontend Setup

Open a new terminal: 
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
# TMDB API Key
VITE_TMDB_API_KEY="your_tmdb_api_key_here"

# Backend API URL (optional, defaults to /api with proxy)
VITE_API_URL="http://localhost:3000/api"
```

Start the frontend dev server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Favorites
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/favorites` | Toggle movie favorite | ✅ |
| GET | `/api/favorites` | List user's favorites | ✅ |
| GET | `/api/favorites/count` | Get favorites count | ✅ |

**Authentication**:  Include JWT token in Authorization header: 
```
Authorization: Bearer <your_jwt_token>
```

---

## Screenshots

### Homepage
![React Movie Search App Homepage Screenshot](screenshots/Homepage.png)

### Trending
![React Movie Search App Trending Movies Screenshot](screenshots/Trending.png)

### Movie Details
![React Movie Search App Movie Detail Page Screenshot](screenshots/Detail1.png)
![React Movie Search App Movie Detail Page Additional Screenshot](screenshots/Detail2.png)

### Sign Up and Sign In
![React Movie Search App Movie Sign Up Screenshot](screenshots/SignUp.png)
![React Movie Search App Movie Sign In Screenshot](screenshots/SignIn.png)

### Favorite
![React Movie Search App Favorites Page Screenshot](screenshots/Favorite.png)

## License
MIT License