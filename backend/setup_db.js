import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

async function setup() {
  try {
    console.log('Connecting to PostgreSQL/Supabase...');
    await pool.query(schema);
    console.log('Database tables (users, reviews) created successfully! 🎉');
  } catch (err) {
    console.error('Error setting up database:', err.message);
  } finally {
    await pool.end();
  }
}

setup();
