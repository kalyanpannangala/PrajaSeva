// lib/db.ts
import { Pool } from 'pg';

// Initialize the connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Log when a client is connected
pool.on('connect', () => {
  console.log('Connected to the Neon DB!');
});

// Export a query function to be used throughout the application
export const query = (text: string, params?: any[]) => pool.query(text, params);
