import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE from '../../config/api';

export default function ContactCTA({ data }) {
  const [formData, setFormData] = useState({ name: '', email: '', service: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Name, email, and message are required.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/contact`, formData);
      toast.success('Inquiry sent successfully! We will be in touch.');
      setFormData({ name: '', email: '', service: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-40 bg-ink overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: "radial-gradient(circle at 20% 50%, rgba(0,82,255,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(51,116,255,0.06) 0%, transparent 60%)"}}></div>
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Left */}
          <div className="space-y-10 reveal-left">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-blue">{data.cta.eyebrow}</span>
              <h2 className="font-display font-black text-white tracking-tighter leading-[1] mt-4" style={{fontSize: 'clamp(3rem, 5vw, 5.5rem)'}}>
                {data.cta.heading.split('Idea?').map((part, i) => (
                  <React.Fragment key={i}>
                    {part}
                    {i === 0 && <><br/><span className="text-blue">Idea?</span></>}
                  </React.Fragment>
                ))}
              </h2>
            </div>
            <p className="text-xl text-white/50 leading-relaxed max-w-md">{data.cta.description}</p>
            <div className="space-y-6">
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-blue group-hover:border-blue group-hover:text-white transition-all"><i className="fa-solid fa-envelope"></i></div>
                <span className="text-white/70 font-medium group-hover:text-white transition-colors">{data.company.email}</span>
              </div>
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-blue group-hover:border-blue group-hover:text-white transition-all"><i className="fa-solid fa-location-dot"></i></div>
                <span className="text-white/70 font-medium group-hover:text-white transition-colors">{data.company.location}</span>
              </div>
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-blue group-hover:border-blue group-hover:text-white transition-all"><i className="fa-brands fa-linkedin"></i></div>
                <span className="text-white/70 font-medium group-hover:text-white transition-colors">Connect on LinkedIn</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 reveal-right space-y-6">
            <h3 className="font-bold text-white text-2xl">Send an Inquiry</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="col-span-2 md:col-span-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue transition-colors text-sm" />
              <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="col-span-2 md:col-span-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue transition-colors text-sm" />
            </div>
            <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/50 focus:outline-none focus:border-blue transition-colors text-sm">
              <option value="">Select Service</option>
              {data.services.map(s => <option key={s._id || s.id} value={s.title}>{s.title}</option>)}
              <option value="Other">Other</option>
            </select>
            <textarea placeholder="Tell us about your project, timeline, and goals..." required rows="5" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue transition-colors text-sm resize-none"></textarea>
            <button type="submit" disabled={loading} className="magnetic-btn w-full bg-blue text-white py-5 rounded-xl font-bold text-base hover:bg-blue-light transition-all flex items-center justify-center gap-3 disabled:opacity-50">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : (
                <>{data.cta.buttonLabel} <i className="fa-solid fa-paper-plane text-sm"></i></>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
