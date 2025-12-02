import { env } from './env';

type N8nWebhook = 'booking' | 'payment' | 'notification' | 'moderation' | 'recommendation';

const defaultPaths: Record<N8nWebhook, string> = {
  booking: '/webhooks/n8n/booking',
  payment: '/webhooks/n8n/payment',
  notification: '/webhooks/n8n/notification',
  moderation: '/webhooks/n8n/moderation',
  recommendation: '/webhooks/n8n/recommendation'
};

export const n8nConfig = {
  baseUrl: env.N8N_BASE_URL,
  secret: env.N8N_WEBHOOK_SECRET,
  webhookPath: (type: N8nWebhook) => `${defaultPaths[type]}`
};
