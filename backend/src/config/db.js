import pkg from 'pg';
const { Pool } = pkg;

let pool = null;

/**
 * Connect to PostgreSQL database with connection pooling
 * This replaces single client connections to prevent memory leaks
 */
export async function connectDB() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error('DATABASE_URL is not set');
  }
  
  // Create connection pool with optimal settings
  pool = new Pool({
    connectionString: uri,
    max: 15, // Maximum number of clients in the pool
    min: 2,  // Minimum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
    ssl: process.env.NODE_ENV === 'production' ? { 
      rejectUnauthorized: false 
    } : false,
    application_name: 'tmw_blog_app'
  });

  // Handle pool errors to prevent crashes
  pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
    // Don't exit process, just log the error
  });

  // Test the connection
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('PostgreSQL connected with pooling');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

/**
 * Get a client from the connection pool
 * @returns {Pool} PostgreSQL connection pool
 */
export function getClient() {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return pool;
}

/**
 * Execute a query using connection pooling
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries for performance monitoring
    if (duration > 1000) {
      console.log(`Slow query detected: ${duration}ms - ${text.substring(0, 100)}...`);
    }
    
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute a single row query (returns first row or null)
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} First row or null
 */
export async function one(text, params) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Execute a multi-row query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} Array of rows
 */
export async function many(text, params) {
  const result = await query(text, params);
  return result.rows;
}

/**
 * Execute a query that may return zero or more rows
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} Array of rows
 */
export async function manyOrNone(text, params) {
  const result = await query(text, params);
  return result.rows;
}

/**
 * Execute a query that returns any number of rows
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} Array of rows
 */
export async function any(text, params) {
  const result = await query(text, params);
  return result.rows;
}

/**
 * Execute a query that returns no rows
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
export async function none(text, params) {
  return query(text, params);
}

/**
 * Get database pool statistics
 * @returns {object} Pool statistics
 */
export function getPoolStats() {
  if (!pool) {
    return { error: 'Pool not initialized' };
  }
  
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
    activeCount: pool.totalCount - pool.idleCount
  };
}

/**
 * CRITICAL: Properly close the database connection pool
 * This prevents memory leaks and hanging connections
 */
export async function closeDB() {
  if (pool) {
    try {
      await pool.end();
      pool = null;
      console.log('Database connection pool closed properly');
    } catch (error) {
      console.error('Error closing database pool:', error);
    }
  }
}

/**
 * Check database health
 * @returns {Promise<object>} Health status
 */
export async function healthCheck() {
  try {
    const result = await query('SELECT NOW() as timestamp, version() as version');
    return {
      status: 'healthy',
      timestamp: result.rows[0].timestamp,
      version: result.rows[0].version,
      poolStats: getPoolStats()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      poolStats: getPoolStats()
    };
  }
}

// Register cleanup handlers for graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, closing database connections...');
    await closeDB();
  });
  
  process.on('SIGINT', async () => {
    console.log('Received SIGINT, closing database connections...');
    await closeDB();
  });
  
  process.on('exit', async () => {
    console.log('Process exiting, closing database connections...');
    await closeDB();
  });
}
