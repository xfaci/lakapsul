import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    _hasHydrated: boolean;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            _hasHydrated: false,
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => {
                // Also clear the token
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
                set({ user: null, isAuthenticated: false });
            },
            updateUser: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'lakapsul-user-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
