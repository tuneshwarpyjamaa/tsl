import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { db } from '../lib/db.js';

dotenv.config();

// Connect to database
await connectDB(process.env.DATABASE_URL);

async function clearPosts() {
    try {
        console.log('Clearing all posts...');
        await db.none('DELETE FROM posts');
        console.log('All posts cleared successfully');
        process.exit(0);
    } catch (e) {
        console.error('Error clearing posts:', e);
        process.exit(1);
    }
}

clearPosts();