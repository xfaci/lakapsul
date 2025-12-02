export const validate = (schema) => async (request, reply) => {
    const result = schema.safeParse({
        body: request.body,
        query: request.query,
        params: request.params
    });
    if (!result.success) {
        reply.status(400).send({ message: 'Validation error', issues: result.error.flatten() });
    }
};
