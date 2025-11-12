import 'dotenv/config';
import { User } from '../models/User.js';
import db from '../config/db.js';

async function createAdmin(email, password) {
  if (!email || !password) {
    console.error('Usage: node src/seed/create-admin.js <email> <password>');
    process.exit(1);
  }

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log('An admin with this email already exists.');
      return;
    }

    const admin = await User.create({
      username: email.split('@')[0],
      email,
      password,
      role: 'admin',
    });

    console.log(`Admin user ${admin.email} created successfully.`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await db.client.end();
  }
}

const [email, password] = process.argv.slice(2);
createAdmin(email, password);
