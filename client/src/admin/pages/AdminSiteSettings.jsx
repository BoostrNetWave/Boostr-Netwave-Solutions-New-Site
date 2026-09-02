import React, { useEffect, useState } from 'react';
import { settingsApi, uploadFile } from '../api/adminApi';
import toast from 'react-hot-toast';

const GROUPS = [
  { key: 'general',    label: 'General' },
  { key: 'homepage',   label: 'Homepage Content' },
  { key: 'leadership', label: 'Leadership Video' },
  { key: 'contact',    label: 'Contact Info' },
  { key: 'social',     label: 'Social Links' },
  { key: 'seo',        label: 'SEO Defaults' },
];

/**
 * Leadership video settings — not stored in the DB until first save,
 * so we define them as a local schema that gets upserted on save.
 */
const LEADERSHIP_VIDEO_FIELDS = [
  {
    key:   'leadershipVideoUrl',
    label: 'Leadership Section Video',
    group: 'leadership',
    type:  'video',
    hint:  'Upload an .mp4 or .webm file. Plays muted, looped, and only when scrolled into view.',
  },
  {
    key:   'leadershipVideoPoster',
    label: 'Video Poster / Fallback Image',
    group: 'leadership',
    type:  'image',
    hint:  'Shown before the video loads, and when no video is set. Upload a still frame or professional photo.',
  },
  {
    key:     'leadershipVideoCaption',
    label:   'Caption Line (bold)',
    group:   'leadership',
    type:    'text',
    default: "Founder's Address · 2026",
  },
  {
    key:     'leadershipVideoSubcaption',
    label:   'Sub-caption (smaller text)',
    group:   'leadership',
    type:    'text',
    default: 'Engineering Vision & Company Mission',
  },
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
        // Populate leadership defaults for fields not yet in the DB
        LEADERSHIP_VIDEO_FIELDS.forEach(f => {
          if (!(f.key in map)) map[f.key] = f.default || '';
        });
        setForm(map);
      })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeGroup === 'leadership') {
        // Leadership video settings are managed locally — upsert them directly
        await settingsApi.bulkUpsert(
          LEADERSHIP_VIDEO_FIELDS.map(f => ({
            key:   f.key,
            value: form[f.key] ?? f.default ?? '',
            group: 'leadership',
            label: f.label,
            type:  f.type === 'video' ? 'url' : f.type,
          }))
        );
      } else {
        const groupSettings = settings
          .filter(s => s.group === activeGroup)
          .map(s => ({ key: s.key, value: form[s.key], group: s.group, label: s.label, type: s.type }));
        await settingsApi.bulkUpsert(groupSettings);
      }
      toast.success('Settings saved!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const groupSettings = activeGroup === 'leadership'
    ? LEADERSHIP_VIDEO_FIELDS
    : settings.filter(s => s.group === activeGroup);

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
            <form onSubmit={handleSave} className="space-y-6 bg-white/[0.03] border border-white/5 rounded-2xl p-8">
              {groupSettings.map(setting => (
                <SettingField
                  key={setting.key}
                  setting={setting}
                  value={form[setting.key]}
                  onChange={val => setForm(f => ({ ...f, [setting.key]: val }))}
                />
              ))}
              {groupSettings.length === 0 && (
                <p className="text-white/30 text-sm text-center py-8">No settings in this group yet.</p>
              )}
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

// ─── Individual Setting Field ──────────────────────────────────────────────────
function SettingField({ setting, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const baseInput = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-all text-sm";

  const handleUpload = async (e, acceptVideo = false) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
      toast.success('Uploaded!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-1">
        {setting.label}
        <span className="ml-2 text-white/20 normal-case font-normal tracking-normal">{setting.key}</span>
      </label>
      {setting.hint && (
        <p className="text-white/30 text-xs mb-3">{setting.hint}</p>
      )}

      {/* VIDEO field — file picker + URL paste + preview */}
      {setting.type === 'video' && (
        <div className="space-y-3">
          {value && (
            <video
              src={value}
              className="w-full max-h-48 rounded-xl border border-white/10 object-contain bg-black"
              muted controls preload="metadata"
            />
          )}
          <div className="flex items-center gap-3">
            <label className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 flex-shrink-0">
              {uploading ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Uploading...</> : '🎬 Choose Video (.mp4 / .webm)'}
              <input
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={e => handleUpload(e, true)}
                disabled={uploading}
              />
            </label>
            <input
              type="url"
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              placeholder="Or paste a Cloudinary .mp4 URL"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500 transition-all outline-none"
            />
          </div>
          {value && (
            <button type="button" onClick={() => onChange('')}
              className="text-red-400/60 hover:text-red-400 text-xs transition-colors">
              ✕ Clear video
            </button>
          )}
        </div>
      )}

      {/* IMAGE field — file picker + URL paste + preview */}
      {setting.type === 'image' && (
        <div className="space-y-3">
          {value && (
            <div className="w-48 h-32 rounded-xl border border-white/10 overflow-hidden bg-white/5">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-center gap-3">
            <label className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 flex-shrink-0">
              {uploading ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Uploading...</> : '🖼 Choose Image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
            <input
              type="url"
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              placeholder="Or paste an image URL"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>
      )}

      {/* TEXTAREA */}
      {setting.type === 'textarea' && (
        <textarea rows={3} value={value || ''} onChange={e => onChange(e.target.value)}
          className={baseInput + ' resize-y'} />
      )}

      {/* TEXT / URL / default */}
      {(!setting.type || setting.type === 'text' || setting.type === 'url') && (
        <input
          type={setting.type === 'url' ? 'url' : 'text'}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className={baseInput}
        />
      )}
    </div>
  );
}
