import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homeSeed } from '../../data/home.seed';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { company, navigation, hero } = homeSeed;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) setScrolled(true);
      else setScrolled(false);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav id="navbar" className={`fixed top-0 left-0 right-0 z-[999] bg-transparent navbar-transition ${scrolled || mobileMenuOpen ? 'navbar-scrolled' : ''}`}>
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group z-[1000]" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9L7.5 4.5L12 9L7.5 13.5L3 9Z" fill="white" opacity="0.7"/>
                <path d="M7.5 9L12 4.5L16.5 9L12 13.5L7.5 9Z" fill="white"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-ink uppercase">
              {company.shortName.split(' ')[0]}<span className="text-blue">{company.shortName.split(' ')[1] || ''}</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-ink/70">
            {navigation.map(nav => (
              nav.href.startsWith('/#') 
                ? <a key={nav.label} href={nav.href} className="hover:text-blue transition-colors">{nav.label}</a>
                : <Link key={nav.label} to={nav.href} className="hover:text-blue transition-colors">{nav.label}</Link>
            ))}
          </div>
          
          {/* Actions & Mobile Toggle */}
          <div className="flex items-center gap-4 z-[1000]">
            <Link to="/contact" className="hidden sm:flex magnetic-btn bg-blue text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-light transition-colors">
              {hero.primaryCta}
            </Link>
            
            <button 
              className="lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <span className={`block w-6 h-0.5 transition-all duration-300 ${mobileMenuOpen ? 'bg-ink rotate-45 translate-y-2' : 'bg-ink'}`}></span>
              <span className={`block w-6 h-0.5 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'bg-ink'}`}></span>
              <span className={`block w-6 h-0.5 transition-all duration-300 ${mobileMenuOpen ? 'bg-ink -rotate-45 -translate-y-2' : 'bg-ink'}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[998] bg-white/95 backdrop-blur-md transition-all duration-300 lg:hidden flex flex-col pt-24 px-6 pb-10 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex flex-col gap-6 text-xl font-black text-ink mt-8 overflow-y-auto">
          {navigation.map(nav => (
            nav.href.startsWith('/#') 
              ? <a key={nav.label} href={nav.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-blue transition-colors">{nav.label}</a>
              : <Link key={nav.label} to={nav.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-blue transition-colors">{nav.label}</Link>
          ))}
          <div className="mt-8 pt-8 border-t border-border/50">
             <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="bg-blue text-white text-center w-full px-6 py-4 rounded-xl text-lg font-semibold hover:bg-blue-light transition-colors inline-block">
              {hero.primaryCta}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Progress */}
      <div id="scroll-progress" className="scroll-progress-bar"></div>
    </>
  );
}
