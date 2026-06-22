import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
}

function getPrivateKey(): string {
  const base64Key = process.env.JWT_PRIVATE_KEY_BASE64;
  if (!base64Key) throw new Error('JWT_PRIVATE_KEY_BASE64 is not set');
  return Buffer.from(base64Key, 'base64').toString('utf-8');
}

export function getPublicKey(): string {
  const base64Key = process.env.JWT_PUBLIC_KEY_BASE64;
  if (!base64Key) throw new Error('JWT_PUBLIC_KEY_BASE64 is not set');
  return Buffer.from(base64Key, 'base64').toString('utf-8');
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getPrivateKey(), {
    algorithm: 'RS256',
    expiresIn: '15m',
  });
}
