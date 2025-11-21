import { db } from '../lib/db.js';
import bcrypt from 'bcryptjs';

export class User {
    static async create(data) {
        const { email, password, role = 'admin' } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
      INSERT INTO users (email, password, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id, email, role, "createdAt", "updatedAt"
    `;
        return await db.one(query, [email, hashedPassword, role]);
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        return await db.oneOrNone(query, [email]);
    }

    static async findById(id) {
        const query = 'SELECT id, email, role, "createdAt", "updatedAt" FROM users WHERE id = $1';
        return await db.oneOrNone(query, [id]);
    }

    static async update(id, data) {
        const { email, password, role } = data;
        let hashedPassword = password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        const query = `
      UPDATE users
      SET email = $1, password = COALESCE($2, password), role = $3, "updatedAt" = NOW()
      WHERE id = $4
      RETURNING id, email, role, "createdAt", "updatedAt"
    `;
        return await db.one(query, [email, hashedPassword, role, id]);
    }

    static async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1';
        return await db.none(query, [id]);
    }

    static async authenticate(email, password) {
        const user = await this.findByEmail(email);
        if (!user) return null;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;
        return user;
    }
}