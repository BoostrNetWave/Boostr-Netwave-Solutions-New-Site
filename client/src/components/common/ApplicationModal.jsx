import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE from '../../config/api';

export default function ApplicationModal({ job, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
    coverLetter: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.resumeUrl) {
      toast.error('Name, email, and resume link are required.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/applications`, {
        ...formData,
        jobId: job._id
      });
      toast.success('Application submitted successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
      
      <div className="relative bg-ink border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 shadow-2xl">
        <div className="sticky top-0 bg-ink/90 backdrop-blur-md border-b border-white/10 p-6 flex justify-between items-center z-20">
          <div>
            <h3 className="text-xl font-bold text-white">Apply for {job.title}</h3>
            <p className="text-white/50 text-sm mt-1">{job.location} • {job.type}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium">Full Name *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue outline-none transition-colors"
                placeholder="Jane Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium">Email Address *</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue outline-none transition-colors"
                placeholder="jane@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium">Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue outline-none transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium">LinkedIn Profile</label>
              <input 
                type="url" 
                value={formData.linkedinUrl}
                onChange={e => setFormData({...formData, linkedinUrl: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue outline-none transition-colors"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium">Portfolio / Website</label>
              <input 
                type="url" 
                value={formData.portfolioUrl}
                onChange={e => setFormData({...formData, portfolioUrl: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue outline-none transition-colors"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium">Resume Link (Google Drive, Dropbox, etc) *</label>
              <input 
                type="url" 
                required
                value={formData.resumeUrl}
                onChange={e => setFormData({...formData, resumeUrl: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue outline-none transition-colors"
                placeholder="https://docs.google.com/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium">Cover Letter (Optional)</label>
            <textarea 
              rows="5"
              value={formData.coverLetter}
              onChange={e => setFormData({...formData, coverLetter: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue outline-none transition-colors resize-none"
              placeholder="Tell us why you're a great fit for this role..."
            ></textarea>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-white/70 font-medium hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="magnetic-btn px-8 py-3 bg-blue text-white rounded-xl font-bold hover:bg-blue-light transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
