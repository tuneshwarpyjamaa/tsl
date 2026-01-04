# Database Integration Guide

## 5 Simple Steps to Save Articles

### 1. **Required Fields**
You must provide these 4 fields when saving an article:
- **title**: Article headline (max 255 characters)
- **slug**: URL-friendly version of title (lowercase, use hyphens, must be unique)
- **content**: Full article text (can be HTML or plain text)
- **categoryId**: Category UUID (get this from the categories table first)

### 2. **Optional Fields**
These fields are optional and have defaults:
- **author**: Writer name (defaults to 'Admin')
- **image**: Image URL or path (can be empty)
- **createdAt/updatedAt**: Timestamps (auto-set if not provided)


### 4. **Common Errors to Avoid**
- **Duplicate slug**: Make slug unique by adding numbers (e.g., `title-1`, `title-2`)
- **Invalid categoryId**: Check that the category exists before inserting
- **Missing required fields**: Always include title, slug, content, and categoryId
- **Text too long**: Keep title, slug, author, and image under 255 characters

### 5. **Quick Example**
```json
{
  "title": "10 Web Development Tips",
  "slug": "10-web-development-tips",
  "content": "<p>Here are the tips...</p>",
  "categoryId": "123e4567-e89b-12d3-a456-426614174000",
  "author": "AI Writer",
  "image": "https://example.com/image.jpg"
}
```

---
