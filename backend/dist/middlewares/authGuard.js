export async function authGuard(request, reply) {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        reply.status(401).send({ message: 'Unauthorized' });
    }
}
