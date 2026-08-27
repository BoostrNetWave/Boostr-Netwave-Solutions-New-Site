import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { uploadFile } from '../api/adminApi';

/**
 * Universal Content Editor
 * 
 * Driven by a `schema` config object — no hand-building 12 separate screens.
 * 
 * @param {Object} schema - { title, fields: [{ key, label, type, required }] }
 * @param {Object} api    - { getAll, create, update, remove }
 * @param {Function} renderRow - optional custom row renderer
 */
export default function ContentEditor({ schema, api, renderRow, extraActions }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);   // null | 'new' | { ...item }
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [search, setSearch]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAll();
      setItems(Array.isArray(data) ? data : data?.posts || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    const defaults = {};
    schema.fields.forEach(f => { defaults[f.key] = f.default ?? ''; });
    setForm(defaults);
    setEditing('new');
  };

  const openEdit = (item) => {
    setForm({ ...item });
    setEditing(item);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === 'new') {
        await api.create(form);
        toast.success(`${schema.title} created!`);
      } else {
        await api.update(editing._id, form);
        toast.success(`${schema.title} updated!`);
      }
      setEditing(null);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item[schema.titleKey || 'title']}"? This cannot be undone.`)) return;
    try {
      await api.remove(item._id);
      toast.success('Deleted.');
      await load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = items.filter(item =>
    !search || JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  // ── Form ──────────────────────────────────────────────────────────────────
  if (editing !== null) {
    return (
      <div className="space-y-8 max-w-3xl">
        <div className="flex items-center gap-4">
          <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white transition-colors text-sm flex items-center gap-2">
            ← Back
          </button>
          <h1 className="text-2xl font-black text-white">
            {editing === 'new' ? `New ${schema.title}` : `Edit ${schema.title}`}
          </h1>
        </div>

        <form onSubmit={handleSave} className="space-y-5 bg-white/[0.03] border border-white/5 rounded-2xl p-8">
          {schema.fields.map(field => (
            <FormField key={field.key} field={field} value={form[field.key]} onChange={val => setForm(f => ({ ...f, [field.key]: val }))} />
          ))}
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2">
              {saving ? <><span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"/> Saving…</> : 'Save'}
            </button>
            {schema.previewPath && editing !== 'new' && editing.slug && (
              <a href={`${schema.previewPath(editing)}?preview=1`} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/30 transition-all flex items-center gap-2">
                Preview <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
              </a>
            )}
            <button type="button" onClick={() => setEditing(null)} className="text-white/40 hover:text-white px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ── List ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">{schema.pluralTitle || `${schema.title}s`}</h1>
          <p className="text-white/40 text-sm mt-1">{items.length} total</p>
        </div>
        <button onClick={openNew} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0">
          + Add {schema.title}
        </button>
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder={`Search ${schema.pluralTitle || `${schema.title}s`}…`}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-xs bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500 transition-all"
      />

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/></div>
      ) : filtered.length === 0 ? (
        <div className="border border-white/5 rounded-2xl p-16 text-center text-white/30 text-sm">
          {search ? 'No results found.' : `No ${schema.pluralTitle || `${schema.title}s`} yet. Add one above.`}
        </div>
      ) : (
        <div className="border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {schema.columns.map(col => (
                  <th key={col.key} className="text-left px-6 py-3 text-white/30 font-bold text-xs uppercase tracking-widest">{col.label}</th>
                ))}
                <th className="px-6 py-3 text-white/30 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  {schema.columns.map(col => (
                    <td key={col.key} className="px-6 py-4 text-white/70">
                      {renderRow ? renderRow(col.key, item) : renderCellValue(col, item)}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {extraActions?.(item)}
                      <button onClick={() => openEdit(item)} className="text-white/40 hover:text-white text-xs border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all">Edit</button>
                      <button onClick={() => handleDelete(item)} className="text-red-400/60 hover:text-red-400 text-xs border border-red-500/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-all">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Field renderer ───────────────────────────────────────────────────────────
function FormField({ field, value, onChange }) {
  const base = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm";
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      // Upload through our secure backend API
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
        {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {field.type === 'textarea' && (
        <textarea rows={4} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} required={field.required} className={base + ' resize-y'} />
      )}
      {field.type === 'select' && (
        <select value={value || ''} onChange={e => onChange(e.target.value)} required={field.required} className={base}>
          <option value="">Select…</option>
          {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      )}
      {field.type === 'toggle' && (
        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`relative w-10 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-white/10'}`} onClick={() => onChange(!value)}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-1'}`}/>
          </div>
          <span className="text-sm text-white/60">{value ? (field.onLabel || 'On') : (field.offLabel || 'Off')}</span>
        </label>
      )}
      {field.type === 'number' && (
        <input type="number" value={value || ''} onChange={e => onChange(Number(e.target.value))} required={field.required} className={base} />
      )}
      {field.type === 'image' && (
        <div className="space-y-3">
          {value && (
            <div className="w-32 h-32 rounded-xl border border-white/10 overflow-hidden bg-white/5">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-center gap-3">
            <label className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2">
              {uploading ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Uploading...</> : 'Choose File'}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
            <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Or paste image URL" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500 transition-all outline-none" />
          </div>
        </div>
      )}
      {(!field.type || field.type === 'text' || field.type === 'url' || field.type === 'email') && (
        <input type={field.type || 'text'} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} required={field.required} className={base} />
      )}
    </div>
  );
}

function renderCellValue(col, item) {
  const val = item[col.key];
  if (col.type === 'toggle' || col.type === 'boolean') {
    return <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide ${val ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{val ? 'Yes' : 'No'}</span>;
  }
  if (col.type === 'status') {
    const colors = { live: 'bg-green-500/20 text-green-400', beta: 'bg-amber-500/20 text-amber-400', 'coming-soon': 'bg-white/10 text-white/40', new: 'bg-blue-500/20 text-blue-400', read: 'bg-white/10 text-white/40', replied: 'bg-green-500/20 text-green-400' };
    return <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide ${colors[val] || 'bg-white/10 text-white/40'}`}>{val}</span>;
  }
  if (col.type === 'date') return val ? new Date(val).toLocaleDateString('en-IN') : '—';
  if (col.truncate) return val ? String(val).substring(0, 60) + (val.length > 60 ? '…' : '') : '—';
  return val || '—';
}
