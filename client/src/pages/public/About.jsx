import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../../config/api';
import PageMeta from '../../components/PageMeta';

export default function About() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${API_BASE}/team`);
        setTeam(res.data.data.filter(m => m.isVisible).sort((a, b) => a.order - b.order));
      } catch (err) {
        console.error('Failed to fetch team members', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <PageMeta 
        title="About Us" 
        description="Learn more about Boostr Netwave Solutions and our mission to build the digital future." 
        url={"https://boostrnetwave.com" + window.location.pathname}
      />
      {/* ===== PAGE HEADER ===== */}
      <section className="pt-40 pb-24 bg-soft border-b border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="reveal visible max-w-4xl">
            <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Who We Are</span>
            <h1 className="font-display font-black text-ink tracking-tighter leading-[0.9] mt-4 text-[clamp(2.8rem,5vw,5rem)]">
              Engineering the<br/>Digital Future.
            </h1>
            <p className="reveal visible stagger-1 text-xl text-muted leading-relaxed mt-6 max-w-2xl">
              Boostr Netwave Solutions Pvt Ltd is a premier digital solutions company based in Bhubaneswar. We specialize in software engineering, AI/ML, cloud services, and proprietary SaaS platforms that empower businesses globally.
            </p>
          </div>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="py-32 bg-white">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal visible img-zoom-wrap rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,82,255,0.08)]">
            <img className="img-zoom w-full h-[500px] object-cover transition-transform duration-900 hover:scale-[1.06]" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_fb319bc800_fe862dad985f1b2b.png" alt="Our Office" />
          </div>
          <div className="space-y-8 reveal visible stagger-1">
            <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Our Mission</span>
            <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] text-[clamp(2rem,3vw,2.8rem)]">
              Build and change your future with Boostr Netwave.
            </h2>
            <div className="space-y-6 text-lg text-muted leading-relaxed">
              <p>
                Founded in 2023, we've rapidly grown into a trusted technology partner for enterprises worldwide. We don't just write code; we build scalable, intelligent systems designed for long-term growth.
              </p>
              <p>
                From modernizing legacy infrastructure to developing cutting-edge AI pipelines and proprietary SaaS products like MakeAuthority and AdEthix, our focus is always on engineering excellence and measurable business impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="py-20 bg-ink border-y border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,82,255,0.15) 0%, transparent 60%)' }}></div>
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="reveal visible text-center">
            <p className="text-4xl md:text-5xl font-black text-white">5+</p>
            <p className="text-xs text-white/60 uppercase tracking-widest font-semibold mt-2">Years Exp. Avg</p>
          </div>
          <div className="reveal visible stagger-1 text-center">
            <p className="text-4xl md:text-5xl font-black text-white">90+</p>
            <p className="text-xs text-white/60 uppercase tracking-widest font-semibold mt-2">Happy Clients</p>
          </div>
          <div className="reveal visible stagger-2 text-center">
            <p className="text-4xl md:text-5xl font-black text-white">100%</p>
            <p className="text-xs text-white/60 uppercase tracking-widest font-semibold mt-2">Satisfaction</p>
          </div>
          <div className="reveal visible stagger-3 text-center">
            <p className="text-4xl md:text-5xl font-black text-white">4</p>
            <p className="text-xs text-white/60 uppercase tracking-widest font-semibold mt-2">Proprietary Products</p>
          </div>
        </div>
      </section>

      {/* ===== LEADERSHIP / TEAM ===== */}
      {team.length > 0 && (
        <section className="py-32 bg-soft border-t border-border">
          <div className="max-w-[1360px] mx-auto px-6 md:px-10">
            <div className="text-center mb-16 reveal visible">
              <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">The Brains</span>
              <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] mt-4 text-[clamp(2.2rem,4vw,3.2rem)]">Leadership & Team</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <div key={member._id} className={`bg-white rounded-3xl overflow-hidden border border-border group reveal visible stagger-${(i % 4) + 1}`}>
                  <div className="h-64 overflow-hidden relative">
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={member.image || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"} alt={member.imageAlt || member.name} />
                  </div>
                  <div className="p-6 text-center">
                    <h4 className="font-black text-xl text-ink mb-1">{member.name}</h4>
                    <p className="text-sm font-semibold text-blue">{member.role}</p>
                    {member.bio && <p className="text-sm text-muted mt-3 line-clamp-2">{member.bio}</p>}
                    <div className="flex justify-center gap-3 mt-4">
                      {member.linkedIn && <a href={member.linkedIn} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-soft flex items-center justify-center text-ink hover:text-white hover:bg-blue transition-colors"><i className="fa-brands fa-linkedin-in text-xs"></i></a>}
                      {member.twitter && <a href={member.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-soft flex items-center justify-center text-ink hover:text-white hover:bg-blue transition-colors"><i className="fa-brands fa-twitter text-xs"></i></a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA STRIP ===== */}
      <section className="py-32 bg-white border-t border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 text-center">
          <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Join The Team</span>
          <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] mt-4 mx-auto max-w-2xl text-[clamp(2.2rem,4vw,3.2rem)]">
            Want to build the future with us?
          </h2>
          <Link to="/careers" className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-9 py-4 rounded-xl font-bold text-base hover:bg-blue-light transition-all mt-10 hover:shadow-[0_20px_40px_rgba(0,82,255,0.3)] hover:-translate-y-1">
            View Open Roles <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
