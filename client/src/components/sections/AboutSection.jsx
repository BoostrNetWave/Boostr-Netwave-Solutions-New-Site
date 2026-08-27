import React from 'react';

export default function AboutSection({ data }) {
  return (
    <section id="about" className="py-40 bg-white overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="reveal">
              <span className="section-label">{data.about.eyebrow}</span>
              <h2 className="font-display font-black text-ink tracking-tighter leading-[1] mt-4" style={{fontSize: 'clamp(2.8rem, 4vw, 4.5rem)'}}>
                {data.about.heading.split('Real Business').map((part, i) => (
                  <React.Fragment key={i}>
                    {part}
                    {i === 0 && <><br/><span className="text-blue">Real Business</span></>}
                  </React.Fragment>
                ))}
              </h2>
            </div>
            <p className="reveal text-xl text-muted leading-relaxed stagger-2">
              {data.about.description}
            </p>
            
            <div className="reveal stagger-3 grid grid-cols-2 gap-6 pt-6 border-t border-border">
              {/* Fallback to stats if you want a grid, or we can use custom items */}
              {data.stats.slice(0, 4).map((stat) => (
                <div key={stat.id} className="p-6 bg-soft rounded-2xl border border-border">
                  <p className="text-3xl font-black text-ink">{stat.value}{stat.suffix}</p>
                  <p className="text-sm text-muted mt-1 font-semibold">{stat.label}</p>
                </div>
              ))}
              {/* Added a placeholder stat for design balance if < 4 stats exist */}
              {data.stats.length < 4 && (
                <div className="p-6 bg-soft rounded-2xl border border-border flex items-center justify-center">
                  <i className="fa-solid fa-arrow-right text-blue text-2xl"></i>
                </div>
              )}
            </div>
          </div>
          <div className="relative reveal-right">
            <div className="img-zoom-wrap rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,82,255,0.12)]">
              <img className="img-zoom w-full aspect-square object-cover" src={data.about.image.src} alt={data.about.image.alt} />
            </div>
            
            <div className="absolute bottom-4 left-4 md:-bottom-8 md:-left-8 bg-white p-6 rounded-2xl shadow-2xl border border-border float-gentle z-10">
              <p className="text-4xl font-black text-ink">{data.stats[0]?.value}<span className="text-blue">{data.stats[0]?.suffix}</span></p>
              <p className="text-xs text-muted uppercase tracking-widest font-bold mt-1">{data.stats[0]?.label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
