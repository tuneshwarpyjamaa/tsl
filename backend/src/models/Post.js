import { db } from '../lib/db.js';

export class Post {
  static async create(data) {
    const { title, slug, content, categoryId, author = 'Admin', image, authorId } = data;
    const query = `
      INSERT INTO posts (title, slug, content, "categoryId", author, image, "authorId", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, title, slug, content, "categoryId", author, image, "authorId", "createdAt", "updatedAt"
    `;
    return await db.one(query, [title, slug, content, categoryId, author, image, authorId]);
  }

  static async findAll() {
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      ORDER BY p."createdAt" DESC
    `;
    return await db.many(query);
  }

  static async findRecent(limit = 5) {
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      ORDER BY p."createdAt" DESC
      LIMIT $1
    `;
    return await db.many(query, [limit]);
  }

  static async findBySlug(slug) {
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p.slug = $1
    `;
    return await db.one(query, [slug]);
  }

  static async findById(id) {
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p.id = $1
    `;
    return await db.one(query, [id]);
  }

  static async findByCategory(categoryId, limit) {
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p."categoryId" = $1
      ORDER BY p."createdAt" DESC
    `;
    const params = [categoryId];
    if (limit) {
      query += ' LIMIT $2';
      params.push(limit);
    }
    return await db.many(query, params);
  }

  static async update(id, data) {
    const { title, slug, content, categoryId, author, image } = data;
    const query = `
      UPDATE posts
      SET title = $1, slug = $2, content = $3, "categoryId" = $4, author = $5, image = $6, "updatedAt" = NOW()
      WHERE id = $7
      RETURNING id, title, slug, content, "categoryId", author, image, "createdAt", "updatedAt"
    `;
    return await db.one(query, [title, slug, content, categoryId, author, image, id]);
  }

  static async delete(id) {
    const query = 'DELETE FROM posts WHERE id = $1';
    return await db.none(query, [id]);
  }

  static async search(query) {
    const searchQuery = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p.title ILIKE $1 OR p.content ILIKE $1
      ORDER BY p."createdAt" DESC
    `;
    return await db.many(searchQuery, [`%${query}%`]);
  }
}
