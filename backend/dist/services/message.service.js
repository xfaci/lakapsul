export const messageService = {
    async list(conversationId) {
        return { conversationId, messages: [] };
    },
    async create(payload) {
        return payload;
    }
};
