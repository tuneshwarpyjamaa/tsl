/**
 * Database utility functions using connection pooling
 * This replaces the previous db.js to work with the new pooled connection system
 * and prevents circular import issues
 */

import { 
  query as dbQuery, 
  one as dbOne, 
  many as dbMany, 
  manyOrNone as dbManyOrNone, 
  any as dbAny, 
  none as dbNone,
  getPoolStats,
  healthCheck 
} from '../config/db.js';

// Re-export the database functions for backward compatibility
export { dbQuery as query, dbOne as one, dbMany as many, dbManyOrNone, dbAny as any, dbNone as none };

// Enhanced database utility functions with better error handling
export const db = {
  query: (text, params) => dbQuery(text, params),
  one: (text, params) => dbOne(text, params),
  many: (text, params) => dbMany(text, params),
  manyOrNone: (text, params) => dbManyOrNone(text, params),
  any: (text, params) => dbAny(text, params),
  none: (text, params) => dbNone(text, params),
  
  // Get connection pool statistics
  getStats: () => getPoolStats(),
  
  // Health check
  health: () => healthCheck()
};

export default db;