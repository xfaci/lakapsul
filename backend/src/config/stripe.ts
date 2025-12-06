import Stripe from 'stripe';
import { env } from './env';

// Only initialize Stripe if secret key is provided
export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' })
  : null;

export const applicationFeePercentage = {
  min: 5,
  max: 15
};
