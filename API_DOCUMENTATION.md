# The South Line API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Posts

#### GET /posts
Get all posts.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Post Title",
    "slug": "post-slug",
    "content": "Post content...",
    "author": "Admin",
    "image": "image_url",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "categoryId": {
      "name": "Technology",
      "slug": "technology"
    }
  }
]
```

#### GET /posts/:slug
Get a specific post by slug.

**Response:**
```json
{
  "id": "uuid",
  "title": "Post Title",
  "slug": "post-slug",
  "content": "Post content...",
  "author": "Admin",
  "image": "image_url",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "categoryId": {
    "name": "Technology",
    "slug": "technology"
  }
}
```

#### POST /posts
Create a new post. Requires authentication.

**Request Body:**
```json
{
  "title": "New Post Title",
  "slug": "new-post-slug",
  "content": "Post content here...",
  "categorySlug": "technology",
  "author": "Admin",
  "image": "optional_image_url"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "New Post Title",
  "slug": "new-post-slug",
  "content": "Post content here...",
  "categoryId": "category_uuid",
  "author": "Admin",
  "image": "optional_image_url",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

#### PUT /posts/:id
Update a post. Requires authentication.

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "categorySlug": "news",
  "author": "Admin",
  "image": "new_image_url"
}
```

#### DELETE /posts/:id
Delete a post. Requires authentication.

**Response:**
```json
{
  "ok": true
}
```

### Categories

#### GET /categories
Get all categories.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Technology",
    "slug": "technology",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

#### GET /categories/:slug/posts
Get all posts in a specific category.

**Response:**
```json
{
  "category": {
    "name": "Technology",
    "slug": "technology"
  },
  "posts": [
    {
      "id": "uuid",
      "title": "Tech Post",
      "slug": "tech-post",
      "content": "Content...",
      "author": "Admin",
      "image": "image_url",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "categoryId": {
        "name": "Technology",
        "slug": "technology"
      }
    }
  ]
}
```

### Health Check

#### GET /health
Check if the API is running.

**Response:**
```json
{
  "ok": true
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 409: Conflict (e.g., slug already exists)
- 500: Internal Server Error

## Database Schema

### Users Table
- id: UUID (Primary Key)
- email: VARCHAR(255) UNIQUE
- password: VARCHAR(255)
- role: VARCHAR(50) DEFAULT 'admin'
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP

### Categories Table
- id: UUID (Primary Key)
- name: VARCHAR(255) UNIQUE
- slug: VARCHAR(255) UNIQUE
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP

### Posts Table
- id: UUID (Primary Key)
- title: VARCHAR(255)
- slug: VARCHAR(255) UNIQUE
- content: TEXT
- author: VARCHAR(255) DEFAULT 'Admin'
- image: VARCHAR(255) (Optional)
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
- categoryId: UUID (Foreign Key to Categories)
- authorId: UUID (Foreign Key to Users, Optional)

## Setup Instructions

1. Ensure PostgreSQL database is running
2. Run the SQL script in `backend/create-tables.sql` to create tables
3. Run `npm run seed` to seed initial data
4. Start the server with `npm run dev`
5. The API will be available at http://localhost:4000

## Default Admin Credentials
- Email: admin@example.com
- Password: admin123