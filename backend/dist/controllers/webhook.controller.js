export const stripeWebhook = async (_request, reply) => {
    reply.send({ received: true });
};
export const n8nWebhook = async (_request, reply) => {
    reply.send({ received: true });
};
