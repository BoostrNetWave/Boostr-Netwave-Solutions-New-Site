import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NotFound from '../../components/NotFound';
import PageMeta from '../../components/PageMeta';
import API_BASE from '../../config/api';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products`);
        const allProducts = res.data.data;
        const found = allProducts.find(p => p.slug === slug);
        setProduct(found);
      } catch (err) {
        console.error('Failed to fetch product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin"/></div>;
  if (!product) return <NotFound message="Product not found." />;

  return (
    <div className="bg-white min-h-screen">
      <PageMeta 
        title={product.seoTitle || product.title} 
        description={product.seoDescription || product.excerpt} 
        image={product.heroImage || product.coverImage}
      />
      {/* ===== HERO SECTION ===== */}
      <section className="pt-40 pb-20 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,82,255,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(51,116,255,0.06) 0%, transparent 60%)' }}></div>
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/50 mb-8 reveal visible">
            <Link to="/products" className="hover:text-blue transition-colors">Products</Link>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span className="text-white font-semibold">{product.title}</span>
          </div>
          <h1 className="reveal visible stagger-1 font-display font-black text-white tracking-tighter leading-[0.95] text-[clamp(3rem,6vw,5.5rem)]">
            {product.title}
          </h1>
          <p className="reveal visible stagger-2 text-xl text-white/70 leading-relaxed mt-6 max-w-2xl mx-auto">
            {product.excerpt}
          </p>
          <div className="reveal visible stagger-3 mt-10">
            <Link to="/contact" className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-9 py-4 rounded-xl font-bold text-base hover:bg-blue-light transition-all shadow-[0_20px_40px_rgba(0,82,255,0.2)] hover:shadow-[0_20px_40px_rgba(0,82,255,0.4)] hover:-translate-y-1">
              Request Demo <i className="fa-solid fa-arrow-right text-sm"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT IMAGES ===== */}
      <section className="py-20 bg-soft border-b border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="reveal visible img-zoom-wrap rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,82,255,0.12)]">
            <img className="img-zoom w-full h-[500px] object-cover transition-transform duration-900 hover:scale-[1.06]" src={product.heroImage || product.coverImage || "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_4456573a0b_241e79a61f2eacd3.png"} alt={product.title} />
          </div>
        </div>
      </section>

      {/* ===== OVERVIEW & FEATURES ===== */}
      <section className="py-32 bg-white">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-8 reveal visible">
            <div>
              <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Overview</span>
              <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] mt-4 text-3xl">About {product.title}</h2>
            </div>
            <div 
              className="article-body text-lg text-ink/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
          
          <div className="lg:col-span-6 lg:col-offset-1 space-y-8 reveal visible stagger-1">
            <div>
              <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Capabilities</span>
              <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] mt-4 text-3xl">Key Features</h2>
            </div>
            {product.features && product.features.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {product.features.map((feature, i) => (
                  <div key={i} className="p-6 bg-soft border border-border rounded-2xl">
                    <div className="w-10 h-10 bg-blue-pale rounded-lg flex items-center justify-center mb-4">
                      <i className="fa-solid fa-bolt text-blue"></i>
                    </div>
                    <p className="font-bold text-ink">{feature}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No specific features listed for this product.</p>
            )}

            {product.techStack && product.techStack.length > 0 && (
              <div className="pt-10">
                <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Under the Hood</span>
                <div className="flex flex-wrap gap-2 pt-4">
                  {product.techStack.map(tech => (
                    <span key={tech} className="text-sm font-bold text-ink px-4 py-2 bg-soft border border-border rounded-xl">{tech}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== CTA STRIP ===== */}
      <section className="py-32 bg-soft border-t border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 text-center">
          <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Ready to Upgrade?</span>
          <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] mt-4 mx-auto max-w-2xl text-[clamp(2.2rem,4vw,3.2rem)]">
            Experience the power of {product.title}.
          </h2>
          <Link to="/contact" className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-9 py-4 rounded-xl font-bold text-base hover:bg-blue-light transition-all mt-10 hover:shadow-[0_20px_40px_rgba(0,82,255,0.3)] hover:-translate-y-1">
            Book a Consultation <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
