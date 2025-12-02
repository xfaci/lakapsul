export const serviceService = {
    async create(payload) {
        return payload;
    },
    async listByUser(userId) {
        return { userId, services: [] };
    }
};
