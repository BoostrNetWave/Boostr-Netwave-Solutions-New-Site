import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PageMeta from '../../components/PageMeta';
import StructuredData from '../../components/StructuredData';
import API_BASE from '../../config/api';

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

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

  const categories = ['All', 'Core Team', 'Professionals', 'Product Teams', 'Strategic Alliances'];

  const filteredTeam = activeTab === 'All' 
    ? team 
    : team.filter(m => m.category === activeTab || (activeTab === 'Core Team' && m.isLeadership));

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin"/></div>;

  return (
    <div className="bg-white min-h-screen">
      <PageMeta 
        title="Our Team" 
        description="Meet the brilliant minds behind Boostr Netwave Solutions." 
      />
      <StructuredData 
        schemaType="BreadcrumbList"
        data={{
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://boostrnetwave.com" },
            { "@type": "ListItem", position: 2, name: "Team", item: "https://boostrnetwave.com/team" }
          ]
        }}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="pt-40 pb-20 bg-soft border-b border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 text-center reveal visible">
          <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">The Brains</span>
          <h1 className="font-display font-black text-ink tracking-tighter leading-[0.95] mt-4 text-[clamp(2.5rem,5vw,4.5rem)]">
            Meet the Builders.
          </h1>
          <p className="text-xl text-muted leading-relaxed mt-6 max-w-2xl mx-auto">
            A diverse group of engineers, strategists, and visionaries united by one goal: building transformative digital solutions.
          </p>
        </div>
      </section>

      {/* ===== TEAM ROSTER ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16 reveal visible stagger-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === cat ? 'bg-ink text-white shadow-lg' : 'bg-soft text-ink hover:bg-border'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTeam.map((member, i) => {
              const isAlliance = member.category === 'Strategic Alliances';

              const CardInner = (
                <div className={`bg-white rounded-3xl overflow-hidden h-full flex flex-col ${isAlliance ? '' : 'border border-border'}`}>
                  <div className="h-64 overflow-hidden relative">
                    <img className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" src={member.image || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"} alt={member.imageAlt || member.name} />
                  </div>
                  <div className="p-6 text-center flex flex-col flex-grow">
                    <h4 className="font-black text-xl text-ink mb-1">{member.name}</h4>
                    <p className={`text-sm font-semibold ${isAlliance ? 'text-purple-600' : 'text-blue'}`}>{member.role}</p>
                    {isAlliance && <p className="text-[10px] uppercase font-bold tracking-widest text-muted mt-2 border border-border inline-block self-center px-2 py-0.5 rounded">External Partner</p>}
                    {member.bio && <p className="text-sm text-muted mt-3 line-clamp-3">{member.bio}</p>}
                    
                    <div className="flex justify-center gap-3 mt-auto pt-4">
                      {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-soft flex items-center justify-center text-ink hover:text-white hover:bg-blue transition-colors"><i className="fa-brands fa-linkedin-in text-xs"></i></a>}
                      {member.twitter && <a href={member.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-soft flex items-center justify-center text-ink hover:text-white hover:bg-blue transition-colors"><i className="fa-brands fa-twitter text-xs"></i></a>}
                    </div>
                  </div>
                </div>
              );

              return (
                <div key={member._id} className={`group reveal visible stagger-${(i % 4) + 1} h-full`}>
                  {isAlliance ? (
                    <div className="bg-gradient-to-br from-blue via-purple-500 to-pink-500 p-[2px] rounded-[26px] h-full shadow-[0_10px_30px_rgba(139,92,246,0.15)] hover:-translate-y-1 transition-transform">
                      {CardInner}
                    </div>
                  ) : (
                    <div className="h-full hover:shadow-xl hover:-translate-y-1 transition-all rounded-[26px]">
                      {CardInner}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {filteredTeam.length === 0 && (
            <div className="text-center py-20 text-muted font-medium text-lg">
              No team members found for this category yet.
            </div>
          )}

        </div>
      </section>

      {/* ===== CTA STRIP ===== */}
      <section className="py-32 bg-ink border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,82,255,0.15) 0%, transparent 60%)' }}></div>
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 text-center relative z-10">
          <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Join The Team</span>
          <h2 className="font-display font-black text-white tracking-tighter leading-[0.95] mt-4 mx-auto max-w-2xl text-[clamp(2.2rem,4vw,3.2rem)]">
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
