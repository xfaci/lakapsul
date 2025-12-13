'use client';

import { useEffect, useCallback } from 'react';
import Pusher from 'pusher-js';
import { useUserStore } from '@/store/user-store';
import { toast } from 'sonner';

let pusherClient: Pusher | null = null;

export function usePusher() {
    const { user, isAuthenticated } = useUserStore();

    const initializePusher = useCallback(() => {
        if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
            console.warn('Pusher key not configured');
            return null;
        }

        if (!pusherClient) {
            pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
            });
        }

        return pusherClient;
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        const client = initializePusher();
        if (!client) return;

        // Subscribe to user's personal channel
        const channel = client.subscribe(`user-${user.id}`);

        // Listen for new messages
        channel.bind('new-message', (data: { content: string; senderName: string }) => {
            toast.info(`💬 ${data.senderName}`, {
                description: data.content.substring(0, 60) + (data.content.length > 60 ? '...' : ''),
                action: {
                    label: 'Voir',
                    onClick: () => window.location.href = '/messages',
                },
            });
        });

        // Listen for new bookings (providers only)
        channel.bind('new-booking', (data: { artistName: string; serviceName: string }) => {
            toast.success(`📅 Nouvelle réservation`, {
                description: `${data.artistName} pour ${data.serviceName}`,
                action: {
                    label: 'Voir',
                    onClick: () => window.location.href = '/provider/bookings',
                },
            });
        });

        // Listen for booking confirmations (artists)
        channel.bind('booking-confirmed', (data: { providerName: string; serviceName: string }) => {
            toast.success(`✅ Réservation confirmée`, {
                description: `${data.serviceName} avec ${data.providerName}`,
                action: {
                    label: 'Voir',
                    onClick: () => window.location.href = '/dashboard',
                },
            });
        });

        // Listen for new reviews
        channel.bind('new-review', (data: { authorName: string; rating: number }) => {
            toast.success(`⭐ Nouvel avis`, {
                description: `${data.authorName} t'a donné ${data.rating}/5`,
            });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [isAuthenticated, user?.id, initializePusher]);
}
