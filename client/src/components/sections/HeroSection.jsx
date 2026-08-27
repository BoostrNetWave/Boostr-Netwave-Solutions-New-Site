import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection({ data }) {
  return (
    <section id="hero" className="relative flex items-center min-h-[100vh] overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(0,82,255,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-6 md:px-10 w-full pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left: Copy */}
          <div className="lg:col-span-5 space-y-8">
            <div className="reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-pale border border-blue/20 rounded-full text-xs font-bold text-blue uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-blue rounded-full animate-pulse"></span>
                {data.hero.eyebrow}
              </div>
            </div>
            <h1 className="reveal font-display font-black text-ink leading-[1] tracking-tighter" style={{ transitionDelay: '0.2s', fontSize: 'clamp(3rem, 4vw, 5rem)' }}>
              {data.hero.heading.split('Your Business').map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i === 0 && <><br/><span className="text-blue">Your Business</span></>}
                </React.Fragment>
              ))}
            </h1>
            <p className="reveal text-xl text-muted leading-relaxed" style={{ transitionDelay: '0.3s' }}>
              {data.hero.supportingText}
            </p>
            <div className="reveal flex flex-wrap gap-4" style={{ transitionDelay: '0.4s' }}>
              <Link to="/contact" className="magnetic-btn bg-blue text-white px-9 py-4 rounded-xl font-bold text-base flex items-center gap-3 hover:bg-blue-light transition-all shadow-[0_10px_30px_rgba(0,82,255,0.2)]">
                {data.hero?.primaryCta || "Start a Project"} <i className="fa-solid fa-arrow-right text-sm"></i>
              </Link>
              <Link to="/#services" className="bg-white border border-border text-ink px-9 py-4 rounded-xl font-bold text-base hover:bg-soft transition-all">
                {data.hero?.secondaryCta || "Explore Services"}
              </Link>
            </div>
            
            {/* Stats inline */}
            <div className="reveal flex flex-wrap gap-8 pt-6 border-t border-border" style={{ transitionDelay: '0.5s' }}>
              {data.stats.map(stat => (
                <div key={stat.id}>
                  <p className="text-3xl font-black text-ink"><span className="counter-val" data-target={stat.value}>0</span>{stat.suffix}</p>
                  <p className="text-[10px] text-muted uppercase tracking-widest font-bold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Technical Flow Diagram */}
          <div className="lg:col-span-7 hidden lg:block relative -mr-10">
            <div className="w-full h-[600px] relative">
              <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
                
                {/* Connecting Lines */}
                <g fill="none" stroke="#DBEAFE" strokeWidth="1.5">
                  {/* Left to Center */}
                  <path d="M 220 300 L 260 300" strokeDasharray="4 4" className="flow-dash" />
                  <path d="M 260 300 L 320 300" />
                  <circle cx="260" cy="300" r="3" fill="#0052FF" stroke="none" />
                  <circle cx="320" cy="300" r="3" fill="#0052FF" stroke="none" />
                  
                  {/* Center to Top Right */}
                  <path d="M 520 300 C 600 300, 580 150, 640 150 L 660 150" />
                  <circle cx="520" cy="300" r="3" fill="#0052FF" stroke="none" />
                  <circle cx="620" cy="173" r="3" fill="#0052FF" stroke="none" />
                  
                  {/* Center to Middle Right */}
                  <path d="M 520 300 C 600 300, 580 300, 640 300 L 660 300" />
                  
                  {/* Center to Bottom Right */}
                  <path d="M 520 300 C 600 300, 580 450, 640 450 L 660 450" />
                  <circle cx="620" cy="426" r="3" fill="#0052FF" stroke="none" />
                </g>

                {/* Animated Particles on Lines */}
                <circle cx="0" cy="0" r="4" fill="#0052FF" filter="drop-shadow(0 0 4px #0052FF)">
                  <animateMotion dur="4s" repeatCount="indefinite" path="M 220 300 L 320 300" />
                </circle>
                
                <circle cx="0" cy="0" r="4" fill="#0052FF" filter="drop-shadow(0 0 4px #0052FF)">
                  <animateMotion dur="5s" repeatCount="indefinite" path="M 520 300 C 600 300, 580 150, 640 150 L 660 150" begin="1s"/>
                </circle>

                <circle cx="0" cy="0" r="4" fill="#0052FF" filter="drop-shadow(0 0 4px #0052FF)">
                  <animateMotion dur="4.5s" repeatCount="indefinite" path="M 520 300 C 600 300, 580 300, 640 300 L 660 300" begin="0.5s"/>
                </circle>

                <circle cx="0" cy="0" r="4" fill="#0052FF" filter="drop-shadow(0 0 4px #0052FF)">
                  <animateMotion dur="5.5s" repeatCount="indefinite" path="M 520 300 C 600 300, 580 450, 640 450 L 660 450" begin="1.5s"/>
                </circle>


                {/* Node 1: Left (Input) */}
                <g transform="translate(100, 260)">
                  <text x="60" y="-15" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="bold" letterSpacing="2">YOUR VISION</text>
                  <text x="60" y="-3" textAnchor="middle" fill="#6B7280" fontSize="8" letterSpacing="1">ideas &middot; challenges &middot; goals</text>
                  <rect x="0" y="10" width="120" height="60" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="2" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.05))" />
                  <line x1="20" y1="30" x2="100" y2="30" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
                  <line x1="20" y1="40" x2="80" y2="40" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
                  <line x1="20" y1="50" x2="90" y2="50" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Node 2: Center (Hub) */}
                <g transform="translate(320, 200)">
                  <rect x="0" y="0" width="200" height="150" rx="12" fill="white" stroke="#111827" strokeWidth="2" filter="drop-shadow(0 20px 25px rgba(0,0,0,0.1))" />
                  {/* Top Browser Bar */}
                  <line x1="0" y1="20" x2="200" y2="20" stroke="#E5E7EB" strokeWidth="1" />
                  <circle cx="15" cy="10" r="3" fill="#E5E7EB" />
                  <circle cx="27" cy="10" r="3" fill="#E5E7EB" />
                  
                  <text x="100" y="65" textAnchor="middle" fill="#111827" fontSize="14" fontWeight="800" letterSpacing="3">BOOSTR NETWAVE</text>
                  <text x="100" y="80" textAnchor="middle" fill="#6B7280" fontSize="10" letterSpacing="1">digital transformation engine</text>
                  
                  {/* Iconography */}
                  <g transform="translate(85, 100)" stroke="#0052FF" strokeWidth="1.5" fill="none">
                    <circle cx="15" cy="15" r="10" />
                    <circle cx="15" cy="15" r="3" fill="#0052FF" />
                    <path d="M 15 1 L 15 5 M 15 25 L 15 29 M 1 15 L 5 15 M 25 15 L 29 15" strokeLinecap="round" />
                    <path d="M 5 5 L 8 8 M 22 22 L 25 25 M 5 25 L 8 22 M 25 5 L 22 8" strokeLinecap="round" />
                  </g>
                  
                  <text x="100" y="175" textAnchor="middle" fill="#6B7280" fontSize="9" fontWeight="bold" letterSpacing="2">INNOVATIVE &middot; SECURE &middot; SCALABLE</text>
                </g>

                {/* Output Node 1 (Top Right) */}
                <g transform="translate(660, 110)">
                  <rect x="0" y="10" width="120" height="60" rx="6" fill="white" stroke="#111827" strokeWidth="1.5" />
                  <line x1="0" y1="25" x2="120" y2="25" stroke="#111827" strokeWidth="1" />
                  <circle cx="12" cy="17" r="2.5" fill="none" stroke="#111827" strokeWidth="1" />
                  <circle cx="22" cy="17" r="2.5" fill="none" stroke="#111827" strokeWidth="1" />
                  <line x1="15" y1="40" x2="70" y2="40" stroke="#111827" strokeWidth="1.5" />
                  <line x1="15" y1="50" x2="90" y2="50" stroke="#111827" strokeWidth="1.5" />
                  
                  <text x="135" y="32" fill="#111827" fontSize="10" fontWeight="bold" letterSpacing="1.5">AI AGENTS</text>
                  <text x="135" y="47" fill="#6B7280" fontSize="8" letterSpacing="0.5">intelligent automations</text>
                </g>

                {/* Output Node 2 (Middle Right) */}
                <g transform="translate(660, 260)">
                  <rect x="0" y="10" width="120" height="60" rx="6" fill="white" stroke="#111827" strokeWidth="1.5" />
                  <line x1="0" y1="25" x2="120" y2="25" stroke="#111827" strokeWidth="1" />
                  <line x1="10" y1="17" x2="30" y2="17" stroke="#111827" strokeWidth="1.5" />
                  <line x1="15" y1="40" x2="105" y2="40" stroke="#111827" strokeWidth="1.5" />
                  <line x1="15" y1="50" x2="80" y2="50" stroke="#111827" strokeWidth="1.5" />
                  <circle cx="100" cy="50" r="2" fill="#0052FF" />
                  
                  <text x="135" y="32" fill="#111827" fontSize="10" fontWeight="bold" letterSpacing="1.5">CLOUD SYSTEMS</text>
                  <text x="135" y="47" fill="#6B7280" fontSize="8" letterSpacing="0.5">resilient infrastructure</text>
                </g>

                {/* Output Node 3 (Bottom Right) */}
                <g transform="translate(660, 410)">
                  <rect x="0" y="10" width="120" height="60" rx="6" fill="white" stroke="#111827" strokeWidth="1.5" />
                  <line x1="0" y1="25" x2="120" y2="25" stroke="#111827" strokeWidth="1" />
                  <polygon points="12,14 12,20 18,17" fill="none" stroke="#111827" strokeWidth="1.5" />
                  <line x1="15" y1="40" x2="50" y2="40" stroke="#111827" strokeWidth="1.5" />
                  <line x1="60" y1="40" x2="80" y2="40" stroke="#0052FF" strokeWidth="1.5" />
                  
                  <text x="135" y="32" fill="#111827" fontSize="10" fontWeight="bold" letterSpacing="1.5">SAAS PLATFORMS</text>
                  <text x="135" y="47" fill="#6B7280" fontSize="8" letterSpacing="0.5">custom software development</text>
                </g>

              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
