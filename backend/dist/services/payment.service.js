export const paymentService = {
    async createIntent(payload) {
        return payload;
    },
    async createConnectOnboarding(providerId) {
        return { providerId, url: '' };
    }
};
