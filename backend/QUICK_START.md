# Quick Start Guide: AI Article Generator

## 🚀 Quick Start (3 Steps)

### Step 1: Add Your OpenRouter API Key

Open `backend/.env` and add your OpenRouter API key:

```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

**Don't have an API key?** Get one at: https://openrouter.ai/keys

---

### Step 2: Add Your Article Titles

Edit `backend/article_titles.txt` and add your titles (one per line):

```
Your First Article Title Here
Your Second Article Title Here
Your Third Article Title Here
```

---

### Step 3: Run the Script

Open terminal in the `backend` folder and run:

```bash
node generate_articles_from_file.js
```

**That's it!** The script will:
- ✅ Generate SEO-optimized articles using AI
- ✅ Save them directly to your database
- ✅ Put them in the "news" category
- ✅ Show you progress in real-time

---

## 📋 Two Ways to Use

### Option 1: Using a Text File (Recommended)

1. Edit `article_titles.txt` with your titles
2. Run: `node generate_articles_from_file.js`

**Custom file?** Run: `node generate_articles_from_file.js my_titles.txt`

---

### Option 2: Edit the Script Directly

1. Open `generate_articles.js`
2. Find the `articleTitles` array
3. Replace with your titles:
   ```javascript
   const articleTitles = [
     "Your Title 1",
     "Your Title 2",
   ];
   ```
4. Run: `node generate_articles.js`

---

## ⚙️ What Gets Generated

Each article includes:

- ✅ **800-1200 words** of quality content
- ✅ **SEO optimized** with natural keywords
- ✅ **Proper HTML formatting** (h2, h3, p, ul, li tags)
- ✅ **Engaging structure** (intro, body, conclusion)
- ✅ **Unique URL slug** (auto-generated)
- ✅ **Saved in "news" category**

---

## 💰 Cost

Using DeepSeek v3.1 (free model on OpenRouter):
- **Cost per article**: FREE! 🎉
- **10 articles**: FREE!
- **100 articles**: FREE!
- **Unlimited**: FREE!

*Note: The model is completely free through OpenRouter. No charges!*

---

## 🔧 Troubleshooting

### "OPENROUTER_API_KEY is not set"
➡️ Add your OpenRouter API key to `.env` file

### "news category not found"
➡️ Create the news category in your database first

### "Rate limit exceeded"
➡️ Wait a few minutes or increase the delay in the script

### "File not found"
➡️ Make sure you're running the command from the `backend` folder

---

## 📖 Need More Help?

See the full documentation: `ARTICLE_GENERATOR_README.md`

---

## 🎯 Example Output

```
🚀 Starting article generation process...

✅ Found News category (ID: abc-123-def)

📝 Processing article 1/3: "Breaking Tech News"
   ⏳ Generating content with OpenAI...
   ✅ Content generated (4523 characters)
   ⏳ Saving to database...
   ✅ Saved successfully!
      - ID: xyz-789-abc
      - Slug: breaking-tech-news

============================================================
📊 GENERATION SUMMARY
============================================================
✅ Successful: 3
❌ Failed: 0
📈 Total: 3

✨ Process completed!
```

---

**Ready to generate articles?** Just add your API key and run the script! 🚀
