import React, { useState } from 'react';
import axios from 'axios';
import API_BASE from '../../config/api';
import PageMeta from '../../components/PageMeta';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      await axios.post(`${API_BASE}/contact`, { ...formData, service: formData.subject });
      setStatus({ type: 'success', msg: 'Message sent successfully. We will get back to you soon!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <PageMeta 
        title="Contact Us" 
        description="Get in touch with Boostr Netwave Solutions to engineer your success." 
        url={"https://boostrnetwave.com" + window.location.pathname}
      />
      {/* ===== PAGE HEADER ===== */}
      <section className="pt-40 pb-20 bg-soft border-b border-border">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="reveal visible max-w-3xl">
            <span className="section-label text-[11px] font-bold uppercase tracking-[0.25em] text-blue">Contact Us</span>
            <h1 className="font-display font-black text-ink tracking-tighter leading-[0.9] mt-4 text-[clamp(2.8rem,5vw,5rem)]">
              Let's Engineer<br/>Your Success.
            </h1>
            <p className="reveal visible stagger-1 text-xl text-muted leading-relaxed mt-6">
              Whether you need to modernize your infrastructure, build a custom SaaS product, or integrate AI into your workflow, our team is ready.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CONTACT FORM & INFO ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-5 space-y-12 reveal visible">
            <div>
              <h3 className="font-display font-black text-ink text-2xl mb-4">Get in Touch</h3>
              <p className="text-muted leading-relaxed">Fill out the form to start a conversation with our engineering team.</p>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-pale rounded-xl flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-location-dot text-blue"></i>
                </div>
                <div>
                  <h4 className="font-bold text-ink mb-1">Headquarters</h4>
                  <p className="text-muted text-sm leading-relaxed">Boostr Netwave Solutions Pvt Ltd.<br/>Bhubaneswar, Odisha, India.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-pale rounded-xl flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-envelope text-blue"></i>
                </div>
                <div>
                  <h4 className="font-bold text-ink mb-1">Email</h4>
                  <p className="text-muted text-sm leading-relaxed">
                    <a href="mailto:hello@boostrnetwave.com" className="hover:text-blue transition-colors">hello@boostrnetwave.com</a>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-pale rounded-xl flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-phone text-blue"></i>
                </div>
                <div>
                  <h4 className="font-bold text-ink mb-1">Phone</h4>
                  <p className="text-muted text-sm leading-relaxed">+91 (123) 456-7890</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-ink mb-4">Follow Us</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-xl bg-soft border border-border flex items-center justify-center text-ink hover:text-white hover:bg-blue hover:border-blue transition-all"><i className="fa-brands fa-linkedin-in text-sm"></i></a>
                <a href="#" className="w-10 h-10 rounded-xl bg-soft border border-border flex items-center justify-center text-ink hover:text-white hover:bg-blue hover:border-blue transition-all"><i className="fa-brands fa-x-twitter text-sm"></i></a>
                <a href="#" className="w-10 h-10 rounded-xl bg-soft border border-border flex items-center justify-center text-ink hover:text-white hover:bg-blue hover:border-blue transition-all"><i className="fa-brands fa-instagram text-sm"></i></a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 reveal visible stagger-1">
            <div className="bg-soft p-8 md:p-12 rounded-[32px] border border-border">
              {status.msg && (
                <div className={`p-4 rounded-xl mb-8 font-semibold text-sm ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {status.msg}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ink/70">Full Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-5 py-3.5 bg-white border border-border rounded-xl focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue transition-colors" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ink/70">Email Address</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-5 py-3.5 bg-white border border-border rounded-xl focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue transition-colors" placeholder="john@company.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-ink/70">Subject / Inquiry Type</label>
                  <select name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-5 py-3.5 bg-white border border-border rounded-xl focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue transition-colors">
                    <option value="" disabled>Select a subject</option>
                    <option value="Software Development">Software Development</option>
                    <option value="AI & ML Solutions">AI & ML Solutions</option>
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Product Inquiry (SaaS)">Product Inquiry (SaaS)</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-ink/70">Message</label>
                  <textarea name="message" required value={formData.message} onChange={handleChange} rows="5" className="w-full px-5 py-3.5 bg-white border border-border rounded-xl focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue transition-colors resize-none" placeholder="Tell us about your project or needs..."></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full magnetic-btn bg-blue text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-light transition-all shadow-[0_15px_30px_rgba(0,82,255,0.15)] hover:shadow-[0_20px_40px_rgba(0,82,255,0.3)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex justify-center items-center gap-3">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                      Sending...
                    </>
                  ) : (
                    <>Send Message <i className="fa-solid fa-paper-plane text-sm"></i></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
