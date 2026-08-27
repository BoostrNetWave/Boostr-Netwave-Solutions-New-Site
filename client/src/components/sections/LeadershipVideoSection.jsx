import React, { useEffect, useRef, useState } from 'react';
import VideoModal from '../common/VideoModal';

export default function LeadershipVideoSection({ data }) {
  const sectionRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const videoUrl = data?.settings?.homepageVideoUrl || '';

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const els = sectionRef.current.querySelectorAll('.reveal-left, .reveal-right');
    els.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-40 bg-white overflow-hidden border-t border-border">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* Video Slot */}
          <div className="relative reveal-left opacity-0 translate-x-[-60px] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:opacity-100 [&.visible]:translate-x-0">
            <div 
              className={`img-zoom-wrap rounded-[40px] overflow-hidden shadow-[0_50px_120px_rgba(0,82,255,0.14)] group ${videoUrl ? 'cursor-pointer' : ''}`} 
              style={{ aspectRatio: '4/5' }}
              onClick={() => videoUrl && setModalOpen(true)}
            >
              <img className="img-zoom w-full h-full object-cover transition-transform duration-[0.9s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_92da7b5fbf_4c812300e1ebeaa9.png" alt="CEO and founder of a tech company speaking directly to camera" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue/30 via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
              {videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-blue border-b-[10px] border-b-transparent ml-1.5"></div>
                  </div>
                </div>
              )}
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/60">
                <p className="font-bold text-ink">Founder's Address &middot; {new Date().getFullYear()}</p>
                <p className="text-xs text-muted uppercase tracking-widest font-bold mt-1">Engineering Vision &amp; Company Mission</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-10 reveal-right opacity-0 translate-x-[60px] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:opacity-100 [&.visible]:translate-x-0">
            <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Leadership</span>
            <h2 className="font-display font-black text-ink tracking-tighter leading-[0.9] mt-4" style={{ fontSize: 'clamp(2.5rem, 3.5vw, 4rem)' }}>
              Driven by Founders<br/>Who Build.
            </h2>
            <p className="text-xl text-muted leading-relaxed">
              "We started Boostr Netwave because we believed Bhubaneswar had the talent to build world-class technology. We've proven it &mdash; 90+ clients, 5 years of zero compromises, and a team that delivers at every level."
            </p>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-blue rounded-full flex items-center justify-center text-white font-black text-lg">BN</div>
              <div>
                <p className="font-black text-ink text-lg">Boostr Netwave Leadership</p>
                <p className="text-xs text-muted uppercase tracking-widest font-bold text-blue">Bhubaneswar, Odisha, India</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-border">
              {data?.stats?.map(stat => (
                <div key={stat.id}>
                  <p className="text-3xl font-black text-ink">{stat.value}{stat.suffix}</p>
                  <p className="text-[10px] text-muted uppercase tracking-widest font-semibold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <VideoModal
        videoUrl={videoUrl}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
