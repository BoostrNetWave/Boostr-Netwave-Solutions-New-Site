import React from 'react';

export default function ProductsSection({ data }) {
  // Use up to 6 products for the 3-column grid
  const solutions = data.products || data.solutions.slice(0, 6);
  
  // Fallback screenshots used only when a product has no heroImage set in the admin
  const fallbackImages = [
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_264be60d1f_b878f3bbb7669887.png",
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_893115574d_eb759b644fd87777.png",
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_4a997b8f3e_65cd36332aadd5a0.png",
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_208ed7de52_ce6f2f70f62199ac.png",
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_f76e359734_4dbd31bdc3d329ad.png",
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_06fe16a70e_eb26336c943a52ec.png"
  ];
  
  return (
    <section id="products" className="py-24 bg-white overflow-hidden border-t border-border">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 reveal">
          <div>
            <span className="text-[10px] font-black text-blue uppercase tracking-[0.2em]">LIVE NOW &middot; SOLUTIONS WE'VE HELPED BUILD</span>
            <h2 className="font-display font-black text-ink tracking-tighter leading-[1] mt-4" style={{fontSize: 'clamp(2rem, 3vw, 3rem)'}}>
              Our Products.
            </h2>
          </div>
          <p className="text-sm text-muted max-w-sm leading-relaxed">
            From local startups to enterprise growth companies, we engineer systems that scale across domains.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, idx) => (
            <div key={solution._id || solution.id || idx} className={`group reveal stagger-${(idx % 3) + 1}`}>
              
              {/* Browser Window Card */}
              <div className="bg-soft border border-ink rounded-t-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow">
                
                {/* Browser Header Bar */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-ink bg-white">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full border border-ink"></div>
                    <div className="w-2 h-2 rounded-full border border-ink"></div>
                    <span className="ml-2 text-[10px] font-bold text-ink tracking-wider">{solution.title.toLowerCase()}.run</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-[9px] font-black text-green-700 tracking-widest uppercase">LIVE</span>
                  </div>
                </div>
                
                {/* Product Image Area — uses heroImage from admin, falls back to placeholder */}
                <div className="h-48 overflow-hidden relative bg-ink">
                  <img 
                    className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-700" 
                    src={solution.heroImage || fallbackImages[idx % fallbackImages.length]} 
                    alt={solution.imageAlt || solution.title} 
                  />
                </div>
                
                {/* Footer Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-ink">
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-[9px] font-bold text-muted border border-border rounded bg-soft uppercase tracking-widest">{solution.category || 'Product'}</span>
                    <span className="px-2 py-1 text-[9px] font-bold text-muted border border-border rounded bg-soft uppercase tracking-widest">{(solution.location || 'Global').split(',')[0]}</span>
                  </div>
                  {solution.liveUrl ? (
                    <a href={solution.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="bg-ink text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded flex items-center gap-1 hover:bg-blue transition-colors">
                      OPEN <i className="fa-solid fa-arrow-up-right text-[8px]"></i>
                    </a>
                  ) : (
                    <span className="bg-ink/30 text-white/50 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded flex items-center gap-1 cursor-not-allowed">
                      OPEN <i className="fa-solid fa-arrow-up-right text-[8px]"></i>
                    </span>
                  )}
                </div>

              </div>

              {/* Text Description Below Card */}
              <div className="mt-5 px-1">
                <h3 className="font-black text-lg text-ink flex items-center gap-2">
                  {solution.title} <i className="fa-solid fa-arrow-right text-sm text-border"></i> <span className="text-base text-ink/70 font-semibold">{solution.tagline || (solution.description && solution.description.split(' ')[0]) || ''}</span>
                </h3>
                <p className="text-[11px] font-mono font-bold text-green-600 tracking-widest uppercase mt-2 line-clamp-1">
                  {solution.excerpt || solution.description}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
