import { create } from "zustand";

const useBookingStore = create((set) => ({
  pickup: null,
  drop: null,
  setPickup: (pickup) => set({ pickup }),
  setDrop: (drop) => set({ drop }),
  resetBooking: () => set({ pickup: null, drop: null }),
}));

export default useBookingStore;
