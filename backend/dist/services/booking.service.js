export const bookingService = {
    async create(payload) {
        return payload;
    },
    async listByUser(userId) {
        return { userId, bookings: [] };
    },
    async listIncoming(providerId) {
        return { providerId, bookings: [] };
    }
};
