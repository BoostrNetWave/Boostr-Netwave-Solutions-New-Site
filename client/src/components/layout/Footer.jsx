import React from 'react';
import { Link } from 'react-router-dom';
import { homeSeed } from '../../data/home.seed';

export default function Footer() {
  const { company, services, solutions } = homeSeed;
  
  return (
    <footer id="footer" className="bg-ink border-t border-white/5 pt-20 pb-10">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9L7.5 4.5L12 9L7.5 13.5L3 9Z" fill="white" opacity="0.7"/>
                  <path d="M7.5 9L12 4.5L16.5 9L12 13.5L7.5 9Z" fill="white"/>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white uppercase">
                {company.shortName.split(' ')[0]}<span className="text-blue">{company.shortName.split(' ')[1] || ''}</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              World-class software engineering, AI/ML, and cloud consulting from {company.location.split(',')[0]}, serving global enterprises.
            </p>
            <div className="flex flex-col gap-2 mt-4 text-white/50 text-sm">
              <p><i className="fa-solid fa-phone mr-2 w-4"></i> {company.phone}</p>
              <p><i className="fa-solid fa-envelope mr-2 w-4"></i> {company.email}</p>
              <p><i className="fa-solid fa-file-invoice mr-2 w-4"></i> GST: {company.gst}</p>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-white text-xs font-black uppercase tracking-[0.2em]">Services</h5>
            <ul className="space-y-3 text-sm text-white/40">
              {services.map(s => (
                <li key={s.id}><Link to={`/services/${s.slug}`} className="hover:text-blue transition-colors">{s.title}</Link></li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-white text-xs font-black uppercase tracking-[0.2em]">Solutions</h5>
            <ul className="space-y-3 text-sm text-white/40">
              {solutions.slice(0, 4).map(s => (
                <li key={s.id}><a href="/#products" className="hover:text-blue transition-colors">{s.title}</a></li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-white text-xs font-black uppercase tracking-[0.2em]">Company</h5>
            <ul className="space-y-3 text-sm text-white/40">
              <li><a href="/#about" className="hover:text-blue transition-colors">About Us</a></li>
              <li><Link to="/team" className="hover:text-blue transition-colors">Leadership & Team</Link></li>
              <li><a href="/#work" className="hover:text-blue transition-colors">Culture & Gallery</a></li>
              <li><Link to="/careers" className="hover:text-blue transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-blue transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6">
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} {company.name}. {company.location}.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-white/20 text-xs">
            <a href="#" className="hover:text-blue transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue transition-colors text-center">Refund & Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
