export const messageService = {
  async list(conversationId?: string) {
    return { conversationId, messages: [] };
  },
  async create(payload: unknown) {
    return payload;
  }
};
