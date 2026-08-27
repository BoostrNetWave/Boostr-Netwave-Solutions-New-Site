import React, { useState, useEffect } from 'react';
import { applicationsApi } from '../api/adminApi';
import toast from 'react-hot-toast';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await applicationsApi.getAll();
      setApplications(res.data.data);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await applicationsApi.update(id, { status: newStatus });
      toast.success('Status updated');
      setApplications(applications.map(app => 
        app._id === id ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="p-8 text-white/50 animate-pulse">Loading applications...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Career Applications</h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm font-semibold text-white/70">Candidate</th>
                <th className="p-4 text-sm font-semibold text-white/70">Role</th>
                <th className="p-4 text-sm font-semibold text-white/70">Contact</th>
                <th className="p-4 text-sm font-semibold text-white/70">Links</th>
                <th className="p-4 text-sm font-semibold text-white/70">Status</th>
                <th className="p-4 text-sm font-semibold text-white/70">Date</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-white/50">
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="text-white font-medium">{app.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white/70 text-sm">{app.jobId?.title || 'Unknown Role'}</div>
                    </td>
                    <td className="p-4 text-sm text-white/70">
                      <div><a href={`mailto:${app.email}`} className="hover:text-blue">{app.email}</a></div>
                      {app.phone && <div className="mt-1">{app.phone}</div>}
                    </td>
                    <td className="p-4 space-x-3">
                      <a 
                        href={app.resumeUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-blue/10 text-blue px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue hover:text-white transition-colors"
                      >
                        <i className="fa-solid fa-file-pdf"></i> Resume
                      </a>
                      {app.linkedinUrl && (
                        <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="text-white/50 hover:text-blue transition-colors">
                          <i className="fa-brands fa-linkedin text-lg"></i>
                        </a>
                      )}
                      {app.portfolioUrl && (
                        <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="text-white/50 hover:text-blue transition-colors">
                          <i className="fa-solid fa-link text-lg"></i>
                        </a>
                      )}
                    </td>
                    <td className="p-4">
                      <select 
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className={`bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-blue outline-none cursor-pointer ${
                          app.status === 'pending' ? 'text-yellow-400' :
                          app.status === 'reviewed' ? 'text-blue' :
                          app.status === 'hired' ? 'text-green-400' :
                          'text-red-400'
                        }`}
                      >
                        <option value="pending" className="text-black">Pending</option>
                        <option value="reviewed" className="text-black">Reviewed</option>
                        <option value="rejected" className="text-black">Rejected</option>
                        <option value="hired" className="text-black">Hired</option>
                      </select>
                    </td>
                    <td className="p-4 text-white/50 text-xs">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
