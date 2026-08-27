import React, { useEffect, useState } from 'react';
import { contactApi, servicesApi, blogApi, careersApi } from '../api/adminApi';

function StatCard({ label, value, sub, color = 'blue' }) {
  const colors = { blue: 'border-blue-500/20 bg-blue-500/5', green: 'border-green-500/20 bg-green-500/5', amber: 'border-amber-500/20 bg-amber-500/5', purple: 'border-purple-500/20 bg-purple-500/5' };
  const textColors = { blue: 'text-blue-400', green: 'text-green-400', amber: 'text-amber-400', purple: 'text-purple-400' };
  return (
    <div className={`border rounded-2xl p-6 ${colors[color]}`}>
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">{label}</p>
      <p className={`text-4xl font-black ${textColors[color]}`}>{value ?? '—'}</p>
      {sub && <p className="text-white/30 text-xs mt-2">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [counts, setCounts] = useState({ services: null, blog: null, careers: null, newLeads: null });
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      servicesApi.getAll(),
      blogApi.getAll().catch(() => ({ posts: [] })),
      careersApi.getAll(),
      contactApi.getAll('new'),
    ]).then(([svcs, blog, careers, leads]) => {
      setCounts({
        services: svcs.status === 'fulfilled' ? svcs.value?.length : '?',
        blog: blog.status === 'fulfilled' ? (blog.value?.posts?.length ?? blog.value?.length ?? 0) : '?',
        careers: careers.status === 'fulfilled' ? careers.value?.length : '?',
        newLeads: leads.status === 'fulfilled' ? leads.value?.length : '?',
      });
      if (leads.status === 'fulfilled') setRecentLeads(leads.value?.slice(0, 5) || []);
    });
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Your site at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="New Leads" value={counts.newLeads} sub="Unread contact submissions" color="blue" />
        <StatCard label="Services" value={counts.services} sub="Active service listings" color="green" />
        <StatCard label="Blog Posts" value={counts.blog} sub="Published articles" color="purple" />
        <StatCard label="Open Roles" value={counts.careers} sub="Live job listings" color="amber" />
      </div>

      {/* Recent Leads */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-white">Recent Contact Leads</h2>
          <a href="/admin/inbox" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</a>
        </div>
        {recentLeads.length === 0 ? (
          <div className="border border-white/5 rounded-2xl p-12 text-center text-white/30 text-sm">No new leads yet.</div>
        ) : (
          <div className="border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="text-left px-6 py-3 text-white/30 font-bold text-xs uppercase tracking-widest">Name</th>
                  <th className="text-left px-6 py-3 text-white/30 font-bold text-xs uppercase tracking-widest">Email</th>
                  <th className="text-left px-6 py-3 text-white/30 font-bold text-xs uppercase tracking-widest">Service</th>
                  <th className="text-left px-6 py-3 text-white/30 font-bold text-xs uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, i) => (
                  <tr key={lead._id} className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors`}>
                    <td className="px-6 py-4 text-white font-medium">{lead.name}</td>
                    <td className="px-6 py-4 text-white/50">{lead.email}</td>
                    <td className="px-6 py-4 text-white/50">{lead.service || '—'}</td>
                    <td className="px-6 py-4 text-white/30 text-xs">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
