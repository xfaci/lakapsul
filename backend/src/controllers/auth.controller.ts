import { FastifyReply, FastifyRequest } from 'fastify';
import { authService } from '../services/auth.service';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(30),
  role: z.enum(['ARTIST', 'PROVIDER']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signup = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = signupSchema.parse(request.body);
    const user = await authService.signup(body);

    const token = await reply.jwtSign({ userId: user.id, role: user.role });

    reply.send({
      success: true,
      user,
      token,
    });
  } catch (error: any) {
    if (error.message === 'USER_EXISTS') {
      return reply.status(400).send({ error: 'Cet email est déjà utilisé' });
    }
    if (error.message === 'USERNAME_TAKEN') {
      return reply.status(400).send({ error: 'Ce nom d\'utilisateur est déjà pris' });
    }
    throw error;
  }
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = loginSchema.parse(request.body);
    const user = await authService.login(body);

    const token = await reply.jwtSign({ userId: user.id, role: user.role });

    reply.send({
      success: true,
      user,
      token,
    });
  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return reply.status(401).send({ error: 'Email ou mot de passe incorrect' });
    }
    throw error;
  }
};

export const refreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    const { userId, role } = request.user as { userId: string; role: string };

    const user = await authService.getById(userId);
    if (!user) {
      return reply.status(401).send({ error: 'Utilisateur non trouvé' });
    }

    const token = await reply.jwtSign({ userId, role });
    reply.send({ success: true, token });
  } catch {
    reply.status(401).send({ error: 'Token invalide' });
  }
};

export const getMe = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    const { userId } = request.user as { userId: string };

    const user = await authService.getById(userId);
    if (!user) {
      return reply.status(404).send({ error: 'Utilisateur non trouvé' });
    }

    const { password: _, ...safeUser } = user;
    reply.send({ user: safeUser });
  } catch {
    reply.status(401).send({ error: 'Non authentifié' });
  }
};

export const oauthGoogle = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'OAuth Google - À implémenter avec Supabase Auth' });
};

export const oauthApple = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: 'OAuth Apple - À implémenter avec Supabase Auth' });
};
