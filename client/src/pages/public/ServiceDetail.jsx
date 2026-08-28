import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NotFound from '../../components/NotFound';
import PageMeta from '../../components/PageMeta';
import StructuredData from '../../components/StructuredData';
import API_BASE from '../../config/api';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`${API_BASE}/services`);
        const allServices = res.data.data;
        const found = allServices.find(s => s.slug === slug);
        setService(found);
      } catch (err) {
        console.error('Failed to fetch service', err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin"/></div>;
  if (!service) return <NotFound message="Service not found." />;

  return (
    <div className="bg-white min-h-screen">
      <PageMeta 
        title={service.seoTitle || service.title} 
        description={service.seoDescription || service.excerpt} 
        image={service.image}
        url={`https://boostrnetwave.com/services/${service.slug}`}
      />
      <StructuredData 
        schemaType="Service"
        data={{
          name: service.title,
          provider: {
            "@type": "Organization",
            name: "Boostr Netwave Solutions Pvt Ltd"
          },
          serviceType: "IT Service",
          description: service.excerpt || service.shortDescription || service.title,
          areaServed: "Worldwide"
        }}
      />
      {/* ===== HERO SECTION ===== */}
      <section className="pt-32 pb-16 bg-soft border-b border-border overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-2 text-sm text-muted mb-8 reveal visible">
            <Link to="/services" className="hover:text-blue transition-colors">Services</Link>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span className="text-ink font-semibold">{service.title}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal visible stagger-1">
              <h1 className="font-display font-black text-ink tracking-tighter leading-[0.95] text-[clamp(2.6rem,4.5vw,4.5rem)]">
                {service.title}
              </h1>
              <p className="text-xl text-muted leading-relaxed mt-6 max-w-lg">
                {service.excerpt}
              </p>
              <div className="mt-10">
                <Link to="/contact" className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-blue-light transition-all shadow-[0_20px_40px_rgba(0,82,255,0.2)] hover:shadow-[0_20px_40px_rgba(0,82,255,0.4)] hover:-translate-y-1">
                  Start a Project <i className="fa-solid fa-arrow-right text-sm"></i>
                </Link>
              </div>
            </div>
            <div className="reveal-right visible img-zoom-wrap rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,82,255,0.12)]">
              <img className="img-zoom w-full h-[400px] object-cover transition-transform duration-900 hover:scale-[1.06]" src={service.image || "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_f76e359734_29cb655b3f919165.png"} alt={service.imageAlt || service.title} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== OVERVIEW ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-[840px] mx-auto px-6 md:px-10">
          <div className="reveal visible">
            <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Overview</span>
            <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] mt-4 text-[clamp(2rem,3vw,2.8rem)] mb-10">
              Transforming businesses with scalable {service.title.toLowerCase()}.
            </h2>
            <div 
              className="article-body text-lg text-ink/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          </div>
        </div>
      </section>

      {/* ===== FEATURES / WHAT WE DO ===== */}
      {service.features && service.features.length > 0 && (
        <section className="py-20 bg-soft border-t border-border">
          <div className="max-w-[1360px] mx-auto px-6 md:px-10">
            <div className="text-center mb-16 reveal visible">
              <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Capabilities</span>
              <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] mt-4 text-[clamp(2.2rem,4vw,3.2rem)]">Our Expertise</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, i) => (
                <div key={i} className={`p-8 bg-white border border-border rounded-2xl reveal visible stagger-${(i % 3) + 1}`}>
                  <div className="w-12 h-12 bg-blue-pale rounded-xl flex items-center justify-center mb-5">
                    <i className="fa-solid fa-check text-blue text-lg"></i>
                  </div>
                  <p className="font-bold text-ink text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQS ===== */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-20 bg-white border-t border-border">
          <div className="max-w-[840px] mx-auto px-6 md:px-10">
            <div className="text-center mb-16 reveal visible">
              <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">FAQ</span>
              <h2 className="font-display font-black text-ink tracking-tighter leading-[0.95] mt-4 text-4xl">Common Questions</h2>
            </div>
            <div className="space-y-4">
              {service.faqs.map((faq, i) => (
                <div key={i} className={`p-6 bg-soft border border-border rounded-2xl reveal visible stagger-${(i % 3) + 1}`}>
                  <h4 className="font-bold text-ink text-lg mb-3">{faq.question}</h4>
                  <p className="text-muted leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA STRIP ===== */}
      <section className="py-24 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,82,255,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(51,116,255,0.06) 0%, transparent 60%)' }}></div>
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 relative z-10 text-center">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-blue">Ready to Start?</span>
          <h2 className="font-display font-black text-white tracking-tighter leading-[0.95] mt-4 mx-auto max-w-3xl text-[clamp(2.2rem,4vw,3.5rem)]">
            Let's discuss how our {service.title} services can accelerate your growth.
          </h2>
          <Link to="/contact" className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-9 py-4 rounded-xl font-bold text-base hover:bg-blue-light transition-all mt-10 hover:shadow-[0_20px_40px_rgba(0,82,255,0.3)] hover:-translate-y-1">
            Book a Consultation
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
