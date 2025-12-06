import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { UserRole } from '@prisma/client';

export interface SignupPayload {
  email: string;
  password: string;
  username: string;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async signup(payload: SignupPayload) {
    const { email, password, username, role = 'ARTIST' } = payload;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('USER_EXISTS');
    }

    // Check if username is taken
    const existingProfile = await prisma.profile.findUnique({ where: { username } });
    if (existingProfile) {
      throw new Error('USERNAME_TAKEN');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        profile: {
          create: {
            username,
            displayName: username,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };
  },

  async login(payload: LoginPayload) {
    const { email, password } = payload;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };
  },

  async getById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    return user;
  },
};
