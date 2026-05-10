import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('traveloop_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('traveloop_token');
      localStorage.removeItem('traveloop_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const tripsApi = {
  list: (params) => api.get('/trips', { params }),
  create: (data) => api.post('/trips', data),
  get: (id) => api.get(`/trips/${id}`),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
  share: (id) => api.get(`/trips/${id}/share`),
  getShared: (token) => api.get(`/trips/share/${token}`),
  listStops: (tripId) => api.get(`/trips/${tripId}/stops`),
  addStop: (tripId, data) => api.post(`/trips/${tripId}/stops`, data),
  updateStop: (stopId, data) => api.put(`/stops/${stopId}`, data),
  deleteStop: (stopId) => api.delete(`/stops/${stopId}`),
  reorderStops: (data) => api.patch('/stops/reorder', data),
};

export const citiesApi = {
  list: (params) => api.get('/cities', { params }),
  get: (id) => api.get(`/cities/${id}`),
  getActivities: (id) => api.get(`/cities/${id}/activities`),
};

export const activitiesApi = {
  list: (params) => api.get('/activities', { params }),
  addToStop: (stopId, data) => api.post(`/stops/${stopId}/activities`, data),
  remove: (id) => api.delete(`/stop-activities/${id}`),
};

export const budgetApi = {
  get: (tripId) => api.get(`/trips/${tripId}/budget`),
  update: (tripId, data) => api.put(`/trips/${tripId}/budget`, data),
  listExpenses: (tripId) => api.get(`/trips/${tripId}/expenses`),
  addExpense: (tripId, data) => api.post(`/trips/${tripId}/expenses`, data),
};

export const packingApi = {
  list: (tripId) => api.get(`/trips/${tripId}/packing`),
  add: (tripId, data) => api.post(`/trips/${tripId}/packing`, data),
  toggle: (id, data) => api.patch(`/packing/${id}`, data),
  delete: (id) => api.delete(`/packing/${id}`),
};

export const notesApi = {
  list: (tripId) => api.get(`/trips/${tripId}/notes`),
  create: (tripId, data) => api.post(`/trips/${tripId}/notes`, data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

export const usersApi = {
  updateProfile: (data) => api.put('/users/me', data),
};

export default api;
