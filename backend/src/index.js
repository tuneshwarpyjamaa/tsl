import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import categoryRoutes from './routes/category.routes.js';
import userRoutes from './routes/user.routes.js';

// Load .env file
dotenv.config();

// Connect to database
connectDB().catch(err => {
  console.error('Database connection failed. Exiting.', err);
  process.exit(1);
});

const app = express();
const PORT = Number(process.env.PORT) || 4000; // Prefer 4000 to avoid Next.js dev port conflict

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// 404
app.use((req, res, _next) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}

export default app;
