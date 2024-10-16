import { create } from 'zustand';
import { Config } from '../types';

export type ConfigState = Config;

type Action = {
    updateShowConnectionBadge: (firstName: ConfigState['showConnectionBadge']) => void
    updateShowFilterButton: (lastName: ConfigState['showFilterButton']) => void
    updateShowDebugMessageInToast: (lastName: ConfigState['showDebugMessageInToast']) => void
}

// Create your store, which includes both state and (optionally) actions
export const useConfigStore = create<ConfigState & Action>((set) => ({
    showConnectionBadge: true,
    showDebugMessageInToast: false,
    showFilterButton: true,
    key: '',
    updateShowConnectionBadge: (item: boolean) => set(() => ({ showConnectionBadge: item })),
    updateShowFilterButton: (item: boolean) => set(() => ({ showFilterButton: item })),
    updateShowDebugMessageInToast: (item: boolean) => set(() => ({ showDebugMessageInToast: item })),
}));

