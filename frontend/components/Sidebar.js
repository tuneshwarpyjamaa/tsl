// components/Sidebar.js
import { useState, useEffect } from 'react';
import api from '@/services/api';
import PostCard from './PostCard';

const Sidebar = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await api.get('/posts/trending');
        setTrendingPosts(data);
      } catch (e) {
        console.error('Failed to load trending posts:', e);
      }
    };
    fetchTrending();
  }, []);

  return (
    <aside className="col-span-12 md:col-span-4">
      <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2">Subscribe to our newsletter</h3>
        <p className="text-sm text-gray-600 mb-3">Get the latest news delivered to your inbox</p>
        <div className="flex">
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-r hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      {trendingPosts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Trending</h3>
          <ul className="space-y-4">
            {trendingPosts.map((p, index) => (
              <li key={p.slug || index} className="border-b border-gray-100 pb-2">
                <PostCard post={p} variant="compact" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
