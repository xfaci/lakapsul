"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";

/**
 * AuthSync Component
 * 
 * This component handles synchronization of authentication state after OAuth callback.
 * It checks for a temporary auth cookie set by the server and updates the client-side store.
 */
export function AuthSync() {
    const login = useUserStore((state) => state.login);
    const isAuthenticated = useUserStore((state) => state.isAuthenticated);
    const _hasHydrated = useUserStore((state) => state._hasHydrated);

    useEffect(() => {
        // Wait for hydration to complete
        if (!_hasHydrated) return;

        // Check for auth data in cookie (set by OAuth callback)
        async function syncAuthFromCookie() {
            try {
                const cookies = document.cookie.split(';');
                const authCookie = cookies.find(c => c.trim().startsWith('lakapsul-auth='));

                if (authCookie) {
                    const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));

                    if (authData.token) {
                        localStorage.setItem('token', authData.token);
                    }

                    if (authData.user && !isAuthenticated) {
                        login({
                            id: authData.user.id,
                            email: authData.user.email,
                            name: authData.user.name,
                            role: authData.user.role,
                        });
                    }

                    // Clear the cookie after reading
                    document.cookie = 'lakapsul-auth=; path=/; max-age=0';
                }
            } catch (error) {
                console.error('Error syncing auth from cookie:', error);
            }
        }

        syncAuthFromCookie();
    }, [_hasHydrated, isAuthenticated, login]);

    // Verify token validity on mount
    useEffect(() => {
        if (!_hasHydrated) return;

        async function verifyToken() {
            const token = localStorage.getItem('token');
            if (!token && isAuthenticated) {
                // Token missing but store says authenticated - clear state
                useUserStore.getState().logout();
                return;
            }

            if (token && isAuthenticated) {
                // Optionally verify token with server
                try {
                    const res = await fetch('/api/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!res.ok) {
                        // Token invalid - clear state
                        useUserStore.getState().logout();
                    }
                } catch {
                    // Network error - don't logout, just continue
                }
            }
        }

        verifyToken();
    }, [_hasHydrated, isAuthenticated]);

    return null;
}
