/**
 * Admin API client — all calls to the backend API from admin pages.
 * Automatically attaches credentials (JWT cookie) on every request.
 */

import toast from 'react-hot-toast';

// In dev: Vite proxies /api → localhost:5000 (no hardcode needed)
// In prod: VITE_API_URL must be set to the deployed backend URL (e.g. https://api.boostrnetwave.com)
const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

let isHandlingAuthError = false;

async function request(method, path, body) {
  const opts = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Intercept 401 Unauthorized for expired/missing session (only on admin pages)
    if (res.status === 401 && !isHandlingAuthError) {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
        isHandlingAuthError = true;
        toast.error('Your session has expired. Please log in again.');
        window.location.href = `/admin/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    throw new Error(json.message || 'Something went wrong');
  }
  return json.data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login:    (body)  => request('POST', '/auth/login', body),
  logout:   ()      => request('POST', '/auth/logout'),
  me:       ()      => request('GET',  '/auth/me'),
  register: (body)  => request('POST', '/auth/register', body),
};

// ── Generic CRUD factory ──────────────────────────────────────────────────────
const crud = (resource) => ({
  getAll:  ()        => request('GET',    `/${resource}`),
  getOne:  (id)      => request('GET',    `/${resource}/${id}`),
  create:  (body)    => request('POST',   `/${resource}`, body),
  update:  (id, body)=> request('PATCH',  `/${resource}/${id}`, body),
  remove:  (id)      => request('DELETE', `/${resource}/${id}`),
});

export const servicesApi       = crud('services');
export const productsApi       = crud('products');
export const clientProjectsApi = crud('client-projects');
// Blog — override getAll to use the admin-only endpoint (includes drafts, no pagination)
export const blogApi = {
  ...crud('blog'),
  getAll: () => request('GET', '/blog/admin/all'),
};

// Careers — override getAll to use the admin-only endpoint
export const careersApi = {
  ...crud('careers'),
  getAll: () => request('GET', '/careers/admin/all'),
};

export const testimonialsApi   = crud('testimonials');
export const galleryApi        = crud('gallery');
export const teamApi           = crud('team');
export const applicationsApi   = crud('applications');

// ── Contact Leads ─────────────────────────────────────────────────────────────
export const contactApi = {
  getAll:       (status) => request('GET', `/contact${status ? `?status=${status}` : ''}`),
  updateStatus: (id, status) => request('PATCH', `/contact/${id}`, { status }),
};

// ── Site Settings ─────────────────────────────────────────────────────────────
export const settingsApi = {
  getAll:     ()       => request('GET', '/settings/admin'),
  bulkUpsert: (settings) => request('PUT', '/settings/bulk', { settings }),
  upsert:     (key, value) => request('PUT', `/settings/${key}`, { value }),
};

// ── Dashboard counts ──────────────────────────────────────────────────────────
export const dashboardApi = {
  getCounts: () => request('GET', '/health'), // extend later with a real dashboard endpoint
};

// ── Upload ────────────────────────────────────────────────────────────────────
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData, // fetch will automatically set the correct content-type with boundary
  });
  
  let json = {};
  const text = await res.text();
  try {
    if (text) {
      json = JSON.parse(text);
    }
  } catch (e) {
    throw new Error(`Upload failed (${res.status}): Server returned non-JSON response.`);
  }

  if (!res.ok) throw new Error(json.message || 'Upload failed');
  return json.data?.url;
};
