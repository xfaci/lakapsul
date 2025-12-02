export const notificationService = {
  async list(userId: string) {
    return { userId, notifications: [] };
  }
};
