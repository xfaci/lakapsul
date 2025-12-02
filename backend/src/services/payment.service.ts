export const paymentService = {
  async createIntent(payload: unknown) {
    return payload;
  },
  async createConnectOnboarding(providerId: string) {
    return { providerId, url: '' };
  }
};
