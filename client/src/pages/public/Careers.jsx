import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../../config/api';
import PageMeta from '../../components/PageMeta';

export default function Careers() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${API_BASE}/careers`);
        setRoles(res.data.data.filter(r => r.isActive));
      } catch (err) {
        console.error('Failed to fetch careers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <PageMeta 
        title="Careers" 
        description="Build world-class technology with us. Explore open roles at Boostr Netwave Solutions." 
        url={"https://boostrnetwave.com" + window.location.pathname}
      />
      {/* ===== PAGE HEADER ===== */}
      <section id="page-header" className="pt-40 pb-24 bg-soft border-b border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="reveal visible max-w-3xl">
            <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Careers</span>
            <h1 className="font-display font-black text-ink tracking-tighter leading-[0.9] mt-4 text-[clamp(2.8rem,5vw,5rem)]">
              Build World-Class<br/>Technology With Us.
            </h1>
            <p className="reveal visible stagger-1 text-xl text-muted leading-relaxed mt-6">
              We're a team of engineers, designers, and strategists based in Bhubaneswar, serving clients globally. If you care about craft, we want to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CULTURE STRIP ===== */}
      <section id="culture-strip" className="py-24 bg-white border-b border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="reveal visible p-8 bg-soft rounded-[24px] border border-border transition-all hover:border-blue hover:shadow-lg">
            <i className="fa-solid fa-earth-americas text-blue text-2xl mb-4"></i>
            <p className="font-bold text-ink mb-1">Global Client Exposure</p>
            <p className="text-sm text-muted">Work on products shipped to clients across 4+ countries.</p>
          </div>
          <div className="reveal visible stagger-1 p-8 bg-soft rounded-[24px] border border-border transition-all hover:border-blue hover:shadow-lg">
            <i className="fa-solid fa-graduation-cap text-blue text-2xl mb-4"></i>
            <p className="font-bold text-ink mb-1">Continuous Learning</p>
            <p className="text-sm text-muted">Dedicated time and budget for upskilling and certifications.</p>
          </div>
          <div className="reveal visible stagger-2 p-8 bg-soft rounded-[24px] border border-border transition-all hover:border-blue hover:shadow-lg">
            <i className="fa-solid fa-users text-blue text-2xl mb-4"></i>
            <p className="font-bold text-ink mb-1">Craft-First Culture</p>
            <p className="text-sm text-muted">Code review, pairing, and architecture discussions are the norm.</p>
          </div>
        </div>
      </section>

      {/* ===== OPEN ROLES ===== */}
      <section id="open-roles" className="py-40 bg-soft">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="reveal visible">
              <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Open Positions</span>
              <h2 className="font-display font-black text-ink tracking-tighter leading-[0.9] mt-4 text-[clamp(2.2rem,3.5vw,3.2rem)]">Current Openings.</h2>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin"/></div>
          ) : roles.length > 0 ? (
            <div id="roles-list" className="space-y-4">
              {roles.map((role, i) => (
                <Link to={`/careers/${role.slug || role._id}`} key={role._id} className={`role-row group flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 bg-white border border-border rounded-[24px] reveal visible stagger-${(i % 4) + 1} transition-all duration-300 hover:bg-soft hover:border-blue hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,82,255,0.06)]`}>
                  <div>
                    <h4 className="font-black text-lg text-ink mb-2 group-hover:text-blue transition-colors">{role.title}</h4>
                    <div className="flex flex-wrap gap-4 text-sm text-muted">
                      <span className="flex items-center gap-1.5"><i className="fa-solid fa-building text-xs"></i> {role.department || 'Engineering'}</span>
                      <span className="flex items-center gap-1.5"><i className="fa-solid fa-location-dot text-xs"></i> {role.location || 'Remote'}</span>
                      <span className="flex items-center gap-1.5"><i className="fa-solid fa-briefcase text-xs"></i> {role.type || 'Full-time'}</span>
                    </div>
                  </div>
                  <span className="text-blue font-bold text-sm flex items-center gap-2 shrink-0 transition-transform duration-300 group-hover:translate-x-2">
                    View Role <i className="fa-solid fa-arrow-right text-xs"></i>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div id="empty-state" className="text-center py-20 bg-white border border-dashed border-border rounded-[32px] reveal visible">
              <div className="w-16 h-16 bg-blue-pale rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-briefcase text-blue text-2xl"></i>
              </div>
              <h4 className="font-black text-xl text-ink mb-2">No Open Roles Right Now</h4>
              <p className="text-muted max-w-sm mx-auto mb-8">We're not actively hiring at the moment, but we're always glad to hear from great engineers and designers.</p>
              <Link to="/contact" className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-light transition-all">
                Send Us Your Resume <i className="fa-solid fa-paper-plane text-xs"></i>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
