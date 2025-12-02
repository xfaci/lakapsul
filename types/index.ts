export type UserRole = 'ARTIST' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
}

export interface Service {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: 'STUDIO' | 'MIXING' | 'MASTERING' | 'BEATMAKING' | 'VIDEO' | 'COACHING';
  imageUrl?: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  artistId: string;
  providerId: string;
  date: string; // ISO date string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  price: number;
}

export interface Review {
  id: string;
  bookingId: string;
  authorId: string;
  targetId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
