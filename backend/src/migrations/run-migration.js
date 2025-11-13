import 'dotenv/config';
import { Client } from 'pg';
import { promises as fs } from 'fs';
import path from 'path';

const runMigration = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to the database.');

    const filePath = path.join(process.cwd(), 'src', 'migrations', '003_performance_optimization.sql');
    const sql = await fs.readFile(filePath, 'utf-8');

    console.log('Running migration script...');
    await client.query(sql);
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
};

runMigration();
