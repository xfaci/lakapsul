import Airtable from 'airtable';
import { env } from './env';

Airtable.configure({ apiKey: env.AIRTABLE_API_KEY });

export const airtableBase = new Airtable({ apiKey: env.AIRTABLE_API_KEY }).base(env.AIRTABLE_BASE_ID);

export type AirtableTable = ReturnType<typeof airtableBase>;

export const getTable = (name: string) => airtableBase(name);
