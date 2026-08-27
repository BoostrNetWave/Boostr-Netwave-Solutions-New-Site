/**
 * Centralized API base URL
 *
 * In development: uses Vite's proxy (relative /api → localhost:5000).
 * In production: uses the deployed backend URL from the VITE_API_URL env var.
 *
 * Set VITE_API_URL in client/.env.production:
 *   VITE_API_URL=https://api.boostrnetwave.com
 *
 * NEVER hardcode localhost URLs in components. Always import from here.
 */
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export default API_BASE;
