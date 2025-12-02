import Airtable from 'airtable';
import { env } from './env';
Airtable.configure({ apiKey: env.AIRTABLE_API_KEY });
export const airtableBase = new Airtable({ apiKey: env.AIRTABLE_API_KEY }).base(env.AIRTABLE_BASE_ID);
export const getTable = (name) => airtableBase(name);
