import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../../config/api';
import PageMeta from '../../components/PageMeta';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/blog`);
        // API returns { posts: [...], total, page, pages } — extract the posts array
        const postsData = res.data.data.posts || res.data.data;
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (err) {
        console.error('Failed to fetch blog posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categories = [...new Set(posts.map(p => p.category))].filter(Boolean);

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(p => p.category === filter);

  return (
    <div className="bg-white min-h-screen">
      <PageMeta 
        title="Blog & Insights" 
        description="Insights, technical deep-dives, and perspectives on software engineering, AI, and cloud architecture from our team of experts." 
        url={"https://boostrnetwave.com" + window.location.pathname}
      />
      {/* ===== PAGE HEADER ===== */}
      <section id="page-header" className="pt-40 pb-24 bg-soft border-b border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="reveal visible">
            <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Engineering Insights</span>
            <h1 className="font-display font-black text-ink tracking-tighter leading-[0.9] mt-4 text-[clamp(2.8rem,5vw,5rem)]">
              The Boostr<br/>Netwave Blog.
            </h1>
            <p className="reveal visible stagger-1 text-xl text-muted leading-relaxed max-w-2xl mt-6">
              Insights, technical deep-dives, and perspectives on software engineering, AI, and cloud architecture from our team of experts.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FILTER BAR ===== */}
      <section id="filter-bar" className="py-8 bg-white border-b border-border sticky top-20 z-40">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 flex flex-wrap gap-3">
          <button 
            onClick={() => setFilter('all')}
            className={`filter-pill px-5 py-2.5 rounded-full text-sm font-bold border transition-colors ${filter === 'all' ? 'bg-blue text-white border-blue' : 'border-border text-ink hover:border-blue'}`}
          >
            All Articles
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`filter-pill px-5 py-2.5 rounded-full text-sm font-bold border transition-colors ${filter === cat ? 'bg-blue text-white border-blue' : 'border-border text-ink hover:border-blue'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ===== POSTS GRID ===== */}
      <section id="posts-grid" className="py-32 bg-white">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin"/></div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center text-ink text-xl py-20">No articles published yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <Link to={`/blog/${post.slug}`} key={post._id} className={`service-card block bg-soft rounded-[28px] overflow-hidden reveal visible stagger-${(index % 3) + 1} border border-border hover:-translate-y-2 hover:border-blue hover:shadow-[0_30px_60px_rgba(0,82,255,0.1),_0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-500`}>
                  <div className="img-zoom-wrap h-56 overflow-hidden">
                    <img className="img-zoom w-full h-full object-cover transition-transform duration-900 hover:scale-[1.06]" src={post.coverImage || "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_1472fbbb85_f2d505479c03d73c.png"} alt={post.imageAlt || post.title} />
                  </div>
                  <div className="p-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue px-3 py-1 bg-blue-pale rounded-full">{post.category || 'Article'}</span>
                    <h4 className="font-black text-xl text-ink mt-5 mb-3 leading-snug line-clamp-2 break-words">{post.title}</h4>
                    <p className="text-sm text-muted leading-relaxed mb-6 line-clamp-3 break-words">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-blue text-sm font-bold service-arrow transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-1">
                      Read Article <i className="fa-solid fa-arrow-right text-xs"></i>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
