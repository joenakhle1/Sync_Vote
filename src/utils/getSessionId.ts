import { client } from './redis-client';

export async function getUserIdFromSession(sessionId: string): Promise<string | null> {
  try {
    const userId = await client.get(sessionId);
    return userId; // Returns null if not found
  } catch (err) {
    throw err; // Propagate the error if needed
  }
}
