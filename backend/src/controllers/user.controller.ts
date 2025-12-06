import { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from '../services/user.service';
import { z } from 'zod';

const updateProfileSchema = z.object({
  displayName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  coverUrl: z.string().url().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export const listProviders = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = request.query as {
    skills?: string;
    location?: string;
    search?: string;
    limit?: string;
    offset?: string;
  };

  const params = {
    skills: query.skills?.split(','),
    location: query.location,
    search: query.search,
    limit: query.limit ? parseInt(query.limit) : 20,
    offset: query.offset ? parseInt(query.offset) : 0,
  };

  const result = await userService.listProviders(params);
  reply.send(result);
};

export const getProviderById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  try {
    const provider = await userService.getProviderById(id);
    reply.send(provider);
  } catch (error: any) {
    if (error.message === 'PROVIDER_NOT_FOUND') {
      return reply.status(404).send({ error: 'Prestataire non trouvé' });
    }
    throw error;
  }
};

export const getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  const { username } = request.params as { username: string };

  const profile = await userService.getByUsername(username);
  if (!profile) {
    return reply.status(404).send({ error: 'Profil non trouvé' });
  }

  reply.send(profile);
};

export const updateProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    const { userId } = request.user as { userId: string };
    const body = updateProfileSchema.parse(request.body);

    const profile = await userService.updateProfile(userId, body);
    reply.send({ success: true, profile });
  } catch {
    reply.status(401).send({ error: 'Non authentifié' });
  }
};
