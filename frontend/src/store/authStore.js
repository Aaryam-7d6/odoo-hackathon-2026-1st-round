import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('traveloop_user') || 'null'),
  token: localStorage.getItem('traveloop_token') || null,
  isAuthenticated: !!localStorage.getItem('traveloop_token'),

  login: (user, token) => {
    localStorage.setItem('traveloop_token', token);
    localStorage.setItem('traveloop_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('traveloop_token');
    localStorage.removeItem('traveloop_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    localStorage.setItem('traveloop_user', JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
