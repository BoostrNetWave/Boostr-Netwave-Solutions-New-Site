import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NotFound from '../../components/NotFound';
import PageMeta from '../../components/PageMeta';
import ApplicationModal from '../../components/common/ApplicationModal';
import StructuredData from '../../components/StructuredData';
import API_BASE from '../../config/api';

export default function CareerDetail() {
  const { slug } = useParams();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get(`${API_BASE}/careers`);
        const allRoles = res.data.data;
        const found = allRoles.find(r => r._id === slug || r.slug === slug);
        setRole(found);
      } catch (err) {
        console.error('Failed to fetch career role', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin"/></div>;
  if (!role) return <NotFound message="Role not found." />;

  return (
    <div className="bg-white min-h-screen">
      <PageMeta 
        title={role.seoTitle || role.title} 
        description={role.seoDescription || `Join Boostr Netwave as a ${role.title}`}
      />
      <StructuredData 
        schemaType="JobPosting"
        data={{
          title: role.title,
          description: role.description,
          datePosted: role.createdAt,
          validThrough: new Date(new Date(role.createdAt).getTime() + 90*24*60*60*1000).toISOString(),
          employmentType: "FULL_TIME",
          hiringOrganization: {
            "@type": "Organization",
            name: "Boostr Netwave Solutions Pvt Ltd",
            sameAs: "https://boostrnetwave.com",
            logo: "https://boostrnetwave.com/logo.png"
          },
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              streetAddress: "AIC Nalanda",
              addressLocality: "Bhubaneswar",
              addressRegion: "OD",
              postalCode: "751024",
              addressCountry: "IN"
            }
          }
        }}
      />
      {/* ===== ROLE HEADER ===== */}
      <section className="pt-40 pb-16 bg-soft border-b border-border">
        <div className="max-w-[840px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-2 text-sm text-muted mb-8 reveal visible">
            <Link to="/careers" className="hover:text-blue transition-colors">Careers</Link>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span className="text-ink font-semibold">{role.department || 'Engineering'}</span>
          </div>
          <h1 className="reveal visible stagger-1 font-display font-black text-ink tracking-tighter leading-[1.05] mt-4 text-[clamp(2.2rem,4vw,3.4rem)]">
            {role.title}
          </h1>
          <div className="reveal visible stagger-2 flex flex-wrap gap-4 mt-8 text-sm font-semibold text-ink">
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-border"><i className="fa-solid fa-location-dot text-blue"></i> {role.location || 'Remote'}</span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-border"><i className="fa-solid fa-briefcase text-blue"></i> {role.type || 'Full-time'}</span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-border"><i className="fa-solid fa-calendar text-blue"></i> {role.experience || 'Not specified'}</span>
          </div>
        </div>
      </section>

      {/* ===== ROLE BODY ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-[840px] mx-auto px-6 md:px-10 article-body text-lg text-ink/80 leading-relaxed reveal visible">
          <div dangerouslySetInnerHTML={{ __html: role.description }} />
          
          {role.responsibilities && role.responsibilities.length > 0 && (
            <div className="mt-12">
              <h3 className="font-display font-black text-ink text-2xl mb-6">What You'll Do</h3>
              <ul className="space-y-4">
                {role.responsibilities.map((resp, i) => (
                  <li key={i} className="flex gap-4">
                    <i className="fa-solid fa-check text-blue mt-1"></i>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {role.requirements && role.requirements.length > 0 && (
            <div className="mt-12">
              <h3 className="font-display font-black text-ink text-2xl mb-6">What We're Looking For</h3>
              <ul className="space-y-4">
                {role.requirements.map((req, i) => (
                  <li key={i} className="flex gap-4">
                    <i className="fa-solid fa-chevron-right text-blue mt-1 text-sm"></i>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA STRIP ===== */}
      <section className="py-32 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,82,255,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(51,116,255,0.06) 0%, transparent 60%)' }}></div>
        <div className="max-w-[840px] mx-auto px-6 md:px-10 relative z-10 text-center reveal visible">
          <h2 className="font-display font-black text-white tracking-tighter leading-[0.95] text-[clamp(2.2rem,4vw,3.5rem)]">
            Ready to apply?
          </h2>
          <p className="text-white/60 text-lg mt-6 mb-10 max-w-xl mx-auto">
            Send us your resume, LinkedIn, and any relevant portfolio links. We'll get back to you within 48 hours.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-9 py-4 rounded-xl font-bold text-base hover:bg-blue-light transition-all hover:shadow-[0_20px_40px_rgba(0,82,255,0.3)] hover:-translate-y-1"
          >
            Apply Now
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </div>
      </section>

      {isModalOpen && (
        <ApplicationModal job={role} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
