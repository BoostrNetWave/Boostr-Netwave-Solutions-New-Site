import React, { useRef, useEffect, useState } from 'react';

/**
 * LeadershipVideoSection
 *
 * Displays a native HTML5 auto-playing background video of the founder/leadership.
 * The video is muted by default, loops silently, and ONLY starts playing once the
 * section scrolls ~40% into the viewport (IntersectionObserver). It pauses when
 * scrolled out. preload="none" means zero video bytes download until needed.
 *
 * Props (all sourced from data.settings via useHomeData):
 *  - videoUrl        → data.settings.leadershipVideoUrl    (Cloudinary .mp4/.webm)
 *  - posterUrl       → data.settings.leadershipVideoPoster (static fallback image)
 *  - caption         → data.settings.leadershipVideoCaption
 *  - subcaption      → data.settings.leadershipVideoSubcaption
 *  - founderName     → data.settings.founderName (optional)
 *  - founderTitle    → data.settings.founderTitle (optional)
 *
 * Empty-state contract:
 *  If videoUrl is not set, render only a static image (posterUrl) or a clean
 *  neutral placeholder — NEVER substitute a stock video of someone who isn't the
 *  actual founder.
 */
export default function LeadershipVideoSection({ data }) {
  const videoUrl    = data?.settings?.leadershipVideoUrl   || '';
  const posterUrl   = data?.settings?.leadershipVideoPoster || '';
  const caption     = data?.settings?.leadershipVideoCaption    || "Founder's Address · 2026";
  const subcaption  = data?.settings?.leadershipVideoSubcaption || 'Engineering Vision & Company Mission';

  const videoRef     = useRef(null);
  const containerRef = useRef(null);
  const sectionRef   = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Scroll-reveal for the surrounding section text
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    const els = sectionRef.current.querySelectorAll('.reveal-left, .reveal-right');
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll-triggered video playback — plays when 40% visible, pauses on scroll away
  useEffect(() => {
    if (!videoUrl || !containerRef.current || !videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {
            // Autoplay can be blocked by some browsers even when muted.
            // Fail silently — the poster image is still visible as a safe fallback.
          });
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [videoUrl]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <section ref={sectionRef} className="py-40 bg-white overflow-hidden border-t border-border">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

          {/* ── Video / Poster Column ─────────────────────────────────────────── */}
          <div className="relative reveal-left opacity-0 translate-x-[-60px] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:opacity-100 [&.visible]:translate-x-0">

            {videoUrl ? (
              /* ── Native video — no YouTube, no fake stock footage ── */
              <div
                ref={containerRef}
                className="relative rounded-[40px] overflow-hidden shadow-[0_50px_120px_rgba(0,82,255,0.14)]"
                style={{ aspectRatio: '4/5' }}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  src={videoUrl}
                  poster={posterUrl || undefined}
                  muted={isMuted}
                  loop
                  playsInline
                  preload="none"   // zero bytes downloaded until scroll trigger fires
                />

                {/* Mute/unmute toggle */}
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="absolute bottom-24 right-8 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 z-10 text-xl"
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>

                {/* Caption overlay */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/60">
                  <p className="font-bold text-ink">{caption}</p>
                  <p className="text-xs text-muted uppercase tracking-widest font-bold mt-1">{subcaption}</p>
                </div>
              </div>

            ) : posterUrl ? (
              /* ── No video set — show static poster image ── */
              <div
                className="rounded-[40px] overflow-hidden shadow-[0_50px_120px_rgba(0,82,255,0.14)]"
                style={{ aspectRatio: '4/5' }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={posterUrl}
                  alt="Boostr Netwave leadership"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/60">
                  <p className="font-bold text-ink">{caption}</p>
                  <p className="text-xs text-muted uppercase tracking-widest font-bold mt-1">{subcaption}</p>
                </div>
              </div>

            ) : (
              /* ── No video AND no poster — show a neutral empty frame ──
                 Intentionally blank. Never substitute a fake video of a person
                 who isn't the real founder. */
              <div
                className="rounded-[40px] overflow-hidden shadow-[0_50px_120px_rgba(0,82,255,0.14)] bg-soft flex flex-col items-center justify-center gap-4 border border-border"
                style={{ aspectRatio: '4/5' }}
              >
                <i className="fa-solid fa-video text-4xl text-muted/40" />
                <p className="text-muted/50 text-sm text-center px-8">
                  Upload a leadership video or poster image via<br />
                  <span className="font-bold">Admin → Site Settings → Leadership Video</span>
                </p>
              </div>
            )}
          </div>

          {/* ── Content Column ────────────────────────────────────────────────── */}
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
    </section>
  );
}
