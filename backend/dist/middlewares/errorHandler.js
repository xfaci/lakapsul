export const errorHandler = (error, _req, reply) => {
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
        statusCode,
        error: error.name,
        message: error.message || 'Internal server error'
    });
};
