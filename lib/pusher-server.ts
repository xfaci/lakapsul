import Pusher from 'pusher';

// Initialise le client Pusher côté serveur
export const pusherServer = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER || 'eu',
    useTLS: true,
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Notifier un utilisateur d'un nouveau message
 */
export async function notifyNewMessage(userId: string, message: {
    id: string;
    content: string;
    senderName: string;
    senderAvatar?: string;
}) {
    try {
        await pusherServer.trigger(`user-${userId}`, 'new-message', message);
    } catch (error) {
        console.error('Pusher notify message error:', error);
    }
}

/**
 * Notifier un provider d'une nouvelle réservation
 */
export async function notifyNewBooking(providerId: string, booking: {
    id: string;
    artistName: string;
    serviceName: string;
    date: string;
    amount: number;
}) {
    try {
        await pusherServer.trigger(`user-${providerId}`, 'new-booking', booking);
    } catch (error) {
        console.error('Pusher notify booking error:', error);
    }
}

/**
 * Notifier un artiste que sa réservation est confirmée
 */
export async function notifyBookingConfirmed(artistId: string, booking: {
    id: string;
    providerName: string;
    serviceName: string;
    date: string;
}) {
    try {
        await pusherServer.trigger(`user-${artistId}`, 'booking-confirmed', booking);
    } catch (error) {
        console.error('Pusher notify booking confirmed error:', error);
    }
}

/**
 * Notifier un utilisateur d'un nouvel avis reçu
 */
export async function notifyNewReview(userId: string, review: {
    id: string;
    authorName: string;
    rating: number;
    comment?: string;
}) {
    try {
        await pusherServer.trigger(`user-${userId}`, 'new-review', review);
    } catch (error) {
        console.error('Pusher notify review error:', error);
    }
}
