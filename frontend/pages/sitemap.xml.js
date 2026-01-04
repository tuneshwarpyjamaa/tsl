import api from '@/services/api';

const SITE_URL = 'https://thesouthline.in';

const staticPages = [
  'about',
  'careers',
  'contact',
  'privacy',
  'terms'
];

function generateSiteMap(posts, categories) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${SITE_URL}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     ${staticPages
      .map((page) => {
        return `
       <url>
           <loc>${SITE_URL}/${page}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.5</priority>
       </url>
     `;
      })
      .join('')}
     ${categories
      .map(({ slug }) => {
        return `
       <url>
           <loc>${SITE_URL}/category/${slug}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
      })
      .join('')}
     ${posts
      .map(({ slug, createdAt }) => {
        return `
        <url>
            <loc>${SITE_URL}/post/${slug}</loc>
            <lastmod>${new Date(createdAt).toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.6</priority>
        </url>
     `;
      })
      .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  try {
    const [postsRes, categoriesRes] = await Promise.all([
      api.get('/api/posts'),
      api.get('/api/categories')
    ]);

    const posts = postsRes.data || [];
    const categories = categoriesRes.data || [];

    const sitemap = generateSiteMap(posts, categories);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.statusCode = 500;
    res.end();
    return {
      props: {},
    };
  }
}

export default SiteMap;
