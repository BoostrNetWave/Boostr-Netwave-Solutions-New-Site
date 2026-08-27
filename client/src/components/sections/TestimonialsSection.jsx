import React from 'react';

export default function TestimonialsSection({ data }) {
  if (!data.testimonials || data.testimonials.length === 0) return null;

  // Only show real testimonials; gracefully hide if only placeholders exist
  const displayTestimonials = data.testimonials.filter(t => 
    t.name && !t.name.includes('[') && (t.quote || t.content) && !(t.quote || t.content).includes('[')
  );

  if (displayTestimonials.length === 0) return null;

  return (
    <section className="py-32 bg-white overflow-hidden border-t border-border">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="text-center mb-20 reveal">
          <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Client Success</span>
          <h2 className="font-display font-black text-ink tracking-tighter leading-[1] mt-4" style={{fontSize: 'clamp(2rem, 3vw, 3rem)'}}>
            Trusted by the Best.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((t, idx) => (
            <div key={t._id || idx} className={`bg-soft border border-border p-8 rounded-3xl reveal stagger-${(idx % 3) + 1}`}>
              <i className="fa-solid fa-quote-left text-blue/20 text-4xl mb-6"></i>
              <p className="text-ink text-lg leading-relaxed mb-8">"{t.quote || t.content}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 shadow-sm">
                  <img src={t.image || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-ink">{t.name}</p>
                  <p className="text-xs font-semibold text-muted tracking-wide">{t.role}{t.company ? `, ${t.company}` : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
