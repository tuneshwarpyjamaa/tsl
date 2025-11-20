import { db } from '../lib/db.js';
import slugify from 'slugify';

export class Category {
  static async create(data) {
    const { name } = data;
    const slug = slugify(name, { lower: true, strict: true });
    const query = `
      INSERT INTO categories (name, slug, "createdAt", "updatedAt")
      VALUES ($1, $2, NOW(), NOW())
      RETURNING id, name, slug, "createdAt", "updatedAt"
    `;
    return await db.one(query, [name, slug]);
  }

  static async findAll() {
    const query = 'SELECT * FROM categories ORDER BY "createdAt" DESC';
    return await db.manyOrNone(query);
  }

  static async findBySlug(slug) {
    const query = 'SELECT * FROM categories WHERE slug = $1';
    return await db.one(query, [slug]);
  }

  static async findBySlugs(slugs) {
    if (!slugs || slugs.length === 0) {
      return [];
    }
    const query = 'SELECT * FROM categories WHERE slug = ANY($1)';
    return await db.manyOrNone(query, [slugs]);
  }

  static async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1';
    return await db.one(query, [id]);
  }

  static async update(id, data) {
    const { name } = data;
    const slug = slugify(name, { lower: true, strict: true });
    const query = `
      UPDATE categories
      SET name = $1, slug = $2, "updatedAt" = NOW()
      WHERE id = $3
      RETURNING id, name, slug, "createdAt", "updatedAt"
    `;
    return await db.one(query, [name, slug, id]);
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1';
    return await db.none(query, [id]);
  }
}
