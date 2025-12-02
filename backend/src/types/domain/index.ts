export type UserRole = 'ARTIST' | 'PROVIDER';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  createdAt?: string;
}

export interface Service {
  id: string;
  providerId: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  category?: string;
  createdAt?: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  artistId: string;
  providerId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  date: string;
  createdAt?: string;
}
