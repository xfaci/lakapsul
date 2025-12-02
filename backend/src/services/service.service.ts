export const serviceService = {
  async create(payload: unknown) {
    return payload;
  },
  async listByUser(userId: string) {
    return { userId, services: [] };
  }
};
