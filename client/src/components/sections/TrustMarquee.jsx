import React from 'react';

export default function TrustMarquee({ data }) {
  // Combine partnerships (certifications) and top clients to form a trust bar
  const items = [
    ...(data.partnerships || []).map(p => ({ label: p.name, type: p.type, icon: 'fa-handshake' })),
    ...(data.clients || []).slice(0, 5).map(c => ({ label: c.client || c.title, type: c.category || 'Client', icon: 'fa-briefcase' }))
  ];

  return (
    <section className="py-8 bg-soft border-y border-border overflow-hidden">
      <div className="marquee-wrap overflow-hidden">
        <div className="marquee-track items-center gap-0">
          {/* Loop twice for seamless marquee */}
          {[1, 2].map((loopIndex) => (
            <div key={loopIndex} className="flex items-center gap-16 px-8">
              {items.map((item, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity cursor-default">
                    {item.icon ? <i className={`fa-solid ${item.icon} text-2xl text-blue`}></i> : <span className="text-xl font-black tracking-tight text-ink">{item.label}</span>}
                    {item.icon && <span className="text-xl font-black tracking-tight text-ink mt-1">{item.label}</span>}
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{item.type}</span>
                  </div>
                  <div className="w-px h-8 bg-border"></div>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
