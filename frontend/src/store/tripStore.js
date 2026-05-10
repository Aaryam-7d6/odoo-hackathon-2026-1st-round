import { create } from 'zustand';

const useTripStore = create((set, get) => ({
  trips: [],
  currentTrip: null,
  loading: false,
  error: null,

  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clearCurrentTrip: () => set({ currentTrip: null }),

  addTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips] })),

  updateTripInList: (updatedTrip) => set((state) => ({
    trips: state.trips.map((t) => t.id === updatedTrip.id ? updatedTrip : t),
    currentTrip: state.currentTrip?.id === updatedTrip.id ? updatedTrip : state.currentTrip,
  })),

  removeTrip: (tripId) => set((state) => ({
    trips: state.trips.filter((t) => t.id !== tripId),
    currentTrip: state.currentTrip?.id === tripId ? null : state.currentTrip,
  })),
}));

export default useTripStore;
