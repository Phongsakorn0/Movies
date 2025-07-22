import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export function verifyToken(request: NextRequest): { isValid: boolean; user?: JWTPayload; error?: string } {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return { isValid: false, error: 'No token provided' };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return { isValid: true, user: decoded };
  } catch (error) {
    return { isValid: false, error: 'Invalid token' };
  }
}
