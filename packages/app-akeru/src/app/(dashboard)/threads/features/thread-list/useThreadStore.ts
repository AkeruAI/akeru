import { create } from "zustand";

interface ThreadState {
  activeId: string;
  setActiveId: (id: string) => void;
}

export const useThreadStore = create<ThreadState>((set) => ({
  activeId: "",
  setActiveId: (id: string) => set({ activeId: id }),
}));
