import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NotFound from '../../components/NotFound';
import PageMeta from '../../components/PageMeta';
import StructuredData from '../../components/StructuredData';
import API_BASE from '../../config/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const preview = urlParams.get('preview');
        
        const res = await axios.get(`${API_BASE}/blog/${slug}${preview ? '?preview=1' : ''}`, { withCredentials: true });
        setPost(res.data.data);
        
        // Fetch related separately or just fetch all for related
        const allRes = await axios.get(`${API_BASE}/blog`);
        const allPosts = allRes.data.data.posts || allRes.data.data;
        setRelated(allPosts.filter(p => p._id !== res.data.data._id && p.isPublished).slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch blog post', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin"/></div>;
  if (!post) return <NotFound message="Article not found." />;

  return (
    <div className="bg-white min-h-screen">
      <PageMeta 
        title={post.seoTitle || post.title} 
        description={post.seoDescription || post.excerpt} 
        image={post.coverImage}
      />
      <StructuredData 
        schemaType="Article"
        data={{
          headline: post.seoTitle || post.title,
          image: [post.coverImage || "https://boostrnetwave.com/images/og-default.jpg"],
          datePublished: post.publishedAt || post.createdAt,
          dateModified: post.updatedAt,
          author: {
            "@type": "Person",
            name: post.author || "Boostr Netwave Team"
          },
          publisher: {
            "@type": "Organization",
            name: "Boostr Netwave Solutions Pvt Ltd",
            logo: {
              "@type": "ImageObject",
              url: "https://boostrnetwave.com/logo.png"
            }
          },
          description: post.seoDescription || post.excerpt
        }}
      />
      {/* ===== ARTICLE HEADER ===== */}
      <section id="article-header" className="pt-40 pb-16 bg-soft border-b border-border">
        <div className="max-w-[840px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-2 text-sm text-muted mb-8 reveal visible">
            <Link to="/blog" className="hover:text-blue transition-colors">Blog</Link>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span className="text-ink font-semibold">{post.category || 'Article'}</span>
          </div>
          {post.category && (
            <span className="reveal visible stagger-1 text-xs font-bold uppercase tracking-widest text-blue px-3 py-1 bg-blue-pale rounded-full inline-block">
              {post.category}
            </span>
          )}
          <h1 className="reveal visible stagger-1 font-display font-black text-ink tracking-tighter leading-[1.05] mt-6 text-[clamp(2.2rem,4vw,3.4rem)] break-words">
            {post.title}
          </h1>
          <div className="reveal visible stagger-2 flex items-center gap-4 mt-8">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-pale">
              <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="author" />
            </div>
            <div>
              <p className="font-black text-ink text-sm">{post.author || 'Boostr Netwave Team'}</p>
              <p className="text-xs text-muted font-semibold uppercase tracking-widest">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Draft'} · {post.readTime} min read
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COVER IMAGE ===== */}
      {post.coverImage && (
        <section id="cover-image" className="py-16 bg-white">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 reveal visible img-zoom-wrap rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,82,255,0.12)]">
            <img className="img-zoom w-full h-[440px] object-cover transition-transform duration-900 hover:scale-[1.06]" src={post.coverImage} alt={post.title} />
          </div>
        </section>
      )}

      {/* ===== ARTICLE BODY ===== */}
      <section id="article-body" className={`bg-white ${post.coverImage ? 'pb-32' : 'py-32'}`}>
        <div 
          className="max-w-[760px] mx-auto px-6 md:px-10 article-body text-lg text-ink/80 leading-relaxed reveal visible"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>

      {/* ===== RELATED POSTS ===== */}
      {related.length > 0 && (
        <section id="related-posts" className="py-32 bg-soft border-t border-border">
          <div className="max-w-[1360px] mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="reveal visible">
                <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Keep Reading</span>
                <h2 className="font-display font-black text-ink tracking-tighter leading-[0.9] mt-4 text-[clamp(2rem,3.5vw,2.8rem)]">Related Articles.</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel, i) => (
                <Link to={`/blog/${rel.slug}`} key={rel._id} className={`service-card block bg-white rounded-[28px] overflow-hidden reveal visible stagger-${(i % 3) + 1} border border-border hover:-translate-y-2 hover:border-blue hover:shadow-[0_30px_60px_rgba(0,82,255,0.1),_0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-500`}>
                  <div className="img-zoom-wrap h-44 overflow-hidden">
                    <img className="img-zoom w-full h-full object-cover transition-transform duration-900 hover:scale-[1.06]" src={rel.coverImage || "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_1472fbbb85_f2d505479c03d73c.png"} alt={rel.title} />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue px-3 py-1 bg-blue-pale rounded-full">{rel.category}</span>
                    <h4 className="font-black text-base text-ink mt-3">{rel.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
