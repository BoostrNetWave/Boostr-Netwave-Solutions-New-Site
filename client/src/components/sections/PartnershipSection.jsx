import React from 'react';

export default function PartnershipSection({ data }) {
  return (
    <section className="py-24 bg-white border-y border-border">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          <div className="lg:col-span-1 reveal">
            <span className="section-label">Strategic Partnerships</span>
            <h3 className="font-display font-black text-ink text-3xl mt-4 mb-4">We are Partner With</h3>
            <p className="text-muted text-sm leading-relaxed">
              At Boostr Netwave, we prioritize providing our clients with secure, efficient, and reliable payment solutions through our strategic partnerships.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.partnerships.map((partner, idx) => (
              <div key={partner.id} className={`p-8 rounded-[24px] bg-soft border border-border reveal stagger-${idx + 1}`}>
                <h4 className="font-black text-2xl text-ink mb-3">{partner.name}</h4>
                <p className="text-sm text-muted leading-relaxed">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
