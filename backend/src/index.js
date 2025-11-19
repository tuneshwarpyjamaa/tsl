import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { connectDB, closeDB, healthCheck, getPoolStats } from './config/db.js';
import { getCache } from './lib/cache.js';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import categoryRoutes from './routes/category.routes.js';
import userRoutes from './routes/user.routes.js';

// Load .env file
dotenv.config();

// Initialize memory-safe cache
const articleCache = getCache();

// Connect to database
connectDB().catch(err => {
  console.error('Database connection failed:', err);
  // Don't exit in production (Vercel), just log the error
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
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

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Enhanced health check with memory and cache stats
app.get('/api/health', async (_req, res) => {
  try {
    const dbHealth = await healthCheck();
    const cacheStats = articleCache.getStats();
    const poolStats = getPoolStats();
    const memUsage = process.memoryUsage();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      cache: {
        ...cacheStats,
        memoryUsage: {
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
          external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
          rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`
        }
      },
      database: {
        connectionPool: poolStats
      },
      uptime: `${Math.round(process.uptime())}s`,
      nodeVersion: process.version
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Memory monitoring endpoint (development only)
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/memory-stats', (req, res) => {
    const memUsage = process.memoryUsage();
    const cacheStats = articleCache.getStats();
    const poolStats = getPoolStats();

    res.json({
      memory: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
        arrayBuffers: memUsage.arrayBuffers ? `${Math.round(memUsage.arrayBuffers / 1024 / 1024)}MB` : 'N/A'
      },
      cache: cacheStats,
      database: {
        pool: poolStats
      },
      uptime: process.uptime()
    });
  });

  // Cache management endpoint (development only)
  app.post('/api/cache/clear', (req, res) => {
    articleCache.clear();
    res.json({
      success: true,
      message: 'Cache cleared',
      timestamp: new Date().toISOString()
    });
  });
}

// 404 handler
app.use((req, res, _next) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

// Enhanced error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  });
});

// Memory monitoring (runs every 30 seconds) - FIXED: Store interval ID for proper cleanup
let memoryMonitorIntervalId = null;
if (process.env.NODE_ENV !== 'production') {
  memoryMonitorIntervalId = setInterval(() => {
    const memUsage = process.memoryUsage();
    const cacheStats = articleCache.getStats();

    console.log('Memory Usage:', {
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
      cacheItems: cacheStats.activeItems,
      cacheMemory: `${cacheStats.estimatedMemoryKB}KB`
    });

    // Alert if memory usage is critically high
    if (memUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
      console.warn('⚠️ High memory usage detected, clearing cache...');
      articleCache.clear();
    }

    // Alert if cache is consuming too much memory
    if (cacheStats.estimatedMemoryKB > 50 * 1024) { // 50MB
      console.warn('⚠️ Cache memory usage high, forcing cleanup...');
      articleCache.cleanup();
    }
  }, 30000); // Every 30 seconds
}

// CRITICAL: Graceful shutdown handlers to prevent memory leaks
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received, starting graceful shutdown...`);

  try {
    // Clear memory monitoring interval
    if (memoryMonitorIntervalId) {
      clearInterval(memoryMonitorIntervalId);
      memoryMonitorIntervalId = null;
      console.log('Memory monitoring interval cleared');
    }

    // Stop accepting new requests
    server.close((err) => {
      if (err) {
        console.error('Error closing server:', err);
        process.exit(1);
      }
      console.log('HTTP server closed');
    });

    // Close database connections
    console.log('Closing database connections...');
    await closeDB();

    // Clean up cache
    console.log('Cleaning up cache...');
    articleCache.destroy();

    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Register signal handlers for graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// For Vercel serverless deployment, export the app
export default app;

// For local development, start the server
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 API server listening on http://localhost:${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
    console.log(`🔧 Memory stats available at http://localhost:${PORT}/api/memory-stats (dev only)`);
    console.log(`⏰ Process started at: ${new Date().toISOString()}`);
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try a different port.`);
    } else {
      console.error('Server error:', error);
    }
    process.exit(1);
  });
}
