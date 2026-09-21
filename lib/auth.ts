import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET =
  process.env.JWT_SECRET || 'my-super-secret-key-for-school-app-1404';

export type TokenPayload = {
  userId: string;
  role: 'teacher' | 'parent';
  name: string;
};

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// استخراج توکن از هدر درخواست
export function getTokenFromRequest(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return verifyToken(token);
}