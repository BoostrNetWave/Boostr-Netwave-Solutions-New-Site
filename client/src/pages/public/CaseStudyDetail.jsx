import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NotFound from '../../components/NotFound';
import PageMeta from '../../components/PageMeta';
import API_BASE from '../../config/api';

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const preview = urlParams.get('preview');
        
        const res = await axios.get(`${API_BASE}/client-projects/${slug}${preview ? '?preview=1' : ''}`, { withCredentials: true });
        setProject(res.data.data);
        
        const allRes = await axios.get(`${API_BASE}/client-projects`);
        const allProjects = allRes.data.data;
        setRelated(allProjects.filter(p => p._id !== res.data.data._id).slice(0, 2));
      } catch (err) {
        console.error('Failed to fetch case study', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin"/></div>;
  if (!project) return <NotFound message="Case study not found." />;

  return (
    <div className="bg-white min-h-screen">
      <PageMeta 
        title={project.seoTitle || project.title} 
        description={project.seoDescription || project.description} 
        image={project.image}
      />
      {/* ===== CASE STUDY HEADER ===== */}
      <section id="case-header" className="pt-40 pb-20 bg-soft border-b border-border overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-2 text-sm text-muted mb-8 reveal visible">
            <Link to="/case-studies" className="hover:text-blue transition-colors">Case Studies</Link>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span className="text-ink font-semibold">{project.title}</span>
          </div>
          <div className="reveal visible stagger-1 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue px-3 py-1 bg-blue-pale rounded-full">{project.category}</span>
              {project.location && <span className="text-xs font-bold uppercase tracking-widest text-muted px-3 py-1 bg-border-soft rounded-full">{project.location}</span>}
            </div>
            <h1 className="font-display font-black text-ink tracking-tighter leading-[0.95] text-[clamp(2.6rem,4.5vw,4.2rem)]">
              {project.title}
            </h1>
            <p className="text-xl text-muted leading-relaxed mt-6">{project.description}</p>
          </div>
          <div className="reveal-right visible img-zoom-wrap rounded-[40px] overflow-hidden mt-16 shadow-[0_40px_100px_rgba(0,82,255,0.12)]">
            <img className="img-zoom w-full h-[440px] object-cover transition-transform duration-900 hover:scale-[1.06]" src={project.image || "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_4456573a0b_241e79a61f2eacd3.png"} alt={project.title} />
          </div>
        </div>
      </section>

      {/* ===== PROBLEM / APPROACH / RESULT ===== */}
      <section id="problem-approach-result" className="py-40 bg-soft">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 space-y-24">
          
          {project.challenge && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal visible">
              <div className="space-y-6">
                <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">The Problem</span>
                <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] text-[clamp(2rem,3vw,2.8rem)]">A platform outgrowing its architecture.</h2>
                <p className="text-lg text-muted leading-relaxed">{project.challenge}</p>
              </div>
              <div className="img-zoom-wrap rounded-[32px] overflow-hidden shadow-lg">
                <img className="img-zoom w-full h-[320px] object-cover transition-transform duration-900 hover:scale-[1.06]" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_fb319bc800_fe862dad985f1b2b.png" alt="Stressed engineering team" />
              </div>
            </div>
          )}

          {project.solution && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal visible">
              <div className="img-zoom-wrap rounded-[32px] overflow-hidden shadow-lg lg:order-1 order-2">
                <img className="img-zoom w-full h-[320px] object-cover transition-transform duration-900 hover:scale-[1.06]" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_9bcbcedd2d_090332ce5069a090.png" alt="Architects sketching" />
              </div>
              <div className="space-y-6 lg:order-2 order-1">
                <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Our Approach</span>
                <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] text-[clamp(2rem,3vw,2.8rem)]">Re-architecting for scale.</h2>
                <p className="text-lg text-muted leading-relaxed">{project.solution}</p>
              </div>
            </div>
          )}

          {project.result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal visible">
              <div className="space-y-6">
                <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">The Result</span>
                <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] text-[clamp(2rem,3vw,2.8rem)]">Transformative outcomes.</h2>
                <p className="text-lg text-muted leading-relaxed">{project.result}</p>
              </div>
              <div className="img-zoom-wrap rounded-[32px] overflow-hidden shadow-lg">
                <img className="img-zoom w-full h-[320px] object-cover transition-transform duration-900 hover:scale-[1.06]" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_fcf1fe03c7_0702b445312d1fae.png" alt="Celebratory team" />
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ===== CLIENT QUOTE PULLOUT ===== */}
      {project.clientQuote && (
        <section id="client-quote" className="py-40 bg-ink relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,82,255,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(51,116,255,0.06) 0%, transparent 60%)' }}></div>
          <div className="max-w-[1000px] mx-auto px-6 md:px-10 relative z-10 text-center reveal visible">
            <i className="fa-solid fa-quote-left text-blue text-4xl mb-8"></i>
            <p className="text-white font-display font-medium text-3xl md:text-4xl leading-snug tracking-tight">
              "{project.clientQuote}"
            </p>
            <div className="flex items-center justify-center gap-4 mt-10">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20">
                <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" alt="Client" />
              </div>
              <div className="text-left">
                <p className="font-black text-white">{project.client || "Valued Client"}</p>
                <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Partner</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== RELATED CASE STUDIES ===== */}
      {related.length > 0 && (
        <section id="related-case-studies" className="py-40 bg-white">
          <div className="max-w-[1360px] mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div className="reveal visible">
                <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">More Client Work</span>
                <h2 className="font-display font-black text-ink tracking-tighter leading-[0.9] mt-4 text-[clamp(2.5rem,4vw,3.8rem)]">Related Case Studies.</h2>
              </div>
              <Link to="/case-studies" className="reveal visible stagger-1 text-blue font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                View All <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((rel, index) => (
                <Link to={`/case-studies/${rel.slug}`} key={rel._id} className={`service-card block bg-soft rounded-[28px] overflow-hidden reveal visible stagger-${index + 1}`}>
                  <div className="img-zoom-wrap h-56 overflow-hidden">
                    <img className="img-zoom w-full h-full object-cover transition-transform duration-900 hover:scale-[1.06]" src={rel.image || "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_5d4b025fde_5dacc386dcfc7279.png"} alt={rel.title} />
                  </div>
                  <div className="p-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue px-3 py-1 bg-blue-pale rounded-full">{rel.category}</span>
                    <h4 className="font-black text-xl text-ink mt-4 mb-2">{rel.title}</h4>
                    <p className="text-sm text-muted leading-relaxed">{rel.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CONTACT CTA ===== */}
      <section id="contact-cta" className="py-32 bg-soft">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 text-center">
          <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Ready to Start?</span>
          <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] mt-4 mx-auto max-w-2xl text-[clamp(2.2rem,4vw,3.2rem)]">
            Let's engineer your next milestone.
          </h2>
          <Link to="/contact" className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-9 py-4 rounded-xl font-bold text-base hover:bg-blue-light transition-all mt-10 hover:shadow-[0_20px_40px_rgba(0,82,255,0.3)] hover:-translate-y-1">
            Contact Our Team <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
        </div>
      </section>

    </div>
  );
}
