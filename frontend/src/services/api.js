import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_KEY = 'monitoring-secret-key-2026';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

export const api = {
  checkHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Monitors
  getMonitors: async (params = {}) => {
    const res = await apiClient.get('/api/v1/monitors', { params });
    return res.data;
  },

  getMonitor: async (id) => {
    const res = await apiClient.get(`/api/v1/monitors/${id}`);
    return res.data;
  },

  createMonitor: async (payload) => {
    const res = await apiClient.post('/api/v1/monitors', payload);
    return res.data;
  },

  updateMonitor: async (id, payload) => {
    const res = await apiClient.patch(`/api/v1/monitors/${id}`, payload);
    return res.data;
  },

  runCheckNow: async (monitorId) => {
    const res = await apiClient.post(`/api/v1/checks/run-now/${monitorId}`);
    return res.data;
  },

  // Incidents
  getIncidents: async (params = {}) => {
    const res = await apiClient.get('/api/v1/incidents', { params });
    return res.data;
  },

  triggerIncident: async (payload) => {
    const res = await apiClient.post('/api/v1/incidents/trigger', payload);
    return res.data;
  },

  updateIncident: async (id, payload) => {
    const res = await apiClient.patch(`/api/v1/incidents/${id}`, payload);
    return res.data;
  },

  // Alert Rules
  getAlertRules: async () => {
    const res = await apiClient.get('/api/v1/alert-rules');
    return res.data;
  },

  createAlertRule: async (payload) => {
    const res = await apiClient.post('/api/v1/alert-rules', payload);
    return res.data;
  },

  deleteAlertRule: async (id) => {
    const res = await apiClient.delete(`/api/v1/alert-rules/${id}`);
    return res.data;
  },

  // Analytics
  getAnalytics: async () => {
    const res = await apiClient.get('/api/v1/analytics/dashboard');
    return res.data;
  },
};

export default api;
