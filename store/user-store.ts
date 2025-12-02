import { create } from 'zustand';
import { User } from '@/types';

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null, // Initial state: not logged in
    isAuthenticated: false,
    isLoading: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
    updateUser: (updates) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
        })),
}));
