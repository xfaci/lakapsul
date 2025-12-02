export const statsService = {
  async getOverview(userId: string) {
    return { userId, activeProjects: 0, upcomingBookings: 0 };
  },
  async getCharts(userId: string) {
    return { userId, chartData: [] };
  }
};
