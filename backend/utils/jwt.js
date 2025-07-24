// TODO: utility functions
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Sign a JWT for the given payload.
 * Payload should include { id, role } for subadmins/employees
 * or { email, role } for admin.
 */
export const signToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};
