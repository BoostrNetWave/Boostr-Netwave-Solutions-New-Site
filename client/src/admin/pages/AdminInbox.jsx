import React, { useEffect, useState } from 'react';
import { contactApi } from '../api/adminApi';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  new:      'bg-blue-500/20 text-blue-400 border-blue-500/30',
  read:     'bg-white/10 text-white/40 border-white/10',
  replied:  'bg-green-500/20 text-green-400 border-green-500/30',
  archived: 'bg-white/5 text-white/20 border-white/5',
};

export default function AdminInbox() {
  const [leads, setLeads]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [filter, setFilter]       = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await contactApi.getAll(filter || undefined);
      setLeads(data || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await contactApi.updateStatus(id, status);
      toast.success(`Marked as ${status}.`);
      setSelected(prev => prev?._id === id ? { ...prev, status } : prev);
      setLeads(prev => prev.map(l => l._id === id ? { ...l, status } : l));
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="flex gap-6 h-full">
      {/* List */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">Inbox</h1>
          <span className="text-white/30 text-sm">{leads.length}</span>
        </div>

        <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
          <option value="">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>

        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/></div>
            : leads.length === 0 ? <p className="text-white/30 text-sm text-center py-10">No leads found.</p>
            : leads.map(lead => (
              <button
                key={lead._id}
                onClick={() => { setSelected(lead); updateStatus(lead._id, lead.status === 'new' ? 'read' : lead.status); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selected?._id === lead._id ? 'bg-blue-600/10 border-blue-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/5'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-bold text-sm text-white truncate">{lead.name}</p>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_COLORS[lead.status]}`}>{lead.status}</span>
                </div>
                <p className="text-white/40 text-xs truncate">{lead.email}</p>
                <p className="text-white/30 text-xs mt-1 truncate">{lead.message}</p>
              </button>
            ))}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-8">
        {!selected ? (
          <div className="h-full flex items-center justify-center text-white/20 text-sm">Select a message to read it</div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">{selected.name}</h2>
                <p className="text-white/40 text-sm mt-1">{selected.email}{selected.phone ? ` · ${selected.phone}` : ''}</p>
                {selected.company && <p className="text-white/30 text-sm">{selected.company}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {['new','read','replied','archived'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected._id, s)}
                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border transition-all ${selected.status === s ? STATUS_COLORS[s] : 'border-white/10 text-white/30 hover:text-white/60'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              {selected.service && <div><p className="text-white/30 text-xs uppercase tracking-widest mb-1">Service</p><p className="text-white/70">{selected.service}</p></div>}
              {selected.budget  && <div><p className="text-white/30 text-xs uppercase tracking-widest mb-1">Budget</p><p className="text-white/70">{selected.budget}</p></div>}
              <div><p className="text-white/30 text-xs uppercase tracking-widest mb-1">Submitted</p><p className="text-white/70">{new Date(selected.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p></div>
            </div>

            <div className="border-t border-white/5 pt-6">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Message</p>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>

            <div className="border-t border-white/5 pt-4">
              <a href={`mailto:${selected.email}?subject=Re: Your inquiry at Boostr Netwave Solutions`}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 text-sm">
                ✉ Reply via Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
