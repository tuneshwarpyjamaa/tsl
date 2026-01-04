# AI Article Generator Script

This script automatically generates SEO-optimized articles using OpenRouter's API (supporting multiple AI models including GPT-4o-mini) and stores them directly in your database under the "news" category.

## Prerequisites

1. **OpenRouter API Key**: You must have a valid OpenRouter API key
2. **Database**: Your database must be running and accessible
3. **News Category**: The "news" category must exist in your database

## Setup

### 1. Add Your OpenRouter API Key

Open the `.env` file in the backend directory and add your OpenRouter API key:

```env
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

### 2. Verify Database Connection

Make sure your `DATABASE_URL` in `.env` is correct:

```env
DATABASE_URL=postgresql://postgres.euovankvxwzohwkpxrpw:LVzpmjh0VA8wMer1@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

### 3. Ensure News Category Exists

The script requires a "news" category in your database. If it doesn't exist, create it first using your admin panel or run:

```sql
INSERT INTO categories (name, slug) VALUES ('News', 'news');
```

## Usage

### Method 1: Edit the Script Directly

1. Open `generate_articles.js`
2. Find the `articleTitles` array at the bottom of the file
3. Replace the example titles with your own:

```javascript
const articleTitles = [
  "Your First Article Title",
  "Your Second Article Title",
  "Your Third Article Title",
  // Add as many as you want
];
```

4. Run the script:

```bash
node generate_articles.js
```

### Method 2: Create a Custom Titles File

1. Create a file called `article_titles.txt` with one title per line:

```
Breaking: Major Tech Company Announces Revolutionary AI Product
Climate Change Summit Reaches Historic Agreement
New Study Reveals Surprising Health Benefits
```

2. Modify the script to read from this file (see example below)

### Method 3: Pass Titles as Command Line Arguments

You can modify the script to accept titles from command line arguments.

## Features

✅ **SEO Optimized**: Articles are generated with SEO best practices
✅ **Proper HTML Formatting**: Uses proper HTML tags (h2, h3, p, ul, li)
✅ **Unique Slugs**: Automatically generates unique URL-friendly slugs
✅ **Error Handling**: Continues processing even if some articles fail
✅ **Progress Tracking**: Shows detailed progress for each article
✅ **Rate Limiting**: Includes delays to avoid API rate limits
✅ **Summary Report**: Provides a detailed summary at the end

## Article Specifications

Each generated article includes:

- **Length**: 800-1200 words
- **Format**: HTML with proper semantic tags
- **Structure**: Introduction, body with subheadings, conclusion
- **Style**: Engaging, journalistic, informative
- **SEO**: Natural keyword integration
- **Author**: Set to "AI Writer" (can be customized)

## Database Fields

The script populates the following fields:

| Field | Description | Required |
|-------|-------------|----------|
| `title` | Article headline | ✅ Yes |
| `slug` | URL-friendly version (auto-generated) | ✅ Yes |
| `content` | Full article HTML | ✅ Yes |
| `categoryId` | News category UUID | ✅ Yes |
| `author` | Set to "AI Writer" | No (has default) |
| `image` | Currently null (can be added) | No |

## Cost Estimation

Using GPT-4o-mini (recommended for cost efficiency):

- **Cost per article**: ~$0.01 - $0.03 USD
- **10 articles**: ~$0.10 - $0.30 USD
- **100 articles**: ~$1.00 - $3.00 USD

*Note: Actual costs may vary based on article length and API pricing*

## Troubleshooting

### Error: "OPENAI_API_KEY is not set"
- Make sure you've added your API key to the `.env` file
- Restart the script after adding the key

### Error: "news category not found"
- Create the news category in your database first
- Or modify the script to use a different category slug

### Error: "Duplicate slug"
- The script automatically handles this by adding numbers (e.g., title-1, title-2)
- If you still see this error, there might be a database issue

### Error: "OpenAI API error"
- Check that your API key is valid
- Ensure you have credits in your OpenAI account
- Check your internet connection

### Rate Limiting
- The script includes a 2-second delay between articles
- If you hit rate limits, increase the delay in the code

## Customization

### Change the AI Model

In `generate_articles.js`, find this line:

```javascript
model: 'gpt-4o-mini', // Using GPT-4o-mini for cost efficiency
```

You can change it to:
- `gpt-4o` - More powerful, more expensive
- `gpt-3.5-turbo` - Faster, cheaper, less sophisticated

### Adjust Article Length

Modify the prompt to specify different word counts:

```javascript
const prompt = `... Write 1500-2000 words ...`; // Instead of 800-1200
```

### Change Author Name

Find this line:

```javascript
author: 'AI Writer',
```

Change it to:

```javascript
author: 'Your Name',
```

### Add Image Generation

You can integrate with DALL-E or other image APIs to generate featured images:

```javascript
// Add after content generation
const imageUrl = await generateImageWithDALLE(title);

// Then in saveArticleToDatabase:
image: imageUrl
```

## Example Output

```
🚀 Starting article generation process...

✅ Found News category (ID: 123e4567-e89b-12d3-a456-426614174000)

📝 Processing article 1/5: "Breaking: Major Tech Company Announces Revolutionary AI Product"
   ⏳ Generating content with OpenAI...
   ✅ Content generated (4523 characters)
   ⏳ Saving to database...
   ✅ Saved successfully!
      - ID: 987f6543-e21b-12d3-a456-426614174000
      - Slug: breaking-major-tech-company-announces-revolutionary-ai-product
   ⏸️  Waiting 2 seconds before next article...

============================================================
📊 GENERATION SUMMARY
============================================================
✅ Successful: 5
❌ Failed: 0
📈 Total: 5

✅ Successfully generated articles:
   1. Breaking: Major Tech Company Announces Revolutionary AI Product
      Slug: breaking-major-tech-company-announces-revolutionary-ai-product

✨ Process completed!
```

## Advanced: Reading Titles from File

Add this function to read titles from a text file:

```javascript
import fs from 'fs';

function readTitlesFromFile(filename) {
  const content = fs.readFileSync(filename, 'utf-8');
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

// Usage
const articleTitles = readTitlesFromFile('article_titles.txt');
```

## Support

If you encounter any issues:

1. Check the error messages - they're designed to be helpful
2. Verify your `.env` file has all required variables
3. Ensure your database is accessible
4. Check your OpenAI account has available credits

## License

This script is part of your tmw_blog project.
