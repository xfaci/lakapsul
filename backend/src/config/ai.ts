import OpenAI from 'openai';
import { env } from './env';

export const openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const aiModels = {
  chat: 'gpt-4.1-mini',
  recommend: 'gpt-4.1-mini',
  creativePath: 'gpt-4.1'
};
