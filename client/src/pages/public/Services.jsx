import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../../config/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE}/services`);
        setServices(res.data.data);
      } catch (err) {
        console.error('Failed to fetch services', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const getIconForSlug = (slug) => {
    if (slug.includes('software') || slug.includes('engineer')) return 'fa-code';
    if (slug.includes('ai') || slug.includes('data')) return 'fa-brain';
    if (slug.includes('cloud') || slug.includes('infra')) return 'fa-cloud-bolt';
    if (slug.includes('design') || slug.includes('ux')) return 'fa-pen-nib';
    return 'fa-rocket';
  };

  const getCategoryForSlug = (slug) => {
    if (slug.includes('software') || slug.includes('engineer')) return 'engineering';
    if (slug.includes('ai') || slug.includes('data')) return 'ai';
    if (slug.includes('cloud') || slug.includes('infra')) return 'infra';
    if (slug.includes('design') || slug.includes('ux')) return 'design';
    return 'engineering';
  };

  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(s => getCategoryForSlug(s.slug) === filter);

  return (
    <div className="bg-white min-h-screen">
      {/* ===== PAGE HEADER ===== */}
      <section id="page-header" className="pt-40 pb-24 bg-soft border-b border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="reveal">
            <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">What We Do</span>
            <h1 className="font-display font-black text-ink tracking-tighter leading-[0.9] mt-4 text-[clamp(2.8rem,5vw,5rem)]">
              Every Discipline.<br/>One Engineering Partner.
            </h1>
            <p className="reveal stagger-1 text-xl text-muted leading-relaxed max-w-2xl mt-6">
              From software engineering to AI, cloud infrastructure to enterprise transformation — Boostr Netwave covers every layer of the modern technology stack, end to end.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FILTER BAR ===== */}
      <section id="filter-bar" className="py-8 bg-white border-b border-border sticky top-20 z-40">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 flex flex-wrap gap-3">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'engineering', label: 'Engineering' },
            { id: 'ai', label: 'AI & Data' },
            { id: 'infra', label: 'Cloud & Infra' },
            { id: 'design', label: 'Design & Strategy' },
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`filter-pill px-5 py-2.5 rounded-full text-sm font-bold border transition-colors ${filter === f.id ? 'bg-blue text-white border-blue' : 'border-border text-ink hover:border-blue'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section id="services-grid" className="py-40 bg-soft">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin"/></div>
          ) : (
            <div id="services-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredServices.map((service, index) => (
                <Link to={`/services/${service.slug}`} key={service._id} className={`service-item service-card bg-white rounded-[28px] overflow-hidden cursor-pointer reveal block stagger-${(index % 4) + 1} border border-border hover:-translate-y-2 hover:border-blue hover:shadow-[0_30px_60px_rgba(0,82,255,0.1),_0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-500`}>
                  <div className="img-zoom-wrap h-44 overflow-hidden">
                    <img className="img-zoom w-full h-full object-cover transition-transform duration-900 hover:scale-[1.06]" src={service.image || "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_f76e359734_29cb655b3f919165.png"} alt={service.title} />
                  </div>
                  <div className="p-8">
                    <div className="service-icon-wrap w-12 h-12 bg-blue-pale rounded-xl flex items-center justify-center mb-5 transition-colors duration-400 group-hover:bg-blue">
                      <i className={`fa-solid ${getIconForSlug(service.slug)} text-blue text-lg transition-colors duration-400 group-hover:text-white`}></i>
                    </div>
                    <h4 className="font-bold text-xl text-ink mb-3">{service.title}</h4>
                    <p className="text-sm text-muted leading-relaxed mb-5">{service.excerpt}</p>
                    <div className="flex items-center gap-2 text-blue text-sm font-bold service-arrow transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-1">
                      Explore <i className="fa-solid fa-arrow-up-right text-xs"></i>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA STRIP ===== */}
      <section id="services-cta" className="py-32 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,82,255,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(51,116,255,0.06) 0%, transparent 60%)' }}></div>
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 relative z-10 text-center">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-blue">Not Sure Where to Start?</span>
          <h2 className="font-display font-black text-white tracking-tighter leading-[0.95] mt-4 mx-auto max-w-3xl text-[clamp(2.2rem,4vw,3.5rem)]">
            Tell us your challenge. We'll map the right engineering path.
          </h2>
          <Link to="/contact" className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-9 py-4 rounded-xl font-bold text-base hover:bg-[#3374FF] transition-all mt-10 hover:shadow-[0_20px_40px_rgba(0,82,255,0.3)] hover:-translate-y-1">
            Start a Conversation
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
