import React, { useEffect, useState } from 'react';
import { settingsApi } from '../api/adminApi';
import toast from 'react-hot-toast';

const GROUPS = [
  { key: 'general',  label: 'General' },
  { key: 'homepage', label: 'Homepage Content' },
  { key: 'contact',  label: 'Contact Info' },
  { key: 'social',   label: 'Social Links' },
  { key: 'seo',      label: 'SEO Defaults' },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [form, setForm]         = useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [activeGroup, setActiveGroup] = useState('general');

  useEffect(() => {
    settingsApi.getAll()
      .then(data => {
        setSettings(data || []);
        const map = {};
        data.forEach(s => { map[s.key] = s.value; });
        setForm(map);
      })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const groupSettings = settings
        .filter(s => s.group === activeGroup)
        .map(s => ({ key: s.key, value: form[s.key], group: s.group, label: s.label, type: s.type }));
      await settingsApi.bulkUpsert(groupSettings);
      toast.success('Settings saved!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const groupSettings = settings.filter(s => s.group === activeGroup);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-white">Site Settings</h1>
        <p className="text-white/40 text-sm mt-1">Changes here update every page on the site.</p>
      </div>

      <div className="flex gap-8">
        {/* Group Tabs */}
        <div className="w-44 flex-shrink-0 space-y-1">
          {GROUPS.map(g => (
            <button key={g.key} onClick={() => setActiveGroup(g.key)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeGroup === g.key ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
              {g.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/></div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5 bg-white/[0.03] border border-white/5 rounded-2xl p-8">
              {groupSettings.map(setting => (
                <div key={setting.key}>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                    {setting.label}
                    <span className="ml-2 text-white/20 normal-case font-normal tracking-normal">{setting.key}</span>
                  </label>
                  {setting.type === 'textarea' ? (
                    <textarea rows={3} value={form[setting.key] || ''} onChange={e => setForm(f => ({ ...f, [setting.key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-all text-sm resize-y" />
                  ) : (
                    <input type={setting.type === 'url' ? 'url' : 'text'} value={form[setting.key] || ''} onChange={e => setForm(f => ({ ...f, [setting.key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-all text-sm" />
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-white/5">
                <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2">
                  {saving ? <><span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"/> Saving…</> : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
