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
