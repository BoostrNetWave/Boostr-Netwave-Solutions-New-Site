import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../../config/api';

export default function CaseStudies() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE}/client-projects`);
        setProjects(res.data.data);
      } catch (err) {
        console.error('Failed to fetch case studies', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = [...new Set(projects.map(p => p.category))];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="bg-white min-h-screen">
      {/* ===== PAGE HEADER ===== */}
      <section id="page-header" className="pt-40 pb-24 bg-soft border-b border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="reveal">
            <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Our Work</span>
            <h1 className="font-display font-black text-ink tracking-tighter leading-[0.9] mt-4 text-[clamp(2.8rem,5vw,5rem)]">
              Engineering<br/>That Delivers.
            </h1>
            <p className="reveal stagger-1 text-xl text-muted leading-relaxed max-w-2xl mt-6">
              Explore how we've helped enterprises scale, modernize, and transform their digital infrastructure.
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
            All Work
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

      {/* ===== CASE STUDIES GRID ===== */}
      <section id="case-studies-grid" className="py-40 bg-soft">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin"/></div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center text-ink text-xl py-20">No projects found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project, index) => (
                <Link to={`/case-studies/${project.slug}`} key={project._id} className={`service-card block bg-white rounded-[28px] overflow-hidden reveal block stagger-${(index % 4) + 1} border border-border hover:-translate-y-2 hover:border-blue hover:shadow-[0_30px_60px_rgba(0,82,255,0.1),_0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-500`}>
                  <div className="img-zoom-wrap h-64 overflow-hidden">
                    <img className="img-zoom w-full h-full object-cover transition-transform duration-900 hover:scale-[1.06]" src={project.image || "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_4456573a0b_241e79a61f2eacd3.png"} alt={project.title} />
                  </div>
                  <div className="p-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue px-3 py-1 bg-blue-pale rounded-full">{project.category}</span>
                    <h4 className="font-black text-2xl text-ink mt-5 mb-3">{project.title}</h4>
                    <p className="text-sm text-muted leading-relaxed mb-6">{project.description}</p>
                    <div className="flex items-center gap-2 text-blue text-sm font-bold service-arrow transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-1">
                      Read Case Study <i className="fa-solid fa-arrow-right text-xs"></i>
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
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-blue">Ready to Start?</span>
          <h2 className="font-display font-black text-white tracking-tighter leading-[0.95] mt-4 mx-auto max-w-3xl text-[clamp(2.2rem,4vw,3.5rem)]">
            Let's build your next success story.
          </h2>
          <Link to="/contact" className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-9 py-4 rounded-xl font-bold text-base hover:bg-blue-light transition-all mt-10 hover:shadow-[0_20px_40px_rgba(0,82,255,0.3)] hover:-translate-y-1">
            Contact Us Today
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
