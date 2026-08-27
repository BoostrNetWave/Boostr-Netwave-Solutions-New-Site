import React from 'react';
import { Link } from 'react-router-dom';

export default function ServicesSection({ data }) {
  return (
    <section id="services" className="py-40 bg-soft">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="reveal">
            <span className="section-label">What We Do</span>
            <h2 className="font-display font-black text-ink tracking-tighter leading-[1] mt-4" style={{fontSize: 'clamp(2.5rem, 4vw, 4rem)'}}>
              Technology That Solves<br/>Real Business Problems.
            </h2>
          </div>
          <p className="reveal text-lg text-muted max-w-sm stagger-2">From idea to production — we cover every layer of the technology stack for scale and speed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.services.map((service, idx) => (
            <Link to={`/services/${service.slug}`} key={service._id || service.id || idx} className={`service-card bg-white rounded-[28px] overflow-hidden cursor-pointer reveal stagger-${(idx % 4) + 1} border border-transparent hover:border-blue transition-colors duration-300 block`}>
              <div className="img-zoom-wrap h-44">
                <img className="img-zoom w-full h-full object-cover" src={service.image} alt={service.title} />
              </div>
              <div className="p-8 group">
                <div className="service-icon-wrap w-12 h-12 bg-blue-pale rounded-xl flex items-center justify-center mb-5 transition-colors group-hover:bg-blue">
                  <i className={`fa-solid ${service.icon || 'fa-laptop-code'} text-blue text-lg transition-colors group-hover:text-white`}></i>
                </div>
                <h4 className="font-bold text-xl text-ink mb-3">{service.title}</h4>
                <p className="text-sm text-muted leading-relaxed mb-5">{service.shortDescription || service.excerpt}</p>
                <div className="flex items-center gap-2 text-blue text-sm font-bold service-arrow transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  {service.ctaLabel || 'Learn More'} <i className="fa-solid fa-arrow-up-right text-xs"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
