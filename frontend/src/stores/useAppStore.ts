import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ProjectCategory } from '@/schemas';

interface AppState {
    // Active category
    activeCategory: ProjectCategory | null;
    setActiveCategory: (category: ProjectCategory | null) => void;

    // Sidebar state
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;

    // Loading states
    isGlobalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;
}

/**
 * Global app store for UI state
 */
export const useAppStore = create<AppState>()(
    devtools(
        (set) => ({
            // Active category
            activeCategory: null,
            setActiveCategory: (category) => set({ activeCategory: category }),

            // Sidebar
            sidebarOpen: true,
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

            // Loading
            isGlobalLoading: false,
            setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
        }),
        { name: 'app-store' }
    )
);
