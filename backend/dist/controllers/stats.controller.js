export const getStats = async (_request, reply) => {
    reply.send({
        activeProjects: 0,
        upcomingBookings: 0,
        spendThisMonth: 0,
        spendPrevMonth: 0,
        activity: []
    });
};
export const getCharts = async (_request, reply) => {
    reply.send({ chartData: [] });
};
