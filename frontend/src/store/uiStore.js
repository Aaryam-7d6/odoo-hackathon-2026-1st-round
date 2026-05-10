import { create } from 'zustand';

const useUIStore = create((set) => ({
  sidebarOpen: false,
  mobileNavOpen: false,
  activeModal: null,
  modalData: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),

  openModal: (modalName, data = null) => set({ activeModal: modalName, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));

export default useUIStore;
