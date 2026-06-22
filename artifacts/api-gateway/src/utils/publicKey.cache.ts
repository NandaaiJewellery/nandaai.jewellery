import fetch from 'node-fetch';

interface CacheEntry {
  key: string;
  expiresAt: number;
}

const TTL_MS = 5 * 60 * 1000;
let cache: CacheEntry | null = null;

export async function getPublicKey(): Promise<string> {
  const now = Date.now();
  if (cache && now < cache.expiresAt) {
    return cache.key;
  }

  const authServiceUrl = process.env.AUTH_SERVICE_URL;
  if (!authServiceUrl) throw new Error('AUTH_SERVICE_URL is not set');

  const response = await fetch(`${authServiceUrl}/auth/public-key`);
  if (!response.ok) {
    throw new Error(`Failed to fetch public key: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as { publicKey: string };
  if (!data.publicKey) throw new Error('Public key not found in auth service response');

  cache = { key: data.publicKey, expiresAt: now + TTL_MS };
  console.log('[api-gateway] Public key fetched and cached');
  return cache.key;
}
