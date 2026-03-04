import { create } from 'zustand';

type ToastState = {
  message: string;
  visible: boolean;
  show: (message: string) => void;
  hide: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  visible: false,
  show: (message) => set({ message, visible: true }),
  hide: () => set({ visible: false }),
}));
