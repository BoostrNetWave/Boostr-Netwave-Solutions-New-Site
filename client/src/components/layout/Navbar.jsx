import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homeSeed } from '../../data/home.seed';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { company, navigation, hero } = homeSeed;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) setScrolled(true);
      else setScrolled(false);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav id="navbar" className={`fixed top-0 left-0 right-0 z-[999] bg-transparent navbar-transition ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
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
          <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-ink/70">
            {navigation.map(nav => (
              nav.href.startsWith('/#') 
                ? <a key={nav.label} href={nav.href} className="hover:text-blue transition-colors">{nav.label}</a>
                : <Link key={nav.label} to={nav.href} className="hover:text-blue transition-colors">{nav.label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="magnetic-btn bg-blue text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-light transition-colors">
              {hero.primaryCta}
            </Link>
          </div>
        </div>
      </nav>
      {/* Scroll Progress */}
      <div id="scroll-progress" className="scroll-progress-bar"></div>
    </>
  );
}
