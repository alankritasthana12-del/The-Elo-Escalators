import axios from 'axios';
import { mockMatches, mockSearchResults, mockDashboard, mockItemDetail } from './mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Helper: simulate network delay for mock responses
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
 * Falls back to mock data when backend is unavailable.
 */
const api = {
  async reportLost(formData) {
    try {
      const res = await client.post('/api/lost', formData, {
        headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      return res.data;
    } catch {
      await delay(800);
      return { success: true, id: 'mock-' + Date.now(), message: 'Item reported (demo mode)' };
    }
  },

  async reportFound(formData) {
    try {
      const res = await client.post('/api/found', formData, {
        headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      return res.data;
    } catch {
      await delay(1000);
      return { success: true, id: 'mock-' + Date.now(), message: 'Item reported (demo mode)' };
    }
  },

  async search(query) {
    try {
      const res = await client.post('/api/search', { query });
      return res.data;
    } catch {
      await delay(1200);
      return { results: mockSearchResults };
    }
  },

  async getMatches() {
    try {
      const res = await client.get('/api/matches');
      return res.data;
    } catch {
      await delay(800);
      return { matches: mockMatches };
    }
  },

  async getDashboard() {
    try {
      const res = await client.get('/api/dashboard');
      return res.data;
    } catch {
      await delay(600);
      return mockDashboard;
    }
  },

  async getItem(id) {
    try {
      const res = await client.get(`/api/items/${id}`);
      return res.data;
    } catch {
      await delay(500);
      // Return mock item, matching by id if possible
      const allItems = [...mockSearchResults];
      const found = allItems.find((item) => item.id === id);
      return found || { ...mockItemDetail, id };
    }
  },

  async claimItem(data) {
    try {
      const res = await client.post('/api/claim', data);
      return res.data;
    } catch {
      await delay(1500);
      return { success: true, claimId: 'CLM-' + Math.random().toString(36).substring(2, 8).toUpperCase() };
    }
  },
};

export default api;
