import clientPromise from './mongodb';
import type { Db } from 'mongodb';

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB!);
}

export default getDb;
