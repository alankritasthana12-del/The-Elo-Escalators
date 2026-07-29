import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});



// Helper: check if backend is reachable (cached per session)
let backendAvailable = null;
async function isBackendAvailable() {
  if (backendAvailable !== null) return backendAvailable;
  try {
    await client.get('/api/dashboard', { timeout: 3000 });
    backendAvailable = true;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

/**
 * API service — all backend communication is centralised here.
 */
const api = {
  async reportLost(formData) {
    const res = await client.post('/api/lost', formData, {
      headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data;
  },

  async reportFound(formData) {
    const res = await client.post('/api/found', formData, {
      headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data;
  },

  async search(query) {
    const res = await client.post('/api/search', { query });
    return res.data;
  },

  async getMatches() {
    const res = await client.get('/api/matches');
    return res.data;
  },

  async getDashboard() {
    const res = await client.get('/api/dashboard');
    return res.data;
  },

  async getItem(id) {
    const res = await client.get(`/api/items/${id}`);
    return res.data;
  },

  async claimItem(data) {
    const res = await client.post('/api/claim', data);
    return res.data;
  },
};

export default api;
