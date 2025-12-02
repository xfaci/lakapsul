export const bookingService = {
  async create(payload: unknown) {
    return payload;
  },
  async listByUser(userId: string) {
    return { userId, bookings: [] };
  },
  async listIncoming(providerId: string) {
    return { providerId, bookings: [] };
  }
};
