import React from 'react';

export default function GallerySection({ data }) {
  // Hide the section entirely if no live gallery photos exist in the database.
  // An empty masonry grid looks broken; hiding is cleaner and avoids showing
  // AI-generated placeholder photos from the seed file on the live site.
  if (!data.gallery || data.gallery.length === 0) return null;

  return (
    <section id="work" className="py-40 bg-soft overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="reveal">
            <span className="section-label">Gallery & Culture</span>
            <h2 className="font-display font-black text-ink tracking-tighter leading-[1] mt-4" style={{fontSize: 'clamp(2.5rem, 4vw, 4rem)'}}>
              Moments That<br/>Shape the Journey.
            </h2>
          </div>
          <p className="reveal text-muted max-w-xs leading-relaxed">Awards, events, and the daily life of a world-class engineering team.</p>
        </div>

        <div className="masonry reveal">
          {data.gallery.map((item, idx) => (
            <div key={item.id} className="masonry-item img-zoom-wrap rounded-[24px] overflow-hidden shadow-md group relative">
              <img className="img-zoom w-full" src={item.image} alt={item.alt} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white text-sm font-bold">{item.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
