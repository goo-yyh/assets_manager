import { create } from 'zustand';

type LayoutState = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed }),
}));
