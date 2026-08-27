import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../../config/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products`);
        setProducts(res.data.data.filter(p => p.isVisible));
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* ===== PAGE HEADER ===== */}
      <section id="page-header" className="pt-40 pb-24 bg-soft border-b border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="reveal visible max-w-3xl">
            <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Our Products</span>
            <h1 className="font-display font-black text-ink tracking-tighter leading-[0.9] mt-4 text-[clamp(2.8rem,5vw,5rem)]">
              Proprietary Tools.<br/>Unfair Advantage.
            </h1>
            <p className="reveal visible stagger-1 text-xl text-muted leading-relaxed mt-6">
              Beyond consulting, we build and maintain our own suite of enterprise SaaS and AI products used by hundreds of businesses globally.
            </p>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS LIST ===== */}
      <section id="products-list" className="py-32 bg-white">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 space-y-32">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin"/></div>
          ) : products.length === 0 ? (
            <div className="text-center text-ink text-xl py-20">No products found.</div>
          ) : (
            products.map((product, index) => (
              <div key={product._id} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal visible">
                <div className={`img-zoom-wrap rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,82,255,0.08)] ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <img className="img-zoom w-full h-[400px] object-cover transition-transform duration-900 hover:scale-[1.06]" src={product.coverImage || "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_1ffd08632a_bcd9165628f4605e.png"} alt={product.title} />
                </div>
                <div className={`space-y-6 ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                  <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] text-[clamp(2rem,3vw,2.8rem)]">
                    {product.title}
                  </h2>
                  <p className="text-lg text-muted leading-relaxed">{product.excerpt}</p>
                  
                  {product.techStack && product.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {product.techStack.map(tech => (
                        <span key={tech} className="text-xs font-bold uppercase tracking-widest text-ink px-3 py-1 bg-soft border border-border rounded-full">{tech}</span>
                      ))}
                    </div>
                  )}

                  <div className="pt-6">
                    <Link to={`/products/${product.slug}`} className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-blue-light transition-all shadow-[0_10px_20px_rgba(0,82,255,0.15)] hover:shadow-[0_20px_40px_rgba(0,82,255,0.3)] hover:-translate-y-1">
                      Explore {product.title} <i className="fa-solid fa-arrow-right text-xs"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ===== CTA STRIP ===== */}
      <section id="cta" className="py-32 bg-soft border-t border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 text-center">
          <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Partner With Us</span>
          <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] mt-4 mx-auto max-w-2xl text-[clamp(2.2rem,4vw,3.2rem)]">
            Want to integrate our products into your workflow?
          </h2>
          <Link to="/contact" className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-9 py-4 rounded-xl font-bold text-base hover:bg-blue-light transition-all mt-10 hover:shadow-[0_20px_40px_rgba(0,82,255,0.3)] hover:-translate-y-1">
            Let's Talk <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
