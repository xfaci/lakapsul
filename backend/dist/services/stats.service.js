export const statsService = {
    async getOverview(userId) {
        return { userId, activeProjects: 0, upcomingBookings: 0 };
    },
    async getCharts(userId) {
        return { userId, chartData: [] };
    }
};
