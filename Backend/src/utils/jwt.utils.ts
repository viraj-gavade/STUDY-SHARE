import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'studyshare-secret-key';

export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Generate a JWT token for authentication
 * @param userId User ID to include in the token
 * @param email User email to include in the token
 * @returns JWT token string
 */
export const generateToken = (
  userId: Types.ObjectId | string,
  email: string
): string => {
  const payload: TokenPayload = {
    userId: userId.toString(),
    email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

/**
 * Verify and decode a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};
