import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
   createUser,
   findUserByEmail,
   findUserById,
} from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
   throw new Error('JWT_SECRET is not defined in environment variables');
}

// Token: { userId: number, iat: number, exp: number }
const generateToken = (userId: number): string => {
   return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const registerService = async (
   email: string,
   password: string,
   name?: string
) => {
   const existingUser = await findUserByEmail(email);

   if (existingUser) {
      const error = new Error('User already exists');
      (error as any).status = 409; // Conflict
      throw error;
   }

   const hashedPassword = await bcrypt.hash(password, 10);
   const user = await createUser(email, hashedPassword, name);
   const token = generateToken(user.id);

   return {
      token,
      user: { id: user.id, email: user.email, name: user.name },
   };
};

export const loginService = async (email: string, password: string) => {
   const user = await findUserByEmail(email);

   if (!user) {
      const error = new Error('Invalid email or password');
      (error as any).status = 401; // Unauthorized
      throw error;
   }

   const isMatch = await bcrypt.compare(password, user.password);

   if (!isMatch) {
      const error = new Error('Invalid email or password');
      (error as any).status = 401;
      throw error;
   }

   const token = generateToken(user.id);

   return {
      token,
      user: { id: user.id, email: user.email, name: user.name },
   };
};

export const getCurrentUserService = async (userId: number) => {
   const user = await findUserById(userId);

   if (!user) {
      const error = new Error('User not found');
      (error as any).status = 404; // Not Found
      throw error;
   }

   return {
      id: user.id,
      email: user.email,
      name: user.name,
   };
};
