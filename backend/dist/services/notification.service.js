export const notificationService = {
    async list(userId) {
        return { userId, notifications: [] };
    }
};
