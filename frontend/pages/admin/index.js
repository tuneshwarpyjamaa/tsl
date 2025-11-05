import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api, { setAuthToken, getUserRole } from '@/services/api';

export default function AdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postData, setPostData] = useState({
    title: '',
    slug: '',
    content: '',
    categorySlug: '',
    author: 'Admin',
    image: ''
  });
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfCategory, setPdfCategory] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [pdfSuccess, setPdfSuccess] = useState('');
  
  // Article generation state
  const [articleQuery, setArticleQuery] = useState('Bihar Election 2025');
  const [articleCount, setArticleCount] = useState(3); // Default to 3 articles
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticles, setGeneratedArticles] = useState([]);
  const [generationError, setGenerationError] = useState('');
  
  // Available categories
  const categoriesList = [
    { id: '1f44d1ed-1ad6-4eb7-bd23-fc09e27a3535', name: 'Technology', slug: 'technology' },
    { id: '3ed49a33-6286-4cb8-9001-efa0585b6a22', name: 'Travel', slug: 'travel' },
    { id: '4cd9be42-3e8d-46d1-ba1e-9defd97d4a49', name: 'Culture', slug: 'culture' },
    { id: '573d331c-3b63-4bcb-a725-d90d8237c9bf', name: 'News', slug: 'news' },
    { id: '573f87c1-f932-42b8-81fb-d16e8054cb03', name: 'Sports', slug: 'sports' },
    { id: '6fb11e34-2b60-48b0-8197-62386f3f8bed', name: 'Arts', slug: 'arts' },
    { id: '967aef98-0bad-43ee-90b6-1ed27ca1786a', name: 'Sport', slug: 'sport' },
    { id: 'a950eb49-29d9-408b-8eba-ef71de8d2ced', name: 'Earth', slug: 'earth' },
    { id: 'cf2bc611-e091-4d8f-ad91-bf65fdc610ff', name: 'Business', slug: 'business' },
    { id: 'e107837a-f9dd-4fc5-af5e-bc92df59b4ec', name: 'Innovation', slug: 'innovation' }
  ];
  
  // Set default category
  useEffect(() => {
    if (categoriesList.length > 0 && !selectedCategory) {
      setSelectedCategory(categoriesList[0].slug);
    }
  }, []);

  async function generateArticles(e) {
    e.preventDefault();
    if (!articleQuery.trim()) {
      setGenerationError('Please enter a search query');
      return;
    }
    
    setIsGenerating(true);
    setGenerationError('');
    setGeneratedArticles([]);
    
    try {
      const { data } = await api.post('/posts/generate', { query: articleQuery });
      if (data.articles && data.articles.length > 0) {
        setGeneratedArticles(data.articles);
        setPostSuccess(`${data.articles.length} articles generated successfully!`);
      } else {
        setGenerationError('No articles were generated. Please try a different query.');
      }
    } catch (error) {
      console.error('Error generating articles:', error);
      setGenerationError(error.response?.data?.error || 'Failed to generate articles');
    } finally {
      setIsGenerating(false);
    }
  }

  async function saveGeneratedArticle(article) {
    try {
      setPostLoading(true);
      setPostError('');
      setPostSuccess('');
      
      // Create a slug from the title
      const slug = article.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 200);
      
      // Use the first category or a default one
      const categorySlug = categories.length > 0 ? categories[0].slug : 'politics';
      
      await api.post('/posts', {
        title: article.title,
        slug,
        content: article.content,
        categorySlug,
        author: 'AI Writer',
        image: article.image || ''
      });
      
      setPostSuccess('Article saved successfully!');
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error saving article:', error);
      setPostError(error.response?.data?.error || 'Failed to save article');
    } finally {
      setPostLoading(false);
    }
  }

  async function generateArticles(e) {
    e.preventDefault();
    if (!articleQuery.trim()) {
      setGenerationError('Please enter a search query');
      return;
    }
    
    setIsGenerating(true);
    setGenerationError('');
    setGeneratedArticles([]);
    
    try {
      const { data } = await api.post('/posts/generate', { query: articleQuery });
      if (data.articles && data.articles.length > 0) {
        setGeneratedArticles(data.articles);
        setPostSuccess(`${data.articles.length} articles generated successfully!`);
      } else {
        setGenerationError('No articles were generated. Please try a different query.');
      }
    } catch (error) {
      console.error('Error generating articles:', error);
      setGenerationError(error.response?.data?.error || 'Failed to generate articles');
    } finally {
      setIsGenerating(false);
    }
  }

  async function saveGeneratedArticle(article) {
    try {
      setPostLoading(true);
      setPostError('');
      setPostSuccess('');
      
      // Create a slug from the title
      const slug = article.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 200);
      
      // Use the first category or a default one
      const categorySlug = categories.length > 0 ? categories[0].slug : 'politics';
      
      await api.post('/posts', {
        title: article.title,
        slug,
        content: article.content,
        categorySlug,
        author: 'AI Writer',
        image: article.image || ''
      });
      
      setPostSuccess('Article saved successfully!');
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error saving article:', error);
      setPostError(error.response?.data?.error || 'Failed to save article');
    } finally {
      setPostLoading(false);
    }
  }

  async function onPdfUpload(e) {
    e.preventDefault();
    if (!pdfFile || !pdfCategory) {
      setPdfError('Please select a file and a category');
      return;
    }
    setPdfLoading(true);
    setPdfError('');
    setPdfSuccess('');
    try {
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('categorySlug', pdfCategory);
      await api.post('/posts/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPdfSuccess('PDF uploaded and posts created successfully!');
      fetchPosts(); // Refresh posts list
    } catch (e) {
      setPdfError('Failed to upload PDF');
    } finally {
      setPdfLoading(false);
    }
  }

  useEffect(() => {
    const role = getUserRole();
    if (role && String(role).toLowerCase() === 'admin') {
      setAuthorized(true);
      setIsLoggedIn(true);
    } else {
      setAuthorized(false);
    }
    setCheckingAuth(false);
  }, [router]);

  async function fetchCategories() {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  }

  async function fetchPosts() {
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (e) {
      console.error('Failed to fetch posts:', e);
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuthToken(data.token);
      setIsLoggedIn(true);
      setSuccess('Logged in successfully. You can now create posts.');
      console.log('Login successful, isLoggedIn set to true');
    } catch (e) {
      setError('Login failed');
      console.error('Login error:', e);
    } finally {
      setLoading(false);
    }
  }

  async function onPostSubmit(e) {
    e.preventDefault();
    setPostLoading(true);
    setPostError('');
    setPostSuccess('');
    try {
      await api.post('/posts', postData);
      setPostSuccess('Post created successfully!');
      setPostData({
        title: '',
        slug: '',
        content: '',
        categorySlug: '',
        author: 'Admin',
        image: ''
      });
      fetchPosts(); // Refresh posts list
    } catch (e) {
      setPostError('Failed to create post');
    } finally {
      setPostLoading(false);
    }
  }

  async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts(); // Refresh posts list
    } catch (e) {
      console.error('Failed to delete post:', e);
    }
  }

  const inputStyles = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
  const buttonStyles = "bg-black text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors";
  const labelStyles = "block text-sm font-semibold mb-1 text-gray-700";

  if (checkingAuth) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center py-12">
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center py-12">
          <p className="text-red-600">Access denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">Manage posts and content</p>
        </div>
        <a href="/admin/users" className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors">
          User Management
        </a>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Create Post Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Upload PDF</h2>
            <form onSubmit={onPdfUpload} className="space-y-3">
              <div>
                <label className={labelStyles}>PDF File</label>
                <input
                  type="file"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className={inputStyles}
                  accept=".pdf"
                />
              </div>
              <div>
                <label className={labelStyles}>Category</label>
                <select
                  className={inputStyles}
                  value={pdfCategory}
                  onChange={(e) => setPdfCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <button disabled={pdfLoading} className={`${buttonStyles} w-full py-2.5`}>
                {pdfLoading ? 'Uploading...' : 'Upload PDF'}
              </button>
            </form>
            {pdfError && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {pdfError}
              </div>
            )}
            {pdfSuccess && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                {pdfSuccess}
              </div>
            )}
          </div>
          {/* Article Generation Section */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Generate Articles with AI</h2>
            <form onSubmit={generateArticles} className="mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="article-query">
                  Search Query
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="article-query">
                        Search Query
                      </label>
                      <input
                        id="article-query"
                        type="text"
                        value={articleQuery}
                        onChange={(e) => setArticleQuery(e.target.value)}
                        className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter a topic or query"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="article-count">
                          Count
                        </label>
                        <input
                          id="article-count"
                          type="number"
                          min="1"
                          max="10"
                          value={articleCount}
                          onChange={(e) => setArticleCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-full text-center border rounded py-2 px-2 text-gray-700 focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="article-category">
                          Category
                        </label>
                        <select
                          id="article-category"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full border rounded py-2 px-2 text-gray-700 focus:outline-none focus:shadow-outline"
                        >
                          {categoriesList.map((category) => (
                            <option key={category.id} value={category.slug}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={isGenerating || !selectedCategory}
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline ${
                        isGenerating || !selectedCategory ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isGenerating ? 'Generating...' : `Generate ${articleCount} Article${articleCount > 1 ? 's' : ''}`}
                    </button>
                  </div>
                </div>
                {generationError && (
                  <p className="text-red-500 text-xs italic mt-1">{generationError}</p>
                )}
              </div>
            </form>

            {generatedArticles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Generated Articles</h3>
                <div className="space-y-4">
                  {generatedArticles.map((article, index) => (
                    <div key={index} className="border rounded p-4 bg-gray-50">
                      <h4 className="font-bold text-lg mb-2">{article.title}</h4>
                      <p className="text-gray-700 mb-3 line-clamp-3">
                        {article.content?.substring(0, 200)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {article.content ? Math.ceil(article.content.split(' ').length / 200) : 0} min read
                        </span>
                        <button
                          onClick={() => saveGeneratedArticle(article)}
                          disabled={postLoading}
                          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                        >
                          {postLoading ? 'Saving...' : 'Save Article'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Create New Post</h2>
          <form onSubmit={onPostSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyles}>Title</label>
                <input
                  className={inputStyles}
                  value={postData.title}
                  onChange={(e)=>setPostData({...postData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className={labelStyles}>Slug</label>
                <input
                  className={inputStyles}
                  value={postData.slug}
                  onChange={(e)=>setPostData({...postData, slug: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelStyles}>Content</label>
              <textarea
                className={`${inputStyles} h-32`}
                value={postData.content}
                onChange={(e)=>setPostData({...postData, content: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyles}>Category</label>
                <select
                  className={inputStyles}
                  value={postData.categorySlug}
                  onChange={(e)=>setPostData({...postData, categorySlug: e.target.value})}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyles}>Author</label>
                <input
                  className={inputStyles}
                  value={postData.author}
                  onChange={(e)=>setPostData({...postData, author: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className={labelStyles}>Image URL (optional)</label>
              <input
                className={inputStyles}
                value={postData.image}
                onChange={(e)=>setPostData({...postData, image: e.target.value})}
              />
            </div>

            <button disabled={postLoading} className={`${buttonStyles} w-full py-2.5`}>
              {postLoading ? 'Creating Post...' : 'Create Post'}
            </button>
          </form>

          {postError && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {postError}
            </div>
          )}
          {postSuccess && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {postSuccess}
            </div>
          )}
        </div>

        {/* Existing Posts */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
            <h2 className="text-lg font-bold">Existing Posts</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {posts.length} posts
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {posts.map(post => (
              <div key={post.id} className="border border-gray-200 rounded p-3 hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{post.title}</h3>
                    <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                      <span>Slug: {post.slug}</span>
                      <span>•</span>
                      <span>Category: {post.categoryId?.name || 'Uncategorized'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="ml-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No posts created yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}