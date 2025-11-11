import bcrypt from 'bcryptjs';
import { db } from '../lib/db.js';

export class User {
  static async create(data) {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      displayName,
      bio,
      dateOfBirth,
      websiteUrl,
      profilePictureUrl,
      role = 'Member',
    } = data;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (
        username, email, password, "firstName", "lastName", "displayName", bio, "dateOfBirth", "websiteUrl", "profilePictureUrl", role, "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING id, username, email, role, "createdAt", "updatedAt"
    `;
    const result = await db.one(query, [
      username,
      email,
      hashedPassword,
      firstName,
      lastName,
      displayName,
      bio,
      dateOfBirth,
      websiteUrl,
      profilePictureUrl,
      role,
    ]);
    return result;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    return await db.one(query, [email]);
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    return await db.one(query, [username]);
  }

  static async findById(id) {
    const query = 'SELECT id, username, email, "firstName", "lastName", "displayName", bio, "dateOfBirth", "websiteUrl", "profilePictureUrl", role, "createdAt", "updatedAt" FROM users WHERE id = $1';
    return await db.one(query, [id]);
  }

  static async comparePassword(candidate, hashed) {
    return bcrypt.compare(candidate, hashed);
  }

  static async findAll() {
    const query = 'SELECT id, email, role, "createdAt", "updatedAt" FROM users ORDER BY "createdAt" DESC';
    return await db.any(query);
  }

  static async updateRole(id, role) {
    const query = `
      UPDATE users
      SET role = $2, "updatedAt" = NOW()
      WHERE id = $1
      RETURNING id, email, role, "updatedAt"
    `;
    return await db.one(query, [id, role]);
  }
  
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    return await db.none(query, [id]);
  }
}
